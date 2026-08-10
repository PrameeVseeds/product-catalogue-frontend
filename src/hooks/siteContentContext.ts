import { createContext } from 'react'
import type { SiteContent } from '../interfaces/site.interface'

export interface SiteContentState {
  data: SiteContent | null
  loading: boolean
  error: string | null
}

export const SiteContentContext = createContext<SiteContentState | undefined>(undefined)
