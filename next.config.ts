import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
