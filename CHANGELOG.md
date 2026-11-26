# CHANGELOG — markaizi.com.tr

> **Bu dosya araçlar arası devir-teslim defteridir.** En üstteki sürüm = en son durum.
> Kurallar ve şablon: [`AGENTS.md`](./AGENTS.md). Eski sürümler silinmez.
> Güncel sürüm: **v3.18.0** (`package.json` ile aynı olmalı).

---

> **Gizlilik notu (v3.10.0):** Bu repo herkese açıktır. Müşteri ücretleri, tahsilat tutarları, kişisel finans ve kişi adları
> bu dosyaya **yazılmaz**. Rakamlı / isimli ayrıntılar yerelde, git'e girmeyen `docs/ozel/` klasöründe tutulur
> (ör. `docs/ozel/CHANGELOG-OZEL-2026-11-23.md`); tek seferlik veri scriptleri `scripts/ozel/` altındadır.

## v3.18.0 — 26 Kasım 2026 — Finans: altın (gram) cinsinden borç + otomatik düşme kuralı
**Araç:** Claude Code (Fable 5.2)  **Tür:** MINOR
### Yapılanlar
- **Şema (yalnızca ekleme):** `GoldDebt` + `GoldDebtPayment` — migration `prisma/migrations/20261126180000_gold_debt`
  (iki yeni tablo; mevcut tablolara dokunmaz; **uygulandı: 26 Kasım 2026**). Borç gram olarak tutulur; her ödeme gram olarak düşer, TL ile ödendiyse
  tutar ve o günkü gram fiyatı da saklanır (gram = TL ÷ fiyat, 0,01 gr).
- **Servis** (`src/lib/gold.ts`, saf hesaplar `src/lib/goldCalc.ts`): borç oluştur / düzenle / çöp kutusu; ödeme üç biçimde
  (doğrudan gram · TL + gram fiyatı · yalnızca TL → güncel kur `fetchGramGoldPrice` ile dış servisten). Ortak hata sınıfı ve
  tutar ayrıştırıcı `src/lib/agendaShared.ts`'e taşındı (agenda.ts ↔ gold.ts döngüsel içe aktarma olmasın diye).
