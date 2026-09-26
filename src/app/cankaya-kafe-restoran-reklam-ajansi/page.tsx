import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { CANKAYA } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(CANKAYA);

export default function Page() {
  return <MobilyaLanding c={CANKAYA} />;
}
