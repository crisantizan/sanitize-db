const steps = document.getElementsByClassName('step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const stepLabel = document.getElementById('stepLabel');
const backdrop = document.getElementById('backdrop');

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
      fileColumnsNumber = response.columns;

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

/** ------------------- STEP 3 ----------------------- */

function step3() {
  const columnsOl = document.getElementById('columns');
  const filterColumnsOl = document.getElementById('filterColumns');

  const newColumn = document.getElementById('newColumn');
  const selectColumns = document.getElementById('selectColumns');

  const filterBtn = document.getElementById('filterBtn');

  const regex = /^[a-zA-Z0-9_]+$/;
  let disabled = true;

  let columns = [];
  let filteredColumns = [];

  /**
   *
   * @param {'parent' | 'filtered'} type
   * @param {HTMLLIElement} li
   */
  function removeLiElements(type = 'parent', li) {
    const value = li.textContent;
    const res = confirm(`¿Deseas eliminar la columna "${value}" ?`);

    if (!res) return;

    // remove
    li.parentNode.removeChild(li);

    switch (type) {
      // remove column and verify if that exists in filtered
      case 'parent':
        columns = columns.filter(v => v !== value);

        const filterIndex = filteredColumns.findIndex(v => v === value);

        // exists in filtered columns
        if (filterIndex !== -1) {
          // remove from array of filtered columns
          filteredColumns.splice(filterIndex, 1);

          // remove HTMLLiElement
          filterColumnsOl.childNodes.forEach(node => {
            // if found, remove child
            node.textContent === value && filterColumnsOl.removeChild(node);
          });
        } else {
          // remove HTMLOption
          selectColumns.childNodes.forEach(node => {
            // if found, remove child
            node.textContent === value && selectColumns.removeChild(node);
          });
        }

        // disable filter button
        if (!columns.length || columns.length < fileColumnsNumber) {
          disabled = true;
          filterBtn.classList.add('disabled');
        }
        break;

      // remove filtered column only
      case 'filtered':
        filteredColumns = filteredColumns.filter(v => v !== value);

        // create new option element
        const option = document.createElement('option');
        option.textContent = value;
        option.value = value;

        // add again to select element
        selectColumns.appendChild(option);
        break;
    }
  }

  // typing new column
  newColumn.addEventListener('keyup', e => {
    // only enter
    if (e.keyCode !== 13 || !e.target.value) return;

    // validate format
    if (!regex.test(e.target.value)) {
      return alert(
        'Inválido: solo letras (sin tildes), números y guiones bajos ( _ )',
      );
    }

    const { value } = e.target;

    // not repeat
    if (columns.some(v => value === v)) {
      return alert(`La columna "${value}" ya existe`);
    }

    columns.push(value);

    // create new li element
    const li = document.createElement('li');
    li.textContent = value;

    // create new option element
    const option = document.createElement('option');
    option.textContent = value;
    option.value = value;

    // push in parent elements
    columnsOl.appendChild(li);
    selectColumns.appendChild(option);

    // reset value
    e.target.value = '';

    // enable filter button
    if (disabled && columns.length >= fileColumnsNumber) {
      disabled = false;
      filterBtn.classList.remove('disabled');
    }
  });

  // select filterd columns
  selectColumns.addEventListener('change', ({ target }) => {
    const { value } = target;
    const option = target.options[target.options.selectedIndex];

    // create new li element
    const li = document.createElement('li');
    li.textContent = value;

    // add to list
    filterColumnsOl.appendChild(li);

    // add to array
    filteredColumns.push(value);

    // remove from this select
    selectColumns.removeChild(option);
    // set label as default option
    selectColumns.options[0].selected = true;
  });

  // remove li when is double clicked
  filterColumnsOl.addEventListener('dblclick', ({ target }) => {
    removeLiElements('filtered', target);
  });

  columnsOl.addEventListener('dblclick', ({ target }) => {
    removeLiElements('parent', target);
  });

  // execute filter
  filterBtn.addEventListener('click', async () => {
    if (disabled || !backendFilename || !fileColumnsNumber) {
      return alert('Algo anda mal');
    }

    // execute
    const body = {
      filename: backendFilename,
      keyword,
      columns,
      filter: filteredColumns,
    };
    // columns, filter, filename, keyword
    try {
      toggleBackdrop();
      const result = await fetch('/sanitize-db', {
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

      // { jsonFile: string }
      const { response } = await result.json();
      jsonFile = response.jsonFile;

      console.log({ jsonFile });

      // go to last step
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
  step3();
});
