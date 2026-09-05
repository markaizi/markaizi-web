"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BILLING_PERIODS, BILLING_PERIOD_LABEL, needsIntervalDays, type BillingPeriod,
} from "@/lib/billingPeriod";

export default function YeniFirmaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", slug: "",
    contactPerson: "", contactEmail: "", contactPhone: "",
    billingAmount: "", billingPeriod: "AYLIK" as BillingPeriod,
    billingIntervalDays: "", paymentDueDate: "",
    username: "", email: "", password: "",
  });
  const [withUser, setWithUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    const slug = autoSlug(name);
    setForm((f) => ({ ...f, name, slug, username: f.username || slug }));
  }

  function fmtAmount(raw: string): string {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return raw;
    const num = parseInt(digits, 10);
    if (isNaN(num)) return raw;
    return num.toLocaleString("tr-TR") + " ₺";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const body: Record<string, string | number | null> = {
      name: form.name, slug: form.slug,
    };
    if (form.contactPerson.trim()) body.contactPerson = form.contactPerson;
    if (form.contactEmail.trim())  body.contactEmail  = form.contactEmail;
    if (form.contactPhone.trim())  body.contactPhone  = form.contactPhone;
    if (form.billingAmount.trim()) {
      body.billingAmount = form.billingAmount;
      body.billingPeriod = form.billingPeriod;
      if (needsIntervalDays(form.billingPeriod)) {
        body.billingIntervalDays = Number(form.billingIntervalDays) || null;
      }
      if (form.paymentDueDate) body.paymentDueDate = form.paymentDueDate;
    }
    if (withUser && form.username && form.password) {
      body.username = form.username;
      body.email    = form.email;
      body.password = form.password;
    }
    const res  = await fetch("/api/musteri/admin/clients", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) router.push(`/musteri/admin/${json.slug}`);
    else setErr(json.error ?? "Hata.");
  }

  const inputCls = "w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50";
  const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" };
  const labelCls = "block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center gap-2"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <a href="/musteri/admin"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Admin Paneli
        </a>
        <span className="text-[#555]">/</span>
        <span className="text-[14px] font-semibold text-white">Yeni Firma</span>
      </header>

      <main className="max-w-[520px] mx-auto px-6 py-12">
        <h1 className="font-black text-[24px] text-white mb-2">Yeni Firma Ekle</h1>
        <p className="text-[14px] text-[#8a8a9a] mb-8">Firma bilgileri ve isteğe bağlı müşteri girişini aynı anda oluştur.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Firma bilgileri */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="font-semibold text-white text-[14px]">Firma Bilgileri</p>

            <div>
              <label className={labelCls}>Firma Adı</label>
              <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Ahmet Nakliyat" className={inputCls} style={inputStyle} />
            </div>

            <div>
              <label className={labelCls}>
                Slug (URL) <span className="normal-case font-normal text-[#555]">— otomatik, düzenleyebilirsin</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 rounded-l-lg text-[13px] text-[#555]"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRight: "none" }}>
                  /musteri/
                </span>
                <input required value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="ahmet-nakliyat"
                  className="flex-1 px-3 py-2.5 rounded-r-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={inputStyle} />
              </div>
            </div>

          </div>

          {/* İletişim Bilgileri */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div>
              <p className="font-semibold text-white text-[14px]">İletişim Bilgileri</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Tamamı opsiyonel.</p>
            </div>

            <div>
              <label className={labelCls}>Yetkili Kişi</label>
              <input value={form.contactPerson}
                onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                placeholder="Örn: Ahmet Yılmaz" className={inputCls} style={inputStyle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>E-posta</label>
                <input type="email" value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  placeholder="firma@ornek.com" className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input type="tel" value={form.contactPhone}
                  onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="0532 000 00 00" className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Ödeme Anlaşması */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div>
              <p className="font-semibold text-white text-[14px]">Ödeme Anlaşması</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Opsiyonel — doldurursan firma oluşur oluşmaz ilk fatura kaydı da otomatik açılır.</p>
            </div>

            <div>
              <label className={labelCls}>Ücret</label>
              <input value={form.billingAmount}
                onChange={(e) => setForm((f) => ({ ...f, billingAmount: e.target.value }))}
                onBlur={(e) => setForm((f) => ({ ...f, billingAmount: fmtAmount(e.target.value) }))}
                placeholder="Örn: 5.000 ₺" className={inputCls} style={inputStyle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Ödeme Periyodu</label>
                <select value={form.billingPeriod}
                  onChange={(e) => setForm((f) => ({ ...f, billingPeriod: e.target.value as BillingPeriod }))}
                  className={inputCls} style={{ ...inputStyle, cursor: "pointer" }}>
                  {BILLING_PERIODS.map((p) => (
                    <option key={p} value={p} style={{ background: "#0f0f14" }}>
                      {BILLING_PERIOD_LABEL[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Ödeme Tarihi (opsiyonel)</label>
                <input type="date" value={form.paymentDueDate}
                  onChange={(e) => setForm((f) => ({ ...f, paymentDueDate: e.target.value }))}
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            {needsIntervalDays(form.billingPeriod) && (
              <div className="mt-4">
                <label className={labelCls}>Kaç günde bir?</label>
                <input type="number" min={1} max={365} value={form.billingIntervalDays}
                  onChange={(e) => setForm((f) => ({ ...f, billingIntervalDays: e.target.value }))}
                  placeholder="Örn: 45" className={inputCls} style={inputStyle} />
              </div>
            )}
          </div>

          {/* Müşteri girişi */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <label className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
              style={{ background: "var(--surface)" }}>
              <input type="checkbox" checked={withUser} onChange={(e) => setWithUser(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500 cursor-pointer" />
              <div>
                <p className="text-white text-[14px] font-semibold">Müşteri Girişi Oluştur</p>
                <p className="text-[12px] text-[#8a8a9a]">Müşterinin panele giriş yapabileceği hesabı şimdi oluştur</p>
              </div>
            </label>

            {withUser && (
              <div className="px-5 pb-5 pt-4 space-y-4"
                style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Kullanıcı Adı</label>
                    <input required={withUser} value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      placeholder={form.slug || "musteri-adi"} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls}>E-posta</label>
                    <input type="email" required={withUser} value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="musteri@firma.com" className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Şifre</label>
                  <input type="password" required={withUser} value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 6 karakter" className={inputCls} style={inputStyle} />
                </div>
              </div>
            )}
          </div>

          {err && <p className="text-[12px] text-red-400">{err}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-3">
              {loading ? "Oluşturuluyor..." : "Firma Oluştur →"}
            </button>
            <button type="button" onClick={() => router.push("/musteri/admin")} className="btn btn-outline px-5 py-3">
              İptal
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
