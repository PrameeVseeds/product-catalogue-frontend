import type { Product, ProductListResponse } from '../interfaces/product.interface'
import { apiClient } from './apiClient'

export const productApi = {
  async getProducts(): Promise<ProductListResponse> {
    const { data } = await apiClient.get<ProductListResponse>('/products')
    return data
  },
  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${encodeURIComponent(slug)}`)
    return data
  },
}
