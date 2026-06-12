# PROJE DURUM — markaizi.com.tr

Son güncelleme: 12 Haziran 2026

---

## ✅ Tamamlananlar

### Genel Site
- Ana sayfa tüm bölümler (Hero, Services, About, Portfolio, Pricing, Contact, Footer)
- Navbar, WhatsApp balonu, ScrollReveal animasyonları
- SEO: sitemap.xml, robots.txt, JSON-LD structured data
- KVKK, Gizlilik, Çerez, Kullanım Şartları sayfaları
- SSS sayfası, Blog sayfası (6 makale)

### Fiyatlandırma
- Ana sayfa Pricing: Başlangıç 20k / Büyüme 30k / Kurumsal 40k / Elite 60k
- `/fiyatlar` sayfası: tekil hizmet fiyat listesi (4 kategori)

### Hizmet Sayfaları
- `/hizmetler/sosyal-medya-yonetimi`, `/hizmetler/meta-reklamlari`, `/hizmetler/google-reklamlari`
- `/hizmetler/tiktok-reklamlari`, `/hizmetler/yapay-zeka-otomasyon`, `/hizmetler/web-tasarim-hosting`

### İK / CV Sayfası
- `/cv` — Form, toggle alanlar, Gmail SMTP mail

### PayTR Ödeme Sistemi (KOD HAZIR — AKTİF DEĞİL)
- Bkz. altbölüm "Bekleyen / Yarım Kalanlar"

---

## ✅ Müşteri / Ajans Paneli (Tam Platform)

`/musteri/**` altında tamamen işlevsel ajans iş-takip platformu.

### Teknoloji
| Katman | Seçim |
|--------|-------|
| Veritabanı | Neon Postgres (free tier) |
| ORM | Prisma 6 |
| Auth | Jose JWT → httpOnly cookie `mkz_session` (7 gün) |
| Şifre | bcryptjs |
| Doğrulama | zod |

### Roller
| Rol | Erişim |
|-----|--------|
| `ADMIN` | Tüm firmalar, tüm işlemler, kullanıcı/çalışan yönetimi |
| `EMPLOYEE` | Yalnızca atandığı firmalar, yetki bazlı tab'lar |
| `CLIENT` | Yalnızca kendi firması, sadece okuma + isteğe bağlı not yazma |

### Giriş / Oturum
- URL: `/musteri/giris` — kullanıcı adı + şifre
- Cookie: `mkz_session` httpOnly, Secure, SameSite=Lax
- Middleware (`src/middleware.ts`): tüm `/musteri/**` rotaları koruma altında
- Logout: `POST /api/musteri/auth/logout`

### Paneller
| Panel | URL | Kimler |
|-------|-----|--------|
| Admin Paneli | `/musteri/admin` | ADMIN |
| Firma Yönetimi | `/musteri/admin/[slug]` | ADMIN |
| Yeni Firma | `/musteri/admin/yeni` | ADMIN |
| Admin Profili | `/musteri/admin/profil` | ADMIN |
| Çalışanlar | `/musteri/admin/calisanlar` | ADMIN |
| Admin Takvim | `/musteri/admin/takvim` | ADMIN |
| Çalışan Paneli | `/musteri/calisan` | EMPLOYEE |
| Çalışan Firma | `/musteri/calisan/[slug]` | EMPLOYEE |
| Çalışan Takvim | `/musteri/calisan/takvim` | EMPLOYEE |
| Müşteri Paneli | `/musteri/[slug]` | CLIENT (kendi firması) + ADMIN + EMPLOYEE |

---

## 🗃️ Veritabanı Şeması (Prisma)

Veritabanı: Neon Postgres — `neondb` schema  
Migration'lar `prisma/migrations/` altında.

### Modeller

#### `User` — Kullanıcılar
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String (cuid) | PK |
| email | String (unique) | Giriş e-postası |
| username | String? (unique) | Giriş kullanıcı adı |
| passwordHash | String | bcryptjs hash |
| role | `ADMIN / EMPLOYEE / CLIENT` | Rol |
| name | String | Görünen ad |
| active | Boolean | `false` = soft-delete (çalışan silindi) |
| clientId | String? | Sadece CLIENT için — bağlı firma |
| canWriteNotes | Boolean | Müşteri/çalışan not yazabilir mi (admin her zaman yazabilir) |

#### `Client` — Firmalar
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String (cuid) | PK |
| slug | String (unique) | URL parçası (örn: `ahmet-nakliyat`) |
| name | String | Firma adı |
| package | String | Hizmet paketi adı |
| invoiceNote | String? | Fatura notu |
| active | Boolean | `false` = arşivlendi |

#### `Assignment` — Çalışan → Firma Atamaları
Bir çalışanın birden fazla firmaya atanabilir. Her atama bağımsız yetki seti taşır.

