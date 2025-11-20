'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_me_now';

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'data.sqlite');
const db = new Database(DB_FILE);
db.exec(`
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY, name TEXT UNIQUE, code TEXT, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY, client TEXT, amount REAL, note TEXT, created_at TEXT
);
`);

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve admin static
app.use('/admin/static', express.static(path.join(__dirname, 'admin')));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Modules
app.get('/api/modules', (req, res) => {
  const rows = db.prepare('SELECT id,name,created_at,updated_at FROM modules ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/modules', (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'name and code required' });
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO modules (id,name,code,created_at,updated_at) VALUES (?,?,?,?,?)')
      .run(id, name, code, new Date().toISOString(), new Date().toISOString());
    res.json({ ok: true, id });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/modules/:name/run', (req, res) => {
  const name = req.params.name;
  const row = db.prepare('SELECT * FROM modules WHERE name = ?').get(name);
  if (!row) return res.status(404).json({ error: 'module not found' });
  try {
    const func = new Function('__params', row.code + '\n return typeof run === "function" ? run(__params) : { error: "no run" };');
    const out = func(req.query || {});
    res.json({ ok: true, result: out });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Sales
app.post('/api/sales', (req, res) => {
  const { client, amount, note } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO sales (id,client,amount,note,created_at) VALUES (?,?,?,?,?)')
    .run(id, client||'client', Number(amount)||0, note||'', new Date().toISOString());
  res.json({ ok: true, id });
});

app.get('/api/sales', (req, res) => {
  const rows = db.prepare('SELECT * FROM sales ORDER BY created_at DESC LIMIT 200').all();
  res.json(rows);
});

// Simple admin page (protected by ?password=)
app.get('/admin', (req, res) => {
  const pw = req.query.password || '';
  if (pw !== ADMIN_PASSWORD) {
    return res.sendFile(path.join(__dirname, 'admin', 'login.html'));
  }
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Fallback
app.get('/', (req, res) => res.redirect('/admin'));

app.listen(PORT, () => {
  console.log('LegadoCore Render-ready listening on', PORT);
});
