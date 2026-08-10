export interface CategorySummary {
  id: string | number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  displayOrder: number
}

export interface BrandSummary {
  id: string | number
  name: string
  slug: string
  countryName?: string | null
  logoUrl?: string | null
  flagImageUrl?: string | null
  description?: string | null
  websiteUrl?: string | null
  displayOrder: number
}

export interface HomeCatalogueData {
  categories: CategorySummary[]
  featuredProducts: import('./product.interface').ProductSummary[]
  brands: BrandSummary[]
}

export type HomeCatalogueErrors = Partial<Record<keyof HomeCatalogueData, string>>
