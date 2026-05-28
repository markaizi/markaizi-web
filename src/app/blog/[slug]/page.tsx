import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import YouTubeEmbed from "@/components/blog/YouTubeEmbed";
import InstagramEmbed from "@/components/blog/InstagramEmbed";
import TikTokEmbed from "@/components/blog/TikTokEmbed";
import { BLOG_POSTS, CONTENT_TYPE_CONFIG, getPostBySlug } from "@/lib/blog-data";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | markaizi Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://markaizi.com.tr/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["markaizi"],
      ...(post.videoId && {
        images: [`https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`],
      }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const typeConf = CONTENT_TYPE_CONFIG[post.type];
  const isEmbed = post.type !== "makale";
  const hasTextContent = (post.sections && post.sections.length > 0) || post.conclusion;

  // İlgili yazılar: aynı kategori öncelikli
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : b.category === post.category ? 1 : 0))
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero (koyu) ── */}
        <section
          className="relative overflow-hidden pt-32 pb-14"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${post.color}20 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[800px] mx-auto px-6 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Link
                href="/blog"
                className="text-[13px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Blog
              </Link>
              <span className="text-[#555]">/</span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: `${post.color}18`,
                  color: post.color,
                  border: `1px solid ${post.color}30`,
                }}
              >
                {post.category}
              </span>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: typeConf.bg, color: typeConf.color }}
              >
                {typeConf.emoji} {typeConf.label}
              </span>
            </div>

            <h1
              className="font-black leading-tight mb-5"
              style={{ fontSize: "clamp(24px,4vw,42px)", letterSpacing: "-0.5px" }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-[13px] text-[#8a8a9a] flex-wrap">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>markaizi</span>
            </div>
          </div>

          {/* Hero → açık geçiş */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #f5f3ff)" }}
          />
        </section>

        {/* ── İçerik (açık tema) ── */}
        <section className="py-10 pb-20" style={{ background: "#f5f3ff" }}>
          <div className="max-w-[800px] mx-auto px-6">

            {/* Ana içerik kartı */}
            <article
              className="rounded-2xl p-7 md:p-10 mb-6"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(139,92,246,0.1)",
                boxShadow: "0 2px 20px rgba(100,80,180,0.07)",
              }}
            >
              {/* Giriş / Açıklama */}
              <p
                className="text-[17px] leading-[1.85] mb-8"
                style={{
                  color: "#4a4870",
                  borderLeft: `3px solid ${post.color}`,
                  paddingLeft: "1.25rem",
                }}
              >
                {post.intro}
              </p>

              {/* EMBED ALANI */}
              {post.type === "video" && post.videoId && (
                <div className="mb-8">
                  <YouTubeEmbed videoId={post.videoId} title={post.title} />
                </div>
              )}
              {post.type === "instagram" && post.instagramUrl && (
                <div className="mb-8">
                  <InstagramEmbed url={post.instagramUrl} />
                </div>
              )}
              {post.type === "tiktok" && post.tiktokUrl && (
                <div className="mb-8">
                  <TikTokEmbed url={post.tiktokUrl} />
                </div>
              )}

              {/* Metin bölümler (varsa) */}
              {hasTextContent && (
                <div>
                  {/* Makale için renk çizgisi bölücü */}
                  {!isEmbed && (
                    <div
                      className="h-px mb-8"
                      style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.2), transparent)" }}
                    />
                  )}

                  {post.sections?.map((section, i) => (
                    <div key={i} className={i > 0 ? "mt-8" : ""}>
                      <h2
                        className="font-bold mb-3"
                        style={{
                          fontSize: "clamp(17px,2.5vw,20px)",
                          color: "#1a1733",
                        }}
                      >
                        {section.h2}
                      </h2>
                      <p
                        className="text-[15px] leading-[1.85]"
                        style={{ color: "#4a4870" }}
                      >
                        {section.body}
                      </p>
                    </div>
                  ))}

                  {post.conclusion && (
                    <div
                      className="mt-8 p-5 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,72,153,0.04))",
                        border: "1px solid rgba(168,85,247,0.15)",
                      }}
                    >
                      <p
                        className="text-[15px] leading-[1.85] m-0"
                        style={{ color: "#4a4870" }}
                      >
                        {post.conclusion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>

            {/* CTA */}
            <div
              className="text-center p-8 rounded-2xl mb-6"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(139,92,246,0.12)",
                boxShadow: "0 2px 16px rgba(100,80,180,0.06)",
              }}
            >
              <p className="font-bold text-[18px] mb-2" style={{ color: "#1a1733" }}>
                Projenizi konuşalım
              </p>
              <p className="text-[14px] mb-5" style={{ color: "#6b6880" }}>
                Ücretsiz danışmanlık için WhatsApp veya iletişim formunu kullanın.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/905520772700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp&apos;tan Yaz
                </a>
                <a href="/#iletisim" className="btn btn-outline">
                  Teklif Al
                </a>
              </div>
            </div>

            {/* İlgili içerikler */}
            {related.length > 0 && (
              <div>
                <p
                  className="text-[12px] font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#9997b8" }}
                >
                  Diğer İçerikler
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="block p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(139,92,246,0.1)",
                        boxShadow: "0 2px 8px rgba(100,80,180,0.04)",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider mb-2 block"
                        style={{ color: rel.color }}
                      >
                        {rel.category}
                      </span>
                      <p
                        className="text-[14px] font-semibold leading-snug"
                        style={{ color: "#1a1733" }}
                      >
                        {rel.title}
                      </p>
                      <p className="text-[12px] mt-1" style={{ color: "#9997b8" }}>
                        {rel.readTime}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
