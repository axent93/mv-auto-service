export type UnknownRecord = Record<string, unknown>

export const toRecord = (value: unknown): null | UnknownRecord => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as UnknownRecord
}

export const relationId = (value: unknown): null | string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  const record = toRecord(value)
  const id = record?.id

  if (typeof id === 'string' || typeof id === 'number') {
    return String(id)
  }

  return null
}

export const readString = (record: null | UnknownRecord, key: string): string => {
  if (!record) {
    return ''
  }

  const value = record[key]

  return typeof value === 'string' ? value : ''
}

export const readNumber = (record: null | UnknownRecord, key: string): null | number => {
  if (!record) {
    return null
  }

  const value = record[key]

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  return null
}
