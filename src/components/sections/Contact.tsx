"use client";
import { useState, FormEvent } from "react";

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://instagram.com/markaizicom",
    svg: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#8a8a9a" }}><path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" strokeWidth="1.5"/><path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="#8a8a9a"/></svg>,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@markaizicom",
    svg: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#8a8a9a" }}><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  // Facebook ve LinkedIn ikonları href="#" ile duruyordu — tıklayınca boş sekme
  // açıyorlardı. Gerçek profil adresleri hazır olduğunda buraya eklenebilir.
];

const HOURS = [
  { day: "Pazartesi — Cuma", time: "10:00 — 20:00" },
  { day: "Cumartesi",        time: "14:00 — 19:00" },
  { day: "Pazar",            time: "Kapalı" },
];

const CONTACT_ITEMS = [
  {
    label: "Telefon",
    value: "+90 (552) 077 27 00",
    href: "tel:+905520772700",
    svg: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: "E-posta",
    value: "markaizicom@gmail.com",
    href: "mailto:markaizicom@gmail.com",
    svg: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: "Adres",
    value: "Zübeyde Hanım Mah. Elif Sok. No:7/106 2. Kat, Sütçü Kemal İş Merkezi, Ankara",
    href: "https://maps.google.com/?q=Zübeyde+Hanım+Mahallesi+Elif+Sokak+No:7+Ankara",
    svg: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth="1.5"/><circle cx="12" cy="10" r="3" strokeWidth="1.5"/></svg>,
  },
];

const GENERIC_ERROR = "Bir hata oluştu, lütfen tekrar deneyin veya doğrudan e-posta gönderin.";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState(GENERIC_ERROR);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(GENERIC_ERROR);

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      phone:   (form.elements.namedItem("phone")   as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("done");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // API "Geçersiz e-posta adresi." gibi net mesajlar döndürüyor —
        // genel metin yerine onu göster ki kullanıcı neyi düzelteceğini bilsin.
        const payload = await res.json().catch(() => null);
        setErrorMsg(typeof payload?.error === "string" ? payload.error : GENERIC_ERROR);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 6000);
      }
    } catch {
      setErrorMsg("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <section id="iletisim" className="pt-12 pb-24" style={{
      backgroundColor: "#131320",
      backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
      backgroundSize: "44px 44px",
    }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">İletişim</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            Projenizi <span className="gradient-text">Konuşalım</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            Size özel ücretsiz danışmanlık için formu doldurun, 24 saat içinde size ulaşalım.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 items-start">

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            /* p-6 sm:p-10: mobilde 40px iç boşluk 375px ekranda içerik
               alanını 247px'e düşürüyordu. */
            className="reveal rounded-2xl p-6 sm:p-10"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <Field label="Ad Soyad" id="name" type="text" placeholder="Ahmet Yılmaz" required />
              <Field label="E-posta" id="email" type="email" placeholder="ahmet@sirket.com" required />
            </div>
            <div className="mb-5">
              <Field label="Telefon" id="phone" type="tel" placeholder="+90 552 077 27 00" />
            </div>
            <div className="mb-5">
              <label htmlFor="service" className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
                İlgilendiğiniz Hizmet
              </label>
              <select
                id="service"
                name="service"
                className="w-full px-4 py-3.5 rounded-xl text-[15px] text-white"
                style={{
                  background: "var(--bg)", border: "1.5px solid var(--border)",
                  appearance: "none", WebkitAppearance: "none", cursor: "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "40px",
                }}
              >
                <option value="">Seçiniz...</option>
                {["Sosyal Medya Yönetimi", "Meta Reklamları", "TikTok Reklamları", "Google Reklamları", "Yapay Zeka & Otomasyon", "Web Tasarım & Hosting", "Tüm Hizmetler"].map((o) => (
                  <option key={o} style={{ background: "#0f0f14" }}>{o}</option>
                ))}
              </select>
            </div>
            <div className="mb-7">
              <label htmlFor="message" className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">Mesajınız</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Projenizden bahsedin..."
                required
                className="w-full px-4 py-3.5 rounded-xl text-[15px] text-white placeholder:text-white/40 resize-y min-h-[120px]"
                style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
              />
            </div>
            {status === "error" && (
              <p role="alert" className="text-red-400 text-[13px] text-center mb-4">
                {errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending" || status === "done"}
              className="btn w-full"
              style={{
                background: status === "done"
                  ? "linear-gradient(135deg,#059669,#10b981)"
                  : status === "error"
                  ? "linear-gradient(135deg,#dc2626,#ef4444)"
                  : "var(--grad)",
                color: "#fff",
                boxShadow: "var(--glow-sm)",
              }}
            >
              {status === "idle"    ? "Ücretsiz Teklif Al →"
               : status === "sending" ? "Gönderiliyor..."
               : status === "done"    ? "✓ Mesajınız Alındı!"
               : "Hata — Tekrar Dene"}
            </button>
          </form>

          {/* Info Panel */}
          <div className="reveal flex flex-col">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-start gap-4 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)" }}
                >
                  {item.svg}
                </div>
                <div>
                  <strong className="block text-[14px] font-semibold mb-0.5">{item.label}</strong>
                  <a href={item.href} className="text-[15px] text-[#8a8a9a] hover:text-white transition-colors">
                    {item.value}
                  </a>
                </div>
              </div>
            ))}

            {/* Sosyal Medya */}
            <div className="flex gap-3 py-7" style={{ borderBottom: "1px solid var(--border)" }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(168,85,247,0.4)";
                    el.style.background = "rgba(168,85,247,0.1)";
                    el.style.boxShadow = "var(--glow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "var(--border)";
                    el.style.background = "var(--surface)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>

            {/* Çalışma Saatleri */}
            <div className="pt-6">
              <h3 className="text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-4">Çalışma Saatleri</h3>
              {HOURS.map((h) => (
                <div key={h.day} className="flex justify-between text-[14px] mb-2.5">
                  <span className="text-[#8a8a9a]">{h.day}</span>
                  <span className="font-semibold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, type, placeholder, required }: {
  label: string; id: string; type: string; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 rounded-xl text-[15px] text-white placeholder:text-white/40"
        style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
      />
    </div>
  );
}
