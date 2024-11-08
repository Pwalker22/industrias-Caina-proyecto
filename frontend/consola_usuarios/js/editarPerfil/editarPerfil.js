document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tabs-container ul li a');
  const forms = document.querySelectorAll('.form-container');

  tabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
          e.preventDefault();

          
          tabs.forEach(item => item.parentElement.classList.remove('active'));

          
          tab.parentElement.classList.add('active');

          
          forms.forEach(form => form.classList.remove('active'));

          
          const target = document.querySelector(tab.getAttribute('href'));
          target.classList.add('active');
      });
  });
});

//? funcioon formulario actualizar informacion personal
document.addEventListener('DOMContentLoaded', () => {
  
  const personalInfoForm = document.getElementById('personalInfoForm');
  personalInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('Enombre').value.trim();
    const apellido = document.getElementById('Eapellido').value.trim();
    const correo = document.getElementById('Ecorreo').value.trim();
    const telefono = document.getElementById('Etelefono').value.trim();
    const userToken = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    if (!nombre || !apellido || !correo || !telefono) {
      Swal.fire('Por favor, complete todos los campos.').then(() => {
        if (!nombre) document.getElementById('Enombre').focus();
        else if (!apellido) document.getElementById('Eapellido').focus();
        else if (!correo) document.getElementById('Ecorreo').focus();
        else if (!telefono) document.getElementById('Etelefono').focus();
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/v1/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          userName: nombre,
          lastName: apellido,
          email: correo,
          phoneNumber: telefono
        })
      });

      if (response.ok) {
        Swal.fire('Datos actualizados con éxito').then(() => {
          window.location.reload(); 
        });
      } else {
        const errorMessage = await response.json();
        Swal.fire(`Error al actualizar: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire('Error en la solicitud');
    }
  });
});

//?funcion para actualizar contraseña 
console.log('changePassword.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado y analizado');

   
    const changePasswordForm = document.getElementById('changePasswordForm');

    if (changePasswordForm) {
        console.log('Formulario de Cambio de Contraseña encontrado');


        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Evento submit en Cambio de Contraseña');

            
            const passwordActual = document.getElementById('Apassword').value.trim();
            const nuevaPassword = document.getElementById('Npassword').value.trim();
            const confirmarPassword = document.getElementById('Cpassword').value.trim();
            const userToken = localStorage.getItem('userToken');
            const userId = localStorage.getItem('userId');

           
            console.log('User ID:', userId);
            console.log('User Token:', userToken);

           
            if (!passwordActual || !nuevaPassword || !confirmarPassword) {
                console.log('Campos obligatorios faltantes');
                Swal.fire('Por favor, complete todos los campos.');
                return;
            }

            
            if (nuevaPassword !== confirmarPassword) {
                console.log('Las contraseñas no coinciden');
                Swal.fire('Las contraseñas no coinciden.');
                return;
            }

            
            if (nuevaPassword.length < 6) {
                console.log('La nueva contraseña es demasiado corta');
                Swal.fire('La nueva contraseña debe tener al menos 6 caracteres.');
                return;
            }

            try {
                console.log(`Enviando solicitud POST a /api/v1/change-password/${userId}`);

                const response = await fetch(`http://localhost:3001/api/v1/change-password/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    },
                    body: JSON.stringify({
                        currentPassword: passwordActual,
                        newPassword: nuevaPassword,
                        confirmPassword: confirmarPassword 
                    })
                });

                console.log('Respuesta del servidor:', response);

                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta JSON:', jsonResponse);
                    Swal.fire('Contraseña cambiada correctamente').then(() => {
                        
                        window.location.href = '../../../login.html'; 
                    });
                } else {
                    
                    const errorMessage = await response.json();
                    console.log('Error del servidor:', errorMessage);
                    Swal.fire(`Error al cambiar la contraseña: ${errorMessage.message || 'Error desconocido'}`);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire('Error en la solicitud. Intente de nuevo más tarde.');
            }
        });
    } else {
        console.log('Formulario de Cambio de Contraseña NO encontrado');
    }
});


