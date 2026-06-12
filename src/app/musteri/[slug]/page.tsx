import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession, assertCanAccessClient } from "@/lib/auth";
import { getClientView } from "@/lib/clientView";
import { prisma } from "@/lib/db";
import ClientPortal from "@/components/ClientPortal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Müşteri Paneli — markaizi",
};

export default async function MusteriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getSession();
  if (!session) redirect(`/musteri/giris?next=/musteri/${slug}`);

  const view = await getClientView(slug);
  if (!view) notFound();

  // İnce kapsam: bu oturum bu firmaya erişebilir mi?
  try {
    await assertCanAccessClient(session, view.id);
  } catch {
    // Kendi firmasına yönlendir, yoksa girişe
    redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  }

  const isAdminView = session.role === "ADMIN" || session.role === "EMPLOYEE";

  // Müşteri rolünde canWriteNotes DB'den alınır; admin/çalışan her zaman yazabilir
  let canWriteNotes = false;
  if (!isAdminView) {
    const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { canWriteNotes: true } });
    canWriteNotes = user?.canWriteNotes ?? false;
  }

  return <ClientPortal client={view.data} isAdminView={isAdminView} canWriteNotes={canWriteNotes} />;
}
