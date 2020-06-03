/**
 * Application version and the pages which are to be cached in the Browser
 * We are using CACHES javascript object to store and delete the Cached data of the Application
 */
const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

/**
 * this here in the Service worker represents the Service worker
 */
const self = this;

// Installation of  Service Worker and caching the Site data in the User Browser
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("cache", cache);
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen Requests of the user.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch((err) => {
        return caches.match("offline.html");
      });
    })
  );
});

//Activate Service Worker
self.addEventListener("activate", (event) => {
  // Removing the Old caches in the browser and using the latest cached
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            caches.delete(cacheName);
          }
        })
      );
    })
  );
});
