/**
 * Service worker: guarda o aplicativo no aparelho para funcionar offline.
 * Ao publicar mudanças, aumente CACHE_VERSION.
 */
const CACHE_VERSION = 'afina-v1.1.1';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/screens.css',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './js/app.js',
  './js/version.js',
  './js/audio/chime.js',
  './js/audio/microphone.js',
  './js/audio/pitch-detector.js',
  './js/audio/pitch-worker.js',
  './js/core/instruments/guitar.js',
  './js/core/instruments/index.js',
  './js/core/instruments/ukulele.js',
  './js/core/instruments/violin.js',
  './js/core/music.js',
  './js/core/tuner-engine.js',
  './js/core/tunings.js',
  './js/session/tuner-session.js',
  './js/state/settings.js',
  './js/state/store.js',
  './js/ui/dom.js',
  './js/ui/icons.js',
  './js/ui/router.js',
  './js/ui/components/controls.js',
  './js/ui/components/gauge.js',
  './js/ui/components/string-selector.js',
  './js/ui/screens/about.js',
  './js/ui/screens/denied.js',
  './js/ui/screens/instruments.js',
  './js/ui/screens/page.js',
  './js/ui/screens/permission.js',
  './js/ui/screens/settings.js',
  './js/ui/screens/tuner.js',
  './js/ui/screens/tunings.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Cache primeiro: abre instantaneamente e funciona sem conexão.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => (request.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    }),
  );
});
