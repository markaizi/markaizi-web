// markaizi Panel — minimal service worker. Amaç PWA yüklenebilirliği; ağır bir
// önbellekleme stratejisi yok, panel her zaman güncel veriyle sunucudan gelir.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Passthrough — özel bir önbellekleme yapılmıyor, sadece SW'nin aktif
  // olması tarayıcıların "ana ekrana ekle" davranışını güvenilir kılıyor.
});
