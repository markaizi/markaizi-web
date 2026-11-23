# Telegram + Claude botu — VPS kurulumu

Bot, VPS'te ayrı bir kullanıcı (`mkzbot`) altında, `tmux` içinde sürekli açık duran bir Claude Code oturumudur.
Telegram'a resmi kanal eklentisiyle bağlanır; panele yalnızca `mkz` komutuyla (→ `https://markaizi.com.tr/api/agent`) erişir.
Veritabanına, diğer sitelere ve sunucudaki başka hiçbir şeye dokunmaz.

## Gerekenler
- Vercel'de `AGENT_TOKEN` ortam değişkeni (en az 32 karakter) — aynı değer VPS'te `~mkzbot/.mkz-env` içinde `MKZ_TOKEN=…`.
- BotFather'dan alınmış Telegram bot token'ı.
- VPS'te `mkzbot` kullanıcısıyla bir kez `claude` girişi (claude.ai aboneliği).

## Adımlar (özet)
1. `adduser --disabled-password mkzbot`; Bun ve Claude Code'u bu kullanıcıya kur.
2. `bot/` klasörünü `/home/mkzbot/markaizi-bot/` altına kopyala; `mkz`'yi `/usr/local/bin/mkz` olarak bağla.
3. `/home/mkzbot/.mkz-env` (izin 600): `MKZ_TOKEN=<AGENT_TOKEN ile aynı>`.
4. `mkzbot` olarak `cd ~/markaizi-bot && claude` → giriş yap → `/plugin install telegram@claude-plugins-official`
   → `/telegram:configure <bot token>` → çık.
5. `tmux new -d -s mkzbot 'cd ~/markaizi-bot && claude --channels plugin:telegram@claude-plugins-official'`
6. Telegram'dan bota yaz → gelen kodu oturumda `/telegram:access pair <kod>` → `/telegram:access policy allowlist`.

Yeniden başlatma: `tmux kill-session -t mkzbot` ardından 5. adım. Sunucu açılışında otomatik başlatma için systemd birimi eklenebilir.
