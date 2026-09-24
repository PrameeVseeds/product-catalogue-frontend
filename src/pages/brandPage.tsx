import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductGrid } from "../components/products/productGrid";
import { SubcategoryCard } from "../components/products/subcategoryCard";
import type { BrandSummary } from "../interfaces/catalogue.interface";
import type { ProductSummary } from "../interfaces/product.interface";
import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { brandApi } from "../services/brandApi";
import { productApi } from "../services/productApi";
import { subcategoryApi } from "../services/subcategoryApi";
import { getImageUrl } from "../utils/getImageUrl";
import { usePageTitle } from "../hooks/usePageTitle";

export const BrandPage = () => {
  const { slug = "" } = useParams();
  const [brand, setBrand] = useState<BrandSummary | null>(null),
    [subcategories, setSubcategories] = useState<SubcategorySummary[]>([]),
    [products, setProducts] = useState<ProductSummary[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  usePageTitle(loading ? "Brand" : brand?.name || "Brand");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      brandApi.getBrandBySlug(slug),
      productApi.getProducts({ brand: slug }),
      subcategoryApi.getActiveSubcategories(),
    ])
      .then(([current, products, all]) => {
        const ids = new Set(
          products.products
            .map((product) => product.subcategoryId)
            .filter(Boolean),
        );
        setBrand(current);
        setProducts(products.products);
        setSubcategories(all.filter((item) => ids.has(Number(item.id))));
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
  if (!brand)
    return (
      <div className="container stateSection">
        <ErrorMessage message={error || "Brand not found."} />
      </div>
    );
  return (
    <main className="container publicCataloguePage">
      <Link className="button buttonSecondary catalogueBackButton" to="/products">
        <ArrowLeft aria-hidden="true" />
        Back to Products
      </Link>
      <header className="catalogueHero">
        {getImageUrl(brand.logoUrl) && (
          <img src={getImageUrl(brand.logoUrl)} alt={`${brand.name} logo`} />
        )}
        <div>
          <h1>{brand.name}</h1>
          {brand.countryName && <p className="eyebrow">{brand.countryName}</p>}
          {brand.description && <p>{brand.description}</p>}
        </div>
      </header>
      <section aria-labelledby="catalogue-content-heading">
        <h2 id="catalogue-content-heading">
          {subcategories.length ? "Subcategories" : "Products"}
        </h2>
        {subcategories.length ? (
          <div className="catalogueGrid">
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
