# markaizi.com.tr — Proje Durum Dosyası

> Bu dosya Claude Code ile yapılan her oturumda güncellenir.
> Yeni bir oturuma başlarken Claude'a bu dosyayı oku dedikten sonra çalışmaya devam edebilirsin.
> Son güncelleme: Mayıs 2026

---

## 🌐 Proje Özeti

**Site:** https://markaizi.com.tr  
**Repo:** https://github.com/markaizi/markaizi-web (public)  
**Deploy:** Vercel — GitHub push → otomatik deploy  
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Nodemailer (Gmail SMTP)  
**Vercel Takımı:** markaizis-projects  

---

## ✅ Tamamlanan Çalışmalar

### Site Temeli
- Next.js projesi kurulumu, Vercel deploy bağlantısı
- Koyu tema tasarım sistemi (CSS variables, mor/neon gradient)
- Tüm ana bölümler: Hero, Hizmetler, Hakkımızda, Portföy, Fiyatlar, İletişim, Footer
- WhatsApp balonu (sağ alt, pulse animasyonlu)
- Cookie banner (GDPR uyumlu, localStorage)
- Mobil hamburger menü + belirgin ✕ Kapat butonu
- Scroll reveal animasyonları

### Hizmet Sayfaları (6 adet)
- `/hizmetler/sosyal-medya-yonetimi`
- `/hizmetler/meta-reklamlari`
- `/hizmetler/google-reklamlari`
- `/hizmetler/tiktok-reklamlari`
- `/hizmetler/web-tasarim-hosting` (+ `/teklif` alt sayfası)
- `/hizmetler/yapay-zeka-otomasyon`
- Her hizmet sayfasında 3-4 adet SSS + FAQPage JSON-LD (AI/SEO)
- `/hizmetler/icerik-uretimi` → sosyal-medya-yonetimi'ne yönlendiriyor

