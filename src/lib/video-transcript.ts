import fs from "node:fs";
import path from "node:path";

// Video metinleri src/content/videolar/<slug>.txt dosyalarında, konuşma dilinde
// "her cümle ayrı satır" olarak durur. Bölümler "⸻" ile ayrılır; her bölümün
// ilk satırı BÜYÜK HARFLİ başlıktır (ilk bölüm başlıksız giriştir).
// Bu dosya metni okunabilir bir makaleye çevirir: kısa satırları paragrafa
// toplar, tırnaklı cümleleri alıntı olarak ayırır.

export type TranscriptBlock =
  | { type: "p"; text: string }
  | { type: "quote"; items: string[] };

export type TranscriptSection = {
  id: string;
  heading: string | null;
  blocks: TranscriptBlock[];
};

const SMALL_WORDS = new Set(["ve", "ile", "mi", "mı", "mu", "mü", "da", "de", "ya", "ki"]);

function titleCaseTr(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .split(" ")
    .map((w, i) => {
      if (i > 0 && SMALL_WORDS.has(w.replace(/[?.,:!]/g, ""))) return w;
      return w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1);
    })
    .join(" ")
    .replace(/\bMarkai̇zi\b|\bMarkaizi\b/g, "markaizi");
}

export function slugifyTr(s: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u" };
  return s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const isQuote = (l: string) => /^[“"]/.test(l);
const endsSentence = (l: string) => /[.?!…”"]$/.test(l);

function toBlocks(lines: string[]): TranscriptBlock[] {
  const blocks: TranscriptBlock[] = [];
  let para: string[] = [];
  let quotes: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushQuotes = () => {
    if (quotes.length) blocks.push({ type: "quote", items: quotes.map((q) => q.replace(/^[“"]|[”"]$/g, "")) });
    quotes = [];
  };

  for (const line of lines) {
    if (isQuote(line)) {
      flushPara();
      quotes.push(line);
      continue;
    }
    flushQuotes();
    para.push(line);
    const len = para.join(" ").length;
    // İki nokta ile biten satır bir alıntıyı ya da listeyi takdim eder; paragrafı orada kapat.
    if (line.endsWith(":") || (len >= 320 && endsSentence(line))) flushPara();
  }
  flushQuotes();
  flushPara();
  return blocks;
}

export function loadTranscript(slug: string): TranscriptSection[] {
  const file = path.join(process.cwd(), "src/content/videolar", `${slug}.txt`);
  const raw = fs.readFileSync(file, "utf8");
  return raw.split("⸻").map((chunk, i) => {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    const heading = i === 0 ? null : titleCaseTr(lines.shift() ?? "");
    return {
      id: heading ? slugifyTr(heading) : "giris",
      heading,
      blocks: toBlocks(lines),
    };
  });
}

export function countWords(sections: TranscriptSection[]): number {
  let n = 0;
  for (const s of sections)
    for (const b of s.blocks) n += (b.type === "p" ? b.text : b.items.join(" ")).split(/\s+/).length;
  return n;
}
