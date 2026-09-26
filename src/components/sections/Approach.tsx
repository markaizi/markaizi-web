import VideoCallout from "@/components/VideoCallout";
import { VIDEOS } from "@/lib/video-data";

const CHAIN = ["Reklam", "Kreatif", "Teklif", "Hedef Kitle", "Satış Süreci", "Operasyon"];
const LOOP = ["İçerik üret", "Reklamla doğru kişiye ulaştır", "Veri topla", "Satış sonucunu gör", "Öğren", "Yeniden test et"];

// Ana sayfa: çalışma yaklaşımı (YouTube rehber videosunun özü) + son video.
export default function Approach() {
  const latest = VIDEOS[0];
  return (
    <section id="yaklasimimiz" className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14 reveal">
          <span className="section-tag">Nasıl Çalışıyoruz?</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,40px)" }}>
            Reklam Tek Başına <span className="gradient-text">Satış Yapmaz</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px] leading-relaxed">
            En iyi reklam, üç saat sonra cevaplanan bir mesajda müşteriyi kaybedebilir. En iyi satış ekibi de kimsenin
            izlemediği bir reklamla müşteri bekler. Bu yüzden dijital pazarlamayı birbirinden kopuk kutular olarak değil,
            birbirini etkileyen bir zincir olarak ele alıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="reveal rounded-2xl p-7 sm:p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[18px] font-bold text-white mb-2">Zincirin halkaları</h3>
            <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-5">
              Bir halka zayıfsa sonuç düşer. Sorun her zaman reklamda değildir; bazen teklifte, bazen satış sürecindedir.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {CHAIN.map((c, i) => (
                <span key={c} className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold px-3 py-1.5 rounded-full text-[#c084fc]" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
                    {c}
                  </span>
                  {i < CHAIN.length - 1 && <span className="text-[#555]" aria-hidden="true">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal rounded-2xl p-7 sm:p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[18px] font-bold text-white mb-2">Sürekli dönen bir çember</h3>
            <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-5">
              Tek seferlik kampanya değil; her turda öğrendiğimizi bir sonraki içeriğe ve reklama taşıyoruz.
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {LOOP.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-[14px] text-[#c0c0d0]">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: "var(--grad)" }}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {latest && (
          <div className="reveal max-w-[760px] mx-auto">
            <VideoCallout slug={latest.slug} text="Bu yaklaşımı ve işletmelerin en çok sorduğu soruları videoda anlattık." />
          </div>
        )}
      </div>
    </section>
  );
}
