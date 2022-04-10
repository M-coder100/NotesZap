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
    
    "https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js",    
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js",
    "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
]
self.addEventListener("install", event => {
    console.log("%cInstalling...", "color:  cyan;");
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
    console.log("fetched"+ event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});