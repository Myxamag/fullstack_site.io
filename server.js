const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// "База данных" в памяти
const messages = [];

const server = http.createServer((req, res) => {
  // Главная страница
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Ошибка сервера');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // Получить все сообщения
  if (req.method === 'GET' && req.url === '/api/messages') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(messages));
  }

  // Добавить сообщение
  if (req.method === 'POST' && req.url === '/api/messages') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const text = (data.text || '').trim();
        const author = (data.author || '').trim();

        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'Текст сообщения обязателен' }));
        }

        const message = {
          id: messages.length + 1,
          author: author || 'Аноним',
          text,
          createdAt: new Date().toISOString()
        };

        // Добавляем новое сообщение в начало
        messages.unshift(message);

        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(message));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
      }
    });

    return;
  }

  // Если путь не найден
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Не найдено');
});

server.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
