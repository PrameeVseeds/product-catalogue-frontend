import type {AdminProduct,AdminProductDetail,ProductFilters,ProductFormValues,} from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { product, productDetail, products } from "./catalogueNormalizers";
import { environment } from "../../config/environment";

/** The API treats subcategoryId as an optional numeric field, not a nullable one. */
const productPayload = ({ subcategoryId, ...input }: ProductFormValues) => ({
  ...input,
  ...(subcategoryId ? { subcategoryId } : {}),
});

export const productAdminApi = {
  async getAll(filters?: ProductFilters): Promise<AdminProduct[]> {
    const { data } = await apiClient.get<unknown>("/admin/products", {
      params: filters,
    });
    return products(data);
  },
  async getDetail(slug: string): Promise<AdminProductDetail> {
    const { data } = await apiClient.get<unknown>(
      `/products/${encodeURIComponent(slug)}`,
    );
    return productDetail(data);
  },
  async create(input: ProductFormValues) {
    const { data } = await apiClient.post<unknown>(
      "/admin/products",
      productPayload(input),
    );
    return product(unwrapData(data));
  },
  async update(id: number, input: ProductFormValues) {
    const { data } = await apiClient.put<unknown>(
      `/admin/products/${id}`,
      productPayload(input),
    );
    return product(unwrapData(data));
  },
  async delete(id: number) {
    await apiClient.delete(`/admin/products/${id}`);
  },
  getDatasheetUrl: (slug: string) =>
    `${environment.apiUrl}/products/${encodeURIComponent(slug)}/datasheet`,
};
