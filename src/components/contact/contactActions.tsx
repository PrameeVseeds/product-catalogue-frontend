import type { ContactSettings } from "../../interfaces/site.interface";

export const ContactActions = ({ settings }: { settings: ContactSettings }) => {
  const callPhone = settings.callPhone?.trim();
  const whatsappPhone = settings.whatsappPhone?.replace(/\D/g, "");
  const message = settings.whatsappDefaultMessage
    ? `?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`
    : "";
  if (
    !settings.callEnabled &&
    !settings.whatsappEnabled &&
    !settings.emailEnabled
  )
    return null;
  return (
    <div className="contactActions" aria-label="Contact options">
      {settings.callEnabled && callPhone && (
        <a className="button" href={`tel:${callPhone.replace(/[^+\d]/g, "")}`}>
          {settings.callButtonText || "Call"}
        </a>
      )}
      {settings.whatsappEnabled && whatsappPhone && (
        <a
          className="button buttonSecondary"
          href={`https://wa.me/${whatsappPhone}${message}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {settings.whatsappButtonText || "WhatsApp"}
        </a>
      )}
      {settings.emailEnabled && (
        <a className="button buttonSecondary" href="#contact-form">
          {settings.emailButtonText || "Email enquiry"}
        </a>
      )}
    </div>
  );
};
