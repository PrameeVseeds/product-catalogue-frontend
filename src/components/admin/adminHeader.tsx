import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { LogoutConfirmDialog } from "./logoutConfirmDialog";
import { useAuth } from "../../hooks/useAuth";

export const AdminHeader = ({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="adminHeader">
      <button
        className="adminMenuButton"
        type="button"
        aria-controls="admin-navigation"
        aria-label="Toggle admin navigation"
        onClick={onMenuToggle}
      >
        <Menu aria-hidden="true" />
      </button>

      <span className="adminHeaderName">{admin?.name}</span>

      <button
        className="adminHeaderLogout"
        type="button"
        aria-label="Log out"
        onClick={() => setLogoutConfirmOpen(true)}
      >
        <LogOut aria-hidden="true" />
      </button>
      <LogoutConfirmDialog
        open={logoutConfirmOpen}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};
