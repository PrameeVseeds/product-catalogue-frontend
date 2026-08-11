import type {AdminCategoryBrand,CategoryBrandForm,} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { categoryBrand, categoryBrands } from "./catalogueNormalizers";
export const categoryBrandApi = {
  async getAll(): Promise<AdminCategoryBrand[]> {
    const { data } = await apiClient.get<unknown>("/admin/category-brands");
    return categoryBrands(data);
  },
  async create(input: CategoryBrandForm) {
    const { data } = await apiClient.post<unknown>(
      "/admin/category-brands",
      input,
    );
    return categoryBrand(unwrapData(data));
  },
  async update(id: number, input: CategoryBrandForm) {
    const { data } = await apiClient.put<unknown>(
      `/admin/category-brands/${id}`,
      input,
    );
    return categoryBrand(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/category-brands/${id}`);
  },
};
