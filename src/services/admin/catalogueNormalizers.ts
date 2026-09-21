import type {AdminBrand,AdminCategory,AdminCategoryBrand,AdminProduct,AdminProductDetail,
    AdminSubcategory,ProductFeature, ProductImage,ProductSpecification,} from "../../interfaces/catalogueAdmin.interface";
import {asArray,asRecord,getBoolean,getId,getNumber,getText,unwrapData,type JsonRecord,} from "../responseNormalizers";
const text = (s: JsonRecord, camel: string, snake: string) =>
  getText(s, camel, snake);
export const category = (v: unknown): AdminCategory => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    name: getText(s, "name") ?? "",
    slug: getText(s, "slug") ?? "",
    description: getText(s, "description"),
    imageUrl: text(s, "imageUrl", "image_url"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isActive: getBoolean(s, true, "isActive", "is_active"),
  };
};
export const categories = (v: unknown) =>
  asArray(v)
    .map(category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const brand = (v: unknown): AdminBrand => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    name: getText(s, "name") ?? "",
    slug: getText(s, "slug") ?? "",
    countryName: text(s, "countryName", "country_name"),
    countryCode: text(s, "countryCode", "country_code"),
    logoUrl: text(s, "logoUrl", "logo_url"),
    flagImageUrl: text(s, "flagImageUrl", "flag_image_url"),
    websiteUrl: text(s, "websiteUrl", "website_url"),
    description: getText(s, "description"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isActive: getBoolean(s, true, "isActive", "is_active"),
  };
};
export const brands = (v: unknown) =>
  asArray(v)
    .map(brand)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const categoryBrand = (v: unknown): AdminCategoryBrand => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    categoryId: getNumber(s, 0, "categoryId", "category_id"),
    brandId: getNumber(s, 0, "brandId", "brand_id"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isActive: getBoolean(s, true, "isActive", "is_active"),
  };
};
export const categoryBrands = (v: unknown) =>
  asArray(v)
    .map(categoryBrand)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const subcategory = (v: unknown): AdminSubcategory => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    categoryId: getNumber(s, 0, "categoryId", "category_id"),
    categoryBrandId: getNumber(s, 0, "categoryBrandId", "category_brand_id") || null,
    name: getText(s, "name") ?? "",
    slug: getText(s, "slug") ?? "",
    description: getText(s, "description"),
    imageUrl: text(s, "imageUrl", "image_url"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isActive: getBoolean(s, true, "isActive", "is_active"),
  };
};
export const subcategories = (v: unknown) =>
  asArray(v)
    .map(subcategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const product = (v: unknown): AdminProduct => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    subcategoryId: getNumber(s, 0, "subcategoryId", "subcategory_id"),
    name: getText(s, "name") ?? "",
    slug: getText(s, "slug") ?? "",
    modelNumber: text(s, "modelNumber", "model_number"),
    shortDescription: text(s, "shortDescription", "short_description"),
    description: getText(s, "description"),
    mainImageUrl: text(s, "mainImageUrl", "main_image_url"),
    datasheetTitle: text(s, "datasheetTitle", "datasheet_title"),
    datasheetDescription: text(
      s,
      "datasheetDescription",
      "datasheet_description",
    ),
    datasheetFileUrl: text(s, "datasheetFileUrl", "datasheet_file_url"),
    specificationFileUrl: text(s, "specificationFileUrl", "specification_file_url"),
    metaTitle: text(s, "metaTitle", "meta_title"),
    metaDescription: text(s, "metaDescription", "meta_description"),
    isFeatured: getBoolean(s, false, "isFeatured", "is_featured"),
    isActive: getBoolean(s, true, "isActive", "is_active"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
  };
};
export const products = (v: unknown) =>
  asArray(v)
    .map(product)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const productImage = (v: unknown): ProductImage => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    productId: getNumber(s, 0, "productId", "product_id"),
    imageUrl: text(s, "imageUrl", "image_url") ?? "",
    altText: text(s, "altText", "alt_text"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isPrimary: getBoolean(s, false, "isPrimary", "is_primary"),
  };
};
export const productFeature = (v: unknown): ProductFeature => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    productId: getNumber(s, 0, "productId", "product_id"),
    featureText: text(s, "featureText", "feature_text") ?? "",
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
  };
};
export const productSpecification = (v: unknown): ProductSpecification => {
  const s = asRecord(v);
  return {
    id: Number(getId(s)),
    productId: getNumber(s, 0, "productId", "product_id"),
    specificationName: text(s, "specificationName", "specification_name") ?? "",
    specificationValue:
      text(s, "specificationValue", "specification_value") ?? "",
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
  };
};
export const productDetail = (v: unknown): AdminProductDetail => {
  const s = asRecord(unwrapData(v));
  return {
    ...product(s),
    galleryImages: Array.isArray(s.galleryImages)
      ? s.galleryImages.map(productImage)
      : [],
    features: Array.isArray(s.features) ? s.features.map(productFeature) : [],
    specifications: Array.isArray(s.specifications)
      ? s.specifications.map(productSpecification)
      : [],
  };
};
