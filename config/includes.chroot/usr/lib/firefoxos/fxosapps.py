"""Firefox OS app support: install and run apps described by manifest.webapp.

Packaged apps: a .zip (or folder) with manifest.webapp at its root.
Hosted apps:   a URL pointing to a manifest.webapp on a web server.

Apps are installed per user in ~/.local/share/firefoxos/apps/<id>/ and get a
launcher (.desktop) so they show on the home screen like any other app.
"""
import json
import os
import re
import shutil
import tempfile
import urllib.parse
import urllib.request
import zipfile

HOME = os.path.expanduser("~")
APPS = os.path.join(HOME, ".local/share/firefoxos/apps")
DESKTOP_DIR = os.path.join(HOME, ".local/share/applications")
SHIM_SRC = "/usr/lib/firefoxos/fxos-shim.js"
SHIM_NAME = "fxos-shim.js"


class AppError(Exception):
    pass


def _slug(text):
    s = re.sub(r"[^a-z0-9]+", "-", (text or "app").lower()).strip("-")
    return s or "app"


def _read_manifest(path):
    try:
        with open(path, encoding="utf-8-sig") as f:
            return json.load(f)
    except (OSError, ValueError) as e:
        raise AppError("manifest.webapp is missing or not valid JSON (%s)" % e)


def _best_icon(manifest):
    icons = manifest.get("icons") or {}
    best, size = None, -1
    for k, v in icons.items():
        try:
            n = int(re.sub(r"\D", "", str(k)) or 0)
        except ValueError:
            n = 0
        if n > size:
            best, size = v, n
    return best


def _localized_names(manifest):
    out = {}
    for loc, data in (manifest.get("locales") or {}).items():
        if isinstance(data, dict) and data.get("name"):
            out[loc.split("-")[0]] = data["name"]
    return out


def _inject_shim(html_path, package_root):
    """Add the compatibility script to the app's start page."""
    try:
        with open(html_path, encoding="utf-8", errors="replace") as f:
            html = f.read()
    except OSError:
        return
    if SHIM_NAME in html:
        return
    shutil.copy(SHIM_SRC if os.path.exists(SHIM_SRC) else
                os.path.join(os.path.dirname(__file__), SHIM_NAME),
                os.path.join(package_root, SHIM_NAME))
    rel = os.path.relpath(os.path.join(package_root, SHIM_NAME), os.path.dirname(html_path))
    tag = '<script src="%s"></script>' % rel.replace(os.sep, "/")
    m = re.search(r"<head[^>]*>", html, re.I)
    if m:
        html = html[:m.end()] + "\n" + tag + html[m.end():]
    else:
        html = tag + "\n" + html
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)


def _write_launcher(app_id, meta):
    os.makedirs(DESKTOP_DIR, exist_ok=True)
    lines = ["[Desktop Entry]", "Type=Application",
             "Name=%s" % meta["name"],
             "Comment=%s" % meta.get("description", "").replace("\n", " ")[:200],
             "Exec=fxos-apprun %s" % app_id,
             "Icon=%s" % (meta.get("icon_file") or "firefoxos"),
             "Categories=FirefoxOSApp;",
             "StartupWMClass=fxos-app-%s" % app_id,
             "X-FirefoxOS-App=%s" % app_id]
    for loc, name in sorted(meta.get("names", {}).items()):
        lines.append("Name[%s]=%s" % (loc, name))
    with open(os.path.join(DESKTOP_DIR, "fxos-app-%s.desktop" % app_id), "w") as f:
        f.write("\n".join(lines) + "\n")


def _save_meta(app_dir, meta):
    with open(os.path.join(app_dir, "app.json"), "w") as f:
        json.dump(meta, f, indent=1)


def _unique_id(name, origin=""):
    base = _slug(name)
    if origin:
        base = _slug(urllib.parse.urlparse(origin).netloc.split(":")[0] + "-" + name)
    return base


