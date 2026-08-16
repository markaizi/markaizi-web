import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import UcretsizAnalizForm from "@/components/sections/UcretsizAnalizForm";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ücretsiz Sosyal Medya & Dijital Varlık Analizi | markaizi",
  description:
    "İşletmenizin Instagram, Google ve web varlığını ücretsiz inceleyelim. 24-48 saat içinde size özel yol haritasını paylaşalım — satın alma zorunluluğu yok.",
  keywords:
    "ücretsiz sosyal medya analizi, ücretsiz dijital analiz, instagram hesap analizi, ücretsiz reklam denetimi, ankara dijital ajans ücretsiz analiz",
  alternates: { canonical: "https://markaizi.com.tr/ucretsiz-analiz" },
  openGraph: {
    title: "Ücretsiz Sosyal Medya & Dijital Varlık Analizi | markaizi",
    description:
      "Instagram hesabınızı ve dijital varlığınızı ücretsiz inceleyip 24-48 saat içinde size özel yol haritası sunuyoruz.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr/ucretsiz-analiz",
  },
};

const FAQ: FAQItem[] = [
  {
    q: "Bu analiz gerçekten ücretsiz mi?",
    a: "Evet, tamamen ücretsiz. Instagram hesabınızı, Google/harita görünürlüğünüzü ve varsa web sitenizi inceleyip size 24-48 saat içinde yazılı bir değerlendirme sunuyoruz. Bu sırada hiçbir ödeme istenmez ve devamında bizimle çalışmak zorunda değilsiniz.",
  },
  {
    q: "Formu doldurunca hemen satış araması mı geleceğiz?",
    a: "Hayır. Önce analizi hazırlıyoruz, sonra WhatsApp veya telefon üzerinden bulgularımızı paylaşıyoruz. İsterseniz sadece analiz raporunu alıp orada bırakabilirsiniz — baskı yapmıyoruz.",
  },
  {
    q: "Hangi bilgileri paylaşmam gerekiyor?",
    a: "Sadece adınız, telefon numaranız ve Instagram kullanıcı adınız veya web sitenizin adresi yeterli. Hesabınıza giriş bilgisi, şifre gibi hiçbir hassas veri istemiyoruz — herkese açık profilinizi inceliyoruz.",
  },
  {
    q: "Analizde neye bakıyorsunuz?",
    a: "İçerik ve etkileşim düzeyinizi, profil/bio optimizasyonunu, rakiplerinize kıyasla konumunuzu, Google Haritalar görünürlüğünüzü ve varsa web sitenizin mobil hız/kullanılabilirliğini kontrol ediyoruz. Sonunda somut, uygulanabilir 3-5 öneri ile size dönüyoruz.",
  },
  {
    q: "Zaten bir ajansla çalışıyorum, yine de analiz alabilir miyim?",
    a: "Evet. Bağımsız bir ikinci göz olarak bakıp mevcut çalışmanızın nerede güçlü nerede zayıf olduğunu tarafsızca paylaşırız — karar tamamen size ait.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Ücretsiz Analiz", path: "/ucretsiz-analiz" },
]);

const NELERE_BAKIYORUZ = [
  { icon: "📱", title: "Instagram & Facebook Hesabı", desc: "İçerik kalitesi, paylaşım düzeni, etkileşim oranı ve profil optimizasyonu." },
  { icon: "🔍", title: "Google & Harita Görünürlüğü", desc: "\"Yakınımdaki [sektörünüz]\" aramalarında ne kadar görünür olduğunuz." },
  { icon: "🌐", title: "Web Sitesi (varsa)", desc: "Mobil hız, kullanılabilirlik ve ziyaretçiyi müşteriye çevirme kapasitesi." },
  { icon: "🎯", title: "Rakip Karşılaştırması", desc: "Sektörünüzdeki benzer işletmelere göre nerede durduğunuz." },
];

export default function UcretsizAnalizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        {/* ── Hero + Form ── */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Ücretsiz Analiz" }]} />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-14 items-start mt-3">
              <div>
                <span className="section-tag">100% Ücretsiz · Yükümlülük Yok</span>
                <h1
                  className="font-black leading-tight mb-4 mt-2"
                  style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}
                >
                  Sosyal Medyanız <span className="gradient-text">Ne Durumda?</span> Ücretsiz Öğrenin
                </h1>
                <p className="text-[#8a8a9a] text-[17px] leading-relaxed mb-6">
                  Instagram hesabınızı, Google görünürlüğünüzü ve web sitenizi ücretsiz inceleyip 24-48 saat
                  içinde size özel, somut bir yol haritası sunuyoruz. Satın alma zorunluluğu yok — analizi
                  alın, kararı siz verin.
                </p>
                <div className="hidden lg:flex flex-col gap-3 mt-8">
                  {NELERE_BAKIYORUZ.map((n) => (
                    <div key={n.title} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{n.icon}</span>
                      <div>
                        <p className="text-[14px] font-bold text-white">{n.title}</p>
                        <p className="text-[13px] text-[#8a8a9a]">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form — mobilde hemen görünür, masaüstünde sağda sabit */}
              <div>
                <UcretsizAnalizForm />
              </div>
            </div>

            {/* Mobilde: neye bakıyoruz listesi formdan sonra */}
            <div className="grid grid-cols-2 gap-4 mt-10 lg:hidden">
              {NELERE_BAKIYORUZ.map((n) => (
                <div key={n.title} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <span className="text-xl block mb-1.5">{n.icon}</span>
                  <p className="text-[13px] font-bold text-white leading-snug">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Güven Bandı ── */}
        <section className="py-12" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { value: "200+", label: "Ankara işletmesi" },
                { value: "10+", label: "Yıl sektör deneyimi" },
                { value: "24-48s", label: "Analiz teslim süresi" },
                { value: "₺0", label: "Analiz ücreti" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-[26px] sm:text-[30px] font-black gradient-text leading-none mb-1">{s.value}</div>
                  <div className="text-[12px] sm:text-[13px] text-[#8a8a9a] leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Nasıl Çalışıyor ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-12">
              <span className="section-tag">Nasıl Çalışıyor?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
                3 Adımda <span className="gradient-text">Ücretsiz Analiziniz</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { step: "01", title: "Formu Doldurun", desc: "1 dakikanızı alır. Sadece iletişim bilginiz ve Instagram/web adresiniz yeterli." },
                { step: "02", title: "Biz İnceleriz", desc: "24-48 saat içinde hesabınızı ve dijital varlığınızı detaylıca gözden geçiririz." },
                { step: "03", title: "Sonucu Paylaşırız", desc: "WhatsApp veya telefonla bulgularımızı ve önerilerimizi anlatırız — karar sizin." },
              ].map((p) => (
                <div key={p.step} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-black gradient-text mb-3">{p.step}</div>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{p.title}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        {/* ── Alt CTA ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[560px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="font-black text-[26px] sm:text-[30px] mb-3">
              Hemen Şimdi <span className="gradient-text">Ücretsiz Öğrenin</span>
            </h2>
            <p className="text-[#8a8a9a] mb-7 leading-relaxed">
              Formu doldurmak 1 dakikanızı alır, yükümlülük getirmez.
            </p>
            <a
              href="https://wa.me/905520772700?text=Merhaba%2C%20%C3%BCcretsiz%20sosyal%20medya%20analizi%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
            >
              WhatsApp&apos;tan Hemen Yaz
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
