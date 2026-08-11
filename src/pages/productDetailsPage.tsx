import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { ProductBreadcrumbs } from "../components/products/productBreadcrumbs";
import { ProductEnquiryActions } from "../components/products/productEnquiryActions";
import { ProductFeatures } from "../components/products/productFeatures";
import { ProductGallery } from "../components/products/productGallery";
import { ProductSpecifications } from "../components/products/productSpecifications";
import { useProductDetails } from "../hooks/useProductDetails";
import { useSiteContent } from "../hooks/useSiteContent";
import { useParams } from "react-router-dom";

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data: product, loading, error } = useProductDetails(slug);
  const { data: site } = useSiteContent();
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
  return (
    <main className="container productDetails">
      <ProductBreadcrumbs product={product} />
      <div className="productOverview">
        <ProductGallery product={product} />
        <div className="productInfo">
          <h1>{product.name}</h1>
          {product.modelNumber && (
            <p className="modelNumber">Model: {product.modelNumber}</p>
          )}
          {product.shortDescription && <p>{product.shortDescription}</p>}
          {site && (
            <ProductEnquiryActions
              product={product}
              settings={site.contactSettings}
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
