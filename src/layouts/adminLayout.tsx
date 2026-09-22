import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader } from "../components/admin/adminHeader";
import { AdminSidebar } from "../components/admin/adminSidebar";
import { usePageTitle } from "../hooks/usePageTitle";

const adminTitles: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/site-settings": "Site Settings",
  "/admin/theme": "Theme Settings",
  "/admin/hero": "Hero Settings",
  "/admin/home-sections": "Home Sections",
  "/admin/contact": "Contact Settings",
  "/admin/enquiry-settings": "Enquiry Settings",
  "/admin/social-media": "Social Media",
  "/admin/categories": "Manage Categories",
  "/admin/brands": "Manage Brands",
  "/admin/category-brands": "Manage Category Brands",
  "/admin/subcategories": "Manage Subcategories",
  "/admin/products": "Manage Products",
  "/admin/enquiries": "Enquiries",
};

export const AdminLayout = () => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobileNavigation = () => window.matchMedia("(max-width: 960px)").matches;
  const toggleNavigation = () => {
    if (isMobileNavigation()) setSidebarOpen((open) => !open);
    else setSidebarCollapsed((collapsed) => !collapsed);
  };
  const closeNavigation = () => {
    if (isMobileNavigation()) setSidebarOpen(false);
    else setSidebarCollapsed(true);
  };
  const pageTitle =
    adminTitles[pathname] ??
    (pathname.startsWith("/admin/products/") ? "Manage Product" : null) ??
    (pathname.startsWith("/admin/enquiries/")
      ? "Enquiry Details"
      : "Admin Page Not Found");
  usePageTitle(pageTitle);
  return (
    <div className={`adminShell${sidebarCollapsed ? " sidebarCollapsed" : ""}`}>
      <AdminSidebar open={sidebarOpen} onClose={closeNavigation} />
      <div className="adminWorkspace">
        <AdminHeader onMenuToggle={toggleNavigation} />
        <main className="adminMain">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
