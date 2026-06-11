import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Giriş — markaizi Panel",
};

export default async function GirisPage() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/musteri/admin");
    if (session.role === "EMPLOYEE") redirect("/musteri/calisan");
    if (session.slug) redirect(`/musteri/${session.slug}`);
  }

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
