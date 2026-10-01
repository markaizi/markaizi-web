"use client";
import { useMemo, useState } from "react";

// Hedeften geriye reklam bütçesi hesabı. Tüm hesap tarayıcıda yapılır,
// hiçbir değer sunucuya gönderilmez. Örnek değerler sektör ortalaması değildir.

type Inputs = {
  hedefSatis: number; // aylık hedef satış adedi
  sepet: number; // ortalama satış tutarı (TL)
  marj: number; // brüt kâr marjı (%)
  adayMaliyet: number; // mesaj / form / arama başına reklam maliyeti (TL)
  donusum: number; // müşteri adayından satışa dönüşüm (%)
};

const PRESETS: { label: string; values: Inputs }[] = [
  { label: "Mobilya mağazası", values: { hedefSatis: 20, sepet: 45000, marj: 30, adayMaliyet: 90, donusum: 2 } },
  { label: "Klinik / estetik", values: { hedefSatis: 30, sepet: 8000, marj: 50, adayMaliyet: 120, donusum: 15 } },
  { label: "E-ticaret", values: { hedefSatis: 200, sepet: 1200, marj: 35, adayMaliyet: 6, donusum: 1.5 } },
];

const FIELDS: { key: keyof Inputs; label: string; hint: string; suffix: string; step: number }[] = [
  { key: "hedefSatis", label: "Aylık hedef satış", hint: "Reklamdan ayda kaç satış istiyorsunuz?", suffix: "adet", step: 1 },
  { key: "sepet", label: "Ortalama satış tutarı", hint: "Bir satışın ortalama cirosu (KDV hariç düşünün).", suffix: "₺", step: 100 },
  { key: "marj", label: "Brüt kâr marjı", hint: "Ürün maliyeti düşüldükten sonra kalan pay.", suffix: "%", step: 1 },
  { key: "adayMaliyet", label: "Müşteri adayı başına maliyet", hint: "Bir mesaj, form, arama ya da tıklamanın reklam maliyeti.", suffix: "₺", step: 1 },
  { key: "donusum", label: "Adaydan satışa dönüşüm", hint: "Gelen 100 adaydan kaçı satın alıyor?", suffix: "%", step: 0.5 },
];

const tl = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺" : "—";
const num = (n: number, d = 0) => (Number.isFinite(n) ? n.toLocaleString("tr-TR", { maximumFractionDigits: d }) : "—");

