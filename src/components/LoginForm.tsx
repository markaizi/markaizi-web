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
        // Tam sayfa yönlendirme → middleware yeni cookie ile yeniden çalışır
        window.location.href = next && next.startsWith("/musteri") ? next : data.redirect;
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

      <div className="w-full max-w-[380px] rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
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
