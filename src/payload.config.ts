import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { rsLatin } from '@payloadcms/translations/languages/rsLatin'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Clients } from './collections/Clients'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PartPurchases } from './collections/PartPurchases'
import { Services } from './collections/Services'
import { Tools } from './collections/Tools'
import { Vehicles } from './collections/Vehicles'
import { ensureDefaultSuperUser } from './lib/ensureDefaultSuperUser'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    components: {
      Nav: false,
      actions: ['@/components/payload/HeaderQuickLinks#HeaderQuickLinks'],
      graphics: {
        Icon: '@/components/payload/graphics/Icon#MVAdminIcon',
        Logo: '@/components/payload/graphics/Logo#MVAdminLogo',
      },
      views: {
        dashboard: {
          Component: '@/components/payload/views/AdminDashboardView#AdminDashboardView',
        },
        pretraga: {
          Component: '@/components/payload/views/AdminSearchView#AdminSearchView',
          path: '/pretraga',
        },
        voziloDetalj: {
          Component: '@/components/payload/views/AdminVehicleDetailView#AdminVehicleDetailView',
          path: '/vozila/:id',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      description: 'Privatna aplikacija za vodjenje servisa vozila',
      title: 'MV servis',
      titleSuffix: ' - MV servis',
    },
  },
  collections: [Users, Clients, Vehicles, Services, PartPurchases, Tools, Media],
  cookiePrefix: 'mv-servis',
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'rs-latin',
    supportedLanguages: {
      'rs-latin': rsLatin,
    },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  onInit: async (payload) => {
    await ensureDefaultSuperUser(payload)
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
  }),
  sharp,
  plugins: [],
})
