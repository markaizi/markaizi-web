"use client";

import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

export default function ServiceFAQ({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-[760px] mx-auto px-6">
      <div className="text-center mb-10">
        <span className="section-tag">SSS</span>
        <h2
          className="font-black leading-tight mt-3"
          style={{ fontSize: "clamp(24px,3.5vw,34px)" }}
        >
          Sıkça Sorulan <span className="gradient-text">Sorular</span>
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item) => {
          const isOpen = open === item.q;
          return (
            <div
              key={item.q}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                background: "var(--surface)",
                border: `1px solid ${isOpen ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : item.q)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-[15px] text-white leading-snug">
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isOpen ? "var(--grad)" : "rgba(255,255,255,0.06)",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="white" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-[14px] text-[#8a8a9a] leading-[1.8]">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
