import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import VideoCallout from "@/components/VideoCallout";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { FOUNDER, FOUNDER_URL, founderJsonLd } from "@/lib/founder";
import { VIDEOS } from "@/lib/video-data";

const TITLE = "Samet Sağlam — markaizi Kurucusu | Dijital Pazarlama ve Reklam";
const DESC =
  "Samet Sağlam, Ankara Siteler merkezli dijital reklam ajansı markaizi'nin kurucusu. Mobilya sektörü başta olmak üzere Meta ve Google reklamları, sosyal medya ve içerik stratejisi. Samet Sağlam'a markaizi üzerinden ulaşın.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords: "samet sağlam, samet saglam, samet sağlam markaizi, markaizi kurucusu, samet sağlam reklam, samet sağlam dijital pazarlama, samet sağlam ankara, samet sağlam youtube",
  alternates: { canonical: FOUNDER_URL },
  openGraph: { title: TITLE, description: DESC, type: "profile", locale: "tr_TR", url: FOUNDER_URL },
};

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: FOUNDER_URL,
  name: TITLE,
  inLanguage: "tr",
  mainEntity: founderJsonLd(),
};

const IDEAS = [
  { t: "Reklam tek başına satış yapmaz.", d: "Reklam; kreatif, teklif, hedef kitle, satış süreci ve operasyonla birlikte çalışan bir zincirin halkasıdır. Sonuç en zayıf halka kadar güçlüdür." },
  { t: "Daha çok değil, daha doğru içerik.", d: "İçerik sayısını takvim değil; hedef, bütçe ve üretim kapasitesi belirler. Sınırlı bütçede az ama güçlü içerik çoğu zaman daha fazla iş yapar." },
  { t: "Takipçi değil, müşteri ölçülür.", d: "Doğru kişiye ulaşım, gelen mesaj, nitelikli müşteri ve satış; raporun asıl konusu bunlardır." },
  { t: "Sonuç değil, süreç garanti edilir.", d: "Koşulsuz satış garantisi verilmez; şeffaf rapor, test disiplini ve bir sorun görüldüğünde bunu açıkça söylemek taahhüt edilir." },
];

