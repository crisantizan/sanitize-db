const steps = document.getElementsByClassName('step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const stepLabel = document.getElementById('stepLabel');
const backdrop = document.getElementById('backdrop');

let activeIndexStep = 0;
/** filename returned by backed [step 2] */
let backendFilename = null;
/** file columns [step 2] */
let fileColumns = null;

/** update step label */
function updateLabel(step) {
  stepLabel.textContent = step;
}

/** show/hide backdrop */
function toggleBackdrop() {
  backdrop.classList.toggle('show');
}

/** update view */
function changeView(index, mode = 'increase') {
  const old = steps.item(mode === 'increase' ? index - 1 : index + 1);
  const active = steps.item(index);

  old.classList.remove('active');
  active.classList.add('active');
}

/** set next active step */
function nextStep() {
  if (activeIndexStep === 3) return;
  activeIndexStep += 1;

  changeView(activeIndexStep);
  updateLabel(activeIndexStep + 1);
}

/** set prev active step */
function prevStep() {
  if (activeIndexStep === 0) return;
  activeIndexStep -= 1;

  changeView(activeIndexStep, 'decrease');
  updateLabel(activeIndexStep + 1);
}

/** ------------------- STEP 1 ----------------------- */

function step1() {
  const uploader = document.getElementById('uploader');
  const form = document.getElementById('formStep1');
  let fileSelected = null;
  let disabled = true;

  uploader.addEventListener('change', e => {
    const { target } = e;
    const submitBtn = form.lastChild;

    if (!target.files.length) {
      if (!disabled) {
        disabled = true;
        submitBtn.classList.add('disabled');
      }
      return;
    }

    fileSelected = target.files[0];

    // only .txt files
    if (fileSelected.type !== 'text/plain') {
      window.alert('Solo archivos planos [.txt]');

      if (!disabled) {
        disabled = true;
        submitBtn.classList.add('disabled');
      }

      return (target.value = null);
    }

    // enable submit button and remove disabled class
    disabled = false;
    submitBtn.classList.remove('disabled');
  });

  // try execute request
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (disabled || !fileSelected) return;

    const body = new FormData();
    body.append('file', fileSelected);

    try {
      toggleBackdrop();
      const result = await fetch('/upload-file', { method: 'POST', body });

      if (!result.ok) {
        throw await result.json();
      }

      const { response } = await result.json();

      backendFilename = response.filename;

      // go to step 2
      nextStep();
      toggleBackdrop();
    } catch (error) {
      toggleBackdrop();
      console.error(error);
      alert(error.response);
    }
  });
}

/** ------------------- STEP 2 ----------------------- */

function step2() {
  const form = document.getElementById('formStep2');
  const input = document.getElementById('keyword');
  const submitBtn = form.lastChild;

  let keyword = '';
  let disabled = true;

  input.addEventListener('input', ({ target }) => {
    keyword = target.value || '';

    disabled = !keyword.length;

    if (disabled) {
      submitBtn.classList.add('disabled');
    } else {
      submitBtn.classList.remove('disabled');
    }
  });

  // try execute request
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (disabled || !backendFilename) return;

    const body = { filename: backendFilename, keyword };

    try {
      toggleBackdrop();
      const result = await fetch('/analyze-file', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!result.ok) {
        throw await result.json();
      }

      // { columns: number }
      const { response } = await result.json();
      fileColumns = response.columns;

      // go to next step
      nextStep();
      toggleBackdrop();
    } catch (error) {
      toggleBackdrop();
      console.error(error);
      alert(error.response);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  stepLabel.textContent = activeIndexStep + 1;

  step1();
  step2();
});
