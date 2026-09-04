// ==========================================
// SYNEXUS COMMUNITY
// Day 39: Service Worker
// ==========================================

const CACHE_NAME = "synexus-cache-v1";

const CORE_ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/main.js"
];


// ------------------------------------------
// INSTALL
// ------------------------------------------

self.addEventListener("install", (event) => {

    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Caching files");

                return cache.addAll(CORE_ASSETS);
            })
    );

});


// ------------------------------------------
// FETCH
// ------------------------------------------

self.addEventListener("fetch", (event) => {

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })
    );

});


// ------------------------------------------
// ACTIVATE
// ------------------------------------------

self.addEventListener("activate", (event) => {

    console.log("Service Worker: Activated");

});