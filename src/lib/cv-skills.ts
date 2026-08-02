// CV başvuru formundaki program/bilgi seviyesi soruları (1-10 arası kaydırıcı).
// Hem CvForm.tsx (istemci) hem api/cv/route.ts (sunucu) tarafından kullanılır.
export const CV_SKILLS = [
  "Video Kurgu ve Edit",
  "Video / Fotoğraf Çekim",
  "Photoshop",
  "Premiere Pro",
  "After Effects",
  "Yapay Zeka Metin Üretim",
  "Yapay Zeka Görsel Üretim",
  "Yapay Zeka Video Üretim",
  "CapCut",
  "Canva",
  "Meta Reklamları",
  "Google Reklamları",
  "Web Site Tasarımı",
] as const;

export type CvSkill = (typeof CV_SKILLS)[number];
