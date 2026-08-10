import type { HomeSectionItemForm as ItemValues } from "../../interfaces/adminCms.interface";
import { optionalText } from "../../utils/formValidation";
import { FormField } from "./formField";
import { ImageUploader } from "./imageUploader";
import { StatusToggle } from "./statusToggle";

interface Props {
  value: ItemValues;
  saving: boolean;
  onChange: (value: ItemValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export const HomeSectionItemForm = ({value,saving,onChange,onSubmit,onCancel,}: Props) => {
  const text = (key: keyof ItemValues, input: string) =>
    onChange({
      ...value,
      [key]: key === "title" ? input : optionalText(input),
    });
  return (
    <form
      className="nestedEditor"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}>
      <h3>Section item</h3>
      <div className="formGrid">
        <FormField label="Title">
          <input
            value={value.title}
            onChange={(e) => text("title", e.target.value)} />
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
        <FormField label="Icon name">
          <input
            value={value.iconName ?? ""}
            onChange={(e) => text("iconName", e.target.value)}/>
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
            value={value.displayOrder}
            onChange={(e) =>
              onChange({ ...value, displayOrder: Number(e.target.value) })}/>
        </FormField>
      </div>
      <ImageUploader
        label="Item image"
        type="section"
        value={value.imageUrl}
        onChange={(imageUrl) => onChange({ ...value, imageUrl })}/>
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
          {saving ? "Saving…" : "Save Item"}
        </button>
      </div>
    </form>
  );
};
