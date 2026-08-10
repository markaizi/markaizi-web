"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/musteri/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (res.ok) setSent(true);
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
          <h1 className="font-bold text-[18px] text-white mb-1">Şifremi Unuttum</h1>
          <p className="text-[13px] text-[#8a8a9a]">Kullanıcı adınızı veya e-postanızı girin, sıfırlama bağlantısı gönderelim</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-[14px] text-[#c0c0d0] leading-relaxed">
              Hesap bulunduysa, şifre sıfırlama bağlantısı e-postanıza gönderildi.
              Gelen kutunuzu (ve spam klasörünü) kontrol edin.
            </p>
            <a href="/musteri/giris" className="text-[13px] text-[#c084fc] underline underline-offset-2">
              Girişe dön
            </a>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-username" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
                  Kullanıcı Adı veya E-posta
                </label>
                <input
                  id="forgot-username"
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
                {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
                {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
              </button>
            </form>

            <p className="text-[12px] text-[#555] text-center mt-5">
              <a href="/musteri/giris" className="text-[#c084fc] underline underline-offset-2">
                Girişe dön
              </a>
              {" "}veya{" "}
              <a href="https://wa.me/905520772700" className="text-[#c084fc] underline underline-offset-2">
                WhatsApp&apos;tan yazın
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
