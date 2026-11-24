import { BLOG_POSTS } from "@/lib/blog-data";
import { SITE_URL, ORG_NAME } from "@/lib/seo";

// Blog RSS akışı — okuyucular, toplayıcılar ve bazı yapay zekâ araçları yeni yazıları buradan izler.
// Build sırasında blog-data.ts'ten üretilir; yeni yazı eklenince elle güncellemeye gerek yok.
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(`${p.dateISO}T09:00:00+03:00`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${ORG_NAME} Blog — Dijital Pazarlama ve Reklam Rehberleri</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Mobilya, kafe-restoran, klinik ve e-ticaret işletmeleri için Meta ve Google reklamları, sosyal medya, ölçümleme ve yapay zekâ görünürlüğü rehberleri.</description>
    <language>tr-TR</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
