import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/musteri/", "/odeme/"],
      },
      {
        // Yapay zeka ve GEO arama botları için açık izin kuralları
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
        ],
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/musteri/", "/odeme/"],
      },
    ],
    sitemap: "https://markaizi.com.tr/sitemap.xml",
  };
}
