export type JsonRecord = Record<string, unknown>

export const asRecord = (value: unknown): JsonRecord => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {}
export const unwrapData = (value: unknown): unknown => { const source = asRecord(value); return source.data ?? value }
export const asArray = (value: unknown): JsonRecord[] => Array.isArray(unwrapData(value)) ? (unwrapData(value) as unknown[]).map(asRecord) : []
export const getText = (source: JsonRecord, ...keys: string[]): string | null => {
  const value = keys.map((key) => source[key]).find((item) => typeof item === 'string')
  return typeof value === 'string' ? value : null
}
export const getBoolean = (source: JsonRecord, fallback: boolean, ...keys: string[]): boolean => {
  const value = keys.map((key) => source[key]).find((item) => typeof item === 'boolean' || item === 0 || item === 1)
  return value === undefined ? fallback : Boolean(value)
}
export const getNumber = (source: JsonRecord, fallback: number, ...keys: string[]): number => {
  const value = keys.map((key) => source[key]).find((item) => typeof item === 'number' || (typeof item === 'string' && item.trim() !== ''))
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
export const getId = (source: JsonRecord): string | number => typeof source.id === 'string' || typeof source.id === 'number' ? source.id : ''
