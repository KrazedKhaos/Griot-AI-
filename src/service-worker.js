const CACHE_NAME = 'meridian-cache-v1';

// We don't precache specific assets because in a real build, filenames would have hashes.
// The fetch handler will cache assets dynamically as they are requested.
const urlsToCache = [
  '/',
  '/index.html',
];

// Install service worker and cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache initial assets:', err);
        });
      })
  );
});

// Use a stale-while-revalidate strategy for caching
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // If we get a valid response, update the cache.
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    console.error('Fetch failed; returning offline page instead.', err);
                    // If fetch fails (offline), and it was a navigation request, try to serve the base index.html
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });

                // Return the cached response if it exists, and network fetch will update it in the background.
                // If not in cache, wait for the network response.
                return response || fetchPromise;
            });
        })
    );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});