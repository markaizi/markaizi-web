import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { YENIMAHALLE } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(YENIMAHALLE);

export default function Page() {
  return <MobilyaLanding c={YENIMAHALLE} />;
}
