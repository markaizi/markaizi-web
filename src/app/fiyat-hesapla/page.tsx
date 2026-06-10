import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import PriceCalculator from "@/components/PriceCalculator";

export const metadata: Metadata = {
  title: "Fiyat Hesapla — markaizi",
  description:
    "Sosyal medya yönetimi, reklam ve içerik hizmetleriniz için kişiselleştirilmiş fiyat tahmini alın. 2 dakikada ücret aralığınızı öğrenin.",
  openGraph: {
    title: "Fiyat Hesapla — markaizi",
    description: "İhtiyaçlarınıza göre özelleştirilmiş dijital pazarlama fiyat tahmini.",
  },
};

export default function FiyatHesaplaPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden pt-32 pb-24"
          style={{ background: "var(--bg)" }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[700px] mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="section-tag">Ücretsiz &amp; Anında</span>
              <h1 className="font-black text-[40px] md:text-[52px] leading-tight mb-4">
                Fiyatınızı{" "}
                <span className="gradient-text">Hemen Hesaplayın</span>
              </h1>
              <p className="text-[16px] text-[#8a8a9a] max-w-[480px] mx-auto leading-relaxed">
                Birkaç soruyu yanıtlayın, size özel aylık yönetim ücreti tahminini
                anında görün.
              </p>
            </div>

            <PriceCalculator />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
