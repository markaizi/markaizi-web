import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import ReklamButcesiHesaplayici from "@/components/ReklamButcesiHesaplayici";
import { breadcrumbJsonLd, SITE_URL, ORG_NAME } from "@/lib/seo";

const PATH = "/araclar/reklam-butcesi-hesaplayici";
const TITLE = "Reklam Bütçesi Hesaplayıcı — ROAS ve Başabaş Noktası Hesaplama | markaizi";
const DESC =
  "Ücretsiz reklam bütçesi hesaplayıcı: hedef satış, ortalama satış tutarı, kâr marjı ve müşteri adayı maliyetinden aylık Meta ve Google reklam bütçenizi, ROAS'ı ve başabaş ROAS'ı hesaplayın.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords:
    "reklam bütçesi hesaplama, reklam bütçesi hesaplayıcı, roas hesaplama, başabaş roas, instagram reklam bütçesi hesaplama, google ads bütçe hesaplama, reklam maliyeti hesaplama, müşteri edinme maliyeti hesaplama",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "tr_TR", url: `${SITE_URL}${PATH}` },
};

const FAQ: FAQItem[] = [
  {
    q: "ROAS nedir, nasıl hesaplanır?",
    a: "ROAS (reklam harcaması getirisi), reklama harcanan her 1 TL'nin kaç TL ciro getirdiğini gösterir. Formül: ROAS = reklamdan gelen ciro ÷ reklam harcaması. 50.000 TL reklam harcamasıyla 400.000 TL ciro elde ettiyseniz ROAS 8'dir.",
  },
  {
    q: "Başabaş ROAS nedir?",
    a: "Reklamın ne kâr ne zarar ettirdiği ROAS seviyesidir ve brüt kâr marjınıza bağlıdır: başabaş ROAS = 1 ÷ brüt kâr marjı. Marjınız %25 ise başabaş ROAS 4'tür; 4'ün altındaki her ROAS, ürün maliyeti ve reklam düşüldükten sonra zarar demektir. Bu yüzden 'iyi ROAS' herkes için aynı rakam değildir.",
  },
  {
    q: "Müşteri adayı başına maliyetimi bilmiyorum, ne girmeliyim?",
    a: "Daha önce reklam verdiyseniz Meta veya Google panelinizde mesaj, form ya da tıklama başına maliyete bakın. Hiç reklam vermediyseniz bu rakam test bütçesiyle öğrenilir; hesaplayıcıyı farklı maliyetlerle deneyerek hangi aralıkta kârlı kaldığınızı görebilirsiniz.",
  },
  {
    q: "Hesaplayıcı neden mağaza satışını da hesaba katıyor?",
    a: "Mobilya, klinik ve hizmet işletmelerinde satış çoğu zaman sitede değil WhatsApp'ta, telefonda ya da mağazada kapanır. Bu yüzden hesap, reklamın getirdiği müşteri adayından (mesaj, form, arama) ve bu adayların kaçının satın aldığından yola çıkar. Dönüşüm oranını bilmek için gelen mesajların kaçının satışa döndüğünü kaydetmeniz yeterli.",
  },
  {
    q: "Hesaplanan bütçe gerçek sonucu garanti eder mi?",
    a: "Hayır. Hesaplayıcı, girdiğiniz varsayımların matematiksel sonucunu gösterir. Gerçekte bütçe arttıkça müşteri adayı maliyeti değişebilir, kreatif yorulabilir ve dönüşüm oranı oynayabilir. Hesabı bir plan aracı olarak kullanın; gerçek rakamlarınızı ölçtükçe güncelleyin.",
  },
];

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Reklam Bütçesi Hesaplayıcı",
  url: `${SITE_URL}${PATH}`,
  description: DESC,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "tr",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  publisher: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Reklam Bütçesi Hesaplayıcı", path: PATH },
]);

const FORMULAS = [
  { name: "Gereken müşteri adayı", f: "Hedef satış ÷ adaydan satışa dönüşüm oranı" },
  { name: "Aylık reklam bütçesi", f: "Gereken müşteri adayı × aday başına maliyet" },
  { name: "Satış başına reklam maliyeti", f: "Aday başına maliyet ÷ dönüşüm oranı" },
  { name: "ROAS", f: "Beklenen ciro ÷ reklam bütçesi" },
  { name: "Başabaş ROAS", f: "1 ÷ brüt kâr marjı" },
  { name: "Kabul edilebilir en yüksek satış maliyeti", f: "Ortalama satış tutarı × brüt kâr marjı" },
];

