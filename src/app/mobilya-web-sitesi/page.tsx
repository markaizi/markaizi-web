import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_WEB } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_WEB);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_WEB} />;
}
