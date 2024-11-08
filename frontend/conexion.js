document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3001/backend/Src')
    .then(response => response.text())
    .then(data => {
      document.getElementById('message').innerText = data;
    })
    .catch(error => console.error('Error al hacer la solicitud:', error));
});
