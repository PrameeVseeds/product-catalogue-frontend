export interface ProductSummary {
  id: string | number
  name: string
  slug: string
  mainImageUrl?: string | null
  modelNumber?: string | null
  shortDescription?: string | null
  brand?: { name: string; slug?: string } | null
  displayOrder: number
}

export interface Product extends ProductSummary {
  description?: string | null
  category?: { name: string; slug: string } | null
  brand?: { name: string; slug: string } | null
  subcategory?: { name: string; slug: string } | null
}

export interface ProductListResponse {
  products: ProductSummary[]
  total?: number
}
