import type {
  Product,
  ProductListResponse,
} from "../interfaces/product.interface";
import { apiClient } from "./apiClient";
import {
  asArray,
  asRecord,
  getId,
  getNumber,
  getText,
  unwrapData,
} from "./responseNormalizers";
import { environment } from "../config/environment";

const normalizeProduct = (value: unknown): Product => {
  const item = asRecord(value);
  return {
    id: getId(item),
    name: getText(item, "name") ?? "",
    slug: getText(item, "slug") ?? "",
    mainImageUrl: getText(item, "mainImageUrl", "main_image_url"),
    modelNumber: getText(item, "modelNumber", "model_number"),
    shortDescription: getText(item, "shortDescription", "short_description"),
    description: getText(item, "description"),
    displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
    category: asRelation(item.category),
    brand: asRelation(item.brand),
    subcategory: asRelation(item.subcategory),
    datasheetTitle: getText(item, "datasheetTitle", "datasheet_title"),
    datasheetDescription: getText(
      item,
      "datasheetDescription",
      "datasheet_description",
    ),
    galleryImages: Array.isArray(item.galleryImages)
      ? item.galleryImages
          .map(asRecord)
          .map((image) => ({
            id: getId(image),
            imageUrl: getText(image, "imageUrl", "image_url") ?? "",
            altText: getText(image, "altText", "alt_text"),
            isPrimary: Boolean(image.isPrimary ?? image.is_primary),
            displayOrder: getNumber(image, 0, "displayOrder", "display_order"),
          }))
          .filter((image) => image.imageUrl)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [],
    features: Array.isArray(item.features)
      ? item.features
          .map(asRecord)
          .map((feature) => ({
            id: getId(feature),
            featureText: getText(feature, "featureText", "feature_text") ?? "",
            displayOrder: getNumber(
              feature,
              0,
              "displayOrder",
              "display_order",
            ),
          }))
          .filter((feature) => feature.featureText)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [],
    specifications: Array.isArray(item.specifications)
      ? item.specifications
          .map(asRecord)
          .map((specification) => ({
            id: getId(specification),
            specificationName:
              getText(
                specification,
                "specificationName",
                "specification_name",
              ) ?? "",
            specificationValue:
              getText(
                specification,
                "specificationValue",
                "specification_value",
              ) ?? "",
            displayOrder: getNumber(
              specification,
              0,
              "displayOrder",
              "display_order",
            ),
          }))
          .filter((specification) => specification.specificationName)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [],
  };
};

const asRelation = (value: unknown): { name: string; slug: string } | null => {
  const relation = asRecord(value);
  const name = getText(relation, "name");
  const slug = getText(relation, "slug");
  return name && slug ? { name, slug } : null;
};

export const productApi = {
  async getProducts(params?: {
    featured?: boolean;
  }): Promise<ProductListResponse> {
    const { data } = await apiClient.get<unknown>("/products", { params });
    const products = asArray(data)
      .map(normalizeProduct)
      .filter((product) => product.name && product.slug)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return { products, total: products.length };
  },
  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await apiClient.get<unknown>(
      `/products/${encodeURIComponent(slug)}`,
    );
    return normalizeProduct(unwrapData(data));
  },
  getDatasheetUrl: (slug: string) =>
    `${environment.apiUrl}/products/${encodeURIComponent(slug)}/datasheet`,
};
