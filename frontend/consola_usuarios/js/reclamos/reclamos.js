document.addEventListener("DOMContentLoaded", function() {
  const formulario = document.getElementById("reclamoForm"); 

  formulario.addEventListener("submit", async function(event) {
      event.preventDefault(); 

      const cliente = document.getElementById("Cliente").value.trim();
      const motivo = document.getElementById("Motivo").value.trim();
      const telefono = document.getElementById("Gphone").value.trim();
      const mensaje = document.getElementById("Gmessage").value.trim();

      const fkUser = localStorage.getItem("userId");

      
      if (!cliente || !motivo || !telefono || !mensaje || !fkUser) {
          Swal.fire('Por favor, complete todos los campos.').then(() => {
              if (!cliente) document.getElementById("Cliente").focus();
              else if (!motivo) document.getElementById("Motivo").focus();
              else if (!telefono) document.getElementById("Gphone").focus();
              else if (!mensaje) document.getElementById("Gmessage").focus();
              else if (!fkUser) Swal.fire('Error: ID de usuario no encontrado.');
          });
          return;
      }

      const button = document.getElementById("Garantia"); 

      try {
          const response = await fetch('http://localhost:3001/api/v1/saveComplaint', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('userToken')}`
              },
              body: JSON.stringify({
                  client: cliente,
                  ComplaintType: motivo,
                  phoneNumber: telefono,
                  description: mensaje,
                  fkUser: fkUser
              })
          });

          if (response.ok) {
              Swal.fire({
                  title: '¡Éxito!',
                  text: 'Tu queja ha sido enviada correctamente.',
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
