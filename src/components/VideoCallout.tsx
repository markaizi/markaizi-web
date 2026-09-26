import Link from "next/link";
import { YouTubeLogo } from "@/components/YouTubeEmbed";
import { getVideoBySlug, ytThumb } from "@/lib/video-data";

// Sitenin farklı yerlerinden video sayfasına bağlanan küçük kart.
// Videonun tam metni tek kaynak olarak video sayfasında durur; diğer sayfalar
// yalnızca buraya yönlendirir (kopya içerik oluşmasın diye).
export default function VideoCallout({ slug, text, className = "" }: { slug: string; text?: string; className?: string }) {
  const v = getVideoBySlug(slug);
  if (!v) return null;
  return (
    <Link
      href={`/videolar/${v.slug}`}
      className={`group flex items-center gap-4 rounded-2xl p-4 sm:p-5 transition-all ${className}`}
      style={{ background: "rgba(255,0,51,0.06)", border: "1px solid rgba(255,0,51,0.3)", textDecoration: "none" }}
    >
      <div
        className="relative flex-shrink-0 w-[96px] sm:w-[120px] aspect-video rounded-lg overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(236,72,153,0.3))" }}
      >
        {v.youtubeId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ytThumb(v.youtubeId)} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        )}
        <YouTubeLogo className="relative w-9 h-9 transition-transform group-hover:scale-110" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ff4d6d] mb-1">Bu konuyu videoda anlattık</p>
        <p className="text-[15px] font-bold text-white leading-snug">{v.title}</p>
        {text && <p className="text-[13px] text-[#8a8a9a] leading-relaxed mt-1">{text}</p>}
      </div>
    </Link>
  );
}
