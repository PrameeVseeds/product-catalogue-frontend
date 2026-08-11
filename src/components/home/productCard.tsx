import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ProductSummary } from "../../interfaces/product.interface";
import { getImageUrl } from "../../utils/getImageUrl";

export const ProductCard = ({
  product,
  compact = false,
}: {
  product: ProductSummary;
  compact?: boolean;
}) => {
  const image = getImageUrl(product.mainImageUrl);
  return (
    <article className={`catalogueCard productCard${compact ? " featuredProductCard" : ""}`}>
      {image && (
        <Link to={`/products/${encodeURIComponent(product.slug)}`}>
          <img src={image} alt={product.name} loading="lazy" />
        </Link>
      )}
      <div className="cardBody">
        <h3>
          <Link to={`/products/${encodeURIComponent(product.slug)}`}>
            {product.name}
          </Link>
        </h3>
        {!compact && product.modelNumber && (
          <p className="modelNumber">{product.modelNumber}</p>
        )}
        {!compact && product.shortDescription && <p>{product.shortDescription}</p>}
        <Link
          className={compact ? "featuredProductArrow" : "textLink"}
          to={`/products/${encodeURIComponent(product.slug)}`}
          aria-label={compact ? `View details for ${product.name}` : undefined}
          title={compact ? "View details" : undefined}
        >
          {compact ? <ArrowRight aria-hidden="true" /> : "View Details"}
        </Link>
      </div>
    </article>
  );
};
