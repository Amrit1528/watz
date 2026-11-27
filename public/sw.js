// MadCineAma PWA service worker — cache-first with network fallback.
// Served from /sw.js; registered by index.html at startup.

const CACHE = 'madcineama-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/sized/512x517.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(CACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Skip non-GET, and requests not belonging to this origin
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(req, clone));
        }
        return response;
      });
    })
  );
});
