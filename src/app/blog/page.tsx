import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — markaizi Dijital Reklam Ajansı",
  description: "Dijital pazarlama, sosyal medya yönetimi, Google Ads ve Meta reklamları hakkında güncel makaleler ve rehberler.",
  alternates: { canonical: "https://markaizi.com.tr/blog" },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Blog", path: "/blog" },
]);

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <Breadcrumb className="justify-center" items={[{ name: "Ana Sayfa", path: "/" }, { name: "Blog" }]} />
            <span className="section-tag">Blog</span>
            <h1 className="font-black leading-tight mt-4 mb-4" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
              Dijital Pazarlama <span className="gradient-text">Rehberleri</span>
            </h1>
            <p className="text-[#8a8a9a] text-[17px] max-w-[560px] mx-auto">
              Sosyal medya, reklam yönetimi ve dijital büyüme üzerine güncel makaleler.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col"
                  style={{ background: "var(--surface)", textDecoration: "none" }}
                >
                  {/* Renk bandı */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${post.color}, transparent)` }} />

                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{ background: "rgba(168,85,247,0.1)", color: post.color, border: `1px solid ${post.color}30` }}
                      >
                        {post.category}
                      </span>
                      <span className="text-[12px] text-[#8a8a9a]">{post.readTime} okuma</span>
                    </div>

                    <h2 className="text-[17px] font-bold leading-snug mb-3 text-white">{post.title}</h2>
                    <p className="text-[14px] text-[#8a8a9a] leading-relaxed flex-1 mb-5">{post.excerpt}</p>

                    <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="text-[12px] text-[#8a8a9a]">{post.date}</span>
                      <span className="text-[13px] font-semibold flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
                        style={{ color: "#c084fc" }}>
                        Oku
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16 p-10 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <h3 className="text-[22px] font-bold mb-3">Dijital pazarlama konusunda yardım mı lazım?</h3>
              <p className="text-[#8a8a9a] mb-6">Ücretsiz danışmanlık randevusu alın, markanız için en uygun stratejiyi birlikte belirleyelim.</p>
              <a href="/#iletisim" className="btn btn-primary">Ücretsiz Danışmanlık Al</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
