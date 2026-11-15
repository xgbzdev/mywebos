#!/bin/bash
# Firefox OS (personal edition) - ISO builder
# Run on Debian 12/13 or Ubuntu 22.04+ (x86_64) with internet access:
#     sudo ./build.sh
# Output: firefoxos-amd64.iso in this folder.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
exec > >(tee -a build.log) 2>&1

if [ "$(id -u)" -ne 0 ]; then
    echo "Please run as root:  sudo ./build.sh" >&2
    exit 1
fi

cd "$(dirname "$(readlink -f "$0")")"
ROOT="$(pwd)"
OUTNAME="firefoxos-amd64.iso"

# Editions (e.g. EDITION=slim32): main config + the edition's own files on top
EDITION="${EDITION:-}"
if [ -n "$EDITION" ]; then
    [ -d "editions/$EDITION" ] || { echo "No such edition: $EDITION" >&2; exit 1; }
    W="build-$EDITION"
    rm -rf "$W"; mkdir -p "$W"
    cp -r auto config "$W"/
    [ -d branding ] && cp -r branding "$W"/
    cp -r "editions/$EDITION/." "$W"/
    if [ -f "$W/remove.txt" ]; then
        (cd "$W" && grep -v '^#' remove.txt | xargs -r rm -rf)
    fi
    [ -f "$W/outname" ] && OUTNAME="$(cat "$W/outname")"
    cd "$W"
fi

echo "==> Installing build tools (live-build, xorriso, squashfs)..."
apt-get update
apt-get install -y live-build debootstrap xorriso squashfs-tools \
    debian-archive-keyring ca-certificates

# Ubuntu's live-build is old; it still works for a Debian target but needs the keyring.
chmod +x auto/* config/hooks/normal/*.hook.* config/includes.chroot/usr/local/bin/*

echo "==> Cleaning previous build..."
lb clean --purge || true

echo "==> Configuring..."
lb config

echo "==> Branding the boot menu as Firefox OS..."
if [ -d /usr/share/live/build/bootloaders ]; then
    rm -rf config/bootloaders
    cp -r /usr/share/live/build/bootloaders config/bootloaders
    grep -rlIE "Debian|@PROJECT@" config/bootloaders | xargs -r sed -i 's#Debian GNU/Linux#Firefox OS#g; s#Debian#Firefox OS#g; s#@PROJECT@#Firefox OS#g' || true
    find config/bootloaders -name 'splash.svg*' -exec cp branding/splash.svg {} \;
    find config/bootloaders -name 'splash.png' -exec cp branding/splash.png {} \;
    ls config/bootloaders || true
fi

echo "==> Building (this takes 20-60 minutes)..."
lb build

ISO=$(ls -1 live-image-*.hybrid.iso 2>/dev/null | head -n1 || true)
if [ -n "$ISO" ]; then
    mv "$ISO" "$ROOT/$OUTNAME"
    cd "$ROOT"
    sha256sum "$OUTNAME" > "$OUTNAME.sha256"
    echo
    echo "Done: $ROOT/$OUTNAME"
    echo "Write it to a USB stick with Ventoy, balenaEtcher or:"
    echo "  sudo dd if=$OUTNAME of=/dev/sdX bs=4M status=progress oflag=sync"
else
    echo "Build failed - see build.log" >&2
    exit 1
fi
