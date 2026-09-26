import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { YouTubeLogo } from "@/components/YouTubeEmbed";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { VIDEOS, YOUTUBE_CHANNEL_URL, ytThumb } from "@/lib/video-data";

const DESC =
  "markaizi YouTube kanalının videoları: işletme sahipleri için dijital pazarlama, Meta ve Google reklamları, sosyal medya ve ajansla çalışma üzerine rehberler. Her videonun tam metni sayfasında.";

export const metadata: Metadata = {
  title: "YouTube Videoları — Dijital Pazarlama ve Reklam Rehberleri | markaizi",
  description: DESC,
  alternates: { canonical: `${SITE_URL}/videolar` },
  openGraph: { title: "markaizi YouTube Videoları", description: DESC, type: "website", locale: "tr_TR", url: `${SITE_URL}/videolar` },
};

export default function VideolarPage() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "markaizi YouTube Videoları",
    description: DESC,
    url: `${SITE_URL}/videolar`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: VIDEOS.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/videolar/${v.slug}`,
        name: v.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Ana Sayfa", path: "/" }, { name: "Videolar", path: "/videolar" }])} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-14" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-150px] right-[-100px] w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,0,51,0.16) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1100px] mx-auto px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Videolar" }]} />
            <div className="flex items-center gap-3 mb-4">
              <YouTubeLogo className="w-10 h-10" />
              <span className="text-[13px] font-bold uppercase tracking-[2px] text-[#ff4d6d]">markaizi YouTube</span>
            </div>
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}>
              İşletmeler İçin <span className="gradient-text">Dijital Pazarlama Videoları</span>
            </h1>
            <p className="text-[#8a8a9a] text-[17px] leading-relaxed max-w-[680px] mb-8">
              Reklam, sosyal medya ve ajansla çalışma hakkında, işletme sahiplerinin gerçekten sorduğu sorulara açık cevaplar.
              Her hafta yeni bir video; her videonun tam metni kendi sayfasında.
            </p>
            {YOUTUBE_CHANNEL_URL && (
              <a href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="btn gap-2 text-white" style={{ background: "#FF0033" }}>
                <YouTubeLogo className="w-6 h-6 [&>path:first-child]:fill-white [&>path:last-child]:fill-[#FF0033]" />
                Kanala Abone Ol
              </a>
            )}
          </div>
        </section>

        <section className="py-14" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIDEOS.map((v) => (
              <Link
                key={v.slug}
                href={`/videolar/${v.slug}`}
                className="blog-card group rounded-2xl overflow-hidden flex flex-col"
                style={{ background: "var(--surface)", textDecoration: "none" }}
              >
                <div className="relative aspect-video overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.25))" }}>
                  {v.youtubeId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ytThumb(v.youtubeId)} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white" style={{ background: "rgba(0,0,0,0.35)" }}>
                        Yakında
                      </span>
                    </div>
                  )}
                  <YouTubeLogo className="absolute right-4 bottom-4 w-10 h-10 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-[18px] font-bold leading-snug mb-2 text-white">{v.title}</h2>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-4">{v.excerpt}</p>
                  <span className="mt-auto text-[13px] font-semibold text-[#c084fc]">İzle ve oku →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
