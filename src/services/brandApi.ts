import type { BrandSummary } from "../interfaces/catalogue.interface";
import { apiClient } from "./apiClient";
import {
  asArray,
  asRecord,
  getId,
  getNumber,
  getText,
  unwrapData,
  type JsonRecord,
} from "./responseNormalizers";
const normalizeBrand = (item: JsonRecord): BrandSummary => ({
  id: getId(item),
  name: getText(item, "name") ?? "",
  slug: getText(item, "slug") ?? "",
  countryName: getText(item, "countryName", "country_name"),
  logoUrl: getText(item, "logoUrl", "logo_url"),
  flagImageUrl: getText(item, "flagImageUrl", "flag_image_url"),
  websiteUrl: getText(item, "websiteUrl", "website_url"),
  description: getText(item, "description"),
  displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
});
export const brandApi = {
  async getActiveBrands(): Promise<BrandSummary[]> {
    const { data } = await apiClient.get<unknown>("/brands");
    return asArray(data)
      .map(normalizeBrand)
      .filter((item) => item.name && item.slug)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getBrandBySlug(slug: string): Promise<BrandSummary> {
    const { data } = await apiClient.get<unknown>(
      `/brands/${encodeURIComponent(slug)}`,
    );
    return normalizeBrand(asRecord(unwrapData(data)));
  },
  async getBrandsByCategorySlug(slug: string): Promise<BrandSummary[]> {
    const { data } = await apiClient.get<unknown>(
      `/categories/${encodeURIComponent(slug)}/brands`,
    );
    return asArray(data)
      .map(normalizeBrand)
      .filter((item) => item.name && item.slug);
  },
};
