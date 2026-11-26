# Markaizi Asistan (Claude botu) — VPS kurulumu

Bot, VPS'te ayrı bir kullanıcı (`mkzbot`) altında, `tmux` içinde sürekli açık duran bir Claude Code oturumudur
(claude.ai aboneliğiyle çalışır, ayrıca API ücreti yok). Panele yalnızca `mkz` komutuyla
(→ `https://markaizi.com.tr/api/agent`, `AGENT_TOKEN` ile) erişir; veritabanına, diğer sitelere ve sunucudaki
başka hiçbir şeye dokunmaz. İzinler `bot/.claude/settings.json`'da: yalnızca `mkz` ve Telegram araçları serbest,
dosya yazma / web / alt ajan kapalı, sır dosyalarını okumak yasak.

## Nereden yazılır
- **Remote Control (asıl kanal):** Claude uygulaması (telefon) → Code → **Markaizi Asistan**, ya da claude.ai/code.
  Yalnızca Samet'in Claude hesabı görür.
- **Telegram (yedek kanal):** resmi kanal eklentisi `telegram@claude-plugins-official`. Kasım 2026'da Telegram botlara
  sürekli 429 döndüğü için eşleştirme yapılamadı; eklenti açık bekliyor, Telegram izin verince eşleştirilir (aşağıda).

## Gerekenler
- Vercel'de `AGENT_TOKEN` (≥ 32 karakter, Production, sensitive) — aynı değer VPS'te `~mkzbot/.mkz-env` içinde `MKZ_TOKEN=…` (izin 600).
- VPS'te `mkzbot` kullanıcısıyla bir kez `claude` girişi (claude.ai aboneliği).

## Adımlar
1. Kullanıcı + araçlar (Mac'ten): `ssh <vps> 'bash -s' < bot/vps-kurulum.sh`
   — `mkzbot` kullanıcısı, Bun, Claude Code, `~/markaizi-bot` klasörü.
2. `bot/CLAUDE.md`, `bot/mkz`, `bot/.claude/settings.json` → `/home/mkzbot/markaizi-bot/`.
   Etkileşimsiz kabuklarda PATH için bağlantılar: `~/.local/bin/mkz → ~/markaizi-bot/mkz`, `~/.local/bin/bun → ~/.bun/bin/bun`.
3. `~mkzbot/.mkz-env` dosyasını oluştur; `mkz ozet` canlı veri döndürmeli.
4. `mkzbot` olarak bir kez `cd ~/markaizi-bot && claude` → giriş yap → `/plugin install telegram@claude-plugins-official` → çık.
5. (Telegram için) token'ı gizli girişle kaydet: `bash bot/telegram-token.sh` (Mac'te; token ekrana / geçmişe düşmez).
6. Otomatik başlatma: `bot/mkzbot.service` → `/etc/systemd/system/` → `systemctl daemon-reload && systemctl enable --now mkzbot`.
   Servis oturumu `claude --remote-control 'Markaizi Asistan' --channels plugin:telegram@claude-plugins-official` ile açar,
   `ENABLE_CLAUDEAI_MCP_SERVERS=false` (hesaba bağlı claude.ai bağlayıcıları bota yüklenmez); oturum kapanırsa 10 sn sonra yeniden açılır.
7. Telegram eşleştirme (Telegram açıldığında): bota yaz → gelen kodu oturumda `/telegram:access pair <kod>` → `/telegram:access policy allowlist`.
   Oturuma dışarıdan komut: `sudo -iu mkzbot tmux send-keys -t mkzbot '<komut>' Enter`.

## İşletim
- Durum: `systemctl status mkzbot` · ekran: `sudo -iu mkzbot tmux attach -t mkzbot` (çıkış: Ctrl+b, d)
- Yeniden başlat: `systemctl restart mkzbot` (yalnızca bot; diğer servislere dokunmaz). Her yeniden başlatmada
  Remote Control yeni bir oturum açar — uygulamada yine "Markaizi Asistan" adıyla görünür.
- Yönerge güncelleme (asistana yeni komut eklendiğinde): `bot/CLAUDE.md` → `/home/mkzbot/markaizi-bot/CLAUDE.md`
  (sahibi `mkzbot`, eskisini yedekle) → `systemctl restart mkzbot`. Önce site deploy edilmiş olmalı; sonra `sudo -iu mkzbot mkz finans` ile sına.
- Bot işlemleri panelde **İşlem kaydı** (`/musteri/admin/islem-kaydi`) sayfasında "bot" kaynağıyla görünür.
- Token sızarsa: Vercel'de `AGENT_TOKEN`'ı ve VPS'te `MKZ_TOKEN`'ı birlikte yenile, siteyi yeniden deploy et.
