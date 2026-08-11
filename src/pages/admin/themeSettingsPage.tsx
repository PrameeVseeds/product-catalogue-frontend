import type { CSSProperties } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { ThemeSettingsForm } from "../../interfaces/adminCms.interface";
import { themeSettingsApi } from "../../services/admin/themeSettingsApi";
import { isHexColor } from "../../utils/formValidation";

const colorFields: { key: keyof ThemeSettingsForm; label: string }[] = [
  { key: "primaryColor", label: "Primary color" },
  { key: "secondaryColor", label: "Secondary color" },
  { key: "backgroundColor", label: "Background color" },
  { key: "surfaceColor", label: "Surface color" },
  { key: "textColor", label: "Text color" },
  { key: "mutedTextColor", label: "Muted text color" },
  { key: "buttonBackgroundColor", label: "Button background" },
  { key: "buttonTextColor", label: "Button text" },
  { key: "headerBackgroundColor", label: "Header background" },
  { key: "footerBackgroundColor", label: "Footer background" },
  { key: "footerTextColor", label: "Footer text" },
];
export const ThemeSettingsPage = () => {
  const state = useSettingsForm(themeSettingsApi.get, themeSettingsApi.update);
  const form = state.form;
  if (state.loading) return <LoadingSpinner />;
  if (!form) return <FormFeedback error={state.error} />;
  const preview = {
    "--preview-primary": form.primaryColor,
    "--preview-background": form.backgroundColor,
    "--preview-surface": form.surfaceColor,
    "--preview-text": form.textColor,
    "--preview-muted": form.mutedTextColor,
    "--preview-button-text": form.buttonTextColor,
  } as CSSProperties;
  return (
    <>
      <AdminPageHeader
        title="Theme"
        description="Configure colors used throughout the public website."
      />
      <form
        className="adminForm"
        onSubmit={(e) => {
          e.preventDefault();
          void state.save((value) =>
            colorFields.every(({ key }) => isHexColor(value[key]))
              ? null
              : "Every theme color must use a six-digit hex value.",
          );
        }}
      >
        <FormFeedback error={state.error} success={state.success} />
        <div className="colorGrid">
          {colorFields.map(({ key, label }) => (
            <FormField key={key} label={label} htmlFor={key}>
              <div className="colorControl">
                <input
                  type="color"
                  value={isHexColor(form[key]) ? form[key] : "#000000"}
                  onChange={(e) =>
                    state.setForm({ ...form, [key]: e.target.value })
                  }
                />
                <input
                  id={key}
                  value={form[key]}
                  onChange={(e) =>
                    state.setForm({ ...form, [key]: e.target.value })
                  }
                />
              </div>
            </FormField>
          ))}
        </div>
        <div className="themePreview" style={preview}>
          <div>
            <h3>Theme preview</h3>
            <p>Preview public text and surface colors.</p>
            <button type="button">Example button</button>
          </div>
        </div>
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
