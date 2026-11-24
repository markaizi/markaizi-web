#!/usr/bin/env bash
# BotFather'dan alınan Telegram bot token'ını VPS'teki mkzbot kullanıcısına yazar
# (~mkzbot/.claude/channels/telegram/.env, izin 600). Token ekranda görünmez, hiçbir yere yazdırılmaz.
# Kullanım (Mac, Terminal):  bash bot/telegram-token.sh
set -euo pipefail
VPS="${MKZ_VPS:-alitel-vps}"
printf 'Telegram bot token (BotFather): '; IFS= read -rs T; echo
[[ "$T" =~ ^[0-9]+:[A-Za-z0-9_-]{30,}$ ]] || { echo "✗ Bu bir bot token'ına benzemiyor (biçim: 123456789:AAH...)."; exit 1; }
printf 'TELEGRAM_BOT_TOKEN=%s\n' "$T" | ssh "$VPS" "sudo -u mkzbot bash -c 'mkdir -p ~mkzbot/.claude/channels/telegram && umask 077 && cat > ~mkzbot/.claude/channels/telegram/.env && chmod 600 ~mkzbot/.claude/channels/telegram/.env && echo kaydedildi'"
