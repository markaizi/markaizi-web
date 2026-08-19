"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INVOICE_STAGE_COLOR, INVOICE_STAGE_LABEL, type InvoiceStage } from "@/lib/invoiceStage";
import {
  BILLING_PERIODS, BILLING_PERIOD_LABEL, needsIntervalDays, type BillingPeriod,
} from "@/lib/billingPeriod";
import Notes from "@/components/Notes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ClientDetailData {
  id: string;
  slug: string;
  name: string;
  invoiceNote: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  billingAmount: string;
  billingPeriod: BillingPeriod | "";
  billingIntervalDays: number | null;
  dailyMetaSpend: string;
  dailyGoogleSpend: string;
  active: boolean;
  updates: {
    id: string;
    kind: "AJANS" | "WEBSITE";
    text: string;
    date: string;
  }[];
  invoices: {
    id: string;
    period: string;
    amount: string;
    /** Saklanan gerçek durum: ödendi mi? */
    paid: boolean;
    /** Vade tarihinden hesaplanan görünen aşama (sunucuda üretilir). */
    stage: InvoiceStage;
    dueDate: string | null;
  }[];
  contentItems: {
    id: string;
    title: string;
    description: string;
    scheduledDate: string;
    status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
    publishedAt: string | null;
  }[];
  users: { id: string; username: string | null; name: string; email: string }[];
  laborCost: number;
  unpricedWorkLogCount: number;
  adReports: {
    id: string;
    platform: "META" | "GOOGLE" | "WEBSITE";
    month: string;
    spend: string;
    impressions: string;
    clicks: string;
    summary: string;
    publishedAt: string;
  }[];
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────

// Not: fatura durum etiketleri/renkleri src/lib/invoiceStage.ts'ten gelir —
// aşama vade tarihinden hesaplandığı için burada tekrarlanmaz.
const STATUS_LABEL: Record<string, string> = {
  PLANLANDI: "Planlandı",
  DUZENLENIYOR: "Düzenleniyor",
  HAZIR: "Hazır",
  YAYINLANDI: "Yayınlandı",
};
const STATUS_COLOR: Record<string, string> = {
  PLANLANDI: "#8a8a9a",
  DUZENLENIYOR: "#fbbf24",
  HAZIR: "#60a5fa",
  YAYINLANDI: "#34d399",
};

const PLATFORM_LABEL: Record<string, string> = {
  META: "Meta",
  GOOGLE: "Google",
  WEBSITE: "Website",
};
const PLATFORM_COLOR: Record<string, string> = {
  META: "#60a5fa",
  GOOGLE: "#34d399",
  WEBSITE: "#c084fc",
};

const CONTENT_STATUS_BG: Record<string, string> = {
  PLANLANDI: "rgba(138,138,154,0.12)",
  DUZENLENIYOR: "rgba(251,191,36,0.12)",
  HAZIR: "rgba(96,165,250,0.12)",
  YAYINLANDI: "rgba(52,211,153,0.12)",
};

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function parseAmountNum(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// "YYYY-MM-DD" (tarih girişlerinden gelen ham format) → "10 Eylül 2026"
function fmtDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw + "T00:00:00");
  if (isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

// ── Paylaşılan UI ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", ...props.style }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    />
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return msg ? <p className="text-[12px] text-red-400 mt-1">{msg}</p> : null;
}

function SaveBtn({ loading, label = "Kaydet" }: { loading: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn btn-primary text-sm px-5 py-2"
    >
      {loading ? "..." : label}
    </button>
  );
}

