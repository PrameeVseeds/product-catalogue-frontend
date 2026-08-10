import type { BrandSummary } from '../interfaces/catalogue.interface'
import { apiClient } from './apiClient'
import { asArray, getId, getNumber, getText } from './responseNormalizers'

export const brandApi = {
  async getActiveBrands(): Promise<BrandSummary[]> {
    const { data } = await apiClient.get<unknown>('/brands')
    return asArray(data).map((item) => ({ id: getId(item), name: getText(item, 'name') ?? '',
       slug: getText(item, 'slug') ?? '', countryName: getText(item, 'countryName', 'country_name'), 
       logoUrl: getText(item, 'logoUrl', 'logo_url'),
       displayOrder: getNumber(item, 0, 'displayOrder', 'display_order') })).filter((item) => item.name && item.slug).sort((a, b) => a.displayOrder - b.displayOrder)
  },
}
