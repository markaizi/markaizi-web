import type { NextConfig } from "next";

// Analytics.tsx'in yüklediği script'ler (GA4, Meta Pixel) — CSP'nin izin
// vermesi gereken tek üçüncü taraf kaynaklar bunlar. script-src ve style-src'de
// 'unsafe-inline' gerekli çünkü: next/script ile satır içi GA/Pixel init kodu
// ve JSON-LD şemaları enjekte ediliyor, bileşenler yaygın olarak React
// style={{}} (→ inline style attribute) kullanıyor. Nonce tabanlı sıkılaştırma
// ayrı bir iş olarak planlanabilir; bu ilk aşamada clickjacking, MIME-sniffing
// ve gömme (frame) korumaları kapatılıyor.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // CSP yalnızca production'da uygulanır — React dev modu (HMR, hata
    // overlay'i) yığın izini yeniden kurmak için eval() kullanır ve bu,
    // production'da hiç gerçekleşmeyen bir davranış; geliştirmede CSP
    // sadece gürültülü konsol hatası üretir, gerçek bir koruma sağlamaz.
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    // Fiyat sayfaları kaldırıldı — indekslenmiş eski URL'ler ana sayfaya yönlensin
    return [
      { source: "/fiyatlar", destination: "/", permanent: true },
      { source: "/fiyat-hesapla", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
