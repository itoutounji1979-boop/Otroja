/* يحفظ اللعبة على الجهاز لتعمل دون إنترنت.
   ملفات الصفحة والكود: الشبكة أولًا (ليصل كل تحديث فورًا)، ثم النسخة المحفوظة عند انقطاع الإنترنت.
   الصور والخطوط وملفات المجهر الكبيرة: المحفوظ أولًا. */
const CACHE = 'hurras-v12';
const FILES = [
  './', 'index.html', 'style.css', 'game.js', 'audio.js', 'ar.js', 'level2.js', 'paid.js', 'unlock.js', 'teacher.html', 'manifest.webmanifest',
  'fonts/alexandria-ar.woff2', 'fonts/alexandria-lat.woff2',
  'assets/bg.webp', 'assets/hero.webp', 'assets/virus.webp', 'assets/virus_burst.webp', 'assets/bacterium.webp',
  'assets/iodine.webp', 'assets/uv.webp', 'assets/lister.webp', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/otroja-logo.png', 'assets/razi.webp'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const save = (req, res) => { if (res.ok && new URL(req.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; };
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const p = new URL(req.url).pathname;
  const fresh = req.mode === 'navigate' || /\.(html|js|mjs|css|webmanifest)$/.test(p) && !p.includes('/mp/');
  if (fresh) {
    e.respondWith(fetch(req).then(res => save(req, res)).catch(() => caches.match(req, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => save(req, res))));
  }
});
