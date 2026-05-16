interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirm delete</h2>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{message}</p>
          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              style={{ background: 'var(--danger)' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}