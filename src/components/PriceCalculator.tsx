"use client";

import { useState } from "react";

type Answers = {
  platforms: string[];
  instagramPosts: number;
  contentTypes: string[];
  shootingDays: number;
  approvalProcess: string;
  metaAds: string;
  metaBudget: string;
  googleAds: string;
  googleBudget: string;
  websiteOption: string;
  tiktokDifferent: string;
  tiktokAds: string;
  tiktokBudget: string;
};

const DEFAULT: Answers = {
  platforms: [],
  instagramPosts: 12,
  contentTypes: [],
  shootingDays: 1,
  approvalProcess: "",
  metaAds: "",
  metaBudget: "",
  googleAds: "",
  googleBudget: "",
  websiteOption: "",
  tiktokDifferent: "",
  tiktokAds: "",
  tiktokBudget: "",
};

function calcPrice(a: Answers): { min: number; max: number; notes: string[] } {
  let base = 15000;
  const notes: string[] = [];

  if (a.platforms.includes("TikTok")) base += 3000;
  if (a.platforms.includes("Youtube")) base += 7000;
  if (a.platforms.includes("Website")) base += 2000;

  const posts = a.instagramPosts || 0;
  if (posts >= 25) base += 9000;
  else if (posts >= 17) base += 5000;
  else if (posts >= 9) base += 2500;

  if (a.contentTypes.includes("Yapay zeka videoları")) base += 4000;
  if (a.contentTypes.includes("Yerinde video çekimi")) {
    const days = a.shootingDays || 1;
    if (days >= 4) base += 13000;
    else if (days === 3) base += 9000;
    else if (days === 2) base += 6000;
    else base += 3500;
  }

  if (a.approvalProcess === "Paylaşım öncesi onay vermek istiyorum") base += 1500;
  if (a.approvalProcess === "Her içerikte revize süreci istiyorum") base += 4000;

  if (a.metaAds === "Evet") base += 5000;
  if (a.googleAds === "Evet") base += 5000;

  if (a.tiktokDifferent === "Evet") base += 4000;
  if (a.tiktokAds === "Evet") base += 3000;

  if (a.websiteOption === "Var, SEO istiyorum") {
    base += 4000;
  } else if (a.websiteOption === "Yok, yapılacak + SEO") {
    notes.push("Web sitesi yapımı için ayrıca fiyatlandırma oluşturulacak.");
  } else if (a.websiteOption === "Yok, yapılacak SEO yok") {
    notes.push("Web sitesi yapımı için ayrıca fiyatlandırma oluşturulacak.");
  }

  if (a.metaAds === "Evet" && a.metaBudget) {
    notes.push(`Meta reklam bütçesi aylık ${a.metaBudget} TL (ayrıca ödenir).`);
  }
  if (a.googleAds === "Evet" && a.googleBudget) {
    notes.push(`Google reklam bütçesi aylık ${a.googleBudget} TL (ayrıca ödenir).`);
  }
  if (a.tiktokAds === "Evet" && a.tiktokBudget) {
    notes.push(`TikTok reklam bütçesi aylık ${a.tiktokBudget} TL (ayrıca ödenir).`);
  }

  return { min: base, max: Math.round(base * 1.15), notes };
}

