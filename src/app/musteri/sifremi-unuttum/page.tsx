import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Şifremi Unuttum — markaizi Panel",
};

export default function SifremiUnuttumPage() {
  return <ForgotPasswordForm />;
}
