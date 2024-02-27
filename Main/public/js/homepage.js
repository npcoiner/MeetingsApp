document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is loaded
    const columnContent = document.querySelectorAll('.column-content');

    columnContent.forEach(column => {
        column.addEventListener('mouseenter', () => { // Mouse Hovering in
            column.querySelector('.day-name').style.display = 'none';
            column.querySelector('.day-date').style.display = 'none';
            column.querySelector('.row-list').style.display = 'flex';
        });

        column.addEventListener('mouseleave', () => { // Mouse Leaving
            column.querySelector('.day-name').style.display = 'block'; 
            column.querySelector('.day-date').style.display = 'block';
            column.querySelector('.row-list').style.display = 'none';
        });
    });


    const rows = document.querySelectorAll('.row-list .row');
    let isDragging = false;

    let highlight = false;
    document.addEventListener('mousedown', (event) => {
        isDragging = true; 
        const targetRow = event.target.closest('.row'); 
        if (targetRow) {
            if (targetRow.classList.contains('highlighted')){
                targetRow.classList.remove('highlighted')
            }
            else{
                highlight = true;
                targetRow.classList.add('highlighted');
            }
            
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const currentRow = event.target.closest('.row');
            if (currentRow) {
                if (highlight){
                    currentRow.classList.add('highlighted'); 
                }else{
                    if(currentRow.classList.contains('highlighted')){
                        currentRow.classList.remove('highlighted')
                    }
                }
             
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false; 
        highlight = false;
    });
});

