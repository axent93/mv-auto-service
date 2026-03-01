import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    plural: 'Klijenti',
    singular: 'Klijent',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'phone', 'email', 'updatedAt'],
    useAsTitle: 'firstName',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      index: true,
      label: 'Ime',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      index: true,
      label: 'Prezime',
    },
    {
      name: 'phone',
      type: 'text',
      index: true,
      label: 'Telefon',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      index: true,
      label: 'Email',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adresa',
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Napomena',
    },
  ],
  indexes: [
    {
      fields: ['firstName', 'lastName'],
    },
    {
      fields: ['phone'],
    },
  ],
}
