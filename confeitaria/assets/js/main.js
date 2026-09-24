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
  // Texto com *itálico*; textos entre [colchetes] viram espaço reservado
  function rich(s) {
    if (!s) return "";
    if (/^\s*\[[\s\S]*\]\s*$/.test(s)) return '<span class="ph-text">' + esc(String(s).trim().slice(1, -1)) + "</span>";
    return esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
  }
  function waLink(msg) {
    var num = String((S.whatsapp && S.whatsapp.numero) || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg || "");
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
      ' decoding="async" data-ph-name="' + esc(nome) + '">';
  }
  // Se uma foto não carregar, mostra o espaço reservado no lugar
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.hasAttribute("data-ph-name")) {
      var box = document.createElement("div");
      box.innerHTML = placeholder(t.getAttribute("data-ph-name"), "foto não encontrada");
      t.replaceWith(box.firstChild);
      if (window.console) console.warn("Foto não encontrada:", t.getAttribute("src"));
    }
  }, true);

  /* ------------------------------------------------------------- marca */
  var marca = S.marca || {};
  $$("[data-brand-logo]").forEach(function (el) {
    var nome = marca.nome || "Confeitaria";
    el.innerHTML = '<span class="logo__mark" aria-hidden="true">' + esc(nome.trim().charAt(0)) + "</span><span>" + esc(nome) + "</span>";
  });
  $$("[data-brand-desc]").forEach(function (el) { el.textContent = marca.descricao || ""; });
  if (marca.nome) {
    document.title = marca.nome + " · " + (marca.descricao || "Doces por encomenda");
    var og = $('meta[property="og:title"]'); if (og) og.setAttribute("content", document.title);
  }
  if (marca.descricao) {
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", (marca.nome ? marca.nome + ": " : "") + marca.descricao + ". Encomendas pelo WhatsApp.");
  }

  /* ---------------------------------------------------------- WhatsApp */
  var waGeral = waLink((S.whatsapp && S.whatsapp.mensagem) || "Olá! Gostaria de fazer uma encomenda.");
  $$("[data-wa]").forEach(function (a) { a.href = waGeral; });

  /* -------------------------------------------------------------- hero */
  var hero = S.hero || {};
  $("[data-hero-title]").innerHTML = rich(hero.titulo);
  $("[data-hero-sub]").innerHTML = rich(hero.subtitulo);

  var stage = $("[data-stage]");
  var composicao = (hero.composicao || []).slice(0, 6);
  // Profundidade de cada posição (1 = mais perto, reage mais ao mouse)
  var DEPTH = composicao.length === 3 ? [1, .7, .85] : [1, .62, .8, .34, .3, .46];
  if (composicao.length === 3) stage.classList.add("stage--3");
  stage.insertAdjacentHTML("beforeend", composicao.map(function (slot, i) {
    var p = produto(slot.produto);
    if (!p) return "";
    var n = slot.foto || 0;
    return '<div class="float f' + (i + 1) + " " + (p.recortada ? "is-cut" : "is-framed") + '" style="--i:' + i + ";--tint:" + esc(p.cor || "") + '" data-depth="' + DEPTH[i] + '">' +
      '<div class="float__px"><span class="float__shadow"></span>' +
      '<div class="float__motion"><div class="float__drift"><div class="frame">' +
      img(p, n, { eager: i < 3, hint: "foto real" }) +
      "</div></div></div></div></div>";
  }).join(""));
  stage.setAttribute("aria-label", "Nossos doces: " + produtos.map(function (p) { return p.nome; }).join(", "));

  /* ------------------------------------------------------ doces livres */
  var solo = $("[data-solo]");
  var livres = (S.livres || []).map(produto).filter(Boolean);
  if (!livres.length) {
    solo.remove();
  } else {
    solo.innerHTML = livres.map(function (p, i) {
      var src = fotos(p)[0];
      var media = src
        ? '<img src="' + esc(src) + '" alt="' + esc(p.nome) + '" loading="lazy" decoding="async" data-free-name="' + esc(p.nome) + '">'
        : freePlaceholder(p.nome);
      return '<article class="solo__item" style="--tint:' + esc(p.cor || "#B7733A") + '">' +
        '<div class="solo__stage"><div class="solo__glow" aria-hidden="true"></div>' +
        '<div class="solo__px" data-depth="1"><div class="solo__enter">' +
        '<span class="solo__shadow" aria-hidden="true"></span>' +
        '<div class="solo__motion">' + media + "</div></div></div></div>" +
        '<div class="solo__text"><span class="eyebrow">' + String(i + 1).padStart(2, "0") + " / " + String(livres.length).padStart(2, "0") + "</span>" +
        '<h2 class="solo__name">' + esc(p.nome) + "</h2></div></article>";
    }).join("");
  }
  function freePlaceholder(nome) {
    return '<div class="ph-free" role="img" aria-label="' + esc(nome) + ' (foto em breve)">' +
      '<span class="ph-free__name">' + esc(nome) + '</span><span class="ph-free__hint">foto recortada</span></div>';
  }
  // Foto dos doces livres que não carregar vira espaço reservado solto
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.hasAttribute("data-free-name")) {
      var box = document.createElement("div");
      box.innerHTML = freePlaceholder(t.getAttribute("data-free-name"));
      t.replaceWith(box.firstChild);
    }
  }, true);

  /* ------------------------------------- dados para buscadores (Google) */
  try {
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Bakery",
      "name": marca.nome || "Confeitaria",
      "description": marca.descricao || "",
      "url": location.href.split("#")[0]
    });
    document.head.appendChild(tag);
  } catch (err) { /* opcional */ }

  /* ================================================ movimento */

  // Topo ganha fundo se a página rolar (telas baixas)
  var topbar = $("[data-topbar]");
  function onTopbar() { topbar.classList.toggle("is-scrolled", window.scrollY > 24); }
  onTopbar();
  window.addEventListener("scroll", function () { onTopbar(); if (!reduceMotion.matches) request(); }, { passive: true });

  // Parallax: mouse + rolagem, num único laço de animação
  var heroEl = $("[data-hero]");
  var floats = $$(".float", stage).map(function (el) {
    return { el: el.querySelector(".float__px"), d: +el.getAttribute("data-depth") || .5 };
  });
  var tx = 0, ty = 0, cx = 0, cy = 0;
  var ticking = false, heroVisible = true;

  function frame() {
    ticking = false;
    // Doces livres: sobem um pouco mais devagar que a página (profundidade)
    for (var j = 0; j < soloVisible.length; j++) {
      var box = soloVisible[j].querySelector(".solo__stage");
      var rect = box.getBoundingClientRect();
      var prog = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      box.querySelector(".solo__px").style.transform = "translate3d(0," + (prog * -40).toFixed(2) + "px,0) rotate(" + (prog * -2.5).toFixed(3) + "deg)";
    }
    if (!heroVisible) return;
    var pointer = finePointer.matches;
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    var sy = Math.min(window.scrollY, window.innerHeight);
    for (var i = 0; i < floats.length; i++) {
      var f = floats[i];
      var x = pointer ? cx * f.d * 26 : 0;
      var y = (pointer ? cy * f.d * 18 : 0) - sy * f.d * 0.16;
      var r = pointer ? cx * f.d * 2.4 : 0;
      f.el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) rotate(" + r.toFixed(3) + "deg)";
    }
    if (pointer && (Math.abs(tx - cx) > 0.0015 || Math.abs(ty - cy) > 0.0015)) request();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  var soloItems = $$(".solo__item");
  var soloVisible = [];
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    soloItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var soloIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("is-in");
        en.target.classList.toggle("is-paused", !en.isIntersecting);
        var k = soloVisible.indexOf(en.target);
        if (en.isIntersecting && k < 0) soloVisible.push(en.target);
        if (!en.isIntersecting && k >= 0) soloVisible.splice(k, 1);
      });
      request();
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    soloItems.forEach(function (el) { soloIO.observe(el); });
  }

  if (!reduceMotion.matches) {
    window.addEventListener("pointermove", function (e) {
      if (!finePointer.matches || e.pointerType === "touch") return;
      tx = e.clientX / window.innerWidth * 2 - 1;
      ty = e.clientY / window.innerHeight * 2 - 1;
      request();
    }, { passive: true });
    document.addEventListener("pointerleave", function () { tx = 0; ty = 0; request(); });

    // Pausa as animações quando o hero sai da tela, para poupar bateria
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        heroVisible = en[0].isIntersecting;
        heroEl.classList.toggle("is-paused", !heroVisible);
        if (heroVisible) request();
      }).observe(heroEl);
    }
    request();
  }
})();
