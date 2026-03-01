import type { Access } from 'payload'

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isAuthenticatedOrFirstUser: Access = async ({ req }) => {
  if (req.user) {
    return true
  }

  const existingUsers = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    where: {},
  })

  return existingUsers.totalDocs === 0
}
