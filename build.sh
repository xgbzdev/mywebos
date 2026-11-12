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

echo "==> Installing build tools (live-build, xorriso, squashfs)..."
apt-get update
apt-get install -y live-build debootstrap xorriso squashfs-tools \
    debian-archive-keyring ca-certificates

# Ubuntu's live-build is old; it still works for a Debian target but needs the keyring.
chmod +x auto/* config/hooks/normal/*.hook.chroot config/includes.chroot/usr/local/bin/*

echo "==> Cleaning previous build..."
lb clean --purge || true

echo "==> Configuring..."
lb config

echo "==> Branding the boot menu as Firefox OS..."
if [ -d /usr/share/live/build/bootloaders ]; then
    rm -rf config/bootloaders
    cp -r /usr/share/live/build/bootloaders config/bootloaders
    grep -rlI "Debian" config/bootloaders | xargs -r sed -i 's#Debian GNU/Linux#Firefox OS#g; s#Debian#Firefox OS#g'
    find config/bootloaders -name 'splash.svg*' -exec cp branding/splash.svg {} \;
    find config/bootloaders -name 'splash.png' -exec cp branding/splash.png {} \;
    grep -rn "Firefox OS" config/bootloaders | head -5 || true
fi

echo "==> Building (this takes 20-60 minutes)..."
lb build

ISO=$(ls -1 live-image-amd64.hybrid.iso 2>/dev/null || true)
if [ -n "$ISO" ]; then
    mv "$ISO" firefoxos-amd64.iso
    sha256sum firefoxos-amd64.iso > firefoxos-amd64.iso.sha256
    echo
    echo "Done: $(pwd)/firefoxos-amd64.iso"
    echo "Test it:  qemu-system-x86_64 -enable-kvm -m 4096 -cdrom firefoxos-amd64.iso"
    echo "Or write it to a USB stick with Ventoy, balenaEtcher or:"
    echo "  sudo dd if=firefoxos-amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync"
else
    echo "Build failed - see build.log" >&2
    exit 1
fi
