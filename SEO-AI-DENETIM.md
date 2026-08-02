# Google SEO & Yapay Zeka Görünürlük Denetimi — markaizi.com.tr

**Denetim tarihi:** 2 Ağustos 2026
**Referans:** `google-seo-yapay-zeka-gorunurluk-resmi-kaynaklar.pdf` (24 resmî Google kaynağı)
**Yöntem:** Kod incelemesi + canlı sitede `curl` ile render edilen HTML doğrulaması

> ✅ **Güncelleme (2 Ağustos 2026, aynı gün):** Aşağıdaki 1–6. maddelerin tamamı uygulandı ve
> `npx tsc --noEmit` + `npm run build` ile doğrulandı. Ayrıca bu turda ek olarak: kullanılmayan
> PayTR/ödeme altyapısı tamamen kaldırıldı, sitedeki tüm hizmet fiyatları (llms.txt fiyat listesi,
> hosting yenileme ücreti) kaldırıldı — sadece müşterinin kendi reklam bütçesine dair tavsiyeler
> (₺ rakamlı) kasıtlı olarak bırakıldı, ve 6 blog yazısının 2025 tarihleri 2026'ya güncellendi.
> Madde 7–8 (özgün içerik üretimi, görsel ekleme) sürekli bir çaba gerektirdiği için bu turda
> kapsam dışı bırakıldı — aşağıdaki metin denetimin orijinal hâli olarak korunmuştur.

---

## Özet

PDF'in ana tezi net: **AI Overviews / AI Mode için ayrı bir teknik katman yok, temel SEO neyse o.**
Sitenin temeli iyi durumda — Türkçe `lang`, sitemap, robots.txt, ProfessionalService şeması, hizmet
sayfaları, canonical'ların çoğu, ödeme sayfalarında `noindex`, iç linkleme büyük ölçüde sağlam.

Ancak **3 kritik sorun var ve üçü de canlı sitede doğrulandı.** Bunlardan ikisi doğrudan Google'ın
resmî yönergelerini ihlal ediyor; biri de sayfaların indekslenmesini aktif olarak engelliyor.

| Öncelik | Adet | Etki |
|---|---|---|
| 🔴 Kritik | 3 | Yapılandırılmış veri ihlali + indeks kaybı |
| 🟠 Yüksek | 5 | Tazelik, özgünlük, tarama verimliliği |
| 🟡 Orta | 8 | İyileştirme fırsatları |

---

## 🔴 KRİTİK

### 1. SSS cevapları yapılandırılmış veride var, sayfada yok

**Doğrulandı:** `/sss` sayfasında JSON-LD'de **13 adet `acceptedAnswer`** tanımlı, ancak bu cevap
metinlerinin **hiçbiri render edilen HTML'de yok.** Metin sadece kullanıcı akordeona tıkladığında
DOM'a giriyor.

```
acceptedAnswer sayısı (JSON-LD): 13
Örnek cevap metni görünür HTML'de bulundu mu?: HAYIR
```

**Neden kritik:** PDF kaynak #9 (*Yapılandırılmış Veri Genel Yönergeleri*) yapılandırılmış verinin
**görünür içerikle eşleşmesini** zorunlu kılar. Eşleşmeyen işaretleme bir kalite/spam ihlalidir ve
zengin sonuç uygunluğunun tamamen kaybedilmesine yol açabilir. PDF uygulama adımı 04 de aynı şeyi
söylüyor: *"Önemli bilgiyi yalnızca görsel ya da istemci taraflı etkileşime hapsetmeyin."*

**Etkilenen sayfalar:** `/sss`, 6 hizmet sayfası, `/mobilya-reklam-ajansi` (toplam 8 sayfa)

