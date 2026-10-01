import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_BAYI } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_BAYI);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_BAYI} />;
}
