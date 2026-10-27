// Fetih önbellek görevlisi: oyun internetsiz de açılır; internet varken yeni sürüm otomatik gelir.
const C = 'fetih-80864c5e';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-48.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k != C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method != 'GET' || new URL(r.url).origin != location.origin)
    return;
  // Sayfa: önce internetten dene (güncel sürüm), olmazsa önbellekten aç.
  if (r.mode == 'navigate') {
    e.respondWith(fetch(r).then(res => {
      const cp = res.clone();
      caches.open(C).then(c => c.put('index.html', cp));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
