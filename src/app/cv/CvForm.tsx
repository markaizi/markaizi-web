"use client";

import { useState, FormEvent } from "react";

const PROGRAMS = ["Adobe Premiere", "CapCut", "Photoshop", "Illustrator", "DaVinci Resolve", "After Effects", "Diğer"];

const inputCls = "w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#444] outline-none transition-all";
const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" };
const inputFocusStyle = { outline: "none", borderColor: "rgba(168,85,247,0.5)", boxShadow: "0 0 0 3px rgba(168,85,247,0.08)" };

export default function CvForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [programs, setPrograms] = useState<string[]>([]);
  const [usesAi, setUsesAi] = useState("hayir");

  function toggleProgram(p: string) {
    setPrograms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";

    const body = {
      name:       get("name"),
      email:      get("email"),
      phone:      get("phone"),
      age:        get("age"),
      experience: get("experience"),
      programs,
      usesAi,
      aiTools:    get("aiTools"),
      portfolio:  get("portfolio"),
      about:      get("about"),
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
        setPrograms([]);
        setUsesAi("hayir");
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
    <div className="rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <h2 className="text-white font-black text-[20px] mb-1">Başvuru Formu</h2>
      <p className="text-[#8a8a9a] text-[13px] mb-8">Tüm alanları eksiksiz doldurun. En kısa sürede size dönüş yapacağız.</p>

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

          {/* Kişisel Bilgiler */}
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

          {/* Tecrübe */}
          <div>
            <label className={labelCls}>Video Kurgu / Montaj Tecrübesi *</label>
            <select name="experience" required className={inputCls} style={{ ...inputStyle, cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "40px" }}>
              <option value="" style={{ background: "#0f0f14" }}>Seçiniz</option>
              <option value="Yok (sıfırdan öğrenmeye hazırım)" style={{ background: "#0f0f14" }}>Yok (sıfırdan öğrenmeye hazırım)</option>
              <option value="Başlangıç (1 yıldan az)" style={{ background: "#0f0f14" }}>Başlangıç — 1 yıldan az</option>
              <option value="Orta (1-3 yıl)" style={{ background: "#0f0f14" }}>Orta — 1-3 yıl</option>
              <option value="İleri (3 yıl ve üzeri)" style={{ background: "#0f0f14" }}>İleri — 3 yıl ve üzeri</option>
            </select>
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
                    style={selected
                      ? { background: "rgba(168,85,247,0.2)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.5)" }
                      : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }
                    }
                  >
                    {selected && <span className="mr-1.5">✓</span>}{p}
                  </button>
                );
              })}
            </div>
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
                  style={usesAi === opt.val
                    ? { background: "rgba(168,85,247,0.2)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.5)" }
                    : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }
                  }
                >
                  {usesAi === opt.val && "✓ "}{opt.label}
                </button>
              ))}
            </div>
            {usesAi === "evet" && (
              <input name="aiTools" placeholder="Hangi araçları kullanıyorsunuz? (Örn: Midjourney, ChatGPT, Runway...)"
                className={inputCls} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            )}
          </div>

          {/* Portfolyo */}
          <div>
            <label className={labelCls}>Portfolyo / Demo Video Linki <span className="text-[#555] normal-case font-normal">(opsiyonel)</span></label>
            <input name="portfolio" type="url" placeholder="https://drive.google.com/... veya YouTube linki"
              className={inputCls} style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </div>

          {/* Hakkında */}
          <div>
            <label className={labelCls}>Kendinizi Kısaca Tanıtın *</label>
            <textarea name="about" required rows={5} placeholder="Neden markaizi'de çalışmak istiyorsunuz? Kendinizden ve yeteneklerinizden bahsedin..."
              className={`${inputCls} resize-none`} style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </div>

          {/* Submit */}
          {status === "error" && (
            <p className="text-[13px] text-red-400 text-center">
              Bir hata oluştu. Lütfen tekrar deneyin veya{" "}
              <a href="https://wa.me/905520772700" className="underline">WhatsApp&apos;tan yazın</a>.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary w-full py-4 text-[15px]"
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
  );
}
