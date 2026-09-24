/* ==========================================================================
   Confeitaria artesanal · monta a página a partir do config.js
   Não é preciso editar este arquivo no dia a dia.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE || {};
  var produtos = S.produtos || [];
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* --------------------------------------------------------- utilidades */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isPlaceholder(s) { return /^\s*\[[\s\S]*\]\s*$/.test(s || ""); }
  // Texto com *itálico*; textos entre [colchetes] viram espaço reservado
  function rich(s) {
    if (!s) return "";
    if (isPlaceholder(s)) return '<span class="ph-text">' + esc(String(s).trim().slice(1, -1)) + "</span>";
    return esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
  }
  function plain(s) { return String(s || "").replace(/\*/g, ""); }

  function waLink(msg) {
    var num = String((S.whatsapp && S.whatsapp.numero) || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg || "");
  }
  function waProduto(p) {
    var tpl = (S.whatsapp && S.whatsapp.mensagemProduto) || "Olá! Gostaria de encomendar: {produto}.";
    return waLink(tpl.replace(/\{produto\}/g, p.nome));
  }
  function produto(id) {
    for (var i = 0; i < produtos.length; i++) if (produtos[i].id === id) return produtos[i];
    return null;
  }
  function fotos(p) { return (p && Array.isArray(p.fotos) ? p.fotos : []).filter(Boolean); }

  // Espaço reservado para foto real (sem imagens de banco)
  function placeholder(nome, hint) {
    return '<div class="ph-photo" role="img" aria-label="' + esc(nome) + ' (foto em breve)">' +
      '<span class="ph-photo__name">' + esc(nome) + "</span>" +
      '<span class="ph-photo__hint">' + esc(hint || "foto real") + "</span></div>";
  }
  function img(p, i, opts) {
    opts = opts || {};
    var list = fotos(p);
    var src = list[i];
    var nome = p ? p.nome : "Doce";
    if (!src) return placeholder(nome, opts.hint);
    var alt = nome + (list.length > 1 ? " — foto " + (i + 1) : "");
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') +
      ' decoding="async" data-ph-name="' + esc(nome) + '"' +
      (opts.cls ? ' class="' + opts.cls + '"' : "") + ">";
  }
  // Se uma foto não carregar, mostra o espaço reservado no lugar
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.hasAttribute("data-ph-name")) {
      var box = document.createElement("div");
      box.innerHTML = placeholder(t.getAttribute("data-ph-name"), "foto não encontrada");
      var ph = box.firstChild;
      if (t.classList.contains("is-active")) ph.classList.add("is-active");
      t.replaceWith(ph);
      if (window.console) console.warn("Foto não encontrada:", t.getAttribute("src"));
    }
  }, true);

  /* ------------------------------------------------------------- marca */
  var marca = S.marca || {};
  $$("[data-brand-logo]").forEach(function (el) {
    var nome = marca.nome || "Confeitaria";
    el.innerHTML = '<span class="logo__mark" aria-hidden="true">' + esc(nome.trim().charAt(0)) + "</span><span>" + esc(nome) + "</span>";
  });
  $$("[data-brand-name]").forEach(function (el) { el.textContent = marca.nome || ""; });
  $$("[data-brand-desc]").forEach(function (el) { el.textContent = marca.descricao || ""; });
  $$("[data-brand-area]").forEach(function (el) { el.textContent = marca.atendimento || ""; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (marca.nome) {
    document.title = marca.nome + " · " + (marca.descricao || "Doces por encomenda");
    var og = $('meta[property="og:title"]'); if (og) og.setAttribute("content", document.title);
  }

  /* ------------------------------------------------ WhatsApp e Instagram */
  var waGeral = waLink((S.whatsapp && S.whatsapp.mensagem) || "Olá! Gostaria de fazer uma encomenda.");
  $$("[data-wa]").forEach(function (a) { a.href = waGeral; });

  var ig = S.instagram || {};
  var igUser = String(ig.usuario || "").replace(/^@/, "");
  var igLink = ig.link || (igUser ? "https://www.instagram.com/" + igUser + "/" : "#");
  $$("[data-insta]").forEach(function (a) { a.href = igLink; });
  $$("[data-insta-handle]").forEach(function (a) { a.textContent = "@" + igUser; });

  /* -------------------------------------------------------------- hero */
  var hero = S.hero || {};
  $("[data-hero-title]").innerHTML = rich(hero.titulo);
  $("[data-hero-sub]").innerHTML = rich(hero.subtitulo);

  var DEPTH = [1, .62, .8, .34, .3, .46];   // profundidade de cada posição (1 = mais perto)
  var stage = $("[data-stage]");
  var composicao = (hero.composicao || []).slice(0, 6);
  stage.insertAdjacentHTML("beforeend", composicao.map(function (slot, i) {
    var p = produto(slot.produto);
    if (!p) return "";
    var n = (slot.foto || 0);
    return '<div class="float f' + (i + 1) + " " + (p.recortada ? "is-cut" : "is-framed") + '" style="--i:' + i + ";--tint:" + esc(p.cor || "") + '" data-depth="' + DEPTH[i] + '">' +
      '<div class="float__px"><span class="float__shadow"></span>' +
      '<div class="float__motion"><div class="float__drift"><div class="frame">' +
      img(p, n, { eager: i < 3, hint: fotos(p).length ? "foto " + (n + 1) : "foto real" + (n ? " · " + (n + 1) : "") }) +
      "</div></div></div></div></div>";
  }).join(""));
  stage.setAttribute("aria-label", "Nossos doces: " + produtos.map(function (p) { return p.nome; }).join(", "));

  /* ------------------------------------------------------------- faixa */
  var ribbon = $("[data-ribbon]");
  if (produtos.length) {
    var nomes = produtos.map(function (p) { return p.nome; });
    var base = [];
    while (base.length < 8) base = base.concat(nomes);
    var html = base.map(function (n) { return "<span>" + esc(n) + "</span>"; }).join("");
    ribbon.innerHTML = html + html; // duas cópias para o loop contínuo
  } else {
    ribbon.parentNode.remove();
  }

  /* ---------------------------------------------------------- cardápio */
  var grid = $("[data-menu-grid]");
  grid.innerHTML = produtos.map(function (p, i) {
    var list = fotos(p);
    var frames = list.length
      ? list.map(function (_, k) { return img(p, k, { cls: k === 0 ? "is-active" : "" }); }).join("")
      : placeholder(p.nome, "foto real");
    var dots = list.length > 1
      ? '<div class="card__dots" role="group" aria-label="Ângulos de ' + esc(p.nome) + '">' +
        list.map(function (_, k) {
          return '<button type="button" aria-label="Ver foto ' + (k + 1) + '" aria-pressed="' + (k === 0) + '" data-dot="' + k + '"></button>';
        }).join("") + "</div>"
      : "";
    return '<article class="card" data-reveal style="--rd:' + (i % 3) * 110 + "ms;--tint:" + esc(p.cor || "#B7733A") + '">' +
      '<div class="card__media"><div class="card__backdrop"></div>' +
      '<div class="card__frame ' + (p.recortada ? "is-cut" : "") + '">' + frames + "</div>" +
      '<span class="card__index">' + String(i + 1).padStart(2, "0") + "</span>" + dots + "</div>" +
      '<div class="card__body"><h3 class="card__title">' + esc(p.nome) + "</h3>" +
      (p.descricao ? '<p class="card__desc">' + rich(p.descricao) + "</p>" : "") +
      (p.preco ? '<p class="card__price">' + esc(p.preco) + "</p>" : "") +
      '<a class="btn btn--primary card__cta" href="' + waProduto(p) + '" target="_blank" rel="noopener">' +
      '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>Encomendar</a>' +
      "</div></article>";
  }).join("");

  // Troca de ângulo nas fotos do card
  grid.addEventListener("click", function (e) {
    var dot = e.target.closest("[data-dot]");
    if (!dot) return;
    var card = dot.closest(".card");
    var k = +dot.getAttribute("data-dot");
    $$(".card__frame > *", card).forEach(function (el, idx) { el.classList.toggle("is-active", idx === k); });
    $$("[data-dot]", card).forEach(function (d, idx) { d.setAttribute("aria-pressed", String(idx === k)); });
  });

  // Toque no celular: mesma sensação do hover
  grid.addEventListener("touchstart", function (e) {
    var card = e.target.closest(".card");
    if (card) card.classList.add("is-pressed");
  }, { passive: true });
  ["touchend", "touchcancel"].forEach(function (ev) {
    grid.addEventListener(ev, function () {
      setTimeout(function () { $$(".card.is-pressed", grid).forEach(function (c) { c.classList.remove("is-pressed"); }); }, 220);
    }, { passive: true });
  });

  /* --------------------------------------------------------- destaques */
  var featured = $("[data-featured]");
  var destaques = (S.destaques || []).map(produto).filter(Boolean);
  if (!destaques.length) {
    $("#destaques").remove();
    $$('a[href="#destaques"]').forEach(function (a) { a.remove(); });
  } else {
    featured.innerHTML = destaques.map(function (p, i) {
      var list = fotos(p);
      var shape = p.recortada ? "is-cut" : "is-framed";
      function item(mod, k, depth) {
        return '<div class="feature__item feature__item--' + mod + " " + shape + '" data-depth="' + depth + '">' +
          '<div class="feature__enter"><div class="feature__bob"><div class="frame">' +
          img(p, k, { hint: "foto real" }) + "</div></div></div></div>";
      }
      return '<article class="feature" style="--tint:' + esc(p.cor || "#B7733A") + '">' +
        '<div class="feature__media"><div class="feature__halo" data-depth="-.4"></div>' +
        item("main", 0, 1) +
        (list.length > 1 ? item("sat-a", 1, 1.8) : "") +
        (list.length > 2 ? item("sat-b", 2, .5) : "") +
        "</div>" +
        '<div class="feature__text" data-reveal>' +
        '<span class="feature__num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<h3 class="feature__title">' + esc(p.nome) + "</h3>" +
        (p.descricao ? '<p class="feature__desc">' + rich(p.descricao) + "</p>" : "") +
        (p.preco ? '<p class="feature__price">' + esc(p.preco) + "</p>" : "") +
        '<div class="feature__actions"><a class="btn btn--light btn--lg" href="' + waProduto(p) + '" target="_blank" rel="noopener">' +
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>Encomendar</a></div>' +
        "</div></article>";
    }).join("");
  }

  /* -------------------------------------------------------------- sobre */
  var sobre = S.sobre || {};
  $("[data-about-title]").innerHTML = rich(sobre.titulo);
  $("[data-about-story]").innerHTML = (sobre.historia || []).map(function (t) { return "<p>" + rich(t) + "</p>"; }).join("");
  $("[data-about-pillars]").innerHTML = (sobre.pilares || []).map(function (pl, i) {
    return '<div class="pillar" data-reveal style="--rd:' + i * 90 + 'ms"><h3><span>' + String(i + 1).padStart(2, "0") + "</span>" + esc(pl.titulo) + "</h3><p>" + rich(pl.texto) + "</p></div>";
  }).join("");
  var aboutMedia = $("[data-about-media]");
  if (sobre.foto) {
    aboutMedia.innerHTML = '<div class="frame"><img src="' + esc(sobre.foto) + '" alt="' + esc(marca.nome || "Confeitaria") + '" loading="lazy" decoding="async" data-ph-name="Foto da confeitaria"></div>';
  } else {
    aboutMedia.innerHTML = '<div class="frame">' + placeholder("Foto da confeitaria", "sobre.foto") + "</div>";
  }

  /* ------------------------------------------------------ como funciona */
  var ICONS = [
    // cardápio / escolha
    '<svg viewBox="0 0 40 40"><rect x="9" y="5" width="22" height="30" rx="3" pathLength="1"/><path d="M14 13h12M14 19h12M14 25h7" pathLength="1"/><path class="accent" d="M27 26.5c0-1.4 1.2-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 2.5-2.5 4-2.5 4s-2.5-1.5-2.5-4z" pathLength="1"/></svg>',
    // conversa
    '<svg viewBox="0 0 40 40"><path d="M7 11a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H17l-7 6v-6h1a4 4 0 0 1-4-4z" pathLength="1"/><path class="accent" d="M14 17h.01M20 17h.01M26 17h.01" pathLength="1" stroke-width="2.6"/></svg>',
    // caixa com laço
    '<svg viewBox="0 0 40 40"><rect x="7" y="15" width="26" height="19" rx="2" pathLength="1"/><path d="M5 10h30v5H5zM20 10v24" pathLength="1"/><path class="accent" d="M20 10c-3-6-9-5-8-1 .6 2 5 1 8 1zM20 10c3-6 9-5 8-1-.6 2-5 1-8 1z" pathLength="1"/></svg>'
  ];
  $("[data-steps]").innerHTML = (S.passos || []).map(function (st, i) {
    return '<li class="step" data-reveal style="--rd:' + i * 160 + 'ms"><div class="step__icon" aria-hidden="true">' + (ICONS[i] || ICONS[0]) + "</div>" +
      '<span class="step__num">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<h3 class="step__title">' + esc(st.titulo) + "</h3>" +
      '<p class="step__text">' + rich(st.texto) + "</p></li>";
  }).join("");

  /* ---------------------------------------------------------- instagram */
  var instaFotos = [];
  produtos.forEach(function (p) { fotos(p).forEach(function (f, k) { instaFotos.push({ p: p, k: k }); }); });
  var instaGrid = $("[data-insta-grid]");
  if (instaFotos.length >= 3) {
    instaGrid.innerHTML = instaFotos.slice(0, 6).map(function (it, i) {
      return '<a href="' + esc(igLink) + '" target="_blank" rel="noopener" class="' + (it.p.recortada ? "is-cut" : "") + '" data-reveal style="--rd:' + i * 80 + 'ms" aria-label="Ver no Instagram">' + img(it.p, it.k) + "</a>";
    }).join("");
  } else {
    instaGrid.remove();
    $(".insta__inner").classList.add("is-solo");
  }

  /* ================================================ movimento e scroll */

  // Revelar ao rolar
  var revealEls = $$("[data-reveal], .feature");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Topo muda ao rolar
  var topbar = $("[data-topbar]");
  function onTopbar() { topbar.classList.toggle("is-scrolled", window.scrollY > 24); }
  onTopbar();

  // Menu do celular
  var menuBtn = $("[data-menu-btn]");
  var sheet = $("[data-menu]");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) sheet.hidden = false;
  }
  menuBtn.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  sheet.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Parallax: mouse + rolagem, num único laço de animação
  var heroEl = $("[data-hero]");
  var floats = $$(".float", stage).map(function (el) {
    return { el: el.querySelector(".float__px"), d: +el.getAttribute("data-depth") || .5 };
  });
  var featureLayers = $$(".feature").map(function (f) {
    return {
      box: f.querySelector(".feature__media"),
      layers: $$("[data-depth]", f).map(function (el) { return { el: el, d: +el.getAttribute("data-depth") }; }),
      visible: false
    };
  });

  var tx = 0, ty = 0, cx = 0, cy = 0;
  var ticking = false, heroVisible = true;

  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    var pointer = finePointer.matches;

    if (heroVisible) {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      var sy = Math.min(window.scrollY, vh);
      for (var i = 0; i < floats.length; i++) {
        var f = floats[i];
        var x = pointer ? cx * f.d * 26 : 0;
        var y = (pointer ? cy * f.d * 18 : 0) - sy * f.d * 0.16;
        var r = pointer ? cx * f.d * 2.4 : 0;
        f.el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) rotate(" + r.toFixed(3) + "deg)";
      }
      if (pointer && (Math.abs(tx - cx) > 0.0015 || Math.abs(ty - cy) > 0.0015)) request();
    }

    for (var j = 0; j < featureLayers.length; j++) {
      var fl = featureLayers[j];
      if (!fl.visible) continue;
      var rect = fl.box.getBoundingClientRect();
      var prog = (rect.top + rect.height / 2 - vh / 2) / vh; // -1 … 1
      for (var k = 0; k < fl.layers.length; k++) {
        var L = fl.layers[k];
        L.el.style.transform = "translate3d(0," + (prog * L.d * -48).toFixed(2) + "px,0) rotate(" + (prog * L.d * -3).toFixed(3) + "deg)";
      }
    }
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function startMotion() {
    if (reduceMotion.matches) return;

    window.addEventListener("pointermove", function (e) {
      if (!finePointer.matches || e.pointerType === "touch") return;
      tx = e.clientX / window.innerWidth * 2 - 1;
      ty = e.clientY / window.innerHeight * 2 - 1;
      request();
    }, { passive: true });
    document.addEventListener("pointerleave", function () { tx = 0; ty = 0; request(); });

    if ("IntersectionObserver" in window) {
      // Pausa o hero fora da tela para poupar bateria
      new IntersectionObserver(function (en) {
        heroVisible = en[0].isIntersecting;
        heroEl.classList.toggle("is-paused", !heroVisible);
        if (heroVisible) request();
      }).observe(heroEl);

      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          featureLayers.forEach(function (fl) { if (fl.box === en.target) fl.visible = en.isIntersecting; });
          en.target.closest(".feature").classList.toggle("is-paused", !en.isIntersecting);
        });
        request();
      }, { rootMargin: "20% 0px" });
      featureLayers.forEach(function (fl) { fio.observe(fl.box); });
    }
    request();
  }

  // Botão flutuante do WhatsApp: no celular, só aparece quando o botão do hero sai da tela
  var waFloat = $(".wa-float");
  var heroActions = $(".hero__actions");
  var mobile = window.matchMedia("(max-width: 900px)");
  var heroCtaVisible = true;
  var waReady = false;
  function updateWa() { waFloat.classList.toggle("is-hidden", !waReady || (mobile.matches && heroCtaVisible)); }
  if (waFloat) {
    setTimeout(function () { waReady = true; updateWa(); }, 1400);
    if ("IntersectionObserver" in window && heroActions) {
      new IntersectionObserver(function (en) { heroCtaVisible = en[0].isIntersecting; updateWa(); }).observe(heroActions);
    }
    if (mobile.addEventListener) mobile.addEventListener("change", updateWa);
  }

  window.addEventListener("scroll", function () { onTopbar(); if (!reduceMotion.matches) request(); }, { passive: true });
  startMotion();
})();
