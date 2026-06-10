"use client";

import { useState } from "react";

/* ── Types ────────────────────────────────────────────── */
type Answers = {
  services: string[];
  instagramPosts: number;
  instagramContentTypes: string[];
  tiktokSameAsInstagram: string;
  tiktokPosts: number;
  tiktokContentTypes: string[];
  youtubePosts: number;
  youtubeFormat: string;
  youtubeNeedsShoot: string;
  shootingDays: number;
  approvalProcess: string;
  metaBudget: string;
  googleBudget: string;
  tiktokAdsBudget: string;
  websiteOption: string;
};

const DEFAULT: Answers = {
  services: [],
  instagramPosts: 12,
  instagramContentTypes: [],
  tiktokSameAsInstagram: "",
  tiktokPosts: 16,
  tiktokContentTypes: [],
  youtubePosts: 4,
  youtubeFormat: "",
  youtubeNeedsShoot: "",
  shootingDays: 1,
  approvalProcess: "",
  metaBudget: "",
  googleBudget: "",
  tiktokAdsBudget: "",
  websiteOption: "",
};

/* ── Helpers ──────────────────────────────────────────── */
const sv = (a: Answers, s: string) => a.services.includes(s);
const hasContent = (a: Answers) =>
  sv(a, "Instagram & Facebook İçerik") || sv(a, "TikTok İçerik") || sv(a, "YouTube İçerik");
const needsShoot = (a: Answers) =>
  (sv(a, "Instagram & Facebook İçerik") && a.instagramContentTypes.includes("Yerinde video çekimi")) ||
  (sv(a, "TikTok İçerik") && a.tiktokSameAsInstagram !== "Evet" && a.tiktokContentTypes.includes("Yerinde video çekimi")) ||
  (sv(a, "YouTube İçerik") && a.youtubeNeedsShoot === "Evet");
const tiktokDifferent = (a: Answers) =>
  sv(a, "TikTok İçerik") && (!sv(a, "Instagram & Facebook İçerik") || a.tiktokSameAsInstagram === "Hayır");

/* ── Step definitions ─────────────────────────────────── */
const STEPS: { id: string; show: (a: Answers) => boolean }[] = [
  { id: "services",              show: () => true },
  { id: "instagramPosts",        show: (a) => sv(a, "Instagram & Facebook İçerik") },
  { id: "instagramContentTypes", show: (a) => sv(a, "Instagram & Facebook İçerik") },
  { id: "tiktokSameAsInstagram", show: (a) => sv(a, "TikTok İçerik") && sv(a, "Instagram & Facebook İçerik") },
  { id: "tiktokPosts",           show: tiktokDifferent },
  { id: "tiktokContentTypes",    show: tiktokDifferent },
  { id: "youtubePosts",          show: (a) => sv(a, "YouTube İçerik") },
  { id: "youtubeFormat",         show: (a) => sv(a, "YouTube İçerik") },
  { id: "youtubeNeedsShoot",     show: (a) => sv(a, "YouTube İçerik") },
  { id: "shootingDays",          show: needsShoot },
  { id: "approvalProcess",       show: hasContent },
  { id: "metaBudget",            show: (a) => sv(a, "Meta Reklam Yönetimi") },
  { id: "googleBudget",          show: (a) => sv(a, "Google Reklam Yönetimi") },
  { id: "tiktokAdsBudget",       show: (a) => sv(a, "TikTok Reklam Yönetimi") },
  { id: "websiteOption",         show: (a) => sv(a, "Web Sitesi") },
  { id: "result",                show: () => true },
];

/* ── Price algorithm ────────────────────────────────────
   Kalibrasyon noktaları (doğrulandı):
   - Meta tek, 50k bütçe → 15.000 | 100k bütçe → 20.000
   - Instagram tek, 30 post + 4 çekim günü → 25.000
   - Instagram + Meta(75k), 15 post → 30-35k
   - Tam müşteri (60 IG + 30 TikTok + 6 çekim + Meta 300k + SEO) → 80.000
   - Tam müşteri + Google reklam → 90.000
   Mantık: kademeli reklam bütçe ücreti + hizmet sayısı arttıkça
   derinleşen paket indirimi (çok hizmet = daha uygun birim fiyat).
*/
function tieredBudget(b: number): number {
  if (!b || b < 0) return 0;
  const t1 = Math.min(b, 50000) * 0.14;
  const t2 = Math.max(0, Math.min(b, 150000) - 50000) * 0.1;
  const t3 = Math.max(0, b - 150000) * 0.05;
  return t1 + t2 + t3;
}

