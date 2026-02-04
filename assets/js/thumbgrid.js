/**
 * Render thumbnails grid. The grid container contains only <img> that may be wrapped by <a>...</a>
 *
 * @param {string} elementId - Element ID of the grid container of the thumbnail images
 * @param {string} minW - minimum width of thumbnail, in px
 * @param {string} maxW - maximum width of thumbnail, in px
 * @param {string} gap - size of gap between thumbnails, in px
 * @param {string} rowH - height of thumbnail, in px
 * @param {string} maxCols - maximum number of thumbnails per row
 * @param {string} maxRows - maximum number of rows
 */

function updateThumbGrid(elementId, minW, maxW, gap, rowH, maxCols, maxRows) {
    const grid = document.getElementById(elementId);
    let moreMark = grid.querySelector('.thumbGrid-moreMark');
    const thumbnails = Array.from(grid.querySelectorAll(':scope > *:not(.thumbGrid-moreMark)'));
    // const thumbnails = Array.from(grid.querySelectorAll('img'));

    // Step 1: Update the griding based on the size parameters and the available size.

    // Update maxCols if the available size is too small
    const availableW = grid.parentElement.clientWidth;
    let new_maxCols = Math.floor((availableW + gap) / (minW + gap));
    new_maxCols = Math.max(1, Math.min(new_maxCols, maxCols));

    // Final container width that reflects the new_maxCols
    const gridMaxWidth = (new_maxCols * maxW) + ((new_maxCols - 1) * gap);

    // Apply griding styles
    Object.assign(grid.style, {
        gap: `${gap}px`,
        gridAutoRows: `${rowH}px`,
        gridTemplateColumns: `repeat(${new_maxCols}, minmax(${minW}px, ${maxW}px))`,
        maxWidth: `${gridMaxWidth}px`,
        // maxHeight: `${rowH * maxRows + gap * (maxRows - 1)}px`
    });

    // Step 2: Show only thumbnails within the capacity

    // Find out if the More Mark is needed and the how many thumbnails to show
    const capacity = new_maxCols * maxRows;
    const needsMore = thumbnails.length > capacity;
    const showLimit = needsMore ? capacity - 1 : thumbnails.length;

    // Actually hide the thumbnails beyond the showLimit
    thumbnails.forEach((thumb, index) => {
        if (index >= showLimit) {
            thumb.classList.add('thumbGrid-hiddenThumb');
        } else {
            thumb.classList.remove('thumbGrid-hiddenThumb');
        }
    });

    // Step 3: Create / update / remove the More Mark as needed
    if (needsMore) {
        if (!moreMark) {
            moreMark = document.createElement('div');
            moreMark.className = 'thumbGrid-moreMark';
            grid.appendChild(moreMark);
        }
        moreMark.innerText = `+${thumbnails.length - showLimit}`;

        // What to do when clicking the More mark.
        gallery = window.galleryRegistry[elementId];
        switch (gallery.name) {
          case 'glightbox':
            moreMark.addEventListener('click', function() {
              gallery.instance.reload();
              gallery.instance.open();
            });
            break;
        }
    } else if (moreMark) {
        moreMark.remove();
        moreMark = null;
    }
}


// document.getElementById('your-div-id').addEventListener('click', function() {
//     // Check if the object and function exist to prevent errors
//     if (typeof abc !== 'undefined' && typeof abc.open === 'function') {
//         abc.open();
//     }
// });
