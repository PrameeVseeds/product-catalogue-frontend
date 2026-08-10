export interface ProductSummary {
  id: string | number
  name: string
  slug: string
  image?: string | null
  shortDescription?: string | null
}

export interface Product extends ProductSummary {
  description?: string | null
  category?: { name: string; slug: string } | null
  brand?: { name: string; slug: string } | null
  subcategory?: { name: string; slug: string } | null
}

export interface ProductListResponse {
  data: ProductSummary[]
  total?: number
}
