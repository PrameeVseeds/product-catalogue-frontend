import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const AdminHeader = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
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
        Menu
      </button>
      <span className="adminHeaderName">{admin?.name}</span>
      <button
        className="adminHeaderLogout"
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
};
