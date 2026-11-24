"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Bot tuzağı (honeypot) + form açılış zamanı.
 * İnsanlar görmez ve doldurmaz; basit spam botları tüm alanları doldurur ya da formu anında gönderir.
 * Sunucu tarafı kontrol: src/lib/security.ts → isLikelyBot. Formun JSON gövdesine botFields(form) ile eklenir.
 */
export function Honeypot() {
  const tRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tRef.current) tRef.current.value = String(Date.now());
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="website">Web siteniz (boş bırakın)</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      <input ref={tRef} name="_t" type="hidden" defaultValue="" />
    </div>
  );
}

/** Formdan bot alanlarını okur (gönderim gövdesine eklenir). */
export function botFields(form: HTMLFormElement) {
  const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
  const t = Number((form.elements.namedItem("_t") as HTMLInputElement | null)?.value || 0);
  return { website, _t: t };
}

/** Kişisel veri toplanan her formun gönder düğmesi yakınında gösterilen bilgilendirme. */
export function KvkkNotu({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[12px] leading-relaxed text-[#8a8a9a] ${className}`}>
      Paylaştığınız bilgiler yalnızca talebinizi yanıtlamak için işlenir.{" "}
      <Link href="/kvkk" className="underline underline-offset-2 hover:text-white">
        KVKK Aydınlatma Metni
      </Link>
    </p>
  );
}
