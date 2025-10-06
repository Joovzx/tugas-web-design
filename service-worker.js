const cacheName = "pwa-cache-v3"; 
const assets = [
  "./",
  "./index.html",
  "./about.html",
  "./contact.html",
  "./offline.html"
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

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match("./offline.html");
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
