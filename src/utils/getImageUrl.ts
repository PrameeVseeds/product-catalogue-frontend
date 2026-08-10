import { environment } from '../config/environment'

export const getImageUrl = (path?: string | null): string => {
  const value = path?.trim()
  if (!value) return ''

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : ''
  } catch {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`
    return `${environment.backendUrl}${normalizedPath}`
  }
}
