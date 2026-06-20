"use client";

const LOGOS = [
  { name: "İstikbal",  sub: "Alitel" },
  { name: "Duru",      sub: "Avize" },
  { name: "Şahin",     sub: "Avize" },
  { name: "Sarsılmaz", sub: "Mobilya" },
  { name: "Getat",     sub: "Etimesgut" },
  { name: "Fıtrina",   sub: "" },
  { name: "Alanya",    sub: "Pro Clean" },
  { name: "Efsane",    sub: "Kebapçı" },
  { name: "İstikbal",  sub: "Ahenk" },
  { name: "Retrocar",  sub: "" },
  { name: "Özçalık",   sub: "Dizayn" },
  { name: "Doğtaş",    sub: "Mobilya" },
  { name: "Kelebek",   sub: "Mobilya" },
  { name: "Barış",     sub: "Aksesuar" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24" style={{
      backgroundColor: "#131320",
      backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
      backgroundSize: "44px 44px",
    }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Portföy & Referanslar</span>
          <h2 className="font-black leading-tight mb-4 text-white" style={{ fontSize:"clamp(28px,4vw,42px)" }}>
            Güvendikleri <span style={{ color: "#c084fc" }}>Markalar</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">200&apos;den fazla Ankara işletmesi markaizi ile çalışarak dijital hedeflerine ulaştı.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Mobilyacılar", "Avizeciler", "Aksesuarcılar", "Klinik & Doktorlar", "Restoranlar", "Hizmet Sektörü"].map((s) => (
              <span
                key={s}
                className="text-[12px] font-semibold px-3 py-1 rounded-full text-[#c084fc]"
                style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Sonuç Bandı */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 reveal">
          {[
            { value: "+%240", label: "Ort. Organik Büyüme", sub: "3 ayda" },
            { value: "-%38",  label: "Reklam Maliyeti",     sub: "optimizasyon sonrası" },
            { value: "3.2×",  label: "Ortalama ROAS",       sub: "Meta kampanyaları" },
            { value: "24sa",  label: "Yanıt Süresi",        sub: "destek & raporlama" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center rounded-xl py-6 px-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-[28px] font-black gradient-text leading-none mb-1">{stat.value}</div>
              <div className="text-[13px] font-semibold text-white mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-[#8a8a9a]">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-16 reveal">
          {LOGOS.map((l, i) => (
            <div
              key={`${l.name}-${i}`}
              className="flex flex-col items-center justify-center py-6 px-4 rounded-xl transition-all duration-300 cursor-default group"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(168,85,247,0.35)";
                el.style.background = "var(--surface-2)";
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "var(--glow-sm)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--surface)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <span className="block text-base font-black text-white/25 tracking-tight transition-colors duration-300 group-hover:text-white/90">
                {l.name}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors duration-300">
                {l.sub}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
