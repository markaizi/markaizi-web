import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import TrashView, { type TrashItem } from "@/components/TrashView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çöp Kutusu — Admin",
};

// Ajanda + Finans'ta silinen kayıtlar (v3.10.0). Silme kalıcı değildir; buradan geri alınır. Yalnızca ADMIN.
export default async function CopKutusuPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/cop-kutusu");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const where = { deletedAt: { not: null } };
  const [kasa, txs, tasks, notes, goldDebts, goldPayments] = await Promise.all([
    prisma.kasaEntry.findMany({ where, orderBy: { deletedAt: "desc" }, include: { client: { select: { name: true } } } }),
    prisma.kasaCardTransaction.findMany({ where, orderBy: { deletedAt: "desc" }, include: { entry: { select: { title: true } } } }),
    prisma.agendaTask.findMany({ where, orderBy: { deletedAt: "desc" }, include: { client: { select: { name: true } } } }),
    prisma.agendaNote.findMany({ where, orderBy: { deletedAt: "desc" }, include: { client: { select: { name: true } } } }),
    prisma.goldDebt.findMany({ where, orderBy: { deletedAt: "desc" } }),
    // Borcu da silinmiş ödemeler listelenmez — borç geri alınınca kendiliğinden döner.
    prisma.goldDebtPayment.findMany({ where: { ...where, debt: { deletedAt: null } }, orderBy: { deletedAt: "desc" }, include: { debt: { select: { title: true } } } }),
  ]);
  const tl = (n: unknown) => `${Number(n).toLocaleString("tr-TR")} ₺`;

  const items: TrashItem[] = [
    ...kasa.map((e) => ({
      id: e.id, resource: "kasa" as const, kind: "Finans kaydı", title: e.title,
      detail: [tl(e.amount), e.client?.name, e.notes].filter(Boolean).join(" · "), deletedAt: e.deletedAt!.toISOString(),
    })),
    ...txs.map((t) => ({
      id: t.id, resource: "card-tx" as const, kind: "Kart harcaması", title: t.title,
      detail: `${tl(t.amount)} · ${t.entry.title}`, deletedAt: t.deletedAt!.toISOString(),
    })),
    ...tasks.map((t) => ({
      id: t.id, resource: "tasks" as const, kind: "İş", title: t.title,
      detail: t.client?.name ?? "Firmasız", deletedAt: t.deletedAt!.toISOString(),
    })),
    ...notes.map((n) => ({
      id: n.id, resource: "notes" as const, kind: n.kind === "HAFIZA" ? "Hafıza" : "Not", title: n.title,
      detail: [n.client?.name, n.content.slice(0, 90)].filter(Boolean).join(" · "), deletedAt: n.deletedAt!.toISOString(),
    })),
    ...goldDebts.map((d) => ({
      id: d.id, resource: "gold-debts" as const, kind: "Altın borcu", title: d.title,
      detail: `${Number(d.totalGrams).toLocaleString("tr-TR")} gr`, deletedAt: d.deletedAt!.toISOString(),
    })),
    ...goldPayments.map((p) => ({
      id: p.id, resource: "gold-payments" as const, kind: "Altın ödemesi", title: `${p.debt.title} — ${p.grams === null ? "kur bekleyen ödeme" : `${Number(p.grams).toLocaleString("tr-TR")} gr`}`,
      detail: [p.tlAmount === null ? null : tl(p.tlAmount), p.note].filter(Boolean).join(" · "), deletedAt: p.deletedAt!.toISOString(),
    })),
  ];

  return <TrashView items={items} />;
}
