import { useContext } from 'react'
import { SiteContentContext, type SiteContentState } from './siteContentContext'

export const useSiteContent = (): SiteContentState => {
  const context = useContext(SiteContentContext)
  if (!context) throw new Error('useSiteContent must be used inside SiteContentProvider')
  return context
}
