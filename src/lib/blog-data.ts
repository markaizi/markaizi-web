export type ContentType = "makale" | "video" | "instagram" | "tiktok";

export type BlogSection = {
  h2: string;
  body: string;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  color: string;
  type: ContentType;
  // Embed fields (type'a göre dolduruluyor)
  videoId?: string;        // YouTube video ID:  "dQw4w9WgXcQ"
  tiktokUrl?: string;      // TikTok post URL:   "https://www.tiktok.com/@user/video/123"
  instagramUrl?: string;   // Instagram post URL: "https://www.instagram.com/p/ABC123/"
  // İçerik
  intro: string;
  sections?: BlogSection[];
  conclusion?: string;
};

// İçerik türü etiket/renk konfigürasyonu
export const CONTENT_TYPE_CONFIG: Record<
  ContentType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  makale:    { label: "Makale",    emoji: "📝", color: "#7c6fa0", bg: "rgba(124,111,160,0.1)" },
  video:     { label: "Video",     emoji: "▶️", color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  instagram: { label: "Instagram", emoji: "📸", color: "#ec4899", bg: "rgba(236,72,153,0.1)"  },
  tiktok:    { label: "TikTok",    emoji: "🎵", color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  },
};

// Kategoriler için ikon haritası
export const CATEGORY_ICONS: Record<string, string> = {
  "Sosyal Medya":    "📱",
  "Google Ads":      "🔍",
  "Meta Reklamları": "📣",
  "TikTok":          "🎵",
  "İçerik Üretimi":  "✨",
  "Web Tasarım":     "🌐",
  "YouTube":         "▶️",
  "Instagram":       "📸",
};

