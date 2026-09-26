// Mobilya sektörüne yönelik şehir ve hizmet sayfalarının içerikleri.
// Her sayfa kendi metnini taşır — şehir adı değiştirilmiş kopya içerik değil,
// o pazarın dinamiklerine göre ayrı yazılmış içeriktir.

export type LandingSection = {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LandingContent = {
  path: string; // /istanbul-mobilya-reklam-ajansi
  kind: "sehir" | "hizmet";
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  tag: string;
  h1Plain: string;
  h1Accent: string;
  lead: string[];
  sections: LandingSection[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
  serviceName: string;
  areaServed: string[];
  breadcrumbLabel: string;
  waText: string;
  ctaTitle: string;
  ctaText: string;
  linkLabel: string; // ana mobilya sayfası ve footer'da görünen kısa ad
};

const CASE = { href: "/vaka-calismalari/alitel-mobilya", label: "Alitel Mobilya Vaka Çalışması" };
const MAIN = { href: "/mobilya-reklam-ajansi", label: "Mobilya Reklam Ajansı" };

// ───────────────────────── ŞEHİR SAYFALARI ─────────────────────────

export const ISTANBUL: LandingContent = {
  path: "/istanbul-mobilya-reklam-ajansi",
  kind: "sehir",
  metaTitle: "İstanbul Mobilya Reklam Ajansı — Instagram & Google Reklamları | markaizi",
  metaDescription:
    "İstanbul'daki mobilya mağazaları için ilçe bazlı Instagram, Meta ve Google reklam yönetimi. Yüksek rekabette bütçeyi koruyan, ölçülebilir mobilya reklamcılığı. Ankara Siteler merkezli ajans.",
  keywords:
    "istanbul mobilya reklam ajansı, istanbul mobilya reklamı, istanbul mobilya sosyal medya yönetimi, istanbul mobilya mağazası reklam, istanbul mobilya instagram reklamı, istanbul mobilya google reklamları",
  tag: "İstanbul",
  h1Plain: "İstanbul",
  h1Accent: "Mobilya Reklam Ajansı",
  lead: [
    "İstanbul, mobilyanın en çok satıldığı şehir olduğu kadar reklamın en pahalı olduğu şehir. Aynı ilçede onlarca mağaza, AVM'lerde zincir showroomlar ve her gün yeni açılan online satıcılar aynı müşteriyi bekliyor. Burada 'reklam vereyim' demek yetmiyor; reklamı kime, hangi ilçede ve hangi ürünle gösterdiğiniz bütçenizin kaderini belirliyor.",
    "markaizi, Ankara Siteler'de 10 yılı aşkın süredir mobilyacılarla çalışan bir ajans. İstanbul'daki mağazalarla uzaktan çalışıyoruz; çekimler ve önemli toplantılar için önceden planlanmış ziyaretler yapıyoruz.",
  ],
  sections: [
    {
      h2: "İstanbul'da Mobilya Reklamı Neden Farklı Kurulur?",
      paragraphs: [
        "Ankara veya Anadolu'daki bir mobilya mağazası için 'şehir' bir hedef olabilir; İstanbul'da ise şehir tek bir pazar değil, birbirinden kopuk onlarca küçük pazar. Trafik nedeniyle müşteri, evine yarım saatten uzak bir mağazaya gitmeyi çoğu zaman göze almıyor. Yani Kadıköy'deki bir mağaza ile Esenyurt'taki bir mağazanın reklam kitlesi neredeyse hiç kesişmiyor.",
        "Bu yüzden İstanbul kampanyalarında hedefleme 'İstanbul geneli' diye başlamaz. Mağazanızın çevresindeki ilçeleri ulaşım kolaylığına göre kümeler, her kümeye ayrı bütçe ve ayrı mesaj veririz. Böylece reklamı görüp de mağazaya asla gelmeyecek kişiye para harcamazsınız.",
      ],
    },
    {
      h2: "Rekabetin Yoğun Olduğu Kelimelerde Bütçeyi Korumak",
      paragraphs: [
        "İstanbul'da 'koltuk takımı' ya da 'yatak odası' gibi geniş aramalar Google'da çok pahalı; herkes aynı kelimeye teklif veriyor. Bütçesi büyük zincirlerle o kelimede kafa kafaya yarışmak küçük ve orta ölçekli bir mağaza için çoğu zaman kaybedilmiş bir savaş.",
        "Biz bunun yerine niyeti daha net olan, daha az yarışılan aramalara yöneliriz: belirli bir ürün tipi, belirli bir ölçü veya belirli bir stil. Marka adınızla yapılan aramaları da ayrı bir kampanyada koruruz ki rakipler sizin adınızın üzerinden müşteri toplamasın.",
      ],
      bullets: [
        "Ürün tipine ve stile göre ayrılmış arama kampanyaları",
        "Marka adı aramalarını koruyan ayrı kampanya",
        "Alakasız aramaları düzenli temizleyen negatif kelime listesi",
        "Mağazanızın çevresindeki ilçe kümelerine göre bütçe dağılımı",
      ],
    },
    {
      h2: "Kiracılar, Yeni Taşınanlar ve Evlilik Hazırlığındakiler",
      paragraphs: [
        "İstanbul'da mobilya alan kitle Anadolu'dakinden biraz farklı davranıyor. Kiracı oranı yüksek olduğundan çok kişi tek seferde tüm evi almak yerine, taşınırken kolay sökülüp takılabilen, daha küçük hacimli ürünlere yöneliyor. Evlilik hazırlığındakiler ise hâlâ bütün seti tek mağazadan almak isteyen en değerli kitle.",
        "Reklam kurgusunu bu ayrıma göre yaparız: kiracıya modüler ve pratik ürünler, evlenecek çifte komple set ve taksit imkânı, ev sahibi olan orta yaşa ise kalite ve garanti vurgusu. Aynı ürün, kitleye göre farklı anlatılır.",
      ],
    },
    {
      h2: "AVM Showroom mu, Semt Mağazası mı?",
      paragraphs: [
        "AVM içindeki showroom ile mahalle arasındaki mağazanın müşterisi farklı bir yolculuk izliyor. AVM'ye giden kişi zaten alışverişe niyetli ve karşılaştırma yapıyor; onu yakalamak için harita ve yakın konum reklamları öne çıkıyor. Semt mağazasında ise güven ve tanıdıklık belirleyici; orada yorumlar, müşteri evi paylaşımları ve WhatsApp'a hızlı dönüş daha çok iş yapıyor.",
        "İlk görüşmede mağaza tipinizi, ürün gruplarınızı ve mevcut Instagram hesabınızı inceleyip hangi tarafa ağırlık vereceğimizi netleştiririz.",
      ],
    },
    {
      h2: "Nasıl Çalışıyoruz?",
      paragraphs: [
        "İlk adım ücretsiz bir analiz: hesabınızı, mevcut reklamlarınızı ve çevrenizdeki rakipleri inceliyoruz. Ardından ürün gruplarına göre kampanya planını çıkarıyor, gerekiyorsa showroom'unuzda çekim planlıyoruz. Yayına girdikten sonra size özel müşteri panelinden kampanyaları ve raporları görebilirsiniz; ay sonunda kaç mesaj, arama ve müşteri geldiğini, müşteri başına maliyetin ne olduğunu sade bir raporla sunarız.",
        "Reklama ayırdığınız para, kendi Meta ve Google hesabınıza tanımlı kartınızdan doğrudan platforma gider; bizim payımız yalnızca yönetim ücretidir.",
      ],
    },
  ],
  faq: [
    {
      q: "Ankara merkezli bir ajansla İstanbul'daki mağazam için çalışmak sorun olur mu?",
      a: "Reklam ve sosyal medya yönetimi zaten dijital ortamda yürüyor; toplantılar görüntülü yapılabiliyor, kampanya ve raporlara müşteri panelinden ulaşıyorsunuz. Çekim gibi yerinde yapılması gereken işler için ise önceden planlanmış bir ziyaret ayarlıyoruz. Yine de ilk görüşmede size uygun olup olmadığımızı açıkça konuşuruz.",
    },
    {
      q: "İstanbul'da reklam bütçesi neden daha yüksek olmalı?",
      a: "Şehirde aynı kitleyi hedefleyen çok sayıda mağaza olduğu için tıklama ve mesaj başına maliyet daha yüksek olabiliyor. Bu yüzden bütçeyi büyütmek yerine ilçe ve ürün bazında daraltarak verimi artırmayı tercih ediyoruz. Ne kadar bütçe ayıracağınız mağazanızın ölçeğine göre ücretsiz görüşmede netleşir.",
    },
    {
      q: "Hem AVM'de showroomum var hem online satış yapıyorum. İkisini birlikte yönetebilir misiniz?",
      a: "Evet. Showroom ziyareti ve online sipariş farklı hedefler olduğu için ayrı kampanyalar kurarız; böylece hangi kanalın size ne kadara müşteri getirdiğini raporda ayrı görürsünüz.",
    },
    {
      q: "Sonuçları ne zaman görürüm?",
      a: "Reklam algoritmasının öğrenmesi için ilk bir iki hafta net sonuç beklenmemeli. Genellikle 4-6 hafta içinde hangi ilçenin ve ürünün daha ucuza müşteri getirdiği belirginleşiyor ve bütçe o yöne kaydırılıyor.",
    },
    {
      q: "İstanbul dışında da mağazam varsa ne olur?",
      a: "Her şehir için kitleyi ve bütçeyi ayrı kurgulayıp tek raporda topluyoruz. Ankara, İnegöl, Kayseri ve İzmir pazarı için de ayrı sayfalarımız ve deneyimimiz var.",
    },
  ],
  related: [
    MAIN,
    { href: "/mobilya-google-reklamlari", label: "Mobilya Google Reklamları" },
    { href: "/mobilya-sosyal-medya-yonetimi", label: "Mobilya Sosyal Medya Yönetimi" },
    CASE,
  ],
  serviceName: "İstanbul Mobilya Reklam Ajansı Hizmetleri",
  areaServed: ["İstanbul"],
  breadcrumbLabel: "İstanbul Mobilya Reklam Ajansı",
  waText: "Merhaba, İstanbul'daki mobilya mağazam için reklam hizmeti almak istiyorum.",
  ctaTitle: "İstanbul Mağazanız İçin Ücretsiz Analiz",
  ctaText:
    "Mağazanızın bulunduğu ilçeyi, rakiplerinizi ve mevcut hesabınızı inceleyip size özel bir yol haritasını 24 saat içinde paylaşalım. Görüşme ücretsiz, karar sizin.",
  linkLabel: "İstanbul",
};

export const INEGOL: LandingContent = {
  path: "/inegol-mobilya-reklam-ajansi",
  kind: "sehir",
  metaTitle: "İnegöl Mobilya Reklam Ajansı — Üretici & Mağaza Dijital Pazarlama | markaizi",
  metaDescription:
    "İnegöl'deki mobilya üreticileri, toptancılar ve mağazalar için Instagram, Google reklamları ve sosyal medya yönetimi. İl dışı müşteri ve bayi getiren mobilya reklamcılığı.",
  keywords:
    "inegöl mobilya reklam ajansı, inegöl mobilya reklamı, inegöl mobilya sosyal medya, inegöl mobilya üreticisi dijital pazarlama, bursa mobilya reklam ajansı, inegöl mobilya google reklamları",
  tag: "İnegöl / Bursa",
  h1Plain: "İnegöl",
  h1Accent: "Mobilya Reklam Ajansı",
  lead: [
    "İnegöl'de mobilya, sadece bir sektör değil şehrin kimliği. Atölyeler, üretici firmalar, toptancılar ve perakende mağazalar aynı bölgede iç içe çalışıyor. Bu yoğunluk müşteri için güzel: seçenek çok. Sizin için ise zor: herkes aynı şehrin adını taşıyor ve müşterinin gözünde fark yaratmak gerekiyor.",
    "markaizi olarak Siteler'de yıllardır benzer bir yapının, yani üreticinin ve satıcının iç içe olduğu bir mobilya bölgesinin içinden çalışıyoruz. İnegöl'deki firmalarla uzaktan çalışıyor, çekim ve planlama için önceden ayarlanmış ziyaretler yapıyoruz.",
  ],
  sections: [
    {
      h2: "Üretici misiniz, Mağaza mı? Reklam Buna Göre Değişir",
      paragraphs: [
        "İnegöl'de aynı çatı altında hem üreten hem satan firma çok. Ama üreticinin ihtiyacı ile perakende mağazanın ihtiyacı aynı değil. Üretici çoğu zaman bayi, toptan alıcı ve proje müşterisi arıyor; mağaza ise doğrudan son kullanıcıyı.",
        "Bu yüzden reklamdan önce sorduğumuz ilk soru 'kimi getirmek istiyorsunuz' oluyor. Bayi arayan bir üretici için mesaj, ürün gamı, üretim kapasitesi ve teslim süresine odaklanır; son kullanıcıya satan bir mağaza için ise görsel, fiyat ve montaj kolaylığı öne çıkar.",
      ],
      bullets: [
        "Üreticiler için: bayi ve toptan alıcı bulmaya yönelik kampanyalar",
        "Mağazalar için: il dışından gelen son kullanıcıya yönelik kampanyalar",
        "İkisini birlikte yapanlar için: hedefi ayrı, raporu ayrı iki kampanya hattı",
      ],
    },
    {
      h2: "İl Dışı Müşteriye Güven Vermek",
      paragraphs: [
        "İnegöl'e gelen müşterinin büyük kısmı başka şehirlerden. Mağazayı görmeden karar vermesi gereken biri, kumaşın, dikişin ve ölçünün gerçek olduğuna güvenmek ister. Bu güveni en iyi atölyeden ve üretimden çekilmiş içerik verir: iskeletin kuruluşu, döşemenin geçilişi, paketleme ve sevkiyat.",
        "Kargo, nakliye ve montaj koşullarını reklamın içinde açıkça söylemek de dönüşümü artırıyor; çünkü uzaktaki müşterinin en büyük çekincesi 'ürün bana nasıl ulaşacak' sorusu.",
      ],
    },
    {
      h2: "'İnegöl Mobilya' Aramaları ve Rekabet",
      paragraphs: [
        "Google'da şehir adıyla yapılan aramalar İnegöl'ün en değerli kelimeleri, ama aynı zamanda en kalabalık olanları. Şehir adına tek başına teklif vermek pahalı ve verimsiz. Biz şehir adını ürün tipiyle ve niyetle birleştiren aramalara odaklanıyoruz; ayrıca Google Haritalar'da mağazanızın ve showroomunuzun doğru kategoride, güncel fotoğraflarla ve yorumlarla görünmesini sağlıyoruz.",
      ],
    },
    {
      h2: "Instagram'da Atölyeyi Vitrine Çevirmek",
      paragraphs: [
        "İnegöl firmalarının en büyük kozu üretimin yanı başında olması. Bunu içeriğe çeviren firma az. Hazır mobilya satan büyük zincirlerin çekemeyeceği bir içerik türü bu: ustanın elinden çıkan iş, kumaş seçim günü, sevkiyata hazırlanan bir sipariş. Bu içerikler hem organik olarak izleniyor hem de reklam olarak çalıştığında daha ucuza mesaj getiriyor.",
        "Hesabınızı düzenli, ürün gruplarına göre ayrılmış ve WhatsApp'a bağlı bir vitrine çeviriyor, içerik takvimini üretim ve sevkiyat akışınıza göre kuruyoruz.",
      ],
    },
  ],
  faq: [
    {
      q: "İnegöl'de üretici olarak bayi bulmak için reklam kullanılabilir mi?",
      a: "Evet. Bayi arayan üretici için ürün gamı, üretim kapasitesi, teslim süresi ve bayi koşullarını anlatan ayrı bir kampanya kurulur. Bu kampanyanın hedefi son kullanıcı değil, mağaza açmak veya ürün almak isteyen işletmelerdir. Sonuç mesaj ve form başvurusu üzerinden ölçülür.",
    },
    {
      q: "Mağazam İnegöl'de ama müşterilerimin çoğu başka şehirlerden. Nasıl hedefleme yapılır?",
      a: "Hedefi konumdan çok niyete göre kurarız: mobilya almayı düşünen, ev taşıyan veya evlenecek kişiler ve İnegöl'e gelebilecek mesafedeki iller. Kargo ve montaj kapasiteniz varsa hedefi Türkiye geneline genişletebiliriz.",
    },
    {
      q: "İnegöl dışındaki bir ajansla çalışmak avantaj mı, dezavantaj mı?",
      a: "Sektörü ve bölgeyi tanıyan bir ajansla çalışmak asıl avantajdır. Biz Siteler'de mobilya esnafıyla 10 yılı aşkın süredir çalışıyoruz; reklam ve içerik yönetimi dijital yürüdüğü için konum bir engel değil. Showroom veya atölye çekimi gibi yerinde işler için tarihi önceden belirleyip ziyarete geliyoruz.",
    },
    {
      q: "Fiyat listesi paylaşıyor musunuz?",
      a: "Hayır. Fiyatlandırmayı işletmenizin ölçeğine ve ihtiyaç duyduğunuz hizmetlere göre özel teklifle belirliyoruz; reklam bütçesi ise doğrudan sizin hesabınızdan harcanır.",
    },
  ],
  related: [
    MAIN,
    { href: "/mobilya-seo", label: "Mobilya SEO" },
    { href: "/mobilya-sosyal-medya-yonetimi", label: "Mobilya Sosyal Medya Yönetimi" },
    CASE,
  ],
  serviceName: "İnegöl Mobilya Reklam Ajansı Hizmetleri",
  areaServed: ["İnegöl", "Bursa"],
  breadcrumbLabel: "İnegöl Mobilya Reklam Ajansı",
  waText: "Merhaba, İnegöl'deki mobilya işletmem için reklam hizmeti almak istiyorum.",
  ctaTitle: "İnegöl İşletmeniz İçin Ücretsiz Analiz",
  ctaText:
    "Üretici, toptancı ya da mağaza olmanıza göre size özel yol haritasını 24 saat içinde çıkaralım. Görüşme ücretsiz.",
  linkLabel: "İnegöl / Bursa",
};

export const KAYSERI: LandingContent = {
  path: "/kayseri-mobilya-reklam-ajansi",
  kind: "sehir",
  metaTitle: "Kayseri Mobilya Reklam Ajansı — Mobilya Firmaları İçin Dijital Pazarlama | markaizi",
  metaDescription:
    "Kayseri'deki mobilya üreticileri ve mağazaları için Google reklamları, Instagram reklamları ve sosyal medya yönetimi. Orta Anadolu müşterisini mağazaya getiren ölçülebilir reklamcılık.",
  keywords:
    "kayseri mobilya reklam ajansı, kayseri mobilya reklamı, kayseri mobilya sosyal medya yönetimi, kayseri mobilya dijital pazarlama, kayseri mobilya mağazası reklam, kayseri mobilya instagram reklamı",
  tag: "Kayseri",
  h1Plain: "Kayseri",
  h1Accent: "Mobilya Reklam Ajansı",
  lead: [
    "Kayseri, sanayisiyle bilinen bir şehir ve mobilya bu sanayinin öne çıkan kollarından biri. Şehirde hem üretici firmalar hem de kendi markasıyla mağaza işleten işletmeler var. Ancak Kayseri müşterisinin mobilya alma şekli, başka büyük şehirlerdekinden biraz farklı: karar genellikle daha çok güvene, tavsiyeye ve tanınırlığa dayanıyor.",
    "Bu yazıda anlattığımız yaklaşım, Siteler'de yıllardır mobilyacılarla çalışırken edindiğimiz deneyimin Kayseri pazarına uyarlanmış hâli. Kayseri'deki firmalarla uzaktan çalışıyor, çekim ve toplantılar için önceden planlanmış ziyaret yapıyoruz.",
  ],
  sections: [
    {
      h2: "Güven ve Tavsiye Odaklı Bir Pazar",
      paragraphs: [
        "Orta Anadolu şehirlerinde mobilya alışverişi çoğu zaman 'kim nereden aldı, memnun kaldı mı' sorusuyla başlıyor. Bu, dijital reklam için bir engel değil, bir fırsat: memnun müşterinin sözünü dijitale taşıyabilen mağaza, reklamla ulaştığı kişiye en güçlü kanıtı gösterebiliyor.",
        "Teslim edilen ürünlerin müşteri evinde çekilmiş görselleri, kısa müşteri yorumları ve Google'daki puanınız, Kayseri'de reklamınızın en ikna edici parçası oluyor. Bu nedenle reklam kurgusuna sosyal kanıtı en başta yerleştiriyoruz.",
      ],
    },
    {
      h2: "Şehir Merkezi, İlçeler ve Çevre İller",
      paragraphs: [
        "Kayseri'de mobilya satan bir işletmenin müşterisi yalnızca şehir merkezinden gelmiyor; Develi, Yahyalı, Bünyan gibi ilçelerden ve Nevşehir, Sivas, Niğde, Yozgat gibi çevre illerden de alıcı geliyor. Reklam hedeflemesini bu coğrafyaya göre katmanlara ayırıyoruz: şehir merkezine yakın konum ve harita reklamları, çevre il ve ilçeler için ise 'Kayseri'ye gelip alışveriş yapmaya değer' mesajı.",
      ],
      bullets: [
        "Şehir içi: harita ve yakın konum odaklı kampanya",
        "İlçeler: mağazaya yolculuğu kolaylaştıran mesaj ve yol tarifi",
        "Çevre iller: seçenek zenginliği, kargo ve montaj bilgisi",
      ],
    },
    {
      h2: "Üreticiler İçin: Bayi Ağını Dijitalden Büyütmek",
      paragraphs: [
        "Kayseri'deki üretici firmaların bir kısmı kendi mağazasının yanı sıra bayi ağı da kurmak istiyor. Bu, son kullanıcıya reklam vermekten farklı bir iş: hedef kitle mağaza açmak isteyen girişimciler ve mevcut mobilya işletmeleri. Bu kitleye yönelik kampanyada üretim gücünü, ürün gamını, bayi destek koşullarını ve teslim sürelerini anlatan içerik kullanırız.",
        "Bayilik başvurularının form veya WhatsApp üzerinden ne kadar geldiğini ölçer, hangi mesajın nitelikli başvuru getirdiğini raporlarız.",
      ],
    },
    {
      h2: "Google'da Doğru Kişiye Görünmek",
      paragraphs: [
        "'Kayseri mobilya' araması yapan biri çoğu zaman ya satın almaya hazırdır ya da fiyat karşılaştırıyordur. Google İşletme Profilinizin eksiksiz olması, ürün gruplarınızın doğru kategorilerde yer alması ve yorum sayınızın düzenli artması, reklamdan bağımsız olarak size bedava trafik getirir. Bunun üstüne, satın almaya en yakın aramalara arama reklamı kurarak kısa yoldan sonuç alırız.",
      ],
    },
  ],
  faq: [
    {
      q: "Kayseri'de mobilya reklamı için Instagram mı Google mı daha iyi?",
      a: "İkisi farklı iş görür. Google, mobilya arayan ve satın almaya yakın kişiyi yakalar; Instagram ise henüz karar vermemiş ama ilgilenen kişiye ürünü gösterip mağazayı aklına yerleştirir. Genellikle ikisini dengeli kurup hangisinin size daha ucuza müşteri getirdiğini raporlarla takip ederiz.",
    },
    {
      q: "Bayi ağı kurmak isteyen bir üretici için reklam yapıyor musunuz?",
      a: "Evet. Bayi kampanyaları son kullanıcı kampanyasından ayrı kurulur; hedef kitle girişimciler ve mevcut mobilya işletmeleridir. Başvuru sayısını ve niteliğini ayrıca raporlarız.",
    },
    {
      q: "Çevre illerden müşteri getirmek mümkün mü?",
      a: "Mümkün ve Kayseri için önemli bir kaynak. Mağazaya gelmeye değer seçenek zenginliğini, kargo ve montaj imkânlarını öne çıkaran ayrı bir kampanya ile çevre il ve ilçelere ulaşıyoruz.",
    },
    {
      q: "Kayseri'de olmayan bir ajansla çalışmak sorun yaratır mı?",
      a: "Reklam yönetimi ve raporlama dijital yürüdüğü için konum bir engel değil. Fotoğraf ve video çekimi için ise gün ve saati birlikte planlayıp Kayseri'ye geliyoruz.",
    },
  ],
  related: [
    MAIN,
    { href: "/mobilya-google-reklamlari", label: "Mobilya Google Reklamları" },
    { href: "/mobilya-e-ticaret-danismanligi", label: "Mobilya E-Ticaret Danışmanlığı" },
    CASE,
  ],
  serviceName: "Kayseri Mobilya Reklam Ajansı Hizmetleri",
  areaServed: ["Kayseri"],
  breadcrumbLabel: "Kayseri Mobilya Reklam Ajansı",
  waText: "Merhaba, Kayseri'deki mobilya işletmem için reklam hizmeti almak istiyorum.",
  ctaTitle: "Kayseri İşletmeniz İçin Ücretsiz Analiz",
  ctaText:
    "Hesabınızı ve bölgenizdeki rekabeti inceleyip size özel yol haritasını 24 saat içinde paylaşalım. Görüşme ücretsiz, karar sizin.",
  linkLabel: "Kayseri",
};

export const IZMIR: LandingContent = {
  path: "/izmir-mobilya-reklam-ajansi",
  kind: "sehir",
  metaTitle: "İzmir Mobilya Reklam Ajansı — Ege Mobilya Mağazaları İçin Dijital Pazarlama | markaizi",
  metaDescription:
    "İzmir ve Ege'deki mobilya mağazaları için Instagram reklamları, Google reklamları ve sosyal medya yönetimi. Yazlık, dekorasyon ve yeni ev sezonlarına göre planlanan mobilya reklamcılığı.",
  keywords:
    "izmir mobilya reklam ajansı, izmir mobilya reklamı, izmir mobilya sosyal medya yönetimi, izmir mobilya mağazası reklam, ege mobilya reklam ajansı, izmir mobilya instagram reklamı",
  tag: "İzmir / Ege",
  h1Plain: "İzmir",
  h1Accent: "Mobilya Reklam Ajansı",
  lead: [
    "İzmir'de mobilya müşterisi dekorasyona ve tasarıma düşkün, görsele çok önem veriyor ve Instagram'da geçirdiği süre yüksek. Aynı zamanda şehrin ve Ege kıyılarının yazlık ev, ikinci konut ve yaz sezonu gibi kendine has talepleri var. Bu, mobilya reklamının takvimini ve mesajını başka şehirlerden ayırıyor.",
    "Merkezimiz Ankara Siteler; on yılı aşkın süredir aynı sektörde çalışıyoruz. İzmir ve Ege'deki mağazalarla uzaktan çalışıyor, çekim ve planlama için önceden ayarlanmış ziyaretler yapıyoruz.",
  ],
  sections: [
    {
      h2: "Tasarım Odaklı Müşteri, Görsel Odaklı Reklam",
      paragraphs: [
        "İzmir'de müşteri, ürünü tek başına değil bir mekânın parçası olarak görmek istiyor. 'Bu koltuk benim salonuma nasıl durur' sorusuna görsel cevap veren reklamlar daha fazla ilgi görüyor. Bu yüzden ürünü izole bir fotoğrafla değil, yaşam alanı kurgusu içinde, doğal ışıkla ve renk uyumunu gösterecek şekilde çekmeyi öneriyoruz.",
        "Reels ve karusel formatları bu kitlede iyi çalışıyor; aynı ürünün farklı odada, farklı ışıkta nasıl göründüğünü göstermek hem kaydetme hem paylaşma getiriyor.",
      ],
    },
    {
      h2: "Yazlık Sezonu ve İkinci Konut Alıcıları",
      paragraphs: [
        "Çeşme, Urla, Alaçatı gibi bölgelerde yazlık ve ikinci konut sahibi olanlar, sezon başlamadan önce ev döşeme işini bitirmek istiyor. Bu kitle için reklam takvimi ilkbahar başında yoğunlaşıyor ve mesaj dayanıklılık, rutubete uygun kumaş ile hızlı teslimat üzerine kuruluyor.",
        "Şehir içinde ise yeni ev ve taşınma dönemleri ile evlilik sezonu talebi belirliyor. Bütçeyi yıl boyunca sabit tutmak yerine bu dalgalara göre kaydırmak, aynı harcamayla daha fazla müşteri getiriyor.",
      ],
      bullets: [
        "İlkbahar: yazlık ve ikinci konut kampanyaları",
        "Yaz sonu ve sonbahar: taşınma, yeni ev ve genç odası",
        "Yıl içi: evlilik hazırlığındakilere komple set kampanyası",
      ],
    },
    {
      h2: "Şehir İçi Semt Farkları ve Ege Çevresi",
      paragraphs: [
        "Karşıyaka, Bornova, Buca ve Bayraklı gibi bölgeler hem ulaşım hem müşteri profili açısından farklı. Mağazanızın bulunduğu bölgeye ve müşterinizin gelebileceği mesafeye göre hedeflemeyi daraltırız. Manisa, Aydın, Denizli ve Muğla gibi Ege illerinde de alıcı bulunduğundan, uygun ürün gruplarında hedefi bu illere genişletmeyi de test ederiz.",
      ],
    },
    {
      h2: "Ölçtüğümüz Şey: Mesaj ve Ziyaret",
      paragraphs: [
        "Beğeni sayısı değil, kaç kişinin mesaj attığı, aradığı ve mağazaya geldiği bizim için sonuç. WhatsApp mesajlarını, telefon aramalarını ve yol tarifi isteklerini ayrı dönüşüm olarak izliyor, aylık raporla müşteri başına maliyeti gösteriyoruz.",
      ],
    },
  ],
  faq: [
    {
      q: "İzmir'de mobilya reklamı için en verimli dönem hangisi?",
      a: "Yazlık ve ikinci konut talebi ilkbahar başında, taşınma ve genç odası talebi yaz sonu ve sonbaharda, evlilik hazırlığı ise yıl boyunca yoğun. Bütçeyi bu dalgalara göre planlıyoruz; kesin takvimi mağazanızın ürün gruplarına göre ilk görüşmede çıkarırız.",
    },
    {
      q: "Ege'nin diğer illerinden müşteri getirmek mümkün mü?",
      a: "Ürün grubuna ve teslimat kapasitenize bağlı olarak evet. Manisa, Aydın, Denizli ve Muğla gibi illere küçük bütçeli test kampanyaları kurup verimli çıkanları büyütüyoruz.",
    },
    {
      q: "Ürün çekimini nasıl yapıyorsunuz?",
      a: "İzmir'deki mağazanız için çekim tarihini önceden planlayıp showroom'da fotoğraf ve Reels çekimi yapıyoruz. Çekim öncesinde hangi ürünlerin ve hangi açıların önceliklendirileceğini birlikte belirliyoruz.",
    },
    {
      q: "Reklam bütçesi nasıl ödeniyor?",
      a: "Reklam harcaması kendi reklam hesaplarınızdan yapılır ve her kuruşu hesabınızdan görebilirsiniz; bizim kalemimiz ayrı bir yönetim ücretidir, harcamanızdan pay almayız.",
    },
  ],
  related: [
    MAIN,
    { href: "/mobilya-sosyal-medya-yonetimi", label: "Mobilya Sosyal Medya Yönetimi" },
    { href: "/mobilya-google-reklamlari", label: "Mobilya Google Reklamları" },
    CASE,
  ],
  serviceName: "İzmir Mobilya Reklam Ajansı Hizmetleri",
  areaServed: ["İzmir", "Ege Bölgesi"],
  breadcrumbLabel: "İzmir Mobilya Reklam Ajansı",
  waText: "Merhaba, İzmir'deki mobilya mağazam için reklam hizmeti almak istiyorum.",
  ctaTitle: "İzmir Mağazanız İçin Ücretsiz Analiz",
  ctaText:
    "Mağazanızı ve bölgenizi inceleyip sezona göre yol haritanızı 24 saat içinde paylaşalım. Görüşme ücretsiz.",
  linkLabel: "İzmir / Ege",
};

// ───────────────────────── HİZMET SAYFALARI ─────────────────────────

export const MOBILYA_SEO: LandingContent = {
  path: "/mobilya-seo",
  kind: "hizmet",
  metaTitle: "Mobilya SEO Hizmeti — Mobilya Mağazası ve Üreticisi İçin SEO | markaizi",
  metaDescription:
    "Mobilya web siteniz ve Google Haritalar profiliniz için SEO: kategori ve ürün sayfaları, yerel arama görünürlüğü, ürün görselleri ve içerik. Mobilya sektörünü tanıyan ajanstan mobilya SEO hizmeti.",
  keywords:
    "mobilya seo, mobilya seo hizmeti, mobilya sitesi seo, mobilya mağazası seo, mobilya yerel seo, mobilya web sitesi seo, mobilya google sıralama",
  tag: "Mobilya SEO",
  h1Plain: "Mobilya",
  h1Accent: "SEO Hizmeti",
  lead: [
    "Reklam durduğunda müşteri de durur; SEO ise siz uyurken bile çalışan bir müşteri kaynağıdır. Mobilyada bu daha da önemli, çünkü müşteri karar vermeden önce uzun uzun arama yapar: ürün tipi, ölçü, kumaş, fiyat aralığı, mağaza yorumları. Bu aramaların yanıtında sizin sayfanızın çıkması, en ucuz ve en kalıcı müşteri kaynağıdır.",
    "Bu sayfada mobilya sitelerinin SEO'sunun genel sitelerden nerede ayrıldığını ve bizim nasıl çalıştığımızı anlatıyoruz.",
  ],
  sections: [
    {
      h2: "Mobilya SEO'su Neden Diğer Sektörlerden Farklı?",
      paragraphs: [
        "Mobilya arayan kişi çok değişkenli düşünür: üç kişilik mi köşe mi, gri mi bej mi, kumaş mı deri mi, kaç bin liraya kadar. Bu her kombinasyon ayrı bir arama demektir ve hepsinin tek sayfada karşılanması mümkün değildir. Mobilya sitelerinde kazanan, ürün kategorilerini ve filtre sayfalarını arama niyetine göre doğru kuran sitedir.",
        "Ayrıca mobilya görselle satıldığı için ürün fotoğraflarının boyutu, formatı ve açıklaması hem sayfa hızını hem Google Görseller'den gelen trafiği doğrudan etkiler.",
      ],
    },
    {
      h2: "Neleri Yapıyoruz?",
      paragraphs: [
        "SEO çalışmamız üç ayak üzerine kurulu: sitenizin teknik altyapısı, sayfa içeriği ve yerel görünürlük. Her mağaza aynı sırayla ilerlemez; mevcut durumunuza bakıp önce en hızlı kazanım getirecek alanı seçeriz.",
      ],
      bullets: [
        "Kategori ve ürün sayfası yapısının arama niyetine göre düzenlenmesi",
        "Ürün sayfalarına özgün açıklama ve doğru yapılandırılmış veri",
        "Görsellerin boyut, format ve alternatif metin düzeni",
        "Sayfa hızı ve mobil deneyim düzeltmeleri",
        "Google İşletme Profili, yorumlar ve yerel arama görünürlüğü",
        "Sitenizin kendi verisinden çıkan blog ve rehber içerikleri",
      ],
    },
    {
      h2: "Yerel SEO: Mağazanızın Haritadaki Yeri",
      paragraphs: [
        "'Yakınımdaki mobilya mağazası' ya da 'şehir adı + mobilya' araması yapan kişi önce harita sonuçlarını görür. Bu sonuçlarda ilk üçe girmek telefonların ve ziyaretlerin büyük kısmını alır. İşletme profilinin eksiksiz doldurulması, düzenli fotoğraf ve yorum akışı ile web sitesindeki bilgilerin profille tutarlı olması burada belirleyicidir.",
      ],
    },
    {
      h2: "Sonuç Ne Zaman Gelir, Neyi Ölçeriz?",
      paragraphs: [
        "SEO reklam gibi ilk hafta sonuç vermez. Yerel arama tarafında iyileşmeler genellikle birkaç hafta ile birkaç ay arasında görünür; içerik ve teknik çalışmaların etkisi daha yavaş ama daha kalıcıdır. Ölçtüğümüz şey sıralamanın kendisi değil, sıralamadan gelen sonuçtur: organik trafik, mesaj, arama ve yol tarifi istekleri.",
        "Reklamla birlikte kurgulandığında SEO da reklam da birbirini güçlendirir: reklamdan öğrendiğimiz hangi ürünün ve mesajın çalıştığı bilgisi, SEO içeriğinin önceliğini belirler.",
      ],
    },
  ],
  faq: [
    {
      q: "Mobilya SEO çalışması ne kadar sürede sonuç verir?",
      a: "Yerel arama ve profil düzeltmeleri genellikle birkaç hafta içinde etki göstermeye başlar; yeni içerik ve teknik iyileştirmelerin etkisi ise birkaç ay içinde oturur. Kesin süre sitenizin mevcut durumuna ve bölgedeki rekabete bağlıdır, garanti verilecek bir rakam yoktur.",
    },
    {
      q: "Web sitem yok, sadece Instagram'ım var. SEO yapılabilir mi?",
      a: "Web sitesi olmadan da Google İşletme Profili üzerinden yerel SEO yapılabilir ve bu çoğu mağaza için ilk adımdır. Kategori ve ürün sayfası SEO'su için ise sitenizin olması gerekir; ihtiyaç halinde mobilya sitesi kurulumunu da birlikte planlarız.",
    },
    {
      q: "Google'da 1. sıra garantisi veriyor musunuz?",
      a: "Hayır. Hiçbir ajans sıralamayı garanti edemez; garanti veren bir ajansa temkinli yaklaşmanızı öneririz. Biz ne yapacağımızı, neyi ölçeceğimizi ve ilk aylarda neyi test ettiğimizi baştan yazılı olarak anlatırız.",
    },
    {
      q: "SEO ile Google reklamı arasında nasıl karar vermeliyim?",
      a: "Hızlı sonuç istiyorsanız reklam, kalıcı ve düşük maliyetli trafik istiyorsanız SEO daha uygundur. Çoğu mobilya mağazası için ikisi birlikte en iyi sonucu verir; bütçenize göre dağılımı ücretsiz görüşmede birlikte belirleriz.",
    },
    {
      q: "Yapay zeka aramalarında (ChatGPT, Gemini) görünmek için ne yapıyorsunuz?",
      a: "Sitenizin net, doğru ve yapılandırılmış bilgi vermesini, sık sorulan soruların cevaplanmasını ve markanızın dışarıda da tutarlı şekilde anılmasını sağlıyoruz. Bunlar hem Google hem yapay zeka cevapları için aynı zeminde çalışır. Yapay zeka sonuçlarında yer almayı garanti edemeyiz.",
    },
  ],
  related: [
    MAIN,
    { href: "/hizmetler/web-tasarim-hosting", label: "Web Tasarım & Hosting" },
    { href: "/blog/mobilya-yerel-seo-rehberi", label: "Mobilya Yerel SEO Rehberi (Blog)" },
    CASE,
  ],
  serviceName: "Mobilya SEO Hizmeti",
  areaServed: ["Türkiye"],
  breadcrumbLabel: "Mobilya SEO",
  waText: "Merhaba, mobilya web sitem ve Google profilim için SEO hizmeti hakkında bilgi almak istiyorum.",
  ctaTitle: "Sitenizin Ücretsiz SEO Kontrolü",
  ctaText:
    "Web sitenizi ve Google profilinizi inceleyip en hızlı kazanım getirecek 5 alanı yazılı olarak paylaşalım.",
  linkLabel: "Mobilya SEO",
};

export const MOBILYA_GOOGLE: LandingContent = {
  path: "/mobilya-google-reklamlari",
  kind: "hizmet",
  metaTitle: "Mobilya Google Reklamları — Mobilya Mağazası ve Üreticisi İçin Google Ads | markaizi",
  metaDescription:
    "Mobilya mağazaları ve üreticileri için Google arama, harita, alışveriş ve görüntülü reklam yönetimi. Yıllardır mobilya sektöründe milyonlarca liralık reklam bütçesi yöneten ajanstan Google Ads.",
  keywords:
    "mobilya google reklamları, mobilya google ads, mobilya reklam yönetimi, mobilya arama reklamı, mobilya google alışveriş reklamı, mobilya google ads ajansı",
  tag: "Mobilya Google Ads",
  h1Plain: "Mobilya",
  h1Accent: "Google Reklamları",
  lead: [
    "Google'da mobilya arayan kişi, çoğu zaman satın almaya en yakın kişidir. 'Şehir adı + koltuk takımı' diye arayan biri genellikle ilham aramıyor, mağaza arıyor. Google reklamları bu anı yakalar; doğru kurulmadığında ise en hızlı bütçe kaybettiren kanaldır.",
    "Mobilya sektöründe Google Ads yönetiminde yıllardır aynı işi yapıyoruz. Bu sayfada mobilya için hangi reklam türlerinin ne iş gördüğünü ve nasıl çalıştığımızı anlatıyoruz. Uzun dönemli bir örnek için Alitel Mobilya vaka çalışmamıza da göz atabilirsiniz.",
  ],
  sections: [
    {
      h2: "Mobilyada Dört Farklı Google Reklam Türü",
      paragraphs: [
        "Google'da tek bir 'reklam' yoktur. Mobilya için birbirinden farklı iş gören dört ana tür kullanırız ve bütçeyi mağazanızın hedefine göre bunlar arasında paylaştırırız.",
      ],
      bullets: [
        "Arama reklamları: 'koltuk takımı fiyatları' gibi aktif arayan kişiyi yakalar",
        "Harita reklamları: mağazanıza yakın konumdaki kişiyi yol tarifine ve aramaya yönlendirir",
        "Alışveriş reklamları: ürün fotoğrafı ve fiyatıyla arama sonuçlarında görünür (ürün listesi gerektirir)",
        "Görüntülü ve video reklamlar: ürünü daha önce görmüş kişiyi geri getirir",
      ],
    },
    {
      h2: "Arama Niyetine Göre Kampanya Ayırmak",
      paragraphs: [
        "'Koltuk takımı fiyatları' diyen kişi ile 'salon dekorasyon fikirleri' diyen kişi aynı kişi değildir. İlki satın almaya yakın, ikincisi ilham arıyor. Hepsini aynı kampanyaya koymak, ilham arayana da pahalı teklif vermeniz anlamına gelir.",
        "Biz kampanyaları satın alma niyetine göre katmanlara ayırırız: yüksek niyetli aramalara güçlü teklif, ilham ve araştırma aramalarına düşük teklif veya tamamen Instagram tarafına bırakma. Bu ayrım, aynı bütçeyle daha fazla nitelikli mesaj getirir.",
      ],
    },
    {
      h2: "Negatif Kelimeler ve Bütçe Sızıntısı",
      paragraphs: [
        "Mobilya aramaları geniştir: 'ikinci el', 'ucuz', 'nasıl yapılır', 'çizimi', 'ahşap işleme' gibi kelimeler sizin müşterinizin araması değildir. Bunlar için tıklama ödemek bütçenin sessizce erimesidir. Arama terimleri raporunu düzenli inceleyip alakasızları negatif listeye ekler, bu listeyi kampanya boyunca güncel tutarız.",
      ],
    },
    {
      h2: "Neyi Dönüşüm Sayıyoruz?",
      paragraphs: [
        "Mobilyada satışın büyük kısmı mağazada kapanır. Bu yüzden 'satın alma' yerine, satışa giden adımları dönüşüm olarak izleriz: WhatsApp'a tıklama, telefon araması, yol tarifi isteği ve form doldurma. Böylece hangi anahtar kelimenin ve hangi ürün grubunun size gerçekten konuşan müşteri getirdiğini görürüz ve bütçeyi oraya kaydırırız.",
        "Raporda ise beğeni ya da gösterim değil, kaç mesaj, kaç arama ve müşteri başına maliyet yer alır.",
      ],
    },
    {
      h2: "Bütçe Sizin Hesabınızdan, Kontrol Sizde",
      paragraphs: [
        "Google Ads hesabının sahibi sizsiniz ve harcamalar doğrudan hesabınızdan yapılır. Yönetim ücreti ile reklam bütçesi iki ayrı kalemdir. Bizimle yolları ayırmanız hâlinde hesabınız, verileriniz ve kampanya yapınız sizde kalır.",
      ],
    },
  ],
  faq: [
    {
      q: "Mobilya için Google reklamına aylık ne kadar bütçe ayırmalıyım?",
      a: "Bütçe mağazanızın ölçeğine, bölgenizdeki rekabete ve hedefinize göre değişir. Genellikle ilk 4-6 haftada hangi ürün grubunun ve aramanın verimli olduğu test edilir, sonra bütçe kazanan alanlara kaydırılır. Rakamı ücretsiz görüşmede işletmenize göre netleştiririz.",
    },
    {
      q: "Google reklamı mı Instagram reklamı mı vermeliyim?",
      a: "Google, aktif arayan ve satın almaya yakın müşteriyi yakalar; Instagram ise henüz karar vermemiş kişiye ürünü gösterir. Mobilyada ikisi birbirini tamamlar. Bütçeniz kısıtlıysa genellikle Google ile başlayıp Instagram'ı sonra eklemeyi öneririz; kesin öneri mağazanıza göre değişir.",
    },
    {
      q: "Alışveriş reklamları mobilya için uygun mu?",
      a: "Ürünlerinizin fotoğrafı, fiyatı ve stok bilgisi düzenli bir ürün listesinde tutulabiliyorsa evet. Özellikle standart ürün satan mağazalarda iyi çalışır. Özel ölçü üretim yapan firmalarda arama ve harita reklamları genellikle daha uygundur.",
    },
    {
      q: "Reklamı ne kadar süre yayınlamalıyım?",
      a: "Google'ın ve kampanyanın öğrenmesi için en az 4-6 hafta gerekir. Bir iki günde kapatılan reklam hiçbir zaman gerçek performansını göstermez. Sonuçları haftalık takip eder, aylık raporla değerlendiririz.",
    },
    {
      q: "Şu an kendi reklamımı veriyorum, sizinle devam edebilir miyiz?",
      a: "Evet. Mevcut hesabınızı ücretsiz inceleyip nerede bütçe kaybettiğinizi ve neyin çalıştığını gösteririz. Hesap sizde kalır, kampanya yapısını düzenleyerek devam ederiz.",
    },
  ],
  related: [
    MAIN,
    { href: "/hizmetler/google-reklamlari", label: "Google Reklamları (Genel)" },
    { href: "/blog/mobilya-reklami-nasil-verilir", label: "Mobilya Reklamı Nasıl Verilir? (Blog)" },
    CASE,
  ],
  serviceName: "Mobilya Google Reklamları Yönetimi",
  areaServed: ["Türkiye"],
  breadcrumbLabel: "Mobilya Google Reklamları",
  waText: "Merhaba, mobilya mağazam için Google reklamı hizmeti almak istiyorum.",
  ctaTitle: "Google Reklam Hesabınız İçin Ücretsiz İnceleme",
  ctaText:
    "Mevcut reklamlarınızı inceleyip bütçenizi nerede kaybettiğinizi ve neyi değiştirmeniz gerektiğini yazılı olarak paylaşalım.",
  linkLabel: "Mobilya Google Reklamları",
};

export const MOBILYA_SOSYAL: LandingContent = {
  path: "/mobilya-sosyal-medya-yonetimi",
  kind: "hizmet",
  metaTitle: "Mobilya Sosyal Medya Yönetimi — Instagram, Facebook, TikTok | markaizi",
  metaDescription:
    "Mobilya mağazaları ve üreticileri için sosyal medya yönetimi: showroom çekimi, içerik takvimi, Reels, müşteri mesajı yönetimi ve aylık rapor. Mobilya sektörünü tanıyan ajanstan sosyal medya hizmeti.",
  keywords:
    "mobilya sosyal medya yönetimi, mobilya instagram yönetimi, mobilya sosyal medya ajansı, mobilya tiktok, mobilya facebook yönetimi, mobilya içerik üretimi",
  tag: "Mobilya Sosyal Medya",
  h1Plain: "Mobilya",
  h1Accent: "Sosyal Medya Yönetimi",
  lead: [
    "Mobilya mağazasının sosyal medya hesabı, bir tabela değil bir showroomdur: müşteri mağazaya gelmeden önce orada gezer, ürünü orada beğenir, fiyatı orada sorar. Hesap düzenliyse güven duyar; düzensiz ve sessizse başka bir mağazaya geçer.",
    "Bu sayfada mobilya için sosyal medya yönetiminin bizde nasıl işlediğini, hangi işi kimin yaptığını ve ne bekleyebileceğinizi adım adım anlatıyoruz.",
  ],
  sections: [
    {
      h2: "Bir Ayın Akışı Nasıl İşler?",
      paragraphs: [
        "Ay başında içerik takvimini ürün gruplarınıza, sezona ve kampanyalarınıza göre çıkarırız. Onayınızdan sonra paylaşımlar planlanır; ay içinde çekim, montaj ve müşteri evi içerikleri eklenir. Ay sonunda ne yayınlandığını, neyin çalıştığını ve gelen mesajları raporlarız.",
      ],
      bullets: [
        "Ay başı: içerik takvimi ve öncelikli ürün grupları",
        "Ay içi: paylaşım, Reels, story ve topluluk yönetimi",
        "Çekim günü: showroom'da fotoğraf ve video çekimi",
        "Ay sonu: sade rapor — ulaşım, mesaj, arama, öne çıkan içerik",
      ],
    },
    {
      h2: "Showroom Çekimi: İçeriğin Hammaddesi",
      paragraphs: [
        "Sosyal medya yönetiminin kalitesi çoğu zaman çekimin kalitesidir. Karanlık ve dağınık bir showroomdan çıkan içerik ne kadar iyi kurgulansa da satmaz. Çekimde ışığı, ürün yerleşimini, kumaş ve dikiş detayını ve ürünün yaşam alanı içindeki görünümünü birlikte planlarız.",
        "Bir çekim gününden bir ay boyunca kullanılabilecek yeterli fotoğraf ve video çıkarmayı hedefleriz.",
      ],
    },
    {
      h2: "'Fiyat?' Yorumları ve DM'ler",
      paragraphs: [
        "Mobilya paylaşımlarının altına en çok gelen yorum 'fiyat' sorusudur ve bu soruya nasıl cevap verildiği satışı belirler. Yorumu yanıtsız bırakmak müşteri kaybettirir; herkese aynı kopyala-yapıştır cevabı vermek de samimiyetsiz durur.",
        "Yönetimimizde bu mesajlar için kısa ve kibar yanıt akışı kurarız: yorumda nazikçe karşılık verip, fiyat ve ölçü konuşmasını WhatsApp'a taşırız. Mağaza tarafının mesajlara hızlı dönmesi için de birlikte bir süreç belirleriz.",
      ],
    },
    {
      h2: "Organik ve Reklam Birlikte",
      paragraphs: [
        "Instagram'ın organik erişimi zamanla daralıyor. En iyi performans gösteren içerikleri küçük bütçelerle reklama çevirmek, hesabınızı yalnızca takipçilerinize değil mobilya almayı düşünen yeni kitlelere de ulaştırır. Bu nedenle sosyal medya yönetimi ile reklam yönetimini birbirini besleyecek şekilde kurgularız: organikte çalışan içerik reklama gider, reklamda çalışan mesaj organik içeriğe yansır.",
      ],
    },
    {
      h2: "Hangi Platformlarda?",
      paragraphs: [
        "Mobilyada ana platform Instagram; ürün görseli ve Reels için en güçlü kanal. Facebook, özellikle 35 yaş üstü ve aile alışverişi yapan kitle için hâlâ etkili. TikTok ise daha genç ve ilk evini kuran kitleyi yakalamak için değerlendirilebilir. Hangi platformlara ne kadar emek harcanacağını mağazanızın müşteri profiline göre birlikte belirleriz.",
      ],
    },
  ],
  faq: [
    {
      q: "Sosyal medya yönetimine dahil olanlar neler?",
      a: "Genel olarak içerik takvimi, paylaşım, Reels ve story üretimi ve yönetimi, topluluk yönetimi (yorum ve mesajlar) ve aylık rapor. Showroom çekimi, reklam yönetimi ve Google Haritalar gibi ek işler paketinize göre ayrıca planlanır; kapsamı teklifte yazılı olarak netleştiririz.",
    },
    {
      q: "Çekimi siz mi yapıyorsunuz?",
      a: "Evet. Showroom'unuza gelip ürün fotoğrafı ve Reels çekimi yapıyoruz. Bir çekim gününden bir ay boyunca kullanılabilecek içerik çıkarmayı hedefliyoruz.",
    },
    {
      q: "Hesabıma erişimi ve içeriğin mülkiyetini nasıl yönetiyorsunuz?",
      a: "Hesap ve içerikler size aittir. Yolları ayırmanız durumunda hesabınıza erişim, yayınlanan içerikler ve verileriniz sizde kalır.",
    },
    {
      q: "Ne kadar sürede takipçi ve mesaj artışı görürüm?",
      a: "Sosyal medyada büyüme sabır ister; genellikle 2-3 aylık düzenli çalışmada ölçülebilir bir hareket görülür. Sonucu garanti etmiyoruz, ne yaptığımızı ve neyi ölçtüğümüzü aylık raporlarla gösteriyoruz.",
    },
    {
      q: "Sadece reklam yönetimi, sadece sosyal medya hizmeti alabilir miyim?",
      a: "Evet. İhtiyacınıza göre ikisini ayrı ayrı ya da birlikte alabilirsiniz. Birlikte kurgulandığında genellikle daha iyi sonuç verdiği için, ilk görüşmede mevcut durumunuza göre bir öneri sunarız.",
    },
  ],
  related: [
    MAIN,
    { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi (Genel)" },
    { href: "/blog/mobilya-magazalari-icin-instagram", label: "Mobilya Mağazaları İçin Instagram (Blog)" },
    CASE,
  ],
  serviceName: "Mobilya Sosyal Medya Yönetimi",
  areaServed: ["Türkiye"],
  breadcrumbLabel: "Mobilya Sosyal Medya Yönetimi",
  waText: "Merhaba, mobilya mağazam için sosyal medya yönetimi hizmeti almak istiyorum.",
  ctaTitle: "Hesabınız İçin Ücretsiz Analiz",
  ctaText:
    "Instagram hesabınızı inceleyip neyin çalıştığını ve nerede fırsat kaçırdığınızı 24 saat içinde paylaşalım.",
  linkLabel: "Mobilya Sosyal Medya Yönetimi",
};

export const MOBILYA_ETICARET: LandingContent = {
  path: "/mobilya-e-ticaret-danismanligi",
  kind: "hizmet",
  metaTitle: "Mobilya E-Ticaret Danışmanlığı — Online Mobilya Satışı İçin | markaizi",
  metaDescription:
    "Mobilyayı online satmak isteyen mağaza ve üreticiler için e-ticaret sitesi, ürün listesi, reklam ve satış süreci danışmanlığı. Ölçü, nakliye, montaj ve iade sorunlarını bilen ajanstan mobilya e-ticaret desteği.",
  keywords:
    "mobilya e-ticaret, mobilya e-ticaret danışmanlığı, online mobilya satışı, mobilya e-ticaret sitesi, mobilya online satış reklam, mobilya pazaryeri",
  tag: "Mobilya E-Ticaret",
  h1Plain: "Mobilya",
  h1Accent: "E-Ticaret Danışmanlığı",
  lead: [
    "Mobilyayı internette satmak, tişört satmaya benzemez. Ürün büyük, pahalı ve genellikle 'dokunmadan alınmaz' diye düşünülen bir kategoride. Nakliye, montaj, ölçü uyumu, iade gibi her adımda mobilyaya özgü sorunlar var ve bunları önceden çözmeyen mağaza reklama harcadığı parayı iadelerde kaybediyor.",
    "Bu sayfada online mobilya satışında nelerin farklı olduğunu ve bu süreçte nasıl destek verdiğimizi anlatıyoruz.",
  ],
  sections: [
    {
      h2: "Online Mobilya Satışında Asıl Zorluklar",
      paragraphs: [
        "Müşteri ürünü ekranda görüp kararını veriyor, ama ürün eve geldiğinde renk, kumaş ve ölçü beklentisine uymayabiliyor. Bu tür hayal kırıklığı hem iade hem olumsuz yorum getiriyor. Bu yüzden e-ticarette ürün sayfasının işi, satmaktan önce doğru beklenti oluşturmaktır.",
      ],
      bullets: [
        "Gerçek ürün fotoğrafı: aynı ürünün farklı ışıkta ve odada görünümü",
        "Net ölçü tabloları ve odaya yerleşim örnekleri",
        "Kumaş ve renk seçeneklerinin gerçek numunelerle gösterimi",
        "Nakliye süresi, montaj ve iade koşullarının açık yazılması",
      ],
    },
    {
      h2: "Kendi Siteniz mi, Pazaryeri mi?",
      paragraphs: [
        "Pazaryerleri hazır trafik verir ama komisyon alır ve müşteri sizin değil pazaryerinin müşterisi olur. Kendi siteniz ise ilk başta trafik getirmeyi zorlaştırır ama müşteri verisi ve marka sizde kalır. Çoğu mobilya işletmesi için doğru yol ikisini birlikte kurmak: pazaryerini talep yakalamak için, kendi sitesini marka ve müşteri sadakati için kullanmak.",
        "Danışmanlıkta önce hangi ürün grubunun online satışa uygun olduğunu, hangisinin showroom'da kalması gerektiğini belirleriz. Örneğin standart üretim ürünler genellikle online'a daha uygunken, özel ölçü ve yüksek tutarlı setlerde WhatsApp ve showroom ziyareti daha iyi çalışır.",
      ],
    },
    {
      h2: "Reklamın E-Ticarette Rolü",
      paragraphs: [
        "Online satışta reklamın amacı doğrudan siparişe ulaşmaktır ve ölçümü daha nettir: hangi reklamın hangi siparişi getirdiğini görebiliriz. Bu yüzden ürün listesi kurulur, Google alışveriş ve Meta katalog reklamları için ürün verisi düzenlenir, sepeti terk edenler ve ürünü inceleyenler yeniden hedeflenir.",
        "Reklam harcamasının getirisini sipariş bazında raporlarız; kâr etmeyen ürünleri reklamdan çıkarıp verimli olanlara odaklanırız.",
      ],
    },
    {
      h2: "Süreci Nasıl İlerletiyoruz?",
      paragraphs: [
        "İlk adımda mevcut satış kanallarınızı, ürün gruplarınızı ve lojistik kapasitenizi inceliyoruz. Ardından hangi ürünle başlanacağını, hangi kanalda satılacağını ve hangi bütçeyle test edileceğini yazılı bir plana döküyoruz. Küçük bir ürün grubuyla başlayıp sonuçlara göre büyütüyoruz; böylece tüm kataloğu online'a taşımadan önce neyin çalıştığını görüyoruz.",
      ],
    },
  ],
  faq: [
    {
      q: "Mobilya online satışta iade riskini nasıl azaltırım?",
      a: "Gerçek fotoğraf ve video, net ölçü bilgisi, kumaş ve renk numune imkânı ve açık teslimat koşulları iade oranını belirgin şekilde düşürür. Ürün sayfalarında beklentiyi doğru kurmak ilk adımdır; rakamsal bir düşüş garantisi vermiyoruz.",
    },
    {
      q: "Pazaryerinde mi satmalıyım, kendi sitemde mi?",
      a: "İkisinin de rolü farklı. Pazaryeri hazır trafik verir ama komisyon alır ve müşteri verisini vermez; kendi siteniz marka ve müşteri verisi sağlar ama trafik kurmak zaman alır. Çoğu işletme için ikisini birlikte kurmak daha sağlıklıdır.",
    },
    {
      q: "Tüm ürünlerimi online satmalı mıyım?",
      a: "Genellikle hayır. Standart üretim ve daha düşük tutarlı ürünler online'a daha uygundur; özel ölçü ve yüksek tutarlı setlerde showroom ziyareti ve WhatsApp görüşmesi daha iyi çalışır. Danışmanlığın ilk adımı bu ayrımı yapmaktır.",
    },
    {
      q: "E-ticaret sitesini de sizin yapmanız gerekiyor mu?",
      a: "Zorunlu değil. Mevcut sitenizi inceleyip uygunsa üzerinde çalışırız; gerekliyse web sitesi kurulumunu da web tasarım hizmetimizle birlikte planlarız.",
    },
  ],
  related: [
    MAIN,
    { href: "/hizmetler/web-tasarim-hosting", label: "Web Tasarım & Hosting" },
    { href: "/mobilya-google-reklamlari", label: "Mobilya Google Reklamları" },
    CASE,
  ],
  serviceName: "Mobilya E-Ticaret Danışmanlığı",
  areaServed: ["Türkiye"],
  breadcrumbLabel: "Mobilya E-Ticaret Danışmanlığı",
  waText: "Merhaba, mobilya ürünlerimi online satmak için e-ticaret danışmanlığı hakkında bilgi almak istiyorum.",
  ctaTitle: "Online Satış Planınız İçin Ücretsiz Görüşme",
  ctaText:
    "Ürün gruplarınızı ve lojistiğinizi inceleyip hangi ürünle online'a başlamanın mantıklı olduğunu yazılı olarak paylaşalım.",
  linkLabel: "Mobilya E-Ticaret",
};

export const CITY_PAGES = [ISTANBUL, INEGOL, KAYSERI, IZMIR];
export const SERVICE_PAGES = [MOBILYA_SEO, MOBILYA_GOOGLE, MOBILYA_SOSYAL, MOBILYA_ETICARET];
export const ALL_MOBILYA_PAGES = [...CITY_PAGES, ...SERVICE_PAGES];
