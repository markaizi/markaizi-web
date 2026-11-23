#!/usr/bin/env bash
# markaizi — VPS'teki veritabanı yedeklerini Mac'e çeker (VPS dışı kopya).
# Kullanım:  bash deploy/yedek-cek.sh   →  ~/markaizi-yedekler/
# Yedekler müşteri ve finans verisi içerir: bu klasör git'e, iCloud'a ya da paylaşılan yere konmaz.
set -euo pipefail
VPS="${MKZ_VPS:-alitel-vps}"
HEDEF="${MKZ_YEDEK_DIR:-$HOME/markaizi-yedekler}"
mkdir -p "$HEDEF" && chmod 700 "$HEDEF"
rsync -az "$VPS:/var/backups/markaizi/" "$HEDEF/"
ls -1t "$HEDEF" | head -3
