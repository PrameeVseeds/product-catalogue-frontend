import type { HomeSectionItemForm as ItemValues } from "../../interfaces/adminCms.interface";
import { optionalText } from "../../utils/formValidation";
import { FormField } from "./formField";
import { IconPicker } from "./iconPicker";
import { ImageUploader } from "./imageUploader";
import { StatusToggle } from "./statusToggle";

interface Props {
  value: ItemValues;
  saving: boolean;
  onChange: (value: ItemValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const HomeSectionItemForm = ({value,saving,onChange,onSubmit,onCancel}: Props) => {
  const text = (key: keyof ItemValues, input: string) =>
    onChange({
      ...value,
      [key]: key === "title" ? input : optionalText(input),
    });
  return (
    <form
      className="nestedEditor itemEditor"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();}}>
      <h3>Section item</h3>
      <fieldset className="editorGroup">
        <legend>Content</legend>
        <div className="formGrid">
          <FormField label="Title" required>
            <input
              value={value.title}
              onChange={(event) => text("title", event.target.value)}/>
          </FormField>
          <FormField label="Subtitle">
            <input
              value={value.subtitle ?? ""}
              onChange={(event) => text("subtitle", event.target.value)}/>
          </FormField>
          <FormField label="Description">
            <textarea
              value={value.description ?? ""}
              onChange={(event) => text("description", event.target.value)}/>
          </FormField>
        </div>
      </fieldset>
      <fieldset className="editorGroup">
        <legend>Visual</legend>
        <p className="fieldHint">Choose an icon that represents this card.</p>
        <div className="visualEditorGrid">
          <IconPicker
            value={value.iconName}
            onChange={(iconName) => onChange({ ...value, iconName })}/>
          <ImageUploader
            label="Item image"
            type="section"
            value={value.imageUrl}
            onChange={(imageUrl) => onChange({ ...value, imageUrl })}/>
        </div>
      </fieldset>
      <fieldset className="editorGroup">
        <legend>Optional action</legend>
        <p className="fieldHint">
          Leave both fields blank if this card does not need a button.
        </p>
        <div className="formGrid">
          <FormField label="Button text">
            <input
              value={value.buttonText ?? ""}
              onChange={(event) => text("buttonText", event.target.value)}/>
          </FormField>
          <FormField label="Button link">
            <input
              value={value.buttonLink ?? ""}
              onChange={(event) => text("buttonLink", event.target.value)}/>
          </FormField>
        </div>
      </fieldset>
      <fieldset className="editorGroup">
        <legend>Display</legend>
        <div className="displayEditorGrid">
          <FormField label="Display order">
            <input
              type="number"
              min="0"
              value={value.displayOrder}
              onChange={(event) =>
                onChange({ ...value, displayOrder: Number(event.target.value) })
              }/>
            <span className="fieldHint">Lower numbers appear first.</span>
          </FormField>
          <StatusToggle
            label="Visible"
            checked={value.isVisible}
            onChange={(isVisible) => onChange({ ...value, isVisible })}/>
        </div>
      </fieldset>
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
