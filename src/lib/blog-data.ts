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
  intro: string;
  sections: BlogSection[];
  conclusion: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "instagram-algoritmasi",
    category: "Sosyal Medya",
    color: "#c084fc",
    title: "Instagram Algoritması 2025: Organik Büyüme İçin 10 Strateji",
    excerpt:
      "Instagram'ın son algoritma güncellemeleri neleri değiştirdi? Reels, Carousel ve Story formatlarında nasıl daha fazla erişim elde edersiniz?",
    date: "15 Ocak 2025",
    readTime: "7 dk",
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
    category: "Google Ads",
    color: "#60a5fa",
    title: "Google Ads'de Bütçeyi Optimize Etmenin 7 Yolu",
    excerpt:
      "Tıklama başı maliyeti (CPC) nasıl düşürülür? Anahtar kelime kalite puanı neden önemlidir ve nasıl artırılır?",
    date: "22 Ocak 2025",
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
    category: "Meta Reklamları",
    color: "#f472b6",
    title: "Meta Ads'de ROAS Artırmanın Kesin Yolları",
    excerpt:
      "Facebook ve Instagram reklamlarında reklam harcaması getirisini (ROAS) nasıl maksimize edersiniz? A/B test stratejileri ve kreatif ipuçları.",
    date: "5 Şubat 2025",
    readTime: "8 dk",
    intro:
      "ROAS (Return on Ad Spend — Reklam Harcaması Getirisi), harcadığınız her lira için elde ettiğiniz geliri ölçer. ROAS = 3 demek, 1 TL harcayıp 3 TL kazanmak demektir. Meta Ads'de başarılı kampanyalar için bu oranı nasıl maksimize edeceğinizi adım adım açıklıyoruz.",
    sections: [
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
        h2: "Açılış Sayfası Optimizasyonu",
        body: "ROAS'ın göz ardı edilen bileşeni açılış sayfasıdır. Reklamdan gelen trafik ne kadar kaliteli olursa olsun, açılış sayfası yavaş yükleniyorsa veya güven vermiyorsa dönüşüm gerçekleşmez. Sayfa yükleme süresini 3 saniyenin altında tutun, mobil uyumlu tasarım kullanın ve en fazla 1 net CTA koyun.",
      },
    ],
    conclusion:
      "Meta Ads'de yüksek ROAS sabah akşam optimizasyon gerektiren bir süreçtir. markaizi olarak Meta reklam kampanyalarınızı haftalık raporlarla yönetip sürekli iyileştiriyoruz. Kampanyanızın ROAS analizini ücretsiz yapmak için bizimle iletişime geçin.",
  },
  {
    slug: "tiktok-for-business",
    category: "TikTok",
    color: "#34d399",
    title: "TikTok For Business: Markalar İçin Kapsamlı Rehber",
    excerpt:
      "TikTok Ads Manager kullanımı, In-Feed reklam formatları ve Türkiye pazarında TikTok'u etkin kullanma stratejileri.",
    date: "12 Şubat 2025",
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
    date: "20 Şubat 2025",
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
    title: "2025'te Web Sitesi Hız Optimizasyonu: Core Web Vitals Rehberi",
    excerpt:
      "Google'ın sıralamada önem verdiği Core Web Vitals metrikleri nelerdir? LCP, INP ve CLS nasıl iyileştirilir?",
    date: "1 Mart 2025",
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
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