**Yapılacak:** `{isOpen && (...)}` koşullu render'ı kaldır; metin her zaman DOM'da olsun, sadece
CSS ile gizlensin. En temizi native `<details>/<summary>` kullanmak (bonus: JS'siz çalışır, erişilebilir).

- [`src/components/ServiceFAQ.tsx:57`](src/components/ServiceFAQ.tsx:57)
- [`src/app/sss/page.tsx:159`](src/app/sss/page.tsx:159)

---

### 2. Root layout'taki canonical tüm sayfaları anasayfaya işaret ettiriyor

[`src/app/layout.tsx:50-52`](src/app/layout.tsx:50) içinde `alternates.canonical` tanımlı. Next.js
bunu, kendi canonical'ını tanımlamayan **her sayfaya miras bırakıyor.**

**Canlı sitede doğrulandı:**

| Sayfa | Bildirdiği canonical |
|---|---|
| `/kvkk` | `https://markaizi.com.tr` ❌ |
| `/cv` | `https://markaizi.com.tr` ❌ |
| `/gizlilik-politikasi` | `https://markaizi.com.tr` ❌ |
| `/cerez-politikasi` | `https://markaizi.com.tr` ❌ |
| `/kullanim-sartlari` | `https://markaizi.com.tr` ❌ |

Bu sayfalar Google'a *"ben anasayfanın kopyasıyım, beni indeksleme"* diyor — üstelik **hepsi
sitemap'te de listeli.** Google'a birbiriyle çelişen iki sinyal gidiyor; sonuç: sayfalar indeksten
düşer.

**Yapılacak:**
1. `layout.tsx`'ten `alternates.canonical` satırını **kaldır**.
2. Canonical'ı olmayan 5 sayfaya kendi canonical'ını ekle.

---

### 3. Blog tarihleri geçersiz formatta ve yapılandırılmış veride hiç yok

**Canlı sitede doğrulandı:**

```
<meta property="article:published_time" content="15 Ocak 2025">   ← ISO 8601 değil, geçersiz
BlogPosting JSON-LD'de datePublished sayısı: 0
BlogPosting JSON-LD'de dateModified sayısı: 0
```

`article:published_time` **ISO 8601** olmak zorunda (`2025-01-15T00:00:00+03:00`). Türkçe metin
tarihi hiçbir ayrıştırıcı tarafından okunamaz. Ayrıca `BlogPosting` şemasında `datePublished` ve
`dateModified` **tamamen eksik** — Google içeriğin ne kadar güncel olduğunu belirleyemiyor.

PDF uygulama adımı 05: *"tarih duyarlı bilgileri güncelleyin"* — güncelleme sinyali verebilmek için
önce makine-okunur tarih gerekiyor.

**Yapılacak:**
1. [`src/lib/blog-data.ts:11`](src/lib/blog-data.ts:11) → mevcut `date` (görüntüleme için) yanına
   `datePublished: "2025-01-15"` ve `dateModified` ISO alanları ekle.
2. [`src/app/blog/[slug]/page.tsx:28`](src/app/blog/[slug]/page.tsx:28) → `publishedTime`'a ISO değeri ver.
3. [`src/app/blog/[slug]/page.tsx:43`](src/app/blog/[slug]/page.tsx:43) → JSON-LD'ye `datePublished`,
   `dateModified`, `image` ekle.

---

## 🟠 YÜKSEK

### 4. Sitemap'te yönlendirilen URL var

`/hizmetler/icerik-uretimi` canlıda **HTTP 307** ile `/hizmetler/sosyal-medya-yonetimi`'ne
yönleniyor — ama [`src/app/sitemap.ts:37`](src/app/sitemap.ts:37) içinde `priority: 0.7` ile hâlâ
listeli. Sitemap'e yönlendirilen URL koymak tarama bütçesi israfıdır.

Ayrıca `redirect()` varsayılan olarak **307 (geçici)** üretiyor. Kalıcı birleştirme için
**308** olmalı ki Google sinyalleri hedef sayfaya aktarsın.

**Yapılacak:** Sitemap'ten satırı sil; `redirect()` yerine `next.config` içinde `permanent: true`
ile yönlendirme tanımla.

---

### 5. Sitemap'te sahte `lastModified`

[`src/app/sitemap.ts:19`](src/app/sitemap.ts:19) → `const now = new Date()` ve **her URL** bu değeri
alıyor. Yani sitemap her taramada "27 sayfanın hepsi bugün değişti" diyor. Google gerçeği yansıtmayan
`lastmod` değerlerini yok sayar, hatta sitemap'e olan güveni azalır.

**Yapılacak:** Blog yazıları için `dateModified` alanını (madde 3) kullan; statik sayfalar için sabit
tarih yaz.

---

### 6. Blog içeriği bayat — başlıklarda eski yıl var

10 yazının **6'sı Ocak–Mart 2025 tarihli** (18 ay önce) ve başlıklarda yıl geçiyor:

- *"Instagram Algoritması **2025**: Organik Büyüme İçin 10 Strateji"*
- *"**2025**'te Web Sitesi Hız Optimizasyonu: Core Web Vitals Rehberi"*

PDF adım 05 tam olarak bunu hedefliyor. Algoritma/platform içeriği 18 ayda ciddi şekilde eskir ve
başlıktaki eski yıl kullanıcıya da Google'a da "güncel değil" sinyali verir.

**Yapılacak:** İçeriği gözden geçir, yılı başlıktan çıkar veya güncelle, `dateModified` alanını tazele.

---

### 7. Özgün değer eksikliği — ölçeklendirilmiş içerik riski

10 blog yazısının **tamamı birebir aynı şablonda**: `intro` + N×(`h2` + `body`) + `conclusion`.
İçeriklerde **birinci el veri yok, vaka çalışması yok, müşteri sonucu yok, ekran görüntüsü yok,
özgün yöntem yok.** Hepsi genel geçer en iyi uygulama derlemesi.

PDF'in en çok vurguladığı iki nokta bu:

> *"Özgün uzmanlık öne çıkar. Birinci el deneyim, benzersiz bakış açısı ve yaygın bilginin ötesinde
> değer; yeniden paketlenmiş genel içerikten daha anlamlıdır."*

> *"Değer katmadan ölçekli sayfa üretmek spam politikasındaki 'ölçeklendirilmiş içerik kötüye
> kullanımı' kapsamına girebilir."*

**Yapılacak:** Ajansın gerçek verisini içeriğe koy — yönettiğiniz kampanyalardan anonimleştirilmiş
ROAS/CPC rakamları, Siteler'deki mobilya müşterilerinden vaka çalışmaları, öncesi/sonrası ekran
görüntüleri. Bu, hem PDF adım 03'ün karşılığı hem de rakiplerin kopyalayamayacağı tek varlık.

---

### 8. Yazar E-E-A-T sinyali zayıf

`BlogPosting.author` = `Organization`. Gerçek bir kişi, uzmanlık geçmişi veya deneyim beyanı yok.
PDF adım 05: *"yazar/kurum bilgisini açık tutun"* + *"birinci el deneyim"*.

**Yapılacak:** `author` alanını `Person` yap (Samet Sağlam), sayfaya kısa yazar kutusu ekle
(10+ yıl reklamcılık deneyimi, yönetilen bütçe vb.) ve `Person` şemasını `ProfessionalService`
ile `sameAs`/`worksFor` üzerinden bağla.

---

## 🟡 ORTA

### 9. Sitede neredeyse hiç görsel yok
Tüm public sitede **2 görsel** var (logo + hero banner). Blog yazılarında `<img>` sayısı: **0**.
Hizmet sayfalarında da yok. PDF adım 03 görsel/video eklemeyi özgün değer kaynağı sayıyor ve
*Google Görsel SEO* resmî kaynaklar arasında. Ayrıca `alt="Dijital Pazarlama"` (hero) fazla genel.

### 10. Hizmet sayfalarında `Service` şeması yok
Canlıda doğrulandı — `/hizmetler/meta-reklamlari` sayfasında sadece `FAQPage`, `Question`, `Answer`
var. `Service` / `Offer` yok. (`/mobilya-reklam-ajansi`'da doğru yapılmış, 6 hizmet sayfasında eksik.)

### 11. `BreadcrumbList` şeması hiçbir sayfada yok
Blog ve hizmet sayfalarında görsel breadcrumb var ama işaretlenmemiş.

### 12. Footer'da `/blog` linki yok + kırık logo linki
- Footer'dan bloga hiç link gitmiyor → 10 blog yazısının iç link desteği zayıf.
  PDF: *"içerik değeri ve dahili bağlantılara yatırım yapın."*
- [`src/components/sections/Footer.tsx:12`](src/components/sections/Footer.tsx:12) → logo `href="#"`,
  `/` olmalı.
- `#hakkimizda`, `#portfolio`, `#iletisim` anchor'ları legal sayfalarda hiçbir yere gitmiyor
  (`/#hakkimizda` olmalı).

### 13. `/cv` sayfasında `<h1>` yok
Canlıda doğrulandı. Sayfa sitemap'te var ama başlık hiyerarşisi eksik.

### 14. `public/llms.txt` — Google SEO için faydası yok
PDF bu konuda çok net:

> *"llms.txt zorunlu değildir. Google Arama görünürlüğü için gereksiz AI metin dosyaları resmî
> rehberde görmezden gelinebilecek taktikler arasında sayılır."*

Zararlı değil, ama **Google görünürlüğüne katkısı yok** ve içindeki fiyat listesi sitedeki fiyatlarla
zamanla tutarsızlaşırsa yanlış bilgi kaynağı olur. Karar sizin: tutulacaksa fiyat güncellemelerinde
bu dosya da güncellenmeli.

### 15. Domain tutarsızlığı
- Gerçek domain: **markaizi.com.tr** (HTTP 200)
- `markaizi.com`: **hiç çözülmüyor** (HTTP 000)
- Ama legal sayfa metinlerinde ve `CLAUDE.md`'de "markaizi.com" yazıyor.

**Yapılacak:** Legal sayfalardaki metinleri `markaizi.com.tr` yap; `markaizi.com` alınacaksa
308 ile ana domaine yönlendir.

### 16. `markaizi-web.vercel.app` indekslenebilir durumda
Vercel domain'i 200 dönüyor ve `robots.txt` taramaya izin veriyor. Canonical doğru şekilde
`markaizi.com.tr`'yi işaret ettiği için risk sınırlı, ama en temizi Vercel'de ana domaine 308
yönlendirme kurmak.

---

## ✅ Teyit edilmesi gerekenler (kod dışı)

1. **Search Console doğrulaması** — HTML'de `google-site-verification` meta etiketi yok. DNS ile
   doğrulanmış olabilir; lütfen teyit edin. PDF'in ölçüm ayağının **tamamı** Search Console'a
   dayanıyor (3 ayrı resmî kaynak listelenmiş) ve *"Üretken yapay zeka performans raporu"*
   (kademeli kullanıma açılıyor) sadece orada görünür.

2. **Google Business Profile** — PDF adım 06: yerel işletme için Business Profile güncel olmalı.
   Şemadaki adres/telefon/çalışma saatleri ile Business Profile birebir aynı mı?

3. **Core Web Vitals** — PDF *"Sayfa deneyimini anlama"* kaynağını listeliyor. Search Console'daki
   Core Web Vitals raporunu kontrol edin (hero banner 800×800 PNG, LCP'yi etkiliyor olabilir).

---

## Önerilen uygulama sırası

| # | İş | Süre | Etki |
|---|---|---|---|
| 1 | SSS cevaplarını DOM'a al (madde 1) | ~30 dk | 🔴 Şema ihlalini kapatır |
| 2 | Root canonical'ı kaldır + 5 sayfaya canonical ekle (madde 2) | ~20 dk | 🔴 5 sayfayı indekse sokar |
| 3 | Blog tarihlerini ISO'ya çevir + JSON-LD'ye ekle (madde 3) | ~40 dk | 🔴 Tazelik sinyali açar |
| 4 | Sitemap temizliği + 308 yönlendirme (madde 4, 5) | ~20 dk | 🟠 Tarama verimliliği |
| 5 | Footer blog linki, logo href, h1, anchor düzeltmeleri (madde 12, 13) | ~20 dk | 🟡 Hızlı kazanım |
| 6 | Service + BreadcrumbList şemaları (madde 10, 11) | ~45 dk | 🟡 Zengin sonuç uygunluğu |
| 7 | Blog içerik tazeleme + özgün veri ekleme (madde 6, 7, 8) | Sürekli | 🟠 En yüksek uzun vadeli etki |
| 8 | Görsel üretimi (madde 9) | Sürekli | 🟡 Görsel arama + değer |

**1–6 arası maddeler tek oturumda bitirilebilir (~3 saat) ve teknik borcun tamamını kapatır.**
7 ve 8 içerik üretimi gerektiriyor; asıl fark yaratacak olan da bunlar — çünkü PDF'in özeti şu:
teknik uygunluk sadece *bileti* alır, sıralamayı **özgün değer** belirler.

---

> *Not: Google hiçbir dokümanında kurallara uyan bir sayfanın mutlaka taranacağını, dizine
> ekleneceğini veya AI yanıtında gösterileceğini garanti etmez. Bu rapor uygunluğu artırmayı
> hedefler, sonuç garantisi vermez.*
