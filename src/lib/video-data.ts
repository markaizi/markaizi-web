// YouTube videoları — her hafta yeni video eklemek için:
//   1) Metni src/content/videolar/<slug>.txt olarak kaydet (bölümler "⸻" ile,
//      bölüm başlıkları BÜYÜK HARFLE).
//   2) Aşağıdaki listenin EN BAŞINA yeni bir kayıt ekle.
//   3) Video YouTube'a yüklenince youtubeId alanını doldur (watch?v=XXXX kısmı).
// Sitemap, llms.txt dışındaki her şey (liste, detay, şema) otomatik oluşur;
// llms.txt'ye yeni videonun satırını elle eklemeyi unutma.

// Kanal açılınca doldur: https://www.youtube.com/@... — dolunca "Abone Ol"
// butonları ve Organization sameAs bağlantısı otomatik görünür.
export const YOUTUBE_CHANNEL_URL: string | null = null;

export type VideoPost = {
  slug: string;
  title: string; // sayfa H1'i
  seoTitle: string; // <title>
  excerpt: string; // meta description ve kart metni
  date: string;
  dateISO: string; // YYYY-MM-DD — video YouTube'da yayınlandığı gün
  youtubeId: string | null; // yüklenmeden önce null: sayfa "yakında" gösterir
  durationISO?: string; // ör. "PT24M30S" — biliniyorsa şemaya eklenir
  keywords: string;
  ozet: string[]; // sayfanın başındaki kısa özet (yapay zeka ve okuyucu için)
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

export const VIDEOS: VideoPost[] = [
  {
    slug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
    title: "İşletmeler İçin Dijital Pazarlama ve Reklam Rehberi",
    seoTitle: "İşletmeler İçin Dijital Pazarlama ve Reklam Rehberi: Ajansla Çalışmadan Önce Bilmeniz Gerekenler",
    excerpt:
      "Reklam neden tek başına satış yapmaz? Her gün paylaşım gerekli mi, takipçi sayısı ne kadar önemli, reklam bütçesi nasıl belirlenir, ajans neyi garanti edebilir? İşletme sahipleri için başlangıç rehberi.",
    date: "Eylül 2026",
    dateISO: "2026-09-26",
    youtubeId: null,
    keywords:
      "dijital pazarlama rehberi, işletmeler için reklam rehberi, meta reklamları nasıl çalışır, reklam bütçesi ne kadar olmalı, her gün paylaşım yapmak gerekli mi, takipçi sayısı önemli mi, reklam ajansı nasıl seçilir, ajans satış garantisi, reklam neden çalışmıyor, sosyal medya ajansı ile çalışmak",
    ozet: [
      "Reklam tek başına satış yapmaz; reklam, kreatif, teklif, hedef kitle, satış süreci ve operasyondan oluşan bir zincirin parçasıdır. Zincirin bir halkası zayıfsa en iyi reklam da sonuç getirmez.",
      "Hedef kitle yaşa ve şehre göre değil, kişinin içinde bulunduğu ihtiyaca göre tanımlanır. Meta'nın yapay zekası geliştikçe kreatif, hedeflemenin bir parçası haline geldi; ama hedef kitleyi bilmek hâlâ önemli.",
      "Her gün paylaşım zorunlu değil. İçerik sayısını takvim değil; hedef, bütçe ve üretim kapasitesi belirler. Sınırlı bütçede 30 sıradan içerik yerine 12 güçlü içerik çoğu zaman daha verimlidir.",
      "Takipçi sayısı tek başına başarı ölçüsü değildir; doğru kişiye ulaşım, mesaj, nitelikli müşteri ve satış ölçülmelidir.",
      "Sorun teşhisi: izlenmiyorsa kreatife, izlenip aksiyon yoksa mesaja ve teklife, tıklanıp dönüşüm yoksa satış yolculuğuna, mesaj gelip satış yoksa satış sürecine bakılır.",
      "Reklam bütçesi üç aşamada düşünülür: test, büyüme ve ölçekleme. Zarar eden bir bütçeyi büyütmek ölçekleme değildir.",
      "Bir ajans satış sonucunu koşulsuz garanti edemez ama çalışma standardını (şeffaf rapor, test disiplini, dürüst iletişim) garanti etmelidir. Reklam hesabı ve veriler işletmeye ait olmalıdır.",
    ],
    faq: [
      {
        q: "Reklam verdikten sonra ne kadar sürede sonuç alınır?",
        a: "Herkese uyan tek bir süre yoktur. Geçmiş verisi olan bir hesapta ilk hafta iyi sonuç görülebilirken sıfırdan başlayan bir işletmede daha uzun bir öğrenme dönemi gerekir. Doğru soru 'kaç günde sonuç gelir' değil, 'şu anda sorun nerede ve nasıl iyileştireceğiz' sorusudur.",
      },
      {
        q: "Sosyal medyada her gün paylaşım yapmak zorunlu mu?",
        a: "Hayır. Yeterli bütçe, ekip ve çekim kapasitesi varsa sık paylaşım değerli olabilir; ama kalite korunamıyorsa daha az ve daha güçlü içerik genellikle daha iyi sonuç verir. İçerik sayısını takvim değil; hedef, bütçe ve üretim kapasitesi belirlemelidir.",
      },
      {
        q: "Takipçi sayısı satış için ne kadar önemli?",
        a: "Amaç topluluk büyütmekse önemlidir, ama işletmenin hedefi satışsa tek başına yanıltıcı olabilir. 5 bin doğru takipçisi olan bir işletme, 20 bin takipçili bir hesaptan çok daha fazla satış yapabilir. Ölçülmesi gereken doğru kişiye ulaşım, mesaj, nitelikli müşteri ve satıştır.",
      },
      {
        q: "Meta'nın yapay zekası artık reklamları kendisi mi yönetiyor?",
        a: "Meta'nın yapay zeka ve otomasyon sistemleri reklamın kime gösterileceğinde çok daha büyük rol oynuyor ve kullanıcı davranışlarından öğreniyor. Ama sistem doğru kampanya hedefine, veriye, teklife, ölçüme ve özellikle doğru kreatife ihtiyaç duyuyor. Reklam yöneticisinin işi artık algoritmanın eline doğru malzemeyi vermek.",
      },
      {
        q: "Reklam bütçesi ne kadar olmalı?",
        a: "Tek bir doğru rakam yoktur; önce hangi aşamada olunduğu belirlenir. Test aşamasında amaç çalışan sistemi bulmaktır, büyüme aşamasında işletmenin operasyonunun gelen talebe hazır olup olmadığına bakılır, ölçekleme aşamasında ise kârlı çalışan sistem bozulmadan büyütülür.",
      },
      {
        q: "Reklam çalışmıyorsa sorunun nerede olduğunu nasıl anlarım?",
        a: "Kabaca şu sırayla bakılır: reklam izlenmiyorsa kreatif, izlenip tıklanmıyorsa mesaj ve teklif, tıklanıp dönüşüm olmuyorsa açılış sayfası ve satış yolculuğu, mesaj gelip satış olmuyorsa satış süreci ve mesajlara dönüş hızı.",
      },
      {
        q: "Reklam ajansları satış garantisi verebilir mi?",
        a: "Satışın tamamı reklam yöneticisinin kontrolünde olmadığı için koşulsuz satış garantisine temkinli yaklaşılmalıdır. Ürün, fiyat, stok, mesajlara dönüş hızı ve satış personeli de sonucu belirler. Bir ajansın garanti etmesi gereken şey çalışma standardıdır: düzenli iletişim, şeffaf raporlama, test disiplini ve sorunu açıkça söylemek.",
      },
      {
        q: "Bir ajansla çalışmadan önce hangi soruları sormalıyım?",
        a: "Ne yaptığını açıklayabiliyor mu, işletmenizi ve müşterinizi anlamaya çalışıyor mu, kreatif tarafına dokunuyor mu, satış sonrası veriyi soruyor mu ve 'ilk ay kötü giderse ne yapacaksınız' sorusuna nasıl cevap veriyor? Ayrıca reklam hesabı ve verilerin işletmeye ait kalacağını baştan netleştirin.",
      },
    ],
    related: [
      { href: "/blog/ankara-mobilya-ajansi-nasil-secilir", label: "Ajans Nasıl Seçilir? (Kontrol Listesi)" },
      { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" },
      { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi" },
      { href: "/hizmetler/dijital-pazarlama-danismanligi", label: "Dijital Pazarlama Danışmanlığı" },
    ],
  },
];

export function getVideoBySlug(slug: string) {
  return VIDEOS.find((v) => v.slug === slug);
}

export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const ytEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
