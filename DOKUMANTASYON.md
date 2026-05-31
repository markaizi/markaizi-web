# markaizi.com.tr — Tam Proje Dokümantasyonu

> Yeni bir Claude oturumu açtığında bu dosyayı oku: `"DOKUMANTASYON.md dosyasını oku, devam edelim"`
> Son güncelleme: Haziran 2026

---

## 1. Proje Genel Bakış

| Bilgi | Değer |
|-------|-------|
| **Site** | https://markaizi.com.tr |
| **Repo** | https://github.com/markaizi/markaizi-web (public) |
| **Deploy** | Vercel — GitHub push → otomatik deploy |
| **Vercel Takımı** | markaizis-projects |
| **Stack** | Next.js 16 (App Router) · TypeScript · Tailwind CSS · Nodemailer (Gmail SMTP) |
| **Proje Dizini** | `/Users/sametsaglam/Desktop/web-siteler/markaizi` |

**Ajans:** Ankara merkezli dijital reklam ajansı. Hizmetler: sosyal medya yönetimi, Meta/Google/TikTok reklamları, içerik üretimi, web tasarım & hosting, yapay zeka & otomasyon.

---

## 2. Tasarım Sistemi

| Değişken | Değer |
|----------|-------|
| `--bg` | `#050505` |
| `--surface` | `#0f0f0f` |
| `--surface-2` | `#141414` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--grad` | `linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)` |
| `--grad-soft` | `rgba(168,85,247,0.08)` |
| Font | Inter (Google Fonts) |

CSS değişkenleri `src/app/globals.css` içinde `:root`'ta tanımlı.

---

## 3. Sayfa Yapısı

```
/                           Ana sayfa (Hero, Hizmetler, Hakkımızda, Portföy, Fiyatlar, İletişim, Footer)
/blog                       Blog listesi (6 makale, kart grid)
/blog/[slug]                Tekil blog yazısı
/hizmetler/
  sosyal-medya-yonetimi     Sosyal Medya Yönetimi
  meta-reklamlari           Meta Ads
  google-reklamlari         Google Ads
  tiktok-reklamlari         TikTok Ads
  web-tasarim-hosting       Web Tasarım & Hosting
  web-tasarim-hosting/teklif  Web teklif formu
  yapay-zeka-otomasyon      Yapay Zeka & Otomasyon
  icerik-uretimi            → sosyal-medya-yonetimi redirect
