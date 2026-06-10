/**
 * Edge-güvenli oturum JWT yardımcıları (yalnızca `jose`).
 * Middleware bu dosyayı kullanır — `next/headers` veya prisma İÇERMEZ.
 */
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export const SESSION_COOKIE = "mkz_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün (saniye)

export interface SessionPayload {
  uid: string;
  role: Role;
  clientId: string | null;
  slug: string | null; // CLIENT için firma slug'ı (yönlendirme için)
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");
  return new TextEncoder().encode(secret);
}

/** Oturum JWT'si üretir. */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** JWT doğrular, payload döner (geçersizse null). */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      uid: String(payload.uid),
      role: payload.role as Role,
      clientId: (payload.clientId as string | null) ?? null,
      slug: (payload.slug as string | null) ?? null,
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}
