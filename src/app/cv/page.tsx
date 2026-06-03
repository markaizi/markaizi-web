import type { Metadata } from "next";
import CvForm from "./CvForm";

export const metadata: Metadata = {
  title: "İş Başvurusu — markaizi | Video Editör & İçerik Üretici",
  description: "markaizi dijital reklam ajansı ekibine katılmak için iş başvurusu formunu doldurun.",
};

export default function CvPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Üst bar — sadece logo */}
      <div style={{ background: "rgba(5,5,5,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px" }}>
        <div className="max-w-[720px] mx-auto">
          <a href="/" className="font-black text-[20px] gradient-text">markaizi</a>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 py-12">
        <CvForm />
      </div>
    </div>
  );
}