/sss                        SSS (ana menüde YOK, footer linkli, URL çalışıyor)
/musteri/[slug]             Şifreli müşteri paneli (noindex)
/odeme/[paket]              PayTR ödeme (altyapı hazır, buton kapalı)
/odeme/basarili             Ödeme başarılı
/odeme/iptal                Ödeme iptal
/gizlilik-politikasi        Gizlilik Politikası
/cerez-politikasi           Çerez Politikası
/kullanim-sartlari          Kullanım Şartları
/kvkk                       KVKK Aydınlatma Metni
```

---

## 4. Dosya Yapısı

```
src/
├── app/
│   ├── page.tsx                     Ana sayfa + JSON-LD (ProfessionalService, sameAs)
│   ├── layout.tsx                   Metadata, Inter font, Analytics, CookieBanner
│   ├── globals.css                  CSS variables, base stiller
│   ├── icon.svg                     Favicon (markaizi logosu, beyaz, kare viewBox)
│   ├── opengraph-image.tsx          OG görsel
│   ├── robots.ts                    /api/ ve /musteri/ gizli
│   ├── sitemap.ts                   25 URL
│   ├── api/
│   │   ├── contact/route.ts         İletişim formu → Gmail SMTP
│   │   ├── web-teklif/route.ts      Web teklif formu → Gmail SMTP
│   │   ├── musteri/
│   │   │   ├── verify/route.ts      Panel şifre doğrulama (Vercel env var)
│   │   │   └── message/route.ts     Panel mesaj → Gmail (konu: müşteri adı)
│   │   └── paytr/
│   │       ├── token/route.ts       PayTR iframe token
│   │       └── callback/route.ts    PayTR ödeme bildirimi
│   ├── blog/
│   ├── hizmetler/ (6 sayfa + teklif)
│   ├── musteri/[slug]/page.tsx      noindex, generateStaticParams
│   ├── odeme/ (3 sayfa)
│   └── sss/, gizlilik-politikasi/, cerez-politikasi/, kullanim-sartlari/, kvkk/
│
├── components/
│   ├── Navbar.tsx                   Sticky, glassmorphism scroll, hamburger + ✕ Kapat
│   ├── Logo.tsx                     SVG logo bileşeni
│   ├── Analytics.tsx                Google Analytics
│   ├── CookieBanner.tsx             GDPR cookie banner (localStorage)
│   ├── ScrollReveal.tsx             IntersectionObserver fade animasyonu
│   ├── WhatsApp.tsx                 Sağ alt sabit WhatsApp balonu (pulse)
│   ├── ClientPortal.tsx             7 sekme şifreli müşteri paneli
│   ├── ServicePageTemplate.tsx      Hizmet sayfası şablonu + FAQPage JSON-LD
│   ├── ServiceFAQ.tsx               Accordion SSS ("use client")
│   ├── CheckoutForm.tsx             PayTR iframe formu (pasif)
│   ├── LegalPageTemplate.tsx        Hukuki sayfa şablonu
│   ├── WebTeklifForm.tsx            Web teklif formu bileşeni
│   └── sections/
│       ├── Hero.tsx                 Animasyonlu hero, neon orb arka plan
│       ├── Services.tsx             6 hizmet kartı, hover glow
│       ├── About.tsx                Sayaç animasyonu
│       ├── Portfolio.tsx            Logo grid + testimonial slider
│       ├── Pricing.tsx              4 sosyal medya paketi (butonlar → #iletisim)
│       ├── Contact.tsx              İletişim formu
│       └── Footer.tsx               3 sütun linkler
│
└── lib/
    ├── clients.ts                   Müşteri paneli veri yapısı + CLIENTS dizisi
    ├── blog-data.ts                 6 blog yazısı (statik)
    ├── packages.ts                  7 paket tanımı (fiyat + kuruş — PayTR için)
    ├── paytr.ts                     PayTR token, HMAC-SHA256, generateOrderId
    └── security.ts                  escapeHtml, isValidEmail, cleanStr, rateLimit, getClientIp

musteri-data/
├── SABLON.txt                       Yeni müşteri şablonu
├── sahinavize.txt                   Şahin Avize verisi
└── alanyapro.txt                    Alanya Pro Cleaning verisi

public/
├── llms.txt                         AI keşfedilebilirlik özeti (llmstxt.org)
└── logo.svg                         Yedek logo
```

---

## 5. Navbar Linkleri

```
Hizmetler → /#hizmetler
Hakkımızda → /#hakkimizda
Portföy → /#portfolio
Fiyatlar → /#fiyatlar
Blog → /blog
İletişim (buton) → #iletisim
```
SSS ana menüden kaldırıldı (footer'da linki var).

---

## 6. Fiyat Paketleri

`src/components/sections/Pricing.tsx` — Aylık Sosyal Medya Yönetim Paketleri

| Paket | Fiyat | Not |
|-------|-------|-----|
| Başlangıç | 19.900 ₺/ay | — |
| Büyüme | 29.900 ₺/ay | **EN POPÜLER** |
| Kurumsal | 39.900 ₺/ay | — |
| Elite | 54.900 ₺/ay | — |

Butonlar şu an `#iletisim` → PayTR açılınca `/odeme/${slug}` olacak.

---

## 7. Hizmet Sayfaları

`ServicePageTemplate.tsx` şablonu. Her sayfada:
- Hero (başlık, özellik listesi)
- Özellikler grid
- 3-4 SSS + **FAQPage JSON-LD** (Google/AI)
- CTA bölümü

---

## 8. SEO & AI Keşfedilebilirlik

- **Lighthouse:** Erişilebilirlik · SEO · Best Practices · Agentic → hepsi **100**
- **JSON-LD:** Ana sayfada `ProfessionalService` + adres + geo + 8 Ankara ilçesi
- **FAQPage schema:** Her hizmet sayfasında
- **sitemap.ts:** 25 URL otomatik
- **robots.ts:** `/api/` ve `/musteri/` gizli
- **public/llms.txt:** LLM özet dosyası
- **sameAs:** Instagram · TikTok · Google Business
  *(Facebook, LinkedIn, YouTube — hesaplar açılınca eklenecek)*

---

## 9. Güvenlik

`src/lib/security.ts`

| Fonksiyon | Açıklama |
|-----------|----------|
| `escapeHtml` | HTML injection koruması |
| `isValidEmail` | E-posta format doğrulama |
| `cleanStr(str, maxLen)` | Trim + uzunluk sınırı |
| `cleanPhone` | Telefon temizleme |
| `rateLimit(key, max, ms)` | IP tabanlı, bellek içi (Vercel best-effort) |
| `getClientIp` | X-Forwarded-For |

Rate limit değerleri: İletişim/web-teklif/müşteri-mesaj → 5/dk · PayTR → 8/dk

---

## 10. Müşteri Paneli

### URL: `markaizi.com.tr/musteri/[slug]`

**Özellikler:**
- Şifreli giriş → `POST /api/musteri/verify` → Vercel env var doğrulama
- Oturum: `sessionStorage` (sekme kapanınca sıfır)
- Google'dan gizli: `noindex` + robots.txt

**7 Sekme:**
| Sekme | İçerik |
|-------|--------|
| 📣 Meta Ads | Kampanya listesi |
| 🔍 Google Ads | Kampanya listesi |
| 🎵 TikTok Ads | Kampanya listesi |
| 🌐 Website | Web güncellemeleri |
| 📝 Ajans Güncellemeleri | Tarihli notlar |
| 📅 İçerik Takvimi | 2 sütun grid |
| 💳 Fatura Bilgisi | Dönem/tutar/durum |

**Mobil:** Kampanya ve fatura → kart layout. Masaüstü → tablo.

**Alt Destek Kutusu:**
- WhatsApp pill butonu (yeşil)
- E-posta pill butonu (mor)
- Mesaj textarea → `POST /api/musteri/message` → Gmail (konu: `[Müşteri Paneli] MüşteriAdı — Yeni Mesaj`)
- ⌘+Enter kısayolu

### Mevcut Müşteriler

| Müşteri | URL | Env Var |
|---------|-----|---------|
| Şahin Avize | /musteri/sahinavize | `CLIENT_PASSWORD_SAHINAVIZE` |
| Alanya Pro Cleaning | /musteri/alanyapro | `CLIENT_PASSWORD_ALANYAPRO` |

> Şifreler Vercel env var'da saklanır — repoda YOK.

### Yeni Müşteri Eklemek İçin
1. `musteri-data/SABLON.txt` kopyala → `musteri-data/yenimüşteri.txt` doldur
2. `src/lib/clients.ts` → `CLIENTS` dizisine obje ekle (şablon dosyada yorum satırında var)
3. `echo "SIFRE" | vercel env add CLIENT_PASSWORD_ENVKEY production`
4. `git add . && git commit -m "feat(musteri): ..." && git push`

### Veri Güncelleme Sistemi
`musteri-data/*.txt` düzenle → Claude'a "güncelle" de → `clients.ts` güncellenir → push.

**Kampanya satır formatı:** `Başlangıç | Bitiş | Kampanya Adı | Günlük Bütçe | Durum`
**Güncelleme/website formatı:** `Tarih: Metin`
**Fatura formatı:** `Dönem | Tutar | Durum | Son Ödeme Tarihi (Bekliyor için)`

---

## 11. PayTR Ödeme (BEKLEMEDE)

**Sorun:** PayTR panelinde `markaizi.com` kayıtlı, bizim domain `markaizi.com.tr`.

**Çözüm adımları:**
1. PayTR panelinde domain → `markaizi.com.tr`
2. Test modunu aktifleştir
3. Vercel: `PAYTR_TEST_MODE=0` (canlıya geçince)
4. `Pricing.tsx` ve `ServicePageTemplate.tsx` butonları → `/odeme/${slug}`
5. Rate limiting → Upstash Redis
6. Callback'te sipariş idempotency

**Hazır altyapı:** `src/lib/paytr.ts` · `packages.ts` · `/api/paytr/` · `/odeme/` sayfaları
**PayTR iletişim:** 0850 811 0 811

---

## 12. Vercel Env Var'ları

| Değişken | Açıklama |
|----------|----------|
| `GMAIL_USER` | markaizicom@gmail.com |
| `GMAIL_APP_PASSWORD` | Gmail uygulama şifresi |
| `PAYTR_MERCHANT_ID` | PayTR mağaza no |
| `PAYTR_MERCHANT_KEY` | PayTR mağaza parola |
| `PAYTR_MERCHANT_SALT` | PayTR gizli anahtar |
| `PAYTR_TEST_MODE` | 1 (canlıya geçince 0) |
| `NEXT_PUBLIC_BASE_URL` | https://markaizi.com.tr |
| `CLIENT_PASSWORD_SAHINAVIZE` | Şahin Avize panel şifresi |
| `CLIENT_PASSWORD_ALANYAPRO` | Alanya Pro Cleaning panel şifresi |

---

## 13. İletişim & Hesaplar

| Platform | Bilgi |
|----------|-------|
| Gmail | markaizicom@gmail.com |
| WhatsApp | 905520772700 |
| Vercel Takım | markaizis-projects |
| GitHub Org | markaizi |
| Google Business | https://share.google/S5wQdPjBKZT7DQ9zu |
| Instagram | instagram.com/markaizicom |
| TikTok | tiktok.com/@markaizicom |

---

## 14. Sık Kullanılan Komutlar

```bash
cd /Users/sametsaglam/Desktop/web-siteler/markaizi

npm run dev                                           # Geliştirme
npx tsc --noEmit                                      # TS kontrol
git add -A && git commit -m "..." && git push         # Deploy
echo "DEGER" | vercel env add ISIM production         # Env var ekle
vercel env rm ISIM production -y                      # Env var sil
vercel env ls                                         # Env var listele
```

---

## 15. Bekleyen İşler

| Öncelik | İş |
|---------|----|
| 🔴 | PayTR: domain güncelle → butonları aç |
| 🟡 | sameAs'e Facebook/LinkedIn/YouTube ekle |
| 🟡 | Müşteri paneli: kampanya metrikleri (ROAS, erişim) |
| 🟡 | Rate limiting → Upstash Redis (PayTR ile birlikte) |
| 🟢 | Blog'a yeni yazılar |
| 🟢 | Portföy → gerçek müşteri logoları |
