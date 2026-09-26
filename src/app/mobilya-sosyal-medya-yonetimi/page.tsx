import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_SOSYAL } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_SOSYAL);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_SOSYAL} />;
}
