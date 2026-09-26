import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { ALTINDAG } from "@/lib/kafe-pages";

export const metadata = mobilyaMetadata(ALTINDAG);

export default function Page() {
  return <MobilyaLanding c={ALTINDAG} />;
}
