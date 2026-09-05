"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function MusteriProfilPage() {
  const [panelHref, setPanelHref] = useState("/musteri/giris");
  const [nameForm, setNameForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm]     = useState({ oldPassword: "", password: "", confirm: "" });
  const [nameOk, setNameOk]     = useState("");
  const [nameErr, setNameErr]   = useState("");
  const [pwOk, setPwOk]         = useState("");
  const [pwErr, setPwErr]       = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [pwLoading, setPwLoading]     = useState(false);

  useEffect(() => {
    fetch("/api/musteri/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.redirect) setPanelHref(d.redirect); })
      .catch(() => {});
  }, []);

  async function handleName(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true); setNameErr(""); setNameOk("");
    const body: Record<string, string> = {};
    if (nameForm.name.trim())  body.name  = nameForm.name.trim();
    if (nameForm.email.trim()) body.email = nameForm.email.trim();
    const res  = await fetch("/api/musteri/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const json = await res.json();
    setNameLoading(false);
    if (json.ok) { setNameOk("Kaydedildi."); setNameForm({ name: "", email: "" }); }
    else setNameErr(json.error ?? "Hata.");
  }

  async function handlePw(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) { setPwErr("Şifreler eşleşmiyor."); return; }
    setPwLoading(true); setPwErr(""); setPwOk("");
    const res  = await fetch("/api/musteri/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: pwForm.oldPassword, password: pwForm.password }),
    });
    const json = await res.json();
    setPwLoading(false);
    if (json.ok) { setPwOk("Şifre güncellendi."); setPwForm({ oldPassword: "", password: "", confirm: "" }); }
    else setPwErr(json.error ?? "Hata.");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center gap-2"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <a href={panelHref}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Panele Dön
        </a>
        <span className="text-[#555]">/</span>
        <span className="text-[14px] font-semibold text-white">Profilim</span>
      </header>

      <main className="max-w-[520px] mx-auto px-6 py-10 space-y-6">
        <h1 className="font-black text-[22px] text-white">Profilim</h1>

        {/* Ad / E-posta */}
        <form onSubmit={handleName} className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="font-semibold text-white text-[14px]">Ad / E-posta Güncelle</p>
          <div>
            <label htmlFor="musteri-profil-name" className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Yeni Ad Soyad</label>
            <input id="musteri-profil-name" value={nameForm.name} onChange={(e) => setNameForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Mevcut adın değişmez, boş bırak"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          <div>
            <label htmlFor="musteri-profil-email" className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Yeni E-posta</label>
            <input id="musteri-profil-email" type="email" value={nameForm.email} onChange={(e) => setNameForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Mevcut e-posta değişmez, boş bırak"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          {nameErr && <p className="text-[12px] text-red-400">{nameErr}</p>}
          {nameOk  && <p className="text-[12px] text-green-400">{nameOk}</p>}
          <button type="submit" disabled={nameLoading} className="btn btn-primary text-sm px-5 py-2">
            {nameLoading ? "..." : "Kaydet"}
          </button>
        </form>

        {/* Şifre */}
        <form onSubmit={handlePw} className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="font-semibold text-white text-[14px]">Şifre Değiştir</p>
          {[
            { key: "oldPassword", label: "Mevcut Şifre",   placeholder: "" },
            { key: "password",    label: "Yeni Şifre",     placeholder: "Min. 6 karakter" },
            { key: "confirm",     label: "Yeni Şifre (Tekrar)", placeholder: "" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label htmlFor={`musteri-profil-${key}`} className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">{label}</label>
              <input id={`musteri-profil-${key}`} required type="password" value={pwForm[key as keyof typeof pwForm]}
                onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          ))}
          {pwErr && <p className="text-[12px] text-red-400">{pwErr}</p>}
          {pwOk  && <p className="text-[12px] text-green-400">{pwOk}</p>}
          <button type="submit" disabled={pwLoading} className="btn btn-primary text-sm px-5 py-2">
            {pwLoading ? "..." : "Şifreyi Güncelle"}
          </button>
        </form>

        <ThemeToggle />
      </main>
    </div>
  );
}
