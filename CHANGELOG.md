# CHANGELOG — markaizi.com.tr

> **Bu dosya araçlar arası devir-teslim defteridir.** En üstteki sürüm = en son durum.
> Kurallar ve şablon: [`AGENTS.md`](./AGENTS.md). Eski sürümler silinmez.
> Güncel sürüm: **v3.2.0** (`package.json` ile aynı olmalı).

---

## v3.2.0 — 10 Kasım 2026 — Google SEO, GEO (Yapay Zeka Bulunabilirliği) ve UI/UX İyileştirme Paketi
**Araç:** Antigravity (Gemini 3.8 Flash & Claude Sonnet 5.5)  **Tür:** MINOR

### Yapılanlar
**1. Google SEO & Knowledge Graph (Entity Bütünlüğü)**
- `src/lib/seo.ts`: Paylaşılan merkezi varlık kimliği `ORG_ID = "https://markaizi.com.tr/#organization"` ve `OG_IMAGES` tanımlandı.
- `src/app/layout.tsx`: Kök şema `publisher` ve `organization` düğümü `@id: ORG_ID` ile birleştirildi. Kök `openGraph` ve `twitter` nesneleri sadeleştirilerek alt sayfaların kendi dinamik başlıklarını ezmesi engellendi.
- `src/app/page.tsx`: Ana sayfa `ProfessionalService` ve `Organization` şeması `@id: ORG_ID` ile senkronize edildi; `hasOfferCatalog` listesine eksik olan tüm hizmet ve sektörler (`/yapay-zeka-gorunurluk-olcumu`, `/saglik-klinik-reklam-ajansi`, `/guzellik-merkezi-reklam-ajansi`, vb.) URL'leriyle eklendi.
- `src/components/ServicePageTemplate.tsx`: Tüm 11 hizmet sayfasında JSON-LD `provider` `@id: ORG_ID` düğümüne bağlandı; `H1`'den sonra doğrudan `H3`'e atlayan yapı arasına `H2` başlığı eklenerek semantik başlık hiyerarşisi sağlandı; alt CTA bloğuna `/ucretsiz-analiz` yönlendirmesi eklendi.
- `src/components/MobilyaLanding.tsx`: Tüm mobilya ve dikey iniş sayfalarında `provider` `@id: ORG_ID`'ye bağlandı; `description` şemaya dahil edildi; `areaServed` ilçe/şehir ayrımı düzeltildi; `openGraph.images` ve `siteName` tanımlandı.
- `src/app/blog/[slug]/page.tsx`: Blog yazılarının `openGraph` etiketlerine `url`, `locale: "tr_TR"`, `siteName` ve `images: OG_IMAGES` eklendi; `CATEGORY_SERVICE` eşlemesine `"Mevzuat"` kategorisi dahil edildi.
- `src/app/blog/page.tsx`: Blog liste sayfası en yeni yazıları en üstte gösterecek şekilde `dateISO` azalan sıralamasına (`sort`) alındı.

**2. Yapay Zeka Bulunabilirliği (GEO) & Factual / Policy Tutarlılığı**
- `src/components/sections/Contact.tsx`: Çalışma saatleri `llms.txt`, JSON-LD ve site geneli kuralıyla tam uyumlu hale getirildi: **Pazartesi — Cumartesi 09:00 — 20:00** (Pazar kapalı).
- `src/components/sections/Sectors.tsx`: Sağlık & Klinik kartındaki mevzuata aykırı `"alternatif tıp"` ifadesi kaldırıldı; ana sayfaya eksik olan 3 yeni sektör eklendi (Güzellik Merkezi, E-Ticaret, GETAT).
- `src/components/sections/Services.tsx`: Ana sayfa hizmet grid'ine eksik olan 2 ana hizmet eklendi (Dönüşüm Takibi Kurulumu, Yapay Zeka Arama Görünürlüğü - GEO).
- `src/components/sections/Footer.tsx`: Mobilya sütununa eksik olan `/mobilya-kurumsal-meta-google-reklam-yonetimi` linki eklendi.
- `src/app/gizlilik-politikasi/page.tsx` & `src/app/kullanim-sartlari/page.tsx`: Eski `.tr`'siz `markaizi.com` ifadeleri `markaizi.com.tr` olarak düzeltildi.
- `src/app/hizmetler/sosyal-medya-yonetimi/page.tsx`: "Sabit paket yok" ilkesiyle çelişen eski paket bazlı SSS metni güncellendi.
- `src/app/sss/page.tsx`: Eski 100-200 ₺ reklam bütçesi ifadesi güncel video rehberleri ve bütçe hesaplayıcı ile uyumlu hale getirildi (günlük min 400-500 ₺).
- `src/app/hizmetler/yapay-zeka-arama-gorunurlugu/page.tsx`: Düz metin halindeki `/yapay-zeka-gorunurluk-olcumu` referansı açık linke dönüştürüldü.
- `src/app/robots.ts`: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` gibi tüm yapay zeka arama tarayıcıları için `/` ve `/llms.txt` erişimine açık izin kuralları eklendi.
- `src/app/sitemap.ts`: `SITE_UPDATED` tarihi `2026-11-10` olarak güncellendi.
- `src/app/musteri/layout.tsx`: Panel sayfalarının kazara arama motorlarında dizine girmesini önlemek için `robots: { index: false, follow: false }` eklendi.

**3. UI/UX, Mobil Uyum ve Aydınlık Tema Düzeltmeleri**
- `src/components/CookieBanner.tsx` & `src/components/WhatsApp.tsx`: WhatsApp butonu (`z-[980]`) ve çerez bandı (`z-[990]`) z-index çakışmaları çözüldü; `CookieBanner`'ın panel (`/musteri/**`) ve ödeme sayfalarında bildirim zilleri üzerine binmesi engellendi.
- `src/app/globals.css`: Aydınlık tema (`[data-panel-theme="light"]`) için beyaz kartlar üzerinde kontrastı düşüren açık gri metin sınıfları (`text-[#c8c8d0]`, `text-[#c8c8d8]`, `text-[#d8d8e4]`) ve koyu/renkli butonlardaki metin renkleri düzeltildi.
- `src/app/musteri/admin/yeni/page.tsx` & `src/components/AdminClientDetail.tsx`: Select dropdown `<option>` elemanlarındaki sabit `#0f0f14` arka planı `var(--surface)` olarak güncellendi.
- `src/components/sections/Hero.tsx` & `src/components/WhatsApp.tsx`: Gereksiz `"use client"` direktifleri kaldırılarak Server Component uyumluluğu ve LCP hidrasyon optimizasyonu sağlandı.

### Doğrulama
- `tsc --noEmit`: 0 hata (Tamamen temiz geçti).

### Yarım kalanlar / Sıradaki
- v3.3.0: 81 noktada yer alan `<a href>` etiketlerinin Next.js `<Link>` bileşenine dönüştürülmesi ve ESLint temizliği.

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
