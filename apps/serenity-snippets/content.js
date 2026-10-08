// Runs on every page (extension only). When the user presses one of their
// snippet shortcuts, types the snippet into the focused text box. If no text
// box is focused, copies the snippet to the clipboard instead.
(function () {
  "use strict";
  if (window.__serenitySnippetsLoaded) return;
  window.__serenitySnippetsLoaded = true;

  var BUILT_IN = Shared.builtInSnippets(SNIPPET_LIBRARY);
  var state = null;

  Shared.loadState().then(function (s) { state = s; });
  Shared.onStateChanged(function (s) { state = s; });

  function findSnippet(id) {
    for (var i = 0; i < BUILT_IN.length; i++) if (BUILT_IN[i].id === id) return BUILT_IN[i];
    for (var j = 0; j < state.custom.length; j++) if (state.custom[j].id === id) return state.custom[j];
    return null;
  }

  // Follows focus into shadow roots (many rich-text editors use them).
  function deepActiveElement() {
    var el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
    return el;
  }

  var TEXT_INPUT_TYPES = /^(text|search|email|url|tel|)$/i;

  function insertText(text) {
    var el = deepActiveElement();
    if (!el) return false;
    var isField = el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && TEXT_INPUT_TYPES.test(el.type));
    if (isField) {
      if (el.readOnly || el.disabled) return false;
      // execCommand keeps the browser's undo history and fires the input
      // events that frameworks (React, Angular) listen for.
      if (document.execCommand("insertText", false, text)) return true;
      var start = el.selectionStart, end = el.selectionEnd;
      el.setRangeText(text, start, end, "end");
      el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
      return true;
    }
    if (el.isContentEditable) {
      return document.execCommand("insertText", false, text);
    }
    return false;
  }

  function showToast(msg) {
    var host = document.createElement("div");
    host.style.cssText = "position:fixed;z-index:2147483647;left:50%;bottom:24px;transform:translateX(-50%);pointer-events:none;";
    var root = host.attachShadow({ mode: "closed" });
    var box = document.createElement("div");
    box.textContent = msg;
    box.style.cssText = "font:14px/1.4 system-ui,sans-serif;background:#1d2a2e;color:#fff;padding:8px 14px;" +
      "border-radius:999px;box-shadow:0 4px 16px rgba(0,0,0,.25);opacity:0;transition:opacity .15s;white-space:nowrap;";
    root.appendChild(box);
    (document.body || document.documentElement).appendChild(host);
    requestAnimationFrame(function () { box.style.opacity = "1"; });
    setTimeout(function () { box.style.opacity = "0"; }, 1600);
    setTimeout(function () { host.remove(); }, 1900);
  }

  window.addEventListener("keydown", function (e) {
    if (!state || e.repeat) return;
    var combo = Shared.comboFromEvent(e);
    if (!combo) return;
    var id = state.shortcuts[combo];
    if (!id) return;
    var snippet = findSnippet(id);
    if (!snippet) return;
    e.preventDefault();
    e.stopPropagation();

    var text = Shared.expandTokens(snippet.text);
    if (insertText(text)) {
      showToast("Inserted “" + snippet.title + "”");
    } else {
      Shared.copyText(text).then(
        function () { showToast("Copied “" + snippet.title + "” — click a text box and paste"); },
        function () { showToast("Click into a text box first, then press the shortcut"); }
      );
    }
    Shared.addRecent(state, id);
    Shared.saveState(state);
  }, true);
})();
