import NoteCard from './NoteCard.jsx';

export default function NoteList({ notes, loading, search, onEdit, onDelete, onNewNote }) {
  if (loading) {
    return <p className="state-message">Cargando notas…</p>;
  }

  if (notes.length === 0 && search) {
    return (
      <p className="state-message">
        No se encontraron notas con el título "{search}".
      </p>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="state-message state-message--empty">
        <p>Aún no tienes notas.</p>
        <button type="button" className="btn btn--primary" onClick={onNewNote}>
          Crear la primera nota
        </button>
      </div>
    );
  }

  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
