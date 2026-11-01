/* Dalanwas offline support.
   Pages, CSS, JS and data are always fetched fresh when online (saved copy used only when offline).
   Images and fonts are cached after first view. Bump CACHE_VERSION after big changes. */
const CACHE_VERSION = "dv-v4";
const CORE = ["./", "index.html", "offline.html", "icons/logo.svg", "icons/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const save = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); } return res; };

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let the browser handle other sites

  // Images, fonts, PDFs: cache first (file names change when content changes)
  if (/\.(jpg|jpeg|png|webp|svg|woff2|pdf)$/i.test(url.pathname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => save(req, res))));
    return;
  }

  // Everything else (pages, css, js): network first, saved copy when offline
  e.respondWith(
    fetch(req).then((res) => save(req, res))
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("offline.html") : Response.error())))
  );
});
