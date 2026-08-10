import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { getApiErrorMessage } from '../services/apiClient'
import { siteApi } from '../services/siteApi'
import { SiteContentContext, type SiteContentState } from './siteContentContext'

export const SiteContentProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<SiteContentState>({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true
    siteApi.getSiteContent()
      .then((data) => { if (active) setState({ data, loading: false, error: null }) })
      .catch((error: unknown) => { if (active) setState({ data: null, loading: false, error: getApiErrorMessage(error) }) })
    return () => { active = false }
  }, [])

  const value = useMemo(() => state, [state])
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}
