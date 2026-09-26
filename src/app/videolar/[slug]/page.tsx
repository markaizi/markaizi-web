import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ServiceFAQ from "@/components/ServiceFAQ";
import YouTubeEmbed, { YouTubeLogo } from "@/components/YouTubeEmbed";
import { breadcrumbJsonLd, SITE_URL, LOGO_URL } from "@/lib/seo";
import { VIDEOS, YOUTUBE_CHANNEL_URL, getVideoBySlug, ytEmbed, ytThumb, ytWatch } from "@/lib/video-data";
import { loadTranscript, countWords } from "@/lib/video-transcript";
import { founderRef } from "@/lib/founder";

export const dynamicParams = false;

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) return {};
  const url = `${SITE_URL}/videolar/${v.slug}`;
  return {
    title: v.seoTitle,
    description: v.excerpt,
    keywords: v.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: v.seoTitle,
      description: v.excerpt,
      url,
      locale: "tr_TR",
      type: v.youtubeId ? "video.other" : "article",
      ...(v.youtubeId ? { images: [ytThumb(v.youtubeId)], videos: [{ url: ytEmbed(v.youtubeId) }] } : {}),
    },
  };
}

const AUTHOR = { ...founderRef, jobTitle: "markaizi Kurucusu", worksFor: { "@type": "Organization", name: "markaizi", url: SITE_URL } };

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) notFound();

  const sections = loadTranscript(v.slug);
  const words = countWords(sections);
  const readMin = Math.max(1, Math.round(words / 200));
  const url = `${SITE_URL}/videolar/${v.slug}`;

  const videoObject = v.youtubeId
    ? {
        "@type": "VideoObject",
        name: v.seoTitle,
        description: v.excerpt,
        thumbnailUrl: [ytThumb(v.youtubeId)],
        uploadDate: `${v.dateISO}T09:00:00+03:00`,
        embedUrl: ytEmbed(v.youtubeId),
        contentUrl: ytWatch(v.youtubeId),
        inLanguage: "tr",
        ...(v.durationISO ? { duration: v.durationISO } : {}),
        author: AUTHOR,
        publisher: { "@type": "Organization", name: "markaizi", logo: { "@type": "ImageObject", url: LOGO_URL } },
      }
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: v.seoTitle,
    description: v.excerpt,
    inLanguage: "tr",
    url,
    mainEntityOfPage: url,
    datePublished: v.dateISO,
    dateModified: v.dateISO,
    wordCount: words,
    image: v.youtubeId ? ytThumb(v.youtubeId) : `${SITE_URL}/opengraph-image`,
    author: AUTHOR,
    publisher: { "@type": "Organization", name: "markaizi", logo: { "@type": "ImageObject", url: LOGO_URL } },
    ...(videoObject ? { video: videoObject } : {}),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const headings = sections.filter((s) => s.heading);
  const isSub = (h: string) => /^(Bir|İki|Üç|Dört|Beş):/.test(h);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      {videoObject && <JsonLd data={{ "@context": "https://schema.org", ...videoObject }} />}
      <JsonLd data={faqJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Videolar", path: "/videolar" },
          { name: v.title, path: `/videolar/${v.slug}` },
        ])}
      />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-10" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-150px] left-[-100px] w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,0,51,0.14) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[900px] mx-auto px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Videolar", path: "/videolar" }, { name: v.title }]} />
            <div className="flex items-center gap-2 mb-4">
              <YouTubeLogo className="w-7 h-7" />
              <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#ff4d6d]">YouTube · Rehber</span>
            </div>
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(28px,4.5vw,46px)", letterSpacing: "-0.5px" }}>
              {v.title}
            </h1>
            <p className="text-[#8a8a9a] text-[17px] leading-relaxed mb-5">{v.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#8a8a9a] mb-8">
              <Link href="/samet-saglam" className="hover:text-white transition-colors">Samet Sağlam</Link>
              <span>·</span>
              <span>{v.date}</span>
              <span>·</span>
              <span>{readMin} dk okuma</span>
            </div>
            <YouTubeEmbed id={v.youtubeId} title={v.title} />
            {YOUTUBE_CHANNEL_URL && (
              <div className="flex flex-wrap gap-3 mt-4">
                <a href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="btn text-white text-sm px-5 py-2.5" style={{ background: "#FF0033" }}>
                  Kanala Abone Ol
                </a>
                {v.youtubeId && (
                  <a href={ytWatch(v.youtubeId)} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm px-5 py-2.5">
                    YouTube&apos;da İzle
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-12" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[900px] mx-auto px-6">
            {/* Kısa özet — hem acelesi olan okuyucu hem yapay zeka asistanları için */}
            <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.25)" }}>
              <h2 className="font-black text-[20px] mb-4">
                Kısaca: <span className="gradient-text">Bu Videoda Ne Anlatıyoruz?</span>
              </h2>
              <ul className="space-y-3">
                {v.ozet.map((o) => (
                  <li key={o} className="flex gap-3 text-[15px] text-[#c0c0d0] leading-relaxed">
                    <span className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--grad)" }} />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <details className="rounded-2xl mb-10 group" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <summary className="faq-summary cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-3">
                <span className="font-bold text-white text-[15px]">İçindekiler · {headings.length} başlık</span>
                <span className="text-[#8a8a9a] text-[13px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <ol className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {headings.map((s) => (
                  <li key={s.id} className={isSub(s.heading!) ? "pl-4" : ""}>
                    <a href={`#${s.id}`} className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <article className="rounded-2xl p-6 md:p-10" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#8a8a9a] mb-6">Videonun tam metni</p>
              {sections.map((s) => (
                <div key={s.id} id={s.id} className="scroll-mt-28">
                  {s.heading &&
                    (isSub(s.heading) ? (
                      <h3 className="font-bold text-white text-[18px] mt-8 mb-3">{s.heading}</h3>
                    ) : (
                      <h2 className="font-black text-white leading-snug mt-12 mb-4" style={{ fontSize: "clamp(20px,2.6vw,26px)" }}>
                        {s.heading}
                      </h2>
                    ))}
                  {s.blocks.map((b, i) =>
                    b.type === "p" ? (
                      <p
                        key={i}
                        className={`text-[16px] text-[#b4b4c4] leading-[1.85] ${/^[a-zçğıöşü]/.test(b.text) ? "mt-1 mb-4" : "mb-4"}`}
                      >
                        {b.text}
                      </p>
                    ) : (
                      <div key={i} className="my-4 pl-4 space-y-1.5" style={{ borderLeft: "3px solid rgba(168,85,247,0.5)" }}>
                        {b.items.map((q) => (
                          <p key={q} className="text-[16px] text-white italic leading-relaxed">
                            “{q}”
                          </p>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              ))}
            </article>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--bg)" }}>
          <ServiceFAQ faqs={v.faq} />
        </section>

        <section className="py-12" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <h2 className="font-black text-[22px] mb-5">
              İlgili <span className="gradient-text">Sayfalar</span>
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {v.related.map((r) => (
                <Link key={r.href} href={r.href} className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[30px] mb-4">
              İşletmenizi <span className="gradient-text">Birlikte Konuşalım</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Önce işletmenizi tanıyalım, nerede olduğunuzu ve nereye gitmek istediğinizi anlayalım. Sonra birlikte çalışmanın mantıklı olup olmadığına bakalım.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20YouTube%20videonuzu%20izledim%2C%20i%C5%9Fletmem%20i%C3%A7in%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp&apos;tan Yaz
              </a>
              <Link href="/ucretsiz-analiz" className="btn btn-outline">Ücretsiz Analiz</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
