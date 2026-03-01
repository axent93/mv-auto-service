import type { CollectionConfig, Field } from 'payload'

import { isAuthenticated } from '@/lib/access'

const galleryField: Field = {
  name: 'gallery',
  type: 'array',
  label: 'Galerija vozila',
  labels: {
    plural: 'Slike',
    singular: 'Slika',
  },
  fields: [
    {
      name: 'file',
      type: 'upload',
      label: 'Fajl',
      relationTo: 'media',
      required: true,
    },
  ],
}

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  labels: {
    plural: 'Vozila',
    singular: 'Vozilo',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['client', 'brand', 'model', 'registrationNumber', 'vin', 'currentMileage'],
    useAsTitle: 'model',
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      index: true,
      label: 'Klijent',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'brand',
      type: 'text',
      index: true,
      label: 'Marka',
    },
    {
      name: 'model',
      type: 'text',
      index: true,
      label: 'Model',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      label: 'Godiste',
    },
    {
      name: 'registrationNumber',
      type: 'text',
      index: true,
      label: 'Registracija',
    },
    {
      name: 'vin',
      type: 'text',
      index: true,
      label: 'Broj sasije',
      required: true,
      unique: true,
    },
    {
      name: 'engine',
      type: 'text',
      label: 'Motor',
    },
    {
      name: 'fuelType',
      type: 'text',
      label: 'Tip goriva',
    },
    {
      name: 'engineCapacity',
      type: 'text',
      label: 'Kubikaza',
    },
    {
      name: 'power',
      type: 'text',
      label: 'Snaga',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Boja',
    },
    {
      name: 'currentMileage',
      type: 'number',
      label: 'Trenutna kilometraza',
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Napomena',
    },
    galleryField,
  ],
  indexes: [
    {
      fields: ['vin'],
      unique: true,
    },
    {
      fields: ['registrationNumber'],
    },
    {
      fields: ['model'],
    },
  ],
}
