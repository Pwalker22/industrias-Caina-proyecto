let editUser, deleteUser;

$(document).ready(function() {
    const dataTableOptions = {
        lengthMenu: [5, 10, 15, 20, 100, 200, 500],
        columnDefs: [
            { orderable: false, targets: [5, 6] }
        ],
        language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "Ningún registro encontrado",
            info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Ningún registro encontrado",
            infoFiltered: "(filtrados desde _MAX_ registros totales)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    };

    const initDataTable = () => {
        $("#datatable_users").DataTable(dataTableOptions);
    };

    const showLoader = () => {
        $('#datatable_users').hide();
        $('#loader').show();
    };

    const hideLoader = () => {
        $('#datatable_users').show();
        $('#loader').hide();
    };

    const fetchUsers = async () => {
        showLoader();
        try {
            const response = await fetch('http://localhost:3001/api/v1/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const users = responseData.data || [];
            let content = '';

            users.forEach((user, index) => {
                content += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.lastname}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.roleId}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editUser(${user.id}, '${user.name}', '${user.lastname}', '${user.email}', '${user.phone}', ${user.roleId})"><i class="fa-solid fa-pencil"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>`;
            });

            $('#tableBody_users').html(content);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            hideLoader();
        }
    };

    editUser = async (id, name, lastname, email, phone, roleId) => {
        console.log('ID recibido:', id); 
        if (!id) {
            console.error('El ID del usuario es inválido');
            Swal.fire('Error', 'ID de usuario no válido.', 'error');
            return; 
        }

        const { value: formValues } = await Swal.fire({
            title: 'Actualizar Usuario',
            html: `
                <input id="name" class="swal2-input" placeholder="Nombre" value="${name}">
                <input id="lastname" class="swal2-input" placeholder="Apellido" value="${lastname}">
                <input id="email" class="swal2-input" placeholder="Correo" value="${email}">
                <input id="phone" class="swal2-input" placeholder="Teléfono" value="${phone}">
                <input id="roleId" class="swal2-input" placeholder="ID Rol" value="${roleId}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('name').value,
                    lastname: document.getElementById('lastname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    roleId: document.getElementById('roleId').value,
                };
            }
        });

        if (formValues) {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/updateUser/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                });

                if (response.ok) {
                    Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
                    fetchUsers(); 
                } else {
                    throw new Error('Error al actualizar el usuario');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
            }
        }
    };

    deleteUser = async (id) => {
        if (!id) {
            console.error('El ID del usuario es inválido');
            Swal.fire('Error', 'ID de usuario no válido.', 'error');
            return; 
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/deleteUser/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
                    fetchUsers(); 
                } else {
                    throw new Error('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            }
        }
    };

    fetchUsers();
});
