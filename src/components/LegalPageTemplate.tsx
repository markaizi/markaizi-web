import { ReactNode } from "react";

interface LegalPageTemplateProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageTemplate({
  badge,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageTemplateProps) {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "var(--bg)" }}>
        <div
          className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="max-w-[860px] mx-auto px-6 relative z-10 text-center">
          <span className="section-tag">{badge}</span>
          <h1 className="font-black leading-tight mt-4 mb-4" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            {title}
          </h1>
          <p className="text-[#8a8a9a] text-[16px] max-w-[640px] mx-auto">{subtitle}</p>
          <p className="text-[13px] text-[#555568] mt-4">Son güncelleme: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" style={{ background: "var(--bg-alt)" }}>
        <div
          className="max-w-[860px] mx-auto px-6 rounded-2xl p-8 md:p-12 legal-content"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {children}
        </div>

        {/* Back link */}
        <div className="max-w-[860px] mx-auto px-6 mt-8 flex gap-4 text-[13px]">
          <a href="/" className="text-[#c084fc] hover:text-white transition-colors">
            ← Ana Sayfa
          </a>
          <a href="/kvkk" className="text-[#8a8a9a] hover:text-white transition-colors">
            KVKK
          </a>
          <a href="/gizlilik-politikasi" className="text-[#8a8a9a] hover:text-white transition-colors">
            Gizlilik Politikası
          </a>
          <a href="/cerez-politikasi" className="text-[#8a8a9a] hover:text-white transition-colors">
            Çerez Politikası
          </a>
          <a href="/kullanim-sartlari" className="text-[#8a8a9a] hover:text-white transition-colors">
            Kullanım Şartları
          </a>
        </div>
      </section>
    </main>
  );
}
