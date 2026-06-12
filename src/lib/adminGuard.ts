import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
  return { session, err: null };
}
