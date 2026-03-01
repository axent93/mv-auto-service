import type { ReactNode } from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { requireSessionUser } from '@/lib/auth'

type PrivateLayoutProps = {
  children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const user = await requireSessionUser()

  return <AppShell user={user}>{children}</AppShell>
}
