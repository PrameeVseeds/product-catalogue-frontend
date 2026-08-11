import { ChevronDown, FileDown, FileText, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import type { Product } from "../../interfaces/product.interface";
import type { ContactSettings } from "../../interfaces/site.interface";
import { productApi } from "../../services/productApi";
import { getWhatsAppUrl } from "../../utils/getWhatsAppUrl";
import { CopyPhoneButton } from "./copyPhoneButton";
import { ProductEnquiryForm } from "./productEnquiryForm";

export const ProductEnquiryActions = ({ product, settings }: { product: Product; settings: ContactSettings }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const callPhone = settings.callPhone?.trim();
  const whatsappMessage = [
    settings.whatsappDefaultMessage,
    `Product: ${product.name}`,
    product.modelNumber ? `Model: ${product.modelNumber}` : null,
  ].filter(Boolean).join("\n");
  const whatsappUrl = getWhatsAppUrl(settings.whatsappPhone, whatsappMessage);
  const hasOptions = Boolean(
    (settings.callEnabled && callPhone) ||
    (settings.whatsappEnabled && whatsappUrl) ||
    settings.emailEnabled,
  );
  const defaultSubject = `${settings.defaultEmailSubject?.trim() || "Quote Request"} - ${product.name}`;
  const defaultMessage = [
    "I would like to request a quotation for this product.",
    "",
    `Product: ${product.name}`,
    product.modelNumber ? `Model: ${product.modelNumber}` : null,
  ].filter((line) => line !== null).join("\n");

  return (
    <>
      <div className="productActions">
        <div className="productPrimaryActions">
          {hasOptions && (
            <button className="button inquireButton" type="button" aria-expanded={showOptions} aria-controls="product-enquiry-options" onClick={() => setShowOptions((current) => !current)}>
              <MessageCircle aria-hidden="true" />
              Inquire Now
              <ChevronDown className={showOptions ? "isExpanded" : undefined} aria-hidden="true" />
            </button>
          )}
          <a className="button datasheetButton" href={productApi.getDatasheetUrl(product.slug)} target="_blank" rel="noopener noreferrer">
            <FileDown aria-hidden="true" />
            Open Datasheet
          </a>
        </div>
        {showOptions && hasOptions && (
          <section className="enquiryOptionsPanel" id="product-enquiry-options" aria-labelledby="enquiry-options-heading">
            <div className="enquiryOptionsHeading">
              <h2 id="enquiry-options-heading">Interested in this product?</h2>
              <p>Choose how you would like to contact us.</p>
            </div>
            <div className="enquiryOptionGrid">
              {settings.callEnabled && callPhone && (
                <div className="enquiryOptionCard">
                  <Phone aria-hidden="true" />
                  <div>
                    <strong>{settings.callButtonText || "Call Now"}</strong>
                    <a className="contactValue" href={`tel:${callPhone.replace(/[^+\d]/g, "")}`}>{callPhone}</a>
                    <CopyPhoneButton phone={callPhone} />
                  </div>
                </div>
              )}
              {settings.whatsappEnabled && whatsappUrl && (
                <a className="enquiryOptionCard enquiryOptionLink" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden="true" />
                  <span><strong>{settings.whatsappButtonText || "WhatsApp"}</strong><small>Continue in WhatsApp</small></span>
                </a>
              )}
              {settings.emailEnabled && (
                <button className="enquiryOptionCard enquiryOptionLink" type="button" onClick={() => setShowForm(true)}>
                  <FileText aria-hidden="true" />
                  <span><strong>Request Quote</strong><small>Send us your requirements</small></span>
                </button>
              )}
            </div>
          </section>
        )}
      </div>
      {showForm && (
        <ProductEnquiryForm product={product} defaultSubject={defaultSubject} defaultMessage={defaultMessage} onClose={() => setShowForm(false)} />
      )}
    </>
  );
};
