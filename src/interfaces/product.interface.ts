export interface ProductSummary {
  id: string | number;
  name: string;
  slug: string;
  mainImageUrl?: string | null;
  modelNumber?: string | null;
  shortDescription?: string | null;
  subcategoryId?: number | null;
  brand?: { name: string; slug?: string } | null;
  displayOrder: number;
}

export interface Product extends ProductSummary {
  description?: string | null;
  category?: { name: string; slug: string } | null;
  brand?: { name: string; slug: string } | null;
  subcategory?: { name: string; slug: string } | null;
  datasheetTitle?: string | null;
  datasheetDescription?: string | null;
  datasheetFileUrl?: string | null;
  galleryImages: {
    id: string | number;
    imageUrl: string;
    altText?: string | null;
    isPrimary: boolean;
    displayOrder: number;
  }[];
  features: {
    id: string | number;
    featureText: string;
    displayOrder: number;
  }[];
  specifications: {
    id: string | number;
    specificationName: string;
    specificationValue: string;
    displayOrder: number;
  }[];
}

export interface ProductListResponse {
  products: ProductSummary[];
  total?: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
  featured?: boolean;
}
