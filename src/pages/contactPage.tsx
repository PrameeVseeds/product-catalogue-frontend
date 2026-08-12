import { useEffect, useState } from "react";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { SocialLinks } from "../components/common/socialLinks";
import { ContactActions } from "../components/contact/contactActions";
import { ContactForm } from "../components/contact/contactForm";
import { ContactInfo } from "../components/contact/contactInfo";
import { MapSection } from "../components/contact/mapSection";
import { useSiteContent } from "../hooks/useSiteContent";
import { getImageUrl } from "../utils/getImageUrl";

export const ContactPage = () => {
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const { data, loading, error } = useSiteContent();
  useEffect(() => {
    if (!showEnquiryForm) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowEnquiryForm(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modalOpen");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modalOpen");
    };
  }, [showEnquiryForm]);
  if (loading)
    return (
      <div className="container stateSection">
        <LoadingSpinner />
      </div>
    );
  if (!data)
    return (
      <div className="container stateSection">
        <ErrorMessage
          message={error || "Contact information is unavailable."}
        />
      </div>
    );
  const details = data.contactDetails;
  const image = getImageUrl(details.backgroundImageUrl);
  return (
    <main className="contactPage">
      <header
        className={`contactHero${image ? " hasImage" : ""}`}
        style={
          image
            ? ({
                "--contact-background": `url("${image.replace(/["\\]/g, "\\$&")}")`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="container contactHeroContent">
          <h1>{details.heading || "Contact Us"}</h1>
          {details.description && <p>{details.description}</p>}
        </div>
      </header>
      <div className="container contactOverview">
        <div className="contactDetailsColumn">
          <ContactInfo details={details} />
          <ContactActions
            settings={data.contactSettings}
            onRequestQuote={() => setShowEnquiryForm(true)}
          />
          <SocialLinks links={data.socialMedia} />
        </div>
        <MapSection
          url={details.mapEmbedUrl}
          title={details.companyName || data.siteSettings.companyName}
        />
      </div>
      {showEnquiryForm && (
        <div
          className="contactQuoteModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-form-heading"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowEnquiryForm(false);
          }}
        >
          <div className="contactQuoteModalContent">
            <ContactForm
              defaultSubject={data.contactSettings.defaultEmailSubject}
              onClose={() => setShowEnquiryForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};
