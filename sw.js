/* Dalanwas offline support.
   When you change any file, increase CACHE_VERSION so visitors get the new version. */
const CACHE_VERSION = "dv-v3";
const CORE = [
  "./", "index.html", "about.html", "events.html", "library.html", "gallery.html", "contact.html", "offline.html",
  "css/site.css", "js/data.js", "js/app.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg", "icons/logo.svg", "images/hero.jpg",
  "fonts/mukta-latin-400-normal.woff2", "fonts/mukta-latin-600-normal.woff2", "fonts/mukta-devanagari-400-normal.woff2", "fonts/tiro-devanagari-hindi-latin-400-normal.woff2", "fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages: network first, fall back to cache, then offline page
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("offline.html")))
    );
    return;
  }

  // Same-site files (css, js, images, pdfs): cache first, refresh in background
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); } return res; }).catch(() => cached);
        return cached || net;
      })
    );
    return;
  }

  // Fonts and YouTube thumbnails: cache as they are used
  if (/fonts\.(googleapis|gstatic)\.com|i\.ytimg\.com/.test(url.host)) {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); return res; }))
    );
  }
});
