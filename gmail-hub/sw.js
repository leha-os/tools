// sw.js — Gmail Hub V8.1
// - Trang chính (index.html): luôn thử mạng trước, lỗi mạng mới dùng bản cache.
// - Thư viện CDN / file tĩnh: dùng cache cho nhanh, đồng thời tự cập nhật ngầm.
// - Không bao giờ trả index.html thay cho file JS/CSS (từng gây lỗi "Không tải được ứng dụng").
const CACHE = 'gmail-hub-v9.0';
const NO_CACHE = ['googleapis.com', 'accounts.google.com', '/gsi/', 'telegram', 'discord.com', 'discordapp.com'];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (NO_CACHE.some(x => req.url.includes(x))) return;

  const put = res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  };

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then(r => r || caches.match('./'))));
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(put).catch(() => cached);
      return cached || net;
    })
  );
});

self.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type === 'CLEAR_CACHE_AFTER_IMPORT') {
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => { if (e.ports && e.ports[0]) e.ports[0].postMessage({ ok: true }); })
      .catch(() => { if (e.ports && e.ports[0]) e.ports[0].postMessage({ ok: false }); });
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
