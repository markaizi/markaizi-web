// Müşteri bildirimi önem seviyeleri — composer, zil ve popup aynı meta'yı kullanır.
export type ClientNotificationSeverity = "YESIL" | "SARI" | "KIRMIZI";

export const SEVERITY_META: Record<
  ClientNotificationSeverity,
  { label: string; shortLabel: string; color: string; bg: string; border: string; emoji: string; desc: string }
> = {
  YESIL: {
    label: "Yeşil — İyi haber",
    shortLabel: "İyi haber",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.35)",
    emoji: "🎉",
    desc: "Popup olarak kutlama efektiyle gösterilir.",
  },
  SARI: {
    label: "Sarı — Önemli",
    shortLabel: "Önemli",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.35)",
    emoji: "⚠️",
    desc: "Müşteri kısa bir yanıt yazabilir, yanıt verince size bildirim gider.",
  },
  KIRMIZI: {
    label: "Kırmızı — Acil",
    shortLabel: "Acil",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.35)",
    emoji: "🚨",
    desc: "Siz kaldırana kadar Raporlar ve İçerik Takvimi sekmeleri kilitlenir.",
  },
};
