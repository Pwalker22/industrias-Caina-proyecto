const loginbtn = document.querySelector('#login');
const registerbtn = document.querySelector('#register');
const loginform = document.querySelector('.login-form');
const registerform = document.querySelector('.register-form');

loginbtn.addEventListener('click', ()=>{
    loginform.style.left = '50%';
    registerform.style.left = '-50%';
    
    document.querySelector('.col-1').style.borderRad = "0 30% 20% 0"; 

    
})

registerbtn.addEventListener('click', ()=>{
    loginform.style.left = '150%';
    registerform.style.left = '50%';

    loginform.style.opacity = 0;
    loginform.style.opacity = 1;

    document.querySelector('.col-1').style.borderRad = "0 20% 30% 0";
})



document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const strengthBar = document.getElementById('strength-bar');
    let strength = 0;

    // Evaluar la fuerza de la contraseña
    if (password.length >= 6) {
        strength += 1; // Contraseña básica
    }
    if (password.length >= 10) {
        strength += 1; // Contraseña moderada
    }
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(password)) {
        strength += 1; // Contraseña fuerte
    }

    // Ajustar la barra según la fuerza de la contraseña
    switch (strength) {
        case 0:
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            break;
        case 1:
            strengthBar.style.width = '33%';
            strengthBar.className = 'strength-bar weak';
            break;
        case 2:
            strengthBar.style.width = '66%';
            strengthBar.className = 'strength-bar medium';
            break;
        case 3:
            strengthBar.style.width = '100%';
            strengthBar.className = 'strength-bar strong';
            break;
        default:
            strengthBar.style.width = '0%';
            break;
    }
});


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
});

document.getElementById('authButton').addEventListener('click', function() {
    swalWithBootstrapButtons.fire({
        title: "¿Cómo te gustaría proceder?",
        text: "Selecciona una opción para obtener más información.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "<i class='bx bx-user-plus'></i> Registrarse",
        cancelButtonText: "<i class='bx bx-log-in'></i> Iniciar Sesión",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Alerta de registro
            swalWithBootstrapButtons.fire({
                title: "¿Cómo registrarse?",
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: left;">
                        <p>Para registrarte, sigue estos pasos:</p>
                        <ol style="padding-left: 20px; list-style-type: decimal;">
                            <li style="margin-bottom: 10px;">Haz clic en el botón <strong>"Registrarse"</strong>.</li>
                            <li style="margin-bottom: 10px;">Completa el formulario con tu información.</li>
                            <li style="margin-bottom: 10px;">Asegúrate de aceptar los términos y condiciones.</li>
                            <li style="margin-bottom: 10px;">Haz clic en <strong>"Enviar"</strong> para finalizar tu registro.</li>
                        </ol>
                    </div>
                `,
                icon: "info",
                confirmButtonText: "Entendido",
                customClass: {
                    title: 'swal-title',
                    htmlContainer: 'swal-html',
                    confirmButton: 'swal-button'
                },
                buttonsStyling: false,
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Alerta de inicio de sesión
            swalWithBootstrapButtons.fire({
                title: "¿Cómo iniciar sesión?",
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: left;">
                        <p>Para iniciar sesión, sigue estos pasos:</p>
                        <ol style="padding-left: 20px; list-style-type: decimal;">
                            <li style="margin-bottom: 10px;">Haz clic en el botón <strong>"Iniciar Sesión"</strong>.</li>
                            <li style="margin-bottom: 10px;">Ingresa tu correo electrónico y contraseña.</li>
                            <li style="margin-bottom: 10px;">Haz clic en <strong>"Entrar"</strong> para acceder a tu cuenta.</li>
                        </ol>
                    </div>
                `,
                icon: "info",
                confirmButtonText: "Entendido",
                customClass: {
                    title: 'swal-title',
                    htmlContainer: 'swal-html',
                    confirmButton: 'swal-button'
                },
                buttonsStyling: false,
            });
        }
    });
});