function calcPrice(a: Answers): { min: number; max: number; notes: string[] } {
  let base = 0;
  const notes: string[] = [];
  const n = a.services.length;

  if (sv(a, "Instagram & Facebook İçerik")) {
    const posts = Math.max(1, a.instagramPosts || 12);
    base += 5900 + posts * 250;
    if (a.instagramContentTypes.includes("Yapay zeka videoları")) base += 2500;
  }

  if (sv(a, "TikTok İçerik")) {
    if (a.tiktokSameAsInstagram === "Evet") {
      base += 4000; // Instagram içerikleri repurpose ediliyor
    } else {
      const posts = Math.max(1, a.tiktokPosts || 16);
      base += 4000 + posts * 180;
      if (a.tiktokContentTypes.includes("Yapay zeka videoları")) base += 1500;
    }
  }

  if (sv(a, "YouTube İçerik")) {
    const vids = Math.max(1, a.youtubePosts || 4);
    base += 8000 + vids * 1500;
    if (a.youtubeFormat === "Uzun format" || a.youtubeFormat === "Her ikisi") base += 3000;
  }

  if (needsShoot(a) && a.shootingDays > 0) {
    base += a.shootingDays * 2900;
  }

  if (a.approvalProcess === "Paylaşım öncesi onay vermek istiyorum") base += 1500;
  if (a.approvalProcess === "Her içerikte revize süreci istiyorum") base += 3500;

  if (sv(a, "Meta Reklam Yönetimi")) {
    base += 8000 + tieredBudget(parseInt(a.metaBudget) || 0);
    if (a.metaBudget) notes.push(`Meta reklam bütçesi aylık ${a.metaBudget} TL — ayrıca ödenir.`);
  }
  if (sv(a, "Google Reklam Yönetimi")) {
    base += 15000 + tieredBudget(parseInt(a.googleBudget) || 0);
    if (a.googleBudget) notes.push(`Google reklam bütçesi aylık ${a.googleBudget} TL — ayrıca ödenir.`);
  }
  if (sv(a, "TikTok Reklam Yönetimi")) {
    base += 5000 + tieredBudget(parseInt(a.tiktokAdsBudget) || 0);
    if (a.tiktokAdsBudget) notes.push(`TikTok reklam bütçesi aylık ${a.tiktokAdsBudget} TL — ayrıca ödenir.`);
  }

  if (sv(a, "Web Sitesi")) {
    if (a.websiteOption === "Var, SEO + yönetim") base += 5000;
    else if (a.websiteOption === "Var, yönetim (SEO yok)") base += 3000;
    else if (a.websiteOption === "Yok, yapılacak + SEO") {
      base += 5000;
      notes.push("Web sitesi yapımı için ayrıca tek seferlik fiyat oluşturulacak.");
    } else if (a.websiteOption === "Yok, yapılacak (SEO yok)") {
      base += 3000;
      notes.push("Web sitesi yapımı için ayrıca tek seferlik fiyat oluşturulacak.");
    }
  }

  // Paket indirimi: hizmet sayısı arttıkça birim fiyat düşer
  const discount = Math.max(0.78, 1 - (n - 1) * 0.0344);
  base = base * discount;

  return {
    min: Math.round(base / 1000) * 1000,
    max: Math.round((base * 1.15) / 1000) * 1000,
    notes,
  };
}

