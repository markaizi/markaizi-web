"use client";

import { useState, FormEvent } from "react";
import { CV_SKILLS } from "@/lib/cv-skills";

const SOSYAL_MEDYA_OPTIONS = [
  "Aktif sosyal medya kullanıcısıyım",
  "TikTok / Instagram akımlarına hakimim",
  "Güncel trendleri yakından takip ediyorum",
  "Daha önce içerik ürettim / üretiyorum",
  "Reels / kısa video formatlarına hakimim",
];

const MEDENI_OPTIONS = ["Bekar", "Evli", "Boşanmış"];

const inputCls = "w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#444] outline-none transition-all";
const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" };
const inputFocusStyle = { outline: "none", borderColor: "rgba(168,85,247,0.5)", boxShadow: "0 0 0 3px rgba(168,85,247,0.08)" };

const toggleActive   = { background: "rgba(168,85,247,0.2)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.5)" };
const toggleInactive = { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" };

function SkillSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <span className="text-[14px] font-semibold text-white">{label}</span>
        <span
          className="text-[12px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}
        >
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="skill-slider w-full"
      />
      <div className="flex justify-between text-[10px] font-semibold text-[#666] mt-1.5 uppercase tracking-wide">
        <span>Başlangıç</span>
        <span>Uzman</span>
      </div>
    </div>
  );
}

export default function CvForm() {
  const [status, setStatus]         = useState<"idle" | "sending" | "done" | "error">("idle");
  const [skills, setSkills] = useState<Record<string, number>>(
    () => Object.fromEntries(CV_SKILLS.map((s) => [s, 1]))
  );
  const [sosyalMedya, setSosyalMedya] = useState<string[]>([]);
  const [medeni, setMedeni]         = useState("");

  function setSkill(skill: string, value: number) {
    setSkills((prev) => ({ ...prev, [skill]: value }));
  }

  function toggleSosyal(p: string) {
    setSosyalMedya((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const get  = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";

    const body = {
      name:           get("name"),
      email:          get("email"),
      phone:          get("phone"),
      age:            get("age"),
      medeni,
      ucretBeklenti:  get("ucretBeklenti"),
      skills,
      sosyalMedya,
      referanslar:    get("referanslar"),
      about:          get("about"),
    };

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("done");
        form.reset();
        setSkills(Object.fromEntries(CV_SKILLS.map((s) => [s, 1])));
        setSosyalMedya([]);
        setMedeni("");
      } else {
        const d = await res.json();
        console.error(d.error);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const labelCls = "block text-[12px] font-bold text-[#8a8a9a] uppercase tracking-wider mb-2";

  return (
    <>
    <div className="rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <h2 className="text-white font-black text-[22px] mb-1">Başvuru Formu</h2>
      <p className="text-[#8a8a9a] text-[13px] mb-8">
        Tüm alanları eksiksiz doldurun. En kısa sürede size dönüş yapacağız.
      </p>

      {status === "done" ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#34d399" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-white font-bold text-[20px] mb-2">Başvurunuz Alındı!</h3>
          <p className="text-[#8a8a9a] text-[14px] max-w-sm mx-auto">
            Başvurunuzu inceledikten sonra sizinle iletişime geçeceğiz. Başarılar dileriz!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Ad Soyad + Yaş */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Ad Soyad *</label>
              <input name="name" required placeholder="Adınız Soyadınız" className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </div>
            <div>
              <label className={labelCls}>Yaş</label>
              <input name="age" type="number" min="18" max="60" placeholder="Örn: 24" className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </div>
          </div>

          {/* E-posta + Telefon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>E-posta *</label>
              <input name="email" type="email" required placeholder="ornek@mail.com" className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </div>
            <div>
              <label className={labelCls}>Telefon *</label>
              <input name="phone" type="tel" required placeholder="05XX XXX XX XX" className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </div>
          </div>

          {/* Medeni Durum + Ücret Beklentisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Medeni Durum</label>
              <div className="flex gap-2">
                {MEDENI_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMedeni(opt)}
                    className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all duration-150"
                    style={medeni === opt ? toggleActive : toggleInactive}
                  >
                    {medeni === opt && "✓ "}{opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Ücret Beklentisi *</label>
              <input name="ucretBeklenti" required placeholder="Örn: 25.000 ₺ / net" className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </div>
          </div>

          {/* Bilgi ve Program Seviyeleri */}
          <div>
            <label className={labelCls}>Bilgi ve Program Seviyeleriniz</label>
            <p className="text-[12px] text-[#666] mb-4">
              Her biri için kendinizi 1 (başlangıç) ile 10 (uzman) arasında değerlendirin.
            </p>
            <div className="space-y-5">
              {CV_SKILLS.map((skill) => (
                <SkillSlider
                  key={skill}
                  label={skill}
                  value={skills[skill]}
                  onChange={(v) => setSkill(skill, v)}
                />
              ))}
            </div>
          </div>

          {/* Referanslar */}
          <div>
            <label className={labelCls}>
              Referanslar{" "}
              <span className="text-[#555] normal-case font-normal">(opsiyonel)</span>
            </label>
            <p className="text-[12px] text-[#666] mb-3">
              Yönettiğiniz Instagram sayfa linkleri, çektiğiniz/kurguladığınız video linkleri vb. varsa paylaşın.
            </p>
            <textarea
              name="referanslar"
              rows={3}
              placeholder="Örn: instagram.com/hesap-adi, youtube.com/watch?v=..."
              className={`${inputCls} resize-none`}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Sosyal Medya Tecrübesi */}
          <div>
            <label className={labelCls}>Sosyal Medya Tecrübeniz</label>
            <p className="text-[12px] text-[#666] mb-3">Uyanlar varsa seçin, birden fazla seçebilirsiniz.</p>
            <div className="flex flex-col gap-2">
              {SOSYAL_MEDYA_OPTIONS.map((opt) => {
                const selected = sosyalMedya.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleSosyal(opt)}
                    className="w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 flex items-center gap-3"
                    style={selected ? toggleActive : toggleInactive}
                  >
                    <span
                      className="w-4 h-4 rounded-lg flex-shrink-0 flex items-center justify-center border transition-all"
                      style={selected
                        ? { background: "#c084fc", borderColor: "#c084fc" }
                        : { background: "transparent", borderColor: "#444" }
                      }
                    >
                      {selected && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="2">
                          <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hakkında */}
          <div>
            <label className={labelCls}>Kendinizi Kısaca Tanıtın *</label>
            <textarea
              name="about"
              required
              rows={6}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {status === "error" && (
            <p className="text-[13px] text-red-400 text-center">
              Bir hata oluştu. Lütfen tekrar deneyin veya{" "}
              <a href="https://wa.me/905520772700" className="underline">WhatsApp&apos;tan yazın</a>.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary w-full py-4 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Gönderiliyor...
              </span>
            ) : "Başvurumu Gönder →"}
          </button>
        </form>
      )}
    </div>
    </>
  );
}
