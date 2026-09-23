import { ErrorMessage } from "../components/common/errorMessage";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductBreadcrumbs } from "../components/products/productBreadcrumbs";
import { ProductEnquiryActions } from "../components/products/productEnquiryActions";
import { ProductFeatures } from "../components/products/productFeatures";
import { ProductGallery } from "../components/products/productGallery";
import { ProductSpecifications } from "../components/products/productSpecifications";
import { useProductDetails } from "../hooks/useProductDetails";
import { useSiteContent } from "../hooks/useSiteContent";
import { Link, useParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { getProductModels } from "../utils/productModels";

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data: product, loading, error } = useProductDetails(slug);
  const { data: site } = useSiteContent();
  const [selectedModel, setSelectedModel] = useState("");
  usePageTitle(loading ? "Products" : product?.name || "Products");
  if (loading)
    return (
      <div className="container stateSection">
        <LoadingSpinner />
      </div>
    );
  if (!product)
    return (
      <div className="container stateSection">
        <ErrorMessage message={error || "Product not found."} />
      </div>
  );
  const models = getProductModels(product.modelNumber);
  const activeModel = models.includes(selectedModel) ? selectedModel : "";
  return (
    <main className="container productDetails">
      <Link
        className="button buttonSecondary catalogueBackButton"
        to={
          product.subcategory
            ? `/subcategories/${product.subcategory.slug}`
            : product.category
              ? `/categories/${product.category.slug}`
              : "/products"
        }
      >
        <ArrowLeft aria-hidden="true" />
        Back to {product.subcategory?.name || product.category?.name || "Products"}
      </Link>
      <ProductBreadcrumbs product={product} />
      <div className="productOverview">
        <ProductGallery product={product} />
        <div className="productInfo">
          <h1 className="productTitle">{product.name}</h1>
          {models.length > 0 && (
            <section className="productModels" aria-labelledby="product-models-heading">
              <h2 id="product-models-heading">Models</h2>
              <p>Select a model</p>
              <div className="productModelList" role="list">
                {models.map((model, index) => (
                  <button
                    className={model === activeModel ? "isSelected" : undefined}
                    key={`${model}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedModel((current) =>
                        current === model ? "" : model,
                      )
                    }
                    aria-pressed={model === activeModel}
                  >
                    {model}
                  </button>
                ))}
              </div>
              {activeModel && (
                <button
                  className="productModelClearButton"
                  type="button"
                  onClick={() => setSelectedModel("")}
                >
                  Clear selected model
                </button>
              )}
            </section>
          )}
          {product.shortDescription && <p>{product.shortDescription}</p>}
          {site && (
            <ProductEnquiryActions
              product={product}
              settings={site.contactSettings}
              selectedModel={activeModel || null}
            />
          )}
        </div>
      </div>
      {product.description && (
        <section className="productSection">
          <h2>Product details</h2>
          <p className="preserveText">{product.description}</p>
        </section>
      )}
      <ProductFeatures features={product.features} />
      <ProductSpecifications specifications={product.specifications} />
    </main>
  );
};
