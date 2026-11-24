/* eslint-disable */
// @ts-nocheck
/**
 * These two functions are NEVER called in the app. They are stringified with
 * Function.prototype.toString() and executed inside a sandboxed iframe
 * (opaque origin) / Web Worker. They must be fully self-contained.
 */

/** Runs inside the sandboxed iframe: spawns a Worker per run and relays messages. */
export function bridgeMain() {
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.type !== "run") return;
    var token = d.token;
    var send = function (msg) {
      parent.postMessage({ token: token, msg: msg }, "*");
    };
    try {
      var url = URL.createObjectURL(new Blob([d.workerSrc], { type: "text/javascript" }));
      var worker = new Worker(url);
      worker.onmessage = function (m) {
        send(m.data);
      };
      worker.onerror = function (ev) {
        send({ t: "error", name: "Error", message: ev.message || "Worker error" });
        send({ t: "done" });
      };
      worker.postMessage({ code: d.code });
    } catch (err) {
      send({ t: "error", name: "SandboxError", message: String(err && err.message ? err.message : err) });
      send({ t: "done" });
    }
  });
  parent.postMessage({ ready: true }, "*");
}

/** Runs inside the Worker: console capture, value formatting, idle detection. */
export function workerMain() {
  var post = function (m) {
    self.postMessage(m);
  };
  var finished = false;
  var mainDone = false;
  var timers = {};
  var timerCount = 0;
  var fetchPending = 0;
  var indent = "";
  var origSetTimeout = self.setTimeout.bind(self);
  var origClearTimeout = self.clearTimeout.bind(self);
  var origSetInterval = self.setInterval.bind(self);
  var origClearInterval = self.clearInterval.bind(self);

  function fmt(v, depth, seen) {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    var t = typeof v;
    if (t === "string") return depth === 0 ? v : "'" + v.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'";
    if (t === "number") return Object.is(v, -0) ? "-0" : String(v);
    if (t === "boolean") return String(v);
    if (t === "bigint") return String(v) + "n";
    if (t === "symbol") return v.toString();
    if (t === "function") {
      var src = Function.prototype.toString.call(v);
      if (/^class[\s{]/.test(src)) return "[class " + (v.name || "(anonymous)") + (Object.getPrototypeOf(v) && Object.getPrototypeOf(v).name ? " extends " + Object.getPrototypeOf(v).name : "") + "]";
      return "[Function: " + (v.name || "(anonymous)") + "]";
    }
    if (seen.indexOf(v) !== -1) return "[Circular]";
    if (v instanceof Error) return v.name + ": " + v.message;
    if (v instanceof Date) return isNaN(v) ? "Invalid Date" : v.toISOString();
    if (v instanceof RegExp) return String(v);
    if (v instanceof Promise) return "Promise { <pending> }";
    if (v instanceof WeakMap) return "WeakMap { <items unknown> }";
    if (v instanceof WeakSet) return "WeakSet { <items unknown> }";
    if (depth > 2) return Array.isArray(v) ? "[Array]" : "[Object]";
    var next = seen.concat([v]);
    var parts = [];
    if (Array.isArray(v)) {
      var holes = 0;
      for (var i = 0; i < v.length && parts.length < 100; i++) {
        if (!(i in v)) { holes++; continue; }
        if (holes) { parts.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">"); holes = 0; }
        parts.push(fmt(v[i], depth + 1, next));
      }
      if (holes) parts.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">");
      if (v.length > 100) parts.push("... " + (v.length - 100) + " more items");
      return parts.length ? "[ " + parts.join(", ") + " ]" : "[]";
    }
    if (v instanceof Map) {
      v.forEach(function (val, k) { parts.push(fmt(k, depth + 1, next) + " => " + fmt(val, depth + 1, next)); });
      return "Map(" + v.size + ") " + (parts.length ? "{ " + parts.join(", ") + " }" : "{}");
    }
    if (v instanceof Set) {
      v.forEach(function (val) { parts.push(fmt(val, depth + 1, next)); });
      return "Set(" + v.size + ") " + (parts.length ? "{ " + parts.join(", ") + " }" : "{}");
    }
    var proto = Object.getPrototypeOf(v);
    var prefix = "";
    if (proto === null) prefix = "[Object: null prototype] ";
    else if (proto.constructor && proto.constructor.name && proto.constructor.name !== "Object") prefix = proto.constructor.name + " ";
    var keys = Object.keys(v);
    for (var j = 0; j < keys.length; j++) {
      var k = keys[j];
      var key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'";
      var val;
      try { val = fmt(v[k], depth + 1, next); } catch (e) { val = "[Getter threw]"; }
      parts.push(key + ": " + val);
    }
    var syms = Object.getOwnPropertySymbols(v);
    for (var s = 0; s < syms.length; s++) parts.push("[" + syms[s].toString() + "]: " + fmt(v[syms[s]], depth + 1, next));
    return prefix + (parts.length ? "{ " + parts.join(", ") + " }" : "{}");
  }

  function line(args) {
    var out = [];
    for (var i = 0; i < args.length; i++) out.push(fmt(args[i], 0, []));
    return indent + out.join(" ").split("\n").join("\n" + indent);
  }

  function emit(level) {
    return function () {
      post({ t: "log", level: level, text: line(arguments) });
    };
  }
  console.log = emit("log");
  console.info = emit("log");
  console.debug = emit("log");
  console.warn = emit("warn");
  console.error = emit("error");
  console.table = function (data) { post({ t: "log", level: "log", text: indent + fmt(data, 1, []) }); };
  console.group = function () { if (arguments.length) console.log.apply(console, arguments); indent += "  "; };
  console.groupEnd = function () { indent = indent.slice(2); };
  var counts = {};
  console.count = function (label) { label = label === undefined ? "default" : String(label); counts[label] = (counts[label] || 0) + 1; console.log(label + ": " + counts[label]); };
  console.assert = function (cond) { if (!cond) post({ t: "log", level: "error", text: "Assertion failed" + (arguments.length > 1 ? ": " + line([].slice.call(arguments, 1)) : "") }); };
  console.time = console.timeEnd = console.timeLog = function () {};

  function report(err) {
    var name = err && err.name ? err.name : "Uncaught";
    var message = err && err.message !== undefined ? err.message : fmt(err, 0, []);
    post({ t: "error", name: name, message: message });
  }

  function finish() {
    if (finished) return;
    finished = true;
    post({ t: "done" });
  }

  function checkIdle() {
    // defer so queued microtasks (promise chains) settle before we decide
    origSetTimeout(function () {
      if (finished) return;
      if (mainDone && timerCount === 0 && fetchPending === 0) finish();
    }, 15);
  }

  self.setTimeout = function (fn, ms) {
    var args = [].slice.call(arguments, 2);
    var id = origSetTimeout(function () {
      if (timers[id]) { delete timers[id]; timerCount--; }
      try { fn.apply(null, args); } catch (e) { report(e); finish(); return; }
      checkIdle();
    }, ms);
    timers[id] = 1; timerCount++;
    return id;
  };
  self.clearTimeout = function (id) {
    if (timers[id]) { delete timers[id]; timerCount--; }
    origClearTimeout(id);
    checkIdle();
  };
  self.setInterval = function (fn, ms) {
    var args = [].slice.call(arguments, 2);
    var id = origSetInterval(function () {
      try { fn.apply(null, args); } catch (e) { report(e); finish(); }
    }, ms);
    timers[id] = 1; timerCount++;
    return id;
  };
  self.clearInterval = function (id) {
    if (timers[id]) { delete timers[id]; timerCount--; }
    origClearInterval(id);
    checkIdle();
  };
  if (self.fetch) {
    var origFetch = self.fetch.bind(self);
    self.fetch = function () {
      fetchPending++;
      var p = origFetch.apply(null, arguments);
      var settle = function () { fetchPending--; checkIdle(); };
      p.then(settle, settle);
      return p;
    };
  }

  self.addEventListener("unhandledrejection", function (e) {
    e.preventDefault();
    report(e.reason);
    finish();
  });

  self.onmessage = function (e) {
    var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    var fn;
    try {
      fn = new AsyncFunction('"use strict";\n' + e.data.code);
    } catch (err) {
      report(err);
      finish();
      return;
    }
    fn().then(
      function () { mainDone = true; checkIdle(); },
      function (err) { report(err); finish(); },
    );
  };
}
