import { Link } from 'react-router-dom'
import type { BrandSummary } from '../../interfaces/catalogue.interface'
import { getImageUrl } from '../../utils/getImageUrl'
import { ErrorMessage } from '../common/errorMessage'
import { SectionHeading } from './sectionHeading'
interface Props { brands: BrandSummary[]; title?: string | null; subtitle?: string | null; description?: string | null; error?: string }
export const BrandSection = ({ brands, title, subtitle, description, error }: Props) => <section className="homeSection"><div className="container"><SectionHeading title={title} subtitle={subtitle} description={description} />{error && <ErrorMessage message={error} />}{brands.length > 0 && <div className="brandGrid">{brands.map((brand) => { const logo = getImageUrl(brand.logoUrl); return <Link className="brandCard" key={brand.id} to={`/brands/${encodeURIComponent(brand.slug)}`}>{logo && <img src={logo} alt={`${brand.name} logo`} loading="lazy" />}<strong>{brand.name}</strong>{brand.countryName && <span>{brand.countryName}</span>}</Link> })}</div>}</div></section>
