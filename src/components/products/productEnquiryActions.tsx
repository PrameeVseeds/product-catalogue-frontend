import { useState } from "react";
import { FileDown, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import type { Product } from "../../interfaces/product.interface";
import type { ContactSettings } from "../../interfaces/site.interface";
import { productApi } from "../../services/productApi";
import { getWhatsAppUrl } from "../../utils/getWhatsAppUrl";
import { ProductEnquiryForm } from "./productEnquiryForm";

export const ProductEnquiryActions = ({
  product,
  settings,
}: {
  product: Product;
  settings: ContactSettings;
}) => {
  const [showForm, setShowForm] = useState(false);
  const productLabel = `${product.name}${product.modelNumber ? ` (${product.modelNumber})` : ""}`;
  const whatsappMessage = [settings.whatsappDefaultMessage, productLabel]
    .filter(Boolean)
    .join(" - ");
  const whatsappUrl = getWhatsAppUrl(settings.whatsappPhone, whatsappMessage);
  return (
    <>
      <div className="productActions">
        <div className="productContactActions">
          {settings.callEnabled && settings.callPhone && (
            <a className="button" href={`tel:${settings.callPhone}`}>
              <Phone aria-hidden="true" />
              {settings.callButtonText || "Call"}
            </a>
          )}
          {settings.whatsappEnabled && whatsappUrl && (
            <a
              className="button buttonSecondary"
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
              className="button buttonSecondary"
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Mail aria-hidden="true" />
              {settings.emailButtonText || "Enquire"}
            </button>
          )}
        </div>
        <a
          className="button datasheetButton"
          href={productApi.getDatasheetUrl(product.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileDown aria-hidden="true" />
          Open Datasheet
        </a>
      </div>
      {showForm && (
        <ProductEnquiryForm
          product={product}
          defaultSubject={settings.defaultEmailSubject}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
};
