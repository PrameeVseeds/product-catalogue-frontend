import { Link } from "react-router-dom";
import type { SubcategorySummary } from "../../interfaces/subcategory.interface";
import { getImageUrl } from "../../utils/getImageUrl";

export const SubcategoryCard = ({
  subcategory,
}: {
  subcategory: SubcategorySummary;
}) => {
  const image = getImageUrl(subcategory.imageUrl);
  return (
    <Link
      className="catalogueCard"
      to={`/subcategories/${encodeURIComponent(subcategory.slug)}`}
    >
      {image && <img src={image} alt={subcategory.name} loading="lazy" />}
      <div className="cardBody">
        <h3>{subcategory.name}</h3>
        {subcategory.description && <p>{subcategory.description}</p>}
      </div>
    </Link>
  );
};
