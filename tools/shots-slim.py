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
key("ret")
shot("splash", 25)
shot("welcome", 200)            # 512 MB + emulated disk: give it time
key("alt-f4", 6)                # close the welcome wizard
shot("home", 15)

# 1. memory right after start-up (home screen open)
key("ctrl-alt-t", 35)
shot("terminal-open", 1)
type_text("clear; free -m; ps -eo rss,comm --sort=-rss | head -n 9"); key("ret", 4)
shot("memory-idle", 1)

# 2. a folder, stored the same way the home screen stores it
type_text('python3 -c "import json,os;p=os.path.expanduser(\'~/.config/firefoxos/launcher.json\');'
          'd=json.load(open(p));d[\'folders\'][\'folder-tools\']={\'name\':\'Tools\','
          '\'apps\':[\'galculator\',\'org.xfce.mousepad\',\'xarchiver\',\'lxterminal\']};'
          'd[\'items\'].insert(0,\'folder-tools\');json.dump(d,open(p,\'w\'))"')
key("ret", 2)
key("meta_l", 12)               # Super = home (reloads the layout when focused)
shot("home-folder", 2)
key("tab", 1); key("ret", 3)    # first icon = the folder
shot("folder-open", 2)
key("esc", 2)

# 3. a Firefox OS app (FireCloud) in the shared engine
type_text("firecloud"); shot("search", 2)
key("ret", 60)
shot("firecloud", 2)

# 4. memory with FireCloud open
key("ctrl-alt-t", 35)
type_text("clear; free -m; ps -eo rss,comm --sort=-rss | head -n 9"); key("ret", 4)
shot("memory-firecloud", 1)
