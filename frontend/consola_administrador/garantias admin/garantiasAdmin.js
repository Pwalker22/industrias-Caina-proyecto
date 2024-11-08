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

    await fetchWarranty();

    dataTable = $("#datatable_warranty").DataTable(dataTableOptions); 
    dataTableIsInitialized = true;
};

const fetchWarranty = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/v1/warranty'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const warranties = responseData.data || [];
        let content = '';

        warranties.forEach((warranty, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${warranty.description}</td>
                    <td>${warranty.clientNumber}</td>
                    <td>${warranty.brand}</td>
                    <td>${warranty.place}</td>
                </tr>`;
        });

        const tableBody_warranty = document.getElementById('tableBody_warranty'); 
        if (tableBody_warranty) {
            tableBody_warranty.innerHTML = content;
        } else {
            console.error('Elemento tableBody_warranty no encontrado');
        }
    } catch (error) {
        console.error('Error fetching warranties:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await initDataTable();
});
