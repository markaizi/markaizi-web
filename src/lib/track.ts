/**
 * Dönüşüm olayları — GA4 (gtag) ve Meta Pixel (fbq).
 * Yalnızca kullanıcı çerez bandında "Tümünü Kabul Et" dediyse gönderilir; betikler zaten ancak o zaman yüklenir
 * (src/components/Analytics.tsx). Olay adları GA4'ün önerilen adlarıdır, Google Ads'te dönüşüm olarak içe aktarılabilir.
 *
 * eventID: aynı olay ileride sunucudan (Meta Conversions API) da gönderilirse tekilleştirme anahtarı olur.
 */
type LeadEvent = "generate_lead" | "contact_whatsapp" | "contact_phone" | "contact_email";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENT: Record<LeadEvent, string> = {
  generate_lead: "Lead",
  contact_whatsapp: "Contact",
  contact_phone: "Contact",
  contact_email: "Contact",
};

export function hasAnalyticsConsent(): boolean {
  try {
    return typeof window !== "undefined" && localStorage.getItem("cookie_consent") === "all";
  } catch {
    return false;
  }
}

export function track(event: LeadEvent, params: Record<string, string | number | undefined> = {}): string | undefined {
  if (!hasAnalyticsConsent()) return undefined;
  const eventID =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const data = { ...params, page_path: window.location.pathname };
  try {
    window.gtag?.("event", event, data);
    window.fbq?.("track", META_EVENT[event], data, { eventID });
  } catch {
    // Ölçüm hatası kullanıcı akışını asla bozmamalı.
  }
  return eventID;
}
