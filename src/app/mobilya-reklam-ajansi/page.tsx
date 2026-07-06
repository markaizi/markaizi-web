import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";

export const metadata: Metadata = {
  title: "Mobilya Reklam Ajansı — Siteler / Ankara | markaizi",
  description:
    "Siteler merkezli mobilya reklam ajansı. İstikbal, Doğtaş, Kelebek bayileri dahil 200+ mobilya mağazasına Instagram & Google reklamları, sosyal medya yönetimi ve showroom çekimi. Mobilya sektörünü tanıyan ajans.",
  keywords:
    "mobilya reklam ajansı, siteler reklam ajansı, mobilya reklamı, mobilya sosyal medya yönetimi, mobilya instagram reklamı, ankara mobilya reklam, siteler mobilya tanıtım, mobilya mağazası reklam, mobilya google reklamları, mobilya dijital pazarlama",
  alternates: { canonical: "https://markaizi.com.tr/mobilya-reklam-ajansi" },
  openGraph: {
    title: "Mobilya Reklam Ajansı — Siteler / Ankara | markaizi",
    description:
      "Mobilya sektörünü tanıyan reklam ajansı. Siteler'deki mağazanızdan Türkiye'nin her yerine: Instagram & Google reklamları, sosyal medya yönetimi, showroom çekimi.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr/mobilya-reklam-ajansi",
  },
};

const FAQ: FAQItem[] = [
  {
    q: "Mobilya mağazam için hangi reklam kanalı daha iyi: Instagram mı Google mı?",
    a: "İkisi farklı işi görür. Instagram ve Facebook reklamları, koltuk takımı veya yatak odası değişimini düşünen ama henüz aramaya başlamamış kişiye ilham verir; görselle satış yapan mobilyada en güçlü kanaldır. Google reklamları ise 'siteler koltuk takımı' veya 'ankara yatak odası fiyatları' diye aktif arayan, satın almaya en yakın müşteriyi yakalar. Bütçenize göre ikisini dengeli kurgular, hangi kanalın size daha ucuza müşteri getirdiğini raporlarla gösteririz.",
  },
  {
    q: "Siteler'deki mağazama Ankara dışından müşteri getirebilir misiniz?",
    a: "Evet — Siteler zaten Türkiye'nin her yerinden alıcı çeken bir merkez. Reklam hedeflemesini yalnızca Ankara ile sınırlamıyoruz; ürününüze ve kargo/montaj kapasitenize göre çevre illeri veya tüm Türkiye'yi hedefleyebiliyoruz. WhatsApp hattınıza gelen il dışı taleplerini de ölçümleyerek hangi bölgeye reklam vermenin kârlı olduğunu veriyle belirliyoruz.",
  },
  {
    q: "Ürün çekimlerini siz mi yapıyorsunuz?",
    a: "Evet. Showroom'unuza gelip koltuk takımı, yatak odası, yemek odası gibi ürünlerinizin fotoğraf ve Reels çekimlerini yapıyoruz. Mobilyada satışı belirleyen şey görsel kalitesidir; telefonla çekilmiş loş showroom fotoğrafı ile profesyonel çekim arasındaki fark, reklam maliyetinize doğrudan yansır.",
  },
  {
    q: "Reklam bütçesi olarak ne kadar ayırmalıyım?",
    a: "Mobilya sektöründe sağlıklı sonuç için genellikle aylık reklam bütçesi ile başlanır, ilk 4-6 haftada hangi ürün grubunun ve hedef kitlenin daha verimli olduğu test edilir. Bütçe tamamen size aittir ve doğrudan Meta/Google'a ödenir — biz yönetim hizmeti veririz, bütçenizden komisyon almayız. Mağazanızın ölçeğine göre öneriyi ücretsiz görüşmede netleştiririz.",
  },
  {
    q: "Sonuçları nasıl takip edeceğim?",
    a: "Size özel müşteri panelimizden kampanyalarınızı, planlanan içerikleri ve raporları görebilirsiniz. Ayrıca her ay kaç kişiye ulaştığınızı, kaç mesaj/arama geldiğini ve müşteri başına maliyeti gösteren sade bir rapor sunarız. 'Reklam veriyorum ama ne işe yarıyor bilmiyorum' dönemi biter.",
  },
  {
    q: "Neden mobilya sektörünü bilen bir ajansla çalışmalıyım?",
    a: "Mobilya alışverişi yüksek tutarlı ve uzun karar sürelidir; müşteri önce Instagram'da beğenir, sonra fiyat araştırır, en son showroom'a gelir. Bu yolculuğu bilmeyen bir ajans yanlış yere bütçe harcar. Biz 10 yılı aşkın süredir Siteler esnafıyla çalışıyoruz — İstikbal ve Doğtaş bayilerinden yerel üreticilere kadar. Hangi ürünün hangi ay sattığını, kampanya dönemlerini ve mobilya müşterisinin nasıl düşündüğünü biliyoruz.",
  },
];

