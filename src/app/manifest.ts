import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MV servis',
    short_name: 'MV servis',
    description: 'Privatna PWA aplikacija za internu evidenciju auto mehanicarske radionice',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#f4f4f3',
    theme_color: '#0f172a',
    lang: 'sr-Latn-RS',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
