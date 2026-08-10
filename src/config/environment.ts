const requireEnvironmentValue = (key: 'VITE_API_URL' | 'VITE_BACKEND_URL'): string => {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value.replace(/\/$/, '')
}

export const environment = {
  apiUrl: requireEnvironmentValue('VITE_API_URL'),
  backendUrl: requireEnvironmentValue('VITE_BACKEND_URL'),
} as const
