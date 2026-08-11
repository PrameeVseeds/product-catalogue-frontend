import type { ProductSummary } from '../../interfaces/product.interface'
import { ErrorMessage } from '../common/errorMessage'
import { ProductCard } from './productCard'
import { SectionHeading } from './sectionHeading'
interface Props { products: ProductSummary[]; title?: string | null; subtitle?: string | null; description?: string | null; error?: string }
export const FeaturedProductsSection = ({ products, title, subtitle, description, error }: Props) => <section className="homeSection surfaceSection"><div className="container"><SectionHeading title={title} subtitle={subtitle} description={description} />{error && <ErrorMessage message={error} />}{products.length > 0 && <div className="cardGrid productGrid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</div></section>
