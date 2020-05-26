const steps = document.getElementsByClassName('step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const stepLabel = document.getElementById('stepLabel');
const backdrop = document.getElementById('backdrop');

let activeIndexStep = 0;
/** filename returned by backed */
let backendFilename = null;

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
      const { response } = await result.json();

      backendFilename = response.filename;

      // go to step 2
      nextStep();
    } catch (error) {
      console.error(error);
    } finally {
      toggleBackdrop();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  stepLabel.textContent = activeIndexStep + 1;

  step1();
});
