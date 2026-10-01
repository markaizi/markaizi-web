import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: { absolute: "Yapay Zeka Arama Görünürlüğü (GEO) — ChatGPT ve Gemini'de Önerilen Marka Olun | markaizi" },
  description:
    "ChatGPT, Gemini, Perplexity ve Google yapay zeka özetlerinde işletmenizin doğru anlatılması ve önerilmesi için GEO çalışması: içerik, yapılandırılmış veri, Google İşletme Profili ve marka bahsi. ChatGPT reklamları kurulumu ve yönetimi. Ankara merkezli, Türkiye geneli.",
  keywords:
    "yapay zeka arama görünürlüğü, geo nedir, generative engine optimization, chatgpt'de görünmek, chatgpt seo, yapay zeka seo, chatgpt reklamları, chatgpt reklam verme, gemini görünürlük, ai görünürlük ajansı, ankara geo ajansı",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/yapay-zeka-arama-gorunurlugu" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export default function YapayZekaAramaGorunurluguPage() {
  return (
    <ServicePageTemplate
      badge="Yeni Arama Kanalı"
      icon={ICON}
      path="/hizmetler/yapay-zeka-arama-gorunurlugu"
      title="Yapay Zeka Arama Görünürlüğü (GEO)"
      subtitle="Müşterileriniz artık yalnızca Google'a yazmıyor, ChatGPT'ye ve Gemini'ye soruyor. İşletmenizin bu cevaplarda doğru bilgilerle anlatılması ve önerilmesi için sitenizi, içeriğinizi ve dijital izinizi düzenliyoruz; isterseniz ChatGPT reklamlarıyla ücretli tarafı da kuruyoruz."
      description={[
        "Arama alışkanlığı değişiyor. Eskiden 'ankara mobilya reklam ajansı' yazıp on mavi bağlantı arasından seçim yapan kişi, bugün yapay zeka asistanına bir cümle kuruyor: 'Siteler'de mobilya mağazam var, sosyal medya için ajans arıyorum, kimi önerirsin?' Karşılığında genellikle iki üç isim ve kısa gerekçeler alıyor. O kısa listede yer almayan işletme, karşılaştırmaya hiç girmemiş oluyor.",
        "Yapay zeka asistanları cevap üretirken internette işletmenizle ilgili bulabildikleri bilgileri tartıyor: web sitenizin işinizi ne kadar net anlattığı, sektörünüz ve bölgenizle ilgili soruları doğrudan cevaplayan içerikleriniz, adres ve iletişim bilgilerinizin her yerde aynı olması, Google İşletme Profiliniz ve yorumlarınız, başka sitelerde markanızdan nasıl bahsedildiği. Bu sinyalleri düzenleyen çalışmaya GEO (Generative Engine Optimization, üretken arama motoru optimizasyonu) deniyor. İyi bir SEO'nun devamıdır, yerine geçmez.",
        "Bu yaklaşımı önce kendi markamızda uyguladık. Yapay zeka asistanlarına Ankara'da mobilya mağazaları için sosyal medya ya da reklam ajansı sorulduğunda markaizi önerilen ajanslar arasında yer alıyor. Cevaplar soruya, kişiye ve zamana göre değiştiği için kimse 'her soruda birinci' garantisi veremez; ama görünürlüğü düzenli ve ölçülebilir biçimde güçlendirmek mümkün. Hizmette de tam olarak bunu yapıyoruz.",
      ]}
      features={[
        { icon: "globe", title: "Varlık Tutarlılığı", desc: "İşletme adı, adres, telefon, hizmet bölgesi ve kurucu bilgisinin site, harita ve dizinlerde birebir aynı olması." },
        { icon: "pen", title: "Soru-Cevap İçerik", desc: "Müşterinizin asistana soracağı soruları doğrudan cevaplayan hizmet sayfaları, SSS'ler ve rehberler." },
        { icon: "panel", title: "Yapılandırılmış Veri", desc: "Organization, Service, FAQ ve Person şemaları, llms.txt ve temiz site haritasıyla makinelerin okuyabildiği site." },
        { icon: "trophy", title: "Google İşletme Profili ve Yorumlar", desc: "Kategori, hizmetler, fotoğraflar ve düzenli yanıtlanan yorumlarla güven sinyallerinin güçlendirilmesi." },
        { icon: "handshake", title: "Dış Kaynaklarda Bahsedilme", desc: "Sektör dizinleri, iş ortakları ve yerel kaynaklarda markanızın doğru bilgilerle yer alması." },
        { icon: "sparkle", title: "ChatGPT Reklamları", desc: "Organik görünürlüğün yanında ChatGPT içinde ücretli reklam: bağlam kurgusu, ölçüm ve test bütçesi." },
      ]}
      approach={{
        title: "Organik Görünürlük ve ChatGPT Reklamları Birlikte",
        paragraphs: [
          "Çalışmaya mevcut durumu ölçerek başlıyoruz: sektörünüzde müşterilerin sorabileceği soruları çıkarıyor, bu soruları farklı yapay zeka asistanlarına soruyor ve işletmenizin hangi cevaplarda, hangi bilgilerle geçtiğini kaydediyoruz. Ardından eksikleri kapatıyoruz: sitede net cevap vermeyen sayfalar, tutarsız iletişim bilgileri, eksik şemalar, yorum ve profil sorunları. Aynı soruları belirli aralıklarla yeniden sorarak değişimi raporluyoruz.",
          "ChatGPT reklamları ise bu işin ücretli tarafı. OpenAI'nin reklam platformu Eylül 2026 itibarıyla Türkiye'deki işletmelere açıldı; reklamlar ChatGPT'nin cevabının altında, 'sponsorlu' olarak etiketlenmiş ayrı bir alanda görünüyor ve anahtar kelime yerine reklamın hangi ihtiyaç için uygun olduğunu anlatan bağlam bilgisiyle hedefleniyor. Kanal yeni olduğu için ölçümü doğrulanmış, sınırlı bir test bütçesiyle başlamayı ve sonucu Meta ve Google'daki kampanyalarınızla aynı dönüşüm tanımı üzerinden karşılaştırmayı öneriyoruz.",
        ],
      }}
      relatedPosts={[
        { slug: "yapay-zeka-isletme-onerirken-neye-bakar", title: "Yapay Zeka İşletme Önerirken Neye Bakıyor?" },
        { slug: "chatgpt-reklamlari-turkiye-rehberi", title: "ChatGPT Reklamları Türkiye Rehberi" },
      ]}
      faq={[
        {
          q: "GEO nedir, SEO'dan farkı ne?",
          a: "SEO, Google'ın arama sonuçlarında üst sıralarda çıkmayı hedefler. GEO ise ChatGPT, Gemini, Perplexity ve Google'ın yapay zeka özetleri gibi cevap üreten sistemlerde işletmenizin doğru anlatılmasını ve önerilmesini hedefler. İkisi aynı temele dayanır: net, güvenilir ve soruyu doğrudan cevaplayan içerik. GEO buna varlık tutarlılığı, yapılandırılmış veri ve dış kaynaklardaki bahsedilmeyi ekler.",
        },
        {
          q: "ChatGPT'nin beni önereceğini garanti edebilir misiniz?",
          a: "Hayır, ve garanti veren birine temkinli yaklaşın. Yapay zeka cevapları soruya, kişiye, konuma ve zamana göre değişiyor. Garanti edebileceğimiz şey çalışmanın kendisi: eksiklerin giderilmesi, düzenli ölçüm ve değişimin şeffaf raporlanması.",
        },
        {
          q: "Ne kadar sürede sonuç alınır?",
          a: "Site içi düzenlemeler ve Google İşletme Profili iyileştirmeleri birkaç hafta içinde arama sonuçlarına yansımaya başlar. Yapay zeka asistanlarının cevaplarına etkisi ise genellikle daha uzun sürer ve kullanılan modele göre değişir. Bu yüzden çalışmayı aylık ölçümlerle takip ediyoruz.",
        },
        {
          q: "ChatGPT reklamları Türkiye'de verilebiliyor mu?",
          a: "Evet. OpenAI'nin reklam platformu Eylül 2026 itibarıyla Türkiye'de kurulu işletmelerin reklamveren hesabı açabileceği ülkeler arasına girdi. Reklamlar ChatGPT'nin ücretsiz ve Go planlarındaki uygun kullanıcılara, cevabın altında sponsorlu olarak gösteriliyor. Platform kuralları ve uygunluk koşulları değişebildiği için kampanya öncesinde güncel durumu kontrol ediyoruz.",
        },
        {
          q: "ChatGPT reklamları kimler için mantıklı?",
          a: "Müşterinin karar vermeden önce araştırdığı ve karşılaştırdığı işler için: mobilya, ev dekorasyonu, eğitim, danışmanlık ve yüksek sepetli e-ticaret. Sağlık gibi hassas kategorilerde platform kuralları daha kısıtlayıcı olduğu için önce güncel reklam politikalarını kontrol ediyoruz. Müşteri asistana ihtiyacını cümlelerle anlattığı için reklam, karar anına yakın birine gösterilir. Kanal yeni olduğundan test bütçesiyle başlamak ve ölçümü baştan kurmak şart.",
        },
        {
          q: "llms.txt dosyası nedir, işe yarar mı?",
          a: "llms.txt, sitenizin özetini ve önemli sayfalarını yapay zeka araçlarının hızlıca okuyabileceği sade bir metin dosyasında toplayan bir öneridir. Tek başına sıralama ya da önerilme sağlamaz; ama sitenizin ne yaptığını makinelere net anlatan sinyallerden biridir ve kurulumu basittir. Biz bu dosyayı sitenin içeriğinden otomatik üretilecek şekilde kuruyoruz.",
        },
      ]}
    />
  );
}
