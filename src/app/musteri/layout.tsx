import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/PwaRegister";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

// Panel görünüm tercihi tüm /musteri/** ağacına tek noktadan uygulanır — her
// sayfa ayrı ayrı session okumasın diye. Oturum yoksa (giriş ekranı) varsayılan
// koyu temada kalır; her istekte taze okunur (JWT'ye gömülmez, hemen değişir).
async function getPanelThemeAttr(): Promise<"light" | undefined> {
  const session = await getSession();
  if (!session) return undefined;
  const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { panelTheme: true } });
  return me?.panelTheme === "AYDINLIK" ? "light" : undefined;
}

export default async function MusteriLayout({ children }: { children: React.ReactNode }) {
  const panelTheme = await getPanelThemeAttr();
  return (
    <div data-panel-theme={panelTheme}>
      <PwaRegister />
      {children}
    </div>
  );
}