export default function SametSaglamPage() {
  return (
    <>
      <JsonLd data={profileJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Ana Sayfa", path: "/" }, { name: FOUNDER.name, path: FOUNDER.path }])} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] right-[-120px] w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[900px] mx-auto px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: FOUNDER.name }]} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div
                className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-[34px] font-black text-white"
                style={{ background: "var(--grad)", boxShadow: "var(--glow-sm)" }}
                aria-hidden="true"
              >
                SS
              </div>
              <div>
                <span className="section-tag !mb-3">markaizi Kurucusu</span>
                <h1 className="font-black leading-tight" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-1px" }}>
                  Samet <span className="gradient-text">Sağlam</span>
                </h1>
              </div>
            </div>
            <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-8 max-w-[720px]">
              Ankara Siteler merkezli dijital reklam ajansı <Link href="/" className="text-white underline underline-offset-4">markaizi</Link>&apos;nin
              kurucusu. İşletmelerin, özellikle mobilya sektörünün, reklamdan gerçekten müşteri ve satış almasını sağlayan
              dijital pazarlama sistemleri kuruyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/905520772700?text=Merhaba%20Samet%20Bey%2C%20i%C5%9Fletmem%20i%C3%A7in%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                WhatsApp&apos;tan Ulaşın
              </a>
              <Link href="/ucretsiz-analiz" className="btn btn-outline">Ücretsiz Analiz</Link>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(22px,3vw,30px)" }}>Hakkında</h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">
              Samet Sağlam&apos;ın reklamcılık yolculuğu, Türkiye&apos;nin en büyük mobilya merkezlerinden biri olan Ankara
              Siteler&apos;de matbaa, baskı, insert ve katalog tasarımıyla başladı. Mobilya sektörünün içinde geçen on yılı
              aşkın bu dönemde esnafın müşterisini nasıl bulduğunu, hangi ürünün hangi ayda sattığını ve bir mobilya
              müşterisinin nasıl karar verdiğini yakından gördü.
            </p>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">
              Bu birikimle kurduğu markaizi bugün tamamen dijital pazarlamaya odaklanıyor: sosyal medya yönetimi, Meta ve
              Google reklamları, video ve içerik üretimi, web sitesi, danışmanlık ve kurumsal eğitim. Ajans, Ankara
              merkezli olarak Türkiye genelinde işletmelere hizmet veriyor ve 200&apos;ün üzerinde işletmeyle çalıştı.
            </p>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
              Uzun soluklu iş birliklerinden biri olan Alitel Mobilya ile yedi yıldır birlikte çalışıyor; bu süreçte Alitel,
              her yıl İstikbal bayileri arasında Türkiye ciro birinciliğini aldı.{" "}
              <Link href="/vaka-calismalari/alitel-mobilya" className="text-[#c084fc] underline underline-offset-2">Vaka çalışmasını okuyun →</Link>
            </p>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--bg)" }}>
          <div className="max-w-[900px] mx-auto px-6">
            <h2 className="font-black leading-tight mb-8 text-center" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
              Dijital Pazarlamaya <span className="gradient-text">Bakış Açısı</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IDEAS.map((i) => (
                <div key={i.t} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="font-bold text-white text-[16px] mb-2">{i.t}</h3>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed">{i.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
              Samet Sağlam&apos;ın <span className="gradient-text">Videoları</span>
            </h2>
            <p className="text-[#8a8a9a] text-[15px] mb-6">
              markaizi YouTube kanalında her hafta işletme sahipleri için reklam, sosyal medya ve ajansla çalışma üzerine rehberler.
            </p>
            <div className="space-y-4">
              {VIDEOS.map((v) => (
                <VideoCallout key={v.slug} slug={v.slug} text={v.excerpt} />
              ))}
            </div>
            <Link href="/videolar" className="inline-block mt-6 text-[14px] font-semibold text-[#c084fc]">Tüm videolar →</Link>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--bg)" }}>
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(22px,3vw,30px)" }}>Uzmanlık Alanları</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { l: "Meta (Instagram & Facebook) Reklamları", h: "/hizmetler/meta-reklamlari" },
                { l: "Google Reklamları", h: "/hizmetler/google-reklamlari" },
                { l: "Sosyal Medya Yönetimi", h: "/hizmetler/sosyal-medya-yonetimi" },
                { l: "Mobilya Sektörü Pazarlaması", h: "/mobilya-reklam-ajansi" },
                { l: "Dijital Pazarlama Danışmanlığı", h: "/hizmetler/dijital-pazarlama-danismanligi" },
                { l: "Kurumsal Eğitim", h: "/hizmetler/dijital-pazarlama-egitimi" },
                { l: "Video & İçerik Stratejisi", h: "/hizmetler/video-cekimi-drone" },
              ].map((x) => (
                <Link key={x.h} href={x.h} className="text-[13.5px] font-semibold text-[#c084fc] px-4 py-2 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                  {x.l}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[28px] sm:text-[30px] mb-4">
              Samet Sağlam&apos;a <span className="gradient-text">Ulaşın</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              İşletmeniz için görüşmek isterseniz markaizi üzerinden doğrudan ulaşabilirsiniz. Önce işletmenizi tanıyalım,
              sonra birlikte çalışmanın mantıklı olup olmadığına bakalım.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a href="https://wa.me/905520772700" target="_blank" rel="noopener noreferrer" className="btn btn-primary">WhatsApp: +90 552 077 27 00</a>
              <a href="mailto:markaizicom@gmail.com" className="btn btn-outline">markaizicom@gmail.com</a>
            </div>
            <p className="text-[13px] text-[#8a8a9a]">markaizi · Zübeyde Hanım Mah. Elif Sok. No:7/106, Sütçü Kemal İş Merkezi, Siteler, Ankara</p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
