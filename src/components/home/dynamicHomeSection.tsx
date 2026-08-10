import type { BrandSummary, CategorySummary, HomeCatalogueErrors } from '../../interfaces/catalogue.interface'
import type { ProductSummary } from '../../interfaces/product.interface'
import type { HomeSection } from '../../interfaces/site.interface'
import { BrandSection } from './brandSection'
import { CardSection } from './cardSection'
import { CategorySection } from './categorySection'
import { ContentSection } from './contentSection'
import { CtaSection } from './ctaSection'
import { FeaturedProductsSection } from './featuredProductsSection'

interface Props { section: HomeSection; index: number; categories: CategorySummary[]; products: ProductSummary[]; brands: BrandSummary[]; errors: HomeCatalogueErrors }
export const DynamicHomeSection = ({ section, index, categories, products, brands, errors }: Props) => {
  const heading = { title: section.title, subtitle: section.subtitle, description: section.description }
  switch (section.sectionType) {
    case 'CONTENT': return <ContentSection section={section} index={index} />
    case 'CARDS': return <CardSection section={section} />
    case 'CATEGORIES': return <CategorySection categories={categories} error={errors.categories} {...heading} />
    case 'FEATURED_PRODUCTS': return <FeaturedProductsSection products={products} error={errors.featuredProducts} {...heading} />
    case 'BRANDS': return <BrandSection brands={brands} error={errors.brands} {...heading} />
    case 'CTA': return <CtaSection section={section} />
  }
}
