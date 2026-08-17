"use client";
import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "done" | "error";

const SITE_TYPES = [
  "Tanıtım Sitesi",
  "Kurumsal Web Sitesi",
  "E-Ticaret Sitesi",
  "Blog / Haber Sitesi",
  "Klinik / Doktor Sitesi",
  "Diğer",
];

const PLATFORMS = [
  "WordPress / WooCommerce",
  "Ticimax",
  "İdeaSoft",
  "Shopify",
  "Özel Yazılım",
  "Karar vermedim",
];

const MARKETPLACES = ["Trendyol", "Hepsiburada", "N11", "Amazon TR", "ÇiçekSepeti", "İstemiyorum"];
const CARGO = ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "PTT Kargo", "Sürat Kargo", "İstemiyorum"];

export default function WebTeklifForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [siteType, setSiteType] = useState("");
  const [marketplaces, setMarketplaces] = useState<string[]>([]);
  const [cargo, setCargo] = useState<string[]>([]);

  const isEticaret = siteType === "E-Ticaret Sitesi";

  const toggleMulti = (
    val: string,
    arr: string[],
    setArr: (a: string[]) => void
  ) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const f = e.currentTarget;
    const g = (id: string) => (f.elements.namedItem(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value ?? "";

    const data = {
      name: g("name"),
      businessName: g("businessName"),
      email: g("email"),
      phone: g("phone"),
      siteType: g("siteType"),
      hasExistingSite: g("hasExistingSite"),
      referenceUrl: g("referenceUrl"),
      // e-ticaret
      productCount: g("productCount"),
      imageSource: g("imageSource"),
      showPrices: g("showPrices"),
      hasPOS: g("hasPOS"),
      marketplaces,
      cargoIntegrations: cargo,
      // içerik & seo
      seoWanted: g("seoWanted"),
      contentWriter: g("contentWriter"),
      hasBlog: g("hasBlog"),
      // teknik
      platform: g("platform"),
      aiChatbot: g("aiChatbot"),
      multiLanguage: g("multiLanguage"),
      mobileApp: g("mobileApp"),
      // bütçe & süre
      budget: g("budget"),
      deadline: g("deadline"),
      notes: g("notes"),
    };

    try {
      const res = await fetch("/api/web-teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("done");
        f.reset();
        setSiteType("");
        setMarketplaces([]);
        setCargo([]);
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="teklif-formu" className="py-20" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[860px] mx-auto px-6">

        {/* Başlık */}
        <div className="text-center mb-12">
          <span className="section-tag">Ücretsiz Teklif Al</span>
          <h2 className="font-black leading-tight mt-4 mb-3" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
            Projenizi <span className="gradient-text">Anlayalım</span>
          </h2>
          <p className="text-[#8a8a9a] text-[16px] max-w-[520px] mx-auto">
            Formu doldurun, 24 saat içinde size özel fiyat teklifiyle geri dönelim. Gizli ücret yok.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 md:p-10 space-y-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >

          {/* ── 1. İletişim ── */}
          <FieldGroup title="1 — İletişim Bilgileri" icon="👤">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="name" label="Ad Soyad" placeholder="Ahmet Yılmaz" required />
              <Field id="businessName" label="İşletme / Marka Adı" placeholder="Yılmaz Mobilya" />
              <Field id="email" label="E-posta" type="email" placeholder="ahmet@firma.com" required />
              <Field id="phone" label="Telefon" type="tel" placeholder="+90 552 077 27 00" />
            </div>
          </FieldGroup>

          {/* ── 2. Proje Tipi ── */}
          <FieldGroup title="2 — Proje Tipi" icon="🌐">
            <div className="space-y-4">
              <div>
                <label className="field-label">Ne tür bir site istiyorsunuz? *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {SITE_TYPES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSiteType(s)}
                      className="text-[13px] font-semibold px-4 py-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: siteType === s ? "rgba(168,85,247,0.15)" : "var(--bg)",
                        border: `1.5px solid ${siteType === s ? "rgba(168,85,247,0.6)" : "var(--border)"}`,
                        color: siteType === s ? "#c084fc" : "#8a8a9a",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="siteType" value={siteType} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField id="hasExistingSite" label="Mevcut siteniz var mı?">
                  <option value="">Seçiniz...</option>
                  <option>Evet, yeniden tasarlanacak</option>
                  <option>Hayır, sıfırdan yapılacak</option>
                </SelectField>
                <Field id="referenceUrl" label="Beğendiğiniz / Örnek Site URL" placeholder="https://ornek-site.com" />
              </div>
            </div>
          </FieldGroup>

          {/* ── 3. E-Ticaret (koşullu) ── */}
          {isEticaret && (
            <FieldGroup title="3 — E-Ticaret Detayları" icon="🛒" highlight>
              <div className="space-y-5">
                <SelectField id="productCount" label="Tahmini ürün adedi nedir?">
                  <option value="">Seçiniz...</option>
                  <option>1 – 50 ürün</option>
                  <option>51 – 200 ürün</option>
                  <option>201 – 1.000 ürün</option>
                  <option>1.000 – 5.000 ürün</option>
                  <option>5.000+ ürün</option>
                </SelectField>

                <SelectField id="imageSource" label="Ürün görselleri nasıl temin edilecek?">
                  <option value="">Seçiniz...</option>
                  <option>XML / Tedarikçi feed ile çekilecek</option>
                  <option>Hazır görsellerimiz mevcut (biz sağlayacağız)</option>
                  <option>Mağazada / depoda ürün çekimi yapılacak</option>
                  <option>Profesyonel çekim — siz çekeceksiniz</option>
                  <option>Karma (bir kısmı hazır, bir kısmı çekim)</option>
                </SelectField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField id="showPrices" label="Ürün fiyatları gösterilecek mi?">
                    <option value="">Seçiniz...</option>
                    <option>Evet, fiyatlar görünecek</option>
                    <option>Hayır, fiyatsız katalog olacak</option>
                    <option>Üye girişi yapanlara gösterilecek</option>
                  </SelectField>

                  <SelectField id="hasPOS" label="Online satış / banka POS entegrasyonu?">
                    <option value="">Seçiniz...</option>
                    <option>Evet, kredi kartıyla satış olacak</option>
                    <option>Hayır, şimdilik sadece katalog</option>
                    <option>Kapıda ödeme / havale yeterli</option>
                  </SelectField>
                </div>

                <div>
                  <label className="field-label">Pazar yeri entegrasyonu istiyor musunuz?</label>
                  <p className="text-[12px] text-[#8a8a9a] mb-2">Trendyol, Hepsiburada gibi platformlara ürün stok/sipariş entegrasyonu</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {MARKETPLACES.map((m) => (
                      <CheckChip
                        key={m}
                        label={m}
                        checked={marketplaces.includes(m)}
                        onChange={() => toggleMulti(m, marketplaces, setMarketplaces)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label">Kargo entegrasyonu olacak mı?</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CARGO.map((c) => (
                      <CheckChip
                        key={c}
                        label={c}
                        checked={cargo.includes(c)}
                        onChange={() => toggleMulti(c, cargo, setCargo)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FieldGroup>
          )}

          {/* ── 4. İçerik & SEO ── */}
          <FieldGroup title={isEticaret ? "4 — İçerik & SEO" : "3 — İçerik & SEO"} icon="📝">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField id="seoWanted" label="SEO optimizasyonu istiyor musunuz?">
                <option value="">Seçiniz...</option>
                <option>Evet, kapsamlı SEO istiyorum</option>
                <option>Sadece temel SEO altyapısı yeterli</option>
                <option>Hayır / Şimdilik gerekmiyor</option>
                <option>Bilmiyorum, tavsiye bekliyorum</option>
              </SelectField>

              <SelectField id="contentWriter" label="Sayfa / ürün metinlerini kim yazacak?">
                <option value="">Seçiniz...</option>
                <option>Biz yazacağız (metinleri siz hazırlayın)</option>
                <option>Siz yazacaksınız (markaizi yazacak)</option>
                <option>Yapay zeka ile üretilsin</option>
                <option>Karma — bir kısmını biz, bir kısmını siz</option>
              </SelectField>

              <SelectField id="hasBlog" label="Blog / Haber / Makale bölümü olacak mı?">
                <option value="">Seçiniz...</option>
                <option>Evet</option>
                <option>Hayır</option>
                <option>İleride eklenebilir</option>
              </SelectField>
            </div>
          </FieldGroup>

          {/* ── 5. Teknik Tercihler ── */}
          <FieldGroup title={isEticaret ? "5 — Teknik Tercihler" : "4 — Teknik Tercihler"} icon="⚙️">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField id="platform" label="Tercih ettiğiniz altyapı/platform var mı?">
                <option value="">Seçiniz...</option>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </SelectField>

              <SelectField id="aiChatbot" label="Yapay zeka sohbet botu istiyor musunuz?">
                <option value="">Seçiniz...</option>
                <option>Evet — ürünler & mağaza hakkında sorulara yanıt versin</option>
                <option>Evet — sadece genel müşteri desteği için</option>
                <option>Hayır</option>
                <option>Bilmiyorum, bilgi almak istiyorum</option>
              </SelectField>

              <SelectField id="multiLanguage" label="Çok dilli site gerekli mi?">
                <option value="">Seçiniz...</option>
                <option>Hayır, sadece Türkçe</option>
                <option>Evet — Türkçe + İngilizce</option>
                <option>Evet — 3 veya daha fazla dil</option>
              </SelectField>

              <SelectField id="mobileApp" label="Mobil uygulama entegrasyonu?">
                <option value="">Seçiniz...</option>
                <option>Hayır</option>
                <option>İleride isteyebilirim</option>
                <option>Evet, şimdiden planlayın</option>
              </SelectField>
            </div>
          </FieldGroup>

          {/* ── 6. Bütçe & Süre ── */}
          <FieldGroup title={isEticaret ? "6 — Bütçe & Süre" : "5 — Bütçe & Süre"} icon="💰">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField id="budget" label="Bütçe aralığınız nedir?">
                <option value="">Seçiniz...</option>
                <option>15.000 ₺ altı</option>
                <option>15.000 – 30.000 ₺</option>
                <option>30.000 – 60.000 ₺</option>
                <option>60.000 – 120.000 ₺</option>
                <option>120.000 ₺ ve üzeri</option>
                <option>Belirtmek istemiyorum</option>
              </SelectField>

              <SelectField id="deadline" label="Ne zaman yayına geçmek istiyorsunuz?">
                <option value="">Seçiniz...</option>
                <option>Acele değil, planlamak istiyorum</option>
                <option>2–4 ay içinde</option>
                <option>1–2 ay içinde</option>
                <option>1 ay içinde</option>
                <option>Çok acil — en kısa sürede</option>
              </SelectField>
            </div>
          </FieldGroup>

          {/* ── 7. Ek Notlar ── */}
          <FieldGroup title={isEticaret ? "7 — Ek Notlar" : "6 — Ek Notlar"} icon="💬">
            <div>
              <label htmlFor="notes" className="field-label">Özel istekleriniz, bize iletmek istediğiniz detaylar</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Örn: Mevcut sitemizin logosunu kullanmak istiyoruz. Rakip firmaların sitelerine benzer bir yapı tercih ediyoruz..."
                className="w-full px-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-white/40 resize-y min-h-[100px] mt-1"
                style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
              />
            </div>
          </FieldGroup>

          {/* Hata */}
          {status === "error" && (
            <p className="text-red-400 text-[13px] text-center">
              Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp&apos;tan yazın.
            </p>
          )}

          {/* Gönder */}
          <button
            type="submit"
            disabled={status === "sending" || status === "done" || !siteType}
            className="btn w-full text-[15px] py-4"
            style={{
              background:
                status === "done"
                  ? "linear-gradient(135deg,#059669,#10b981)"
                  : status === "error"
                  ? "linear-gradient(135deg,#dc2626,#ef4444)"
                  : "var(--grad)",
              color: "#fff",
              boxShadow: "var(--glow-sm)",
              opacity: !siteType && status === "idle" ? 0.6 : 1,
            }}
          >
            {status === "idle" && "Teklif Talebimi Gönder →"}
            {status === "sending" && "Gönderiliyor..."}
            {status === "done" && "✓ Talebiniz Alındı! 24 saat içinde dönüyoruz."}
            {status === "error" && "Hata — Tekrar Dene"}
          </button>

          {!siteType && status === "idle" && (
            <p className="text-center text-[12px] text-[#8a8a9a]">
              Devam etmek için lütfen site türünü seçin.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

/* ── Alt Bileşenler ── */

function FieldGroup({
  title,
  icon,
  children,
  highlight = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: highlight ? "rgba(168,85,247,0.04)" : "transparent",
        border: highlight ? "1px solid rgba(168,85,247,0.18)" : "1px solid var(--border)",
      }}
    >
      <h3 className="flex items-center gap-2.5 text-[15px] font-bold mb-5">
        <span className="text-[18px]">{icon}</span>
        {title}
        {highlight && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            E-Ticaret
          </span>
        )}
      </h3>
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}{required && <span className="text-[#c084fc] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/40 mt-1"
        style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select
        id={id}
        name={id}
        className="w-full px-4 py-3 rounded-xl text-[14px] text-white mt-1"
        style={{
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238a8a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "36px",
          cursor: "pointer",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function CheckChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
      style={{
        background: checked ? "rgba(168,85,247,0.18)" : "var(--bg)",
        border: `1.5px solid ${checked ? "rgba(168,85,247,0.55)" : "var(--border)"}`,
        color: checked ? "#c084fc" : "#8a8a9a",
      }}
    >
      {checked ? "✓ " : ""}{label}
    </button>
  );
}
