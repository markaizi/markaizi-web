import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin Paneli — markaizi",
};

export default function AdminPage() {
  return <AdminPanel />;
}
