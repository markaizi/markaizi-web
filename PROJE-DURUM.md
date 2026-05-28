# markaizi.com.tr — Proje Durum & Yol Haritası

> **Bu dosya nedir?**
> Projede neler yaptık, neler devam ediyor, neler bekliyor — hepsinin kalıcı kaydı.
> Hem Samet'in hem de yapay zeka asistanlarının (Claude vb.) okuyup güncellediği tek doğru kaynak.
>
> **Yapay zeka asistanına not:** Yeni bir oturuma başladığında ÖNCE bu dosyayı oku.
> Samet "not al / güncelle / kaydet" dediğinde ilgili bölümü güncelle ve commit et.
> Tarih formatı: YYYY-AA-GG. Yeni kayıtları en üste ekle.

**Son güncelleme:** 2026-05-28

---

## 📌 Proje Özeti

- **Site:** markaizi.com.tr — dijital reklam ajansı kurumsal sitesi
- **Teknoloji:** Next.js 16 (App Router), TypeScript, Tailwind, Vercel
- **Repo:** github.com/markaizi/markaizi-web (main branch → otomatik Vercel deploy)
- **E-posta:** Nodemailer + Gmail SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`)
- **Tasarım:** Koyu tema (siyah zemin + mor/neon gradient). Açık mod şimdilik YOK (bilinçli karar).

---

## 🔴 BEKLEYEN İŞLER (yapılacak)

### PayTR Ödeme Entegrasyonu — DURDURULDU, sonra devam
Kod yazıldı ama canlıya alınmadı. "paytr_token gecersiz" hatası alınıyordu.
Satın al butonları geçici olarak `#iletisim`'e yönlendiriliyor.

**Samet'in PayTR paneli tarafında yapacakları:**
1. **Domain kaydı** — PayTR panelinde `markaizi.com.tr` ekli olmalı (token hatasının en olası sebebi). PayTR `markaizi.com` ile karışıklık olabilir, `.com.tr` doğru.
2. PayTR'dan **iFrame API erişiminin açık** olduğunu teyit et.

**Kod tarafında, ödemeye dönünce yapılacaklar:**
3. **Satın al butonlarını geri aç** — şu an `#iletisim`'e gidiyor:
   - `src/components/sections/Pricing.tsx` → `href="#iletisim"` yerine `href={`/odeme/${plan.slug}`}`, metin "Başla" → "Satın Al"
   - `src/components/ServicePageTemplate.tsx` → `pkg.paymentSlug` mantığını geri ekle
4. **`PAYTR_TEST_MODE` → `0`** yap (Vercel env var, canlıya geçince).
5. **Kalıcı rate limiting** — `src/lib/security.ts`'teki bellek-içi limiter Vercel'de örnek başına çalışır (best-effort). Gerçek ödeme trafiği için **Upstash Redis** tabanlı çözüme geç.
6. **Sipariş takibi + idempotency** — `src/app/api/paytr/callback/route.ts` şu an hash doğruluyor ama:
   - `total_amount`'ı beklenen tutarla karşılaştırmıyor
   - çift bildirim (idempotency) kontrolü yok
   - Çözüm: basit bir DB/sipariş kaydı (sipariş oluşturulurken kaydet, callback'te eşleştir).

**PayTR bilgileri (env'de kayıtlı):** Merchant ID 674958 — key/salt Vercel env var'da.

---

## ✅ YAPILANLAR (changelog — en yeni üstte)

### 2026-05-28
- **Güvenlik sertleştirmesi** (commit `d8360f5`):
  - `src/lib/security.ts` eklendi: `escapeHtml`, `isValidEmail`, `cleanStr`, `cleanPhone`, `rateLimit`, `getClientIp`
  - `contact` ve `web-teklif` e-posta şablonlarında tüm kullanıcı girdisi HTML-escape ediliyor (HTML enjeksiyonu kapatıldı)
  - 3 API route'a sunucu tarafı doğrulama: e-posta formatı + uzunluk limitleri
  - Per-IP rate limiting: formlar 5/dk, PayTR token 8/dk → aşılırsa 429
- **Satın al butonları geçici olarak `#iletisim`'e yönlendirildi** (PayTR hazır olana dek) — commit `a2312d7`
- **PayTR basket fiyatı TL ondalık formatına çevrildi** (kuruş yerine) — commit `4821fd0`
- **PayTR iframe ödeme altyapısı yazıldı** (token, callback, checkout, başarılı/iptal sayfaları)

### Daha önce (tarih net değil)
- Web tasarım teklif formu ayrı sayfaya taşındı (`/hizmetler/web-tasarim-hosting/teklif`)
- Lokal SEO optimizasyonu (Ankara/Siteler keywords, FAQPage schema, geo koordinat)
- Blog altyapısı + 6 gerçek yazı, sitemap, robots.txt, JSON-LD
- Resend → Nodemailer+Gmail SMTP geçişi
- İçerik revizyonları (10+ yıl deneyim, Yapay Zeka & Otomasyon hizmeti)

---

## 💡 FİKİRLER / İLERİDE DÜŞÜNÜLEBİLİR

- **Açık mod (light theme):** Şimdilik eklenmedi. CSS variables hazır olduğu için ileride kolay eklenir (navbar toggle + localStorage + prefers-color-scheme).

---

## 🔑 ÖNEMLİ NOTLAR

- Tüm gizli anahtarlar Vercel env var'da: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `PAYTR_MERCHANT_ID/KEY/SALT`, `PAYTR_TEST_MODE`, `NEXT_PUBLIC_BASE_URL`
- Deploy: `main`'e push → Vercel otomatik build. Eşzamanlı CLI + push çift deploy tetikleyebilir, sadece push kullan.
- `git config` user.name/email ayarlı değil (commit'lerde uyarı çıkıyor, sorun değil).
