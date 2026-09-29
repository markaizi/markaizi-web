import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/security";

// Ödeme Linkleri erişimi: admin her şeyi görür; "Ödeme Linklerini Yönetme"
// yetkisi verilmiş çalışan yalnızca kendi oluşturduğu linkleri yönetir ve
// firma bilgilerine erişemez (ör. PayTR'nin inceleme hesabı).
export async function getPaymentLinkAccess() {
  const session = await getSession();
  if (!session) return null;
  const me = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { active: true, role: true, adminCanManagePaymentLinks: true },
  });
  if (!me?.active) return null;
  if (me.role === "ADMIN") return { session, isAdmin: true };
  if (me.role === "EMPLOYEE" && me.adminCanManagePaymentLinks) return { session, isAdmin: false };
  return null;
}

export async function requirePaymentLinkAccess() {
  const access = await getPaymentLinkAccess();
  if (!access) return { access: null, err: NextResponse.json({ error: "Yetkisiz." }, { status: 403 }) };
  const rl = rateLimit(`panel:${access.session.uid}`, 120, 60_000);
  if (!rl.ok) return { access: null, err: NextResponse.json({ error: "Çok fazla istek." }, { status: 429 }) };
  return { access, err: null };
}
