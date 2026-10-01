import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";
import VideoCallout from "@/components/VideoCallout";
import Link from "next/link";
import { FOUNDER, founderRef } from "@/lib/founder";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// Kategoriye göre ilgili hizmet sayfası — blog yazısından hizmete geri dönüş linki için.
const CATEGORY_SERVICE: Record<string, { href: string; label: string }> = {
  "Sosyal Medya": { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi" },
  "TikTok": { href: "/hizmetler/tiktok-reklamlari", label: "TikTok Reklamları" },
  "Google Ads": { href: "/hizmetler/google-reklamlari", label: "Google Reklamları" },
  "Meta Reklamları": { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" },
  "Web Tasarım": { href: "/hizmetler/web-tasarim-hosting", label: "Web Tasarım & Hosting" },
  "İçerik Üretimi": { href: "/hizmetler/yapay-zeka-otomasyon", label: "Yapay Zeka & Otomasyon" },
  "Reklam Stratejisi": { href: "/hizmetler/dijital-pazarlama-danismanligi", label: "Dijital Pazarlama Danışmanlığı" },
  "Kafe & Restoran": { href: "/ankara-kafe-restoran-reklam-ajansi", label: "Ankara Kafe & Restoran Reklam Ajansı" },
  "Ölçümleme": { href: "/hizmetler/donusum-takibi-kurulumu", label: "Dönüşüm Takibi Kurulumu" },
  "Yapay Zeka": { href: "/hizmetler/yapay-zeka-arama-gorunurlugu", label: "Yapay Zeka Arama Görünürlüğü" },
};

const AD_CATEGORIES = new Set(["Meta Reklamları", "Google Ads", "Reklam Stratejisi", "TikTok", "Ölçümleme", "Mobilya Sektörü"]);

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
      publishedTime: post.dateISO,
      modifiedTime: post.dateModifiedISO ?? post.dateISO,
      authors: [FOUNDER.name],
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "tr",
    url: `https://markaizi.com.tr/blog/${post.slug}`,
    mainEntityOfPage: `https://markaizi.com.tr/blog/${post.slug}`,
    datePublished: post.dateISO,
    dateModified: post.dateModifiedISO ?? post.dateISO,
    image: "https://markaizi.com.tr/opengraph-image",
    // Yazar kurucu (kişi) — tam tanımı /samet-saglam sayfasındaki Person şemasında
    author: founderRef,
    publisher: {
      "@type": "Organization",
      name: "markaizi",
      logo: { "@type": "ImageObject", url: "https://markaizi.com.tr/logo.svg" },
    },
    articleSection: post.category,
  };

  const faqJsonLd = post.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumb} />
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
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title }]} />
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
              <Link href={FOUNDER.path} className="hover:text-white transition-colors underline-offset-2 hover:underline">
                {FOUNDER.name}
              </Link>
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
                  {section.link && (
                    <p>
                      <Link href={section.link.href} className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors">
                        {section.link.label} →
                      </Link>
                    </p>
                  )}
                </div>
              ))}

              {/* SSS */}
              {post.faq && (
                <div className="blog-section mt-10">
                  <h2>Sık Sorulan Sorular</h2>
                  {post.faq.map((f, i) => (
                    <div key={i} className="mb-5">
                      <h3 className="text-[16px] font-semibold text-white mb-1">{f.q}</h3>
                      <p>{f.a}</p>
                    </div>
                  ))}
                </div>
              )}

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

              {post.videoSlug && <VideoCallout slug={post.videoSlug} className="mt-6" />}

              {/* Yazar kutusu */}
              <div
                className="mt-8 flex items-start gap-4 p-5 rounded-xl"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <div
                  aria-hidden="true"
                  className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-black text-[15px] text-white"
                  style={{ background: "var(--grad)" }}
                >
                  SS
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8a8a9a] mb-1">Yazar</p>
                  <Link href={FOUNDER.path} className="text-[16px] font-bold text-white hover:text-[#c084fc] transition-colors">
                    {FOUNDER.name}
                  </Link>
                  <p className="text-[13.5px] text-[#8a8a9a] leading-relaxed mt-1 m-0">
                    markaizi&apos;nin kurucusu. Ankara Siteler&apos;de matbaa ve katalog tasarımıyla başladı; mobilya sektöründeki
                    on yılı aşkın deneyimiyle işletmelerin Meta ve Google reklamlarını, sosyal medyasını ve ölçüm altyapısını yönetiyor.
                  </p>
                </div>
              </div>

              {/* Mobilya yazıları → sektör sayfası iç linki */}
              {post.category === "Mobilya Sektörü" && (
                <p className="mt-6 text-[14px] text-[#8a8a9a] leading-relaxed">
                  Mobilya mağazanız için verdiğimiz tüm hizmetleri{" "}
                  <a
                    href="/mobilya-reklam-ajansi"
                    className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Mobilya Reklam Ajansı
                  </a>{" "}
                  sayfamızda bulabilirsiniz.
                </p>
              )}

              {/* Reklam konulu yazılar → ücretsiz reklam hesabı denetimi */}
              {AD_CATEGORIES.has(post.category) && (
                <p className="mt-6 text-[14px] text-[#8a8a9a] leading-relaxed">
                  Reklam veriyor ama sonuçtan emin değil misiniz?{" "}
                  <a
                    href="/reklam-hesabi-denetimi"
                    className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Reklam hesabınızı ücretsiz denetleyelim
                  </a>
                  ; yalnızca görüntüleme yetkisiyle bakıyoruz.
                </p>
              )}

              {/* Diğer kategoriler → ilgili hizmet sayfası iç linki */}
              {CATEGORY_SERVICE[post.category] && (
                <p className="mt-6 text-[14px] text-[#8a8a9a] leading-relaxed">
                  Bu konuda size özel çalışabileceğimiz{" "}
                  <a
                    href={CATEGORY_SERVICE[post.category].href}
                    className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors"
                  >
                    {CATEGORY_SERVICE[post.category].label}
                  </a>{" "}
                  hizmetimize göz atın.
                </p>
              )}
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
                {[...BLOG_POSTS]
                  .filter((p) => p.slug !== post.slug)
                  .sort((a, b) =>
                    (b.category === post.category ? 1 : 0) - (a.category === post.category ? 1 : 0)
                  )
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