| Alan | Tip | Açıklama |
|------|-----|----------|
| userId | String | EMPLOYEE kullanıcı |
| clientId | String | Firma |
| canViewCampaigns | Boolean | Kampanya görüntüleme |
| canManageCampaigns | Boolean | Kampanya düzenleme |
| canViewContent | Boolean | İçerik görüntüleme |
| canManageContent | Boolean | İçerik düzenleme |
| canViewUpdates | Boolean | Güncelleme görüntüleme |
| canManageUpdates | Boolean | Güncelleme yazma |
| canViewInvoices | Boolean | Fatura görüntüleme |
| canManageInvoices | Boolean | Fatura düzenleme |

Unique constraint: `[userId, clientId]`

#### `Campaign` — Reklam Kampanyaları
| Alan | Tip | Açıklama |
|------|-----|----------|
| platform | `META / GOOGLE / TIKTOK` | Platform |
| name | String | Kampanya adı |
| dailyBudget | String | Günlük bütçe (metin) |
| status | `AKTIF / DURAKLATILDI / TAMAMLANDI / ODEME_HATASI` | |
| ongoing | Boolean | "Devam ediyor" mu |
| startDate / endDate | DateTime? | Tarihler |
| sortOrder | Int | Sıralama |

#### `ContentItem` — İçerik Takvimi
| Alan | Tip | Açıklama |
|------|-----|----------|
| title | String | İçerik başlığı |
| description | String? | Açıklama/not |
| scheduledDate | DateTime | Planlanan tarih |
| status | `PLANLANDI / DUZENLENIYOR / HAZIR / YAYINLANDI` | |
| assigneeId | String? | Atanan çalışan |
| completedAt | DateTime? | Tamamlanma zamanı |
| publishedAt | DateTime? | Yayın zamanı |

#### `Update` — Ajans/Website Güncellemeleri
| Alan | Tip | Açıklama |
|------|-----|----------|
| kind | `AJANS / WEBSITE` | Güncelleme türü |
| text | String | İçerik |
| date | DateTime | Tarih |
| authorId | String? | Yazan kullanıcı |

#### `Invoice` — Faturalar
| Alan | Tip | Açıklama |
|------|-----|----------|
| period | String | Dönem (örn: "Haziran 2026") |
| amount | String | Tutar (metin) |
| status | `ODENDI / BEKLIYOR / GUNU_GELMEDI` | |
| dueDate | DateTime? | Son ödeme tarihi |

#### `Note` — Firma Not Defteri
| Alan | Tip | Açıklama |
|------|-----|----------|
| clientId | String | Firma |
| authorId | String? | Yazan kullanıcı (SetNull on delete) |
| authorRole | `ADMIN / EMPLOYEE / CLIENT` | Yazanın rolü |
| text | String | Not içeriği |
| visibility | `ICERIK / PAYLASIMLI` | `ICERIK` = sadece ajans görür; `PAYLASIMLI` = müşteri de görür |

#### `NoteRead` — Not Okundu Takibi
| Alan | Tip | Açıklama |
|------|-----|----------|
| userId | String | Okuyan kullanıcı |
| noteId | String | Not |
| readAt | DateTime | Okunma zamanı |

Composite PK: `[userId, noteId]`  
Notlar sekmesi açıldığında (GET isteği) tüm notlar bu tabloya `createMany skipDuplicates` ile işlenir.

---

## 🔌 API Route'ları

### Auth
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/auth/login` | POST | Giriş → cookie set |
| `/api/musteri/auth/logout` | POST | Cookie temizle |

### Admin — Firma Yönetimi
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/admin/clients` | POST | Yeni firma oluştur (isteğe bağlı kullanıcı ile birlikte) |
| `/api/musteri/admin/clients/[slug]` | PATCH | Firma bilgilerini güncelle |
| `/api/musteri/admin/clients/[slug]/campaigns` | POST | Kampanya ekle |
| `/api/musteri/admin/clients/[slug]/campaigns/[id]` | PATCH/DELETE | Kampanya güncelle/sil |
| `/api/musteri/admin/clients/[slug]/updates` | POST | Güncelleme ekle |
| `/api/musteri/admin/clients/[slug]/updates/[id]` | PATCH/DELETE | |
| `/api/musteri/admin/clients/[slug]/invoices` | POST | Fatura ekle |
| `/api/musteri/admin/clients/[slug]/invoices/[id]` | PATCH/DELETE | |
| `/api/musteri/admin/clients/[slug]/content` | POST | İçerik öğesi ekle |
| `/api/musteri/admin/clients/[slug]/content/[id]` | PATCH/DELETE | |
| `/api/musteri/admin/clients/[slug]/users` | GET/PATCH | Müşteri kullanıcısı listele / canWriteNotes toggle |

### Admin — Çalışan Yönetimi
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/admin/employees` | GET/POST | Çalışan listesi / yeni çalışan |
| `/api/musteri/admin/employees/[id]` | PATCH/DELETE | Çalışan düzenle (ad/email/şifre) / soft-delete |
| `/api/musteri/admin/employees/[id]/assignments` | GET/POST/DELETE | Çalışan atama yönetimi |

### Admin — Profil
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/admin/profile` | PATCH | Admin kendi adını/emailini/şifresini günceller |

