/* FireCloud app UI (ES5 so it runs on Firefox OS 1.x/2.x phones and on B2L PCs). */
(function () {
  "use strict";
  var LS = window.localStorage;
  var $ = function (id) { return document.getElementById(id); };
  /* classList.toggle(name, force) only exists from Gecko 24; Firefox OS 1.1 is Gecko 18 */
  function setClass(el, name, on) { if (on) { el.classList.add(name); } else { el.classList.remove(name); } }
  var state = { tab: "photos", files: [], apps: [], devices: [], current: null, reportTimer: null, pollTimer: null };

  /* ---------- helpers ---------- */
  function show(view) {
    var vs = document.querySelectorAll(".view");
    for (var i = 0; i < vs.length; i++) { vs[i].classList.add("hidden"); }
    $(view).classList.remove("hidden");
  }
  var toastTimer;
  function toast(msg, ms) {
    var t = $("status-msg"); t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add("hidden"); }, ms || 3500);
  }
  function errText(err) {
    if (!err) { return ""; }
    if (err.message === "helper") { return _("helperDown"); }
    if (err.status === 429 || /rate limit/i.test(err.message)) { return _("tooMany"); }
    if (err.status === 413 || /quota|row-level|policy/i.test(err.message)) { return _("quotaFull"); }
    return _("netError", err.message);
  }
  function confirmBox(text, okLabel, danger, cb) {
    $("dialog-text").textContent = text;
    var ok = $("dialog-ok");
    ok.textContent = okLabel || "OK";
    ok.className = danger ? "danger" : "primary";
    $("dialog").classList.remove("hidden");
    function close(res) { $("dialog").classList.add("hidden"); ok.onclick = $("dialog-cancel").onclick = null; cb(res); }
    ok.onclick = function () { close(true); };
    $("dialog-cancel").onclick = function () { close(false); };
  }
  function fmtSize(n) {
    if (n < 1024) { return n + " B"; }
    if (n < 1048576) { return (n / 1024).toFixed(0) + " KB"; }
    return (n / 1048576).toFixed(1) + " MB";
  }
  function ago(iso) {
    if (!iso) { return ""; }
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 90) { return _("justNow"); }
    if (s < 5400) { return Math.round(s / 60) + " min"; }
    if (s < 129600) { return Math.round(s / 3600) + " h"; }
    return new Date(iso).toLocaleDateString();
  }
  function uid() { var u = Auth.user(); return u ? u.id : ""; }
  function deviceId() {
    var id = LS.getItem("fc_device_id");
    if (!id) {
      id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
      });
      LS.setItem("fc_device_id", id);
    }
    return id;
  }
  function deviceName() {
    return LS.getItem("fc_device_name") || _(FC_CONFIG.variant === "mobile" ? "phoneName" : "pcName");
  }

  /* ---------- languages ---------- */
  function initLanguages() {
    var sels = document.querySelectorAll(".lang-select");
    for (var i = 0; i < sels.length; i++) {
      fillLangSelect(sels[i]);
      sels[i].onchange = function () {
        setLang(this.value);
        var all = document.querySelectorAll(".lang-select");
        for (var j = 0; j < all.length; j++) { all[j].value = LANG; }
        if (!$("v-main").classList.contains("hidden")) {
          $("this-device-name").textContent = deviceName();
          switchTab(state.tab);                     // re-draws lists in the new language
        }
      };
    }
    document.documentElement.lang = LANG;
  }

  /* ---------- start ---------- */
  function start() {
    translatePage();
    if (!Net.configured()) { openSetup(); return; }
    if (!Auth.session()) { show("v-login"); return; }
    openMain();
  }

  function openSetup() {
    var s = Net.server();
    $("setup-url").value = s.url; $("setup-key").value = s.key;
    show("v-setup");
  }
  $("setup-save").onclick = function () {
    var url = $("setup-url").value.trim(), key = $("setup-key").value.trim();
    if (!/^https:\/\/.+/.test(url) || key.length < 20) { toast(_("netError", "URL / key")); return; }
    if (/service_role|sb_secret_/.test(key) || /"role"\s*:\s*"service_role"/.test(safeJwt(key))) {
      toast(_("keyHint"), 6000); return;
    }
    LS.setItem("fc_url", url); LS.setItem("fc_key", key);
    start();
  };
  function safeJwt(k) { try { return atob(k.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")); } catch (e) { return ""; } }

  /* ---------- login ---------- */
  /* signing in: any password (the server checks it); new accounts: at least 8 characters */
  function creds(isNew) {
    var e = $("login-email").value.trim(), p = $("login-pass").value;
    if (!/@/.test(e) || !p) { toast(_("needLogin")); return null; }
    if (isNew && p.length < 8) { toast(_("needFields")); return null; }
    return { e: e, p: p };
  }
  $("btn-login").onclick = function () {
    var c = creds(); if (!c) { return; }
    Net.helperAlive(function (ok) {
      if (!ok) { toast(_("helperDown"), 6000); return; }
      Auth.signIn(c.e, c.p, function (err) {
        if (err) { toast(err.status === 400 ? _("wrongLogin") : errText(err), 5000); return; }
        $("login-pass").value = ""; openMain();
      });
    });
  };
  $("btn-signup").onclick = function () {
    var c = creds(true); if (!c) { return; }
    Net.helperAlive(function (ok) {
      if (!ok) { toast(_("helperDown"), 6000); return; }
      Auth.signUp(c.e, c.p, function (err, s) {
        if (err) { toast(errText(err), 6000); return; }
        if (s) { openMain(); } else { toast(_("checkEmail"), 8000); }
      });
    });
  };

  /* ---------- main ---------- */
  function openMain() {
    show("v-main");
    $("this-device-name").textContent = deviceName();
    $("locate-toggle").checked = LS.getItem("fc_locate") === "1";
    switchTab(location.hash.slice(1) || "photos");
    startDeviceServices();
  }
  window.addEventListener("hashchange", function () {
    if (!$("v-main").classList.contains("hidden")) { switchTab(location.hash.slice(1) || "photos"); }
  });
  function switchTab(tab) {
    if (["photos", "apps", "find"].indexOf(tab) < 0) { tab = "photos"; }
    state.tab = tab;
    var links = document.querySelectorAll(".tabs a");
    for (var i = 0; i < links.length; i++) { setClass(links[i], "on", links[i].getAttribute("data-tab") === tab); }
    ["photos", "apps", "find"].forEach(function (t) { setClass($("t-" + t), "hidden", t !== tab); });
    var up = $("btn-upload");
    if (tab === "find") { up.textContent = _("refresh"); }
    else { up.textContent = _("upload"); }
    refresh();
  }
  function refresh() {
    Auth.ready(function (err) {
      if (err && err.message === "signed-out") { show("v-login"); return; }
      if (state.tab === "photos") { loadPhotos(); }
      else if (state.tab === "apps") { loadApps(); }
      else { loadDevices(); }
    });
  }

  /* ---------- photos & videos ---------- */
  function loadPhotos() {
    Files.list(uid() + "/photos", function (err, list) {
      if (err) { toast(errText(err)); return; }
      state.files = list;
      setClass($("photos-empty"), "hidden", list.length > 0);
      var paths = list.map(function (f) { return uid() + "/photos/" + f.name; });
      Files.signed(paths, function (e2, urls) {
        var grid = $("photo-grid"); grid.innerHTML = "";
        list.forEach(function (f, i) {
          var p = paths[i], isVid = /^video\//.test((f.metadata || {}).mimetype || "") || /\.(mp4|webm|3gp|ogv)$/i.test(f.name);
          var cell = document.createElement("div"); cell.className = "cell";
          var thumb = document.createElement("div");
          if (!isVid && urls[p]) { thumb.style.backgroundImage = "url(\"" + urls[p] + "\")"; }
          cell.appendChild(thumb);
          if (isVid) { var b = document.createElement("span"); b.className = "badge"; b.textContent = "video"; cell.appendChild(b); }
          cell.onclick = function () { openViewer(f, p, urls[p], isVid); };
          grid.appendChild(cell);
        });
      });
    });
    updateUsage();
  }
  function updateUsage() {
    Files.usage(function (err, used) {
      var q = FC_CONFIG.quotaBytes;
      $("usage-fill").style.width = Math.min(100, used / q * 100) + "%";
      $("usage-text").textContent = _("used", fmtSize(used), fmtSize(q));
    });
  }
  function openViewer(f, path, url, isVid) {
    state.current = { file: f, path: path, url: url };
    $("view-name").textContent = f.name.replace(/^\d+-/, "");
    var box = $("viewer-box"); box.innerHTML = "";
    var el = document.createElement(isVid ? "video" : "img");
    el.src = url; if (isVid) { el.controls = true; }
    box.appendChild(el);
    show("v-viewer");
  }
  $("view-back").onclick = function () { $("viewer-box").innerHTML = ""; show("v-main"); };
  $("view-download").onclick = function () { if (state.current) { window.open(state.current.url, "_blank"); } };
  $("view-delete").onclick = function () {
    var c = state.current; if (!c) { return; }
    confirmBox(_("deleteQ", c.file.name.replace(/^\d+-/, "")), _("delete"), true, function (yes) {
      if (!yes) { return; }
      Files.remove([c.path], function (err) {
        if (err) { toast(errText(err)); return; }
        $("viewer-box").innerHTML = ""; show("v-main"); loadPhotos();
      });
    });
  };

  /* Shrink big photos before upload (saves space and data on old phones). */
  function prepare(file, cb) {
    if (!/^image\/(jpeg|png|webp)/.test(file.type || "") || file.size < 400000 || !window.HTMLCanvasElement) { cb(file); return; }
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var max = 1600, w = img.width, h = img.height, k = Math.min(1, max / Math.max(w, h));
      var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      if (!c.toBlob) { cb(file); return; }
      c.toBlob(function (blob) { cb(blob && blob.size < file.size ? blob : file); }, "image/jpeg", 0.82);
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(file); };
    img.src = url;
  }
  function safeName(n) { return (n || "file").replace(/[^\w.\-]+/g, "_").slice(-80); }

  $("btn-upload").onclick = function () {
    if (state.tab === "find") { loadDevices(); reportLocation(); return; }
    if (FC_CONFIG.variant === "mobile" && window.MozActivity && state.tab === "photos") {
      var act = new MozActivity({ name: "pick", data: { type: ["image/*", "video/*"] } });
      act.onsuccess = function () {
        var r = act.result || {}, blob = r.blob;
        if (!blob) { return; }
        var ext = /video/.test(r.type || blob.type) ? ".3gp" : ".jpg";
        if (blob.type === "video/webm") { ext = ".webm"; } else if (blob.type === "video/mp4") { ext = ".mp4"; }
        uploadList([{ blob: blob, name: (r.name || ("photo" + ext)).split("/").pop() }]);
      };
      return;
    }
    var inp = $("file-input");
    inp.value = "";
    inp.accept = state.tab === "apps" ? ".zip,application/zip" : "image/*,video/*";
    inp.click();
  };
  $("file-input").onchange = function () {
    var picked = Array.prototype.slice.call(this.files || []);
    uploadList(picked.map(function (f) { return { blob: f, name: f.name }; }));
  };
  function uploadList(files) {
    var folder = state.tab === "apps" ? "/apps/" : "/photos/";
    (function next() {
      var item = files.shift(); if (!item) { refresh(); return; }
      var f = item.blob; f.fcName = item.name;
      prepare(f, function (blob) {
        if (blob.size > FC_CONFIG.maxFileBytes) { toast(_("tooBig", f.fcName), 5000); next(); return; }
        var name = (folder === "/apps/" ? "" : Date.now() + "-") + safeName(f.fcName);
        if (blob !== f && !/\.jpe?g$/i.test(name)) { name = name.replace(/\.\w+$/, "") + ".jpg"; }
        toast(_("uploading", f.fcName), 60000);
        Files.upload(uid() + folder + name, blob, function (ev) {
          if (ev.lengthComputable) { toast(_("uploading", f.fcName) + " " + Math.round(ev.loaded / ev.total * 100) + "%", 60000); }
        }, function (err) {
          toast(err ? errText(err) : _("uploaded"), err ? 6000 : 1500);
          next();
        });
      });
    })();
  }

  /* ---------- apps ---------- */
  function loadApps() {
    Files.list(uid() + "/apps", function (err, list) {
      if (err) { toast(errText(err)); return; }
      setClass($("apps-empty"), "hidden", list.length > 0);
      var paths = list.map(function (f) { return uid() + "/apps/" + f.name; });
      Files.signed(paths, function (e2, urls) {
        var ul = $("app-list"); ul.innerHTML = "";
        list.forEach(function (f, i) {
          var li = document.createElement("li");
          li.innerHTML = '<div class="txt"><b></b><small></small></div><div class="btncell"><button class="primary"></button><button></button></div>';
          li.querySelector("b").textContent = f.name.replace(/\.zip$/i, "");
          li.querySelector("small").textContent = fmtSize((f.metadata || {}).size || 0);
          var bt = li.querySelectorAll("button");
          bt[0].textContent = _("download");
          bt[0].onclick = function () { if (urls[paths[i]]) { window.open(urls[paths[i]], "_blank"); } };
          bt[1].textContent = "×";
          bt[1].onclick = function () {
            confirmBox(_("deleteQ", f.name), _("delete"), true, function (yes) {
              if (yes) { Files.remove([paths[i]], function (e3) { if (e3) { toast(errText(e3)); } loadApps(); }); }
            });
          };
          ul.appendChild(li);
        });
      });
    });
  }

  /* ---------- Find My Device ---------- */
  function startDeviceServices() {
    clearInterval(state.reportTimer); clearInterval(state.pollTimer);
    if (LS.getItem("fc_locate") === "1") {
      reportLocation();
      state.reportTimer = setInterval(reportLocation, 5 * 60 * 1000);
    }
    pollRing();
    state.pollTimer = setInterval(pollRing, 30 * 1000);
  }
  $("locate-toggle").onchange = function () {
    var on = this.checked;
    LS.setItem("fc_locate", on ? "1" : "0");
    Auth.ready(function () {
      if (on) { reportLocation(); }
      else { Devices.patch(deviceId(), { locate_enabled: false, lat: null, lon: null, accuracy: null }); }
      startDeviceServices();
      setTimeout(loadDevices, 1500);
    });
  };
  function reportLocation() {
    if (LS.getItem("fc_locate") !== "1") { return; }
    var row = { id: deviceId(), name: deviceName(), kind: FC_CONFIG.variant, locate_enabled: true,
                last_seen: new Date().toISOString() };
    if (!navigator.geolocation) { Devices.upsert(row); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      row.lat = pos.coords.latitude; row.lon = pos.coords.longitude; row.accuracy = Math.round(pos.coords.accuracy || 0);
      Auth.ready(function () { Devices.upsert(row, function () { if (state.tab === "find") { loadDevices(); } }); });
    }, function () {
      Auth.ready(function () { Devices.upsert(row); });
      if (state.tab === "find") { toast(_("noLocation"), 4000); }
    }, { enableHighAccuracy: true, timeout: 30000, maximumAge: 120000 });
  }
  function pollRing() {
    Auth.ready(function (err) {
      if (err) { return; }
      Devices.get(deviceId(), function (e2, d) {
        if (e2 || !d || !d.ring_requested) { return; }
        Devices.patch(deviceId(), { ring_requested: false });
        ring();
      });
    });
  }
  function ring() {
    toast(_("ringing"), 10000);
    if (navigator.vibrate) { navigator.vibrate([400, 200, 400, 200, 400]); }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { return; }
    var ctx = new AC(), t = ctx.currentTime;
    for (var i = 0; i < 6; i++) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = i % 2 ? 1320 : 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.5, t + i * 0.5); g.gain.setValueAtTime(0, t + i * 0.5 + 0.4);
      (o.start || o.noteOn).call(o, t + i * 0.5); (o.stop || o.noteOff).call(o, t + i * 0.5 + 0.45);
    }
  }
  function loadDevices() {
    Devices.all(function (err, list) {
      if (err) { toast(errText(err)); return; }
      state.devices = list || [];
      var ul = $("device-list"); ul.innerHTML = "";
      state.devices.forEach(function (d) {
        var li = document.createElement("li");
        li.innerHTML = '<div class="dot"><span></span></div><div class="txt"><b></b><small></small></div><div class="btncell one"><button></button></div>';
        var fresh = d.last_seen && (Date.now() - new Date(d.last_seen).getTime()) < 15 * 60000;
        li.querySelector(".dot").className = "dot" + (fresh ? " on" : "");
        li.querySelector("b").textContent = d.name + (d.id === deviceId() ? " " + _("thisOne") : "");
        li.querySelector("small").textContent = !d.locate_enabled ? _("locOff") :
          (d.last_seen ? _("seen", ago(d.last_seen)) : _("neverSeen"));
        var rm = li.querySelector("button"); rm.textContent = "×";
        rm.onclick = function (ev) {
          ev.stopPropagation();
          confirmBox(_("removeDeviceQ", d.name), _("remove"), true, function (yes) {
            if (yes) { Devices.remove(d.id, function () { loadDevices(); }); }
          });
        };
        li.onclick = function () { openDevice(d); };
        ul.appendChild(li);
      });
    });
  }

  /* OpenStreetMap tile + pin */
  function tileFor(lat, lon, z) {
    var n = Math.pow(2, z), r = lat * Math.PI / 180;
    var fx = (lon + 180) / 360 * n;
    var fy = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n;
    return { x: Math.floor(fx), y: Math.floor(fy), px: Math.round((fx - Math.floor(fx)) * 256),
             py: Math.round((fy - Math.floor(fy)) * 256), z: z };
  }
  function openDevice(d) {
    state.current = d;
    $("dev-name").textContent = d.name;
    var has = d.lat !== null && d.lat !== undefined && d.locate_enabled;
    setClass($("dev-map"), "hidden", !has);
    if (has) {
      var t = tileFor(d.lat, d.lon, 15);
      $("dev-tile").src = Net.viaHelper("https://tile.openstreetmap.org/" + t.z + "/" + t.x + "/" + t.y + ".png");
      var mapW = $("dev-map").offsetWidth || 320;
      $("dev-pin").style.left = (mapW / 2 - 128 + t.px) + "px";
      $("dev-pin").style.top = t.py + "px";
      $("dev-info").textContent = d.lat.toFixed(5) + ", " + d.lon.toFixed(5) +
        (d.accuracy ? " · " + _("accuracy", d.accuracy) : "");
    } else {
      $("dev-info").textContent = d.locate_enabled ? _("neverSeen") : _("locOff");
    }
    $("dev-seen").textContent = d.last_seen ? _("seen", ago(d.last_seen)) : "";
    $("dev-open").disabled = !has;
    show("v-device");
  }
  $("dev-back").onclick = function () { show("v-main"); };
  $("dev-open").onclick = function () {
    var d = state.current;
    window.open("https://www.openstreetmap.org/?mlat=" + d.lat + "&mlon=" + d.lon + "#map=17/" + d.lat + "/" + d.lon, "_blank");
  };
  $("dev-ring").onclick = function () {
    var d = state.current;
    Auth.ready(function () {
      Devices.patch(d.id, { ring_requested: true }, function (err) { toast(err ? errText(err) : _("ringSent"), 5000); });
    });
  };

  /* ---------- menu ---------- */
  $("btn-menu").onclick = function () {
    var u = Auth.user();
    $("menu-account").textContent = (u && u.email) || "";
    $("menu").classList.remove("hidden");
  };
  $("m-close").onclick = function () { $("menu").classList.add("hidden"); };
  $("m-rename").onclick = function () {
    $("menu").classList.add("hidden");
    var n = window.prompt(_("newName"), deviceName());
    if (n && n.trim()) {
      LS.setItem("fc_device_name", n.trim().slice(0, 40));
      $("this-device-name").textContent = deviceName();
      Auth.ready(function () { Devices.patch(deviceId(), { name: deviceName() }, function () { loadDevices(); }); });
    }
  };
  $("m-server").onclick = function () { $("menu").classList.add("hidden"); openSetup(); };
  $("m-logout").onclick = function () {
    $("menu").classList.add("hidden");
    confirmBox(_("signOutQ"), _("signOut"), true, function (yes) {
      if (!yes) { return; }
      clearInterval(state.reportTimer); clearInterval(state.pollTimer);
      Auth.signOut(); show("v-login");
    });
  };

  /* Delete account: remove all my files, then my devices and the account itself. */
  $("m-delete").onclick = function () {
    $("menu").classList.add("hidden");
    confirmBox(_("deleteAccountQ"), _("deleteAccount"), true, function (yes) {
      if (!yes) { return; }
      toast(_("deletingAccount"), 60000);
      Auth.ready(function (err) {
        if (err) { toast(errText(err)); return; }
        var me = uid(), paths = [];
        (function collect(folders) {
          var f = folders.shift();
          if (f === undefined) { removeFiles(); return; }
          Files.list(me + "/" + f, function (e2, list) {
            if (e2) { toast(errText(e2)); return; }
            list.forEach(function (x) { paths.push(me + "/" + f + "/" + x.name); });
            collect(folders);
          });
        })(["photos", "apps"]);
        function removeFiles() {
          if (!paths.length) { removeAccount(); return; }
          Files.remove(paths.splice(0, 100), function (e3) {
            if (e3) { toast(errText(e3)); return; }
            removeFiles();
          });
        }
        function removeAccount() {
          Net.request("POST", "/rest/v1/rpc/delete_my_account", { json: {} }, function (e4) {
            if (e4) { toast(errText(e4)); return; }
            clearInterval(state.reportTimer); clearInterval(state.pollTimer);
            LS.removeItem("fc_session"); LS.removeItem("fc_locate");
            show("v-login");
            toast(_("accountDeleted"), 6000);
          });
        }
      });
    });
  };

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && Auth.session() && !$("v-main").classList.contains("hidden")) { refresh(); pollRing(); }
  });

  initLanguages();
  start();
})();
