import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { ISTANBUL } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(ISTANBUL);

export default function Page() {
  return <MobilyaLanding c={ISTANBUL} />;
}
