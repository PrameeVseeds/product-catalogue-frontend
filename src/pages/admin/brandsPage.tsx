import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { ImageUploader } from "../../components/admin/imageUploader";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminBrand,
  BrandForm,
} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { brandAdminApi } from "../../services/admin/brandAdminApi";
import { createSlug } from "../../utils/createSlug";
import { isHttpUrl, optionalText } from "../../utils/formValidation";
import { getImageUrl } from "../../utils/getImageUrl";

const empty: BrandForm = {
  name: "",
  slug: "",
  countryName: null,
  countryCode: null,
  logoUrl: null,
  flagImageUrl: null,
  websiteUrl: null,
  description: null,
  displayOrder: 0,
  isActive: true,
};
const values = ({
  name,
  slug,
  countryName,
  countryCode,
  logoUrl,
  flagImageUrl,
  websiteUrl,
  description,
  displayOrder,
  isActive,
}: AdminBrand): BrandForm => ({
  name,
  slug,
  countryName,
  countryCode,
  logoUrl,
  flagImageUrl,
  websiteUrl,
  description,
  displayOrder,
  isActive,
});
export const BrandsPage = () => {
  const [items, setItems] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [edit, setEdit] = useState<{ id?: number; value: BrandForm } | null>(
    null,
  );
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      setItems(await brandAdminApi.getAll());
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to load brands."),
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
    if (!edit.value.name.trim() || !edit.value.slug.trim())
      return setFeedback({ error: "Name and slug are required.", success: "" });
    if (edit.value.websiteUrl && !isHttpUrl(edit.value.websiteUrl))
      return setFeedback({ error: "Enter a valid website URL.", success: "" });
    setSaving(true);
    try {
      if (edit.id) await brandAdminApi.update(edit.id, edit.value);
      else await brandAdminApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Brand saved successfully." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save brand."),
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
      await brandAdminApi.delete(deleteId);
      setDeleteId(null);
      setFeedback({ error: "", success: "Brand deleted." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete brand."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  const setText = (key: keyof BrandForm, input: string) =>
    edit &&
    setEdit({
      ...edit,
      value: {
        ...edit.value,
        [key]: key === "name" || key === "slug" ? input : optionalText(input),
      },
    });
  return (
    <>
      <AdminPageHeader
        title="Brands"
        description="Manage catalogue brands and partner details."
        action={
          <button
            className="adminButton primary"
            onClick={() => {
              setEdit({ value: empty });
              setSlugEdited(false);
            }}
          >
            Add Brand
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
                  setText("slug", e.target.value);
                }}
              />
            </FormField>
            {(["countryName", "countryCode", "websiteUrl"] as const).map(
              (key) => (
                <FormField
                  key={key}
                  label={
                    key === "countryName"
                      ? "Country name"
                      : key === "countryCode"
                        ? "Country code"
                        : "Website URL"
                  }
                >
                  <input
                    value={edit.value[key] ?? ""}
                    onChange={(e) => setText(key, e.target.value)}
                  />
                </FormField>
              ),
            )}
            <FormField label="Description">
              <textarea
                value={edit.value.description ?? ""}
                onChange={(e) => setText("description", e.target.value)}
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
          <div className="formGrid">
            <ImageUploader
              label="Brand logo"
              type="brand"
              value={edit.value.logoUrl}
              onChange={(logoUrl) =>
                setEdit({ ...edit, value: { ...edit.value, logoUrl } })
              }
            />
            <ImageUploader
              label="Flag image"
              type="brand"
              value={edit.value.flagImageUrl}
              onChange={(flagImageUrl) =>
                setEdit({ ...edit, value: { ...edit.value, flagImageUrl } })
              }
            />
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
              {saving ? "Saving…" : "Save Brand"}
            </button>
          </div>
        </form>
      )}
      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Country</th>
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
                  {item.logoUrl ? (
                    <img
                      className="tableImage"
                      src={getImageUrl(item.logoUrl)}
                      alt={`${item.name} logo`}
                    />
                  ) : (
                    <span className="emptyCell">No logo</span>
                  )}
                </td>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.countryName || "-"}</td>
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
        title="Delete brand?"
        message="Brands with category relationships cannot be deleted."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
