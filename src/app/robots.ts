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
        // Yapay zeka arama, eğitim ve kullanıcı adına sayfa çeken botlar — açık izin.
        // Belirteçler resmî dokümanlardan (Kasım 2026): OpenAI, Anthropic, Perplexity, Google, Apple, Amazon.
        // "Claude-Web" Anthropic'in güncel listesinde yok; yerine Claude-SearchBot ve Claude-User.
        userAgent: [
          "OAI-SearchBot",
          "GPTBot",
          "ChatGPT-User",
          "OAI-AdsBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/api/", "/musteri/", "/odeme/"],
      },
    ],
    sitemap: "https://markaizi.com.tr/sitemap.xml",
  };
}
