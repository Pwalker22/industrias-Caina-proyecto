async function loadAndDisplayReservations() {
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
        console.error("No se encontró el ID del usuario en el almacenamiento local");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/v1/getScheduling/${userId}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache' 
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const result = await response.json();
        displayReservations(result.data); 
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        const reservationsContainer = document.getElementById('reservations-container');
        reservationsContainer.innerText = 'No tienes reservas'; 
    }
}

function displayReservations(reservations) {
    const reservationsContainer = document.getElementById('reservations-container');
    reservationsContainer.innerHTML = '';

    if (reservations.length === 0) {
        reservationsContainer.innerText = 'No tienes reservas disponibles. Por favor, crea una ya.';
        return;
    }

    reservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.classList.add('reservation-item');
        reservationElement.innerHTML = `
            <h3>Servicio: ${reservation.typeService}</h3>
            <p><strong>Fecha:</strong> ${reservation.ScheduledDate}</p>
            <p><strong>Nombre:</strong> ${reservation.fullName}</p>
            <p><strong>Documento:</strong> ${reservation.document}</p>
            <p><strong>Dirección:</strong> ${reservation.direction}</p>
            <p><strong>Ciudad:</strong> ${reservation.city}</p>
            <p><strong>Teléfono:</strong> ${reservation.numberPhone}</p>
        `;
        reservationsContainer.appendChild(reservationElement);
    });
}

document.addEventListener('DOMContentLoaded', loadAndDisplayReservations);
