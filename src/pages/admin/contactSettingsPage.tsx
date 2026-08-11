import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { ContactSettingsForm } from "../../interfaces/adminCms.interface";
import { contactSettingsApi } from "../../services/admin/contactSettingsApi";
import { isEmail, isHttpUrl, optionalText } from "../../utils/formValidation";

type TextKey = Exclude<keyof ContactSettingsForm, "contactBackgroundImageUrl">;
export const ContactSettingsPage = () => {
  const state = useSettingsForm(
    contactSettingsApi.get,
    contactSettingsApi.update,
  );
  const form = state.form;
  if (state.loading) return <LoadingSpinner />;
  if (!form) return <FormFeedback error={state.error} />;
  const text = (key: TextKey, value: string) =>
    state.setForm({
      ...form,
      [key]: key === "contactHeading" ? value : optionalText(value),
    });
  const validate = (value: ContactSettingsForm) =>
    !value.contactHeading.trim()
      ? "Contact heading is required."
      : value.generalEmail && !isEmail(value.generalEmail)
        ? "Enter a valid general email."
        : value.mapEmbedUrl && !isHttpUrl(value.mapEmbedUrl)
          ? "Map embed URL must be a valid HTTP or HTTPS URL."
          : null;
  return (
    <>
      <AdminPageHeader
        title="Contact"
        description="Manage contact details displayed on the public website."/>
      <form
        className="adminForm"
        onSubmit={(e) => {
          e.preventDefault();
          void state.save(validate);}}>
        <FormFeedback error={state.error} success={state.success} />
        <div className="formGrid">
          <FormField label="Contact heading">
            <input
              value={form.contactHeading}
              onChange={(e) => text("contactHeading", e.target.value)}/>
          </FormField>
          <FormField label="Company name">
            <input
              value={form.companyName ?? ""}
              onChange={(e) => text("companyName", e.target.value)}/>
          </FormField>
          <FormField label="Contact description">
            <textarea
              value={form.contactDescription ?? ""}
              onChange={(e) => text("contactDescription", e.target.value)}/>
          </FormField>
          <FormField label="Address">
            <textarea
              value={form.address ?? ""}
              onChange={(e) => text("address", e.target.value)}/>
          </FormField>
          <FormField label="Primary phone">
            <input
              value={form.phonePrimary ?? ""}
              onChange={(e) => text("phonePrimary", e.target.value)}/>
          </FormField>
          <FormField label="Secondary phone">
            <input
              value={form.phoneSecondary ?? ""}
              onChange={(e) => text("phoneSecondary", e.target.value)}/>
          </FormField>
          <FormField label="Fax">
            <input
              value={form.fax ?? ""}
              onChange={(e) => text("fax", e.target.value)}/>
          </FormField>
          <FormField label="General email">
            <input
              type="email"
              value={form.generalEmail ?? ""}
              onChange={(e) => text("generalEmail", e.target.value)}/>
          </FormField>
          <FormField label="Working hours">
            <textarea
              value={form.workingHours ?? ""}
              onChange={(e) => text("workingHours", e.target.value)}/>
          </FormField>
          <FormField label="Map embed URL">
            <input
              type="url"
              value={form.mapEmbedUrl ?? ""}
              onChange={(e) => text("mapEmbedUrl", e.target.value)}/>
          </FormField>
        </div>
        <ImageUploader
          label="Contact background image"
          type="contact"
          value={form.contactBackgroundImageUrl}
          onChange={(contactBackgroundImageUrl) =>
            state.setForm({ ...form, contactBackgroundImageUrl })
          }/>
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