// Kategorilerin sidebar'da görünme sırası
export const CATEGORY_ORDER = [
  "Sosyal Medya",
  "Meta Reklamları",
  "Google Ads",
  "TikTok",
  "İçerik Üretimi",
  "Web Tasarım",
  "YouTube",
  "Instagram",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "instagram-algoritmasi",
    type: "makale",
    category: "Sosyal Medya",
    color: "#c084fc",
    title: "Instagram Algoritması 2025: Organik Büyüme İçin 10 Strateji",
    excerpt:
      "Instagram'ın son algoritma güncellemeleri neleri değiştirdi? Reels, Carousel ve Story formatlarında nasıl daha fazla erişim elde edersiniz?",
    date: "15 Ocak 2025",
    readTime: "7 dk okuma",
    intro:
      "Instagram algoritması, içeriklerin kimde ve ne zaman gösterileceğini belirleyen karmaşık bir sistemdir. 2025 itibarıyla Meta, organik içerikleri orijinallik, etkileşim hızı ve tamamlanma oranı üzerinden değerlendiriyor. Aşağıdaki 10 strateji, bu kriterleri doğrudan etkileyen uygulanabilir adımlardır.",
    sections: [
      {
        h2: "1. Reels Formatına Öncelik Verin",
        body: "Instagram, platform genelinde video tüketimini artırmak için Reels içeriklerine organik erişimde avantaj tanıyor. Kısa ama değer yoğun (15–30 saniyelik) Reels'ler, feed gönderilerine kıyasla 2–3 kat daha fazla kişiye ulaşabilir. Her ay en az 8–10 Reels hedefleyin.",
      },
      {
        h2: "2. İlk 3 Saniyeyi Kaybetmeyin",
        body: "Algoritma, videolarda tamamlanma oranını yakından takip eder. İzleyicinin ilk 3 saniyede kaydırmadan durmasını sağlamak için güçlü bir görsel veya sürpriz bir cümle ile başlayın. 'Bunu bilmiyorsanız para kaybediyorsunuz' gibi merak uyandıran açılışlar tamamlanma oranını ciddi artırır.",
      },
      {
        h2: "3. Kayıt Sayısına Odaklanın",
        body: "Meta'nın açıklamalarına göre kayıt (save) ve paylaşım, beğeniden daha güçlü bir sinyal. İçeriklerinizi 'kaydetmeye değer' yapın: pratik listeler, adım adım rehberler, infografikler veya şablonlar paylaşın. Her gönderinin altına 'Kaydedip tekrar bakın!' gibi doğal bir çağrı ekleyin.",
      },
      {
        h2: "4. Carousel ile Uzun Süreli Etkileşim Sağlayın",
        body: "Carousel gönderiler, kullanıcıların birden fazla kez kaydırmasını sağladığı için ortalama izlenme süresi yüksek. Algoritma bunu güçlü bir etkileşim sinyali olarak yorumlar. 7–10 slaytlık eğitici içerikler, özellikle B2C sektörlerde harika sonuç verir.",
      },
      {
        h2: "5. İlk Saatte Etkileşime Girin",
        body: "Gönderi yayınladıktan sonraki 60 dakika, algoritmanın içeriğinizin potansiyelini ölçtüğü kritik penceredir. Bu sürede gelen yorumlara yanıt verin, Story'de içeriği paylaşın ve aktif olun. Erken etkileşim, içeriğin daha geniş kitlelere gösterilmesini tetikler.",
      },
      {
        h2: "6. Hashtag Kullanımını Sadeleştirin",
        body: "30 hashtag döneminin geride kaldığını kabul edin. 2025'te Instagram, 3–5 adet, içerikle gerçekten ilgili hashtag öneriyor. Niche (özel kitle) hashtag'leri, milyonluk genel hashtag'lerden çok daha iyi hedefleme ve keşfedilebilirlik sağlar.",
      },
      {
        h2: "7. Story Etkileşim Araçlarını Aktif Kullanın",
        body: "Anket, soru kutusu, kaydırma çubuğu gibi Story araçları, takipçilerinizle etkileşimi artırırken algoritmaya hesabınızın aktif ve ilgi çekici olduğunu gösterir. Haftada en az 5 interaktif Story paylaşmayı hedefleyin.",
      },
      {
        h2: "8. Optimum Yayın Zamanlaması",
        body: "Hedef kitlenizin en aktif olduğu saatlerde paylaşım yapın. Türkiye'deki işletmeler için genel olarak sabah 08:00–09:00, öğle 12:00–13:00 ve akşam 20:00–22:00 aralıkları yüksek etkileşim getirir. Ancak kendi analitik verileriniz her zaman önceliklidir.",
      },
      {
        h2: "9. Kolaborasyon (Collab) Özelliğini Deneyin",
        body: "Instagram Collab özelliği, aynı içeriği iki hesap üzerinden yayınlamanıza olanak tanır. Sektörünüzdeki tamamlayıcı hesaplarla iş birliği yaparak hem kitlenizi büyütün hem de algoritmanın kolaboratif içeriklere verdiği avantajdan yararlanın.",
      },
      {
        h2: "10. Düzenli Analitik Takibi",
        body: "Instagram Insights'ı haftada en az bir kez inceleyin. Hangi içerik formatı daha fazla kayıt alıyor, hangi saat daha yüksek erişim sağlıyor? Bu verileri bir sonraki haftanın içerik planına yansıtmak, zamanla organik erişiminizi geometrik biçimde büyütür.",
      },
    ],
    conclusion:
      "Instagram büyümesi sabır ve tutarlılık gerektirir. Bu 10 stratejiyi sistematik biçimde uygulayan markalar, genellikle 2–3 aylık süreçte ölçülebilir sonuçlar görür. Profesyonel destek almak istiyorsanız markaizi ekibi olarak hesabınızı büyütmek için buradayız.",
  },
  {
    slug: "google-ads-butce-optimizasyonu",
    type: "makale",
    category: "Google Ads",
    color: "#60a5fa",
    title: "Google Ads'de Bütçeyi Optimize Etmenin 7 Yolu",
    excerpt:
      "Tıklama başı maliyeti (CPC) nasıl düşürülür? Anahtar kelime kalite puanı neden önemlidir ve nasıl artırılır?",
    date: "22 Ocak 2025",
    readTime: "9 dk okuma",
    intro:
      "Google Ads'de harcanan her lira, doğru yapılandırılmış bir kampanyada çok daha fazla getiri sağlar. Ancak çoğu işletme, yanlış anahtar kelime seçimi ve zayıf kalite puanı nedeniyle bütçesinin önemli bir kısmını israf eder. İşte bütçenizi optimize etmenin 7 kanıtlanmış yolu.",
    sections: [
      {
        h2: "1. Kalite Puanını Her Şeyin Üstünde Tutun",
        body: "Google, reklam sıralamasını yalnızca teklife değil, Kalite Puanı'na (Quality Score) göre belirler. 1–10 arasında puanlanan bu sistem; beklenen tıklama oranı, reklam alaka düzeyi ve açılış sayfası deneyimini ölçer. Kalite Puanı 7'nin üstüne çıkan reklamlar, daha az ödeyerek daha üst sıralarda görünür.",
      },
      {
        h2: "2. Negatif Anahtar Kelimeleri İhmal Etmeyin",
        body: "Kampanyanızı en fazla boşa harcatan etken, alakasız aramalarda gösterilmektir. Negatif anahtar kelime listesini haftada bir güncellemek, bütçe israfını %20–40 azaltabilir.",
      },
      {
        h2: "3. Geniş Eşleşme Yerine Sıralı veya Tam Eşleşme Kullanın",
        body: "Başlangıç kampanyalarında geniş eşleşme (broad match) anahtar kelimeler kullanmak, bütçeyi beklenmedik aramalara harcatır. Bunun yerine sıralı eşleşme (phrase match) veya tam eşleşme (exact match) ile başlayın.",
      },
      {
        h2: "4. Akıllı Teklif Stratejilerini Doğru Seçin",
        body: "Google'ın Hedef EBM, Hedef ROAS veya Dönüşümleri Maksimize Et stratejileri, makine öğrenimi ile bütçeyi en verimli dönüşümlere yönlendirir. Bu stratejiler en az 30–50 dönüşüm verisine ihtiyaç duyar. Yeni kampanyalarda Manuel CPC ile başlayın.",
      },
      {
        h2: "5. Reklam Uzantılarını Eksiksiz Kullanın",
        body: "Site bağlantısı, çağrı, yer, fiyat ve öne çıkan snippet uzantıları, ek maliyet olmadan reklamınızın görsel alanını büyütür ve tıklama oranını artırır. Tüm uzantılar doldurulmuş bir reklam, uzantısız reklamdan ortalama %15 daha yüksek CTR alır.",
      },
      {
        h2: "6. Coğrafi ve Zaman Hedeflemesini Optimize Edin",
        body: "Hangi şehirden daha düşük EBM'de dönüşüm alıyorsunuz? Haftanın hangi günleri en verimli? Bu verilere göre bütçeyi verimli bölgelere kaydırmak, aynı bütçeyle daha fazla dönüşüm sağlar.",
      },
      {
        h2: "7. Dönüşüm İzlemeyi Doğru Kurun",
        body: "Dönüşüm izleme kurulmadan yürütülen kampanyalar kördür. Form doldurma, telefon araması, satın alma gibi her önemli eylemi ayrı bir dönüşüm noktası olarak Google Ads'e tanıtın.",
      },
    ],
    conclusion:
      "Google Ads optimizasyonu, tek seferlik bir işlem değil; haftalık inceleme ve iyileştirme gerektiren sürekli bir süreçtir. markaizi olarak Google Ads kampanyalarınızı yönetiyor, raporlayıp optimize ediyoruz.",
  },
  {
    slug: "meta-ads-roas",
    type: "makale",
    category: "Meta Reklamları",
    color: "#f472b6",
    title: "Meta Ads'de ROAS Artırmanın Kesin Yolları",
    excerpt:
      "Facebook ve Instagram reklamlarında reklam harcaması getirisini (ROAS) nasıl maksimize edersiniz? A/B test stratejileri ve kreatif ipuçları.",
    date: "5 Şubat 2025",
    readTime: "8 dk okuma",
    intro:
      "ROAS (Return on Ad Spend), harcadığınız her lira için elde ettiğiniz geliri ölçer. ROAS = 3 demek, 1 TL harcayıp 3 TL kazanmak demektir. Meta Ads'de bu oranı maksimize etmek için adım adım rehber.",
    sections: [
      {
        h2: "ROAS'ı Etkileyen Temel Faktörler",
        body: "Meta Ads'de ROAS'ı üç ana faktör belirler: hedef kitle doğruluğu, kreatif kalitesi ve açılış sayfası dönüşüm oranı. Bu üç unsurdan biri zayıfsa, diğerleri ne kadar güçlü olursa olsun ROAS düşer.",
      },
      {
        h2: "Doğru Kampanya Yapısı",
        body: "Farkındalık kampanyaları soğuk kitleye, retargeting kampanyaları siteyi ziyaret etmiş sıcak kitleye yönelik olsun. Soğuk ve sıcak kitleye aynı kreatifi göstermek hem para israfıdır hem de mesaj tutarsızlığına yol açar.",
      },
      {
        h2: "Kreatif Test (A/B Test) Stratejisi",
        body: "Her kampanyada en az 3 farklı kreatif başlatın: bir video, bir carousel, bir statik görsel. 3–5 gün sonra en düşük EBM'yi veren kretifi ölçeklendirip diğerlerini kapatın. Bu süreci her 2 haftada bir tekrarlayın.",
      },
      {
        h2: "Lookalike ve Custom Audience Kullanımı",
        body: "Mevcut müşterilerinizin listesini Meta'ya yükleyerek Custom Audience oluşturun. Ardından %1–3 benzerlik oranında Lookalike Audience oluşturun. Bu yöntem soğuk hedeflemeye kıyasla 2–4 kat daha yüksek ROAS sağlar.",
      },
      {
        h2: "Retargeting Hunisi Kurun",
        body: "Sitenizi ziyaret edip satın almayan kullanıcıları farklı mesajlarla yeniden hedefleyin. İlk tur: faydalar. İkinci tur (7+ gün): sosyal kanıt + aciliyet. Üçüncü tur (14+ gün): özel teklif.",
      },
      {
        h2: "Bütçe Ölçeklendirme Kuralları",
        body: "Performans gösteren bir reklam setini ölçeklendirirken günlük bütçeyi bir anda ikiye katlamayın. Bütçeyi 3 günde bir %20–30 artırarak ölçeklendirin. Acele edilen ölçeklendirme, kazanan kampanyaları öldürür.",
      },
    ],
    conclusion:
      "Meta Ads'de yüksek ROAS sabah akşam optimizasyon gerektiren bir süreçtir. markaizi olarak Meta reklam kampanyalarınızı haftalık raporlarla yönetiyoruz.",
  },
  {
    slug: "tiktok-for-business",
    type: "makale",
    category: "TikTok",
    color: "#34d399",
    title: "TikTok For Business: Markalar İçin Kapsamlı Rehber",
    excerpt:
      "TikTok Ads Manager kullanımı, In-Feed reklam formatları ve Türkiye pazarında TikTok'u etkin kullanma stratejileri.",
    date: "12 Şubat 2025",
    readTime: "10 dk okuma",
    intro:
      "TikTok, Türkiye'de 25 milyonu aşkın aktif kullanıcısıyla artık yalnızca genç neslin platformu değil. 25–44 yaş grubunun kullanımı her yıl artıyor ve platform, özellikle moda, yemek, güzellik ve eğitim sektörlerinde güçlü bir satış kanalına dönüşüyor.",
    sections: [
      {
        h2: "TikTok'u Farklı Kılan Ne?",
        body: "TikTok algoritması, takipçi sayısından bağımsız çalışır. Az takipçili bir hesabın videosu viral olabilirken büyük hesapların videoları düşük izlenebilir. Bu, küçük ve orta ölçekli işletmeler için eşsiz bir fırsat sunar.",
      },
      {
        h2: "TikTok Reklam Formatları",
        body: "In-Feed Ads: 'For You' akışına yerleşen 9–15 saniyelik reklamlar. TopView: Uygulamayı açınca ilk görünen tam ekran reklam. Spark Ads: Organik olarak iyi performans gösteren içeriklerinizi reklama dönüştürür — genellikle en yüksek dönüşüm oranını verir.",
      },
      {
        h2: "Organik İçerik Stratejisi",
        body: "Trend sesleri kullanın, ancak markanızın sesine uyarlayın. 'Day in the life', 'behind the scenes', 'before/after' formatları Türk kullanıcılarda yüksek etkileşim alır. Her video, ilk 1–2 saniyede izleyiciyi tutmalı.",
      },
      {
        h2: "TikTok'ta Başarı için 3 Altın Kural",
        body: "1) Platforma özgü içerik üretin. 2) Tutarlılık kritik — haftada en az 3–4 video. 3) Trendlere hızlı yanıt verin — bir trend 48–72 saat içinde zirve yapar ve söner.",
      },
    ],
    conclusion:
      "TikTok, erken davranan markaların büyük avantaj sağladığı bir platform. markaizi olarak TikTok organik yönetimi ve reklam kampanyalarında Türkiye pazarına özel stratejiler geliştiriyoruz.",
  },
  {
    slug: "yapay-zeka-icerik",
    type: "makale",
    category: "İçerik Üretimi",
    color: "#fbbf24",
    title: "Yapay Zeka ile İçerik Üretimi: Ajansların Kullandığı Araçlar",
    excerpt:
      "ChatGPT, Midjourney, Canva AI ve daha fazlası. Dijital ajanslar içerik üretimini nasıl hızlandırıyor ve kaliteyi nasıl koruyor?",
    date: "20 Şubat 2025",
    readTime: "6 dk okuma",
    intro:
      "Yapay zeka araçları, dijital ajansların içerik üretim hızını dramatik biçimde artırıyor. Aylarca süren süreçler saatlere iniyor; ancak kaliteyi korumak için insan denetimi her zamankinden daha kritik.",
    sections: [
      {
        h2: "ChatGPT / Claude: Metin Yazarlığının Hızlandırıcısı",
        body: "Sosyal medya caption'ları, blog taslakları, reklam metinleri için GPT-4 ve Claude vazgeçilmez araçlar haline geldi. 'Sıfırdan yaz' yerine '5 versiyon üret, en iyisini seç ve düzelt' yaklaşımı çalışma süresini %60 kısaltıyor.",
      },
      {
        h2: "Midjourney & DALL-E: Özgün Görsel Üretimi",
        body: "Stok fotoğrafların tekdüzeliğinden kurtulmak için AI görsel araçları kullanılıyor. Marka renklerine ve stiline uygun prompt'lar geliştirerek tutarlı görseller üretebilirsiniz.",
      },
      {
        h2: "Canva AI: Hızlı Tasarım Üretimi",
        body: "Canva'nın Magic Design, Magic Write, Background Remover özellikleri içerik üretimini önemli ölçüde hızlandırıyor. Marka kitine bağlı şablonlar oluşturduğunuzda her yeni içerik dakikalar içinde hazırlanabiliyor.",
      },
      {
        h2: "Yapay Zekanın Yapamadıkları",
        body: "Yapay zeka; müşteri hikayelerini, özgün marka deneyimlerini, gerçek sahne çekimlerini ve lokal kültürel nüansları tam olarak yakalayamaz. En iyi yaklaşım: yapay zekayı hız için, insanı kalite ve özgünlük için kullanmak.",
      },
    ],
    conclusion:
      "Yapay zeka, içerik üretiminde yetenekli ellerde güçlü bir hız aracı. markaizi olarak AI destekli içerik üretim süreçlerini marka stratejisiyle harmanlıyoruz.",
  },
  {
    slug: "core-web-vitals",
    type: "makale",
    category: "Web Tasarım",
    color: "#a78bfa",
    title: "2025'te Web Sitesi Hız Optimizasyonu: Core Web Vitals Rehberi",
    excerpt:
      "Google'ın sıralamada önem verdiği Core Web Vitals metrikleri nelerdir? LCP, INP ve CLS nasıl iyileştirilir?",
    date: "1 Mart 2025",
    readTime: "8 dk okuma",
    intro:
      "Google, 2021'den bu yana Core Web Vitals'ı arama sıralama faktörü olarak kullanıyor. Yavaş veya görsel olarak dengesiz bir site, rakipleriniz tarafından geçilmenize yol açar.",
    sections: [
      {
        h2: "Core Web Vitals Nedir?",
        body: "Google üç temel metrik üzerinden değerlendirme yapar: LCP (Largest Contentful Paint) — hedef 2.5 saniye altı. INP (Interaction to Next Paint) — hedef 200ms altı. CLS (Cumulative Layout Shift) — hedef 0.1 altı.",
      },
      {
        h2: "LCP (Yüklenme Hızı) Nasıl İyileştirilir?",
        body: "Hero bölümündeki büyük görsele priority loading ekleyin. Görselleri WebP formatına dönüştürün. Google Fonts gibi üçüncü taraf kaynakları preconnect ile önceden bağlayın.",
      },
      {
        h2: "CLS (Görsel Stabilite) Nasıl İyileştirilir?",
        body: "Sayfada kayma genellikle boyutsuz görsellerden kaynaklanır. Tüm img etiketlerine width ve height ekleyin. Fontlar için font-display: swap kullanın.",
      },
      {
        h2: "Test Araçları",
        body: "PageSpeed Insights: Google'ın resmi test aracı. GTmetrix: Detaylı şelale grafiği için ideal. Search Console > Core Web Vitals raporu: Gerçek kullanıcı verilerinizi izlemek için zorunlu araç.",
      },
    ],
    conclusion:
      "Core Web Vitals optimizasyonu, hem kullanıcı deneyimini iyileştirir hem de Google sıralamalarını olumlu etkiler. markaizi olarak web projelerinde hız optimizasyonunu standart sürecimizin parçası yapıyoruz.",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
