import type {AdminBrand,BrandForm} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { brand, brands } from "./catalogueNormalizers";
export const brandAdminApi = {
  async getAll(): Promise<AdminBrand[]> {
    const { data } = await apiClient.get<unknown>("/admin/brands");
    return brands(data);
  },
  async create(input: BrandForm) {
    const { data } = await apiClient.post<unknown>("/admin/brands", input);
    return brand(unwrapData(data));
  },
  async update(id: number, input: BrandForm) {
    const { data } = await apiClient.put<unknown>(`/admin/brands/${id}`, input);
    return brand(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/brands/${id}`);
  },
};
