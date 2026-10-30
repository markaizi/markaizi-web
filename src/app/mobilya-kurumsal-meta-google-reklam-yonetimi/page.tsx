import MobilyaLanding, { mobilyaMetadata } from "@/components/MobilyaLanding";
import { MOBILYA_KURUMSAL } from "@/lib/mobilya-pages";

export const metadata = mobilyaMetadata(MOBILYA_KURUMSAL);

export default function Page() {
  return <MobilyaLanding c={MOBILYA_KURUMSAL} />;
}
