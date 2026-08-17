"use client";
import { useState, FormEvent } from "react";

const SECTORS = [
  "Mobilya",
  "Sağlık / Klinik / Estetik",
  "Doğal Ürün / Takviye",
  "Gıda / Restoran",
  "Emlak",
  "Otomotiv",
  "Diğer",
];

export default function UcretsizAnalizForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      link: (form.elements.namedItem("link") as HTMLInputElement).value,
      sector: (form.elements.namedItem("sector") as HTMLSelectElement).value,
      note: (form.elements.namedItem("note") as HTMLTextAreaElement)?.value ?? "",
    };

    try {
      const res = await fetch("/api/ucretsiz-analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("done");
        form.reset();
        setShowNote(false);
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Bağlantı hatası, lütfen tekrar deneyin.");
    }
  };

  if (status === "done") {
    return (
      <div
        className="rounded-2xl p-7 text-center"
        style={{ background: "var(--surface)", border: "1px solid rgba(52,211,153,0.35)" }}
      >
        <div className="text-4xl mb-3">✓</div>
        <p className="font-bold text-[18px] text-white mb-2">Talebiniz alındı!</p>
        <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-5">
          24-48 saat içinde analizinizi hazırlayıp size dönüyoruz. Acele bir durumunuz varsa hemen WhatsApp&apos;tan da yazabilirsiniz.
        </p>
        <a
          href="https://wa.me/905520772700?text=Merhaba%2C%20az%20%C3%B6nce%20%C3%BCcretsiz%20analiz%20formunu%20doldurdum."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline w-full"
        >
          WhatsApp&apos;tan Yaz
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl p-6 sm:p-7"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col gap-4">
        <Field label="Ad Soyad" id="name" type="text" placeholder="Ahmet Yılmaz" required />
        <Field label="Telefon / WhatsApp" id="phone" type="tel" placeholder="0532 000 00 00" required inputMode="tel" />
        <Field
          label="Instagram Kullanıcı Adı veya Web Sitesi"
          id="link"
          type="text"
          placeholder="@magazaniz veya siteniz.com"
          required
        />
        <div>
          <label htmlFor="sector" className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
            Sektörünüz
          </label>
          <select
            id="sector"
            name="sector"
            required
            className="w-full px-4 py-3.5 rounded-xl text-white"
            style={{
              background: "var(--bg)", border: "1.5px solid var(--border)", fontSize: "16px",
              appearance: "none", WebkitAppearance: "none", cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "40px",
              minHeight: "52px",
            }}
          >
            <option value="">Seçiniz...</option>
            {SECTORS.map((s) => (
              <option key={s} style={{ background: "#0f0f14" }}>{s}</option>
            ))}
          </select>
        </div>

        {!showNote ? (
          <button
            type="button"
            onClick={() => setShowNote(true)}
            className="text-left text-[13px] font-semibold text-[#c084fc]"
          >
            + Eklemek istediğiniz bir not var mı?
          </button>
        ) : (
          <div>
            <label htmlFor="note" className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Not (opsiyonel)
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Örn: Şu an reklam vermiyorum, hiç başlamadım..."
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/40 resize-y"
              style={{ background: "var(--bg)", border: "1.5px solid var(--border)", fontSize: "16px", minHeight: "90px" }}
            />
          </div>
        )}

        {status === "error" && (
          <p className="text-red-400 text-[13px] text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn w-full"
          style={{
            background: "var(--grad)",
            color: "#fff",
            boxShadow: "var(--glow-sm)",
            minHeight: "52px",
            fontSize: "16px",
          }}
        >
          {status === "sending" ? "Gönderiliyor..." : "Ücretsiz Analizimi İste →"}
        </button>
        <p className="text-[12px] text-[#8a8a9a] text-center leading-relaxed">
          Formu göndermeniz herhangi bir satın alma yükümlülüğü doğurmaz.
        </p>
      </div>
    </form>
  );
}

function Field({ label, id, type, placeholder, required, inputMode }: {
  label: string; id: string; type: string; placeholder: string; required?: boolean;
  inputMode?: "tel" | "text" | "email";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/40"
        style={{ background: "var(--bg)", border: "1.5px solid var(--border)", fontSize: "16px", minHeight: "52px" }}
      />
    </div>
  );
}
