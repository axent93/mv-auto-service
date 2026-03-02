import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Sora } from 'next/font/google'

import { RegisterServiceWorker } from '@/components/pwa/RegisterServiceWorker'

import './styles.css'

const headingFont = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700'],
})

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'MV servis',
  description: 'Privatna PWA aplikacija za auto mehanicarsku radionicu',
  applicationName: 'MV servis',
  manifest: '/manifest.webmanifest',
  robots: {
    follow: false,
    index: false,
  },
  appleWebApp: {
    capable: true,
    title: 'MV servis',
  },
  icons: {
    apple: ['/icons/icon-192.png'],
    icon: [
      {
        sizes: '192x192',
        type: 'image/png',
        url: '/icons/icon-192.png',
      },
      {
        sizes: '512x512',
        type: 'image/png',
        url: '/icons/icon-512.png',
      },
    ],
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  themeColor: '#0f172a',
  userScalable: false,
  viewportFit: 'cover',
  width: 'device-width',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="sr-Latn-RS">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <RegisterServiceWorker />
        <main>{children}</main>
      </body>
    </html>
  )
}
