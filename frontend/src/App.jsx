import { useEffect, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import NoteList from './components/NoteList.jsx';
import NoteFormModal from './components/NoteFormModal.jsx';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.jsx';
import { fetchNotes, createNote, updateNote, deleteNote } from './api.js';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState('');

  // Modal de creación/edición: null = cerrado, {} = nueva nota, note = editar
  const [formNote, setFormNote] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal de confirmación de borrado
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Espera 300ms tras dejar de escribir antes de disparar la búsqueda,
  // para no saturar la API con una petición por cada tecla (requisito 5).
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadNotes(debouncedSearch);
  }, [debouncedSearch]);

  async function loadNotes(searchTerm) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotes(searchTerm);
      setNotes(data);
    } catch (err) {
      setError('No se pudieron cargar las notas. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload) {
    setSaving(true);
    setError('');
    try {
      if (formNote?.id) {
        await updateNote(formNote.id, payload);
      } else {
        await createNote(payload);
      }
      setFormNote(null);
      await loadNotes(debouncedSearch);
    } catch (err) {
      setError('No se pudo guardar la nota. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteNote(noteToDelete.id);
      setNoteToDelete(null);
      await loadNotes(debouncedSearch);
    } catch (err) {
      setError('No se pudo eliminar la nota. Inténtalo de nuevo.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="app">
      <TopBar search={search} onSearchChange={setSearch} onNewNote={() => setFormNote({})} />

      <main className="app__content">
        {error && <p className="banner banner--error">{error}</p>}

        <NoteList
          notes={notes}
          loading={loading}
          search={debouncedSearch}
          onEdit={setFormNote}
          onDelete={setNoteToDelete}
          onNewNote={() => setFormNote({})}
        />
      </main>

      {formNote !== null && (
        <NoteFormModal
          initialNote={formNote.id ? formNote : null}
          saving={saving}
          onCancel={() => setFormNote(null)}
          onSave={handleSave}
        />
      )}

      {noteToDelete && (
        <ConfirmDeleteModal
          note={noteToDelete}
          deleting={deleting}
          onCancel={() => setNoteToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
