import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { ETICARET } from "@/lib/sektor-pages";

export const metadata = mobilyaMetadata(ETICARET);

export default function Page() {
  return <MobilyaLanding c={ETICARET} />;
}
