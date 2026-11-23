import { redirect } from "next/navigation";

// v3.5.0: Ekonomi, Ödemeler ve Kasa tek "Finans" ekranında birleşti — eski adres oraya yönlenir.
export default function Page() {
  redirect("/musteri/admin/finans?tab=musteri");
}
