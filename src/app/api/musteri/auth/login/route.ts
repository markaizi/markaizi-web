import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";

// Bakım modu: true iken sadece ADMIN girebilir. "aç" dediğinde false yap.
const MAINTENANCE_MODE = false;

const schema = z.object({
  username: z.string().trim().min(1).max(60),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  // Brute-force koruması: IP başına dakikada 8 deneme
  const rl = rateLimit(`musteri-login:${getClientIp(req)}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const username = parsed.username.toLowerCase();

  // Kullanıcıyı username veya email ile bul
  const user = await prisma.user.findFirst({
    where: {
      active: true,
      OR: [{ username }, { email: username }],
    },
    include: { client: { select: { slug: true } } },
  });

  const FAIL = NextResponse.json(
    { ok: false, error: "Kullanıcı adı veya şifre hatalı." },
    { status: 401 }
  );

  if (!user) {
    // Zamanlama saldırısını zorlaştırmak için yine de hash karşılaştır
    await bcrypt.compare(parsed.password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv");
    return FAIL;
  }

  const ok = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!ok) return FAIL;

  if (MAINTENANCE_MODE && user.role !== "ADMIN") {
    return NextResponse.json({
      ok: false,
      error: "Sizlere daha iyi hizmet verebilmek için altyapımızı güncelliyoruz. İhtiyaçlarınız ve sorularınız için lütfen bizimle iletişime geçin.",
      maintenance: true,
    }, { status: 503 });
  }

  const token = await signSession({
    uid: user.id,
    role: user.role,
    clientId: user.clientId,
    slug: user.client?.slug ?? null,
    name: user.name,
  });
  await setSessionCookie(token);

  const redirect =
    user.role === "ADMIN"
      ? "/musteri/admin"
      : user.role === "EMPLOYEE"
        ? "/musteri/calisan"
        : user.client?.slug
          ? `/musteri/${user.client.slug}`
          : "/musteri/giris";

  return NextResponse.json({ ok: true, redirect });
}
