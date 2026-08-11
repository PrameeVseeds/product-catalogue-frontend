import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import { siteSettingsApi } from "../../services/admin/siteSettingsApi";
import { optionalText } from "../../utils/formValidation";

export const SiteSettingsPage = () => {
  const state = useSettingsForm(siteSettingsApi.get, siteSettingsApi.update);
  const form = state.form;
  if (state.loading) return <LoadingSpinner />;
  if (!form) return <FormFeedback error={state.error} />;
  const text = (
    key:
      | "companyName"
      | "websiteTitle"
      | "websiteDescription"
      | "footerDescription"
      | "copyrightText",
    value: string,
  ) =>
    state.setForm({
      ...form,
      [key]: key === "companyName" ? value : optionalText(value),
    });
  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Manage public identity and website metadata."
      />
      <form
        className="adminForm"
        onSubmit={(event) => {
          event.preventDefault();
          void state.save((value) =>
            value.companyName.trim() ? null : "Company name is required.",
          );
        }}
      >
        <FormFeedback error={state.error} success={state.success} />
        <div className="formGrid">
          <FormField label="Company name" htmlFor="companyName">
            <input
              id="companyName"
              value={form.companyName}
              onChange={(e) => text("companyName", e.target.value)}
            />
          </FormField>
          <FormField label="Website title" htmlFor="websiteTitle">
            <input
              id="websiteTitle"
              value={form.websiteTitle ?? ""}
              onChange={(e) => text("websiteTitle", e.target.value)}
            />
          </FormField>
          <FormField label="Website description" htmlFor="websiteDescription">
            <textarea
              id="websiteDescription"
              value={form.websiteDescription ?? ""}
              onChange={(e) => text("websiteDescription", e.target.value)}
            />
          </FormField>
          <FormField label="Footer description" htmlFor="footerDescription">
            <textarea
              id="footerDescription"
              value={form.footerDescription ?? ""}
              onChange={(e) => text("footerDescription", e.target.value)}
            />
          </FormField>
          <FormField label="Copyright text" htmlFor="copyrightText">
            <input
              id="copyrightText"
              value={form.copyrightText ?? ""}
              onChange={(e) => text("copyrightText", e.target.value)}
            />
          </FormField>
        </div>
        <div className="formGrid">
          <ImageUploader
            label="Company logo"
            type="general"
            value={form.logoUrl}
            onChange={(logoUrl) => state.setForm({ ...form, logoUrl })}
          />
          <ImageUploader
            label="Favicon"
            type="general"
            value={form.faviconUrl}
            onChange={(faviconUrl) => state.setForm({ ...form, faviconUrl })}
          />
        </div>
        <StatusToggle
          label="Maintenance mode"
          checked={form.isMaintenanceMode}
          onChange={(isMaintenanceMode) =>
            state.setForm({ ...form, isMaintenanceMode })
          }
        />
        <button
          className="adminButton primary"
          type="submit"
          disabled={state.saving}
        >
          {state.saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </>
  );
};
