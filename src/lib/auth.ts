/**
 * Ajans paneli kimlik & yetkilendirme yardımcıları.
 *
 * - JWT: jose ile imzalanır, httpOnly cookie `mkz_session`'da saklanır.
 * - getSession(): cookie'yi doğrular, oturum payload'ını döner.
 * - assertCanAccessClient(): rol bazlı firma erişim kontrolü (server-side).
 *
 * NOT: Edge (middleware) ile uyumlu olması için bu dosya `jose` kullanır,
 * Node-only API'ler (prisma) yalnızca assertCanAccessClient içinde çağrılır.
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";

export const SESSION_COOKIE = "mkz_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün (saniye)

export interface SessionPayload {
  uid: string;
  role: Role;
  clientId: string | null;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");
  return new TextEncoder().encode(secret);
}

/** Oturum JWT'si üretir (login route'unda kullanılır). */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** Bir JWT string'ini doğrular ve payload döner (yoksa null). */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      uid: String(payload.uid),
      role: payload.role as Role,
      clientId: (payload.clientId as string | null) ?? null,
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

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

/** Çalışanın atandığı firma id'leri (ADMIN için boş → tümü). */
export async function accessibleClientWhere(session: SessionPayload) {
  if (session.role === "ADMIN") return {};
  if (session.role === "CLIENT") return { id: session.clientId ?? "__none__" };
  // EMPLOYEE
  return { assignments: { some: { userId: session.uid } } };
}
