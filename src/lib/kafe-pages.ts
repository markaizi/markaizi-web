// Ankara kafe & restoran sektör sayfaları. Her ilçe sayfası o ilçenin yeme-içme
// dinamiğine göre ayrı yazılmıştır — ilçe adı değiştirilmiş kopya içerik değildir.
// Yeni ilçe eklemeden önce o ilçeye özgü gerçekten farklı bir hikâye olduğundan
// emin ol; yoksa ilçeyi yalnızca ana sayfadaki listede bırak.

import type { LandingContent } from "@/lib/mobilya-pages";

export const KAFE_HUB = {
  path: "/ankara-kafe-restoran-reklam-ajansi",
  name: "Ankara Kafe & Restoran Reklam Ajansı",
};

// Ankara'nın 25 ilçesi — ana sayfada hepsi listelenir; sayfası olanlar linklenir.
export const ANKARA_ILCELER = [
  "Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ",
  "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan", "Kalecik", "Keçiören",
  "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle",
];

const PARENT = { name: KAFE_HUB.name, path: KAFE_HUB.path, ctaLabel: "Tüm Kafe & Restoran Hizmetleri" };
const SERVICE_TYPE = "Kafe ve restoranlar için sosyal medya yönetimi, reklam ve yerel SEO";
const AUDIENCE = "Kafeler, restoranlar, kahvaltı salonları, pastaneler ve yeme-içme işletmeleri";
const VIDEO = { slug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi", text: "Reklamın neden tek başına masayı doldurmadığını videoda anlattık." };
const HUB_LINK = { href: KAFE_HUB.path, label: "Ankara Kafe & Restoran Reklam Ajansı" };
const BLOG_ACILIS = { href: "/blog/ankara-kafe-acilis-dijital-pazarlama-rehberi", label: "Kafe Açılışı İçin Dijital Pazarlama Rehberi" };
const BLOG_HARITA = { href: "/blog/kafe-restoran-google-haritalar-rehberi", label: "Kafe & Restoran Google Haritalar Rehberi" };

function district(
  slug: string,
  ilce: string,
  ilceAyrilma: string, // "Gölbaşı'nda" gibi bulunma hâli
  c: Omit<LandingContent, "path" | "kind" | "tag" | "h1Plain" | "h1Accent" | "areaServed" | "breadcrumbLabel" | "linkLabel" | "parent" | "serviceType" | "audienceType" | "video">,
): LandingContent {
  return {
    ...c,
    path: `/${slug}-kafe-restoran-reklam-ajansi`,
    kind: "sehir",
    tag: `${ilce} / Ankara`,
    h1Plain: ilce,
    h1Accent: "Kafe & Restoran Reklam Ajansı",
    areaServed: [`${ilce}, Ankara`],
    breadcrumbLabel: `${ilce} Kafe & Restoran`,
    linkLabel: ilce,
    parent: PARENT,
    serviceType: SERVICE_TYPE,
    audienceType: `${ilceAyrilma} ${AUDIENCE.toLocaleLowerCase("tr-TR")}`,
    video: VIDEO,
  };
}

export const CANKAYA = district("cankaya", "Çankaya", "Çankaya'daki", {
  metaTitle: "Çankaya Kafe & Restoran Reklam Ajansı — Kızılay, Tunalı, Bahçelievler | markaizi",
  metaDescription:
    "Çankaya'daki kafe ve restoranlar için Instagram reklamı, sosyal medya yönetimi ve Google Haritalar. Kızılay, Tunalı Hilmi, Bahçelievler, Ayrancı ve Çukurambar'ın yoğun rekabetinde öne çıkın.",
  keywords:
    "çankaya kafe reklam ajansı, çankaya restoran sosyal medya, kızılay kafe instagram reklamı, tunalı kafe sosyal medya yönetimi, bahçelievler kafe reklam, çukurambar restoran reklamı, çankaya sosyal medya ajansı, ankara çankaya cafe reklam",
  lead: [
    "Ankara'da yeme-içmenin en kalabalık ve en rekabetçi yeri Çankaya. Kızılay'da, Tunalı Hilmi'de, Bahçelievler 7. Cadde'de ya da Çukurambar'da aynı sokakta onlarca kafe ve restoran aynı müşteriye sesleniyor. Burada yeni bir mekânın fark edilmesi de, eski bir mekânın unutulmaması da tesadüfe bırakılamayacak kadar zor.",
    "markaizi Ankara merkezli bir ajans; Çankaya'daki mekânınıza çekim ve görüşme için kısa sürede gelebiliyoruz. Bu sayfada Çankaya'daki bir kafe ya da restoranın dijitalde nasıl ayrışabileceğini anlatıyoruz.",
  ],
  sections: [
    {
      h2: "Aynı Caddede On Kafe: Farkınızı Görünür Kılmak",
      paragraphs: [
        "Çankaya'da müşteri 'kafeye gideyim' diye değil, 'şu kafeye gideyim' diye yola çıkıyor. Instagram'da gördüğü bir tatlı, arkadaşının story'sinde denk geldiği bir köşe ya da Google'daki yüksek puan onu tek bir mekâna yönlendiriyor. Kahvenin iyi olması yetmiyor; o farkın ekranda görünür olması gerekiyor.",
        "Bu yüzden Çankaya'daki mekânlarla çalışırken önce 'sizi neden seçsinler' sorusunu cevaplıyoruz: imza bir ürün mü, çalışmaya uygun sessiz bir köşe mi, geç saate kadar açık olmak mı, uygun fiyatlı öğle menüsü mü? İçerik ve reklam bu tek cümlenin etrafında kuruluyor.",
      ],
    },
    {
      h2: "Öğrenci, Beyaz Yaka ve Akşam Kalabalığı",
      paragraphs: [
        "Çankaya'nın müşterisi gün içinde değişiyor. Sabah ve öğle saatlerinde plazalardaki beyaz yakalılar, gün boyu üniversite öğrencileri, akşamları ve hafta sonları arkadaş grupları ve aileler. Aynı reklamı günün her saatinde herkese göstermek, bütçenin büyük kısmını o saatte gelmeyecek kişiye harcamak demek.",
        "Reklamları saat ve kitleye göre bölüyoruz: öğle menüsü reklamı iş yerlerine yakın konumlara öğle saatlerinden önce, akşam ve hafta sonu içerikleri daha geniş bir kitleye. Üniversite takvimini, sınav dönemlerini ve tatil aylarını da reklam planına yansıtıyoruz.",
      ],
      bullets: [
        "Konuma göre dar yarıçaplı reklam: mekânın çevresindeki birkaç kilometre",
        "Saate göre planlanan reklam: öğle, akşam ve hafta sonu ayrı",
        "Kitleye göre ayrı mesaj: öğrenci, çalışan, arkadaş grubu, aile",
      ],
    },
    {
      h2: "Semt Adıyla Yapılan Aramalar",
      paragraphs: [
        "Çankaya'da insanlar ilçe adıyla değil semt adıyla arıyor: 'Kızılay kafe', 'Tunalı kahvaltı', 'Bahçelievler tatlıcı', 'Çukurambar restoran'. Google Haritalar'da bu aramalarda ilk sıralarda çıkmak, reklam vermeden gelen en değerli müşteri kaynağı. Bunun için işletme profilinizin doğru kategoride, güncel menü ve fotoğraflarla, düzenli yorum akışıyla ve yorumlara verilen yanıtlarla canlı tutulması gerekiyor.",
      ],
    },
    {
      h2: "Reklam Getirir, Deneyim Tutar",
      paragraphs: [
        "Çankaya'da bir müşteri kötü bir deneyimi Google'a yazdığında, o yorum aynı hafta onlarca kişinin karar ekranına düşüyor. Reklam yeni müşteriyi getiriyor ama geri gelip gelmeyeceğini servis, bekleme süresi ve yorumlara verilen yanıt belirliyor. Bu yüzden raporlarımızda yalnızca erişime değil, gelen yorumlara ve puan değişimine de bakıyoruz.",
      ],
    },
  ],
  faq: [
    {
      q: "Çankaya'daki kafem için reklamı hangi bölgeye göstermeliyiz?",
      a: "Kafeler için genellikle mekânın çevresindeki birkaç kilometrelik bir yarıçap en verimli başlangıçtır; insanlar yakın ve kolay ulaşılır yerleri tercih eder. Bahçelievler ya da Tunalı gibi uzaktan gelinen popüler bölgelerde yarıçap biraz genişletilebilir. Doğru mesafeyi ilk haftaların verisine göre ayarlıyoruz.",
    },
    {
      q: "Çankaya'da rekabet çok yüksek, küçük bir kafe reklamla fark edilebilir mi?",
      a: "Evet, ama herkesle aynı şeyi söyleyerek değil. Küçük bir kafenin gücü genellikle belirgin bir farkıdır: imza bir ürün, sakin bir çalışma ortamı, sıcak bir sahip hikâyesi. Bu farkı öne çıkaran içerik ve dar hedefli reklam, büyük zincirlerle bütçe yarıştırmaktan çok daha etkilidir.",
    },
    {
      q: "Çekim için mekânımıza geliyor musunuz?",
      a: "Evet. Ankara merkezli olduğumuz için Çankaya'daki mekânınızda yemek, içecek ve mekân çekimini planlayıp geliyoruz. Çekimi genellikle mekânın en iyi ışık aldığı ve en canlı göründüğü saate göre ayarlıyoruz.",
    },
    {
      q: "Öğrencilere yönelik kampanyaları nasıl duyurmalıyız?",
      a: "Öğrenci kampanyaları için Instagram ve TikTok'ta kısa, net videolar ve konuma yakın öğrencilere gösterilen reklamlar iyi çalışır. Kampanyanın ne olduğunu ilk saniyede söyleyen bir içerik, uzun bir afiş tasarımından daha fazla etki yaratır.",
    },
  ],
  related: [HUB_LINK, BLOG_HARITA, { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" }],
  waText: "Merhaba, Çankaya'daki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Çankaya'daki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Instagram hesabınızı, Google profilinizi ve çevrenizdeki rakipleri inceleyip size özel yol haritasını 24 saat içinde paylaşalım.",
  serviceName: "Çankaya Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const GOLBASI = district("golbasi", "Gölbaşı", "Gölbaşı'ndaki", {
  metaTitle: "Gölbaşı Kafe & Restoran Reklam Ajansı — Ankara Gölbaşı Sosyal Medya | markaizi",
  metaDescription:
    "Ankara Gölbaşı'ndaki kafe, restoran ve kahvaltı mekânları için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Mogan Gölü çevresi, hafta sonu kahvaltısı ve şehir merkezinden gelen misafir için.",
  keywords:
    "gölbaşı kafe reklam ajansı, gölbaşı sosyal medya ajansı, gölbaşı restoran reklamı, gölbaşı cafe instagram reklamı, gölbaşı kahvaltı mekanı reklam, mogan kafe sosyal medya, ankara gölbaşı reklam ajansı, gölbaşı dijital ajans",
  lead: [
    "Gölbaşı'nda bir kafe ya da restoran işletiyorsanız müşterinizin büyük kısmı muhtemelen Gölbaşı'nda oturmuyor. Hafta sonu kahvaltısı, göl kenarında bir akşam yemeği ya da şehirden kaçış için Çankaya'dan, Etimesgut'tan, Yenimahalle'den yola çıkan insanlar geliyor. Bu da Gölbaşı'ndaki bir mekânın reklamını, şehrin içindeki bir kafeden tamamen farklı kurmayı gerektiriyor.",
    "markaizi Ankara merkezli bir ajans; Gölbaşı'ndaki mekânınıza çekim ve görüşme için gelebiliyoruz. Bu sayfada Gölbaşı'ndaki yeme-içme işletmelerinin dijitalde nasıl daha çok misafir ağırlayabileceğini anlatıyoruz.",
  ],
  sections: [
    {
      h2: "Müşteriniz Yolda: Reklamı Geldikleri Yere Göstermek",
      paragraphs: [
        "Şehir içindeki bir kafe reklamını çevresindeki birkaç kilometreye gösterir. Gölbaşı'ndaki bir mekân içinse en değerli kitle çoğu zaman 20-30 dakikalık mesafedeki şehir merkezinde yaşıyor. Reklamın hedefini yalnızca Gölbaşı ile sınırlamak, hafta sonu gelecek misafirin büyük kısmını dışarıda bırakmak demek.",
        "Reklamları iki katmanda kuruyoruz: Gölbaşı ve çevresinde yaşayanlara günlük ve hafta içi içerikler; Ankara'nın merkez ilçelerine ise 'hafta sonu nereye gidelim' sorusuna cevap veren kahvaltı, manzara ve deneyim içerikleri. Bu ikinci kitleye reklamı hafta sonundan birkaç gün önce, plan yapılan saatlerde gösteriyoruz.",
      ],
    },
    {
      h2: "Manzara Satılır: Görselin Gölbaşı'ndaki Rolü",
      paragraphs: [
        "Gölbaşı'ndaki bir mekânın en güçlü kozu çoğu zaman menüsünden önce manzarası ve atmosferidir. Göl kenarındaki masa, gün batımı, kış sabahı sıcak bir kahvaltı sofrası: bunlar insanları yola çıkaran görüntüler. Çekimleri mekânın en iyi ışık aldığı saatlere ve mevsimin öne çıkan anlarına göre planlıyoruz; aynı mekân yazın ve kışın iki ayrı hikâye anlatabilir.",
      ],
    },
    {
      h2: "Hafta Sonu Dolu, Hafta İçi Sessiz mi?",
      paragraphs: [
        "Gölbaşı'ndaki birçok mekânın ortak sorunu hafta sonu yoğunluğu ile hafta içi sessizlik arasındaki uçurum. Reklam bütçesini hafta sonuna yığmak zaten dolu masalar için para harcamak olabilir. Bunun yerine hafta içi için ayrı bir teklif ve kitle kuruyoruz: yakın çevredeki iş yerleri ve siteler için öğle menüsü, hafta içi akşam kampanyası, doğum günü ve küçük davet organizasyonları.",
      ],
      bullets: [
        "Hafta sonu: şehir merkezine yönelik kahvaltı ve deneyim reklamları",
        "Hafta içi: yakın çevreye öğle ve akşam teklifleri",
        "Özel günler: doğum günü, nişan, küçük davet organizasyonları",
      ],
    },
    {
      h2: "'Gölbaşı Kahvaltı' Aramasında Görünmek",
      paragraphs: [
        "Gölbaşı'na gelmeyi düşünen kişi önce Google'da ya da Haritalar'da 'Gölbaşı kahvaltı', 'Mogan kahvaltı', 'Gölbaşı göl manzaralı restoran' gibi aramalar yapıyor. İşletme profilinizin doğru kategoride, bol ve güncel fotoğrafla, menü ve fiyat bilgisiyle ve düzenli yorumla dolu olması bu aramalarda öne çıkmanızı sağlıyor. Hafta sonu yol tarifi isteklerini ve aramaları profil istatistiklerinden düzenli takip ediyoruz.",
      ],
    },
  ],
  faq: [
    {
      q: "Gölbaşı'ndaki kafem için reklamı sadece Gölbaşı'na mı göstermeliyim?",
      a: "Genellikle hayır. Gölbaşı'ndaki mekânların hafta sonu misafirlerinin önemli kısmı Ankara'nın merkez ilçelerinden gelir. Reklamı hem Gölbaşı ve çevresine hem de şehir merkezine, farklı mesajlarla göstermek daha verimlidir.",
    },
    {
      q: "Hafta içi müşteri sayısını nasıl artırabiliriz?",
      a: "Hafta içi için ayrı bir teklif oluşturmak işe yarar: yakın çevredeki iş yerlerine öğle menüsü, hafta içi akşam kampanyası ya da küçük organizasyonlar. Bu teklifleri Gölbaşı ve yakın çevresindeki kişilere hafta içi saatlerde gösteriyoruz.",
    },
    {
      q: "Çekim için Gölbaşı'na geliyor musunuz?",
      a: "Evet. Ankara merkezli olduğumuz için Gölbaşı'ndaki mekânınızda çekim planlayabiliyoruz. Manzaranın öne çıktığı mekânlarda çekimi ışığın en iyi olduğu saate göre ayarlıyoruz.",
    },
    {
      q: "Kış aylarında Gölbaşı'nda müşteri azalıyor, reklam yine de mantıklı mı?",
      a: "Mevsim değiştiğinde mesajı da değiştirmek gerekir. Yazın göl kenarı ve açık hava öne çıkarken, kışın sıcak bir kahvaltı sofrası, şömine köşesi ya da kapalı alan konforu anlatılabilir. Bütçeyi talebin düştüğü aylarda azaltıp yoğun dönemlere kaydırmak da seçeneklerden biri.",
    },
  ],
  related: [HUB_LINK, BLOG_ACILIS, { href: "/hizmetler/video-cekimi-drone", label: "Video Çekimi & Drone" }],
  waText: "Merhaba, Gölbaşı'ndaki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Gölbaşı'ndaki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Hesabınızı, Google profilinizi ve hafta sonu/hafta içi dengenizi inceleyip size özel yol haritasını 24 saat içinde paylaşalım.",
  serviceName: "Gölbaşı Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const YENIMAHALLE = district("yenimahalle", "Yenimahalle", "Yenimahalle'deki", {
  metaTitle: "Yenimahalle Kafe & Restoran Reklam Ajansı — Batıkent Sosyal Medya | markaizi",
  metaDescription:
    "Yenimahalle ve Batıkent'teki kafe, restoran ve pastaneler için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Mahalle müşterisini müdavime çeviren dijital pazarlama.",
  keywords:
    "yenimahalle kafe reklam ajansı, batıkent kafe sosyal medya, yenimahalle restoran reklamı, batıkent restoran instagram reklamı, yenimahalle sosyal medya ajansı, ankara yenimahalle cafe reklam, batıkent pastane reklam",
  lead: [
    "Yenimahalle'de ve Batıkent'te bir kafe ya da restoranın müşterisi çoğunlukla komşusu: aynı sitede, aynı caddede ya da birkaç durak ötede oturan aileler. Burada başarı, bir kere gelen müşterinin haftada bir, iki kez geri gelmesinden geçiyor. Mahalle mekânının dijital pazarlaması da tam olarak bunun üzerine kurulmalı.",
    "markaizi Ankara merkezli bir ajans; Yenimahalle'deki mekânınıza çekim ve görüşme için gelebiliyoruz.",
  ],
  sections: [
    {
      h2: "Mahalle Mekânı, Müdavimle Yaşar",
      paragraphs: [
        "Şehrin popüler caddelerindeki bir kafe sürekli yeni müşteri arar; mahalle kafesi ise mevcut müşterisini kaybetmemeye bakar. Bu yüzden Yenimahalle'deki mekânlarda içerik, yeni takipçi kazanmaktan çok takipçinin aklında kalmaya odaklanıyor: günün çorbası, yeni çıkan tatlı, haftanın kampanyası, ustanın mutfaktan bir anı. Günlük story akışı, 'bugün ne yesek' sorusuna ilk akla gelen cevap olmanızı sağlıyor.",
      ],
    },
    {
      h2: "Yakın Çevreye Dar Hedefli Reklam",
      paragraphs: [
        "Mahalle mekânı için geniş kitleye reklam vermek çoğu zaman bütçe israfı. Reklamı mekânın çevresindeki sitelere ve yürüme, kısa sürüş mesafesindeki kişilere gösteriyoruz. Yeni açılışta, yeni menüde ya da hafta içi kampanyasında bu dar hedefleme, az bütçeyle mahalle halkının büyük kısmına ulaşmayı mümkün kılıyor.",
      ],
      bullets: [
        "Mekânın çevresine dar yarıçaplı reklam",
        "Aileleri hedefleyen hafta sonu ve akşam yemeği içerikleri",
        "Paket servis ve gel-al siparişi için WhatsApp'a yönlendiren reklamlar",
      ],
    },
    {
      h2: "Google Yorumları: Mahallenin Tavsiyesi",
      paragraphs: [
        "Mahallede bir mekânın ünü eskiden komşudan komşuya yayılırdı; bugün aynı tavsiye Google yorumlarında yazılıyor. Yeni taşınan bir aile, 'Batıkent restoran' ya da 'yakınımdaki pastane' diye aradığında önce puana ve yorumlara bakıyor. Memnun müşteriden yorum istemeyi bir alışkanlığa dönüştürmek ve her yoruma yanıt vermek, mahalle mekânının en ucuz ve en kalıcı reklamı.",
      ],
    },
  ],
  faq: [
    {
      q: "Mahalle kafesi için sosyal medya gerçekten gerekli mi?",
      a: "Evet, ama amaç farklı. Mahalle kafesinde sosyal medya yeni kitle kazanmaktan çok mevcut müşterinin aklında kalmayı sağlar. Günlük story'ler, yeni ürün duyuruları ve kampanyalar, insanların 'bugün nereye gidelim' diye düşündüğü anda sizi hatırlamasını sağlar.",
    },
    {
      q: "Paket servis siparişlerini artırmak için ne yapabiliriz?",
      a: "Reklamları doğrudan WhatsApp'a ya da telefona yönlendirmek, sipariş vermeyi tek adıma indirir. Menünün ve fiyatların Google profilinizde ve Instagram'da güncel olması da siparişe dönüşümü artırır.",
    },
    {
      q: "Az bütçeyle reklam vermek işe yarar mı?",
      a: "Mahalle mekânlarında evet, çünkü hedeflenen alan küçük. Dar yarıçaplı ve iyi bir içerikle kurulan reklam, sınırlı bütçeyle bile çevrenizdeki insanların önemli kısmına ulaşabilir.",
    },
  ],
  related: [HUB_LINK, BLOG_HARITA, { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi" }],
  waText: "Merhaba, Yenimahalle'deki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Yenimahalle'deki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Hesabınızı ve Google profilinizi inceleyip mahallenizdeki müşteriye nasıl daha sık ulaşabileceğinizi 24 saat içinde paylaşalım.",
  serviceName: "Yenimahalle Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const ETIMESGUT = district("etimesgut", "Etimesgut", "Etimesgut'taki", {
  metaTitle: "Etimesgut Kafe & Restoran Reklam Ajansı — Eryaman Sosyal Medya | markaizi",
  metaDescription:
    "Etimesgut ve Eryaman'daki kafe, restoran ve brunch mekânları için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Genç aileleri ve yeni yerleşim bölgelerini hedefleyen dijital pazarlama.",
  keywords:
    "etimesgut kafe reklam ajansı, eryaman kafe sosyal medya, etimesgut restoran reklamı, eryaman restoran instagram, etimesgut sosyal medya ajansı, ankara etimesgut cafe reklam, eryaman brunch mekanı reklam",
  lead: [
    "Etimesgut ve Eryaman, Ankara'nın hızla büyüyen, genç ailelerin yoğun olduğu bölgelerinden. Yeni siteler, yeni caddeler ve yeni açılan mekânlar bir arada. Bu, yeni bir kafe ya da restoran için büyük bir fırsat; çünkü bölgeye yeni taşınan birçok kişinin henüz 'bizim mekân' dediği bir yer yok.",
    "markaizi Ankara merkezli bir ajans; Etimesgut'taki mekânınıza çekim ve görüşme için gelebiliyoruz.",
  ],
  sections: [
    {
      h2: "Yeni Taşınanların İlk Tercihi Olmak",
      paragraphs: [
        "Yeni bir bölgeye taşınan aile, ilk haftalarda çevresini keşfediyor: nerede iyi kahvaltı var, hangi pastane güzel, çocukla nereye gidilir? Bu keşif çoğu zaman Instagram'da ve Google Haritalar'da yapılıyor. Bu dönemde karşısına çıkan mekân, uzun süre ailenin alışkanlığı haline gelebiliyor. Reklamları yeni yerleşim bölgelerine ve bölgedeki sitelere yönelik kuruyor, 'mahalleye hoş geldiniz' tadında içeriklerle bu ilk teması yakalıyoruz.",
      ],
    },
    {
      h2: "Çocuk Dostu Mekân, Güçlü Bir Mesajdır",
      paragraphs: [
        "Genç ailelerin yoğun olduğu bölgelerde 'çocukla rahat gidilir mi' sorusu, menüden önce sorulan soru olabiliyor. Oyun alanı, çocuk menüsü, mama sandalyesi, geniş oturma alanı gibi detaylar varsa bunlar içerikte ve Google profilinizde açıkça görünmeli. Aynı şekilde hafta sonu brunch'ı, aile kahvaltısı ve doğum günü organizasyonu gibi teklifler de bu kitlede iyi karşılık buluyor.",
      ],
      bullets: [
        "Çocuk dostu özellikleri öne çıkaran içerik ve profil bilgisi",
        "Hafta sonu aile kahvaltısı ve brunch reklamları",
        "Doğum günü ve küçük organizasyon teklifleri",
      ],
    },
    {
      h2: "Açılışı Sessiz Geçirmeyin",
      paragraphs: [
        "Etimesgut'ta yeni açılan mekân sayısı fazla ve açılış haftası, bir mekânın ilk izlenimini belirliyor. Açılıştan birkaç hafta önce başlayan bir 'yakında' içerik akışı, açılış günü için net bir teklif ve açılışın ilk haftasında bölgeye gösterilen reklamlar, ilk müşteri dalgasını oluşturuyor. İlk gelen müşterilerden Google yorumu istemek de profilin boş kalmamasını sağlıyor.",
      ],
    },
  ],
  faq: [
    {
      q: "Etimesgut'ta yeni açılan kafem için ilk ne yapmalıyım?",
      a: "Açılıştan önce Google İşletme Profilinizi ve Instagram hesabınızı hazır hale getirin, açılıştan birkaç hafta önce 'yakında' içerikleri paylaşmaya başlayın ve açılış haftası için net bir teklif belirleyin. Açılış haftasında bölgeye yönelik reklam, ilk müşteri dalgasını oluşturur.",
    },
    {
      q: "Reklamı Eryaman ile mi sınırlamalıyım?",
      a: "Mekânınızın konumuna göre değişir. Mahalle içindeki bir kafe için yakın çevre yeterliyken, geniş oturma alanı ve özel konsepti olan bir brunch mekânı için Etimesgut'un genelini ve Sincan gibi yakın ilçeleri de hedeflemek mantıklı olabilir.",
    },
    {
      q: "Çocuk dostu olduğumuzu nasıl duyurabiliriz?",
      a: "Hem Google İşletme Profilinizdeki özellikler kısmında hem de Instagram içeriklerinde açıkça gösterin: oyun alanı, çocuk menüsü, mama sandalyesi gibi. Ailelerin mekânda keyifle vakit geçirdiği kısa videolar bu mesajı en iyi anlatan içeriklerdir.",
    },
  ],
  related: [HUB_LINK, BLOG_ACILIS, { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" }],
  waText: "Merhaba, Etimesgut'taki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Etimesgut'taki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Hesabınızı ve Google profilinizi inceleyip bölgedeki yeni ailelere nasıl ulaşabileceğinizi 24 saat içinde paylaşalım.",
  serviceName: "Etimesgut Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const KECIOREN = district("kecioren", "Keçiören", "Keçiören'deki", {
  metaTitle: "Keçiören Kafe & Restoran Reklam Ajansı — Etlik Sosyal Medya | markaizi",
  metaDescription:
    "Keçiören ve Etlik'teki kafe, restoran, lokanta ve pastaneler için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Aile müşterisi, paket servis ve sezon kampanyaları için dijital pazarlama.",
  keywords:
    "keçiören kafe reklam ajansı, keçiören restoran sosyal medya, etlik kafe instagram reklamı, keçiören lokanta reklam, keçiören sosyal medya ajansı, ankara keçiören cafe reklam, etlik restoran reklamı",
  lead: [
    "Keçiören, Ankara'nın en kalabalık ilçelerinden biri ve yeme-içme tarafında aile müşterisinin ağırlıkta olduğu bir bölge. Burada bir restoranın başarısını çoğu zaman porsiyon, fiyat ve güven belirliyor; dijital pazarlama da bu üç konuyu açıkça anlatabilmeli.",
    "markaizi Ankara merkezli bir ajans; Keçiören'deki mekânınıza çekim ve görüşme için gelebiliyoruz.",
  ],
  sections: [
    {
      h2: "Fiyatı Saklamak Müşteri Kaybettirir",
      paragraphs: [
        "Aile müşterisi yemeğe çıkmadan önce hesabı kafasında yapar. Menüsü ve fiyatları görünmeyen bir mekân, bu hesabı yapamayan müşterinin listesinden çıkıyor. Keçiören'deki mekânlarda menü ve fiyatların Google profilinde ve Instagram'da güncel ve kolay bulunur olmasını, porsiyonun gerçek görüntüsünün paylaşılmasını öneriyoruz. Gerçekçi bir tabak fotoğrafı, abartılı bir görselden daha çok güven veriyor.",
      ],
    },
    {
      h2: "Paket Servis ve Gel-Al",
      paragraphs: [
        "Keçiören gibi kalabalık ilçelerde paket servis ve gel-al siparişleri, salon kadar önemli bir gelir kaynağı olabiliyor. Reklamları doğrudan telefona ya da WhatsApp'a yönlendirerek siparişi tek adıma indiriyoruz. Akşam yemeği saatinden önce gösterilen, günün menüsünü anlatan kısa bir video, sipariş kararını o anda verdirebiliyor.",
      ],
      bullets: [
        "Akşam yemeği öncesi saatlerde gösterilen sipariş reklamları",
        "Telefona ve WhatsApp'a tek dokunuşla yönlendirme",
        "Güncel menü ve fiyatın Google profilinde görünmesi",
      ],
    },
    {
      h2: "Sezon ve Özel Gün Planlaması",
      paragraphs: [
        "Ramazan ayındaki iftar menüleri, bayramlar, anneler günü ve okulların kapanışı gibi dönemler aile restoranları için yılın en yoğun zamanları. Bu dönemlerin reklam ve içerik planını birkaç hafta önceden hazırlıyor, rezervasyon ve ön siparişi erkenden topluyoruz. Son gün hazırlanan bir afiş, planlı bir kampanyanın yerini tutmuyor.",
      ],
    },
  ],
  faq: [
    {
      q: "Menü fiyatlarımızı sosyal medyada paylaşmalı mıyız?",
      a: "Aile müşterisinin yoğun olduğu bölgelerde genellikle evet. Fiyatı görmeyen müşteri kararını erteler ya da fiyatı görünen başka bir mekânı seçer. En azından Google İşletme Profilinizde güncel bir menü bulunmasını öneriyoruz.",
    },
    {
      q: "İftar dönemi için reklama ne zaman başlamalıyız?",
      a: "Ramazan'dan birkaç hafta önce içerik ve reklam planının hazır olması, rezervasyonları erken toplamanızı sağlar. İlk günlerden itibaren iftar menüsünü ve rezervasyon yolunu net anlatan reklamlar en iyi sonucu verir.",
    },
    {
      q: "Paket servis siparişi için reklam verilebilir mi?",
      a: "Evet. Reklamı doğrudan telefona ya da WhatsApp'a yönlendirerek sipariş vermeyi kolaylaştırıyoruz. Siparişin en çok düşündüğü saatlerden hemen önce yayında olan ve o günün yemeğini iştah açıcı gösteren bir içerik, kararı çoğu zaman o anda verdirir.",
    },
  ],
  related: [HUB_LINK, BLOG_HARITA, { href: "/hizmetler/google-reklamlari", label: "Google Reklamları" }],
  waText: "Merhaba, Keçiören'deki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Keçiören'deki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Hesabınızı, menü görünürlüğünüzü ve Google profilinizi inceleyip size özel yol haritasını 24 saat içinde paylaşalım.",
  serviceName: "Keçiören Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const ALTINDAG = district("altindag", "Altındağ", "Altındağ'daki", {
  metaTitle: "Altındağ Kafe & Restoran Reklam Ajansı — Ulus, Hamamönü, Kale | markaizi",
  metaDescription:
    "Altındağ'da Ulus, Hamamönü, Samanpazarı ve Ankara Kalesi çevresindeki kafe ve restoranlar için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Tarihi dokuda ziyaretçi çeken dijital pazarlama.",
  keywords:
    "altındağ kafe reklam ajansı, hamamönü kafe sosyal medya, ulus restoran reklamı, ankara kalesi kafe instagram, samanpazarı restoran reklam, altındağ sosyal medya ajansı, ankara altındağ cafe reklam",
  lead: [
    "Altındağ, Ankara'nın tarihi yüzü: Ankara Kalesi, Hamamönü'nün restore edilmiş sokakları, Samanpazarı ve Ulus. Buradaki kafe ve restoranların müşterisi büyük ölçüde ziyaretçi; şehrin başka ilçelerinden gezmeye gelen Ankaralılar, şehir dışından gelenler ve yabancı turistler. Bu ziyaretçiyi yola çıkmadan önce yakalamak gerekiyor.",
    "markaizi Ankara merkezli bir ajans; Altındağ'daki mekânınıza çekim ve görüşme için gelebiliyoruz.",
  ],
  sections: [
    {
      h2: "Ziyaretçi Önce Haritaya Bakar",
      paragraphs: [
        "Kaleyi gezen ya da Hamamönü'nde yürüyen bir ziyaretçi acıktığında telefonunu açıp 'yakınımdaki restoran' ya da 'Hamamönü kafe' diye arıyor. Tanımadığı bir yerde karar verirken tamamen puana, yorumlara ve fotoğraflara güveniyor. Bu yüzden Altındağ'daki bir mekân için Google İşletme Profili, çoğu zaman Instagram'dan bile önemli. Profilin doğru konumda, çalışma saatleri güncel, bol fotoğraflı ve menülü olması şart.",
      ],
    },
    {
      h2: "Tarihi Atmosfer, En Güçlü İçerik",
      paragraphs: [
        "Altındağ'daki mekânların rakiplerinden en büyük farkı çoğu zaman atmosfer: eski bir konak, taş duvarlar, kale manzarası, geleneksel lezzetler. İnsanlar yalnızca yemek yemeye değil, bu deneyimi yaşamaya ve paylaşmaya geliyor. Çekimlerde mekânın dokusunu, yerel yemeklerin hazırlanışını ve çevrenin tarihi atmosferini öne çıkarıyoruz.",
      ],
      bullets: [
        "Mekânın tarihi dokusunu ve manzarasını gösteren çekim",
        "Yerel ve geleneksel lezzetleri anlatan kısa videolar",
        "Hafta sonu gezisi planlayan Ankaralılara yönelik reklam",
      ],
    },
    {
      h2: "Yabancı Ziyaretçi İçin Küçük Dokunuşlar",
      paragraphs: [
        "Altındağ'a gelen yabancı turistler için Google profilinde İngilizce açıklama, fotoğraflı menü ve net çalışma saatleri, dil engelini aşmanın en kolay yolu. Yorumlara İngilizce yazılmışsa İngilizce yanıt vermek de profili okuyan diğer ziyaretçilere güven veriyor.",
      ],
    },
  ],
  faq: [
    {
      q: "Altındağ'daki mekânımız için Instagram mı Google mı daha önemli?",
      a: "İkisi de önemli ama ziyaretçi ağırlıklı bölgelerde Google İşletme Profili genellikle ilk sırada gelir; çünkü gezen kişi karar anında haritaya bakar. Instagram ise hafta sonu gezisi planlayan Ankaralıya mekânınızı önceden gösterir.",
    },
    {
      q: "Turistlere nasıl ulaşabiliriz?",
      a: "Google profilinizi eksiksiz ve güncel tutmak, İngilizce açıklama ve fotoğraflı menü eklemek, yorumlara düzenli yanıt vermek turist görünürlüğünü artırır. Konum ve saatlerin doğru olması en temel koşuldur.",
    },
    {
      q: "Hafta içi müşteri çok az, ne yapabiliriz?",
      a: "Hafta içi için yakın çevredeki iş yerlerine yönelik öğle menüsü ya da grup ve okul gezilerine yönelik teklifler düşünülebilir. Bu teklifleri hafta içi saatlerde ilgili kitleye gösteren reklamlar talebi dengelemeye yardımcı olur.",
    },
  ],
  related: [HUB_LINK, BLOG_HARITA, { href: "/hizmetler/video-cekimi-drone", label: "Video Çekimi & Drone" }],
  waText: "Merhaba, Altındağ'daki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Altındağ'daki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Google profilinizi ve hesabınızı inceleyip ziyaretçilere nasıl daha kolay ulaşabileceğinizi 24 saat içinde paylaşalım.",
  serviceName: "Altındağ Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const BEYPAZARI = district("beypazari", "Beypazarı", "Beypazarı'ndaki", {
  metaTitle: "Beypazarı Kafe & Restoran Reklam Ajansı — Kahvaltı ve Konak Mekânları | markaizi",
  metaDescription:
    "Beypazarı'ndaki kafe, restoran, kahvaltı ve konak mekânları için sosyal medya yönetimi, Instagram reklamı ve Google Haritalar. Ankara'dan günübirlik gelen ziyaretçiyi yola çıkmadan yakalayan dijital pazarlama.",
  keywords:
    "beypazarı kafe reklam ajansı, beypazarı restoran sosyal medya, beypazarı kahvaltı mekanı reklam, beypazarı konak restoran instagram, beypazarı sosyal medya ajansı, ankara beypazarı reklam",
  lead: [
    "Beypazarı, Ankara'nın en sevilen günübirlik kaçamaklarından biri. Tarihi evleri, çarşısı ve kahvaltı sofralarıyla hafta sonları Ankara'dan ve çevre illerden ziyaretçi çekiyor. Beypazarı'ndaki bir mekânın müşterisi çoğunlukla yaklaşık yüz kilometre uzaktan, önceden plan yaparak geliyor; bu da reklamın yerini ve zamanını belirliyor.",
    "markaizi Ankara merkezli bir ajans; Beypazarı'ndaki mekânınız için çekim tarihini önceden planlayıp geliyoruz.",
  ],
  sections: [
    {
      h2: "Karar Ankara'da Verilir",
      paragraphs: [
        "Beypazarı'na hafta sonu gelecek kişi, nereye oturacağına çoğu zaman yola çıkmadan, cuma akşamı ya da cumartesi sabahı telefonunda karar veriyor. Reklamı yalnızca Beypazarı'na göstermek, bu kararı çoktan vermiş kişiye geç ulaşmak demek. Reklamları Ankara'nın merkez ilçelerine ve yakın illere, hafta sonu planının yapıldığı günlerde ve saatlerde gösteriyoruz.",
      ],
    },
    {
      h2: "Kahvaltı Sofrası ve Konak Atmosferi",
      paragraphs: [
        "Beypazarı'nda insanlar bir deneyim için geliyor: tarihi bir konakta kahvaltı, yöresel lezzetler, çarşıda gezinti. İçeriklerde bu deneyimi baştan sona gösteriyoruz: sofranın kuruluşu, yöresel ürünler, konağın içi ve bahçesi. Rezervasyon alıyorsanız, reklamın doğrudan rezervasyona ya da WhatsApp'a yönlendirmesi hafta sonu doluluğunu önceden görmenizi sağlıyor.",
      ],
      bullets: [
        "Ankara merkeze yönelik hafta sonu planlama reklamları",
        "Sofra ve konak atmosferini anlatan kısa videolar",
        "Rezervasyon ve WhatsApp'a yönlendirme",
      ],
    },
    {
      h2: "'Beypazarı Kahvaltı' Aramasında Öne Çıkmak",
      paragraphs: [
        "Beypazarı'na gitmeyi düşünen kişi Google'da 'Beypazarı kahvaltı', 'Beypazarı'nda nerede yenir', 'Beypazarı konak restoran' gibi aramalar yapıyor. Bu aramalarda Google Haritalar'da ilk sıralarda görünmek için profilin bol fotoğrafla, güncel menü ve fiyatla, düzenli yorumla ve doğru çalışma saatleriyle dolu olması gerekiyor. Yoğun bir hafta sonunda gelen yorumlara hızlı yanıt vermek de bir sonraki ziyaretçinin kararını etkiliyor.",
      ],
    },
  ],
  faq: [
    {
      q: "Beypazarı'ndaki mekânımız için reklamı nereye göstermeliyiz?",
      a: "Müşterilerin çoğu Ankara'dan ve yakın illerden geldiği için reklamı ağırlıklı olarak Ankara'nın merkez ilçelerine ve çevre illere göstermek daha verimlidir. Zamanlama da önemli: hafta sonu planının yapıldığı perşembe-cuma ve cumartesi sabahı öne çıkar.",
    },
    {
      q: "Rezervasyon almak için reklam kullanılabilir mi?",
      a: "Evet. Reklamı doğrudan WhatsApp'a ya da rezervasyon formuna yönlendirmek, hafta sonu doluluğunu önceden görmenizi ve yoğunluğu planlamanızı sağlar.",
    },
    {
      q: "Çekim için Beypazarı'na geliyor musunuz?",
      a: "Evet. Ankara merkezli olduğumuz için Beypazarı'ndaki mekânınızda çekim yapabiliyoruz; tarihi ve saati, mekânın en canlı göründüğü zamana göre önceden planlıyoruz.",
    },
  ],
  related: [HUB_LINK, BLOG_HARITA, { href: "/hizmetler/video-cekimi-drone", label: "Video Çekimi & Drone" }],
  waText: "Merhaba, Beypazarı'ndaki kafem/restoranım için sosyal medya ve reklam hizmeti almak istiyorum.",
  ctaTitle: "Beypazarı'ndaki Mekânınız İçin Ücretsiz Analiz",
  ctaText: "Google profilinizi ve hesabınızı inceleyip Ankara'dan gelecek ziyaretçiye nasıl ulaşabileceğinizi 24 saat içinde paylaşalım.",
  serviceName: "Beypazarı Kafe & Restoran Reklam Ajansı Hizmetleri",
});

export const KAFE_DISTRICT_PAGES = [CANKAYA, GOLBASI, YENIMAHALLE, ETIMESGUT, KECIOREN, ALTINDAG, BEYPAZARI];
