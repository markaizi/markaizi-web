"use client";

import { useEffect, useState } from "react";

type PanelTheme = "KOYU" | "AYDINLIK";

// Admin/çalışan/müşteri — hepsi kendi Profilim sayfasında bu bileşeni kullanır.
// Rol farkı yok: /api/musteri/theme oturum sahibinin kendi tercihini okur/yazar.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<PanelTheme | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/musteri/theme")
      .then((r) => r.json())
      .then((json) => { if (alive) setTheme(json.theme === "AYDINLIK" ? "AYDINLIK" : "KOYU"); })
      .catch(() => { if (alive) setTheme("KOYU"); });
    return () => { alive = false; };
  }, []);

  async function pick(next: PanelTheme) {
    if (saving || next === theme) return;
    setSaving(true);
    setTheme(next); // Buton anında tepki versin — sayfa zaten yenilenecek.
    await fetch("/api/musteri/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    }).catch(() => {});
    // Layout tema attribute'unu sunucuda okuyor — canlanması için tam yenileme gerekiyor.
    window.location.reload();
  }

  const options: { value: PanelTheme; label: string; hint: string }[] = [
    { value: "KOYU", label: "Koyu", hint: "Siyah & neon" },
    { value: "AYDINLIK", label: "Aydınlık", hint: "Beyaz & renkli" },
  ];

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div>
        <p className="font-semibold text-white text-[14px]">Görünüm</p>
        <p className="text-[12px] text-[#8a8a9a] mt-0.5">Paneli koyu/neon ya da aydınlık temada kullan. Tercihin hesabına kaydedilir.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = theme === opt.value;
          const loading = theme === null;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={loading || saving}
              onClick={() => pick(opt.value)}
              className="rounded-xl px-4 py-3 text-left transition-all disabled:opacity-60"
              style={{
                background: active ? "var(--grad-soft)" : "var(--bg)",
                border: active ? "1.5px solid rgba(168,85,247,0.5)" : "1px solid var(--border)",
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: opt.value === "KOYU" ? "#050505" : "linear-gradient(135deg,#007aff,#5856d6,#ff2d55)",
                    border: opt.value === "KOYU" ? "1px solid rgba(255,255,255,0.25)" : "none",
                  }}
                />
                <span className="text-[13px] font-semibold text-white">{opt.label}</span>
              </span>
              <span className="block text-[11px] text-[#8a8a9a] mt-1">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
