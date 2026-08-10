import axios, { AxiosError } from 'axios'
import { environment } from '../config/environment'

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (typeof message === 'string' && message.trim()) return message
    if (!error.response) return 'Unable to connect to the server.'
  }
  return 'Something went wrong while loading the content.'
}
