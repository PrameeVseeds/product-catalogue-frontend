import type { CategorySummary } from "../interfaces/catalogue.interface";
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
const normalizeCategory = (item: JsonRecord): CategorySummary => ({
  id: getId(item),
  name: getText(item, "name") ?? "",
  slug: getText(item, "slug") ?? "",
  description: getText(item, "description"),
  imageUrl: getText(item, "imageUrl", "image_url"),
  displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
});
export const categoryApi = {
  async getActiveCategories(): Promise<CategorySummary[]> {
    const { data } = await apiClient.get<unknown>("/categories");
    return asArray(data)
      .map(normalizeCategory)
      .filter((item) => item.name && item.slug)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getCategoryBySlug(slug: string): Promise<CategorySummary> {
    const { data } = await apiClient.get<unknown>(
      `/categories/${encodeURIComponent(slug)}`,
    );
    return normalizeCategory(asRecord(unwrapData(data)));
  },
};
