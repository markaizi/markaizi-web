import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { GETAT } from "@/lib/sektor-pages";

export const metadata = mobilyaMetadata(GETAT);

export default function Page() {
  return <MobilyaLanding c={GETAT} />;
}
