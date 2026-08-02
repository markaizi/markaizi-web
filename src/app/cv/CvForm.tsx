"use client";

import { useState, FormEvent } from "react";

const SEVIYE_OPTIONS = ["Başlangıç", "Orta", "İleri", "Uzman"];

const PROGRAMS = [
  "Adobe Premiere",
  "CapCut",
  "Adobe Photoshop",
  "Illustrator",
  "DaVinci Resolve",
  "After Effects",
  "Final Cut",
  "Edits",
  "Canva",
  "Diğer",
];

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

function SeviyeSecici({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {SEVIYE_OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 flex items-center gap-3"
          style={value === opt ? toggleActive : toggleInactive}
        >
          <span
            className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all"
            style={value === opt
              ? { background: "#c084fc", borderColor: "#c084fc" }
              : { background: "transparent", borderColor: "#444" }
            }
          >
            {value === opt && (
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="white">
                <circle cx="5" cy="5" r="3"/>
              </svg>
            )}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function CvForm() {
  const [status, setStatus]         = useState<"idle" | "sending" | "done" | "error">("idle");
  const [montajSeviye, setMontajSeviye] = useState("");
  const [cekimSeviye, setCekimSeviye]   = useState("");
  const [programs, setPrograms]     = useState<string[]>([]);
  const [sosyalMedya, setSosyalMedya] = useState<string[]>([]);
  const [usesAi, setUsesAi]         = useState("hayir");
  const [medeni, setMedeni]         = useState("");

  function toggleProgram(p: string) {
    setPrograms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
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
      montajSeviye,
      cekimSeviye,
      programs,
      sosyalMedya,
      referanslar:    get("referanslar"),
      metaGoogle:     get("metaGoogle"),
      usesAi,
      aiTools:        get("aiTools"),
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
        setMontajSeviye("");
        setCekimSeviye("");
        setPrograms([]);
        setSosyalMedya([]);
        setUsesAi("hayir");
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

          {/* Video Kurgu / Montaj Seviyesi */}
          <div>
            <label className={labelCls}>Video Kurgu / Montaj Seviyesi *</label>
            <SeviyeSecici value={montajSeviye} onChange={setMontajSeviye} />
          </div>

          {/* Video Çekim / Fotoğrafçılık Seviyesi */}
          <div>
            <label className={labelCls}>Video Çekim / Fotoğrafçılık Seviyesi</label>
            <SeviyeSecici value={cekimSeviye} onChange={setCekimSeviye} />
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

          {/* Programlar */}
          <div>
            <label className={labelCls}>Kullandığınız Programlar</label>
            <div className="flex flex-wrap gap-2.5">
              {PROGRAMS.map((p) => {
                const selected = programs.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleProgram(p)}
                    className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-150"
                    style={selected ? toggleActive : toggleInactive}
                  >
                    {selected && <span className="mr-1.5">✓</span>}{p}
                  </button>
                );
              })}
            </div>
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

          {/* Meta & Google Reklam Tecrübesi */}
          <div>
            <label className={labelCls}>
              Meta ve Google Reklam Tecrübeniz{" "}
              <span className="text-[#555] normal-case font-normal">(opsiyonel)</span>
            </label>
            <textarea
              name="metaGoogle"
              rows={4}
              placeholder="Reklam hesabı yönettiniz mi? Hangi platformlarda, nasıl kampanyalar kurdunuz?"
              className={`${inputCls} resize-none`}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Yapay Zeka */}
          <div>
            <label className={labelCls}>Yapay Zeka Araçları Kullanıyor musunuz?</label>
            <div className="flex gap-3 mb-3">
              {[{ val: "hayir", label: "Hayır" }, { val: "evet", label: "Evet, kullanıyorum" }].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setUsesAi(opt.val)}
                  className="flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150"
                  style={usesAi === opt.val ? toggleActive : toggleInactive}
                >
                  {usesAi === opt.val && "✓ "}{opt.label}
                </button>
              ))}
            </div>
            {usesAi === "evet" && (
              <div>
                <p className="text-[12px] text-[#c084fc] mb-2 leading-relaxed">
                  Bu kısım bizim için önemli — lütfen hangilerini, ne amaçla ve nasıl kullandığınızı kısaca anlatın.
                </p>
                <textarea
                  name="aiTools"
                  rows={4}
                  placeholder="Örn: Midjourney ile içerik görseli üretiyorum, ChatGPT ile caption yazıyorum..."
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            )}
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
            disabled={status === "sending" || !montajSeviye}
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
