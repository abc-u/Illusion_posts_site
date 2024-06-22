document.addEventListener('DOMContentLoaded', () => {
    const distanceSlider = document.getElementById('distanceSlider');
    const movableCircle = document.getElementById('movable-circle');
    const rightIllusion = document.getElementById('right-illusion');
    const leftIllusion = document.getElementById('left-illusion');

    distanceSlider.addEventListener('input', (event) => {
        const value = event.target.value;
        const leftIllusionRect = leftIllusion.getBoundingClientRect();
        const rightIllusionRect = rightIllusion.getBoundingClientRect();
        const maxMovement = rightIllusionRect.left - leftIllusionRect.left;

        const newPosition = (maxMovement * value) / 100;
        movableCircle.style.transform = `translateX(${newPosition}px)`;
    });
});
