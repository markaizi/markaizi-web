"use client";

import { useState, useEffect, useCallback } from "react";

type NoteVisibility = "ICERIK" | "PAYLASIMLI";
type AuthorRole = "ADMIN" | "EMPLOYEE" | "CLIENT";

interface NoteItem {
  id: string;
  text: string;
  visibility: NoteVisibility;
  authorRole: AuthorRole;
  authorName: string | null;
  createdAt: string;
  isOwn: boolean;
}

export default function Notes({
  clientSlug,
  canWrite,
  isAjans,
  isAdmin = false,
}: {
  clientSlug: string;
  canWrite: boolean;
  /** Admin veya çalışan ise true: görünürlük seçimi + ajans-içi notları görme */
  isAjans: boolean;
  /** Sadece admin ise true: başkasının notunu silebilir */
  isAdmin?: boolean;
}) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<NoteVisibility>("ICERIK");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/musteri/notes/${clientSlug}`);
    const json = await res.json();
    if (json.notes) setNotes(json.notes);
    setLoading(false);
  }, [clientSlug]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    setErr("");
    const res = await fetch(`/api/musteri/notes/${clientSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), visibility }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.ok) {
      setNotes((prev) => [json.note, ...prev]);
      setText("");
    } else {
      setErr(json.error ?? "Hata.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu notu sil?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/musteri/notes/note/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } else {
      const json = await res.json().catch(() => ({}));
      setErr(json.error ?? "Not silinemedi.");
    }
    setDeletingId(null);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="space-y-5">
      {/* Yazma formu */}
      {canWrite && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="font-semibold text-white text-[14px]">Not Ekle</p>

          {/* Görünürlük seçimi — yalnızca ajans kullanıcıları */}
          {isAjans && (
            <div className="flex gap-2 flex-wrap">
              {(["ICERIK", "PAYLASIMLI"] as NoteVisibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    background: visibility === v
                      ? v === "ICERIK" ? "rgba(96,165,250,0.2)" : "rgba(52,211,153,0.2)"
                      : "var(--bg)",
                    border: `1px solid ${visibility === v
                      ? v === "ICERIK" ? "rgba(96,165,250,0.4)" : "rgba(52,211,153,0.4)"
                      : "var(--border)"}`,
                    color: visibility === v
                      ? v === "ICERIK" ? "#60a5fa" : "#34d399"
                      : "#555",
                  }}
                >
                  {v === "ICERIK" ? "🔒 Ajans İçi" : "👁 Müşteriyle Paylaş"}
                </button>
              ))}
            </div>
          )}

          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isAjans
                ? "Ajans içi not veya müşteriyle paylaşılacak not..."
                : "Notunuzu buraya yazın..."
            }
            className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          />

          {err && <p className="text-[12px] text-red-400">{err}</p>}

          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="btn btn-primary text-sm px-5 py-2"
          >
            {saving ? "..." : "Kaydet"}
          </button>
        </form>
      )}

      {/* Güvenlik uyarısı */}
      {canWrite && (
        <p className="text-[11px] text-[#555] text-center">
          ⚠️ Şifre veya hassas kimlik bilgisi saklamayın — notlar şifrelenmeden tutulur.
        </p>
      )}

      {/* Not listesi */}
      {loading ? (
        <div className="text-center py-10 text-[#555] text-[14px]">Yükleniyor...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-[#555]">Henüz not yok.</p>
          {canWrite && (
            <p className="text-[12px] text-[#444] mt-1">Yukarıdaki formu kullanarak not ekleyebilirsiniz.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isIcerik = note.visibility === "ICERIK";
            return (
              <div
                key={note.id}
                className="rounded-xl p-4 relative"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isIcerik ? "rgba(96,165,250,0.15)" : "rgba(52,211,153,0.15)"}`,
                }}
              >
                <div className="flex items-start gap-2 mb-2 flex-wrap pr-8">
                  {/* Görünürlük rozeti — yalnızca ajans */}
                  {isAjans && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{
                        background: isIcerik ? "rgba(96,165,250,0.1)" : "rgba(52,211,153,0.1)",
                        color: isIcerik ? "#60a5fa" : "#34d399",
                      }}
                    >
                      {isIcerik ? "🔒 Ajans İçi" : "👁 Paylaşımlı"}
                    </span>
                  )}

                  {/* Yazar rozeti */}
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}
                  >
                    {note.authorRole === "ADMIN"
                      ? "Yönetici"
                      : note.authorRole === "EMPLOYEE"
                      ? "Çalışan"
                      : "Müşteri"}
                    {note.authorName ? ` · ${note.authorName}` : ""}
                  </span>

                  <span className="text-[11px] text-[#555] ml-auto flex-shrink-0">
                    {fmtDate(note.createdAt)}
                  </span>
                </div>

                <p className="text-[14px] text-[#c8c8d0] whitespace-pre-wrap leading-relaxed">
                  {note.text}
                </p>

                {(note.isOwn || isAdmin) && (
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="absolute top-3 right-3 text-[11px] text-[#555] hover:text-red-400 transition-colors"
                  >
                    {deletingId === note.id ? "..." : "Sil"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
