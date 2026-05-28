import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export const metadata: Metadata = {
  title: "Ödeme Başarılı — markaizi",
  robots: "noindex",
};

export default function OdemeBasariliPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden pt-32 pb-24 min-h-[70vh] flex items-center"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(34,197,94,0.15) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[560px] mx-auto px-6 relative z-10 text-center w-full">
            {/* Başarı ikonu */}
            <div
              className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6"
              style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-green-400" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="font-black text-[36px] leading-tight mb-3">
              Ödeme <span className="gradient-text">Başarılı!</span>
            </h1>
            <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
              Ödemeniz başarıyla alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.
              Makbuzunuz e-posta adresinize gönderildi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn btn-primary">
                Ana Sayfaya Dön
              </Link>
              <a
                href="https://wa.me/905520772700"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                WhatsApp&apos;tan Yaz
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
