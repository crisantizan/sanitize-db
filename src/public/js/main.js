const steps = document.getElementsByClassName('step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const stepLabel = document.getElementById('stepLabel');

let activeIndexStep = 0;

/** read file to upload */
function readURL({ target }) {
  if (!target.files.length) {
    return;
  }

  const file = target.files[0];
  const reader = new FileReader();
}

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

document.addEventListener('DOMContentLoaded', function(event) {
  stepLabel.textContent = activeIndexStep + 1;
});
