"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LinkRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  amountKurus: number;
  status: "AKTIF" | "ODENDI" | "IPTAL";
  clientName: string | null;
  createdAt: string;
  paidAt: string | null;
  lastAttempt: { payerName: string; status: string; failedReasonMsg: string | null; testMode: boolean } | null;
};

const STATUS: Record<LinkRow["status"], { label: string; color: string; bg: string }> = {
  AKTIF: { label: "Ödeme bekleniyor", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  ODENDI: { label: "Ödendi", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  IPTAL: { label: "İptal", color: "#8a8a9a", bg: "rgba(138,138,154,0.12)" },
};

const tl = (k: number) => (k / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
const dt = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const inputCls = "w-full px-3 py-2.5 rounded-lg text-[16px] sm:text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50";
const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" };
const labelCls = "block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5";

export default function OdemeLinkleriView({
  configured,
  testMode,
  clients,
  links,
}: {
  configured: boolean;
  testMode: boolean;
  clients: { id: string; name: string }[];
  links: LinkRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const urlOf = (code: string) => `${window.location.origin}/odeme/${code}`;

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = e.currentTarget;
    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    const res = await fetch("/api/musteri/admin/payment-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: get("title"), amount: get("amount"), description: get("description"), clientId: get("clientId") }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setError(d.error ?? "Link oluşturulamadı."); return; }
    f.reset();
    router.refresh();
  }

  async function cancel(id: string) {
    if (!confirm("Bu ödeme linki iptal edilsin mi? Link artık ödeme kabul etmez.")) return;
    const res = await fetch(`/api/musteri/admin/payment-links/${id}`, { method: "PATCH" });
    if (res.ok) router.refresh();
  }

  async function copy(code: string) {
    await navigator.clipboard.writeText(urlOf(code));
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function whatsapp(l: LinkRow) {
    const text = `Merhaba, ${l.title} için ${tl(l.amountKurus)} ödemenizi aşağıdaki güvenli linkten kartla yapabilirsiniz:\n${urlOf(l.code)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-2"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text">markaizi</a>
        <span className="text-[#555]">/</span>
        <span className="text-[14px] font-semibold text-white">Ödeme Linkleri</span>
      </header>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!configured && (
          <div className="rounded-xl p-4 text-[13px] leading-relaxed" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#fca5a5" }}>
            PayTR mağaza bilgileri henüz tanımlı değil. Link oluşturabilirsin ama müşteri ödeme yapamaz. Vercel ortam
            değişkenlerine <b>PAYTR_MERCHANT_ID</b>, <b>PAYTR_MERCHANT_KEY</b> ve <b>PAYTR_MERCHANT_SALT</b> eklenmeli.
          </div>
        )}
        {configured && testMode && (
          <div className="rounded-xl p-4 text-[13px]" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fcd34d" }}>
            PayTR <b>test modunda</b>. Gerçek para çekilmez ve test ödemeleri Ekonomi&apos;ye yazılmaz. Canlıya geçmek için
            PAYTR_TEST_MODE değişkenini kaldır.
          </div>
        )}

        <form onSubmit={create} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="font-semibold text-white text-[15px]">Yeni Ödeme Linki</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
            <div>
              <label htmlFor="pl-title" className={labelCls}>Ne için? *</label>
              <input id="pl-title" name="title" required minLength={2} maxLength={120} placeholder="Ör: Ekim ayı sosyal medya yönetimi" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="pl-amount" className={labelCls}>Tutar (₺) *</label>
              <input id="pl-amount" name="amount" required inputMode="decimal" placeholder="12.500" className={inputCls} style={inputStyle} />
            </div>
          </div>
          <div>
            <label htmlFor="pl-client" className={labelCls}>Firma (opsiyonel)</label>
            <select id="pl-client" name="clientId" defaultValue="" className={inputCls} style={inputStyle}>
              <option value="">— Firma seçme —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pl-desc" className={labelCls}>Açıklama (opsiyonel, ödeme sayfasında görünür)</label>
            <textarea id="pl-desc" name="description" rows={2} maxLength={500} className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          {error && <p className="text-[12px] text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary text-sm px-5 py-2.5 disabled:opacity-50">
            {busy ? "Oluşturuluyor…" : "Link Oluştur"}
          </button>
        </form>

        <div className="space-y-3">
          {links.length === 0 && (
            <p className="text-center text-[14px] text-[#8a8a9a] py-10 rounded-xl" style={{ border: "1px solid var(--border)" }}>Henüz ödeme linki yok.</p>
          )}
          {links.map((l) => {
            const s = STATUS[l.status];
            return (
              <div key={l.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-white truncate">{l.title}</p>
                    <p className="text-[12px] text-[#8a8a9a]">
                      {l.clientName ? `${l.clientName} · ` : ""}{dt(l.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[16px] font-bold text-white tabular-nums">{tl(l.amountKurus)}</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                </div>
                {l.status === "ODENDI" && l.paidAt && (
                  <p className="text-[12px] text-[#34d399] mb-2">
                    {dt(l.paidAt)} · {l.lastAttempt?.payerName}{l.lastAttempt?.testMode ? " · TEST" : ""}
                  </p>
                )}
                {l.status === "AKTIF" && l.lastAttempt?.status === "BASARISIZ" && (
                  <p className="text-[12px] text-[#fca5a5] mb-2">Son deneme başarısız: {l.lastAttempt.failedReasonMsg ?? "bilinmiyor"}</p>
                )}
                {l.status === "AKTIF" && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button onClick={() => copy(l.code)} className="text-[12px] font-semibold px-3 min-h-[36px] rounded-lg" style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}>
                      {copied === l.code ? "Kopyalandı ✓" : "Linki Kopyala"}
                    </button>
                    <button onClick={() => whatsapp(l)} className="text-[12px] font-semibold px-3 min-h-[36px] rounded-lg" style={{ background: "rgba(37,211,102,0.12)", color: "#4ade80", border: "1px solid rgba(37,211,102,0.3)" }}>
                      WhatsApp&apos;ta Gönder
                    </button>
                    <a href={`/odeme/${l.code}`} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold px-3 min-h-[36px] rounded-lg inline-flex items-center" style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}>
                      Önizle
                    </a>
                    <button onClick={() => cancel(l.id)} className="text-[12px] font-semibold px-3 min-h-[36px] rounded-lg" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                      İptal Et
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
