document.addEventListener("DOMContentLoaded", function() {
  const formulario = document.getElementById("reclamoForm");

  formulario.addEventListener("submit", async function(event) {
      event.preventDefault(); 

      const marca = document.getElementById("Gmarca").value.trim();
      const cliente = document.getElementById("Gcliente").value.trim();
      const telefono = document.getElementById("Gphone").value.trim();
      const lugar = document.getElementById("Glugar").value.trim();
      const mensaje = document.getElementById("Gmessage").value.trim();

      
      const fkuser = localStorage.getItem("userId");

      
      if (!marca || !cliente || !telefono || !lugar || !mensaje || !fkuser) {
          Swal.fire('Por favor, complete todos los campos.').then(() => {
              if (!marca) document.getElementById("Gmarca").focus();
              else if (!cliente) document.getElementById("Gcliente").focus();
              else if (!telefono) document.getElementById("Gphone").focus();
              else if (!lugar) document.getElementById("Glugar").focus();
              else if (!mensaje) document.getElementById("Gmessage").focus();
              else if (!fkuser) Swal.fire('Error: ID de usuario no encontrado.'); 
          });
          return;
      }

     
      const button = document.getElementById("Garantia");
      button.disabled = true;

      try {
          const response = await fetch('http://localhost:3001/api/v1/saveWarranty', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  
                  'Authorization': `Bearer ${localStorage.getItem('userToken')}`
              },
              body: JSON.stringify({
                  brand: marca,
                  clientNumber: cliente,
                  phone: telefono,
                  place: lugar,
                  description: mensaje,
                  fkuser: fkuser 
              })
          });

          if (response.ok) {
              Swal.fire({
                  title: '¡Éxito!',
                  text: 'Tu garantía ha sido enviada correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
              }).then(() => {
                  formulario.reset(); 
              });
          } else {
              const errorMessage = await response.json();
              Swal.fire(`Error al enviar: ${errorMessage.message}`);
          }
      } catch (error) {
          console.error('Error en la solicitud:', error);
          Swal.fire('Error en la solicitud');
      } finally {
          
          button.disabled = false;
      }
  });
});
