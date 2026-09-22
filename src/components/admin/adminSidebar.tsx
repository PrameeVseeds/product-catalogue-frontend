import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { LogoutConfirmDialog } from "./logoutConfirmDialog";
import { adminNavigation } from "../../config/adminNavigation";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}
export const AdminSidebar = ({ open, onClose }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const handleLogout = () => {
    logout();
    onClose();
    navigate("/admin/login", { replace: true });
  };
  return (
    <>
      <aside
        id="admin-navigation"
        className={`adminSidebar${open ? " open" : ""}`}
        aria-label="Admin navigation">
        <div className="adminSidebarHeader">
          <div className="adminBrand">Catalogue CMS</div>
          <button
            className="adminSidebarClose"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav>
          {adminNavigation.map((group, index) => (
            <div className="adminNavGroup" key={group.label ?? index}>
              {group.label && <h2>{group.label}</h2>}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => {
                    if (window.matchMedia("(max-width: 960px)").matches) onClose();
                  }}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button
          className="adminLogout"
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
        >
          <LogOut aria-hidden="true" />
          Logout
        </button>
      </aside>
      <LogoutConfirmDialog
        open={logoutConfirmOpen}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
      {open && (
        <button
          className="sidebarBackdrop"
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
    </>
  );
};
