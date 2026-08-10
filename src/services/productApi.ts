import type { Product, ProductListResponse } from '../interfaces/product.interface'
import { apiClient } from './apiClient'
import { asArray, asRecord, getId, getNumber, getText, unwrapData } from './responseNormalizers'

const normalizeProduct = (value: unknown): Product => {
  const item = asRecord(value)
  return {
    id: getId(item), name: getText(item, 'name') ?? '', slug: getText(item, 'slug') ?? '',
    mainImageUrl: getText(item, 'mainImageUrl', 'main_image_url'), modelNumber: getText(item, 'modelNumber', 'model_number'),
    shortDescription: getText(item, 'shortDescription', 'short_description'), description: getText(item, 'description'),
    displayOrder: getNumber(item, 0, 'displayOrder', 'display_order'),
    category: asRelation(item.category), brand: asRelation(item.brand), subcategory: asRelation(item.subcategory),
  }
}

const asRelation = (value: unknown): { name: string; slug: string } | null => {
  const relation = asRecord(value)
  const name = getText(relation, 'name'); const slug = getText(relation, 'slug')
  return name && slug ? { name, slug } : null
}

export const productApi = {
  async getProducts(params?: { featured?: boolean }): Promise<ProductListResponse> {
    const { data } = await apiClient.get<unknown>('/products', { params })
    const products = asArray(data).map(normalizeProduct).filter((product) => product.name && product.slug).sort((a, b) => a.displayOrder - b.displayOrder)
    return { products, total: products.length }
  },
  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await apiClient.get<unknown>(`/products/${encodeURIComponent(slug)}`)
    return normalizeProduct(unwrapData(data))
  },
}
