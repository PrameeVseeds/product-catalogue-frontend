import type { HomeSectionForm as HomeSectionValues } from "../../interfaces/adminCms.interface";
import { optionalText } from "../../utils/formValidation";
import { FormField } from "./formField";
import { ImageUploader } from "./imageUploader";
import { StatusToggle } from "./statusToggle";

interface Props {
  value: HomeSectionValues;
  saving: boolean;
  onChange: (value: HomeSectionValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export const HomeSectionForm = ({value,saving,onChange,onSubmit,onCancel,}: Props) => {
  const text = (key: keyof HomeSectionValues, input: string) =>
    onChange({
      ...value,
      [key]: key === "sectionKey" ? input : optionalText(input),
    });
  return (
    <form
      className="adminPanel adminForm editorPanel"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();}}>
      <div className="formGrid">
        <FormField label="Section key" required>
          <input
            value={value.sectionKey}
            onChange={(e) => text("sectionKey", e.target.value)}/>
        </FormField>
        <FormField label="Section type" required>
          <select
            value={value.sectionType}
            onChange={(e) =>
              onChange({
                ...value,
                sectionType: e.target.value as HomeSectionValues["sectionType"],
              })}>
            {[
              "CONTENT",
              "CARDS",
              "CATEGORIES",
              "FEATURED_PRODUCTS",
              "BRANDS",
              "CTA",
            ].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          {value.sectionType === "FEATURED_PRODUCTS" && (
            <small className="fieldHint">
              Shows products marked Featured in an auto-scrolling row. Turn
              Visible off to hide the entire row from the homepage.
            </small>
          )}
        </FormField>
        <FormField label="Title">
          <input
            value={value.title ?? ""}
            onChange={(e) => text("title", e.target.value)}/>
        </FormField>
        <FormField label="Subtitle">
          <input
            value={value.subtitle ?? ""}
            onChange={(e) => text("subtitle", e.target.value)}/>
        </FormField>
        <FormField label="Description">
          <textarea
            value={value.description ?? ""}
            onChange={(e) => text("description", e.target.value)}/>
        </FormField>
        <FormField label="Button text">
          <input
            value={value.buttonText ?? ""}
            onChange={(e) => text("buttonText", e.target.value)}/>
        </FormField>
        <FormField label="Button link">
          <input
            value={value.buttonLink ?? ""}
            onChange={(e) => text("buttonLink", e.target.value)}/>
        </FormField>
        <FormField label="Display order">
          <input
            type="number"
            step="1"
            value={value.displayOrder}
            onChange={(e) =>
              onChange({ ...value, displayOrder: Number(e.target.value) })}/>
        </FormField>
      </div>
      <div className="formGrid">
        <ImageUploader
          label="Section image"
          type="section"
          value={value.imageUrl}
          onChange={(imageUrl) => onChange({ ...value, imageUrl })}/>
        <ImageUploader
          label="Background image"
          type="section"
          value={value.backgroundImageUrl}
          onChange={(backgroundImageUrl) =>
            onChange({ ...value, backgroundImageUrl })}/>
      </div>
      <StatusToggle
        label="Visible"
        checked={value.isVisible}
        onChange={(isVisible) => onChange({ ...value, isVisible })}/>
      <div className="formActions">
        <button
          className="adminButton secondary"
          type="button"
          onClick={onCancel}>
          Cancel
        </button>
        <button className="adminButton primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Section"}
        </button>
      </div>
    </form>
  );
};
