const btn = document.getElementById('saveBtn');

btn.addEventListener('click', async () => {
  if (!jsonFile) {
    return alert('No se ha seleccionado el archivo JSON a guardar');
  }

  // execute
  const body = { filename: jsonFile };

  try {
    toggleBackdrop();
    const result = await fetch('/save-file', {
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

    // true
    await result.json();

    toggleBackdrop();

    alert('¡Bien, archivos salvados!');
    // go to home
    window.location.href = '/';
  } catch (error) {
    toggleBackdrop();
    console.error(error);
    alert(error.response);
  }
});
