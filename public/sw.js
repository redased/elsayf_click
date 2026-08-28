// Service Worker pour PWA - Mise en cache offline
// Version du cache - CHANGEZ ce numéro à chaque déploiement
const CACHE_VERSION = 'v14';
const CACHE_NAME = `elsayf-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `elsayf-dynamic-${CACHE_VERSION}`;

// Uniquement les ressources publiques qui retournent 200 sans auth
const STATIC_URLS = [
  '/',
  '/login',
  '/courses',
  '/logo.png',
  '/manifest.json'
];

// Patterns de routes à mettre en cache dynamiquement
const CACHEABLE_PATTERNS = [
  /^\/dashboard\/courses\//,
  /^\/courses\//,
  /^\/dashboard$/,
  /^\/dashboard\/live$/,
];

// Ne jamais cacher ces patterns
const NO_CACHE_PATTERNS = [
  /\/api\//,
  /\/_next\/webpack-hmr/,
  /meet\.jit\.si/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Utiliser des fetch individuels pour éviter qu'une URL échouée
      // ne bloque toute l'installation du Service Worker
      return Promise.all(
        STATIC_URLS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res && res.status === 200) {
                return cache.put(url, res);
              }
            })
            .catch(() => {
              // Ignorer silencieusement les URLs inaccessibles
              console.warn('[SW] Impossible de cacher:', url);
            })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME && n !== DYNAMIC_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ne traiter que les requêtes du même origin
  if (url.origin !== self.location.origin) return;

  // Exclure les patterns non-cachables
  if (NO_CACHE_PATTERNS.some((p) => p.test(url.pathname))) return;

  const isCacheable = CACHEABLE_PATTERNS.some((p) => p.test(url.pathname));

  if (isCacheable) {
    // Stale-while-revalidate pour les pages de cours
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const networkPromise = fetch(event.request)
          .then((res) => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => null);

        return cached || networkPromise || caches.match('/');
      })
    );
  } else {
    // Network first avec fallback cache
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.destination === 'document') return caches.match('/');
          })
        )
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
  // Cache une URL spécifique à la demande (ex: leçon en cours)
  if (event.data?.type === 'CACHE_URL') {
    caches.open(DYNAMIC_CACHE).then((cache) => {
      fetch(event.data.url).then((res) => {
        if (res && res.status === 200) cache.put(event.data.url, res);
      }).catch(() => {});
    });
  }
});
