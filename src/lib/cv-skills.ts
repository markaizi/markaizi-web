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

// ── Tutarlılık kontrolü ─────────────────────────────────────────────
// Adayın öz değerlendirmesindeki gerçekçi olmayan ya da birbiriyle çelişen
// puanları yakalar. Aynı fonksiyon formda (adaya uyarı), API'de (e-posta) ve
// admin panelinde (Gelen Talepler) kullanılır; eski başvurulara da uygulanır.
// Aday uyarıyı görüp yine de gönderebilir — engelleme yoktur.

export type SkillIssue = {
  code: "HEPSI_UZMAN" | "KURGU_PROGRAM" | "KANITSIZ_UZMANLIK";
  candidate: string; // adaya formda gösterilen nazik uyarı
  admin: string; // e-posta ve admin panelinde gösterilen kısa not
};

const EXPERT = 9; // 9 · Profesyonel ve 10 · Uzman
const EDIT_TOOLS = ["Premiere Pro", "After Effects", "CapCut"] as const;

export function checkSkillConsistency(
  skills: Partial<Record<string, number>>,
  referanslar: string,
): SkillIssue[] {
  const issues: SkillIssue[] = [];
  const values = CV_SKILLS.map((s) => Number(skills[s]) || 1);
  const expertCount = values.filter((v) => v >= EXPERT).length;
  const allSame = values.every((v) => v === values[0]);

  if (expertCount / CV_SKILLS.length >= 0.7 || (allSame && values[0] >= 5)) {
    issues.push({
      code: "HEPSI_UZMAN",
      candidate:
        "Becerilerin neredeyse tamamını çok yüksek ya da hepsini aynı seviyede işaretlediniz. Kimse her alanda uzman değildir; güçlü olduğunuz ve geliştirmekte olduğunuz alanları ayırmanız değerlendirmede size daha çok yardımcı olur.",
      admin: allSame
        ? `Tüm becerilere aynı puan verilmiş (${values[0]}/10).`
        : `${CV_SKILLS.length} becerinin ${expertCount} tanesi 9-10 işaretlenmiş.`,
    });
  }

  const edit = Number(skills["Video Kurgu ve Edit"]) || 1;
  const bestTool = Math.max(...EDIT_TOOLS.map((t) => Number(skills[t]) || 1));
  if (edit >= EXPERT && bestTool <= 6) {
    issues.push({
      code: "KURGU_PROGRAM",
      candidate: `Video Kurgu ve Edit'e ${edit} verdiniz ancak kurgu programlarında (Premiere Pro, After Effects, CapCut) en yüksek puanınız ${bestTool}. Kurguyu hangi programla yapıyorsanız onu da gerçekçi puanlayın.`,
      admin: `Video Kurgu ${edit}/10, ama Premiere/After Effects/CapCut en yüksek ${bestTool}/10.`,
    });
  }

  if (expertCount >= 2 && !referanslar.trim()) {
    issues.push({
      code: "KANITSIZ_UZMANLIK",
      candidate:
        "Birden fazla alanda 9-10 verdiniz ancak referans paylaşmadınız. Bu alanlarda yaptığınız işlerden bir iki link eklemeniz başvurunuzu güçlendirir.",
      admin: `${expertCount} alanda 9-10 verilmiş, referans/iş örneği yok.`,
    });
  }

  return issues;
}
