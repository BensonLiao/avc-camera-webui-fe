const cacheName = `service-worker@${process.env.VERSION}`;
const filesToCache = [
  '/',
  ...process.env.NODE_ENV === 'development' ?
    [
      'http://localhost:8002/web.css',
      'http://localhost:8002/web.js',
      'http://localhost:8002/en-us.js',
      'http://localhost:8002/zh-tw.js'
    ] :
    [
      '/assets/web.css',
      '/assets/web.js',
      '/assets/en-us.js',
      '/assets/zh-tw.js'
    ]
];

self.addEventListener('install', event => event.waitUntil(
  // Cache files into a new cache.
  caches.open(cacheName).then(cache => cache.addAll(filesToCache))
));

self.addEventListener('activate', event => event.waitUntil(
  // Delete any caches that aren't in expectedCaches.
  caches.keys().then(keys => Promise.all(
    keys.map(key => {
      if (![cacheName].includes(key)) {
        return caches.delete(key);
      }

      return null;
    })
  ))
));

self.addEventListener('fetch', event => event.respondWith(
  caches.match(event.request)
    .then(cache => {
      if (cache == null) {
        return fetch(event.request);
      }

      // The resource is in the cache.
      // Try to send the request for updating the cache.
      return fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cache);
    })
));