### Notlar
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/notes/[clientSlug]` | GET | Notları getir (rol bazlı filtre) + otomatik okundu işaretle |
| `/api/musteri/notes/[clientSlug]` | POST | Not yaz |
| `/api/musteri/notes/note/[id]` | DELETE | Not sil (kendi notu veya admin) |
| `/api/musteri/notes/note/[id]` | PATCH | Not güncelle (görünürlük değiştirme sadece admin) |

### Bildirimler
| Route | Method | Açıklama |
|-------|--------|----------|
| `/api/musteri/notifications` | GET | Okunmamış not sayılarını firma bazında döner |

---

## 🏗️ Önemli Kod Dosyaları

| Dosya | Açıklama |
|-------|----------|
| `prisma/schema.prisma` | Tüm DB modelleri ve ilişkiler |
| `prisma/seed.ts` | DB seed (5 firma, kullanıcılar) |
| `src/lib/db.ts` | Prisma singleton |
| `src/lib/auth.ts` | `getSession()`, `assertCanAccessClient()`, JWT yardımcıları |
| `src/lib/adminGuard.ts` | Admin route'ları için `requireAdmin()` |
| `src/lib/staffGuard.ts` | Admin+çalışan route'ları için |
| `src/middleware.ts` | `/musteri/**` kaba kapı (JWT kontrol + rol yönlendirme) |
| `src/lib/clientView.ts` | DB → ClientPortal UI veri dönüşümü |
| `src/components/AdminPanel.tsx` | Admin dashboard (firma grid + okunmamış badge) |
| `src/components/AdminClientDetail.tsx` | Firma yönetim ekranı (7 sekme) |
| `src/components/AdminEmployeePanel.tsx` | Çalışan listesi + düzenle/sil |
| `src/components/EmployeeDashboard.tsx` | Çalışan dashboard (atanan firmalar + badge) |
| `src/components/EmployeeClientDetail.tsx` | Çalışan firma detayı (yetki bazlı sekmeler) |
| `src/components/ClientPortal.tsx` | Müşteri paneli (tüm sekmeler, salt okunur) |
| `src/components/Calendar.tsx` | Özel ay-grid takvim (3 rol için) |
| `src/components/Notes.tsx` | Not defteri bileşeni (tüm portallerde kullanılır) |

---

## 🔔 Bildirim Sistemi (Not Bildirimleri)

- Başkası not yazdığında dashboard'da turuncu badge + "🔔 Okunmamış not: Firma A (2)" banner çıkar
- Notlar sekmesi açılınca o firmanın tüm notları okundu işaretlenir (sayfa yenilenince banner kalkar)
- Admin: tüm firmalar için bildirim alır
- Çalışan: yalnızca atandığı firmalar için bildirim alır
- Müşteri: bildirim yok (client portale bildirim eklenmedi)

---

## ⏳ Bekleyen / Yarım Kalanlar

### PayTR Entegrasyonu
**Durum:** Kod %100 hazır, credentials kaydedildi. Ancak test edilemiyor.
**Sorun:** PayTR hesabında **iFrame Ödeme** entegrasyonu aktif değil.
**Yapılacak:**
1. PayTR paneli → Entegrasyonlar → iFrame Ödeme'yi aktif et
2. `PAYTR_TEST_MODE=1` ile test et
3. Test başarılı olunca `PAYTR_TEST_MODE=0` yaparak canlıya al
4. Pricing sayfasındaki "Satın Al" butonlarını `/odeme/[slug]` linklerine bağla

**Credentials (.env.local + Vercel'de):**
- PAYTR_MERCHANT_ID: 674958, TEST_MODE: 1, BASE_URL: https://markaizi.com.tr

### Müşteri Paneli — Olası Geliştirmeler
- [ ] Faz 5 Notlar: müşteri not yazınca ajansa bildirim (şu an sadece ajans→müşteri yönü bildirilir)
- [ ] Çalışan profil sayfası (çalışan kendi şifresini değiştirebilsin)
- [ ] Müşteri profil sayfası (müşteri kendi şifresini değiştirebilsin)
- [ ] Fatura PDF oluşturma

---

## 🚀 Deploy

- `git push origin main` → Vercel otomatik deploy
- Manuel: `vercel --prod`
- Canlı URL: https://markaizi.com.tr

### Gerekli Env Değişkenleri (Vercel)
| Değişken | Açıklama |
|----------|----------|
| DATABASE_URL | Neon pooled bağlantı |
| AUTH_SECRET | JWT imzalama anahtarı |
| SMTP_USER / SMTP_PASS | Gmail SMTP (CV formu için) |
| PAYTR_* | PayTR credentials |

> `DIRECT_URL` Vercel'de gerekmez — migration'lar lokalde çalıştırılır.

### Migration Komutu (Lokal)
```bash
npm run prisma:migrate   # dotenv -e .env.local -- prisma migrate dev
npm run db:seed          # dotenv -e .env.local -- ts-node prisma/seed.ts
npm run prisma:studio    # DB görsel düzenleme
```
