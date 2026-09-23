import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductGrid } from "../components/products/productGrid";
import type { ProductSummary } from "../interfaces/product.interface";
import type { CategorySummary } from "../interfaces/catalogue.interface";
import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { productApi } from "../services/productApi";
import { categoryApi } from "../services/categoryApi";
import { subcategoryApi } from "../services/subcategoryApi";
import { getImageUrl } from "../utils/getImageUrl";
import { usePageTitle } from "../hooks/usePageTitle";

export const SubcategoryPage = () => {
  const { slug = "" } = useParams();
  const [subcategory, setSubcategory] = useState<SubcategorySummary | null>(
      null,
    ),
    [category, setCategory] = useState<CategorySummary | null>(null),
    [products, setProducts] = useState<ProductSummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  usePageTitle(loading ? "Subcategory" : subcategory?.name || "Subcategory");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      subcategoryApi.getSubcategoryBySlug(slug),
      productApi.getProducts({ subcategory: slug }),
      categoryApi.getActiveCategories(),
    ])
      .then(([current, result, categories]) => {
        setSubcategory(current);
        setProducts(result.products);
        setCategory(
          categories.find((item) => Number(item.id) === current.categoryId) ??
            null,
        );
      })
      .catch((reason) => setError(getApiErrorMessage(reason)))
      .finally(() => setLoading(false));
  }, [slug]);
  if (loading)
    return (
      <div className="container stateSection">
        <LoadingSpinner />
      </div>
    );
  if (!subcategory)
    return (
      <div className="container stateSection">
        <ErrorMessage message={error || "Subcategory not found."} />
      </div>
    );
  return (
    <main className="container publicCataloguePage">
      <Link
        className="button buttonSecondary catalogueBackButton"
        to={category ? `/categories/${category.slug}` : "/products"}
      >
        <ArrowLeft aria-hidden="true" />
        Back to {category?.name || "Products"}
      </Link>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {category && (
            <li>
              <Link to={`/categories/${category.slug}`}>{category.name}</Link>
            </li>
          )}
          <li aria-current="page">{subcategory.name}</li>
        </ol>
      </nav>
      <header className="catalogueHero">
        {getImageUrl(subcategory.imageUrl) && (
          <img src={getImageUrl(subcategory.imageUrl)} alt={subcategory.name} />
        )}
        <div>
          <h1>{subcategory.name}</h1>
          {subcategory.description && <p>{subcategory.description}</p>}
        </div>
      </header>
      <section>
        <h2>Products</h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
};
