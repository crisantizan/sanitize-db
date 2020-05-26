const steps = document.getElementsByClassName('step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const stepLabel = document.getElementById('stepLabel');

let activeIndexStep = 0;

/** update step label */
function updateLabel(step) {
  stepLabel.textContent = step;
}

/** update view */
function changeView(index, mode = 'increase') {
  const old = steps.item(mode === 'increase' ? index - 1 : index + 1);
  const active = steps.item(index);

  console.log({ old, active });

  old.classList.remove('active');
  active.classList.add('active');
}

/** set next active step */
nextBtn.addEventListener('click', e => {
  if (activeIndexStep === 3) return;
  activeIndexStep += 1;

  changeView(activeIndexStep);
  updateLabel(activeIndexStep + 1);
});

/** set prev active step */
prevBtn.addEventListener('click', e => {
  if (activeIndexStep === 0) return;
  activeIndexStep -= 1;

  changeView(activeIndexStep, 'decrease');
  updateLabel(activeIndexStep + 1);
});

/** ------------------- STEP 1 ----------------------- */

function step1() {
  const uploader = document.getElementById('uploader');
  const form = document.getElementById('formStep1');
  let disabled = true;

  uploader.addEventListener('change', e => {
    const { target } = e;

    if (!target.files.length) return;

    // only .txt files
    if (target.type !== 'text/plain') {
      window.alert('Solo archivos planos [.txt]');
      return (target.value = null);
    }

    const file = target.files[0];

    console.log({ file });
  });

  form.addEventListener('submit', e => {
    if (disabled) {
      return e.preventDefault();
    };
  });
}

document.addEventListener('DOMContentLoaded', function(event) {
  stepLabel.textContent = activeIndexStep + 1;

  step1();
});
