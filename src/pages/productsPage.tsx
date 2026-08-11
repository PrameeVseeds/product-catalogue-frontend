import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { CategoryCard } from "../components/home/categoryCard";
import { ProductGrid } from "../components/products/productGrid";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { CategorySummary } from "../interfaces/catalogue.interface";
import type { ProductSummary } from "../interfaces/product.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategorySummary[]>([]),
    [products, setProducts] = useState<ProductSummary[]>([]);
  const [search, setSearch] = useState(""),
    [loadingCategories, setLoadingCategories] = useState(true),
    [loadingProducts, setLoadingProducts] = useState(false),
    [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400),
    searchActive = Boolean(search.trim());

  useEffect(() => {
    categoryApi
      .getActiveCategories()
      .then(setCategories)
      .catch((reason) => setError(getApiErrorMessage(reason)))
      .finally(() => setLoadingCategories(false));
  }, []);
  useEffect(() => {
    let active = true;
    if (!debouncedSearch.trim()) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    setError("");
    productApi
      .getProducts({ search: debouncedSearch.trim() })
      .then((result) => {
        if (active) setProducts(result.products);
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return (
    <main className="container publicCataloguePage productsLandingPage">
      <header className="pageIntro">
        <h1>Products</h1>
        <p>Browse our catalogue by category or search for a product.</p>
      </header>
      <div className="publicProductToolbar" role="search">
        <label>
          <span>Search products</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              if (event.target.value.trim()) setLoadingProducts(true);
            }}
            placeholder="Search products or model number"
          />
        </label>
        <label>
          <span>Category</span>
          <select
            defaultValue=""
            onChange={(event) => {
              if (event.target.value)
                navigate(
                  `/categories/${encodeURIComponent(event.target.value)}`,
                );
            }}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {searchActive && (
          <button
            className="button buttonSecondary"
            type="button"
            onClick={() => setSearch("")}
          >
            Clear
          </button>
        )}
      </div>
      {error && <ErrorMessage message={error} />}
      {searchActive ? (
        <section aria-labelledby="search-results-heading">
          <h2 id="search-results-heading">Search Results</h2>
          {loadingProducts ? (
            <LoadingSpinner />
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      ) : (
        <section aria-labelledby="category-heading">
          <h2 id="category-heading">Categories</h2>
          {loadingCategories ? (
            <LoadingSpinner />
          ) : categories.length ? (
            <div className="catalogueGrid categoryGrid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <p>No categories found.</p>
          )}
        </section>
      )}
    </main>
  );
};
