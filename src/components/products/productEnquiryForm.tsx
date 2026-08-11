import { useState, type FormEvent } from "react";
import type { Product } from "../../interfaces/product.interface";
import { getApiErrorMessage } from "../../services/apiClient";
import { enquiryApi } from "../../services/enquiryApi";

interface Props {
  product: Product;
  defaultSubject?: string | null;
  defaultMessage?: string | null;
  onClose: () => void;
}

export const ProductEnquiryForm = ({
  product,
  defaultSubject,
  defaultMessage,
  onClose,
}: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject ?? "",
    message: defaultMessage ?? "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    if (
      !form.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(form.email) ||
      !form.message.trim()
    ) {
      setError("Enter your name, a valid email address, and a message.");
      return;
    }
    setSending(true);
    setError("");
    setSuccess("");
    try {
      await enquiryApi.createEnquiry({
        productId: product.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: defaultSubject ?? "",
        message: defaultMessage ?? "",
      });
      setSuccess("Your enquiry has been sent successfully.");
    } catch (reason) {
      setError(getApiErrorMessage(reason));
    } finally {
      setSending(false);
    }
  };
  return (
    <section
      className="productEnquiryPanel"
      aria-labelledby="product-enquiry-heading"
    >
      <div className="panelHeading">
        <h2 id="product-enquiry-heading">Request a quote</h2>
        <button type="button" className="textButton" onClick={onClose}>
          Close
        </button>
      </div>
      {success ? (
        <div className="successMessage" role="status">
          <p>{success}</p>
          <button type="button" className="button" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form className="publicEnquiryForm" onSubmit={submit} noValidate>
          <label>
            Name *
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email *
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
            />
          </label>
          <label>
            Subject
            <input
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
            />
          </label>
          <label className="fullWidth">
            Message *
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              required
            />
          </label>
          {error && (
            <p className="formError fullWidth" role="alert">
              {error}
            </p>
          )}
          <div className="formActions fullWidth">
            <button className="button" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send enquiry"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
