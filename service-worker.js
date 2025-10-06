const cacheName = "pwa-cache-v3"; // incremented version to force update
const assets = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/offline.html"
];

self.addEventListener("install", event => {
  console.log("[Service Worker] Install event");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[Service Worker] Caching assets");
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[Service Worker] Activate event");
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  console.log("[Service Worker] Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("[Service Worker] Found in cache:", event.request.url);
        return response;
      }
      return fetch(event.request).catch(() => {
        console.log("[Service Worker] Fetch failed, serving offline page");
        return caches.match("/offline.html");
      });
    })
  );
});
