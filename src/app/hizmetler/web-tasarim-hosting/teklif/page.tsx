import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import WebTeklifForm from "@/components/WebTeklifForm";

export const metadata: Metadata = {
  title: "Web Sitesi Teklif Formu — markaizi",
  description: "E-ticaret, kurumsal veya tanıtım siteniz için ücretsiz teklif alın. Proje detaylarınızı paylaşın, 24 saat içinde size özel fiyat hazırlayalım.",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/web-tasarim-hosting/teklif" },
};

export default function WebTeklifPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-10" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[860px] mx-auto px-6 relative z-10">
            <Link
              href="/hizmetler/web-tasarim-hosting"
              className="inline-flex items-center gap-2 text-[13px] text-[#8a8a9a] hover:text-white transition-colors mb-10 group"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:-translate-x-1" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Web Tasarım & Hosting
            </Link>

            <div className="text-center">
              <span className="section-tag">Ücretsiz Teklif</span>
              <h1 className="font-black leading-tight mt-4 mb-4" style={{ fontSize: "clamp(30px,4.5vw,52px)" }}>
                Projenizi <span className="gradient-text">Anlatalım</span>
              </h1>
              <p className="text-[#8a8a9a] text-[17px] max-w-[520px] mx-auto">
                Formu doldurun, 24 saat içinde size özel fiyat teklifleriyle geri dönelim. Gizli ücret yok.
              </p>

              {/* Güven satırı */}
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-[13px] text-[#8a8a9a]">
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 24 saatte yanıt</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Taahhüt yok</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 10+ yıl deneyim</span>
              </div>
            </div>
          </div>
        </section>

        <WebTeklifForm />
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
