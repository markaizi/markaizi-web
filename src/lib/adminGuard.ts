import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/security";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return {
      session: null,
      err: NextResponse.json({ error: "Yetkisiz." }, { status: 403 }),
    };
  }
  // JWT geçerli olsa bile kullanıcı devre dışı bırakılmış olabilir
  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { active: true } });
  if (!user?.active) {
    return {
      session: null,
      err: NextResponse.json({ error: "Hesabınız devre dışı." }, { status: 403 }),
    };
  }
  // Panel endpoint'leri için oturum başına best-effort hız sınırı
  const rl = rateLimit(`panel:${session.uid}`, 120, 60_000);
  if (!rl.ok) {
    return {
      session: null,
      err: NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }),
    };
  }
  return { session, err: null };
}

// ADMIN veya admin'in "çalışanlara ücret girebilir" yetkisi verdiği aktif EMPLOYEE.
// Yönetici Yetkileri'nin bir parçası — bkz. User.adminCanPriceWorklogs.
export async function requireAdminOrWorklogPricer() {
  const session = await getSession();
  if (!session) {
    return { session: null, err: NextResponse.json({ error: "Yetkisiz." }, { status: 401 }) };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { active: true, role: true, adminCanPriceWorklogs: true },
  });
  if (!user?.active) {
    return { session: null, err: NextResponse.json({ error: "Hesabınız devre dışı." }, { status: 403 }) };
  }
  if (user.role !== "ADMIN" && !user.adminCanPriceWorklogs) {
    return { session: null, err: NextResponse.json({ error: "Yetkisiz." }, { status: 403 }) };
  }
  const rl = rateLimit(`panel:${session.uid}`, 120, 60_000);
  if (!rl.ok) {
    return {
      session: null,
      err: NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }),
    };
  }
  return { session, err: null };
}
