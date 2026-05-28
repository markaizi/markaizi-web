// YouTube video embed — sadece videoId gerekli (örn: "dQw4w9WgXcQ")
// Aspect ratio korunur, tamamen responsive.
export default function YouTubeEmbed({ videoId, title = "YouTube Video" }: { videoId: string; title?: string }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ paddingBottom: "56.25%", background: "#000" }}
    >
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
