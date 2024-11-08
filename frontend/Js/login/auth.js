document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-btn');
    const registerButton = document.getElementById('register-btn');

    if (loginButton && registerButton) {

        loginButton.addEventListener('click', async () => {
            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');
        
            if (email && password) {
                const emailValue = email.value.trim();
                const passwordValue = password.value.trim();
        
                try {
                    const response = await fetch('http://localhost:3001/api/v1/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: emailValue,
                            password: passwordValue
                        })
                    });
        
                    if (response.ok) {
                        const data = await response.json();
        
                        if (data.token && data.userId && data.positionId) {
                            localStorage.setItem('userToken', data.token);
                            localStorage.setItem('userId', data.userId);
                            localStorage.setItem('positionId', parseInt(data.positionId));
                            
                            console.log('Datos guardados en localStorage:', {
                                userId: localStorage.getItem('userId'),
                                userToken: localStorage.getItem('userToken'),
                                positionId: parseInt(localStorage.getItem('positionId')) 
                            });
        
                            Swal.fire({
                                title: 'Inicio de sesión exitoso',
                                text: 'Bienvenido de nuevo!',
                                icon: 'success'
                            }).then(() => {
                                
                                const roleId = parseInt(localStorage.getItem('positionId')); // Leer y convertir a número
                                if (roleId === 2) {
                                    
                                    window.location.href = 'http://localhost:3000/consola_administrador/admin.html';
                                } else if (roleId === 1) {
                                    
                                    window.location.href = 'http://localhost:3000/consola_usuarios/inicio.html';
                                } else {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'Rol no reconocido. Por favor, verifica tu acceso.',
                                        icon: 'error'
                                    });
                                }
                            });
                        } else {
                            Swal.fire({
                                title: 'Error de datos',
                                text: 'Los datos recibidos del servidor son incompletos. Por favor, intente de nuevo.',
                                icon: 'error'
                            });
                        }
                    } else {
                        const errorMessage = await response.json();
                        Swal.fire({
                            title: 'Error',
                            text: errorMessage.message || 'Ocurrió un error al procesar la solicitud.',
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        title: 'Error en la solicitud',
                        text: 'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.',
                        icon: 'error'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Campos de formulario de inicio de sesión no encontrados.',
                    icon: 'error'
                });
            }
        });
        
        //? Evento de registro
        registerButton.addEventListener('click', async () => {
            const username = document.getElementById('register-username');
            const email = document.getElementById('register-email');
            const password = document.getElementById('register-password');

            if (username && email && password) {
                const userNameValue = username.value.trim();
                const emailValue = email.value.trim();
                const passwordValue = password.value.trim();

                console.log('Username:', userNameValue);
                console.log('Register Email:', emailValue);
                console.log('Register Password:', passwordValue);

                try {
                    const response = await fetch('http://localhost:3001/api/v1/saveUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userName: userNameValue,
                            email: emailValue,
                            password: passwordValue
                        })
                    });

                    console.log('Response Status:', response.status);

                    if (response.ok) {
                        Swal.fire({
                            title: 'Registro exitoso',
                            icon: 'success'
                        });
                    } else {
                        const errorMessage = await response.json();
                        console.error('Error:', response.status, errorMessage);
                        Swal.fire({
                            title: 'Error al registrar',
                            text: errorMessage.message,
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        title: 'Error en la solicitud',
                        icon: 'error'
                    });
                }
            } else {
                console.error('Campos de formulario de registro no encontrados.');
            }
        });

    } else {
        console.error('Uno o más botones no se encontraron en el DOM.');
    }
});
