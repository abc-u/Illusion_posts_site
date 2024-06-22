const grid = document.getElementById('grid');
const colors = ['white', 'black'];

const socket = new WebSocket('ws://localhost:8000');

socket.onmessage = event => {
  const squares = JSON.parse(event.data);
  squares.forEach(square => {
    const div = document.getElementById(`square-${square.id}`);
    if (div) {
      div.style.backgroundColor = square.color;
    }
  });
};

const createGrid = () => {
  for (let i = 0; i < 25; i++) {
    const div = document.createElement('div');
    div.className = 'square';
    div.id = `square-${i}`;
    div.dataset.id = i;
    div.addEventListener('click', changeColor); // クリックイベントを追加
    grid.appendChild(div);
  }
};

const changeColor = (event) => {
  const square = event.target;
  const currentColor = square.style.backgroundColor;
  const newColor = currentColor === 'white' ? 'black' : 'white';
  square.style.backgroundColor = newColor;
  socket.send(JSON.stringify({ id: square.dataset.id, color: newColor }));
};

const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const username = document.getElementById('username').value;
  const gridData = [];
  for (let i = 0; i < 25; i++) {
    const square = document.getElementById(`square-${i}`);
    gridData.push({ id: i, color: square.style.backgroundColor });
  }
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, username, gridData }),
  }).then(response => response.json())
    .then(data => {
      console.log('成功:', data); // 成功時のログ
      alert('投稿が完了しました');
    }).catch(error => {
      console.error('エラー:', error); // エラー時のログ
    });
});

createGrid();
