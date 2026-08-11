import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSiteContent } from "../../hooks/useSiteContent";
import { getImageUrl } from "../../utils/getImageUrl";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data } = useSiteContent();
  const site = data?.siteSettings;
  const logoUrl = getImageUrl(site?.logo);

  return (
    <header className="siteHeader">
      <div className="container navbar">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={
                site?.companyName ? `${site.companyName} logo` : "Company logo"
              }
            />
          )}
          {site?.companyName && <span>{site.companyName}</span>}
        </NavLink>
        <button
          className="menuButton"
          type="button"
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <nav
          id="public-navigation"
          className={open ? "navLinks open" : "navLinks"}
          aria-label="Main navigation"
        >
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact Us
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
