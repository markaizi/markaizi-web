import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/db";
import { formatKurus } from "@/lib/paytr";
import PaymentForm from "./PaymentForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Güvenli Ödeme",
  robots: { index: false, follow: false },
};

export default async function OdemePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ sonuc?: string }>;
}) {
  const { code } = await params;
  const { sonuc } = await searchParams;
  const link = await prisma.paymentLink.findUnique({
    where: { code },
    select: { code: true, title: true, description: true, amountKurus: true, status: true, client: { select: { name: true } } },
  });
  if (!link) notFound();

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-[560px] mx-auto">
        <Link href="/" className="inline-flex items-center mb-8" aria-label="markaizi ana sayfa">
          <Logo height={44} />
        </Link>

        <div className="rounded-2xl p-6 sm:p-8 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#c084fc] mb-2">markaizi · Güvenli Ödeme</p>
          <h1 className="text-[22px] sm:text-[24px] font-black text-white leading-snug mb-2">{link.title}</h1>
          {link.client && <p className="text-[13px] text-[#8a8a9a] mb-2">{link.client.name}</p>}
          {link.description && <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-4 whitespace-pre-line">{link.description}</p>}
          <div className="flex items-baseline justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-[13px] text-[#8a8a9a]">Ödenecek tutar</span>
            <span className="text-[26px] font-black text-white tabular-nums">{formatKurus(link.amountKurus)}</span>
          </div>
        </div>

        {link.status === "IPTAL" ? (
          <Notice tone="red" title="Bu ödeme linki geçerli değil" text="Link iptal edilmiş. Yeni bir link için bizimle iletişime geçin." />
        ) : link.status === "ODENDI" ? (
          <Notice tone="green" title="Bu ödeme tamamlandı" text="Ödemeniz alınmıştır. Teşekkür ederiz." />
        ) : (
          <PaymentForm code={link.code} initialResult={sonuc === "basarili" ? "basarili" : sonuc === "basarisiz" ? "basarisiz" : null} />
        )}

        <p className="text-[12px] text-[#8a8a9a] text-center mt-6 leading-relaxed">
          Kart bilgileriniz markaizi&apos;ye iletilmez; ödeme PayTR güvenli ödeme altyapısı üzerinden alınır.
          <br />
          Sorunuz için: <a href="https://wa.me/905520772700" className="text-[#c084fc]">WhatsApp +90 552 077 27 00</a>
        </p>
      </div>
    </main>
  );
}

function Notice({ tone, title, text }: { tone: "red" | "green"; title: string; text: string }) {
  const c = tone === "green" ? "52,211,153" : "248,113,113";
  return (
    <div className="rounded-2xl p-6 text-center" style={{ background: `rgba(${c},0.08)`, border: `1px solid rgba(${c},0.3)` }}>
      <p className="text-[17px] font-bold text-white mb-1">{title}</p>
      <p className="text-[14px] text-[#8a8a9a]">{text}</p>
    </div>
  );
}
