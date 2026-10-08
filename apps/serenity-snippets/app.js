(function () {
  "use strict";

  var BUILT_IN = Shared.builtInSnippets(SNIPPET_LIBRARY);
  var CATEGORIES = SNIPPET_LIBRARY.map(function (g) { return g.category; });
  var MY = "My Snippets";
  var IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform);
  var IS_POPUP = new URLSearchParams(location.search).has("popup");

  var state = { custom: [], favorites: [], recents: [], shortcuts: {} };
  var view = "all"; // "all" | "favorites" | "recent" | "mine" | category name
  var query = "";
  var suggestIndex = -1;
  var suggestions = [];

  var $ = function (id) { return document.getElementById(id); };
  var searchEl = $("search");
  var suggestEl = $("suggest");
  var listEl = $("list");
  var chipsEl = $("chips");

  var ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    starFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M8 14h8"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>'
  };

  // ---------- data helpers ----------

  function allSnippets() {
    return BUILT_IN.concat(state.custom.map(function (c) {
      return { id: c.id, title: c.title, text: c.text, category: MY, builtIn: false };
    }));
  }

  function byId(id) {
    var list = allSnippets();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function shortcutFor(id) {
    for (var combo in state.shortcuts) if (state.shortcuts[combo] === id) return combo;
    return null;
  }

  function isFav(id) { return state.favorites.indexOf(id) !== -1; }

  function save() { return Shared.saveState(state); }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function displayCombo(combo) {
    return IS_MAC ? combo.replace("Alt", "Option") : combo;
  }

  // ---------- search ----------

  function tokens(q) {
    return q.toLowerCase().split(/\s+/).filter(Boolean);
  }

  function score(snippet, toks, q) {
    var title = snippet.title.toLowerCase();
    var text = snippet.text.toLowerCase();
    var cat = snippet.category.toLowerCase();
    var total = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      var inTitle = title.indexOf(t) !== -1;
      var inText = text.indexOf(t) !== -1;
      var inCat = cat.indexOf(t) !== -1;
      if (!inTitle && !inText && !inCat) return 0;
      if (inTitle) total += 10;
      if (new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(title)) total += 6;
      if (inText) total += 2;
      if (inCat) total += 1;
    }
    if (title.indexOf(q.toLowerCase()) === 0) total += 30;
    if (isFav(snippet.id)) total += 3;
    if (state.recents.indexOf(snippet.id) !== -1) total += 2;
    return total;
  }

  function search(q) {
    var toks = tokens(q);
    if (!toks.length) return [];
    return allSnippets()
      .map(function (s) { return { s: s, score: score(s, toks, q.trim()) }; })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.s.title.localeCompare(b.s.title); })
      .map(function (r) { return r.s; });
  }

  function highlight(str, q) {
    var html = escapeHtml(str);
    var toks = tokens(q).map(escapeHtml).sort(function (a, b) { return b.length - a.length; });
    if (!toks.length) return html;
    var re = new RegExp("(" + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "gi");
    // Only highlight outside HTML entities.
    return html.split(/(&[a-z#0-9]+;)/i).map(function (part) {
      return /^&[a-z#0-9]+;$/i.test(part) ? part : part.replace(re, "<mark>$1</mark>");
    }).join("");
  }

  // ---------- copy ----------

  function copySnippet(id) {
    var s = byId(id);
    if (!s) return;
    Shared.copyText(Shared.expandTokens(s.text)).then(function () {
      Shared.addRecent(state, id);
      save();
      toast("Copied “" + s.title + "” — paste with " + (IS_MAC ? "Cmd+V" : "Ctrl+V"));
      render();
      var card = listEl.querySelector('.card[data-id="' + cssEscape(id) + '"]');
      if (card) {
        card.classList.add("copied");
        setTimeout(function () { card.classList.remove("copied"); }, 900);
      }
    }, function () {
      toast("Couldn't copy. Select the text and copy it manually.");
    });
  }

  function cssEscape(s) {
    return window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/"/g, '\\"');
  }

  var toastTimer;
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  // ---------- rendering ----------

  function renderChips() {
    var chips = [
      ["all", "All"], ["favorites", "★ Favorites"], ["recent", "Recent"], ["mine", MY]
    ].concat(CATEGORIES.map(function (c) { return [c, c]; }));
    chipsEl.innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-view="' + escapeHtml(c[0]) + '" aria-pressed="' +
        (view === c[0] && !query ? "true" : "false") + '">' + escapeHtml(c[1]) + "</button>";
    }).join("");
  }

  function cardHtml(s, opts) {
    var combo = shortcutFor(s.id);
    var fav = isFav(s.id);
    var title = query ? highlight(s.title, query) : escapeHtml(s.title);
    return '<div class="card" data-id="' + escapeHtml(s.id) + '">' +
      '<button type="button" class="card-main" data-act="copy" title="Click to copy:\n' + escapeHtml(s.text) + '">' +
        '<span class="card-title">' + title +
          (combo ? ' <span class="badge">' + escapeHtml(displayCombo(combo)) + "</span>" : "") +
          (opts && opts.showCat ? ' <span class="card-cat">· ' + escapeHtml(s.category) + "</span>" : "") +
        "</span>" +
        '<span class="card-text">' + (query ? highlight(s.text, query) : escapeHtml(s.text)) + "</span>" +
      "</button>" +
      '<div class="card-tools">' +
        '<button type="button" class="tool star" data-act="fav" aria-pressed="' + fav + '" aria-label="' +
          (fav ? "Remove from favorites" : "Add to favorites") + '" title="' + (fav ? "Remove from favorites" : "Add to favorites") + '">' +
          (fav ? ICONS.starFilled : ICONS.star) + "</button>" +
        '<button type="button" class="tool' + (combo ? " has-shortcut" : "") + '" data-act="shortcut" aria-label="Set keyboard shortcut" title="' +
          (combo ? "Shortcut: " + escapeHtml(displayCombo(combo)) : "Set keyboard shortcut") + '">' + ICONS.keyboard + "</button>" +
        '<button type="button" class="tool" data-act="edit" aria-label="' + (s.builtIn ? "Make my own version" : "Edit") + '" title="' +
          (s.builtIn ? "Make my own version" : "Edit") + '">' + ICONS.edit + "</button>" +
      "</div>" +
    "</div>";
  }

  function sectionHtml(title, items, emptyMsg, opts) {
    if (!items.length && !emptyMsg) return "";
    return '<section class="section"><h2>' + escapeHtml(title) +
      (items.length ? ' <span class="count">' + items.length + "</span>" : "") + "</h2>" +
      (items.length
        ? '<div class="cards">' + items.map(function (s) { return cardHtml(s, opts); }).join("") + "</div>"
        : '<p class="empty">' + emptyMsg + "</p>") +
      "</section>";
  }

  function idsToSnippets(ids) {
    return ids.map(byId).filter(Boolean);
  }

  function render() {
    renderChips();
    var html = "";
    if (query.trim()) {
      var results = search(query);
      html = sectionHtml("Results", results,
        "No snippets match “" + escapeHtml(query) + "”. <a href=\"#\" data-act=\"new-from-search\">Create one?</a>",
        { showCat: true });
    } else {
      var all = allSnippets();
      var favs = idsToSnippets(state.favorites);
      var recents = idsToSnippets(state.recents);
      var mine = all.filter(function (s) { return !s.builtIn; });
      var myEmpty = "You haven't written any snippets yet. Click <strong>+ New snippet</strong> to add your own.";
      if (view === "all") {
        html += sectionHtml("★ Favorites", favs, null, { showCat: true });
        html += sectionHtml("Recently used", recents.slice(0, 5), null, { showCat: true });
        html += sectionHtml(MY, mine, myEmpty);
        CATEGORIES.forEach(function (c) {
          html += sectionHtml(c, all.filter(function (s) { return s.category === c; }));
        });
      } else if (view === "favorites") {
        html = sectionHtml("★ Favorites", favs, "No favorites yet. Click the star on any snippet to pin it here.", { showCat: true });
      } else if (view === "recent") {
        html = sectionHtml("Recently used", recents, "Snippets you copy will show up here.", { showCat: true });
      } else if (view === "mine") {
        html = sectionHtml(MY, mine, myEmpty);
      } else {
        html = sectionHtml(view, all.filter(function (s) { return s.category === view; }));
      }
    }
    listEl.innerHTML = html;
  }

  // ---------- suggestions dropdown ----------

  function renderSuggest() {
    if (!query.trim()) { closeSuggest(); return; }
    suggestions = search(query).slice(0, 6);
    if (suggestIndex >= suggestions.length) suggestIndex = suggestions.length - 1;
    if (!suggestions.length) {
      suggestEl.innerHTML = '<li class="s-empty">No matches</li>';
    } else {
      suggestEl.innerHTML = suggestions.map(function (s, i) {
        return '<li role="option" id="sug-' + i + '" data-id="' + escapeHtml(s.id) + '" aria-selected="' + (i === suggestIndex) + '">' +
          '<div><span class="s-title">' + highlight(s.title, query) + '</span><span class="s-cat">' + escapeHtml(s.category) + "</span></div>" +
          '<div class="s-text">' + escapeHtml(s.text) + "</div></li>";
      }).join("");
    }
    suggestEl.hidden = false;
    searchEl.setAttribute("aria-expanded", "true");
    if (suggestIndex >= 0) searchEl.setAttribute("aria-activedescendant", "sug-" + suggestIndex);
    else searchEl.removeAttribute("aria-activedescendant");
  }

  function closeSuggest() {
    suggestEl.hidden = true;
    suggestIndex = -1;
    searchEl.setAttribute("aria-expanded", "false");
    searchEl.removeAttribute("aria-activedescendant");
  }

  searchEl.addEventListener("input", function () {
    query = searchEl.value;
    suggestIndex = query.trim() ? 0 : -1;
    renderSuggest();
    render();
  });

  searchEl.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (suggestEl.hidden) { if (query.trim()) renderSuggest(); else return; }
      e.preventDefault();
      var n = suggestions.length;
      if (!n) return;
      suggestIndex = e.key === "ArrowDown" ? (suggestIndex + 1) % n : (suggestIndex - 1 + n) % n;
      renderSuggest();
      var active = suggestEl.querySelector('[aria-selected="true"]');
      if (active) active.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      var pick = suggestions[suggestIndex >= 0 ? suggestIndex : 0];
      if (!suggestEl.hidden && pick) { copySnippet(pick.id); closeSuggest(); }
    } else if (e.key === "Escape") {
      if (!suggestEl.hidden) { closeSuggest(); e.preventDefault(); }
      else if (searchEl.value) { searchEl.value = ""; query = ""; render(); e.preventDefault(); }
    }
  });

  searchEl.addEventListener("focus", function () { if (query.trim()) renderSuggest(); });
  searchEl.addEventListener("blur", function () { setTimeout(closeSuggest, 150); });

  suggestEl.addEventListener("mousedown", function (e) {
    var li = e.target.closest("li[data-id]");
    if (!li) return;
    e.preventDefault();
    copySnippet(li.getAttribute("data-id"));
    closeSuggest();
  });

  // ---------- list interactions ----------

  chipsEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    view = chip.getAttribute("data-view");
    query = "";
    searchEl.value = "";
    closeSuggest();
    render();
    window.scrollTo(0, 0);
  });

  listEl.addEventListener("click", function (e) {
    var actEl = e.target.closest("[data-act]");
    if (!actEl) return;
    var act = actEl.getAttribute("data-act");
    if (act === "new-from-search") { e.preventDefault(); openEdit(null, { title: query.trim() }); return; }
    var card = actEl.closest(".card");
    var id = card && card.getAttribute("data-id");
    if (!id) return;
    if (act === "copy") copySnippet(id);
    else if (act === "fav") toggleFav(id);
    else if (act === "shortcut") openShortcut(id);
    else if (act === "edit") {
      var s = byId(id);
      if (s.builtIn) openEdit(null, { title: s.title, text: s.text });
      else openEdit(id);
    }
  });

  function toggleFav(id) {
    if (isFav(id)) state.favorites = state.favorites.filter(function (f) { return f !== id; });
    else state.favorites.push(id);
    save();
    render();
  }

  // ---------- dialogs ----------

  document.querySelectorAll("dialog [data-close]").forEach(function (b) {
    b.addEventListener("click", function () { b.closest("dialog").close(); });
  });

  var editingId = null;
  function openEdit(id, prefill) {
    editingId = id;
    var s = id ? byId(id) : null;
    $("editHeading").textContent = id ? "Edit snippet" : (prefill && prefill.text ? "Make my own version" : "New snippet");
    $("editTitle").value = s ? s.title : (prefill && prefill.title) || "";
    $("editText").value = s ? s.text : (prefill && prefill.text) || "";
    $("editDelete").hidden = !id;
    $("editDialog").showModal();
    (prefill && prefill.text ? $("editText") : $("editTitle")).focus();
  }

  $("newBtn").addEventListener("click", function () { openEdit(null); });

  $("editForm").addEventListener("submit", function () {
    var title = $("editTitle").value.trim();
    var text = $("editText").value.trim();
    if (!title || !text) return;
    if (editingId) {
      state.custom.forEach(function (c) { if (c.id === editingId) { c.title = title; c.text = text; } });
      toast("Snippet saved");
    } else {
      state.custom.push({ id: "c:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: title, text: text });
      toast("Added to My Snippets");
    }
    save();
    render();
  });

  $("editDelete").addEventListener("click", function () {
    if (!editingId) return;
    var s = byId(editingId);
    if (!confirm("Delete “" + s.title + "”? This can't be undone.")) return;
    var id = editingId;
    state.custom = state.custom.filter(function (c) { return c.id !== id; });
    state.favorites = state.favorites.filter(function (f) { return f !== id; });
    state.recents = state.recents.filter(function (r) { return r !== id; });
    var combo = shortcutFor(id);
    if (combo) delete state.shortcuts[combo];
    save();
    $("editDialog").close();
    render();
    toast("Snippet deleted");
  });

  // Shortcut recorder
  var shortcutId = null;
  var pendingCombo = null;
  var recorder = $("recorder");

  function openShortcut(id) {
    shortcutId = id;
    pendingCombo = null;
    var s = byId(id);
    var existing = shortcutFor(id);
    $("shortcutFor").textContent = "For: " + s.title;
    recorder.textContent = existing ? displayCombo(existing) : "Press a key combination…";
    recorder.classList.toggle("set", !!existing);
    $("shortcutRemove").hidden = !existing;
    $("shortcutSave").disabled = true;
    $("shortcutWarn").hidden = true;
    $("shortcutHint").textContent = "Click the box above and press keys, for example " +
      (IS_MAC ? "Option+Shift+1" : "Alt+Shift+1") + ". " +
      (Shared.isExtension
        ? "Use it in any text box on any website to type this snippet where your cursor is."
        : "It works while this page is open and in front. Install the browser extension to use it inside Axiscare and email.");
    $("shortcutDialog").showModal();
    recorder.focus();
  }

  recorder.addEventListener("keydown", function (e) {
    if (e.key === "Tab") return;
    if (e.key === "Escape") return; // let the dialog close
    e.preventDefault();
    e.stopPropagation();
    if (["Control", "Alt", "Shift", "Meta"].indexOf(e.key) !== -1) return;
    var combo = Shared.comboFromEvent(e);
    var warn = $("shortcutWarn");
    if (!combo) {
      warn.textContent = "Include Ctrl, Alt" + (IS_MAC ? " (Option), or Cmd" : "") + " plus a letter or number, or use F1–F12.";
      warn.hidden = false;
      return;
    }
    pendingCombo = combo;
    recorder.textContent = displayCombo(combo);
    recorder.classList.add("set");
    $("shortcutSave").disabled = false;
    var msgs = [];
    var w = Shared.comboWarning(combo);
    if (w) msgs.push(w);
    var owner = state.shortcuts[combo];
    if (owner && owner !== shortcutId) {
      var o = byId(owner);
      msgs.push("Already used by “" + (o ? o.title : "another snippet") + "”. Saving will move it to this snippet.");
    }
    warn.textContent = msgs.join(" ");
    warn.hidden = !msgs.length;
  });

  $("shortcutForm").addEventListener("submit", function () {
    if (!pendingCombo || !shortcutId) return;
    var old = shortcutFor(shortcutId);
    if (old) delete state.shortcuts[old];
    state.shortcuts[pendingCombo] = shortcutId;
    save();
    render();
    toast("Shortcut set: " + displayCombo(pendingCombo));
  });

  $("shortcutRemove").addEventListener("click", function () {
    var old = shortcutFor(shortcutId);
    if (old) delete state.shortcuts[old];
    save();
    $("shortcutDialog").close();
    render();
    toast("Shortcut removed");
  });

  // ---------- menu: backup / restore / help ----------

  var menuBtn = $("menuBtn");
  var menu = $("menu");
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(menu.hidden); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });

  menu.addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b) return;
    setMenu(false);
    var action = b.getAttribute("data-action");
    if (action === "open-tab") openTab("");
    else if (action === "export") exportBackup();
    else if (action === "import") {
      // A file picker closes the extension popup, so restore from a full tab.
      if (IS_POPUP) openTab("#import");
      else $("importDialog").showModal();
    }
    else if (action === "help") $("helpDialog").showModal();
  });

  function openTab(hash) {
    if (Shared.isExtension && chrome.tabs) chrome.tabs.create({ url: chrome.runtime.getURL("index.html") + hash });
    else window.open("index.html" + hash, "_blank");
  }

  function exportBackup() {
    var data = {
      app: "serenity-snippets",
      version: 1,
      exportedAt: new Date().toISOString(),
      custom: state.custom,
      favorites: state.favorites,
      shortcuts: state.shortcuts
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "serenity-snippets-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast("Backup downloaded");
  }

  $("chooseFile").addEventListener("click", function () { $("importFile").click(); });

  $("importFile").addEventListener("change", function () {
    var file = this.files && this.files[0];
    this.value = "";
    if (!file) return;
    file.text().then(function (txt) {
      var data = JSON.parse(txt);
      if (!data || data.app !== "serenity-snippets") throw new Error("not a backup");
      var added = 0;
      (data.custom || []).forEach(function (c) {
        if (!c || typeof c.id !== "string" || typeof c.title !== "string" || typeof c.text !== "string") return;
        var existing = state.custom.filter(function (x) { return x.id === c.id; })[0];
        if (existing) { existing.title = c.title; existing.text = c.text; }
        else { state.custom.push({ id: c.id, title: c.title, text: c.text }); added++; }
      });
      (data.favorites || []).forEach(function (f) {
        if (typeof f === "string" && !isFav(f)) state.favorites.push(f);
      });
      Object.keys(data.shortcuts || {}).forEach(function (combo) {
        var id = data.shortcuts[combo];
        if (typeof id !== "string") return;
        var old = shortcutFor(id);
        if (old) delete state.shortcuts[old];
        state.shortcuts[combo] = id;
      });
      return save().then(function () {
        $("importDialog").close();
        render();
        toast("Restored backup (" + added + " new snippet" + (added === 1 ? "" : "s") + ")");
      });
    }).catch(function () {
      toast("That file isn't a Serenity Snippets backup.");
    });
  });

  // ---------- global keys ----------

  document.addEventListener("keydown", function (e) {
    if (document.querySelector("dialog[open]")) return;
    var combo = Shared.comboFromEvent(e);
    if (combo && state.shortcuts[combo]) {
      e.preventDefault();
      copySnippet(state.shortcuts[combo]);
      return;
    }
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) {
      e.preventDefault();
      searchEl.focus();
      searchEl.select();
    } else if (!typing && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && /\S/.test(e.key)) {
      // Start typing anywhere to search.
      searchEl.focus();
    }
  });

  // ---------- init ----------

  if (IS_POPUP) document.body.classList.add("popup");
  if (Shared.isExtension) document.body.classList.add("is-extension");
  document.querySelectorAll(".paste-key").forEach(function (k) { k.textContent = IS_MAC ? "Cmd+V" : "Ctrl+V"; });

  Shared.onStateChanged(function (s) {
    state = s;
    render();
  });

  Shared.loadState().then(function (s) {
    state = s;
    render();
    searchEl.focus();
    if (location.hash === "#import") $("importDialog").showModal();
  });
})();
