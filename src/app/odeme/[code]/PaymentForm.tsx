"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Script from "next/script";

type Result = "basarili" | "basarisiz" | null;

declare global {
  interface Window {
    iFrameResize?: (opts: object, selector: string) => void;
  }
}

const inputCls = "w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50";
const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" };
const labelCls = "block text-[12px] font-bold text-[#8a8a9a] uppercase tracking-wider mb-2";

export default function PaymentForm({ code, initialResult }: { code: string; initialResult: Result }) {
  const [result, setResult] = useState<Result>(initialResult);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [paidConfirmed, setPaidConfirmed] = useState(false);
  const resized = useRef(false);

  // PayTR'den dönüşte kesin sonucu sunucudan oku (Bildirim URL'nin yazdığı durum)
  useEffect(() => {
    if (result !== "basarili") return;
    let tries = 0;
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/odeme/${code}/durum`, { cache: "no-store" });
        const d = await r.json();
        if (d.status === "ODENDI") { setPaidConfirmed(true); return; }
      } catch { /* yeniden dene */ }
      if (!stop && ++tries < 20) setTimeout(tick, 3000);
    };
    tick();
    return () => { stop = true; };
  }, [result, code]);

  function onIframeScriptReady() {
    if (resized.current) return;
    if (window.iFrameResize && document.getElementById("paytriframe")) {
      window.iFrameResize({}, "#paytriframe");
      resized.current = true;
    }
  }
  useEffect(() => { if (token) onIframeScriptReady(); }, [token]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const f = e.currentTarget;
    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    try {
      const res = await fetch(`/api/odeme/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"), email: get("email"), phone: get("phone"), address: get("address"),
          accepted: (f.elements.namedItem("accepted") as HTMLInputElement).checked,
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.token) throw new Error(d.error || "Ödeme ekranı açılamadı.");
      setToken(d.token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (result === "basarili") {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}>
        <p className="text-[17px] font-bold text-white mb-1">{paidConfirmed ? "Ödemeniz alındı" : "Ödemeniz işleniyor…"}</p>
        <p className="text-[14px] text-[#8a8a9a]">
          {paidConfirmed
            ? "Teşekkür ederiz. Ödeme onayı bize ulaştı."
            : "Bankadan onay bekleniyor; bu birkaç saniye sürebilir. Bu sayfayı kapatabilirsiniz, sonuç bize otomatik iletilir."}
        </p>
      </div>
    );
  }

  if (token) {
    return (
      <div className="rounded-2xl overflow-hidden p-2 sm:p-3" style={{ background: "#fff" }}>
        <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" onReady={onIframeScriptReady} />
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          id="paytriframe"
          title="PayTR güvenli ödeme"
          frameBorder={0}
          scrolling="no"
          style={{ width: "100%", minHeight: 600 }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl p-6 sm:p-8 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      {result === "basarisiz" && (
        <p className="text-[14px] rounded-xl px-4 py-3" style={{ background: "rgba(248,113,113,0.1)", color: "#fca5a5" }}>
          Ödeme tamamlanamadı. Bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
        </p>
      )}
      <div>
        <label htmlFor="odeme-name" className={labelCls}>Ad Soyad *</label>
        <input id="odeme-name" name="name" required minLength={3} maxLength={60} autoComplete="name" className={inputCls} style={inputStyle} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="odeme-email" className={labelCls}>E-posta *</label>
          <input id="odeme-email" name="email" type="email" required maxLength={100} autoComplete="email" className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="odeme-phone" className={labelCls}>Telefon *</label>
          <input id="odeme-phone" name="phone" type="tel" required minLength={10} maxLength={20} autoComplete="tel" placeholder="05XX XXX XX XX" className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div>
        <label htmlFor="odeme-address" className={labelCls}>Fatura Adresi *</label>
        <textarea id="odeme-address" name="address" required minLength={5} maxLength={400} rows={2} autoComplete="street-address" className={`${inputCls} resize-none`} style={inputStyle} />
      </div>
      <label className="flex items-start gap-3 text-[13.5px] text-[#c0c0d0] leading-relaxed cursor-pointer">
        <input type="checkbox" name="accepted" required className="mt-1 w-4 h-4 flex-shrink-0 accent-purple-500" />
        <span>
          <a href="/on-bilgilendirme-formu" target="_blank" rel="noopener noreferrer" className="text-[#c084fc] underline underline-offset-2">Ön Bilgilendirme Formu</a>
          &apos;nu ve{" "}
          <a href="/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="text-[#c084fc] underline underline-offset-2">Mesafeli Satış Sözleşmesi</a>
          &apos;ni okudum, onaylıyorum.{" "}
          <a href="/iptal-ve-iade-kosullari" target="_blank" rel="noopener noreferrer" className="text-[#8a8a9a] underline underline-offset-2">İptal ve iade koşulları</a>
        </span>
      </label>
      {error && <p className="text-[13px] text-red-400">{error}</p>}
      <button type="submit" disabled={sending} className="btn btn-primary w-full py-4 text-[15px] disabled:opacity-50">
        {sending ? "Ödeme ekranı hazırlanıyor…" : "Kartla Ödemeye Geç →"}
      </button>
      <p className="text-[12px] text-[#8a8a9a] text-center">Bir sonraki adımda PayTR güvenli ödeme ekranı açılır; taksit seçenekleri orada gösterilir.</p>
    </form>
  );
}
