import { redirect } from "next/navigation";

// v3.6.0: Ödeme Linkleri (PayTR) admin arayüzünden kaldırıldı. Altyapı duruyor:
// /odeme/[code] ödeme sayfası, /api/musteri/admin/payment-links ve /api/paytr/callback.
export default function Page() {
  redirect("/musteri/admin/finans");
}
