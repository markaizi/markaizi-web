"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-[720px] mx-auto text-center py-24">
          <p className="font-black text-[15px] tracking-[0.2em] uppercase mb-4 gradient-text">
            Beklenmedik Hata
          </p>
          <h1 className="font-black text-[32px] sm:text-[42px] leading-tight text-white mb-4">
            Bir şeyler ters gitti
          </h1>
          <p className="text-[16px] text-[#8a8a9a] mb-10 max-w-[520px] mx-auto leading-relaxed">
            Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin, sorun devam
            ederse bize WhatsApp&apos;tan yazabilirsiniz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={reset} className="btn btn-primary">
              Tekrar Dene
            </button>
            <a href="/" className="btn btn-outline">
              Ana Sayfaya Dön
            </a>
            <a
              href="https://wa.me/905520772700"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp&apos;tan Yazın
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
