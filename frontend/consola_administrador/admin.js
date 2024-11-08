function updateDateTime() {
    const now = new Date();
    const dateTime = now.toLocaleString();
    document.getElementById('date-time').innerText = `Fecha y hora: ${dateTime}`;
}

function getWeather() {
    document.getElementById('weather').innerText = "Clima: Soleado 25°C";  // Simulación
}

// Funciones SweetAlert2
function editReserva() {
    // Crear un contenido dinámico en formato de lista
    let reservasList = `<ul style="list-style-type: none; padding: 0;">` + 
        reservas.map(reserva => {
            return `<li style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0;">
                        <div>
                            <strong>${reserva.empresa}</strong> - ${reserva.fecha} - ${reserva.detalles}
                        </div>
                        <div>
                            <button onclick="confirmEdit(${reserva.id})" style="margin-left: 10px;">Editar</button>
                            <button onclick="confirmCancel(${reserva.id})" style="margin-left: 5px;">Cancelar</button>
                        </div>
                    </li>`;
        }).join('') + 
        `</ul>`;

    Swal.fire({
        title: 'Editar Reserva',
        html: reservasList,
        showCloseButton: true
    });
}

function confirmEdit(reservaId) {
    const reserva = reservas.find(r => r.id === reservaId);
    Swal.fire({
        title: 'Selecciona nueva fecha',
        html: `<input type="date" id="new-date" value="${reserva.fecha}">`, // Campo de entrada de fecha
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const newDate = document.getElementById('new-date').value;
            if (newDate) {
                reserva.fecha = newDate;
                Swal.fire('Actualizado', 'Fecha de reserva actualizada correctamente', 'success');
            } else {
                Swal.fire('Error', 'Por favor, selecciona una fecha válida', 'error');
            }
        }
    });
}

function confirmCancel(reservaId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a cancelar esta reserva.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = reservas.findIndex(r => r.id === reservaId);
            if (index > -1) {
                reservas.splice(index, 1); // Eliminar la reserva
                Swal.fire('Cancelado', 'Reserva cancelada correctamente', 'success');
            }
        }
    });
}

function viewComplaints() {
    let complaintsList = `<ul style="list-style-type: none; padding: 0;">` + 
        complaints.map(item => {
            return `<li style="margin: 5px 0;"><strong>${item.name}:</strong> ${item.complaint}</li>`;
        }).join('') + 
        `</ul>`;

    Swal.fire({
        title: 'Quejas y Reclamos',
        html: complaintsList,
        icon: 'info',
        showCloseButton: true
    });
}

function viewAllReservations() {
    // Aquí generamos el HTML para mostrar las reservas
    let reservasHTML = '';
    reservas.forEach(reserva => {
        reservasHTML += `
            <div>
                <h3>${reserva.fullName}</h3>
                <p>Servicio: ${reserva.typeService}</p>
                <p>Fecha: ${reserva.ScheduledDate}</p>
                <p>Dirección: ${reserva.direction}</p>
                <p>Teléfono: ${reserva.numberPhone}</p>
                <p>Ciudad: ${reserva.city}</p>
            </div>
        `;
    });

    // Verifica si hay reservas antes de intentar mostrarlas
    if (reservasHTML === '') {
        console.log("No hay reservas para mostrar");
        Swal.fire({
            title: 'Información',
            text: 'No hay reservas disponibles.',
            icon: 'info'
        });
    } else {
        document.getElementById('reservas-list').innerHTML = reservasHTML; // Asegúrate de que este contenedor existe
    }
}
function updateReservaList(filteredReservas) {
    const reservasList = document.getElementById('reservas-list');
    reservasList.innerHTML = filteredReservas.map(reserva => `
        <li>
            <strong>${reserva.empresa}</strong> - ${reserva.fecha} - ${reserva.detalles}
        </li>
    `).join('');
}


function filterReservations() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const listItems = document.querySelectorAll('#reservas-list li');

    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function viewRegisteredUsers() {
    let content = `
        <input type="text" id="search" placeholder="Buscar por nombre o apellido" oninput="filterUsers()" style="width: 100%; padding: 10px; margin-bottom: 10px;">
        <ul id="users-list" style="list-style-type: none; padding: 0;">` +
        usuarios.map(usuario => `
            <li style="padding: 5px 0;">
                <strong>ID:</strong> ${usuario.id} - <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
            </li>
        `).join('') + `
        </ul>`;

    Swal.fire({
        title: 'Usuarios Registrados',
        html: content,
        showCloseButton: true,
        width: '600px'
    });
}

function filterUsers() {
    let searchValue = document.getElementById('search').value.toLowerCase();
    let filteredUsers = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchValue) || 
        usuario.apellido.toLowerCase().includes(searchValue)
    );
    
    let userList = filteredUsers.map(usuario => `
        <li style="padding: 5px 0;">
            <strong>ID:</strong> ${usuario.id} - <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
        </li>
    `).join('');

    document.getElementById('users-list').innerHTML = userList;
}

function fetchReservations() {
    fetch('http://localhost:3001/api/v1/scheduling')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las reservas');
            }
            return response.json();
        })
        .then(responseData => {
            // Log para ver toda la respuesta
            console.log("Respuesta de la API:", responseData); 

            // Accede a la propiedad data para obtener las reservas
            reservas = responseData.data; 
            console.log("Reservas cargadas:", reservas); // Para depuración
            
            // Llama a la función para mostrar reservas solo si hay reservas
            if (reservas && reservas.length > 0) {
                viewAllReservations(); 
            } else {
                console.log("No hay reservas");
                Swal.fire({
                    title: 'Información',
                    text: 'No hay reservas disponibles.',
                    icon: 'info'
                });
            }
        })
        .catch(error => {
            console.error("Fetch error: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        });
}

function assignRoles() {
    let content = `
        <input type="text" id="search-users" placeholder="Buscar por nombre o apellido" oninput="filterUsersByRole()" style="width: 100%; padding: 10px; margin-bottom: 10px;">
        <ul id="users-role-list" style="list-style-type: none; padding: 0; display: none;">
        </ul>
    `;

    Swal.fire({
        title: 'Asignación de Roles',
        html: content,
        showCloseButton: true,
        width: '600px'
    });
}

// Actualizar la fecha y hora cada segundo
setInterval(updateDateTime, 1000);

// Obtener clima cada minuto (simulación)
setInterval(getWeather, 60000);

window.onload = function() {
    updateDateTime();
    getWeather();
}

// Simulación del nombre del administrador
const adminName = 'Data';

// Mostrar el nombre del administrador logueado
document.getElementById('admin-name').textContent = adminName;

// Mostrar/ocultar el menú de opciones del administrador
const adminNameElement = document.getElementById('admin-name');
const adminMenu = document.getElementById('admin-menu');

adminNameElement.addEventListener('click', () => {
    adminMenu.classList.toggle('hidden');
});

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', (e) => {
    if (!adminNameElement.contains(e.target) && !adminMenu.contains(e.target)) {
        adminMenu.classList.add('hidden');
    }
});
2
// Funcionalidad para "Actualizar datos" y "Salir"
document.getElementById('update-admin').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Actualizar datos',
        input: 'text',
        inputLabel: 'Nuevo nombre de administrador',
        inputValue: adminName,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevoNombre = result.value;
            document.getElementById('admin-name').textContent = nuevoNombre;
            Swal.fire('Actualizado', 'Nombre actualizado correctamente', 'success');
        }
    });
});

