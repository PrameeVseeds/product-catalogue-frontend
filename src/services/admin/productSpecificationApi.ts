import type {ProductSpecification,ProductSpecificationForm,} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { productSpecification } from "./catalogueNormalizers";
export const productSpecificationApi = {
  async create(input: ProductSpecificationForm): Promise<ProductSpecification> {
    const { data } = await apiClient.post<unknown>(
      "/admin/product-specifications",
      input,
    );
    return productSpecification(unwrapData(data));
  },
  async update(
    id: number,
    input: ProductSpecificationForm,
  ): Promise<ProductSpecification> {
    const { data } = await apiClient.put<unknown>(
      `/admin/product-specifications/${id}`,
      input,
    );
    return productSpecification(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/product-specifications/${id}`);
  },
};
