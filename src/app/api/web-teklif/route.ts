import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();

    if (!d.name || !d.email) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const row = (label: string, value: string) =>
      value
        ? `<tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:200px;vertical-align:top">${label}</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px">${value}</td>
           </tr>`
        : "";

    const section = (title: string) =>
      `<tr><td colspan="2" style="padding:20px 0 8px;font-size:13px;font-weight:700;color:#c084fc;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(168,85,247,0.3)">${title}</td></tr>`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:680px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
        <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">🌐 Web Sitesi Teklif Talebi</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">markaizi.com.tr — Web Tasarım & Hosting sayfasından gönderildi</p>
        </div>
        <div style="padding:28px 32px">
          <table style="width:100%;border-collapse:collapse">

            ${section("İletişim Bilgileri")}
            ${row("Ad Soyad", d.name)}
            ${row("İşletme / Marka", d.businessName)}
            ${row("E-posta", `<a href="mailto:${d.email}" style="color:#c084fc">${d.email}</a>`)}
            ${row("Telefon", d.phone)}

            ${section("Proje Tipi")}
            ${row("Site Türü", d.siteType)}
            ${row("Mevcut Site Var mı?", d.hasExistingSite)}
            ${row("Örnek / Referans Site", d.referenceUrl || "—")}

            ${d.siteType?.includes("E-Ticaret") ? `
            ${section("E-Ticaret Detayları")}
            ${row("Tahmini Ürün Adedi", d.productCount)}
            ${row("Ürün Resimleri Nasıl Temin Edilecek?", d.imageSource)}
            ${row("Fiyatlar Gösterilecek mi?", d.showPrices)}
            ${row("Online Satış / Banka POS", d.hasPOS)}
            ${row("Pazar Yeri Entegrasyonları", (d.marketplaces || []).join(", ") || "—")}
            ${row("Kargo Entegrasyonları", (d.cargoIntegrations || []).join(", ") || "—")}
            ` : ""}

            ${section("İçerik & SEO")}
            ${row("SEO Optimizasyonu", d.seoWanted)}
            ${row("Ürün / Sayfa Metinlerini Kim Yazacak?", d.contentWriter)}
            ${row("Blog / Haber Bölümü", d.hasBlog)}

            ${section("Teknik Tercihler")}
            ${row("Tercih Edilen Altyapı", d.platform)}
            ${row("Yapay Zeka Sohbet Botu", d.aiChatbot)}
            ${row("Çok Dilli Site", d.multiLanguage)}
            ${row("Mobil Uygulama Entegrasyonu", d.mobileApp)}

            ${section("Bütçe & Süre")}
            ${row("Bütçe Aralığı", d.budget)}
            ${row("Teslim Aciliyeti", d.deadline)}

            ${d.notes ? `
            ${section("Ek Notlar")}
            <tr><td colspan="2" style="padding:12px 0;color:#8a8a9a;font-size:14px;line-height:1.8">${d.notes.replace(/\n/g, "<br>")}</td></tr>
            ` : ""}
          </table>

          <div style="margin-top:28px;padding:16px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:8px">
            <p style="margin:0;font-size:13px;color:#c084fc">Yanıtlamak için: <a href="mailto:${d.email}" style="color:#c084fc;font-weight:600">${d.email}</a>${d.phone ? ` · <a href="tel:${d.phone}" style="color:#c084fc;font-weight:600">${d.phone}</a>` : ""}</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"markaizi Web Teklif" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: d.email,
      subject: `[Web Teklif] ${d.siteType || "Site"} — ${d.name}${d.businessName ? ` (${d.businessName})` : ""}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Web teklif API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
