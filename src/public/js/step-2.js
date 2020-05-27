const formStep2 = document.getElementById('formStep2');
const input = document.getElementById('keyword');
const submitBtn = formStep2.lastChild;

let disabledStep2 = true;

input.addEventListener('input', ({ target }) => {
  keyword = target.value || '';

  disabledStep2 = !keyword.length;

  if (disabledStep2) {
    submitBtn.classList.add('disabled');
  } else {
    submitBtn.classList.remove('disabled');
  }
});

// try execute request
formStep2.addEventListener('submit', async e => {
  e.preventDefault();

  if (disabledStep2 || !backendFilename) return;

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
    fileColumnsNumber = response.columns;

    // print in span
    columnsNumberSpan.textContent = fileColumnsNumber;

    // go to next step
    nextStep();
    toggleBackdrop();
  } catch (error) {
    toggleBackdrop();
    console.error(error);
    alert(error.response);
  }
});
