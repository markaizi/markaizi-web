import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import BlogGrid from "@/components/blog/BlogGrid";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — Dijital Pazarlama Rehberleri | markaizi",
  description:
    "Sosyal medya, Meta & Google reklamları, web tasarım, TikTok ve YouTube içerikleri. Ankara'nın dijital ajansından güncel rehberler.",
  alternates: { canonical: "https://markaizi.com.tr/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero (koyu, marka tutarlılığı) ── */}
        <section
          className="relative overflow-hidden pt-32 pb-20"
          style={{ background: "var(--bg)" }}
        >
          {/* Orbs */}
          <div
            className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(124,58,237,0.22) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute top-[50px] right-[-150px] w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[640px]">
              <span className="section-tag">Blog</span>
              <h1
                className="font-black leading-tight mt-4 mb-4"
                style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-1px" }}
              >
                Dijital Pazarlama{" "}
                <span className="gradient-text">Rehberleri</span>
              </h1>
              <p className="text-[#8a8a9a] text-[17px] leading-relaxed">
                Makaleler, YouTube videoları, Instagram ve TikTok paylaşımları —
                sosyal medya, reklam ve web tasarımı üzerine güncel içerikler.
              </p>
            </div>

            {/* İçerik türü istatistikleri */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { label: "Makale",    count: BLOG_POSTS.filter((p) => p.type === "makale").length,    color: "#c084fc" },
                { label: "Video",     count: BLOG_POSTS.filter((p) => p.type === "video").length,     color: "#ef4444" },
                { label: "Instagram", count: BLOG_POSTS.filter((p) => p.type === "instagram").length, color: "#ec4899" },
                { label: "TikTok",   count: BLOG_POSTS.filter((p) => p.type === "tiktok").length,    color: "#14b8a6" },
              ]
                .filter((s) => s.count > 0)
                .map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 text-[13px]" style={{ color: "#8a8a9a" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                    <span className="font-semibold" style={{ color: stat.color }}>{stat.count}</span>{" "}
                    {stat.label}
                  </div>
                ))}
            </div>
          </div>

          {/* Hero → açık tema geçiş gradienti */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #f5f3ff)" }}
          />
        </section>

        {/* ── Blog Grid (açık tema) ── */}
        <section className="py-12 pb-20" style={{ background: "#f5f3ff" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <BlogGrid posts={BLOG_POSTS} />

            {/* CTA */}
            <div
              className="text-center mt-16 p-10 rounded-2xl"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(139,92,246,0.12)",
                boxShadow: "0 2px 16px rgba(100,80,180,0.06)",
              }}
            >
              <h3 className="text-[22px] font-bold mb-3" style={{ color: "#1a1733" }}>
                Markanız için strateji konuşalım
              </h3>
              <p className="mb-6" style={{ color: "#6b6880" }}>
                Ücretsiz danışmanlık randevusu alın, sizin için en uygun dijital büyüme
                yolunu birlikte belirleyelim.
              </p>
              <a
                href="/#iletisim"
                className="inline-block px-6 py-3 rounded-full font-semibold text-white text-[14px] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)" }}
              >
                Ücretsiz Danışmanlık Al
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
