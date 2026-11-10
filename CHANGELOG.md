# CHANGELOG — markaizi.com.tr

> **Bu dosya araçlar arası devir-teslim defteridir.** En üstteki sürüm = en son durum.
> Kurallar ve şablon: [`AGENTS.md`](./AGENTS.md). Eski sürümler silinmez.
> Güncel sürüm: **v3.1.0** (`package.json` ile aynı olmalı).

---

## v3.1.0 — 10 Kasım 2026 — Güvenlik ve hata düzeltme paketi
**Araç:** Antigravity (Claude Sonnet 5.5)  **Tür:** MINOR
Kaynak: 10 Kasım 2026 tarihli 6 başlıklı site denetimi (hata, UI/UX, trend, güvenlik, SEO, GEO). Bu sürüm denetimin
**güvenlik + hata** kısmını kapatır; SEO/GEO → v3.2.0, UI/UX → v3.3.0, performans/lint → v3.4.0 olarak sıralandı.

### Yapılanlar
**Canlıda çalışmayan özellik**
- `next.config.ts`: CSP `frame-src` YouTube'a (`youtube-nocookie.com`, `youtube.com`) izin verecek şekilde genişletildi.
  Önceden canlı sitede video oynat butonu CSP tarafından engelleniyordu (yerelde CSP yok, o yüzden fark edilmemişti).
- `next.config.ts`: `Strict-Transport-Security` (HSTS) başlığı eklendi.

**Oturum / kimlik doğrulama (`src/lib/auth.ts`, `session.ts`)**
- `getSession()` artık her istekte (React `cache` ile istek başına 1 kez) DB'den kullanıcının `active` durumunu ve CLIENT için firmanın
  `active` durumunu doğruluyor. Pasife alınan/silinen kullanıcı veya firma, 7 günlük JWT çerezi olsa bile anında erişimini kaybeder.
- **Parola sürümü (`pv`)**: JWT'ye parola hash'inin kısa özeti yazılıyor. Parola değişince/sıfırlanınca eski cihazların oturumu düşer.
  Kullanıcı kendi profilinden parola değiştirirse `reissueSession()` ile o cihazın oturumu yenilenir. Şema değişikliği gerekmedi.
  `pv`'siz eski çerezler geçerli sayılır (en geç 7 günde kendiliğinden biter).
- `auth/reset`: kullanıcının kullanılmamış **tüm** sıfırlama bağlantıları geçersiz kılınıyor (önceden yalnız kullanılan).
- `auth/login`: geçerli (cost 12) sahte hash ile zamanlama saldırısı kapatıldı (eski sahte hash geçersiz uzunluktaydı);
  kullanıcı adı başına ek rate limit (5 dk'da 10); pasif firmanın müşterisi giriş yapamaz.
- `clearSessionCookie()` `path: "/"` ile siliyor.

**Yetki sızıntıları**
- `/musteri/[slug]` (`getClientView(slug, viewer)`): çalışan için atamadaki `canViewInvoices / canViewContent / canViewUpdates`
  bayrakları **veri seviyesinde** uygulanıyor (önceden atanmış her çalışan faturaları görebiliyordu). Müşteri için aktif KIRMIZI
  bildirim kilidinde içerik takvimi ve raporlar sayfa verisinden çıkarılıyor.
- `GET /api/musteri/calendar` ve `GET /api/musteri/reports/[id]/pdf`: KIRMIZI kilit (CLIENT) ve çalışan içerik yetkisi kontrolü eklendi.
- `/musteri/calisan/[slug]`: yetkisiz `updates` / `contentItems` sayfaya hiç gönderilmiyor.
- `POST /api/musteri/message`: çalışan yalnız atandığı firmaya mesaj gönderebilir (`assertCanAccessClient`).
- `POST /api/musteri/is-akisi/cards/[id]/content-item`: çalışan için firmada `canManageContent` zorunlu.
- İş akışı: `cards/archived` ve `cards/[id]` (PATCH/DELETE) artık `hiddenFromEmployees` ve `workflowSeeAllCards` kurallarına uyuyor.

**Ödeme (PayTR)**
- `api/paytr/callback`: test modu `attempt.testMode` kaydından okunuyor (hash `test_mode` alanını kapsamıyor); ödenen tutar link tutarından
  azsa işlem reddediliyor; link önce kapatılıp (`updateMany`) yalnızca ilk başarılı bildirim Ekonomi'ye GELIR yazıyor (mükerrer gelir önlendi).
- `api/odeme/[code]`: PayTR dönüş adresleri production'da sabit `https://markaizi.com.tr` (Host başlığına güvenilmiyor).
- `api/odeme/[code]/durum`: rate limit eklendi (dakikada 60).

**Rate limit / IP (`src/lib/security.ts`)**
- `getClientIp`: önce Vercel'in doğrulanmış `x-vercel-forwarded-for` başlığı, ardından biçim doğrulamalı yedekler (sahte `X-Forwarded-For` artık
  rate limit ve PayTR `user_ip` alanını manipüle edemez). Rate limiter'a bellek şişmesine karşı süpürme/üst sınır eklendi.
