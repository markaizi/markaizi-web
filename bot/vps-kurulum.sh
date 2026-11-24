#!/usr/bin/env bash
# markaizi botu — VPS'te bir kez çalıştırılır (root). Mac'ten:  ssh alitel-vps 'bash -s' < bot/vps-kurulum.sh
# Yaptıkları (yalnızca bunlar; diğer sitelere / servislere dokunmaz):
#   1) mkzbot kullanıcısı (şifresiz, giriş yalnızca root'tan sudo ile)
#   2) Bun + Claude Code — YALNIZCA mkzbot'un kendi ev klasörüne (resmi kurulum betikleri: bun.sh, claude.ai)
#   3) /home/mkzbot/markaizi-bot  (bot/ klasörü ayrıca rsync ile gönderilir)
set -euo pipefail
id mkzbot >/dev/null 2>&1 || adduser --disabled-password --gecos "" mkzbot >/dev/null
chmod 750 /home/mkzbot
sudo -iu mkzbot bash -c 'command -v ~/.bun/bin/bun >/dev/null || curl -fsSL https://bun.sh/install | bash >/dev/null 2>&1; echo "bun $(~/.bun/bin/bun --version)"'
sudo -iu mkzbot bash -c 'test -x ~/.local/bin/claude || curl -fsSL https://claude.ai/install.sh | bash >/dev/null 2>&1; echo "claude $(~/.local/bin/claude --version)"'
sudo -iu mkzbot bash -c 'grep -q ".bun/bin" ~/.bashrc || echo "export PATH=\$HOME/.local/bin:\$HOME/.bun/bin:\$HOME/markaizi-bot:\$PATH" >> ~/.bashrc'
mkdir -p /home/mkzbot/markaizi-bot && chown mkzbot:mkzbot /home/mkzbot/markaizi-bot
echo "tamam: mkzbot hazır"
