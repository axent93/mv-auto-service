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
