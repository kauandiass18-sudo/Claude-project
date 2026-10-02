/* ==========================================================================
   OBARAKI · INTERFACE COMPARTILHADA
   Header, menu mobile, barra inferior, carrinho, modal de produto, busca,
   área do cliente, toast e renderização de cards.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.OBK.store;
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------- Utilidades ---------- */

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  var WA_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/></svg>';

  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></symbol>' +
    '<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/></symbol>' +
    '<symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1.1 11.2a2 2 0 0 1-2 1.8H8.1a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h10"/></symbol>' +
    '<symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>' +
    '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>' +
    '<symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>' +
    '<symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>' +
    '<symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>' +
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/></symbol>' +
    '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></symbol>' +
    '<symbol id="i-fish" viewBox="0 0 24 24"><path d="M2.5 12c2.8-4.4 8.4-6.2 13-3.4L20.5 5v14l-5-3.6c-4.6 2.8-10.2 1-13-3.4z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/><path d="M11.5 9.2c.8 1.8.8 3.8 0 5.6"/></symbol>' +
    '<symbol id="i-moto" viewBox="0 0 24 24"><circle cx="5.5" cy="16.5" r="2.8"/><circle cx="18.5" cy="16.5" r="2.8"/><path d="M8.3 16.5h6l2.6-6.5h-3.4l-2.2 3.2H5.5"/><path d="M13.5 6.5h2.8l2.2 10"/><path d="M3 9h5"/></symbol>' +
    '<symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.8h18M6.5 14.5h4"/></symbol>' +
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.3l1.4-4.4A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></symbol>' +
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>' +
    '<symbol id="i-trash" viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7"/></symbol>' +
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></symbol>' +
    '<symbol id="i-insta" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".7" fill="currentColor"/></symbol>' +
    '<symbol id="i-store" viewBox="0 0 24 24"><path d="M4 9.5l1.5-5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12.5V20h13v-7.5"/></symbol>' +
    '<symbol id="i-pix" viewBox="0 0 24 24"><path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/><path d="M8 8l4 4 4-4M8 16l4-4 4 4"/></symbol>' +
    '<symbol id="i-cash" viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></symbol>' +
    '<symbol id="i-repeat" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7M20 4v4.7h-4.7M20 12a8 8 0 0 1-13.7 5.6L4 15.3M4 20v-4.7h4.7"/></symbol>' +
    "</svg>";

  /* ---------- Formatação de preços ---------- */

  function priceHTML(p, opts) {
    var eff = S.price(p);
    if (eff === null) return '<span class="price-consult">Preço sob consulta</span>';
    var old = S.originalPrice(p);
    return (
      "<div>" +
      (old ? '<span class="price-old">' + S.money(old) + "</span>" : "") +
      '<span class="price"' +
      (opts && opts.gold ? ' style="color:var(--gold)"' : "") +
      ">" +
      S.money(eff) +
      "</span></div>"
    );
  }

  function kanjiFor(p) {
    var c = S.category(p.category);
    if (p.kind === "executivo") return "定食";
    return c && c.kanji ? c.kanji : "寿司";
  }

  function mediaHTML(src, alt, kanji, extra) {
    var inner = src
      ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" data-loading>'
      : '<div class="ph" aria-hidden="true"><div class="ph-mark"><span>' + esc(kanji) + "</span></div></div>";
    return inner + (extra || "");
  }

  function addButton(p, compact) {
    if (S.price(p) === null) {
      return (
        '<button class="btn-add btn-add--consult" data-consult="' +
        esc(p.id) +
        '" aria-label="Consultar ' +
        esc(p.name) +
        ' no WhatsApp">Consultar</button>'
      );
    }
    if (compact) {
      return (
        '<button class="btn-add btn-add--round" data-add="' +
        esc(p.id) +
        '" aria-label="Adicionar ' +
        esc(p.name) +
        '">' +
        icon("plus") +
        "</button>"
      );
    }
    return (
      '<button class="btn-add" data-add="' + esc(p.id) + '" aria-label="Adicionar ' + esc(p.name) + '">' + icon("plus") + '<span class="lbl">Adicionar</span></button>'
    );
  }

  function tagsHTML(p) {
    var promo = S.activePromo(p);
    if (!promo) return "";
    return '<div class="tags"><span class="tag tag-red">' + esc(promo.label || "Promoção") + "</span></div>";
  }

  function compHTML(p, limit) {
    var list = (p.composition || []).filter(Boolean);
    if (!list.length) return "";
    var shown = limit ? list.slice(0, limit) : list;
    var more = limit && list.length > limit ? '<li style="color:var(--muted)">+ ' + (list.length - limit) + " itens</li>" : "";
    return (
      '<ul class="pcard-comp">' +
      shown
        .map(function (x) {
          return "<li>" + esc(x) + "</li>";
        })
        .join("") +
      more +
      "</ul>"
    );
  }

  function metaText(p) {
    var parts = [];
    /* "Combo" não entra: todas as vitrines já são de combos. O rótulo dourado
       fica para o que informa algo (executivo, quantidade de peças). */
    if (p.kind === "executivo") parts.push("Executivo");
    if (p.quantity) parts.push(p.quantity);
    return parts.join(" · ");
  }

  /* Card padrão */
  function card(p, variant) {
    variant = variant || "";
    var showComp = variant === "combo" || variant === "feature";
    var desc = p.description ? '<p class="pcard-desc">' + esc(p.description) + "</p>" : "";
    return (
      '<article class="pcard ' +
      (variant ? "pcard--" + variant : "") +
      '" tabindex="0" data-open="' +
      esc(p.id) +
      '">' +
      '<div class="media">' +
      mediaHTML(p.image, p.name, kanjiFor(p), tagsHTML(p)) +
      "</div>" +
      '<div class="pcard-body">' +
      '<div class="pcard-meta">' +
      esc(metaText(p)) +
      "</div>" +
      '<h3 class="pcard-title">' +
      esc(p.name) +
      "</h3>" +
      desc +
      (showComp ? compHTML(p, 5) : "") +
      '<div class="pcard-foot">' +
      priceHTML(p) +
      addButton(p) +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function promoCard(entry) {
    var p = entry.product;
    /* Dentro do painel de promoções a etiqueta padrão "Promoção" é redundante;
       só mostramos rótulos personalizados (ex.: "Leve 2"). */
    var label = String(entry.promo.label || "").trim();
    var tag = label && label.toLowerCase() !== "promoção" ? '<div class="tags"><span class="tag tag-red">' + esc(label) + "</span></div>" : "";
    return (
      '<article class="promo-card" tabindex="0" data-open="' +
      esc(p.id) +
      '">' +
      '<div class="media">' +
      mediaHTML(p.image, p.name, kanjiFor(p), tag) +
      "</div>" +
      '<div class="promo-card-body">' +
      '<div class="pcard-meta">' +
      esc(metaText(p)) +
      "</div>" +
      "<h3>" +
      esc(p.name) +
      "</h3>" +
      '<div class="row">' +
      priceHTML(p, { gold: true }) +
      addButton(p, true) +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function execCard(p, i) {
    var desc = p.description ? '<p class="pcard-desc">' + esc(p.description) + "</p>" : "";
    return (
      '<article class="exec-card" tabindex="0" data-open="' +
      esc(p.id) +
      '">' +
      '<div class="media">' +
      mediaHTML(p.image, p.name, kanjiFor(p), tagsHTML(p)) +
      "</div>" +
      '<div class="exec-card-body">' +
      /* O nome já diz "Executivo N"; o rótulo mostra só a quantidade de peças. */
      (p.quantity ? '<div class="num">' + esc(p.quantity) + "</div>" : "") +
      "<h3>" +
      esc(p.name) +
      "</h3>" +
      desc +
      compHTML(p) +
      '<div class="row">' +
      priceHTML(p) +
      addButton(p) +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function menuRow(p) {
    var sub = [p.quantity, p.description].filter(Boolean).join(" · ");
    return (
      '<li class="menu-row" tabindex="0" data-open="' +
      esc(p.id) +
      '">' +
      '<div class="media">' +
      mediaHTML(p.image, p.name, kanjiFor(p)) +
      "</div>" +
      '<div class="menu-row-info"><h3>' +
      esc(p.name) +
      "</h3>" +
      (sub ? "<p>" + esc(sub) + "</p>" : "") +
      "</div>" +
      '<div class="right">' +
      priceHTML(p) +
      addButton(p, true) +
      "</div>" +
      "</li>"
    );
  }

  /* ---------- Layers (modais/drawers) com suporte ao botão voltar ---------- */

  var layers = [];
  var overlay;

  function openLayer(el, opts) {
    opts = opts || {};
    var opener = document.activeElement;
    hideToast();
    layers.push({ el: el, onClose: opts.onClose, opener: opener });
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    if (opts.overlay !== false) overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
    try {
      history.pushState({ obkLayer: layers.length }, "");
    } catch (e) {}
    setTimeout(function () {
      var f = opts.focus ? $(opts.focus, el) : $("[data-autofocus]", el) || $("button, a, input, textarea, select", el);
      if (f) f.focus({ preventScroll: true });
    }, 60);
  }

  function closeTop(fromPop) {
    var l = layers.pop();
    if (!l) return;
    l.el.classList.remove("is-open");
    l.el.setAttribute("aria-hidden", "true");
    var stillOverlay = layers.some(function (x) {
      return x.el.classList.contains("drawer") || x.el.classList.contains("modal");
    });
    if (!stillOverlay) overlay.classList.remove("is-open");
    if (!layers.length) document.body.classList.remove("is-locked");
    if (l.onClose) l.onClose();
    if (l.opener && l.opener.focus && document.body.contains(l.opener)) {
      try {
        l.opener.focus({ preventScroll: true });
      } catch (e) {}
    }
    if (!fromPop) {
      try {
        history.back();
      } catch (e) {}
    }
  }

  function closeLayer(el) {
    if (layers.length && layers[layers.length - 1].el === el) closeTop(false);
  }

  function closeAll(cb) {
    var n = layers.length;
    while (layers.length) closeTop(true);
    if (n) {
      try {
        history.go(-n);
      } catch (e) {}
      setTimeout(cb || function () {}, 80);
    } else if (cb) cb();
  }

  window.addEventListener("popstate", function () {
    if (layers.length) closeTop(true);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && layers.length) closeTop(false);
  });

  function goTo(url) {
    if (layers.length) {
      var n = layers.length;
      while (layers.length) closeTop(true);
      try {
        history.go(-n);
      } catch (e) {}
      setTimeout(function () {
        location.href = url;
      }, 120);
    } else {
      location.href = url;
    }
  }

  /* ---------- Toast ---------- */

  var toastEl, toastTimer;

  function toast(msg, action) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML =
      '<span class="ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="toast-msg">' +
      esc(msg) +
      "</span>" +
      (action ? "<button type=\"button\">" + esc(action.label) + "</button>" : "");
    if (action) {
      $("button", toastEl).onclick = function () {
        hideToast();
        action.run();
      };
    }
    requestAnimationFrame(function () {
      toastEl.classList.add("is-visible");
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3200);
  }

  function hideToast() {
    if (toastEl) toastEl.classList.remove("is-visible");
  }

  /* ---------- Links externos ---------- */

  function waHref(text) {
    return S.waLink(text);
  }

  function externalLink(kind) {
    var s = S.settings();
    if (kind === "instagram") return s.instagramUrl || "";
    if (kind === "ifood") return s.ifoodUrl || "";
    return "";
  }

  function linkAttrs(kind) {
    var url = externalLink(kind);
    if (url) return 'href="' + esc(url) + '" target="_blank" rel="noopener"';
    return 'href="#" data-missing="' + kind + '"';
  }

  /* ---------- Marca ---------- */

  function brandHTML() {
    var s = S.settings();
    if (s.logo) {
      return '<a class="brand" href="index.html" aria-label="' + esc(s.storeName) + ' — início"><img class="brand-logo" src="' + esc(s.logo) + '" alt="' + esc(s.storeName) + '"></a>';
    }
    return (
      '<a class="brand" href="index.html" aria-label="' +
      esc(s.storeName) +
      ' — início">' +
      '<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="20" fill="#c90016"/><circle cx="32" cy="32" r="26.5" fill="none" stroke="#c9a45c" stroke-width="1.3"/><text x="32" y="41" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="27" font-weight="700" fill="#fff">O</text></svg>' +
      '<span class="brand-word"><span class="brand-name">Obara<em>Ki</em></span><span class="brand-sub">Temakeria</span></span>' +
      "</a>"
    );
  }

  /* ---------- Header / menu / bottom nav / footer ---------- */

  function navItems() {
    var h = page === "home" ? "" : "index.html";
    return [
      { label: "Início", href: page === "home" ? "#inicio" : "index.html", key: "home", jp: "始" },
      { label: "Cardápio", href: "cardapio.html", key: "cardapio", jp: "品書" },
      { label: "Combos", href: h + "#combos", key: "combos", jp: "盛合" },
      { label: "Promoções", href: h + "#promocoes", key: "promocoes", jp: "特価" },
      { label: "Sobre nós", href: h + "#sobre", key: "sobre", jp: "店" },
      { label: "Contato", href: h + "#contato", key: "contato", jp: "連絡" }
    ];
  }

  function renderHeader() {
    var el = $("#site-header");
    if (!el) return;
    el.className = "site-header";
    el.innerHTML =
      '<div class="container">' +
      brandHTML() +
      '<nav class="nav" aria-label="Principal">' +
      navItems()
        .map(function (n) {
          return '<a href="' + n.href + '"' + (n.key === page ? ' class="is-active" aria-current="page"' : "") + ">" + n.label + "</a>";
        })
        .join("") +
      "</nav>" +
      '<div class="header-actions">' +
      '<button class="icon-btn only-desktop" data-action="search" aria-label="Buscar no cardápio">' +
      icon("search") +
      "</button>" +
      '<button class="icon-btn only-desktop" data-action="account" aria-label="Meus dados e pedidos">' +
      icon("user") +
      "</button>" +
      '<button class="icon-btn" data-action="cart" aria-label="Abrir carrinho">' +
      icon("bag") +
      '<span class="badge" data-cart-count hidden>0</span></button>' +
      '<button class="icon-btn only-mobile" data-action="menu" aria-label="Abrir menu" aria-expanded="false">' +
      icon("menu") +
      "</button>" +
      '<a class="btn btn-primary only-desktop" href="cardapio.html">Pedir agora</a>' +
      "</div>" +
      "</div>";

    var onScroll = function () {
      el.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function renderMobileMenu() {
    var m = document.createElement("div");
    m.className = "mobile-menu";
    m.id = "mobile-menu";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-label", "Menu");
    m.setAttribute("aria-hidden", "true");
    m.innerHTML =
      '<div class="mobile-menu-top">' +
      brandHTML() +
      '<button class="icon-btn" data-close aria-label="Fechar menu">' +
      icon("close") +
      "</button></div>" +
      "<nav>" +
      navItems()
        .map(function (n) {
          return '<a href="' + n.href + '">' + n.label + '<span class="jp">' + n.jp + "</span></a>";
        })
        .join("") +
      "</nav>" +
      '<div class="mobile-menu-foot">' +
      '<a class="btn btn-primary btn-block" href="cardapio.html">Pedir agora</a>' +
      '<div class="row">' +
      '<a class="btn btn-ghost" ' + linkAttrs("instagram") + ">" + icon("insta", "icon-sm") + "Instagram</a>" +
      '<button class="btn btn-ghost" data-action="account">' +
      icon("user", "icon-sm") +
      "Meus dados</button>" +
      "</div></div>";
    document.body.appendChild(m);
    $("[data-close]", m).onclick = function () {
      closeLayer(m);
    };
    $$("nav a", m).forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (href.charAt(0) === "#") {
          e.preventDefault();
          closeLayer(m);
          setTimeout(function () {
            var t = $(href);
            if (t) t.scrollIntoView({ behavior: "smooth" });
          }, 140);
        } else {
          e.preventDefault();
          goTo(href);
        }
      });
    });
  }

  function renderBottomNav() {
    if (page === "checkout") return;
    var nav = document.createElement("nav");
    nav.className = "bottom-nav";
    nav.setAttribute("aria-label", "Navegação rápida");
    nav.innerHTML =
      '<a href="index.html"' +
      (page === "home" ? ' class="is-active" aria-current="page"' : "") +
      ">" +
      icon("home") +
      "Início</a>" +
      '<a href="cardapio.html"' +
      (page === "cardapio" ? ' class="is-active" aria-current="page"' : "") +
      ">" +
      icon("book") +
      "Cardápio</a>" +
      '<button type="button" data-action="search">' +
      icon("search") +
      "Buscar</button>" +
      '<button type="button" data-action="cart">' +
      icon("bag") +
      '<span class="badge" data-cart-count hidden>0</span>Carrinho</button>' +
      '<a class="wa" href="' +
      waHref("Olá! Vim pelo site da ObaraKi.") +
      '" target="_blank" rel="noopener">' +
      '<svg class="icon" viewBox="0 0 24 24" style="fill:currentColor;stroke:none">' +
      WA_SVG.replace(/^<svg[^>]*>|<\/svg>$/g, "") +
      "</svg>WhatsApp</a>";
    document.body.appendChild(nav);

    var bar = document.createElement("button");
    bar.type = "button";
    bar.className = "cart-bar";
    bar.setAttribute("data-action", "cart");
    bar.setAttribute("aria-label", "Ver carrinho");
    bar.innerHTML = '<span class="count" data-cart-count>0</span><span class="label">Ver carrinho</span><span class="total" data-cart-total></span>' + icon("arrow");
    document.body.appendChild(bar);

    var wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = waHref("Olá! Vim pelo site da ObaraKi.");
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Fale conosco pelo WhatsApp");
    wa.innerHTML = WA_SVG + "<span>Fale conosco</span>";
    document.body.appendChild(wa);
  }

  function renderFooter() {
    var el = $("#site-footer");
    if (!el) return;
    var s = S.settings();
    var d = s.delivery || {};
    var feeLine =
      d.freeEnabled && !(Number(d.freeMin) > 0)
        ? "Entrega grátis"
        : d.mode === "zones"
        ? "Taxa de entrega conforme o bairro"
        : "Taxa de entrega " + S.money(d.fee);
    var h = page === "home" ? "" : "index.html";
    el.className = "site-footer";
    el.innerHTML =
      '<div class="container">' +
      '<div class="footer-top">' +
      '<div class="footer-brand">' +
      brandHTML() +
      "<p>Delivery de sushi e temaki em " +
      esc(s.city || "") +
      ". Peça pelo site ou pelo WhatsApp.</p>" +
      "</div>" +
      '<div class="footer-cols">' +
      '<div class="footer-col"><h4>Navegação</h4><ul>' +
      '<li><a href="index.html">Início</a></li>' +
      '<li><a href="cardapio.html">Cardápio</a></li>' +
      '<li><a href="' +
      h +
      '#combos">Combos</a></li>' +
      '<li><a href="' +
      h +
      '#promocoes">Promoções</a></li>' +
      '<li><a href="' +
      h +
      '#sobre">Sobre</a></li>' +
      '<li><a href="' +
      h +
      '#contato">Contato</a></li>' +
      "</ul></div>" +
      '<div class="footer-col"><h4>Contato</h4><ul>' +
      '<li><a href="' +
      waHref("Olá! Vim pelo site da ObaraKi.") +
      '" target="_blank" rel="noopener">' +
      icon("chat") +
      "WhatsApp</a></li>" +
      "<li><a " + linkAttrs("instagram") + ">" + icon("insta") + "Instagram</a></li>" +
      "<li><a " + linkAttrs("ifood") + ">" + icon("store") + "iFood</a></li>" +
      "</ul></div>" +
      '<div class="footer-col"><h4>Delivery</h4><ul>' +
      '<li><a href="cardapio.html">' +
      icon("moto") +
      esc(d.areaLabel || s.city || "Delivery") +
      "</a></li>" +
      '<li><a href="cardapio.html">' +
      icon("bag") +
      esc(feeLine) +
      "</a></li>" +
      (s.hours ? '<li><a href="' + h + '#contato">' + icon("clock") + esc(s.hours) + "</a></li>" : "") +
      "</ul></div>" +
      "</div>" +
      "</div>" +
      '<div class="footer-bottom">' +
      "<span>© " +
      new Date().getFullYear() +
      " ObaraKi Temakeria. Todos os direitos reservados.</span>" +
      "<span>" +
      S.phoneDisplay(s.whatsapp) +
      " · " +
      esc(s.city || "") +
      (s.state ? " — " + esc(s.state) : "") +
      "</span>" +
      "</div>" +
      "</div>";
  }

  /* ---------- Carrinho ---------- */

  var cartEl;

  function buildCart() {
    cartEl = document.createElement("aside");
    cartEl.className = "drawer";
    cartEl.id = "cart";
    cartEl.setAttribute("role", "dialog");
    cartEl.setAttribute("aria-modal", "true");
    cartEl.setAttribute("aria-label", "Carrinho");
    cartEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(cartEl);
    cartEl.addEventListener("click", function (e) {
      var t = e.target.closest("[data-k]");
      if (t) {
        var key = t.getAttribute("data-k");
        var act = t.getAttribute("data-act");
        var line = S.cartLines().filter(function (l) {
          return l.key === key;
        })[0];
        if (!line) return;
        if (act === "inc") S.setQty(key, line.qty + 1);
        if (act === "dec") S.setQty(key, line.qty - 1);
        if (act === "rm") S.removeItem(key);
        return;
      }
      if (e.target.closest("[data-close]")) closeLayer(cartEl);
      if (e.target.closest("[data-go-menu]")) {
        if (page === "cardapio") closeLayer(cartEl);
        else goTo("cardapio.html");
      }
      if (e.target.closest("[data-checkout]")) {
        goTo("checkout.html");
      }
    });
    renderCart();
  }

  function freeProgressHTML(sub) {
    var d = S.settings().delivery || {};
    var min = Number(d.freeMin) || 0;
    if (!d.freeEnabled || min <= 0) return "";
    if (sub >= min) return '<div class="free-progress">Você ganhou <b style="color:#fff">entrega grátis</b>.<div class="bar"><i style="width:100%"></i></div></div>';
    var pct = Math.max(4, Math.min(100, (sub / min) * 100));
    return (
      '<div class="free-progress">Faltam <b style="color:#fff">' +
      S.money(min - sub) +
      "</b> para a entrega grátis.<div class=\"bar\"><i style=\"width:" +
      pct.toFixed(0) +
      '%"></i></div></div>'
    );
  }

  function summaryHTML(sub, quote) {
    var feeText = quote.free ? "Grátis" : quote.known ? S.money(quote.fee) : quote.from !== undefined && quote.from !== null ? "a partir de " + S.money(quote.from) : "a combinar";
    var total = sub + (quote.known ? quote.fee : 0);
    return (
      '<div class="summary">' +
      '<div class="line"><span>Subtotal</span><span>' +
      S.money(sub) +
      "</span></div>" +
      '<div class="line"><span>Taxa de entrega</span><span>' +
      feeText +
      "</span></div>" +
      '<div class="total"><span>Total</span><span class="price">' +
      S.money(total) +
      "</span></div>" +
      (!quote.known ? '<div class="hint">A taxa é calculada pelo bairro no próximo passo.</div>' : "") +
      "</div>"
    );
  }

  function renderCart() {
    if (!cartEl) return;
    var lines = S.cartLines();
    var count = S.cartCount();
    var head =
      '<div class="drawer-head"><div><h2>Seu pedido</h2><small>' +
      (count ? count + (count > 1 ? " itens" : " item") : "Carrinho vazio") +
      '</small></div><button class="icon-btn" data-close aria-label="Fechar carrinho">' +
      icon("close") +
      "</button></div>";

    if (!lines.length) {
      cartEl.innerHTML =
        head +
        '<div class="drawer-body"><div class="empty"><div class="ph-mark"><span>空</span></div><h3>Seu carrinho está vazio</h3><p>Escolha seus combos e temakis favoritos no cardápio.</p><button class="btn btn-primary" data-go-menu>Ver cardápio</button></div></div>';
      return;
    }

    var sub = S.subtotal();
    var quote = S.deliveryQuote(sub);
    var min = Number((S.settings().delivery || {}).minOrder) || 0;
    var belowMin = min > 0 && sub < min;

    cartEl.innerHTML =
      head +
      '<div class="drawer-body">' +
      lines
        .map(function (l) {
          var extras = l.options
            .map(function (o) {
              return "+ " + esc(o.name);
            })
            .concat(l.note ? ["Obs.: " + esc(l.note)] : [])
            .join("<br>");
          return (
            '<div class="cart-item">' +
            '<div class="media">' +
            mediaHTML(l.product.image, l.product.name, kanjiFor(l.product)) +
            "</div>" +
            "<div>" +
            '<div class="cart-item-top"><h3>' +
            esc(S.displayName(l.product)) +
            '</h3><span class="price">' +
            S.money(l.total) +
            "</span></div>" +
            (extras ? '<p class="extra">' + extras + "</p>" : '<p class="extra">' + S.money(l.unit) + " cada</p>") +
            '<div class="cart-item-bottom">' +
            '<div class="stepper" role="group" aria-label="Quantidade de ' +
            esc(l.product.name) +
            '">' +
            '<button type="button" data-k="' +
            esc(l.key) +
            '" data-act="dec" aria-label="Diminuir">' +
            icon(l.qty === 1 ? "trash" : "minus") +
            "</button><output>" +
            l.qty +
            "</output>" +
            '<button type="button" data-k="' +
            esc(l.key) +
            '" data-act="inc" aria-label="Aumentar">' +
            icon("plus") +
            "</button></div>" +
            '<button type="button" class="link-remove" data-k="' +
            esc(l.key) +
            '" data-act="rm">Remover</button>' +
            "</div></div></div>"
          );
        })
        .join("") +
      '<button type="button" class="link-more" data-go-menu style="margin-top:18px">' +
      icon("plus") +
      "Adicionar mais itens</button>" +
      "</div>" +
      '<div class="drawer-foot">' +
      freeProgressHTML(sub) +
      summaryHTML(sub, quote) +
      (belowMin ? '<div class="notice" style="margin-top:14px">Pedido mínimo de ' + S.money(min) + ". Faltam " + S.money(min - sub) + ".</div>" : "") +
      '<button type="button" class="btn btn-primary btn-block" data-checkout style="margin-top:16px"' +
      (belowMin ? " disabled" : "") +
      ">Continuar pedido" +
      icon("arrow") +
      "</button>" +
      "</div>";
  }

  function openCart() {
    renderCart();
    openLayer(cartEl);
  }

  function updateCartBadges(bump) {
    var count = S.cartCount();
    var total = S.subtotal();
    $$("[data-cart-count]").forEach(function (b) {
      b.textContent = count;
      if (b.classList.contains("badge")) {
        b.hidden = count === 0;
        if (bump && count) {
          b.classList.remove("is-bump");
          void b.offsetWidth;
          b.classList.add("is-bump");
        }
      }
    });
    $$("[data-cart-total]").forEach(function (t) {
      t.textContent = S.money(total);
    });
    var bar = $(".cart-bar");
    if (bar) bar.classList.toggle("is-visible", count > 0);
  }

  /* ---------- Modal de produto ---------- */

  var modalEl, modalState;

  function buildModal() {
    modalEl = document.createElement("div");
    modalEl.className = "modal";
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);

    modalEl.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) return closeLayer(modalEl);
      var q = e.target.closest("[data-q]");
      if (q) {
        modalState.qty = Math.max(1, Math.min(99, modalState.qty + (q.getAttribute("data-q") === "+" ? 1 : -1)));
        refreshModal();
      }
      if (e.target.closest("[data-confirm]")) {
        var p = modalState.product;
        var note = $("textarea", modalEl).value;
        S.addToCart(p.id, modalState.qty, modalState.options, note);
        closeLayer(modalEl);
        afterAdd(p, modalState.qty);
      }
      if (e.target.closest("[data-consult-modal]")) {
        window.open(consultLink(modalState.product), "_blank", "noopener");
      }
    });
    modalEl.addEventListener("change", function (e) {
      if (e.target.name === "opt") {
        modalState.options = $$("input[name=opt]:checked", modalEl).map(function (i) {
          return i.value;
        });
        refreshModal();
      }
    });
  }

  function modalTotal() {
    var p = modalState.product;
    var unit = S.price(p) || 0;
    modalState.options.forEach(function (oid) {
      var o = p.options.filter(function (x) {
        return x.id === oid;
      })[0];
      if (o) unit += Number(o.price) || 0;
    });
    return unit * modalState.qty;
  }

  function refreshModal() {
    var out = $("output", modalEl);
    if (out) out.textContent = modalState.qty;
    var t = $("[data-modal-total]", modalEl);
    if (t) t.textContent = S.money(modalTotal());
  }

  function consultLink(p) {
    return waHref("Olá! Gostaria de saber o valor e a composição do " + p.name + ".");
  }

  function openProduct(id) {
    var p = S.product(id);
    if (!p) return;
    modalState = { product: p, qty: 1, options: [] };
    var c = S.category(p.category);
    var hasPrice = S.price(p) !== null;
    var old = S.originalPrice(p);
    var opts = p.options || [];
    modalEl.setAttribute("aria-label", p.name);
    modalEl.innerHTML =
      '<button class="icon-btn modal-close" data-close aria-label="Fechar">' +
      icon("close") +
      "</button>" +
      '<div class="modal-scroll"><div class="media modal-media">' +
      mediaHTML(p.image, p.name, kanjiFor(p), tagsHTML(p)) +
      "</div>" +
      '<div class="modal-body">' +
      '<div class="pcard-meta">' +
      esc([c ? c.name : "", p.kind === "executivo" ? "Executivo" : "", p.quantity].filter(Boolean).join(" · ")) +
      "</div>" +
      '<h2 class="modal-title">' +
      esc(p.name) +
      "</h2>" +
      (p.description ? '<p class="modal-desc">' + esc(p.description) + "</p>" : "") +
      '<div class="modal-price">' +
      (hasPrice ? '<span class="price">' + S.money(S.price(p)) + "</span>" + (old ? '<span class="price-old">' + S.money(old) + "</span>" : "") : '<span class="price-consult">Preço sob consulta</span>') +
      "</div>" +
      (p.composition && p.composition.length
        ? '<div class="field-group"><h4>Composição' + (p.quantity ? "<small>" + esc(p.quantity) + "</small>" : "") + "</h4>" + compHTML(p).replace('class="pcard-comp"', 'class="pcard-comp" style="border:0;padding:0;margin:0"') + "</div>"
        : "") +
      (hasPrice && opts.length
        ? '<div class="field-group"><h4>Adicionais<small>Opcional</small></h4>' +
          opts
            .map(function (o) {
              return (
                '<label class="option"><input type="checkbox" name="opt" value="' +
                esc(o.id) +
                '"><span class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="name">' +
                esc(o.name) +
                '</span><span class="add">+ ' +
                S.money(o.price) +
                "</span></label>"
              );
            })
            .join("") +
          "</div>"
        : "") +
      (hasPrice
        ? '<div class="field-group"><h4>Quantidade</h4><div class="stepper stepper--lg" role="group" aria-label="Quantidade"><button type="button" data-q="-" aria-label="Diminuir">' +
          icon("minus") +
          '</button><output>1</output><button type="button" data-q="+" aria-label="Aumentar">' +
          icon("plus") +
          "</button></div></div>" +
          '<div class="field-group"><h4><label for="obs-' +
          esc(p.id) +
          '">Observações</label><small>Opcional</small></h4><textarea id="obs-' +
          esc(p.id) +
          '" class="input" maxlength="160" placeholder="Alguma observação sobre seu pedido?"></textarea></div>'
        : '<div class="field-group"><p style="margin:0;color:var(--text-2)">Fale com a gente pelo WhatsApp para saber o valor e a composição deste item.</p></div>') +
      "</div></div>" +
      '<div class="modal-foot">' +
      (hasPrice
        ? '<button type="button" class="btn btn-primary" data-confirm><span>Adicionar ao carrinho</span><span data-modal-total>' + S.money(S.price(p)) + "</span></button>"
        : '<button type="button" class="btn btn-wa" data-consult-modal style="justify-content:center">Consultar no WhatsApp</button>') +
      "</div>";
    var img = $("img", modalEl);
    if (img) watchImg(img);
    openLayer(modalEl, { focus: "[data-close]" });
  }

  function afterAdd(p, qty) {
    updateCartBadges(true);
    toast((qty > 1 ? qty + "x " : "") + p.name + " adicionado", { label: "Ver carrinho", run: openCart });
  }

  function quickAdd(id) {
    var p = S.product(id);
    if (!p) return;
    if (S.price(p) === null) {
      window.open(consultLink(p), "_blank", "noopener");
      return;
    }
    if (p.options && p.options.length) return openProduct(id);
    S.addToCart(id, 1, [], "");
    afterAdd(p, 1);
  }

  /* ---------- Busca ---------- */

  var searchEl;

  function buildSearch() {
    searchEl = document.createElement("div");
    searchEl.className = "search-panel";
    searchEl.setAttribute("role", "dialog");
    searchEl.setAttribute("aria-modal", "true");
    searchEl.setAttribute("aria-label", "Buscar no cardápio");
    searchEl.setAttribute("aria-hidden", "true");
    searchEl.innerHTML =
      '<div class="search-top"><div class="container">' +
      '<label class="search-input">' +
      icon("search") +
      '<span class="sr-only">Buscar</span><input type="search" placeholder="Buscar combos, temakis, sashimi…" autocomplete="off" enterkeyhint="search" data-autofocus></label>' +
      '<button class="icon-btn" data-close aria-label="Fechar busca">' +
      icon("close") +
      "</button>" +
      "</div></div>" +
      '<div class="search-results"><div class="container" data-results></div></div>';
    document.body.appendChild(searchEl);
    var input = $("input", searchEl);
    input.addEventListener("input", function () {
      renderSearch(input.value);
    });
    searchEl.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeLayer(searchEl);
      var cat = e.target.closest("[data-cat]");
      if (cat) {
        e.preventDefault();
        var id = cat.getAttribute("data-cat");
        if (page === "cardapio") {
          closeLayer(searchEl);
          setTimeout(function () {
            var t = document.getElementById("cat-" + id);
            if (t) t.scrollIntoView({ behavior: "smooth" });
          }, 120);
        } else goTo("cardapio.html#cat-" + id);
      }
    });
  }

  function renderSearch(q) {
    var box = $("[data-results]", searchEl);
    if (!q || q.trim().length < 2) {
      box.innerHTML =
        '<div class="label-sm">Categorias</div><div class="chips">' +
        S.categories()
          .map(function (c) {
            return '<a href="cardapio.html#cat-' + esc(c.id) + '" class="chip" data-cat="' + esc(c.id) + '">' + esc(c.name) + "</a>";
          })
          .join("") +
        "</div>";
      return;
    }
    var res = S.search(q);
    if (!res.length) {
      box.innerHTML =
        '<div class="empty" style="padding:48px 0"><h3>Nada encontrado</h3><p>Tente outro termo ou fale com a gente pelo WhatsApp.</p><a class="btn btn-ghost" target="_blank" rel="noopener" href="' +
        waHref("Olá! Vocês têm " + q + "?") +
        '">Perguntar no WhatsApp</a></div>';
      return;
    }
    box.innerHTML =
      '<div class="label-sm">' +
      res.length +
      (res.length > 1 ? " resultados" : " resultado") +
      '</div><ul class="temaki-list">' +
      res.map(menuRow).join("") +
      "</ul>";
    $$("img", box).forEach(watchImg);
  }

  function openSearch() {
    renderSearch($("input", searchEl).value);
    openLayer(searchEl, { overlay: false });
  }

  /* ---------- Área do cliente ---------- */

  var accEl;

  function buildAccount() {
    accEl = document.createElement("aside");
    accEl.className = "drawer";
    accEl.setAttribute("role", "dialog");
    accEl.setAttribute("aria-modal", "true");
    accEl.setAttribute("aria-label", "Meus dados");
    accEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(accEl);
    accEl.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeLayer(accEl);
      if (e.target.closest("[data-forget]")) {
        S.forgetCustomer();
        renderAccount();
        toast("Dados removidos deste aparelho");
      }
      var r = e.target.closest("[data-reorder]");
      if (r) {
        var o = S.orders().filter(function (x) {
          return x.id === r.getAttribute("data-reorder");
        })[0];
        if (!o) return;
        var added = 0;
        o.items.forEach(function (it) {
          var p = S.product(it.productId);
          if (p && S.price(p) !== null) {
            S.addToCart(
              it.productId,
              it.qty,
              it.options.map(function (op) {
                return op.id;
              }),
              it.note
            );
            added++;
          }
        });
        closeLayer(accEl);
        if (added) {
          updateCartBadges(true);
          setTimeout(openCart, 380);
        } else toast("Os itens deste pedido não estão mais disponíveis");
      }
    });
  }

  function renderAccount() {
    var c = S.customer();
    var orders = S.orders().slice(0, 5);
    accEl.innerHTML =
      '<div class="drawer-head"><div><h2>Meus dados</h2><small>Sem cadastro, salvo neste aparelho</small></div><button class="icon-btn" data-close aria-label="Fechar">' +
      icon("close") +
      "</button></div>" +
      '<div class="drawer-body">' +
      '<div class="field-group" style="border:0;margin-top:8px;padding-top:8px"><h4>Entrega</h4>' +
      (c
        ? '<div class="step-review"><div><b style="display:block;font-size:10.5px;letter-spacing:.16em;color:var(--muted);text-transform:uppercase">' +
          esc(c.name) +
          "</b>" +
          esc(S.phoneDisplay(c.phone)) +
          "<br>" +
          esc((c.address && c.address.street) || "") +
          ", " +
          esc((c.address && c.address.number) || "") +
          "<br>" +
          esc((c.address && c.address.neighborhood) || "") +
          '</div></div><button class="link-remove" data-forget style="margin-top:6px">Esquecer meus dados</button>'
        : '<p style="margin:0;color:var(--text-2);font-size:14px">Seus dados de entrega ficam salvos aqui depois do primeiro pedido, para agilizar os próximos.</p>') +
      "</div>" +
      '<div class="field-group"><h4>Pedidos recentes</h4>' +
      (orders.length
        ? orders
            .map(function (o) {
              return (
                '<div class="cart-item" style="grid-template-columns:1fr auto;align-items:center"><div><h3>' +
                esc(o.id) +
                '</h3><p class="extra">' +
                new Date(o.createdAt).toLocaleDateString("pt-BR") +
                " · " +
                o.items.length +
                (o.items.length > 1 ? " itens" : " item") +
                " · " +
                S.money(o.total) +
                '</p></div><button class="btn btn-ghost btn-sm" data-reorder="' +
                esc(o.id) +
                '">' +
                icon("repeat", "icon-sm") +
                "Repetir</button></div>"
              );
            })
            .join("")
        : '<p style="margin:0;color:var(--text-2);font-size:14px">Você ainda não fez pedidos neste aparelho.</p>') +
      "</div></div>" +
      '<div class="drawer-foot"><a class="btn btn-primary btn-block" href="cardapio.html">Ver cardápio</a></div>';
  }

  function openAccount() {
    renderAccount();
    openLayer(accEl);
  }

  /* ---------- Imagens e animações ---------- */

  function watchImg(img) {
    if (!img.hasAttribute("data-loading")) return;
    var done = function () {
      img.removeAttribute("data-loading");
    };
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener("load", done);
      img.addEventListener("error", function () {
        var media = img.closest(".media");
        var host = img.closest("[data-open]");
        var p = host ? S.product(host.getAttribute("data-open")) : null;
        img.outerHTML = '<div class="ph" aria-hidden="true"><div class="ph-mark"><span>' + esc(p ? kanjiFor(p) : "寿司") + "</span></div></div>";
        if (media) media.classList.add("is-fallback");
      });
    }
  }

  function hydrate(root) {
    $$("img[data-loading]", root).forEach(watchImg);
    reveal(root);
  }

  var io;

  function reveal(root) {
    var els = $$(".reveal, .reveal-stagger", root).filter(function (el) {
      return !el.classList.contains("is-in");
    });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
    }
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Delegação global ---------- */

  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) {
      e.stopPropagation();
      quickAdd(add.getAttribute("data-add"));
      return;
    }
    var consult = e.target.closest("[data-consult]");
    if (consult) {
      e.stopPropagation();
      var cp = S.product(consult.getAttribute("data-consult"));
      if (cp) window.open(consultLink(cp), "_blank", "noopener");
      return;
    }
    var open = e.target.closest("[data-open]");
    if (open && !e.target.closest("a")) {
      openProduct(open.getAttribute("data-open"));
      return;
    }
    var missing = e.target.closest("[data-missing]");
    if (missing) {
      e.preventDefault();
      var k = missing.getAttribute("data-missing");
      toast(k === "ifood" ? "Link do iFood em breve. Peça pelo site ou WhatsApp." : "Perfil do Instagram em breve.");
      return;
    }
    var act = e.target.closest("[data-action]");
    if (act) {
      var a = act.getAttribute("data-action");
      if (a === "cart") openCart();
      if (a === "search") openSearch();
      if (a === "account") {
        var mm = $("#mobile-menu");
        if (mm && mm.classList.contains("is-open")) {
          closeLayer(mm);
          setTimeout(openAccount, 120);
        } else openAccount();
      }
      if (a === "menu") openLayer($("#mobile-menu"), { overlay: false });
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-open]")) {
      e.preventDefault();
      openProduct(e.target.getAttribute("data-open"));
    }
  });

  window.addEventListener("obk:cart", function () {
    updateCartBadges(false);
    renderCart();
  });

  /* ---------- Inicialização ---------- */

  function init() {
    document.body.insertAdjacentHTML("afterbegin", SPRITE);
    overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.addEventListener("click", function () {
      if (layers.length) closeTop(false);
    });
    document.body.appendChild(overlay);
    if (page === "admin") return;

    renderHeader();
    if (page !== "checkout") {
      renderMobileMenu();
      buildCart();
      buildModal();
      buildSearch();
      buildAccount();
    }
    renderBottomNav();
    renderFooter();
    updateCartBadges(false);

    /* Abre produto direto pelo link: pagina.html#produto=combo-master-chef */
    var m = location.hash.match(/produto=([\w-]+)/);
    if (m && modalEl) setTimeout(function () {
      openProduct(m[1]);
    }, 250);
  }

  window.OBK.ui = {
    esc: esc,
    $: $,
    $$: $$,
    icon: icon,
    WA_SVG: WA_SVG,
    card: card,
    promoCard: promoCard,
    execCard: execCard,
    menuRow: menuRow,
    mediaHTML: mediaHTML,
    priceHTML: priceHTML,
    kanjiFor: kanjiFor,
    linkAttrs: linkAttrs,
    waHref: waHref,
    toast: toast,
    hydrate: hydrate,
    openProduct: openProduct,
    openCart: openCart,
    openSearch: openSearch,
    quickAdd: quickAdd,
    summaryHTML: summaryHTML,
    brandHTML: brandHTML,
    updateCartBadges: updateCartBadges,
    page: page
  };

  init();
})();
