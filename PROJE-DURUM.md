# PROJE DURUM — markaizi.com.tr

Son güncelleme: 7 Haziran 2026

---

## ✅ Tamamlananlar

### Genel Site
- Ana sayfa tüm bölümler (Hero, Services, About, Portfolio, Pricing, Contact, Footer)
- Navbar, WhatsApp balonu, ScrollReveal animasyonları
- SEO: sitemap.xml, robots.txt, JSON-LD structured data
- KVKK, Gizlilik, Çerez, Kullanım Şartları sayfaları
- SSS sayfası, Blog sayfası (6 makale)

### Fiyatlandırma
- Ana sayfa Pricing: Başlangıç 20k / Büyüme 30k / Kurumsal 40k / Elite 60k
- Öne çıkan özellikler mor border ile highlight
- Bütçe notu (100k TL üzeri)
- `/fiyatlar` sayfası: tekil hizmet fiyat listesi (4 kategori)
- Hizmet sayfalarında `pricingNote` uyarısı

### Hizmet Sayfaları
- `/hizmetler/sosyal-medya-yonetimi` — 20/30/40/60k
- `/hizmetler/meta-reklamlari` — 15k / 25k
- `/hizmetler/google-reklamlari` — 15k / 25k
- `/hizmetler/tiktok-reklamlari` — 10k
- `/hizmetler/yapay-zeka-otomasyon`
- `/hizmetler/web-tasarim-hosting` + `/teklif` formu

### İK / CV Sayfası
- `/cv` — Sadece logo + form
- Sosyal medya tecrübesi toggle alanı
- Meta/Google reklam tecrübesi textarea
- Medeni durum + ücret beklentisi alanları
- "Yok" deneyimi espri popup
- API: `/api/cv` → Gmail SMTP ile mail

### Müşteri Paneli
- `/musteri/[slug]` — Auth (sessionStorage), kampanya listesi, güncellemeler
- `/musteri/admin` — Tüm müşterileri görebilen admin paneli
- Müşteriler: sahinavize, alanyapro, fitrina, retrocar, ozcalik

### PayTR Ödeme Sistemi (KOD HAZIR — AKTİF DEĞİL)
- `/odeme/[paket]` — Checkout sayfası
- `/odeme/basarili` ve `/odeme/iptal` sayfaları
- `src/lib/paytr.ts` — Token hesaplama + callback doğrulama
- `src/lib/packages.ts` — Paket tanımları (fiyatlar Pricing.tsx ile senkron)
- `/api/paytr/token` — PayTR iFrame token alma
- `/api/paytr/callback` — Ödeme sonucu webhook
- `CheckoutForm.tsx` — iFrame form componenti
- `.env.local` ve Vercel'de credentials kayıtlı

---

## ⏳ Bekleyen / Yarım Kalanlar

### PayTR Entegrasyonu
**Durum:** Kod %100 hazır, credentials kaydedildi. Ancak test edilemiyor.
**Sorun:** PayTR hesabında **iFrame Ödeme** entegrasyonu aktif değil.
**Yapılacak:**
1. PayTR paneli → Entegrasyonlar → iFrame Ödeme'yi aktif et
2. `markaizi.com.tr` domainini PayTR panelinde kaydet (zaten yapıldı)
3. `PAYTR_TEST_MODE=1` ile test et (test kartı: 4355 0843 5508 4358, CVV: 000)
4. Test başarılı olunca `PAYTR_TEST_MODE=0` yaparak canlıya al (Vercel env güncelle)
5. Pricing sayfasındaki "Satın Al" butonlarını `/odeme/[slug]` linklerine bağla

**Credentials (.env.local + Vercel'de kayıtlı):**
- PAYTR_MERCHANT_ID: 674958
- PAYTR_TEST_MODE: 1 (şu an test modu)
- NEXT_PUBLIC_BASE_URL: https://markaizi.com.tr

---

## 📁 Önemli Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/lib/clients.ts` | Müşteri paneli verileri (GERÇEK KAYNAK) |
| `musteri-data/*.txt` | Müşteri verileri referans kopyaları |
| `musteri-data/fiyatlar.txt` | Tekil hizmet fiyat listesi (düzenle → Claude'a söyle) |
| `src/lib/packages.ts` | PayTR paket tanımları (Pricing.tsx ile senkron tutulmalı) |
| `src/lib/paytr.ts` | PayTR token + callback logic |
| `.env.local` | Tüm API credentials (git'e commit edilmez) |

---

## 🚀 Deploy

- `git push origin main` → Vercel otomatik deploy
- Manuel: `vercel --prod`
- Canlı URL: https://markaizi.com.tr
