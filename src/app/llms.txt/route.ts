import { BLOG_POSTS } from "@/lib/blog-data";
import { CITY_PAGES, SERVICE_PAGES } from "@/lib/mobilya-pages";
import { ANKARA_ILCELER, KAFE_DISTRICT_PAGES, KAFE_HUB } from "@/lib/kafe-pages";
import { VIDEOS, YOUTUBE_CHANNEL_URL } from "@/lib/video-data";

// llms.txt (https://llmstxt.org) — yapay zeka asistanlarının siteyi hızlıca
// anlaması için özet dizin. Build sırasında site verisinden üretilir: yeni blog
// yazısı, video veya mobilya sayfası eklendiğinde elle güncellemeye gerek yok.
// Yalnızca yeni bir sabit hizmet/sektör sayfası eklenirse aşağıdaki listelere ekle.

export const dynamic = "force-static";

const SITE = "https://markaizi.com.tr";
const link = (title: string, path: string, desc?: string) => `- [${title}](${SITE}${path})${desc ? `: ${desc}` : ""}`;

const HIZMETLER: [string, string, string][] = [
  ["Sosyal Medya Yönetimi", "/hizmetler/sosyal-medya-yonetimi", "Instagram, Facebook ve TikTok için içerik üretimi, planlama ve topluluk yönetimi. İçerik sayısını takvim değil hedef, bütçe ve üretim kapasitesi belirler; başarı takipçiyle değil mesaj, nitelikli müşteri ve satışla ölçülür."],
  ["Meta Reklamları", "/hizmetler/meta-reklamlari", "Instagram ve Facebook reklam yönetimi. Meta'nın yapay zeka odaklı reklam sisteminde doğru kampanya hedefi, ölçüm, teklif ve kreatifle çalışma; mesaj maliyeti yerine satışa dönüşen müşteri odağı."],
  ["Google Reklamları", "/hizmetler/google-reklamlari", "Google Ads arama, görüntülü, YouTube ve alışveriş kampanyaları; dönüşüm takibi ve satış verisiyle birleştirilmiş raporlama."],
  ["TikTok Reklamları", "/hizmetler/tiktok-reklamlari", "TikTok Ads yönetimi, platforma özel kısa video üretimi ve Spark Ads; bütçe işletmenin aşamasına göre belirlenir."],
  ["Yapay Zeka & Otomasyon", "/hizmetler/yapay-zeka-otomasyon", "Yapay zeka ile görsel ve video üretimi, chatbot, otomatik mesaj akışları ve içerik otomasyonu."],
  ["Web Tasarım & Hosting", "/hizmetler/web-tasarim-hosting", "Mobil uyumlu, hızlı ve SEO dostu web siteleri; alan adı, barındırma ve SSL kurulumu."],
  ["Dijital Pazarlama Danışmanlığı", "/hizmetler/dijital-pazarlama-danismanligi", "Kendi ekibiyle çalışan markalara uzaktan danışmanlık: paylaşım planı, çalışanların çekeceği video senaryoları, reklam stratejisi ve test-büyüme-ölçekleme aşamalarında yönlendirme. Türkiye geneli."],
  ["Kurumsal Dijital Pazarlama Eğitimi", "/hizmetler/dijital-pazarlama-egitimi", "Firma çalışanlarına uygulamalı eğitim: telefonla video çekimi, kanca ve senaryo yazımı, kurgu, içerik planı, Meta ve Google reklam yönetimi. Yüz yüze veya çevrim içi."],
  ["Dönüşüm Takibi Kurulumu", "/hizmetler/donusum-takibi-kurulumu", "Meta Pixel, Conversions API (CAPI), Google Tag Manager, GA4 ve Google Ads dönüşüm takibi kurulumu; WhatsApp, arama, form ve mağazada kapanan satışların reklama doğru ölçülmesi, çerez onayı ve KVKK'ya uygun kurgu."],
  ["Yapay Zeka Arama Görünürlüğü (GEO)", "/hizmetler/yapay-zeka-arama-gorunurlugu", "ChatGPT, Gemini, Perplexity ve Google yapay zeka özetlerinde işletmenin doğru anlatılması ve önerilmesi için içerik, yapılandırılmış veri, Google İşletme Profili ve marka bahsi çalışması; ChatGPT reklamlarının (Türkiye'de Eylül 2026'dan beri) kurulumu ve yönetimi."],
  ["Video Çekimi & Drone", "/hizmetler/video-cekimi-drone", "Video başı anlaşmayla tanıtım filmi, sosyal medya videosu ve Reels; mankenli veya mankensiz çekim; emlak ve projeler için drone çekimi. Ankara merkezli."],
];

