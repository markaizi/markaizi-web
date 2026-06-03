import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return NextResponse.json({ ok: false, error: "Eksik alan." }, { status: 400 });
    }

    // ── Admin kontrolü ──────────────────────────────────────────────────────
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (adminUser && adminPass && slug === adminUser && password === adminPass) {
      return NextResponse.json({ ok: true, isAdmin: true });
    }

    // ── Müşteri kontrolü ────────────────────────────────────────────────────
    const client = getClient(slug);
    if (!client) {
      return NextResponse.json({ ok: false, error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }

    const envKey = `CLIENT_PASSWORD_${client.envKey}`;
    const correctPassword = process.env[envKey];

    if (!correctPassword) {
      console.error(`[Müşteri Panel] Env var eksik: ${envKey}`);
      return NextResponse.json({ ok: false, error: "Panel yapılandırma hatası." }, { status: 500 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ ok: false, error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, isAdmin: false });
  } catch {
    return NextResponse.json({ ok: false, error: "Sunucu hatası." }, { status: 500 });
  }
}
