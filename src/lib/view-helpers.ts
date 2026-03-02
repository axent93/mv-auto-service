import { readString, toRecord } from '@/lib/doc'

export const serviceTypeLabels: Record<string, string> = {
  dijagnostika: 'Dijagnostika',
  'limarija-ostalo': 'Limarija / ostalo',
  'mali-servis': 'Mali servis',
  'popravka-kvara': 'Popravka kvara',
  'veliki-servis': 'Veliki servis',
}

export const paymentStatusLabels: Record<string, string> = {
  'delimisno-placeno': 'Delimisno placeno',
  'nije-placeno': 'Nije placeno',
  placeno: 'Placeno',
}

export const toolConditionLabels: Record<string, string> = {
  ispravno: 'Ispravno',
  'na-servisu': 'Na servisu',
  neispravno: 'Neispravno',
  rashodovano: 'Rashodovano',
}

export const getClientName = (value: unknown): string => {
  const client = toRecord(value)
  const firstName = readString(client, 'firstName')
  const lastName = readString(client, 'lastName')

  return [firstName, lastName].filter(Boolean).join(' ').trim() || '-'
}

export const getVehicleName = (value: unknown): string => {
  const vehicle = toRecord(value)
  const brand = readString(vehicle, 'brand')
  const model = readString(vehicle, 'model')
  const registration = readString(vehicle, 'registrationNumber')
  const vin = readString(vehicle, 'vin')
  const baseName = [brand, model].filter(Boolean).join(' ')
  const marker = registration || vin

  return marker ? `${baseName} (${marker})` : baseName || '-'
}

const extractParamToken = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string' || typeof item === 'number') {
        return String(item)
      }
    }
  }

  return ''
}

const stripWrappedBrackets = (value: string): string => {
  const trimmed = value.trim()

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

export const extractDetailIDFromParams = (params: unknown, pathSegment?: string): null | string => {
  const paramsRecord = toRecord(params)

  if (!paramsRecord) {
    return null
  }

  const directID = stripWrappedBrackets(extractParamToken(paramsRecord.id))

  if (directID) {
    return directID
  }

  const rawSegments = paramsRecord.segments
  const segments = Array.isArray(rawSegments)
    ? rawSegments
        .filter((segment): segment is string | number => typeof segment === 'string' || typeof segment === 'number')
        .map((segment) => stripWrappedBrackets(String(segment)))
        .filter(Boolean)
    : []

  if (segments.length === 0) {
    return null
  }

  if (pathSegment) {
    const segmentIndex = segments.indexOf(pathSegment)

    if (segmentIndex >= 0 && segmentIndex + 1 < segments.length) {
      return segments[segmentIndex + 1]
    }
  }

  return segments[segments.length - 1] || null
}

export const normalizeDocumentID = (id: string): number | string => {
  if (/^\d+$/.test(id)) {
    return Number(id)
  }

  return id
}

export type MediaFileLink = {
  filename: string
  isImage: boolean
  url: string
}

export const mediaLinkFromArrayRow = (row: unknown): MediaFileLink | null => {
  const rowRecord = toRecord(row)
  const mediaRecord = toRecord(rowRecord?.file)

  if (!mediaRecord) {
    return null
  }

  const url = readString(mediaRecord, 'url')

  if (!url) {
    return null
  }

  const filename = readString(mediaRecord, 'filename') || 'fajl'
  const mimeType = readString(mediaRecord, 'mimeType')

  return {
    filename,
    isImage: mimeType.startsWith('image/'),
    url,
  }
}
