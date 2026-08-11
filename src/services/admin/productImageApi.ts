import type {ProductImage,ProductImageForm,} from "../../interfaces/catalogueAdmin.interface";
import { getImageUrl } from "../../utils/getImageUrl";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { productImage } from "./catalogueNormalizers";
const payload = (input: ProductImageForm): ProductImageForm => ({
  ...input,
  imageUrl: getImageUrl(input.imageUrl),
});
export const productImageApi = {
  async create(input: ProductImageForm): Promise<ProductImage> {
    const { data } = await apiClient.post<unknown>(
      "/admin/product-images",
      payload(input),
    );
    return productImage(unwrapData(data));
  },
  async update(id: number, input: ProductImageForm): Promise<ProductImage> {
    const { data } = await apiClient.put<unknown>(
      `/admin/product-images/${id}`,
      payload(input),
    );
    return productImage(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/product-images/${id}`);
  },
};
