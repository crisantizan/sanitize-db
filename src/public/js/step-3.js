const columnsOl = document.getElementById('columns');
const filterColumnsOl = document.getElementById('filterColumns');

const newColumn = document.getElementById('newColumn');
const selectColumns = document.getElementById('selectColumns');

const filterBtn = document.getElementById('filterBtn');

const regex = /^[a-zA-Z0-9_]+$/;
let disabledStep3 = true;

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
        disabledStep3 = true;
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
  if (disabledStep3 && columns.length >= fileColumnsNumber) {
    disabledStep3 = false;
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
  if (disabledStep3 || !backendFilename || !fileColumnsNumber) {
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
