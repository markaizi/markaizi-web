import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_SEO } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_SEO);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_SEO} />;
}
