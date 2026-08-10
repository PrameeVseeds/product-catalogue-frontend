import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/admin/adminHeader";
import { AdminSidebar } from "../components/admin/adminSidebar";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="adminShell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="adminWorkspace">
        <AdminHeader onMenuToggle={() => setSidebarOpen((value) => !value)} />
        <main className="adminMain">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
