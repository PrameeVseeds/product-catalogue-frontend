import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { HeroSettingsForm } from "../../interfaces/adminCms.interface";
import { heroSettingsApi } from "../../services/admin/heroSettingsApi";
import { optionalText } from "../../utils/formValidation";

type TextKey =
  | "title"
  | "subtitle"
  | "description"
  | "primaryButtonText"
  | "primaryButtonLink"
  | "secondaryButtonText"
  | "secondaryButtonLink";
export const HeroSettingsPage = () => {
  const state = useSettingsForm(heroSettingsApi.get, heroSettingsApi.update);
  const form = state.form;
  if (state.loading) return <LoadingSpinner />;
  if (!form) return <FormFeedback error={state.error} />;
  const text = (key: TextKey, value: string) =>
    state.setForm({
      ...form,
      [key]: key === "title" ? value : optionalText(value),
    });
  const validate = (value: HeroSettingsForm) =>
    !value.title.trim()
      ? "Hero title is required."
      : value.overlayOpacity < 0 || value.overlayOpacity > 1
        ? "Overlay opacity must be between 0 and 1."
        : null;
  return (
    <>
      <AdminPageHeader
        title="Hero"
        description="Manage the public homepage hero content."/>
      <form
        className="adminForm"
        onSubmit={(e) => {
          e.preventDefault();
          void state.save(validate);}}>
        <FormFeedback error={state.error} success={state.success} />
        <div className="formGrid">
          <FormField label="Title" htmlFor="heroTitle">
            <input
              id="heroTitle"
              value={form.title}
              onChange={(e) => text("title", e.target.value)}/>
          </FormField>
          <FormField label="Subtitle" htmlFor="heroSubtitle">
            <input
              id="heroSubtitle"
              value={form.subtitle ?? ""}
              onChange={(e) => text("subtitle", e.target.value)}/>
          </FormField>
          <FormField label="Description" htmlFor="heroDescription">
            <textarea
              id="heroDescription"
              value={form.description ?? ""}
              onChange={(e) => text("description", e.target.value)}/>
          </FormField>
          <FormField label="Primary button text">
            <input
              value={form.primaryButtonText ?? ""}
              onChange={(e) => text("primaryButtonText", e.target.value)}/>
          </FormField>
          <FormField label="Primary button link">
            <input
              value={form.primaryButtonLink ?? ""}
              onChange={(e) => text("primaryButtonLink", e.target.value)}/>
          </FormField>
          <FormField label="Secondary button text">
            <input
              value={form.secondaryButtonText ?? ""}
              onChange={(e) => text("secondaryButtonText", e.target.value)}/>
          </FormField>
          <FormField label="Secondary button link">
            <input
              value={form.secondaryButtonLink ?? ""}
              onChange={(e) => text("secondaryButtonLink", e.target.value)}/>
          </FormField>
          <FormField label="Text alignment">
            <select
              value={form.textAlignment}
              onChange={(e) =>
                state.setForm({
                  ...form,
                  textAlignment: e.target
                    .value as HeroSettingsForm["textAlignment"],})}>
              <option value="LEFT">Left</option>
              <option value="CENTER">Center</option>
              <option value="RIGHT">Right</option>
            </select>
          </FormField>
          <FormField label="Overlay opacity">
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={form.overlayOpacity}
              onChange={(e) =>
                state.setForm({
                  ...form,
                  overlayOpacity: Number(e.target.value),})}/>
          </FormField>
        </div>
        <div className="formGrid">
          <ImageUploader
            label="Background image"
            type="hero"
            value={form.backgroundImageUrl}
            onChange={(backgroundImageUrl) =>
              state.setForm({ ...form, backgroundImageUrl })}/>
          <ImageUploader
            label="Foreground image"
            type="hero"
            value={form.foregroundImageUrl}
            onChange={(foregroundImageUrl) =>
              state.setForm({ ...form, foregroundImageUrl })}/>
        </div>
        <StatusToggle
          label="Hero visible"
          checked={form.isVisible}
          onChange={(isVisible) => state.setForm({ ...form, isVisible })}/>
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
