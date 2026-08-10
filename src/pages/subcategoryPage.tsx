import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductGrid } from "../components/products/productGrid";
import type { ProductSummary } from "../interfaces/product.interface";
import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { productApi } from "../services/productApi";
import { subcategoryApi } from "../services/subcategoryApi";
import { getImageUrl } from "../utils/getImageUrl";

export const SubcategoryPage = () => {
  const { slug = "" } = useParams();
  const [subcategory, setSubcategory] = useState<SubcategorySummary | null>(
      null,
    ),
    [products, setProducts] = useState<ProductSummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      subcategoryApi.getSubcategoryBySlug(slug),
      productApi.getProducts({ subcategory: slug }),
    ])
      .then(([current, result]) => {
        setSubcategory(current);
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
  if (!subcategory)
    return (
      <div className="container stateSection">
        <ErrorMessage message={error || "Subcategory not found."} />
      </div>
    );
  return (
    <main className="container publicCataloguePage">
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
