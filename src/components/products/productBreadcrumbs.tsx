import { Link } from "react-router-dom";
import type { Product } from "../../interfaces/product.interface";

export const ProductBreadcrumbs = ({ product }: { product: Product }) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li>
        <Link to="/products">Products</Link>
      </li>
      {product.category && (
        <li>
          <Link to={`/categories/${product.category.slug}`}>
            {product.category.name}
          </Link>
        </li>
      )}
      {product.brand && (
        <li>
          <Link to={`/brands/${product.brand.slug}`}>{product.brand.name}</Link>
        </li>
      )}
      {product.subcategory && (
        <li>
          <Link to={`/subcategories/${product.subcategory.slug}`}>
            {product.subcategory.name}
          </Link>
        </li>
      )}
      <li aria-current="page">{product.name}</li>
    </ol>
  </nav>
);
