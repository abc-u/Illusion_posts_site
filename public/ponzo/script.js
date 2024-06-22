document.addEventListener('DOMContentLoaded', () => {
    const distanceSlider = document.getElementById('distanceSlider');
    const angleSlider = document.getElementById('angleSlider');
    const positionSlider = document.getElementById('positionSlider');
    const lengthSlider = document.getElementById('lengthSlider');
    const movableLine = document.getElementById('movable-line');
    const fixedLine = document.getElementById('fixed-line');
    const leftLine = document.getElementById('left-line');
    const rightLine = document.getElementById('right-line');

    // 初期値の設定
    const initialDistanceValue = distanceSlider.value;
    const initialAngleValue = angleSlider.value;
    const initialPositionValue = positionSlider.value;
    const initialLengthValue = lengthSlider.value;

    const setMovableLinePosition = (value) => {
        const maxMovement = fixedLine.offsetTop - movableLine.offsetTop;
        const newPosition = (maxMovement * value) / 100;
        movableLine.style.transform = `translateY(${newPosition}px)`;
    };

    const setAngle = (value) => {
        leftLine.style.transform = `rotate(${value - 90}deg)`;
        rightLine.style.transform = `rotate(${90 - value}deg)`;
    };

    const setPosition = (value) => {
        const newPosition = (value - 50) * 0.4;
        leftLine.style.left = `${35 - newPosition}%`;
        rightLine.style.right = `${35 - newPosition}%`;
    };

    const setLength = (value) => {
        movableLine.style.width = `${value}%`;
        fixedLine.style.width = `${value}%`;
    };

    setMovableLinePosition(initialDistanceValue);
    setAngle(initialAngleValue);
    setPosition(initialPositionValue);
    setLength(initialLengthValue);

    distanceSlider.addEventListener('input', (event) => {
        setMovableLinePosition(event.target.value);
    });

    angleSlider.addEventListener('input', (event) => {
        setAngle(event.target.value);
    });

    positionSlider.addEventListener('input', (event) => {
        setPosition(event.target.value);
    });

    lengthSlider.addEventListener('input', (event) => {
        setLength(event.target.value);
    });
});
