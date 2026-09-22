interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
}: Props) =>
  open ? (
    <div className="dialogBackdrop" role="presentation">
      <div
        className="confirmDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
      >
        <h2 id="logout-confirm-title">Log out?</h2>
        <p>You will need to sign in again to access the admin area.</p>
        <div className="dialogActions">
          <button className="adminButton secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="adminButton primary" type="button" onClick={onConfirm}>
            Log out
          </button>
        </div>
      </div>
    </div>
  ) : null;
