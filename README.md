# Firefox OS – personal edition (ISO build kit)

A Debian 13–based live Linux restyled as "Firefox OS", for personal use.
"Firefox" and "Firefox OS" are Mozilla trademarks, so don't distribute the ISO publicly
under this name. The logo in this kit is an original globe, not Mozilla's artwork.

## Build the ISO (one command)

You need a PC (or VM) running **Debian 12/13 or Ubuntu 22.04+**, x86_64, with
~25 GB free space and internet access.

```bash
unzip firefoxos-build.zip && cd firefoxos-build
sudo ./build.sh
```

After 20–60 minutes you get **`firefoxos-amd64.iso`** (≈2.5–3 GB) plus a `.sha256` file.

Test it in a VM:
```bash
qemu-system-x86_64 -enable-kvm -m 4096 -smp 2 -cdrom firefoxos-amd64.iso
```
Or write it to a USB stick (Ventoy, balenaEtcher, or `dd`) and boot from it. Works with UEFI and BIOS.

## What's inside

| Feature | How |
|---|---|
| **Try without installing** | Boots straight into a live "Try mode" desktop (nothing on the disk is changed). Live password: `live` |
| **Install** | "Install Firefox OS" desktop icon / button in the welcome wizard → Calamares graphical installer |
| **Multi-language** | Welcome wizard: English, Italiano, Ελληνικά, Español, Français, Deutsch, Português, Polski. All system locales are included, along with Firefox/Thunderbird language packs and spell checkers |
| **Firefox browser** | Firefox ESR, follows the system language |
| **Marketplace** | *Firefox OS apps* tab: web apps that open in their own window with their own icon. You can add any website as an app. *Linux apps* tab: search and install from Flathub. You can also open GNOME Software for Debian packages |
| **Emulators** | Runs Firefox OS **Phone** (320×480 … 720×1280) and **TV** (720p/1080p) using the B2G desktop runtime |
| **Desktop** | Bottom taskbar, Start menu on the Super key, window snapping, notification center, quick settings. Green wallpaper and orange accent like your mock-up |

## Emulators: one manual step

Mozilla stopped publishing B2G (Firefox OS) desktop builds around 2015–2016, and I can't
check which old archives still work on a 2026 system, so none is bundled. In the
Emulators app:

1. **Get runtimes…** opens `archive.mozilla.org/pub/b2g/`. Download a
   `b2g-*.linux-x86_64.tar.bz2` (or a Mulet `firefox-*.linux-x86_64.tar.bz2`), then use **Import runtime**.
2. Build a Gaia profile from https://github.com/mozilla-b2g/gaia:
   `make` → phone profile; `GAIA_DEVICE_TYPE=tv make` → TV profile.
   Import each `profile/` folder on the Phone and TV cards.
3. Press **Start**.

To ship them preinstalled, put the files in
`config/includes.chroot/opt/firefoxos-emulators/runtime/` and `…/profiles/phone|tv/`
before building.

## Customize

- Add or remove packages: `config/package-lists/firefoxos.list.chroot`
- Marketplace catalog: `config/includes.chroot/usr/share/firefoxos/marketplace/catalog.json`
- Wallpaper and logo: `config/includes.chroot/usr/share/firefoxos/`
- Panel, shortcuts and theme: `config/includes.chroot/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/`
- System tweaks: `config/hooks/normal/0100-firefoxos.hook.chroot`

Rebuild with `sudo ./build.sh`. It cleans up the previous build first.

## Troubleshooting

- **A package fails to download:** Debian sometimes renames packages. Remove that line
  from the package list and run again. The failing name is at the end of `build.log`.
- **Building on Ubuntu:** if `lb` complains, build inside a Debian container:
  `sudo docker run --privileged -it -v "$PWD":/w -w /w debian:trixie ./build.sh`
