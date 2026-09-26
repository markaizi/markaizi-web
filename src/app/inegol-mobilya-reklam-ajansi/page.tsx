import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { INEGOL } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(INEGOL);

export default function Page() {
  return <MobilyaLanding c={INEGOL} />;
}
