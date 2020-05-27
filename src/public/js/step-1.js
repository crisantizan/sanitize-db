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
