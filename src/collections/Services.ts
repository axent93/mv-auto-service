import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'

import { isAuthenticated } from '@/lib/access'

const extractID = (value: unknown): null | number | string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = value.id

    if (typeof id === 'string' || typeof id === 'number') {
      return id
    }
  }

  return null
}

const setDerivedVehicleData: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.vehicle) {
    return data
  }

  const vehicleID = extractID(data.vehicle)

  if (!vehicleID) {
    return data
  }

  try {
    const vehicle = await req.payload.findByID({
      collection: 'vehicles',
      depth: 1,
      id: vehicleID,
      req,
    })

    const clientID = extractID(vehicle.client)

    if (clientID) {
      data.client = clientID
    }

    if (vehicle.client && typeof vehicle.client === 'object') {
      const firstName =
        typeof vehicle.client.firstName === 'string' ? vehicle.client.firstName.trim() : ''
      const lastName =
        typeof vehicle.client.lastName === 'string' ? vehicle.client.lastName.trim() : ''
      const fullName = [firstName, lastName].filter(Boolean).join(' ')

      if (fullName) {
        data.clientSnapshotName = fullName
      }
    }
  } catch (_error) {
    return data
  }

  return data
}

const calculateTotalPrice: CollectionBeforeValidateHook = async ({ data }) => {
  if (!data) {
    return data
  }

  const labor =
    typeof data.laborPrice === 'number' ? data.laborPrice : Number(data.laborPrice ?? Number.NaN)
  const parts =
    typeof data.partsPrice === 'number' ? data.partsPrice : Number(data.partsPrice ?? Number.NaN)

  const hasLabor = Number.isFinite(labor)
  const hasParts = Number.isFinite(parts)

  if (!hasLabor && !hasParts) {
    return data
  }

  const total = (hasLabor ? labor : 0) + (hasParts ? parts : 0)

  data.totalPrice = Number(total.toFixed(2))

  return data
}

const uploadArray = (name: string, label: string): Field => ({
    name,
    type: 'array',
    label,
    fields: [
      {
        name: 'file',
        type: 'upload',
        label: 'Fajl',
        relationTo: 'media',
        required: true,
      },
    ],
  })

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    plural: 'Servisi',
    singular: 'Servis',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: [
      'serviceDate',
      'serviceType',
      'clientSnapshotName',
      'vehicle',
      'mileage',
      'totalPrice',
      'paymentStatus',
    ],
    useAsTitle: 'serviceType',
  },
  hooks: {
    beforeValidate: [setDerivedVehicleData, calculateTotalPrice],
  },
  fields: [
    {
      name: 'vehicle',
      type: 'relationship',
      index: true,
      label: 'Vozilo',
      relationTo: 'vehicles',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: 'Klijent (iz vozila)',
      relationTo: 'clients',
    },
    {
      name: 'clientSnapshotName',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: 'Ime klijenta (snapshot)',
    },
    {
      name: 'serviceType',
      type: 'select',
      index: true,
      label: 'Tip servisa',
      options: [
        {
          label: 'Mali servis',
          value: 'mali-servis',
        },
        {
          label: 'Veliki servis',
          value: 'veliki-servis',
        },
        {
          label: 'Popravka kvara',
          value: 'popravka-kvara',
        },
        {
          label: 'Dijagnostika',
          value: 'dijagnostika',
        },
        {
          label: 'Limarija / ostalo',
          value: 'limarija-ostalo',
        },
      ],
      required: true,
    },
    {
      name: 'serviceDate',
      type: 'date',
      index: true,
      label: 'Datum servisa',
      required: true,
    },
    {
      name: 'mileage',
      type: 'number',
      index: true,
      label: 'Kilometraza',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis radova',
      required: true,
    },
    {
      name: 'partsUsed',
      type: 'array',
      label: 'Ugradjeni delovi',
      labels: {
        plural: 'Delovi',
        singular: 'Deo',
      },
      fields: [
        {
          name: 'partName',
          type: 'text',
          label: 'Naziv dela',
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Brend',
        },
        {
          name: 'partCode',
          type: 'text',
          label: 'Sifra dela',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Kolicina',
        },
        {
          name: 'purchasePrice',
          type: 'number',
          label: 'Nabavna cena',
        },
        {
          name: 'salePrice',
          type: 'number',
          label: 'Prodajna cena',
        },
        {
          name: 'supplier',
          type: 'text',
          label: 'Dobavljac',
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Napomena',
        },
      ],
    },
    {
      name: 'laborPrice',
      type: 'number',
      label: 'Cena rada',
    },
    {
      name: 'partsPrice',
      type: 'number',
      label: 'Cena delova',
    },
    {
      name: 'totalPrice',
      type: 'number',
      admin: {
        readOnly: true,
      },
      label: 'Ukupna cena',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Status naplate',
      options: [
        {
          label: 'Placeno',
          value: 'placeno',
        },
        {
          label: 'Nije placeno',
          value: 'nije-placeno',
        },
        {
          label: 'Delimisno placeno',
          value: 'delimisno-placeno',
        },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Nacin placanja',
      options: [
        {
          label: 'Gotovina',
          value: 'gotovina',
        },
        {
          label: 'Kartica',
          value: 'kartica',
        },
        {
          label: 'Virman',
          value: 'virman',
        },
      ],
    },
    uploadArray('partsInvoiceFiles', 'Racuni delova'),
    uploadArray('issueImages', 'Slike kvara'),
    uploadArray('afterRepairImages', 'Slike nakon popravke'),
    {
      name: 'internalNote',
      type: 'textarea',
      label: 'Interna napomena',
    },
  ],
  indexes: [
    {
      fields: ['serviceDate'],
    },
    {
      fields: ['serviceType'],
    },
    {
      fields: ['mileage'],
    },
  ],
}
