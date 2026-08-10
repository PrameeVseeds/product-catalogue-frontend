import { useEffect, useState } from 'react'
import type { HomeCatalogueData, HomeCatalogueErrors } from '../interfaces/catalogue.interface'
import { brandApi } from '../services/brandApi'
import { categoryApi } from '../services/categoryApi'
import { getApiErrorMessage } from '../services/apiClient'
import { productApi } from '../services/productApi'

interface HomeCatalogueState { data: HomeCatalogueData; errors: HomeCatalogueErrors; loading: boolean }
const initialData: HomeCatalogueData = { categories: [], featuredProducts: [], brands: [] }

export const useHomeCatalogue = (): HomeCatalogueState => {
  const [state, setState] = useState<HomeCatalogueState>({ data: initialData, errors: {}, loading: true })
  useEffect(() => {
    let active = true
    Promise.allSettled([categoryApi.getActiveCategories(), productApi.getProducts({ featured: true }), 
      brandApi.getActiveBrands()]).then(([categories, products, brands]) => {
      if (!active) return
      setState({
        data: {
          categories: categories.status === 'fulfilled' ? categories.value : [],
          featuredProducts: products.status === 'fulfilled' ? products.value.products : [],
          brands: brands.status === 'fulfilled' ? brands.value : [],
        },
        errors: {
          ...(categories.status === 'rejected' && { categories: getApiErrorMessage(categories.reason) }),
          ...(products.status === 'rejected' && { featuredProducts: getApiErrorMessage(products.reason) }),
          ...(brands.status === 'rejected' && { brands: getApiErrorMessage(brands.reason) }),
        }, loading: false,
      })
    })
    return () => { active = false }
  }, [])
  return state
}
