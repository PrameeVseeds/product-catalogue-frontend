import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  );
};

export const AdminLoginRoute = () =>
  useAuth().isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
