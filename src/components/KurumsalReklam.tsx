import Link from "next/link";

const STATS = [
  { value: "7 Yıl", label: "Alitel Mobilya ile kesintisiz iş birliği" },
  { value: "10 Milyon ₺+", label: "Yönetilen toplam reklam bütçesi" },
  { value: "Her Yıl", label: "İstikbal bayileri arasında Türkiye ciro birinciliği (Alitel)" },
];

const YETENEKLER = [
  { t: "Çok ürün grubu, tek hesap düzeni", d: "Koltuk, yatak odası, yemek odası, genç odası gibi ürün gruplarını kendi müşterisi ve bütçesiyle ayrı kampanyalarda yönetiriz; bütçe hesapta dağılmaz." },
  { t: "Sezona ve kampanya takvimine göre bütçe", d: "Evlilik, taşınma, bayram ve indirim dönemlerinde bütçeyi yoğunlaştırır, durgun dönemde verimsiz harcamayı keseriz." },
  { t: "Google'da niyet, Meta'da talep", d: "Google'da satın almaya yakın aramayı, Meta'da ise henüz aramaya başlamamış hazır alıcıyı yakalarız; iki kanalı aynı ölçüm mantığıyla raporlarız." },
  { t: "Satış verisine bağlı ölçüm", d: "Meta Pixel, Conversions API, Google Etiket Yöneticisi ve GA4 kurulumu; mesaj, arama ve mağazada kapanan satışın reklama bağlanması." },
  { t: "Çok şubeli ve bayi ağı yapısı", d: "Şube ve bayi bazlı konum hedefleme, merkezden yönetilen kreatif ve yerel bütçe dağılımı." },
  { t: "Şeffaf hesap, yönetici raporu", d: "Reklam hesapları ve veriler size aittir, bütçe doğrudan platforma ödenir. Aylık yönetici raporuyla ne harcandığını ve ne geldiğini görürsünüz." },
];

export default function KurumsalReklam({ sektor = "genel" }: { sektor?: "genel" | "mobilya" }) {
  const wa = `https://wa.me/905520772700?text=${encodeURIComponent(
    "Merhaba, firmamız için Meta ve Google reklam yönetimi hakkında görüşmek istiyorum.",
  )}`;
  return (
    <section className="py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <span className="section-tag">Büyük Firmalar İçin</span>
        <h2 className="font-black leading-tight mt-2 mb-5" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
          Büyük Bütçelerde <span className="gradient-text">Meta & Google Reklam Yönetimi</span>
        </h2>
        <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4 max-w-[760px]">
          {sektor === "mobilya"
            ? "Mobilya, tek bir kanalın taşıyamadığı bir sektördür: yüksek sepet, uzun karar süresi, mevsimsel talep ve ürün grubuna göre değişen müşteri. markaizi, bu sektörde Meta ve Google reklamlarını en çok yönettiğimiz alandır; çünkü 7 yıldır bir İstikbal bayisinin reklamını aralıksız yürütüyoruz."
            : "Bütçe büyüdükçe reklam yönetiminde hata maliyeti de büyür. Düzenli ölçüm, ürün ve şube bazlı hesap yapısı ve satış verisine bağlı raporlama; küçük bütçede fark edilmeyen sorunları büyük bütçede görünür kılar. 7 yıllık bir bayi iş birliğinde 10 milyon TL'yi aşan reklam bütçesi yönettik."}
        </p>
        <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-8 max-w-[760px]">
          Bir markanın satışında ürün, hizmet ve satış ekibi belirleyicidir; reklam bu başarıya destek olan
          kanaldır. Biz o kanalı ölçülebilir, sabırlı ve şeffaf biçimde yönetiyoruz.{" "}
          <Link href="/vaka-calismalari/alitel-mobilya" className="text-[#c084fc] underline underline-offset-2">
            Alitel Mobilya vaka çalışmasını okuyun
          </Link>
          .
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl p-5 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-[24px] font-black gradient-text leading-tight mb-1.5">{s.value}</div>
              <div className="text-[12px] text-[#8a8a9a] leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {YETENEKLER.map((y) => (
            <div key={y.t} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="text-[15px] font-bold mb-2 text-white">{y.t}</h3>
              <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{y.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Kurumsal Görüşme Talep Et
          </a>
          <Link href="/reklam-hesabi-denetimi" className="btn btn-outline">
            Ücretsiz Reklam Hesabı Denetimi
          </Link>
          {sektor !== "mobilya" ? null : (
            <Link href="/mobilya-kurumsal-meta-google-reklam-yonetimi" className="btn btn-outline">
              Mobilya Markaları İçin Detay
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
