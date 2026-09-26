import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { ETIMESGUT } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(ETIMESGUT);

export default function Page() {
  return <MobilyaLanding c={ETIMESGUT} />;
}
