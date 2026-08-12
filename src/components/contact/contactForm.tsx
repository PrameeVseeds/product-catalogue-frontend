import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { getApiErrorMessage } from "../../services/apiClient";
import { enquiryApi } from "../../services/enquiryApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const ContactForm = ({
  defaultSubject,
  onClose,
}: {
  defaultSubject?: string | null;
  onClose?: () => void;
}) => {
  const [form, setForm] = useState({
    ...initialForm,
    subject: defaultSubject ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const name = form.name.trim(),
      email = form.email.trim(),
      message = form.message.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      setError("Enter your name, a valid email address, and a message.");
      setSuccess("");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await enquiryApi.createEnquiry({
        name,
        email,
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || null,
        message,
      });
      setForm({ ...initialForm, subject: defaultSubject ?? "" });
      setSuccess("Thank you. Your enquiry has been sent successfully.");
    } catch (reason) {
      setError(getApiErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section
      className="contactFormPanel"
      id="contact-form"
      aria-labelledby="contact-form-heading"
    >
      <div className="contactFormHeader">
        <h2 id="contact-form-heading">Send an enquiry</h2>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close enquiry form">
            <X aria-hidden="true" />
          </button>
        )}
      </div>
      <form className="contactForm" onSubmit={submit} noValidate>
        <label>
          Name *
          <input
            autoFocus={Boolean(onClose)}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            maxLength={150}
            autoComplete="name"
            required
          />
        </label>
        <label>
          Email *
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            maxLength={150}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            maxLength={50}
            autoComplete="tel"
          />
        </label>
        <label>
          Subject
          <input
            value={form.subject}
            onChange={(event) => update("subject", event.target.value)}
            maxLength={255}
          />
        </label>
        <label>
          Message *
          <textarea
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            maxLength={5000}
            rows={7}
            required
          />
        </label>
        {error && (
          <p className="formError" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="successMessage" role="status">
            {success}
          </p>
        )}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </section>
  );
};
