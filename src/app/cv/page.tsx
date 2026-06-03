import type { Metadata } from "next";
import CvForm from "./CvForm";

export const metadata: Metadata = {
  title: "İş Başvurusu — markaizi | Video Editör & İçerik Üretici",
  description: "markaizi dijital reklam ajansı ekibine katılmak için iş başvurusu formunu doldurun.",
};

export default function CvPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Üst bar */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", padding: "14px 24px" }}>
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <a href="/" className="font-black text-[18px] text-white tracking-tight">markaizi</a>
          <span className="text-white/80 text-[13px] font-medium">İş Başvurusu</span>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 py-12">

        {/* İlan Kartı */}
        <div className="rounded-2xl p-8 mb-10" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {/* Başlık */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="#c084fc" strokeWidth="1.5">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                  Ekibimize Katıl
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                  Erkek Personel
                </span>
              </div>
              <h1 className="text-white font-black text-[22px] leading-tight">Video Editör & İçerik Üretici</h1>
              <p className="text-[#8a8a9a] text-[13px] mt-1">Ankara · Tam Zamanlı · markaizi Dijital Reklam Ajansı</p>
            </div>
          </div>

          {/* Gereksinimler */}
          <div className="mb-6">
            <p className="text-[12px] font-bold text-[#8a8a9a] uppercase tracking-wider mb-3">Aradığımız Kişide Olmasını İstediğimiz Özellikler</p>
            <ul className="flex flex-col gap-3">
              {[
                { icon: "▶", text: "Video kurgu ve montaj tecrübesi olan" },
                { icon: "✦", text: "Yapay zeka araçlarını aktif kullanan" },
                { icon: "Ps", text: "Adobe Premiere / Photoshop / Illustratör programlarını başlangıç seviyesinde kullanabilen" },
                { icon: "✂", text: "CapCut vb. ile sosyal medya reels montajı yapabilen" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-white/85">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc" }}>
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* İş Tanımı */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] font-bold text-[#c084fc] uppercase tracking-wider mb-2">İş Tanımı</p>
            <p className="text-[14px] text-[#8a8a9a] leading-relaxed">
              Sosyal medya videolarının edit ve montajını gerçekleştirmek, yapay zeka araçlarıyla tasarım ve animasyonlar üretmek, planlanan zamanda yayına almak.
            </p>
          </div>
        </div>

        {/* Başvuru Formu */}
        <CvForm />
      </div>
    </div>
  );
}
