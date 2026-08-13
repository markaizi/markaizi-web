import StaffNotificationBell from "@/components/StaffNotificationBell";
import StaffPopupNotification from "@/components/StaffPopupNotification";

export default function CalisanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StaffNotificationBell />
      <StaffPopupNotification />
    </>
  );
}
