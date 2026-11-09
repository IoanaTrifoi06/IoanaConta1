/* Căsuța de pe Maluri — shared behaviour (i18n, header/footer, animations, carousel, gallery, FAQ) */
(function () {
  "use strict";
  var C = window.CONFIG, T = window.T, LANGS = window.LANGS;
  var LANG_NAMES = { ro: "Română", en: "English", fr: "Français", de: "Deutsch" };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────── icons ───────── */
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l11 7-11 7z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.7 7L3 21l2-5.6A8 8 0 1 1 21 12z"/></svg>',
    church: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5M10 4.5h4M8 22V12l4-5 4 5v10M4 22h16M12 22v-5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M6 9h12M5 21h14"/></svg>',
    train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="13" rx="2"/><path d="M5 11h14M9 21l-2 0M15 21h2M8 17l-1 4M16 17l1 4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>',
    gate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V8M20 21V8M2 8l10-5 10 5M4 21h16M4 14c4 0 4-6 8-6s4 6 8 6"/></svg>',
    diamond: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l7 9-7 9-7-9z"/></svg>'
  };
  window.__icons = I;

  /* ───────── i18n ───────── */
  function detect() {
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && LANGS.indexOf(q) > -1) return q;
      var s = localStorage.getItem("lang");
      if (s && LANGS.indexOf(s) > -1) return s;
    } catch (e) {}
    var n = (navigator.language || "ro").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) > -1 ? n : "ro";
  }
  var lang = detect();
  function fill(s) {
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      var map = { checkin: C.checkin, checkout: C.checkout, phone: C.phone, email: C.email };
      return map[k] != null ? map[k] : m;
    });
  }
  function t(key, vars) {
    var e = T[key]; if (!e) return key;
    var s = fill(e[LANGS.indexOf(lang)] || e[1] || key);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  window.t = t;
  window.getLang = function () { return lang; };

  function apply() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    ["alt", "placeholder", "title", "aria-label", "content"].forEach(function (a) {
      $$("[data-i18n-" + a + "]").forEach(function (el) { el.setAttribute(a, t(el.getAttribute("data-i18n-" + a))); });
    });
    var tk = document.body.getAttribute("data-title");
    if (tk) document.title = t(tk);
    var cur = $(".lang-cur"); if (cur) cur.textContent = lang.toUpperCase();
    $$(".lang li button").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.lang === lang); });
    $$("[data-tel]").forEach(function (a) { a.href = "tel:" + C.phoneHref; });
    $$("[data-phone]").forEach(function (el) { el.textContent = C.phone; });
    $$("[data-email]").forEach(function (el) { el.textContent = C.email; });
    $$("[data-mailto]").forEach(function (a) { a.href = "mailto:" + C.email; });
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    if (reduce) return apply();
    document.body.classList.add("is-swapping");
    setTimeout(function () { apply(); document.body.classList.remove("is-swapping"); }, 180);
  }

  /* ───────── shell: header / footer ───────── */
  var page = document.body.getAttribute("data-page") || "home";
  var logo = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 19 20 5l16 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18v16h24V18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 12l4 4-4 4-4-4z" fill="#b3202a"/><path d="M15 34v-8h10v8" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>';
  function nav(href, key, id) {
    return '<a class="link" href="' + href + '" data-i18n="' + key + '"' + (page === id ? ' aria-current="page"' : "") + "></a>";
  }
  var header = $("#site-header");
  if (header) {
    header.outerHTML =
      '<a class="skip" href="#main" data-i18n="skip"></a><div class="progress" aria-hidden="true"><i></i></div>' +
      '<header class="header" id="hdr"><div class="container">' +
      '<a class="brand" href="index.html" aria-label="' + C.name + '">' + logo + "<span><b>" + C.name + '</b><small data-i18n="brand.sub"></small></span></a>' +
      '<nav class="nav" id="nav" aria-label="Main">' + nav("index.html", "nav.home", "home") + nav("maramures.html", "nav.area", "area") + nav("contact.html", "nav.contact", "contact") + "</nav>" +
      '<div class="header-actions">' +
      '<div class="lang" id="lang"><button type="button" aria-haspopup="listbox" aria-expanded="false" data-i18n-aria-label="nav.lang"><span class="lang-cur"></span>' + I.down + '</button><ul role="listbox">' +
      LANGS.map(function (l) { return '<li><button type="button" role="option" aria-checked="false" data-lang="' + l + '"><span>' + LANG_NAMES[l] + "</span><span>" + l.toUpperCase() + "</span></button></li>"; }).join("") +
      "</ul></div>" +
      '<a class="btn btn--red btn--sm" href="booking.html"><span data-i18n="nav.book"></span>' + I.arrow + "</a>" +
      '<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" data-i18n-aria-label="nav.menu"><i></i><i></i><i></i></button>' +
      "</div></div></header>";
  }
  var footer = $("#site-footer");
  if (footer) {
    footer.outerHTML =
      '<footer class="footer"><div class="container">' +
      '<div class="f-cta"><strong data-i18n="footer.cta"></strong><a class="btn btn--red btn--sm" href="booking.html"><span data-i18n="nav.book"></span>' + I.arrow + "</a></div>" +
      '<nav class="f-links" aria-label="Footer"><a href="index.html" data-i18n="nav.home"></a><a href="maramures.html" data-i18n="nav.area"></a><a href="contact.html" data-i18n="nav.contact"></a><a href="booking.html" data-i18n="nav.book"></a></nav>' +
      '<div class="legal"><span>© ' + new Date().getFullYear() + " " + C.name + ' · <span data-i18n="footer.rights"></span></span><span data-i18n="footer.tag"></span></div>' +
      '</div></footer><button class="to-top" id="toTop" type="button" data-i18n-aria-label="toTop">' + I.up + "</button>";
  }

  /* ───────── header behaviour ───────── */
  var hdr = $("#hdr"), bar = $(".progress i"), toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (hdr) hdr.classList.toggle("is-solid", y > 40);
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    if (toTop) toTop.classList.toggle("is-show", y > 700);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  var burger = $("#burger"), navEl = $("#nav");
  function menu(open) {
    if (!burger) return;
    burger.setAttribute("aria-expanded", open); navEl.classList.toggle("is-open", open);
    hdr.classList.toggle("menu-open", open); document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) {
    burger.addEventListener("click", function () { menu(burger.getAttribute("aria-expanded") !== "true"); });
    $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  }
  var langEl = $("#lang");
  if (langEl) {
    var langBtn = $("button", langEl);
    langBtn.addEventListener("click", function (e) { e.stopPropagation(); var o = !langEl.classList.contains("is-open"); langEl.classList.toggle("is-open", o); langBtn.setAttribute("aria-expanded", o); });
    $$("li button", langEl).forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); langEl.classList.remove("is-open"); langBtn.setAttribute("aria-expanded", false); }); });
    document.addEventListener("click", function () { langEl.classList.remove("is-open"); langBtn.setAttribute("aria-expanded", false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { menu(false); if (langEl) langEl.classList.remove("is-open"); }
  });

  /* page transitions */
  $$("a[href]").forEach(function (a) {
    var h = a.getAttribute("href");
    if (!/^[\w-]+\.html(\?.*)?$/.test(h) || reduce) return;
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
      e.preventDefault(); document.body.classList.add("is-leaving");
      setTimeout(function () { location.href = h; }, 220);
    });
  });
  addEventListener("pageshow", function () { document.body.classList.remove("is-leaving"); });

  /* ───────── reveal on scroll + count-up ───────── */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  $$(".reveal").forEach(function (el) { io ? io.observe(el) : el.classList.add("is-in"); });

  var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; cio.unobserve(en.target);
      var el = en.target, to = +el.dataset.count, t0 = performance.now(), d = 1400;
      if (reduce || !to) { el.textContent = to; return; }
      (function tick(now) { var p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: 0.6 }) : null;
  $$("[data-count]").forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.dataset.count); });

  /* tile spotlight */
  $$(".tile").forEach(function (el) {
    el.addEventListener("pointermove", function (e) { var r = el.getBoundingClientRect(); el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px"); });
  });

  /* ───────── carousel ───────── */
  $$("[data-carousel]").forEach(function (root) {
    var slides = $$(".slide", root), dots = $(".dots", root), capEl = $(".hero-cap span", root);
    var cur = 0, dur = 6000, timer, playing = !reduce, startX = null;
    root.style.setProperty("--dur", dur + "ms");
    slides.forEach(function (s, i) {
      var b = document.createElement("button"); b.type = "button"; b.innerHTML = "<i></i>";
      b.addEventListener("click", function () { go(i, true); }); dots.appendChild(b);
    });
    function label() { return t("car.goto"); }
    function go(i, user) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === cur); s.setAttribute("aria-hidden", k !== cur); });
      $$("button", dots).forEach(function (b, k) { b.classList.remove("is-active"); void b.offsetWidth; b.classList.toggle("is-active", k === cur); b.setAttribute("aria-label", label() + " " + (k + 1)); b.setAttribute("aria-current", k === cur); });
      if (capEl) { capEl.textContent = t(slides[cur].dataset.cap); capEl.setAttribute("data-i18n", slides[cur].dataset.cap); }
      restart();
    }
    function restart() { clearTimeout(timer); if (playing && !root.classList.contains("is-paused")) timer = setTimeout(function () { go(cur + 1); }, dur); }
    function setPlay(p) { playing = p; root.classList.toggle("no-auto", !p); var pb = $(".pp", root); if (pb) pb.innerHTML = p ? I.pause : I.play; go(cur); }
    $(".prev", root).addEventListener("click", function () { go(cur - 1, true); });
    $(".next", root).addEventListener("click", function () { go(cur + 1, true); });
    $(".pp", root).addEventListener("click", function () { setPlay(!playing); });
    root.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { root.classList.add("is-paused"); clearTimeout(timer); } });
    root.addEventListener("pointerleave", function () { root.classList.remove("is-paused"); restart(); });
    root.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) { if (startX == null) return; var dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1), true); startX = null; });
    document.addEventListener("keydown", function (e) { if (document.querySelector(".lightbox.is-open")) return; if (e.key === "ArrowLeft") go(cur - 1, true); if (e.key === "ArrowRight") go(cur + 1, true); });
    document.addEventListener("visibilitychange", function () { document.hidden ? clearTimeout(timer) : restart(); });
    $(".prev", root).innerHTML = I.left; $(".next", root).innerHTML = I.right; $(".pp", root).innerHTML = playing ? I.pause : I.play;
    root.classList.toggle("no-auto", !playing);
    document.addEventListener("langchange", function () { go(cur); });
    go(0);
  });

  /* ───────── seasons gallery + lightbox ───────── */
  var SEASONS = {
    spring: ["sheep-house", "hottub-day", "lawn-loungers", "hottub-night", "hottub-loungers", "house-glow"],
    summer: ["summer-a", "summer-b", "summer-c", "summer-d", "summer-e", "summer-f"],
    autumn: ["autumn-a", "autumn-sunflowers", "lanterns", "porch-hammock", "bonfire", "cocktails"],
    winter: ["winter-a", "winter-b", "winter-c", "winter-d", "winter-e", "winter-f"]
  };
  var lb = { el: null, list: [], i: 0 };
  function lbBuild() {
    var d = document.createElement("div"); d.className = "lightbox"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = '<button class="arrow close" type="button">' + I.x + '</button><button class="arrow prev" type="button">' + I.left + '</button><figure><img alt=""><figcaption></figcaption></figure><button class="arrow next" type="button">' + I.right + "</button>";
    document.body.appendChild(d); lb.el = d;
    d.addEventListener("click", function (e) { if (e.target === d) lbClose(); });
    $(".close", d).addEventListener("click", lbClose);
    $(".prev", d).addEventListener("click", function () { lbShow(lb.i - 1); });
    $(".next", d).addEventListener("click", function () { lbShow(lb.i + 1); });
    var sx = null;
    d.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    d.addEventListener("touchend", function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) lbShow(lb.i + (dx < 0 ? 1 : -1)); sx = null; });
    document.addEventListener("keydown", function (e) { if (!d.classList.contains("is-open")) return; if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lbShow(lb.i - 1); if (e.key === "ArrowRight") lbShow(lb.i + 1); });
  }
  function lbShow(i) {
    lb.i = (i + lb.list.length) % lb.list.length; var it = lb.list[lb.i];
    $("img", lb.el).src = it.src; $("img", lb.el).alt = it.alt; $("figcaption", lb.el).textContent = it.alt + "  ·  " + (lb.i + 1) + " / " + lb.list.length;
  }
  function lbOpen(list, i) {
    if (!lb.el) lbBuild(); lb.list = list; lbShow(i);
    $(".close", lb.el).setAttribute("aria-label", t("lb.close")); lb.el.classList.add("is-open"); document.body.style.overflow = "hidden"; $(".close", lb.el).focus();
  }
  function lbClose() { lb.el.classList.remove("is-open"); document.body.style.overflow = ""; }

  $$("[data-seasons]").forEach(function (root) {
    var tabs = $(".tabs", root), panes = $(".panes", root), keys = Object.keys(SEASONS), cur = "spring";
    keys.forEach(function (k) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.dataset.k = k; b.setAttribute("data-i18n", "season." + k);
      b.addEventListener("click", function () { show(k); }); tabs.appendChild(b);
      var g = document.createElement("div"); g.className = "gallery"; g.dataset.k = k; g.setAttribute("role", "tabpanel"); g.hidden = true;
      SEASONS[k].forEach(function (n, i) {
        var bt = document.createElement("button"); bt.type = "button"; bt.style.setProperty("--i", i);
        var im = new Image(); im.loading = "lazy"; im.decoding = "async"; im.src = "assets/img/" + n + ".jpg"; im.alt = ""; bt.appendChild(im);
        bt.addEventListener("click", function () { lbOpen(SEASONS[k].map(function (m) { return { src: "assets/img/" + m + ".jpg", alt: t("season." + k) + " · " + C.name }; }), i); });
        g.appendChild(bt);
      });
      panes.appendChild(g);
    });
    function show(k) {
      cur = k;
      $$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.k === k); });
      $$(".gallery", panes).forEach(function (g) {
        var on = g.dataset.k === k; g.hidden = !on;
        if (on) $$("button", g).forEach(function (bt) { bt.style.animation = "none"; void bt.offsetWidth; bt.style.animation = ""; });
      });
    }
    function alts() { $$(".gallery", panes).forEach(function (g) { $$("img", g).forEach(function (im) { im.alt = t("season." + g.dataset.k) + " · " + C.name; }); }); }
    document.addEventListener("langchange", alts); show(cur); alts();
  });

  /* ───────── generic tabs ───────── */
  $$("[data-tabs]").forEach(function (root) {
    var btns = $$("[role=tab]", root), panels = $$("[role=tabpanel]", root);
    function sel(i) { btns.forEach(function (b, k) { b.setAttribute("aria-selected", k === i); b.tabIndex = k === i ? 0 : -1; }); panels.forEach(function (p, k) { p.hidden = k !== i; }); }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { sel(i); });
      b.addEventListener("keydown", function (e) { var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { var n = (i + d + btns.length) % btns.length; sel(n); btns[n].focus(); } });
    }); sel(0);
  });

  /* ───────── FAQ ───────── */
  $$("[data-faq]").forEach(function (root) {
    var n = +root.dataset.faq, list = $(".faq-list", root), search = $("input", root), none = $(".faq-none", root);
    for (var i = 1; i <= n; i++) {
      var d = document.createElement("div"); d.className = "qa reveal"; d.style.setProperty("--d", Math.min(i, 5));
      d.innerHTML = '<h3><button type="button" aria-expanded="false" aria-controls="ans' + i + '"><span data-i18n="q' + i + '"></span><i></i></button></h3><div class="ans" id="ans' + i + '" role="region"><div><p data-i18n="a' + i + '"></p></div></div>';
      list.appendChild(d); io ? io.observe(d) : d.classList.add("is-in");
      (function (qa) {
        $("button", qa).addEventListener("click", function () {
          var open = !qa.classList.contains("is-open");
          $$(".qa.is-open", list).forEach(function (o) { if (o !== qa) { o.classList.remove("is-open"); $("button", o).setAttribute("aria-expanded", false); } });
          qa.classList.toggle("is-open", open); $("button", qa).setAttribute("aria-expanded", open);
        });
      })(d);
    }
    function filter() {
      var q = (search.value || "").trim().toLowerCase(), shown = 0;
      $$(".qa", list).forEach(function (qa, k) {
        var txt = (t("q" + (k + 1)) + " " + t("a" + (k + 1))).toLowerCase(), ok = !q || txt.indexOf(q) > -1;
        qa.hidden = !ok; if (ok) shown++;
      });
      none.hidden = shown > 0;
    }
    search.addEventListener("input", filter); document.addEventListener("langchange", filter);
  });

  /* ───────── sticky TOC highlight ───────── */
  var toc = $(".toc");
  if (toc && "IntersectionObserver" in window) {
    var links = $$("a", toc), secs = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); }); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach(function (s) { tio.observe(s); });
  }

  /* ───────── quick booking bar (home) ───────── */
  var qb = $("#quickbook");
  if (qb) {
    var ci = $("[name=checkin]", qb), co = $("[name=checkout]", qb), gs = $("[name=guests]", qb);
    var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    var today = new Date(); ci.min = iso(today);
    for (var g = 1; g <= (C.maxGuests || 10); g++) { var o = document.createElement("option"); o.value = g; o.textContent = g; gs.appendChild(o); }
    gs.value = 2;
    ci.addEventListener("change", function () {
      var d = new Date(ci.value + "T00:00"); d.setDate(d.getDate() + 1); co.min = iso(d);
      if (!co.value || co.value <= ci.value) co.value = iso(d);
    });
    qb.addEventListener("submit", function (e) {
      e.preventDefault(); var p = new URLSearchParams();
      if (ci.value) p.set("checkin", ci.value); if (co.value) p.set("checkout", co.value); p.set("guests", gs.value);
      location.href = "booking.html?" + p.toString();
    });
  }

  /* ───────── contact form ───────── */
  var cf = $("#contactForm");
  if (cf) {
    var ok = $(".msg.ok", cf), er = $(".msg.err", cf);
    cf.addEventListener("submit", function (e) {
      e.preventDefault(); ok.hidden = er.hidden = true;
      var f = new FormData(cf), bad = false;
      ["name", "email", "message"].forEach(function (k) { var el = cf.elements[k], v = !String(f.get(k) || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(f.get(k))); el.classList.toggle("is-bad", v); bad = bad || v; });
      if (bad || !cf.elements.consent.checked || f.get("website")) { er.textContent = t("ct.err"); er.hidden = false; return; }
      var data = { name: f.get("name"), email: f.get("email"), phone: f.get("phone"), topic: f.get("topic"), message: f.get("message"), lang: lang };
      if (C.contactEndpoint) {
        fetch(C.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw 0; ok.textContent = t("ct.ok"); ok.hidden = false; cf.reset(); })
          .catch(function () { er.textContent = t("ct.err"); er.hidden = false; });
      } else {
        var body = data.message + "\n\n— " + data.name + (data.phone ? " · " + data.phone : "") + " · " + data.email;
        location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(C.name + " — " + data.topic) + "&body=" + encodeURIComponent(body);
        ok.textContent = t("ct.ok.mail"); ok.hidden = false;
      }
    });
  }

  /* map iframe (lazy) */
  var map = $("#map");
  if (map) { map.innerHTML = '<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + encodeURIComponent(C.mapQuery) + '&output=embed"></iframe>'; }

  /* inject icons into data-icon placeholders */
  $$("[data-icon]").forEach(function (el) { el.innerHTML = I[el.dataset.icon] || ""; });

  /* contact info hrefs */
  $$("[data-wa]").forEach(function (a) { if (C.whatsapp) a.href = "https://wa.me/" + C.whatsapp; else a.hidden = true; });

  document.body.classList.add("page-fade");
  apply();
})();
