import { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: {
      sr: 'Mušterija',
      en: 'Client',
    },
    plural: {
      sr: 'Mušterije',
      en: 'Clients',
    },
  },
  admin: {
    defaultColumns: ['fullName', 'phone', 'email'],
    useAsTitle: 'fullName',
    group: {
      sr: 'Upravljanje',
      en: 'Management',
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'fullName',
      label: {
        sr: 'Ime i Prezime',
        en: 'Full Name',
      },
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      label: {
        sr: 'Telefon',
        en: 'Phone',
      },
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'email',
      label: {
        sr: 'Email',
        en: 'Email',
      },
      type: 'email',
      required: false,
      index: true,
    },
    {
      name: 'notes',
      label: {
        sr: 'Napomene',
        en: 'Notes',
      },
      type: 'textarea',
      localized: true,
      required: false,
      admin: {
        description: {
          sr: 'Dodatne informacije o mušteriji',
          en: 'Additional information about the client',
        },
      },
    },
  ],
}