- Profil parola değiştirme (3 profil rotası): kullanıcı başına 15 dk'da 5 deneme.

**Hata düzeltmeleri**
- `forgot` e-postasında `user.name` HTML'e kaçışsız gömülüyordu → `escapeHtml`.
- Geçersiz tarih metni Prisma 500'ü veriyordu → `isValidDateString` ile zod doğrulaması (worklogs, worklogs/bulk, admin/worklogs/[id],
  admin/content/[id], admin/updates/[id]). `PATCH admin/updates/[id]` tarihi `Date`'e çevirmiyordu (her düzenlemede 500) → düzeltildi.
- `await req.json()` çağrıları `.catch(() => ({}))` ile sarıldı (bozuk JSON artık 500 değil 400 döner) — admin ve iş akışı rotalarında.
- `admin/clients/[slug]/users`: başka kullanıcıya ait e-posta artık P2002 500 yerine 409 döner.
- iCloud çakışma dosyaları (`.next/types/* 2.ts`) temizlendi (`rm -rf .next`); `tsc --noEmit` artık temiz.

**Devir-teslim altyapısı (yeni)**
- `AGENTS.md` (tüm araçlar için protokol), `GEMINI.md`, `CHANGELOG.md` (bu dosya); `CLAUDE.md` başına yönlendirme.

### Doğrulama
- `tsc --noEmit`: 0 hata. ESLint/build: v3.4.0 sonunda toplu raporlanacak.

### Dikkat / bilinen kısıtlar
- **Bilinçli bırakıldı:** `is-akisi/cards/[id]/complete-price` kendi kartına ücret yazmaya `adminCompleteCardsScope` ile izin veriyor;
  kodda "ayrıca ücret girme yetkisi gerekmez" diye belgelenmiş bir tasarım kararı. Sıkılaştırmak istenirse Samet'e sorulmalı.
- **Yapılmadı (iş kuralı gerektirir):** çalışanın kapanmış bordro dönemine geriye dönük iş kaydı girmesinin engellenmesi;
  `requireStaffForReport` (salt-okunur atamalı çalışanın rapor yükleyebilmesi) için ayrı `canManageReports` yetkisi (şema değişikliği ister).
- Rate limiter hâlâ bellek içi (Vercel'de örnek başına). Kesin sınır için Upstash Redis önerilir.

### Yarım kalanlar / Sıradaki
- v3.2.0: SEO + GEO düzeltmeleri · v3.3.0: UI/UX + mobil + aydınlık tema · v3.4.0: performans, `<Link>` dönüşümü, ESLint temizliği.

---

## v3.0.0 — 10 Kasım 2026 — Taban sürüm (referans noktası)
**Tür:** MAJOR (etiketleme) — kod değişikliği yok.
Samet, 3 Kasım 2026 itibarıyla (commit `49e5b74`) projenin durumunu "markaizi v3.0" olarak kabul etti. Bundan sonraki tüm araçlar
(Claude Code, Codex, Antigravity) sürüm vererek devam eder. v3.0.0'a kadarki geçmiş için bkz. `PROJE-DURUM.md` §9 "Değişiklik Geçmişi".
Özet durum: 86 indekslenebilir genel sayfa, otomatik `llms.txt`/sitemap, PayTR ödeme linkleri, müşteri/ajans paneli (`/musteri/**`),
ilk YouTube videosu, mevzuata uyumlu sağlık/takviye/GETAT sayfaları.
