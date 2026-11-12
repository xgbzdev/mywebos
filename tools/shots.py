#!/usr/bin/env python3
"""Drive a QEMU VM through its monitor socket and take screenshots."""
import socket, subprocess, sys, time

MON = "/tmp/qemu-mon"
OUT = sys.argv[1] if len(sys.argv) > 1 else "shots"

def hmp(cmd):
    s = socket.socket(socket.AF_UNIX); s.connect(MON); s.settimeout(5)
    try:
        s.recv(4096)
    except Exception:
        pass
    s.sendall((cmd + "\n").encode()); time.sleep(0.4)
    try:
        s.recv(65536)
    except Exception:
        pass
    s.close()

KEYS = {" ": "spc", ".": "dot", "-": "minus", "/": "slash", ":": "shift-semicolon"}
def key(k, wait=0.3):
    hmp("sendkey " + k); time.sleep(wait)
def type_text(t):
    for ch in t:
        key(KEYS.get(ch, ("shift-" + ch.lower()) if ch.isupper() else ch), 0.15)

n = [0]
def shot(name, wait=0):
    time.sleep(wait)
    n[0] += 1
    ppm = "/tmp/s.ppm"; png = "%s/%02d-%s.png" % (OUT, n[0], name)
    hmp("screendump " + ppm); time.sleep(1.5)
    subprocess.call(["convert", ppm, png]); print("saved", png, flush=True)

def launch(query, name, wait):
    key("meta_l", 2)                       # Start menu
    type_text(query); time.sleep(2)
    key("ret"); shot(name, wait)

subprocess.call(["mkdir", "-p", OUT])
shot("boot-menu", 8)
key("ret")                                 # start "Live system"
shot("welcome", 150)                       # live desktop + welcome wizard
key("right", 3)                            # select "Italiano" -> wizard switches language
shot("welcome-italiano", 3)
key("alt-f4", 3)                           # close wizard
key("meta_l"); shot("start-menu", 4)
key("esc", 2)
launch("marketplace", "marketplace", 25)
key("alt-f4", 3)
launch("emul", "emulators", 20)
key("alt-f4", 3)
launch("firefox", "firefox", 60)
key("alt-f4", 3)
key("ctrl-alt-t", 8)
type_text("which unsquashfs rsync grub-install grub-mkconfig mkfs.vfat os-prober; ls /usr/share/dict; find /run/live/medium/pool -name \"grub-pc_*\""); key("ret"); shot("memory", 5)
