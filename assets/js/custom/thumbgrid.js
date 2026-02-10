document.querySelectorAll('.thumbGrid').forEach((grid) => {
  const glightbox = GLightbox({
    selector: `.${grid.id}`,
    preload: false,
    descPosition: 'bottom'
  })

  updateThumbGridWrapper = function(){ updateThumbGrid(grid, glightbox); };
  window.addEventListener('resize', updateThumbGridWrapper);
  updateThumbGridWrapper();
});

/**
 * Render thumbnails grid. The grid container contains only <img> that may be wrapped by <a>...</a>
 *
 * @param {object} grid - The object of a .thumbGrid element
 * @param {object} glightbox - The ThumbGrid's GLightBox object
 */

function updateThumbGrid(grid, glightbox) {
    const tWidth  = parseInt(grid.dataset.twidth, 10) || 90;
    const tHeight = parseInt(grid.dataset.theight, 10) || 90;
    const gap     = parseInt(grid.dataset.gap, 10) || 10;
    const maxCols = parseInt(grid.dataset.rowheight, 10) || 5;
    const maxRows = parseInt(grid.dataset.cols, 10) || 1;
    let moreMark = grid.querySelector('.thumbGrid-moreMark');
    const thumbnails = Array.from(grid.querySelectorAll(':scope > *:not(.thumbGrid-moreMark)'));

    // Step 1: Update the griding based on the size parameters and the available size.

    // Update maxCols if the available size is too small
    const availableW = grid.parentElement.clientWidth;
    let new_maxCols = Math.floor((availableW + gap) / (tWidth + gap));
    new_maxCols = Math.max(1, Math.min(new_maxCols, maxCols));

    // Final container width that reflects the new_maxCols
    const gridMaxWidth = (new_maxCols * tWidth) + ((new_maxCols - 1) * gap);
    const gridMaxHeight = (maxRows * tHeight) + ((maxRows - 1) * gap);

    // Apply griding styles
    Object.assign(grid.style, {
        gap: `${gap}px`,
        gridAutoRows: `${tHeight}px`,
        gridTemplateColumns: `repeat(${new_maxCols}, minmax(0, ${tWidth}px))`,
        maxWidth: `${gridMaxWidth}px`,
        maxHeight: `${gridMaxHeight}px`
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
        moreMark.addEventListener('click', function() {
          glightbox.reload();
          glightbox.open();
        });
    } else if (moreMark) {
        moreMark.remove();
        moreMark = null;
    }
}
