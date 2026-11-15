#!/usr/bin/env python3
"""Boot the slim 32-bit ISO in QEMU with 512 MB RAM and take screenshots."""
import socket, subprocess, sys, time

MON = "/tmp/qemu-mon"
OUT = sys.argv[1] if len(sys.argv) > 1 else "shots"

def hmp(cmd):
    s = socket.socket(socket.AF_UNIX); s.connect(MON); s.settimeout(5)
    try: s.recv(4096)
    except Exception: pass
    s.sendall((cmd + "\n").encode()); time.sleep(0.4)
    try: s.recv(65536)
    except Exception: pass
    s.close()

KEYS = {" ": "spc", ".": "dot", "-": "minus", "/": "slash", ":": "shift-semicolon", ";": "semicolon",
        "|": "shift-backslash", "_": "shift-minus", "*": "shift-8", '"': "shift-apostrophe", "'": "apostrophe",
        "~": "shift-grave_accent", ">": "shift-dot", "<": "shift-comma", "&": "shift-7", "(": "shift-9",
        ")": "shift-0", "[": "bracket_left", "]": "bracket_right", "{": "shift-bracket_left",
        "}": "shift-bracket_right", ",": "comma", "=": "equal", "+": "shift-equal", "$": "shift-4"}
def key(k, wait=0.3): hmp("sendkey " + k); time.sleep(wait)
def type_text(t):
    for ch in t:
        key(KEYS.get(ch, ("shift-" + ch.lower()) if ch.isupper() else ch), 0.12)

n = [0]
def shot(name, wait=0):
    time.sleep(wait); n[0] += 1
    hmp("screendump /tmp/s.ppm"); time.sleep(1.5)
    subprocess.call(["convert", "/tmp/s.ppm", "%s/%02d-%s.png" % (OUT, n[0], name)])
    print("saved", name, flush=True)

subprocess.call(["mkdir", "-p", OUT])
shot("boot-menu", 8)
key("tab", 1)                   # edit the boot line: switch on the memory logger
type_text(" b2l.memlog")
key("ret")
shot("splash", 25)
shot("welcome", 200)            # 512 MB + emulated disk: give it time
key("alt-f4", 6)                # close the welcome wizard (never closes the home screen)
shot("home", 10)
key("alt-f4", 4)                # pressing it on the home screen must do nothing
shot("home-after-altf4", 2)

# 1. a Firefox OS app inside the home screen
type_text("firecloud"); shot("search", 2)
key("ret", 30)
shot("firecloud-in-home", 2)

# 2. Start button (Super key) -> home, app keeps running (card view button)
key("meta_l", 6)
shot("home-with-app-running", 2)

# 3. a second app, then the card view
type_text("checklist"); key("ret", 20)
shot("checklist-in-home", 2)

# 4. memory with two apps open
key("ctrl-alt-t", 30)
shot("terminal-open", 1)
type_text("clear; free -m; ps -eo rss,comm --sort=-rss | head -n 9"); key("ret", 4)
shot("memory-two-apps", 1)

# 5. crash test: kill the home screen hard, it must come back on its own
type_text("pkill -9 -f -- '--class B2LHome'"); key("ret", 2)
shot("home-killed", 1)
key("meta_l", 40)
shot("home-after-crash", 2)
