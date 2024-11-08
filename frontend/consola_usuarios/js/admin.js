const complaints = [
    { name: 'Juan Pérez', complaint: 'El servicio fue muy lento.' },
    { name: 'Ana Gómez', complaint: 'El producto llegó dañado.' },
    { name: 'Luis Martínez', complaint: 'No recibí la confirmación de mi reserva.' }
];

const reservas = [
    { id: 1, nombre: 'Juan Pérez', fecha: '2024-09-25'},
    { id: 2, nombre: 'Ana Gómez', fecha: '2024-09-26'},
    { id: 3, nombre: 'Luis Martínez', fecha: '2024-09-27'}
];

let usuarios = [
    { id: 1, nombre: "Juan", apellido: "Pérez", rol: "Cliente" },
    { id: 2, nombre: "María", apellido: "Gómez", rol: "Administrador" },
    { id: 3, nombre: "Luis", apellido: "Ramírez", rol: "Cliente" }
];





function updateDateTime() {
    const now = new Date();
    const dateTime = now.toLocaleString();
    document.getElementById('date-time').innerText = `Fecha y hora: ${dateTime}`;
}


function getWeather() {
    document.getElementById('weather').innerText = "Clima: Soleado 25°C";  // Simulación
}


function editReserva() {
    
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
                reservas.splice(index, 1); 
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
        showCloseButton: true // Botón para cerrar la alerta
    });
}

function viewAllReservations() {
    // Crear contenido inicial para la alerta
    let content = `
        <input type="text" id="search" placeholder="Buscar por nombre de empresa" oninput="filterReservations()">
        <ul id="reservas-list" style="list-style-type: none; padding: 0;">` +
        reservas.map(reserva => `
            <li>
                <strong>${reserva.empresa}</strong> - ${reserva.fecha} - ${reserva.detalles}
            </li>
        `).join('') + `
        </ul>`;

    // Mostrar la alerta con el contenido
    Swal.fire({
        title: 'Todas las Reservas',
        html: content,
        showCloseButton: true,
        width: '600px'
    });
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
    // Crear contenido inicial para la alerta con un campo de búsqueda y un listado
    let content = `
        <input type="text" id="search" placeholder="Buscar por nombre o apellido" oninput="filterUsers()" style="width: 100%; padding: 10px; margin-bottom: 10px;">
        <ul id="users-list" style="list-style-type: none; padding: 0;">` +
        usuarios.map(usuario => `
            <li style="padding: 5px 0;">
                <strong>ID:</strong> ${usuario.id} - <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
            </li>
        `).join('') + `
        </ul>`;

    // Mostrar la alerta con el contenido generado
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
    
    // Actualizar el contenido de la lista con los usuarios filtrados
    let userList = filteredUsers.map(usuario => `
        <li style="padding: 5px 0;">
            <strong>ID:</strong> ${usuario.id} - <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
        </li>
    `).join('');

    document.getElementById('users-list').innerHTML = userList;
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

function toggleRole(index) {
    usuarios[index].rol = usuarios[index].rol === "Cliente" ? "Administrador" : "Cliente";
    assignRoles(); // Vuelve a actualizar la lista dentro del SweetAlert
}

function deleteUser(index) {
    if (usuarios[index].rol === "Administrador") {
        usuarios.splice(index, 1); // Eliminar usuario del array
        assignRoles(); // Vuelve a actualizar la lista dentro del SweetAlert
    }
}

function filterUsersByRole() {
    let searchValue = document.getElementById('search-users').value.toLowerCase();
    let filteredUsers = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchValue) || 
        usuario.apellido.toLowerCase().includes(searchValue)
    );
    
    let userList = filteredUsers.map((usuario, index) => `
        <li style="padding: 10px 0; border-bottom: 1px solid #ccc;">
            <strong>ID:</strong> ${usuario.id} - <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido} - <strong>Rol Actual:</strong> ${usuario.rol}
            <br>
            <button onclick="showRoleSelect(${index})" style="margin-right: 10px;">Cambiar Rol</button>
            ${usuario.rol === "Administrador" ? `<button onclick="deleteUser(${index})" style="background-color: red; color: white;">Eliminar</button>` : ''}
            <div id="role-select-${index}" style="display: none; margin-top: 10px;">
                <label for="role-${index}">Nuevo Rol:</label>
                <select id="role-${index}">
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                </select>
                <button onclick="changeUserRole(${index})" style="margin-left: 10px;">Guardar</button>
            </div>
        </li>
    `).join('');
    
    let userListElement = document.getElementById('users-role-list');
    if (filteredUsers.length > 0) {
        userListElement.style.display = 'block';
    } else {
        userListElement.style.display = 'none';
    }
    
    userListElement.innerHTML = userList;
}


function showRoleSelect(index) {
    document.getElementById(`role-select-${index}`).style.display = 'block'; // Mostrar el <select> para elegir rol
}

function changeUserRole(index) {
    let newRole = document.getElementById(`role-${index}`).value;
    usuarios[index].rol = newRole; // Actualizar el rol en la lista de usuarios
    Swal.fire({
        icon: 'success',
        title: 'Rol actualizado',
        text: `El rol del usuario ha sido cambiado a ${newRole}.`,
        timer: 2000,
        showConfirmButton: false
    });
    filterUsersByRole(); // Actualizar la lista visualmente
}



// Actualizar la fecha y hora cada segundo
setInterval(updateDateTime, 1000);

// Obtener clima cada minuto (simulación)
setInterval(getWeather, 60000);

// Inicializar la fecha y el clima al cargar la página
window.onload = function() {
    updateDateTime();
    getWeather();
}

// Simulación del nombre del administrador
const adminName = 'Juan Pérez';

// Mostrar el nombre del administrador logueado
document.getElementById('admin-name').textContent = adminName;

// Mostrar/ocultar el menú de opciones del administrador
const adminNameElement = document.getElementById('admin-name');
const adminMenu = document.getElementById('admin-menu');

adminNameElement.addEventListener('click', () => {
    adminMenu.classList.toggle('hidden'); // Alternar la visibilidad del menú
});

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', (e) => {
    if (!adminNameElement.contains(e.target) && !adminMenu.contains(e.target)) {
        adminMenu.classList.add('hidden'); // Ocultar el menú
    }
});


// Funcionalidad para "Actualizar datos" y "Salir"
document.getElementById('update-admin').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Actualizar datos',
        input: 'text',
        inputLabel: 'Nuevo nombre de administrador',
        inputValue: adminName,  // Prellenar con el nombre actual
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

document.getElementById('logout-admin').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a cerrar sesión",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí iría la lógica para cerrar la sesión, por ejemplo:
            // window.location.href = '/logout'; 
            Swal.fire('Cerrado', 'Sesión cerrada correctamente', 'success');
        }
    });
});
