/* B2L home screen: app grid, folders, dock, search. Talks to b2l-launcherd. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  var T = {
    en: { wallpaper: "Change wallpaper", wpTitle: "Wallpaper", fromFiles: "From my files…", badImage: "This image can't be used.",
          openApps: "Open apps", noApps: "No open apps", search: "Search apps or the web", newFolder: "New folder", folder: "Folder", addTo: "Move to “%s”",
          outOfFolder: "Move out of folder", toDock: "Add to dock", fromDock: "Remove from dock",
          uninstall: "Uninstall", uninstallQ: "Uninstall “%s”?", rename: "Rename folder", delFolder: "Remove folder",
          cancel: "Cancel", dockFull: "The dock is full (max 6).", cantOpen: "Couldn't open “%s”." },
    it: { wallpaper: "Cambia sfondo", wpTitle: "Sfondo", fromFiles: "Dai miei file…", badImage: "Questa immagine non può essere usata.",
          openApps: "App aperte", noApps: "Nessuna app aperta", search: "Cerca app o nel web", newFolder: "Nuova cartella", folder: "Cartella", addTo: "Sposta in “%s”",
          outOfFolder: "Togli dalla cartella", toDock: "Aggiungi al dock", fromDock: "Togli dal dock",
          uninstall: "Disinstalla", uninstallQ: "Disinstallare “%s”?", rename: "Rinomina cartella", delFolder: "Rimuovi cartella",
          cancel: "Annulla", dockFull: "Il dock è pieno (max 6).", cantOpen: "Impossibile aprire “%s”." },
    el: { wallpaper: "Αλλαγή ταπετσαρίας", wpTitle: "Ταπετσαρία", fromFiles: "Από τα αρχεία μου…", badImage: "Αυτή η εικόνα δεν μπορεί να χρησιμοποιηθεί.",
          openApps: "Ανοιχτές εφαρμογές", noApps: "Καμία ανοιχτή εφαρμογή", search: "Αναζήτηση εφαρμογών ή στο web", newFolder: "Νέος φάκελος", folder: "Φάκελος", addTo: "Μετακίνηση στο «%s»",
          outOfFolder: "Έξω από τον φάκελο", toDock: "Προσθήκη στο dock", fromDock: "Αφαίρεση από το dock",
          uninstall: "Απεγκατάσταση", uninstallQ: "Απεγκατάσταση του «%s»;", rename: "Μετονομασία φακέλου", delFolder: "Αφαίρεση φακέλου",
          cancel: "Ακύρωση", dockFull: "Το dock είναι γεμάτο (έως 6).", cantOpen: "Δεν ήταν δυνατό να ανοίξει το «%s»." },
    es: { wallpaper: "Cambiar fondo", wpTitle: "Fondo de pantalla", fromFiles: "De mis archivos…", badImage: "No se puede usar esta imagen.",
          openApps: "Apps abiertas", noApps: "No hay apps abiertas", search: "Busca apps o en la web", newFolder: "Nueva carpeta", folder: "Carpeta", addTo: "Mover a “%s”",
          outOfFolder: "Sacar de la carpeta", toDock: "Añadir al dock", fromDock: "Quitar del dock",
          uninstall: "Desinstalar", uninstallQ: "¿Desinstalar “%s”?", rename: "Renombrar carpeta", delFolder: "Quitar carpeta",
          cancel: "Cancelar", dockFull: "El dock está lleno (máx. 6).", cantOpen: "No se pudo abrir “%s”." },
    fr: { wallpaper: "Changer le fond d'écran", wpTitle: "Fond d'écran", fromFiles: "Depuis mes fichiers…", badImage: "Impossible d'utiliser cette image.",
          openApps: "Applis ouvertes", noApps: "Aucune appli ouverte", search: "Rechercher des applis ou sur le web", newFolder: "Nouveau dossier", folder: "Dossier", addTo: "Déplacer dans « %s »",
          outOfFolder: "Sortir du dossier", toDock: "Ajouter au dock", fromDock: "Retirer du dock",
          uninstall: "Désinstaller", uninstallQ: "Désinstaller « %s » ?", rename: "Renommer le dossier", delFolder: "Supprimer le dossier",
          cancel: "Annuler", dockFull: "Le dock est plein (6 max).", cantOpen: "Impossible d'ouvrir « %s »." },
    de: { wallpaper: "Hintergrund ändern", wpTitle: "Hintergrund", fromFiles: "Aus meinen Dateien…", badImage: "Dieses Bild kann nicht verwendet werden.",
          openApps: "Offene Apps", noApps: "Keine offenen Apps", search: "Apps oder Web durchsuchen", newFolder: "Neuer Ordner", folder: "Ordner", addTo: "In „%s“ verschieben",
          outOfFolder: "Aus dem Ordner nehmen", toDock: "Zum Dock hinzufügen", fromDock: "Aus dem Dock entfernen",
          uninstall: "Deinstallieren", uninstallQ: "„%s“ deinstallieren?", rename: "Ordner umbenennen", delFolder: "Ordner entfernen",
          cancel: "Abbrechen", dockFull: "Das Dock ist voll (max. 6).", cantOpen: "„%s“ konnte nicht geöffnet werden." },
    pt: { wallpaper: "Mudar papel de parede", wpTitle: "Papel de parede", fromFiles: "Dos meus arquivos…", badImage: "Esta imagem não pode ser usada.",
          openApps: "Apps abertas", noApps: "Nenhuma app aberta", search: "Pesquisar apps ou na web", newFolder: "Nova pasta", folder: "Pasta", addTo: "Mover para “%s”",
          outOfFolder: "Tirar da pasta", toDock: "Adicionar à dock", fromDock: "Remover da dock",
          uninstall: "Desinstalar", uninstallQ: "Desinstalar “%s”?", rename: "Mudar nome da pasta", delFolder: "Remover pasta",
          cancel: "Cancelar", dockFull: "A dock está cheia (máx. 6).", cantOpen: "Não foi possível abrir “%s”." },
    pl: { wallpaper: "Zmień tapetę", wpTitle: "Tapeta", fromFiles: "Z moich plików…", badImage: "Nie można użyć tego obrazu.",
          openApps: "Otwarte aplikacje", noApps: "Brak otwartych aplikacji", search: "Szukaj aplikacji lub w sieci", newFolder: "Nowy folder", folder: "Folder", addTo: "Przenieś do „%s”",
          outOfFolder: "Wyjmij z folderu", toDock: "Dodaj do docka", fromDock: "Usuń z docka",
          uninstall: "Odinstaluj", uninstallQ: "Odinstalować „%s”?", rename: "Zmień nazwę folderu", delFolder: "Usuń folder",
          cancel: "Anuluj", dockFull: "Dock jest pełny (maks. 6).", cantOpen: "Nie można otworzyć „%s”." }
  };
  var S = T[LANG] || T.en;
  function t(k, a) { return (S[k] || T.en[k]).replace("%s", a || ""); }

  var apps = {}, layout = { dock: [], items: [], folders: {} }, openFolder = null;

  /* ---------- server ---------- */
  function api(method, path, body, cb) {
    var x = new XMLHttpRequest();
    x.open(method, path, true);
    if (body) { x.setRequestHeader("Content-Type", "application/json"); body.token = B2L_TOKEN; }
    x.onload = function () { var d = null; try { d = JSON.parse(x.responseText); } catch (e) {} if (cb) { cb(x.status, d); } };
    x.onerror = function () { if (cb) { cb(0, null); } };
    x.send(body ? JSON.stringify(body) : null);
  }
  function saveLayout() { api("POST", "/api/layout", { layout: layout }); }

  var lastKey = "";
  function load() {
    api("GET", "/api/apps", null, function (st, list) {
      if (!list) { setTimeout(load, 1500); return; }
      api("GET", "/api/layout", null, function (s2, lay) {
        /* nothing changed: keep what is on screen (no flicker when coming back) */
        var key = JSON.stringify([list, lay]);
        if (key === lastKey) { return; }
        lastKey = key;
        apps = {};
        list.forEach(function (a) { apps[a.id] = a; });
        layout = lay || layout; normalise(); render();
      });
    });
  }
  /* Keep the layout in step with what is installed: new apps appear at the end. */
  function normalise() {
    var used = {};
    Object.keys(layout.folders).forEach(function (fid) {
      var f = layout.folders[fid];
      f.apps = f.apps.filter(function (id) { return apps[id] && !used[id] && (used[id] = 1); });
    });
    layout.items = layout.items.filter(function (id) {
      if (id.indexOf("folder-") === 0) { return !!layout.folders[id]; }
      return apps[id] && !used[id] && (used[id] = 1);
    });
    Object.keys(layout.folders).forEach(function (fid) {
      if (layout.items.indexOf(fid) < 0) { layout.items.push(fid); }
    });
    var fresh = Object.keys(apps).filter(function (id) { return !used[id]; });
    fresh.sort(function (a, b) {
      if (a === "fxos-install") { return -1; } if (b === "fxos-install") { return 1; }
      return apps[a].name.localeCompare(apps[b].name);
    });
    layout.items = layout.items.concat(fresh);
    layout.dock = layout.dock.filter(function (id) { return apps[id]; });
  }

  /* ---------- drawing ---------- */
  function iconUrl(id) { return "/api/icon?id=" + encodeURIComponent(id); }
  function appTile(id, where) {
    var a = apps[id], d = document.createElement("div");
    d.className = "tile"; d.title = a.name;
    d.innerHTML = '<img alt=""><span></span>';
    d.querySelector("img").src = iconUrl(id);
    d.querySelector("span").textContent = a.name;
    d.onclick = function () { open(id); };
    d.oncontextmenu = function (e) { e.preventDefault(); appMenu(id, where); };
    longPress(d, function () { appMenu(id, where); });
    keys(d, function () { appMenu(id, where); });
    d.draggable = where !== "dock";
    d.ondragstart = function (e) { e.dataTransfer.setData("text/plain", id); };
    d.ondragover = function (e) { e.preventDefault(); d.className = "tile drop"; };
    d.ondragleave = function () { d.className = "tile"; };
    d.ondrop = function (e) {
      e.preventDefault(); d.className = "tile";
      var from = e.dataTransfer.getData("text/plain");
      if (from && from !== id && apps[from] && where === "grid") { makeFolder([id, from]); }
    };
    return d;
  }
  function folderTile(fid) {
    var f = layout.folders[fid], d = document.createElement("div");
    d.className = "tile";
    var box = document.createElement("div"); box.className = "fbox";
    f.apps.slice(0, 4).forEach(function (id) { var i = document.createElement("img"); i.src = iconUrl(id); box.appendChild(i); });
    var s = document.createElement("span"); s.textContent = f.name || t("folder");
    d.appendChild(box); d.appendChild(s);
    d.onclick = function () { showFolder(fid); };
    d.oncontextmenu = function (e) { e.preventDefault(); folderMenu(fid); };
    longPress(d, function () { folderMenu(fid); });
    keys(d, function () { folderMenu(fid); });
    d.ondragover = function (e) { e.preventDefault(); d.className = "tile drop"; };
    d.ondragleave = function () { d.className = "tile"; };
    d.ondrop = function (e) {
      e.preventDefault(); d.className = "tile";
      var from = e.dataTransfer.getData("text/plain");
      if (from && apps[from]) { moveToFolder(from, fid); }
    };
    return d;
  }
  function render() {
    var q = $("search").value.trim().toLowerCase(), g = $("grid"); g.innerHTML = "";
    if (q) {
      Object.keys(apps).filter(function (id) {
        return (apps[id].name + " " + apps[id].keywords).toLowerCase().indexOf(q) >= 0;
      }).sort(function (a, b) { return apps[a].name.localeCompare(apps[b].name); })
        .forEach(function (id) { g.appendChild(appTile(id, "search")); });
    } else {
      layout.items.forEach(function (id) {
        g.appendChild(id.indexOf("folder-") === 0 ? folderTile(id) : appTile(id, "grid"));
      });
    }
    var dk = $("dock"); dk.innerHTML = "";
    layout.dock.forEach(function (id) { dk.appendChild(appTile(id, "dock")); });
    if (openFolder) { drawFolder(); }
  }

  /* ---------- opening apps ---------- */
  var running = [], current = null;          /* Firefox OS apps open inside the home screen */
  function open(id) {
    var a = apps[id];
    if (!a) { return; }
    closeOverlays();
    if (a.kind === "fxos" && /^http:\/\/[a-z0-9-]+\.localhost:8090\//.test(a.url)) { showApp(id); return; }
    if (a.url) {                                /* websites and hosted apps: in the Firefox browser */
      api("POST", "/api/browse", { url: a.url }, function (st) { if (st !== 200) { toast(t("cantOpen", a.name)); } });
      return;
    }
    api("POST", "/api/launch", { id: id }, function (st) { if (st !== 200) { toast(t("cantOpen", a.name)); } });
  }
  function frameOf(id) { return document.querySelector('iframe[data-app="' + id + '"]'); }
  function showApp(id) {
    var a = apps[id], f = frameOf(id);
    if (!f) {
      f = document.createElement("iframe");
      f.setAttribute("data-app", id);
      /* each app keeps its own origin (<id>.localhost) and cannot touch the home screen */
      f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-modals allow-downloads");
      f.setAttribute("allow", "geolocation; autoplay; fullscreen; clipboard-write");
      f.className = a.portrait ? "phone" : "full";
      f.src = a.url;
      $("frames").appendChild(f);
      running.push(id);
    }
    Array.prototype.forEach.call($("frames").children, function (x) { x.style.visibility = x === f ? "visible" : "hidden"; });
    current = id;
    $("app-title").textContent = a.name;
    $("applayer").classList.remove("hidden");
    updateCardsBtn();
    try { f.focus(); } catch (e) {}
  }
  function goHome() {
    $("applayer").classList.add("hidden"); $("cards").classList.add("hidden");
    current = null; closeOverlays(); updateCardsBtn(); $("search").focus();
  }
  function closeApp(id) {
    var f = frameOf(id);
    if (f) { f.src = "about:blank"; f.parentNode.removeChild(f); }  /* frees its memory */
    running = running.filter(function (x) { return x !== id; });
    if (current === id) { goHome(); }
    updateCardsBtn();
  }
  function updateCardsBtn() {
    var b = $("cards-btn");
    b.textContent = "❐ " + running.length;
    b.classList.toggle("hidden", running.length === 0);
  }
  function showCards() {
    var list = $("card-list"); list.innerHTML = "";
    $("cards-title").textContent = running.length ? t("openApps") : t("noApps");
    running.forEach(function (id) {
      var c = document.createElement("div"); c.className = "card";
      c.innerHTML = '<button class="x" aria-label="Close">×</button><img alt=""><span></span>';
      c.querySelector("img").src = iconUrl(id);
      c.querySelector("span").textContent = apps[id] ? apps[id].name : id;
      c.onclick = function () { $("cards").classList.add("hidden"); showApp(id); };
      c.querySelector(".x").onclick = function (e) { e.stopPropagation(); closeApp(id); showCards(); };
      list.appendChild(c);
    });
    $("cards").classList.remove("hidden");
  }
  $("app-home").onclick = goHome;
  $("app-close").onclick = function () { if (current) { closeApp(current); } };
  $("app-cards").onclick = showCards;
  $("cards-btn").onclick = showCards;
  $("cards").onclick = function (e) { if (e.target === this) { this.classList.add("hidden"); } };

  /* Start button / Super key (sent by the launcher service) */
  /* links / downloads from apps on the home screen open in the Firefox browser */
  window.addEventListener("message", function (e) {
    if (!/^http:\/\/[a-z0-9-]+\.localhost:8090$/.test(e.origin) || !e.data || typeof e.data.b2lOpen !== "string") { return; }
    api("POST", "/api/browse", { url: e.data.b2lOpen }, function () {});
  });

  if (window.EventSource) {
    var es = new EventSource("/api/events");
    es.addEventListener("home", function () { goHome(); load(); });
    es.addEventListener("open", function (e) {
      var go = function () { if (apps[e.data]) { open(e.data); } };
      if (apps[e.data]) { go(); } else { lastKey = ""; load(); setTimeout(go, 1500); }
    });
  }

  /* ---------- folders ---------- */
  function newId() { return "folder-" + Math.random().toString(36).slice(2, 10); }
  function removeEverywhere(id) {
    layout.items = layout.items.filter(function (x) { return x !== id; });
    Object.keys(layout.folders).forEach(function (fid) {
      layout.folders[fid].apps = layout.folders[fid].apps.filter(function (x) { return x !== id; });
    });
  }
  function makeFolder(ids) {
    var fid = newId(), pos = layout.items.indexOf(ids[0]);
    ids.forEach(removeEverywhere);
    layout.folders[fid] = { name: t("newFolder"), apps: ids };
    layout.items.splice(pos < 0 ? layout.items.length : pos, 0, fid);
    saveLayout(); render(); showFolder(fid, true);
  }
  function moveToFolder(id, fid) {
    removeEverywhere(id); layout.folders[fid].apps.push(id); cleanup(); saveLayout(); render();
  }
  function moveOut(id) {
    var fid = openFolder || Object.keys(layout.folders).filter(function (f) { return layout.folders[f].apps.indexOf(id) >= 0; })[0];
    removeEverywhere(id);
    var pos = layout.items.indexOf(fid);
    layout.items.splice(pos + 1, 0, id);
    cleanup(); saveLayout(); render();
  }
  /* A folder with one app left turns back into that app; empty folders disappear. */
  function cleanup() {
    Object.keys(layout.folders).forEach(function (fid) {
      var f = layout.folders[fid];
      if (f.apps.length <= 1) {
        var pos = layout.items.indexOf(fid);
        layout.items.splice(pos, 1);
        if (f.apps.length === 1) { layout.items.splice(pos, 0, f.apps[0]); }
        delete layout.folders[fid];
        if (openFolder === fid) { closeOverlays(); }
      }
    });
  }
  function showFolder(fid, rename) {
    openFolder = fid; drawFolder();
    $("folder").classList.remove("hidden");
    if (rename) { $("folder-name").focus(); $("folder-name").select(); }
  }
  function drawFolder() {
    var f = layout.folders[openFolder];
    if (!f) { closeOverlays(); return; }
    $("folder-name").value = f.name;
    var g = $("folder-grid"); g.innerHTML = "";
    f.apps.forEach(function (id) { g.appendChild(appTile(id, "folder")); });
  }
  $("folder-name").onchange = function () {
    if (openFolder && layout.folders[openFolder]) {
      layout.folders[openFolder].name = this.value.trim() || t("folder"); saveLayout(); render();
    }
  };
  $("folder-name").onkeydown = function (e) { if (e.key === "Enter") { this.blur(); } };
  $("folder").onclick = function (e) { if (e.target === this) { $("folder-name").onchange(); closeOverlays(); } };

  /* ---------- menus ---------- */
  function sheet(title, buttons) {
    $("menu-title").textContent = title;
    var box = $("menu-buttons"); box.innerHTML = "";
    buttons.concat([[t("cancel"), function () {}]]).forEach(function (b) {
      var el = document.createElement("button");
      el.textContent = b[0]; if (b[2]) { el.className = b[2]; }
      el.onclick = function () { $("menu").classList.add("hidden"); b[1](); };
      box.appendChild(el);
    });
    $("menu").classList.remove("hidden");
    box.firstChild.focus();
  }
  function appMenu(id, where) {
    var a = apps[id], b = [];
    if (where === "grid") {
      b.push([t("newFolder"), function () { makeFolder([id]); }]);
      Object.keys(layout.folders).forEach(function (fid) {
        b.push([t("addTo", layout.folders[fid].name), function () { moveToFolder(id, fid); }]);
      });
    }
    if (where === "folder") { b.push([t("outOfFolder"), function () { moveOut(id); }]); }
    if (layout.dock.indexOf(id) >= 0) {
      b.push([t("fromDock"), function () { layout.dock = layout.dock.filter(function (x) { return x !== id; }); saveLayout(); render(); }]);
    } else {
      b.push([t("toDock"), function () {
        if (layout.dock.length >= 6) { toast(t("dockFull")); return; }
        layout.dock.push(id); saveLayout(); render();
      }]);
    }
    if (a.removable) {
      b.push([t("uninstall"), function () {
        sheet(t("uninstallQ", a.name), [[t("uninstall"), function () {
          closeApp(id);
          api("POST", "/api/uninstall", { id: id }, function () { removeEverywhere(id); cleanup(); saveLayout(); load(); });
        }, "danger"]]);
      }, "danger"]);
    }
    sheet(a.name, b);
  }
  function folderMenu(fid) {
    var f = layout.folders[fid];
    sheet(f.name, [
      [t("rename"), function () { showFolder(fid, true); }],
      [t("delFolder"), function () {
        var pos = layout.items.indexOf(fid);
        layout.items.splice.apply(layout.items, [pos, 1].concat(f.apps));
        delete layout.folders[fid]; saveLayout(); render();
      }, "danger"]
    ]);
  }
  /* keyboard: Tab between icons, Enter opens, Menu key / Shift+F10 shows the actions */
  function keys(el, menuFn) {
    el.tabIndex = 0;
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
      else if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) { e.preventDefault(); menuFn(); }
    });
  }
  function longPress(el, fn) {
    var timer;
    el.addEventListener("touchstart", function () { timer = setTimeout(fn, 600); });
    ["touchend", "touchmove", "touchcancel"].forEach(function (ev) { el.addEventListener(ev, function () { clearTimeout(timer); }); });
  }
  function closeOverlays() { openFolder = null; $("folder").classList.add("hidden"); $("menu").classList.add("hidden"); }
  $("menu").onclick = function (e) { if (e.target === this) { closeOverlays(); } };

  /* ---------- search ---------- */
  $("search").placeholder = t("search");
  $("search").oninput = render;
  $("search").onkeydown = function (e) {
    if (e.key === "Escape") { this.value = ""; render(); }
    if (e.key !== "Enter") { return; }
    var first = $("grid").querySelector(".tile");
    var q = this.value.trim();
    if (first && q) { first.click(); }
    else if (q) {
      var url = (/^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(q)) ? (/^https?:/.test(q) ? q : "https://" + q)
        : "https://duckduckgo.com/?q=" + encodeURIComponent(q);
      api("POST", "/api/browse", { url: url });
    }
    this.value = ""; render();
  };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (!$("cards").classList.contains("hidden")) { $("cards").classList.add("hidden"); } else { closeOverlays(); } }
    else if (!current && (document.activeElement === document.body || /tile/.test(document.activeElement.className)) && e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.altKey) { $("search").focus(); }
  });

  /* ---------- wallpaper ---------- */
  function setWallpaper(v) { document.body.style.backgroundImage = 'url("/api/wallpaper?v=' + v + '")'; }
  function showWallpapers() {
    api("GET", "/api/wallpapers", null, function (st, d) {
      if (!d) { return; }
      var box = $("wp-list"); box.innerHTML = "";
      var names = d.list.slice(); if (d.custom) { names.push("custom"); }
      names.forEach(function (n) {
        var b = document.createElement("button");
        b.className = "wp" + (n === d.current ? " on" : "");
        b.style.backgroundImage = 'url("/api/wallpaper-thumb?name=' + encodeURIComponent(n) + (n === "custom" ? "&v=" + d.v : "") + '")';
        b.setAttribute("aria-label", n);
        b.onclick = function () { pickWallpaper({ name: n }); };
        box.appendChild(b);
      });
      $("wp").classList.remove("hidden");
      (box.querySelector(".wp.on") || box.firstChild).focus();
    });
  }
  function pickWallpaper(body) {
    api("POST", "/api/wallpaper", body, function (st, d) {
      if (st !== 200 || !d) { toast(t("badImage")); return; }
      setWallpaper(d.v); $("wp").classList.add("hidden");
    });
  }
  $("wp-title").textContent = t("wpTitle");
  $("wp-files").textContent = t("fromFiles");
  $("wp-files").onclick = function () { $("wp-input").click(); };
  $("wp").onclick = function (e) { if (e.target === this) { this.classList.add("hidden"); } };
  $("wp-input").onchange = function () {
    var f = this.files && this.files[0]; this.value = "";
    if (!f) { return; }
    var url = URL.createObjectURL(f), img = new Image();
    img.onerror = function () { URL.revokeObjectURL(url); toast(t("badImage")); };
    img.onload = function () {
      /* shrink to the screen size so it stays light on 512 MB */
      var W = Math.max(screen.width, 800), H = Math.max(screen.height, 600);
      var k = Math.min(1, Math.max(W / img.width, H / img.height));
      var c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      pickWallpaper({ image: c.toDataURL("image/jpeg", 0.85) });
    };
    img.src = url;
  };
  api("GET", "/api/wallpapers", null, function (st, d) { if (d) { setWallpaper(d.v); } });

  /* the home screen is not a web page: no browser menu, no page source, no inspector */
  document.addEventListener("contextmenu", function (e) {
    if (e.defaultPrevented) { return; }
    e.preventDefault();
    if (!current && !e.target.closest(".overlay, .applayer")) { sheet(t("wpTitle"), [[t("wallpaper"), showWallpapers]]); }
  });
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase();
    if (e.key === "F12" || e.key === "F7" || e.key === "F6" ||
        ((e.ctrlKey || e.metaKey) && (e.shiftKey ? "ijckemrpo".indexOf(k) >= 0 && k : "uspofghbdjlkie".indexOf(k) >= 0 && k))) {
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  var tt;
  function toast(msg) { var el = $("toast"); el.textContent = msg; el.classList.remove("hidden"); clearTimeout(tt); tt = setTimeout(function () { el.classList.add("hidden"); }, 3000); }

  /* refresh when apps are installed/removed and when the home screen comes back */
  window.addEventListener("focus", load);
  setInterval(function () { if (!document.hidden) { load(); } }, 20000);
  load();
})();
