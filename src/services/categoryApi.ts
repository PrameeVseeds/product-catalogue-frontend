import type { CategorySummary } from '../interfaces/catalogue.interface'
import { apiClient } from './apiClient'
import { asArray, getId, getNumber, getText } from './responseNormalizers'

export const categoryApi = {
  async getActiveCategories(): Promise<CategorySummary[]> {
    const { data } = await apiClient.get<unknown>('/categories')
    return asArray(data).map((item) => ({ id: getId(item), name: getText(item, 'name') ?? '',
       slug: getText(item, 'slug') ?? '', description: getText(item, 'description', 'shortDescription', 'short_description'), 
       imageUrl: getText(item, 'imageUrl', 'image_url'), 
       displayOrder: getNumber(item, 0, 'displayOrder', 'display_order') })).filter((item) => item.name && item.slug).sort((a, b) => a.displayOrder - b.displayOrder)
  },
}
