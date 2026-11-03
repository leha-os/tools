// sw.js — Gmail Hub V7.3
const CACHE = 'gmail-hub-v7.3';
const STATIC_ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS)).catch(()=>{})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // ⛔ TUYỆT ĐỐI KHÔNG CACHE
  if (url.includes('googleapis.com') ||
      url.includes('accounts.google.com') ||
      url.includes('/gsi/') ||
      url.includes('telegram') ||
      url.includes('discord.com') ||
      url.includes('discordapp.com')) {
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(()=>{});
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type === 'CLEAR_CACHE_AFTER_IMPORT') {
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => {
        console.log('[SW] Cleared all caches after import');
        if (e.ports && e.ports[0]) e.ports[0].postMessage({ok:true});
      })
      .catch(() => { if (e.ports && e.ports[0]) e.ports[0].postMessage({ok:false}); });
    return;
  }
  if (m.type === 'SKIP_WAITING') self.skipWaiting();
  if (m.type === 'notify') {
    self.registration.showNotification(m.title || 'Gmail Hub', {
      body: m.body || '', tag: 'gmail-hub-otp', renotify: true,
      vibrate: [100, 50, 100], data: { url: './' },
    });
  }
  if (m.type === 'badge' && 'setAppBadge' in navigator) {
    if (m.count > 0) navigator.setAppBadge(m.count); else navigator.clearAppBadge();
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(wins => {
    for (const w of wins) return w.focus();
    return clients.openWindow('./');
  }));
});