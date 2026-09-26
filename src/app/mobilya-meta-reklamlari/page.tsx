import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_META } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_META);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_META} />;
}
