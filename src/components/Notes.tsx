"use client";

import { useState, useEffect, useCallback } from "react";

type RequestStatus = "BEKLIYOR" | "YAPILDI";
type AuthorRole = "ADMIN" | "EMPLOYEE" | "CLIENT";

interface NoteItem {
  id: string;
  text: string;
  status: RequestStatus;
  authorRole: AuthorRole;
  authorName: string | null;
  createdAt: string;
  isOwn: boolean;
}

export default function Notes({
  clientSlug,
  isClient,
  isStaff,
  isAdmin = false,
}: {
  clientSlug: string;
  /** Giriş yapan müşteri ise true: yeni istek yazabilir */
  isClient: boolean;
  /** Admin veya çalışan ise true: durumu değiştirebilir */
  isStaff: boolean;
  /** Sadece admin ise true: başkasının isteğini silebilir */
  isAdmin?: boolean;
}) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      body: JSON.stringify({ text: text.trim() }),
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

  async function handleToggleStatus(note: NoteItem) {
    const nextStatus: RequestStatus = note.status === "BEKLIYOR" ? "YAPILDI" : "BEKLIYOR";
    setUpdatingId(note.id);
    const res = await fetch(`/api/musteri/notes/note/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const json = await res.json();
    if (json.ok) {
      setNotes((prev) => prev.map((n) => (n.id === note.id ? json.note : n)));
    } else {
      setErr(json.error ?? "Durum güncellenemedi.");
    }
    setUpdatingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu isteği sil?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/musteri/notes/note/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } else {
      const json = await res.json().catch(() => ({}));
      setErr(json.error ?? "İstek silinemedi.");
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
      {/* İstek listesi — önce */}
      {loading ? (
        <div className="text-center py-10 text-[#555] text-[14px]">Yükleniyor...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-[#555]">Henüz istek yok.</p>
          {isClient && (
            <p className="text-[12px] text-[#444] mt-1">Aşağıdaki formu kullanarak bir istek gönderebilirsiniz.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isDone = note.status === "YAPILDI";
            return (
              <div
                key={note.id}
                className="rounded-xl p-4 relative"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isDone ? "rgba(52,211,153,0.15)" : "rgba(250,204,21,0.15)"}`,
                }}
              >
                <div className="flex items-start gap-2 mb-2 flex-wrap pr-8">
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      background: isDone ? "rgba(52,211,153,0.1)" : "rgba(250,204,21,0.1)",
                      color: isDone ? "#34d399" : "#facc15",
                    }}
                  >
                    {isDone ? "✅ Yapıldı" : "⏳ Bekliyor"}
                  </span>

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

                <div className="flex items-center gap-3 mt-3">
                  {isStaff && (
                    <button
                      onClick={() => handleToggleStatus(note)}
                      disabled={updatingId === note.id}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={{
                        background: isDone ? "rgba(250,204,21,0.1)" : "rgba(52,211,153,0.1)",
                        border: `1px solid ${isDone ? "rgba(250,204,21,0.3)" : "rgba(52,211,153,0.3)"}`,
                        color: isDone ? "#facc15" : "#34d399",
                      }}
                    >
                      {updatingId === note.id ? "..." : isDone ? "Bekliyor olarak işaretle" : "Yapıldı olarak işaretle"}
                    </button>
                  )}
                </div>

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

      {/* Yazma formu — sadece müşteri */}
      {isClient && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="font-semibold text-white text-[14px]">Yeni İstek Gönder</p>

          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="İsteğinizi buraya yazın..."
            className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          />

          {err && <p className="text-[12px] text-red-400">{err}</p>}

          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="btn btn-primary text-sm px-5 py-2"
          >
            {saving ? "..." : "Gönder"}
          </button>
        </form>
      )}

      {/* Güvenlik uyarısı */}
      {isClient && (
        <p className="text-[11px] text-[#555] text-center">
          ⚠️ Şifre veya hassas kimlik bilgisi paylaşmayın — istekler şifrelenmeden tutulur.
        </p>
      )}
    </div>
  );
}
