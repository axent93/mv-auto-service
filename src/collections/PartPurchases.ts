import type { CollectionConfig, Field } from 'payload'

import { isAuthenticated } from '@/lib/access'

const invoiceFilesField: Field = {
  name: 'invoiceFiles',
  type: 'array',
  label: 'Fajlovi racuna',
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

export const PartPurchases: CollectionConfig = {
  slug: 'part-purchases',
  labels: {
    plural: 'Nabavke delova',
    singular: 'Nabavka delova',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['purchaseDate', 'supplier', 'invoiceNumber', 'totalAmount', 'updatedAt'],
    useAsTitle: 'invoiceNumber',
  },
  fields: [
    {
      name: 'purchaseDate',
      type: 'date',
      index: true,
      label: 'Datum nabavke',
    },
    {
      name: 'supplier',
      type: 'text',
      index: true,
      label: 'Dobavljac',
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      index: true,
      label: 'Broj racuna',
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Ukupan iznos',
    },
    invoiceFilesField,
    {
      name: 'items',
      type: 'array',
      label: 'Stavke nabavke',
      labels: {
        plural: 'Stavke',
        singular: 'Stavka',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Naziv dela',
        },
        {
          name: 'code',
          type: 'text',
          label: 'Sifra',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Kolicina',
        },
        {
          name: 'unitPrice',
          type: 'number',
          label: 'Cena po komadu',
        },
        {
          name: 'total',
          type: 'number',
          label: 'Ukupno',
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Napomena',
    },
  ],
}
