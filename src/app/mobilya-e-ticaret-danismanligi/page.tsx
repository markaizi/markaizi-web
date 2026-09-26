import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_ETICARET } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_ETICARET);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_ETICARET} />;
}
