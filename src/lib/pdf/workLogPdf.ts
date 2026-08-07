import PDFDocument from "pdfkit";
import path from "path";

// Vercel'in Türkçe karakterleri (ğ, ş, ı, İ, ç, ö, ü) tam destekleyen, Next.js ile
// birlikte dağıtılan Geist fontu — public/ altına kopyalanıp bu projede sabit bir
// asset olarak tutuluyor (node_modules içindeki dahili yola bağımlı kalmamak için).
const FONT_PATH = path.join(process.cwd(), "public/fonts/Geist-Regular.ttf");

export interface PdfLogEntry {
  date: string; // ISO
  description: string;
  amount: string | null;
}

export interface PdfSection {
  employeeName: string;
  entries: PdfLogEntry[];
}

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// PDF fontunda ₺ glifi yok — okunabilirlik için "TL" ile değiştiriyoruz.
function cleanAmountText(raw: string | null): string {
  if (!raw) return "-";
  return raw.replace(/₺/g, "TL").trim() || "-";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export async function buildWorkLogPdf(
  title: string,
  subtitle: string,
  sections: PdfSection[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // font'u constructor'da veriyoruz — aksi halde pdfkit ilk çizimden önce
      // kendi varsayılan Helvetica.afm dosyasını okumayı dener, bu da Next.js'in
      // dev/prod bundling ortamlarında (Turbopack, Vercel) bulunamayabiliyor.
      const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true, font: FONT_PATH });
      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).fillColor("#111111").text(title);
      doc.moveDown(0.2);
      doc.fontSize(11).fillColor("#666666").text(subtitle);
      doc.moveDown(1);

      let grandTotal = 0;

      sections.forEach((section, idx) => {
        const sectionTotal = section.entries.reduce((s, e) => s + parseAmount(e.amount), 0);
        grandTotal += sectionTotal;

        if (idx > 0) doc.moveDown(1.2);

        doc.fontSize(13).fillColor("#111111").text(section.employeeName);
        doc.moveDown(0.4);

        if (section.entries.length === 0) {
          doc.fontSize(10).fillColor("#888888").text("Bu dönemde kayıt yok.");
          doc.moveDown(0.6);
          return;
        }

        doc.table({
          columnStyles: [70, "*", 75],
          defaultStyle: { padding: 6, border: 0.5, borderColor: "#dddddd", textColor: "#222222" },
          data: [
            [
              { text: "Tarih", textColor: "#888888" },
              { text: "Açıklama", textColor: "#888888" },
              { text: "Ücret", textColor: "#888888" },
            ],
            ...section.entries.map((e) => [
              fmtDate(e.date),
              e.description,
              cleanAmountText(e.amount),
            ]),
          ],
        });

        doc.moveDown(0.5);
        doc.fontSize(11).fillColor("#7c3aed").text(`Toplam: ${sectionTotal.toLocaleString("tr-TR")} TL`, { align: "right" });
      });

      if (sections.length > 1) {
        doc.moveDown(1);
        doc.fontSize(14).fillColor("#111111").text(`Genel Toplam: ${grandTotal.toLocaleString("tr-TR")} TL`, { align: "right" });
      }

      doc.end();
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
