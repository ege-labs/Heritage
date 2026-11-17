/* Heritage Wiki — çekirdek: dil, yönlendirme, arama, ortak bileşenler.
   Bağımlılık yok, modül yok: file:// ile ve oyun içi WebView'da çalışır.
   Oyun içi kullanım:  index.html?embed=1&lang=tr#/economy
   JS API:  Wiki.open("economy"), Wiki.setLang("en"), Wiki.search("tank")  */
(function () {
  "use strict";
  const DB = window.WIKI_DATA;
  const D = DB.data;
  const $ = (s, r = document) => r.querySelector(s);
  const params = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } },
  };

  // ---- dil -----------------------------------------------------------------------------------
  const UI = {
    tr: { search: "Wiki'de ara…  ( / )", noresult: "Sonuç yok", home: "Ana sayfa", prev: "Önceki", next: "Sonraki",
      sub: "Oyun rehberi", updated: "Veri oyun dosyalarından üretildi", name: "Ad", cost: "Maliyet", months: "Süre (ay)", jobs: "İstihdam",
      output: "Çıktı", inputs: "Girdiler", category: "Kategori", effect: "Etki", requires: "Gerektirir", tier: "Kademe", all: "Tümü",
      filter: "Filtrele…", country: "Ülke", gdp: "GSYİH", pop: "Nüfus", gdppc: "Kişi başı", military: "Asker", states: "Eyalet",
      area: "Alan", infl: "Enflasyon", unemp: "İşsizlik", growth: "Büyüme", shown: "gösterilen", scope: "Kapsam", world: "Dünya", any: "Genel",
      options: "Seçenekler", range: "Aralık", kind: "Tür", group: "Grup", section: "Bölüm", slider: "Kaydırıcı", toggle: "Anahtar", action: "Eylem", choice: "Seçim",
      price: "Birim maliyet", unit: "Birim", men: "Asker", equip: "Ekipman", attack: "Saldırı", hp: "Dayanıklılık", share: "Pay",
      duration: "Süre", months_s: "ay", unlimited: "süresiz", directed: "Tek yönlü", mutual: "Karşılıklı", proposable: "Teklif edilebilir",
      obligation: "Yükümlülük", breach: "İhlal", ideology: "İdeoloji (ekonomi · değerler · ulusalcılık)", theme: "Tema", top: "Başa dön",
      onlyTr: "Bu sayfanın anlatım metni Türkçe ve İngilizce hazırlandı; tablolardaki oyun verisi seçili dilde (oyunun çeviri tablolarından) gösterilir." },
    en: { search: "Search the wiki…  ( / )", noresult: "No results", home: "Home", prev: "Previous", next: "Next",
      sub: "Game guide", updated: "Data generated from the game files", name: "Name", cost: "Cost", months: "Time (months)", jobs: "Jobs",
      output: "Output", inputs: "Inputs", category: "Category", effect: "Effect", requires: "Requires", tier: "Tier", all: "All",
      filter: "Filter…", country: "Country", gdp: "GDP", pop: "Population", gdppc: "Per capita", military: "Troops", states: "States",
      area: "Area", infl: "Inflation", unemp: "Unemployment", growth: "Growth", shown: "shown", scope: "Scope", world: "World", any: "Generic",
      options: "Options", range: "Range", kind: "Type", group: "Group", section: "Section", slider: "Slider", toggle: "Toggle", action: "Action", choice: "Choice",
      price: "Unit cost", unit: "Unit", men: "Men", equip: "Equipment", attack: "Attack", hp: "Durability", share: "Share",
      duration: "Duration", months_s: "mo", unlimited: "unlimited", directed: "One-way", mutual: "Mutual", proposable: "Can be proposed",
      obligation: "Obligation", breach: "Breach", ideology: "Ideology (economy · values · nationalism)", theme: "Theme", top: "Back to top",
      onlyTr: "" },
  };
  let lang = params.get("lang") || store.get("hw_lang") || "en";
  const langOf = (c) => DB.langs.find((l) => l.code === c || l.code.slice(0, 2) === c);
  lang = (langOf(lang) || langOf("en")).code;

  const ui = (k) => (UI[lang] || UI.en)[k] ?? UI.en[k] ?? UI.tr[k] ?? k;
  /** Oyun verisindeki Türkçe metni seçili dile çevirir (oyunun kendi çeviri tabloları). */
  const t = (s) => {
    if (s == null || lang === "tr") return s;
    return (DB.tx[lang] && DB.tx[lang][s]) || (DB.tx.en && DB.tx.en[s]) || s;
  };
  /** Düzyazı: {tr, en}. Diğer dillerde İngilizce. */
  const p = (o) => (typeof o === "string" ? o : (o[lang] ?? (lang === "tr" ? o.tr : o.en ?? o.tr)));
  /** Türkçe `name` + isteğe bağlı `en` alanı olan nesne adı. */
  const nm = (o, key = "name") => {
    if (lang === "tr") return o[key];
    return (DB.tx[lang] && DB.tx[lang][o[key]]) || o.en || (DB.tx.en && DB.tx.en[o[key]]) || o[key];
  };
  const langIdx = () => (langOf(lang) || {}).idx || 0;
  const cname = (c) => (c.n ? c.n[langIdx()] || c.n[1] : c.en);

  // ---- biçimlendirme -------------------------------------------------------------------------
  const loc = () => ({ tr: "tr-TR", en: "en-US", zh_CN: "zh-CN", ru: "ru-RU", es: "es-ES", pt: "pt-BR", de: "de-DE", fr: "fr-FR", ja: "ja-JP" })[lang] || "en-US";
  const num = (n, d = 0) => (n == null || isNaN(n) ? "—" : new Intl.NumberFormat(loc(), { maximumFractionDigits: d, minimumFractionDigits: d }).format(n));
  const compact = (n, pre = "", suf = "") => {
    if (!n) return "—";
    return pre + new Intl.NumberFormat(loc(), { notation: "compact", maximumFractionDigits: 1 }).format(n) + suf;
  };
  const pct = (x, d = 1) => num(x * 100, d) + "%";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const money = (n) => num(n, n < 10 ? 2 : n < 100 ? 1 : 0);

  // ---- bileşenler ----------------------------------------------------------------------------
  const W = {
    D, DB, ui, t, p, nm, cname, num, compact, pct, esc, money,
    get lang() { return lang; },
    h2: (id, s) => `<h2 id="${id}">${esc(s)}</h2>`,
    shot: (f, cap) => `<figure class="shot"><img loading="lazy" src="assets/screens/${f}" alt="${esc(p(cap))}"><figcaption>${esc(p(cap))}</figcaption></figure>`,
    note: (h) => `<div class="note">${h}</div>`,
    tip: (h) => `<div class="tip">${h}</div>`,
    warn: (h) => `<div class="warn">${h}</div>`,
    table(head, rows, opt = {}) {
      const th = head.map((h, i) => `<th class="${(opt.num || []).includes(i) ? "n" : ""}">${h}</th>`).join("");
      const tr = rows.map((r) => `<tr${r.id ? ` id="${esc(r.id)}"` : ""}>${(r.cells || r).map((c, i) => `<td class="${(opt.num || []).includes(i) ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("");
      return `<div class="tbl"><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
    },
    grid: (items) => `<div class="grid">${items.map((i) => `<a class="card" href="${i.href}"><b>${esc(i.title)}</b><p>${esc(i.desc)}</p></a>`).join("")}</div>`,
    flag: (c) => (c.flag ? `<img class="flag" loading="lazy" src="assets/flags/${esc(c.tag)}.png" alt="">` : ""),
    good: (id) => { const g = D.industry.goods.find((x) => x.id === id); return g ? esc(t(g.name)) : esc(id); },
    building: (id) => { const b = D.industry.buildings.find((x) => x.id === id); return b ? esc(t(b.name)) : esc(id); },
    pill: (s, acc) => `<span class="pill${acc ? " acc" : ""}">${esc(s)}</span>`,
    pager(i) {
      const pv = PAGES[i - 1], nx = PAGES[i + 1];
      return `<div class="pager">${pv ? `<a href="#/${pv.id}"><small>← ${esc(ui("prev"))}</small>${esc(p(pv.title))}</a>` : "<span></span>"}${nx ? `<a href="#/${nx.id}"><small>${esc(ui("next"))} →</small>${esc(p(nx.title))}</a>` : ""}</div>`;
    },
    /** Süzülebilir / sıralanabilir tablo (olay ve ülke sayfaları için). */
    live(id, head, rows, opt = {}) {
      LIVE[id] = { head, rows, opt, sort: opt.sort ?? -1, dir: opt.dir ?? -1, q: "" };
      return `<div class="filters"><input data-live="${id}" placeholder="${esc(ui("filter"))}"><span class="pill" id="${id}-count"></span></div><div id="${id}-box"></div>`;
    },
  };
  const LIVE = {};
  const norm = (s) => String(s).toLocaleLowerCase(loc()).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

  function drawLive(id) {
    const L = LIVE[id], box = $("#" + id + "-box");
    if (!L || !box) return;
    let rows = L.rows.filter((r) => !L.q || norm(r.key).includes(L.q));
    if (L.sort >= 0) rows = [...rows].sort((a, b) => {
      const x = a.sortv[L.sort], y = b.sortv[L.sort];
      return (typeof x === "string" ? x.localeCompare(y, loc()) : (x ?? -Infinity) - (y ?? -Infinity)) * L.dir;
    });
    const limit = L.opt.limit || 400;
    const th = L.head.map((h, i) => `<th class="sort ${(L.opt.num || []).includes(i) ? "n" : ""}" data-i="${i}">${h}${L.sort === i ? (L.dir > 0 ? " ▲" : " ▼") : ""}</th>`).join("");
    box.innerHTML = `<div class="tbl"><table><thead><tr>${th}</tr></thead><tbody>${rows.slice(0, limit).map((r) => `<tr>${r.cells.map((c, i) => `<td class="${(L.opt.num || []).includes(i) ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    $("#" + id + "-count").textContent = rows.length + " " + ui("shown");
    box.querySelectorAll("th.sort").forEach((el) => el.addEventListener("click", () => {
      const i = +el.dataset.i;
      if (L.sort === i) L.dir *= -1; else { L.sort = i; L.dir = (L.opt.num || []).includes(i) ? -1 : 1; }
      drawLive(id);
    }));
  }

  // ---- sayfalar ve yönlendirme ---------------------------------------------------------------
  const PAGES = window.WikiPages || [];
  const GROUPS = window.WikiGroups || {};
  W.PAGES = PAGES;

  function renderNav(cur) {
    let last = "", h = "";
    for (const pg of PAGES) {
      if (pg.group !== last) { last = pg.group; h += `<h4>${esc(p(GROUPS[pg.group] || { tr: pg.group, en: pg.group }))}</h4>`; }
      h += `<a href="#/${pg.id}" class="${pg.id === cur ? "on" : ""}"><i>${pg.icon || "•"}</i>${esc(p(pg.title))}</a>`;
    }
    $("#side").innerHTML = h;
  }

  function route() {
    const m = location.hash.replace(/^#\/?/, "").split("/");
    const id = m[0] || "home", anchor = m[1];
    let idx = PAGES.findIndex((x) => x.id === id);
    if (idx < 0) idx = 0;
    const pg = PAGES[idx];
    document.title = p(pg.title) + " · Heritage Wiki";
    renderNav(pg.id);
    $("#page").innerHTML = `<div class="crumb">${esc(p(GROUPS[pg.group] || { tr: "", en: "" }))}</div>` + pg.render(W) + W.pager(idx) +
      `<div class="foot">${esc(ui("updated"))} · ${esc(DB.generated.slice(0, 10))}${lang !== "tr" && lang !== "en" ? "<br>" + esc(ui("onlyTr")) : ""}</div>`;
    document.body.classList.remove("menu");
    for (const id of Object.keys(LIVE)) { drawLive(id); }
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("hl"); setTimeout(() => el.classList.remove("hl"), 2400); }
    } else window.scrollTo(0, 0);
    try { window.parent !== window && window.parent.postMessage({ type: "heritage-wiki", page: pg.id }, "*"); } catch (e) { /* yok say */ }
  }

  // ---- arama ---------------------------------------------------------------------------------
  let INDEX = [];
  function buildIndex() {
    const ix = [];
    const add = (label, page, anchor, kind, extra = "") => ix.push({ label, page, anchor, kind, key: norm(label + " " + extra) });
    for (const pg of PAGES) add(p(pg.title), pg.id, "", "", pg.keywords ? p(pg.keywords) : "");
    for (const x of D.research.techs) add(nm(x), "research", x.id, t0("Teknoloji", "Technology"), x.name + " " + x.en);
    for (const x of D.industry.buildings) add(t(x.name), "industry", x.id, t0("Tesis", "Facility"), x.name);
    for (const x of D.industry.goods) add(t(x.name), "industry", "goods", t0("Mal", "Good"), x.name);
    for (const x of D.military.units) add(t(x.name), "military", "u_" + x.id, t0("Birlik", "Unit"), x.name);
    for (const x of D.military.equipment) add(t(x.name), "military", "e_" + x.id, t0("Ekipman", "Equipment"), x.name);
    for (const x of D.naval.ships) add(nm(x), "navy", "s_" + x.id, t0("Gemi", "Ship"), x.name + " " + x.en);
    for (const x of D.air.missions) add(nm(x), "air", "m_" + x.id, t0("Hava görevi", "Air mission"), x.name + " " + x.en);
    for (const x of D.diplomacy.treaties) add(t(x.name), "diplomacy", "t_" + x.id, t0("Anlaşma", "Treaty"), x.name);
    for (const x of D.politics.parties) add(nm(x), "politics", "p_" + x.id, t0("Parti", "Party"), x.name + " " + x.en);
    for (const x of D.policies.list) add(t(x.label), "policies", "po_" + x.id, t0("Politika", "Policy"), x.label);
    for (const x of D.events) add(lang === "tr" ? x.title : (x.en_title || x.title), "events", "ev_" + x.id, t0("Olay", "Event"), x.title + " " + x.en_title);
    for (const c of D.countries) add(cname(c), "countries", "c_" + c.tag, t0("Ülke", "Country"), (c.n || []).join(" ") + " " + c.en + " " + c.tag);
    INDEX = ix;
  }
  const t0 = (tr, en) => (lang === "tr" ? tr : en);

  function doSearch(q) {
    const box = $("#results");
    q = norm(q.trim());
    if (!q) { box.classList.remove("on"); return; }
    const rs = INDEX.filter((x) => x.key.includes(q)).sort((a, b) => (a.key.startsWith(q) ? 0 : 1) - (b.key.startsWith(q) ? 0 : 1)).slice(0, 14);
    box.innerHTML = rs.length ? rs.map((r) => `<a href="#/${r.page}${r.anchor ? "/" + r.anchor : ""}"><span>${esc(r.label)}</span><small>${esc(r.kind)}</small></a>`).join("") : `<a><span>${esc(ui("noresult"))}</span></a>`;
    box.classList.add("on");
    return rs;
  }

  // ---- başlatma ------------------------------------------------------------------------------
  function applyLang() {
    document.documentElement.lang = lang.replace("_", "-");
    $("#q").placeholder = ui("search");
    $("#subtitle").textContent = ui("sub");
    $("#theme").title = ui("theme");
    buildIndex();
  }
  function init() {
    if (params.get("embed")) document.body.classList.add("embed");
    const th = params.get("theme") || store.get("hw_theme");
    if (th) document.documentElement.dataset.theme = th;

    const sel = $("#lang");
    sel.innerHTML = DB.langs.map((l) => `<option value="${l.code}">${esc(l.name)}</option>`).join("");
    sel.value = lang;
    sel.onchange = () => W.setLang(sel.value);
    $("#theme").onclick = () => {
      const n = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = n; store.set("hw_theme", n);
    };
    $("#menuBtn").onclick = () => document.body.classList.toggle("menu");
    const q = $("#q");
    q.addEventListener("input", () => doSearch(q.value));
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const a = $("#results a"); if (a && a.getAttribute("href")) { location.hash = a.getAttribute("href"); q.value = ""; q.blur(); $("#results").classList.remove("on"); } }
      if (e.key === "Escape") { q.value = ""; q.blur(); $("#results").classList.remove("on"); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search")) $("#results").classList.remove("on");
      else if (e.target.closest("#results a")) { $("#results").classList.remove("on"); q.value = ""; }
      const img = e.target.closest(".shot img");
      if (img) { const lb = $("#lightbox"); lb.firstElementChild.src = img.src; lb.classList.add("on"); }
      if (e.target.closest("#lightbox")) $("#lightbox").classList.remove("on");
    });
    document.addEventListener("input", (e) => {
      const id = e.target.dataset && e.target.dataset.live;
      if (id && LIVE[id]) { LIVE[id].q = norm(e.target.value); drawLive(id); }
    });
    window.addEventListener("hashchange", route);
    window.addEventListener("message", (e) => {
      const d = e.data || {};
      if (d.type === "heritage-wiki-open") W.open(d.page, d.anchor);
      if (d.type === "heritage-wiki-lang") W.setLang(d.lang);
    });
    applyLang();
    route();
  }

  W.setLang = (c) => {
    lang = (langOf(c) || langOf("en")).code; store.set("hw_lang", lang);
    $("#lang").value = lang; applyLang();
    for (const k of Object.keys(LIVE)) delete LIVE[k];
    route();
  };
  W.open = (page, anchor) => { location.hash = "#/" + page + (anchor ? "/" + anchor : ""); };
  W.search = (q) => { const r = doSearch(q); return r; };
  window.Wiki = W;
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
