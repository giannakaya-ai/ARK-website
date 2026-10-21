// Mijn ARK — service worker: installatie + offline start
const CACHE = 'mijn-ark-v2';
const ASSETS = [
  './',
  './index.html',
  './support.js',
  './manifest.webmanifest',
  'assets/app-icon-192.png',
  'assets/app-icon-512.png',
  'assets/app-icon-maskable.png',
  'assets/ark-logo-hand.png',
  'assets/ark-logo-hand-white.png',
  'assets/ark-mark.png',
  'assets/team-henk-sm.jpg'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
