import { Link } from "react-router-dom";
import type { CategorySummary } from "../../interfaces/catalogue.interface";
import { getImageUrl } from "../../utils/getImageUrl";

export const CategoryCard = ({ category }: { category: CategorySummary }) => {
  const image = getImageUrl(category.imageUrl);
  return (
    <Link
      className="catalogueCard categoryCard"
      to={`/categories/${encodeURIComponent(category.slug)}`}
    >
      {image ? (
        <img src={image} alt={category.name} loading="lazy" />
      ) : (
        <div className="categoryImagePlaceholder" aria-hidden="true" />
      )}
      <div className="cardBody">
        <h3>{category.name}</h3>
        {category.description && <p>{category.description}</p>}
      </div>
    </Link>
  );
};
