import type { ProductSummary } from "../../interfaces/product.interface";
import { ProductCard } from "../home/productCard";

export const ProductGrid = ({ products }: { products: ProductSummary[] }) =>
  products.length ? (
    <div className="catalogueGrid productGrid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <p className="emptyState">No products found.</p>
  );
