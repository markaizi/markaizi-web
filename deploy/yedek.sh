#!/usr/bin/env bash
# markaizi — VPS'te çalışan veritabanı yedeği.  Kurulum yeri: /var/www/markaizi/bin/yedek.sh
# Cron (root): 30 3 * * *  bash /var/www/markaizi/bin/yedek.sh gece   (her gece 03:30)
# Çıktı: /var/backups/markaizi/markaizi-<etiket>-<zaman>.sql.gz  — gece yedeklerinden son 30'u tutulur.
# VPS dışı kopya: Mac'ten  bash deploy/yedek-cek.sh
set -euo pipefail
ETIKET="${1:-elle}"
DIR=/var/backups/markaizi
mkdir -p "$DIR" && chmod 700 "$DIR"
OUT="$DIR/markaizi-$ETIKET-$(date +%Y%m%d-%H%M%S).sql.gz"
sudo -u postgres pg_dump --no-owner --no-acl markaizi_web | gzip -9 > "$OUT.tmp"
# Boş / bozuk yedek kalmasın: en az bir tablo verisi içermeli
# (grep -q erken çıkınca zcat SIGPIPE alır; pipefail bunu hata sayardı — bütünlüğü gzip -t zaten doğruluyor)
if ! gzip -t "$OUT.tmp" || ! { zcat "$OUT.tmp" || true; } | grep -q '^COPY public\."Client"'; then
  echo "✗ yedek geçersiz"; rm -f "$OUT.tmp"; exit 1
fi
mv "$OUT.tmp" "$OUT" && chmod 600 "$OUT"
ls -1t "$DIR"/markaizi-gece-*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm -f
echo "yedek: $OUT ($(du -h "$OUT" | cut -f1))"
