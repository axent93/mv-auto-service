import type { CollectionConfig } from 'payload'

import { isAuthenticated, isAuthenticatedOrFirstUser } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'Korisnici',
    singular: 'Korisnik',
  },
  access: {
    create: isAuthenticatedOrFirstUser,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['ime', 'email', 'uloga', 'updatedAt'],
    useAsTitle: 'ime',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  fields: [
    {
      name: 'ime',
      type: 'text',
      label: 'Ime',
      required: true,
    },
    {
      name: 'uloga',
      type: 'select',
      label: 'Uloga',
      defaultValue: 'vlasnik',
      options: [
        {
          label: 'Vlasnik',
          value: 'vlasnik',
        },
        {
          label: 'Mehanicar',
          value: 'mehanicar',
        },
        {
          label: 'Pomocni radnik',
          value: 'pomocni',
        },
      ],
      required: true,
    },
  ],
}