const SERVICES = [
  {
    icon: "📱",
    title: "Mobilya Sosyal Medya Yönetimi",
    desc: "Instagram ve Facebook hesaplarınız için showroom çekimi, ürün odaklı içerik takvimi ve düzenli paylaşım. Takipçiyi mağaza ziyaretçisine çeviren içerik stratejisi.",
  },
  {
    icon: "🎯",
    title: "Instagram & Facebook Reklamları",
    desc: "Koltuk takımından yatak odasına, ürün bazlı hedefli kampanyalar. Evlilik hazırlığı yapanlar, taşınanlar ve dekorasyon meraklıları gibi hazır alıcı kitlelere ulaşın.",
  },
  {
    icon: "🔍",
    title: "Google Reklamları",
    desc: "\"Siteler mobilya\", \"Ankara koltuk takımı\" gibi aramalar yapan, satın almaya hazır müşteriyi mağazanıza yönlendiriyoruz. Arama, görüntülü ağ ve harita reklamları.",
  },
  {
    icon: "🎬",
    title: "Showroom & Ürün Çekimi",
    desc: "Mağazanıza gelip profesyonel fotoğraf ve Reels videoları çekiyoruz. Mobilyada satışı yapan şey görseldir — ürünleriniz hak ettiği gibi görünsün.",
  },
  {
    icon: "📍",
    title: "Google Haritalar & Yerel SEO",
    desc: "\"Yakınımdaki mobilya mağazası\" aramalarında öne çıkın. İşletme profili optimizasyonu, yorum yönetimi ve yerel arama görünürlüğü.",
  },
  {
    icon: "🌐",
    title: "Mobilya Web Sitesi",
    desc: "Ürün kataloglu, WhatsApp entegreli, mobilde hızlı açılan web siteleri. Reklamdan gelen müşteriyi karşılayan modern vitrininiz.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mobilya Reklam Ajansı Hizmetleri",
  serviceType: "Mobilya sektörü dijital pazarlama ve reklam yönetimi",
  provider: {
    "@type": "ProfessionalService",
    name: "markaizi Dijital Reklam Ajansı",
    url: "https://markaizi.com.tr",
    telephone: "+90-552-077-27-00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zübeyde Hanım Mahallesi Elif Sokak No:7/106 2. Kat, Sütçü Kemal İş Merkezi",
      addressLocality: "Ankara",
      addressRegion: "Ankara",
      postalCode: "06110",
      addressCountry: "TR",
    },
  },
  areaServed: [
    { "@type": "Neighborhood", name: "Siteler" },
    { "@type": "City", name: "Ankara" },
    { "@type": "Country", name: "Türkiye" },
  ],
  audience: { "@type": "Audience", audienceType: "Mobilya mağazaları, mobilya üreticileri ve bayileri" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function MobilyaReklamAjansiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-32 pb-20" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)", filter: "blur(80px)" }}
          />

          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[780px]">
              <span className="section-tag">Siteler / Ankara</span>
              <h1
                className="font-black leading-tight mb-5 mt-2"
                style={{ fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1px" }}
              >
                Mobilya <span className="gradient-text">Reklam Ajansı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-4">
                Siteler&apos;deki mağazanızdan Türkiye&apos;nin her yerine. İstikbal ve Doğtaş bayilerinden
                yerel üreticilere, 10 yılı aşkın süredir mobilya sektörüne reklam yapıyoruz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Mobilya müşterisi nasıl düşünür, hangi ay ne satar, koltuk takımı reklamı ile yatak odası
                reklamı neden aynı kurgulanmaz — biliyoruz. Çünkü yıllardır bu sektörün içindeyiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/905520772700?text=Merhaba%2C%20mobilya%20ma%C4%9Fazam%20i%C3%A7in%20reklam%20hizmeti%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Ücretsiz Teklif Al
                </a>
                <Link href="/#portfolio" className="btn btn-outline">
                  Çalıştığımız Markalar
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Güven Bandı ── */}
        <section className="py-14" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-widest mb-8">
              Güvenen mobilya markalarından bazıları
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {["İstikbal Alitel", "İstikbal Ahenk", "Doğtaş Mobilya", "Kelebek Mobilya", "Sarsılmaz Mobilya", "Özçalık Dizayn"].map((m) => (
                <span key={m} className="text-[17px] font-black text-white/30">{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Neden Sektör Uzmanı ── */}
        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="section-tag">Neden markaizi?</span>
              <h2 className="font-black leading-tight mb-5 mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Mobilya Reklamı, <span className="gradient-text">Genel Reklamdan Farklıdır</span>
              </h2>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Bir koltuk takımı, bir tişört gibi anlık kararla satın alınmaz. Müşteri haftalarca araştırır;
                Instagram&apos;da beğenir, Google&apos;da fiyat karşılaştırır, eşiyle konuşur ve en sonunda
                showroom&apos;a gelir. Bu yolculuğun her adımında markanızın karşısına çıkması gerekir.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Reklamcılığa Siteler&apos;de matbaa, katalog ve insert işleriyle başladık. Bugün aynı esnafın
                Instagram reklamlarını, Google kampanyalarını ve sosyal medya hesaplarını yönetiyoruz.
                Sektörü dışarıdan öğrenen bir ajans değil, içinden gelen bir ekibiz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
                Evlilik sezonunun reklam planını nasıl değiştirdiğini, yatak odası ile genç odası müşterisinin
                farklı hedeflendiğini, showroom fotoğrafının satışa etkisini biliyoruz — ve bütçenizi buna göre yönetiyoruz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "Ankara işletmesi ile çalıştık" },
                { value: "10+", label: "Yıl Siteler'de sektör deneyimi" },
                { value: "3.2×", label: "Ortalama ROAS (Meta kampanyaları)" },
                { value: "-%38", label: "Reklam maliyetinde ortalama düşüş" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[34px] font-black gradient-text leading-none mb-2">{s.value}</div>
                  <div className="text-[13px] text-[#8a8a9a] leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hizmetler ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Hizmetler</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Mobilya Mağazanız İçin <span className="gradient-text">Neler Yapıyoruz?</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="service-card rounded-2xl p-8"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="text-[17px] font-bold mb-3 text-white">{s.title}</h3>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Süreç ── */}
        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Nasıl Çalışıyoruz?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Mağazanızdan <span className="gradient-text">Satışa Giden Yol</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Tanışma & Analiz", desc: "Mağazanızı ziyaret ediyor, ürün gruplarınızı, rakiplerinizi ve mevcut dijital durumunuzu inceliyoruz." },
                { step: "02", title: "Strateji & Çekim", desc: "Hangi ürünler, hangi kitleye, hangi kanaldan? Planı çıkarıp showroom çekimlerini yapıyoruz." },
                { step: "03", title: "Reklam & İçerik", desc: "Kampanyalar yayına giriyor, sosyal medya hesaplarınız düzenli ve profesyonel içerikle besleniyor." },
                { step: "04", title: "Rapor & Optimizasyon", desc: "Gelen mesaj, arama ve mağaza ziyaretini ölçüyor; bütçeyi en verimli ürün ve kitleye kaydırıyoruz." },
              ].map((p) => (
                <div key={p.step} className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-black gradient-text mb-3">{p.step}</div>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{p.title}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        {/* ── Blog Yönlendirme ── */}
        <section className="py-16" style={{ background: "var(--bg)" }}>
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <h2 className="font-black text-[24px] mb-3">
              Mobilya Pazarlaması Hakkında <span className="gradient-text">Daha Fazlası</span>
            </h2>
            <p className="text-[#8a8a9a] text-[15px] mb-6">
              Mobilya mağazaları için hazırladığımız rehberlere göz atın:
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <Link href="/blog/mobilya-reklami-nasil-verilir" className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                Mobilya Reklamı Nasıl Verilir? →
              </Link>
              <Link href="/blog/mobilya-magazalari-icin-instagram" className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                Instagram&apos;da Mobilya Satışı →
              </Link>
              <Link href="/blog/sitelerde-musteri-cekmenin-yollari" className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                Siteler&apos;de Müşteri Çekmek →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[32px] mb-4">
              Mağazanız İçin <span className="gradient-text">Ücretsiz Analiz</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Mevcut Instagram hesabınızı ve reklam geçmişinizi inceleyip, mobilya mağazanıza özel
              yol haritasını 24 saat içinde önünüze koyalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20mobilya%20ma%C4%9Fazam%20i%C3%A7in%20%C3%BCcretsiz%20analiz%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp&apos;tan Yaz
              </a>
              <Link href="/#iletisim" className="btn btn-outline">
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
