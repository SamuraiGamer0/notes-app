import { useEffect, useState } from 'react';

export default function NoteFormModal({ initialNote, onCancel, onSave, saving }) {
  const isEditing = Boolean(initialNote);
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialNote?.title ?? '');
    setContent(initialNote?.content ?? '');
  }, [initialNote]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    setError('');
    onSave({ title: title.trim(), content });
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-form-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="note-form-title" className="dialog__title">
          {isEditing ? 'Editar nota' : 'Nueva nota'}
        </h2>

        <form onSubmit={handleSubmit} className="note-form">
          <label className="field">
            <span className="field__label">Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe un título"
              autoFocus
            />
          </label>

          <label className="field">
            <span className="field__label">Contenido</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido de la nota"
              rows={6}
            />
          </label>

          {error && <p className="field__error">{error}</p>}

          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
