// db.js
// Conexión a SQLite y creación del esquema si no existe.
// better-sqlite3 es síncrono: no necesita callbacks ni promesas,
// lo cual simplifica mucho el código en una API CRUD pequeña como esta.

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'notes.db');
const db = new Database(DB_PATH);

// Mejora la seguridad ante concurrencia (varias peticiones simultáneas)
db.pragma('journal_mode = WAL');

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
