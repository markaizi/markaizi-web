import Link from "next/link";
import Image from "next/image";
import { BlogPost, CONTENT_TYPE_CONFIG } from "@/lib/blog-data";

export default function BlogCard({ post }: { post: BlogPost }) {
  const typeConf = CONTENT_TYPE_CONFIG[post.type];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(139,92,246,0.1)",
        boxShadow: "0 2px 12px rgba(100,80,180,0.05)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 32px rgba(124,58,237,0.12)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(139,92,246,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 12px rgba(100,80,180,0.05)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(139,92,246,0.1)";
      }}
    >
      {/* Kart başlığı — türe göre değişir */}
      <CardHeader post={post} />

      {/* İçerik */}
      <div className="p-6 flex flex-col flex-1">
        {/* Kategori + tür badge */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
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

        {/* Başlık */}
        <h2
          className="text-[16px] font-bold leading-snug mb-2.5 transition-colors duration-200 group-hover:text-purple-700"
          style={{ color: "#1a1733" }}
        >
          {post.title}
        </h2>

        {/* Özet */}
        <p
          className="text-[13px] leading-relaxed flex-1 mb-4"
          style={{ color: "#6b6880" }}
        >
          {post.excerpt}
        </p>

        {/* Alt bilgi */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}
        >
          <span className="text-[12px]" style={{ color: "#9997b8" }}>
            {post.date}
          </span>
          <span
            className="text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
            style={{ color: "#7c3aed" }}
          >
            {post.type === "makale" ? "Oku" : post.type === "video" ? "İzle" : "Gör"}
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardHeader({ post }: { post: BlogPost }) {
  // YouTube: thumbnail göster
  if (post.type === "video" && post.videoId) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={`https://img.youtube.com/vi/${post.videoId}/mqdefault.jpg`}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized // YouTube CDN direkt
        />
        {/* Play butonu overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.25)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ background: "rgba(255,255,255,0.95)" }}
          >
            <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Instagram: gradient header
  if (post.type === "instagram") {
    return (
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 flex-shrink-0">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
        <span className="text-white text-[13px] font-semibold">Instagram Paylaşımı</span>
      </div>
    );
  }

  // TikTok: dark header
  if (post.type === "tiktok") {
    return (
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ background: "linear-gradient(135deg, #010101 0%, #1a1a2e 100%)" }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 flex-shrink-0">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.84 1.55V6.86a4.85 4.85 0 01-1.07-.17z" />
        </svg>
        <span className="text-white text-[13px] font-semibold">TikTok Videosu</span>
      </div>
    );
  }

  // Makale: renk şeridi
  return (
    <div
      className="h-1.5 w-full"
      style={{ background: `linear-gradient(90deg, ${post.color}, ${post.color}40)` }}
    />
  );
}
