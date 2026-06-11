"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface EmployeeData {
  id: string;
  username: string;
  name: string;
  email: string;
  assignments: { id: string; client: { id: string; slug: string; name: string } }[];
}

export default function AdminEmployeePanel({
  employees,
  allClients,
}: {
  employees: EmployeeData[];
  allClients: { id: string; slug: string; name: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/musteri/admin/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setShowForm(false);
      setForm({ username: "", name: "", email: "", password: "" });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleAssign(userId: string, clientSlug: string) {
    await fetch("/api/musteri/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clientSlug }),
    });
    router.refresh();
  }

  async function handleUnassign(assignmentId: string) {
    await fetch(`/api/musteri/admin/assignments/${assignmentId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <a href="/" className="font-black text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555]">/</span>
          <a href="/musteri/admin" className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">Çalışanlar</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-black text-[24px] text-white mb-1">Çalışanlar</h1>
            <p className="text-[14px] text-[#8a8a9a]">{employees.length} çalışan</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm px-5 py-2.5">
            + Yeni Çalışan
          </button>
        </div>

        {/* Yeni Çalışan Formu */}
        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl p-6 mb-8 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <p className="font-semibold text-white text-[15px]">Yeni Çalışan</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Kullanıcı Adı</label>
                <input required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="ali.yilmaz" className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ad Soyad</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ali Yılmaz" className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">E-posta</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="ali@markaizi.com" className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Şifre</label>
                <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 karakter" className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
              </div>
            </div>
            {err && <p className="text-[12px] text-red-400">{err}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">
                {loading ? "..." : "Oluştur"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
            </div>
          </form>
        )}

        {/* Çalışan Listesi */}
        <div className="space-y-5">
          {employees.length === 0 && !showForm && (
            <p className="text-[13px] text-[#8a8a9a] text-center py-12">Henüz çalışan yok. "+ Yeni Çalışan" ile ekle.</p>
          )}
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              allClients={allClients}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function EmployeeCard({
  employee,
  allClients,
  onAssign,
  onUnassign,
}: {
  employee: EmployeeData;
  allClients: { id: string; slug: string; name: string }[];
  onAssign: (userId: string, clientSlug: string) => void;
  onUnassign: (assignmentId: string) => void;
}) {
  const assignedSlugs = new Set(employee.assignments.map((a) => a.client.slug));
  const available = allClients.filter((c) => !assignedSlugs.has(c.slug));
  const [selectedSlug, setSelectedSlug] = useState(available[0]?.slug ?? "");

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[16px] flex-shrink-0"
          style={{ background: "var(--grad-soft)", color: "#c084fc" }}>
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold text-[15px]">{employee.name}</p>
          <p className="text-[12px] text-[#8a8a9a]">@{employee.username} · {employee.email}</p>
        </div>
      </div>

      {/* Atanmış firmalar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {employee.assignments.length === 0 && (
          <span className="text-[12px] text-[#555]">Henüz firma atanmamış</span>
        )}
        {employee.assignments.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px]"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}>
            {a.client.name}
            <button onClick={() => onUnassign(a.id)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity text-[10px]">✕</button>
          </div>
        ))}
      </div>

      {/* Firma ekle */}
      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-[13px] text-white outline-none"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            {available.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => { if (selectedSlug) onAssign(employee.id, selectedSlug); }}
            className="btn btn-outline text-sm px-4 py-2"
          >
            Ata
          </button>
        </div>
      )}
    </div>
  );
}
