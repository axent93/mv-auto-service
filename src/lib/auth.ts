import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

type UserLike = {
  email?: string | null
  id: number | string
  ime?: string | null
  uloga?: string | null
}

const isUserLike = (value: unknown): value is UserLike => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<UserLike>

  return Boolean(candidate.id)
}

export const getSessionUser = async (): Promise<UserLike | null> => {
  const headers = await getHeaders()
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers })

  if (!isUserLike(user)) {
    return null
  }

  return user
}

export const requireSessionUser = async (): Promise<UserLike> => {
  const user = await getSessionUser()

  if (!user) {
    redirect('/login')
  }

  return user
}
