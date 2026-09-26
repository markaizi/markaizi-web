import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { BEYPAZARI } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(BEYPAZARI);

export default function Page() {
  return <MobilyaLanding c={BEYPAZARI} />;
}
