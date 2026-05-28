"use client";

import Script from "next/script";

// TikTok video URL'sinden video ID çıkarır
// Örn: "https://www.tiktok.com/@user/video/7123456789" → "7123456789"
function extractTikTokId(url: string): string {
  const match = url.match(/\/video\/(\d+)/);
  return match?.[1] ?? "";
}

export default function TikTokEmbed({ url }: { url: string }) {
  const videoId = extractTikTokId(url);

  return (
    <>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      <div className="flex justify-center my-4">
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
          style={{ maxWidth: "605px", minWidth: "325px", width: "100%" }}
        >
          <section>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14b8a6] text-sm"
            >
              TikTok&apos;ta izle →
            </a>
          </section>
        </blockquote>
      </div>
    </>
  );
}
