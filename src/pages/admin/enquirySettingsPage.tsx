import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { EnquirySettingsForm } from "../../interfaces/adminCms.interface";
import { enquirySettingsApi } from "../../services/admin/enquirySettingsApi";
import { isEmail, optionalText } from "../../utils/formValidation";

export const EnquirySettingsPage = () => {
  const state = useSettingsForm(
    enquirySettingsApi.get,
    enquirySettingsApi.update,
  );
  const form = state.form;
  if (state.loading) return <LoadingSpinner />;
  if (!form) return <FormFeedback error={state.error} />;
  const text = (key: keyof EnquirySettingsForm, value: string) =>
    state.setForm({
      ...form,
      [key]:
        key === "callButtonText" ||
        key === "whatsappButtonText" ||
        key === "emailButtonText"
          ? value
          : optionalText(value),
    });
  const validate = (v: EnquirySettingsForm) =>
    !v.callButtonText.trim() ||
    !v.whatsappButtonText.trim() ||
    !v.emailButtonText.trim()
      ? "All button text fields are required."
      : v.enquiryEmail && !isEmail(v.enquiryEmail)
        ? "Enter a valid enquiry email."
        : null;
  const group = (
    title: string,
    enabledKey: "callEnabled" | "whatsappEnabled" | "emailEnabled",
    fields: React.ReactNode,
  ) => (
    <fieldset className="settingsGroup">
      <legend>{title}</legend>
      <StatusToggle
        label="Enabled"
        checked={form[enabledKey]}
        onChange={(checked) =>
          state.setForm({ ...form, [enabledKey]: checked })}/>
      {fields}
    </fieldset>
  );
  return (
    <>
      <AdminPageHeader
        title="Enquiry Settings"
        description="Configure public call, WhatsApp and email actions."/>
      <form
        className="adminForm"
        onSubmit={(e) => {
          e.preventDefault();
          void state.save(validate);}}>
        <FormFeedback error={state.error} success={state.success} />
        <div className="settingsGroupGrid">
          {group(
            "Call Now",
            "callEnabled",
            <>
              <FormField label="Button text" required>
                <input
                  value={form.callButtonText}
                  onChange={(e) => text("callButtonText", e.target.value)}/>
              </FormField>
              <FormField label="Phone" required={form.callEnabled}>
                <input
                  value={form.callPhone ?? ""}
                  onChange={(e) => text("callPhone", e.target.value)}/>
              </FormField>
            </>,
          )}
          {group(
            "WhatsApp",
            "whatsappEnabled",
            <>
              <FormField label="Button text" required>
                <input
                  value={form.whatsappButtonText}
                  onChange={(e) => text("whatsappButtonText", e.target.value)}/>
              </FormField>
              <FormField label="WhatsApp number" required={form.whatsappEnabled}>
                <input
                  value={form.whatsappNumber ?? ""}
                  onChange={(e) => text("whatsappNumber", e.target.value)}/>
              </FormField>
              <FormField label="Default message">
                <textarea
                  value={form.whatsappDefaultMessage ?? ""}
                  onChange={(e) =>
                    text("whatsappDefaultMessage", e.target.value)}/>
              </FormField>
            </>,
          )}
          {group(
            "Email",
            "emailEnabled",
            <>
              <FormField label="Button text" required>
                <input
                  value={form.emailButtonText}
                  onChange={(e) => text("emailButtonText", e.target.value)}/>
              </FormField>
              <FormField label="Destination email" required={form.emailEnabled}>
                <input
                  type="email"
                  value={form.enquiryEmail ?? ""}
                  onChange={(e) => text("enquiryEmail", e.target.value)}/>
              </FormField>
              <FormField label="Default subject">
                <input
                  value={form.defaultEmailSubject ?? ""}
                  onChange={(e) => text("defaultEmailSubject", e.target.value)}/>
              </FormField>
            </>,
          )}
        </div>
        <button
          className="adminButton primary"
          type="submit"
          disabled={state.saving}>
          {state.saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </>
  );
};
