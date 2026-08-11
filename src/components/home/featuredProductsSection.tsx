import type { ProductSummary } from "../../interfaces/product.interface";
import { ErrorMessage } from "../common/errorMessage";
import { AutoScrollingProductRow } from "./autoScrollingProductRow";
import { SectionHeading } from "./sectionHeading";

interface FeaturedProductsSectionProps {
  products: ProductSummary[];
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  error?: string;
}

export const FeaturedProductsSection = ({
  products,
  title,
  subtitle,
  description,
  error,
}: FeaturedProductsSectionProps) => (
  <section className="homeSection featuredProductsSection">
    <div className="container">
      <SectionHeading
        title={title}
        subtitle={subtitle}
        description={description}
      />
      {error && <ErrorMessage message={error} />}
      {products.length > 0 && (
        <AutoScrollingProductRow products={products} />
      )}
    </div>
  </section>
);
