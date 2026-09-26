import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { KECIOREN } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(KECIOREN);

export default function Page() {
  return <MobilyaLanding c={KECIOREN} />;
}
