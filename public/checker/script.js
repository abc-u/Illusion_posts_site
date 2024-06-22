document.addEventListener('DOMContentLoaded', () => {
    const shadowSlider = document.getElementById('shadowSlider');
    const shadowTiles = document.querySelectorAll('.shadow-tile');

    shadowSlider.addEventListener('input', (event) => {
        const value = event.target.value;
        shadowTiles.forEach(tile => {
            const isDark = tile.classList.contains('dark-shadow');
            tile.style.backgroundColor = isDark ? `rgba(0, 0, 0, ${value / 200})` : `rgba(255, 255, 255, ${value / 200})`;
        });
    });
});