let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [] }
    ],
    pageLength: 5,
    destroy: true,
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

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await fetchComplaints();

    dataTable = $("#datatable_complaints").DataTable(dataTableOptions); 
    dataTableIsInitialized = true;
};

const fetchComplaints = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/v1/complaints'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const complaints = responseData.data || [];
        let content = '';

        complaints.forEach((complaint, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${complaint.description}</td>
                    <td>${complaint.client}</td>
                    <td>${complaint.phoneNumber}</td>
                    <td>${complaint.ComplaintType}</td>
                </tr>`;
        });

        const tableBody_complaints = document.getElementById('tableBody_complaints'); 
        if (tableBody_complaints) {
            tableBody_complaints.innerHTML = content;
        } else {
            console.error('Elemento tableBody_complaints no encontrado');
        }
    } catch (error) {
        console.error('Error fetching complaints:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await initDataTable();
});
