'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');

const db = new sqlite3.Database('./database.sqlite');

const initDb = () => {
  db.run("CREATE TABLE IF NOT EXISTS squares (id INTEGER PRIMARY KEY, color TEXT)", () => {
    for (let i = 0; i < 25; i++) {
      db.run("INSERT INTO squares (color) VALUES ('white')");
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, username TEXT, gridData TEXT)");
};

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript'
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let filePath = '';
    if (req.url === '/') {
      filePath = path.join(__dirname, 'public', 'index.html');
    } else if (req.url === '/grid.html') {
      filePath = path.join(__dirname, 'public', 'grid.html');
    } else if (req.url === '/posts.html') {
      filePath = path.join(__dirname, 'public', 'posts.html');
    } else if (req.url === '/posts' || req.url.startsWith('/api/')) {
      // APIエンドポイントの場合、ファイルとして解決しない
      handleApiRequest(req, res);
      return;
    } else {
      filePath = path.join(__dirname, 'public', req.url);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
        console.error('Error loading file:', filePath); // エラーログ
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = JSON.parse(body);
      const title = parsedBody.title;
      const username = parsedBody.username;
      const gridData = JSON.stringify(parsedBody.gridData);
      db.run("INSERT INTO posts (title, username, gridData) VALUES (?, ?, ?)", [title, username, gridData], (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Error saving post' }));
          console.error('Error saving post:', err); // エラーログ
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Post saved successfully' }));
        console.log('Post saved successfully'); // 成功時のログ
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    console.warn('Not Found:', req.url); // エラーログ
  }
});

const handleApiRequest = (req, res) => {
  if (req.method === 'GET' && req.url === '/posts') {
    db.all("SELECT * FROM posts", (err, rows) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error retrieving posts' }));
        console.error('Error retrieving posts:', err); // エラーログ
        return;
      }
      const posts = rows.map(row => ({
        id: row.id,
        title: row.title,
        username: row.username,
        gridData: JSON.parse(row.gridData)
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
      console.log('Posts retrieved successfully'); // 成功時のログ
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('API Endpoint Not Found');
    console.warn('API Endpoint Not Found:', req.url); // エラーログ
  }
};

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  db.all("SELECT * FROM squares", (err, rows) => {
    if (err) throw err;
    ws.send(JSON.stringify(rows));
  });

  ws.on('message', message => {
    const data = JSON.parse(message);
    db.run("UPDATE squares SET color = ? WHERE id = ?", [data.color, data.id], (err) => {
      if (err) throw err;
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([data]));
        }
      });
    });
  });
});

server.listen(8000, () => {
  initDb();
  console.log('Server running on http://localhost:8000');
});