function fmt(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

type Step = {
  id: keyof Answers | "result";
  show: (a: Answers) => boolean;
};

const STEPS: Step[] = [
  { id: "platforms", show: () => true },
  { id: "instagramPosts", show: () => true },
  { id: "contentTypes", show: () => true },
  { id: "shootingDays", show: (a) => a.contentTypes.includes("Yerinde video çekimi") },
  { id: "approvalProcess", show: () => true },
  { id: "metaAds", show: () => true },
  { id: "metaBudget", show: (a) => a.metaAds === "Evet" },
  { id: "googleAds", show: () => true },
  { id: "googleBudget", show: (a) => a.googleAds === "Evet" },
  { id: "websiteOption", show: () => true },
  { id: "tiktokDifferent", show: (a) => a.platforms.includes("TikTok") },
  { id: "tiktokAds", show: (a) => a.platforms.includes("TikTok") },
  { id: "tiktokBudget", show: (a) => a.platforms.includes("TikTok") && a.tiktokAds === "Evet" },
  { id: "result", show: () => true },
];

function getVisibleSteps(a: Answers) {
  return STEPS.filter((s) => s.show(a));
}

export default function PriceCalculator() {
  const [answers, setAnswers] = useState<Answers>(DEFAULT);
  const [stepIndex, setStepIndex] = useState(0);

  const visibleSteps = getVisibleSteps(answers);
  const currentStep = visibleSteps[stepIndex];

  function next() {
    if (stepIndex < visibleSteps.length - 1) setStepIndex((i) => i + 1);
  }
  function prev() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function toggleMulti(key: "platforms" | "contentTypes", val: string) {
    setAnswers((a) => {
      const arr = a[key];
      return {
        ...a,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  }

  const progress = ((stepIndex) / (visibleSteps.length - 1)) * 100;
  const { min, max, notes } = calcPrice(answers);

  const canProceed = (() => {
    if (!currentStep) return false;
    const id = currentStep.id;
    if (id === "platforms") return answers.platforms.length > 0;
    if (id === "instagramPosts") return answers.instagramPosts > 0;
    if (id === "contentTypes") return answers.contentTypes.length > 0;
    if (id === "shootingDays") return answers.shootingDays > 0;
    if (id === "approvalProcess") return answers.approvalProcess !== "";
    if (id === "metaAds") return answers.metaAds !== "";
    if (id === "metaBudget") return true;
    if (id === "googleAds") return answers.googleAds !== "";
    if (id === "googleBudget") return true;
    if (id === "websiteOption") return answers.websiteOption !== "";
    if (id === "tiktokDifferent") return answers.tiktokDifferent !== "";
    if (id === "tiktokAds") return answers.tiktokAds !== "";
    if (id === "tiktokBudget") return true;
    if (id === "result") return true;
    return true;
  })();

  const waMsg = encodeURIComponent(
    `Merhaba! Fiyat hesaplayıcıdan tahmini aldım: ${fmt(min)} – ${fmt(max)}/ay\n\nDetayları görüşmek istiyorum.`
  );

  return (
    <div className="max-w-[640px] mx-auto">
      {/* Progress bar */}
      {currentStep?.id !== "result" && (
        <div className="mb-8">
          <div className="flex justify-between text-[12px] text-[#8a8a9a] mb-2">
            <span>Adım {stepIndex + 1} / {visibleSteps.length - 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "var(--surface-2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--grad)" }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div
        className="rounded-2xl p-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {currentStep?.id === "platforms" && (
          <StepMulti
            label="Hangi platformlar yönetilecek?"
            options={["Instagram & Facebook", "TikTok", "Youtube", "Website"]}
            selected={answers.platforms}
            onToggle={(v) => toggleMulti("platforms", v)}
          />
        )}

        {currentStep?.id === "instagramPosts" && (
          <StepNumber
            label="Instagram'da aylık kaç paylaşım istiyorsunuz?"
            hint="Ortalama değer girebilirsiniz (örn. 12)"
            value={answers.instagramPosts}
            onChange={(v) => setAnswers((a) => ({ ...a, instagramPosts: v }))}
          />
        )}

        {currentStep?.id === "contentTypes" && (
          <StepMulti
            label="İçerik türümüz ne olacak?"
            options={["Yalnızca görsel tasarımı", "Yapay zeka videoları", "Yerinde video çekimi"]}
            selected={answers.contentTypes}
            onToggle={(v) => toggleMulti("contentTypes", v)}
          />
        )}

        {currentStep?.id === "shootingDays" && (
          <StepNumber
            label="Aylık kaç çekim günü talep ediyorsunuz?"
            hint="Stüdyo veya lokasyon çekimi için gün sayısı"
            value={answers.shootingDays}
            onChange={(v) => setAnswers((a) => ({ ...a, shootingDays: v }))}
          />
        )}

        {currentStep?.id === "approvalProcess" && (
          <StepSingle
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

        {currentStep?.id === "metaAds" && (
          <StepSingle
            label="Meta reklamları yönetilecek mi?"
            hint="Instagram & Facebook reklam kampanyaları"
            options={["Evet", "Hayır"]}
            selected={answers.metaAds}
            onSelect={(v) => setAnswers((a) => ({ ...a, metaAds: v }))}
          />
        )}

        {currentStep?.id === "metaBudget" && (
          <StepBudget
            label="Aylık Meta reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.metaBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, metaBudget: v }))}
          />
        )}

        {currentStep?.id === "googleAds" && (
          <StepSingle
            label="Google reklamları yönetilecek mi?"
            hint="Search, Display ve YouTube kampanyaları"
            options={["Evet", "Hayır"]}
            selected={answers.googleAds}
            onSelect={(v) => setAnswers((a) => ({ ...a, googleAds: v }))}
          />
        )}

        {currentStep?.id === "googleBudget" && (
          <StepBudget
            label="Aylık Google reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.googleBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, googleBudget: v }))}
          />
        )}

        {currentStep?.id === "websiteOption" && (
          <StepSingle
            label="Web sitesi istiyormusunuz?"
            options={[
              "Var, SEO istiyorum",
              "Yok, yapılacak + SEO",
              "Yok, yapılacak SEO yok",
            ]}
            selected={answers.websiteOption}
            onSelect={(v) => setAnswers((a) => ({ ...a, websiteOption: v }))}
          />
        )}

        {currentStep?.id === "tiktokDifferent" && (
          <StepSingle
            label="TikTok içeriklerim Instagram'dan farklı olsun"
            hint="Farklı içerik seçerseniz TikTok için ayrıca içerik üretilir."
            options={["Evet", "Hayır"]}
            selected={answers.tiktokDifferent}
            onSelect={(v) => setAnswers((a) => ({ ...a, tiktokDifferent: v }))}
          />
        )}

        {currentStep?.id === "tiktokAds" && (
          <StepSingle
            label="TikTok reklamları verilecek mi?"
            options={["Evet", "Hayır"]}
            selected={answers.tiktokAds}
            onSelect={(v) => setAnswers((a) => ({ ...a, tiktokAds: v }))}
          />
        )}

        {currentStep?.id === "tiktokBudget" && (
          <StepBudget
            label="Aylık TikTok reklam bütçeniz ne kadar?"
            hint="Bu tutar reklam platformuna ayrıca ödenir, yönetim ücretine dahil değildir."
            value={answers.tiktokBudget}
            onChange={(v) => setAnswers((a) => ({ ...a, tiktokBudget: v }))}
          />
        )}

        {currentStep?.id === "result" && (
          <ResultStep min={min} max={max} notes={notes} waMsg={waMsg} onReset={() => {
            setAnswers(DEFAULT);
            setStepIndex(0);
          }} />
        )}
      </div>

      {/* Navigation */}
      {currentStep?.id !== "result" && (
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
            {stepIndex === visibleSteps.length - 2 ? "Fiyatı Hesapla →" : "İleri →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────── */

function StepMulti({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[12px] text-[#c084fc] font-semibold uppercase tracking-widest mb-2">
        Çoklu seçim yapabilirsiniz
      </p>
      <h3 className="font-bold text-[22px] mb-6 leading-snug">{label}</h3>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: active ? "rgba(168,85,247,0.12)" : "var(--bg-alt)",
                border: active ? "1px solid rgba(168,85,247,0.5)" : "1px solid var(--border)",
              }}
            >
              <span
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  background: active ? "var(--grad)" : "transparent",
                  border: active ? "none" : "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {active && (
                  <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                    <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={active ? "text-white font-medium" : "text-[#c0c0d0]"}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSingle({
  label,
  hint,
  options,
  selected,
  onSelect,
}: {
  label: string;
  hint?: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint && <p className="text-[13px] text-[#8a8a9a] mb-5">{hint}</p>}
      {!hint && <div className="mb-5" />}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className="flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: active ? "rgba(168,85,247,0.12)" : "var(--bg-alt)",
                border: active ? "1px solid rgba(168,85,247,0.5)" : "1px solid var(--border)",
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 transition-all"
                style={{
                  background: active ? "var(--grad)" : "transparent",
                  border: active ? "none" : "2px solid rgba(255,255,255,0.2)",
                  boxShadow: active ? "0 0 10px rgba(168,85,247,0.4)" : "none",
                }}
              />
              <span className={active ? "text-white font-medium" : "text-[#c0c0d0]"}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepNumber({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint && <p className="text-[13px] text-[#8a8a9a] mb-5">{hint}</p>}
      {!hint && <div className="mb-5" />}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-12 h-12 rounded-xl text-xl font-bold transition-all hover:opacity-80 flex items-center justify-center"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={90}
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 h-12 rounded-xl text-center text-xl font-bold outline-none"
          style={{
            background: "var(--bg-alt)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#fff",
          }}
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-12 h-12 rounded-xl text-xl font-bold transition-all hover:opacity-80 flex items-center justify-center"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepBudget({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-bold text-[22px] mb-2 leading-snug">{label}</h3>
      {hint && (
        <p className="text-[13px] mb-5 px-4 py-3 rounded-xl" style={{ background: "rgba(168,85,247,0.08)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
          {hint}
        </p>
      )}
      {!hint && <div className="mb-5" />}
      <div className="relative">
        <input
          type="number"
          placeholder="Örn. 10000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 px-5 pr-16 rounded-xl text-[18px] font-semibold outline-none"
          style={{
            background: "var(--bg-alt)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#fff",
          }}
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8a8a9a] font-medium">TL</span>
      </div>
      <p className="text-[12px] text-[#8a8a9a] mt-2">Belirtmek istemiyorsanız boş bırakabilirsiniz</p>
    </div>
  );
}

function ResultStep({
  min,
  max,
  notes,
  waMsg,
  onReset,
}: {
  min: number;
  max: number;
  notes: string[];
  waMsg: string;
  onReset: () => void;
}) {
  return (
    <div className="text-center">
      <div className="section-tag mx-auto w-fit mb-4">Tahmini Fiyat</div>
      <h2 className="font-black text-[36px] leading-tight mb-2">
        <span className="gradient-text">{fmt(min)} – {fmt(max)}</span>
      </h2>
      <p className="text-[14px] text-[#8a8a9a] mb-6">aylık yönetim ücreti (KDV hariç)</p>

      {notes.length > 0 && (
        <div
          className="text-left rounded-xl p-4 mb-6 space-y-2"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
        >
          {notes.map((n, i) => (
            <p key={i} className="text-[13px] text-[#c0c0d0] flex gap-2">
              <span className="text-[#c084fc] mt-0.5">•</span>
              {n}
            </p>
          ))}
        </div>
      )}

      <p className="text-[13px] text-[#8a8a9a] mb-8 leading-relaxed">
        Bu fiyat seçimlerinize göre hesaplanan bir tahmindir. Kesin teklif için bizimle iletişime geçin.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://wa.me/905520772700?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          WhatsApp ile Teklif Al
        </a>
        <button onClick={onReset} className="btn btn-outline">
          Yeniden Hesapla
        </button>
      </div>
    </div>
  );
}
