// Shared helpers for the app page and the extension content script.
// Works both as a Chrome/Edge extension (chrome.storage) and as a plain web page
// opened from disk or a web server (localStorage).

var Shared = (function () {
  var STORAGE_KEY = "serenity-snippets";
  var DEFAULT_STATE = { custom: [], favorites: [], recents: [], shortcuts: {} };
  var MAX_RECENTS = 8;

  var isExtension =
    typeof chrome !== "undefined" && !!chrome.storage && !!chrome.storage.local;

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Flattens the built-in library into [{id, title, text, category, builtIn}].
  function builtInSnippets(library) {
    var out = [];
    library.forEach(function (group) {
      group.snippets.forEach(function (pair) {
        out.push({
          id: "b:" + slugify(pair[0]),
          title: pair[0],
          text: pair[1],
          category: group.category,
          builtIn: true
        });
      });
    });
    return out;
  }

  function normalizeState(raw) {
    var s = Object.assign({}, DEFAULT_STATE, raw || {});
    if (!Array.isArray(s.custom)) s.custom = [];
    if (!Array.isArray(s.favorites)) s.favorites = [];
    if (!Array.isArray(s.recents)) s.recents = [];
    if (!s.shortcuts || typeof s.shortcuts !== "object") s.shortcuts = {};
    return s;
  }

  function loadState() {
    if (isExtension) {
      return chrome.storage.local.get(STORAGE_KEY).then(function (r) {
        return normalizeState(r[STORAGE_KEY]);
      });
    }
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { raw = null; }
    return Promise.resolve(normalizeState(raw));
  }

  function saveState(state) {
    if (isExtension) {
      var o = {};
      o[STORAGE_KEY] = state;
      return chrome.storage.local.set(o);
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
    return Promise.resolve();
  }

  function onStateChanged(callback) {
    if (isExtension) {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (area === "local" && changes[STORAGE_KEY]) callback(normalizeState(changes[STORAGE_KEY].newValue));
      });
    } else {
      window.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY) loadState().then(callback);
      });
    }
  }

  function addRecent(state, id) {
    state.recents = [id].concat(state.recents.filter(function (r) { return r !== id; })).slice(0, MAX_RECENTS);
  }

  // Replaces {date} and {time} with the current local date/time.
  function expandTokens(text) {
    var now = new Date();
    return text
      .replace(/\{date\}/gi, now.toLocaleDateString())
      .replace(/\{time\}/gi, now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  }

  // Keyboard combos are stored as e.g. "Ctrl+Alt+1". Uses e.code for letters and
  // digits so Option/Alt on macOS doesn't turn "1" into "¡".
  function comboFromEvent(e) {
    var key;
    if (/^Key[A-Z]$/.test(e.code)) key = e.code.slice(3);
    else if (/^Digit[0-9]$/.test(e.code)) key = e.code.slice(5);
    else if (/^Numpad[0-9]$/.test(e.code)) key = "Num" + e.code.slice(6);
    else if (/^F([1-9]|1[0-9]|2[0-4])$/.test(e.code)) key = e.code;
    else return null;
    var mods = [];
    if (e.ctrlKey) mods.push("Ctrl");
    if (e.altKey) mods.push("Alt");
    if (e.shiftKey) mods.push("Shift");
    if (e.metaKey) mods.push("Cmd");
    // Plain letters/digits (or Shift+letter) would fire while typing.
    var isFKey = /^F\d+$/.test(key);
    if (!isFKey && !e.ctrlKey && !e.altKey && !e.metaKey) return null;
    return mods.concat(key).join("+");
  }

  var RESERVED = ["A", "C", "V", "X", "Z", "Y", "S", "P", "F", "T", "W", "N", "R", "L", "H", "J", "D", "Q"];
  function comboWarning(combo) {
    var parts = combo.split("+");
    var key = parts[parts.length - 1];
    var mods = parts.slice(0, -1);
    if (mods.length === 1 && (mods[0] === "Ctrl" || mods[0] === "Cmd") && RESERVED.indexOf(key) !== -1) {
      return combo + " is a common browser shortcut (copy, paste, save, etc.). Try Alt+Shift+" + key + " instead.";
    }
    if (mods.length === 1 && (mods[0] === "Ctrl" || mods[0] === "Cmd") && /^[0-9]$/.test(key)) {
      return combo + " switches browser tabs. Try Alt+Shift+" + key + " instead.";
    }
    return null;
  }

  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  return {
    isExtension: isExtension,
    builtInSnippets: builtInSnippets,
    loadState: loadState,
    saveState: saveState,
    onStateChanged: onStateChanged,
    addRecent: addRecent,
    expandTokens: expandTokens,
    comboFromEvent: comboFromEvent,
    comboWarning: comboWarning,
    copyText: copyText,
    slugify: slugify
  };
})();

if (typeof module !== "undefined") module.exports = Shared;
