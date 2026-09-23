import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { SubcategoryCard } from "../components/products/subcategoryCard";
import type { CategorySummary } from "../interfaces/catalogue.interface";
import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { categoryApi } from "../services/categoryApi";
import { subcategoryApi } from "../services/subcategoryApi";
import { getImageUrl } from "../utils/getImageUrl";
import { usePageTitle } from "../hooks/usePageTitle";

export const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [category, setCategory] = useState<CategorySummary | null>(null),
    [subcategories, setSubcategories] = useState<SubcategorySummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  usePageTitle(loading ? "Category" : category?.name || "Category");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      categoryApi.getCategoryBySlug(slug),
      subcategoryApi.getActiveSubcategories(),
    ])
      .then(([current, all]) => {
        setCategory(current);
        setSubcategories(
          all.filter((item) => item.categoryId === Number(current.id)),
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
      <section aria-labelledby="subcategory-heading">
        <h2 id="subcategory-heading">Subcategories</h2>
        {subcategories.length ? (
          <div className="catalogueGrid categoryGrid">
            {subcategories.map((item) => (
              <SubcategoryCard key={item.id} subcategory={item} />
            ))}
          </div>
        ) : (
          <p>No subcategories found.</p>
        )}
      </section>
    </main>
  );
};
