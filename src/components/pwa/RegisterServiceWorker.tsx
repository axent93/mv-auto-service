'use client'

import { useEffect } from 'react'

export const RegisterServiceWorker = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const isProduction = process.env.NODE_ENV === 'production'

    if (!isProduction) {
      const cleanupDevelopmentSW = async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map((registration) => registration.unregister()))

          if ('caches' in window) {
            const cacheKeys = await caches.keys()
            await Promise.all(
              cacheKeys
                .filter((cacheKey) => cacheKey.startsWith('mv-servis-shell'))
                .map((cacheKey) => caches.delete(cacheKey)),
            )
          }
        } catch (_error) {
          return
        }
      }

      cleanupDevelopmentSW()
      return
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          updateViaCache: 'none',
        })
        await registration.update()
      } catch (_error) {
        return
      }
    }

    register()
  }, [])

  return null
}
