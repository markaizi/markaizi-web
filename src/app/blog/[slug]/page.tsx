import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";

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
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://markaizi.com.tr/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["markaizi"],
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

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-32 pb-12"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${post.color}22 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />
          <div className="max-w-[760px] mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <a
                href="/blog"
                className="text-[13px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1"
              >
                ← Blog
              </a>
              <span className="text-[#8a8a9a]">/</span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  color: post.color,
                  border: `1px solid ${post.color}30`,
                }}
              >
                {post.category}
              </span>
            </div>

            <h1
              className="font-black leading-tight mb-4"
              style={{ fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-0.5px" }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-[13px] text-[#8a8a9a]">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} okuma</span>
              <span>·</span>
              <span>markaizi</span>
            </div>
          </div>
        </section>

        {/* Renk şeridi */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${post.color}, transparent)`,
          }}
        />

        {/* İçerik */}
        <section className="py-14" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6">
            <div
              className="rounded-2xl p-8 md:p-12 blog-article"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Giriş */}
              <p className="blog-intro">{post.intro}</p>

              {/* Bölümler */}
              {post.sections.map((section, i) => (
                <div key={i} className="blog-section">
                  <h2>{section.h2}</h2>
                  <p>{section.body}</p>
                </div>
              ))}

              {/* Sonuç */}
              <div
                className="mt-10 p-6 rounded-xl"
                style={{
                  background: "rgba(168,85,247,0.06)",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
              >
                <p className="text-[15px] text-[#c0c0d0] leading-[1.8] m-0">
                  {post.conclusion}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div
              className="mt-8 text-center p-10 rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <p className="font-bold text-[18px] mb-2">Projenizi konuşalım</p>
              <p className="text-[#8a8a9a] text-[14px] mb-6">
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

            {/* Diğer yazılar */}
            <div className="mt-8">
              <p className="text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-widest mb-4">
                Diğer Yazılar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BLOG_POSTS.filter((p) => p.slug !== post.slug)
                  .slice(0, 2)
                  .map((related) => (
                    <a
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="block p-5 rounded-xl transition-all duration-200 hover:border-purple-500/40"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider mb-2 block"
                        style={{ color: related.color }}
                      >
                        {related.category}
                      </span>
                      <p className="text-[14px] font-semibold leading-snug text-white">
                        {related.title}
                      </p>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
