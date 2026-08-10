import { useState } from "react";
import type { Product } from "../../interfaces/product.interface";
import type { ContactSettings } from "../../interfaces/site.interface";
import { productApi } from "../../services/productApi";
import { ProductEnquiryForm } from "./productEnquiryForm";

const digitsOnly = (value: string) => value.replace(/[^\d]/g, "");

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
  return (
    <>
      <div className="productActions">
        {settings.callEnabled && settings.callPhone && (
          <a className="button" href={`tel:${settings.callPhone}`}>
            {settings.callButtonText || "Call"}
          </a>
        )}
        {settings.whatsappEnabled && settings.whatsappPhone && (
          <a
            className="button buttonSecondary"
            href={`https://wa.me/${digitsOnly(settings.whatsappPhone)}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {settings.whatsappButtonText || "WhatsApp"}
          </a>
        )}
        {settings.emailEnabled && (
          <button
            className="button buttonSecondary"
            type="button"
            onClick={() => setShowForm(true)}
          >
            {settings.emailButtonText || "Enquire"}
          </button>
        )}
        <a
          className="button buttonSecondary"
          href={productApi.getDatasheetUrl(product.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
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
