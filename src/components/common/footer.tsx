import { Link } from "react-router-dom";
import { useSiteContent } from "../../hooks/useSiteContent";
import { getImageUrl } from "../../utils/getImageUrl";
import { SocialLinks } from "./socialLinks";

export const Footer = () => {
  const { data } = useSiteContent();
  const site = data?.siteSettings;
  const logo = getImageUrl(site?.logo);
  const activeSocialLinks =
    data?.socialMedia.filter((link) => link.isActive) ?? [];
  if (!site && !activeSocialLinks.length) return null;
  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        <div className="footerBrand">
          {logo && (
            <img
              src={logo}
              alt={
                site?.companyName ? `${site.companyName} logo` : "Company logo"
              }
              loading="lazy"
            />
          )}
          {site?.companyName && <h2>{site.companyName}</h2>}
          {site?.footerDescription && <p>{site.footerDescription}</p>}
        </div>
        <nav className="footerLinks" aria-label="Footer navigation">
          <h2>Quick links</h2>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <div className="footerContact">
          <h2>Contact</h2>
          <address>
            {site?.address && <span>{site.address}</span>}
            {site?.phone && (
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                {site.phone}
              </a>
            )}
            {site?.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          </address>
          <SocialLinks links={activeSocialLinks} />
        </div>
      </div>
      {site?.copyright && (
        <div className="container copyright">{site.copyright}</div>
      )}
    </footer>
  );
};