### SEO & AI Keşfedilebilirlik
- Lighthouse skorları: Erişilebilirlik 100, SEO 100, Best Practices 100, Agentic 100
- JSON-LD: ProfessionalService + adres + geo + areaServed (8 Ankara ilçesi) + hizmet kataloğu
- FAQPage schema her hizmet sayfasında
- sitemap.xml (25 sayfa), robots.txt
- `public/llms.txt` (LLM'ler için site özeti — llmstxt.org standardı)
- Google Business Profile `sameAs`'e eklendi: https://share.google/S5wQdPjBKZT7DQ9zu
- `/sss` sayfası ana menüden kaldırıldı (sayfa duruyor, footer'da linki var)

### Güvenlik
- `src/lib/security.ts`: escapeHtml, isValidEmail, cleanStr, cleanPhone, rateLimit, getClientIp
- Tüm form API'leri: HTML injection koruması, input doğrulama, uzunluk limitleri
- Rate limiting: iletişim/teklif 5 istek/dk, PayTR token 8 istek/dk (bellek tabanlı — best-effort)
- Form label/id bağları düzeltildi (a11y)
- Başlık hiyerarşisi düzeltildi (h3, h4 → doğru seviyeler)

### Blog
- `/blog` — kart grid, koyu tema, kategori/okuma süresi gösterimi
- `/blog/[slug]` — makale sayfası, ilgili yazılar
- `src/lib/blog-data.ts` — 6 makale (Sosyal Medya, Google Ads, Meta, TikTok, İçerik, Web)

### Fiyatlandırma
- Ana sayfadaki fiyat bölümü: "Aylık Sosyal Medya Yönetim Paketleri"
- 4 paket güncellendi (Reels adedi, çekim günü, raporlama sıklığı):
  - Başlangıç: 19.900 ₺/ay
  - Büyüme: 29.900 ₺/ay (EN POPÜLER)
  - Kurumsal: 39.900 ₺/ay
  - Elite: 54.900 ₺/ay
- Butonlar şu an `#iletisim`'e yönlendiriyor (PayTR hazır olunca değişecek)

### Favicon
- `src/app/icon.svg` — markaizi logosu, kare viewBox, beyaz fill
- Next.js App Router otomatik favicon olarak kullanıyor

### Müşteri Paneli (`/musteri/[slug]`)
- Şifreli, Google'dan gizli (noindex + robots.txt)
- 7 tab: Meta Ads · Google Ads · TikTok Ads · Website · Ajans Güncellemeleri · İçerik Takvimi · Fatura Bilgisi
- Mobil öncelikli: tab'lar yatay kaydırmalı pill, kampanyalar ve faturalar kart görünümü
- Şifre doğrulama: `POST /api/musteri/verify` → Vercel env var `CLIENT_PASSWORD_{ENVKEY}`
- Oturum: sessionStorage (sekme kapanınca sıfırlanır)
- Veri dosyaları: `musteri-data/` klasöründe TXT formatında

**Mevcut müşteriler:**
| Müşteri | URL | Env Var |
|---------|-----|---------|
| Şahin Avize | /musteri/sahinavize | CLIENT_PASSWORD_SAHINAVIZE ✅ |

**Yeni müşteri eklemek için:**
1. `musteri-data/SABLON.txt` kopyala → `musteri-data/yenimüşteri.txt` doldur
2. `src/lib/clients.ts` dizisine obje ekle
3. `vercel env add CLIENT_PASSWORD_ENVKEY production` komutuyla şifre ekle
4. Push et

---

## ⏸️ Bekleyen / Yarım Kalan İşler

### 🔴 PayTR Ödeme Entegrasyonu (beklemede — PayTR panel sorunu)
**Sorun:** "paytr_token gonderilmedi veya gecersiz" hatası  
**Muhtemel sebep:** PayTR panelinde `markaizi.com` kaydedilmiş, bizim domain `markaizi.com.tr`  
**Yapılacak:** PayTR panel'inde domain güncelleme + test modu aktifleştirme  
**İletişim:** 0850 811 0 811 veya PayTR panel chat  

**PayTR hazır olduğunda yapılacaklar:**
1. `PAYTR_TEST_MODE=0` yap (Vercel env var)
2. `src/components/sections/Pricing.tsx` → butonları `#iletisim` yerine `/odeme/${slug}`'a çevir
3. `src/components/ServicePageTemplate.tsx` → PricingCard href'ini `/odeme/${pkg.paymentSlug}`'a çevir
4. Rate limiting → Upstash Redis'e geç (bellek tabanlı şu an)
5. Sipariş takibi/idempotency → callback'te tutar doğrulama ekle (DB gerekecek)

**Mevcut PayTR dosyaları:**
- `src/lib/paytr.ts` — token üretimi (HMAC-SHA256), callback doğrulama
- `src/lib/packages.ts` — 7 paket tanımı (fiyat TL + kuruş)
- `src/app/api/paytr/token/route.ts` — token endpoint
- `src/app/api/paytr/callback/route.ts` — ödeme bildirimi
- `src/app/odeme/[paket]/page.tsx` — checkout sayfası
- `src/components/CheckoutForm.tsx` — form → iframe akışı
- `src/app/odeme/basarili/page.tsx` ve `iptal/page.tsx`

**Vercel env var'lar (hepsi production'da mevcut):**
- PAYTR_MERCHANT_ID=674958
- PAYTR_MERCHANT_KEY=1d9rg7K6sFxPPgsi
- PAYTR_MERCHANT_SALT=bf4d2NQYc38kPyqT
- PAYTR_TEST_MODE=1 (canlıya geçince 0 yap)
- NEXT_PUBLIC_BASE_URL=https://markaizi.com.tr

### 🟡 Müşteri Paneli — Gelecek İyileştirmeler
- Rate limiting → Upstash Redis (şu an bellek tabanlı, Vercel'de her örnek ayrı)
- Şifre değiştirme özelliği (şu an sadece Vercel env var'dan)

### 🟡 Blog İçeriği
- Mevcut 6 makale statik (kod içinde `blog-data.ts`)
- İleride YouTube video embed, Instagram, TikTok içerik türleri planlandı (altyapı hazır, geri alındı)
- Kullanıcı isteği: "Fazla yazı eklemeyeceğim, basit kart grid yeterli"

### 🟡 sameAs Genişletme
- Şu an: Instagram + TikTok + Google Business
- Eklenebilir (gerçek URL açılınca): Facebook, LinkedIn, YouTube

### 🟡 Müşteri Paneli Genişleme
- Copilot.com veya özel panel için görüşüldü, şimdilik basit TXT sistemi yeterli
- İleride düşünülecek: kampanya metrikleri (erişim, tıklama, ROAS), otomatik rapor

---

## 📁 Önemli Dosya Yapısı

```
src/
├── app/
│   ├── page.tsx                    ← Ana sayfa (JSON-LD burada)
│   ├── layout.tsx                  ← Metadata, font, Analytics
│   ├── icon.svg                    ← Favicon
│   ├── robots.ts                   ← /api/ ve /musteri/ gizli
│   ├── sitemap.ts
│   ├── api/
│   │   ├── contact/route.ts        ← İletişim formu (Gmail SMTP)
│   │   ├── web-teklif/route.ts     ← Web teklif formu
│   │   ├── musteri/verify/route.ts ← Panel şifre doğrulama
│   │   └── paytr/
│   │       ├── token/route.ts
│   │       └── callback/route.ts
│   ├── blog/
│   ├── hizmetler/[6 sayfa]/
│   ├── musteri/[slug]/             ← Şifreli müşteri paneli
│   ├── odeme/[paket]/              ← PayTR checkout (buton kapalı)
│   └── sss/                       ← SSS sayfası (menüde yok, URL çalışıyor)
├── components/
│   ├── Navbar.tsx                  ← Hamburger + ✕ Kapat
│   ├── ClientPortal.tsx            ← 7 tab, mobil kart düzeni
│   ├── ServicePageTemplate.tsx     ← Hizmet sayfası şablonu + FAQ
│   ├── ServiceFAQ.tsx              ← Accordion SSS bileşeni
│   ├── CheckoutForm.tsx            ← PayTR iframe (pasif)
│   └── sections/
│       ├── Pricing.tsx             ← Fiyat kartları (buton → #iletisim)
│       └── Contact.tsx             ← İletişim formu
└── lib/
    ├── clients.ts                  ← Müşteri paneli veri yapısı
    ├── packages.ts                 ← PayTR paket tanımları
    ├── paytr.ts                    ← PayTR entegrasyon mantığı
    ├── security.ts                 ← escapeHtml, rateLimit, vb.
    └── blog-data.ts                ← Blog yazıları

musteri-data/                       ← TXT güncelleme sistemi
├── SABLON.txt                      ← Yeni müşteri şablonu
└── sahinavize.txt                  ← Şahin Avize verisi
public/
└── llms.txt                        ← AI keşfedilebilirlik özeti
```

---

## 🔧 Sık Kullanılan Komutlar

```bash
# Geliştirme
cd /Users/sametsaglam/Desktop/markaizi-web
npm run dev

# Deploy (GitHub push otomatik tetikler)
git add -A && git commit -m "..." && git push

# Vercel env var ekle
echo "DEGER" | vercel env add ISIM production

# Vercel env var listele
vercel env ls

# Build kontrol
npx tsc --noEmit && npm run build
```

---

## 📞 İletişim & Hesaplar

- **Gmail SMTP:** markaizicom@gmail.com (GMAIL_USER + GMAIL_APP_PASSWORD Vercel'de)
- **WhatsApp:** 905520772700
- **Vercel Takım:** markaizis-projects
- **GitHub Org:** markaizi
- **PayTR Merchant ID:** 674958
- **Google Business:** https://share.google/S5wQdPjBKZT7DQ9zu
