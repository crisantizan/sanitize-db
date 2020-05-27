const steps = document.getElementsByClassName('step');
const stepLabel = document.getElementById('stepLabel');
const backdrop = document.getElementById('backdrop');
const columnsNumberSpan = document.getElementById('columnsNumberSpan');

let activeIndexStep = 0;
/** filename returned by backed [step 2] */
let backendFilename = null;
/** keyword selected */
let keyword = null;
/** file columns [step 2] */
let fileColumnsNumber = null;
/** json filename [step 3] */
let jsonFile = null;

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

document.addEventListener('DOMContentLoaded', () => {
  stepLabel.textContent = activeIndexStep + 1;
});
