document.addEventListener('DOMContentLoaded', () => {
    const effectSlider = document.getElementById('effectSlider');
    const canvas = document.getElementById('muller-lyer-canvas');
    const ctx = canvas.getContext('2d');
    const maxSliderValue = effectSlider.max;

    // キャンバスの高さを調整
    canvas.width = 800;
    canvas.height = 500;

    function drawMullerLyer(position) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 上の棒
        const upperLineY = 100 + (position / maxSliderValue) * 300; // 位置を調整
        drawLineWithArrows(ctx, 200, upperLineY, 600, upperLineY, true);
        
        // 下の棒
        const lowerLineY = 400; // 棒の距離を広げる
        drawLineWithArrows(ctx, 200, lowerLineY, 600, lowerLineY, false);
    }

    function drawLineWithArrows(ctx, x1, y1, x2, y2, outward) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 4; // 線を太くする
        ctx.strokeStyle = 'black'; // 線の色を黒にする
        ctx.stroke();
        
        const arrowLength = 20; // 矢印の長さを20に変更
        const angle = Math.PI / 4;
        
        if (outward) {
            // 上の棒 (外向きの矢印)
            drawArrow(ctx, x1, y1, -angle, arrowLength);
            drawArrow(ctx, x1, y1, angle, arrowLength);
            drawArrow(ctx, x2, y2, Math.PI - angle, arrowLength);
            drawArrow(ctx, x2, y2, Math.PI + angle, arrowLength);
        } else {
            // 下の棒 (内向きの矢印)
            drawArrow(ctx, x1, y1, Math.PI + angle, arrowLength);
            drawArrow(ctx, x1, y1, Math.PI - angle, arrowLength);
            drawArrow(ctx, x2, y2, angle, arrowLength);
            drawArrow(ctx, x2, y2, -angle, arrowLength);
        }
    }

    function drawArrow(ctx, x, y, angle, length) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
        ctx.lineWidth = 4; // 矢印も太くする
        ctx.strokeStyle = 'black'; // 矢印の色も黒にする
        ctx.stroke();
    }

    effectSlider.addEventListener('input', (event) => {
        const value = event.target.value;
        drawMullerLyer(value);
    });

    // 初期描画
    drawMullerLyer(0); // 初期位置は0
});
