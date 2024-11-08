document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const reservedList = document.getElementById('reserved-list');
    const reservationMessage = document.getElementById('reservation-message');
    const monthImage = document.getElementById('month-image');
    let currentDate = new Date();
    const reservedDates = new Map();

    //? Imágenes de cada mes
    const images = {
        0: 'https://i.pinimg.com/736x/87/18/74/87187431766fdf9cd3311954c8ac6336.jpg',
        1: 'https://th.bing.com/th/id/R.c943b6ff24fad261990a49642dc2a7dd?rik=O7Dp11eqHXiDuw&pid=ImgRaw&r=0',
        2: 'https://i.pinimg.com/originals/11/02/f5/1102f578cfc3c7877c82141ddec33de5.jpg',
        3: 'https://th.bing.com/th/id/R.47b0271e6025215430b93f00dcca4daa?rik=3nSxmAHx5Rp9EQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-tfvsvMV7HFk%2fT3s68St_0iI%2fAAAAAAAAYxw%2fSnvgKR9a5lY%2fs1600%2fPaisajes-de-Invierno_Winter-Landscapes_06.jpg&ehk=lMIgQq99ltAnP7YU98ju68xSPbAZ%2bmODAqJnOiNS48A%3d&risl=&pid=ImgRaw&r=0',
        4: 'https://mott.pe/noticias/wp-content/uploads/2019/03/los-50-paisajes-maravillosos-del-mundo-para-tomar-fotos.jpg',
        5: 'https://estaticos-cdn.prensaiberica.es/clip/6f7a9673-cd2e-4a39-ad3b-42bff0623e84_woman-libre-1200_default_0.jpg',
        6: 'https://fotografias.antena3.com/clipping/cmsimages01/2021/06/18/12D54CCC-7F5B-42A5-86CB-0ACF60FDDCF4/98.jpg?crop=1280,720,x0,y0&width=1900&height=1069&optimize=low&format=webply',
        7: 'https://cdn.diferenciador.com/imagenes/tree-summer-cke.jpg',
        8: 'https://p4.wallpaperbetter.com/wallpaper/151/313/143/awesome-tropical-beach-hd-wallpaper-wallpaper-preview.jpg',
        9: 'https://th.bing.com/th/id/R.f1fb4f1638ebd61e14c76c059504382f?rik=DnL5D5JFrM3Hag&pid=ImgRaw&r=0',
        10: 'https://p4.wallpaperbetter.com/wallpaper/181/439/732/8k-uhd-fall-picture-wallpaper-preview.jpg',
        11: 'https://us.123rf.com/450wm/tverdohlib/tverdohlib2312/tverdohlib231200395/219226523-hojas-secas-amarillas-cubiertas-de-escarcha-las-ramas-del-%C3%A1rbol-cubiertas-de-escarcha-las-vacaciones.jpg?ver=6'
    };
    
    //? Cargar reservas desde localStorage
    function loadReservations() {
        const userId = localStorage.getItem('userId'); 
        const storedReservations = localStorage.getItem('reservations');
    
        
        if (userId && storedReservations) {
            const parsedReservations = JSON.parse(storedReservations);
            for (const [date, reservation] of Object.entries(parsedReservations)) {
                reservedDates.set(date, reservation);
            }
        }
    }
    

    function saveReservations() {
        localStorage.setItem('reservations', JSON.stringify(Object.fromEntries(reservedDates)));
        const lastReservation = Array.from(reservedDates.entries()).pop();
        if (lastReservation) {
            const formattedDate = lastReservation[0]; 
            const [day, month, year] = formattedDate.split('/'); 
            const dataToSend = {
                fkUser: localStorage.getItem('userId'),
                numberPhone: lastReservation[1].phoneNumber, 
                direction: lastReservation[1].address,       
                ScheduledDate: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
                city: lastReservation[1].city,
                typeService: lastReservation[1].serviceType,
                document: lastReservation[1].documentNumber,
                fullName: lastReservation[1].fullName 
            };
            sendReservationsToBackend(dataToSend);
        }
    }
    
    //? Enviar reservas al backend
    async function sendReservationsToBackend(reservations) {
        try {
            const response = await fetch('http://localhost:3001/api/v1/saveSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservations),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text(); 
                throw new Error(`Error ${response.status}: ${errorMessage}`);
            }
    
            const result = await response.json();
            console.log("Reserva exitosa:", result); 
        } catch (error) {
            console.error("Error al enviar reservas:", error);
        }
    }
    

    
    function renderReservations() {
        reservedList.innerHTML = '';
        reservedDates.forEach((reservation, date) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${date}: ${reservation.fullName} (${reservation.serviceType})`;
            reservedList.appendChild(listItem);
        });
    }

    
    function updateMonthImage(month) {
        monthImage.src = images[month] || '';
    }

    
    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
        updateMonthImage(month);
        calendarDays.innerHTML = '';

        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const fragment = document.createDocumentFragment();

        dayNames.forEach(name => {
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'day-name';
            dayNameElement.textContent = name;
            fragment.appendChild(dayNameElement);
        });

        for (let i = 0; i < firstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.className = 'day blank';
            fragment.appendChild(blankDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (reservedDates.has(dateStr)) {
                dayElement.classList.add('disabled');
            }

            dayElement.addEventListener('click', () => handleDayClick(day, month, year, dayElement));

            fragment.appendChild(dayElement);
        }

        calendarDays.appendChild(fragment);
    }

    //? Manejar clic en un día del calendario
    function handleDayClick(day, month, year, dayElement) {
        if (dayElement.classList.contains('disabled')) return;

        Swal.fire({
            title: 'Reserva',
            html: `
                <input id="fullName" placeholder="Nombre completo" />
                <input id="documentNumber" placeholder="Número de documento" />
                <input id="address" placeholder="Dirección" />
                <input id="city" placeholder="Ciudad" />
                <input id="phoneNumber" placeholder="Teléfono" />
                <select id="serviceType">
                    <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
                    <option value="Mantenimiento correctivo">Mantenimiento correctivo</option>
                </select>
            `,
            confirmButtonText: 'Reservar',
            showCancelButton: true,
            preConfirm: () => {
                return {
                    date: `${day}/${month + 1}/${year}`,
                    fullName: document.getElementById('fullName').value,
                    documentNumber: document.getElementById('documentNumber').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    phoneNumber: document.getElementById('phoneNumber').value,
                    serviceType: document.getElementById('serviceType').value
                };
            }
        }).then(result => {
            if (result.isConfirmed) {
                const { date, fullName, documentNumber, address, city, phoneNumber, serviceType } = result.value;

                if (!reservedDates.has(date)) {
                    reservedDates.set(date, { fullName, documentNumber, address, city, phoneNumber, serviceType });
                    saveReservations();
                    renderReservations();
                    renderCalendar();
                    Swal.fire('Reservado!', '', 'success');
                } else {
                    Swal.fire('Este día ya está reservado.', '', 'error');
                }
            }
        });
    }

    
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    loadReservations();
    renderCalendar();
    renderReservations();
});
