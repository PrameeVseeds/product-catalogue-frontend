import { useState } from "react";
import type {ProductSpecification,ProductSpecificationForm,} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productSpecificationApi } from "../../services/admin/productSpecificationApi";
import { ConfirmDialog } from "./confirmDialog";
import { FormFeedback } from "./formFeedback";
import { FormField } from "./formField";
export const ProductSpecificationManager = ({
  productId,
  items,
  onRefresh,
}: {
  productId: number;
  items: ProductSpecification[];
  onRefresh: () => Promise<void>;
}) => {
  const [edit, setEdit] = useState<{
    id?: number;
    value: ProductSpecificationForm;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async () => {
    if (
      !edit ||
      !edit.value.specificationName.trim() ||
      !edit.value.specificationValue.trim()
    )
      return setError("Specification name and value are required.");
    setBusy(true);
    try {
      if (edit.id) await productSpecificationApi.update(edit.id, edit.value);
      else await productSpecificationApi.create(edit.value);
      setEdit(null);
      setError("");
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to save specification."));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (deleting === null) return;
    setBusy(true);
    try {
      await productSpecificationApi.delete(deleting);
      setDeleting(null);
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to delete specification."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="managementSection">
      <div className="adminSubheader">
        <h2>Specifications</h2>
        <button
          className="adminButton primary"
          onClick={() =>
            setEdit({
              value: {
                productId,
                specificationName: "",
                specificationValue: "",
                displayOrder: 0,
              },
            })
          }
        >
          Add Specification
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
            <FormField label="Name">
              <input
                value={edit.value.specificationName}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, specificationName: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Value">
              <input
                value={edit.value.specificationValue}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      specificationValue: e.target.value,
                    },
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
              Save Specification
            </button>
          </div>
        </form>
      )}
      <div className="adminList">
        {items.map((item) => (
          <article className="adminListCard" key={item.id}>
            <div>
              <strong>{item.specificationName}</strong>
              <p>
                {item.specificationValue} · Order {item.displayOrder}
              </p>
            </div>
            <div className="listActions">
              <button
                className="adminButton secondary"
                onClick={() =>
                  setEdit({
                    id: item.id,
                    value: {
                      productId,
                      specificationName: item.specificationName,
                      specificationValue: item.specificationValue,
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
        title="Delete specification?"
        message="This specification will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
};
