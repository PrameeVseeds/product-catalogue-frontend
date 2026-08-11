import { Link } from "react-router-dom";
import { useSiteContent } from "../../hooks/useSiteContent";
import { getImageUrl } from "../../utils/getImageUrl";
import { SocialLinks } from "./socialLinks";
import { Mail, MapPin, Phone } from "lucide-react";

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
        <section className="footerBrand" aria-labelledby="footerCompanyHeading">
          {logo && (
            <img
              src={logo}
              alt={
                site?.companyName ? `${site.companyName} logo` : "Company logo"
              }
              loading="lazy"
            />
          )}
          {site?.companyName && (
            <h2 id="footerCompanyHeading">{site.companyName}</h2>
          )}
          {site?.footerDescription && <p>{site.footerDescription}</p>}
        </section>
        <nav className="footerLinks" aria-label="Footer navigation">
          <h2>Quick links</h2>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <section
          className="footerContact"
          aria-labelledby="footerContactHeading"
        >
          <h2 id="footerContactHeading">Contact</h2>
          <address>
            {site?.address && (
              <span>
                <MapPin aria-hidden="true" />
                {site.address}
              </span>
            )}
            {site?.phone && (
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                <Phone aria-hidden="true" />
                {site.phone}
              </a>
            )}
            {site?.email && (
              <a href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" />
                {site.email}
              </a>
            )}
          </address>
        </section>
        {activeSocialLinks.length > 0 && (
          <section
            className="footerSocial"
            aria-labelledby="footerSocialHeading"
          >
            <h2 id="footerSocialHeading">Follow Us</h2>
            <SocialLinks
              links={activeSocialLinks}
              companyName={site?.companyName}
            />
          </section>
        )}
      </div>
      {site?.copyright && (
        <div className="container copyright">{site.copyright}</div>
      )}
    </footer>
  );
};
