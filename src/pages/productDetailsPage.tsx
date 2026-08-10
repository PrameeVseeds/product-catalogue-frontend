import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/common/errorMessage";
import { LoadingSpinner } from "../components/common/loadingSpinner";
import { useProductDetails } from "../hooks/useProductDetails";
import { productApi } from "../services/productApi";
import { getImageUrl } from "../utils/getImageUrl";

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data: product, loading, error } = useProductDetails(slug);
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
  const image = getImageUrl(product.mainImageUrl);
  return (
    <article className="container productDetails">
      <div className="productOverview">
        {image && <img src={image} alt={product.name} />}
        <div>
          {product.brand && (
            <Link className="eyebrow" to={`/brands/${product.brand.slug}`}>
              {product.brand.name}
            </Link>
          )}
          <h1>{product.name}</h1>
          {product.modelNumber && (
            <p className="modelNumber">{product.modelNumber}</p>
          )}
          {product.shortDescription && <p>{product.shortDescription}</p>}
          <a
            className="button"
            href={productApi.getDatasheetUrl(product.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Datasheet
          </a>
        </div>
      </div>
      {product.description && (
        <section>
          <h2>Product details</h2>
          <p>{product.description}</p>
        </section>
      )}
      {product.galleryImages.length > 0 && (
        <section>
          <h2>Gallery</h2>
          <div className="productGallery">
            {product.galleryImages.map((item) => (
              <img
                key={item.id}
                src={getImageUrl(item.imageUrl)}
                alt={item.altText ?? product.name}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
      {product.features.length > 0 && (
        <section>
          <h2>Features</h2>
          <ul>
            {product.features.map((item) => (
              <li key={item.id}>{item.featureText}</li>
            ))}
          </ul>
        </section>
      )}
      {product.specifications.length > 0 && (
        <section>
          <h2>Specifications</h2>
          <dl className="specificationList">
            {product.specifications.map((item) => (
              <div key={item.id}>
                <dt>{item.specificationName}</dt>
                <dd>{item.specificationValue}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
};
