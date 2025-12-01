self.addEventListener('install', e => {
  e.waitUntil(caches.open('corehub-v1').then(cache => cache.addAll(['/','/store','/placeholder.png'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
