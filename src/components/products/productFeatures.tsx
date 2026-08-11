import type { Product } from "../../interfaces/product.interface";

export const ProductFeatures = ({
  features,
}: {
  features: Product["features"];
}) =>
  features.length ? (
    <section className="productSection">
      <h2>Features</h2>
      <ul className="featureList">
        {features.map((feature) => (
          <li key={feature.id}>{feature.featureText}</li>
        ))}
      </ul>
    </section>
  ) : null;
