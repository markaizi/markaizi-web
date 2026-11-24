# markaizi.com.tr — Next.js Web Sitesi

> ⚠️ **ÖNCE OKU:** Birden çok yapay zeka aracı (Claude Code, Codex, Antigravity) bu projede çalışır.
> Ortak devir-teslim protokolü: [`AGENTS.md`](./AGENTS.md) · Son durum/sürüm: [`CHANGELOG.md`](./CHANGELOG.md) (en üst sürüm) ·
> Projenin durumu, kararlar ve bekleyenler: [`PROJE-DURUM.md`](./PROJE-DURUM.md). Yeni oturuma başlarken bu üçünü oku.
> Her değişiklikte `CHANGELOG.md` + `package.json` sürümünü güncelle (sürüm kuralları `AGENTS.md` §2–§3).
> Samet "not al / güncelle" dediğinde ilgili bölümü güncelleyip commit et.

## Proje Nedir?
markaizi.com.tr — Ankara Siteler merkezli dijital reklam ajansının web sitesi + müşteri/ajans paneli (`/musteri/**`).
Hizmetler: sosyal medya yönetimi, Meta/Google/TikTok reklamları, dönüşüm takibi, yapay zekâ arama görünürlüğü, web tasarım,
danışmanlık/eğitim, video/drone. Sektör sayfaları: mobilya (ana uzmanlık), kafe-restoran (Ankara ilçeleri), sağlık, takviye,
güzellik, e-ticaret, GETAT. Ayrıntılı sayfa envanteri ve kararlar: `PROJE-DURUM.md`.

## Teknoloji
- **Framework:** Next.js 16.4 (App Router), React 19.2, TypeScript
- **Stil:** Tailwind CSS v4 + özel CSS değişkenleri (`src/app/globals.css`)
- **Veri:** Prisma 6 + Neon Postgres (yalnızca panel ve form kayıtları; kamuya açık sayfalar statik)
- **Deploy:** Vercel — canlı alan adı https://markaizi.com.tr (`git push origin main` → otomatik deploy)
- **CI:** `.github/workflows/ci.yml` (tsc + eslint + build)
- **Kaynak:** GitHub `markaizi/markaizi-web` (**herkese açık** — müşteri/finans verisi commit edilmez, bkz. AGENTS.md §4)

## Dosya Yapısı (özet)
```
src/
├── app/                     → sayfalar (kamuya açık sayfalar, /musteri paneli, /api uçları)
│   ├── layout.tsx           → kök layout, fontlar, WebSite şeması, Analytics + CookieBanner
│   ├── page.tsx             → ana sayfa + ProfessionalService şeması
│   ├── sitemap.ts, robots.ts, llms.txt/, feed.xml/  → tarama ve yapay zekâ dosyaları (veriden üretilir)
│   └── api/                 → form uçları (contact, ucretsiz-analiz, web-teklif, cv), panel, PayTR, agent
├── components/              → Navbar, Footer, şablonlar (ServicePageTemplate, MobilyaLanding, LegalPageTemplate),
│                              FormExtras (honeypot + KVKK notu), Analytics, CookieBanner, panel bileşenleri
└── lib/                     → içerik verisi (blog-data, mobilya-pages, kafe-pages, sektor-pages, video-data),
                               seo.ts, security.ts, track.ts (dönüşüm olayları), auth/session, prisma
```

## Tasarım Sistemi (globals.css)
```
--bg: #050505 | --bg-alt: #0a0a0f | --surface: #0f0f14
--grad: linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)
--glow: 0 0 30px rgba(168,85,247,0.35)
Font: Inter (gövde) + Space Grotesk 700 (başlıklar), latin + latin-ext
```

## Önemli Notlar
- Hero görseli yalnızca `lg:` breakpoint'te görünür.
- İç bağlantılar `next/link` ile (ESLint `no-html-link-for-pages` hata verir); harici/tel/mailto/wa.me için `<a>`.
- Yeni form eklenirse: `<Honeypot />` + `botFields(form)` + `<KvkkNotu />` (FormExtras) ve sunucuda `isLikelyBot`;
  başarıda `track("generate_lead", …)`.
- "use client" direktifi: event handler veya React hook kullanan tüm componentlerde zorunlu.
- Vercel takımı: markaizis-projects

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
