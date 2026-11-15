/* FireCloud networking: Supabase REST over XMLHttpRequest (works on old Gecko).
 * Mobile: requests go through the B2L helper (http://127.0.0.1:8099/fetch?url=…),
 * because old Firefox OS phones can't talk to modern HTTPS servers directly.
 * PC: requests go straight to the server. */
var Net = (function () {
  "use strict";
  var LS = window.localStorage;

  function server() {
    var url = FC_CONFIG.supabaseUrl || LS.getItem("fc_url") || "";
    var key = FC_CONFIG.supabaseKey || LS.getItem("fc_key") || "";
    return { url: url.replace(/\/+$/, ""), key: key };
  }
  function configured() { var s = server(); return !!(s.url && s.key); }
  function useHelper() { return FC_CONFIG.variant === "mobile" && LS.getItem("fc_direct") !== "1"; }

  /* Wrap any https:// address so the phone loads it through the helper. */
  function viaHelper(target) {
    return useHelper() ? FC_CONFIG.helper + "/fetch?url=" + encodeURIComponent(target) : target;
  }

  /* Phones: privileged "systemXHR" request (same as the other B2L apps), so the
     app may talk to the helper on 127.0.0.1 on every Firefox OS version. */
  function newXhr() {
    if (FC_CONFIG.variant === "mobile") {
      try { return new XMLHttpRequest({ mozSystem: true }); } catch (e) {}
    }
    return new XMLHttpRequest();
  }

  /* opts: {query, headers, json, body, contentType, responseType, auth:false} */
  function request(method, path, opts, cb) {
    opts = opts || {};
    var s = server();
    var q = opts.query ? opts.query + "&" : "";
    var target = s.url + path + (path.indexOf("?") >= 0 ? "&" : "?") + q + "apikey=" + encodeURIComponent(s.key);
    var x = newXhr();
    x.open(method, viaHelper(target), true);
    x.setRequestHeader("apikey", s.key);
    var token = opts.auth === false ? null : Auth.token();
    /* Publishable keys (sb_publishable_…) are not login tokens: only send
       Authorization for a signed-in user, or with a legacy anon JWT key. */
    if (token) { x.setRequestHeader("Authorization", "Bearer " + token); }
    else if (/^eyJ/.test(s.key)) { x.setRequestHeader("Authorization", "Bearer " + s.key); }
    var body = null;
    if (opts.json !== undefined) {
      x.setRequestHeader("Content-Type", "application/json");
      body = JSON.stringify(opts.json);
    } else if (opts.body) {
      x.setRequestHeader("Content-Type", opts.contentType || opts.body.type || "application/octet-stream");
      body = opts.body;
    }
    var h = opts.headers || {};
    for (var k in h) { if (h.hasOwnProperty(k)) { x.setRequestHeader(k, h[k]); } }
    x.timeout = opts.timeout || 60000;
    x.onload = function () {
      var data = x.responseText;
      try { data = data ? JSON.parse(data) : null; } catch (e) {}
      if (x.status >= 200 && x.status < 300) { cb(null, data, x.status); }
      else {
        var msg = (data && (data.msg || data.message || data.error_description || data.error)) || ("HTTP " + x.status);
        cb({ status: x.status, message: String(msg), data: data });
      }
    };
    x.onerror = x.ontimeout = function () {
      cb({ status: 0, message: useHelper() ? "helper" : "network" });
    };
    if (opts.onprogress && x.upload) { x.upload.onprogress = opts.onprogress; }
    x.send(body);
  }

  /* Check that the helper answers (mobile only). */
  function helperAlive(cb) {
    if (!useHelper()) { cb(true); return; }
    var x = newXhr();
    x.open("GET", FC_CONFIG.helper + "/health", true);
    x.timeout = 4000;
    x.onload = function () { cb(x.status === 200); };
    x.onerror = x.ontimeout = function () { cb(false); };
    x.send();
  }

  return { server: server, configured: configured, request: request, viaHelper: viaHelper,
           helperAlive: helperAlive, useHelper: useHelper };
})();

