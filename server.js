const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'items.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readItems() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8').trim();
  return raw ? JSON.parse(raw) : [];
}

function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

// 전체 목록 조회
app.get('/api/items', (req, res) => {
  res.json(readItems());
});

// 새 항목 추가
app.post('/api/items', (req, res) => {
  const { title, content } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: '제목을 입력해 주세요.' });
  }
  const items = readItems();
  const newItem = {
    id: Date.now().toString(),
    title: title.trim(),
    content: (content || '').trim(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeItems(items);
  res.status(201).json(newItem);
});

// 항목 삭제
app.delete('/api/items/:id', (req, res) => {
  const items = readItems();
  const filtered = items.filter((item) => item.id !== req.params.id);
  if (filtered.length === items.length) {
    return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
  }
  writeItems(filtered);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
