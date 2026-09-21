export interface CategoryForm {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}
export interface AdminCategory extends CategoryForm {
  id: number;
}
export interface BrandForm {
  name: string;
  slug: string;
  countryName: string | null;
  countryCode: string | null;
  logoUrl: string | null;
  flagImageUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
}
export interface AdminBrand extends BrandForm {
  id: number;
}
export interface CategoryBrandForm {
  categoryId: number;
  brandId: number;
  displayOrder: number;
  isActive: boolean;
}
export interface AdminCategoryBrand extends CategoryBrandForm {
  id: number;
}
export interface SubcategoryForm {
  categoryId: number;
  categoryBrandId: number | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}
export interface AdminSubcategory extends SubcategoryForm {
  id: number;
}
export interface ProductFormValues {
  subcategoryId: number;
  name: string;
  slug: string;
  modelNumber: string | null;
  shortDescription: string | null;
  description: string | null;
  mainImageUrl: string | null;
  datasheetTitle: string | null;
  datasheetDescription: string | null;
  datasheetFileUrl: string | null;
  specificationFileUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}
export interface AdminProduct extends ProductFormValues {
  id: number;
}
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
  featured?: boolean;
}
export interface ProductImageForm {
  productId: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}
export interface ProductImage extends ProductImageForm {
  id: number;
}
export interface ProductFeatureForm {
  productId: number;
  featureText: string;
  displayOrder: number;
}
export interface ProductFeature extends ProductFeatureForm {
  id: number;
}
export interface ProductSpecificationForm {
  productId: number;
  specificationName: string;
  specificationValue: string;
  displayOrder: number;
}
export interface ProductSpecification extends ProductSpecificationForm {
  id: number;
}

export interface ExtractedProductSpecification {
  name: string;
  value: string;
  unit: string | null;
}

export interface ProductExtractionResult {
  productName: string | null;
  modelNumber: string | null;
  brand: string | null;
  description: string | null;
  features: string[];
  specifications: ExtractedProductSpecification[];
  warnings: string[];
}
export interface AdminProductDetail extends AdminProduct {
  galleryImages: ProductImage[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
}
