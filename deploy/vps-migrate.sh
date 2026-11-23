#!/usr/bin/env bash
# markaizi — VPS veritabanına migration uygular (yalnızca `prisma migrate deploy`, yıkıcı komut YOK).
# Kullanım (proje kökünden, Mac'te):  bash deploy/vps-migrate.sh
# Bağlantı bilgisi sunucudaki /var/www/markaizi/shared/.env'den okunur; Mac'e hiçbir sır gelmez.
set -euo pipefail
cd "$(dirname "$0")/.."
VPS="${MKZ_VPS:-alitel-vps}"
APP=/var/www/markaizi
PRISMA_VER="$(node -p "require('./node_modules/prisma/package.json').version")"

rsync -az --delete --exclude '* [0-9]*' prisma/ "$VPS:$APP/migrate/prisma/"
ssh "$VPS" "bash -s" <<REMOTE
set -euo pipefail
cd $APP/migrate
set -a; . $APP/shared/.env; set +a
# Önce güvenlik yedeği
bash $APP/bin/yedek.sh "migration-oncesi"
npx --yes prisma@$PRISMA_VER migrate deploy --schema prisma/schema.prisma
REMOTE
