import type { Payload } from 'payload'

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'axentiyewic@gmail.com'
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'orikalkos'
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || 'Super Korisnik'
const ALLOWED_ROLES = ['vlasnik', 'mehanicar', 'pomocni'] as const
type AllowedRole = (typeof ALLOWED_ROLES)[number]

const resolveRole = (): AllowedRole => {
  const roleFromEnv = (process.env.DEFAULT_ADMIN_ROLE || 'vlasnik').trim().toLowerCase()

  if (ALLOWED_ROLES.includes(roleFromEnv as AllowedRole)) {
    return roleFromEnv as AllowedRole
  }

  return 'vlasnik'
}

type EnsureDefaultSuperUserResult = {
  created: boolean
  email: string
}

export const ensureDefaultSuperUser = async (
  payload: Payload,
): Promise<EnsureDefaultSuperUserResult> => {
  const email = DEFAULT_ADMIN_EMAIL.trim().toLowerCase()
  const password = DEFAULT_ADMIN_PASSWORD

  if (!email || !password) {
    payload.logger.warn(
      'Default super korisnik nije kreiran jer DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD nisu postavljeni.',
    )

    return {
      created: false,
      email,
    }
  }

  const existing = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existing.totalDocs > 0) {
    return {
      created: false,
      email,
    }
  }

  await payload.create({
    collection: 'users',
    data: {
      email,
      ime: DEFAULT_ADMIN_NAME,
      password,
      uloga: resolveRole(),
    },
    depth: 0,
    overrideAccess: true,
  })

  payload.logger.info(`Kreiran podrazumevani super korisnik: ${email}`)

  return {
    created: true,
    email,
  }
}
