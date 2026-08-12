import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { SubcategoriesTable } from "../../components/admin/subcategoriesTable";
import type {AdminBrand,AdminCategory,AdminCategoryBrand,AdminSubcategory,SubcategoryForm,} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { brandAdminApi } from "../../services/admin/brandAdminApi";
import { categoryAdminApi } from "../../services/admin/categoryAdminApi";
import { categoryBrandApi } from "../../services/admin/categoryBrandApi";
import { subcategoryAdminApi } from "../../services/admin/subcategoryAdminApi";
import { createSlug } from "../../utils/createSlug";
import { optionalText } from "../../utils/formValidation";
import { getImageUrl } from "../../utils/getImageUrl";

const values = ({
  categoryId,
  categoryBrandId,
  name,
  slug,
  description,
  imageUrl,
  displayOrder,
  isActive,
}: AdminSubcategory): SubcategoryForm => ({
  categoryId,
  categoryBrandId,
  name,
  slug,
  description,
  imageUrl,
  displayOrder,
  isActive,
});
export const SubcategoriesPage = () => {
  const [items, setItems] = useState<AdminSubcategory[]>([]);
  const [relations, setRelations] = useState<AdminCategoryBrand[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [edit, setEdit] = useState<{
    id?: number;
    value: SubcategoryForm;
  } | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      const [a, b, c, d] = await Promise.all([
        subcategoryAdminApi.getAll(),
        categoryBrandApi.getAll(),
        categoryAdminApi.getAll(),
        brandAdminApi.getAll(),
      ]);
      setItems(a);
      setRelations(b);
      setCategories(c);
      setBrands(d);
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to load subcategories."),
        success: "",
      });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const relationName = (id: number | null, categoryId = 0) => {
    if (id === null)
      return `${categories.find((category) => category.id === categoryId)?.name ?? "Category"} - No brand`;
    const relation = relations.find((r) => r.id === id);
    return relation
      ? `${categories.find((c) => c.id === relation.categoryId)?.name ?? "Category"} - ${brands.find((b) => b.id === relation.brandId)?.name ?? "Brand"}`
      : "Unavailable relationship";
  };
  const save = async () => {
    if (!edit || saving) return;
    if (
      !edit.value.categoryId ||
      !edit.value.name.trim() ||
      !edit.value.slug.trim()
    )
      return setFeedback({
        error: "Category, name and slug are required.",
        success: "",
      });
    setSaving(true);
    try {
      if (edit.id) await subcategoryAdminApi.update(edit.id, edit.value);
      else await subcategoryAdminApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Subcategory saved successfully." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save subcategory."),
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
      await subcategoryAdminApi.delete(deleteId);
      setDeleteId(null);
      setFeedback({ error: "", success: "Subcategory deleted." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete subcategory."),
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
        title="Subcategories"
        description="Manage product groupings within category-brand relationships."
        action={
          <button
            className="adminButton primary"
            onClick={() => {
              setEdit({
                value: {
                  categoryId: categories[0]?.id ?? 0,
                  categoryBrandId: null,
                  name: "",
                  slug: "",
                  description: null,
                  imageUrl: null,
                  displayOrder: 0,
                  isActive: true,
                },
              });
              setSlugEdited(false);
            }}
          >
            Add Subcategory
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
            <FormField label="Category">
              <select
                value={edit.value.categoryId}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      categoryId: Number(e.target.value),
                      categoryBrandId: null,
                    },
                  })
                }
              >
                <option value={0}>Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Brand (optional)">
              <select
                value={edit.value.categoryBrandId ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      categoryBrandId: e.target.value
                        ? Number(e.target.value)
                        : null,
                    },
                  })
                }
              >
                <option value="">No brand</option>
                {relations
                  .filter((item) => item.categoryId === edit.value.categoryId)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {relationName(item.id)}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField label="Name">
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
            <FormField label="Slug">
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
            label="Subcategory image"
            type="subcategory"
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
              Save Subcategory
            </button>
          </div>
        </form>
      )}
      <SubcategoriesTable
        items={items}
        relationshipName={relationName}
        onEdit={(item) => {
          setEdit({ id: item.id, value: values(item) });
          setSlugEdited(true);
        }}
        onDelete={setDeleteId}
      />
      <div className="adminList legacyCatalogueList">
        {items.map((item) => (
          <article className="adminListCard catalogueListCard" key={item.id}>
            {item.imageUrl && (
              <img src={getImageUrl(item.imageUrl)} alt={item.name} />
            )}
            <div className="listCardContent">
              <h2>{item.name}</h2>
              <p>
                {relationName(item.categoryBrandId)} · Order {item.displayOrder}{" "}
                · {item.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="listActions">
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
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete subcategory?"
        message="Subcategories containing products cannot be deleted."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
