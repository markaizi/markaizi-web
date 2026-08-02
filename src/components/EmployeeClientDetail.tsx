"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Notes from "@/components/Notes";

export interface EmployeeClientData {
  slug: string;
  name: string;
  perms: {
    canViewContent: boolean;
    canManageContent: boolean;
    canViewUpdates: boolean;
    canManageUpdates: boolean;
    canViewInvoices: boolean;
    canManageInvoices: boolean;
  };
  updates: { id: string; kind: "AJANS" | "WEBSITE"; text: string; date: string }[];
  contentItems: {
    id: string; title: string; description: string;
    scheduledDate: string;
    status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
    publishedAt: string | null;
  }[];
  invoices: {
    id: string; period: string; amount: string;
    status: "ODENDI" | "BEKLIYOR" | "GUNU_GELMEDI";
    dueDate: string | null;
  }[];
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

const STATUS_LABEL: Record<string, string> = {
  PLANLANDI: "Planlandı", DUZENLENIYOR: "Düzenleniyor", HAZIR: "Hazır", YAYINLANDI: "Yayınlandı",
  ODENDI: "Ödendi", BEKLIYOR: "Bekliyor", GUNU_GELMEDI: "Günü Gelmedi",
};
const STATUS_COLOR: Record<string, string> = {
  PLANLANDI: "#8a8a9a", DUZENLENIYOR: "#fbbf24", HAZIR: "#60a5fa", YAYINLANDI: "#34d399",
  ODENDI: "#34d399", BEKLIYOR: "#fbbf24", GUNU_GELMEDI: "#8a8a9a",
};
const CONTENT_STATUS_BG: Record<string, string> = {
  PLANLANDI: "rgba(138,138,154,0.12)", DUZENLENIYOR: "rgba(251,191,36,0.12)",
  HAZIR: "rgba(96,165,250,0.12)", YAYINLANDI: "rgba(52,211,153,0.12)",
};
const PLATFORM_LABEL: Record<string, string> = { META: "Meta", GOOGLE: "Google", WEBSITE: "Website" };
const PLATFORM_COLOR: Record<string, string> = { META: "#60a5fa", GOOGLE: "#34d399", WEBSITE: "#c084fc" };
type ContentStatus = EmployeeClientData["contentItems"][number]["status"];
type InvoiceStatus = EmployeeClientData["invoices"][number]["status"];
type AdReport = EmployeeClientData["adReports"][number];

type TabKey = "icerikler" | "guncellemeler" | "faturalar" | "raporlar" | "notlar";

export default function EmployeeClientDetail({ data, unreadNoteCount = 0 }: { data: EmployeeClientData; unreadNoteCount?: number }) {
  const router = useRouter();
  const { perms } = data;

  const tabs = [
    (perms.canViewContent || perms.canManageContent) && { key: "icerikler" as TabKey, label: "İçerikler" },
    (perms.canViewUpdates || perms.canManageUpdates) && { key: "guncellemeler" as TabKey, label: "Güncellemeler" },
    perms.canViewInvoices && { key: "faturalar" as TabKey, label: "Faturalar" },
    { key: "raporlar" as TabKey, label: "Raporlar" },
    { key: "notlar" as TabKey, label: "Müşteri İstekleri" },
  ].filter(Boolean) as { key: TabKey; label: string }[];

  const [tab, setTab] = useState<TabKey>(tabs[0]?.key ?? "icerikler");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555] flex-shrink-0">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{data.name}</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] flex items-center gap-1.5 flex-shrink-0 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[20px]"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-[22px] text-white">{data.name}</h1>
          </div>
        </div>

