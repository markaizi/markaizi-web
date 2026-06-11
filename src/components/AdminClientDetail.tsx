"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ClientDetailData {
  id: string;
  slug: string;
  name: string;
  package: string;
  invoiceNote: string;
  active: boolean;
  campaigns: {
    id: string;
    platform: "META" | "GOOGLE" | "TIKTOK";
    name: string;
    dailyBudget: string;
    status: "AKTIF" | "DURAKLATILDI" | "TAMAMLANDI" | "ODEME_HATASI";
    ongoing: boolean;
    startDate: string | null;
    endDate: string | null;
  }[];
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
    status: "ODENDI" | "BEKLIYOR" | "GUNU_GELMEDI";
    dueDate: string | null;
  }[];
  users: { id: string; username: string | null; name: string; email: string }[];
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = { META: "Meta", GOOGLE: "Google", TIKTOK: "TikTok" };
const PLATFORM_COLOR: Record<string, string> = {
  META: "rgba(168,85,247,0.15)",
  GOOGLE: "rgba(59,130,246,0.15)",
  TIKTOK: "rgba(236,72,153,0.15)",
};
const PLATFORM_TEXT: Record<string, string> = {
  META: "#c084fc",
  GOOGLE: "#60a5fa",
  TIKTOK: "#f472b6",
};
const STATUS_LABEL: Record<string, string> = {
  AKTIF: "Aktif",
  DURAKLATILDI: "Duraklatıldı",
  TAMAMLANDI: "Tamamlandı",
  ODEME_HATASI: "Ödeme Hatası",
  ODENDI: "Ödendi",
  BEKLIYOR: "Bekliyor",
  GUNU_GELMEDI: "Günü Gelmedi",
};
const STATUS_COLOR: Record<string, string> = {
  AKTIF: "#34d399",
  DURAKLATILDI: "#fbbf24",
  TAMAMLANDI: "#8a8a9a",
  ODEME_HATASI: "#f87171",
  ODENDI: "#34d399",
  BEKLIYOR: "#fbbf24",
  GUNU_GELMEDI: "#8a8a9a",
};

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
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="text-[12px] text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded"
    >
      {loading ? "..." : "Sil"}
    </button>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function AdminClientDetail({ data }: { data: ClientDetailData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"genel" | "kampanyalar" | "guncellemeler" | "faturalar" | "kullanici">("genel");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <a href="/" className="font-black text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="text-[#555]">/</span>
          <a href="/musteri/admin" className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors flex-shrink-0">Admin</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{data.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
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
            <p className="text-[13px] text-[#8a8a9a]">{data.package} · /{data.slug}</p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-1 mb-7 flex-wrap">
          {(["genel", "kampanyalar", "guncellemeler", "faturalar", "kullanici"] as const).map((t) => {
            const labels: Record<typeof t, string> = {
              genel: "Genel",
              kampanyalar: "Kampanyalar",
              guncellemeler: "Güncellemeler",
              faturalar: "Faturalar",
              kullanici: "Kullanıcı",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                style={{
                  background: tab === t ? "rgba(168,85,247,0.2)" : "var(--surface)",
                  border: `1px solid ${tab === t ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
                  color: tab === t ? "#c084fc" : "#8a8a9a",
                }}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* İçerik */}
        {tab === "genel" && <GenelTab data={data} router={router} />}
        {tab === "kampanyalar" && <KampanyalarTab slug={data.slug} campaigns={data.campaigns} router={router} />}
        {tab === "guncellemeler" && <GuncellemelerTab slug={data.slug} updates={data.updates} router={router} />}
        {tab === "faturalar" && <FaturalarTab slug={data.slug} invoices={data.invoices} router={router} />}
        {tab === "kullanici" && <KullaniciTab slug={data.slug} users={data.users} router={router} />}
      </main>
    </div>
  );
}

// ── Genel sekmesi ─────────────────────────────────────────────────────────────

function GenelTab({ data, router }: { data: ClientDetailData; router: ReturnType<typeof useRouter> }) {
  const [form, setForm] = useState({ name: data.name, package: data.package, invoiceNote: data.invoiceNote });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk(false);
    const res = await fetch(`/api/musteri/admin/clients/${data.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Field label="Firma Adı">
          <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Paket">
          <Input required value={form.package} onChange={(e) => setForm((f) => ({ ...f, package: e.target.value }))} placeholder="Örn: Premium Paket" />
        </Field>
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

// ── Kampanyalar sekmesi ───────────────────────────────────────────────────────

type Campaign = ClientDetailData["campaigns"][number];

function KampanyalarTab({ slug, campaigns, router }: { slug: string; campaigns: Campaign[]; router: ReturnType<typeof useRouter> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    platform: "META" as Campaign["platform"],
    name: "",
    dailyBudget: "",
    status: "AKTIF" as Campaign["status"],
    ongoing: false,
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, startDate: form.startDate || null, endDate: form.endDate || null }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setShowForm(false);
      setForm({ platform: "META", name: "", dailyBudget: "", status: "AKTIF", ongoing: false, startDate: "", endDate: "" });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kampanyayı sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/campaigns/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: Campaign["status"]) {
    await fetch(`/api/musteri/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {campaigns.map((c) => (
        <div key={c.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: PLATFORM_COLOR[c.platform], color: PLATFORM_TEXT[c.platform] }}
          >
            {PLATFORM_LABEL[c.platform]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[14px] font-semibold truncate">{c.name}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">{c.dailyBudget} · {c.ongoing ? "Devam ediyor" : `${c.startDate ?? "?"} → ${c.endDate ?? "?"}`}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select
              value={c.status}
              onChange={(e) => handleStatusChange(c.id, e.target.value as Campaign["status"])}
              style={{ width: "auto", fontSize: "12px", padding: "4px 8px", color: STATUS_COLOR[c.status] }}
            >
              {["AKTIF", "DURAKLATILDI", "TAMAMLANDI", "ODEME_HATASI"].map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </Select>
            <DeleteBtn onClick={() => handleDelete(c.id)} loading={deleting === c.id} />
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz kampanya yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">
          + Kampanya Ekle
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Kampanya</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <Select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Campaign["platform"] }))}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="TIKTOK">TikTok</option>
              </Select>
            </Field>
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Campaign["status"] }))}>
                <option value="AKTIF">Aktif</option>
                <option value="DURAKLATILDI">Duraklatıldı</option>
                <option value="TAMAMLANDI">Tamamlandı</option>
                <option value="ODEME_HATASI">Ödeme Hatası</option>
              </Select>
            </Field>
          </div>
          <Field label="Kampanya Adı">
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Örn: Yaz Kampanyası 2026" />
          </Field>
          <Field label="Günlük Bütçe">
            <Input required value={form.dailyBudget} onChange={(e) => setForm((f) => ({ ...f, dailyBudget: e.target.value }))} placeholder="Örn: 200 ₺/gün" />
          </Field>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ongoing" checked={form.ongoing} onChange={(e) => setForm((f) => ({ ...f, ongoing: e.target.checked }))} className="accent-purple-500" />
            <label htmlFor="ongoing" className="text-[13px] text-[#8a8a9a]">Devam ediyor (süresiz)</label>
          </div>
          {!form.ongoing && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Başlangıç">
                <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </Field>
              <Field label="Bitiş">
                <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </Field>
            </div>
          )}
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

// ── Güncellemeler sekmesi ─────────────────────────────────────────────────────

type Update = ClientDetailData["updates"][number];

function GuncellemelerTab({ slug, updates, router }: { slug: string; updates: Update[]; router: ReturnType<typeof useRouter> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kind: "AJANS" as Update["kind"], text: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

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
    if (json.ok) {
      setShowForm(false);
      setForm({ kind: "AJANS", text: "", date: new Date().toISOString().split("T")[0] });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
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
      {updates.map((u) => (
        <div key={u.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{
              background: u.kind === "AJANS" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)",
              color: u.kind === "AJANS" ? "#c084fc" : "#60a5fa",
            }}
          >
            {u.kind === "AJANS" ? "Ajans" : "Web Site"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] leading-relaxed">{u.text}</p>
            <p className="text-[11px] text-[#555] mt-1">{u.date}</p>
          </div>
          <DeleteBtn onClick={() => handleDelete(u.id)} loading={deleting === u.id} />
        </div>
      ))}

      {updates.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz güncelleme yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">
          + Güncelleme Ekle
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Güncelleme</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tür">
              <Select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as Update["kind"] }))}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </Select>
            </Field>
            <Field label="Tarih">
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Güncelleme Metni">
            <Textarea required value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..." />
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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ period: "", amount: "", status: "BEKLIYOR" as Invoice["status"], dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dueDate: form.dueDate || null }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setShowForm(false);
      setForm({ period: "", amount: "", status: "BEKLIYOR", dueDate: "" });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleStatusChange(id: string, status: Invoice["status"]) {
    await fetch(`/api/musteri/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
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
      {invoices.map((inv) => (
        <div key={inv.id} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[14px] font-semibold">{inv.period}</p>
            <p className="text-[13px] text-[#8a8a9a]">{inv.amount}{inv.dueDate ? ` · Vade: ${inv.dueDate}` : ""}</p>
          </div>
          <Select
            value={inv.status}
            onChange={(e) => handleStatusChange(inv.id, e.target.value as Invoice["status"])}
            style={{ width: "auto", fontSize: "12px", padding: "4px 8px", color: STATUS_COLOR[inv.status] }}
          >
            <option value="ODENDI">Ödendi</option>
            <option value="BEKLIYOR">Bekliyor</option>
            <option value="GUNU_GELMEDI">Günü Gelmedi</option>
          </Select>
          <DeleteBtn onClick={() => handleDelete(inv.id)} loading={deleting === inv.id} />
        </div>
      ))}

      {invoices.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz fatura yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">
          + Fatura Ekle
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Fatura</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dönem">
              <Input required value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} placeholder="Haziran 2026" />
            </Field>
            <Field label="Tutar">
              <Input required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="5.000 ₺" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Invoice["status"] }))}>
                <option value="BEKLIYOR">Bekliyor</option>
                <option value="ODENDI">Ödendi</option>
                <option value="GUNU_GELMEDI">Günü Gelmedi</option>
              </Select>
            </Field>
            <Field label="Vade Tarihi (opsiyonel)">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
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
    <div>
      {existing && (
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
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
        <div className="grid grid-cols-2 gap-3">
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
