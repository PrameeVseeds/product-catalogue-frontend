import { Link } from "react-router-dom";
import type { BrandSummary } from "../../interfaces/catalogue.interface";
import { getImageUrl } from "../../utils/getImageUrl";

export const BrandCard = ({ brand }: { brand: BrandSummary }) => {
  const logo = getImageUrl(brand.logoUrl);
  return (
    <Link
      className="catalogueCard brandCard"
      to={`/brands/${encodeURIComponent(brand.slug)}`}
    >
      {logo && <img src={logo} alt={`${brand.name} logo`} loading="lazy" />}
      <div className="cardBody">
        <h3>{brand.name}</h3>
        {brand.countryName && <p>{brand.countryName}</p>}
      </div>
    </Link>
  );
};
