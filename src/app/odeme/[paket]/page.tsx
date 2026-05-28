import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import CheckoutForm from "@/components/CheckoutForm";
import { getPackage } from "@/lib/packages";

interface Props {
  params: Promise<{ paket: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paket } = await params;
  const pkg = getPackage(paket);
  if (!pkg) return { title: "Paket Bulunamadı" };

  return {
    title: `${pkg.fullName} — Ödeme | markaizi`,
    description: `${pkg.fullName} için güvenli ödeme. ${pkg.desc}`,
    robots: "noindex",
  };
}

export default async function OdemePage({ params }: Props) {
  const { paket } = await params;
  const pkg = getPackage(paket);

  if (!pkg) notFound();

  const backHref =
    pkg.type === "abonelik"
      ? "/#fiyatlar"
      : "/hizmetler/web-tasarim-hosting";

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-32 pb-16"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div className="max-w-[680px] mx-auto px-6 relative z-10">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-[13px] text-[#8a8a9a] hover:text-white transition-colors mb-10 group"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:-translate-x-1" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {pkg.type === "abonelik" ? "Fiyat Paketleri" : "Web Tasarım & Hosting"}
            </Link>

            <div className="text-center mb-10">
              <span className="section-tag">
                {pkg.type === "abonelik" ? "Aylık Abonelik" : "Tek Seferlik Ödeme"}
              </span>
              <h1
                className="font-black leading-tight mt-4 mb-3"
                style={{ fontSize: "clamp(28px,4vw,44px)" }}
              >
                Güvenli <span className="gradient-text">Ödeme</span>
              </h1>
              <p className="text-[#8a8a9a] text-[16px]">
                Bilgilerinizi girin, ödeme ekranına yönlendirileceksiniz.
              </p>
            </div>

            {/* Güven rozetleri */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-[12px] text-[#8a8a9a]">
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 256-bit SSL şifreleme</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> PayTR güvencesi</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 3D Secure</span>
            </div>

            {/* Form Card */}
            <div
              className="rounded-2xl p-8"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <CheckoutForm pkg={pkg} />
            </div>

            <p className="text-center text-[12px] text-[#8a8a9a] mt-6">
              Sorun yaşıyorsanız{" "}
              <a
                href="https://wa.me/905520772700"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c084fc] underline underline-offset-2"
              >
                WhatsApp&apos;tan
              </a>{" "}
              veya{" "}
              <a
                href="mailto:markaizicom@gmail.com"
                className="text-[#c084fc] underline underline-offset-2"
              >
                e-posta
              </a>{" "}
              ile ulaşın.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
