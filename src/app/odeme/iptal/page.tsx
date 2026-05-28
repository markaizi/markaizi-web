import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export const metadata: Metadata = {
  title: "Ödeme Başarısız — markaizi",
  robots: "noindex",
};

export default function OdemeIptalPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden pt-32 pb-24 min-h-[70vh] flex items-center"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[560px] mx-auto px-6 relative z-10 text-center w-full">
            {/* Hata ikonu */}
            <div
              className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6"
              style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.35)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-red-400" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="font-black text-[36px] leading-tight mb-3">
              Ödeme <span style={{ color: "#f87171" }}>Başarısız</span>
            </h1>
            <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
              Ödemeniz tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilir
              veya farklı bir ödeme yöntemi kullanabilirsiniz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#fiyatlar" className="btn btn-primary">
                Tekrar Dene
              </Link>
              <a
                href="https://wa.me/905520772700"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Yardım Al
              </a>
            </div>

            <p className="text-[12px] text-[#8a8a9a] mt-8">
              Sorun devam ederse{" "}
              <a
                href="mailto:markaizicom@gmail.com"
                className="text-[#c084fc] underline underline-offset-2"
              >
                markaizicom@gmail.com
              </a>{" "}
              adresine yazabilirsiniz.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
