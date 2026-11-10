# AGENTS.md — markaizi.com.tr · Yapay Zeka Araçları Devir-Teslim Protokolü

> Bu dosya **tüm yapay zeka araçları** için ortak giriş noktasıdır: Claude Code, ChatGPT Codex,
> Antigravity (Gemini) ve proje üzerinde çalışacak diğer her araç. `CLAUDE.md` ve `GEMINI.md`
> bu dosyaya yönlendirir. Proje sahibi: **Samet Sağlam**. Dil: **Türkçe**.

## 1. Oturuma başlarken — bu sırayla oku

1. [`CHANGELOG.md`](./CHANGELOG.md) → **en üstteki sürüm** = "nerede kaldık / en son ne yapıldı". Önce bunu oku.
2. [`PROJE-DURUM.md`](./PROJE-DURUM.md) → sayfa envanteri, alınmış kararlar, bekleyen işler, deploy/ortam bilgisi.
3. [`CLAUDE.md`](./CLAUDE.md) → teknoloji, tasarım sistemi, dosya yapısı.
4. İşe özel: [`SEO-AI-DENETIM.md`](./SEO-AI-DENETIM.md), [`docs/`](./docs/).

## 2. Sürümleme (Semantic Versioning, `v<MAJOR>.<MINOR>.<PATCH>`)

- **Mevcut taban: v3.0.0** (Samet'in 10 Kasım 2026 kararı: o ana kadarki durum "markaizi v3.0").
- Sürümü **güncellemenin kapsamına göre** yükselt:
  - **MAJOR** (4.0.0): mimari/teknoloji değişimi, veritabanı şemasında geriye uyumsuz değişiklik, tasarım dilinin baştan kurulması.
  - **MINOR** (3.x.0): yeni özellik, yeni sayfa/bölüm, yeni API, toplu bir denetim-düzeltme paketi.
  - **PATCH** (3.x.y): hata düzeltmesi, metin/küçük stil düzeltmesi, bağımlılık güvenlik yaması.
- Güncel sürüm numarası **iki yerde** tutulur ve birlikte güncellenir: `CHANGELOG.md` (en üst başlık) ve `package.json` (`version`).

## 3. Her değişiklikte ZORUNLU adımlar (bitirmeden önce)

1. `CHANGELOG.md` en üstüne yeni sürüm bölümü ekle (şablon aşağıda). Eski sürümleri **silme**.
2. `package.json` → `version` alanını güncelle.
3. `PROJE-DURUM.md` içinde etkilenen bölümü güncelle ("Son güncelleme" tarihi, bekleyenler, değişiklik geçmişi satırı).
4. Doğrula: `./node_modules/.bin/tsc --noEmit` ve `./node_modules/.bin/eslint src/` (hata sayısı artmamalı), mümkünse `npm run build`.
5. Commit mesajı: `v3.1.0: kısa özet` biçiminde. **Push yalnızca Samet isterse** (push = canlıya deploy).
6. Yarım kalan iş varsa `CHANGELOG.md` içindeki ilgili sürümün **"Yarım kalanlar / Sıradaki"** başlığına yaz — bir sonraki araç buradan devam eder.

### CHANGELOG sürüm şablonu

```md
## vX.Y.Z — GG Ay YYYY — Kısa başlık
**Araç:** (Claude Code / Codex / Antigravity / …)  **Tür:** MINOR | PATCH | MAJOR
### Yapılanlar
- Ne değişti + neden (dosya yolları ile)
### Doğrulama
- tsc / eslint / build sonucu
### Dikkat / bilinen kısıtlar
- …
### Yarım kalanlar / Sıradaki
- …
```

## 4. Değişmez kurallar (kırmızı çizgiler)

- **Canlı Neon veritabanında yıkıcı Prisma komutu ASLA çalıştırma:** `migrate dev`, `migrate reset`, `db push --force-reset`.
  (29 Eylül 2026'da bu yüzden canlı veri silindi; point-in-time restore ile kurtarıldı.) Şema değişikliği gerekiyorsa
  migration dosyasını yaz, **Samet'e bildir**, `migrate deploy`'u o çalıştırsın.
- **Ajans fiyatı hiçbir kamuya açık sayfada yer almaz.**
- Sıralamada olan **H1/title değerlerini Samet'le konuşmadan değiştirme** (`title: { absolute }` kullanan sayfalar dahil).
- Sağlık/takviye sayfalarında mevzuat dili korunur: "alternatif tıp", hasta yorumu, kesin sonuç/tedavi vaadi yok.
- Çalışma saatleri tek doğru: **Pazartesi–Cumartesi 09:00–20:00** (Pazar kapalı). Tüm sayfa, JSON-LD ve `llms.txt` bununla tutarlı olmalı.
- Alan adı her yerde **markaizi.com.tr** (`.tr`'siz `markaizi.com` yazılmaz).
- `.env*` dosyalarını okuma/commit etme; sır (secret) yazdırma.

## 5. Teknik ortam notları

- Next.js **16.3** (App Router) — eğitim verindeki Next.js'ten farklı olabilir; gerekirse `node_modules/next/dist/docs/` oku.
- React 19.2, Tailwind v4, Prisma 6 (PostgreSQL/Neon), TypeScript, zod 4.
- Mac terminalinde `node` yoksa: `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"`.
- Proje `~/Desktop` altında ve iCloud Drive eşitlemesinde: iCloud `... 2.ts` gibi çakışma kopyaları üretebilir
  (`.next/types/*` içinde `tsc` hatasına yol açar). Çözüm: `rm -rf .next tsconfig.tsbuildinfo` (git'e dahil değil).
- Panel (`/musteri/**`) kimlik doğrulaması: `src/lib/auth.ts` (`getSession` artık DB'den `active` + parola sürümü doğrular).
- Doğrulama komutları: `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/eslint src/`, `npm run build`.

## 6. Araçlar arası geçişte

- Başka bir araca geçmeden önce: `CHANGELOG.md`'yi güncelle, işi commit et, "Yarım kalanlar" bölümünü doldur.
- Yeni bir araç başladığında: bu dosyayı + `CHANGELOG.md` en üst sürümünü oku, `git log --oneline | head` ve `git status` ile
  durumu doğrula, sonra Samet'in isteğine geç.
