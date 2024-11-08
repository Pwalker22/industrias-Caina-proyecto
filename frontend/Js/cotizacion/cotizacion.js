document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const submitButton = document.getElementById('submit-quote');

    if (quoteForm && submitButton) {
        submitButton.addEventListener('click', async (event) => {
            
            event.preventDefault();

            const name = document.getElementById('Cname').value;
            const email = document.getElementById('Cemail').value;
            const phone = document.getElementById('Cphone').value;
            const message = document.getElementById('Cmessage').value;

            if (name && email && phone && message) {
                try {
                    const response = await fetch('http://localhost:3001/api/v1/saveQuotes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nameNewUser: name,
                            emailNewUser: email,
                            numberPhone: phone,
                            information: message
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        Swal.fire('Cotización enviada exitosamente');
                        quoteForm.reset(); 
                    } else {
                        const errorMessage = await response.json();
                        Swal.fire(`Error al enviar la cotización: ${errorMessage.message}`);
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire('Error en la solicitud');
                }
            } else {
                Swal.fire('Por favor, completa todos los campos del formulario.');
            }
        });
    } else {
        console.error('Formulario o botón no encontrados en el DOM.');
    }
});