function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className="text-[12px] text-red-400 hover:text-red-300 transition-colors px-3 min-h-[44px] inline-flex items-center rounded">
      {loading ? "..." : "Sil"}
    </button>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-[12px] text-[#8a8a9a] hover:text-purple-400 transition-colors px-3 min-h-[44px] inline-flex items-center rounded">
      Düzenle
    </button>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function AdminClientDetail({ data, unreadNoteCount = 0 }: { data: ClientDetailData; unreadNoteCount?: number }) {
  const router = useRouter();
  const [tab, setTab] = useState<"genel" | "icerikler" | "guncellemeler" | "faturalar" | "raporlar" | "notlar" | "kullanici">("genel");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <a href="/musteri/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Paneli
          </a>
          <span className="text-[#555] flex-shrink-0">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{data.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 flex-shrink-0 min-h-[44px] px-1"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-8">
        {/* Üst bilgi */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[20px]"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
          >
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-[22px] text-white">{data.name}</h1>
            <p className="text-[13px] text-[#8a8a9a]">/{data.slug}</p>
          </div>
        </div>

        {/* Sekmeler — yatay kaydırmalı, mobilde kırılmıyor */}
        <div className="flex gap-1 mb-7 overflow-x-auto pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap" style={{ scrollbarWidth: "none" }}>
          {(["genel", "icerikler", "guncellemeler", "faturalar", "raporlar", "notlar", "kullanici"] as const).map((t) => {
            const labels: Record<typeof t, string> = {
              genel: "Genel",
              icerikler: "İçerikler",
              guncellemeler: "Güncellemeler",
              faturalar: "Faturalar",
              raporlar: "Raporlar",
              notlar: "Müşteri İstekleri",
              kullanici: "Kullanıcı",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
                style={{
                  background: tab === t ? "rgba(168,85,247,0.2)" : "var(--surface)",
                  border: `1px solid ${tab === t ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
                  color: tab === t ? "#c084fc" : "#8a8a9a",
                }}
              >
                {labels[t]}
                {t === "notlar" && unreadNoteCount > 0 && tab !== "notlar" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(251,146,60,0.2)", color: "#fb923c" }}>
                    {unreadNoteCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* İçerik */}
        {tab === "genel" && <GenelTab data={data} router={router} />}
        {tab === "icerikler" && <IceriklerTab slug={data.slug} contentItems={data.contentItems} router={router} />}
        {tab === "guncellemeler" && <GuncellemelerTab slug={data.slug} updates={data.updates} router={router} />}
        {tab === "faturalar" && <FaturalarTab slug={data.slug} invoices={data.invoices} router={router} />}
        {tab === "raporlar" && <RaporlarTab slug={data.slug} reports={data.adReports} router={router} />}
        {tab === "notlar" && <Notes clientSlug={data.slug} isClient={false} isStaff isAdmin />}
        {tab === "kullanici" && <KullaniciTab slug={data.slug} users={data.users} router={router} />}
      </main>
    </div>
  );
}

// ── Genel sekmesi ─────────────────────────────────────────────────────────────

function GenelTab({ data, router }: { data: ClientDetailData; router: ReturnType<typeof useRouter> }) {
  const [form, setForm] = useState({
    name: data.name, invoiceNote: data.invoiceNote,
    contactPerson: data.contactPerson, contactEmail: data.contactEmail, contactPhone: data.contactPhone,
    billingAmount: data.billingAmount,
    billingPeriod: (data.billingPeriod || "AYLIK") as BillingPeriod,
    billingIntervalDays: data.billingIntervalDays ? String(data.billingIntervalDays) : "",
    dailyMetaSpend: data.dailyMetaSpend, dailyGoogleSpend: data.dailyGoogleSpend,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const revenue = data.invoices
    .filter((i) => i.paid)
    .reduce((s, i) => s + parseAmountNum(i.amount), 0);
  const profit = revenue - data.laborCost;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk(false);
    const res = await fetch(`/api/musteri/admin/clients/${data.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        // Formda metin olarak tutuluyor; API sayı bekliyor ve yalnızca
        // "özel gün aralığı" periyodunda anlamlı.
        billingIntervalDays: needsIntervalDays(form.billingPeriod)
          ? Number(form.billingIntervalDays) || null
          : null,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setOk(true); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDeactivate() {
    if (!confirm(`"${data.name}" firmayı deaktive et? Panel listesinden kaldırılır.`)) return;
    await fetch(`/api/musteri/admin/clients/${data.slug}`, { method: "DELETE" });
    router.push("/musteri/admin");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-[13px] font-semibold text-white mb-3">Kârlılık</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3.5" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Gelir</p>
            <p className="text-[16px] sm:text-[18px] font-black" style={{ color: "#34d399" }}>{revenue.toLocaleString("tr-TR")} ₺</p>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">İşçilik</p>
            <p className="text-[16px] sm:text-[18px] font-black" style={{ color: "#f87171" }}>{data.laborCost.toLocaleString("tr-TR")} ₺</p>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: profit >= 0 ? "rgba(168,85,247,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${profit >= 0 ? "rgba(168,85,247,0.2)" : "rgba(248,113,113,0.2)"}` }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Kâr</p>
            <p className="text-[16px] sm:text-[18px] font-black" style={{ color: profit >= 0 ? "#c084fc" : "#f87171" }}>{profit.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>
        <p className="text-[11px] text-[#666] mt-3">
          Gelir: ödenmiş faturalar toplamı · İşçilik: bu firmanın kartlarına bağlı fiyatlandırılmış iş kayıtları toplamı
          {data.unpricedWorkLogCount > 0 && ` · ${data.unpricedWorkLogCount} iş kaydı henüz fiyatlandırılmadı, işçilik eksik hesaplanmış olabilir`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Field label="Firma Adı">
          <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Yetkili Kişi (opsiyonel)">
            <Input value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} placeholder="Örn: Ahmet Yılmaz" />
          </Field>
          <Field label="Telefon (opsiyonel)">
            <Input type="tel" value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} placeholder="0532 000 00 00" />
          </Field>
        </div>
        <Field label="E-posta (opsiyonel)">
          <Input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="firma@ornek.com" />
        </Field>

        <div className="pt-1 pb-1">
          <p className="text-[13px] font-semibold text-white">Ödeme Planı</p>
          <p className="text-[11px] text-[#8a8a9a] mt-0.5">
            Doluysa, bir fatura &quot;Ödendi&quot; yapıldığında sonraki dönemin faturası otomatik oluşur.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ücret (opsiyonel)">
            <Input value={form.billingAmount}
              onChange={(e) => setForm((f) => ({ ...f, billingAmount: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, billingAmount: fmtAmount(e.target.value) }))}
              placeholder="Örn: 20.000 ₺" />
          </Field>
          <Field label="Ödeme Periyodu">
            <Select
              value={form.billingPeriod}
              onChange={(e) => setForm((f) => ({ ...f, billingPeriod: e.target.value as BillingPeriod }))}
            >
              {BILLING_PERIODS.map((p) => (
                <option key={p} value={p} style={{ background: "#0f0f14" }}>
                  {BILLING_PERIOD_LABEL[p]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {needsIntervalDays(form.billingPeriod) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Kaç günde bir?">
              <Input
                type="number"
                min={1}
                max={365}
                value={form.billingIntervalDays}
                onChange={(e) => setForm((f) => ({ ...f, billingIntervalDays: e.target.value }))}
                placeholder="Örn: 45"
              />
            </Field>
            <div className="flex items-end pb-2">
              <p className="text-[11px] text-[#8a8a9a] leading-relaxed">
                Vade tarihinden itibaren bu kadar gün sonrası için sonraki fatura açılır.
              </p>
            </div>
          </div>
        )}

        {form.billingPeriod === "MANUEL" && (
          <p className="text-[11px] text-[#8a8a9a] leading-relaxed -mt-1">
            Bu firmada faturalar otomatik oluşmaz — &quot;Faturalar&quot; sekmesinden elle eklersiniz.
          </p>
        )}

        <div className="pt-1 pb-1">
          <p className="text-[13px] font-semibold text-white">Günlük Reklam Harcaması</p>
          <p className="text-[11px] text-[#8a8a9a] mt-0.5">
            Müşteri bunu kendi panelinin ana sayfasında görür.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Meta (opsiyonel)">
            <Input value={form.dailyMetaSpend}
              onChange={(e) => setForm((f) => ({ ...f, dailyMetaSpend: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, dailyMetaSpend: fmtAmount(e.target.value) }))}
              placeholder="Örn: 250 ₺" />
          </Field>
          <Field label="Google (opsiyonel)">
            <Input value={form.dailyGoogleSpend}
              onChange={(e) => setForm((f) => ({ ...f, dailyGoogleSpend: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, dailyGoogleSpend: fmtAmount(e.target.value) }))}
              placeholder="Örn: 150 ₺" />
          </Field>
        </div>

        <Field label="Fatura Notu (opsiyonel)">
          <Textarea value={form.invoiceNote} onChange={(e) => setForm((f) => ({ ...f, invoiceNote: e.target.value }))} placeholder="Fatura ile ilgili ek bilgi..." />
        </Field>
        <ErrMsg msg={err} />
        {ok && <p className="text-[12px] text-green-400">Kaydedildi.</p>}
        <div className="flex justify-between items-center pt-1">
          <SaveBtn loading={loading} />
          <button type="button" onClick={handleDeactivate} className="text-[12px] text-red-400 hover:text-red-300 transition-colors">
            Firmayı Deaktive Et
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Güncellemeler sekmesi ─────────────────────────────────────────────────────

type Update = ClientDetailData["updates"][number];

function GuncellemelerTab({ slug, updates, router }: { slug: string; updates: Update[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { kind: "AJANS" as Update["kind"], text: "", date: new Date().toISOString().split("T")[0] };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(u: Update) {
    setEditingId(u.id);
    setEditForm({ kind: u.kind, text: u.text, date: u.date });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/updates/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu güncellemeyi sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/updates/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => editingId === u.id ? (
        <form key={u.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Güncellemeyi Düzenle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tür">
              <Select value={editForm.kind} onChange={(e) => setEditForm((x) => ({ ...x, kind: e.target.value as Update["kind"] }))}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </Select>
            </Field>
            <Field label="Tarih">
              <Input type="date" value={editForm.date} onChange={(e) => setEditForm((x) => ({ ...x, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Güncelleme Metni">
            <Textarea required value={editForm.text} onChange={(e) => setEditForm((x) => ({ ...x, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..." />
          </Field>
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={u.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: u.kind === "AJANS" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)", color: u.kind === "AJANS" ? "#c084fc" : "#60a5fa" }}>
            {u.kind === "AJANS" ? "Ajans" : "Web Site"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">{u.text}</p>
            <p className="text-[11px] text-[#555] mt-1">{fmtDate(u.date)}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <EditBtn onClick={() => startEdit(u)} />
            <DeleteBtn onClick={() => handleDelete(u.id)} loading={deleting === u.id} />
          </div>
        </div>
      ))}

      {updates.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz güncelleme yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Güncelleme Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Güncelleme</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tür">
              <Select value={form.kind} onChange={(e) => setForm((x) => ({ ...x, kind: e.target.value as Update["kind"] }))}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </Select>
            </Field>
            <Field label="Tarih">
              <Input type="date" value={form.date} onChange={(e) => setForm((x) => ({ ...x, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Güncelleme Metni">
            <Textarea required value={form.text} onChange={(e) => setForm((x) => ({ ...x, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..." />
          </Field>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Faturalar sekmesi ─────────────────────────────────────────────────────────

type Invoice = ClientDetailData["invoices"][number];

function FaturalarTab({ slug, invoices, router }: { slug: string; invoices: Invoice[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { period: "", amount: "", paid: false, dueDate: "" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(inv: Invoice) {
    setEditingId(inv.id);
    setEditForm({ period: inv.period, amount: inv.amount, paid: inv.paid, dueDate: inv.dueDate ?? "" });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/invoices/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period: editForm.period,
        amount: editForm.amount,
        status: editForm.paid ? "ODENDI" : "BEKLIYOR",
        dueDate: editForm.dueDate || null,
      }),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period: form.period,
        amount: form.amount,
        status: form.paid ? "ODENDI" : "BEKLIYOR",
        dueDate: form.dueDate || null,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu faturayı sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/invoices/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => editingId === inv.id ? (
        <form key={inv.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Faturayı Düzenle</p>
          <p className="text-[12px] text-[#8a8a9a] -mt-2">
            &quot;Günü Gelmedi&quot; / &quot;Bekliyor&quot; / &quot;Gecikmede&quot; vade tarihine göre
            otomatik belirlenir — elle seçilmez.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Dönem">
              <Input required value={editForm.period} onChange={(e) => setEditForm((x) => ({ ...x, period: e.target.value }))} placeholder="Haziran 2026" />
            </Field>
            <Field label="Tutar">
              <Input required value={editForm.amount}
                onChange={(e) => setEditForm((x) => ({ ...x, amount: e.target.value }))}
                onBlur={(e) => setEditForm((x) => ({ ...x, amount: fmtAmount(e.target.value) }))}
                placeholder="15.000 ₺" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ödeme Durumu">
              <Select value={editForm.paid ? "ODENDI" : "BEKLIYOR"}
                onChange={(e) => setEditForm((x) => ({ ...x, paid: e.target.value === "ODENDI" }))}>
                <option value="BEKLIYOR">Ödenmedi</option>
                <option value="ODENDI">Ödendi</option>
              </Select>
            </Field>
            <Field label="Vade Tarihi (opsiyonel)">
              <Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((x) => ({ ...x, dueDate: e.target.value }))} />
            </Field>
          </div>
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={inv.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white text-[14px] font-semibold leading-snug">{inv.period}</p>
              <p className="text-[13px] text-[#8a8a9a] mt-0.5">{fmtAmount(inv.amount)}{inv.dueDate ? ` · Vade: ${fmtDate(inv.dueDate)}` : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[12px] font-medium px-2 py-1 rounded-full" style={{ color: INVOICE_STAGE_COLOR[inv.stage], background: `${INVOICE_STAGE_COLOR[inv.stage]}18` }}>{INVOICE_STAGE_LABEL[inv.stage]}</span>
              <EditBtn onClick={() => startEdit(inv)} />
              <DeleteBtn onClick={() => handleDelete(inv.id)} loading={deleting === inv.id} />
            </div>
          </div>
        </div>
      ))}

      {invoices.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz fatura yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Fatura Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Fatura</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Dönem">
              <Input required value={form.period} onChange={(e) => setForm((x) => ({ ...x, period: e.target.value }))} placeholder="Haziran 2026" />
            </Field>
            <Field label="Tutar">
              <Input required value={form.amount}
                onChange={(e) => setForm((x) => ({ ...x, amount: e.target.value }))}
                onBlur={(e) => setForm((x) => ({ ...x, amount: fmtAmount(e.target.value) }))}
                placeholder="15.000 ₺" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ödeme Durumu">
              <Select value={form.paid ? "ODENDI" : "BEKLIYOR"}
                onChange={(e) => setForm((x) => ({ ...x, paid: e.target.value === "ODENDI" }))}>
                <option value="BEKLIYOR">Ödenmedi</option>
                <option value="ODENDI">Ödendi</option>
              </Select>
            </Field>
            <Field label="Vade Tarihi (opsiyonel)">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((x) => ({ ...x, dueDate: e.target.value }))} />
            </Field>
          </div>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Raporlar sekmesi ─────────────────────────────────────────────────────────

type AdReport = ClientDetailData["adReports"][number];

function fmtReportDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function RaporlarTab({ slug, reports, router }: { slug: string; reports: AdReport[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { platform: "META" as AdReport["platform"], month: "", spend: "", impressions: "", clicks: "", summary: "" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(r: AdReport) {
    setEditingId(r.id);
    setEditForm({ platform: r.platform, month: r.month, spend: r.spend, impressions: r.impressions, clicks: r.clicks, summary: r.summary });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/reports/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu raporu sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/reports/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => editingId === r.id ? (
        <form key={r.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Raporu Düzenle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Platform">
              <Select value={editForm.platform} onChange={(e) => setEditForm((x) => ({ ...x, platform: e.target.value as AdReport["platform"] }))}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="WEBSITE">Website</option>
              </Select>
            </Field>
            <Field label="Ay">
              <Input required value={editForm.month} onChange={(e) => setEditForm((x) => ({ ...x, month: e.target.value }))} placeholder="Temmuz 2026" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Harcama">
              <Input value={editForm.spend} onChange={(e) => setEditForm((x) => ({ ...x, spend: e.target.value }))} placeholder="5.000 ₺" />
            </Field>
            <Field label="Görüntülenme">
              <Input value={editForm.impressions} onChange={(e) => setEditForm((x) => ({ ...x, impressions: e.target.value }))} placeholder="42.000" />
            </Field>
            <Field label="Tıklama">
              <Input value={editForm.clicks} onChange={(e) => setEditForm((x) => ({ ...x, clicks: e.target.value }))} placeholder="850" />
            </Field>
          </div>
          <Field label="Özet (opsiyonel)">
            <Textarea value={editForm.summary} onChange={(e) => setEditForm((x) => ({ ...x, summary: e.target.value }))} placeholder="Neye ne kadar harcandığına dair kısa özet..." />
          </Field>
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={r.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: PLATFORM_COLOR[r.platform], background: `${PLATFORM_COLOR[r.platform]}18` }}>
                  {PLATFORM_LABEL[r.platform]}
                </span>
                <p className="text-white text-[14px] font-semibold">{r.month}</p>
              </div>
              <p className="text-[12px] text-[#8a8a9a] mt-1">
                {[
                  r.spend && `Harcama: ${r.spend}`,
                  r.impressions && `Görüntülenme: ${r.impressions}`,
                  r.clicks && `Tıklama: ${r.clicks}`,
                ].filter(Boolean).join(" · ") || "Detay girilmemiş"}
              </p>
              {r.summary && <p className="text-[12px] text-[#8a8a9a] mt-1 whitespace-pre-wrap leading-relaxed">{r.summary}</p>}
              <p className="text-[11px] text-[#555] mt-1.5">Yayınlanma: {fmtReportDate(r.publishedAt)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <EditBtn onClick={() => startEdit(r)} />
              <DeleteBtn onClick={() => handleDelete(r.id)} loading={deleting === r.id} />
            </div>
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz rapor yayınlanmadı.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Rapor Yayınla</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Rapor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Platform">
              <Select value={form.platform} onChange={(e) => setForm((x) => ({ ...x, platform: e.target.value as AdReport["platform"] }))}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="WEBSITE">Website</option>
              </Select>
            </Field>
            <Field label="Ay">
              <Input required value={form.month} onChange={(e) => setForm((x) => ({ ...x, month: e.target.value }))} placeholder="Temmuz 2026" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Harcama">
              <Input value={form.spend} onChange={(e) => setForm((x) => ({ ...x, spend: e.target.value }))} placeholder="5.000 ₺" />
            </Field>
            <Field label="Görüntülenme">
              <Input value={form.impressions} onChange={(e) => setForm((x) => ({ ...x, impressions: e.target.value }))} placeholder="42.000" />
            </Field>
            <Field label="Tıklama">
              <Input value={form.clicks} onChange={(e) => setForm((x) => ({ ...x, clicks: e.target.value }))} placeholder="850" />
            </Field>
          </div>
          <Field label="Özet (opsiyonel)">
            <Textarea value={form.summary} onChange={(e) => setForm((x) => ({ ...x, summary: e.target.value }))} placeholder="Neye ne kadar harcandığına dair kısa özet..." />
          </Field>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Yayınla" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── İçerikler sekmesi ────────────────────────────────────────────────────────

type ContentItem = ClientDetailData["contentItems"][number];

const CONTENT_STATUS_LABEL: Record<ContentItem["status"], string> = {
  PLANLANDI: "Planlandı",
  DUZENLENIYOR: "Düzenleniyor",
  HAZIR: "Hazır",
  YAYINLANDI: "Yayınlandı",
};

function IceriklerTab({
  slug,
  contentItems,
  router,
}: {
  slug: string;
  contentItems: ContentItem[];
  router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    status: "PLANLANDI" as ContentItem["status"],
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, description: form.description || undefined }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setShowForm(false);
      setForm({ title: "", description: "", scheduledDate: "", status: "PLANLANDI" });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleStatusChange(id: string, status: ContentItem["status"]) {
    const data: Record<string, string | null> = { status };
    if (status === "YAYINLANDI") data.publishedAt = new Date().toISOString();
    await fetch(`/api/musteri/admin/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu içeriği sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/content/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {contentItems.map((ci) => (
        <div key={ci.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-white text-[14px] font-semibold leading-snug">{ci.title}</p>
              {ci.description && (
                <p className="text-[12px] text-[#8a8a9a] mt-0.5 leading-relaxed">{ci.description}</p>
              )}
              <p className="text-[11px] text-[#555] mt-1">
                {fmtDate(ci.scheduledDate)}
                {ci.publishedAt ? ` · Yayınlandı: ${fmtDate(ci.publishedAt)}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: CONTENT_STATUS_BG[ci.status],
                  color: STATUS_COLOR[ci.status],
                }}
              >
                {CONTENT_STATUS_LABEL[ci.status]}
              </span>
              <Select
                value={ci.status}
                onChange={(e) => handleStatusChange(ci.id, e.target.value as ContentItem["status"])}
                style={{ width: "auto", fontSize: "11px", padding: "3px 6px", color: STATUS_COLOR[ci.status] }}
              >
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </Select>
              <DeleteBtn onClick={() => handleDelete(ci.id)} loading={deleting === ci.id} />
            </div>
          </div>
        </div>
      ))}

      {contentItems.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz içerik yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">
          + İçerik Ekle
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni İçerik</p>
          <Field label="Başlık">
            <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Örn: Mayıs Tanıtım Videosu" />
          </Field>
          <Field label="Açıklama (opsiyonel)">
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="İçerik detayları, notlar..." />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Yayın Tarihi">
              <Input type="date" required value={form.scheduledDate} onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))} />
            </Field>
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ContentItem["status"] }))}>
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </Select>
            </Field>
          </div>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Kullanıcı sekmesi ─────────────────────────────────────────────────────────

function KullaniciTab({
  slug,
  users,
  router,
}: {
  slug: string;
  users: ClientDetailData["users"];
  router: ReturnType<typeof useRouter>;
}) {
  const existing = users[0] ?? null;
  const [form, setForm] = useState({
    username: existing?.username ?? slug,
    name: existing?.name ?? "",
    email: existing?.email ?? "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setOk(json.created ? "Kullanıcı oluşturuldu." : "Bilgiler güncellendi.");
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  return (
    <div className="space-y-5">
      {existing && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[14px]" style={{ background: "var(--grad-soft)", color: "#c084fc" }}>
            {existing.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-[14px] font-semibold">{existing.name}</p>
            <p className="text-[12px] text-[#8a8a9a]">@{existing.username} · {existing.email}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="font-semibold text-white text-[14px]">{existing ? "Bilgileri Güncelle / Şifre Sıfırla" : "Müşteri Girişi Oluştur"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Kullanıcı Adı">
            <Input required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder={slug} />
          </Field>
          <Field label="Ad Soyad">
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ali Yılmaz" />
          </Field>
        </div>
        <Field label="E-posta">
          <Input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="ali@firma.com" />
        </Field>
        <Field label={existing ? "Yeni Şifre" : "Şifre"}>
          <Input type="password" required={!existing} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={existing ? "Boş bırakırsan değişmez" : "Min. 6 karakter"} />
        </Field>
        <ErrMsg msg={err} />
        {ok && <p className="text-[12px] text-green-400">{ok}</p>}
        <SaveBtn loading={loading} label={existing ? "Güncelle" : "Oluştur"} />
      </form>
    </div>
  );
}
