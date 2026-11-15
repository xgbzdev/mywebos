#!/bin/bash
# End-to-end test of the FireCloud server, using the same requests as the app.
set -u
U="https://wksjtjligjvclvmyjgcd.supabase.co"
K="sb_publishable_6IVna--g-1c-3dA3ebDrcQ_AjGl8lVZ"
EMAIL="e2e-test@b2l.invalid"; PASS="B2L-e2e-Test-2026!"
OUT=results.txt; : > $OUT
pass=0; fail=0
check() { if [ "$2" = "1" ]; then echo "PASS  $1" | tee -a $OUT; pass=$((pass+1)); else echo "FAIL  $1  ($3)" | tee -a $OUT; fail=$((fail+1)); fi; }
req() { # method path [json|@file] [content-type]
  local m=$1 p=$2 d=${3:-} ct=${4:-application/json} sep="?"; [[ $p == *\?* ]] && sep="&"
  local args=(-s -o body.out -w "%{http_code}" -X "$m" "$U$p${sep}apikey=$K" -H "apikey: $K")
  [ -n "${TOKEN:-}" ] && args+=(-H "Authorization: Bearer $TOKEN")
  [ -n "$d" ] && args+=(-H "Content-Type: $ct" --data-binary "$d")
  curl "${args[@]}" "${EXTRA[@]}"
}
EXTRA=()
# 1. sign in (no Authorization header, like the app when signed out)
code=$(req POST "/auth/v1/token?grant_type=password" "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
TOKEN=$(jq -r .access_token body.out); UID_=$(jq -r .user.id body.out)
check "sign in with email + password" $([ "$code" = 200 ] && [ "$TOKEN" != null ] && echo 1) "$code $(head -c 200 body.out)"
check "wrong password is refused" $(TOKEN= ; [ "$(TOKEN= req POST "/auth/v1/token?grant_type=password" "{\"email\":\"$EMAIL\",\"password\":\"nope-nope\"}")" = 400 ] && echo 1) "expected 400"
# 2. upload a photo into own folder
convert -size 64x64 xc:'#00caf2' photo.jpg 2>/dev/null || printf '\xff\xd8\xff\xe0testjpeg' > photo.jpg
EXTRA=(-H "x-upsert: true")
code=$(req POST "/storage/v1/object/firecloud/$UID_/photos/1700000000000-test.jpg" @photo.jpg image/jpeg)
check "upload photo" $([ "$code" = 200 ] && echo 1) "$code $(head -c 200 body.out)"
EXTRA=()
# 3. list
code=$(req POST "/storage/v1/object/list/firecloud" "{\"prefix\":\"$UID_/photos\",\"limit\":1000,\"offset\":0,\"sortBy\":{\"column\":\"created_at\",\"order\":\"desc\"}}")
check "list my photos" $([ "$code" = 200 ] && [ "$(jq 'map(select(.id!=null))|length' body.out)" = 1 ] && echo 1) "$code $(head -c 200 body.out)"
# 4. signed link + download without any key (what <img> does)
code=$(req POST "/storage/v1/object/sign/firecloud" "{\"expiresIn\":3600,\"paths\":[\"$UID_/photos/1700000000000-test.jpg\"]}")
SURL=$(jq -r '.[0].signedURL // .[0].signedUrl' body.out)
dl=$(curl -s -o dl.out -w "%{http_code}" "$U/storage/v1$SURL")
check "signed photo link opens" $([ "$code" = 200 ] && [ "$dl" = 200 ] && cmp -s dl.out photo.jpg && echo 1) "sign=$code get=$dl"
# 5. space used
code=$(req POST "/rest/v1/rpc/firecloud_usage" "{}")
check "space used counter" $([ "$code" = 200 ] && [ "$(cat body.out)" -gt 0 ] 2>/dev/null && echo 1) "$code $(cat body.out)"
# 6. Find My Device: register, ring, read back
DEV=d0e2e000-0000-4000-8000-000000000001
EXTRA=(-H "Prefer: resolution=merge-duplicates,return=minimal")
code=$(req POST "/rest/v1/devices" "{\"id\":\"$DEV\",\"name\":\"E2E phone\",\"kind\":\"mobile\",\"locate_enabled\":true,\"lat\":41.8902,\"lon\":12.4922,\"accuracy\":20,\"last_seen\":\"$(date -u +%FT%TZ)\"}")
check "register device + location" $([ "$code" = 201 ] || [ "$code" = 200 ] && echo 1) "$code $(head -c 200 body.out)"
EXTRA=(-H "Prefer: return=minimal")
code=$(req PATCH "/rest/v1/devices?id=eq.$DEV" "{\"ring_requested\":true}")
EXTRA=()
code2=$(req GET "/rest/v1/devices?select=*&order=last_seen.desc.nullslast")
check "ring request + device list" $([ "$code" = 204 ] && [ "$(jq -r '.[0].ring_requested' body.out)" = true ] && [ "$(jq -r '.[0].lat' body.out)" = 41.8902 ] && echo 1) "patch=$code list=$code2 $(head -c 200 body.out)"
# 7. security: other accounts' folders and devices are off limits
OTHER=99999999-9999-4999-8999-999999999999
code=$(req POST "/storage/v1/object/firecloud/$OTHER/photos/evil.jpg" @photo.jpg image/jpeg)
check "cannot upload into someone else's folder" $([ "$code" != 200 ] && echo 1) "got $code"
code=$(req POST "/storage/v1/object/list/firecloud" "{\"prefix\":\"$OTHER/photos\"}")
check "cannot list someone else's folder" $([ "$(jq 'length' body.out)" = 0 ] && echo 1) "$(head -c 200 body.out)"
SAVE=$TOKEN; TOKEN=
code=$(req GET "/rest/v1/devices?select=*")
check "signed-out visitors see no devices" $([ "$(jq 'length' body.out 2>/dev/null)" = 0 ] || [ "$code" = 401 ] && echo 1) "$code $(head -c 200 body.out)"
code=$(req POST "/storage/v1/object/list/firecloud" "{\"prefix\":\"$UID_/photos\"}")
check "signed-out visitors see no files" $([ "$(jq 'length' body.out 2>/dev/null)" = 0 ] || [ "$code" -ge 400 ] && echo 1) "$code $(head -c 200 body.out)"
TOKEN=$SAVE
# 8. clean up own test data
code=$(req DELETE "/storage/v1/object/firecloud" "{\"prefixes\":[\"$UID_/photos/1700000000000-test.jpg\"]}")
check "delete photo" $([ "$code" = 200 ] && echo 1) "$code"
code=$(req DELETE "/rest/v1/devices?id=eq.$DEV")
check "remove device" $([ "$code" = 204 ] && echo 1) "$code"
echo "TOTAL: $pass passed, $fail failed" | tee -a $OUT
