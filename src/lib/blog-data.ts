export type BlogSection = {
  h2: string;
  body: string;
  link?: { href: string; label: string }; // Bölümün altında gösterilen iç bağlantı (araç, hizmet, rehber)
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string; // YYYY-MM-DD — yapılandırılmış veri ve <meta> etiketleri için
  dateModifiedISO?: string; // Yazı gerçekten güncellendiğinde set edilir; yoksa dateISO kullanılır
  readTime: string;
  color: string;
  intro: string;
  sections: BlogSection[];
  conclusion: string;
  faq?: { q: string; a: string }[]; // Varsa yazının sonunda gösterilir ve FAQPage şeması üretilir
  videoSlug?: string; // Konuyla ilgili YouTube videosu varsa yazının sonunda kart olarak gösterilir
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "instagram-algoritmasi",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Sosyal Medya",
    color: "#c084fc",
    title: "Instagram Algoritması 2026: Organik Büyüme İçin 10 Strateji",
    excerpt:
      "Instagram'ın son algoritma güncellemeleri neleri değiştirdi? Reels, Carousel ve Story formatlarında nasıl daha fazla erişim elde edersiniz?",
    date: "15 Ocak 2026",
    dateISO: "2026-01-15",
    readTime: "7 dk",
    intro:
      "Instagram algoritması, içeriklerin kimde ve ne zaman gösterileceğini belirleyen karmaşık bir sistemdir. 2026 itibarıyla Meta, organik içerikleri orijinallik, etkileşim hızı ve tamamlanma oranı üzerinden değerlendiriyor. Aşağıdaki 10 strateji, bu kriterleri doğrudan etkileyen uygulanabilir adımlardır.",
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
        body: "30 hashtag döneminin geride kaldığını kabul edin. 2026'da Instagram, 3–5 adet, içerikle gerçekten ilgili hashtag öneriyor. Niche (özel kitle) hashtag'leri, milyonluk genel hashtag'lerden çok daha iyi hedefleme ve keşfedilebilirlik sağlar.",
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
    category: "Google Ads",
    color: "#60a5fa",
    title: "Google Ads'de Bütçeyi Optimize Etmenin 7 Yolu",
    excerpt:
      "Tıklama başı maliyeti (CPC) nasıl düşürülür? Anahtar kelime kalite puanı neden önemlidir ve nasıl artırılır?",
    date: "22 Ocak 2026",
    dateISO: "2026-01-22",
    readTime: "9 dk",
    intro:
      "Google Ads'de harcanan her lira, doğru yapılandırılmış bir kampanyada çok daha fazla getiri sağlar. Ancak çoğu işletme, yanlış anahtar kelime seçimi ve zayıf kalite puanı nedeniyle bütçesinin önemli bir kısmını israf eder. İşte bütçenizi optimize etmenin 7 kanıtlanmış yolu.",
    sections: [
      {
        h2: "1. Kalite Puanını Her Şeyin Üstünde Tutun",
        body: "Google, reklam sıralamasını yalnızca teklife değil, Kalite Puanı'na (Quality Score) göre belirler. 1–10 arasında puanlanan bu sistem; beklenen tıklama oranı, reklam alaka düzeyi ve açılış sayfası deneyimini ölçer. Kalite Puanı 7'nin üstüne çıkan reklamlar, daha az ödeyerek daha üst sıralarda görünür. Hedef: her anahtar kelimede 7+.",
      },
      {
        h2: "2. Negatif Anahtar Kelimeleri İhmal Etmeyin",
        body: "Kampanyanızı en fazla boşa harcatan etken, alakasız aramalarda gösterilmektir. Örneğin 'avukat' hizmeti satıyorsanız 'bedava avukat' veya 'avukat filmi' gibi terimler için para ödememelisiniz. Negatif anahtar kelime listesini haftada bir güncellemek, bütçe israfını %20–40 azaltabilir.",
      },
      {
        h2: "3. Geniş Eşleşme Yerine Sıralı veya Tam Eşleşme Kullanın",
        body: "Başlangıç kampanyalarında geniş eşleşme (broad match) anahtar kelimeler kullanmak, bütçeyi beklenmedik aramalara harcatır. Bunun yerine sıralı eşleşme (phrase match) veya tam eşleşme (exact match) ile başlayın. Yeterli veri biriktikten sonra kontrollü biçimde genişleyebilirsiniz.",
      },
      {
        h2: "4. Akıllı Teklif Stratejilerini Doğru Seçin",
        body: "Google'ın Hedef EBM (Target CPA), Hedef ROAS veya Dönüşümleri Maksimize Et stratejileri, makine öğrenimi ile bütçeyi en verimli dönüşümlere yönlendirir. Ancak bu stratejiler, en az 30–50 dönüşüm verisine ihtiyaç duyar. Yeni kampanyalarda Manuel CPC ile başlayıp veri biriktikten sonra akıllı teklife geçin.",
      },
      {
        h2: "5. Reklam Uzantılarını Eksiksiz Kullanın",
        body: "Site bağlantısı, çağrı, yer, fiyat ve öne çıkan snippet uzantıları, ek maliyet olmadan reklamınızın görsel alanını büyütür ve tıklama oranını artırır. Tüm uzantılar doldurulmuş bir reklam, uzantısız reklamdan ortalama %15 daha yüksek CTR alır.",
      },
      {
        h2: "6. Coğrafi ve Zaman Hedeflemesini Optimize Edin",
        body: "Kampanya performans raporunuzu konuma ve saate göre filtreleyin. Hangi şehirden daha düşük EBM'de dönüşüm alıyorsunuz? Haftanın hangi günleri ve saatleri en verimli? Bu verilere göre bütçeyi verimli bölgelere/saatlere kaydırmak, aynı bütçeyle daha fazla dönüşüm sağlar.",
      },
      {
        h2: "7. Dönüşüm İzlemeyi Doğru Kurun",
        body: "Dönüşüm izleme (conversion tracking) kurulmadan yürütülen kampanyalar kördür. Form doldurma, telefon araması, satın alma gibi her önemli eylemi ayrı bir dönüşüm noktası olarak Google Ads'e tanıtın. Bu veriler olmadan ne kadar iyi optimize ederseniz edin, bütçenizin gerçek getirisini bilemezsiniz.",
      },
    ],
    conclusion:
      "Google Ads optimizasyonu, tek seferlik bir işlem değil; haftalık inceleme ve iyileştirme gerektiren sürekli bir süreçtir. markaizi olarak Google Ads kampanyalarınızı yönetiyor, raporlayıyor ve sürekli optimize ediyoruz. Ücretsiz kampanya analizi için bizimle iletişime geçin.",
  },
  {
    slug: "meta-ads-roas",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Meta Reklamları",
    color: "#f472b6",
    title: "Meta Ads'de ROAS Artırmanın Kesin Yolları",
    excerpt:
      "Facebook ve Instagram reklamlarında reklam harcaması getirisini (ROAS) nasıl maksimize edersiniz? A/B test stratejileri ve kreatif ipuçları.",
    date: "5 Şubat 2026",
    dateISO: "2026-02-05",
    dateModifiedISO: "2026-10-01",
    readTime: "10 dk",
    intro:
      "ROAS (Return on Ad Spend — Reklam Harcaması Getirisi), harcadığınız her lira için elde ettiğiniz geliri ölçer. ROAS = 3 demek, 1 TL harcayıp 3 TL kazanmak demektir. Meta Ads'de başarılı kampanyalar için bu oranı nasıl maksimize edeceğinizi adım adım açıklıyoruz.",
    sections: [
      {
        h2: "Önce Şunu Bilin: Sizin İçin İyi ROAS Kaç?",
        body: "'ROAS 3 iyi mi?' sorusunun herkes için geçerli bir cevabı yok, çünkü cevap kâr marjınıza bağlı. Reklamın ne kâr ne zarar ettirdiği noktaya başabaş ROAS denir ve hesabı basittir: 1 ÷ brüt kâr marjı. Brüt marjı %50 olan bir kozmetik markası için başabaş ROAS 2'dir; ROAS 3 rahat bir kârdır. Brüt marjı %25 olan bir elektronik satıcısı için başabaş ROAS 4'tür; ROAS 3 her satışta zarar demektir. Mobilyada marj genellikle bu ikisinin arasında kalır: %30 marjla çalışan bir mağaza için başabaş ROAS yaklaşık 3,3'tür. Bu yüzden ROAS'ı artırmaya çalışmadan önce kendi başabaş noktanızı hesaplayın; hedefiniz başkasının rakamı değil, sizin marjınızın üstü olmalı.",
        link: { href: "/araclar/reklam-butcesi-hesaplayici", label: "Başabaş ROAS'ınızı hesaplayın" },
      },
      {
        h2: "ROAS'ı Etkileyen Temel Faktörler",
        body: "Meta Ads'de ROAS'ı üç ana faktör belirler: hedef kitle doğruluğu, kreatif (görsel/video) kalitesi ve açılış sayfası dönüşüm oranı. Bu üç unsurdan biri zayıfsa, diğerleri ne kadar güçlü olursa olsun ROAS düşer. Önce hangi faktörün en zayıf halkayı oluşturduğunu belirleyin.",
      },
      {
        h2: "Doğru Kampanya Yapısı",
        body: "Meta kampanyalarınızı şu yapıda kurun: Farkındalık (awareness) kampanyaları soğuk kitleye, retargeting kampanyaları siteyi ziyaret etmiş veya içerikle etkileşime girmiş sıcak kitleye yönelik olsun. Soğuk ve sıcak kitleye aynı kreatifi göstermek hem para israfıdır hem de mesaj tutarsızlığına yol açar.",
      },
      {
        h2: "Kreatif Test (A/B Test) Stratejisi",
        body: "ROAS artışının en hızlı yolu, hangi kretifin daha iyi performans gösterdiğini test etmektir. Her kampanyada en az 3 farklı kreatif başlatın: bir video, bir carousel, bir statik görsel. 3–5 gün sonra en düşük EBM'yi (Edinme Başına Maliyet) veren kretifı ölçeklendirip diğerlerini kapatın. Bu süreci her 2 haftada bir tekrarlayın.",
      },
      {
        h2: "Lookalike ve Custom Audience Kullanımı",
        body: "Mevcut müşterilerinizin telefon veya e-posta listesini Meta'ya yükleyerek Custom Audience oluşturun. Ardından bu listeye %1–3 benzerlik oranında Lookalike Audience oluşturun. Kendi müşterilerinize benzer kişileri hedeflemek, soğuk ilgi tabanlı hedeflemeye kıyasla genellikle 2–4 kat daha yüksek ROAS sağlar.",
      },
      {
        h2: "Retargeting Hunisi Kurun",
        body: "Sitenizi ziyaret edip satın almayan kullanıcıları farklı mesajlarla yeniden hedefleyin. İlk retargeting turu: ürün/hizmet faydalarını vurgulayan içerik. İkinci tur (7+ gün sonra): sosyal kanıt (referans) + aciliyet mesajı. Üçüncü tur (14+ gün): özel teklif veya indirim. Bu yapı, retargeting ROAS'ını dramatik biçimde artırır.",
      },
      {
        h2: "Bütçe Ölçeklendirme Kuralları",
        body: "Performans gösteren bir reklam setini ölçeklendirirken günlük bütçeyi bir anda ikiye katlamayın. Algoritma her büyük değişiklikten sonra yeniden öğrenme sürecine girer ve performans geçici olarak düşer. Bütçeyi 3 günde bir %20–30 artırarak ölçeklendirin. Acele edilen ölçeklendirme, kazanan kampanyaları öldürür.",
      },
      {
        h2: "Satış Mağazada Kapanıyorsa ROAS Nasıl Ölçülür?",
        body: "Meta'nın panelde gösterdiği ROAS, yalnızca Meta'ya bildirilen satın almalardan hesaplanır. Satışınız WhatsApp'ta ya da mağazada kapanıyorsa panel ROAS'ı ya hiç görünmez ya da gerçeği yansıtmaz. Bu durumda iki yol var. Birincisi basit bir hesap: bir ay boyunca reklamdan gelen mesajları ve bunlardan kapanan satışların cirosunu kaydedin, toplam ciroyu o ayın Meta harcamasına bölün; bu sizin gerçek ROAS'ınızdır. İkincisi daha güçlü bir kurulum: mağaza satışlarını müşterinin onayıyla Conversions API üzerinden Meta'ya geri bildirmek. Böylece Meta hangi reklamı görenlerin mağazada satın aldığını eşleştirir ve kampanyaları mesaj atana değil, satın alana göre optimize etmeye başlar.",
        link: { href: "/blog/meta-pixel-conversions-api-rehberi", label: "Meta Pixel ve Conversions API rehberi" },
      },
      {
        h2: "Açılış Sayfası Optimizasyonu",
        body: "ROAS'ın göz ardı edilen bileşeni açılış sayfasıdır. Reklamdan gelen trafik ne kadar kaliteli olursa olsun, açılış sayfası yavaş yükleniyorsa veya güven vermiyorsa dönüşüm gerçekleşmez. Sayfa yükleme süresini 3 saniyenin altında tutun, mobil uyumlu tasarım kullanın ve en fazla 1 net CTA koyun.",
      },
    ],
    conclusion:
      "Meta Ads'de yüksek ROAS sabah akşam optimizasyon gerektiren bir süreçtir. markaizi olarak Meta reklam kampanyalarınızı haftalık raporlarla yönetip sürekli iyileştiriyoruz. Kampanyanızın ROAS analizini ücretsiz yapmak için bizimle iletişime geçin.",
    faq: [
      {
        q: "ROAS nasıl hesaplanır?",
        a: "ROAS = reklamdan gelen ciro ÷ reklam harcaması. Ayda 40.000 TL reklam harcayıp reklamdan 200.000 TL ciro elde ettiyseniz ROAS 5'tir; yani her 1 TL reklam 5 TL ciro getirmiştir.",
      },
      {
        q: "Başabaş ROAS nedir, nasıl bulunur?",
        a: "Reklamın ne kâr ne zarar ettirdiği ROAS seviyesidir: 1 ÷ brüt kâr marjı. Marjınız %30 ise başabaş ROAS yaklaşık 3,3'tür. Bunun altındaki ROAS, ürün maliyeti ve reklam düşüldükten sonra zarar anlamına gelir.",
      },
      {
        q: "Satışlarım mağazada oluyor, Meta'daki ROAS rakamına güvenebilir miyim?",
        a: "Tek başına güvenmeyin. Meta yalnızca kendisine bildirilen satın almaları görür. Reklamdan gelen müşterilerin mağazadaki satışlarını kaydedip harcamaya bölerek gerçek ROAS'ınızı hesaplayabilir ya da bu satışları Conversions API ile Meta'ya geri bildirebilirsiniz.",
      },
    ],
  },
  {
    slug: "tiktok-for-business",
    category: "TikTok",
    color: "#34d399",
    title: "TikTok For Business: Markalar İçin Kapsamlı Rehber",
    excerpt:
      "TikTok Ads Manager kullanımı, In-Feed reklam formatları ve Türkiye pazarında TikTok'u etkin kullanma stratejileri.",
    date: "12 Şubat 2026",
    dateISO: "2026-02-12",
    readTime: "10 dk",
    intro:
      "TikTok, Türkiye'de 25 milyonu aşkın aktif kullanıcısıyla artık yalnızca genç neslin platformu değil. 25–44 yaş grubunun kullanımı her yıl artıyor ve platform, özellikle moda, yemek, güzellik, hizmet ve eğitim sektörlerinde markalar için güçlü bir satış kanalına dönüşüyor.",
    sections: [
      {
        h2: "TikTok'u Farklı Kılan Ne?",
        body: "TikTok algoritması, takipçi sayısından bağımsız çalışır. Az takipçili bir hesabın videosu viral olabilirken, büyük hesapların videoları düşük izlenebilir. Bu, küçük ve orta ölçekli işletmeler için eşsiz bir fırsat sunar. İçerik kalitesi ve etkileşim hızı her şeyin önünde.",
      },
      {
        h2: "TikTok Reklam Formatları",
        body: "In-Feed Ads: Kullanıcının 'For You' akışına yerleşen, 9–15 saniyelik reklamlardır. En yaygın kullanılan format. TopView: Uygulamayı açınca ilk görünen tam ekran reklam. Marka bilinirliği kampanyaları için idealdir. Branded Hashtag Challenge: Kullanıcıları içerik üretmeye davet eden interaktif format. Spark Ads: Organik olarak iyi performans gösteren içeriklerinizi reklama dönüştürmenizi sağlar — genellikle en yüksek dönüşüm oranını verir.",
      },
      {
        h2: "TikTok Pixel Kurulumu",
        body: "Web sitenize TikTok Pixel eklemek, reklam performansını ölçmek ve retargeting yapabilmek için zorunludur. Pixel, sitenizdeki önemli eylemleri (ürün görüntüleme, sepete ekleme, satın alma) TikTok Ads Manager'a bildirir. Bu veriler olmadan kampanyalarınızı optimize etmek mümkün değildir.",
      },
      {
        h2: "Organik İçerik Stratejisi",
        body: "TikTok'ta başarılı olmak için organik ve ücretli içeriği birlikte düşünün. Trend sesleri kullanın, ancak markanızın sesine uyarlayın. 'Day in the life', 'behind the scenes', 'before/after' formatları Türk kullanıcılarda yüksek etkileşim alır. Her video, ilk 1–2 saniyede izleyiciyi tutmalı; yoksa atlama oranı yükselir.",
      },
      {
        h2: "Hedefleme Seçenekleri",
        body: "TikTok Ads Manager; demografik (yaş, cinsiyet, konum), ilgi alanı ve davranış bazlı hedefleme sunar. Özellikle 'Custom Audience' ile mevcut müşteri listelerinizi yükleyip Lookalike audience oluşturabilirsiniz. Türkiye'de TikTok reklamları henüz Meta kadar doymuş değil; bu nedenle tıklama maliyetleri genellikle daha düşük.",
      },
      {
        h2: "Türkiye'de Hangi Sektörler Öne Çıkıyor?",
        body: "Moda ve giyim, güzellik ve cilt bakımı, restoran ve yemek, online eğitim, ev dekorasyonu ve hizmet sektörü — bu kategoriler TikTok'ta en yüksek organik erişimi alan sektörler. B2B hizmetler için de TikTok'ta markalaşma kampanyaları giderek yaygınlaşıyor.",
      },
      {
        h2: "TikTok'ta Başarı için 3 Altın Kural",
        body: "1) Platforma özgü içerik üretin — Instagram'dan kopyalanmış içerikler TikTok'ta çalışmaz. 2) Tutarlılık kritik — haftada en az 3–4 video. 3) Trendlere hızlı yanıt verin — bir trend 48–72 saat içinde zirve yapar ve söner, geç kalırsanız değeri kaybolur.",
      },
    ],
    conclusion:
      "TikTok, erken davranan markaların büyük avantaj sağladığı bir platform. markaizi olarak TikTok organik yönetimi ve reklam kampanyalarında Türkiye pazarına özel stratejiler geliştiriyoruz. Ücretsiz strateji görüşmesi için bize ulaşın.",
  },
  {
    slug: "yapay-zeka-icerik",
    category: "İçerik Üretimi",
    color: "#fbbf24",
    title: "Yapay Zeka ile İçerik Üretimi: Ajansların Kullandığı Araçlar",
    excerpt:
      "ChatGPT, Midjourney, Canva AI ve daha fazlası. Dijital ajanslar içerik üretimini nasıl hızlandırıyor ve kaliteyi nasıl koruyor?",
    date: "20 Şubat 2026",
    dateISO: "2026-02-20",
    readTime: "6 dk",
    intro:
      "Yapay zeka araçları, dijital ajansların içerik üretim hızını dramatik biçimde artırıyor. Aylarca süren süreçler saatlere iniyor; ancak kaliteyi korumak için insan denetimi her zamankinden daha kritik. İşte profesyonel ajansların aktif kullandığı araçlar ve kullanım senaryoları.",
    sections: [
      {
        h2: "ChatGPT / Claude: Metin Yazarlığının Hızlandırıcısı",
        body: "Sosyal medya caption'ları, blog taslakları, reklam metinleri ve e-posta içerikleri için GPT-4 ve Claude vazgeçilmez araçlar haline geldi. Ajansların çoğu, yapay zekayı birinci taslak için kullanıp ardından marka sesine uygun düzeltmeler yapıyor. Sıfırdan yazmak yerine '5 farklı versiyon üret, en iyisini seç ve düzelt' yaklaşımı çalışma süresini %60 kısaltıyor.",
      },
      {
        h2: "Midjourney & DALL-E: Özgün Görsel Üretimi",
        body: "Stok fotoğrafların tekdüzeliğinden kurtulmak için Midjourney veya DALL-E gibi AI görsel araçları kullanılıyor. Marka renklerine ve stiline uygun prompt'lar geliştirerek tutarlı görseller üretebilirsiniz. Ancak ticari kullanım için her platformun lisans koşullarını dikkatle inceleyin — özellikle Midjourney'in ücretsiz planında ticari hak sınırlamaları var.",
      },
      {
        h2: "Canva AI: Hızlı Tasarım Üretimi",
        body: "Canva'nın yapay zeka özellikleri (Magic Design, Magic Write, Background Remover, Magic Edit) içerik üretimini önemli ölçüde hızlandırıyor. Özellikle sosyal medya postları ve story şablonları için ideal. Marka kitine bağlı şablonlar oluşturduğunuzda her yeni içerik talebi dakikalar içinde karşılanabiliyor.",
      },
      {
        h2: "Runway & Kling AI: Video İçerik Üretimi",
        body: "Kısa ürün videoları, animasyonlu post ve reels için Runway Gen-3 ve Kling AI gibi araçlar hız kazandırıyor. Statik bir ürün fotoğrafından hareket efektli video üretmek artık saniyeler alıyor. Bu araçlar özellikle e-ticaret ürünleri için görsel varlık üretimini kolaylaştırıyor.",
      },
      {
        h2: "Yapay Zeka Workflow'u Nasıl Kurulur?",
        body: "1) Aylık içerik takvimini önce insan stratejistiyle belirleyin. 2) Her içerik için yapay zekaya detaylı brief verin (hedef kitle, mesaj, ton, format). 3) Üretilen taslakları marka sesine uygun olarak düzeltin. 4) Görselleri ve metinleri bir araya getirip son kalite kontrolünü insana bırakın. Bu döngü, içerik kapasitesini 3–4 kat artırırken kaliteyi korur.",
      },
      {
        h2: "Yapay Zekanın Yapamadıkları",
        body: "Yapay zeka; müşteri hikayelerini, özgün marka deneyimlerini, gerçek sahne çekimlerini ve lokal/kültürel nüansları tam olarak yakalayamaz. Tamamen yapay zeka üretimi içerikler zaman içinde 'sahte' hissettiriyor ve marka güvenilirliğini zedeleyebilir. En iyi yaklaşım: yapay zekayı hız için, insanı kalite ve özgünlük için kullanmak.",
      },
    ],
    conclusion:
      "Yapay zeka, içerik üretiminde bir devrim değil; yetenekli ellerde güçlü bir hız aracı. markaizi olarak AI destekli içerik üretim süreçlerini marka stratejisiyle harmanlıyor, hız ile özgünlüğü birleştiriyoruz. İçerik üretim paketlerimizi incelemek için bizimle iletişime geçin.",
  },
  {
    slug: "core-web-vitals",
    category: "Web Tasarım",
    color: "#a78bfa",
    title: "2026'da Web Sitesi Hız Optimizasyonu: Core Web Vitals Rehberi",
    excerpt:
      "Google'ın sıralamada önem verdiği Core Web Vitals metrikleri nelerdir? LCP, INP ve CLS nasıl iyileştirilir?",
    date: "1 Mart 2026",
    dateISO: "2026-03-01",
    readTime: "8 dk",
    intro:
      "Google, 2021'den bu yana Core Web Vitals'ı arama sıralama faktörü olarak kullanıyor. Yavaş veya görsel olarak dengesiz bir site, rakipleriniz tarafından geçilmenize yol açar. Bu rehberde, teknik bilgi gerektirmeyen pratik optimizasyon adımlarını bulacaksınız.",
    sections: [
      {
        h2: "Core Web Vitals Nedir?",
        body: "Google üç temel metrik üzerinden değerlendirme yapar: LCP (Largest Contentful Paint) — sayfanın en büyük içeriğinin yüklenme süresi, hedef 2.5 saniyenin altı. INP (Interaction to Next Paint) — kullanıcı etkileşimine verilen yanıt hızı, hedef 200ms altı. CLS (Cumulative Layout Shift) — sayfa yüklenirken öğelerin kayma miktarı, hedef 0.1 altı. Bu üç metrikte 'İyi' statüsüne ulaşmak, arama sıralamalarınızı olumlu etkiler.",
      },
      {
        h2: "LCP (Yüklenme Hızı) Nasıl İyileştirilir?",
        body: "Hero bölümündeki büyük görsele priority loading ekleyin (Next.js'te Image component'in priority={true} kullanımı). Hosting sunucusunun yanıt süresi 200ms altında olmalı — Türkiye'de müşterilere hizmet veriyorsanız, sunucu konumu veya CDN önemli. Görselleri WebP formatına dönüştürün, boyutlarını küçültün. Google Fonts gibi üçüncü taraf kaynakları preconnect ile önceden bağlayın.",
      },
      {
        h2: "CLS (Görsel Stabilite) Nasıl İyileştirilir?",
        body: "Sayfada kayma genellikle boyutsuz görsellerden ve geç yüklenen fontlardan kaynaklanır. HTML'deki tüm img etiketlerine width ve height ekleyin. Fontlar için font-display: swap kullanın. Dinamik banner ve reklam alanlarına sabit yükseklik rezerve edin. Bir sayfa beklenmedik biçimde 'zıplıyorsa', büyük olasılıkla CLS sorunu vardır.",
      },
      {
        h2: "INP (Etkileşim Hızı) Nasıl İyileştirilir?",
        body: "INP, tıklama veya dokunmadan sonra tarayıcının görsel güncelleştirme yapana kadar geçen süreyi ölçer. Büyük JavaScript dosyaları, ana iş parçacığını (main thread) blokladığında INP yükselir. Kullanılmayan JavaScript'i kaldırın, kritik olmayan kütüphaneleri lazy load edin ve üçüncü taraf scriptleri (analytics, chat) async olarak yükleyin.",
      },
      {
        h2: "Test Araçları",
        body: "PageSpeed Insights (pagespeed.web.dev): Google'ın resmi test aracı, hem lab hem de gerçek kullanıcı verisi sunar. GTmetrix: Detaylı şelale grafiği ve optimizasyon önerileri için ideal. Chrome DevTools > Lighthouse: Geliştirici ortamında hızlı test için. Search Console > Core Web Vitals raporu: Gerçek kullanıcı verilerinizi izin için zorunlu araç.",
      },
      {
        h2: "Next.js ile Otomatik Optimizasyon Avantajları",
        body: "Next.js ile geliştirilen siteler, Image Optimization (otomatik boyut, format dönüşümü), font optimizasyonu (next/font), code splitting ve static generation gibi özelliklerle Core Web Vitals açısından büyük avantaj sağlar. Bu nedenle markaizi olarak tüm web projelerinde Next.js tercih ediyoruz.",
      },
      {
        h2: "Core Web Vitals ile SEO Bağlantısı",
        body: "Google, Core Web Vitals puanlarını 'sayfa deneyimi sinyali' olarak kullanır. Benzer içeriklere sahip iki sayfa arasında, daha iyi Core Web Vitals puanına sahip olan üst sırada gösterilir. E-ticaret siteleri için bu doğrudan gelir etkisi anlamına gelir: 1 saniyelik yükleme süresi gecikmesi, dönüşüm oranını ortalama %7 düşürür.",
      },
    ],
    conclusion:
      "Core Web Vitals optimizasyonu, hem kullanıcı deneyimini iyileştirir hem de Google sıralamalarını olumlu etkiler. markaizi olarak web tasarım projelerinde hız optimizasyonunu standart sürecimizin parçası yapıyoruz. Sitenizin ücretsiz Core Web Vitals analizini yaptırmak için bizimle iletişime geçin.",
  },
  {
    slug: "mobilya-reklami-nasil-verilir",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Mobilya Reklamı Nasıl Verilir? Google ve Instagram İçin Adım Adım Rehber",
    excerpt:
      "Mobilya mağazanız için Instagram ve Google'da reklam vermenin doğru yolu. Bütçe, hedefleme, görsel seçimi ve mobilya sektörüne özel kampanya kurgusu.",
    date: "12 Nisan 2026",
    dateISO: "2026-04-12",
    readTime: "9 dk",
    intro:
      "Mobilya reklamı, diğer sektör reklamlarından farklı işler. Bir koltuk takımı anlık kararla satın alınmaz: müşteri haftalarca araştırır, görselleri karşılaştırır, fiyat sorar ve en sonunda mağazaya gelir. Bu yüzden 'reklam verdim, satış gelmedi' diyen mobilyacıların çoğu aslında yanlış kanalda, yanlış kurguyla reklam vermiştir. Bu rehberde, Ankara Siteler'den Türkiye geneline yüzlerce mobilya kampanyası yönetmiş bir ekip olarak mobilya reklamının doğrusunu adım adım anlatıyoruz.",
    sections: [
      {
        h2: "1. Önce Kanalı Doğru Seçin: Instagram mı, Google mı?",
        body: "İki kanal iki farklı müşteriyi yakalar. Instagram ve Facebook reklamları, henüz aktif arayışta olmayan ama ev değişikliği, evlilik hazırlığı veya dekorasyon yenileme düşünen kişiye ilham verir — mobilyada talep yaratan kanal budur. Google reklamları ise 'ankara koltuk takımı' veya 'siteler yatak odası fiyatları' diye arayan, satın almaya en yakın müşteriyi yakalar. İdeal kurgu ikisini birlikte kullanmaktır: Instagram ile tanıtır, Google ile arayanı yakalar, retargeting ile ikisini de geri getirirsiniz.",
      },
      {
        h2: "2. Görsel Kalitesi Reklam Maliyetinizi Belirler",
        body: "Mobilya görselle satılır. Meta'nın reklam sistemi, kullanıcıların ilgisini çeken reklamlara daha ucuz gösterim verir; loş showroom'da telefonla çekilmiş bir koltuk fotoğrafı ile profesyonel çekilmiş, aydınlık ve yaşam alanı hissi veren bir fotoğraf arasında tıklama maliyeti 2-3 kat fark edebilir. Reklam bütçesi ayırmadan önce ürün çekimine yatırım yapın: iyi görsel, kötü görselden her zaman daha ucuza müşteri getirir.",
      },
      {
        h2: "3. Ürün Grubu Bazlı Kampanya Kurun",
        body: "Tüm mağazayı tek reklamda tanıtmak, en sık yapılan hatadır. Koltuk takımı arayan ile genç odası arayan farklı kişilerdir; yaşları, ilgi alanları ve bütçeleri farklıdır. Kampanyalarınızı ürün gruplarına bölün: yatak odası kampanyası evlilik hazırlığı yapanlara, genç odası kampanyası 35-50 yaş ebeveynlere, koltuk takımı kampanyası yeni taşınanlara hedeflensin. Bölünmüş kampanya, hangi ürünün reklamdan para kazandırdığını da net gösterir.",
      },
      {
        h2: "4. Hedeflemede Mobilyaya Özel Sinyalleri Kullanın",
        body: "Meta reklamlarında mobilya için güçlü hedefleme sinyalleri: yakın zamanda taşınanlar, nişanlılar ve evlilik hazırlığındakiler, ev dekorasyonu ve iç mimari ile ilgilenenler, belirli gelir bölgelerinde oturanlar. Google'da ise anahtar kelimeleri satın alma niyetine göre ayırın: 'koltuk takımı fiyatları' yüksek niyetli, 'salon dekorasyon fikirleri' düşük niyetlidir. Düşük niyetli kelimelere düşük teklif verin veya bunları Instagram tarafına bırakın.",
      },
      {
        h2: "5. Reklamı WhatsApp'a Bağlayın",
        body: "Türkiye'de mobilya müşterisinin ilk teması çoğunlukla 'Fiyat nedir?' mesajıdır. Reklamlarınızı doğrudan WhatsApp'a yönlendiren 'Mesaj Gönder' kampanyaları, mobilya sektöründe form doldurmaya göre çok daha yüksek dönüşüm alır. Gelen mesajlara ilk 5-10 dakika içinde yanıt vermek kritiktir: mobilya müşterisi aynı anda 3-4 mağazayla yazışır, ilk dönen genellikle showroom ziyaretini kapar.",
      },
      {
        h2: "6. Bütçeyi Sezona Göre Planlayın",
        body: "Mobilyada talep mevsimseldir. İlkbahar ve yaz başı evlilik sezonu yatak odası ve tüm ev alışverişini, eylül taşınma ve okul dönemi genç odasını, kasım-aralık ise kampanya beklentisini tetikler. Reklam bütçenizi yıl boyunca sabit tutmak yerine, sektörünüzün yoğun aylarında artırıp durgun aylarda marka bilinirliğine kaydırmak aynı yıllık bütçeyle daha fazla satış getirir.",
      },
      {
        h2: "7. Ölçmeden Harcamayın",
        body: "Kaç kişi reklamı gördü değil; kaç mesaj geldi, kaç kişi aradı, kaç kişi mağazaya geldi ve kaçı satın aldı — bakmanız gereken zincir budur. WhatsApp mesaj sayısı, telefon araması ve yol tarifi alma gibi eylemleri dönüşüm olarak izleyin. Müşteri başına maliyetinizi bilirseniz, hangi kampanyayı büyütüp hangisini kapatacağınıza veriyle karar verirsiniz.",
      },
      {
        h2: "Sık Yapılan 3 Hata",
        body: "Birincisi: 'Gönderiyi öne çıkar' butonuyla reklam vermek — bu, Meta Reklam Yöneticisi'ndeki hedefleme ve optimizasyon gücünün çok azını kullanır. İkincisi: reklamı 2-3 gün yayınlayıp 'olmadı' diye kapatmak — algoritmanın öğrenme süreci en az 5-7 gündür. Üçüncüsü: her reklamda indirim vermek — sürekli indirim, markanızı 'indirimsiz alınmaz' algısına sokar ve kâr marjınızı eritir.",
      },
    ],
    conclusion:
      "Mobilya reklamı, sektörü tanıyan bir el değdiğinde bambaşka sonuç verir. markaizi olarak Siteler'de 10 yılı aşkın süredir mobilya firmalarıyla çalışıyor; İstikbal ve Doğtaş bayilerinden yerel üreticilere kadar yüzlerce kampanya yönetiyoruz. Mağazanız için ücretsiz reklam analizi almak isterseniz WhatsApp'tan bize yazın.",
  },
  {
    slug: "mobilya-magazalari-icin-instagram",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Mobilya Mağazaları İçin Instagram: Takipçiyi Müşteriye Çeviren 8 Taktik",
    excerpt:
      "Instagram'da mobilya satmanın püf noktaları: showroom çekimleri, Reels stratejisi, fiyat sorularını yönetme ve takipçiyi mağazaya getirme yöntemleri.",
    date: "3 Mayıs 2026",
    dateISO: "2026-05-03",
    readTime: "8 dk",
    intro:
      "Instagram, mobilya sektörünün en güçlü vitrini. Müşteriler artık mağaza gezmeden önce Instagram'da geziyor; hesabınız düzensiz, görselleriniz karanlık ve son paylaşımınız 3 ay önceyse, o müşteri rakibinizin showroom'una gidiyor. İşte Ankara Siteler'deki mobilya mağazaları için yıllardır uyguladığımız, takipçiyi gerçek müşteriye çeviren 8 taktik.",
    sections: [
      {
        h2: "1. Profilinizi Mağaza Vitrini Gibi Düzenleyin",
        body: "Müşteri profilinize girdiğinde 3 saniyede ne sattığınızı, nerede olduğunuzu ve size nasıl ulaşacağını görmeli. Biyografide net konum (örn. Siteler / Ankara), WhatsApp linki ve çalışma saatleri olsun. Öne çıkan hikayeleri ürün gruplarına göre düzenleyin: Koltuk Takımları, Yatak Odası, Genç Odası, Müşteri Yorumları. Karışık ve amatör bir profil, ürününüz ne kadar iyi olursa olsun güven vermez.",
      },
      {
        h2: "2. Reels'i Showroom Turu Gibi Kullanın",
        body: "Mobilyada en çok izlenen içerik formatı showroom turu ve ürün tanıtım Reels'leridir. 15-30 saniyelik, tek ürüne odaklanan, ürünün kumaşını ve detayını gösteren videolar hem organik erişim alır hem de kaydedilir. Haftada en az 3 Reels hedefleyin: bir ürün tanıtımı, bir showroom/yeni gelen ürün turu, bir de müşteri evinde kurulum veya teslimat içeriği.",
      },
      {
        h2: "3. Işık, Mobilya Fotoğrafının Yarısıdır",
        body: "Karanlık showroom fotoğrafı satış öldürür. Ürünlerinizi gün ışığına yakın beyaz ışıkla, mümkünse yaşam alanı kurgusuyla (halı, yastık, aksesuar ile) çekin. Telefonla çekiyorsanız bile geniş açıdan tüm ürünü, yakın açıdan kumaş ve detayı gösterin. Profesyonel çekim bütçeniz varsa öncelik her zaman en çok sattığınız ve kâr marjı en yüksek ürün grubuna verilmeli.",
      },
      {
        h2: "4. Fiyat Sorularını Sisteme Bağlayın",
        body: "Her mobilya paylaşımının altına 'fiyat?' yorumu gelir. Bunları yanıtsız bırakmak müşteri kaybettirir, herkese aynı kopyala-yapıştır cevabı vermek ise samimiyetsiz durur. En sağlıklı akış: yoruma kısa ve kibar yanıt verip DM veya WhatsApp'a yönlendirmek, WhatsApp'ta ise fiyatla birlikte ürünün ölçü ve kumaş seçeneklerini de paylaşarak konuşmayı showroom davetine bağlamaktır.",
      },
      {
        h2: "5. Müşteri Evinden İçerik İsteyin",
        body: "Mobilyada en güçlü sosyal kanıt, ürünün gerçek bir evde kurulmuş halidir. Teslimat sonrası müşterinizden fotoğraf isteyin veya montaj ekibiniz çekip gelsin. 'Ayşe Hanım'ın salonuna kurulumumuz tamamlandı' tarzı paylaşımlar, stüdyo çekiminden daha fazla güven ve etkileşim üretir. Ayda en az 2-3 müşteri evi içeriği paylaşmayı hedefleyin.",
      },
      {
        h2: "6. Hikayeleri Günlük Esnaf Sohbetine Çevirin",
        body: "Feed'iniz vitrin, hikayeleriniz tezgahtır. Yeni gelen ürünü kutusundan çıkarırken, kumaş seçeneklerini gösterirken, atölyede üretim yapılırken çekin. Anket ve soru kutusu kullanın: 'Bu koltuğun hangi rengi salonunuza yakışır?' gibi basit sorular etkileşimi artırır ve algoritmaya hesabınızın canlı olduğunu gösterir.",
      },
      {
        h2: "7. Yerel Hashtag ve Konum Etiketi Kullanın",
        body: "Milyonluk genel etiketler yerine yerel ve niş etiketlere odaklanın: #sitelermobilya, #ankaramobilya, #koltuktakimi, #yatakodasi gibi. Her paylaşıma mutlaka konum etiketi ekleyin — Siteler veya mağazanızın bulunduğu bölge. Ankara'da mobilya arayan kullanıcılar konum ve yerel etiket üzerinden keşif yapar.",
      },
      {
        h2: "8. Organik Yetmez: Küçük Bütçeli Reklamla Destekleyin",
        body: "Instagram organik erişimi her yıl daralıyor. En iyi performans gösteren içeriklerinizi küçük bütçelerle bile reklama çevirmek, hesabınızı sadece takipçilerinize değil, mobilya almayı düşünen yeni kitlelere ulaştırır. Özellikle showroom turu Reels'leri ve müşteri evi içerikleri, reklam olarak da en düşük maliyetli sonuçları getirir.",
      },
    ],
    conclusion:
      "Instagram'da mobilya satışı; düzenli içerik, kaliteli görsel ve hızlı iletişimin toplamıdır. markaizi olarak mobilya mağazalarının Instagram hesaplarını çekimden paylaşıma, reklamdan raporlamaya uçtan uca yönetiyoruz. Hesabınızın ücretsiz analizini isterseniz bize ulaşın.",
  },
  {
    slug: "sitelerde-musteri-cekmenin-yollari",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Siteler'de Mobilya Mağazanıza Müşteri Çekmenin 7 Dijital Yolu",
    excerpt:
      "Ankara Siteler'de binlerce mobilya mağazası arasından sıyrılmanın yolları: dijital görünürlük, Google Haritalar, Instagram ve WhatsApp ile müşteri kazanma rehberi.",
    date: "7 Haziran 2026",
    dateISO: "2026-06-07",
    readTime: "8 dk",
    intro:
      "Siteler, Türkiye'nin en büyük mobilya üretim ve satış merkezi — ve aynı zamanda en rekabetçisi. Aynı cadde üzerinde onlarca mağaza aynı müşteriye satış yapmaya çalışıyor. Eskiden vitrin ve tabela yeterdi; bugün müşteri Siteler'e gelmeden önce telefonundan 3-4 mağaza belirliyor ve sadece onları geziyor. O listeye girmek ile girememek arasındaki fark, dijital görünürlük. İşte Siteler esnafı için hazırladığımız 7 maddelik yol haritası.",
    sections: [
      {
        h2: "1. Müşteri Siteler'e Gelmeden Önce Sizi Bulmalı",
        body: "Mobilya müşterisinin yolculuğu artık 'Siteler'e gidip gezelim' diye başlamıyor; 'ankara koltuk takımı', 'siteler mobilya mağazaları' gibi aramalarla ve Instagram keşfetle başlıyor. Araştırma aşamasında ekranına çıkan mağazalar, müşterinin ziyaret listesine giriyor. Bu yüzden ilk hedef: müşteri daha evinden çıkmadan markanızı ona göstermek. Google'da aranınca çıkmak, Instagram'da keşfedilmek ve Haritalar'da güçlü görünmek bu listeye girmenin üç ayağıdır.",
      },
      {
        h2: "2. Google İşletme Profilinizi Mağazanız Kadar Ciddiye Alın",
        body: "'Siteler mobilya' araması yapan biri önce harita sonuçlarını görür. Profilinizde güncel telefon, çalışma saati, bol ve kaliteli fotoğraf, ürün kategorileri ve düzenli müşteri yorumu olmalı. Yorum sayısı ve puanı, sıralamayı doğrudan etkiler: memnun her müşteriden Google yorumu isteyin. Teslimattan sonra WhatsApp'tan gönderilen tek satırlık yorum linki bile aylık yorum sayınızı katlar.",
      },
      {
        h2: "3. Instagram'ı Showroom'unuzun Şubesi Yapın",
        body: "Siteler'e gelemeyen ya da gelmeden araştıran müşteri için Instagram hesabınız ikinci showroom'unuzdur. Düzenli ürün paylaşımı, showroom turu Reels'leri ve müşteri evi kurulum içerikleri güven yaratır. Hesabı olmayan veya aylardır paylaşım yapmayan mağaza, müşterinin gözünde 'kapalı dükkan' etkisi bırakır.",
      },
      {
        h2: "4. WhatsApp'ı Satış Kanalına Dönüştürün",
        body: "Siteler'de satışın büyük kısmı hâlâ konuşarak, pazarlıkla kapanır — WhatsApp bunun dijital hali. İşletme hesabı kullanın: katalog özelliğine ürünlerinizi yükleyin, hızlı yanıt şablonları hazırlayın, mesai dışı otomatik yanıt kurun. Reklamlarınızı ve Instagram profilinizi doğrudan WhatsApp'a bağlayın. İlk mesaja dönüş hızınız, müşterinin hangi mağazayı ziyaret edeceğini belirler.",
      },
      {
        h2: "5. Reklamı 'Siteler'e Gelen'e Değil, 'Mobilya Alacak Olana' Verin",
        body: "Yaygın hata, reklamı yalnızca Siteler çevresine hedeflemektir. Oysa müşteriniz Çankaya'da, Keçiören'de, hatta Kırıkkale'de oturuyor ve mobilya almaya karar verdiğinde Siteler'e geliyor. Meta ve Google reklamlarında hedefi konum değil niyet belirlemeli: taşınma, evlilik, dekorasyon ilgisi gibi sinyaller taşıyan Ankara ve çevre il kitlelerine ulaşın. Türkiye geneline satış yapıyorsanız kargo/montaj kapasitenize göre hedefi genişletin.",
      },
      {
        h2: "6. Üretici Gücünüzü İçeriğe Çevirin",
        body: "Siteler'in en büyük kozu üretimin burada olması — bunu içerik olarak kullanan mağaza ise çok az. Atölyede iskeletin yapılışı, döşemenin geçilişi, kumaş seçimi... Bu 'işin mutfağı' içerikleri hem güven verir hem de 'fabrikadan fiyatına' algısını güçlendirir. Hazır mobilya satan zincirlerin yapamayacağı tek içerik türü budur; farkınız burada.",
      },
      {
        h2: "7. Gelen Müşteriyi Veriye Dönüştürün",
        body: "Mağazaya gelen her müşteri bir daha bulamayacağınız bir veri olabilir — telefonunu alın, WhatsApp listenize ekleyin (izinli şekilde), yeni sezon ve kampanya dönemlerinde toplu mesajla geri çağırın. Mobilyada müşteri 5-10 yıl sonra tekrar alışveriş yapar ama çevresine her yıl tavsiye verir. Memnun müşteri iletişimde tutulursa, Siteler'deki en ucuz reklam kanalınız o olur.",
      },
    ],
    conclusion:
      "Siteler'de öne çıkmak artık caddedeki en büyük tabelaya sahip olmakla değil, müşterinin telefonundaki ekranda görünmekle mümkün. markaizi olarak Siteler'in içinden gelen bir ekip olarak mobilya mağazalarına dijital görünürlük, reklam yönetimi ve sosyal medya hizmeti veriyoruz. Mağazanız için ücretsiz yol haritası çıkarmamızı isterseniz WhatsApp'tan yazın.",
  },
  {
    slug: "mobilya-yerel-seo-rehberi",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Mobilya Mağazaları İçin Google Haritalar ve Yerel SEO Rehberi",
    excerpt:
      "\"Yakınımdaki mobilya mağazası\" aramalarında üst sıraya çıkın: Google İşletme Profili optimizasyonu, yorum stratejisi ve yerel arama görünürlüğü rehberi.",
    date: "28 Haziran 2026",
    dateISO: "2026-06-28",
    readTime: "7 dk",
    intro:
      "Google'da 'yakınımdaki mobilya mağazası' veya 'siteler mobilya' arayan müşteri, satın almaya en yakın müşteridir — arabasına binip gelmeye hazırdır. Bu aramalarda ilk 3 harita sonucunda (local pack) görünen mağazalar telefonları ve ziyaretleri alırken, alt sıradakiler listeye bile giremez. İyi haber: yerel SEO, mobilya sektöründe çoğu mağazanın ihmal ettiği, doğru yapıldığında birkaç ayda sonuç veren bir alandır.",
    sections: [
      {
        h2: "Google İşletme Profili: Dijital Tabelanız",
        body: "Her şey eksiksiz bir Google İşletme Profili (eski adıyla Google My Business) ile başlar. İşletme adınız tabeladakiyle aynı olmalı, kategori olarak 'Mobilya mağazası' ana kategori seçilmeli, mobilya türlerinize göre ek kategoriler (yatak mağazası, ofis mobilyaları vb.) eklenmelidir. Telefon, adres, çalışma saatleri ve web sitesi güncel olmalı; özellikle bayram ve özel gün saatlerini güncellemeyi unutmayın — 'açık yazıyordu, kapalıydı' deneyimi yorumlara olumsuz döner.",
      },
      {
        h2: "Fotoğraf: Profilinizin Satış Gücü",
        body: "Harita sonuçlarında müşterinin gözü önce fotoğrafa gider. Showroom'un dışı (müşteri sizi bulabilsin), içi (ürün çeşitliliği görünsün) ve öne çıkan ürünlerinizden oluşan en az 20-30 kaliteli fotoğraf yükleyin. Ayda birkaç yeni fotoğraf eklemek profilin 'canlı' olduğunu gösterir. Google'ın verilerine göre fotoğrafı bol profiller, fotoğrafsızlara göre belirgin oranda daha fazla yol tarifi ve arama alır.",
      },
      {
        h2: "Yorumlar: Yerel Sıralamanın En Güçlü Sinyali",
        body: "Harita sıralamasını belirleyen en önemli faktörlerden biri yorum sayısı, puanı ve güncelliğidir. Sistemi kurun: her teslimat sonrası müşteriye WhatsApp'tan tek tıkla yorum bırakabileceği link gönderilsin. Yorumlara — olumlu ya da olumsuz — mutlaka yanıt verin; yanıtlar hem Google'a aktif olduğunuzu gösterir hem de profili okuyan yeni müşteriye güven verir. Olumsuz yoruma sakin ve çözüm odaklı yanıt, çoğu zaman olumlu yorumdan daha fazla güven üretir.",
      },
      {
        h2: "Web Sitenizle Haritayı Birbirine Bağlayın",
        body: "Google, işletme profilindeki bilgilerle web sitenizdeki bilgilerin tutarlı olmasına bakar. Sitenizde adres, telefon ve çalışma saatleri profildekiyle birebir aynı olmalı; iletişim sayfanızda Google Haritalar gömülü harita bulunmalı. Sitenizde 'Siteler', 'Ankara' ve sattığınız ürün gruplarının adları metin olarak geçmeli — Google, hangi aramalarla ilgili olduğunuzu bu metinlerden anlar.",
      },
      {
        h2: "Google Posts ile Kampanyalarınızı Duyurun",
        body: "İşletme profilinin az bilinen özelliği Google Posts: kampanya, yeni ürün ve duyurularınızı doğrudan harita profilinizde gösterir. 'Yatak odası takımlarında sezon kampanyası' gibi paylaşımlar, profilinizi ziyaret eden karar aşamasındaki müşteriye son dokunuşu yapar. Haftada bir paylaşım, profili aktif tutmak için yeterlidir.",
      },
      {
        h2: "Sık Yapılan Yerel SEO Hataları",
        body: "En yaygın hatalar: işletme adına anahtar kelime doldurmak ('Mert Mobilya Siteler En Ucuz Koltuk' gibi — Google bunu cezalandırabilir), birden fazla profil açmak (şube değilse tek profil olmalı), sahte yorum satın almak (tespit edildiğinde tüm yorumlarınız silinebilir) ve profili kurup unutmak. Yerel SEO tek seferlik kurulum değil, düşük tempolu ama düzenli bir bakım işidir.",
      },
      {
        h2: "Sonuç Ne Zaman Gelir?",
        body: "Yerel SEO'da değişikliklerin harita sıralamasına yansıması genellikle 4-12 hafta alır. İlk ay profil eksiklerini tamamlayıp fotoğraf ve yorum akışını başlatın; ikinci aydan itibaren profil istatistiklerinden (kaç arama, kaç yol tarifi, kaç telefon) ilerlemeyi takip edin. Rakiplerinizin çoğu bu işi hiç yapmadığı için, düzenli çalışan bir mağaza Siteler gibi rekabetçi bir bölgede bile birkaç ayda üst sıralara çıkabilir.",
      },
    ],
    conclusion:
      "Yerel SEO, mobilya mağazaları için en düşük maliyetli ve en kalıcı müşteri kaynağıdır. markaizi olarak Google İşletme Profili kurulumu ve optimizasyonunu, mobilya firmalarına verdiğimiz dijital pazarlama hizmetinin standart parçası olarak sunuyoruz. Profilinizin ücretsiz denetimi için bizimle iletişime geçin.",
  },
  {
    slug: "ankara-mobilya-magazasi-sosyal-medya-buyume-rehberi",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Ankara'da Mobilya Mağazanızı Sosyal Medyada Büyütmenin Yolu: Kendi Başınıza mı, Ajansla mı?",
    excerpt:
      "Ankara genelinde (yalnızca Siteler değil) bir mobilya mağazası dijitalde ve sosyal medyada nasıl öne çıkar? Kendi imkanlarınızla yapabilecekleriniz ve profesyonel bir ajans desteğinin nerede fark yarattığı.",
    date: "6 Eylül 2026",
    dateISO: "2026-09-06",
    readTime: "11 dk",
    intro:
      "Ankara'da mobilya sektörü Siteler'den ibaret değil. Dikmen'den Batıkent'e, Çankaya'dan Eryaman'a, Keçiören'den Sincan'a kadar şehrin her köşesinde küçük büyük yüzlerce mağaza aynı müşteriye ulaşmaya çalışıyor. Bu kadar kalabalık bir pazarda artık iyi bir vitrin ve caddeye bakan bir tabela yetmiyor; çünkü müşteri kararını çoğu zaman mağazaya hiç adım atmadan, elindeki telefonla veriyor. Instagram'da beğendiği bir koltuk takımını kaydediyor, Google'da fiyat karşılaştırıyor, birkaç mağazanın yorumlarına bakıyor ve ancak ondan sonra hangi showroom'a gideceğine karar veriyor. Bu yazıda tam olarak bu noktadan bahsedeceğiz: Ankara'daki bir mobilya mağazası sosyal medyada ve dijitalde nasıl öne çıkar, kendi imkanlarınızla neleri halledebilirsiniz, nerede tıkanırsınız ve profesyonel bir ajans desteği tam olarak neyi değiştirir.",
    sections: [
      {
        h2: "Ankara'da Mobilya Müşterisi Artık Farklı Karar Veriyor",
        body: "Birkaç yıl öncesine kadar mobilya alışverişi caddeyi gezip beğenmekle başlardı. Bugün tam tersi: müşteri önce telefonundan araştırıyor, beğendiği birkaç mağazayı not alıyor ve showroom'a genellikle satın almaya karar vermiş halde geliyor. Bu, Ankara'nın neresinde olursanız olun geçerli — Siteler'de üretim yapan bir atölye de olsanız, Çayyolu'nda tek şubeli bir mağaza da olsanız aynı müşteri davranışıyla karşı karşıyasınız. Fark şu: dijitalde görünen mağaza bu araştırma listesine giriyor, görünmeyen mağaza müşterinin haberi bile olmadan eleniyor. Yani mesele artık 'reklam vereyim mi vermeyeyim mi' değil, 'müşteri beni ararken karşısına çıkıyor muyum' meselesi.",
      },
      {
        h2: "Kendi Başınıza Yapabilecekleriniz: Instagram'ı Vitrininiz Gibi Kurun",
        body: "Bunun için bütçe gerekmiyor, sadece düzen gerekiyor. Profilinize giren biri saniyeler içinde ne sattığınızı, nerede olduğunuzu ve nasıl ulaşacağını anlamalı. Biyografiye net bir konum yazın (örneğin 'Ankara / Çankaya' ya da 'Siteler'), WhatsApp linkinizi ekleyin, öne çıkan hikayeleri ürün gruplarına göre düzenleyin: Koltuk Takımları, Yatak Odası, Genç Odası gibi. Haftada birkaç kez düzenli paylaşım yapan bir hesap, ayda bir paylaşan bir hesaba göre çok daha güvenilir görünür — çünkü aylardır sessiz duran bir Instagram hesabı, müşteride 'acaba kapandı mı' hissi uyandırır.",
      },
      {
        h2: "Kendi Başınıza Yapabilecekleriniz: Telefonla Bile Olsa İyi Görsel",
        body: "Mobilya görselle satılır, bunun için profesyonel ekipmana ihtiyacınız yok ama ışığa kesinlikle ihtiyacınız var. Showroom'unuzu gün ışığına yakın, aydınlık çekin; karanlık bir köşede telefonla çekilmiş bir koltuk fotoğrafı, aynı koltuğun gün ışığında çekilmiş halinden çok daha az ilgi görür. Ürünün tamamını gösteren geniş bir kare, kumaşı ve dikişi gösteren bir yakın çekim yeterli bir başlangıçtır. Mümkünse haftada bir iki kısa video (Reels) çekin — ürünü kutusundan çıkarırken, showroom'da gezerken ya da teslimat sırasında. Kusursuz olması gerekmiyor, samimi ve gerçek görünmesi yeterli.",
      },
      {
        h2: "Kendi Başınıza Yapabilecekleriniz: Google İşletme Profili ve Yorumlar",
        body: "\"Ankara'da mobilya mağazası\" ya da \"yakınımdaki mobilya mağazası\" diye arayan biri önce Google Haritalar'daki üç sonucu görür. Google İşletme Profilinizi (ücretsiz) kurup güncel telefon, çalışma saatleri, bol fotoğraf ve doğru kategori ile doldurmak, hiçbir maliyeti olmayan ama etkisi büyük bir adımdır. Her teslimattan sonra müşteriye WhatsApp'tan tek tıkla yorum bırakabileceği bir link gönderin; yorum sayısı ve puanı, harita sıralamanızı doğrudan etkiler. Bu konuyu çok daha detaylı işlediğimiz bir yazımız var, isterseniz göz atabilirsiniz: Mobilya Mağazaları İçin Google Haritalar ve Yerel SEO Rehberi.",
      },
      {
        h2: "Kendi Başınıza Yapabilecekleriniz: WhatsApp'ı Gerçek Bir Satış Kanalına Çevirin",
        body: "Ankara'da mobilya müşterisinin ilk teması genellikle 'Bu koltuğun fiyatı nedir?' mesajıdır. WhatsApp İşletme hesabı kullanın, katalog özelliğine ürünlerinizi yükleyin, sık sorulan sorulara hızlı yanıt şablonları hazırlayın. Gelen mesaja ilk dakikalarda dönmek kritik önemde: mobilya müşterisi genellikle aynı anda birkaç mağazayla yazışıyor ve ilk net, samimi yanıtı veren mağaza showroom ziyaretini kazanıyor.",
      },
      {
        h2: "Peki Nerede Tıkanırsınız?",
        body: "Buraya kadar anlattıklarımızın hepsi ücretsiz ve kendi başınıza yapılabilir — ve yapmanızı da öneririz, çünkü hiçbir ajans bu temeller olmadan sihir yaratamaz. Ama gerçekçi olalım: bir mağaza işletirken aynı zamanda düzenli içerik üretmek, reklam kampanyası kurgulamak, hangi ürünün hangi yaş grubuna, hangi bütçeyle gösterileceğine karar vermek, sonuçları haftalık takip edip bütçeyi doğru yere kaydırmak — bunların hepsine zaman ayırmak neredeyse imkansız. Çoğu mağaza sahibi ya 'Gönderiyi öne çıkar' butonuyla birkaç yüz lira harcayıp sonucu göremiyor ya da işin yoğunluğuna yenilip hesabı aylarca ihmal ediyor. İkisi de aynı yere çıkıyor: dijitalde görünmemek.",
      },
      {
        h2: "Profesyonel Destekle Değişen Şey: Reklamı Doğru Kurgulamak",
        body: "Bir ajansın kattığı en büyük fark, reklamı 'herkese gösterelim' mantığından çıkarıp doğru kitleye, doğru üründe, doğru bütçeyle göstermektir. Yatak odası arayan ile genç odası arayan farklı yaşta, farklı ilgi alanında insanlardır; aynı reklamı ikisine birden göstermek bütçenizi eritir. Profesyonel yönetimde kampanyalar ürün grubuna göre ayrılır, negatif anahtar kelimeler düzenli temizlenir, hangi kreatifin daha ucuza müşteri getirdiği test edilir ve kazanan sürekli büyütülür. Bu, tek seferlik bir kurulum değil; haftalık takip ve küçük düzeltmelerle zamanla olgunlaşan bir süreçtir.",
      },
      {
        h2: "Profesyonel Destekle Değişen Şey: Zaman, Süreklilik ve Rapor",
        body: "İkinci büyük fark zaman. Siz showroom'da müşteriyle ilgilenirken, teslimat planlarken, tedarikçiyle konuşurken; içerik takviminin doldurulması, reklamın günlük takip edilmesi, ay sonunda 'kaç kişiye ulaştık, kaç mesaj geldi, kaç kişi mağazaya geldi' sorusunun cevaplanması ayrı bir uzmanlık ve ayrı bir zaman ister. Profesyonel destekte bu süreklilik garanti altına alınır: hesabınız hiç sessiz kalmaz, kampanyalarınız hiç takipsiz durmaz ve her ay elinize net bir rapor geçer. 'Reklam veriyorum ama ne işe yaradığını bilmiyorum' dönemi, düzenli raporlamayla birlikte biter.",
      },
      {
        h2: "Markaizi ile Çalışırsanız Ne Değişir?",
        body: "Biz markaizi olarak Ankara'da, özellikle mobilyanın kalbi sayılan Siteler'de 10 yılı aşkın süredir bu sektörün içindeyiz; İstikbal ve Doğtaş bayilerinden yerel üreticilere kadar 200'ün üzerinde Ankara işletmesiyle çalıştık. Mobilya sosyal medya yönetimi, Instagram ve Google reklamları, showroom çekimi ve Google Haritalar/yerel SEO — hepsini tek elden, mobilya müşterisinin nasıl düşündüğünü bilen bir ekip olarak yürütüyoruz. Bu deneyimin somut karşılığı: yönettiğimiz mobilya kampanyalarında ortalama 3,2 kat ROAS ve reklam maliyetinde ortalama %38 düşüş. Sizin için önerimiz şu: yukarıdaki ücretsiz adımları bugün uygulamaya başlayın; mağazanız büyüdükçe ve reklam bütçeniz büyüdükçe, o noktada bir mobilya reklam ajansıyla çalışmanın getirisi kendini çok daha net gösterecektir. O noktaya geldiğinizde ya da şimdiden bir yol haritası görmek isterseniz, mağazanızı ücretsiz analiz etmemiz için bize yazmanız yeterli.",
      },
    ],
    conclusion:
      "Ankara'da mobilya sektöründe kazanan mağaza, en pahalı reklamı verdiği için değil, müşteri araştırdığı anda karşısına doğru şekilde çıktığı için kazanır. Instagram'ınızı düzenli tutmak, iyi ışıkla çekim yapmak, Google İşletme Profilinizi doldurmak ve WhatsApp'a hızlı dönmek bugün başlayabileceğiniz, ücretsiz adımlardır. Reklamı ölçekleme, hedef kitleyi doğru kurgulama ve zamandan tasarruf etme noktasına geldiğinizde markaizi olarak Ankara'daki mobilya mağazaları için buradayız. Mağazanızın ücretsiz dijital analizini yaptırmak isterseniz WhatsApp'tan yazmanız yeterli.",
  },
  {
    slug: "ankara-mobilya-ajansi-nasil-secilir",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Mobilya Sektörü",
    color: "#fb923c",
    title: "Ankara'da Mobilya Ajansı Nasıl Seçilir? Sosyal Medya ve Reklam İçin 10 Maddelik Kontrol Listesi",
    excerpt:
      "Ankara'da mobilya mağazanız için sosyal medya ve reklam ajansı ararken nelere bakmalısınız? Ajansa sormanız gereken sorular, kaçınmanız gereken işaretler ve markaizi'nin bu listedeki yeri.",
    date: "26 Eylül 2026",
    dateISO: "2026-09-26",
    readTime: "10 dk",
    intro:
      "Ankara'da mobilya ajansı arayan bir mağaza sahibi genellikle şu üç şeyden birine takılır: herkes aynı şeyi vaat ediyor, fiyatlar birbirinden çok farklı ve hangi ajansın gerçekten mobilya bildiğini anlamak zor. Üstüne bir de Siteler'den Çankaya'ya kadar mağazaların birbirinden çok farklı ihtiyaçları var. Aşağıdaki liste, bir ajansla görüşmeye giderken yanınızda götürebileceğiniz 10 maddeden oluşuyor. Kendi işimizi de bu listeye vurduk; hangi maddelerde nerede durduğumuzu en sonda açıkça yazdık.",
    sections: [
      {
        h2: "1. Mobilya Sektörünü Gerçekten Tanıyor mu?",
        body: "Mobilya, yüksek tutarlı ve uzun karar süreli bir alışveriştir. Müşteri Instagram'da beğenir, Google'da fiyat araştırır, eşiyle konuşur ve haftalar sonra showroom'a gelir. Bu yolculuğu bilmeyen bir ajans, reklamı tıpkı bir tişört reklamı gibi kurgular ve bütçenizi yanlış yere harcar. Ajansa sorun: 'Daha önce hangi mobilya markalarıyla çalıştınız, evlilik sezonunda reklam planını nasıl değiştirirsiniz?' Cevabı net ve örnekli değilse bu ilk uyarı işaretidir.",
      },
      {
        h2: "2. Ankara'yı ve Siteler'i Biliyor mu?",
        body: "Ankara'da mobilya müşterisi Siteler'e, Çankaya'ya, Batıkent'e ve çevre illere dağılmış durumda. Bir ajansın yerel pazarı bilmesi, hedeflemeyi hangi bölgeye ve hangi niyete göre yapacağını bilmesi demektir. Ankara'da fiziksel bir ofisi olan, mağazanıza gelip showroom'u görebilen bir ajansla çalışmak, uzaktan yürütülen bir işe göre çok daha sağlıklı sonuç verir.",
      },
      {
        h2: "3. Ürün Çekimini Kendi Yapıyor mu?",
        body: "Mobilya görselle satılır. Sosyal medya yönetimi sunup çekimi size bırakan bir ajans, işin en önemli parçasını size yüklemiş demektir. Showroom'a gelip ürün fotoğrafı ve Reels çekimi yapan, ışığı ve kurguyu bilen bir ekip arayın. Çekim kalitesi, aynı bütçeyle alacağınız müşteri sayısını doğrudan değiştirir.",
      },
      {
        h2: "4. Reklam Bütçesi Kimin Hesabından Harcanıyor?",
        body: "Reklam bütçesi doğrudan sizin Meta ve Google hesabınızdan harcanmalı ve siz her kuruşu görebilmelisiniz. Bütçenizi ajansın hesabına yatırmanızı isteyen veya harcamayı şeffaf göstermeyen bir yapı sorun çıkarabilir. Yönetim ücreti ile reklam bütçesi ayrı kalemler olmalı; ajansın bütçenizden ayrıca komisyon alıp almadığını mutlaka sorun.",
      },
      {
        h2: "5. Sonucu Nasıl Ölçüyor ve Raporluyor?",
        body: "Kaç kişiye ulaşıldığı tek başına bir sonuç değildir. Sorulması gereken zincir şu: kaç mesaj geldi, kaç arama oldu, kaç kişi mağazaya geldi ve müşteri başına maliyet ne? Ajansa sorun: 'Ayda bir bana ne tür bir rapor vereceksiniz ve WhatsApp mesajlarını nasıl ölçeceksiniz?' Cevabı 'beğeni ve takipçi artışı' ile sınırlıysa satış odaklı çalışmıyor olabilir.",
      },
      {
        h2: "6. Organik ve Ücretli İşi Birlikte Düşünüyor mu?",
        body: "Yalnızca reklam yönetip hesabınızı boş bırakan ya da yalnızca paylaşım yapıp reklamı hiç ele almayan bir ajans yarım iş yapar. Reklamdan gelen kişi Instagram profilinize girdiğinde düzenli, güven veren bir hesap görmezse dönüşüm düşer. İyi bir yapıda içerik, reklam ve Google Haritalar profili birbirini besler.",
      },
      {
        h2: "7. Google Haritalar ve Yerel SEO'yu Kapsıyor mu?",
        body: "Ankara'da mobilya arayan müşteri önce harita sonuçlarını görür. Google İşletme Profili optimizasyonu, yorum yönetimi ve yerel arama görünürlüğü, sosyal medya kadar önemli ve çoğu ajansın atladığı bir alandır. Ajansın bu hizmeti verip vermediğini sorun.",
      },
      {
        h2: "8. Sabit Bir Paket mi Sunuyor, Sizi Dinliyor mu?",
        body: "Yatak odası ağırlıklı bir mağaza ile koltuk takımı ağırlıklı bir mağazanın ihtiyacı farklıdır. Görüşmede sizi dinlemeden hazır paket sunan ajans, muhtemelen size özel çalışmayacaktır. İlk görüşmede mağazanızı, ürün gruplarınızı ve mevcut hesabınızı inceleyip ona göre öneri getiren bir ajans daha güvenilirdir.",
      },
      {
        h2: "9. Vaat mi Veriyor, Yöntem mi Anlatıyor?",
        body: "'Garanti satış' veya 'kısa sürede 100 bin takipçi' gibi vaatler bir uyarı işaretidir. Dürüst bir ajans sonucu garanti edemez; ne yapacağını, neyi ölçeceğini ve ilk 4-6 haftada neyi test edeceğini anlatır. Reklam algoritmasının öğrenme süresi olduğunu ve ilk günlerde sonuç beklenmemesi gerektiğini de açıkça söylemelidir.",
      },
      {
        h2: "10. Sözleşme ve Çıkış Şartları Net mi?",
        body: "Hizmet kapsamı, ücret, fatura dönemi ve sözleşmeyi sonlandırma şartı yazılı olmalı. Hesap ve içerik erişimi de size ait olmalı: ajansla yolları ayırdığınızda reklam hesabınızı, verilerinizi ve içeriklerinizi alabilmelisiniz.",
      },
      {
        h2: "markaizi Bu Listede Nerede Duruyor?",
        body: "Kendi işimizi bu 10 maddeye açıkça vuralım. Siteler'in içinden gelen bir ekibiz; 10 yılı aşkın süredir Siteler esnafıyla çalışıyor, İstikbal ve Doğtaş bayilerinden yerel üreticilere kadar 200'ün üzerinde Ankara işletmesine hizmet verdik (madde 1 ve 2). Showroom'unuza gelip fotoğraf ve Reels çekimini kendimiz yapıyoruz (madde 3). Reklam bütçesi tamamen sizin hesabınızdan harcanır, biz yönetim hizmeti veririz ve bütçenizden komisyon almayız (madde 4). Size özel müşteri panelinden kampanyalarınızı ve raporlarınızı görürsünüz, aylık raporda ulaşım, mesaj, arama ve müşteri başına maliyet yer alır (madde 5). Sosyal medya, Meta ve Google reklamları ile Google Haritalar ve yerel SEO'yu birlikte yürütüyoruz (madde 6 ve 7). Fiyat listesi yayınlamıyoruz, çünkü mağazanızın ölçeğine göre özel teklif hazırlıyoruz (madde 8). Sonucu garanti etmiyoruz; yöntemi, ölçümü ve ilk haftalarda neyi test edeceğimizi baştan anlatıyoruz (madde 9). Bu listeye bakarak başka ajanslarla da görüşmenizi öneririz; en doğru karar, soruları herkese sorup cevapları karşılaştırdıktan sonra verilir.",
      },
    ],
    conclusion:
      "Ankara'da mobilya ajansı seçerken en önemli üç şey şunlardır: sektörü ve Ankara'yı bilmesi, sonucu ölçüp şeffaf raporlaması ve size özel çalışması. Bu listeyi görüşmelerde soru listesi olarak kullanabilirsiniz. markaizi olarak mağazanız için ücretsiz bir analiz yapıp yol haritasını 24 saat içinde paylaşabiliriz; WhatsApp'tan yazmanız yeterli.",
    faq: [
      {
        q: "Ankara'da mobilya mağazası için en iyi sosyal medya ajansı hangisi?",
        a: "Tek bir doğru cevap yok; mağazanızın ihtiyacına göre değişir. Mobilya sektörünü ve Ankara pazarını bilen, showroom çekimini kendisi yapan, reklam bütçesini sizin hesabınızdan şeffaf harcayan ve aylık raporla sonucu gösteren bir ajans arayın. Bu kriterlere uyan ajanslardan biri Siteler merkezli markaizi'dir; yine de birkaç ajansla görüşüp karşılaştırmanızı öneririz.",
      },
      {
        q: "Mobilya ajansı ile çalışmak için aylık reklam bütçesi ne kadar olmalı?",
        a: "Bütçe mağazanın ölçeğine, ürün gruplarına ve hedef bölgeye göre değişir. Sağlıklı bir başlangıç için ilk 4-6 haftada hangi ürün grubunun ve kitlenin verimli olduğu test edilir. Reklam bütçesi doğrudan sizin Meta/Google hesabınızdan harcanır, ajans yönetim hizmeti verir.",
      },
      {
        q: "Siteler dışındaki Ankara mobilya mağazalarına da hizmet veriyor musunuz?",
        a: "Evet. markaizi Siteler'de yıllardır çalışıyor ancak Çankaya, Batıkent, Eryaman gibi Ankara'nın farklı bölgelerindeki mağazalarla da çalışıyoruz; hedeflemeyi mağazanızın konumuna ve müşteri profiline göre kuruyoruz.",
      },
      {
        q: "Ajansla çalışmaya başladıktan ne kadar sürede sonuç görürüm?",
        a: "Reklam algoritmasının öğrenme süreci nedeniyle ilk 1-2 haftada net sonuç beklenmemelidir. Genellikle 4-6 hafta içinde hangi ürün ve kitlenin daha ucuza müşteri getirdiği belirginleşir. Yerel SEO ve Google Haritalar tarafında etki 4-12 hafta sürebilir.",
      },
    ],
  },
  {
    slug: "reklam-neden-satis-getirmiyor",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Reklam Stratejisi",
    color: "#f87171",
    title: "Reklamınız Neden Satış Getirmiyor? 4 Adımda Sorunun Yerini Bulun",
    excerpt:
      "Reklam çalışmıyor diye hemen kapatmayın, algoritmayı da suçlamayın. İzlenme, tıklama, dönüşüm ve satış adımlarına tek tek bakarak müşteriyi nerede kaybettiğinizi bulmanın pratik yolu.",
    date: "26 Eylül 2026",
    dateISO: "2026-09-26",
    readTime: "9 dk",
    intro:
      "'Reklam veriyoruz ama satış yok' cümlesi, işletme sahiplerinden en sık duyduğumuz cümle. Ardından genellikle iki tepki geliyor: ya reklam kapatılıyor ya da 'algoritma bozuldu' deniyor. Oysa satış getirmeyen bir reklamın arkasında çoğu zaman tek ve bulunabilir bir kırılma noktası var. Müşteri reklamı görüp satın alana kadar dört kapıdan geçiyor; hangi kapıda takıldığını bulursanız neyi değiştirmeniz gerektiği de netleşiyor. Bu yazıda o dört kapıyı, her birinde hangi rakama bakmanız gerektiğini ve ne yapabileceğinizi anlatıyoruz.",
    sections: [
      {
        h2: "Önce Zinciri Görün: Reklam Tek Başına Satış Yapmaz",
        body: "Reklamın görevi doğru kişinin dikkatini çekip onu size getirmektir. Satışı ise reklamdan sonra gelen her şey belirler: teklifiniz, açılış sayfanız, mesajlara ne kadar hızlı döndüğünüz ve satış konuşmanız. Bir koltuk takımı reklamını beğenip 'fiyatı nedir?' diye yazan müşteriye üç saat sonra sadece rakam yazan bir mağaza, reklamın getirdiği müşteriyi kendi eliyle gönderir. Bu yüzden teşhise reklam panelinden değil, müşterinin izlediği yoldan başlamak gerekir.",
      },
      {
        h2: "1. Kapı: Reklam İzleniyor mu?",
        body: "İlk bakılacak şey insanların reklamınızda durup durmadığı. Video reklamlarda ilk üç saniyeyi izleyenlerin oranına ve videonun ne kadarının izlendiğine bakın. Kişilerin büyük kısmı ilk saniyelerde geçiyorsa sorun hedeflemede değil, kreatiftedir. En sık neden, videonun müşterinin derdiyle değil firmanın kendisiyle başlamasıdır: 'Yeni sezon ürünlerimiz mağazamızda' yerine 'Yeni evlenecekler, mobilya alırken bu hatayı yapmayın' gibi, izleyicinin 'bu benimle ilgili' diyeceği bir açılış deneyin. Açılış cümlesini, ilk kareyi ya da videoda konuşan kişiyi değiştirmek çoğu zaman izlenmeyi belirgin şekilde değiştirir.",
      },
      {
        h2: "2. Kapı: İzleniyor Ama Kimse Harekete Geçmiyor mu?",
        body: "Video izleniyor ama tıklama veya mesaj gelmiyorsa, insanlar ilgileniyor ama bir sonraki adımı atmak için yeterli sebep bulamıyor demektir. Burada bakılacak iki şey var: mesaj ve teklif. Reklam, izleyiciye ne yapması gerektiğini açıkça söylüyor mu? 'Fiyat ve ölçüler için WhatsApp'tan yazın' gibi net bir yönlendirme var mı? Teklif tarafında ise indirim tek seçenek değildir: uzun taksit, ücretsiz teslimat, ileri tarihli teslim, ürünü depoda bekletme, garanti veya ücretsiz keşif gibi avantajlar, fiyatı düşürmeden teklifi güçlendirebilir. Müşteri kafasında basit bir hesap yapar: ne veriyorum, karşılığında ne alıyorum?",
      },
      {
        h2: "3. Kapı: Tıklanıyor Ama Dönüşüm Olmuyor mu?",
        body: "İnsanlar reklama tıklıyor ama gittikleri yerde hiçbir şey yapmıyorsa sorun reklamdan sonraki durakta. Reklamda gösterilen ürün, açılan sayfada ilk bakışta görünüyor mu, yoksa ziyaretçi ana sayfada kaybolup mu gidiyor? Sayfa telefonda hızlı açılıyor mu? WhatsApp ya da arama butonu kolayca bulunuyor mu? Form gereğinden uzun mu? Reklamın vaat ettiği şey ile açılan sayfanın gösterdiği şey birbirini tutmuyorsa, en iyi reklam bile boşa harcanır. Bu kapıdaki sorunlar genellikle reklam bütçesine dokunmadan düzeltilebilir.",
      },
      {
        h2: "4. Kapı: Mesaj Geliyor Ama Satış Olmuyor mu?",
        body: "Bu noktada reklam görevini yapmış, müşteri size ulaşmıştır; sorun artık satış sürecindedir. Mesajlara ne kadar sürede dönülüyor? Fiyat tek cümleyle mi veriliyor, yoksa ürünün ölçüsü, kumaş seçenekleri, ödeme imkânları ve teslim süresiyle birlikte mi anlatılıyor? Müşterinin itirazlarına nasıl cevap veriliyor, konuşma mağaza ziyaretine ya da randevuya bağlanıyor mu? Bu kapıda reklam panelinde yapılacak bir ayar yoktur; mesaj şablonları, dönüş hızı ve satış konuşması üzerinde çalışmak gerekir.",
      },
      {
        h2: "Ucuz Mesaj, Ucuz Müşteri Demek Değil",
        body: "Teşhis yaparken en yanıltıcı rakam mesaj başına maliyettir. Bir reklam 10 TL'ye 100 mesaj getirsin ve hiç satış çıkmasın: 1.000 TL harcanmış, sonuç sıfır. Başka bir reklam 30 TL'ye 40 mesaj getirsin ve 8 satış çıksın: 1.200 TL harcanmış, satış başına maliyet 150 TL. Kâğıt üzerinde ilk reklam çok daha başarılı görünür, ama işletmeye para kazandıran ikincisidir. Bu yüzden mesaj sayısının yanında, gelen mesajların kaçının gerçek müşteriye ve satışa döndüğünü de takip edin. Bu bilgi reklam panelinde yoktur; satış tarafından gelmesi gerekir.",
      },
      {
        h2: "Aynı Anda Her Şeyi Değiştirmeyin",
        body: "Sorunun yerini bulduğunuzda her şeyi birden değiştirmek cazip gelir: yeni video, yeni teklif, yeni hedefleme, yeni bütçe. Sonuç iyileşse bile neyin işe yaradığını bilemezsiniz ve bir sonraki kampanyada aynı başarıyı tekrarlayamazsınız. Her seferinde tek bir şeyi değiştirin: önce açılış cümlesini, sonra teklifi, sonra sayfayı. Bir hipotez kurun, test edin, sonucu görün ve öğrendiğinizi bir sonraki teste taşıyın. Meta da birden fazla büyük değişikliğin aynı anda yapılmasının, performans değişiminin nereden geldiğini ayırmayı zorlaştırabileceğini belirtiyor.",
      },
      {
        h2: "Özet: Hangi Durumda Nereye Bakmalı?",
        body: "Reklam izlenmiyorsa kreatife bakın: açılış cümlesi, ilk kare, konuşan kişi. İzleniyor ama tıklanmıyorsa mesaja ve teklife bakın: net bir sonraki adım ve güçlü bir sebep var mı? Tıklanıyor ama dönüşüm yoksa açılış sayfasına ve satış yolculuğuna bakın: doğru ürün, hızlı sayfa, kolay iletişim. Mesaj geliyor ama satış yoksa satış sürecine bakın: dönüş hızı, fiyat sunumu, itiraz karşılama. Gerçek hesaplarda birden fazla sorun aynı anda olabilir; ama bu sıra, nereden başlayacağınızı her zaman söyler.",
      },
    ],
    conclusion:
      "Satış getirmeyen bir reklamı kapatmak kolaydır; nerede takıldığını bulmak ise asıl işi yapar. markaizi olarak reklam hesabınıza bakarken yalnızca panel rakamlarını değil, müşterinin izlediği yolun tamamını inceliyoruz. Reklamlarınızın nerede müşteri kaybettiğini birlikte bulmak isterseniz ücretsiz analiz için bize yazın.",
    faq: [
      {
        q: "Reklam kaç gün sonra kapatılmalı?",
        a: "Birkaç günlük sonuca bakıp kapatmak çoğu zaman erkendir; reklam sisteminin öğrenmesi zaman alır. Kapatmadan önce hangi kapıda sorun olduğunu bulun: izlenmiyorsa kreatifi, izlenip tıklanmıyorsa teklifi değiştirmek, reklamı tamamen kapatmaktan daha çok şey öğretir.",
      },
      {
        q: "Mesaj başına maliyet düşükse reklam iyi mi çalışıyor?",
        a: "Tek başına bir şey söylemez. Ucuz mesajlar nitelikli müşteri getirmiyorsa satış başına maliyet yüksek olabilir. Asıl bakılması gereken, gelen mesajların kaçının satışa döndüğü ve bir satışın reklam maliyetidir.",
      },
      {
        q: "Reklam iyi çalışıyor ama satış yok, ne yapmalıyım?",
        a: "Reklam müşteriyi getiriyorsa sorun büyük ihtimalle satış sürecindedir. Mesajlara dönüş süresini, fiyatın nasıl sunulduğunu ve müşterinin itirazlarına nasıl cevap verildiğini inceleyin; hazır mesaj şablonları ve hızlı dönüş çoğu zaman belirgin fark yaratır.",
      },
    ],
  },
  {
    slug: "reklam-butcesi-nasil-belirlenir",
    videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    category: "Reklam Stratejisi",
    color: "#f87171",
    title: "Reklam Bütçesi Nasıl Belirlenir? Test, Büyüme ve Ölçekleme Aşamaları",
    excerpt:
      "'Günlük kaç TL reklam verelim?' sorusunun herkese uyan cevabı yok. İşletmenizin hangi aşamada olduğuna göre reklam bütçesini belirlemenin, ne zaman artırıp ne zaman durmanın pratik rehberi.",
    date: "26 Eylül 2026",
    dateISO: "2026-09-26",
    dateModifiedISO: "2026-10-01",
    readTime: "10 dk",
    intro:
      "Reklam vermeye karar veren hemen her işletme sahibinin ilk sorusu aynı: 'Günlük kaç lira ayırmalıyım?' İnternette bu soruya net rakamlar veren çok içerik var, ama o rakamlar sizin ürününüzü, fiyatınızı, müşterinizi ve kapasitenizi bilmiyor. Bütçeyi belirlemenin daha sağlıklı yolu, önce işletmenizin hangi aşamada olduğunu anlamak. Çünkü neyin çalıştığını henüz bilmeyen bir işletme ile çalışan bir sistemi büyütmek isteyen işletmenin bütçe sorusu birbirinden tamamen farklı.",
    sections: [
      {
        h2: "Neden 'Günlük Kaç TL?' Yanlış İlk Soru?",
        body: "Aynı bütçe, iki farklı işletmede bambaşka sonuç verir. Doğru kreatifi, doğru teklifi ve hızlı bir satış süreci olan bir işletmede küçük bir bütçe bile müşteri getirir; bunlardan biri eksikse bütçeyi artırmak sorunu çözmez, sadece büyütür. Bu yüzden rakamdan önce şu soruyu sorun: Şu anda neyin çalıştığını biliyor muyum? Cevabınız 'hayır' ise test aşamasındasınız, 'evet ve kârlı' ise büyüme ya da ölçekleme aşamasındasınız.",
      },
      {
        h2: "1. Aşama: Test — Bütçeyle Veri Satın Almak",
        body: "Test aşamasında amaç bütçeyi büyütmek değil, çalışan sistemi bulmaktır: hangi video, hangi mesaj, hangi ürün ve hangi teklif insanları harekete geçiriyor? Bu dönemde harcadığınız bütçenin bir kısmıyla müşteri alırken bir kısmıyla da bilgi satın alırsınız. Test bütçesini belirlerken işinize yarayacak basit bir ölçü var: bir müşterinin size en fazla kaça mal olmasını kabul edebileceğinizi düşünün ve birkaç müşteri getirebilecek kadar bütçe ayırın. Bu bütçeyi çok sayıda kampanyaya bölmeyin; az sayıda ama birbirinden gerçekten farklı kreatifle başlayın ki hangisinin çalıştığı net görünsün. Birkaç günlük sonuca bakıp 'olmadı' demek ise çoğu zaman erkendir.",
      },
      {
        h2: "2. Aşama: Büyüme — İşletme Hazır mı?",
        body: "Artık düzenli müşteri ve satış getiren bir modeliniz var ve maliyetler işletmeniz açısından kabul edilebilir. Bütçeyi artırmanın zamanı gelmiş olabilir; ama önce reklam dışındaki soruları cevaplayın. Stok yeterli mi? Mesajlara ve telefonlara aynı hızla dönülebilecek mi? Teslimat ve üretim kapasitesi artan talebi karşılar mı? Reklamla talebi büyütüp gelen müşteriye yetişemezseniz, bu sefer olumsuz yorum ve kayıp müşteri gibi yeni bir sorun yaratırsınız. Bütçeyi de bir anda katlamak yerine kademeli artırın; büyük ve ani değişiklikler reklam sistemini yeniden öğrenme sürecine sokar.",
      },
      {
        h2: "3. Aşama: Ölçekleme — Bütçeyi Artırmak Ölçeklemek Değildir",
        body: "Ölçekleme, müşteri maliyetinizi ve kârlılığınızı bildiğiniz, satış sürecinizin ve operasyonunuzun hazır olduğu noktada başlar. Buradaki en önemli kural şu: zarar eden bir kampanyanın bütçesini artırmak ölçekleme değildir. Ayda 20 bin TL harcayıp zarar ediyorsanız, 100 bin TL harcadığınızda işletmeniz beş kat büyümeyebilir; sadece beş kat hızlı zarar edebilirsiniz. Gerçek ölçekleme, kârlı çalışan sistemi mümkün olduğunca bozmadan büyütmektir. Bu aşamada yeni kreatif üretimi de hızlanmalıdır; aynı videoyu daha çok kişiye daha sık göstermek zamanla etkisini kaybeder.",
      },
      {
        h2: "Hangi Aşamada Olduğunuzu Nasıl Anlarsınız?",
        body: "Hangi videonun ve teklifin çalıştığını bilmiyorsanız, müşteri başına maliyetinizi hesaplayamıyorsanız veya reklamdan gelen mesajların kaçının satışa döndüğünü takip etmiyorsanız test aşamasındasınız. Düzenli ve kabul edilebilir maliyetle müşteri geliyor ama işletmenin kapasitesi henüz sınanmadıysa büyüme aşamasındasınız. Müşteri maliyetinizi, kârlılığınızı ve operasyon sınırınızı biliyorsanız ölçeklemeye hazırsınız. Aşamayı atlamak en pahalı hatadır: test edilmemiş bir sisteme büyük bütçe vermek, cevabını bilmediğiniz bir soruya yüksek bahis koymak gibidir.",
      },
      {
        h2: "Rakamla Hesap: Bütçeyi Hedeften Geriye Kurmak",
        body: "Aşamanızı belirledikten sonra bütçeyi rakama dökmenin en sağlam yolu, hedeften geriye hesaplamaktır. Bunun için dört bilgiye ihtiyacınız var: ayda kaç satış istediğiniz, ortalama satış tutarınız, brüt kâr marjınız ve bir müşteri adayının (mesaj, form ya da arama) size kaça mal olduğu. Bir de bu adayların kaçının satışa döndüğü. Örnek: ortalama satışı 45.000 TL olan bir mobilya mağazası ayda 20 satış istiyor. Reklamdan gelen bir WhatsApp mesajı 90 TL'ye geliyor ve 100 mesajdan 2'si satışa dönüyor. 20 satış için 1.000 mesaj gerekir; 1.000 × 90 = 90.000 TL aylık bütçe. Bu bütçeyle beklenen ciro 900.000 TL, yani her 1 TL reklam 10 TL ciro getiriyor. Mağazanın kâr marjı %30 ise reklamın kendini çıkarması için gereken en düşük oran 3,3; hesap kârlı görünüyor.",
        link: { href: "/araclar/reklam-butcesi-hesaplayici", label: "Kendi rakamlarınızla hesaplayın: Reklam Bütçesi Hesaplayıcı" },
      },
      {
        h2: "Bütçeden Önce Dönüşüm Oranına Bakın",
        body: "Aynı örnekte mağaza mesajlara daha hızlı döner, fiyatı ölçü, kumaş ve ödeme seçenekleriyle birlikte anlatır ve dönüşümü %2'den %3'e çıkarırsa ne olur? 20 satış için artık yaklaşık 667 mesaj yeter ve gereken bütçe 90.000 TL'den 60.000 TL'ye iner. Hiçbir reklam ayarına dokunmadan, yalnızca satış sürecini iyileştirerek bütçenin üçte biri serbest kalır. Bu yüzden 'bütçeyi artıralım mı?' sorusundan önce şu soruyu sorun: gelen müşteri adaylarının kaçını satışa çeviriyoruz ve bu oranı artırabilir miyiz? Bu rakamı bilmek için reklamdan gelen mesajların kaçının satışa döndüğünü basit bir tabloda takip etmeniz yeterli.",
      },
      {
        h2: "Reklam Bütçesi ile İçerik Bütçesini Dengelemek",
        body: "Bütçe konuşulurken çoğu zaman yalnızca reklama giden para düşünülür, ama reklamın yakıtı içeriktir. Sınırlı bir pazarlama bütçesini ayda 30 sıradan paylaşıma bölmek yerine, daha az sayıda ama gerçekten düşünülmüş içerik üretip kalan bütçeyi bu içerikleri doğru kişilere ulaştırmaya ayırmak çoğu işletmede daha verimlidir. Özellikle test aşamasında, farklı açılardan hazırlanmış birkaç güçlü video, tek bir videoya verilen büyük bütçeden daha çok şey öğretir.",
      },
    ],
    conclusion:
      "Doğru reklam bütçesi, bir rakamdan önce bir aşamadır. Test aşamasında veri, büyüme aşamasında kapasite, ölçekleme aşamasında kârlılık belirleyicidir. markaizi olarak bir işletmeyle çalışmaya başladığımızda ilk konuştuğumuz şey 'günlük kaç lira' değil, işletmenin şu anda nerede olduğu ve nereye gitmek istediğidir. Bütçenizi hangi aşamaya göre planlamanız gerektiğini birlikte görmek isterseniz bize yazın.",
    faq: [
      {
        q: "Küçük bir işletme reklam vermeye kaç lirayla başlamalı?",
        a: "Sabit bir rakam yerine şunu düşünün: bir müşteriyi en fazla kaça kazanmayı kabul edersiniz ve birkaç müşteri getirebilecek kadar test bütçesi ayırabilir misiniz? Bu bütçeyi az sayıda, birbirinden farklı kreatife ayırmak, hangisinin çalıştığını görmenin en hızlı yoludur.",
      },
      {
        q: "Reklam bütçesini ne zaman artırmalıyım?",
        a: "Çalışan ve kabul edilebilir maliyetle müşteri getiren bir model bulduğunuzda ve işletmeniz artan talebi karşılayabilecek durumdayken. Artışı bir anda değil, kademeli yapın.",
      },
      {
        q: "Reklam bütçemi rakamla nasıl hesaplarım?",
        a: "Aylık hedef satış sayınızı, adaydan satışa dönüşüm oranınıza bölerek gereken müşteri adayı sayısını bulun; bunu aday başına maliyetle çarpın. Örneğin 20 satış, %2 dönüşüm ve 90 TL aday maliyetiyle 1.000 aday ve 90.000 TL bütçe gerekir. Sonucu kâr marjınızla karşılaştırarak bütçenin kârlı olup olmadığını görebilirsiniz.",
      },
      {
        q: "Bütçeyi artırdım ama sonuç aynı oranda artmadı, neden?",
        a: "Reklam sistemi büyük değişikliklerden sonra yeniden öğrenir, aynı kreatif daha sık gösterildikçe etkisini kaybeder ve yeni ulaşılan kişiler ilk kitle kadar ilgili olmayabilir. Bütçe artışını kademeli yapmak ve yeni kreatif üretimini sürdürmek bu düşüşü sınırlar. Kampanya zaten zarar ediyorsa, bütçe artışı zararı da büyütür.",
      },
    ],
  },
  {
    slug: "ankara-kafe-acilis-dijital-pazarlama-rehberi",
    category: "Kafe & Restoran",
    color: "#fbbf24",
    title: "Ankara'da Kafe Açtınız: İlk 90 Günde Müşteri Getiren Dijital Pazarlama Rehberi",
    excerpt:
      "Ankara'da yeni bir kafe ya da restoran açanlar için açılış öncesinden ilk üç aya kadar adım adım dijital pazarlama planı: Instagram, Google Haritalar, yorumlar ve konuma göre reklam.",
    date: "27 Eylül 2026",
    dateISO: "2026-09-27",
    readTime: "9 dk",
    intro:
      "Yeni bir kafe açmak aylar süren bir emek: kira, dekorasyon, ekipman, menü, personel. Açılış günü geldiğinde çoğu mekân sahibi 'artık müşteri gelir' diye düşünüyor. Oysa Ankara'da, özellikle Çankaya ya da Etimesgut gibi yeni mekânların sürekli açıldığı bölgelerde, bir kafenin varlığından haberdar olmak bile kendiliğinden olmuyor. İlk 90 gün, mekânın kaderini belirleyen dönem: bu sürede edinilen müdavimler, toplanan yorumlar ve oluşan ilk izlenim, sonraki yılların temelini atıyor. Bu yazıda açılıştan önceki haftalardan üçüncü ayın sonuna kadar yapılması gerekenleri sırayla anlatıyoruz.",
    sections: [
      {
        h2: "Açılıştan Önce: Dijital Kapınızı Kurun",
        body: "Mekânın kapısı açılmadan önce dijital kapısı açılmalı. Google İşletme Profilinizi açılıştan birkaç hafta önce oluşturun: doğru kategori (kafe, kahvaltı salonu, restoran), tam adres, telefon, planlanan çalışma saatleri ve mekândan birkaç fotoğraf. Profilin doğrulanması zaman alabildiği için bu işi son güne bırakmayın. Instagram hesabınızı da aynı dönemde açın; biyografide semt ve ilçe adı, adres ve iletişim bağlantısı olsun. 'Kızılay, Çankaya' ya da 'Eryaman, Etimesgut' gibi net bir konum, profilinize giren kişinin ilk sorusunu cevaplar.",
      },
      {
        h2: "Açılıştan 2-3 Hafta Önce: Merak Uyandırın",
        body: "Açılıştan önceki haftalar sessiz geçmemeli. Dekorasyonun tamamlanışı, ilk kahvenin demlenişi, menünün tadımı gibi 'perde arkası' içerikler, insanlara mekânın açılacağını haber verir ve bir bekleyiş oluşturur. Bu içerikleri mekânın çevresindeki kişilere küçük bir bütçeyle göstermek, açılış gününden önce mahallede bir farkındalık yaratır. Açılış tarihini net olarak duyurun; belirsiz bir 'çok yakında' yerine takvime yazılabilen bir gün, insanların plan yapmasını sağlar.",
      },
      {
        h2: "Açılış Haftası: Net Bir Teklif ve Doğru Yarıçap",
        body: "Açılış haftası için insanları o hafta gelmeye ikna edecek net bir teklif belirleyin: ilk kahveye tatlı ikramı, belirli saatlerde indirim ya da ilk ziyarette sadakat kartına iki damga. Teklifin kendisi kadar anlatımı da önemli; ilk saniyede ne sunduğunuzu söyleyen kısa bir video, uzun bir afiş tasarımından daha fazla işe yarar. Reklamı mekânınızın çevresindeki birkaç kilometreye, insanların kafe planı yaptığı saatlerde gösterin. Şehrin öbür ucundaki birine gösterilen açılış reklamı, gelmeyecek birine harcanmış bütçedir.",
      },
      {
        h2: "İlk Ay: Yorum Toplamayı Alışkanlık Haline Getirin",
        body: "İlk ayın en değerli çıktısı müşteri sayısından çok Google yorumlarıdır. Boş bir profil, 'yeni açılmış, bilinmiyor' izlenimi verir ve 'yakınımdaki kafe' aramalarında sizi geriye düşürür. Memnun müşteriden yorum istemeyi ilk günden alışkanlık haline getirin: masada küçük bir QR kod, hesapla birlikte kibar bir rica. Gelen her yoruma yanıt verin; olumsuz bir yoruma sakin ve çözüm odaklı bir yanıt, yeni mekân için güvenilirlik göstergesidir. Satın alınmış yorumlardan ise uzak durun; tespit edildiğinde tüm profiliniz zarar görebilir.",
      },
      {
        h2: "İlk Ay: Neyin Satıldığını İzleyin",
        body: "Açılışta menünüzün hangi ürününün yıldız olacağını tahmin edebilirsiniz ama bilemezsiniz. İlk haftalarda hangi ürünün en çok sipariş edildiğini, hangisinin fotoğrafının çekilip paylaşıldığını ve hangi içeriğin Instagram'da daha çok kaydedildiğini takip edin. Mekânınızın 'imza ürünü' genellikle bu verilerden çıkar ve sonraki aylarda içeriğin ve reklamın merkezine o ürün oturur.",
      },
      {
        h2: "İkinci Ay: Müdavim Kazanmaya Odaklanın",
        body: "İlk merak dalgası geçtikten sonra asıl soru şu: gelenler geri geliyor mu? İkinci ayda odağı yeni kitleden mevcut müşteriye kaydırın. Günlük story akışıyla günün tatlısını, yeni gelen çekirdeği ya da haftanın kampanyasını paylaşmak, takipçinin 'bugün nereye gidelim' diye düşündüğü anda aklına gelmenizi sağlar. Sadakat kartı, müdavime özel küçük ikramlar ve takipçiye özel kampanyalar, geri gelme sebebi yaratır. Reklam tarafında ise mekânınızın profilini ziyaret etmiş ya da içeriklerinizle etkileşime girmiş kişilere yeniden ulaşmak, soğuk kitleye göre daha düşük maliyetle ziyaret getirir.",
      },
      {
        h2: "Üçüncü Ay: Saatleri ve Günleri Dengeleyin",
        body: "Üçüncü aya geldiğinizde mekânınızın ritmi belirginleşir: hangi günler dolu, hangi saatler boş? Çoğu kafede hafta sonu ile hafta içi, öğle ile öğleden sonra arasında belirgin bir fark vardır. Reklam bütçesini zaten dolu olan saatlere değil, boş saatlere müşteri çekecek tekliflere yönlendirin: hafta içi öğle menüsü, öğleden sonra çalışanlar ve öğrenciler için sessiz çalışma alanı, erken akşam kampanyası. Bu, aynı bütçeyle ciroyu daha dengeli büyütmenin yoludur.",
      },
      {
        h2: "90 Günün Sonunda Neye Bakmalısınız?",
        body: "Üç ayın sonunda şu soruların cevabını bilmelisiniz: Google profilinizde kaç yorum ve kaç puan var, profil kaç arama ve yol tarifi isteği aldı? Instagram'da hangi içerikler kaydedildi ve paylaşıldı? Reklamlardan kaç mesaj, rezervasyon ya da ziyaret geldi? İmza ürününüz belli oldu mu, müdavimleriniz oluştu mu? Bu cevaplar, bir sonraki dönemde neye yatırım yapacağınızı belirler. Takipçi sayısı ise bu listenin en sonunda gelir; bir kafenin başarısı takipçiyle değil, dolu masayla ve geri gelen müşteriyle ölçülür.",
      },
    ],
    conclusion:
      "Yeni bir kafenin ilk 90 günü, dijital pazarlama açısından en kritik dönem. Açılıştan önce kurulan Google profili ve Instagram hesabı, açılış haftasındaki net teklif, ilk aydan itibaren toplanan yorumlar ve ikinci aydan sonra müdavime dönen odak, mekânın uzun ömürlü olmasının temelini atıyor. markaizi olarak Ankara'nın her ilçesindeki kafe ve restoranlara bu süreçte sosyal medya, reklam ve Google Haritalar desteği veriyoruz. Yeni açılan ya da açılmak üzere olan mekânınız için ücretsiz yol haritası isterseniz bize yazın.",
    faq: [
      {
        q: "Kafe açılışından ne kadar önce sosyal medyaya başlamalıyım?",
        a: "En az iki-üç hafta önce. Google İşletme Profilinin doğrulanması zaman alabildiği için onu daha da erken oluşturun. Açılış öncesindeki perde arkası içerikler, açılış gününe kadar çevrede bir farkındalık oluşturur.",
      },
      {
        q: "Açılış reklamı ne kadar geniş bir alana gösterilmeli?",
        a: "Şehir içindeki bir kafe için genellikle mekânın çevresindeki birkaç kilometre yeterlidir. İnsanlar kafe seçerken yakınlığa önem verir; çok geniş bir alana gösterilen reklam, gelmeyecek kişilere harcanan bütçe demektir.",
      },
      {
        q: "Yeni açılan kafe için Google yorumu nasıl toplanır?",
        a: "Memnun müşteriden yorum istemeyi alışkanlık haline getirin: masada QR kod, hesapla birlikte kibar bir hatırlatma. Her yoruma yanıt verin. Satın alınmış yorumlardan kaçının; tespit edildiğinde profilinize zarar verebilir.",
      },
    ],
  },
  {
    slug: "kafe-restoran-google-haritalar-rehberi",
    category: "Kafe & Restoran",
    color: "#fbbf24",
    title: "Kafe ve Restoranlar İçin Google Haritalar Rehberi: 'Yakınımdaki Kafe' Aramalarında Öne Çıkmak",
    excerpt:
      "Kafe ve restoranlar için Google İşletme Profili nasıl doldurulur? Menü, fotoğraf, çalışma saatleri, özellikler, yorum yanıtları ve 'semt adı + kafe' aramalarında görünür olmanın yolları.",
    date: "27 Eylül 2026",
    dateISO: "2026-09-27",
    readTime: "8 dk",
    intro:
      "Acıkan ya da bir kahve molası arayan biri telefonunu açıp 'yakınımdaki kafe' ya da 'Bahçelievler kahvaltı' yazdığında karşısına bir harita ve üç mekân çıkıyor. Kararın büyük kısmı o üç mekân arasında, birkaç saniyede veriliyor. Bir kafe ya da restoran için Google İşletme Profili bu yüzden bir tabela değil, en yoğun caddedeki vitrin. Bu rehberde yeme-içme işletmelerine özgü profil ayarlarını, yorum stratejisini ve harita aramalarında öne çıkmanın pratik yollarını anlatıyoruz.",
    sections: [
      {
        h2: "Kategori: Doğru Aramada Görünmenin İlk Şartı",
        body: "Google, mekânınızı hangi aramalarda göstereceğine büyük ölçüde kategoriye bakarak karar veriyor. Ana kategori mekânınızı en iyi anlatan tek bir tür olmalı: kafe, kahvaltı salonu, restoran, pastane, kahve dükkânı. Ek kategorilerle sunduğunuz diğer hizmetleri ekleyebilirsiniz; ama gerçekte olmayan kategorileri eklemek, alakasız aramalarda görünüp kötü deneyim yaşatmanıza yol açar. Kahvaltı sunan bir kafenin 'kahvaltı salonu' kategorisini eklemesi ise 'kahvaltı' aramalarında görünmesini sağlar.",
      },
      {
        h2: "Menü ve Fiyat: Karar Anındaki En Önemli Bilgi",
        body: "Harita üzerinden mekân seçen kişinin en çok baktığı bilgilerden biri menü ve fiyat aralığı. Menünüzü profil üzerinden ya da menü bağlantısıyla güncel tutun; menü fotoğrafları eklenecekse okunaklı ve güncel olsun. Fiyatı görünmeyen bir mekân, özellikle aile ve öğrenci müşterisinde listeden çıkıyor. Menü değiştiğinde profili güncellemeyi unutmayın; eski fiyatla gelip yeni fiyatla karşılaşan müşteri, bunu yoruma yansıtabilir.",
      },
      {
        h2: "Fotoğraf: Tabak, Bardak ve Atmosfer",
        body: "Yeme-içmede fotoğraf, müşterinin mekâna gelmeden önce yaşadığı deneyimdir. Profilde en az üç tür fotoğraf olmalı: yemek ve içecekler (en çok satanlar ve imza ürünler), mekânın içi (oturma düzeni, atmosfer, ışık) ve dışı (müşterinin mekânı bulmasını kolaylaştıran cephe). Fotoğrafları gün ışığında ya da mekânın en sıcak ışığında çekin, düzenli aralıklarla yeni fotoğraf ekleyin. Müşterilerin eklediği fotoğrafları da takip edin; profilinizin vitrini yalnızca sizin yüklediklerinizden oluşmuyor.",
      },
      {
        h2: "Çalışma Saatleri ve 'Şimdi Açık' Bilgisi",
        body: "Kafe ve restoran aramalarının önemli kısmı 'şimdi açık' olan mekânlara yönelik. Çalışma saatleriniz yanlışsa ya Google sizi göstermiyor ya da müşteri kapalı kapıyla karşılaşıp bunu yoruma yazıyor. Bayram, yılbaşı ve özel günlerde özel çalışma saatlerini mutlaka girin. Mutfağın kapanış saati salonunkinden farklıysa bunu açıklamada belirtin.",
      },
      {
        h2: "Özellikler: Küçük Detaylar, Büyük Filtreler",
        body: "Google İşletme Profilindeki 'özellikler' bölümü çoğu mekânın atladığı ama müşterinin filtrelediği bilgileri içerir: açık alanda oturma, Wi-Fi, çocuk dostu, evcil hayvan kabulü, rezervasyon, paket servis, tekerlekli sandalyeye uygun giriş gibi. 'Çalışmaya uygun kafe' ya da 'bahçeli kahvaltı' arayan birinin sizi bulması, bu küçük kutucuklara bağlı olabilir. Sunduğunuz her özelliği işaretleyin, sunmadıklarınızı işaretlemeyin.",
      },
      {
        h2: "Yorumlar: Hem Sıralama Hem Güven",
        body: "Yorum sayısı, puan ve yorumların güncelliği harita sıralamasını doğrudan etkiliyor. Memnun müşteriden yorum istemeyi mekânın bir rutini haline getirin: masada küçük bir QR kod, hesapla birlikte kibar bir hatırlatma ya da paket siparişlere eklenen bir not. Her yoruma yanıt verin; teşekkür etmek kadar olumsuz yoruma sakin ve çözüm odaklı yanıt vermek de önemli. Olumsuz bir yoruma verilen iyi bir yanıt, profili okuyan yeni müşteriye 'burası sorun çıkınca ilgileniyor' mesajını verir. Satın alınmış ya da karşılığında indirim verilerek toplanan yorumlar ise Google kurallarına aykırıdır ve profilinize zarar verebilir.",
      },
      {
        h2: "Güncellemeler: Profilin Canlı Olduğunu Gösterin",
        body: "Google İşletme Profili üzerinden güncelleme paylaşabilirsiniz: yeni menü, haftanın tatlısı, özel gün kampanyası, canlı müzik akşamı. Bu paylaşımlar profilinizi ziyaret eden kararsız müşteriye son bir sebep verir ve profilin aktif olduğunu gösterir. Haftada bir kısa güncelleme, çoğu mekân için yeterlidir.",
      },
      {
        h2: "Semt Adıyla Aramalar ve Web Sitesi Uyumu",
        body: "Ankara'da insanlar çoğu zaman ilçe yerine semt adıyla arıyor: 'Kızılay kafe', 'Tunalı kahvaltı', 'Batıkent restoran', 'Eryaman pastane'. Adresinizin ve konum işaretinizin doğru olması bu aramaların temeli. Bir web siteniz varsa sitede adres, telefon ve çalışma saatlerinin profildekiyle birebir aynı olması, sitede semt ve ilçe adının geçmesi ve profilden siteye bağlantı verilmesi Google'ın mekânınızı doğru aramalarla eşleştirmesine yardımcı olur.",
      },
    ],
    conclusion:
      "Bir kafe ya da restoran için Google İşletme Profili, reklam vermeden gelen en değerli müşteri kaynağı. Doğru kategori, güncel menü ve fiyat, iyi fotoğraflar, doğru çalışma saatleri, işaretlenmiş özellikler ve düzenli yanıtlanan yorumlar, 'yakınımdaki kafe' aramalarında öne çıkmanın temelini oluşturuyor. markaizi olarak Ankara'daki kafe ve restoranların Google profillerini sosyal medya ve reklam çalışmalarıyla birlikte yönetiyoruz. Profilinizin ücretsiz incelemesi için bize yazın.",
    faq: [
      {
        q: "Google Haritalar'da kafem neden çıkmıyor?",
        a: "En sık nedenler yanlış ya da eksik kategori, doğrulanmamış profil, hatalı konum işareti, az sayıda yorum ve güncel olmayan çalışma saatleridir. Profil bilgilerinin eksiksiz ve doğru olması, düzenli yorum ve fotoğraf akışı görünürlüğü artırır.",
      },
      {
        q: "Google yorumu karşılığında indirim verebilir miyim?",
        a: "Hayır. Yorum karşılığında indirim ya da hediye vermek Google kurallarına aykırıdır ve profilinizin zarar görmesine yol açabilir. Memnun müşteriden karşılıksız yorum istemek ve her yoruma yanıt vermek en sağlıklı yoldur.",
      },
      {
        q: "Menü fiyatlarını Google profiline eklemeli miyim?",
        a: "Genellikle evet. Harita üzerinden mekân seçen kişiler fiyat aralığına bakarak karar verir; fiyatı görünmeyen mekânlar özellikle aile ve öğrenci müşterisinde tercih edilmeyebilir. Menü değiştiğinde güncellemeyi unutmayın.",
      },
    ],
  },
  {
    slug: "meta-pixel-conversions-api-rehberi",
    category: "Ölçümleme",
    color: "#60a5fa",
    title: "Meta Pixel ve Conversions API Nedir? WhatsApp ve Mağazadan Satış Yapan İşletmeler İçin Dönüşüm Takibi Rehberi",
    excerpt:
      "Meta Pixel neden tek başına yetmiyor, Conversions API ne işe yarıyor ve satışı WhatsApp'ta ya da mağazada kapanan bir işletme reklamın getirdiği sonucu nasıl ölçer? Kurulumunuzu kendiniz kontrol edebileceğiniz adımlarla.",
    date: "1 Ekim 2026",
    dateISO: "2026-10-01",
    readTime: "9 dk",
    intro:
      "Meta reklamlarında en çok konuşulan şeyler kreatif, hedef kitle ve bütçe. En az konuşulan ama sonucu en çok belirleyen şey ise ölçüm. Çünkü Meta'nın reklam sistemi, ona hangi davranışı 'başarı' olarak bildirdiğinize bakarak kime reklam göstereceğini öğrenir. Bu bildirim eksik, hatalı ya da yanlış davranışa bağlıysa sistem yanlış kişiyi aramaya başlar ve panel iyi görünse bile kasaya para girmez. Bu yazıda Meta Pixel ile Conversions API'nin ne olduğunu, neden ikisinin birlikte kullanıldığını ve özellikle satışı sitede değil WhatsApp'ta ya da mağazada kapanan işletmelerin neyi ölçmesi gerektiğini sade bir dille anlatıyoruz.",
    sections: [
      {
        h2: "Dönüşüm Takibi Reklamın Direksiyonudur",
        body: "Bir kampanyayı 'mesaj' ya da 'satış' hedefiyle kurduğunuzda Meta'ya aslında şunu söylersiniz: bu davranışı yapan insanları bul. Sistem her gün milyonlarca kişiye bakar ve sizin bildirdiğiniz davranışı yapanlara benzeyen kişileri seçer. Bildirim doğruysa reklam her geçen gün daha isabetli hale gelir. Bildirim yanlışsa, örneğin her sayfa ziyaretini 'satın alma' olarak sayıyorsanız, sistem satın alma ihtimali olmayan ama sayfayı ziyaret etmeye meyilli kişileri bulmakta ustalaşır. Bütçe harcanır, rapor dolar, satış gelmez. Dönüşüm takibi bu yüzden teknik bir ayrıntı değil, reklamın yönünü belirleyen direksiyondur.",
      },
      {
        h2: "Meta Pixel Nedir, Ne Yapar?",
        body: "Meta Pixel, web sitenize eklenen ve ziyaretçinin tarayıcısında çalışan küçük bir koddur. Ziyaretçi sitenizde belirli bir şey yaptığında bunu Meta'ya bir 'olay' olarak bildirir. En sık kullanılan olaylar şunlardır: sayfa görüntüleme, ürün görüntüleme, iletişim (örneğin WhatsApp ya da telefon butonuna tıklama), müşteri adayı (form gönderimi), sepete ekleme ve satın alma. Bu olaylar hem reklamın optimizasyonu için hem de 'sitemi ziyaret edip iletişime geçmeyenler' gibi yeniden hedefleme kitleleri oluşturmak için kullanılır. Doğru kurulmuş bir Pixel'de her olay yalnızca gerçekten o eylem olduğunda ve bir kez tetiklenir.",
      },
      {
        h2: "Pixel Neden Tek Başına Yetmiyor?",
        body: "Pixel tarayıcıda çalıştığı için tarayıcıda olan her engel onu da etkiler. Reklam engelleyiciler kodu çalıştırmayabilir, bazı tarayıcılar ve telefonlar izleme kısıtlamaları uygular, ziyaretçi çerezleri reddedebilir ya da form gönderildikten hemen sonra sayfayı kapatabilir. Bu durumların her birinde olay Meta'ya hiç ulaşmaz. Sonuç olarak gerçekte 40 form gelmişken panelde 28 görünebilir. Bu fark yalnızca raporu yanıltmaz; reklam sistemi de daha az veriyle öğrendiği için daha yavaş ve daha pahalı optimize eder.",
      },
      {
        h2: "Conversions API Nedir?",
        body: "Conversions API (kısaca CAPI), aynı olayları tarayıcı yerine sunucudan Meta'ya ileten bağlantıdır. Ziyaretçinin tarayıcısında ne olursa olsun, form sunucunuza ulaştıysa olay da Meta'ya gönderilebilir. Pixel ve Conversions API birlikte kullanıldığında aynı olay iki kanaldan gelir; her ikisi aynı olay kimliğini taşıdığı için Meta bunları eşleştirir ve tek dönüşüm olarak sayar. Sunucudan gönderilen olaylara, ziyaretçinin onayıyla paylaştığı e-posta veya telefon gibi bilgiler şifrelenerek eklenebilir. Bu, Meta'nın olayı doğru kişiyle eşleştirme oranını artırır; Olay Yöneticisi'nde bunu 'eşleşme kalitesi' puanı olarak görürsünüz.",
      },
      {
        h2: "Satışı WhatsApp'ta Kapanan İşletmeler Neyi Ölçmeli?",
        body: "Mobilya, klinik ve pek çok hizmet işletmesinde müşteri sitede satın almaz; WhatsApp'tan yazar ya da arar. Bu işletmeler için 'satın alma' olayını beklemek, sistemi hiç gelmeyecek bir sinyali beklemeye mahkûm etmektir. Daha sağlıklı yol, satışa en yakın davranışı ölçmektir: sitedeki WhatsApp butonuna tıklama, telefon numarasına tıklama ve form gönderimi ayrı ayrı olay olarak kurulmalı. Reklamın kendisinden doğrudan WhatsApp sohbeti başlatan kampanyalarda ise sohbetler Meta tarafında zaten sayılır. Bir adım ileri gitmek isteyenler için Meta, iş mesajlaşmasında gerçekleşen satışları da Conversions API üzerinden geri bildirmeye imkân tanıyor; böylece sistem yalnızca mesaj atanı değil, mesaj atıp satın alanı tanımaya başlar.",
      },
      {
        h2: "Mağazada Kapanan Satışı Reklama Bağlamak",
        body: "Satışın mağazada kapandığı işletmelerde reklamın gerçek etkisini görmenin yolu, mağaza satış kayıtlarını reklam verisiyle eşleştirmektir. Pratikte bu şöyle işler: satış yaptığınız müşterinin telefon numarası ya da e-postası, onayı alınarak kaydedilir; bu kayıtlar düzenli aralıklarla şifrelenmiş halde Conversions API üzerinden Meta'ya gönderilir; Meta bu kişilerin daha önce reklamınızı görüp görmediğini eşleştirir. Böylece 'bu ay reklamdan kaç mesaj geldi' sorusunun yanına 'reklamı görenlerden kaçı mağazada satın aldı' sorusunun cevabı eklenir. Google Ads tarafında da benzer bir çevrimdışı dönüşüm aktarımı mümkündür. Bu kurulum ilk bakışta zahmetli görünse de bütçeyi 'en ucuz mesajı getiren' değil 'en çok satışa dönen' kampanyaya kaydırmanın en güvenilir yoludur.",
        link: { href: "/hizmetler/donusum-takibi-kurulumu", label: "Dönüşüm takibi kurulum hizmetimiz" },
      },
      {
        h2: "Kurulumunuzu 10 Dakikada Kontrol Edin",
        body: "Bir uzmana ihtiyaç duymadan yapabileceğiniz basit bir kontrol var. Meta Olay Yöneticisi'ni açın ve son yedi günde hangi olayların geldiğine bakın: iletişim ve form olayları görünüyor mu? Olayların yanında hem tarayıcı hem sunucu kaynağı yazıyor mu, yoksa yalnızca tarayıcı mı? Ardından panelde görünen form ya da iletişim sayısını, aynı dönemde gerçekten gelen form ve WhatsApp mesajı sayısıyla karşılaştırın. Panel gerçekten çok daha fazlasını gösteriyorsa olaylar çift sayılıyor ya da yanlış yerde tetikleniyor olabilir; çok daha azını gösteriyorsa olaylar kayboluyor demektir. Son olarak kendi telefonunuzdan sitenize girip WhatsApp butonuna tıklayın ve Olay Yöneticisi'nin test bölümünde olayın düştüğünü görün.",
      },
      {
        h2: "En Sık Karşılaştığımız Hatalar",
        body: "Hesap denetimlerinde aynı hatalar tekrar tekrar karşımıza çıkıyor. Siteye iki farklı Pixel kurulmuş ve olaylar ikiye bölünmüş. Form gönderimi, formun gönderildiği an değil sayfanın açıldığı an sayılıyor. Her WhatsApp tıklaması 'satın alma' olarak işaretlenmiş ve kampanya satış hedefiyle bu sahte satışlara optimize ediliyor. Conversions API kurulmuş ama olay kimliği eşleşmediği için her dönüşüm iki kez sayılıyor. Çerez onayı hiç sorulmadan reklam etiketleri çalışıyor. Bunların her biri raporu da reklamın öğrenmesini de bozar. İyi haber şu ki hepsi bütçeye dokunmadan düzeltilebilir ve düzeltildiğinde kampanyalar genellikle birkaç hafta içinde daha isabetli çalışmaya başlar.",
      },
    ],
    conclusion:
      "Reklam bütçesi artırılmadan önce sorulması gereken soru şu: reklam sistemine doğru şeyi mi öğretiyoruz? Meta Pixel ve Conversions API'nin birlikte, doğru olaylarla ve tek sefer sayılacak şekilde kurulması; WhatsApp ve mağaza satışı gibi sitenin dışında kalan sonuçların da ölçüme katılması, aynı bütçeyle daha çok satış getirmenin en sağlam temelidir. markaizi olarak reklam hesabınızın ölçüm kurulumunu ücretsiz denetliyor, eksikleri dönüşüm takibi hizmetimizle kuruyoruz.",
    faq: [
      {
        q: "Conversions API kurmak için web sitemin özel yazılmış olması gerekir mi?",
        a: "Hayır. Pek çok hazır site ve e-ticaret altyapısı Conversions API için kendi entegrasyonunu sunuyor. Özel yazılmış sitelerde ise Google Tag Manager'ın sunucu tarafı ya da doğrudan sunucu kodu üzerinden kurulum yapılabiliyor.",
      },
      {
        q: "Pixel ve Conversions API birlikte kullanılınca dönüşümler iki kez sayılmaz mı?",
        a: "Doğru kurulduğunda sayılmaz. Her iki kanal aynı olay adı ve aynı olay kimliğiyle gönderildiğinde Meta tekrarı ayıklar. Olay kimliği eşleşmezse ise dönüşümler iki kez sayılır; bu yüzden kurulumdan sonra Olay Yöneticisi'nde tekrar ayıklamanın çalıştığını mutlaka kontrol etmek gerekir.",
      },
      {
        q: "Satışlarım mağazada oluyor, hangi olaya optimize etmeliyim?",
        a: "Genellikle satışa en yakın ve yeterli sıklıkta gerçekleşen davranışa: WhatsApp mesajı, arama ya da form. Mağaza satışlarını ayrıca reklam verisiyle eşleştirdiğinizde hangi kampanyanın gerçekten satış getirdiğini görür ve bütçeyi buna göre dağıtırsınız.",
      },
    ],
  },
  {
    slug: "chatgpt-reklamlari-turkiye-rehberi",
    category: "Yapay Zeka",
    color: "#22d3ee",
    title: "ChatGPT Reklamları Türkiye'de: Nedir, Nasıl Çalışır, Kimler Denemeli?",
    excerpt:
      "ChatGPT reklamları Türkiye'deki işletmelere açıldı. Reklamların nerede ve kime göründüğü, anahtar kelime yerine nasıl hedeflendiği, nasıl ölçüldüğü ve hangi işletmeler için denemeye değer olduğu.",
    date: "1 Ekim 2026",
    dateISO: "2026-10-01",
    readTime: "8 dk",
    intro:
      "Yıllarca dijital reklamın iki büyük kapısı vardı: insanların aradığı yer olan Google ve insanların vakit geçirdiği yer olan Instagram ile Facebook. 2026'da bunlara üçüncü bir kapı eklendi: insanların soru sorduğu yer. OpenAI, ChatGPT içinde reklam göstermeye yılın başında ABD'de testle başladı ve platformu yıl içinde kademeli olarak yeni ülkelere açtı. Eylül 2026 itibarıyla Türkiye'de kurulu işletmeler de ChatGPT için reklamveren hesabı açabiliyor. Bu yazıda yeni kanalın nasıl çalıştığını, Google ve Meta reklamlarından nerede ayrıldığını ve hangi işletmeler için mantıklı bir test olduğunu anlatıyoruz.",
    sections: [
      {
        h2: "ChatGPT Reklamları Nerede ve Kime Görünüyor?",
        body: "Reklamlar, ChatGPT'nin verdiği cevabın altında, cevaptan ayrı ve açıkça 'sponsorlu' olarak etiketlenmiş bir alanda gösteriliyor. Kullanıcının sohbetiyle ilgili bir ürün ya da hizmet olduğunda reklam devreye giriyor. Reklamlar ChatGPT'nin ücretsiz ve Go planlarını kullanan uygun kullanıcılara gösteriliyor; Plus ve Pro gibi ücretli üst planlar reklamsız. OpenAI ayrıca reklamların 18 yaş altındaki kullanıcılara gösterilmediğini ve sağlık ya da siyaset gibi hassas konuların yanında yer almadığını açıklıyor. Platform kuralları hızla gelişen bir alanda olduğu için kampanya kurmadan önce güncel kuralları OpenAI'nin yardım sayfalarından kontrol etmek gerekiyor.",
      },
      {
        h2: "Reklam ChatGPT'nin Cevabını Etkiliyor mu?",
        body: "OpenAI'nin açıkladığı ilkelere göre hayır. Reklam, cevabın içine yerleştirilmiyor; cevap ayrı, reklam ayrı duruyor. Reklamverenler de kullanıcıların konuşmalarını görmüyor; yalnızca kampanyalarının gösterim, tıklama ve dönüşüm gibi toplu sonuçlarını görüyor. Bu ayrım işletmeler için önemli bir noktayı da ortaya koyuyor: ChatGPT'nin cevabında önerilmek ile cevabın altında reklam göstermek iki farklı iş. Birincisi organik görünürlükle, ikincisi reklam bütçesiyle ilgili.",
      },
      {
        h2: "Anahtar Kelime Yok, Bağlam Var",
        body: "Google Ads'te hangi aramalarda görünmek istediğinizi anahtar kelimelerle seçersiniz. ChatGPT reklamlarında böyle bir liste yok. Bunun yerine reklamın hangi ihtiyaç, hangi ürün ya da hangi kullanım durumu için uygun olduğunu anlatan bağlam bilgisi yazılıyor; sistem bu bilgiyi sohbetin içeriğiyle eşleştiriyor. Bunun yanına konum ve cihaz gibi kampanya düzeyinde seçimler ekleniyor. Fark küçük görünse de stratejiyi değiştiriyor: Google'da insanlar 'koltuk takımı ankara' yazar, ChatGPT'de ise 'üç çocuklu bir aileyiz, salonumuz 25 metrekare, leke tutmayan ve taksitle alabileceğimiz bir koltuk takımı arıyoruz' diye anlatır. Kampanyanın başarısı, müşterinizin bu tür sorularını ne kadar iyi tarif ettiğinize bağlı.",
      },
      {
        h2: "Google ve Meta Reklamlarından Farkı Ne?",
        body: "Instagram'da reklam, henüz ihtiyacını fark etmemiş kişide ilgi uyandırır. Google'da reklam, kısa bir arama yazmış ve niyeti belli kişiyi yakalar. ChatGPT'de ise kişi ihtiyacını, önceliklerini ve kısıtlarını cümlelerle anlatmış, çoğu zaman seçenekleri karşılaştırma aşamasına gelmiştir. Bu, reklamın karar anına yakın birine gösterilmesi demek. Ama aynı zamanda tıklayan kişinin beklentisinin yüksek olması demek: bir soruyla geldi ve tıkladığı sayfada o sorunun devamını görmek istiyor. Ana sayfaya düşen, aradığını bulamayan ziyaretçi hızla geri döner.",
      },
      {
        h2: "Sonuç Nasıl Ölçülüyor?",
        body: "ChatGPT reklamlarında da başarı panelde görünen tıklamayla değil, sitenizde gerçekleşen form, mesaj, arama ya da satışla ölçülmeli. Platform, dönüşümleri ölçmek için siteye eklenen bir etiket ve sunucu taraflı bağlantı seçenekleri sunuyor; mantığı Meta Pixel ve Conversions API'ye benziyor. Burada en önemli kural, yeni kanalı diğer kanallarla aynı dönüşüm tanımıyla ölçmek. Meta'da 'WhatsApp tıklaması' dönüşüm sayılıyorsa ChatGPT'de de aynısı sayılmalı ki hangi kanalın bir müşteriyi kaça getirdiği adil biçimde karşılaştırılabilsin.",
        link: { href: "/blog/meta-pixel-conversions-api-rehberi", label: "Meta Pixel ve Conversions API rehberimiz" },
      },
      {
        h2: "Hangi İşletmeler Denemeli?",
        body: "ChatGPT reklamları en çok, müşterinin karar vermeden önce araştırdığı, karşılaştırdığı ve soru sorduğu işlerde anlam kazanıyor. Mobilya iyi bir örnek: sepet tutarı yüksek, karar süresi uzun ve insanlar ölçü, malzeme, teslimat ve ödeme seçenekleri hakkında ayrıntılı sorular soruyor. Ev dekorasyonu, özel eğitim kurumları, danışmanlık firmaları, yüksek sepetli e-ticaret ve pek çok hizmet işletmesi de benzer bir karar yolculuğuna sahip. Sağlık gibi hassas kategorilerde ise platform kuralları daha kısıtlayıcı; bu alanlarda önce güncel reklam politikalarını kontrol etmek gerekir. Buna karşılık anlık ve düşük tutarlı alımlarda, örneğin bir kafe için, Instagram ve Google Haritalar hâlâ çok daha doğal kanallar.",
      },
      {
        h2: "Nasıl Başlanmalı?",
        body: "Yeni bir kanalı denerken en pahalı hata, ölçümü kurmadan ve büyük bir bütçeyle başlamak. Önerdiğimiz sıra şu: önce dönüşüm ölçümünü kurun ve test edin. Ardından müşterilerinizin bu tür asistanlara sorabileceği soruları çıkarın ve bunları ihtiyaçlara göre gruplayın; her grup için ayrı bir bağlam tarifi yazın. Tıklayan kişiyi ana sayfaya değil, sorusuna cevap veren ve tek bir net teklif sunan bir sayfaya gönderin. Sınırlı bir test bütçesiyle başlayın, birkaç hafta veri toplayın ve sonucu Meta ve Google kampanyalarınızla aynı tanım üzerinden karşılaştırın. Kanal işe yarıyorsa bütçeyi kademeli artırın, yaramıyorsa diğer kanallara geri aktarın.",
      },
      {
        h2: "Reklam mı, Organik Görünürlük mü?",
        body: "İkisi birbirinin alternatifi değil. Reklam, bütçe ayırdığınız sürece cevabın altında görünmenizi sağlar. Organik görünürlük ise ChatGPT'nin ve diğer yapay zeka asistanlarının cevabın kendisinde işletmenizi doğru bilgilerle anlatması ve önermesiyle ilgilidir; bunun için sitenizin işinizi net anlatması, sektör ve bölge sorularına doğrudan cevap veren içerikleriniz, Google İşletme Profiliniz ve başka sitelerde markanızdan nasıl bahsedildiği belirleyicidir. Uzun vadede en güçlü konum, cevabın içinde önerilen ve gerektiğinde cevabın altında da görünen işletme olmaktır.",
        link: { href: "/hizmetler/yapay-zeka-arama-gorunurlugu", label: "Yapay zeka arama görünürlüğü hizmetimiz" },
      },
    ],
    conclusion:
      "ChatGPT reklamları, Türkiye'deki işletmeler için yeni ve henüz kalabalıklaşmamış bir kanal. Bu bir fırsat ama aynı zamanda kıyaslanabilir verinin az olduğu bir alan. Ölçümü baştan kurup sınırlı bir test bütçesiyle başlayan, sonucu diğer kanallarla dürüstçe karşılaştıran işletmeler bu kanaldan en doğru dersi çıkaracak. markaizi olarak ChatGPT reklamlarını organik yapay zeka görünürlüğüyle birlikte ele alıyor, işletmeniz için mantıklı olup olmadığını ilk görüşmede açıkça söylüyoruz.",
    faq: [
      {
        q: "ChatGPT reklamları Türkiye'de verilebiliyor mu?",
        a: "Evet. Eylül 2026 itibarıyla Türkiye, OpenAI'nin reklamveren hesabı açılabilen ülkeleri arasında yer alıyor. Uygunluk, reklamı verecek ve faturalandırılacak işletmenin kayıtlı olduğu ülkeye göre belirleniyor.",
      },
      {
        q: "ChatGPT reklamları herkese gösteriliyor mu?",
        a: "Hayır. Reklamlar ücretsiz ve Go planlarındaki uygun kullanıcılara gösteriliyor; Plus ve Pro gibi üst planlar reklamsız. OpenAI, reklamların 18 yaş altındaki kullanıcılara gösterilmediğini ve hassas konuların yanında yer almadığını açıklıyor.",
      },
      {
        q: "ChatGPT reklamında anahtar kelime seçiliyor mu?",
        a: "Hayır. Google Ads'teki gibi anahtar kelime listesi yerine, reklamın hangi ihtiyaç ve kullanım durumu için uygun olduğunu anlatan bağlam bilgisi yazılıyor. Buna konum ve cihaz gibi kampanya düzeyinde seçimler ekleniyor.",
      },
      {
        q: "ChatGPT reklamı vermek, ChatGPT'nin beni önermesini sağlar mı?",
        a: "Hayır. OpenAI'ye göre reklamlar cevabı etkilemiyor; reklam cevabın altında ayrı bir alanda görünüyor. Cevabın içinde önerilmek organik görünürlükle ilgili ayrı bir çalışma gerektiriyor.",
      },
    ],
  },
  {
    slug: "yapay-zeka-isletme-onerirken-neye-bakar",
    category: "Yapay Zeka",
    color: "#22d3ee",
    title: "ChatGPT ve Gemini İşletme Önerirken Neye Bakıyor? Yerel İşletmeler İçin Yapay Zeka Görünürlüğü Rehberi",
    excerpt:
      "Müşterileriniz artık 'yakınımdaki en iyi ...' sorusunu yapay zeka asistanlarına soruyor. ChatGPT, Gemini ve benzerlerinin işletme önerirken hangi sinyallere baktığı ve yerel bir işletmenin bu cevaplarda yer almak için yapabilecekleri.",
    date: "1 Ekim 2026",
    dateISO: "2026-10-01",
    readTime: "9 dk",
    intro:
      "Bir işletme sahibi düşünün: Gölbaşı'nda yeni bir kafe açmış, sosyal medyası için ajans arıyor. Eskiden Google'a 'ankara sosyal medya ajansı' yazar, birkaç siteye girer, karar verirdi. Bugün aynı kişi giderek daha sık ChatGPT'ye ya da Gemini'ye şöyle yazıyor: 'Gölbaşı'nda kafem var, Instagram'ı yönetecek ve reklam verecek bir ajans önerir misin?' Karşılığında iki üç isim ve kısa gerekçeler alıyor. O kısa listede olmayan işletme, karşılaştırmaya hiç girmiyor. Bu yazıda yapay zeka asistanlarının bir işletmeyi önerirken nelere baktığını ve yerel bir işletmenin bu cevaplarda yer almak için somut olarak neler yapabileceğini anlatıyoruz. Anlattıklarımızın çoğunu önce kendi markamızda uyguladık.",
    sections: [
      {
        h2: "Yapay Zeka Cevabını Nereden Kuruyor?",
        body: "ChatGPT, Gemini ve benzeri asistanlar bir soruyu cevaplarken iki kaynaktan beslenir. Birincisi, modelin eğitildiği büyük metin birikimidir; bu birikim belirli bir tarihe kadarki interneti yansıtır. İkincisi, özellikle güncel ya da yerel sorularda asistanın o an yaptığı web aramasıdır. 'Gölbaşı'nda kafe için ajans' gibi yerel ve güncel bir soruda asistan genellikle arama yapar, bulduğu sayfaları okur ve cevabını bunlardan derler. Bu yüzden yapay zeka görünürlüğünün temeli hâlâ iyi bir arama görünürlüğüdür: asistanın bulamadığı sayfayı okuması, okumadığı işletmeyi önermesi mümkün değil.",
      },
      {
        h2: "Net Bir Kimlik: Kim Olduğunuzu Tek Cümlede Söyleyin",
        body: "Asistanlar, bir işletmenin ne yaptığını, nerede olduğunu ve kime hizmet verdiğini net olarak anlayabildiğinde onu bir soruyla eşleştirebilir. Sitenizin ana sayfasında, hakkımızda bölümünde ve hizmet sayfalarında bu üç bilgi açık ve tutarlı olmalı: 'Ankara Siteler merkezli, mobilya mağazalarına ve kafelere sosyal medya ve reklam hizmeti veren ajans' gibi. İşletme adınız, adresiniz ve telefonunuz sitede, Google İşletme Profilinde, sosyal medya hesaplarında ve dizinlerde birebir aynı yazılmalı. Bir yerde 'Sütçü Kemal İş Merkezi', başka yerde yalnızca semt adı, bir başka yerde eski bir telefon numarası olması, makinelerin bu kayıtların aynı işletmeye ait olduğundan emin olmasını zorlaştırır.",
      },
      {
        h2: "Soruyu Doğrudan Cevaplayan Sayfalar",
        body: "Asistanlar, kullanıcının sorusuna en doğrudan cevap veren sayfayı sever. 'Gölbaşı'nda kafem var, ajans arıyorum' sorusuna en iyi cevap veren sayfa, genel bir 'hizmetlerimiz' sayfası değil, Gölbaşı'ndaki kafelerin dinamiklerini anlatan, orada nasıl çalışıldığını açıklayan ve sık sorulan soruları cevaplayan bir sayfadır. Bu yüzden sektörünüz ve bölgenizle ilgili soruları tek tek düşünüp her birine gerçekten bir şey anlatan sayfalar oluşturmak, yapay zeka görünürlüğünün en etkili adımıdır. Burada kritik nokta özgünlük: şehir ya da ilçe adı değiştirilmiş kopya sayfalar ne arama motorlarına ne asistanlara değer katar. Her sayfa o bölgenin ya da o müşteri tipinin gerçek ihtiyaçlarını anlatmalı.",
      },
      {
        h2: "Sık Sorulan Sorular, Yapılandırılmış Veri ve llms.txt",
        body: "Sayfalarınızdaki sık sorulan sorular bölümleri, asistanların doğrudan alıntılayabileceği kısa ve net cevaplar sunar. Bu cevapları gerçek müşteri sorularından seçin ve kaçamak değil, net yazın. Yapılandırılmış veri (schema) ise sayfanın içeriğini makinelerin anlayacağı bir dille etiketler: işletme bilgileri, hizmetler, sık sorulan sorular, makale yazarı. llms.txt dosyası da sitenizin özetini ve önemli sayfalarını yapay zeka araçlarının hızlıca okuyabileceği sade bir metinde toplayan bir öneridir. Bunların hiçbiri tek başına önerilmeyi garanti etmez; ama işletmenizi makinelere net anlatan sinyallerin toplamını güçlendirir.",
      },
      {
        h2: "Google İşletme Profili ve Yorumlar",
        body: "Yerel sorularda asistanlar sıklıkla harita verisine ve işletme profillerine başvurur. Google İşletme Profilinizin doğru kategoride, eksiksiz hizmet listesiyle, güncel fotoğraflarla ve doğru çalışma saatleriyle durması bu yüzden yalnızca Haritalar için değil, yapay zeka cevapları için de önemlidir. Yorumlar ikinci kritik sinyal: yorumların sayısı, güncelliği ve içeriği. Müşterinin yorumda hizmeti ve bölgeyi kendi kelimeleriyle anlatması, örneğin 'mobilya mağazamızın Instagram reklamlarını yönetiyorlar', işletmenizin hangi konuda tanındığını gösteren doğal bir işarettir. Yorumları satın almak ya da karşılığında indirim vermek ise kurallara aykırıdır ve fark edildiğinde güveni tamamen yok eder.",
      },
      {
        h2: "Başkalarının Sizin Hakkınızda Söyledikleri",
        body: "Bir işletmeyi öneren insan da yapay zeka da aynı şeye bakar: başkaları bu işletme hakkında ne diyor? Sektör dizinlerinde, yerel haber sitelerinde, iş ortaklarınızın sitelerinde, video platformlarında ve forumlarda markanızın doğru bilgilerle geçmesi, asistanın sizi bir konuyla ilişkilendirmesini kolaylaştırır. Bunun için yapay bağlantı ağlarına ya da para karşılığı yazılara gerek yok. Gerçek iş birliklerinizi anlatmak, müşterinizin izniyle vaka çalışması yayınlamak, sektörünüzle ilgili bilgi veren videolar ve rehberler üretmek hem insanlar hem makineler için güvenilir bir iz bırakır.",
      },
      {
        h2: "Görünürlüğünüzü Nasıl Ölçersiniz?",
        body: "Yapay zeka cevapları kişiye, konuma ve zamana göre değiştiği için tek bir sıralama yok. Ölçmenin en pratik yolu, müşterilerinizin sorabileceği 10-20 soruyu bir listeye yazıp bunları düzenli aralıklarla farklı asistanlara sormak ve işletmenizin hangi cevaplarda, hangi bilgilerle geçtiğini kaydetmek. Asistanın sizi yanlış anlattığı yerler, örneğin eski bir adres ya da artık vermediğiniz bir hizmet, düzeltmeniz gereken kaynakları da gösterir. Sitenizin ziyaretçi raporlarında yapay zeka asistanlarından gelen ziyaretleri ayrıca takip etmek de değişimi görmenize yardımcı olur.",
      },
      {
        h2: "Yapılmaması Gerekenler",
        body: "Yeni bir alan, yeni kısayol vaatlerini de beraberinde getiriyor. Sayfaları anlamsızca anahtar kelimeyle doldurmak, başka işletmelerin içeriğini kopyalamak, gerçekte olmayan ödül ve rakamlar yazmak, sahte yorum toplamak ya da yalnızca yapay zekayı kandırmak için yazılmış gizli metinler eklemek kısa vadede bile işe yaramaz; uzun vadede ise hem arama motorlarında hem müşterinin gözünde güveni zedeler. Yapay zeka asistanları giderek daha iyi ayırt ediyor: tutarlı, doğrulanabilir ve gerçekten yardımcı olan bilgiyi ödüllendiriyor.",
        link: { href: "/hizmetler/yapay-zeka-arama-gorunurlugu", label: "Yapay zeka arama görünürlüğü hizmetimiz" },
      },
    ],
    conclusion:
      "Yapay zeka asistanlarında önerilmek bir sihir değil, iyi işletme bilgisinin ve iyi içeriğin doğal sonucu. Kim olduğunuzu net anlatan bir site, müşterinizin sorularına doğrudan cevap veren sayfalar, tutarlı iletişim bilgileri, güçlü bir Google İşletme Profili ve başka kaynaklarda bıraktığınız güvenilir iz, hem Google'da hem ChatGPT'de hem Gemini'de aynı işi görür. markaizi olarak bu yaklaşımı önce kendi markamızda uyguladık; işletmenizin bugün yapay zeka cevaplarında nasıl göründüğünü ücretsiz analizle birlikte kontrol edebiliriz.",
    faq: [
      {
        q: "ChatGPT'de işletmemin önerilmesi için para ödemem gerekir mi?",
        a: "Hayır. Cevabın içinde önerilmek ücretli değil; sitenizin, işletme profilinizin ve dijital izinizin kalitesine bağlı. ChatGPT'de ücretli reklam da verilebiliyor ama bu, cevabın altında ayrı ve sponsorlu olarak etiketlenmiş bir alanda görünür ve cevabı etkilemez.",
      },
      {
        q: "Yapay zeka görünürlüğü için SEO'yu bırakmalı mıyım?",
        a: "Hayır, tam tersine. Yapay zeka asistanları güncel ve yerel sorularda çoğunlukla web araması yapar ve bulduğu sayfaları okur. İyi bir SEO, yapay zeka görünürlüğünün temelidir; yapay zeka görünürlüğü ise buna net kimlik, soru-cevap içerik ve dış kaynaklardaki bahsedilmeyi ekler.",
      },
      {
        q: "Yapay zeka asistanı işletmem hakkında yanlış bilgi veriyorsa ne yapmalıyım?",
        a: "Önce yanlış bilginin nereden geldiğini bulun: eski bir dizin kaydı, güncellenmemiş bir profil ya da sitenizdeki eski bir sayfa olabilir. Bu kaynakları düzeltin, sitenizde ve Google İşletme Profilinizde doğru bilgiyi net biçimde yazın. Asistanların cevapları kaynaklar güncellendikçe zamanla değişir.",
      },
    ],
  },
  {
    slug: "ajans-degistirirken-reklam-hesabi-devri",
    category: "Reklam Stratejisi",
    color: "#f87171",
    title: "Reklam Ajansı Değiştirirken Hesaplarınızı Nasıl Korursunuz? Devir Kontrol Listesi",
    excerpt:
      "Ajans değiştirmek istiyorsunuz ama reklam hesabınız, Instagram sayfanız ve pikseliniz kimin üzerinde? Geçmiş verilerinizi kaybetmeden, kampanyaları durdurmadan ajans değiştirmenin adım adım kontrol listesi.",
    date: "1 Ekim 2026",
    dateISO: "2026-10-01",
    readTime: "8 dk",
    intro:
      "İşletme sahiplerinin ajans değiştirmeyi ertelemesinin en yaygın nedeni memnuniyet değil, belirsizlik: 'Ayrılırsam hesaplarım ne olur, yıllardır biriken veriler kaybolur mu, reklamlar durur mu?' Bu soruların cevabı büyük ölçüde tek bir şeye bağlı: hesaplar kimin üzerinde. Hesaplar işletmenin kendi üzerindeyse ajans değiştirmek birkaç günlük bir yetki işlemidir. Ajansın üzerindeyse ise yıllarca biriken kitleler, piksel verisi ve kampanya geçmişi bir anda sıfırlanabilir. Bu yazıda ajans değiştirmeden önce, sırasında ve sonrasında yapmanız gerekenleri bir kontrol listesi halinde anlatıyoruz. Ajans değiştirmeyi düşünmüyor olsanız bile, ilk bölümdeki kontrolleri bugün yapmanızı öneririz.",
    sections: [
      {
        h2: "En Pahalı Hata: Hesabın Ajansta Kalması",
        body: "Pek çok işletme dijital reklama başlarken her şeyi ajansa bırakır: 'Siz açın, siz yönetin.' İlk yıllarda sorun çıkmaz. Ama reklam hesabı, Instagram ve Facebook sayfalarının yönetimi ve piksel ajansın işletme hesabında açıldıysa, ayrılık günü bunların sahibi siz değil ajans olur. Bu durumda en iyi ihtimalle uzun bir devir süreci, en kötü ihtimalle sıfırdan yeni hesap açmak gerekir. Yeni hesap; geçmiş kampanya verisi, yıllar içinde oluşan yeniden hedefleme kitleleri ve pikselin öğrendiği her şey olmadan başlamak demektir. Reklam sistemi her şeyi yeniden öğrenirken ilk haftalarda maliyetler genellikle yükselir.",
      },
      {
        h2: "Önce Sahipliği Kontrol Edin",
        body: "Meta tarafında İşletme Portföyü ayarlarına girin ve şu varlıkların sahibi olarak kendi işletmenizin göründüğünü kontrol edin: Facebook sayfası, Instagram hesabı, reklam hesabı, piksel (veri kümesi) ve varsa ürün kataloğu. Ajansın bu varlıklara 'iş ortağı' olarak erişimi olması normaldir; sahibi olması değil. Google tarafında Google Ads hesabının kimin kontrolünde olduğunu, ajansın yönetici hesabının yalnızca bağlı mı yoksa tek yetkili mi olduğunu kontrol edin. Google Analytics, Google Tag Manager, Search Console ve Google İşletme Profili için de aynı soruyu sorun: yönetici olarak sizin hesabınız var mı? Alan adınızın ve web sitenizin barındırma hesabının kimin üzerine kayıtlı olduğu da bu listeye dahil.",
      },
      {
        h2: "Ödeme Yöntemi ve Faturalar",
        body: "Reklam bütçesi kimin kartından ödeniyor? Bütçe ajansın kartından ödenip size ayrıca fatura ediliyorsa, ayrılıkta reklam hesabındaki ödeme yöntemi de değişmek zorundadır ve bu sırada kampanyalar kesintiye uğrayabilir. Sağlıklı olan, reklam bütçesinin baştan sizin ödeme yönteminizle doğrudan platforma gitmesi ve ajansın yalnızca yönetim ücretini fatura etmesidir. Böylece hem harcamayı kendi gözünüzle görürsünüz hem de ajans değişikliğinde ödeme tarafında hiçbir şey değişmez.",
      },
      {
        h2: "Ayrılmadan Önce Neleri Yedeklemelisiniz?",
        body: "Hesaplar sizin olsa bile bazı birikimler ajansın bilgisayarlarında ve dosyalarında durur. Ayrılık konuşmasından önce şunları isteyin: son bir iki yılın aylık reklam raporları, çalışan ve çalışmayan kreatiflerin listesi ve kaynak dosyaları (video, tasarım dosyaları), kullanılan müşteri listeleri ve kitle tanımları, dönüşüm takibinin nasıl kurulduğuna dair notlar ve varsa içerik takvimleri. Bunlar yeni ajansın sıfırdan değil, öğrenilmiş derslerin üzerine başlamasını sağlar.",
      },
      {
        h2: "Yeni Ajansa Erişimi Doğru Verin",
        body: "Yeni ajansa erişim verirken şifre paylaşmayın. Meta'da ajansı İşletme Portföyünüze iş ortağı olarak ekleyip yalnızca ihtiyaç duyduğu varlıklara, ihtiyaç duyduğu yetkiyle erişim verin; Google Ads'te ajansın yönetici hesabının bağlanma isteğini onaylayın. Bu yöntemle erişim tek tıkla kaldırılabilir ve kimin ne yaptığı kayıt altında kalır. Eski ajansın erişimini ise yeni ajans hesabı incelemeyi bitirip devraldıktan sonra, planlı biçimde kaldırın.",
      },
      {
        h2: "Kampanyaları Durdurmadan Geçiş",
        body: "Ajans değişikliği, çalışan kampanyaları kapatıp her şeyi baştan kurmak için bir bahane olmamalı. Reklam sistemleri büyük ve ani değişikliklerden sonra yeniden öğrenme sürecine girer. İyi bir geçişte yeni ajans önce mevcut hesabı inceler, neyin çalıştığını ve neyin çalışmadığını raporlar, ölçüm hatalarını düzeltir ve ardından değişiklikleri kademeli yapar. Çalışan bir kampanyaya ilk hafta dokunulmaması, çoğu zaman en doğru karardır.",
      },
      {
        h2: "Yeni Ajanstan İlk 30 Günde Ne Beklemelisiniz?",
        body: "İlk ay, sonuçlardan çok teşhis ayıdır. Yeni ajanstan şunları bekleyin: hesabın yazılı bir denetimi, ölçüm kurulumunun kontrolü ve gerekirse düzeltilmesi, öncelik sırasıyla bir yol haritası ve hangi rakamlarla takip edeceğinizin net tanımı. 'İlk hafta satışlarınızı ikiye katlarız' gibi vaatler yerine 'önce şunu düzelteceğiz, sonra şunu test edeceğiz' diyen bir ekip, uzun vadede daha güvenilirdir.",
        link: { href: "/reklam-hesabi-denetimi", label: "Ücretsiz reklam hesabı denetimi" },
      },
      {
        h2: "Sözleşmeye Mutlaka Yazdırın",
        body: "Hangi ajansla çalışırsanız çalışın, sözleşmede şu maddelerin olmasını isteyin: reklam hesapları, sayfalar, piksel ve tüm dijital varlıkların işletmeye ait olduğu; reklam bütçesinin işletmenin ödeme yöntemiyle doğrudan platforma ödendiği; ayrılıkta erişimlerin ve dosyaların hangi süre içinde devredileceği; ve sözleşmenin süresi ile fesih koşulları. Bu maddeler iyi giden bir ilişkide hiçbir şey değiştirmez, kötü giden bir ilişkide ise sizi korur.",
      },
    ],
    conclusion:
      "Ajans değiştirmenin zorluğu, çoğu zaman ajansın kendisinden değil, hesapların kimin üzerinde olduğundan kaynaklanır. Hesaplar, sayfalar ve piksel sizin işletme hesabınızda durduğu sürece ajans değişikliği birkaç günlük, kontrollü bir yetki işlemidir. markaizi'de reklam hesapları her zaman müşteriye aittir ve bütçe müşterinin kendi ödeme yöntemiyle doğrudan platforma gider. Mevcut hesaplarınızın sahipliğini ve ölçüm kurulumunu ücretsiz denetimimizde birlikte kontrol edebiliriz.",
    faq: [
      {
        q: "Reklam hesabım ajansın üzerine açılmış, geri alabilir miyim?",
        a: "Çoğu durumda evet. Meta'da varlıkların sahipliği İşletme Portföyleri arasında aktarılabilir; Google Ads'te de hesap yönetimi devredilebilir. Bunun için mevcut ajansın işbirliği gerekir. Devir mümkün değilse yeni hesap açılır, ancak geçmiş veri ve kitleler büyük ölçüde sıfırlanır.",
      },
      {
        q: "Ajans değiştirince reklamlarım durur mu?",
        a: "Hesaplar sizdeyse durması gerekmez. Yeni ajansa iş ortağı erişimi verildikten sonra çalışan kampanyalara dokunmadan devralma yapılabilir. Ödeme yöntemi ajansa aitse ise ödeme değişikliği sırasında kısa bir kesinti yaşanabilir.",
      },
      {
        q: "Eski ajansın erişimini ne zaman kaldırmalıyım?",
        a: "Yeni ajans hesabı inceleyip devraldıktan, gerekli raporları ve dosyaları aldıktan sonra. Erişimi planlı ve kayıt altında kaldırmak, iki ajansın aynı anda kampanyalarda değişiklik yapmasını da önler.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
