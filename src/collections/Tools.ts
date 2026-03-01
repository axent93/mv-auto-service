import type { CollectionConfig, Field } from 'payload'

import { isAuthenticated } from '@/lib/access'

const imagesField: Field = {
  name: 'images',
  type: 'array',
  label: 'Slike alata',
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

export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: {
    plural: 'Alati i uredjaji',
    singular: 'Alat ili uredjaj',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['name', 'category', 'condition', 'locationInWorkshop', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      index: true,
      label: 'Naziv',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      index: true,
      label: 'Kategorija',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'serialNumber',
      type: 'text',
      index: true,
      label: 'Serijski broj',
    },
    {
      name: 'purchaseDate',
      type: 'date',
      label: 'Datum kupovine',
    },
    {
      name: 'purchasePrice',
      type: 'number',
      label: 'Cena kupovine',
    },
    {
      name: 'locationInWorkshop',
      type: 'text',
      label: 'Lokacija u radionici',
    },
    {
      name: 'condition',
      type: 'select',
      defaultValue: 'ispravno',
      label: 'Stanje',
      options: [
        {
          label: 'Ispravno',
          value: 'ispravno',
        },
        {
          label: 'Na servisu',
          value: 'na-servisu',
        },
        {
          label: 'Neispravno',
          value: 'neispravno',
        },
        {
          label: 'Rashodovano',
          value: 'rashodovano',
        },
      ],
    },
    imagesField,
    {
      name: 'note',
      type: 'textarea',
      label: 'Napomena',
    },
  ],
  indexes: [
    {
      fields: ['condition'],
    },
    {
      fields: ['serialNumber'],
    },
  ],
}
