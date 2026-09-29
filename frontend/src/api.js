// api.js
// Capa fina sobre fetch para hablar con el backend. Centralizar esto
// evita repetir manejo de errores y encabezados en cada componente.

const BASE_URL = '/api/notes';

async function request(url, options) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // La respuesta no tenía cuerpo JSON (p. ej. 204 o error de red)
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function fetchNotes(search = '') {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  return request(`${BASE_URL}${query}`);
}

export function createNote({ title, content }) {
  return request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
}

export function updateNote(id, { title, content }) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
}

export function deleteNote(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
