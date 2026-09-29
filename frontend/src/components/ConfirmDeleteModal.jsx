export default function ConfirmDeleteModal({ note, onCancel, onConfirm, deleting }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={onCancel}>
      <div
        className="dialog dialog--confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="dialog__title">
          Eliminar nota
        </h2>
        <p id="confirm-desc" className="dialog__text">
          ¿Seguro que quieres eliminar "{note.title}"? Esta acción no se puede deshacer.
        </p>

        <div className="dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
