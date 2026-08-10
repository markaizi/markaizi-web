"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Şifreler eşleşmiyor."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/musteri/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error ?? "Bir hata oluştu.");
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
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-bold text-[18px] text-white mb-1">Yeni Şifre Belirle</h1>
        </div>

        {!token ? (
          <p className="text-[14px] text-center text-red-400">
            Geçersiz bağlantı. Lütfen{" "}
            <a href="/musteri/sifremi-unuttum" className="text-[#c084fc] underline underline-offset-2">
              yeniden talep edin
            </a>.
          </p>
        ) : done ? (
          <div className="text-center space-y-4">
            <p className="text-[14px] text-[#c0c0d0] leading-relaxed">Şifreniz güncellendi.</p>
            <a href="/musteri/giris" className="btn btn-primary inline-block">Giriş Yap</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-password" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
                Yeni Şifre
              </label>
              <input
                id="reset-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                autoFocus
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
                Yeni Şifre (Tekrar)
              </label>
              <input
                id="reset-confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
              {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
              {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
