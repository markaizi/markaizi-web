import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return NextResponse.json({ ok: false, error: "Eksik alan." }, { status: 400 });
    }

    const client = getClient(slug);
    if (!client) {
      return NextResponse.json({ ok: false, error: "Müşteri bulunamadı." }, { status: 404 });
    }

    // Şifre Vercel env var'ından okunur: CLIENT_PASSWORD_{ENVKEY}
    const envKey = `CLIENT_PASSWORD_${client.envKey}`;
    const correctPassword = process.env[envKey];

    if (!correctPassword) {
      console.error(`[Müşteri Panel] Env var eksik: ${envKey}`);
      return NextResponse.json({ ok: false, error: "Panel yapılandırma hatası." }, { status: 500 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ ok: false, error: "Şifre hatalı." }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Sunucu hatası." }, { status: 500 });
  }
}
