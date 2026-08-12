import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminCategory,
  CategoryForm,
} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { categoryAdminApi } from "../../services/admin/categoryAdminApi";
import { createSlug } from "../../utils/createSlug";
import { optionalText } from "../../utils/formValidation";
import { getImageUrl } from "../../utils/getImageUrl";

const empty: CategoryForm = {
  name: "",
  slug: "",
  description: null,
  imageUrl: null,
  displayOrder: 0,
  isActive: true,
};
const values = ({
  name,
  slug,
  description,
  imageUrl,
  displayOrder,
  isActive,
}: AdminCategory): CategoryForm => ({
  name,
  slug,
  description,
  imageUrl,
  displayOrder,
  isActive,
});
export const CategoriesPage = () => {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [edit, setEdit] = useState<{ id?: number; value: CategoryForm } | null>(
    null,
  );
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      setItems(await categoryAdminApi.getAll());
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to load categories."),
        success: "",
      });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const save = async () => {
    if (!edit || saving) return;
    if (!edit.value.name.trim() || !edit.value.slug.trim()) {
      setFeedback({ error: "Name and slug are required.", success: "" });
      return;
    }
    setSaving(true);
    try {
      if (edit.id) await categoryAdminApi.update(edit.id, edit.value);
      else await categoryAdminApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Category saved successfully." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save category."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (deleteId === null) return;
    setSaving(true);
    try {
      await categoryAdminApi.delete(deleteId);
      setDeleteId(null);
      setFeedback({ error: "", success: "Category deleted." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete category."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Manage top-level product categories."
        action={
          <button
            className="adminButton primary"
            onClick={() => {
              setEdit({ value: empty });
              setSlugEdited(false);
            }}
          >
            Add Category
          </button>
        }
      />
      <FormFeedback {...feedback} />
      {edit && (
        <form
          className="adminPanel adminForm editorPanel"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div className="formGrid">
            <FormField label="Name" required>
              <input
                value={edit.value.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      name,
                      ...(!slugEdited && { slug: createSlug(name) }),
                    },
                  });
                }}
              />
            </FormField>
            <FormField label="Slug" required>
              <input
                value={edit.value.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setEdit({
                    ...edit,
                    value: { ...edit.value, slug: e.target.value },
                  });
                }}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                value={edit.value.description ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      description: optionalText(e.target.value),
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
          <ImageUploader
            label="Category image"
            type="category"
            value={edit.value.imageUrl}
            onChange={(imageUrl) =>
              setEdit({ ...edit, value: { ...edit.value, imageUrl } })
            }
          />
          <StatusToggle
            label="Active"
            checked={edit.value.isActive}
            onChange={(isActive) =>
              setEdit({ ...edit, value: { ...edit.value, isActive } })
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
            <button className="adminButton primary" disabled={saving}>
              {saving ? "Saving…" : "Save Category"}
            </button>
          </div>
        </form>
      )}
      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imageUrl ? (
                    <img
                      className="tableImage"
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                    />
                  ) : (
                    <span className="emptyCell">No image</span>
                  )}
                </td>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>/{item.slug}</td>
                <td>{item.displayOrder}</td>
                <td>
                  <span
                    className={`statusPill ${item.isActive ? "active" : "inactive"}`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="tableActions">
                    <button
                      className="adminButton secondary"
                      onClick={() => {
                        setEdit({ id: item.id, value: values(item) });
                        setSlugEdited(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="adminButton danger"
                      onClick={() => setDeleteId(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete category?"
        message="Categories with existing relationships cannot be deleted."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
