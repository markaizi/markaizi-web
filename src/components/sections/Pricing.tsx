import PriceCalculator from "@/components/PriceCalculator";

export default function Pricing() {
  return (
    <section id="fiyatlar" className="py-24" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-12 reveal">
          <span className="section-tag">Sana Özel Fiyat</span>
          <h2 className="font-black leading-tight mb-4 text-white" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            İhtiyacına Göre <span style={{ color: "#c084fc" }}>Şeffaf Fiyat</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            Sabit paketler yerine sana özel hesaplama. Birkaç soruyu yanıtla, aylık tahmini
            ücretini anında gör.
          </p>
        </div>

        {/* Fiyat hesaplama aracı */}
        <div className="reveal">
          <PriceCalculator />
        </div>

        {/* Alt not */}
        <p className="text-center text-[14px] text-[#8a8a9a] mt-10 reveal">
          Fiyatlara KDV dahil değildir. Özel ihtiyaçların için{" "}
          <a href="#iletisim" className="text-[#c084fc] underline underline-offset-2">
            bizimle iletişime geç
          </a>.
        </p>
      </div>
    </section>
  );
}
