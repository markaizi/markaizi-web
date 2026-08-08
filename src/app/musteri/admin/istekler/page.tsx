import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import IsteklerView, { type PendingNote } from "@/components/IsteklerView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Gelen İstekler — Admin",
};

export default async function IsteklerPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/istekler");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const rows = await prisma.note.findMany({
    where: { status: "BEKLIYOR" },
    include: { client: { select: { slug: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const notes: PendingNote[] = rows.map((n) => ({
    id: n.id,
    text: n.text,
    createdAt: n.createdAt.toISOString(),
    client: n.client,
  }));

  return <IsteklerView notes={notes} />;
}
