import crypto from "crypto";

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export interface PayTRTokenParams {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number; // kuruş cinsinden
  basketName: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  currency?: "TL" | "USD" | "EUR" | "GBP";
  lang?: "tr" | "en";
}

export interface PayTRTokenResponse {
  status: "success" | "failed";
  token?: string;
  reason?: string;
}

export async function fetchPayTRIframeToken(
  params: PayTRTokenParams
): Promise<PayTRTokenResponse> {
  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

  const testMode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
  const noInstallment = "1";
  const maxInstallment = "0";
  const currency = params.currency ?? "TL";
  const lang = params.lang ?? "tr";
  const debugOn = testMode === "1" ? "1" : "0";

  // PayTR sepet — tek ürün
  // Format: [[isim, birim_fiyat_string, adet], ...]
  // Fiyat TL cinsinden ondalıklı string olmalı (örn: "19900.00"), kuruş değil
  const priceInTL = (params.paymentAmount / 100).toFixed(2);
  const userBasket = Buffer.from(
    JSON.stringify([[params.basketName, priceInTL, 1]])
  ).toString("base64");

  // PayTR iFrame API hash formülü (resmi dokümantasyon):
  // merchant_id + user_ip + merchant_oid + email + payment_amount +
  // user_basket + debug_on + no_installment + max_installment + currency + test_mode
  const hashStr =
    merchantId +
    params.userIp +
    params.merchantOid +
    params.email +
    String(params.paymentAmount) +
    userBasket +
    debugOn +
    noInstallment +
    maxInstallment +
    currency +
    testMode;

  const paytrToken = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: params.userIp,
    merchant_oid: params.merchantOid,
    email: params.email,
    payment_amount: String(params.paymentAmount),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: debugOn,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: params.userName,
    user_address: params.userAddress,
    user_phone: params.userPhone,
    merchant_ok_url: `${process.env.NEXT_PUBLIC_BASE_URL}/odeme/basarili`,
    merchant_fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/odeme/iptal`,
    test_mode: testMode,
    lang,
    currency,
    sync_mode: "0",
    non_3d: "0",
    non3d_test_failed: "0",
  });

  const res = await fetch(PAYTR_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json()) as PayTRTokenResponse;
  return json;
}

export function verifyPayTRCallback(
  merchantOid: string,
  status: string,
  totalAmount: string,
  hash: string
): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

  const expectedHash = crypto
    .createHmac("sha256", merchantKey)
    .update(merchantOid + merchantSalt + status + totalAmount)
    .digest("base64");

  return expectedHash === hash;
}

export function generateOrderId(prefix = "MKZ"): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${ts}${rand}`;
}
