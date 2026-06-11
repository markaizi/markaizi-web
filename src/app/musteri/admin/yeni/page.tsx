"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function YeniFirmaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", package: "", invoiceNote: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Firmadan otomatik slug üret
  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: autoSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/musteri/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      router.push(`/musteri/admin/${json.slug}`);
    } else {
      setErr(json.error ?? "Hata.");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-2"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <a href="/" className="font-black text-[18px] gradient-text">markaizi</a>
        <span className="text-[#555]">/</span>
        <a href="/musteri/admin" className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
        <span className="text-[#555]">/</span>
        <span className="text-[14px] font-semibold text-white">Yeni Firma</span>
      </header>

      <main className="max-w-[520px] mx-auto px-6 py-12">
        <h1 className="font-black text-[24px] text-white mb-2">Yeni Firma Ekle</h1>
        <p className="text-[14px] text-[#8a8a9a] mb-8">Firma oluşturulduktan sonra kampanya, güncelleme ve fatura ekleyebilirsin.</p>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Firma Adı</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Örn: Ahmet Nakliyat"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">
              Slug (URL) <span className="normal-case font-normal text-[#555]">— otomatik, düzenleyebilirsin</span>
            </label>
            <div className="flex items-center gap-0">
              <span className="px-3 py-2.5 rounded-l-lg text-[13px] text-[#555]" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRight: "none" }}>
                /musteri/
              </span>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="ahmet-nakliyat"
                className="flex-1 px-3 py-2.5 rounded-r-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Paket</label>
            <input
              required
              value={form.package}
              onChange={(e) => setForm((f) => ({ ...f, package: e.target.value }))}
              placeholder="Örn: Sosyal Medya Yönetimi"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Fatura Notu (opsiyonel)</label>
            <textarea
              rows={2}
              value={form.invoiceNote}
              onChange={(e) => setForm((f) => ({ ...f, invoiceNote: e.target.value }))}
              placeholder="Fatura bilgisi, ödeme şartları..."
              className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
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
