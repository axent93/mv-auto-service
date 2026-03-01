import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'Dokumenta i slike',
    singular: 'Dokument ili slika',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['filename', 'mimeType', 'updatedAt'],
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Opis fajla',
    },
    {
      name: 'tip',
      type: 'select',
      label: 'Tip dokumenta',
      options: [
        {
          label: 'Slika vozila',
          value: 'slika-vozila',
        },
        {
          label: 'Slika kvara',
          value: 'slika-kvara',
        },
        {
          label: 'Racun',
          value: 'racun',
        },
        {
          label: 'Ostalo',
          value: 'ostalo',
        },
      ],
    },
  ],
  upload: {
    adminThumbnail: 'thumb',
    imageSizes: [
      {
        name: 'thumb',
        width: 320,
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
    staticDir: 'media',
  },
}
