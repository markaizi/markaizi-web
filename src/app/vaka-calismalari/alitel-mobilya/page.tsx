import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const PATH = "/vaka-calismalari/alitel-mobilya";
const TITLE = "Alitel Mobilya Vaka Çalışması — 7 Yıllık Dijital Reklam Ortaklığı | markaizi";
const DESC =
  "Alitel Mobilya ile 7 yıllık çalışma: her yıl İstikbal bayileri arasında Türkiye ciro birinciliği, 10 milyon TL'nin üzerinde yönetilen reklam bütçesi, Google reklamları ve dijital kanal yönetimi. markaizi mobilya vaka çalışması.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords:
    "alitel mobilya, mobilya reklam vaka çalışması, mobilya google reklamları başarı hikayesi, mobilya reklam ajansı referans, mobilya dijital pazarlama vaka",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESC, type: "article", locale: "tr_TR", url: `${SITE_URL}${PATH}`, publishedTime: "2026-09-26" },
};

const STATS = [
  { value: "7 Yıl", label: "Kesintisiz iş birliği" },
  { value: "Her Yıl", label: "İstikbal bayileri arasında Türkiye ciro birinciliği" },
  { value: "10 Milyon ₺+", label: "Yönetilen toplam reklam bütçesi" },
  { value: "Google Reklamları", label: "Ana performans kanalı" },
];

