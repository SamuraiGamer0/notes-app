function formatDate(isoLike) {
  // El backend guarda fechas en UTC como "YYYY-MM-DD HH:MM:SS"
  const date = new Date(isoLike.replace(' ', 'T') + 'Z');
  return date.toLocaleString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card__body">
        <h2 className="note-card__title">{note.title}</h2>
        <p className="note-card__content">{note.content || 'Sin contenido.'}</p>
      </div>

      <div className="note-card__footer">
        <span className="note-card__date">Editado: {formatDate(note.updated_at)}</span>

        <div className="note-card__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(note)}
            aria-label={`Editar nota ${note.title}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(note)}
            aria-label={`Eliminar nota ${note.title}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
