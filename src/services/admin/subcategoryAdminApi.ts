import type {AdminSubcategory,SubcategoryForm,} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { subcategories, subcategory } from "./catalogueNormalizers";
export const subcategoryAdminApi = {
  async getAll(): Promise<AdminSubcategory[]> {
    const { data } = await apiClient.get<unknown>("/admin/subcategories");
    return subcategories(data);
  },
  async create(input: SubcategoryForm) {
    const { data } = await apiClient.post<unknown>(
      "/admin/subcategories",
      input,
    );
    return subcategory(unwrapData(data));
  },
  async update(id: number, input: SubcategoryForm) {
    const { data } = await apiClient.put<unknown>(
      `/admin/subcategories/${id}`,
      input,
    );
    return subcategory(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/subcategories/${id}`);
  },
};
