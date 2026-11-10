/**
 * Ajans paneli kimlik & yetkilendirme yardımcıları (Node runtime).
 *
 * Edge-güvenli JWT imzala/doğrula → src/lib/session.ts
 * Bu dosya cookie (next/headers) ve prisma erişimi içerir.
 */
import { createHash } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./session";

export { SESSION_COOKIE, signSession, verifySession };
export type { SessionPayload };

/** Cookie store'a oturum cookie'sini yazar. */
export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Oturum cookie'sini siler (logout). */
export async function clearSessionCookie() {
  const store = await cookies();
  store.delete({ name: SESSION_COOKIE, path: "/" });
}

/**
 * Kullanıcının (ve CLIENT ise firmasının) hâlâ aktif olup olmadığını DB'den doğrular.
 * İstek başına bir kez çalışır (React cache). JWT 7 gün geçerli olduğundan, pasife
 * alınan/silinen hesabın çerezi bu kontrol olmadan 7 gün daha çalışırdı.
 */
/** Parola hash'inden kısa, geri döndürülemez sürüm etiketi (JWT'ye `pv` olarak yazılır). */
export function passwordVersion(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

const isAccountActive = cache(async (uid: string, pv: string | undefined): Promise<boolean> => {
  const { prisma } = await import("./db");
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { active: true, role: true, passwordHash: true, client: { select: { active: true } } },
  });
  if (!user || !user.active) return false;
  // Parola değiştirildi/sıfırlandıysa eski oturumlar düşer. (pv'siz eski çerezler en geç 7 günde
  // kendiliğinden biter; geçiş kolaylığı için onlara izin verilir.)
  if (pv && pv !== passwordVersion(user.passwordHash)) return false;
  if (user.role === "CLIENT" && user.client && !user.client.active) return false;
  return true;
});

/**
 * Mevcut isteğin oturumunu döner (server component / route handler).
 * İmza geçerli olsa bile hesap pasifse null döner.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  if (!(await isAccountActive(session.uid, session.pv))) return null;
  return session;
}

/**
 * Parolasını kendisi değiştiren kullanıcının oturumunu yeni parola sürümüyle yeniler
 * (aksi halde kendi çerezi de geçersiz kalıp çıkış yapmış olurdu).
 */
export async function reissueSession(uid: string) {
  const { prisma } = await import("./db");
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, role: true, clientId: true, name: true, passwordHash: true, client: { select: { slug: true } } },
  });
  if (!user) return;
  const token = await signSession({
    uid: user.id,
    role: user.role,
    clientId: user.clientId,
    slug: user.client?.slug ?? null,
    name: user.name,
    pv: passwordVersion(user.passwordHash),
  });
  await setSessionCookie(token);
}

/**
 * Bir oturumun belirli bir firmaya erişip erişemeyeceğini kontrol eder.
 * - ADMIN  → her zaman
 * - EMPLOYEE → o firmaya atanmışsa (Assignment)
 * - CLIENT → kendi firması ise
 * Erişim yoksa hata fırlatır.
 */
export async function assertCanAccessClient(
  session: SessionPayload | null,
  clientId: string
): Promise<void> {
  if (!session) throw new Error("Oturum yok.");
  if (session.role === "ADMIN") return;
  if (session.role === "CLIENT") {
    if (session.clientId === clientId) return;
    throw new Error("Bu firmaya erişim yetkiniz yok.");
  }
  if (session.role === "EMPLOYEE") {
    const { prisma } = await import("./db");
    const assignment = await prisma.assignment.findUnique({
      where: { userId_clientId: { userId: session.uid, clientId } },
    });
    if (assignment) return;
    throw new Error("Bu firmaya atanmadınız.");
  }
  throw new Error("Yetkisiz.");
}

/** Rol bazlı erişilebilir firma filtresi (Prisma where). */
export async function accessibleClientWhere(session: SessionPayload) {
  if (session.role === "ADMIN") return {};
  if (session.role === "CLIENT") return { id: session.clientId ?? "__none__" };
  return { assignments: { some: { userId: session.uid } } }; // EMPLOYEE
}
