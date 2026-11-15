/* Firefox OS compatibility layer for apps written for Firefox OS 1.x/2.x.
 * Provides the most common Firefox OS-only APIs on top of standard web APIs
 * so simple apps run in Firefox. Hardware/telephony APIs are not available. */
(function () {
  "use strict";
  var w = window, nav = navigator;
  function req(result, error) {            // DOMRequest-like object
    var r = { result: result, error: error || null, onsuccess: null, onerror: null,
              readyState: "pending", then: function (ok, ko) {
                return (error ? Promise.reject(error) : Promise.resolve(result)).then(ok, ko); } };
    setTimeout(function () {
      r.readyState = "done";
      if (error) { r.onerror && r.onerror({ target: r }); }
      else { r.onsuccess && r.onsuccess({ target: r }); }
    }, 0);
    return r;
  }
  function loadManifest() {
    try {
      var x = new XMLHttpRequest();
      var base = location.href.replace(/[^\/]*$/, "");
      // walk up to the folder that contains manifest.webapp
      for (var i = 0; i < 6; i++) {
        try { x.open("GET", base + "manifest.webapp", false); x.send(null);
              if (x.responseText) { return JSON.parse(x.responseText); } } catch (e) {}
        base = base.replace(/[^\/]*\/$/, "");
      }
    } catch (e) {}
    return {};
  }
  var self = null;
  function getSelfApp() {
    if (!self) {
      var m = loadManifest();
      self = { manifest: m, origin: location.origin, installOrigin: "app://firefoxos",
               receipts: [], launch: function () { location.reload(); },
               checkForUpdate: function () { return req(false); } };
    }
    return self;
  }
  if (!nav.mozApps) {
    nav.mozApps = {
      getSelf: function () { return req(getSelfApp()); },
      getInstalled: function () { return req([getSelfApp()]); },
      checkInstalled: function () { return req(getSelfApp()); },
      install: function (url) {
        w.open("fxos-install:" + url); return req(null, { name: "NOT_SUPPORTED" }); },
      installPackage: function (url) { return this.install(url); },
      mgmt: { getAll: function () { return req([getSelfApp()]); } }
    };
  }
  if (!nav.mozSetMessageHandler) {
    nav.mozSetMessageHandler = function (type, handler) {
      w.__fxosHandlers = w.__fxosHandlers || {}; w.__fxosHandlers[type] = handler; };
    nav.mozHasPendingMessage = function () { return false; };
  }
  if (!w.MozActivity) {
    w.MozActivity = function (opts) {
      var o = opts || {}, d = o.data || {}, r = req(null);
      switch (o.name) {
        case "view": case "open":
          if (d.url) { w.open(d.url, "_blank"); } break;
        case "new":
          if (d.type === "mail" || d.url && /^mailto:/.test(d.url)) {
            location.href = d.url || "mailto:"; } break;
        case "share":
          if (nav.share) { nav.share({ text: d.url || (d.blobs ? "" : ""), url: d.url }).catch(function () {}); }
          break;
        case "pick":
          var inp = document.createElement("input"); inp.type = "file";
          if (d.type) { inp.accept = [].concat(d.type).join(","); }
          inp.onchange = function () {
            r.result = { blob: inp.files[0], type: inp.files[0] && inp.files[0].type };
            r.onsuccess && r.onsuccess({ target: r }); };
          inp.click(); return r;
      }
      return r;
    };
  }
  if (!nav.mozVibrate && nav.vibrate) { nav.mozVibrate = nav.vibrate.bind(nav); }
  if (!nav.mozNotification && w.Notification) {
    nav.mozNotification = { createNotification: function (title, body, icon) {
      return { show: function () {
        if (Notification.permission === "granted") { new Notification(title, { body: body, icon: icon }); }
        else { Notification.requestPermission().then(function (p) {
          if (p === "granted") { new Notification(title, { body: body, icon: icon }); } }); } },
        onclick: null, onclose: null }; } };
  }
  if (!nav.mozAlarms) {
    nav.mozAlarms = { add: function (date, tz, data) {
      var ms = new Date(date) - new Date(); var id = setTimeout(function () {
        var h = w.__fxosHandlers && w.__fxosHandlers.alarm; h && h({ data: data }); }, Math.max(0, ms));
      return req(id); },
      remove: function (id) { clearTimeout(id); }, getAll: function () { return req([]); } };
  }
  if (!nav.mozSettings) {
    var store = {};
    try { store = JSON.parse(localStorage.getItem("__fxos_settings") || "{}"); } catch (e) {}
    nav.mozSettings = { createLock: function () { return {
      get: function (k) { var o = {}; o[k] = store[k]; return req(o); },
      set: function (o) { for (var k in o) { store[k] = o[k]; }
        try { localStorage.setItem("__fxos_settings", JSON.stringify(store)); } catch (e) {}
        return req(null); } }; },
      addObserver: function () {}, removeObserver: function () {} };
  }
  if (!nav.mozL10n) {                       // tiny fallback; Gaia apps usually ship their own
    nav.mozL10n = { get: function (k, a) { return k; }, language: { code: nav.language, direction: "ltr" },
      ready: function (cb) { if (document.readyState !== "loading") { cb(); }
        else { document.addEventListener("DOMContentLoaded", cb); } },
      once: function (cb) { this.ready(cb); }, translate: function () {}, localize: function () {} };
  }
  w.__firefoxOS = { version: "2.0", shim: true };
})();
