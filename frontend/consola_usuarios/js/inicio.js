document.querySelectorAll('.service').forEach(service => {
    service.addEventListener('click', () => {
        alert(`Más información sobre ${service.querySelector('h3').innerText}`);
    });
});


