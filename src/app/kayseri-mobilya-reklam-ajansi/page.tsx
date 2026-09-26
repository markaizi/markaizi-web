import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { KAYSERI } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(KAYSERI);

export default function Page() {
  return <MobilyaLanding c={KAYSERI} />;
}