        {tabs.length === 0 ? (
          <p className="text-[14px] text-[#8a8a9a] text-center py-16">Bu firmada henüz görüntüleme yetkiniz yok.</p>
        ) : (
          <>
            <div className="flex gap-1 mb-7 flex-wrap">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="px-4 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5"
                  style={{
                    background: tab === t.key ? "rgba(96,165,250,0.2)" : "var(--surface)",
                    border: `1px solid ${tab === t.key ? "rgba(96,165,250,0.4)" : "var(--border)"}`,
                    color: tab === t.key ? "#60a5fa" : "#8a8a9a",
                  }}>
                  {t.label}
                  {t.key === "notlar" && unreadNoteCount > 0 && tab !== "notlar" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(251,146,60,0.2)", color: "#fb923c" }}>
                      {unreadNoteCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab === "icerikler" && (
              <EmpIceriklerTab slug={data.slug} contentItems={data.contentItems}
                canManage={perms.canManageContent} router={router} />
            )}
            {tab === "guncellemeler" && (
              <EmpGuncellemelerTab slug={data.slug} updates={data.updates}
                canManage={perms.canManageUpdates} router={router} />
            )}
            {tab === "faturalar" && perms.canViewInvoices && (
              <EmpFaturalarTab slug={data.slug} invoices={data.invoices}
                canManage={perms.canManageInvoices} router={router} />
            )}
            {tab === "raporlar" && (
              <EmpRaporlarTab slug={data.slug} reports={data.adReports} router={router} />
            )}
            {tab === "notlar" && (
              <Notes clientSlug={data.slug} isClient={false} isStaff />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── İçerikler ─────────────────────────────────────────────────────────────────

function EmpIceriklerTab({ slug, contentItems, canManage, router }: {
  slug: string; contentItems: EmployeeClientData["contentItems"];
  canManage: boolean; router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", scheduledDate: "", status: "PLANLANDI" as ContentStatus });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/content`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, description: form.description || undefined }),
    });
    const json = await res.json(); setLoading(false);
    if (json.ok) { setShowForm(false); setForm({ title: "", description: "", scheduledDate: "", status: "PLANLANDI" }); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleStatusChange(id: string, status: ContentStatus) {
    const body: Record<string, string | null> = { status };
    if (status === "YAYINLANDI") body.publishedAt = new Date().toISOString();
    await fetch(`/api/musteri/admin/content/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {contentItems.map((ci) => (
        <div key={ci.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-white text-[14px] font-semibold">{ci.title}</p>
              {ci.description && <p className="text-[12px] text-[#8a8a9a] mt-0.5">{ci.description}</p>}
              <p className="text-[11px] text-[#555] mt-1">{ci.scheduledDate}{ci.publishedAt ? ` · Yayınlandı: ${ci.publishedAt}` : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: CONTENT_STATUS_BG[ci.status], color: STATUS_COLOR[ci.status] }}>
                {STATUS_LABEL[ci.status]}
              </span>
              {canManage && (
                <select value={ci.status} onChange={(e) => handleStatusChange(ci.id, e.target.value as ContentStatus)}
                  className="rounded-lg text-[11px] outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 6px", color: STATUS_COLOR[ci.status] }}>
                  <option value="PLANLANDI">Planlandı</option>
                  <option value="DUZENLENIYOR">Düzenleniyor</option>
                  <option value="HAZIR">Hazır</option>
                  <option value="YAYINLANDI">Yayınlandı</option>
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
      {contentItems.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz içerik yok.</p>}
      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ İçerik Ekle</button>
      )}
      {canManage && showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni İçerik</p>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Mayıs Tanıtım Videosu"
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Açıklama (opsiyonel)</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="İçerik detayları..."
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Yayın Tarihi</label>
              <input type="date" required value={form.scheduledDate} onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Durum</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ContentStatus }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </select>
            </div>
          </div>
          {err && <p className="text-[12px] text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">{loading ? "..." : "Ekle"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Güncellemeler ─────────────────────────────────────────────────────────────

function EmpGuncellemelerTab({ slug, updates, canManage, router }: {
  slug: string; updates: EmployeeClientData["updates"];
  canManage: boolean; router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kind: "AJANS" as "AJANS" | "WEBSITE", text: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/updates`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const json = await res.json(); setLoading(false);
    if (json.ok) { setShowForm(false); setForm({ kind: "AJANS", text: "", date: new Date().toISOString().split("T")[0] }); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => (
        <div key={u.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: u.kind === "AJANS" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)", color: u.kind === "AJANS" ? "#c084fc" : "#60a5fa" }}>
            {u.kind === "AJANS" ? "Ajans" : "Web Site"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">{u.text}</p>
            <p className="text-[11px] text-[#555] mt-1">{u.date}</p>
          </div>
        </div>
      ))}
      {updates.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz güncelleme yok.</p>}
      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Güncelleme Ekle</button>
      )}
      {canManage && showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Güncelleme</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tür</label>
              <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as "AJANS" | "WEBSITE" }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tarih</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Metin</label>
            <textarea required rows={3} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..."
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          {err && <p className="text-[12px] text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">{loading ? "..." : "Ekle"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Faturalar ─────────────────────────────────────────────────────────────────

function EmpFaturalarTab({ slug, invoices, canManage, router }: {
  slug: string; invoices: EmployeeClientData["invoices"];
  canManage: boolean; router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ period: "", amount: "", status: "BEKLIYOR" as InvoiceStatus, dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/invoices`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dueDate: form.dueDate || null }),
    });
    const json = await res.json(); setLoading(false);
    if (json.ok) { setShowForm(false); setForm({ period: "", amount: "", status: "BEKLIYOR", dueDate: "" }); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleStatusChange(id: string, status: InvoiceStatus) {
    await fetch(`/api/musteri/admin/invoices/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => (
        <div key={inv.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white text-[14px] font-semibold">{inv.period}</p>
              <p className="text-[13px] text-[#8a8a9a] mt-0.5">{inv.amount}{inv.dueDate ? ` · Vade: ${inv.dueDate}` : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] px-2.5 py-1 rounded-full"
                style={{ background: "rgba(138,138,154,0.12)", color: STATUS_COLOR[inv.status] }}>
                {STATUS_LABEL[inv.status]}
              </span>
              {canManage && (
                <select value={inv.status} onChange={(e) => handleStatusChange(inv.id, e.target.value as InvoiceStatus)}
                  className="rounded-lg text-[11px] outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 6px", color: STATUS_COLOR[inv.status] }}>
                  <option value="ODENDI">Ödendi</option>
                  <option value="BEKLIYOR">Bekliyor</option>
                  <option value="GUNU_GELMEDI">Günü Gelmedi</option>
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
      {invoices.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Fatura yok.</p>}
      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Fatura Ekle</button>
      )}
      {canManage && showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Fatura</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Dönem</label>
              <input required value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} placeholder="Haziran 2026"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tutar</label>
              <input required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="₺5.000"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Durum</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as InvoiceStatus }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <option value="BEKLIYOR">Bekliyor</option>
                <option value="ODENDI">Ödendi</option>
                <option value="GUNU_GELMEDI">Günü Gelmedi</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Vade Tarihi</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          {err && <p className="text-[12px] text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">{loading ? "..." : "Ekle"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Raporlar ──────────────────────────────────────────────────────────────────

function fmtReportDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function EmpRaporlarTab({ slug, reports, router }: {
  slug: string; reports: AdReport[]; router: ReturnType<typeof useRouter>;
}) {
  const emptyForm = { platform: "META" as AdReport["platform"], month: "", spend: "", impressions: "", clicks: "", summary: "" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/reports`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const json = await res.json(); setLoading(false);
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
      {reports.map((r) => (
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
            <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
              className="text-[12px] text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded flex-shrink-0">
              {deleting === r.id ? "..." : "Sil"}
            </button>
          </div>
        </div>
      ))}
      {reports.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz rapor yayınlanmadı.</p>}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Rapor Yayınla</button>
      )}
      {showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Rapor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as AdReport["platform"] }))}
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="WEBSITE">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ay</label>
              <input required value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} placeholder="Temmuz 2026"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Harcama</label>
              <input value={form.spend} onChange={(e) => setForm((f) => ({ ...f, spend: e.target.value }))} placeholder="5.000 ₺"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Görüntülenme</label>
              <input value={form.impressions} onChange={(e) => setForm((f) => ({ ...f, impressions: e.target.value }))} placeholder="42.000"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tıklama</label>
              <input value={form.clicks} onChange={(e) => setForm((f) => ({ ...f, clicks: e.target.value }))} placeholder="850"
                className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Özet (opsiyonel)</label>
            <textarea rows={3} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Neye ne kadar harcandığına dair kısa özet..."
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          {err && <p className="text-[12px] text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">{loading ? "..." : "Yayınla"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}
