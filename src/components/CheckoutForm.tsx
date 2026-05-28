"use client";

import { useState, useRef, useEffect } from "react";
import type { Package } from "@/lib/packages";

interface Props {
  pkg: Package;
}

type Step = "form" | "iframe" | "error";

export default function CheckoutForm({ pkg }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [iframeToken, setIframeToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeUrl = iframeToken
    ? `https://www.paytr.com/odeme/guvenli/${iframeToken}`
    : "";

  // PayTR iframe mesajlarını dinle (opsiyonel — yükseklik ayarı)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== "https://www.paytr.com") return;
      if (e.data?.height && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + "px";
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/paytr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paket: pkg.slug, name, email, phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setErrorMsg(data.error ?? "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        setStep("error");
        return;
      }

      setIframeToken(data.token);
      setStep("iframe");
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  if (step === "error") {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[#8a8a9a] mb-6">{errorMsg}</p>
        <button
          onClick={() => { setStep("form"); setErrorMsg(""); }}
          className="btn btn-outline"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  if (step === "iframe" && iframeToken) {
    return (
      <div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-[13px] text-[#8a8a9a] bg-[#0f0f14] border border-[rgba(255,255,255,0.07)] rounded-full px-4 py-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-400" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            256-bit SSL ile güvenli ödeme
          </div>
        </div>
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          id="paytriframe"
          frameBorder="0"
          scrolling="no"
          style={{ width: "100%", minHeight: "600px", border: "none" }}
          title="Güvenli Ödeme"
        />
        <p className="text-center text-[12px] text-[#8a8a9a] mt-4">
          Ödeme sayfası PayTR tarafından şifreli olarak sunulmaktadır.
        </p>
      </div>
    );
  }

  // Form adımı
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Paket özeti */}
      <div
        className="rounded-xl p-5 mb-2"
        style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.25)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#8a8a9a] mb-0.5">Seçili Paket</p>
            <p className="font-bold text-[15px]">{pkg.fullName}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-1">{pkg.desc}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] text-[#8a8a9a]">₺</span>
              <span className="text-[28px] font-black gradient-text">
                {pkg.price.toLocaleString("tr-TR")}
              </span>
            </div>
            {pkg.period && (
              <span className="text-[12px] text-[#8a8a9a]">{pkg.period}</span>
            )}
          </div>
        </div>
      </div>

      {/* Müşteri bilgileri */}
      <div>
        <label className="field-label">Ad Soyad *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ahmet Yılmaz"
          className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#8a8a9a]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        />
      </div>

      <div>
        <label className="field-label">E-posta *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#8a8a9a]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        />
      </div>

      <div>
        <label className="field-label">Telefon *</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="05XX XXX XX XX"
          className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#8a8a9a]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Yükleniyor...
            </span>
          ) : (
            "Ödemeye Geç →"
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-[#8a8a9a]">
        🔒 Ödeme bilgileriniz PayTR güvencesiyle işlenir. Kart bilgileriniz sitemizde saklanmaz.
      </p>
    </form>
  );
}
