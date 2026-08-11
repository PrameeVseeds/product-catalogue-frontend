import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { ProductForm } from "../../components/admin/productForm";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import { ProductsTable } from "../../components/admin/productsTable";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type {
  AdminBrand,
  AdminCategory,
  AdminCategoryBrand,
  AdminProduct,
  AdminSubcategory,
  ProductFilters,
  ProductFormValues,
} from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { brandAdminApi } from "../../services/admin/brandAdminApi";
import { categoryAdminApi } from "../../services/admin/categoryAdminApi";
import { categoryBrandApi } from "../../services/admin/categoryBrandApi";
import { productAdminApi } from "../../services/admin/productAdminApi";
import { subcategoryAdminApi } from "../../services/admin/subcategoryAdminApi";
import { getImageUrl } from "../../utils/getImageUrl";

const empty: ProductFormValues = {
  subcategoryId: 0,
  name: "",
  slug: "",
  modelNumber: null,
  shortDescription: null,
  description: null,
  mainImageUrl: null,
  datasheetTitle: null,
  datasheetDescription: null,
  datasheetFileUrl: null,
  metaTitle: null,
  metaDescription: null,
  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};
const values = ({
  subcategoryId,
  name,
  slug,
  modelNumber,
  shortDescription,
  description,
  mainImageUrl,
  datasheetTitle,
  datasheetDescription,
  datasheetFileUrl,
  metaTitle,
  metaDescription,
  isFeatured,
  isActive,
  displayOrder,
}: AdminProduct): ProductFormValues => ({
  subcategoryId,
  name,
  slug,
  modelNumber,
  shortDescription,
  description,
  mainImageUrl,
  datasheetTitle,
  datasheetDescription,
  datasheetFileUrl,
  metaTitle,
  metaDescription,
  isFeatured,
  isActive,
  displayOrder,
});
export const ProductsAdminPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [relations, setRelations] = useState<AdminCategoryBrand[]>([]);
  const [subcategories, setSubcategories] = useState<AdminSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [edit, setEdit] = useState<{
    id?: number;
    value: ProductFormValues;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [categorySlug, setCategorySlug] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [featured, setFeatured] = useState("");
  const [active, setActive] = useState("");
  useEffect(() => {
    Promise.all([
      categoryAdminApi.getAll(),
      brandAdminApi.getAll(),
      categoryBrandApi.getAll(),
      subcategoryAdminApi.getAll(),
    ])
      .then(([a, b, c, d]) => {
        setCategories(a);
        setBrands(b);
        setRelations(c);
        setSubcategories(d);
      })
      .catch((e) =>
        setFeedback({
          error: getAdminApiError(e, "Unable to load catalogue dependencies."),
          success: "",
        }),
      );
  }, []);
  const filters = useMemo<ProductFilters>(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(categorySlug && { category: categorySlug }),
      ...(brandSlug && { brand: brandSlug }),
      ...(subcategorySlug && { subcategory: subcategorySlug }),
      ...(featured && { featured: featured === "true" }),
    }),
    [debouncedSearch, categorySlug, brandSlug, subcategorySlug, featured],
  );
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await productAdminApi.getAll(filters));
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to load products."),
        success: "",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);
  useEffect(() => {
    void load();
  }, [load]);
  const visibleItems = active
    ? items.filter((item) => item.isActive === (active === "true"))
    : items;
  const relationFor = (product: AdminProduct) =>
    relations.find(
      (r) =>
        r.id ===
        subcategories.find((s) => s.id === product.subcategoryId)
          ?.categoryBrandId,
    );
  const save = async () => {
    if (!edit || saving) return;
    if (
      !edit.value.subcategoryId ||
      !edit.value.name.trim() ||
      !edit.value.slug.trim()
    )
      return setFeedback({
        error: "Category, brand, subcategory, name and slug are required.",
        success: "",
      });
    setSaving(true);
    try {
      const saved = edit.id
        ? await productAdminApi.update(edit.id, edit.value)
        : await productAdminApi.create(edit.value);
      setEdit(null);
      setFeedback({ error: "", success: "Product saved successfully." });
      await load();
      if (!edit.id) navigate(`/admin/products/${saved.id}/manage`);
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to save product."),
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
      await productAdminApi.delete(deleteId);
      setDeleteId(null);
      setFeedback({ error: "", success: "Product deleted." });
      await load();
    } catch (e) {
      setFeedback({
        error: getAdminApiError(e, "Unable to delete product."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage products and their catalogue content."
        action={
          <button
            className="adminButton primary"
            onClick={() => setEdit({ value: empty })}
          >
            Add Product
          </button>
        }
      />
      <FormFeedback {...feedback} />
      {edit && (
        <ProductForm
          key={edit.id ?? "new"}
          value={edit.value}
          categories={categories}
          brands={brands}
          relations={relations}
          subcategories={subcategories}
          saving={saving}
          onChange={(value) => setEdit({ ...edit, value })}
          onSubmit={() => void save()}
          onCancel={() => setEdit(null)}
        />
      )}
      <div className="adminPanel productFilters">
        <input
          aria-label="Search products"
          placeholder="Search name or model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Category filter"
          value={categorySlug}
          onChange={(e) => {
            setCategorySlug(e.target.value);
            setBrandSlug("");
            setSubcategorySlug("");
          }}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Brand filter"
          value={brandSlug}
          onChange={(e) => {
            setBrandSlug(e.target.value);
            setSubcategorySlug("");
          }}
        >
          <option value="">All brands</option>
          {brands.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Subcategory filter"
          value={subcategorySlug}
          onChange={(e) => setSubcategorySlug(e.target.value)}
        >
          <option value="">All subcategories</option>
          {subcategories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Featured filter"
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
        >
          <option value="">All featured states</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>
        <select
          aria-label="Active filter"
          value={active}
          onChange={(e) => setActive(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ProductsTable
            items={visibleItems}
            brandName={(item) => {
              const relation = relationFor(item);
              return (
                brands.find((brand) => brand.id === relation?.brandId)?.name ??
                "Unavailable"
              );
            }}
            subcategoryName={(item) =>
              subcategories.find(
                (subcategory) => subcategory.id === item.subcategoryId,
              )?.name ?? "Unavailable"
            }
            onEdit={(item) => setEdit({ id: item.id, value: values(item) })}
            onDelete={setDeleteId}
          />
          <div className="adminList legacyCatalogueList">
            {visibleItems.map((item) => {
              const relation = relationFor(item);
              return (
                <article
                  className="adminListCard catalogueListCard"
                  key={item.id}
                >
                  {item.mainImageUrl && (
                    <img src={getImageUrl(item.mainImageUrl)} alt={item.name} />
                  )}
                  <div className="listCardContent">
                    <h2>{item.name}</h2>
                    <p>
                      {item.modelNumber || "No model"} ·{" "}
                      {brands.find((b) => b.id === relation?.brandId)?.name ??
                        "Brand unavailable"}{" "}
                      ·{" "}
                      {subcategories.find((s) => s.id === item.subcategoryId)
                        ?.name ?? "Subcategory unavailable"}
                    </p>
                    <p>
                      {item.isFeatured ? "Featured" : "Standard"} ·{" "}
                      {item.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="listActions">
                    <button
                      className="adminButton secondary"
                      onClick={() =>
                        setEdit({ id: item.id, value: values(item) })
                      }
                    >
                      Edit
                    </button>
                    <Link
                      className="adminButton secondary"
                      to={`/admin/products/${item.id}/manage`}
                    >
                      Manage
                    </Link>
                    <button
                      className="adminButton danger"
                      onClick={() => setDeleteId(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete product?"
        message="The product and its associated data will be permanently removed."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
