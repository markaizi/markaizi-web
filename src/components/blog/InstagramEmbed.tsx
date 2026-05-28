"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function InstagramEmbed({ url }: { url: string }) {
  // Script yüklenince embed'i işle
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <div className="flex justify-center my-4">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: "0",
            borderRadius: "12px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px",
            maxWidth: "540px",
            minWidth: "326px",
            padding: "0",
            width: "100%",
          }}
        />
      </div>
    </>
  );
}
