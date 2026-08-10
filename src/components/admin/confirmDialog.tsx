interface Props {
  open: boolean;
  title: string;
  message: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmDialog = ({open,title,message,busy,onConfirm,onCancel,}: Props) =>
  open ? (
    <div className="dialogBackdrop" role="presentation">
      <div
        className="confirmDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="dialogActions">
          <button
            type="button"
            className="adminButton secondary"
            onClick={onCancel}
            disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className="adminButton danger"
            onClick={onConfirm}
            disabled={busy}>
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
