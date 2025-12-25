import { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  labels: {
    singular: {
      sr: 'Vozilo',
      en: 'Vehicle',
    },
    plural: {
      sr: 'Vozila',
      en: 'Vehicles',
    },
  },
  admin: {
    defaultColumns: ['licensePlate', 'client', 'brand', 'model', 'year'],
    useAsTitle: 'licensePlate',
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
      name: 'client',
      label: {
        sr: 'Mušterija',
        en: 'Client',
      },
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'brand',
      label: {
        sr: 'Marka',
        en: 'Brand',
      },
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'model',
      label: {
        sr: 'Model',
        en: 'Model',
      },
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'year',
      label: {
        sr: 'Godina',
        en: 'Year',
      },
      type: 'number',
      required: false,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    {
      name: 'licensePlate',
      label: {
        sr: 'Registarska Tablica',
        en: 'License Plate',
      },
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'vin',
      label: {
        sr: 'VIN Broj',
        en: 'VIN',
      },
      type: 'text',
      required: false,
      index: true,
      admin: {
        description: {
          sr: 'Jedinstveni identifikacioni broj vozila',
          en: 'Vehicle Identification Number',
        },
      },
    },
    {
      name: 'engineType',
      label: {
        sr: 'Tip Motora',
        en: 'Engine Type',
      },
      type: 'select',
      required: false,
      options: [
        {
          label: {
            sr: 'Benzin',
            en: 'Petrol',
          },
          value: 'petrol',
        },
        {
          label: {
            sr: 'Dizel',
            en: 'Diesel',
          },
          value: 'diesel',
        },
        {
          label: {
            sr: 'Hibrid',
            en: 'Hybrid',
          },
          value: 'hybrid',
        },
        {
          label: {
            sr: 'Električni',
            en: 'Electric',
          },
          value: 'electric',
        },
      ],
      defaultValue: 'petrol',
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
          sr: 'Dodatne informacije o vozilu',
          en: 'Additional information about the vehicle',
        },
      },
    },
  ],
}