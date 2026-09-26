import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { IZMIR } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(IZMIR);

export default function Page() {
  return <MobilyaLanding c={IZMIR} />;
}
