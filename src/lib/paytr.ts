import crypto from "crypto";

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export interface PayTRTokenParams {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number; // kuruş cinsinden
  basketId: string;
  basketName: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  testMode?: "0" | "1";
  debugOn?: "0" | "1";
  noInstallment?: "0" | "1";
  maxInstallment?: string;
  currency?: "TL" | "USD" | "EUR" | "GBP";
  lang?: "tr" | "en";
}

export interface PayTRTokenResponse {
  status: "success" | "failed";
  token?: string;
  reason?: string;
}

export function generatePayTRToken(params: PayTRTokenParams): string {
  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

  const {
    userIp,
    merchantOid,
    email,
    paymentAmount,
    testMode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0",
    noInstallment = "1",
    maxInstallment = "0",
    currency = "TL",
  } = params;

  const hashStr =
    merchantId +
    userIp +
    merchantOid +
    email +
    String(paymentAmount) +
    "0" + // payment_type: 0 = card
    "0" + // installment_count: 0
    currency +
    testMode +
    noInstallment +
    maxInstallment;

  const token = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");

  return token;
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

  const paytrToken = generatePayTRToken({ ...params, testMode, noInstallment, maxInstallment, currency });

  // PayTR sepet — tek ürün
  const userBasket = Buffer.from(
    JSON.stringify([[params.basketName, String(params.paymentAmount / 100) + " TL", 1]])
  ).toString("base64");

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
