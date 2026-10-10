// Service worker de l'appli Sole F63 Programmes.
//
// VERSION : date et heure de la mise en ligne. C'est elle qui déclenche la mise à jour
// sur les téléphones et elle s'affiche en bas de la liste des programmes.
// Elle doit changer à chaque envoi sur GitHub (date et heure de Paris),
// sinon les téléphones gardent l'ancienne version.
const VERSION = '2026-10-10 14:56';
const CACHE = 'sole-f63-' + VERSION.replace(/\D/g, '');
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Nouvelle version : on met tout en cache et on prend la main tout de suite
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// On efface les anciennes versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sole-f63-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// La page demande la version pour l'afficher
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'version' && e.ports[0]) e.ports[0].postMessage(VERSION);
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page : toujours la dernière version en ligne, le cache seulement hors connexion
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(url.href, { cache: 'no-cache' })
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Icônes, manifeste, polices : cache d'abord, puis réseau
  if (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
