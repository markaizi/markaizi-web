import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { GUZELLIK } from "@/lib/sektor-pages";

export const metadata = mobilyaMetadata(GUZELLIK);

export default function Page() {
  return <MobilyaLanding c={GUZELLIK} />;
}
