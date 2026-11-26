/* 서비스워커: 한 번 들어온 뒤로는 인터넷 없이도 열리게 사이트 파일을 저장해 둬.
   VERSION은 빌드할 때 파일 내용으로 정해져. 내용이 바뀌면 옛날 저장본은 지우고 새로 받아. */
const VERSION = 'faf0ce401c';
const CACHE = 'sugeo-' + VERSION;
const FILES = ["./","fonts/black-han-sans.woff2","fonts/noto-sans-kr-400.woff2","fonts/noto-sans-kr-500.woff2","fonts/noto-sans-kr-700.woff2","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","manifest.webmanifest"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('sugeo-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // 화면(HTML)은 인터넷이 되면 항상 최신으로, 안 되면 저장본으로
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return res;
    }).catch(() => caches.match('./')));
    return;
  }
  // 폰트·아이콘 같은 파일은 저장본 먼저
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