const FAQ: FAQItem[] = [
  {
    q: "Alitel Mobilya ile ne kadar süredir çalışıyorsunuz?",
    a: "Alitel Mobilya ile 7 yıldır birlikte çalışıyoruz. Bu süre boyunca reklam ve dijital kanal yönetimini aralıksız sürdürdük.",
  },
  {
    q: "Bu vaka çalışmasında hangi sonuçlar öne çıkıyor?",
    a: "Alitel Mobilya'nın her yıl İstikbal bayileri arasında Türkiye ciro birinciliği elde etmesi ve iş birliği boyunca 10 milyon TL'nin üzerinde reklam bütçesinin yönetilmesi. Reklam, Alitel'in satış başarısının tek nedeni değildir; firmanın ürünü, hizmeti ve satış ekibi sonucun ana unsurlarıdır. Dijital reklam bu başarıya destek olan kanaldır.",
  },
  {
    q: "Aynı sonuçlar benim mağazam için de garanti mi?",
    a: "Hayır. Her işletmenin ürünü, bölgesi, rekabeti ve bütçesi farklıdır; hiçbir ajans belirli bir sonucu garanti edemez. Bu çalışma, uzun soluklu, ölçüm odaklı ve düzenli yönetilen bir dijital reklam ortaklığının neler getirebileceğine bir örnektir.",
  },
  {
    q: "Mobilya mağazam için benzer bir çalışma yapabilir misiniz?",
    a: "Evet. İlk adım mağazanızı, mevcut reklamlarınızı ve bölgenizdeki rekabeti inceleyen ücretsiz bir analiz. Ardından size özel bir yol haritası ve teklif hazırlıyoruz.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Alitel Mobilya Vaka Çalışması: 7 Yıllık Dijital Reklam Ortaklığı",
  description: DESC,
  inLanguage: "tr",
  url: `${SITE_URL}${PATH}`,
  mainEntityOfPage: `${SITE_URL}${PATH}`,
  datePublished: "2026-09-26",
  dateModified: "2026-09-26",
  author: { "@type": "Organization", name: "markaizi Dijital Reklam Ajansı", url: SITE_URL },
  publisher: { "@type": "Organization", name: "markaizi", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` } },
  about: { "@type": "Organization", name: "Alitel Mobilya" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Mobilya Reklam Ajansı", path: "/mobilya-reklam-ajansi" },
  { name: "Alitel Mobilya Vaka Çalışması", path: PATH },
]);

const SECTIONS: { h2: string; paragraphs: string[]; bullets?: string[] }[] = [
  {
    h2: "Kısaca Ne Oldu?",
    paragraphs: [
      "Alitel Mobilya ile 7 yıldır birlikte çalışıyoruz. Bu sürede Alitel Mobilya her yıl İstikbal bayileri arasında Türkiye ciro birinciliğine ulaştı; bugün Türkiye'nin en büyük ve en hızlı büyüyen İstikbal bayilerinden biri olarak anılıyor ve iş birliği boyunca 10 milyon TL'nin üzerinde reklam bütçesi yönettik. Bu rakamların arkasında tek bir sihirli hamle yok; yıllara yayılan düzenli ölçüm, sezona göre planlama ve bütçenin sürekli verimli alanlara kaydırılması var.",
      "Bu sayfa, mobilya sektöründe uzun soluklu bir dijital reklam ortaklığının nasıl yürüdüğünü anlatıyor. Alitel'in başarısında firmanın kendi ürünü, hizmeti ve satış ekibi ana unsurlardır; biz bu başarıya dijital kanallardan destek olan taraf olduk.",
    ],
  },
  {
    h2: "Ne Yaptık?",
    paragraphs: [
      "Çalışmanın merkezinde Google reklamları yer aldı: mobilya arayan ve satın almaya yakın müşteriyi yakalayan arama ve harita kampanyaları. Bunun yanına ihtiyaca göre diğer dijital kanalların yönetimini ekledik ve tüm kanalları tek bir ölçüm mantığı altında topladık.",
    ],
    bullets: [
      "Google reklamlarının ürün grubuna ve arama niyetine göre yönetimi",
      "Sosyal medya ve Meta reklamlarının yönetimi ve içerik desteği",
      "Alakasız aramaların ve boşa giden harcamanın sürekli temizlenmesi",
      "Aylık raporlama ve bütçenin çalışan kampanyalara kaydırılması",
    ],
  },
  {
    h2: "Yedi Yıl Boyunca Değişmeyen İlkeler",
    paragraphs: [
      "Yedi yılda algoritmalar, platformlar ve müşteri alışkanlıkları değişti; çalışma ilkelerimiz değişmedi. Bunlar, bugün her mobilya işletmesine önerdiğimiz ilkelerle aynı.",
    ],
    bullets: [
      "Ürün grubuna göre ayrı kampanya: her ürünün müşterisi ve bütçesi farklıdır",
      "Sezona göre bütçe: evlilik, taşınma ve kampanya dönemlerinde bütçe yoğunlaşır",
      "Beğeniyi değil sonucu ölçmek: mesaj, arama ve mağaza ziyareti",
      "Sabır: reklamın öğrenme süresine saygı, günlük değil haftalık değerlendirme",
      "Şeffaflık: bütçe müşterinin hesabından harcanır ve her harcama görünür",
    ],
  },
  {
    h2: "Bu Çalışmadan Ne Çıkarmalı?",
    paragraphs: [
      "Uzun süreli bir dijital reklam ortaklığının değeri, ilk aydaki parlak sonuçtan değil, yıllar boyunca biriken veriden ve tutarlılıktan gelir. Aynı ekibin yıllarca aynı işletmeyi yönetmesi, hangi ürünün hangi ayda sattığını, hangi mesajın çalıştığını ve hangi bütçenin boşa gittiğini bilen bir hafıza oluşturur.",
      "Her işletme farklıdır ve bu sonuç başka bir mağaza için garanti değildir. Ama düzenli, ölçüm odaklı ve sabırlı bir yaklaşımın mobilya sektöründe ne kadar ileri gidebileceğini gösteren gerçek bir örnektir.",
    ],
  },
];

export default function AlitelVakaPage() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-14" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[780px]">
              <Breadcrumb
                items={[
                  { name: "Ana Sayfa", path: "/" },
                  { name: "Mobilya Reklam Ajansı", path: "/mobilya-reklam-ajansi" },
                  { name: "Alitel Mobilya Vaka Çalışması" },
                ]}
              />
              <span className="section-tag">Vaka Çalışması</span>
              <h1 className="font-black leading-tight mb-5 mt-2" style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}>
                Alitel Mobilya: <span className="gradient-text">7 Yıllık Dijital Reklam Ortaklığı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed">
                Türkiye'nin en büyük ve en hızlı büyüyen İstikbal bayilerinden Alitel Mobilya ile yedi yıldır aralıksız çalışıyoruz. Gerçek bir iş birliğinin özeti.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl p-5 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-[22px] md:text-[26px] font-black gradient-text leading-tight mb-1.5">{s.value}</div>
                <div className="text-[12px] text-[#8a8a9a] leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {SECTIONS.map((s, i) => (
          <section key={s.h2} className="py-14" style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--bg-alt)" }}>
            <div className="max-w-[760px] mx-auto px-6">
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(22px,3vw,30px)" }}>{s.h2}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">{p}</p>
              ))}
              {s.bullets && (
                <ul className="mt-2 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] text-[#c0c0d0] leading-relaxed">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--grad)" }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <section className="py-16" style={{ background: "var(--bg)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        <section className="py-12" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <h2 className="font-black text-[22px] mb-5">İlgili <span className="gradient-text">Sayfalar</span></h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {[
                { href: "/mobilya-reklam-ajansi", label: "Mobilya Reklam Ajansı" },
                { href: "/mobilya-google-reklamlari", label: "Mobilya Google Reklamları" },
                { href: "/mobilya-sosyal-medya-yonetimi", label: "Mobilya Sosyal Medya Yönetimi" },
              ].map((r) => (
                <Link key={r.href} href={r.href} className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[30px] mb-4">Mağazanız İçin <span className="gradient-text">Ücretsiz Analiz</span></h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Mevcut hesabınızı ve reklamlarınızı inceleyip size özel yol haritasını 24 saat içinde paylaşalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20Alitel%20vaka%20%C3%A7al%C4%B1%C5%9Fmas%C4%B1n%C4%B1%20okudum%2C%20mobilya%20ma%C4%9Fazam%20i%C3%A7in%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp&apos;tan Yaz
              </a>
              <Link href="/#iletisim" className="btn btn-outline">İletişim Formu</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
