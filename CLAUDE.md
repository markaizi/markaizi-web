# markaizi.com — Next.js Web Sitesi

> ⚠️ **ÖNCE OKU:** Projenin güncel durumu, bekleyen işler ve geçmiş değişiklikler
> [`PROJE-DURUM.md`](./PROJE-DURUM.md) dosyasındadır. Yeni oturuma başlarken o dosyayı oku.
> Samet "not al / güncelle" dediğinde ilgili bölümü güncelleyip commit et.

## Proje Nedir?
markaizi.com için dijital reklam ajansı web sitesi.
Hizmetler: sosyal medya yönetimi, Instagram/Facebook/TikTok/Google reklamları, içerik üretimi, web tasarım, domain & hosting.

## Teknoloji
- **Framework:** Next.js 16 (App Router)
- **Stil:** Tailwind CSS v4 + özel CSS değişkenleri (`globals.css`)
- **Dil:** TypeScript
- **Deploy:** Vercel — https://markaizi-web.vercel.app
- **Kaynak:** GitHub — https://github.com/markaizi/markaizi-web

## Dosya Yapısı
```
src/
├── app/
│   ├── layout.tsx          → Root layout, Inter font, metadata
│   ├── page.tsx            → Ana sayfa (tüm bölümleri birleştirir)
│   └── globals.css         → CSS değişkenleri, animasyonlar, yardımcı sınıflar
└── components/
    ├── Navbar.tsx           → Sabit navbar, scroll blur, hamburger menü ("use client")
    ├── WhatsApp.tsx         → Sağ alt köşe WhatsApp balonu ("use client")
    ├── ScrollReveal.tsx     → IntersectionObserver ile fade-in ("use client")
    └── sections/
        ├── Hero.tsx         → Hero bölümü, animasyonlu ikonlar ("use client")
        ├── Services.tsx     → 6 hizmet kartı ("use client")
        ├── About.tsx        → Sayaç animasyonu, gradient kart ("use client")
        ├── Portfolio.tsx    → Marka logo grid'i ("use client")
        ├── Pricing.tsx      → 3 fiyat paketi ("use client")
        ├── Contact.tsx      → İletişim formu + panel ("use client")
        └── Footer.tsx       → Footer (server component)
```

## Tasarım Sistemi (globals.css)
```
--bg: #050505 | --bg-alt: #0a0a0f | --surface: #0f0f14
--grad: linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)
--glow: 0 0 30px rgba(168,85,247,0.35)
Font: Inter (Google Fonts)
```

## Deploy Akışı
- `git push origin main` → Vercel otomatik deploy eder (GitHub bağlı)
- Manuel: `vercel --prod`

## Önemli Notlar
- Hero animasyonlu ikonlar yalnızca `lg:` breakpoint'te görünür (hidden → block)
- `.pricing-featured-amount` CSS sınıfı gradient üstünde beyaz renk override'ı içerir
- "use client" direktifi: event handler veya React hook kullanan tüm componentlerde zorunlu
- Vercel takımı: markaizis-projects
