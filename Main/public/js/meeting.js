document.addEventListener('DOMContentLoaded', async function () {
  generateCalendarColumns();
});

const currentDate = new Date(startDate.replace(/-/g, '\/').replace(/T.+/, ''));
const calendarRow = document.getElementById('calendar-row');
console.log(startDate);
console.log(currentDate);
console.log(potentialTimes);
function generateCalendarColumns() {
  calendarRow.innerHTML = '';

  // Generate columns for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const monthElement = document.getElementById('month');
    const monthName = currentDate.toLocaleDateString('en-US', {
      month: 'short',
    });
    monthElement.textContent = `${monthName}`;
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
            <div class="row"><div class="time">12 PM</div></div>
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
  columnContent.forEach((column, columnIndex) => {
    const rowList = column.querySelector('.row-list');
    const rows = rowList.querySelectorAll('.row');

    rows.forEach((row, rowIndex) => {
      const timeElement = row.querySelector('.time');
      const time = timeElement.textContent.trim();

      const columnDate = new Date(currentDate);
      columnDate.setDate(currentDate.getDate() + columnIndex - 1);

      const isAvailable = potentialTimes.some((slot) => {
        const slotDate = new Date(slot.date);
        slotDate.setDate(slotDate.getDate());
        return (
          slotDate.getFullYear() === columnDate.getFullYear() &&
          slotDate.getMonth() === columnDate.getMonth() &&
          slotDate.getDate() === columnDate.getDate() &&
          slot.time === time
        );
      });

      if (isAvailable) {
        row.classList.add('highlighted');
        column.querySelector('.row-list').style.display = 'flex';
      }
      console.log(isAvailable);
    });

    column.addEventListener('mouseenter', () => {
      column.querySelector('.row-list').style.display = 'flex';
    });

    column.addEventListener('mouseleave', () => {
      const rowList = column.querySelector('.row-list');
      if (!rowList.querySelector('.highlighted')) {
        if (!rowList.querySelector('.highlighted2')) {
          rowList.style.display = 'none';
        }
      }
    });
  });

  const rows = document.querySelectorAll('.row-list .row');
  let isDragging = false;
  let highlight2 = false;

  rows.forEach((row) => {
    row.addEventListener('mousedown', (event) => {
      isDragging = true;
      highlight2 = !row.classList.contains('highlighted2');
      row.classList.toggle('highlighted2');
    });

    row.addEventListener('mousemove', (event) => {
      if (isDragging) {
        row.classList.toggle('highlighted2', highlight2);
      }
    });

    row.addEventListener('mouseup', () => {
      isDragging = false;
      highlight2 = false;
    });
  });
}

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');
};
function getHighlighted2Slots() {
  const highlightedSlots = [];

  const highlightedRows = document.querySelectorAll('.row.highlighted2');
  highlightedRows.forEach((row) => {
    const dayElement = row.closest('.col-auto');
    const dayIndex = Array.from(dayElement.parentNode.children).indexOf(
      dayElement,
    );

    const date = new Date();
    date.setDate(currentDate.getDate());

    console.log(date.getDate() + dayIndex);
    date.setDate(date.getDate() + dayIndex);
    console.log(date);
    const timeElement = row.querySelector('.time');
    const time = timeElement.textContent.trim();

    highlightedSlots.push({
      date: date.yyyymmdd(),
      time: time,
    });
  });

  return highlightedSlots;
}

document
  .getElementById('update-availability-button')
  .addEventListener('click', async function () {
    const highlightedSlots = getHighlighted2Slots();
    if(highlightedSlots.length !== 0){
      var name = prompt('Please enter your name:');
      console.log(highlightedSlots)
      if (name) {

        const meetingHash = window.location.pathname.split('/').pop();

        const userData = {
          name: name,
          meeting_hash: meetingHash,
          potential_times: highlightedSlots,
        };

        try {
          const response = await fetch('/api/users/update-availability', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            alert('Availability updated successfully!');
            location.reload(); // Reload the page to reflect the updated availability
          } else {
            console.error('Failed to update availability');
            alert('An error occurred while updating availability.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert(
            'An error occurred while updating availability. Please try again.',
          );
        }
      } else {
        alert('Please enter your name to update availability.');
      }
    }
    else {
      alert('Please select time slots to add availability.');
    }
  });

document
  .getElementById('toggle-participants-button')
  .addEventListener('click', function () {
    var participantsContainer = document.getElementById(
      'participants-container',
    );
    if (participantsContainer.style.display === 'none') {
      participantsContainer.style.display = 'block';
      this.textContent = 'Hide Participants';
    } else {
      participantsContainer.style.display = 'none';
      this.textContent = 'Show Participants';
    }
  }
);

  document.getElementById('zoom-meeting-button').addEventListener('click', async function () {
    if (potentialTimes.length === 0) {
      alert('No common time slots available to create a Zoom meeting.');
      return;
    }
  
    const selectedTime = potentialTimes[0];
    const meetingHash = window.location.pathname.split('/').pop();
  
    try {
      const response = await fetch(`/api/meetings/${meetingHash}/zoom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commonTimes: [selectedTime] }),
      });
  
      if (response.ok) {
        const zoomMeetingData = await response.json();
        // Handle the Zoom meeting data (e.g., display the join URL)
        alert(`Zoom meeting created successfully! Link: ${zoomMeetingData.join_url}`);
      } else {
        console.error('Failed to create Zoom meeting');
        alert('An error occurred while creating the Zoom meeting.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the Zoom meeting. Please try again.');
    }
  });