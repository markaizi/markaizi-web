import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/musteri/"],
    },
    sitemap: "https://markaizi.com.tr/sitemap.xml",
  };
}
