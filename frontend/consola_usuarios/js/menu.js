$(document).ready(function() {
   
    $(".menu").click(function() {
        $(".keep").toggleClass("width");
    });

    
    $('ul li a').click(function(event) {
        var href = $(this).attr('href');

        
        if (href.startsWith('#')) {
            event.preventDefault(); 

            
            $('.form-container').removeClass('active');

            
            $(href).addClass('active');

           
            $('ul li').removeClass('active');
            $(this).parent().addClass('active');
        }
        
    });

    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            logout(); 
        });
    }
});


function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    document.getElementById('datetime').innerText = now.toLocaleString('es-ES', options);
}


setInterval(updateDateTime, 1000);
updateDateTime(); 


function toggleMenu(menuId) {
    var menus = document.querySelectorAll('.submenu');
    menus.forEach(function(menu) {
        if (menu.id === menuId) {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        } else {
            menu.style.display = 'none';
        }
    });
}

//? Función de cerrar sesión
function logout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            console.log('Reservas antes de eliminar:', localStorage.getItem('reservations'));
             localStorage.removeItem('reservations');
             console.log('Reservas después de eliminar:', localStorage.getItem('reservations'));
            console.log('Datos de sesión y reservas eliminados');

            Swal.fire(
                'Sesión cerrada',
                'Has cerrado sesión correctamente.',
                'success'
            ).then(() => {
                
                const reservationsDiv = document.getElementById('reservations');
                if (reservationsDiv) {
                    reservationsDiv.innerHTML = ''; 
                    reservationsDiv.innerText = 'Has cerrado sesión. No hay reservas disponibles.';
                } 

                window.location.href = 'http://localhost:3000/login.html'; 
            });
        }
    });
}
