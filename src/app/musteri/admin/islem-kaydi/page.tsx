import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PanelShell, Card, Chip } from "@/components/agenda/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İşlem Kaydı — Admin",
};

const ACTION_TR: Record<string, string> = {
  create: "ekleme", update: "düzenleme", delete: "silme", restore: "geri alma", pay: "borç ödemesi",
};

// Ajanda + Finans'ta panelden ve Telegram botundan yapılan son işlemler (v3.11.0). Yalnızca ADMIN; salt okunur.
export default async function IslemKaydiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/islem-kaydi");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  // Tablo henüz oluşturulmadıysa (migration bekliyor) boş liste göster.
  const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }).catch(() => []);
  const fmt = (d: Date) => d.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const label = (a: string) => {
    const [res, verb] = a.split(".");
    return verb ? `${res} · ${ACTION_TR[verb] ?? verb}` : a.replace(/_/g, " ");
  };

  return (
    <PanelShell title="İşlem Kaydı" subtitle="Ajanda ve Finans'ta yapılan son 200 değişiklik — panelden ve Telegram botundan.">
      {rows.length === 0 && <Card><p className="text-[14px] text-[#8a8a9a]">Henüz kayıt yok.</p></Card>}
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id} className="!p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color={r.source === "bot" ? "#22d3ee" : "#c084fc"}>{r.source === "bot" ? "Telegram botu" : `Panel${r.actor ? ` · ${r.actor}` : ""}`}</Chip>
              <Chip color={r.ok ? "#34d399" : "#f87171"}>{r.ok ? label(r.action) : `${label(r.action)} · başarısız`}</Chip>
              <span className="text-[12px] text-[#8a8a9a] ml-auto">{fmt(r.createdAt)}</span>
            </div>
            {r.target && <p className="text-[14px] font-semibold text-white mt-1.5">{r.target}</p>}
            {r.detail !== null && (
              <details className="mt-1">
                <summary className="text-[11px] text-[#8a8a9a] cursor-pointer">Ayrıntı</summary>
                <pre className="text-[11px] text-[#8a8a9a] whitespace-pre-wrap break-all mt-1">{JSON.stringify(r.detail, null, 1)}</pre>
              </details>
            )}
          </Card>
        ))}
      </div>
    </PanelShell>
  );
}
