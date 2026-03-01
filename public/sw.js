const CACHE_NAME = 'mv-servis-shell-v2'
const OFFLINE_URL = '/offline'
const APP_SHELL = ['/admin/login', OFFLINE_URL, '/manifest.webmanifest', '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestURL = new URL(event.request.url)

  if (requestURL.origin !== self.location.origin) {
    return
  }

  if (
    requestURL.pathname.startsWith('/_next') ||
    requestURL.pathname.startsWith('/api') ||
    requestURL.pathname.startsWith('/admin') ||
    requestURL.pathname.startsWith('/media') ||
    requestURL.pathname === '/sw.js'
  ) {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const clone = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })

          return response
        })
        .catch(() => caches.match(OFFLINE_URL))
    }),
  )
})
