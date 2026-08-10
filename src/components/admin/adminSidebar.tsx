import { NavLink, useNavigate } from "react-router-dom";
import { adminNavigation } from "../../config/adminNavigation";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}
export const AdminSidebar = ({ open, onClose }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
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
        <div className="adminBrand">Catalogue CMS</div>
        <nav>
          {adminNavigation.map((group, index) => (
            <div className="adminNavGroup" key={group.label ?? index}>
              {group.label && <h2>{group.label}</h2>}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button className="adminLogout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
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
