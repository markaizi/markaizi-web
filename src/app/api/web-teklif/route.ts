import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, isValidEmail, cleanStr, cleanPhone, rateLimit, getClientIp } from "@/lib/security";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: dakikada en fazla 5 istek (IP başına)
    const rl = rateLimit(`web-teklif:${getClientIp(req)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const raw = await req.json();

    const name = cleanStr(raw.name, 120);
    const email = cleanStr(raw.email, 254);

    if (!name || !email) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
    }

    // Tüm metin alanlarını temizle + uzunluk sınırla. Diziler güvenli birleştirilir.
    const arr = (v: unknown) =>
      Array.isArray(v) ? v.map((x) => cleanStr(x, 80)).filter(Boolean).join(", ") : "";

    const d = {
      name,
      email,
      businessName: cleanStr(raw.businessName, 120),
      phone: cleanPhone(raw.phone),
      siteType: cleanStr(raw.siteType, 120),
      hasExistingSite: cleanStr(raw.hasExistingSite, 120),
      referenceUrl: cleanStr(raw.referenceUrl, 300),
      productCount: cleanStr(raw.productCount, 80),
      imageSource: cleanStr(raw.imageSource, 200),
      showPrices: cleanStr(raw.showPrices, 80),
      hasPOS: cleanStr(raw.hasPOS, 80),
      marketplaces: arr(raw.marketplaces),
      cargoIntegrations: arr(raw.cargoIntegrations),
      seoWanted: cleanStr(raw.seoWanted, 80),
      contentWriter: cleanStr(raw.contentWriter, 200),
      hasBlog: cleanStr(raw.hasBlog, 80),
      platform: cleanStr(raw.platform, 120),
      aiChatbot: cleanStr(raw.aiChatbot, 80),
      multiLanguage: cleanStr(raw.multiLanguage, 80),
      mobileApp: cleanStr(raw.mobileApp, 80),
      budget: cleanStr(raw.budget, 80),
      deadline: cleanStr(raw.deadline, 80),
      notes: cleanStr(raw.notes, 5000),
    };

    // Önce veritabanına yaz — e-posta gönderimi başarısız olsa bile talep kaybolmasın.
    const submission = await prisma.submission.create({
      data: { type: "WEB_TEKLIF", data: d },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // value HTML olarak kaçırılır; isHtml=true ise önceden güvenli kurulmuş HTML kabul edilir.
    const row = (label: string, value: string, isHtml = false) =>
      value
        ? `<tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:200px;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px">${isHtml ? value : escapeHtml(value)}</td>
           </tr>`
        : "";

    const emailLink = `<a href="mailto:${encodeURIComponent(d.email)}" style="color:#c084fc">${escapeHtml(d.email)}</a>`;

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
            ${row("E-posta", emailLink, true)}
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
            ${row("Pazar Yeri Entegrasyonları", d.marketplaces || "—")}
            ${row("Kargo Entegrasyonları", d.cargoIntegrations || "—")}
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
            <tr><td colspan="2" style="padding:12px 0;color:#8a8a9a;font-size:14px;line-height:1.8">${escapeHtml(d.notes).replace(/\n/g, "<br>")}</td></tr>
            ` : ""}
          </table>

          <div style="margin-top:28px;padding:16px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:8px">
            <p style="margin:0;font-size:13px;color:#c084fc">Yanıtlamak için: ${emailLink}${d.phone ? ` · <a href="tel:${encodeURIComponent(d.phone)}" style="color:#c084fc;font-weight:600">${escapeHtml(d.phone)}</a>` : ""}</p>
          </div>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"markaizi Web Teklif" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: d.email,
        subject: `[Web Teklif] ${d.siteType || "Site"} — ${d.name}${d.businessName ? ` (${d.businessName})` : ""}`.slice(0, 200),
        html,
      });
      await prisma.submission.update({ where: { id: submission.id }, data: { emailSent: true } });
    } catch (err) {
      console.error("Web teklif e-posta gönderim hatası (talep kaydedildi):", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Web teklif API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
