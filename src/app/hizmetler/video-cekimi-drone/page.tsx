import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Video Çekimi & Drone Çekimi — Tanıtım Filmi, Sosyal Medya Videosu | markaizi",
  description:
    "Firmalara video başı anlaşmayla profesyonel video çekimi: tanıtım filmi, sosyal medya videosu ve Reels, mankenli ya da mankensiz çekim. Emlak, proje ve işletmeler için drone (hava) çekimi.",
  keywords:
    "video çekimi, tanıtım filmi çekimi, sosyal medya video çekimi, reels çekimi, drone çekimi, emlak drone çekimi, havadan çekim, ürün video çekimi, mankenli video çekimi, ankara video çekimi, ankara drone çekimi",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/video-cekimi-drone" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="12" height="10" rx="2" />
    <path d="M15 11l6-3v8l-6-3" />
  </svg>
);

export default function VideoCekimiPage() {
  return (
    <ServicePageTemplate
      badge="Prodüksiyon"
      icon={ICON}
      path="/hizmetler/video-cekimi-drone"
      relatedPosts={[{ slug: "mobilya-magazalari-icin-instagram", title: "Mobilya Mağazaları İçin Instagram" }]}
      title="Video Çekimi & Drone"
      subtitle="Tanıtım filmi, sosyal medya videosu ya da havadan çekim: ihtiyacınız olan videoyu video başı anlaşmayla, mankenli veya mankensiz çekiyoruz."
      description={[
        "Her işletmenin aylık bir içerik paketine ihtiyacı yok. Kimisi yeni açılan showroom'u için tek bir tanıtım filmi ister, kimisi kampanya dönemi için birkaç Reels, kimisi de satışa çıkardığı bir arsayı ya da siteyi havadan göstermek. Bu yüzden video çekiminde video başı anlaşma yapıyoruz: ne kadar video ihtiyacınız varsa o kadar.",
        "Çekimden önce videonun nerede yayınlanacağını ve ne işe yarayacağını konuşuruz; çünkü web sitesinin girişinde dönecek yatay bir tanıtım filmi ile Instagram'da ilk saniyede durdurması gereken dikey bir Reels tamamen farklı kurgulanır. Senaryo, çekim planı, gerekiyorsa manken, çekim ve kurgu tek elden ilerler; size yayınlanmaya hazır dosyalar teslim edilir.",
        "Drone çekimi özellikle emlak, inşaat projeleri, tesisler, oteller ve açık alanlı işletmeler için güçlü bir araçtır. Bir arsanın konumunu, bir sitenin çevresini ya da bir fabrikanın büyüklüğünü yerden hiçbir çekim o kadar net anlatamaz. Uçuşlar yürürlükteki kurallar ve bölgenin uçuş koşulları kontrol edilerek planlanır.",
      ]}
      features={[
        { icon: "film", title: "Tanıtım Filmi", desc: "Firmanızı, üretiminizi ya da mekânınızı anlatan, web sitesi ve sunumlarda kullanılabilecek kurumsal film." },
        { icon: "mobile", title: "Sosyal Medya Videosu", desc: "Instagram ve TikTok için dikey formatta, ilk saniyede dikkat çeken Reels ve kısa videolar." },
        { icon: "users", title: "Mankenli / Mankensiz", desc: "Ürünü kullanan bir kişiyle hikâye anlatan çekim ya da yalnızca ürün ve mekân odaklı çekim." },
        { icon: "globe", title: "Drone (Hava) Çekimi", desc: "Emlak, arsa, site, tesis ve açık alan projeleri için havadan video ve fotoğraf." },
        { icon: "pen", title: "Senaryo ve Çekim Planı", desc: "Videonun amacına göre senaryo, sahne listesi ve çekim günü planı." },
        { icon: "handshake", title: "Video Başı Anlaşma", desc: "Aylık paket zorunluluğu yok; ihtiyacınız olan video sayısı kadar net fiyatlı anlaşma." },
      ]}
      approach={{
        "title": "Pahalı Kamera, İyi Reklam Demek Değil",
        "paragraphs": [
          "Profesyonel reklam videosu her zaman pahalı reklam videosu demek değil. İnsanlar Instagram'a reklam izlemeye girmiyor; Reels izlemeye, arkadaşlarına bakmaya, eğlenmeye giriyor. Bazen telefonla çekilmiş doğal, 15 saniyelik bir video, stüdyoda çekilmiş cilalı bir filmden daha iyi çalışabiliyor. Bu yüzden çekimden önce 'en pahalı nasıl çekeriz' değil, 'bu video nerede yayınlanacak ve kimin dikkatini çekmeli' sorusunu konuşuyoruz.",
          "Aynı ürün için tek bir video çekip aylarca döndürmek de doğru değil, çünkü herkes aynı sebeple satın almıyor. Bir koltuk takımı için bir videoda fiyatı, birinde konforu, birinde kumaşı, birinde çocuklu ailelerin dikkat etmesi gerekenleri, birinde müşteri yorumunu anlatabiliriz. Tanıtım filmi sizi anlatır; farklı açılardan çekilmiş kısa videolar ise farklı müşterilere ulaşır. Video başı anlaşmada bu karışımı ihtiyacınıza göre birlikte planlıyoruz."
        ],
        "videoText": "Kreatifin neden bu kadar önemli olduğunu videoda anlattık.",
        "videoSlug": "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi"
      }}
      faq={[
        {
          q: "Video başı anlaşma ne demek?",
          a: "Aylık bir içerik paketi almak zorunda değilsiniz. İhtiyacınız olan videoları (örneğin bir tanıtım filmi ve üç Reels) belirliyoruz, her birinin kapsamını ve fiyatını baştan netleştiriyoruz. Fiyatı; videonun süresi, çekim günü sayısı, manken ihtiyacı ve kurgu detayı belirler.",
        },
        {
          q: "Mankenli çekim yapıyor musunuz?",
          a: "Evet. Ürünü kullanan bir kişinin yer aldığı, hikâye anlatan çekimler için manken ya da oyuncu organizasyonu yapabiliyoruz. Yalnızca ürün ve mekân odaklı mankensiz çekim de tercih edilebilir; hangisinin daha uygun olduğunu videonun amacına göre birlikte belirleriz.",
        },
        {
          q: "Emlak için drone çekimi neleri kapsıyor?",
          a: "Satılık ya da kiralık bir arsanın, evin, sitenin veya projenin havadan video ve fotoğrafları; çevresinin, yol bağlantılarının ve konumunun görünür olduğu açılar. Görüntüler ilan sitelerinde, sosyal medyada ve sunumlarda kullanılabilecek şekilde teslim edilir.",
        },
        {
          q: "Drone her yerde uçurulabilir mi?",
          a: "Hayır. Türkiye'de drone uçuşları Sivil Havacılık Genel Müdürlüğü (SHGM) kurallarına tabidir; havalimanı çevresi ve bazı yasak veya kısıtlı bölgelerde uçuş yapılamaz ya da ek izin gerekir. Her çekimden önce bölgenin uçuş durumunu kontrol eder, çekimi buna göre planlarız.",
        },
        {
          q: "Çekimleri hangi şehirlerde yapıyorsunuz?",
          a: "Merkezimiz Ankara'dır ve Ankara içi çekimleri hızlıca planlayabiliyoruz. Diğer şehirlerdeki çekimler için tarih ve ulaşım planını önceden yapıyoruz.",
        },
        {
          q: "Teslim edilen videolar kime ait?",
          a: "Teslim edilen videoları web sitenizde, sosyal medyanızda ve reklamlarınızda kullanabilirsiniz. Kullanım kapsamını (örneğin manken görüntülerinin kullanım süresi) çekim öncesi anlaşmada yazılı olarak netleştiriyoruz.",
        },
        {"q": "Reklam için kaç farklı video gerekir?", "a": "Tek bir doğru sayı yok, ama tek video çoğu zaman yetmez. Aynı ürünü farklı açılardan (fiyat, konfor, malzeme, kullanım senaryosu, müşteri yorumu) anlatan birkaç kısa video test edip hangisinin daha iyi çalıştığını görmek, tek bir pahalı filme bütün bütçeyi yatırmaktan genellikle daha verimlidir."},
      ]}
    />
  );
}