function fmt(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

/* ── Component ────────────────────────────────────────── */
export default function PriceCalculator() {
  const [answers, setAnswers] = useState<Answers>(DEFAULT);
  const [stepIndex, setStepIndex] = useState(0);

  const visible = STEPS.filter((s) => s.show(answers));
  const current = visible[stepIndex];

  function next() { if (stepIndex < visible.length - 1) setStepIndex((i) => i + 1); }
  function prev() { if (stepIndex > 0) setStepIndex((i) => i - 1); }

  function toggleMulti(key: "services" | "instagramContentTypes" | "tiktokContentTypes", val: string) {
    setAnswers((a) => {
      const arr = a[key] as string[];
      return { ...a, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  const canProceed = (() => {
    if (!current) return false;
    switch (current.id) {
      case "services":              return answers.services.length > 0;
      case "instagramPosts":        return answers.instagramPosts > 0;
      case "instagramContentTypes": return answers.instagramContentTypes.length > 0;
      case "tiktokSameAsInstagram": return answers.tiktokSameAsInstagram !== "";
      case "tiktokPosts":           return answers.tiktokPosts > 0;
      case "tiktokContentTypes":    return answers.tiktokContentTypes.length > 0;
      case "youtubePosts":          return answers.youtubePosts > 0;
      case "youtubeFormat":         return answers.youtubeFormat !== "";
      case "youtubeNeedsShoot":     return answers.youtubeNeedsShoot !== "";
      case "shootingDays":          return answers.shootingDays > 0;
      case "approvalProcess":       return answers.approvalProcess !== "";
      case "websiteOption":         return answers.websiteOption !== "";
      default:                      return true;
    }
  })();

  const { min, max, notes } = calcPrice(answers);
  const waMsg = encodeURIComponent(
    `Merhaba! Fiyat hesaplayıcıdan tahmini aldım: ${fmt(min)} – ${fmt(max)}/ay\n\nDetayları görüşmek istiyorum.`
  );

  const progress = stepIndex / (visible.length - 1);
  const isResult = current?.id === "result";

  return (
    <div className="max-w-[640px] mx-auto">
      {!isResult && (
        <div className="mb-8">
          <div className="flex justify-between text-[12px] text-[#8a8a9a] mb-2">
            <span>Adım {stepIndex + 1} / {visible.length - 1}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: "var(--grad)" }}
            />
          </div>
        </div>
      )}

      <div className="rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

        {current?.id === "services" && (
          <Multi
            label="Ne tür hizmet(ler) istiyorsunuz?"
            hint="Birden fazla seçebilirsiniz"
            options={[
              "Instagram & Facebook İçerik",
              "TikTok İçerik",
              "YouTube İçerik",
              "Meta Reklam Yönetimi",
              "Google Reklam Yönetimi",
              "TikTok Reklam Yönetimi",
              "Web Sitesi",
            ]}
            selected={answers.services}
            onToggle={(v) => toggleMulti("services", v)}
          />
        )}

        {current?.id === "instagramPosts" && (
          <Number
            label="Instagram'da aylık kaç paylaşım istiyorsunuz?"
            value={answers.instagramPosts}
            onChange={(v) => setAnswers((a) => ({ ...a, instagramPosts: v }))}
          />
        )}

        {current?.id === "instagramContentTypes" && (
          <Multi
            label="İçerik türümüz ne olacak? (Instagram)"
            hint="Birden fazla seçebilirsiniz"
            options={["Görsel/post tasarımı", "Yapay zeka videoları", "Yerinde video çekimi"]}
            selected={answers.instagramContentTypes}
            onToggle={(v) => toggleMulti("instagramContentTypes", v)}
          />
        )}

        {current?.id === "tiktokSameAsInstagram" && (
          <Single
            label="TikTok içeriklerim Instagram'dan farklı olsun"
            hint="Farklı seçilirse TikTok için ayrı içerik üretilir."
            options={["Evet, farklı içerik üretin", "Hayır, Instagram içeriklerini repurpose edin"]}
            selected={answers.tiktokSameAsInstagram}
            onSelect={(v) => setAnswers((a) => ({
              ...a,
              tiktokSameAsInstagram: v === "Evet, farklı içerik üretin" ? "Hayır" : "Evet",
            }))}
          />
        )}

        {current?.id === "tiktokPosts" && (
          <Number
            label="TikTok'ta aylık kaç paylaşım istiyorsunuz?"
            value={answers.tiktokPosts}
            onChange={(v) => setAnswers((a) => ({ ...a, tiktokPosts: v }))}
          />
        )}

        {current?.id === "tiktokContentTypes" && (
          <Multi
            label="TikTok içerik türü ne olacak?"
            hint="Birden fazla seçebilirsiniz"
            options={["Görsel/post tasarımı", "Yapay zeka videoları", "Yerinde video çekimi"]}
            selected={answers.tiktokContentTypes}
            onToggle={(v) => toggleMulti("tiktokContentTypes", v)}
          />
        )}

        {current?.id === "youtubePosts" && (
          <Number
            label="YouTube'da aylık kaç video istiyorsunuz?"
            value={answers.youtubePosts}
            onChange={(v) => setAnswers((a) => ({ ...a, youtubePosts: v }))}
          />
        )}

        {current?.id === "youtubeFormat" && (
          <Single
            label="Video formatı nasıl olacak?"
            options={["Shorts (60 sn altı)", "Uzun format", "Her ikisi"]}
            selected={answers.youtubeFormat}
            onSelect={(v) => setAnswers((a) => ({ ...a, youtubeFormat: v }))}
          />
        )}

        {current?.id === "youtubeNeedsShoot" && (
          <Single
            label="YouTube videoları için çekim günü gerekiyor mu?"
            options={["Evet, yerinde çekim yapılacak", "Hayır, stok/hazır materyal kullanılacak"]}
            selected={answers.youtubeNeedsShoot}
            onSelect={(v) => setAnswers((a) => ({
              ...a,
              youtubeNeedsShoot: v.startsWith("Evet") ? "Evet" : "Hayır",
            }))}
          />
        )}

        {current?.id === "shootingDays" && (
          <Number
            label="Aylık kaç çekim günü talep ediyorsunuz?"
            hint="Tüm platformlar için toplam gün sayısı"
            value={answers.shootingDays}
            onChange={(v) => setAnswers((a) => ({ ...a, shootingDays: v }))}
          />
        )}

        {current?.id === "approvalProcess" && (
          <Single
            label="Onay süreciniz nasıl olacak?"
            options={[
              "İçerikleri direk paylaş",
              "Paylaşım öncesi onay vermek istiyorum",
              "Her içerikte revize süreci istiyorum",
            ]}
            selected={answers.approvalProcess}
            onSelect={(v) => setAnswers((a) => ({ ...a, approvalProcess: v }))}
          />
        )}

        {current?.id === "metaBudget" && (
          <Budget
            label="Aylık Meta reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.metaBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, metaBudget: v }))}
          />
        )}

        {current?.id === "googleBudget" && (
          <Budget
            label="Aylık Google reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.googleBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, googleBudget: v }))}
          />
        )}

        {current?.id === "tiktokAdsBudget" && (
          <Budget
            label="Aylık TikTok reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.tiktokAdsBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, tiktokAdsBudget: v }))}
          />
        )}

        {current?.id === "websiteOption" && (
          <Single
            label="Web sitesi durumunuz?"
            options={[
              "Var, SEO + yönetim",
              "Var, yönetim (SEO yok)",
              "Yok, yapılacak + SEO",
              "Yok, yapılacak (SEO yok)",
            ]}
            selected={answers.websiteOption}
            onSelect={(v) => setAnswers((a) => ({ ...a, websiteOption: v }))}
          />
        )}

        {current?.id === "result" && (
          <Result
            min={min} max={max} notes={notes} waMsg={waMsg}
            onReset={() => { setAnswers(DEFAULT); setStepIndex(0); }}
          />
        )}
      </div>

      {!isResult && (
        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="btn btn-outline disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ padding: "12px 28px" }}
          >
            ← Geri
          </button>
          <button
            onClick={next}
            disabled={!canProceed}
            className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {stepIndex === visible.length - 2 ? "Fiyatı Hesapla →" : "İleri →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────── */

function Multi({ label, hint, options, selected, onToggle }: {
  label: string; hint?: string; options: string[];
  selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-1 leading-snug">{label}</h3>
      {hint && <p className="text-[12px] text-[#c084fc] font-semibold uppercase tracking-widest mb-5">{hint}</p>}
      {!hint && <div className="mb-5" />}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button key={opt} onClick={() => onToggle(opt)}
              className="flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: on ? "rgba(168,85,247,0.12)" : "var(--bg-alt)",
                border: on ? "1px solid rgba(168,85,247,0.5)" : "1px solid var(--border)",
              }}
            >
              <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  background: on ? "var(--grad)" : "transparent",
                  border: on ? "none" : "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {on && (
                  <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                    <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={on ? "text-white font-medium" : "text-[#c0c0d0]"}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Single({ label, hint, options, selected, onSelect }: {
  label: string; hint?: string; options: string[];
  selected: string; onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint ? <p className="text-[13px] text-[#8a8a9a] mb-5">{hint}</p> : <div className="mb-5" />}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const on = selected === opt;
          return (
            <button key={opt} onClick={() => onSelect(opt)}
              className="flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: on ? "rgba(168,85,247,0.12)" : "var(--bg-alt)",
                border: on ? "1px solid rgba(168,85,247,0.5)" : "1px solid var(--border)",
              }}
            >
              <span className="w-5 h-5 rounded-full flex-shrink-0 transition-all"
                style={{
                  background: on ? "var(--grad)" : "transparent",
                  border: on ? "none" : "2px solid rgba(255,255,255,0.2)",
                  boxShadow: on ? "0 0 10px rgba(168,85,247,0.4)" : "none",
                }}
              />
              <span className={on ? "text-white font-medium" : "text-[#c0c0d0]"}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Number({ label, hint, value, onChange }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint ? <p className="text-[13px] text-[#8a8a9a] mb-5">{hint}</p> : <div className="mb-5" />}
      <div className="flex items-center gap-4">
        <button onClick={() => onChange(Math.max(1, value - 1))}
          className="w-12 h-12 rounded-xl text-xl font-bold flex items-center justify-center hover:opacity-80 transition-all"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
        >−</button>
        <input
          type="number" min={1} max={365} value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 h-12 rounded-xl text-center text-xl font-bold outline-none"
          style={{ background: "var(--bg-alt)", border: "1px solid rgba(168,85,247,0.4)", color: "#fff" }}
        />
        <button onClick={() => onChange(value + 1)}
          className="w-12 h-12 rounded-xl text-xl font-bold flex items-center justify-center hover:opacity-80 transition-all"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
        >+</button>
      </div>
    </div>
  );
}

function Budget({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint && (
        <p className="text-[13px] mb-5 px-4 py-3 rounded-xl"
          style={{ background: "rgba(168,85,247,0.08)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
          {hint}
        </p>
      )}
      {!hint && <div className="mb-5" />}
      <div className="relative">
        <input
          type="number" placeholder="Örn. 50000" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 px-5 pr-16 rounded-xl text-[18px] font-semibold outline-none"
          style={{ background: "var(--bg-alt)", border: "1px solid rgba(168,85,247,0.4)", color: "#fff" }}
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8a8a9a] font-medium">TL</span>
      </div>
      <p className="text-[12px] text-[#8a8a9a] mt-2">Belirtmek istemiyorsanız boş bırakabilirsiniz</p>
    </div>
  );
}

function Result({ min, max, notes, waMsg, onReset }: {
  min: number; max: number; notes: string[]; waMsg: string; onReset: () => void;
}) {
  return (
    <div className="text-center">
      <div className="section-tag mx-auto w-fit mb-4">Tahmini Fiyat</div>
      <h2 className="font-black text-[36px] leading-tight mb-2">
        <span className="gradient-text">{fmt(min)} – {fmt(max)}</span>
      </h2>
      <p className="text-[14px] text-[#8a8a9a] mb-6">aylık yönetim ücreti (KDV hariç)</p>
      {notes.length > 0 && (
        <div className="text-left rounded-xl p-4 mb-6 space-y-2"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
          {notes.map((n, i) => (
            <p key={i} className="text-[13px] text-[#c0c0d0] flex gap-2">
              <span className="text-[#c084fc] mt-0.5">•</span>{n}
            </p>
          ))}
        </div>
      )}
      <p className="text-[13px] text-[#8a8a9a] mb-8 leading-relaxed">
        Bu fiyat seçimlerinize göre hesaplanan bir tahmindir. Kesin teklif için bizimle iletişime geçin.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`https://wa.me/905520772700?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
          className="btn btn-primary">
          WhatsApp ile Teklif Al
        </a>
        <button onClick={onReset} className="btn btn-outline">
          Yeniden Hesapla
        </button>
      </div>
    </div>
  );
}
