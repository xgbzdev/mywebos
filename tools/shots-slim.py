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
shot("welcome", 230)            # 512 MB + emulated disk: give it time
key("alt-f4", 4)                # close the welcome wizard
shot("home", 4)

# make a folder the way the home screen stores it, then come back home
key("ctrl-alt-t", 10)
type_text('python3 -c "import json,os;p=os.path.expanduser(\'~/.config/firefoxos/launcher.json\');'
          'd=json.load(open(p));d[\'folders\'][\'folder-tools\']={\'name\':\'Tools\','
          '\'apps\':[\'galculator\',\'org.xfce.mousepad\',\'xarchiver\',\'lxterminal\']};'
          'd[\'items\'].insert(0,\'folder-tools\');json.dump(d,open(p,\'w\'))"')
key("ret", 2)
type_text("free -m; ps -eo rss,comm --sort=-rss | head -n 8")
key("ret", 3)
shot("memory", 2)
key("meta_l", 6)                # Super = home (reloads layout on focus)
shot("home-folder", 4)
key("tab", 1); key("ret", 2)    # first icon = the folder
shot("folder-open", 3)
key("esc", 2)
type_text("firecloud"); shot("search", 2)
key("ret", 25)
shot("firecloud", 2)
key("meta_l", 4)
type_text("firefox"); key("ret", 40)
shot("firefox", 2)
key("ctrl-l", 1); type_text("about:memory"); key("ret", 8)
key("ctrl-alt-t", 8)
type_text("free -m"); key("ret", 2)
shot("memory-with-firefox", 2)
