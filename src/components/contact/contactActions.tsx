import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import type { ContactSettings } from "../../interfaces/site.interface";
import { getWhatsAppUrl } from "../../utils/getWhatsAppUrl";

export const ContactActions = ({settings,onRequestQuote,}: {
  settings: ContactSettings;
  onRequestQuote: () => void;}) => {
  const callPhone = settings.callPhone?.trim();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappPhone,
    settings.whatsappDefaultMessage,
  );
  if (
    !settings.callEnabled &&
    !settings.whatsappEnabled &&
    !settings.emailEnabled
  )
    return null;
  return (
    <div className="contactActions" aria-label="Contact options">
      {settings.callEnabled && callPhone && (
        <a
          className="button contactCallAction"
          href={`tel:${callPhone.replace(/[^+\d]/g, "")}`}
        >
          <Phone aria-hidden="true" />
          {settings.callButtonText || "Call"}
        </a>
      )}
      {settings.whatsappEnabled && whatsappUrl && (
        <a
          className="button contactWhatsAppAction"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp aria-hidden="true" />
          {settings.whatsappButtonText || "WhatsApp"}
        </a>
      )}
      {settings.emailEnabled && (
        <button
          className="button contactQuoteAction"
          type="button"
          onClick={onRequestQuote}
        >
          <Mail aria-hidden="true" />
          Request Quote
        </button>
      )}
    </div>
  );
};
