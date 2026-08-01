"use client";

import { useState, useEffect, useCallback } from "react";

type Priority = "DUSUK" | "ORTA" | "YUKSEK";

interface CardData {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  sortOrder: number;
  assignee: { id: string; name: string } | null;
  creator: { id: string; name: string };
  client: { slug: string; name: string } | null;
}

interface ColumnData {
  id: string;
  title: string;
  sortOrder: number;
  cards: CardData[];
}

interface PersonOption { id: string; name: string; }
interface ClientOption { id: string; slug: string; name: string; }

const PRIORITY_LABEL: Record<Priority, string> = { DUSUK: "Düşük", ORTA: "Orta", YUKSEK: "Yüksek" };
const PRIORITY_COLOR: Record<Priority, string> = { DUSUK: "#34d399", ORTA: "#60a5fa", YUKSEK: "#f87171" };
const PRIORITY_BG: Record<Priority, string> = {
  DUSUK: "rgba(52,211,153,0.14)", ORTA: "rgba(96,165,250,0.14)", YUKSEK: "rgba(248,113,113,0.14)",
};

function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function WorkflowBoard() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [employees, setEmployees] = useState<PersonOption[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; columnId?: string; card?: CardData } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [renamingCol, setRenamingCol] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [colError, setColError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/musteri/is-akisi/board");
    if (!res.ok) return;
    const data = await res.json();
    setColumns(data.columns);
    setEmployees(data.employees);
    setClients(data.clients);
    setCurrentUserId(data.currentUserId);
    setIsAdmin(data.isAdmin);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleMoveCard(cardId: string, targetColumnId: string) {
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId);
    if (!card || card.columnId === targetColumnId) return;
    const prevColumnId = card.columnId;

    // İyimser güncelleme
    setColumns((prev) => {
      const moved = { ...card, columnId: targetColumnId };
      return prev.map((col) => {
        if (col.id === prevColumnId) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        if (col.id === targetColumnId) return { ...col, cards: [...col.cards, moved] };
        return col;
      });
    });

    const res = await fetch(`/api/musteri/is-akisi/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId: targetColumnId }),
    });
    if (!res.ok) load(); // başarısızsa sunucudan tazele
  }

  function handleSaved(card: CardData) {
    setColumns((prev) => {
      const exists = prev.some((col) => col.cards.some((c) => c.id === card.id));
      if (exists) {
        return prev.map((col) => ({
          ...col,
          cards: col.id === card.columnId
            ? [...col.cards.filter((c) => c.id !== card.id), card]
            : col.cards.filter((c) => c.id !== card.id),
        }));
      }
      return prev.map((col) => (col.id === card.columnId ? { ...col, cards: [...col.cards, card] } : col));
    });
    setModal(null);
  }

  function handleDeleted(cardId: string) {
    setColumns((prev) => prev.map((col) => ({ ...col, cards: col.cards.filter((c) => c.id !== cardId) })));
    setModal(null);
  }

  async function handleAddColumn() {
    const title = newColumnTitle.trim();
    if (!title) return;
    const res = await fetch("/api/musteri/is-akisi/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const data = await res.json();
      setColumns((prev) => [...prev, data.column]);
      setNewColumnTitle("");
      setAddingColumn(false);
    }
  }

  async function handleRenameColumn(id: string) {
    const title = renameValue.trim();
    if (!title) { setRenamingCol(null); return; }
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    setRenamingCol(null);
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  async function handleDeleteColumn(id: string) {
    setColError("");
    const res = await fetch(`/api/musteri/is-akisi/columns/${id}`, { method: "DELETE" });
    if (res.ok) {
      setColumns((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      setColError(data.error ?? "Sütun silinemedi.");
      setTimeout(() => setColError(""), 4000);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-[#8a8a9a] text-[14px]">Yükleniyor...</div>;
  }

  return (
    <div>
      {colError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
          {colError}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        {columns.map((col) => {
          const isDragTarget = dragOverCol === col.id && dragId !== null;
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-[280px] rounded-2xl flex flex-col"
              style={{
                background: isDragTarget ? "rgba(168,85,247,0.06)" : "var(--surface)",
                border: `1px solid ${isDragTarget ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
                maxHeight: "calc(100vh - 220px)",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
              onDragLeave={() => setDragOverCol((c) => (c === col.id ? null : c))}
              onDrop={(e) => { e.preventDefault(); setDragOverCol(null); if (dragId) handleMoveCard(dragId, col.id); }}
            >
              {/* Sütun başlığı */}
              <div className="flex items-center justify-between gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
                {renamingCol === col.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameColumn(col.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRenameColumn(col.id); if (e.key === "Escape") setRenamingCol(null); }}
                    className="flex-1 min-w-0 px-2 py-1 rounded-lg text-[13px] font-bold text-white outline-none"
                    style={{ background: "var(--bg)", border: "1px solid rgba(168,85,247,0.4)" }}
                  />
                ) : (
                  <button
                    disabled={!isAdmin}
                    onClick={() => { setRenamingCol(col.id); setRenameValue(col.title); }}
                    className="text-[13px] font-bold text-white truncate text-left"
                    style={{ cursor: isAdmin ? "text" : "default" }}
                  >
                    {col.title}
                  </button>
                )}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-[#8a8a9a] px-2 py-0.5 rounded-full" style={{ background: "var(--bg)" }}>
                    {col.cards.length}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteColumn(col.id)}
                      title="Sütunu sil"
                      className="text-[#555] hover:text-[#f87171] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Kartlar */}
              <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5" style={{ minHeight: 80 }}>
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragId(card.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setModal({ mode: "edit", card })}
                    className="rounded-xl p-3.5 cursor-pointer transition-all"
                    style={{
                      background: "var(--surface-2, #141420)",
                      border: "1px solid var(--border)",
                      opacity: dragId === card.id ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.35)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                  >
                    <p className="text-[13px] font-semibold text-white leading-snug mb-2">{card.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: PRIORITY_BG[card.priority], color: PRIORITY_COLOR[card.priority] }}>
                        {PRIORITY_LABEL[card.priority]}
                      </span>
                      {card.client && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#c084fc]" style={{ background: "rgba(168,85,247,0.1)" }}>
                          {card.client.name}
                        </span>
                      )}
                      {card.dueDate && (
                        <span className="text-[10px] font-medium text-[#8a8a9a]">📅 {fmtDate(card.dueDate)}</span>
                      )}
                    </div>
                    {card.assignee && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                          style={{ background: "var(--grad-soft)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}>
                          {card.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] text-[#8a8a9a] truncate">{card.assignee.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Kart ekle */}
              <button
                onClick={() => setModal({ mode: "create", columnId: col.id })}
                className="mx-3 mb-3 text-[12px] font-semibold text-[#8a8a9a] hover:text-[#c084fc] py-2 rounded-lg transition-colors text-left px-1"
              >
                + Kart Ekle
              </button>
            </div>
          );
        })}

        {/* Sütun ekle (admin) */}
        {isAdmin && (
          <div className="flex-shrink-0 w-[240px]">
            {addingColumn ? (
              <div className="rounded-2xl p-3" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddColumn(); if (e.key === "Escape") setAddingColumn(false); }}
                  placeholder="Sütun adı..."
                  className="w-full px-3 py-2 rounded-lg text-[13px] text-white placeholder-[#555] outline-none mb-2"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddColumn} className="btn btn-primary text-[12px] px-3 py-1.5 flex-1">Ekle</button>
                  <button onClick={() => setAddingColumn(false)} className="btn btn-outline text-[12px] px-3 py-1.5">İptal</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="w-full rounded-2xl py-4 text-[13px] font-semibold transition-all"
                style={{ background: "rgba(168,85,247,0.06)", border: "1px dashed rgba(168,85,247,0.25)", color: "#c084fc" }}
              >
                + Sütun Ekle
              </button>
            )}
          </div>
        )}
      </div>

      {modal && (
        <CardModal
          state={modal}
          employees={employees}
          clients={clients}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

// ── Kart Modalı ──────────────────────────────────────────────────────────────

function CardModal({
  state, employees, clients, currentUserId, isAdmin, onClose, onSaved, onDeleted,
}: {
  state: { mode: "create" | "edit"; columnId?: string; card?: CardData };
  employees: PersonOption[];
  clients: ClientOption[];
  currentUserId: string;
  isAdmin: boolean;
  onClose: () => void;
  onSaved: (card: CardData) => void;
  onDeleted: (id: string) => void;
}) {
  const isEdit = state.mode === "edit";
  const card = state.card;
  const [title, setTitle] = useState(card?.title ?? "");
  const [description, setDescription] = useState(card?.description ?? "");
  const [priority, setPriority] = useState<Priority>(card?.priority ?? "ORTA");
  const [dueDate, setDueDate] = useState(card?.dueDate ?? "");
  const [assigneeId, setAssigneeId] = useState(card?.assignee?.id ?? "");
  const [clientId, setClientId] = useState(() => {
    if (!card?.client) return "";
    return clients.find((c) => c.slug === card.client!.slug)?.id ?? "";
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const canDelete = isEdit && (isAdmin || card?.creator.id === currentUserId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    const body = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      dueDate: dueDate || null,
      assigneeId: assigneeId || null,
      clientId: clientId || null,
      ...(isEdit ? {} : { columnId: state.columnId }),
    };

    const url = isEdit ? `/api/musteri/is-akisi/cards/${card!.id}` : "/api/musteri/is-akisi/cards";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Kaydedilemedi."); setSaving(false); return; }
      onSaved(data.card);
    } catch {
      setError("Bağlantı hatası.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!card) return;
    setDeleting(true);
    const res = await fetch(`/api/musteri/is-akisi/cards/${card.id}`, { method: "DELETE" });
    if (res.ok) { onDeleted(card.id); return; }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Silinemedi.");
    setDeleting(false);
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] rounded-2xl p-7 relative max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-bold text-[17px] text-white mb-6">{isEdit ? "Kartı Düzenle" : "Yeni Kart"}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Örn. RetroCar Reels çekimi"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detaylar..."
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-y"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <option value="DUSUK">Düşük</option>
                <option value="ORTA">Orta</option>
                <option value="YUKSEK">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Bitiş Tarihi</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Atanan Kişi</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <option value="">Atanmadı</option>
              {employees.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {clients.length > 0 && (
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Firma (opsiyonel)</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <option value="">Yok</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <p className="text-[12px] text-red-400 mt-4">{error}</p>}

        <div className="flex gap-3 mt-7">
          {canDelete && (
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="text-[13px] font-semibold text-[#f87171] px-4 py-2.5 rounded-xl transition-all"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
              {deleting ? "Siliniyor..." : "Sil"}
            </button>
          )}
          <button type="submit" disabled={saving} className="btn btn-primary flex-1">
            {saving ? "Kaydediliyor..." : isEdit ? "Kaydet" : "Kartı Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}