/* ---- Accounts (Supabase Auth) ---- */
var Auth = (function () {
  "use strict";
  var LS = window.localStorage, KEY = "fc_session";
  function session() { try { return JSON.parse(LS.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(d) {
    if (!d || !d.access_token) { return null; }
    var s = { access_token: d.access_token, refresh_token: d.refresh_token,
              expires_at: Math.floor(Date.now() / 1000) + (d.expires_in || 3600), user: d.user };
    LS.setItem(KEY, JSON.stringify(s));
    return s;
  }
  function token() { var s = session(); return s ? s.access_token : null; }
  function user() { var s = session(); return s ? s.user : null; }
  function signUp(email, pass, cb) {
    Net.request("POST", "/auth/v1/signup", { auth: false, json: { email: email, password: pass } }, function (err, d) {
      if (err) { cb(err); return; }
      cb(null, save(d));                   // null session = email confirmation needed
    });
  }
  function signIn(email, pass, cb) {
    Net.request("POST", "/auth/v1/token", { auth: false, query: "grant_type=password",
      json: { email: email, password: pass } }, function (err, d) { cb(err, err ? null : save(d)); });
  }
  /* Refresh the access token when it is about to expire. */
  function ready(cb) {
    var s = session();
    if (!s) { cb({ message: "signed-out" }); return; }
    if (s.expires_at - 90 > Date.now() / 1000) { cb(null); return; }
    Net.request("POST", "/auth/v1/token", { auth: false, query: "grant_type=refresh_token",
      json: { refresh_token: s.refresh_token } }, function (err, d) {
        if (err) { if (err.status === 400 || err.status === 401) { signOut(); } cb(err); return; }
        save(d); cb(null);
      });
  }
  function signOut() {
    var t = token();
    if (t) { Net.request("POST", "/auth/v1/logout", {}, function () {}); }
    LS.removeItem(KEY);
  }
  return { session: session, token: token, user: user, signUp: signUp, signIn: signIn, ready: ready, signOut: signOut };
})();

/* ---- Files (Supabase Storage, private bucket, one folder per user) ---- */
var Files = (function () {
  "use strict";
  function b() { return FC_CONFIG.bucket; }
  function enc(path) { return path.split("/").map(encodeURIComponent).join("/"); }
  function list(prefix, cb) {
    Net.request("POST", "/storage/v1/object/list/" + b(), { json: { prefix: prefix, limit: 1000, offset: 0,
      sortBy: { column: "created_at", order: "desc" } } }, function (err, d) {
      if (err) { cb(err); return; }
      cb(null, (Array.isArray(d) ? d : []).filter(function (f) { return f.id; }));     // skip folders
    });
  }
  function upload(path, blob, onprogress, cb) {
    Net.request("POST", "/storage/v1/object/" + b() + "/" + enc(path), { body: blob,
      headers: { "x-upsert": "true", "cache-control": "3600" }, onprogress: onprogress, timeout: 300000 }, cb);
  }
  function remove(paths, cb) {
    Net.request("DELETE", "/storage/v1/object/" + b(), { json: { prefixes: paths } }, cb);
  }
  /* Signed links (1 hour), already wrapped for the helper on phones. */
  function signed(paths, cb) {
    if (!paths.length) { cb(null, {}); return; }
    Net.request("POST", "/storage/v1/object/sign/" + b(), { json: { expiresIn: 3600, paths: paths } }, function (err, d) {
      if (err) { cb(err); return; }
      var out = {}, base = Net.server().url + "/storage/v1";
      (Array.isArray(d) ? d : []).forEach(function (r) {
        var u = r.signedURL || r.signedUrl;
        if (u && !r.error) { out[r.path] = Net.viaHelper(/^https?:/.test(u) ? u : base + u); }
      });
      cb(null, out);
    });
  }
  function usage(cb) {
    Net.request("POST", "/rest/v1/rpc/firecloud_usage", { json: {} }, function (err, d) { cb(err, err ? 0 : Number(d) || 0); });
  }
  return { list: list, upload: upload, remove: remove, signed: signed, usage: usage };
})();

/* ---- Devices (Find My Device) ---- */
var Devices = (function () {
  "use strict";
  function all(cb) { Net.request("GET", "/rest/v1/devices", { query: "select=*&order=last_seen.desc.nullslast" }, cb); }
  function upsert(row, cb) {
    Net.request("POST", "/rest/v1/devices", { json: row, headers: { "Prefer": "resolution=merge-duplicates,return=minimal" } }, cb || function () {});
  }
  function patch(id, fields, cb) {
    Net.request("PATCH", "/rest/v1/devices", { query: "id=eq." + encodeURIComponent(id), json: fields,
      headers: { "Prefer": "return=minimal" } }, cb || function () {});
  }
  function get(id, cb) {
    Net.request("GET", "/rest/v1/devices", { query: "select=*&id=eq." + encodeURIComponent(id) }, function (err, d) {
      cb(err, d && d[0]);
    });
  }
  function remove(id, cb) { Net.request("DELETE", "/rest/v1/devices", { query: "id=eq." + encodeURIComponent(id) }, cb); }
  return { all: all, upsert: upsert, patch: patch, get: get, remove: remove };
})();
