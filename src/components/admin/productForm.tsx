import { useMemo, useState } from "react";
import type {AdminBrand,AdminCategory,AdminCategoryBrand,AdminSubcategory,ProductFormValues,} from "../../interfaces/catalogueAdmin.interface";
import { createSlug } from "../../utils/createSlug";
import { optionalText } from "../../utils/formValidation";
import { FormField } from "./formField";
import { ImageUploader } from "./imageUploader";
import { StatusToggle } from "./statusToggle";
import { DatasheetUploader } from "./datasheetUploader";

interface Props {
  value: ProductFormValues;
  categories: AdminCategory[];
  brands: AdminBrand[];
  relations: AdminCategoryBrand[];
  subcategories: AdminSubcategory[];
  saving: boolean;
  onChange: (value: ProductFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export const ProductForm = ({
  value,
  categories,
  brands,
  relations,
  subcategories,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: Props) => {
  const initialRelation = relations.find(
    (relation) =>
      relation.id ===
      subcategories.find((item) => item.id === value.subcategoryId)
        ?.categoryBrandId,
  );
  const selectedSubcategory = subcategories.find(
    (item) => item.id === value.subcategoryId,
  );
  const [categoryId, setCategoryId] = useState(
    selectedSubcategory?.categoryId ?? initialRelation?.categoryId ?? 0,
  );
  const [brandId, setBrandId] = useState(initialRelation?.brandId ?? 0);
  const [slugEdited, setSlugEdited] = useState(Boolean(value.slug));
  const availableRelations = useMemo(
    () => relations.filter((relation) => relation.categoryId === categoryId),
    [relations, categoryId],
  );
  const availableBrands = useMemo(
    () =>
      brands.filter((brand) =>
        availableRelations.some((relation) => relation.brandId === brand.id),
      ),
    [brands, availableRelations],
  );
  const relation = availableRelations.find(
    (entry) => entry.brandId === brandId,
  );
  const availableSubcategories = subcategories.filter(
    (item) =>
      item.categoryId === categoryId &&
      (brandId
        ? item.categoryBrandId === relation?.id
        : item.categoryBrandId === null),
  );
  const text = (key: keyof ProductFormValues, input: string) =>
    onChange({
      ...value,
      [key]: key === "name" || key === "slug" ? input : optionalText(input),
    });
  return (
    <form
      className="adminPanel adminForm editorPanel"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="settingsGroup">
        <h2>Catalogue placement</h2>
        <div className="formGrid">
          <FormField label="Category (optional)">
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(Number(e.target.value));
                setBrandId(0);
                onChange({ ...value, subcategoryId: null });
              }}
            >
              <option value={0}>Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Brand (optional)">
            <select
              value={brandId}
              disabled={!categoryId}
              onChange={(e) => {
                setBrandId(Number(e.target.value));
                onChange({ ...value, subcategoryId: null });
              }}
            >
              <option value={0}>Select brand</option>
              {availableBrands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Subcategory (optional)">
            <select
              value={value.subcategoryId ?? 0}
              disabled={!categoryId}
              onChange={(e) =>
                onChange({
                  ...value,
                  subcategoryId: Number(e.target.value) || null,
                })
              }
            >
              <option value={0}>Select subcategory</option>
              {availableSubcategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>
      <div className="formGrid">
        <FormField label="Product name" required>
          <input
            value={value.name}
            onChange={(e) => {
              const name = e.target.value;
              onChange({
                ...value,
                name,
                ...(!slugEdited && { slug: createSlug(name) }),
              });
            }}
          />
        </FormField>
        <FormField label="Slug" required>
          <input
            value={value.slug}
            onChange={(e) => {
              setSlugEdited(true);
              text("slug", e.target.value);
            }}
          />
        </FormField>
        <FormField label="Initial model (optional)">
          <input
            value={value.modelNumber ?? ""}
            onChange={(e) => text("modelNumber", e.target.value)}
          />
          <small className="fieldHint">After saving the product, add and manage multiple models from its Manage page.</small>
        </FormField>
        <FormField label="Short description">
          <textarea
            value={value.shortDescription ?? ""}
            onChange={(e) => text("shortDescription", e.target.value)}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            value={value.description ?? ""}
            onChange={(e) => text("description", e.target.value)}
          />
        </FormField>
        <FormField label="Display order">
          <input
            type="number"
            value={value.displayOrder}
            onChange={(e) =>
              onChange({ ...value, displayOrder: Number(e.target.value) })
            }
          />
        </FormField>
      </div>
      <ImageUploader
        label="Main product image"
        type="product"
        value={value.mainImageUrl}
        onChange={(mainImageUrl) => onChange({ ...value, mainImageUrl })}
      />
      <div className="settingsGroup">
        <h2>Datasheet PDF</h2>
        <DatasheetUploader type="datasheet" value={value.datasheetFileUrl} onChange={(datasheetFileUrl) => onChange({ ...value, datasheetFileUrl })} />
      </div>
      <div className="settingsGroup">
        <h2>Search metadata</h2>
        <div className="formGrid">
          <FormField label="Meta title">
            <input
              value={value.metaTitle ?? ""}
              onChange={(e) => text("metaTitle", e.target.value)}
            />
          </FormField>
          <FormField label="Meta description">
            <textarea
              value={value.metaDescription ?? ""}
              onChange={(e) => text("metaDescription", e.target.value)}
            />
          </FormField>
        </div>
      </div>
      <div className="toggleRow">
        <StatusToggle
          label="Featured"
          checked={value.isFeatured}
          onChange={(isFeatured) => onChange({ ...value, isFeatured })}
        />
        <StatusToggle
          label="Active"
          checked={value.isActive}
          onChange={(isActive) => onChange({ ...value, isActive })}
        />
      </div>
      <div className="formActions">
        <button
          className="adminButton secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="adminButton primary" disabled={saving}>
          {saving ? "Saving…" : "Save Product"}
        </button>
      </div>
    </form>
  );
};
