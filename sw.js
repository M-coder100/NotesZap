let cache_name = "offline_cache"; // The string used to identify our cache
const assets = [
    "/",
    "/index.html",
    "/Styles/app.css",
    "/Styles/hljsStyle.css",
    "/Styles/mediaQuery.css",
    "/Styles/navBar.css",
    "/Styles/noteEditor.css",
    "/Styles/notes.css",
    "/Styles/settings.css",
    "/src/Logo.svg",
    "/TS/Scripts/app.js",
    "/TS/Scripts/db.js",
    "/TS/Scripts/noteEditor.js",
    "/TS/Scripts/notes.js",
    "/TS/Scripts/popup.js",
    "/TS/Scripts/tquery.js",
    "/TS/Scripts/utils.js",
    "/404.html",
]
self.addEventListener("install", event => {
    console.log("installing...");
    event.waitUntil(
        caches
            .open(cache_name)
            .then(cache => {
                return cache.addAll(assets);
            })
            .catch(err => console.warn(err))
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
self.addEventListener("fetch", event => {
    console.log("You fetched " + event.url);
});