- **Otomatik kural:** borçta `autoMatch` + `autoShare` tanımlıysa, başlığı eşleşen kasa gideri ÖDENDİ olunca
  (`createKasaEntry` / `updateKasaEntry` → `applyGoldAutoRules`) tutarın payı güncel kurla grama çevrilip düşülür.
  Kur alınamazsa ödeme **"kur bekliyor"** olarak yine yazılır (borçtan düşmez, Finans'ta uyarı çıkar, kur girilince hesaplanır).
  Aynı gider iki kez düşülmez (`sourceEntryId` tekil); gider "ödenmedi"ye döner ya da silinirse otomatik ödeme de geri alınır.
  Kural hata fırlatmaz — asıl ödeme etkilenmez; her sonuç işlem kaydına düşer.
- **Finans ekranı** (`src/components/KasaView.tsx`): Güncel Borçlarım'da "Altın borçları" bölümü (kalan gram, ≈ TL karşılığı);
  detayda başlangıç / ödenen / kalan, kural açıklaması ve **tarih tarih ödeme defteri** (her satırda o ödemeden sonra kalan gram);
  ödeme formu ("Güncel kuru getir", canlı gram önizlemesi), borç formu, kur bekleyen ödeme uyarısı. Altın borcu TL borç
  toplamına **dahil edilmez**; kutuda "+ N gr altın" olarak görünür. Çöp kutusuna altın borcu / ödemesi eklendi.
- **API:** `…/ajanda/gold-debts`, `…/ajanda/gold-payments` (POST / PATCH / DELETE, işlem kaydıyla), `GET /api/musteri/admin/altin-kuru`.
- **Asistan** (`src/lib/agent.ts`, `bot/CLAUDE.md`): `altin_borc` (tam defter), `altin_kuru`, `altin_odeme`, `altin_odeme_guncelle`,
  `sil` → `tur:"altin_odeme"`; `finans` ve `ozet`te `altinBorclari`; `odeme_yapildi` yanıtında `altinBorcundanDusulen`.
### Doğrulama
- `tsc --noEmit` temiz, `eslint src/` 0 hata (26 uyarı, değişmedi), `next build` derlendi. Migration SQL'i `prisma migrate diff`
  çıktısıyla birebir aynı. Hesaplar (kalan, ara kalanlar, kur bekleyen, sayı ayrıştırma, başlık eşleşmesi) ve canlı kur servisi sınandı.
- Finans ekranı tarayıcıda denenmedi (giriş gerekiyor). Otomatik kuralın yazan kısmı ilk gerçek ödemede çalışacak; eşleştirme
  kısmı (`matchGoldRule`) gerçek veride yazmadan sınandı.
### Dikkat / bilinen kısıtlar
- **Sıra zorunlu:** `migrate deploy` → veri betiği → push. Migration uygulanmadan bu sürüm canlıya çıkarsa Finans sayfası,
  çöp kutusu ve bot `finans` / `ozet` hata verir.
- Kur dış servise bağlıdır (`finans.truncgil.com`, gram altın **satış**); banka / kuyumcu fiyatından farklı olabilir. Her ödemede
  kullanılan kur kayıtlıdır ve ödeme düzenlenerek değiştirilebilir. 500–1.000.000 ₺ dışındaki değer reddedilir.
- TL karşılığı gösterimi son kayıtlı ödeme kurunu kullanır (canlı kur değil) ve "≈" ile işaretlidir.
- Silinen bir gider çöp kutusundan geri alınırsa otomatik altın ödemesi kendiliğinden yeniden açılmaz (elle eklenir).
### Yarım kalanlar / Sıradaki
- ✅ 26 Kas: migration canlı veritabanına uygulandı (Samet); borç kaydı ve geçmiş ödemeler yazıldı, gerçek veride doğrulandı
  (defter ve ara kalanlar, bekleyen taksit için yazmadan prova, çift düşme koruması, asistanın `finans` / `altin_borc` / `ozet` çıktıları).
- Kalan: push (Samet'in onayıyla) → deploy sonrası v3.16.0'ın ilk yatırım kaydı → bot yönergesini VPS'e gönder.

## v3.17.0 — 26 Kasım 2026 — Finans: kart / ek hesap limitleri, kart ekleme, asistanda yatırım + kart yönetimi
**Araç:** Claude Code (Fable 5.2)  **Tür:** MINOR
### Yapılanlar
- **Şema (yalnızca ekleme):** `KasaEntry.creditLimit Decimal?` — migration `prisma/migrations/20261126120000_kasa_credit_limit`
  (tek, boş bırakılabilir sütun; mevcut veriye dokunmaz, eski kodla uyumlu). **Uygulandı: 26 Kasım 2026.**
- **Hesap** (`src/lib/kasaCalc.ts`): `cardLimit()` → limit / kullanılan / kalan / doluluk %; `computeKasa` → `limitTotal`,
  `limitUsed`, `limitAvailable`, `limitCardCount` (yalnızca limiti tanımlı kartlar toplanır; kalan eksiye düşerse kırpılmaz).
- **Servis** (`src/lib/agenda.ts`): `createDebtCard` (borcu 0 olabilen, limitli kart / ek hesap; aynı adda ikinci kart açılmaz),
  `setCardLimit` (0 / boş = limiti kaldır). Panel API: `POST …/ajanda/cards`, `PATCH …/ajanda/kasa/{id}` `{action:"limit"}` —
  ikisi de işlem kaydına düşer (`src/lib/agendaApi.ts`).
- **Finans ekranı** (`src/components/KasaView.tsx`): Genel Durum'da Yatırım'ın yanına **Kalan Limit** kutusu; Güncel Borçlarım'da
  toplam / kalan limit, her kartta limit çubuğu (yeşil, %90 üstü turuncu, aşımda kırmızı); kart detayında "Limit" düğmesi;
  "+ Kart / hesap ekle" formu.
- **Asistan** (`src/lib/agent.ts`, `bot/CLAUDE.md`): yeni yazma işlemleri `kart_ekle`, `kart_limit`, `yatirim_ekle`,
  `yatirim_guncelle` (silme: mevcut `sil`); `finans` çıktısında kart başına `limit` / `kalanLimit` / `dolulukYuzde`,
  `toplamLimit`, `kalanLimit`, `yatirimlar` listesi; `ozet`te `yatirim` ve `kalanKartLimiti`. `kasa_ekle` yatırım / kart
  kategorilerini doğru işleme yönlendirir. Bot yönergesi: yatırımda "kasadan mı?" sorusu, kasadan düşen yatırım onaylı.
- Veri (rakamlar git dışı, `scripts/ozel/`): yeni kart / ek hesap kayıtları eklendi; limitler ve ilk yatırım kaydı için betik hazır.
### Doğrulama
- `tsc --noEmit` temiz, `eslint src/` 0 hata (26 uyarı, değişmedi), `next build` başarılı. `computeKasa` limit ve yatırım
  hesapları örnek veriyle sınandı (limitsiz kart toplamı bozmuyor, aşım eksi kalan veriyor).
- Finans ekranı tarayıcıda denenmedi (giriş gerekiyor); servis katmanı ve bot çıktısı migration sonrası gerçek veride doğrulandı.
### Dikkat / bilinen kısıtlar
- **Sıra zorunlu:** (1) `migrate deploy` → (2) limitleri yaz → (3) push / deploy → (4) ilk yatırım kaydı. Migration uygulanmadan
  bu sürüm canlıya çıkarsa `KasaEntry` okuyan her sayfa (Finans, çöp kutusu, firma ödemeleri, bot) hata verir.
- VPS'teki bot kendi `CLAUDE.md` kopyasını kullanır; yeni komutları öğrenmesi için `bot/CLAUDE.md` oraya kopyalanıp
  `mkzbot` yeniden başlatılmalı (`bot/KURULUM.md`).
- `package-lock.json` içindeki sürüm alanı eskiden beri güncellenmiyor (3.14.0) — dokunulmadı.
### Yarım kalanlar / Sıradaki
- ✅ 26 Kas: migration canlı veritabanına uygulandı (Samet), limitler yazıldı ve gerçek veride doğrulandı (toplamlar,
  yinelenen kart reddi, asistanın `finans` çıktısı).
- Kalan: push (Samet'in onayıyla) → deploy sonrası `scripts/ozel/kart-limit-yatirim-2026-11-26.ts --yatirim --apply` →
  bot yönergesini VPS'e gönder.

## v3.16.0 — 26 Kasım 2026 — Finans: Yatırım bölümü
**Araç:** Claude Code (Fable 5.2)  **Tür:** MINOR
### Yapılanlar
- Finans → Genel Durum'a **Yatırım** kutusu eklendi (kutuların altında tam genişlik, altın sarısı). Dokununca yatırım kalemleri,
  toplam ve "+ Yatırım ekle" açılır; kalem düzenlenir / çöp kutusuna taşınır (`src/components/KasaView.tsx`: `InvestmentForm`).
- Veri modeli **değişmedi**: yatırım, `KasaEntry` içinde `category: "yatirim"` kaydıdır (`src/lib/kasaCalc.ts`:
  `INVESTMENT_CATEGORY`, `isInvestment`). `status ODENDI` = para kasadan çıktı (Kasada Kalan'dan düşer, işlem geçmişinde görünür);
  `status BEKLIYOR` = kasa dışı kaynak (yalnızca Yatırım toplamında). Formda bu, "Kasadan düş" kutusudur.
- Yatırım gider sayılmaz: ay giderine, yaklaşan ödemelere, borçlara, alacaklara ve geçmiş ayların gider toplamına girmez
  (`computeKasa` yatırımları baştan ayırır; `monthlyHistory` atlar).
- Telegram botu (`src/lib/agent.ts`): `finans` çıktısına `yatirim` toplamı eklendi; yatırım kayıtları "yaklaşan ödemeler"e girmez.
### Doğrulama
- `tsc --noEmit` temiz, `eslint src/` 0 hata (26 uyarı, değişmedi). `computeKasa` örnek veriyle sınandı: kasa dışı yatırım
  hiçbir mevcut rakamı değiştirmiyor; "kasadan" yatırım yalnızca Kasada Kalan'ı düşürüyor, ay gideri aynı kalıyor.
- Finans ekranı giriş gerektirdiği için tarayıcıda denenmedi.
### Dikkat / bilinen kısıtlar
- **Sıra önemli:** `category: "yatirim"` kaydı, bu sürüm canlıya çıkmadan veritabanına yazılırsa eski kod onu sıradan gider
  sanar (ay gideri / yaklaşan ödemeler). İlk yatırım kaydı bu yüzden deploy'dan SONRA eklenir.
- Genel "+ Kayıt" formunun kategori listesinde "yatirim" yok; yatırım yalnızca Yatırım penceresinden eklenir.
### Yarım kalanlar / Sıradaki
- Push (deploy) ve ardından ilk yatırım kaydının eklenmesi — Samet'in onayıyla.

## v3.15.0 — 25 Kasım 2026 — Kapsamlı denetim düzeltmeleri (güvenlik, SEO, ölçüm, KVKK, erişilebilirlik)
**Araç:** Claude Code (Opus 5.5)  **Tür:** MINOR
Denetim raporu yerelde: `docs/ozel/DENETIM-2026-11-25.md` (git dışı). Dal: `denetim-duzeltmeleri-2026-11`;
geri dönüş noktası: etiket `yedek/denetim-oncesi-2026-11-25` (= v3.14.0).
### Yapılanlar
- **Güvenlik:** `musteri-data/` repodan çıkarıldı (git dışı yerel kopya `docs/ozel/musteri-data/`). next 16.4.6, zod 4.6.7,
  nodemailer 10.6.1, jose 6.2.18 (npm audit: kritik 0; kalan 4 yüksek yalnızca Prisma CLI zincirinde). JWT yalnızca HS256;
  şifre sıfırlama jetonu SHA-256 özetiyle saklanır; "şifremi unuttum" işi `after()` ile yanıttan sonra; panel parolası en az 8.
  COOP başlığı.
- **Teknik SEO:** www → çıplak alan adı 308 (`next.config.ts`); `*.vercel.app` için `X-Robots-Tag: noindex`; 11 sayfaya
  og:image; `keywords` meta kaldırıldı; 59 sayfanın meta açıklaması ≤155 karakter (title/H1 değişmedi; blog ve video için
  ayrı `metaDescription` alanı); favicon.ico, apple-icon, `/feed.xml` (RSS), `/.well-known/security.txt`; 404 başlığı;
  JSON-LD `<` kaçışı; latin-ext yazı tipi alt kümesi; OG görseli statik.
- **GEO / şema:** Ana sayfa koordinatı Keçiören yerine Zübeyde Hanım Mah. (Altındağ, OSM mahalle merkezi), `addressLocality`,
  `alternateName: ["markaizi","Marka İzi"]`; robots.txt güncel yapay zekâ belirteçleri (Claude-SearchBot, Claude-User,
  Perplexity-User, OAI-AdsBot; Claude-Web çıkarıldı).
- **Ölçüm:** `src/lib/track.ts` — `generate_lead` (4 form), `contact_whatsapp/phone/email` (tek tıklama dinleyicisi);
  yalnızca çerez onayıyla. Google izin modu v2 sinyali; Pixel'de sayfa geçişi PageView; footer'da "Çerez Tercihleri".
- **KVKK / spam:** 4 formda KVKK aydınlatma bağlantısı; honeypot + süre kontrolü (`isLikelyBot`); bozuk JSON'a 400;
  CV formundan medeni durum kaldırıldı.
- **UX / mobil:** Hizmet sayfası hero'sunda Ücretsiz Analiz + WhatsApp (web tasarımda teklif formu); mobil başlıkta
  Müşteri Girişi menüye taşındı, yerine Ücretsiz Analiz; mobil menü odak yönetimi; WhatsApp balonu mobilde küçük;
  hero animasyonları kısaldı, küreler sabit; rozet ve iki slogan H2 tanımlayıcı (H1 aynı); teklif sayfasında çift başlık kaldırıldı.
- **Erişilebilirlik / kalite:** "İçeriğe geç" bağlantısı + `<main id="icerik">`; CV etiketleri alanlara bağlı; autocomplete,
  role=status/alert; 69 iç `<a>` → `<Link>`; ESLint 94 hata → 0 (26 uyarı); `.github/workflows/ci.yml` (tsc + eslint + build).
### Doğrulama
- `tsc --noEmit` temiz, `eslint src/` 0 hata, `next build` başarılı (sırsız ortamda da). Yerel production sunucusunda:
  www yönlendirmesi, vercel.app noindex, favicon/RSS/security.txt, bot isteği → kayıtsız başarı, bozuk JSON → 400,
  mobil başlık 320/375 px taşmasız, menü odak yönetimi, form KVKK notu ve çerez tercihleri tarayıcıda denendi.
- Panel ekranlarındaki `<Link>` dönüşümleri giriş yapılmadığı için tarayıcıda denenmedi (derleme ve tip kontrolü temiz).
### Dikkat / bilinen kısıtlar
- Push yapılmadı: değişiklikler `denetim-duzeltmeleri-2026-11` dalında. Canlıya almak için main'e birleştirip push.
- `musteri-data/` geçmiş commit'lerde hâlâ duruyor; tam temizlik için repoyu özel yapmak ya da geçmişi yeniden yazmak gerekir.
- Kalıcı (çok örnekli) hız sınırı için veritabanı tablosu gerekir — migration Samet onayıyla.
### Yarım kalanlar / Sıradaki (Samet'in işlemi gereken)
- Repoyu özel yapmak; SPF/DMARC DNS kayıtları; Google İşletme Profili iğne koordinatı; `sameAs` için LinkedIn/Facebook/GBP adresleri;
  gerçek iş görselleri, vakalar ve yorumlar; KVKK metinlerinin hukuki teyidi; GA4/Meta'da yeni olayları dönüşüm olarak işaretlemek.

## v3.14.0 — 25 Kasım 2026 — Panel filtre menüleri yenilendi + ajandada öncelik filtresi
**Araç:** Claude Code (Opus 5.5)  **Tür:** MINOR
### Yapılanlar
- Yeni `src/components/FilterSelect.tsx`: yerel `<select>` yerine panel tasarımına uygun açılır menü — ikonlu tetik,
  seçiliyken mor degrade, gölgeli liste, 7'den fazla seçenekte arama, baş harf rozeti, seçili satırda tik;
  Esc / dışarı tıklama ile kapanır, ok tuşları + Enter ile seçilir. Açık/koyu tema `--fs-*` değişkenleriyle (`globals.css`).
- Ajanda: "Tüm firmalar" menüsü yenilendi; yanına **öncelik bayrakları** eklendi (Düşük yeşil, Orta turuncu, Yüksek kırmızı,
  yanlarında açık iş sayısı). Bayrağa basınca yalnızca o öncelikteki işler görünür ve "İşler" sekmesine geçilir;
  aynı bayrağa tekrar basınca filtre kalkar. "Yüksek" acil işleri de kapsar. İş öncelik rozetlerinin renkleri bayraklarla eşlendi.
- İş Akışı: "Tüm Çalışanlar", "Tüm Firmalar" ve sıralama menüleri yeni bileşene geçirildi.
### Doğrulama
- `tsc --noEmit` temiz. Yerelde Ajanda (firma seçimi, bayrak aç/kapa, filtre temizle) ve İş Akışı menüleri açık ve koyu temada denendi.
- `WorkflowBoard.tsx` içindeki 2 `react-hooks/set-state-in-effect` lint hatası bu değişiklikten önce de vardı.

## v3.13.0 — 24 Kasım 2026 — Markaizi Asistan (Claude botu) devrede
**Araç:** Claude Code (Opus 5.5)  **Tür:** MINOR
### Yapılanlar
- Bot VPS'te ayrı `mkzbot` kullanıcısıyla çalışıyor; asıl kanal **Claude Remote Control** (Claude uygulaması → Code → "Markaizi Asistan").
  Telegram eklentisi de açık ama Telegram botlara sürekli 429 döndüğünden eşleştirme beklemede.
- `bot/mkzbot.service` — sunucu açılışında otomatik başlatma (systemd + tmux, oturum kapanırsa yeniden açılır).
- `bot/vps-kurulum.sh` (kullanıcı + Bun + Claude Code), `bot/telegram-token.sh` (token'ı gizli girişle sunucuya yazar).
- `bot/.claude/settings.json` — `dontAsk` modu; yalnızca `mkz` ve Telegram araçları; dosya yazma, web, alt ajan kapalı;
  sır dosyaları yol bazlı okuma yasağıyla korunuyor (`CLAUDE.md` okunabilsin diye genel Read yasağı kaldırıldı).
- `bot/KURULUM.md` gerçek adımlarla yeniden yazıldı.
### Doğrulama
- Remote Control üzerinden verilen görev ajandaya işlendi (Samet test etti). `mkz ozet` canlı veri döndürüyor.
- `mkzbot.service` etkin ve çalışıyor; yeniden başlatmada Remote Control ve Telegram eklentisi açılıyor.

## v3.12.0 — 23 Kasım 2026 — Kendi sunucuya (VPS) taşıma altyapısı
**Araç:** Claude Code (Opus 5.5)  **Tür:** MINOR
### Yapılanlar
- `next.config.ts`: `output: "standalone"`; `schema.prisma`: `binaryTargets = ["native", "debian-openssl-3.0.x"]` (Vercel'de de çalışmaya devam eder).
- `src/lib/security.ts` `getClientIp`: `x-vercel-forwarded-for` yalnızca Vercel'de (`VERCEL` ortam değişkeni varken) güvenilir;
  VPS'te nginx'in yazdığı `x-real-ip` esas. (Vercel dışında bu başlık istemci tarafından uydurulabilirdi → hız sınırı atlatma.)
- `deploy/`:
  - `vps-deploy.sh` — Mac'te derler (VPS tek çekirdek; diğer siteler yavaşlamasın), Linux sharp'ı ekler, `releases/<zaman>`'a gönderir,
    `current` bağlantısını çevirir, yalnızca `markaizi-web` servisini yeniden başlatır, sağlık kontrolü başarısızsa önceki sürüme döner, son 5 sürümü tutar.
  - `markaizi-web.service` — ayrı yetkisiz `markaizi` kullanıcısı, yalnızca `127.0.0.1:3002`, bellek sınırı, salt okunur dosya sistemi.
  - `nginx-markaizi.conf` — ters vekil; istemcinin gönderdiği `X-Vercel-Forwarded-For` silinir.
  - `vps-migrate.sh` — önce yedek, sonra yalnızca `prisma migrate deploy` (sırlar sunucuda kalır).
  - `yedek.sh` (VPS, her gece 03:30, son 30 gece) + `yedek-cek.sh` (Mac'e VPS dışı kopya).
- VPS'te: ayrı Postgres rolü + veritabanı, sunucuya özel `.env` (git dışı), Neon verisi kopyalandı.
### Doğrulama
- Neon ↔ VPS: 29 tablonun satır sayıları birebir aynı.
- Yedek → ayrı test veritabanına geri yükleme → birebir aynı; test veritabanı silindi.
- VPS'te sayfalar, görsel optimizasyonu, API'ler 200/beklenen kodlar; süreç ~65 MB bellek.
### Yarım kalanlar / Sıradaki
- Geçiş henüz yapılmadı: canlı site hâlâ Vercel + Neon. Sırada: panel testi (tünel), sunucu `.env` sırları, son veri kopyası, DNS, certbot.
- Neon ve Vercel geçişten sonra 2–3 hafta geri dönüş için tutulacak.

## v3.11.0 — 23 Kasım 2026 — Telegram + Claude botu için /api/agent, işlem kaydı
**Araç:** Claude Code (Fable 5.2)  **Tür:** MINOR
### Yapılanlar
- **`/api/agent`** (`src/app/api/agent/route.ts`, `src/lib/agent.ts`): botun tek giriş noktası. `Authorization: Bearer <AGENT_TOKEN>`
  (zaman sabit karşılaştırma; değişken tanımsızsa uç 503 ile kapalı; hatalı token denemeleri hız sınırlı).
  Yalnızca adlandırılmış işlemler: okuma `ozet, ziyaretler, isler, firmalar, finans, notlar`; yazma `ziyaret_ekle, ziyaret_guncelle,
  is_ekle, is_guncelle, not_ekle, tahsilat, odeme_yapildi, kasa_ekle, kart_harcama, kart_odeme, sil`.
  Yazmalar panelle aynı servis katmanından (`agenda.ts`) geçer. Kalıcı silme yok (`sil` → çöp kutusu; ziyaret → iptal).
  Firma / kart adı yazım toleranslı çözülür, belirsizse adaylarla 400 döner. Aynı firmaya aynı gün ikinci planlı ziyaret açılmaz.
  Bot üzerinden eklenen iş varsayılan olarak müşteriye kapalıdır.
- **İşlem kaydı:** `AuditLog` modeli + `src/lib/audit.ts`. Panel ajanda/finans uçları (`agendaApi.respond`) ve bot işlemleri
  başarılı / başarısız her yazmayı kaydeder; kayıt yazılamazsa asıl işlem etkilenmez. Ekran: `/musteri/admin/islem-kaydi` (yalnızca admin).
- **`bot/`**: `mkz` (Node, bağımlılıksız CLI → `/api/agent`), `CLAUDE.md` (bot talimatları), `.claude/settings.json` (yalnızca `mkz` izni),
  `KURULUM.md` (VPS kurulumu: ayrı kullanıcı, Bun, Claude Code, `--channels plugin:telegram@claude-plugins-official`, eşleştirme + allowlist).
- Migration: `20261124010000_audit_log` (yalnızca ekleme — **canlıya henüz uygulanmadı**; uygulanana kadar kayıt yazılmaz, başka hiçbir şey etkilenmez).
### Doğrulama
- `tsc` 0 hata, `next build` başarılı, yeni dosyalarda lint hatası yok.
- Canlı veritabanında geçici kayıtlarla bot işlemleri uçtan uca denendi (yetki, belirsiz firma, tarih / saat dilimi, mükerrer ziyaret,
  iş / not / alacak / tahsilat, kart harcaması ve ödemesi, sil → iptal / çöp kutusu); hepsi geçti, test kayıtları silindi.
### Yarım kalanlar / Sıradaki
- Samet: `prisma migrate deploy`; Vercel'e `AGENT_TOKEN`; BotFather bot token'ı; VPS'te `mkzbot` ile `claude` girişi (bkz. `bot/KURULUM.md`).
- Bildirimler (ödeme günü, ziyaret takibi, akşam "bugün nereye gittin") — bot çalıştıktan sonra zamanlanmış görev olarak.

## v3.10.0 — 23 Kasım 2026 — Denetim düzeltmeleri: Finans kuralları, çöp kutusu, ay görünümü, mobil, gizlilik
**Araç:** Claude Code (Fable 5.2)  **Tür:** MINOR
### Yapılanlar
- **Finans kural düzeltmeleri (`src/lib/agenda.ts`):**
  - Kart / hesap borcu tamamen ödenince kayıt artık kaybolmuyor (bakiye 0, kart listede kalır, yeni harcama eklenebilir).
  - Borçtan fazla ödeme ve kart olmayan kayıtta "ödeme yap" / harcama ekleme reddedilir (`AgendaRuleError` → 400).
  - Ödeme / tahsilat tarihi elle girilebilir (`paidAt`); kayıt o tarihin ayına sayılır.
  - Aylık tekrarlayan kayıtlarda gün kayması giderildi (ayın 30'u kısa aydan sonra yine 30'a döner); silinen sonraki ay kaydı geri açılmaz.
  - Ziyaret "Geri al" / silme sonrası firmanın son ziyaret tarihi takvimden yeniden hesaplanır (`syncLastVisit`).
  - Kart harcaması düzenleme, silme (çöp kutusu) ve başka karta taşıma (`updateCardTransaction`, `trashCardTransaction`).
  - Taksit planı: tek formdan N aylık taksit kaydı (`createInstallmentPlan`, kaynak `installments`).
- **Otomatik aylık alacak (`clientPayments.ts`):** elle silinen alacak artık yeniden açılmıyor; firma başına sorgu yerine tek sorgu.
- **Çöp kutusu** (`/musteri/admin/cop-kutusu`, `TrashView.tsx`): silinen iş, not, finans kaydı ve kart harcaması listelenir, geri alınır
  (`PATCH … { action: "restore" }`).
- **Ajanda:** Plan sekmesinde Liste / Ay görünümü; konum → harita bağlantısı; çöp kutusu bağlantısı.
- **Pencereler (`agenda/ui.tsx` Modal):** Esc ile kapanır (iç içe pencerede yalnızca en üstteki), arka plan kaymaz, `role="dialog"`;
  form pencereleri dışına dokununca kapanmaz. Telefonda form alanları 16 px (iOS yakınlaştırması yok), dokunma alanları büyütüldü,
  yıllık ödeme tablosu dar ekranda düzenlendi.
- **Müşteri paneli:** açılış sekmesi artık "Ziyaret & İşler" (içerik yoksa "Fatura") — boş içerik takvimiyle açılmıyor.
- **Yetki:** müşteri ödemeleri Kasa kaydı olduğu için yalnızca ADMIN yazabilir (`staffGuard`); çalışan görüntüler.
- **Gizlilik:** repo herkese açık olduğu için sürüm notları ve kod yorumlarından tutar / isim ayrıntıları çıkarıldı; veri scriptleri
  `scripts/ozel/`'e taşındı; `.gitignore`'a `/docs/ozel/` ve `/scripts/ozel/` eklendi. Yerelde atılmış (push edilmemiş) v3.3.0 commit'i
  aynı nedenle yeniden oluşturuldu.
- **Operasyon:** VPS'teki eski Mİ Asistan API süreci durduruldu (`pm2 stop markaizi-api`; veritabanı duruyor, diğer siteler etkilenmedi).
- **Veri:** müşteriye açık olup iç not niteliğindeki işler gizlendi; takvimde kaydı olmayan son ziyaretler gerçekleşmiş ziyaret olarak eklendi.
### Doğrulama
- `tsc --noEmit` 0 hata; `eslint` hata sayısı değişmedi; `next build` başarılı.
- Canlı veritabanında geçici kayıtlarla 20 senaryo (kart harcaması / taşıma / silme / geri alma, fazla ödeme, tam ödeme sonrası kart,
  ödeme tarihi, tekrarlayan gün, çift kayıt, taksit planı, ziyaret geri alma, silinen alacak) → 20/20 geçti; test kayıtları kalıcı silindi,
  finans toplamları test öncesiyle aynı.
- Tarayıcı: Ajanda ay görünümü, çöp kutusu, Finans formu (ödeme tarihi / taksit alanları, Esc), 375 px'te taşma yok.
### Yarım kalanlar / Sıradaki
- İşlem kaydı (audit log, yeni tablo) + `/api/agent/*` + VPS'te Telegram + Claude botu ve bildirimler (ödeme günü, ziyaret takibi).
- Müşteri girişi olmayan aktif firmalar için kullanıcı açılması (Samet).
- Repo'nun gizli (private) yapılması önerilir.

## v3.9.0 — 23 Kasım 2026 — Geçmiş tahsilatlar + tek kayıt denetimi
**Tür:** MINOR — Kasa öncesi aylara ait tahsilatlar "geçmiş kayıt" olarak eklendi (`legacyId "gecmis:…"`, toplam / yıllık gelire girer,
kasada kalana girmez). Denetimde bulunan çift ödeme kaydı ve kopya notlar çöp kutusuna alındı; müşteri panelinde vadesiz eski faturalar
arşivden gösterilmiyor. Ayrıntı: `docs/ozel/`.

## v3.8.0 — 23 Kasım 2026 — Pasif firmalar, tıklanabilir firma adları
**Tür:** MINOR — Firmalar listesinde "Pasif firmalar" bölümü; pasife al / aktifleştir; pasif firmalar Ajanda ve Finans seçicilerinde
"(pasif)" etiketiyle, Finans yıllık tablosunda ödemesi varsa görünür. `ClientLink`: Ajanda, Finans ve İş Akışı kartlarında firma adı
firma sayfasına gider.

## v3.7.0 — 23 Kasım 2026 — Eski tahsilatlar Finans geçmişine; yıllık + tüm zamanlar gelir
**Tür:** MINOR — Kasa başlangıcından önceki "ödendi" faturalar Kasa'ya geçmiş kayıt olarak aktarıldı (`legacyId "invoice:<id>"`).
`kasaCalc`: `historical` bayrağı, `yearIncome` (İstanbul takvim yılı) + `totalIncome`. Finans üst kartı yıllık + tüm zamanlar.
Tarihi geçmiş içerik takvimi kayıtları temizlendi.

## v3.6.0 — 23 Kasım 2026 — Sadeleştirme: PayTR arayüzü, iş kaydı / ücret / avans kaldırıldı; yıllık tablo; firma ajandası
**Tür:** MINOR
- PayTR admin arayüzünden kaldırıldı (altyapı duruyor: `/odeme/[code]`, `api/musteri/admin/payment-links`, `api/paytr/callback`).
- İş kaydı + işe göre ücret + avans / dönem ödemesi sistemi kaldırıldı (API'ler, ekranlar, iş akışındaki ücret penceresi). İş Akışı panosu duruyor.
- Personel ödemeleri Finans'tan girilir (`KasaEntry.employeeId`); çalışan `/musteri/calisan/odemelerim`'de salt okunur görür.
- Ücret / ödeme günü değişince bekleyen gelecek alacaklar güvenli kurallarla güncellenir (`repriceFutureReceivables`).
- Finans → Müşteri Ödemeleri yıllık tablo (firma × ay); Geçmiş Aylar → ay detayı.
- Ajanda firma filtresi; notlarda "Müşteri görsün" (`AgendaNote.visibleToClient`); admin firma detayında "Ajanda" sekmesi;
  müşteri panelinde "Bilgileriniz".
- Migration: `20261123230000_kasa_employee_note_visibility` (yalnızca ekleme). İş akışı kartları ve iş kayıtları Samet'in onayıyla silindi.

## v3.5.0 — 23 Kasım 2026 — Finans: Ekonomi + Ödemeler + Kasa tek çatı altında
**Tür:** MINOR
- Tek kaynak Kasa: müşteri ödemesi = `KasaEntry` (ALACAK/GELIR, "Müşteri Ödemesi"). `src/lib/clientPayments.ts`:
  `listClientPayments` (müşteri paneli, admin firma detayı, çalışan ekranı), `pendingPaymentCounts`, `ensureClientReceivables`
  (ücret + ödeme gününden aylık alacak).
- Fatura API'leri Kasa'ya yazar; PayTR callback Kasa'daki alacağı kapatır.
- `/musteri/admin/finans`: Genel Durum + Müşteri Ödemeleri. `/admin/ekonomi`, `/admin/odemeler`, `/admin/kasa` buraya yönlenir.
- Kaldırıldı: `EkonomiView`, `OdemelerView`, `lib/economy*.ts`, `api/musteri/admin/{ekonomi,transactions,recurring-expenses}`.
- Firma ayarlarına ödeme günü alanları; müşteri panelinde tamamlanan işler ve otomatik yenileme.

## v3.4.0 — 23 Kasım 2026 — Admin Ajanda + Kasa ekranları, müşteri ziyaret görünümü
**Tür:** MINOR
- `src/lib/agenda.ts` servis katmanı + zod şemaları; `src/lib/kasaCalc.ts` Kasa formülleri (saf fonksiyon).
- `api/musteri/admin/ajanda/[resource]/(route|[id]/route).ts`: `events | tasks | notes | kasa | card-tx` (yalnızca ADMIN).
- `/musteri/admin/ajanda` (plan, ziyaret takibi, işler, notlar & hafıza) ve Kasa ekranı (Mİ Asistan uygulamasının karşılığı).
- Müşteri paneli: "Sonraki ziyaretimiz" + "Ziyaret & İşler" (yalnızca `visibleToClient` kayıtlar; admin açıklaması gönderilmez).

## v3.3.0 — 23 Kasım 2026 — Ajanda + Kasa veri modeli (Mİ Asistan taşıma)
**Tür:** MINOR — Karar: Mİ Asistan (ayrı iOS uygulaması + API) bırakıldı, ajanda verisi panele taşındı.
- `prisma/schema.prisma`: `Client` ziyaret alanları; `AgendaEvent`, `AgendaTask`, `AgendaNote`, `KasaEntry`, `KasaCardTransaction`.
- Migration `20261123210000_ajanda_kasa` (yalnızca ekleme). Taşıma scripti `scripts/ozel/`'de (repo dışı).

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
