// db.js
// Usa el módulo nativo de Node (node:sqlite): no requiere compilar nada.
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, 'notes.db');
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Índice para acelerar la búsqueda por título (requisito 5)
db.exec(`CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);`);

module.exports = db;
