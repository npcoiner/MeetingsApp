document.addEventListener('DOMContentLoaded', function() {
    generateCalendarColumns();
});

// Get the current date
let currentDate = new Date();

// Get the calendar row element
const calendarRow = document.getElementById('calendar-row');

// Get the previous and next buttons
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Function to generate the calendar columns
function generateCalendarColumns() {
    calendarRow.innerHTML = '';

    // Generate columns for the next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = date.getDate();

        const columnHtml = `
            <div class="col-auto">
                <div class="column-content">
                    <div class="day-date">${dayDate}</div>
                    <div class="day-name">${dayName}</div>
                    <div class="row-list" style="display: none;">
                        <div class="row"><div class="time">6 AM</div></div>
                        <div class="row"><div class="time">7 AM</div></div>
                        <div class="row"><div class="time">8 AM</div></div>
                        <div class="row"><div class="time">9 AM</div></div>
                        <div class="row"><div class="time">10 AM</div></div>
                        <div class="row"><div class="time">11 AM</div></div>
                        <div class="row"><div class="time">12 AM</div></div>
                        <div class="row"><div class="time">1 PM</div></div>
                        <div class="row"><div class="time">2 PM</div></div>
                        <div class="row"><div class="time">3 PM</div></div>
                        <div class="row"><div class="time">4 PM</div></div>
                        <div class="row"><div class="time">5 PM</div></div>
                        <div class="row"><div class="time">6 PM</div></div>
                    </div>
                </div>
            </div>
        `;

        calendarRow.innerHTML += columnHtml;
    }

    const columnContent = document.querySelectorAll('.column-content');
    columnContent.forEach(column => {
        column.addEventListener('mouseenter', () => {
            column.querySelector('.day-name').style.display = 'none';
            column.querySelector('.day-date').style.display = 'none';
            column.querySelector('.row-list').style.display = 'flex';
        });

        column.addEventListener('mouseleave', () => {
            const rowList = column.querySelector('.row-list');
            if (!rowList.querySelector('.highlighted')) {
                column.querySelector('.day-name').style.display = 'block';
                column.querySelector('.day-date').style.display = 'block';
                rowList.style.display = 'none';
            }
        });
    });

    const rows = document.querySelectorAll('.row-list .row');
    let isDragging = false;
    let highlight = false;

    rows.forEach(row => {
        row.addEventListener('mousedown', (event) => {
            isDragging = true;
            highlight = !row.classList.contains('highlighted');
            row.classList.toggle('highlighted');
        });

        row.addEventListener('mousemove', (event) => {
            if (isDragging) {
                row.classList.toggle('highlighted', highlight);
            }
        });

        row.addEventListener('mouseup', () => {
            isDragging = false;
            highlight = false;
        });
    });

    prevButton.removeEventListener('click', handlePrevButtonClick);
    nextButton.removeEventListener('click', handleNextButtonClick);

    prevButton.addEventListener('click', handlePrevButtonClick);
    nextButton.addEventListener('click', handleNextButtonClick);
}

function handlePrevButtonClick() {
    currentDate.setDate(currentDate.getDate() - 7);
    generateCalendarColumns();
}

function handleNextButtonClick() {
    currentDate.setDate(currentDate.getDate() + 7);
    generateCalendarColumns();
}