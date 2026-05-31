import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLIENTS, getClient } from "@/lib/clients";
import ClientPortal from "@/components/ClientPortal";

// Arama motorları bu sayfaları görmemeli
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Müşteri Paneli — markaizi",
};

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ slug: c.slug }));
}

export default async function MusteriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();

  return <ClientPortal client={client} />;
}
