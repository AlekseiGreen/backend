// backend/app.js
const express = require('express');


const path = require('path');

const app = express();
const PORT = 3000;

// ---------- API ----------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'backend' });
});

// ---------- Отдача статики (React) ----------
const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(DIST_DIR));

// SPA: все остальные пути → index.html (через регулярку — обход ошибки)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ---------- Запуск ----------
app.listen(PORT, () => {
  console.log(`✅ Продакшен-сервер запущен: http://localhost:${PORT}`);
});