"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelShell, Card, Btn, Chip, agendaApi, fmtDate } from "@/components/agenda/ui";

export interface TrashItem {
  id: string;
  resource: "kasa" | "card-tx" | "tasks" | "notes";
  kind: string;
  title: string;
  detail: string;
  deletedAt: string;
}

const COLOR: Record<TrashItem["resource"], string> = { kasa: "#34d399", "card-tx": "#f87171", tasks: "#fb923c", notes: "#60a5fa" };

// Çöp kutusu: Ajanda ve Finans'ta silinen kayıtlar. "Geri al" kaydı eski yerine koyar
// (kart harcamasında kart borcuna tutar geri eklenir).
export default function TrashView({ items }: { items: TrashItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | TrashItem["resource"]>("ALL");

  async function restore(it: TrashItem) {
    setBusy(it.id);
    setError("");
    try { await agendaApi("PATCH", `${it.resource}/${it.id}`, { action: "restore" }); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Geri alınamadı."); }
    finally { setBusy(null); }
  }

  const list = items.filter((i) => filter === "ALL" || i.resource === filter);
  const count = (r: TrashItem["resource"]) => items.filter((i) => i.resource === r).length;

  return (
    <PanelShell title="Çöp Kutusu" subtitle="Silinen işler, notlar ve finans kayıtları burada durur; istediğini geri alabilirsin.">
      {error && <div className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>{error}</div>}
      <div className="flex flex-wrap gap-2 mb-4">
        <Btn small variant={filter === "ALL" ? "primary" : "ghost"} onClick={() => setFilter("ALL")}>Tümü ({items.length})</Btn>
        <Btn small variant={filter === "kasa" ? "primary" : "ghost"} onClick={() => setFilter("kasa")}>Finans ({count("kasa")})</Btn>
        <Btn small variant={filter === "card-tx" ? "primary" : "ghost"} onClick={() => setFilter("card-tx")}>Kart harcaması ({count("card-tx")})</Btn>
        <Btn small variant={filter === "tasks" ? "primary" : "ghost"} onClick={() => setFilter("tasks")}>İşler ({count("tasks")})</Btn>
        <Btn small variant={filter === "notes" ? "primary" : "ghost"} onClick={() => setFilter("notes")}>Notlar ({count("notes")})</Btn>
      </div>
      {list.length === 0 && <Card><p className="text-[14px] text-[#8a8a9a]">Çöp kutusu boş.</p></Card>}
      <div className="space-y-2">
        {list.map((it) => (
          <Card key={`${it.resource}-${it.id}`} className="!p-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <p className="text-[14px] font-semibold text-white">{it.title}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <Chip color={COLOR[it.resource]}>{it.kind}</Chip>
                  <span className="text-[12px] text-[#8a8a9a]">{it.detail}</span>
                </div>
                <p className="text-[11px] text-[#8a8a9a] mt-1">Silinme: {fmtDate(it.deletedAt)}</p>
              </div>
              <Btn small variant="ok" disabled={busy === it.id} onClick={() => restore(it)}>{busy === it.id ? "…" : "Geri al"}</Btn>
            </div>
          </Card>
        ))}
      </div>
    </PanelShell>
  );
}
