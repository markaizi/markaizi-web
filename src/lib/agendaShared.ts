/**
 * Ajanda / Finans servislerinin ortak parçaları (v3.18.0) — agenda.ts ile gold.ts birbirini içe aktarmasın diye ayrı dosya.
 */
import { z } from "zod";

/** İş kuralı ihlali — API'de 400 olarak kullanıcıya gösterilir. */
export class AgendaRuleError extends Error {}

/** "42.500", "42500,50", "42.500 ₺" ve sayı → sayı (NaN = okunamadı). Binlik nokta, ondalık virgül kabul edilir. */
export function parseTrNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v !== "string" || !/\d/.test(v)) return NaN;
  return Number(v.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
}

// Rakam içermeyen ya da 0 / negatif tutar reddedilir; kuruşa yuvarlanır.
export const amount = z.union([z.number(), z.string()]).transform((v, ctx) => {
  const n = parseTrNumber(v);
  if (!isFinite(n) || n <= 0) { ctx.addIssue({ code: "custom", message: "Geçersiz tutar." }); return z.NEVER; }
  return Math.round(n * 100) / 100;
});
