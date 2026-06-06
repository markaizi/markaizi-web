import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export const metadata: Metadata = {
  title: "Tekil Hizmet Fiyatları — markaizi",
  description: "Aylık paket yerine tek seferlik tasarım, video çekimi, baskı, logo, web ve reklam fiyatları. Kartvizit, tabela, broşür, Reels ve daha fazlası.",
  alternates: { canonical: "https://markaizi.com.tr/fiyatlar" },
};

const CATEGORIES = [
  {
    emoji: "🎨",
    title: "Grafik & Tasarım",
    color: "#c084fc",
    colorBg: "rgba(168,85,247,0.08)",
    colorBorder: "rgba(168,85,247,0.2)",
    items: [
      { name: "Logo Tasarımı", price: null, note: "Teklif alın" },
      { name: "Kartvizit Tasarımı", price: null, note: "Teklif alın" },
      { name: "Sosyal Medya Post Tasarımı (Tekli)", price: null, note: "Teklif alın" },
      { name: "Broşür Tasarımı (2 Yüz)", price: null, note: "Teklif alın" },
      { name: "Katalog Tasarımı", price: null, note: "Teklif alın" },
      { name: "Billboard / Tabela Tasarımı", price: null, note: "Teklif alın" },
      { name: "Menü Tasarımı", price: null, note: "Teklif alın" },
      { name: "Davetiye / Etkinlik Görseli", price: null, note: "Teklif alın" },
      { name: "Roll-Up / Bez Afiş Tasarımı", price: null, note: "Teklif alın" },
      { name: "Marka Kimliği Paketi", price: null, note: "Teklif alın" },
    ],
  },
  {
    emoji: "🎬",
    title: "Video & Fotoğraf Çekimi",
    color: "#f472b6",
    colorBg: "rgba(244,114,182,0.08)",
    colorBorder: "rgba(244,114,182,0.2)",
    items: [
      { name: "Tekli Reels / Kısa Video Çekimi", price: null, note: "Teklif alın" },
      { name: "Ürün Tanıtım Videosu", price: null, note: "Teklif alın" },
      { name: "Kurumsal Tanıtım Filmi", price: null, note: "Teklif alın" },
      { name: "Ürün Fotoğraf Çekimi (10 Kare)", price: null, note: "Teklif alın" },
      { name: "Mekân / Vitrin Fotoğraf Çekimi", price: null, note: "Teklif alın" },
      { name: "Model & Lookbook Çekimi", price: null, note: "Teklif alın" },
      { name: "Drone Çekimi", price: null, note: "Teklif alın" },
    ],
  },
  {
    emoji: "🖨️",
    title: "Baskılı Materyaller",
    color: "#34d399",
    colorBg: "rgba(52,211,153,0.08)",
    colorBorder: "rgba(52,211,153,0.2)",
    items: [
      { name: "Kartvizit Baskısı (250 Adet)", price: null, note: "Teklif alın" },
      { name: "Broşür Baskısı (500 Adet)", price: null, note: "Teklif alın" },
      { name: "Kağıt Poşet Baskısı", price: null, note: "Teklif alın" },
      { name: "Bez Çanta Baskısı", price: null, note: "Teklif alın" },
      { name: "Roll-Up Stand Baskısı", price: null, note: "Teklif alın" },
      { name: "Tabela / Totem Baskısı", price: null, note: "Teklif alın" },
      { name: "Stiker / Etiket Baskısı", price: null, note: "Teklif alın" },
    ],
  },
  {
    emoji: "💻",
    title: "Web & Dijital",
    color: "#60a5fa",
    colorBg: "rgba(96,165,250,0.08)",
    colorBorder: "rgba(96,165,250,0.2)",
    items: [
      { name: "Tek Sayfalık Web Sitesi (Landing Page)", price: null, note: "Teklif alın" },
      { name: "Kurumsal Web Sitesi (5 Sayfa)", price: null, note: "Teklif alın" },
      { name: "E-Ticaret Sitesi", price: null, note: "Teklif alın" },
      { name: "Domain & Hosting Kurulumu", price: null, note: "Teklif alın" },
      { name: "Web Sitesi Bakım & Güncelleme", price: null, note: "Teklif alın" },
      { name: "Google İşletme Profili Kurulumu", price: null, note: "Teklif alın" },
    ],
  },
  {
    emoji: "📣",
    title: "Tekil Reklam Hizmetleri",
    color: "#fbbf24",
    colorBg: "rgba(251,191,36,0.08)",
    colorBorder: "rgba(251,191,36,0.2)",
    items: [
      { name: "Meta Reklam Hesabı Kurulumu (Tek Seferlik)", price: null, note: "Teklif alın" },
      { name: "Google Ads Hesabı Kurulumu (Tek Seferlik)", price: null, note: "Teklif alın" },
      { name: "Tek Kampanya Kurulumu & Optimizasyonu", price: null, note: "Teklif alın" },
      { name: "Reklam Kreatif Tasarımı (Görsel + Metin)", price: null, note: "Teklif alın" },
      { name: "Hedef Kitle Analizi & Strateji Raporu", price: null, note: "Teklif alın" },
    ],
  },
];

