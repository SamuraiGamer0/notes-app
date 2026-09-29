// routes/notes.js
// Endpoints REST para el recurso "notes".
//
//   GET    /api/notes           -> listar todas (o filtrar con ?search=)
//   GET    /api/notes/:id       -> obtener una nota
//   POST   /api/notes           -> crear
//   PUT    /api/notes/:id       -> editar
//   DELETE /api/notes/:id       -> eliminar

const express = require('express');
const db = require('../db');

const router = express.Router();

// Prepared statements: se compilan una sola vez y se reutilizan (mejor rendimiento
// y protección automática contra inyección SQL al usar parámetros ligados).
const stmts = {
  listAll: db.prepare('SELECT * FROM notes ORDER BY updated_at DESC'),
  searchByTitle: db.prepare(
    'SELECT * FROM notes WHERE title LIKE ? ORDER BY updated_at DESC'
  ),
  getById: db.prepare('SELECT * FROM notes WHERE id = ?'),
  insert: db.prepare(
    'INSERT INTO notes (title, content) VALUES (@title, @content)'
  ),
  update: db.prepare(`
    UPDATE notes
    SET title = @title, content = @content, updated_at = datetime('now')
    WHERE id = @id
  `),
  remove: db.prepare('DELETE FROM notes WHERE id = ?'),
};

function isBlank(value) {
  return typeof value !== 'string' || value.trim().length === 0;
}

// GET /api/notes?search=texto  (requisitos 1 y 5)
router.get('/', (req, res) => {
  const { search } = req.query;

  const notes =
    typeof search === 'string' && search.trim() !== ''
      ? stmts.searchByTitle.all(`%${search.trim()}%`)
      : stmts.listAll.all();

  res.json(notes);
});

// GET /api/notes/:id
router.get('/:id', (req, res) => {
  const note = stmts.getById.get(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  res.json(note);
});

// POST /api/notes  (requisito 2)
router.post('/', (req, res) => {
  const { title, content = '' } = req.body ?? {};

  if (isBlank(title)) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const info = stmts.insert.run({ title: title.trim(), content });
  const created = stmts.getById.get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/notes/:id  (requisito 3)
router.put('/:id', (req, res) => {
  const existing = stmts.getById.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  const { title, content = '' } = req.body ?? {};
  if (isBlank(title)) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  stmts.update.run({ id: req.params.id, title: title.trim(), content });
  const updated = stmts.getById.get(req.params.id);
  res.json(updated);
});

// DELETE /api/notes/:id  (requisito 4; la confirmación ocurre en el frontend)
router.delete('/:id', (req, res) => {
  const existing = stmts.getById.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  stmts.remove.run(req.params.id);
  res.status(204).send();
});

module.exports = router;
