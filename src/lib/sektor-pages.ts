// Güzellik merkezi, e-ticaret ve GETAT sektör sayfaları. MobilyaLanding şablonunu kullanır.
// Her sayfa kendi sektörünün kurallarını ve müşteri yolculuğunu anlatır; birbirinin kopyası değildir.
// Mevzuat anlatımları genel bilgilendirmedir (hukuki danışmanlık değildir); metinleri güncellerken
// kaynak olarak Resmî Gazete'deki yönetmelik metinlerini esas al.

import type { LandingContent } from "@/lib/mobilya-pages";

const SAGLIK = { name: "Sağlık & Klinik Reklam Ajansı", path: "/saglik-klinik-reklam-ajansi", ctaLabel: "Sağlık & Klinik Reklam Ajansı" };
const VIDEO = { slug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi", text: "Reklamın neden tek başına randevu ya da satış getirmediğini videoda anlattık." };
const SAGLIK_LINK = { href: "/saglik-klinik-reklam-ajansi", label: "Sağlık & Klinik Reklam Ajansı" };
const GUZELLIK_LINK = { href: "/guzellik-merkezi-reklam-ajansi", label: "Güzellik Merkezi Reklam Ajansı" };
const DONUSUM = { href: "/hizmetler/donusum-takibi-kurulumu", label: "Dönüşüm Takibi Kurulumu" };
const DENETIM = { href: "/reklam-hesabi-denetimi", label: "Ücretsiz Reklam Hesabı Denetimi" };

// ───────────────────────── GÜZELLİK MERKEZİ ─────────────────────────

export const GUZELLIK: LandingContent = {
  path: "/guzellik-merkezi-reklam-ajansi",
  kind: "hizmet",
  metaTitle: "Güzellik Merkezi Reklam Ajansı — Ankara | Randevu Defterini Dolduran Instagram & Google Reklamı | markaizi",
  metaDescription:
    "Ankara güzellik merkezleri ve salonları için Instagram, Meta ve Google reklam yönetimi, Google Haritalar ve sosyal medya. Boş randevu saatlerini dolduran, KVKK ve reklam kurallarına uygun güzellik merkezi dijital pazarlaması.",
  keywords:
    "güzellik merkezi reklam ajansı, güzellik salonu reklamı, güzellik merkezi instagram reklamı, lazer epilasyon reklamı, ankara güzellik merkezi sosyal medya yönetimi, cilt bakımı reklamı, spa merkezi dijital pazarlama, güzellik merkezi google reklamı ankara",
  tag: "Ankara",
  h1Plain: "Güzellik Merkezi",
  h1Accent: "Reklam Ajansı",
  lead: [
    "Bir güzellik merkezi için en pahalı şey boş randevu saatidir. Salon açık, uzman hazır, ama saat dolmadı; gelir ertelenemiyor. Reklamın görevi, bu boş saatleri doğru müşteriyle ve doğru hizmetle doldurmak.",
    "Bu sayfa Ankara'daki güzellik merkezleri, salonlar ve spa işletmeleri için. Güzellik merkezi, kliniklerden farklı kurallara tabidir ve farklı bir müşteri yolculuğu vardır; reklam ve içerik bu farka göre kurulmalı.",
  ],
  sections: [
    {
      h2: "Güzellik Merkezi Klinik Değildir: Kurallar Farklı",
      paragraphs: [
        "Hekim kontrolündeki sağlık kuruluşları için 12 Kasım 2025 tarihli Sağlıkta Tanıtım ve Bilgilendirme Yönetmeliği geçerli. Hukuk kaynaklarının özetlerinde bu yönetmelik güzellik merkezlerini ayrıca anmıyor; ancak bu, güzellik merkezlerinin kuralsız olduğu anlamına gelmez. Tüketici mevzuatı, haksız ticari uygulama ve yanıltıcı reklam yasakları, KVKK ve Meta ile Google'ın kendi politikaları geçerli.",
        "Güzellik merkezlerinde sık görülen sorun reklamlarda tıbbi bir işlem yapıyormuş izlenimi vermek. Botoks ve dolgu gibi tıbbi işlemler hekimlik alanındadır; salonun reklamında bunlara yer vermek hem yasal hem platform açısından sorun yaratır. Yetkili olunmayan bir işlemi reklamda hiç anmamak, en güvenli yoldur.",
      ],
    },
    {
      h2: "Reklamda Neye Dikkat Edilir?",
      paragraphs: [
        "Meta ve Google, sağlık ve güzellik reklamlarında öncesi-sonrası görsellerini, gerçekçi olmayan sonuç vaatlerini ve kişisel özelliğe işaret eden ifadeleri ('şişman mısınız?' gibi) kısıtlar. Bu kuralları bilmeden kurulan kampanya reddedilir, tekrar eden ihlalde hesap kısıtlanabilir.",
      ],
      bullets: [
        "Kesin sonuç, 'kalıcı çözüm', 'garantili' gibi ifadelerden kaçınmak",
        "Müşteri fotoğrafı ve videosunu yazılı açık rıza olmadan kullanmamak (KVKK)",
        "Kampanya fiyatında geçerlilik tarihini ve koşulları açıkça yazmak",
        "Yorumları satın almamak, sahte yorum yazdırmamak",
        "Reklamdaki hizmetin salonda gerçekten, yetkili kişice yapılabildiğinden emin olmak",
      ],
    },
    {
      h2: "Randevu Defterini Doldurmak: Hizmet Bazlı Kurgu",
      paragraphs: [
        "Lazer epilasyon, cilt bakımı, kalıcı makyaj, saç, tırnak ve spa; her hizmetin müşterisi, sezonu ve karar süresi farklı. Lazer epilasyon yaz öncesi talep görürken, cilt bakımı düzenli müşteriyle ilerler. Bu yüzden her hizmeti aynı reklamda anlatmak yerine, hizmet bazlı kampanyalar kurar ve sezon takvimine göre bütçeyi kaydırırız.",
        "Boş saatler için gün ve saate göre kampanya kurmak da mümkün: hafta içi öğle saatleri, akşam öncesi, hafta sonu öncesi. Reklam, salonun boş olduğu zamanlarda yoğunlaşır ve doluluk arttıkça kısılır.",
      ],
    },
    {
      h2: "Google Haritalar: 'Yakınımdaki Güzellik Merkezi'",
      paragraphs: [
        "Güzellik merkezi seçiminin büyük kısmı mahalle düzeyinde yapılıyor: müşteri yakın, güvenilir ve değerlendirmesi iyi bir yer arıyor. Google İşletme Profilinin doğru kategori, hizmet listesi, çalışma saati, fotoğraf ve güncel iletişim bilgisiyle düzenlenmesi, reklamdan bağımsız en ucuz görünürlük kaynağıdır.",
        "Yorumlar müşterinin kendi değerlendirmesidir. Memnun müşteriden yorum istemeyi alışkanlık haline getirmek, olumsuz yorumlara sakin ve çözüm odaklı yanıt vermek güven verir. Satın alınmış veya sahte yorum, yürürlükteki düzenlemelere göre de yasaktır.",
      ],
    },
    {
      h2: "Instagram: Reels, Hikâye ve WhatsApp Randevu",
      paragraphs: [
        "Güzellik, görsel bir sektör ama Instagram'da görsel güzelliğin ötesinde güven aranır: uzmanın kim olduğu, ortamın temizliği, işlemin nasıl yapıldığı ve nasıl bir deneyim yaşanacağı. Süreç anlatan, mekânı gösteren ve soruları yanıtlayan içerik, süslü bir kampanya görselinden daha çok randevu getirir.",
        "Reklamlarda hedef, çoğu zaman WhatsApp'a mesaj atıp randevu almak. Hazır yanıtlar, mesai dışı otomatik yanıt ve randevu onay akışı kurmak, gelen talebin randevuya dönüşme oranını doğrudan artırır.",
      ],
    },
    {
      h2: "Ankara'da Bölge Bazlı Hedefleme",
      paragraphs: [
        "Güzellik merkezinin müşterisi çoğunlukla salonun birkaç kilometre çevresinde yaşar ya da çalışır. Çankaya, Yenimahalle, Etimesgut, Keçiören ve Mamak gibi ilçelerde hedeflemeyi mahalle ve iş merkezi çevresine göre daraltmak, bütçeyi gelmeyecek kişiye harcamaktan korur.",
      ],
    },
  ],
  faq: [
    {
      q: "Güzellik merkezi reklamında öncesi-sonrası fotoğrafı kullanabilir miyim?",
      a: "Meta ve Google bu tür görselleri sağlık ve güzellik reklamlarında kısıtlar; hasta/müşteri rızası ve KVKK de gerekir. Hekim kontrolündeki klinikler için ayrıca yönetmelik kuralları var. Güvenli yol, reklamda öncesi-sonrası kullanmamak, süreci ve mekânı anlatan içeriğe yönelmektir.",
    },
    {
      q: "Lazer epilasyon reklamı vermek serbest mi?",
      a: "Lazer epilasyon güzellik merkezlerinde yapılan bir hizmet olarak reklamlanabiliyor; ancak reklamda kesin sonuç vaadi, yanıltıcı fiyat ve izin gerektiren iddialardan kaçınmak gerekir. Cihazın ve işletmenin gerekli izin ve belgelerine sahip olduğundan emin olun.",
    },
    {
      q: "Botoks ve dolgu reklamı yapabilir miyim?",
      a: "Botoks ve dolgu gibi tıbbi işlemler hekimlik alanındadır. Hekimin bulunmadığı bir güzellik merkezinin bu işlemleri reklamında anması hem yasal hem platform açısından risk taşır. Hekim kontrolündeki klinikler için sağlık sayfamıza bakın.",
    },
    {
      q: "Instagram mı Google mı daha iyi?",
      a: "İkisi farklı iş görür. Instagram ve Meta reklamları henüz karar vermemiş müşteriye hizmeti tanıtır; Google ise 'lazer epilasyon Çankaya' gibi aktif arayan müşteriyi yakalar. Çoğu merkez için en iyi sonuç ikisinin dengeli kullanımından gelir.",
    },
    {
      q: "Boş randevu saatlerimi nasıl doldurabilirsiniz?",
      a: "Gün ve saate göre kampanya kurarak: hafta içi öğle, akşam ve hafta sonu öncesi gibi boş saatlerde reklamı yoğunlaştırır, doluluk arttığında kısarız. Reklam ayrıca randevu akışıyla birlikte düşünülmeli; gelen talebe hızlı yanıt dönüşümü belirler.",
    },
    {
      q: "Reklam bütçesi ne kadar olmalı?",
      a: "Hizmet sayısına, bölgeye ve doluluk hedefine göre değişir; ücretsiz görüşmede netleştiririz. Bütçe doğrudan Meta ve Google'a ödenir, bütçenizden komisyon almayız.",
    },
    {
      q: "Çekim için salonumuza gelmeniz gerekiyor mu?",
      a: "Zorunlu değil. Kendi çektiğiniz fotoğraf ve videoları reklama uygun hale getirebilir, yapay zeka destekli içerikle destekleyebiliriz. İsterseniz çekimi ayrı bir anlaşmayla yaparız.",
    },
    {
      q: "Satış veya randevu garantisi veriyor musunuz?",
      a: "Hayır. Hiçbir ajans belirli bir sonucu garanti edemez. Şeffaf raporlama, test disiplini ve dürüst iletişimi taahhüt ederiz.",
    },
  ],
  related: [
    SAGLIK_LINK,
    { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" },
    { href: "/hizmetler/google-reklamlari", label: "Google Reklamları" },
    { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi" },
    { href: "/blog/guzellik-merkezleri-icin-google-haritalar-ve-instagram-rehberi", label: "Güzellik Merkezleri İçin Google Haritalar ve Instagram Rehberi" },
    DENETIM,
  ],
  serviceName: "Güzellik Merkezi Reklam ve Sosyal Medya Yönetimi",
  areaServed: ["Ankara", "Türkiye"],
  breadcrumbLabel: "Güzellik Merkezi Reklam Ajansı",
  waText: "Merhaba, güzellik merkezim için reklam ve sosyal medya hizmeti almak istiyorum.",
  ctaTitle: "Güzellik Merkeziniz İçin Ücretsiz Analiz",
  ctaText:
    "Instagram hesabınızı, Google İşletme Profilinizi ve çevrenizdeki rakipleri inceleyip randevu defterinizi dolduracak yol haritasını 24-48 saat içinde paylaşalım.",
  linkLabel: "Güzellik Merkezi",
  parent: { name: "Hizmetlerimiz", path: "/#hizmetler", ctaLabel: "Hizmetlerimiz" },
  serviceType: "Güzellik merkezleri için sosyal medya yönetimi, Meta ve Google reklamları, yerel SEO",
  audienceType: "Güzellik merkezleri, güzellik salonları, lazer epilasyon merkezleri ve spa işletmeleri",
  video: VIDEO,
};

// ───────────────────────── E-TİCARET ─────────────────────────

export const ETICARET: LandingContent = {
  path: "/e-ticaret-reklam-ajansi",
  kind: "hizmet",
  metaTitle: "E-Ticaret Reklam Ajansı — Meta, Google Alışveriş ve Dönüşüm Takibi | Ankara | markaizi",
  metaDescription:
    "E-ticaret siteleri için Meta (Instagram, Facebook) ve Google Ads yönetimi: ürün feed'i, Google Alışveriş, Performance Max, katalog reklamı, Conversions API ve ROAS odaklı raporlama. Ankara merkezli, Türkiye geneli e-ticaret reklam ajansı.",
  keywords:
    "e-ticaret reklam ajansı, e-ticaret google ads, e-ticaret meta reklamı, google alışveriş reklamı, performance max, ikas shopify reklam yönetimi, e-ticaret roas, ankara e-ticaret ajansı, e-ticaret dönüşüm takibi, katalog reklamı",
  tag: "E-Ticaret",
  h1Plain: "E-Ticaret",
  h1Accent: "Reklam Ajansı",
  lead: [
    "E-ticarette reklamın sonucu net bir sayıdır: harcadığınız her liranın kaç lira ciro ve kaç lira kâr getirdiği. Bu sayıyı doğru görmek, reklam yönetiminin yarısıdır; çünkü yanlış ölçülen bir hesapta en iyi görünen kampanya çoğu zaman en çok zarar ettirendir.",
    "markaizi, e-ticaret siteleri için Meta ve Google reklamlarını ürün, marj ve ölçüm odaklı yönetir. Aynı yaklaşımı mobilya e-ticaretinde de kullanıyoruz; o alandaki çalışmamız için mobilya e-ticaret sayfamıza bakabilirsiniz.",
  ],
  sections: [
    {
      h2: "Önce Ölçüm: Hangi Satış Hangi Reklamdan Geldi?",
      paragraphs: [
        "E-ticaret hesabında ilk iş, satışın reklama doğru bağlandığından emin olmak. Meta Pixel, Conversions API, Google Etiket Yöneticisi, GA4 ve Google Ads dönüşüm takibi sitenizin altyapısına (ikas, Shopify, WooCommerce, Ticimax vb.) göre kurulur ve test edilir. Eksik ya da çift sayılan satış, tüm optimizasyonu yanlış yöne çeker.",
        "Çerez onayı ve KVKK, ölçüm kurulumunun parçasıdır: onay verilmeyen ziyaretçilerden gelen veri kaybını azaltmak için sunucu tarafı ölçümü ve doğru onay akışı kullanılır.",
      ],
      bullets: [
        "Satın alma, sepete ekleme ve ödeme başlatma olaylarının doğrulanması",
        "Meta Conversions API ve tarayıcı pikselinin tekilleştirilmesi",
        "Google Ads dönüşümlerinin GA4 ile karşılaştırılması",
        "ROAS yerine mümkünse kâr üzerinden değerlendirme",
      ],
    },
    {
      h2: "Google: Alışveriş, Performance Max ve Arama",
      paragraphs: [
        "E-ticarette Google'ın üç ana ayağı var: Alışveriş (Shopping) kampanyaları ürünü fiyatı ve fotoğrafıyla sonuçlarda gösterir; Performance Max bunu Google'ın tüm yüzeylerine yayar; Arama kampanyaları ise marka ve yüksek niyetli aramaları yakalar.",
        "Bu kampanyaların kalitesi büyük ölçüde ürün feed'ine bağlıdır: başlık, kategori, görsel ve stok bilgisi. Feed'in Merchant Center'da temiz ve güncel tutulması, reklam yönetiminin ayrılmaz parçasıdır.",
      ],
    },
    {
      h2: "Meta: Katalog, Yeniden Hedefleme ve Yeni Müşteri",
      paragraphs: [
        "Meta, e-ticarette hem yeni müşteri bulmak hem de sitede ürüne bakıp çıkanı geri getirmek için kullanılır. Katalog reklamları, ziyaretçiye baktığı ürünü otomatik gösterir. Yeni müşteri kampanyalarında ise kreatif belirleyicidir: ürünü gerçek kullanımda gösteren kısa video, düz ürün fotoğrafından çoğu zaman daha iyi çalışır.",
        "Meta'nın yapay zekâ odaklı sisteminde hedeflemeden çok doğru ölçüm, doğru teklif ve düzenli kreatif yenilemesi sonucu belirler.",
      ],
    },
    {
      h2: "1 Ağustos 2026 Kuralları: Reklam ve Fiyat Dili",
      paragraphs: [
        "Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği'ndeki değişiklikler 1 Ağustos 2026'da yürürlüğe girdi. E-ticaret reklamını doğrudan ilgilendirenler: indirim öncesi fiyat, indirimin başlangıcından önceki 10 gündeki en düşük fiyattır ve her satış kanalı kendi fiyat geçmişiyle değerlendirilir; ürün yorumlarını yalnızca ürünü satın alanlar yazabilir; sahte yorum yasaktır; yapay zekâ ile üretilmiş karakter ya da kişi, satın alma kararını etkileyecekse belirtilmelidir; influencer paylaşımlarında 'Reklam' veya 'Tanıtım' etiketi zorunludur.",
        "Reklam metinlerinde ve ürün sayfalarında 'şimdiye kadarki en düşük fiyat' ya da üstü çizili eski fiyat gibi ifadeleri bu kurala göre kurmak gerekir. Bu bölüm genel bilgilendirmedir, hukuki danışmanlık değildir; ayrıntı için yönetmelik metnine bakın.",
      ],
    },
    {
      h2: "Raporlama: Ciro, Maliyet ve Kâr",
      paragraphs: [
        "Aylık raporda harcama, ciro, sipariş sayısı, sipariş başına maliyet, ROAS ve kanal karşılaştırması sade bir dille yer alır. Hedefimiz 'ROAS yüksek' demek değil, hangi ürün grubuna ve hangi kanala bütçe kaydırırsanız kârınızın artacağını göstermek.",
        "Başabaş ROAS'ınızı (1 ÷ brüt kâr marjı) hesaplamak için ücretsiz reklam bütçesi hesaplayıcımızı kullanabilirsiniz.",
      ],
    },
  ],
  faq: [
    {
      q: "Hangi e-ticaret altyapılarıyla çalışabiliyorsunuz?",
      a: "Pixel, GTM ve ürün feed'i kurulumu sitenizin altyapısına göre yapılır; ikas, Shopify, WooCommerce, Ticimax gibi yaygın altyapılarda çalışabiliyoruz. Kesin kurulum yolu altyapıya göre değiştiği için ücretsiz görüşmede sitenizi inceleriz.",
    },
    {
      q: "Pazaryeri (Trendyol, Hepsiburada) reklamını da yapıyor musunuz?",
      a: "Ana odağımız kendi e-ticaret sitenize yönelik Meta ve Google reklamlarıdır. Pazaryeri içi reklam için ayrıca konuşmamız gerekir; görüşmede ihtiyacınızı netleştirelim.",
    },
    {
      q: "ROAS mı kâr mı takip etmeliyim?",
      a: "ROAS tek başına yanıltıcıdır; ürün marjı, iade ve kargo maliyeti dahil edilmediğinde yüksek ROAS'lı bir kampanya zarar ettiriyor olabilir. Mümkünse kâr üzerinden değerlendirme kurarız; başabaş ROAS'ı hesaplamak ilk adımdır.",
    },
    {
      q: "Reklam bütçesi nasıl belirlenir?",
      a: "Hedef satış, ortalama sepet, marj ve dönüşüm oranından geriye doğru hesaplanır. Ücretsiz bütçe hesaplayıcımız bu işin ilk adımıdır; ayrıntıyı görüşmede netleştiririz.",
    },
    {
      q: "Mevcut reklam hesabımızı denetleyebilir misiniz?",
      a: "Evet. Ücretsiz hesap denetimimiz yalnızca görüntüleme yetkisiyle yapılır, şifre istemez ve bağlayıcı değildir. Ölçüm hatalarını, kampanya yapısını ve harcama verimini yazılı raporlarız.",
    },
    {
      q: "Reklam için çekim yapmanız gerekiyor mu?",
      a: "Hayır. Mevcut ürün fotoğraflarınızla çalışabilir, yapay zeka destekli içerikle destekleyebiliriz. Çekim isterseniz ayrı bir anlaşmayla yaparız.",
    },
  ],
  related: [
    { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" },
    { href: "/hizmetler/google-reklamlari", label: "Google Reklamları" },
    DONUSUM,
    { href: "/araclar/reklam-butcesi-hesaplayici", label: "Reklam Bütçesi Hesaplayıcı" },
    { href: "/mobilya-e-ticaret-danismanligi", label: "Mobilya E-Ticaret Danışmanlığı" },
    { href: "/blog/e-ticarette-indirim-yorum-ve-yapay-zeka-reklam-kurallari-2026", label: "E-Ticaret Reklam Kuralları 2026" },
    DENETIM,
  ],
  serviceName: "E-Ticaret Meta ve Google Reklam Yönetimi",
  areaServed: ["Ankara", "Türkiye"],
  breadcrumbLabel: "E-Ticaret Reklam Ajansı",
  waText: "Merhaba, e-ticaret sitem için Meta ve Google reklam yönetimi hakkında görüşmek istiyorum.",
  ctaTitle: "E-Ticaret Hesabınız İçin Ücretsiz İnceleme",
  ctaText:
    "Meta ve Google hesaplarınızı, ölçüm kurulumunuzu ve harcama verimini inceleyip yazılı olarak paylaşalım. Bağlayıcı değildir.",
  linkLabel: "E-Ticaret",
  parent: { name: "Meta Reklamları", path: "/hizmetler/meta-reklamlari", ctaLabel: "Meta Reklamları" },
  serviceType: "E-ticaret siteleri için Meta ve Google reklam yönetimi, ürün feed'i ve dönüşüm takibi",
  audienceType: "E-ticaret siteleri ve online satış yapan markalar",
  video: VIDEO,
};

// ───────────────────────── GETAT ─────────────────────────

export const GETAT: LandingContent = {
  path: "/getat-merkezi-dijital-pazarlama",
  kind: "hizmet",
  metaTitle: "GETAT Merkezi Dijital Pazarlama — Geleneksel ve Tamamlayıcı Tıp Tanıtım Kuralları | markaizi",
  metaDescription:
    "Geleneksel ve tamamlayıcı tıp (GETAT) merkezleri için mevzuata uygun dijital pazarlama: web sitesi, Google İşletme Profili, bilgilendirme içeriği. GETAT tanıtımında nelere dikkat edilir, ne yapılır, ne yapılmaz.",
  keywords:
    "getat tanıtım, getat merkezi dijital pazarlama, geleneksel tamamlayıcı tıp tanıtım kuralları, hacamat merkezi tanıtım, akupunktur merkezi web sitesi, getat reklam yasağı, tamamlayıcı tıp sosyal medya",
  tag: "Sağlık",
  h1Plain: "GETAT Merkezi",
  h1Accent: "Dijital Pazarlama",
  lead: [
    "Geleneksel ve tamamlayıcı tıp (GETAT) merkezleri için dijital pazarlamanın ilk kuralı, ne yapılamayacağını bilmektir. Bu alanda abartılı vaat, fiyat/kampanya duyurusu ve 'alternatif tıp' gibi ifadeler hem idari yaptırım hem de platform kısıtı riski taşır.",
    "Bu sayfa GETAT merkezleri ve bu alanda çalışan hekimler için. Yapılabilecekleri, yapılamayacakları ve markaizi'nin bu çerçevede nasıl çalıştığını anlatıyoruz. Metin genel bilgilendirmedir; hukuki danışmanlık değildir.",
  ],
  sections: [
    {
      h2: "GETAT Nedir, Kim Yapabilir?",
      paragraphs: [
        "GETAT, Sağlık Bakanlığı'nın yetkilendirdiği geleneksel ve tamamlayıcı tıp uygulamalarını ifade eder. Kaynaklara göre bu uygulamalar yalnızca Bakanlıkça belirlenen listedeki yöntemlerle, sertifikalı uygulayıcılarca ve yetkilendirilmiş birimlerde yapılabilir. Hacamat gibi invaziv işlemlerin güzellik salonlarında veya evlerde yapılması yasaktır.",
        "Bu nedenle bir GETAT merkezinin dijital varlığı, önce yetkisini ve uygulayıcının niteliğini doğru ve açık biçimde anlatmalıdır. Yetkisi olmayan bir uygulamayı tanıtmak, kâğıt üzerinde bir reklam sorunu olmaktan çok daha büyük bir hukuki sorundur.",
      ],
    },
    {
      h2: "Tanıtımda Nelere Dikkat Edilir?",
      paragraphs: [
        "Sağlık hizmetlerinde tanıtım, 12 Kasım 2025 tarihli yönetmelikle yeniden düzenlendi. Hukuk kaynaklarının özetlerine göre GETAT tanıtımlarında da fiyat ve kampanya bilgisi verilememesi, hasta teşekkürlerinin reklam niteliğinde paylaşılmaması ve yorum ile beğenilerin kapatılması gibi kurallar gündeme geliyor. Yönetmelik metninin GETAT'ı ayrıca anıp anmadığı kaynaklar arasında farklılık gösteriyor; bu yüzden kesin kapsamı il sağlık müdürlüğünüzden ve hukuk danışmanınızdan teyit etmenizi öneririz.",
      ],
      bullets: [
        "'Alternatif tıp' gibi modern tıbbın yerine geçme izlenimi veren ifadeler kullanılmaz",
        "'Tedavi eder', 'kesin çözüm', 'garantili' gibi iddialardan kaçınılır",
        "Ücret, indirim, kampanya ve hediye duyurusu yapılmaz",
        "Hasta teşekkürü ve memnuniyet ifadeleriyle reklam niteliğinde paylaşım yapılmaz",
        "Öncesi-sonrası görseli ancak yönetmelikteki koşullarla (tarih, aynı ortam, rıza, uyarı metni) kullanılabilir",
        "Uygulayıcının unvanı ve yetkisi doğru ve eksiksiz yazılır",
      ],
    },
    {
      h2: "Bu Çerçevede Ne Yapabiliriz?",
      paragraphs: [
        "Çalışmamız bilgilendirme, görünürlük ve güven üzerine kurulur; vaat üzerine değil.",
      ],
      bullets: [
        "Uygulama bilgilendirme sayfaları: yöntem nedir, kimlere uygulanır, kimlere uygulanmaz, süreç nasıl işler",
        "Uygulayıcı sayfası: unvan, eğitim, yetki ve çalışma alanı",
        "Google İşletme Profili: doğru kategori, hizmet listesi, çalışma saatleri ve iletişim",
        "Yerel SEO: 'Ankara hacamat merkezi', 'akupunktur Ankara' gibi aramalarda doğru ve tutarlı görünürlük",
        "Hasta bilgilendirme SSS'i ve randevu akışı (WhatsApp, telefon)",
        "Sosyal medyada fiyat ve vaat içermeyen, bilgilendirme odaklı içerik takvimi",
      ],
    },
    {
      h2: "Ne Yapmayız?",
      paragraphs: [
        "Tedavi iddiası içeren, hasta yorumunu reklam malzemesi yapan, fiyat ve kampanya duyuran ya da yetkisi olmayan bir uygulamayı tanıtan çalışmaları üstlenmeyiz. Bu hem mevzuat hem de Meta ve Google politikaları açısından hesabınızı ve itibarınızı riske atar. Böyle bir talep geldiğinde nedenini açıklar ve alternatif bir yol öneririz.",
      ],
    },
    {
      h2: "Meta ve Google Politikaları",
      paragraphs: [
        "Meta ve Google, sağlıkla ilgili reklamlarda ek kurallar uygular ve tıbbi iddia içeren reklamları reddeder. Ayrıca sağlık tesisleri için sponsorlu tanıtımın yönetmelikle kısıtlı olduğu bildirildiğinden, GETAT merkezleri için ücretli reklamdan önce hukuki durumun netleştirilmesi gerekir. Bu nedenle çoğu merkez için en güvenli ve kalıcı yatırım, web sitesi, yerel SEO ve Google İşletme Profili'dir.",
      ],
    },
  ],
  faq: [
    {
      q: "GETAT merkezi sosyal medyada reklam verebilir mi?",
      a: "Bu, merkezin hukuki durumuna ve yönetmeliğin kapsamına bağlı. Sağlık tesisleri için sponsorlu tanıtımın genel olarak kısıtlı olduğu bildiriliyor. Ücretli reklama başlamadan önce il sağlık müdürlüğünüzden ve hukuk danışmanınızdan teyit almanızı öneririz.",
    },
    {
      q: "'Alternatif tıp' ifadesini kullanabilir miyim?",
      a: "Hukuk ve danışmanlık kaynakları bu ifadenin modern tıbbın yerine geçme izlenimi verdiği için denetimde sık sorun çıkardığını belirtiyor. 'Geleneksel ve tamamlayıcı tıp' ifadesini ve uygulamanın tam adını kullanmanızı öneririz.",
    },
    {
      q: "Hacamat merkezi reklamı nasıl yapılır?",
      a: "Hacamat yalnızca yetkili sağlık meslek mensuplarınca ve yetkilendirilmiş birimlerde uygulanabilir. Tanıtımda tedavi iddiası, fiyat ve kampanya duyurusu yapılmaz; bilgilendirme odaklı web sitesi, Google İşletme Profili ve yerel SEO en güvenli yoldur.",
    },
    {
      q: "Hasta yorumlarını sitemde gösterebilir miyim?",
      a: "Hasta veya yakınlarının teşekkür ve memnuniyet ifadeleriyle reklam niteliğinde paylaşım yapılması yönetmelikle yasaklandı. Yorumları kendi sayfanızda reklam malzemesi olarak kullanmamanızı öneririz.",
    },
    {
      q: "Fiyat listesi paylaşabilir miyim?",
      a: "Kaynaklara göre sağlık tanıtımlarında ücret, indirim ve kampanya bilgisi verilemez. Fiyat sorulduğunda iletişim kanalınızdan bireysel bilgi vermek farklı bir konudur; kesin sınırı hukuk danışmanınızla netleştirin.",
    },
    {
      q: "Siz mevzuat danışmanlığı veriyor musunuz?",
      a: "Hayır. Hukuki danışmanlık vermeyiz. Çalışmayı kamuya açık mevzuat özetlerine göre kurar, kesin sorular için hukuk danışmanınıza yönlendiririz.",
    },
  ],
  related: [
    SAGLIK_LINK,
    GUZELLIK_LINK,
    { href: "/hizmetler/web-tasarim-hosting", label: "Web Tasarım & Hosting" },
    { href: "/blog/saglikta-tanitim-ve-bilgilendirme-yonetmeligi-rehberi", label: "Sağlıkta Tanıtım Yönetmeliği Rehberi" },
    { href: "/blog/kafe-restoran-google-haritalar-rehberi", label: "Google Haritalar Rehberi" },
  ],
  serviceName: "GETAT Merkezleri İçin Mevzuata Uygun Dijital Pazarlama",
  areaServed: ["Ankara", "Türkiye"],
  breadcrumbLabel: "GETAT Merkezi Dijital Pazarlama",
  waText: "Merhaba, GETAT merkezim için mevzuata uygun dijital pazarlama hakkında görüşmek istiyorum.",
  ctaTitle: "GETAT Merkeziniz İçin Ücretsiz Görüşme",
  ctaText:
    "Web siteniz ve Google İşletme Profilinizi inceleyip mevzuata uygun bir yol haritasını paylaşalım. Görüşme ücretsiz, karar sizin.",
  linkLabel: "GETAT Merkezi",
  parent: SAGLIK,
  serviceType: "GETAT merkezleri için web sitesi, yerel SEO ve bilgilendirme odaklı dijital pazarlama",
  audienceType: "Geleneksel ve tamamlayıcı tıp (GETAT) merkezleri ve bu alanda çalışan hekimler",
};

export const SEKTOR_PAGES = [GUZELLIK, ETICARET, GETAT];
