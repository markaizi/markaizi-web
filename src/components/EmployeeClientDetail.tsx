"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface EmployeeClientData {
  slug: string;
  name: string;
  package: string;
  campaigns: {
    id: string;
    platform: "META" | "GOOGLE" | "TIKTOK";
    name: string;
    dailyBudget: string;
    status: "AKTIF" | "DURAKLATILDI" | "TAMAMLANDI" | "ODEME_HATASI";
    ongoing: boolean;
  }[];
  updates: { id: string; kind: "AJANS" | "WEBSITE"; text: string; date: string }[];
  contentItems: {
    id: string;
    title: string;
    description: string;
    scheduledDate: string;
    status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
    publishedAt: string | null;
  }[];
}

const PLATFORM_COLOR: Record<string, string> = { META: "#c084fc", GOOGLE: "#60a5fa", TIKTOK: "#f472b6" };
const PLATFORM_BG: Record<string, string> = { META: "rgba(168,85,247,0.15)", GOOGLE: "rgba(59,130,246,0.15)", TIKTOK: "rgba(236,72,153,0.15)" };
const STATUS_LABEL: Record<string, string> = {
  AKTIF: "Aktif", DURAKLATILDI: "Duraklatıldı", TAMAMLANDI: "Tamamlandı", ODEME_HATASI: "Ödeme Hatası",
  PLANLANDI: "Planlandı", DUZENLENIYOR: "Düzenleniyor", HAZIR: "Hazır", YAYINLANDI: "Yayınlandı",
};
const STATUS_COLOR: Record<string, string> = {
  AKTIF: "#34d399", DURAKLATILDI: "#fbbf24", TAMAMLANDI: "#8a8a9a", ODEME_HATASI: "#f87171",
  PLANLANDI: "#8a8a9a", DUZENLENIYOR: "#fbbf24", HAZIR: "#60a5fa", YAYINLANDI: "#34d399",
};
const CONTENT_STATUS_BG: Record<string, string> = {
  PLANLANDI: "rgba(138,138,154,0.12)", DUZENLENIYOR: "rgba(251,191,36,0.12)",
  HAZIR: "rgba(96,165,250,0.12)", YAYINLANDI: "rgba(52,211,153,0.12)",
};

type ContentStatus = EmployeeClientData["contentItems"][number]["status"];

export default function EmployeeClientDetail({ data }: { data: EmployeeClientData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"icerikler" | "guncellemeler" | "kampanyalar">("icerikler");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <a href="/" className="font-black text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="text-[#555]">/</span>
          <a href="/musteri/calisan" className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors flex-shrink-0">Panel</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{data.name}</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
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
            <p className="text-[13px] text-[#8a8a9a]">{data.package}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-7 flex-wrap">
          {(["icerikler", "guncellemeler", "kampanyalar"] as const).map((t) => {
            const labels = { icerikler: "İçerikler", guncellemeler: "Güncellemeler", kampanyalar: "Kampanyalar" };
            return (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                style={{
                  background: tab === t ? "rgba(96,165,250,0.2)" : "var(--surface)",
                  border: `1px solid ${tab === t ? "rgba(96,165,250,0.4)" : "var(--border)"}`,
                  color: tab === t ? "#60a5fa" : "#8a8a9a",
                }}>
                {labels[t]}
              </button>
            );
          })}
        </div>

        {tab === "icerikler" && <EmpIceriklerTab slug={data.slug} contentItems={data.contentItems} router={router} />}
        {tab === "guncellemeler" && <EmpGuncellemelerTab slug={data.slug} updates={data.updates} router={router} />}
        {tab === "kampanyalar" && <EmpKampanyalarTab campaigns={data.campaigns} />}
      </main>
    </div>
  );
}

// ── İçerikler (çalışan) ───────────────────────────────────────────────────────

function EmpIceriklerTab({
  slug,
  contentItems,
  router,
}: {
  slug: string;
  contentItems: EmployeeClientData["contentItems"];
  router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", scheduledDate: "", status: "PLANLANDI" as ContentStatus });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

  async function handleStatusChange(id: string, status: ContentStatus) {
    const body: Record<string, string | null> = { status };
    if (status === "YAYINLANDI") body.publishedAt = new Date().toISOString();
    await fetch(`/api/musteri/admin/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {contentItems.map((ci) => (
        <div key={ci.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-white text-[14px] font-semibold leading-snug">{ci.title}</p>
              {ci.description && <p className="text-[12px] text-[#8a8a9a] mt-0.5 leading-relaxed">{ci.description}</p>}
              <p className="text-[11px] text-[#555] mt-1">{ci.scheduledDate}{ci.publishedAt ? ` · Yayınlandı: ${ci.publishedAt}` : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: CONTENT_STATUS_BG[ci.status], color: STATUS_COLOR[ci.status] }}>
                {STATUS_LABEL[ci.status]}
              </span>
              <select value={ci.status} onChange={(e) => handleStatusChange(ci.id, e.target.value as ContentStatus)}
                className="rounded-lg text-[11px] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 6px", color: STATUS_COLOR[ci.status] }}>
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {contentItems.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz içerik yok.</p>}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ İçerik Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni İçerik</p>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Mayıs Tanıtım Videosu"
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Açıklama (opsiyonel)</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="İçerik detayları..."
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
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

// ── Güncellemeler (çalışan) ───────────────────────────────────────────────────

function EmpGuncellemelerTab({
  slug,
  updates,
  router,
}: {
  slug: string;
  updates: EmployeeClientData["updates"];
  router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kind: "AJANS" as "AJANS" | "WEBSITE", text: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

  return (
    <div className="space-y-3">
      {updates.map((u) => (
        <div key={u.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{
              background: u.kind === "AJANS" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)",
              color: u.kind === "AJANS" ? "#c084fc" : "#60a5fa",
            }}>
            {u.kind === "AJANS" ? "Ajans" : "Web Site"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] leading-relaxed">{u.text}</p>
            <p className="text-[11px] text-[#555] mt-1">{u.date}</p>
          </div>
        </div>
      ))}

      {updates.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz güncelleme yok.</p>}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Güncelleme Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Güncelleme</p>
          <div className="grid grid-cols-2 gap-3">
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
            <textarea required rows={3} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Yapılan çalışmayı açıklayın..."
              className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
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

// ── Kampanyalar (çalışan, sadece okuma) ──────────────────────────────────────

function EmpKampanyalarTab({ campaigns }: { campaigns: EmployeeClientData["campaigns"] }) {
  return (
    <div className="space-y-3">
      {campaigns.map((c) => (
        <div key={c.id} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: PLATFORM_BG[c.platform], color: PLATFORM_COLOR[c.platform] }}>
            {c.platform}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[14px] font-semibold truncate">{c.name}</p>
            <p className="text-[12px] text-[#8a8a9a]">{c.dailyBudget} · {c.ongoing ? "Devam ediyor" : c.status}</p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded-full flex-shrink-0"
            style={{ background: "rgba(138,138,154,0.12)", color: STATUS_COLOR[c.status] }}>
            {STATUS_LABEL[c.status]}
          </span>
        </div>
      ))}
      {campaigns.length === 0 && <p className="text-[13px] text-[#8a8a9a] text-center py-8">Kampanya yok.</p>}
    </div>
  );
}
