/* Poker Royal — service worker
   Estrategia: cache-first para os arquivos do app.
   A mesa precisa funcionar sem sinal: chacara, garagem, predio com wi-fi ruim. */
/* v4: marca oficial (ficha + coroa ouro), mesa comecando vazia e layout dos
   controles do jogador. TROCAR ESTA VERSAO A CADA MUDANCA — a estrategia e
   cache-first, entao sem bump quem ja abriu continua vendo o arquivo antigo. */
const CACHE = 'poker-royal-v4';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
