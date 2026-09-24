import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductGrid } from "../components/products/productGrid";
import { SubcategoryCard } from "../components/products/subcategoryCard";
import type { CategorySummary } from "../interfaces/catalogue.interface";
import type { ProductSummary } from "../interfaces/product.interface";
import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";
import { subcategoryApi } from "../services/subcategoryApi";
import { getImageUrl } from "../utils/getImageUrl";
import { usePageTitle } from "../hooks/usePageTitle";

export const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [category, setCategory] = useState<CategorySummary | null>(null),
    [subcategories, setSubcategories] = useState<SubcategorySummary[]>([]),
    [products, setProducts] = useState<ProductSummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  usePageTitle(loading ? "Category" : category?.name || "Category");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      categoryApi.getCategoryBySlug(slug),
      subcategoryApi.getActiveSubcategories(),
      productApi.getProducts({ category: slug }),
    ])
      .then(([current, all, result]) => {
        setCategory(current);
        setSubcategories(
          all.filter((item) => item.categoryId === Number(current.id)),
        );
        setProducts(result.products);
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
  if (!category)
    return (
      <div className="container stateSection">
        <ErrorMessage message={error || "Category not found."} />
      </div>
    );
  const image = getImageUrl(category.imageUrl);
  return (
    <main className="container publicCataloguePage">
      <Link className="button buttonSecondary catalogueBackButton" to="/products">
        <ArrowLeft aria-hidden="true" />
        Back to Products
      </Link>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li aria-current="page">{category.name}</li>
        </ol>
      </nav>
      <header className="catalogueHero">
        {image && <img src={image} alt={category.name} />}
        <div>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </header>
      <section aria-labelledby="catalogue-content-heading">
        <h2 id="catalogue-content-heading">
          {subcategories.length ? "Subcategories" : "Products"}
        </h2>
        {subcategories.length ? (
          <div className="catalogueGrid categoryGrid">
            {subcategories.map((item) => (
              <SubcategoryCard key={item.id} subcategory={item} />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </main>
  );
};
