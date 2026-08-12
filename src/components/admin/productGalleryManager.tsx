import { useState } from "react";
import type {
  ProductImage,
  ProductImageForm,
} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productImageApi } from "../../services/admin/productImageApi";
import { getImageUrl } from "../../utils/getImageUrl";
import { ConfirmDialog } from "./confirmDialog";
import { FormFeedback } from "./formFeedback";
import { FormField } from "./formField";
import { ImageUploader } from "./imageUploader";
import { StatusToggle } from "./statusToggle";

const values = (productId: number, item?: ProductImage): ProductImageForm =>
  item
    ? {
        productId,
        imageUrl: item.imageUrl,
        altText: item.altText,
        displayOrder: item.displayOrder,
        isPrimary: item.isPrimary,
      }
    : {
        productId,
        imageUrl: "",
        altText: null,
        displayOrder: 0,
        isPrimary: false,
      };
export const ProductGalleryManager = ({
  productId,
  items,
  onRefresh,
}: {
  productId: number;
  items: ProductImage[];
  onRefresh: () => Promise<void>;
}) => {
  const [edit, setEdit] = useState<{
    id?: number;
    value: ProductImageForm;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const save = async () => {
    if (!edit || busy) return;
    if (!edit.value.imageUrl)
      return setFeedback({
        error: "Upload an image before saving.",
        success: "",
      });
    setBusy(true);
    try {
      if (edit.id) await productImageApi.update(edit.id, edit.value);
      else await productImageApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Gallery image saved." });
      await onRefresh();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save gallery image."),
        success: "",
      });
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (deleting === null) return;
    setBusy(true);
    try {
      await productImageApi.delete(deleting);
      setDeleting(null);
      await onRefresh();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete gallery image."),
        success: "",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="managementSection">
      <div className="adminSubheader">
        <h2>Gallery</h2>
        <button
          className="adminButton primary"
          onClick={() => setEdit({ value: values(productId) })}
        >
          Add Image
        </button>
      </div>
      <FormFeedback {...feedback} />
      {edit && (
        <form
          className="nestedEditor"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <ImageUploader
            label="Gallery image"
            required
            type="product"
            value={edit.value.imageUrl || null}
            onChange={(imageUrl) =>
              setEdit({
                ...edit,
                value: { ...edit.value, imageUrl: imageUrl ?? "" },
              })
            }
          />
          <div className="formGrid">
            <FormField label="Alt text">
              <input
                value={edit.value.altText ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      altText: e.target.value.trim() || null,
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
          <StatusToggle
            label="Primary image"
            checked={edit.value.isPrimary}
            onChange={(isPrimary) =>
              setEdit({ ...edit, value: { ...edit.value, isPrimary } })
            }
          />
          <div className="formActions">
            <button
              className="adminButton secondary"
              type="button"
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
            <button className="adminButton primary" disabled={busy}>
              Save Image
            </button>
          </div>
        </form>
      )}
      <div className="assetGrid">
        {items.map((item) => (
          <article className="assetCard" key={item.id}>
            <img src={getImageUrl(item.imageUrl)} alt={item.altText ?? ""} />
            <div>
              <strong>{item.altText || "Gallery image"}</strong>
              <p>
                Order {item.displayOrder}
                {item.isPrimary ? " · Primary" : ""}
              </p>
            </div>
            <div className="listActions">
              <button
                className="adminButton secondary"
                onClick={() =>
                  setEdit({ id: item.id, value: values(productId, item) })
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
        title="Delete gallery image?"
        message="The gallery record will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
};
