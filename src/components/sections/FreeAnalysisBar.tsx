import Link from "next/link";

export default function FreeAnalysisBar() {
  return (
    <Link
      href="/ucretsiz-analiz"
      className="group relative flex items-center justify-center gap-2.5 sm:gap-3 w-full px-5 py-3.5 sm:py-3 text-center transition-transform hover:scale-[1.01]"
      style={{ background: "var(--grad)" }}
    >
      <span
        className="hidden sm:inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#fff", animation: "glowPulse 1.8s ease-in-out infinite" }}
      />
      <span className="text-white font-bold text-[13px] sm:text-[15px] leading-snug">
        🎁 Sosyal medyanız ne durumda?{" "}
        <span className="underline underline-offset-2 decoration-white/50 group-hover:decoration-white">
          Ücretsiz analiz isteyin
        </span>
      </span>
      <span className="text-white font-black text-[15px] transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
