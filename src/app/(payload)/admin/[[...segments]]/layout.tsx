import type { ReactNode } from 'react'

import '../../custom.scss'

type AdminRouteLayoutProps = {
  children: ReactNode
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return children
}
