import { redirect } from "next/navigation";

// v3.6.0: iş kaydı / ücret girişi sistemi kaldırıldı. Ödemeler "Ödemelerim" ekranında (salt okunur).
export default function Page() {
  redirect("/musteri/calisan/odemelerim");
}
