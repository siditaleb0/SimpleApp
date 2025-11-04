const CACHE_NAME = 'simpleapp-cache-v1';
const URLS_TO_CACHE = [
  '.',
  'index.html',
  'index.tsx',
  // Les autres ressources seront mises en cache dynamiquement lors du premier chargement.
];

self.addEventListener('install', event => {
  // Active le nouveau service worker dès qu'il est installé.
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  // Ne met en cache que les requêtes GET.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourne la réponse du cache.
        if (response) {
          return response;
        }

        // Clone la requête, car c'est un flux qui ne peut être consommé qu'une seule fois.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Vérifie si la réponse est valide. 
            // En retirant la vérification sur `response.type`, on autorise la mise en cache des ressources cross-origin (CORS).
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone la réponse pour la mettre en cache.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprime les anciens caches.
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // Prend le contrôle de la page immédiatement.
        return self.clients.claim();
    })
  );
});
