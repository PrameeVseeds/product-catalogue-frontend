import { useState } from "react";
import type {ProductFeature,ProductFeatureForm,} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productFeatureApi } from "../../services/admin/productFeatureApi";
import { ConfirmDialog } from "./confirmDialog";
import { FormFeedback } from "./formFeedback";
import { FormField } from "./formField";
export const ProductFeatureManager = ({
  productId,
  items,
  onRefresh,
}: {
  productId: number;
  items: ProductFeature[];
  onRefresh: () => Promise<void>;
}) => {
  const [edit, setEdit] = useState<{
    id?: number;
    value: ProductFeatureForm;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async () => {
    if (!edit || !edit.value.featureText.trim())
      return setError("Feature text is required.");
    setBusy(true);
    try {
      if (edit.id) await productFeatureApi.update(edit.id, edit.value);
      else await productFeatureApi.create(edit.value);
      setEdit(null);
      setError("");
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to save feature."));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (deleting === null) return;
    setBusy(true);
    try {
      await productFeatureApi.delete(deleting);
      setDeleting(null);
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to delete feature."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="managementSection">
      <div className="adminSubheader">
        <h2>Features</h2>
        <button
          className="adminButton primary"
          onClick={() =>
            setEdit({ value: { productId, featureText: "", displayOrder: 0 } })
          }
        >
          Add Feature
        </button>
      </div>
      <FormFeedback error={error} />
      {edit && (
        <form
          className="nestedEditor"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div className="formGrid">
            <FormField label="Feature text">
              <input
                value={edit.value.featureText}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, featureText: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Display order">
              <input
                type="number"
                value={edit.value.displayOrder}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      displayOrder: Number(e.target.value),
                    },
                  })
                }
              />
            </FormField>
          </div>
          <div className="formActions">
            <button
              className="adminButton secondary"
              type="button"
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
            <button className="adminButton primary" disabled={busy}>
              Save Feature
            </button>
          </div>
        </form>
      )}
      <div className="adminList">
        {items.map((item) => (
          <article className="adminListCard" key={item.id}>
            <div>
              <strong>{item.featureText}</strong>
              <p>Order {item.displayOrder}</p>
            </div>
            <div className="listActions">
              <button
                className="adminButton secondary"
                onClick={() =>
                  setEdit({
                    id: item.id,
                    value: {
                      productId,
                      featureText: item.featureText,
                      displayOrder: item.displayOrder,
                    },
                  })
                }
              >
                Edit
              </button>
              <button
                className="adminButton danger"
                onClick={() => setDeleting(item.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete feature?"
        message="This feature will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
};
