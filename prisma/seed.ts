/**
 * clients.ts → veritabanı göç (seed) scripti.
 *
 * Çalıştırma:  npm run db:seed   (.env.local'dan DATABASE_URL okunur)
 *
 * Idempotent: slug/email bazlı upsert kullanır, tekrar çalıştırmak güvenlidir.
 * Her çalıştırmada firma alt verileri (kampanya, güncelleme, içerik, fatura)
 * temizlenip yeniden yazılır.
 */
import {
  PrismaClient,
  Platform,
  CampaignStatus,
  InvoiceStatus,
  ContentStatus,
  UpdateKind,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { CLIENTS } from "../src/lib/clients";
import type {
  Campaign as TsCampaign,
  Invoice as TsInvoice,
} from "../src/lib/clients";

const prisma = new PrismaClient();

// ── Türkçe tarih ayrıştırıcı ──────────────────────────────
const MONTHS: Record<string, number> = {
  ocak: 1, şubat: 2, subat: 2, mart: 3, nisan: 4, mayıs: 5, mayis: 5,
  haziran: 6, temmuz: 7, ağustos: 8, agustos: 8, eylül: 9, eylul: 9,
  ekim: 10, kasım: 11, kasim: 11, aralık: 12, aralik: 12,
};

const FALLBACK_YEAR = 2026;

function parseTrDate(raw?: string, fallbackYear = FALLBACK_YEAR): Date | null {
  if (!raw) return null;
  const t = raw.trim().toLowerCase();
  if (t.includes("devam") || t.includes("planlanacak")) return null;
  const m = t.match(/(\d{1,2})\s+([a-zçğıöşü]+)\s*(\d{4})?/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const mon = MONTHS[m[2]];
  if (!mon) return null;
  const year = m[3] ? parseInt(m[3], 10) : fallbackYear;
  return new Date(Date.UTC(year, mon - 1, day));
}

const isOngoing = (s?: string) => !!s && s.trim().toLowerCase().includes("devam");

const CAMPAIGN_STATUS: Record<string, CampaignStatus> = {
  "Aktif": CampaignStatus.AKTIF,
  "Duraklatıldı": CampaignStatus.DURAKLATILDI,
  "Tamamlandı": CampaignStatus.TAMAMLANDI,
  "Ödeme Hatası": CampaignStatus.ODEME_HATASI,
};

const INVOICE_STATUS: Record<string, InvoiceStatus> = {
  "Ödendi": InvoiceStatus.ODENDI,
  "Bekliyor": InvoiceStatus.BEKLIYOR,
  "Günü Gelmedi": InvoiceStatus.GUNU_GELMEDI,
};

function campaignRows(clientId: string, platform: Platform, list?: TsCampaign[]) {
  return (list ?? []).map((c, i) => ({
    clientId,
    platform,
    name: c.name,
    startDate: parseTrDate(c.startDate),
    endDate: isOngoing(c.endDate) ? null : parseTrDate(c.endDate),
    ongoing: isOngoing(c.endDate),
    dailyBudget: c.dailyBudget,
    status: CAMPAIGN_STATUS[c.status] ?? CampaignStatus.AKTIF,
    sortOrder: i,
  }));
}

function invoiceRows(clientId: string, list?: TsInvoice[]) {
  return (list ?? []).map((v) => ({
    clientId,
    period: v.period,
    amount: v.amount,
    status: INVOICE_STATUS[v.status] ?? InvoiceStatus.BEKLIYOR,
    dueDate: parseTrDate(v.dueDate),
  }));
}

async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

async function main() {
  const now = new Date();
  const usedPasswords: { slug: string; password: string; fromEnv: boolean }[] = [];

  // ── Admin kullanıcı ──
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "markaizi-admin-2026";
  await prisma.user.upsert({
    where: { email: "admin@markaizi.local" },
    update: {
      username: adminUser,
      passwordHash: await hashPassword(adminPass),
      role: Role.ADMIN,
      name: "Yönetici",
      canWriteNotes: true,
    },
    create: {
      email: "admin@markaizi.local",
      username: adminUser,
      passwordHash: await hashPassword(adminPass),
      role: Role.ADMIN,
      name: "Yönetici",
      canWriteNotes: true,
    },
  });
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`⚠ ADMIN_PASSWORD env yok — geçici admin şifresi: "${adminPass}" (kullanıcı: ${adminUser})`);
  }

  // ── Firmalar ──
  for (const c of CLIENTS) {
    const client = await prisma.client.upsert({
      where: { slug: c.slug },
      update: { name: c.name, invoiceNote: c.invoiceNote ?? null },
      create: { slug: c.slug, name: c.name, invoiceNote: c.invoiceNote ?? null },
    });

    // Alt verileri temizle, yeniden yaz (idempotent)
    await prisma.campaign.deleteMany({ where: { clientId: client.id } });
    await prisma.update.deleteMany({ where: { clientId: client.id } });
    await prisma.contentItem.deleteMany({ where: { clientId: client.id } });
    await prisma.invoice.deleteMany({ where: { clientId: client.id } });

    // Kampanyalar
    await prisma.campaign.createMany({
      data: [
        ...campaignRows(client.id, Platform.META, c.metaCampaigns),
        ...campaignRows(client.id, Platform.GOOGLE, c.googleCampaigns),
        ...campaignRows(client.id, Platform.TIKTOK, c.tiktokCampaigns),
      ],
    });

    // Güncellemeler (ajans + website)
    await prisma.update.createMany({
      data: [
        ...(c.updates ?? []).map((u) => ({
          clientId: client.id, kind: UpdateKind.AJANS, text: u.text,
          date: parseTrDate(u.date) ?? now,
        })),
        ...(c.websiteUpdates ?? []).map((u) => ({
          clientId: client.id, kind: UpdateKind.WEBSITE, text: u.text,
          date: parseTrDate(u.date) ?? now,
        })),
      ],
    });

    // İçerik takvimi
    await prisma.contentItem.createMany({
      data: (c.contentCalendar ?? []).map((item) => {
        const scheduled = parseTrDate(item.date) ?? now;
        const published = scheduled < now;
        return {
          clientId: client.id,
          title: item.content,
          scheduledDate: scheduled,
          status: published ? ContentStatus.YAYINLANDI : ContentStatus.PLANLANDI,
          publishedAt: published ? scheduled : null,
        };
      }),
    });

    // Faturalar
    await prisma.invoice.createMany({ data: invoiceRows(client.id, c.invoices) });

    // Müşteri kullanıcısı
    const envPass = process.env[`CLIENT_PASSWORD_${c.envKey}`];
    const fromEnv = !!envPass;
    const plain = envPass || `${c.slug}-2026`;
    const email = `${c.slug}@musteri.markaizi.local`;
    await prisma.user.upsert({
      where: { email },
      update: {
        username: c.slug,
        passwordHash: await hashPassword(plain),
        role: Role.CLIENT,
        name: c.name,
        clientId: client.id,
      },
      create: {
        email,
        username: c.slug,
        passwordHash: await hashPassword(plain),
        role: Role.CLIENT,
        name: c.name,
        clientId: client.id,
      },
    });
    usedPasswords.push({ slug: c.slug, password: plain, fromEnv });
  }

  console.log(`\n✓ ${CLIENTS.length} firma + kullanıcıları yüklendi.\n`);
  console.log("Müşteri giriş bilgileri (kullanıcı adı = slug):");
  for (const p of usedPasswords) {
    console.log(`  ${p.slug.padEnd(14)} ${p.fromEnv ? "(env şifresi)" : `şifre: ${p.password}`}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
