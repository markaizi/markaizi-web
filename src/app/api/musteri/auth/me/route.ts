import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false });

  const redirect =
    session.role === "ADMIN" ? "/musteri/admin"
    : session.role === "EMPLOYEE" ? "/musteri/calisan"
    : session.slug ? `/musteri/${session.slug}`
    : null;

  if (!redirect) return NextResponse.json({ ok: false });

  return NextResponse.json({ ok: true, name: session.name, role: session.role, redirect });
}
