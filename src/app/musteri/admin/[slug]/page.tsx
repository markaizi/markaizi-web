import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminClientDetail, { type ClientDetailData } from "@/components/AdminClientDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    robots: { index: false, follow: false },
    title: `${slug} — Admin Yönetim`,
  };
}

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      campaigns: { orderBy: [{ platform: "asc" }, { sortOrder: "asc" }] },
      updates: { orderBy: { date: "desc" } },
      invoices: { orderBy: { id: "desc" } },
      contentItems: { orderBy: { scheduledDate: "desc" } },
      users: { where: { role: "CLIENT" }, select: { id: true, username: true, name: true, email: true, canWriteNotes: true } },
    },
  });

  if (!client) notFound();

  const data: ClientDetailData = {
    id: client.id,
    slug: client.slug,
    name: client.name,
    package: client.package,
    invoiceNote: client.invoiceNote ?? "",
    active: client.active,
    campaigns: client.campaigns.map((c) => ({
      id: c.id,
      platform: c.platform,
      name: c.name,
      dailyBudget: c.dailyBudget,
      status: c.status,
      ongoing: c.ongoing,
      startDate: c.startDate?.toISOString().split("T")[0] ?? null,
      endDate: c.endDate?.toISOString().split("T")[0] ?? null,
    })),
    updates: client.updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      text: u.text,
      date: u.date.toISOString().split("T")[0],
    })),
    invoices: client.invoices.map((i) => ({
      id: i.id,
      period: i.period,
      amount: i.amount,
      status: i.status,
      dueDate: i.dueDate?.toISOString().split("T")[0] ?? null,
    })),
    contentItems: client.contentItems.map((ci) => ({
      id: ci.id,
      title: ci.title,
      description: ci.description ?? "",
      scheduledDate: ci.scheduledDate.toISOString().split("T")[0],
      status: ci.status,
      publishedAt: ci.publishedAt?.toISOString().split("T")[0] ?? null,
    })),
    users: client.users.map((u) => ({ ...u, username: u.username ?? null })),
  };

  return <AdminClientDetail data={data} />;
}