def install_packaged(path):
    """Install from a .zip package, a folder, or a manifest.webapp inside a folder."""
    path = os.path.abspath(os.path.expanduser(path))
    tmp = None
    if os.path.isfile(path) and path.endswith(".webapp"):
        src = os.path.dirname(path)
    elif os.path.isdir(path):
        src = path
    elif zipfile.is_zipfile(path):
        tmp = tempfile.mkdtemp(prefix="fxosapp-")
        with zipfile.ZipFile(path) as z:
            for n in z.namelist():                      # refuse path tricks
                if n.startswith("/") or ".." in n.split("/"):
                    raise AppError("unsafe file name in package: %s" % n)
            z.extractall(tmp)
        src = tmp
        # packages sometimes wrap everything in one top folder
        if not os.path.exists(os.path.join(src, "manifest.webapp")):
            subs = [d for d in os.listdir(src) if os.path.isdir(os.path.join(src, d))]
            if len(subs) == 1 and os.path.exists(os.path.join(src, subs[0], "manifest.webapp")):
                src = os.path.join(src, subs[0])
    else:
        raise AppError("not a Firefox OS app package (.zip with manifest.webapp)")
    try:
        manifest = _read_manifest(os.path.join(src, "manifest.webapp"))
        name = manifest.get("name") or "App"
        app_id = _unique_id(name)
        app_dir = os.path.join(APPS, app_id)
        pkg = os.path.join(app_dir, "package")
        shutil.rmtree(app_dir, ignore_errors=True)
        os.makedirs(app_dir)
        shutil.copytree(src, pkg)
        launch = (manifest.get("launch_path") or "/index.html").lstrip("/")
        start = os.path.join(pkg, launch)
        if not os.path.exists(start):
            raise AppError("launch_path '%s' not found in the package" % launch)
        _inject_shim(start, pkg)
        icon = _best_icon(manifest)
        icon_file = os.path.join(pkg, icon.lstrip("/")) if icon else None
        if icon_file and not os.path.exists(icon_file):
            icon_file = None
        meta = {"id": app_id, "type": "packaged", "name": name,
                "description": manifest.get("description", ""),
                "version": manifest.get("version", ""),
                "developer": (manifest.get("developer") or {}).get("name", ""),
                "launch_url": "file://" + urllib.parse.quote(start),
                "orientation": manifest.get("orientation", ""),
                "fullscreen": str(manifest.get("fullscreen", "")).lower() == "true",
                "icon_file": icon_file, "names": _localized_names(manifest),
                "manifest": manifest}
        _save_meta(app_dir, meta)
        _write_launcher(app_id, meta)
        return meta
    finally:
        if tmp:
            shutil.rmtree(tmp, ignore_errors=True)


def install_hosted(url, timeout=20):
    """Install a hosted app from the URL of its manifest.webapp."""
    if "://" not in url:
        url = "https://" + url
    req = urllib.request.Request(url, headers={"User-Agent": "FirefoxOS-AppInstaller"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            manifest = json.loads(r.read().decode("utf-8-sig"))
    except Exception as e:
        raise AppError("could not download the manifest: %s" % e)
    p = urllib.parse.urlparse(url)
    origin = "%s://%s" % (p.scheme, p.netloc)
    name = manifest.get("name") or p.netloc
    app_id = _unique_id(name, origin)
    app_dir = os.path.join(APPS, app_id)
    shutil.rmtree(app_dir, ignore_errors=True)
    os.makedirs(app_dir)
    icon_file = None
    icon = _best_icon(manifest)
    if icon:
        try:
            iurl = urllib.parse.urljoin(url, icon)
            ext = os.path.splitext(urllib.parse.urlparse(iurl).path)[1] or ".png"
            icon_file = os.path.join(app_dir, "icon" + ext)
            with urllib.request.urlopen(iurl, timeout=timeout) as r, open(icon_file, "wb") as f:
                f.write(r.read())
        except Exception:
            icon_file = None
    meta = {"id": app_id, "type": "hosted", "name": name,
            "description": manifest.get("description", ""),
            "version": manifest.get("version", ""),
            "developer": (manifest.get("developer") or {}).get("name", ""),
            "launch_url": urllib.parse.urljoin(origin + "/", (manifest.get("launch_path") or "/").lstrip("/")),
            "orientation": manifest.get("orientation", ""),
            "fullscreen": str(manifest.get("fullscreen", "")).lower() == "true",
            "icon_file": icon_file, "names": _localized_names(manifest),
            "manifest_url": url, "manifest": manifest}
    _save_meta(app_dir, meta)
    _write_launcher(app_id, meta)
    return meta


def install(source):
    if re.match(r"^https?://", source) or (not os.path.exists(os.path.expanduser(source))
                                            and "." in source and "/" in source):
        return install_hosted(source)
    return install_packaged(source)


def list_apps():
    out = []
    if os.path.isdir(APPS):
        for d in sorted(os.listdir(APPS)):
            try:
                with open(os.path.join(APPS, d, "app.json")) as f:
                    out.append(json.load(f))
            except (OSError, ValueError):
                pass
    return out


def get(app_id):
    with open(os.path.join(APPS, app_id, "app.json")) as f:
        return json.load(f)


def uninstall(app_id):
    shutil.rmtree(os.path.join(APPS, app_id), ignore_errors=True)
    try:
        os.remove(os.path.join(DESKTOP_DIR, "fxos-app-%s.desktop" % app_id))
    except OSError:
        pass
