document.addEventListener('DOMContentLoaded', () => {
    const effectSlider = document.getElementById('effectSlider');
    const illusionContainer = document.getElementById('illusion-container');

    effectSlider.addEventListener('input', (event) => {
        const value = event.target.value;
        // 錯視デモの効果を調整するためのコードをここに追加
        console.log(`Slider value: ${value}`);
    });
});
