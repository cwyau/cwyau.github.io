const tiles = document.querySelectorAll('.tilesrow-tile');

const options = {
  threshold: 0.6  // 60% of the screen to activate
};

console.log('init. adding active');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('adding active');
      tiles.forEach(t => t.classList.remove('active'));
      entry.target.classList.add('active');
    }
  });
}, options);

tiles.forEach(tile => observer.observe(tile));