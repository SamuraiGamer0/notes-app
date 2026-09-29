// server.js
// Punto de entrada de la API. No hay autenticación: cualquier cliente
// que pueda alcanzar este servidor puede leer y modificar las notas,
// tal como se especifica en los requisitos (uso personal, sin login).

const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);

// Manejo simple de rutas no encontradas dentro de /api
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API de notas escuchando en http://localhost:${PORT}`);
});
