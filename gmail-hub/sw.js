const CACHE = 'gmail-hub-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('message', (e) => {
  const m = e.data || {};
  if (m.type === 'notify') {
    self.registration.showNotification(m.title || 'Gmail Hub', {
      body: m.body || '', tag: 'gmail-hub-otp', renotify: true,
      vibrate: [100, 50, 100], data: { url: '/tools/gmail-hub/' },
    });
  }
  if (m.type === 'badge' && 'setAppBadge' in navigator) {
    if (m.count > 0) navigator.setAppBadge(m.count); else navigator.clearAppBadge();
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then((wins) => {
    for (const w of wins) if (w.url.includes('/tools/gmail-hub')) return w.focus();
    clients.openWindow('/tools/gmail-hub/');
  }));
});