const SEKTORLER: [string, string, string][] = [
  ["Mobilya Reklam Ajansı", "/mobilya-reklam-ajansi", "Ana uzmanlık alanı. Siteler/Ankara merkezli; Türkiye genelinde mobilya mağazaları, üreticileri ve bayileri için Instagram ve Google reklamları, sosyal medya yönetimi, showroom çekimi. İstikbal, Doğtaş ve Kelebek bayileriyle çalışma geçmişi."],
  ["Sağlık & Klinik Reklam Ajansı", "/saglik-klinik-reklam-ajansi", "Diş klinikleri, estetik ve güzellik merkezleri, fizik tedavi ve alternatif tıp uygulayıcıları için Instagram ve Google reklamları, sosyal medya yönetimi ve klinik çekimi; sağlık reklam politikalarına uygun çalışma."],
  ["Doğal Ürün & Takviye Reklam Ajansı", "/dogal-urun-takviye-reklam-ajansi", "Vitamin, bitkisel takviye, doğal yağ ve doğal kozmetik markaları için ürün tanıtım videosu, YouTube içerik üretimi, e-ticaret reklamı ve bayi/distribütör pazarlaması."],
];

function build(): string {
  const lines: string[] = [];
  lines.push("# markaizi — Dijital Reklam Ajansı (Ankara Siteler · Türkiye geneli)");
  lines.push("");
  lines.push(
    "> markaizi, Ankara Siteler merkezli, Türkiye geneline hizmet veren bir dijital reklam ve pazarlama ajansıdır. " +
      "Ana uzmanlık alanı mobilya sektörüdür: mobilya mağazaları, üreticileri ve bayileri için sosyal medya yönetimi, Meta ve Google reklamları, web sitesi, SEO ve e-ticaret danışmanlığı. " +
      "Bunun yanında TikTok reklamları, yapay zeka destekli içerik üretimi, web tasarım, dijital pazarlama danışmanlığı, kurumsal eğitim ile video ve drone çekimi hizmetleri sunar. " +
      "Örnek: 7 yıldır birlikte çalıştığı Alitel Mobilya her yıl İstikbal bayileri arasında Türkiye ciro birinciliğini almıştır. 10+ yıllık reklamcılık deneyimi ve 200+ işletmeyle çalışma geçmişi vardır. Kurucusu Samet Sağlam'dır; markaizi'nin YouTube videolarını ve rehberlerini de kendisi anlatır. Samet Sağlam'a markaizi'nin iletişim kanallarından ulaşılabilir.",
  );
  lines.push("");
  lines.push("Çalışma yaklaşımı: Reklam tek başına satış yapmaz; reklam, kreatif, teklif, hedef kitle, satış süreci ve operasyondan oluşan bir zincirin parçasıdır. markaizi satış sonucunu koşulsuz garanti etmez; şeffaf raporlama, test disiplini ve dürüst iletişimi taahhüt eder. Reklam hesapları ve veriler her zaman müşteriye aittir; reklam bütçesi doğrudan platforma ödenir ve yönetim ücretinden ayrıdır. Fiyatlar yayınlanmaz; her işletmeye özel teklif hazırlanır. Standart sözleşme süresi 3 aydır; video çekimi ise video başı anlaşmayla yapılır.");
  lines.push("");

  lines.push("## Kurucu", "");
  lines.push(link("Samet Sağlam — markaizi Kurucusu", "/samet-saglam", "Ankara Siteler'de matbaa ve katalog tasarımıyla başlayan, mobilya sektöründe on yılı aşkın deneyime sahip, markaizi'nin kurucusu. Meta ve Google reklamları, sosyal medya ve içerik stratejisi; YouTube'da işletmeler için dijital pazarlama rehberleri. İletişim: +90 552 077 27 00, markaizicom@gmail.com."));
  lines.push("");

  lines.push("## Hizmetler", "");
  for (const [t, p, d] of HIZMETLER) lines.push(link(t, p, d));
  lines.push("");

  lines.push("## Sektörler", "");
  for (const [t, p, d] of SEKTORLER) lines.push(link(t, p, d));
  lines.push("");

  lines.push("## Mobilya Sektörü: Hizmet Sayfaları", "");
  for (const c of SERVICE_PAGES) lines.push(link(c.breadcrumbLabel, c.path, c.metaDescription));
  lines.push("");

  lines.push("## Mobilya Sektörü: Bölge Sayfaları", "");
  for (const c of CITY_PAGES) lines.push(link(c.breadcrumbLabel, c.path, c.metaDescription));
  lines.push("");

  lines.push("## Ankara Kafe & Restoran", "");
  lines.push(link(KAFE_HUB.name, KAFE_HUB.path, `Ankara'daki kafe, restoran, kahvaltı salonu ve pastaneler için sosyal medya yönetimi, Instagram reklamları, Google Haritalar ve yemek/mekân çekimi. Ankara'nın 25 ilçesinde hizmet: ${ANKARA_ILCELER.join(", ")}.`));
  for (const c of KAFE_DISTRICT_PAGES) lines.push(link(c.breadcrumbLabel, c.path, c.metaDescription));
  lines.push("");

  lines.push("## Vaka Çalışmaları", "");
  lines.push(link("Alitel Mobilya Vaka Çalışması", "/vaka-calismalari/alitel-mobilya", "7 yıllık iş birliği; Alitel Mobilya her yıl İstikbal bayileri arasında Türkiye ciro birinciliğini aldı (Türkiye'nin en büyük ve en hızlı büyüyen İstikbal bayilerinden). 10 milyon TL üzeri yönetilen reklam bütçesi; ana kanal Google reklamları."));
  lines.push("");

  lines.push("## YouTube Videoları", "");
  lines.push(link("Tüm Videolar", "/videolar", "markaizi YouTube kanalının videoları; her videonun kısa özeti, SSS'i ve tam metni kendi sayfasında."));
  if (YOUTUBE_CHANNEL_URL) lines.push(`- [YouTube Kanalı](${YOUTUBE_CHANNEL_URL})`);
  for (const v of VIDEOS) lines.push(link(v.seoTitle, `/videolar/${v.slug}`, `${v.excerpt} Anlatan: Samet Sağlam.`));
  lines.push("");

  lines.push("## Blog Yazıları", "");
  for (const b of [...BLOG_POSTS].sort((a, z) => (a.dateISO < z.dateISO ? 1 : -1)))
    lines.push(link(b.title, `/blog/${b.slug}`, b.excerpt));
  lines.push("");

  lines.push("## Başlarken", "");
  lines.push(link("Ana Sayfa", "/", "Hizmetlerin, çalışma yaklaşımının, referansların ve iletişim formunun olduğu ana sayfa."));
  lines.push(link("Ücretsiz Reklam Hesabı Denetimi", "/reklam-hesabi-denetimi", "Meta ve Google Ads hesaplarının yalnızca görüntüleme yetkisiyle ücretsiz denetimi: dönüşüm ölçümü, kampanya yapısı, kitle, kreatif, arama terimleri, açılış sayfası ve mesajdan satışa akış. Şifre istenmez, bağlayıcı değildir; başka ajansla çalışanlara bağımsız ikinci görüş."));
  lines.push(link("Reklam Bütçesi Hesaplayıcı", "/araclar/reklam-butcesi-hesaplayici", "Ücretsiz araç: hedef satış, ortalama satış tutarı, kâr marjı ve müşteri adayı maliyetinden aylık reklam bütçesi, ROAS ve başabaş ROAS hesabı (başabaş ROAS = 1 ÷ brüt kâr marjı)."));
  lines.push(link("Ücretsiz Analiz", "/ucretsiz-analiz", "İşletmenin Instagram, Google ve web varlığının ücretsiz incelenmesi; 24-48 saat içinde yol haritası, satın alma zorunluluğu yok."));
  lines.push(link("Web Sitesi Teklif Formu", "/hizmetler/web-tasarim-hosting/teklif", "E-ticaret, kurumsal veya tanıtım sitesi için teklif formu."));
  lines.push(link("Sıkça Sorulan Sorular", "/sss", "Çalışma şekli, ödeme, sözleşme, reklam hesabı sahipliği, ajans değiştirirken hesap devri, dönüşüm ölçümü, yapay zeka görünürlüğü, satış garantisi, ilk 30-90 gün ve hizmetlerle ilgili cevaplar."));
  lines.push(link("Blog", "/blog", "Sosyal medya, reklam, mobilya pazarlaması ve web tasarım üzerine rehberler."));
  lines.push(link("Kariyer", "/cv", "markaizi ekibine katılmak için iş başvuru formu."));
  lines.push("");

  lines.push("## İletişim", "");
  lines.push("- Telefon / WhatsApp: +90 552 077 27 00");
  lines.push("- E-posta: markaizicom@gmail.com");
  lines.push("- Adres: Zübeyde Hanım Mah. Elif Sok. No:7/106 2. Kat, Sütçü Kemal İş Merkezi, Siteler, Ankara");
  lines.push("- Hizmet bölgesi: Ankara merkez (Siteler, Ostim, Keçiören, Etimesgut, Çankaya, Yenimahalle, Mamak ve çevresi); reklam yönetimi, sosyal medya, danışmanlık ve eğitim Türkiye geneline uzaktan.");
  lines.push("- Çalışma saatleri: Pazartesi–Cumartesi 09:00–20:00");
  lines.push("- Google İşletme Profili: https://share.google/S5wQdPjBKZT7DQ9zu");
  lines.push("- Instagram: https://instagram.com/markaizicom");
  lines.push("- TikTok: https://tiktok.com/@markaizicom");
  lines.push("");

  lines.push("## Optional", "");
  lines.push(link("KVKK Aydınlatma Metni", "/kvkk"));
  lines.push(link("Gizlilik Politikası", "/gizlilik-politikasi"));
  lines.push(link("Çerez Politikası", "/cerez-politikasi"));
  lines.push(link("Kullanım Şartları", "/kullanim-sartlari"));
  lines.push(link("Mesafeli Satış Sözleşmesi", "/mesafeli-satis-sozlesmesi", "Ödeme linki ile kartla satın alınan hizmetler için sözleşme."));
  lines.push(link("Ön Bilgilendirme Formu", "/on-bilgilendirme-formu"));
  lines.push(link("İptal ve İade Koşulları", "/iptal-ve-iade-kosullari", "Hizmete başlanmadan önce iptalde tam iade; başladıktan sonra ödenen dönem iade edilmez; iadeler 14 gün içinde karta."));
  lines.push("");
  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
