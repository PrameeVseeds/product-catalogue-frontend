import type { SubcategorySummary } from "../interfaces/subcategory.interface";
import { apiClient } from "./apiClient";
import {asArray,asRecord,getId,getNumber,getText,unwrapData,type JsonRecord,} from "./responseNormalizers";
const normalize = (item: JsonRecord): SubcategorySummary => ({
  id: Number(getId(item)),
  categoryId: getNumber(item, 0, "categoryId", "category_id"),
  categoryBrandId:
    getNumber(item, 0, "categoryBrandId", "category_brand_id") || null,
  name: getText(item, "name") ?? "",
  slug: getText(item, "slug") ?? "",
  description: getText(item, "description"),
  imageUrl: getText(item, "imageUrl", "image_url"),
  displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
});
export const subcategoryApi = {
  async getActiveSubcategories(): Promise<SubcategorySummary[]> {
    const { data } = await apiClient.get<unknown>("/subcategories");
    return asArray(data)
      .map(normalize)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getSubcategoryBySlug(slug: string): Promise<SubcategorySummary> {
    const { data } = await apiClient.get<unknown>(
      `/subcategories/${encodeURIComponent(slug)}`,
    );
    return normalize(asRecord(unwrapData(data)));
  },
};
