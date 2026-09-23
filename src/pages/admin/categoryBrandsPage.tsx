import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminBrand,
  AdminCategory,
  AdminCategoryBrand,
  CategoryBrandForm,
} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { brandAdminApi } from "../../services/admin/brandAdminApi";
import { categoryAdminApi } from "../../services/admin/categoryAdminApi";
import { categoryBrandApi } from "../../services/admin/categoryBrandApi";

export const CategoryBrandsPage = () => {
  const [items, setItems] = useState<AdminCategoryBrand[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [edit, setEdit] = useState<{
    id?: number;
    value: CategoryBrandForm;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      const [relations, categoryData, brandData] = await Promise.all([
        categoryBrandApi.getAll(),
        categoryAdminApi.getAll(),
        brandAdminApi.getAll(),
      ]);
      setItems(relations);
      setCategories(categoryData);
      setBrands(brandData);
    } catch (e) {
      setFeedback({
        error: getAdminApiError(
          e,
          "Unable to load category-brand relationships.",
        ),
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
    if (!edit.value.categoryId || !edit.value.brandId)
      return setFeedback({
        error: "Category and brand are required.",
        success: "",
      });
    setSaving(true);
    try {
      if (edit.id) await categoryBrandApi.update(edit.id, edit.value);
      else await categoryBrandApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Relationship saved successfully." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save relationship."),
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
      await categoryBrandApi.delete(deleteId);
      setDeleteId(null);
      setFeedback({ error: "", success: "Relationship deleted." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete relationship."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  const name = (list: { id: number; name: string }[], id: number) =>
    list.find((entry) => entry.id === id)?.name ?? "Unavailable";
  return (
    <>
      <AdminPageHeader
        title="Category Brands"
        description="Connect categories with available brands."
        action={
          <button
            className="adminButton primary addButton"
            onClick={() =>
              setEdit({
                value: {
                  categoryId: categories[0]?.id ?? 0,
                  brandId: brands[0]?.id ?? 0,
                  displayOrder: 0,
                  isActive: true,
                },
              })
            }
          >
            Add Relationship
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
            <FormField label="Category" required>
              <select
                value={edit.value.categoryId}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      categoryId: Number(e.target.value),
                    },
                  })
                }
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Brand" required>
              <select
                value={edit.value.brandId}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, brandId: Number(e.target.value) },
                  })
                }
              >
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
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
              Save Relationship
            </button>
          </div>
        </form>
      )}
      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Brand</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{name(categories, item.categoryId)}</strong>
                </td>
                <td>{name(brands, item.brandId)}</td>
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
                      onClick={() =>
                        setEdit({
                          id: item.id,
                          value: {
                            categoryId: item.categoryId,
                            brandId: item.brandId,
                            displayOrder: item.displayOrder,
                            isActive: item.isActive,
                          },
                        })
                      }
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
        title="Delete relationship?"
        message="Relationships with subcategories cannot be deleted."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
