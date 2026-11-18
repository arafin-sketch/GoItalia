// ItaliaNow service worker: makes the app installable and lets it open without a connection.
// App files: fetched fresh when online, served from cache when offline. Live API calls are never cached here.
const CACHE = "italianow-v5";
const SHELL = ["./", "index.html", "app.css", "live.css", "app.js", "config.js", "data/network.json", "icon.svg", "manifest.webmanifest"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // API, map tiles, fonts: straight to network
  // network first, so new versions show up at once; the cached copy is used only when offline
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match("index.html"))));
});
