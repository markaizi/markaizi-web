"use client";

const LOGOS = [
  { name: "Alitel",    sub: "İstikbal" },
  { name: "Duru",      sub: "Avize" },
  { name: "Şahin",     sub: "Avize" },
  { name: "Sarsılmaz", sub: "Mobilya" },
  { name: "Vizyon",    sub: "Aksesuar" },
  { name: "Getat",     sub: "Etimesgut" },
  { name: "Fıtrina",   sub: "" },
  { name: "Alanya",    sub: "Pro Clean" },
  { name: "Efsane",    sub: "Kebapçı" },
  { name: "Ahenk",     sub: "Mobilya" },
  { name: "Retrocar",  sub: "" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Portföy & Referanslar</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize:"clamp(28px,4vw,42px)" }}>
            Güvendikleri <span className="gradient-text">Markalar</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">200&apos;den fazla marka markaizi ile çalışarak dijital hedeflerine ulaştı.</p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16 reveal">
          {LOGOS.map((l) => (
            <div
              key={l.name}
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
