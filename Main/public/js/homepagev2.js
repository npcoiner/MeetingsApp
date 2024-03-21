document.addEventListener('DOMContentLoaded', function () {
  generateCalendarColumns();
});

// Get the current date
let currentDate = new Date();

// Get the calendar row element
const calendarRow = document.getElementById('calendar-row');

// Get the previous and next buttons
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
function updateMonthHeader() {
  const monthElement = document.getElementById('month');
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
  monthElement.textContent = `${monthName}`;
}
// Function to generate the calendar columns
function generateCalendarColumns() {
  calendarRow.innerHTML = '';
  updateMonthHeader();
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
  columnContent.forEach((column) => {
    column.addEventListener('mouseenter', () => {
      column.querySelector('.row-list').style.display = 'flex';
    });

    column.addEventListener('mouseleave', () => {
      const rowList = column.querySelector('.row-list');
      if (!rowList.querySelector('.highlighted')) {
        rowList.style.display = 'none';
      }
    });
  });

  const rows = document.querySelectorAll('.row-list .row');
  let isDragging = false;
  let highlight = false;

  rows.forEach((row) => {
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
  currentDate.setDate(currentDate.getDate() - 1);
  generateCalendarColumns();
}

function handleNextButtonClick() {
  currentDate.setDate(currentDate.getDate() + 1);
  generateCalendarColumns();
}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};

function getHighlightedSlots() {
  const highlightedSlots = [];

  const highlightedRows = document.querySelectorAll('.row.highlighted');
  highlightedRows.forEach((row) => {
    const dayElement = row.closest('.col-auto');
    const dayIndex = Array.from(dayElement.parentNode.children).indexOf(
      dayElement,
    );

    const date = new Date(currentDate);
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
  .getElementById('create-meeting-button')
  .addEventListener('click', async function () {
    const highlightedSlots = getHighlightedSlots();
    if(highlightedSlots.length !== 0){
      var name = prompt('Please enter your name:');
    if (name) {
      

      const startDate = highlightedSlots[0].date;
      console.log('PLEASEE:');
      console.log(highlightedSlots);
      const meetingData = {
        title: 'New Meeting',
        description: 'Meeting description',
        potential_times: highlightedSlots,
        start_date: startDate,
      };

      try {
        const response = await fetch('/api/meetings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingData),
        });
        if (response.ok) {
          const createdMeeting = await response.json();
          const meetingId = createdMeeting.hash;

          const userData = {
            name: name,
            meeting_hash: meetingId,
            potential_times: highlightedSlots,
          };

          const userResponse = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (userResponse.ok) {
            // Generate the shareable meeting link
            const meetingLink = `${window.location.origin}/meeting/${meetingId}`;

            // Display the meeting link to the user
            alert(
              `Meeting created successfully! Share this link: ${meetingLink}`,
            );

            // Redirect the user to the meeting page
            document.location.replace('/meeting/' + meetingId);
          } else {
            // Handle error response for user creation
            console.error('Failed to create user');
            alert('An error occurred while creating the user.');
          }
        } else {
          // Handle error response for meeting creation
          console.error('Failed to create meeting');
          alert('Please login');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(
          'An error occurred while creating the meeting. Please try again.',
        );
      }
    } else {
      alert('Please enter your name to create a meeting.');
    }
    }
    else {
      alert('Please select time slots for the meeting.');
    }
    
  });
