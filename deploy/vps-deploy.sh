#!/usr/bin/env bash
# markaizi — LOKALDEN (Mac) çalıştırılan VPS deploy scripti.
# Kullanım (proje kökünden):  bash deploy/vps-deploy.sh
#
# Neden derleme Mac'te? VPS 1 çekirdek; `next build` orada diğer siteleri (alitelmobilya,
# duruavize…) yavaşlatır. Burada derlenir, yalnızca çalışmaya hazır çıktı gönderilir.
#
# Sunucu düzeni (/var/www/markaizi):
#   releases/<zaman>/   her deploy'un standalone çıktısı (son 5 tanesi tutulur)
#   current -> releases/<zaman>   systemd servisinin çalıştırdığı sürüm
#   shared/.env         sunucunun kendi sırları (git'te YOK, script ASLA ezmez)
# Servis: markaizi-web.service (kullanıcı: markaizi, 127.0.0.1:3002). Yalnızca bu servis yeniden başlar.
# Veritabanı değişikliği (migration) bu script'te YOK — ayrı adım: deploy/vps-migrate.sh
set -euo pipefail
cd "$(dirname "$0")/.."

VPS="${MKZ_VPS:-alitel-vps}"
APP=/var/www/markaizi
REL="$(date +%Y%m%d-%H%M%S)"
S=.next/standalone

if [ -n "$(git status --porcelain -- src prisma package.json next.config.ts)" ]; then
  echo "✗ Commit edilmemiş değişiklik var (src/prisma/config). Önce commit et — canlıdaki kod git'te olmalı."
  [ "${FORCE:-0}" = "1" ] || exit 1
fi

echo "▶ Derleniyor…"
rm -rf .next/cache/turbopack .next/standalone   # iCloud kopyaları (\"LOG 2\" vb.) derlemeyi bozabiliyor
npm run build

echo "▶ Çıktı hazırlanıyor…"
cp -R .next/static "$S/.next/static"
cp -R public "$S/public"
# Linux sharp (görsel optimizasyonu) — sürüm, kurulu sharp paketinden okunur
TMP="$(mktemp -d)"
for pkg in sharp-linux-x64 sharp-libvips-linux-x64; do
  ver="$(node -p "require('./node_modules/sharp/package.json').optionalDependencies['@img/$pkg']")"
  (cd "$TMP" && npm pack "@img/$pkg@$ver" --silent >/dev/null)
  mkdir -p "$S/node_modules/@img/$pkg"
  tar -xzf "$TMP"/img-$pkg-*.tgz -C "$S/node_modules/@img/$pkg" --strip-components=1
done
rm -rf "$TMP"
test -f "$S/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node" \
  || { echo "✗ Prisma Linux motoru yok (schema.prisma binaryTargets)"; exit 1; }

echo "▶ VPS'e gönderiliyor ($REL)…"
rsync -az --delete \
  --exclude '* [0-9]*' --exclude '.DS_Store' \
  --exclude 'libquery_engine-darwin*' --exclude '@img/sharp-darwin*' --exclude '@img/sharp-libvips-darwin*' \
  --exclude '.env*' \
  "$S/" "$VPS:$APP/releases/$REL/"

echo "▶ Devreye alınıyor…"
ssh "$VPS" "REL=$REL APP=$APP bash -s" <<'REMOTE'
set -euo pipefail
cd "$APP"
rm -rf "releases/$REL/.next/cache" && ln -s ../../../shared/cache "releases/$REL/.next/cache"
chown -R root:markaizi "releases/$REL" && chmod -R g+rX,o-rwx "releases/$REL"
ln -sfn "releases/$REL" current.new && mv -Tf current.new current
systemctl restart markaizi-web
code=000
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3002/ || true)
  [ "$code" = "200" ] && break; sleep 1
done
echo "  sağlık kontrolü: HTTP $code"
if [ "$code" != "200" ]; then
  prev=$(ls -1 releases | sort | grep -vx "$REL" | tail -1 || true)
  if [ -n "$prev" ]; then
    echo "✗ Yeni sürüm açılmadı — önceki sürüme ($prev) dönülüyor"
    ln -sfn "releases/$prev" current.new && mv -Tf current.new current
    systemctl restart markaizi-web
  else
    echo "✗ Yeni sürüm açılmadı (dönülecek önceki sürüm yok)"
  fi
  journalctl -u markaizi-web -n 20 --no-pager || true
  exit 1
fi
ls -1 releases | sort | head -n -5 | xargs -r -I{} rm -rf "releases/{}"
REMOTE
echo "✅ Deploy tamamlandı: $REL"
