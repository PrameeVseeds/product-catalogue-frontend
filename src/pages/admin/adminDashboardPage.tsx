import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const quickLinks = [
  {
    label: "Products",
    description: "Manage catalogue products",
    to: "/admin/products",
  },
  {
    label: "Categories",
    description: "Organize the product catalogue",
    to: "/admin/categories",
  },
  {
    label: "Home Content",
    description: "Manage public homepage sections",
    to: "/admin/home-sections",
  },
  {
    label: "Enquiries",
    description: "Review customer enquiries",
    to: "/admin/enquiries",
  },
  {
    label: "Contact Settings",
    description: "Update public contact information",
    to: "/admin/contact",
  },
] as const;

export const AdminDashboardPage = () => {
  const { admin } = useAuth();
  return (
    <section>
      <header className="adminPageHeader">
        <p>Dashboard</p>
        <h1>Welcome, {admin?.name}</h1>
      </header>
      <div className="adminQuickGrid">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <strong>{link.label}</strong>
            <span>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
