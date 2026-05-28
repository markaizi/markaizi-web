/**
 * Güvenlik yardımcıları — HTML kaçışı, girdi doğrulama ve basit rate limiting.
 * Ödeme ve form endpoint'lerinde ortak kullanılır.
 */

/**
 * HTML özel karakterlerini kaçırır. E-posta şablonlarına kullanıcı verisi
 * gömülmeden önce MUTLAKA bundan geçirilmeli (HTML enjeksiyonu / XSS önlemi).
 */
export function escapeHtml(input: unknown): string {
  const str = String(input ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** E-posta formatı doğrulama (RFC'ye yakın, pratik regex). */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Bir string'i güvenli hale getirir: string değilse boş döner,
 * baştaki/sondaki boşlukları temizler, maks. uzunlukta keser.
 */
export function cleanStr(input: unknown, maxLen = 1000): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLen);
}

/**
 * Telefon: sadece rakam, +, boşluk, parantez ve tireye izin ver; maks 24 karakter.
 */
export function cleanPhone(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^\d+\s()\-]/g, "").trim().slice(0, 24);
}

/**
 * Basit, bellek-içi rate limiter (sabit pencere).
 * Not: Vercel serverless'te her lambda örneği kendi belleğini tutar;
 * bu yüzden bu yöntem "best-effort"tur — hızlı ardışık spam'i (aynı sıcak
 * örnek üzerinden) engeller. Dağıtık ve kesin sınır için Upstash Redis
 * tabanlı bir çözüm önerilir. Yine de hiç yoktan çok daha iyi bir savunma.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** İstekten istemci IP'sini güvenli şekilde çıkarır. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
