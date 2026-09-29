import crypto from "node:crypto";

// PayTR iFrame API — https://dev.paytr.com/iframe-api
// 1. adım: sunucu tarafında token alınır, iframe'de gösterilir.
// 2. adım: ödemenin kesin sonucu Bildirim URL'ye (/api/paytr/callback) gelir.
// Gerekli ortam değişkenleri: PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY,
// PAYTR_MERCHANT_SALT; test için PAYTR_TEST_MODE=1.

const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export function paytrConfig() {
  const merchantId = process.env.PAYTR_MERCHANT_ID ?? "";
  const merchantKey = process.env.PAYTR_MERCHANT_KEY ?? "";
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT ?? "";
  return {
    merchantId,
    merchantKey,
    merchantSalt,
    testMode: process.env.PAYTR_TEST_MODE === "1",
    configured: Boolean(merchantId && merchantKey && merchantSalt),
  };
}

export type BasketItem = [name: string, unitPriceTL: string, quantity: number];

export interface TokenRequest {
  userIp: string;
  merchantOid: string;
  email: string;
  amountKurus: number;
  basket: BasketItem[];
  userName: string;
  userAddress: string;
  userPhone: string;
  okUrl: string;
  failUrl: string;
  noInstallment: 0 | 1;
  maxInstallment: number; // 0 = PayTR'nin izin verdiği azami taksit
}

export type TokenResult = { ok: true; token: string } | { ok: false; reason: string };

export async function fetchIframeToken(r: TokenRequest): Promise<TokenResult> {
  const cfg = paytrConfig();
  if (!cfg.configured) return { ok: false, reason: "PayTR mağaza bilgileri tanımlı değil." };

  const testMode = cfg.testMode ? "1" : "0";
  const currency = "TL";
  const paymentAmount = String(r.amountKurus);
  const noInstallment = String(r.noInstallment);
  const maxInstallment = String(r.maxInstallment);
  const userBasket = Buffer.from(JSON.stringify(r.basket)).toString("base64");

  // Resmi formül: merchant_id + user_ip + merchant_oid + email + payment_amount +
  // user_basket + no_installment + max_installment + currency + test_mode (+ salt)
  const hashStr =
    cfg.merchantId + r.userIp + r.merchantOid + r.email + paymentAmount + userBasket +
    noInstallment + maxInstallment + currency + testMode;
  const paytrToken = crypto.createHmac("sha256", cfg.merchantKey).update(hashStr + cfg.merchantSalt).digest("base64");

  const body = new URLSearchParams({
    merchant_id: cfg.merchantId,
    user_ip: r.userIp,
    merchant_oid: r.merchantOid,
    email: r.email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: r.userName,
    user_address: r.userAddress,
    user_phone: r.userPhone,
    merchant_ok_url: r.okUrl,
    merchant_fail_url: r.failUrl,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });
    const json = (await res.json()) as { status: string; token?: string; reason?: string };
    if (json.status === "success" && json.token) return { ok: true, token: json.token };
    return { ok: false, reason: json.reason ?? "PayTR token alınamadı." };
  } catch (e) {
    return { ok: false, reason: `PayTR'ye bağlanılamadı: ${(e as Error).message}` };
  }
}

/** Bildirim URL'ye gelen isteğin PayTR'den geldiğini doğrular. */
export function verifyCallbackHash(merchantOid: string, status: string, totalAmount: string, hash: string): boolean {
  const cfg = paytrConfig();
  if (!cfg.configured || !hash) return false;
  const expected = crypto
    .createHmac("sha256", cfg.merchantKey)
    .update(merchantOid + cfg.merchantSalt + status + totalAmount)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomAlnum(len: number, alphabet = ALNUM): string {
  const bytes = crypto.randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

/** PayTR sipariş no: yalnızca harf/rakam, en fazla 64 karakter. */
export function newMerchantOid(): string {
  return `MKZ${Date.now().toString(36).toUpperCase()}${randomAlnum(6)}`;
}

/** Ödeme linki kodu: tahmin edilemez, URL'de okunaklı. */
export function newLinkCode(): string {
  return randomAlnum(12, "abcdefghjkmnpqrstuvwxyz23456789");
}

/** "12.500", "12500,50", "12 500 TL" → kuruş. Geçersizse null. */
export function parseTLToKurus(input: string): number | null {
  const s = input.replace(/[^\d.,]/g, "");
  if (!s) return null;
  let normalized: string;
  if (s.includes(",")) normalized = s.replace(/\./g, "").replace(",", ".");
  else if (/\.\d{3}(\.|$)/.test(s)) normalized = s.replace(/\./g, "");
  else normalized = s;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function formatKurus(kurus: number): string {
  return (kurus / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
}