export default function ReklamButcesiHesaplayici() {
  const [v, setV] = useState<Inputs>(PRESETS[0].values);

  const r = useMemo(() => {
    const oran = v.donusum / 100;
    const marj = v.marj / 100;
    const aday = oran > 0 ? Math.ceil(v.hedefSatis / oran) : NaN;
    const butce = aday * v.adayMaliyet;
    const satisBasina = v.hedefSatis > 0 ? butce / v.hedefSatis : NaN;
    const ciro = v.hedefSatis * v.sepet;
    const roas = butce > 0 ? ciro / butce : NaN;
    const basabas = marj > 0 ? 1 / marj : NaN;
    const kar = ciro * marj - butce;
    const maxSatisMaliyeti = v.sepet * marj;
    let durum: { label: string; color: string; text: string };
    if (!Number.isFinite(roas) || !Number.isFinite(basabas)) {
      durum = { label: "Eksik bilgi", color: "#8a8a9a", text: "Hesap için tüm alanlara sıfırdan büyük bir değer girin." };
    } else if (roas >= basabas * 1.5) {
      durum = { label: "Kârlı görünüyor", color: "#34d399", text: "Reklam maliyeti düşüldükten sonra rahat bir kâr payı kalıyor. Ölçümünüz doğruysa bu model büyütülmeye aday." };
    } else if (roas >= basabas) {
      durum = { label: "İnce marj", color: "#fbbf24", text: "Reklam kendini çıkarıyor ama kâr payı dar. Dönüşüm oranını ya da sepet tutarını artırmak, bütçe artırmaktan daha etkili olur." };
    } else {
      durum = { label: "Zarar ediyor", color: "#f87171", text: "Bu varsayımlarla her satış, reklam maliyetini karşılamıyor. Bütçeyi artırmak zararı büyütür; önce aday maliyetine, dönüşüm oranına ve teklife bakın." };
    }
    return { aday, butce, satisBasina, ciro, roas, basabas, kar, maxSatisMaliyeti, durum };
  }, [v]);

  const set = (key: keyof Inputs, raw: string) => {
    const n = Number(raw.replace(",", "."));
    setV((prev) => ({ ...prev, [key]: Number.isFinite(n) && n >= 0 ? n : 0 }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
      {/* Girdiler */}
      <div className="rounded-2xl p-6 sm:p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8a8a9a] mb-3">Örnek değerlerle başla</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESETS.map((p) => {
            const active = JSON.stringify(p.values) === JSON.stringify(v);
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setV(p.values)}
                aria-pressed={active}
                className="text-[13px] font-semibold px-3.5 min-h-[38px] rounded-full transition-colors"
                style={{
                  border: `1px solid ${active ? "rgba(168,85,247,0.6)" : "var(--border)"}`,
                  background: active ? "rgba(168,85,247,0.14)" : "transparent",
                  color: active ? "#fff" : "#8a8a9a",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={`hb-${f.key}`} className="block text-[14px] font-semibold text-white mb-1">
                {f.label}
              </label>
              <p className="text-[12.5px] text-[#8a8a9a] mb-2">{f.hint}</p>
              <div className="relative">
                <input
                  id={`hb-${f.key}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={f.step}
                  value={Number.isFinite(v[f.key]) ? v[f.key] : 0}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full px-4 py-3 pr-16 rounded-xl text-white tabular-nums"
                  style={{ background: "var(--bg)", border: "1.5px solid var(--border)", fontSize: "16px", minHeight: "48px" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#8a8a9a] pointer-events-none">
                  {f.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-[#666] mt-5 leading-relaxed">
          Örnek değerler yalnızca hesabın nasıl çalıştığını göstermek içindir, sektör ortalaması değildir. Girdiğiniz
          rakamlar tarayıcınızda hesaplanır, hiçbir yere gönderilmez.
        </p>
      </div>

      {/* Sonuçlar */}
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="rounded-2xl p-6 sm:p-7" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8a8a9a] mb-1">Tahmini aylık reklam bütçesi</p>
          <p className="text-[36px] sm:text-[42px] font-black gradient-text leading-tight tabular-nums">{tl(r.butce)}</p>
          <p className="text-[13.5px] text-[#8a8a9a] mt-1">
            {num(r.aday)} müşteri adayı × {tl(v.adayMaliyet)}
          </p>
          <div className="mt-5 flex items-start gap-3 rounded-xl p-4" style={{ background: "var(--bg)", border: `1px solid ${r.durum.color}55` }}>
            <span
              className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: `${r.durum.color}1f`, color: r.durum.color }}
            >
              {r.durum.label}
            </span>
            <p className="text-[13.5px] text-[#c0c0d0] leading-relaxed m-0">{r.durum.text}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {[
            { k: "Beklenen ciro", val: tl(r.ciro) },
            { k: "ROAS", val: Number.isFinite(r.roas) ? num(r.roas, 1) + "×" : "—" },
            { k: "Başabaş ROAS", val: Number.isFinite(r.basabas) ? num(r.basabas, 1) + "×" : "—" },
            { k: "Satış başına reklam maliyeti", val: tl(r.satisBasina) },
            { k: "Satış başına kabul edilebilir en yüksek maliyet", val: tl(r.maxSatisMaliyeti) },
            { k: "Reklam sonrası brüt kâr", val: tl(r.kar), neg: r.kar < 0 },
          ].map((m) => (
            <div key={m.k} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <dt className="text-[12px] text-[#8a8a9a] leading-snug mb-1">{m.k}</dt>
              <dd className="text-[19px] font-black tabular-nums m-0" style={{ color: m.neg ? "#f87171" : "#fff" }}>
                {m.val}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={`https://wa.me/905520772700?text=${encodeURIComponent(
            `Merhaba, reklam bütçesi hesaplayıcısını kullandım. Hedefim ayda ${v.hedefSatis} satış, tahmini bütçe ${tl(r.butce)}. Hesabımı birlikte değerlendirmek istiyorum.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-full"
        >
          Sonucu Uzmanla Değerlendirin →
        </a>
      </div>
    </div>
  );
}