export default function FiyatlarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "var(--bg)" }}>

        {/* Hero */}
        <section className="pt-32 pb-16 px-6" style={{
          background: "var(--bg-alt)",
          borderBottom: "1px solid var(--border)",
        }}>
          <div className="max-w-[760px] mx-auto text-center">
            <span
              className="inline-block text-[12px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              Tekil & Baskılı İşler
            </span>
            <h1 className="font-black text-white mb-5" style={{ fontSize: "clamp(28px,4.5vw,48px)", lineHeight: 1.15 }}>
              Aylık paket değil,{" "}
              <span className="gradient-text">tek iş</span> mi yaptırmak istiyorsunuz?
            </h1>
            <p className="text-[#8a8a9a] text-[17px] leading-relaxed max-w-[560px] mx-auto">
              Kartvizit, tabela, logo, video çekimi, baskılı materyaller ve tek seferlik dijital hizmetler için fiyat listesi. Her iş için teklif alabilirsiniz — en kısa sürede dönüş yapıyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <a
                href="https://wa.me/905520772700"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-7 py-3.5 text-[14px] font-bold"
              >
                WhatsApp ile Teklif Al
              </a>
              <Link
                href="#iletisim-cta"
                className="btn btn-outline px-7 py-3.5 text-[14px] font-bold"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </section>

        {/* Not */}
        <div className="max-w-[900px] mx-auto px-6 pt-10">
          <div
            className="rounded-2xl px-6 py-4 flex items-start gap-3 text-[13px] leading-relaxed"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)", color: "#a78bca" }}
          >
            <span className="text-[18px] flex-shrink-0">💡</span>
            <span>
              Aşağıdaki liste henüz düzenlenmektedir. Her iş farklı kapsamda olduğu için fiyatlarımız değişkenlik gösterebilir.{" "}
              <strong className="text-[#c084fc]">WhatsApp</strong> veya iletişim formu üzerinden bize ulaşın, size özel hızlıca fiyat iletiyoruz.
            </span>
          </div>
        </div>

        {/* Kategoriler */}
        <section className="py-14 px-6">
          <div className="max-w-[900px] mx-auto space-y-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.title}>
                {/* Kategori başlığı */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[26px]">{cat.emoji}</span>
                  <h2
                    className="font-black text-[20px]"
                    style={{ color: cat.color }}
                  >
                    {cat.title}
                  </h2>
                  <div className="flex-1 h-px" style={{ background: cat.colorBorder }} />
                </div>

                {/* Satırlar */}
                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${cat.colorBorder}` }}>
                  {cat.items.map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-5 py-3.5 gap-4"
                      style={{
                        background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
                        borderBottom: i < cat.items.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                      }}
                    >
                      <span className="text-[14px] text-white/85">{item.name}</span>
                      <span
                        className="text-[12px] font-bold px-3 py-1 rounded-full flex-shrink-0"
                        style={{ background: cat.colorBg, color: cat.color, border: `1px solid ${cat.colorBorder}` }}
                      >
                        {item.price ?? item.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          id="iletisim-cta"
          className="py-20 px-6"
          style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-[600px] mx-auto text-center">
            <div className="text-[40px] mb-5">✉️</div>
            <h2 className="font-black text-white mb-3" style={{ fontSize: "clamp(22px,3vw,32px)" }}>
              Fiyat Almak İster misiniz?
            </h2>
            <p className="text-[#8a8a9a] text-[15px] mb-8 leading-relaxed">
              Ne yapmak istediğinizi anlatın — iş kapsamına göre size net bir fiyat iletiyoruz. Aylık paket yerine tekil işlerde de kaliteden ödün vermiyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/905520772700"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-8 py-3.5 text-[14px] font-bold"
              >
                WhatsApp ile Yaz
              </a>
              <Link
                href="/#iletisim"
                className="btn btn-outline px-8 py-3.5 text-[14px] font-bold"
              >
                İletişim Formu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
