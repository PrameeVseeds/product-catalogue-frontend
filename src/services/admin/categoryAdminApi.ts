import type {
  AdminCategory,
  CategoryForm,
} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { categories, category } from "./catalogueNormalizers";
export const categoryAdminApi = {
  async getAll(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<unknown>("/admin/categories");
    return categories(data);
  },
  async create(input: CategoryForm) {
    const { data } = await apiClient.post<unknown>("/admin/categories", input);
    return category(unwrapData(data));
  },
  async update(id: number, input: CategoryForm) {
    const { data } = await apiClient.put<unknown>(
      `/admin/categories/${id}`,
      input,
    );
    return category(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
