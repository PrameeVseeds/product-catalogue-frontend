import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { BrandCard } from "../components/products/brandCard";
import type {
  BrandSummary,
  CategorySummary,
} from "../interfaces/catalogue.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { brandApi } from "../services/brandApi";
import { categoryApi } from "../services/categoryApi";
import { getImageUrl } from "../utils/getImageUrl";

export const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [category, setCategory] = useState<CategorySummary | null>(null),
    [brands, setBrands] = useState<BrandSummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      categoryApi.getCategoryBySlug(slug),
      brandApi.getBrandsByCategorySlug(slug),
    ])
      .then(([current, related]) => {
        setCategory(current);
        setBrands(related);
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
  return (
    <main className="container publicCataloguePage">
      <header className="catalogueHero">
        {getImageUrl(category.imageUrl) && (
          <img src={getImageUrl(category.imageUrl)} alt={category.name} />
        )}
        <div>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </header>
      <section>
        <h2>Brands</h2>
        {brands.length ? (
          <div className="catalogueGrid">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        ) : (
          <p>No brands found.</p>
        )}
      </section>
    </main>
  );
};
