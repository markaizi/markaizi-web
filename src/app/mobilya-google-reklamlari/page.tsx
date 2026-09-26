import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_GOOGLE } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_GOOGLE);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_GOOGLE} />;
}
