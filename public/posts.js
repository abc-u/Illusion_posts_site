fetch('/posts')
  .then(response => response.json())
  .then(posts => {
    const postsContainer = document.getElementById('posts-container');
    posts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      const title = document.createElement('h2');
      title.textContent = post.title;
      const username = document.createElement('p');
      username.textContent = `投稿者: ${post.username}`;
      const grid = document.createElement('div');
      grid.className = 'grid';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(5, 40px)';
      grid.style.gridTemplateRows = 'repeat(5, 40px)';
      grid.style.gap = '5px';
      post.gridData.forEach(square => {
        const div = document.createElement('div');
        div.className = 'square';
        div.style.backgroundColor = square.color;
        div.style.border = '1px solid black';
        div.style.width = '40px';
        div.style.height = '40px';
        grid.appendChild(div);
      });
      postDiv.appendChild(title);
      postDiv.appendChild(username);
      postDiv.appendChild(grid);
      postsContainer.appendChild(postDiv);
    });
  }).catch(error => {
    console.error('Error:', error);
  });
