import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/PwaRegister";

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "markaizi",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function MusteriLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PwaRegister />
      {children}
    </>
  );
}
