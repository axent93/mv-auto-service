import type { ReactNode } from 'react'
import type { Viewport } from 'next'

import '../../custom.scss'

type AdminRouteLayoutProps = {
  children: ReactNode
}

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  width: 'device-width',
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return children
}
