# PROJE DURUM — markaizi.com.tr

Son güncelleme: 29 Eylül 2026

Bu dosya projenin güncel durumunu, alınmış kararları ve bekleyen işleri özetler.
Kod ayrıntıları için kaynak dosyalara, veritabanı için `prisma/schema.prisma`'ya bakın.

---

## 1. Genel Bakış

| | |
|---|---|
| Canlı site | https://markaizi.com.tr |
| Kaynak | GitHub `markaizi/markaizi-web`, `main` dalı |
| Deploy | `git push origin main` → Vercel otomatik deploy |
| Framework | Next.js 16.3.x (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4 + `src/app/globals.css` değişkenleri |
| Veritabanı | Neon Postgres + Prisma 6 |
| Kimlik doğrulama | jose JWT, httpOnly cookie `mkz_session` |
| E-posta | Gmail SMTP (nodemailer) |

Site iki parçadan oluşur:
1. **Kamuya açık site** — ajansın tanıtımı, SEO ve yapay zeka görünürlüğü (60 sayfa).
2. **Müşteri / ajans paneli** — `/musteri/**`, admin + çalışan + müşteri rolleriyle iş takip platformu.

---

## 2. Kamuya Açık Site — Sayfa Envanteri

Yayındaki 60 sayfanın tamamı hem `sitemap.xml`'de hem `llms.txt`'de var (27 Eyl 2026 kontrolü).

### Ana sayfa (`/`)
Hero → Ücretsiz Analiz barı → Hizmetler (9 kart, 3×3) → **Sektöre Özel Uzmanlık** (kafe & restoran,
mobilya, sağlık, doğal ürün) → **Nasıl Çalışıyoruz** ("Reklam tek başına satış yapmaz" + son video) →
Hakkımızda (kurucu kartı) → Portföy (sektör etiketleri linkli) → İletişim.

### Hizmet sayfaları (`/hizmetler/*`) — `ServicePageTemplate`
Sosyal Medya Yönetimi, Meta Reklamları, Google Reklamları, TikTok Reklamları, Yapay Zeka & Otomasyon,
Web Tasarım & Hosting (+ `/teklif` formu), Dijital Pazarlama Danışmanlığı, Kurumsal Dijital Pazarlama
Eğitimi, Video Çekimi & Drone.
- Çoğunda "Yaklaşımımız" bölümü (YouTube rehber videosundan uyarlanmış) + video kartı + SSS.
- `/hizmetler/icerik-uretimi` → Sosyal Medya Yönetimi'ne kalıcı yönlendirme (bilerek sitemap dışında).

### Mobilya sektörü (ana uzmanlık)
- `/mobilya-reklam-ajansi` — ana sayfa (85 bin TL senaryosu, vaka, hizmet ve şehir linkleri)
- Hizmet: `/mobilya-meta-reklamlari`, `/mobilya-google-reklamlari`, `/mobilya-sosyal-medya-yonetimi`,
  `/mobilya-web-sitesi`, `/mobilya-seo`, `/mobilya-e-ticaret-danismanligi`
- Bölge: `/istanbul-`, `/inegol-`, `/kayseri-`, `/izmir-mobilya-reklam-ajansi`
- Vaka: `/vaka-calismalari/alitel-mobilya` — 7 yıl, her yıl İstikbal bayileri arasında Türkiye ciro
  birinciliği, 10M TL+ yönetilen reklam bütçesi, ana kanal Google reklamları
- İçerik kaynağı: `src/lib/mobilya-pages.ts`, şablon: `src/components/MobilyaLanding.tsx`

### Kafe & Restoran (Ankara)
- `/ankara-kafe-restoran-reklam-ajansi` — ana sayfa, 25 ilçenin tamamı listeli
- İlçe sayfaları: Çankaya, Gölbaşı, Yenimahalle, Etimesgut, Keçiören, Altındağ, Beypazarı
  (`/<ilce>-kafe-restoran-reklam-ajansi`)
- İçerik kaynağı: `src/lib/kafe-pages.ts` (aynı `MobilyaLanding` şablonu, `parent` alanıyla)

### Diğer sektör sayfaları
`/saglik-klinik-reklam-ajansi`, `/dogal-urun-takviye-reklam-ajansi`

### YouTube (`/videolar`)
- Liste + detay (`/videolar/[slug]`): video (tıklanınca yüklenen oynatıcı), kısa özet, içindekiler,
  tam metin, SSS, ilgili sayfalar.
- İlk video: `isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi` — **henüz YouTube'a yüklenmedi**,
  sayfa "Video çok yakında" gösteriyor.
- Veri: `src/lib/video-data.ts`, metin: `src/content/videolar/<slug>.txt`,
  ayrıştırıcı: `src/lib/video-transcript.ts`.
- Navbar'da kırmızı YouTube butonu (masaüstü, mobil başlık, mobil menü).

### Kurucu (`/samet-saglam`)
ProfilePage + Person şeması; Organization şemalarında `founder`, video sayfalarında yazar olarak bağlı.
Veri: `src/lib/founder.ts` (kişisel hesaplar `sameAs` listesine eklenecek).

### Blog (`/blog`) — 16 yazı
Genel: Instagram algoritması, Google Ads bütçe, Meta ROAS, TikTok, yapay zeka içerik, Core Web Vitals.
Mobilya: reklam nasıl verilir, Instagram, Siteler'de müşteri çekme, yerel SEO, Ankara sosyal medya büyüme,
Ankara mobilya ajansı nasıl seçilir.
Reklam stratejisi: reklam neden satış getirmiyor, reklam bütçesi nasıl belirlenir.
Kafe & restoran: kafe açılışı ilk 90 gün, Google Haritalar rehberi.
Veri: `src/lib/blog-data.ts` (opsiyonel `dateModifiedISO`, `faq`, `videoSlug` alanları).

### Diğer
`/sss` (Ajansla Çalışmak kategorisi dahil), `/ucretsiz-analiz` (İlk Görüşme bölümü), `/cv` (kariyer),
KVKK / gizlilik / çerez / kullanım şartları.

---

## 3. SEO ve Yapay Zeka Görünürlüğü Altyapısı

- **`sitemap.xml`** — `src/app/sitemap.ts`; blog, video, mobilya ve kafe sayfaları veriden otomatik.
  Sabit sayfalar `SITE_UPDATED` tarihini kullanır.
- **`llms.txt`** — `src/app/llms.txt/route.ts` (statik dosya değil, build'de veriden üretilir).
  Yeni blog/video/mobilya/kafe sayfası otomatik girer; yeni **sabit** hizmet/sektör sayfası eklenirse
  dosyadaki `HIZMETLER` / `SEKTORLER` listesine elle eklenmeli.
- **Şemalar** — WebSite + Organization (founder, sameAs), ProfessionalService (areaServed Türkiye +
  Ankara ilçeleri, OfferCatalog), Service, FAQPage, BreadcrumbList, BlogPosting, Article, ProfilePage,
  CollectionPage; video ID girilince VideoObject.
- **Video kartı** — `src/components/VideoCallout.tsx`; video metninin tamamı yalnızca video sayfasında,
  diğer sayfalar fikri kendi cümleleriyle anlatıp buraya bağlanır.
- **Ölçüm** — `docs/ai-gorunurluk-olcum.md`: ayda bir ChatGPT / Gemini / Perplexity / Google'da
  12 sorgu, sonuç tablosu.

### İçerik kuralları (alınmış kararlar)
- **Fiyat yok:** Sitenin hiçbir yerinde markaizi'nin kendi ücreti/paket fiyatı yazılmaz (2 Ağu 2026).
  `/fiyatlar` ve eski paket satışı kaldırıldı. PayTR yalnızca **ödeme linki** olarak geri geldi
  (29 Eyl 2026): tutar sadece linki alan kişiye görünür, sayfa arama motorlarına kapalı.
- **Reklam bütçesi tavsiyeleri:** TikTok sayfasındaki sabit rakam, videodaki "önce aşama belirlenir"
  yaklaşımıyla değiştirildi. SSS'teki Meta (100-200 ₺) / Google (150-300 ₺) rakamları Samet'in isteğiyle
  duruyor.
- **Kopya içerik yok:** Şehir/ilçe sayfaları yalnızca o yere özgü farklı bir hikâye varsa açılır;
  25 ilçenin hepsine sayfa açılmadı.
- **Başlıklar:** Ana sayfa başlığı ve H1'lere dokunulmuyor (mevcut sıralamaların kaynağı).
- **Satış garantisi verilmez** — sayfalarda süreç taahhüdü (şeffaf rapor, test disiplini) anlatılır.
- Samet, sitedeki iddiaların (Alitel, 200+ işletme, 3,2× ROAS, −%38, çekime gelme, drone/SHGM,
  manken, komisyon almama, matbaa ile başlangıç hikâyesi) doğru olduğunu teyit etti (27 Eyl 2026).

---

## 4. PayTR Ödeme Linkleri (29 Eyl 2026)

Admin, panelden tutar + açıklama (+ opsiyonel firma) ile link oluşturur, linki WhatsApp'tan gönderir;
alıcı `/odeme/<kod>` sayfasında bilgilerini girip PayTR iFrame ile kartla öder. Taksit açık.

- Admin ekranı: `/musteri/admin/odeme-linkleri` (link oluştur, kopyala, WhatsApp, önizle, iptal)
- Ödeme sayfası: `src/app/odeme/[code]/` — noindex, `robots.txt`'de kapalı
- Token (1. adım): `POST /api/odeme/[code]` → `src/lib/paytr.ts` `fetchIframeToken`
- Bildirim URL (2. adım): `POST /api/paytr/callback` — hash doğrulaması, tekrar eden bildirimde
  yalnızca ilki işlenir, yanıt düz metin `OK`
- Başarılı ödemede: link "Ödendi", **Ekonomi'ye GELİR kaydı** (test modunda yazılmaz), admin'e e-posta
- Veritabanı: `PaymentLink`, `PaymentAttempt` (migration `20260929120000_paytr_payment_links`)
- CSP: `frame-src` ve `script-src`'ye `https://www.paytr.com` eklendi

**Canlıya almak için (Samet):**
1. Vercel → Environment Variables: `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`,
   ilk denemeler için `PAYTR_TEST_MODE=1`. Sonra redeploy.
2. PayTR Mağaza Paneli → Destek & Kurulum → Ayarlar → **Bildirim URL**:
   `https://markaizi.com.tr/api/paytr/callback`
3. Test ödemesi başarılı olunca `PAYTR_TEST_MODE`'u kaldırıp redeploy.
4. PayTR'nin mağaza onayı için sitede mesafeli satış sözleşmesi, ön bilgilendirme ve iade/iptal
   koşulları sayfaları istenebilir — henüz yok.

---

## 5. Müşteri / Ajans Paneli (`/musteri/**`)

### Roller
| Rol | Erişim |
|---|---|
| `ADMIN` | Her şey |
| `EMPLOYEE` | Atandığı firmalar + yetkisine göre ek ekranlar (iş akışı, ekonomi görüntüleme vb.) |
| `CLIENT` | Kendi firmasının paneli |

### Admin ekranları
Firmalar (`/admin/[slug]`), yeni firma, çalışanlar (liste/detay, yetkiler), İş Akışı (kanban),
takvim, ödemeler/faturalar, istekler, gelen talepler (form başvuruları, CV tutarlılık uyarıları dahil),
çalışan mesajları, **Ekonomi** (gelir/gider, düzenli giderler, tarih aralığı raporu, CSV), profil.

### Çalışan ekranları
Dashboard, firmalarım, iş akışı, iş kayıtlarım, takvim, ücret girişi, profil.

### Müşteri ekranı
Firma paneli (içerik takvimi, faturalar, raporlar, bildirimler, istekler), profil.

### Öne çıkan özellikler
- Trello tarzı iş akışı; kart → iş kaydı ve içerik takvimi otomasyonu
- Tekrarlayan faturalar, vade durumuna göre otomatik durum (Günü gelmedi / Bekliyor / Gecikmede)
- Müşteri bildirimleri (önem derecesi, popup, yanıt), çalışan bildirimleri
- Aylık reklam raporları, PDF iş kaydı raporu
- PWA desteği
- **Tema:** KOYU (varsayılan) / AYDINLIK (iOS tarzı) — her kullanıcı Profilim'den seçer,
  `User.panelTheme` alanında tutulur
- **Bakım modu:** `src/app/api/musteri/auth/login/route.ts` içinde `MAINTENANCE_MODE` (şu an `false`)

### Veritabanı modelleri
User, PasswordResetToken, Client, Assignment, ContentItem, Update, Invoice, Note, NoteRead,
WorkflowColumn, WorkflowCard, AdReport, ClientNotification, WorkLog, Transaction, RecurringExpense,
PayrollPayment, Submission, StaffNotification, StaffFeedback. Ayrıntı: `prisma/schema.prisma`.

---

## 6. Nasıl Yapılır

**Yeni blog yazısı:** `src/lib/blog-data.ts`'e kayıt ekle. Sitemap ve llms.txt otomatik güncellenir.
Kategori "Mobilya Sektörü" ise mobilya sayfasına, `CATEGORY_SERVICE`'teki kategorilerde ilgili hizmet
sayfasına otomatik link çıkar. Konuyla ilgili video varsa `videoSlug` ekle.

**Yeni YouTube videosu:**
1. Metni `src/content/videolar/<slug>.txt` olarak kaydet (bölümler `⸻` ile, başlıklar BÜYÜK HARFLE).
2. `src/lib/video-data.ts`'teki `VIDEOS` listesinin **en başına** kayıt ekle (özet, SSS, ilgili linkler).
3. Video yüklenince `youtubeId` (ve biliniyorsa `durationISO`) alanını doldur.
Kanal açılınca `YOUTUBE_CHANNEL_URL`'i doldur → "Abone Ol" butonları ve sameAs otomatik.

**Yeni mobilya bölge/hizmet sayfası:** `src/lib/mobilya-pages.ts`'e içerik + `src/app/<yol>/page.tsx`.
**Yeni kafe ilçe sayfası:** `src/lib/kafe-pages.ts`'e `district(...)` kaydı + `KAFE_DISTRICT_PAGES`'e ekle
+ route dosyası. Yalnızca ilçeye özgü farklı bir hikâye varsa.

**Veritabanı migration:** `prisma migrate dev` etkileşimsiz ortamda çalışmıyor. Migration klasörünü
`prisma/migrations/<zaman>_<ad>/migration.sql` olarak elle yaz, sonra:

> ⚠️ **ASLA** canlı veritabanı adresini `--shadow-database-url`'e ya da `migrate dev`, `migrate reset`,
> `db push --force-reset` gibi sıfırlayabilen komutlara verme. 29 Eyl 2026'da bu hata canlı veriyi sildi,
> Neon point-in-time restore ile geri getirildi. Önce salt okunur `migrate status`, sonra `migrate deploy`.

```bash
npx dotenv -e .env.local -- prisma migrate deploy
npx prisma generate
```

---

## 7. Bekleyenler

### Samet'in yapması gerekenler
- [ ] İlk YouTube videosunu yükleyip linkini, kanal adresini ve video süresini iletmek
- [ ] YouTube açıklamasına bölüm zaman damgaları eklemek (sitedeki içindekiler videoya bağlanabilir)
- [ ] Kişi sayfası için fotoğraf; LinkedIn ve kişisel sosyal hesap linkleri (`FOUNDER.sameAs`)
- [ ] Hesap biyografilerinde `markaizi.com.tr/samet-saglam` linki
- [ ] Search Console'da yeni sayfaları "Dizine eklenmesini iste" ile göndermek
      (kafe & restoran, mobilya hizmet/şehir, Alitel vaka, danışmanlık/eğitim/video, /samet-saglam)
- [ ] Google İşletme Profili: hizmet bölgelerine Ankara ilçelerini eklemek, yorum sayısını artırmak
- [ ] Kafe/restoran vaka çalışması için isimli bir örnek (varsa)
- [ ] Sektör sitelerinde (ör. Mobilya Haber) Alitel başarısını anlatan haber/yazı
- [ ] Ayda bir `docs/ai-gorunurluk-olcum.md` ölçümü
- [ ] PayTR ortam değişkenleri + Bildirim URL + test ödemesi (bkz. bölüm 4)

### Teknik
- [ ] Hizmet sayfalarının sekme başlığında "… | markaizi — markaizi" tekrarı (başlık dizeleri
      `| markaizi` ile bitiyor, kök şablon bir kez daha ekliyor). Mobilya/kafe sayfalarında düzeltildi.
- [ ] `npm audit`: 3 "yüksek" uyarı yalnızca Prisma CLI'nin geliştirme bağımlılığında
      (`deepmerge-ts`); düzeltmesi Prisma 7'ye geçiş gerektiriyor.
- [ ] Büyük sürüm geçişleri (Prisma 7, TypeScript 7, ESLint 10) yapılmadı.
- [ ] İki `<option>` öğesinde sabit `#0f0f14` arka plan (aydınlık temada açılır menü rengi).

---

## 8. Deploy ve Ortam Değişkenleri

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | Neon pooled bağlantı (uygulama) |
| `DIRECT_URL` | Neon direct bağlantı (migration, lokal) |
| `AUTH_SECRET` | JWT imzalama anahtarı |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Form ve bildirim e-postaları |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics (çerez onayından sonra) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (çerez onayından sonra) |
| `PAYTR_MERCHANT_ID` / `PAYTR_MERCHANT_KEY` / `PAYTR_MERCHANT_SALT` | PayTR mağaza bilgileri |
| `PAYTR_TEST_MODE` | `1` ise test modu (gerçek çekim yok, Ekonomi'ye yazılmaz) |

---

## 9. Değişiklik Geçmişi (Özet)

- **Temmuz 2026** — Mobilya SEO paketi (iniş sayfası + 4 blog), site denetimi.
- **Ağustos 2026** — Panel: Trello tarzı iş akışı, çalışan iş kayıtları ve ödemeleri, ekonomi modülü,
  PWA, tekrarlayan faturalar, müşteri bildirimleri, raporlar, granüler çalışan yetkileri.
  Site: fiyatların ve ödeme altyapısının kaldırılması, ücretsiz analiz sayfası, sağlık ve doğal ürün
  sektör sayfaları, CV formunda 13 beceri kaydırıcısı, Next.js 16.3, şema altyapısı, tasarım denetimi.
- **6 Eylül 2026** — Ekonomi geliştirmeleri, panel aydınlık teması, Ankara mobilya blog yazısı.
- **26 Eylül 2026** — Ajans seçimi blog yazısı, rakip analizi sonrası mobilya şehir/hizmet sayfaları ve
  Alitel vaka çalışması, Türkiye geneli sinyalleri, güvenlik güncellemeleri (Next 16.3.6),
  CV tutarlılık uyarısı, danışmanlık/eğitim/video-drone hizmetleri, YouTube bölümü ve ilk video,
  videodan beslenen içerikler (ana sayfa, hizmetler, mobilya, SSS, ücretsiz analiz, 2 blog),
  otomatik llms.txt, kurucu sayfası.
- **27 Eylül 2026** — Ankara kafe & restoran sayfaları (ana + 7 ilçe + 2 blog), ana sayfaya
  "Sektöre Özel Uzmanlık" bölümü, sitemap/llms.txt tam tutarlılık kontrolü (60/60).
- **29 Eylül 2026** — PayTR ödeme linkleri. Aynı gün yanlış bir Prisma komutu canlı veritabanını sildi;
  Neon point-in-time restore ile 13:30 anına geri yüklendi, veri kaybı yok.