export default function ReklamButcesiHesaplayiciPage() {
  return (
    <>
      <JsonLd data={appJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-10" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Reklam Bütçesi Hesaplayıcı" }]} />
            <div className="max-w-[780px] mt-3">
              <span className="section-tag">Ücretsiz Araç</span>
              <h1 className="font-black leading-tight mb-4 mt-2" style={{ fontSize: "clamp(30px,5vw,48px)", letterSpacing: "-1px" }}>
                Reklam Bütçesi <span className="gradient-text">Hesaplayıcı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[17px] leading-relaxed">
                &quot;Ayda kaç lira reklam vermeliyim?&quot; sorusunu tahminle değil, hedefinizden geriye doğru cevaplayın.
                Kaç satış istediğinizi, ortalama satış tutarınızı, kâr marjınızı ve bir müşteri adayının size kaça mal
                olduğunu girin; gereken bütçeyi, ROAS&apos;ı ve reklamın kârlı olup olmadığını anında görün.
              </p>
            </div>
          </div>
        </section>

        {/* ── Araç ── */}
        <section className="pb-16" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
            <ReklamButcesiHesaplayici />
          </div>
        </section>

        {/* ── Formüller ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[860px] mx-auto px-5 sm:px-6">
            <span className="section-tag">Nasıl Hesaplanıyor?</span>
            <h2 className="font-black leading-tight mt-2 mb-5" style={{ fontSize: "clamp(24px,3.5vw,34px)" }}>
              Hesabın Arkasındaki <span className="gradient-text">Formüller</span>
            </h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-6">
              Hesaplayıcı karmaşık bir model kullanmıyor; her işletmenin kâğıt kalemle yapabileceği altı basit hesabı bir
              araya getiriyor. Rakamların nereden geldiğini bilmek, sonucu doğru yorumlamanın ilk şartı.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-left text-[14.5px]">
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    <th className="px-4 py-3 font-semibold text-white">Değer</th>
                    <th className="px-4 py-3 font-semibold text-white">Formül</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMULAS.map((r) => (
                    <tr key={r.name} style={{ borderTop: "1px solid var(--border)" }}>
                      <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-[#c0c0d0]">{r.f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-[20px] text-white mt-10 mb-3">Bir mobilya mağazası örneği</h3>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">
              Ortalama satışı 45.000 TL olan, brüt kâr marjı %30 olan bir mağaza düşünün. Başabaş ROAS 1 ÷ 0,30 = 3,3;
              yani reklamın her 1 TL&apos;si en az 3,3 TL ciro getirmezse mağaza o satıştan zarar eder. Bir satış için
              kabul edilebilecek en yüksek reklam maliyeti ise 45.000 × 0,30 = 13.500 TL.
            </p>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
              Reklamdan gelen bir WhatsApp mesajı 90 TL&apos;ye geliyor ve 100 mesajdan 2&apos;si satışa dönüyorsa, bir
              satışın reklam maliyeti 90 ÷ 0,02 = 4.500 TL olur; sınırın oldukça altında. Ayda 20 satış hedefi için
              1.000 mesaj, yani yaklaşık 90.000 TL bütçe gerekir. Aynı mağaza mesajlara daha hızlı dönüp dönüşümü
              %2&apos;den %3&apos;e çıkarırsa, aynı 20 satış için gereken bütçe 60.000 TL&apos;ye iner. Çoğu zaman bütçeyi
              artırmaktan daha kârlı olan hamle budur.
            </p>
          </div>
        </section>

        {/* ── Yorumlama ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[860px] mx-auto px-5 sm:px-6">
            <span className="section-tag">Sonucu Okumak</span>
            <h2 className="font-black leading-tight mt-2 mb-6" style={{ fontSize: "clamp(24px,3.5vw,34px)" }}>
              Sonuç Kötü Çıktıysa <span className="gradient-text">Önce Neye Bakmalı?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { t: "Dönüşüm oranı", d: "Mesajlara dönüş hızı, fiyatın nasıl sunulduğu ve mağaza ziyaretine davet; reklam bütçesine dokunmadan sonucu en çok değiştiren kalem." },
                { t: "Aday başına maliyet", d: "Kreatif, hedef kitle ve kampanya hedefi. Mesaj hedefli kampanyada ucuz ama satışa dönmeyen mesaj tuzağına dikkat." },
                { t: "Sepet tutarı", d: "Takım satışı, tamamlayıcı ürün, taksit ve teslimat avantajları ortalama satışı yükseltir, başabaş noktasını rahatlatır." },
                { t: "Ölçüm", d: "Rakamlarınız yanlış ölçülüyorsa hesap da yanlıştır. Panel ile gerçekte gelen mesaj ve satış arasında fark varsa önce ölçümü düzeltin." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-[16px] font-bold text-white mb-1.5">{c.t}</h3>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed m-0">{c.d}</p>
                </div>
              ))}
            </div>
            <p className="text-[14.5px] text-[#8a8a9a] leading-relaxed mt-6">
              Daha fazlası için{" "}
              <Link href="/blog/reklam-butcesi-nasil-belirlenir" className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                Reklam Bütçesi Nasıl Belirlenir?
              </Link>{" "}
              ve{" "}
              <Link href="/blog/meta-ads-roas" className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                Meta Ads&apos;de ROAS ve Başabaş Noktası
              </Link>{" "}
              rehberlerine bakın. Mevcut reklam hesabınızın rakamlarını birlikte incelemek isterseniz{" "}
              <Link href="/reklam-hesabi-denetimi" className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                ücretsiz reklam hesabı denetimi
              </Link>{" "}
              isteyebilirsiniz.
            </p>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
