"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maintenance, setMaintenance] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/musteri/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = next && next.startsWith("/musteri") ? next : data.redirect;
      } else if (data.maintenance) {
        setMaintenance(true);
        setError("");
      } else {
        setError(data.error ?? "Kullanıcı adı veya şifre hatalı.");
      }
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <a href="/" className="mb-10 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[22px] font-black gradient-text">markaizi</span>
        <span className="text-[#8a8a9a] text-[13px]">× Panel</span>
      </a>

      {maintenance && (
        <div className="w-full max-w-[420px] rounded-2xl p-7 mb-4 text-center space-y-4"
          style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.25)" }}>
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#c084fc" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-[16px] mb-2">Altyapı Güncelleniyor</h2>
            <p className="text-[13px] leading-relaxed" style={{ color: "#a78bfa" }}>
              Sizlere daha iyi hizmet verebilmek için altyapımızı güncelliyoruz.
              İhtiyaçlarınız ve sorularınız için lütfen bizimle iletişime geçin.
            </p>
          </div>
          <a href="https://wa.me/905520772700"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.35)", color: "#c084fc" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.012a.75.75 0 0 0 .931.931l5.157-1.471A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.956 9.956 0 0 1-5.073-1.384l-.364-.216-3.764 1.074 1.074-3.764-.216-.364A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp&apos;tan Ulaşın
          </a>
        </div>
      )}

      <div className="w-full max-w-[380px] rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)", display: maintenance ? "none" : undefined }}>
        <div className="text-center mb-7">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#c084fc" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-bold text-[18px] text-white mb-1">Panel Girişi</h1>
          <p className="text-[13px] text-[#8a8a9a]">Devam etmek için bilgilerinizi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullaniciadiniz"
              autoFocus
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--border)"}` }}
            />
            {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-[12px] text-[#555] text-center mt-5">
          Şifrenizi unuttuysanız{" "}
          <a href="https://wa.me/905520772700" className="text-[#c084fc] underline underline-offset-2">
            WhatsApp&apos;tan yazın
          </a>
        </p>
      </div>
    </div>
  );
}
