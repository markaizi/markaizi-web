import type { Metadata } from "next";
import Image from "next/image";
import CvForm from "./CvForm";

export const metadata: Metadata = {
  title: "Kariyer — markaizi",
  description: "markaizi dijital reklam ajansı ekibine katılmak için başvuru formunu doldurun.",
  alternates: { canonical: "https://markaizi.com.tr/cv" },
};

export default function CvPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Üst bar — logo ortalı */}
      <div style={{ background: "rgba(5,5,5,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 24px" }}>
        <div className="flex justify-center">
          <a href="/">
            <Image src="/logo.svg" alt="markaizi" width={140} height={36} priority
              style={{ filter: "brightness(0) invert(1)" }} />
          </a>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 py-12">
        <h1 className="sr-only">markaizi Kariyer Başvurusu</h1>
        <CvForm />
      </div>
    </div>
  );
}
