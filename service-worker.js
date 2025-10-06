const cacheName = "pwa-cache-v2";
const assets = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/offline.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("/offline.html"));
    })
  );
});
