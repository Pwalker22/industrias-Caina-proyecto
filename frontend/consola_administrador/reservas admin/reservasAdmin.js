const dataTableOptions = {
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [7] } // Opciones no ordenables
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

let dataTable;

const initDataTable = async () => {
    if ($.fn.DataTable.isDataTable('#datatable_reservas')) {
        $('#datatable_reservas').DataTable().destroy();
    }

    await fetchReservas(); // Asegúrate de que las reservas se carguen primero

    dataTable = $("#datatable_reservas").DataTable(dataTableOptions);
};

const fetchReservas = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/v1/scheduling'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const reservas = responseData.data || [];
        console.log(reservas); // Para verificar la estructura de datos recibidos
        let content = '';

        reservas.forEach((reserva, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${reserva.fullName}</td>
                    <td>${reserva.numberPhone}</td>
                    <td>${reserva.direction}</td>
                    <td>${reserva.ScheduledDate}</td>
                    <td>${reserva.city}</td>
                    <td>${reserva.typeService}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="updateReservation('${reserva.Id}', '${reserva.fullName}', '${reserva.numberPhone}', '${reserva.direction}', '${reserva.ScheduledDate}', '${reserva.city}', '${reserva.typeService}')">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteReservation('${reserva.Id}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>`;
        });
        
        $('#tableBody_reservas').html(content);
    } catch (error) {
        console.error('Error fetching reservas:', error);
    }
};


//? Función para actualizar la reserva
const updateReservation = async (id, fullName, numberPhone, direction, scheduledDate, city, typeService) => {
    // Usamos SweetAlert para recoger los nuevos valores de la reserva
    const { value: formValues } = await Swal.fire({
        title: 'Actualizar Reserva',
        html: `
            <input id="fullName" class="swal2-input" placeholder="Nombre Completo" value="${fullName}">
            <input id="numberPhone" class="swal2-input" placeholder="Número de Teléfono" value="${numberPhone}">
            <input id="direction" class="swal2-input" placeholder="Dirección" value="${direction}">
            <input id="scheduledDate" type="date" class="swal2-input" value="${scheduledDate}">
            <input id="city" class="swal2-input" placeholder="Ciudad" value="${city}">
            <input id="typeService" class="swal2-input" placeholder="Tipo de Servicio" value="${typeService}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                fullName: document.getElementById('fullName').value,
                numberPhone: document.getElementById('numberPhone').value,
                direction: document.getElementById('direction').value,
                scheduledDate: document.getElementById('scheduledDate').value,
                city: document.getElementById('city').value,
                typeService: document.getElementById('typeService').value,
            };
        }
    });

    // Solo proceder si se recogieron valores
    if (formValues) {
        console.log('Valores a enviar:', formValues);

        try {
            const response = await fetch(`http://localhost:3001/api/v1/updateScheduling/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues), // Convertir a JSON
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la reserva');
            }

            const responseData = await response.json();
            Swal.fire('Actualizado!', responseData.message, 'success');

            // Volver a cargar las reservas después de la actualización
            fetchReservas(); 
        } catch (error) {
            console.error('Error updating reservation:', error);
            Swal.fire('Error', error.message, 'error');
        }
    }
};


//? Función para eliminar la reserva
window.deleteReservation = async (id) => {
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
            const response = await fetch(`http://localhost:3001/api/v1/deleteScheduling/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Eliminado!', 'La reserva ha sido eliminada.', 'success');
                fetchReservas(); // Actualiza la tabla después de la eliminación
            } else {
                throw new Error('Error al eliminar la reserva');
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            Swal.fire('Error', 'No se pudo eliminar la reserva.', 'error');
        }
    }
};

// Inicializa el DataTable al cargar el documento
$(document).ready(async () => {
    await initDataTable();
});
