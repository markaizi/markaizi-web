#!/usr/bin/env bash
# markaizi — VPS'teki sunucu sırlarını (/var/www/markaizi/shared/.env) soru-cevapla doldurur.
# Kullanım (Terminal'de):  bash deploy/env-doldur.sh
# Yazdıkların ekranda görünmez, hiçbir yere yazdırılmaz; boş bırakılan satır değiştirilmez.
# DATABASE_URL / DIRECT_URL / AUTH_SECRET sunucunun kendi değerleridir — bu script onlara dokunmaz.
set -euo pipefail
VPS="${MKZ_VPS:-alitel-vps}"
KEYS=(RESEND_API_KEY GMAIL_USER GMAIL_APP_PASSWORD PAYTR_MERCHANT_ID PAYTR_MERCHANT_KEY PAYTR_MERCHANT_SALT PAYTR_TEST_MODE AGENT_TOKEN)
TMP="$(mktemp)"; chmod 600 "$TMP"; trap 'rm -f "$TMP"' EXIT
echo "Her değeri yapıştırıp Enter'a bas. Atlamak için boş bırakıp Enter."
for k in "${KEYS[@]}"; do
  printf '%s: ' "$k"; IFS= read -rs v; echo
  [ -n "$v" ] && printf '%s\t%s\n' "$k" "$v" >> "$TMP"
done
[ -s "$TMP" ] || { echo "Hiç değer girilmedi, değişiklik yok."; exit 0; }
MERGE=$(cat <<'PY'
import sys
p = sys.argv[1]
new = dict(l.rstrip("\n").split("\t", 1) for l in sys.stdin if "\t" in l)
out, seen = [], set()
for l in open(p).read().splitlines():
    k = l.split("=", 1)[0]
    if k in new:
        out.append(k + "=" + new[k]); seen.add(k)
    else:
        out.append(l)
out += [k + "=" + v for k, v in new.items() if k not in seen]
open(p, "w").write("\n".join(out) + "\n")
print("güncellendi:", ", ".join(sorted(new)))
PY
)
[ "${ENV_DOLDUR_TEST:-}" ] && { python3 -c "$MERGE" "$ENV_DOLDUR_TEST" < "$TMP"; exit; }
B64="$(printf '%s' "$MERGE" | base64 | tr -d '\n')"
ssh "$VPS" "python3 -c \"\$(echo $B64 | base64 -d)\" /var/www/markaizi/shared/.env && systemctl restart markaizi-web && echo 'servis yeniden başlatıldı'" < "$TMP"
