import { useEffect, useState } from "react";
import { CategoryCard } from "../components/home/categoryCard";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductGrid } from "../components/products/productGrid";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type {
  BrandSummary,
  CategorySummary,
} from "../interfaces/catalogue.interface";
import type { ProductSummary } from "../interfaces/product.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { brandApi } from "../services/brandApi";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";

export const ProductsPage = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]),
    [brands, setBrands] = useState<BrandSummary[]>([]),
    [products, setProducts] = useState<ProductSummary[]>([]);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  useEffect(() => {
    Promise.all([categoryApi.getActiveCategories(), brandApi.getActiveBrands()])
      .then(([categoryData, brandData]) => {
        setCategories(categoryData);
        setBrands(brandData);
      })
      .catch((reason) => setError(getApiErrorMessage(reason)));
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    productApi
      .getProducts({
        search: debouncedSearch || undefined,
        category: category || undefined,
        brand: brand || undefined,
      })
      .then((result) => {
        if (active) setProducts(result.products);
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, category, brand]);
  useEffect(() => {
    if (!category) return;
    brandApi
      .getBrandsByCategorySlug(category)
      .then((data) => {
        setBrands(data);
        if (brand && !data.some((item) => item.slug === brand)) setBrand("");
      })
      .catch(() => setBrands([]));
  }, [category, brand]);
  return (
    <main className="container publicCataloguePage">
      <header className="pageIntro">
        <h1>Products</h1>
      </header>
      <section aria-labelledby="category-heading">
        <h2 id="category-heading">Categories</h2>
        <div className="catalogueGrid">
          {categories.map((item) => (
            <CategoryCard key={item.id} category={item} />
          ))}
        </div>
      </section>
      <section aria-labelledby="browse-heading">
        <h2 id="browse-heading">Browse products</h2>
        <div className="productFilters">
          <label>
            Search
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name or model number"
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setBrand("");
              }}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            >
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && <ErrorMessage message={error} />}
        {loading ? <LoadingSpinner /> : <ProductGrid products={products} />}
      </section>
    </main>
  );
};
