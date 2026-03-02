import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { rsLatin } from '@payloadcms/translations/languages/rsLatin'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
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

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '')

const readOrigin = (value?: string): string | undefined => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  return stripTrailingSlash(trimmed)
}

const readRailwayOrigin = (value?: string): string | undefined => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const withProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`

  return stripTrailingSlash(withProtocol)
}

const serverURL =
  readOrigin(process.env.NEXT_PUBLIC_SERVER_URL) ||
  readOrigin(process.env.SERVER_URL) ||
  readOrigin(process.env.RAILWAY_STATIC_URL) ||
  readRailwayOrigin(process.env.RAILWAY_PUBLIC_DOMAIN) ||
  'http://localhost:3000'

const csrf = Array.from(
  new Set(
    [
      serverURL,
      readOrigin(process.env.NEXT_PUBLIC_SERVER_URL),
      readOrigin(process.env.SERVER_URL),
      readOrigin(process.env.RAILWAY_STATIC_URL),
      readRailwayOrigin(process.env.RAILWAY_PUBLIC_DOMAIN),
      ...(process.env.PAYLOAD_CSRF_ORIGINS?.split(',').map((origin) => readOrigin(origin)) || []),
    ].filter((origin): origin is string => Boolean(origin)),
  ),
)

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
        servisDetalj: {
          Component: '@/components/payload/views/AdminServiceDetailView#AdminServiceDetailView',
          path: '/servisi/:id',
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
  csrf,
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
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      enabled: process.env.NODE_ENV === 'production',
      disableLocalStorage: false,
      acl: 'private',
      bucket: process.env.AWS_S3_BUCKET_NAME as string,
      config: {
        endpoint: process.env.AWS_ENDPOINT_URL,
        forcePathStyle: true,
        region: process.env.AWS_DEFAULT_REGION, // dummy region for AWS SDK
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
      },
    }),
  ],
})
