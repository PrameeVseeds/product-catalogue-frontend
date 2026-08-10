import type { CategorySummary } from '../../interfaces/catalogue.interface'
import { ErrorMessage } from '../common/errorMessage'
import { CategoryCard } from './categoryCard'
import { SectionHeading } from './sectionHeading'
interface Props { categories: CategorySummary[]; title?: string | null; subtitle?: string | null; description?: string | null; error?: string }
export const CategorySection = ({ categories, title, subtitle, description, error }: Props) => <section className="homeSection"><div className="container"><SectionHeading title={title} subtitle={subtitle} description={description} />{error && <ErrorMessage message={error} />}{categories.length > 0 && <div className="cardGrid">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</div>}</div></section>
