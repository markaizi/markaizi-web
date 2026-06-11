/**
 * Ajans paneli kimlik & yetkilendirme yardımcıları (Node runtime).
 *
 * Edge-güvenli JWT imzala/doğrula → src/lib/session.ts
 * Bu dosya cookie (next/headers) ve prisma erişimi içerir.
 */
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
  store.delete(SESSION_COOKIE);
}

/** Mevcut isteğin oturumunu döner (server component / route handler). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
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
