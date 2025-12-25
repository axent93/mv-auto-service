import { CollectionConfig } from 'payload'

export const ServiceRecords: CollectionConfig = {
  slug: 'service-records',
  labels: {
    singular: {
      sr: 'Servisni Zapis',
      en: 'Service Record',
    },
    plural: {
      sr: 'Servisni Zapisi',
      en: 'Service Records',
    },
  },
  admin: {
    defaultColumns: ['vehicle', 'serviceDate', 'description', 'totalCost'],
    useAsTitle: 'description',
    group: {
      sr: 'Servis',
      en: 'Service',
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate total cost automatically / Automatski izračunaj ukupnu cenu
        const laborCost = Number(data.laborCost) || 0
        const partsCost = Number(data.partsCost) || 0
        data.totalCost = laborCost + partsCost
        return data
      },
    ],
  },
  fields: [
    {
      name: 'vehicle',
      label: {
        sr: 'Vozilo',
        en: 'Vehicle',
      },
      type: 'relationship',
      relationTo: 'vehicles',
      localized: true,
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'serviceDate',
      label: {
        sr: 'Datum Servisa',
        en: 'Service Date',
      },
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0],
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'mileage',
      label: {
        sr: 'Kilometraža',
        en: 'Mileage',
      },
      type: 'number',
      required: false,
      min: 0,
      admin: {
        description: {
          sr: 'Trenutna kilometraža vozila',
          en: 'Current vehicle mileage',
        },
      },
    },
    {
      name: 'description',
      label: {
        sr: 'Opis',
        en: 'Description',
      },
      type: 'textarea',
      localized: true,
      required: true,
      minLength: 10,
      admin: {
        description: {
          sr: 'Detaljan opis izvršenih radova',
          en: 'Detailed description of work performed',
        },
      },
    },
    {
      name: 'laborCost',
      label: {
        sr: 'Cena Rada',
        en: 'Labor Cost',
      },
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: {
          sr: 'Troškovi radne snage',
          en: 'Labor costs',
        },
      },
    },
    {
      name: 'partsCost',
      label: {
        sr: 'Cena Delova',
        en: 'Parts Cost',
      },
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: {
          sr: 'Troškovi rezervnih delova',
          en: 'Cost of spare parts',
        },
      },
    },
    {
      name: 'totalCost',
      label: {
        sr: 'Ukupna Cena',
        en: 'Total Cost',
      },
      type: 'number',
      required: false,
      admin: {
        readOnly: true,
        description: {
          sr: 'Automatski izračunato kao Cena Rada + Cena Delova',
          en: 'Automatically calculated as Labor Cost + Parts Cost',
        },
      },
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
          sr: 'Dodatne napomene o servisu',
          en: 'Additional service notes',
        },
      },
    },
  ],
}