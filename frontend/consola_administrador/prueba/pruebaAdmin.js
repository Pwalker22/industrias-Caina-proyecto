let updateQuote, deleteQuote;

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
        $("#datatable_quotes").DataTable(dataTableOptions);
    };

    const showLoader = () => {
        $('#datatable_quotes').hide();
        $('#loader').show();
    };

    const hideLoader = () => {
        $('#datatable_quotes').show();
        $('#loader').hide();
    };

    const fetchQuotes = async () => {
        showLoader();
        try {
            const response = await fetch('http://localhost:3001/api/v1/quotes');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const quotes = responseData.data || [];
            let content = '';

            quotes.forEach((quote, index) => {
                content += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${quote.nameNewUser}</td>
                        <td>${quote.emailNewUser}</td>
                        <td>${quote.numberPhone}</td>
                        <td>${quote.information}</td>
                        <td>${quote.status ? '<i class="fa-solid fa-check" style="color: green;"></i>' : '<i class="fa-solid fa-times" style="color: red;"></i>'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="updateQuote(${quote.Id}, '${quote.nameNewUser}', '${quote.emailNewUser}', '${quote.numberPhone}', '${quote.information}')"><i class="fa-solid fa-pencil"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteQuote(${quote.Id})"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>`;
            });

            $('#tableBody_quotes').html(content);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            hideLoader();
        }
    };

    
    updateQuote = async (id, name, email, phone, information) => {
        console.log('ID recibido:', id); 
        if (!id) {
            console.error('El ID de la cotización es inválido');
            Swal.fire('Error', 'ID de cotización no válido.', 'error');
            return; 
        }

        const { value: formValues } = await Swal.fire({
            title: 'Actualizar Cotización',
            html: `
                <input id="name" class="swal2-input" placeholder="Nombre" value="${name}">
                <input id="email" class="swal2-input" placeholder="Email" value="${email}">
                <input id="phone" class="swal2-input" placeholder="Número de Teléfono" value="${phone}">
                <textarea id="information" class="swal2-textarea" placeholder="Información">${information}</textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    information: document.getElementById('information').value,
                };
            }
        });

        if (formValues) {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/updateQuotes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                });

                if (response.ok) {
                    Swal.fire('Actualizado!', 'La cotización ha sido actualizada.', 'success');
                    fetchQuotes(); 
                } else {
                    throw new Error('Error al actualizar la cotización');
                }
            } catch (error) {
                console.error('Error updating quote:', error);
                Swal.fire('Error', 'No se pudo actualizar la cotización.', 'error');
            }
        }
    };

   
    deleteQuote = async (id) => {
        if (!id) {
            console.error('El ID de la cotización es inválido');
            Swal.fire('Error', 'ID de cotización no válido.', 'error');
            return; // Sale de la función si el ID es inválido
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
                const response = await fetch(`http://localhost:3001/api/v1/deleteQuotes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire('Eliminado!', 'La cotización ha sido eliminada.', 'success');
                    fetchQuotes(); // Refrescar la lista de cotizaciones
                } else {
                    throw new Error('Error al eliminar la cotización');
                }
            } catch (error) {
                console.error('Error deleting quote:', error);
                Swal.fire('Error', 'No se pudo eliminar la cotización.', 'error');
            }
        }
    };

    fetchQuotes();
});
