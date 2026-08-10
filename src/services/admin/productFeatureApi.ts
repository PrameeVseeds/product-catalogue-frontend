import type {ProductFeature,ProductFeatureForm,} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { productFeature } from "./catalogueNormalizers";
export const productFeatureApi = {
  async create(input: ProductFeatureForm): Promise<ProductFeature> {
    const { data } = await apiClient.post<unknown>(
      "/admin/product-features",
      input,
    );
    return productFeature(unwrapData(data));
  },
  async update(id: number, input: ProductFeatureForm): Promise<ProductFeature> {
    const { data } = await apiClient.put<unknown>(
      `/admin/product-features/${id}`,
      input,
    );
    return productFeature(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/product-features/${id}`);
  },
};
