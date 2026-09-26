import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { GOLBASI } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(GOLBASI);

export default function Page() {
  return <MobilyaLanding c={GOLBASI} />;
}
