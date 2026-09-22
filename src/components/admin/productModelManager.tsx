import { useState } from "react";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { ConfirmDialog } from "./confirmDialog";
import { FormFeedback } from "./formFeedback";
import { FormField } from "./formField";
import { getProductModels, serialiseProductModels } from "../../utils/productModels";

export const ProductModelManager = ({
  modelNumber,
  onSave,
}: {
  modelNumber: string | null;
  onSave: (modelNumber: string | null) => Promise<void>;
}) => {
  const models = getProductModels(modelNumber);
  const [edit, setEdit] = useState<{ index?: number; value: string } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async () => {
    const value = edit?.value.trim();
    if (!edit || !value) return setError("Model is required.");
    const next = [...models];
    if (edit.index === undefined) next.push(value);
    else next[edit.index] = value;
    setBusy(true);
    try {
      await onSave(serialiseProductModels(next));
      setEdit(null);
      setError("");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to save model."));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (deleting === null) return;
    setBusy(true);
    try {
      await onSave(serialiseProductModels(models.filter((_, index) => index !== deleting)));
      setDeleting(null);
      setError("");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to delete model."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="managementSection">
      <div className="adminSubheader">
        <div>
          <h2>Models</h2>
          <p className="fieldHint">Optional. Add each compatible model separately.</p>
        </div>
        <button className="adminButton primary addButton" type="button" onClick={() => setEdit({ value: "" })}>
          Add Model
        </button>
      </div>
      <FormFeedback error={error} />
      {edit && (
        <form className="nestedEditor" onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <div className="formGrid">
            <FormField label="Model" required>
              <input autoFocus value={edit.value} onChange={(event) => setEdit({ ...edit, value: event.target.value })} />
            </FormField>
          </div>
          <div className="formActions">
            <button className="adminButton secondary" type="button" onClick={() => setEdit(null)}>Cancel</button>
            <button className="adminButton primary saveButton" disabled={busy}>Save Model</button>
          </div>
        </form>
      )}
      {models.length ? (
        <div className="adminList">
          {models.map((model, index) => (
            <article className="adminListCard" key={`${model}-${index}`}>
              <strong>{model}</strong>
              <div className="listActions">
                <button className="adminButton secondary" type="button" onClick={() => setEdit({ index, value: model })}>Edit</button>
                <button className="adminButton danger" type="button" onClick={() => setDeleting(index)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : <p className="adminEmptyState">No models added.</p>}
      <ConfirmDialog open={deleting !== null} title="Delete model?" message="This model will be removed from the product." busy={busy} onCancel={() => setDeleting(null)} onConfirm={() => void remove()} />
    </section>
  );
};
