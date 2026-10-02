/* ==========================================================================
   OBARAKI · PÁGINA INICIAL
   ========================================================================== */
(function () {
  "use strict";

  var S = window.OBK.store;
  var U = window.OBK.ui;
  var $ = U.$;
  var esc = U.esc;
  var icon = U.icon;

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o ? o[k] : undefined;
    }, obj);
  }

  /* Mostra ou esconde uma seção conforme os dados. Como o painel pode
     re-renderizar a página, a seção também volta a aparecer quando preciso. */
  function showSection(name, on) {
    var s = document.querySelector('[data-section="' + name + '"]');
    if (s) s.hidden = !on;
  }

  function hideSection(name) {
    showSection(name, false);
  }

  function render() {
    var s = S.settings();

    /* Textos editáveis */
    U.$$("[data-set]").forEach(function (el) {
      var v = get(s, el.getAttribute("data-set"));
      if (v) el.textContent = v;
    });

    /* Hero: meta e foto */
    var d = s.delivery || {};
    var meta = [];
    if (d.mode !== "zones" && !(d.freeEnabled && !(Number(d.freeMin) > 0))) {
      meta.push(icon("moto") + "Entrega " + S.money(d.fee) + (d.areaLabel ? " · " + esc(d.areaLabel.replace(/^para\s+/i, "")) : ""));
    } else if (d.freeEnabled && !(Number(d.freeMin) > 0)) {
      meta.push(icon("moto") + "Entrega grátis");
    } else if (d.areaLabel) {
      meta.push(icon("moto") + esc(d.areaLabel));
    }
    /* Formas de pagamento já aparecem na faixa de benefícios logo abaixo. */
    if (s.hours) meta.push(icon("clock") + esc(s.hours));
    $("[data-hero-meta]").innerHTML = meta
      .map(function (m) {
        return "<span>" + m + "</span>";
      })
      .join("");

    var vis = $("[data-hero-visual]");
    var heroImg = s.hero && s.hero.image;
    var chips = heroChips();
    vis.innerHTML =
      '<div class="hero-sun" aria-hidden="true"></div>' +
      (heroImg
        ? '<img class="hero-photo" src="' + esc(heroImg) + '" alt="Sushi da ObaraKi" fetchpriority="high">'
        : '<img class="hero-art" src="assets/img/hero-sushi.svg" alt="Niguiris de salmão servidos em prancha" width="640" height="640" fetchpriority="high">') +
      '<span class="hero-kanji" aria-hidden="true">手巻寿司</span>' +
      chips;

    /* Favoritos */
    var fav = S.products({ featured: true });
    if (!fav.length) fav = S.products({ category: "combos" }).slice(0, 4);
    $('[data-render="favorites"]').innerHTML = fav
      .slice(0, 4)
      .map(function (p) {
        return U.card(p, "feature");
      })
      .join("");

    /* Promoções */
    var promos = S.promotions();
    showSection("promos", !!promos.length);
    if (promos.length) {
      $('[data-render="promos"]').innerHTML = promos.map(U.promoCard).join("");
    } else hideSection("promos");

    /* Combos (exceto executivos e itens já nas promoções/favoritos não importa: mostramos todos) */
    /* Combos: mostra os que ainda não apareceram em favoritos/promoções,
       para não repetir informação na mesma página. */
    var shown = {};
    fav.slice(0, 4).forEach(function (p) {
      shown[p.id] = 1;
    });
    promos.forEach(function (e) {
      shown[e.product.id] = 1;
    });
    var allCombos = S.products({ category: "combos" }).filter(function (p) {
      return p.kind !== "executivo";
    });
    var combos = allCombos.filter(function (p) {
      return !shown[p.id];
    });
    if (!combos.length) combos = allCombos;
    showSection("combos", !!combos.length);
    if (combos.length) {
      $('[data-render="combos"]').innerHTML = combos
        .slice(0, 6)
        .map(function (p) {
          return U.card(p, "combo");
        })
        .join("");
    } else hideSection("combos");

    /* Executivos */
    var exec = S.products().filter(function (p) {
      return p.kind === "executivo";
    });
    showSection("exec", !!exec.length);
    if (exec.length) {
      $('[data-render="exec"]').innerHTML = exec.map(U.execCard).join("");
    } else hideSection("exec");

    /* Temakis */
    var temakis = S.products({ category: "temaki" });
    showSection("temaki", !!temakis.length);
    if (temakis.length) {
      $('[data-render="temakis"]').innerHTML = temakis.map(U.menuRow).join("");
      var opt = null;
      temakis.some(function (p) {
        opt = (p.options || [])[0];
        return !!opt;
      });
      if (opt) $("[data-temaki-note]").textContent = "O clássico da temakeria em várias versões. Opção com " + opt.name.toLowerCase() + " por + " + S.money(opt.price) + ".";
      var withImg = temakis.filter(function (p) {
        return p.image;
      })[0];
      $("[data-temaki-aside]").classList.toggle("has-photo", !!withImg);
      $("[data-temaki-bg]").innerHTML = withImg
        ? '<img src="' + esc(withImg.image) + '" alt="" loading="lazy">'
        : '<div class="temaki-art" aria-hidden="true"><span>手巻</span></div>';
    } else hideSection("temaki");

    /* Categorias */
    $('[data-render="cats"]').innerHTML = S.categories()
      .map(function (c) {
        return '<a class="cat-tile" href="cardapio.html#cat-' + esc(c.id) + '">' + esc(c.name) + '<span class="jp" aria-hidden="true">' + esc(c.kanji || "") + "</span></a>";
      })
      .join("");

    /* Sobre */
    var about = $("[data-about-visual]");
    var hasAbout = !!(s.about && s.about.image);
    about.classList.toggle("has-photo", hasAbout);
    about.innerHTML = hasAbout
      ? '<img src="' + esc(s.about.image) + '" alt="ObaraKi Temakeria" loading="lazy">'
      : '<div class="about-art" aria-hidden="true"><span class="sun"></span><span class="about-kanji">手巻寿司</span></div>';

    /* Contato */
    var fee =
      d.freeEnabled && !(Number(d.freeMin) > 0)
        ? "Entrega grátis"
        : d.mode === "zones"
        ? "Taxa conforme o bairro"
        : "Taxa de entrega " + S.money(d.fee);
    var freeLine = d.freeEnabled && Number(d.freeMin) > 0 ? "<p>Entrega grátis acima de " + S.money(d.freeMin) + ".</p>" : "";
    $('[data-render="contact"]').innerHTML =
      '<div class="contact-card"><h3>WhatsApp</h3><div class="big">' +
      esc(S.phoneDisplay(s.whatsapp)) +
      "</div><p>Tire dúvidas ou faça seu pedido direto com a gente.</p>" +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      U.waHref("Olá! Vim pelo site da ObaraKi.") +
      '">' +
      '<svg class="icon icon-sm" viewBox="0 0 24 24" style="fill:currentColor;stroke:none">' +
      U.WA_SVG.replace(/^<svg[^>]*>|<\/svg>$/g, "") +
      "</svg>Chamar no WhatsApp</a></div>" +
      '<div class="contact-card"><h3>Delivery</h3><div class="big">' +
      esc(d.areaLabel || s.city) +
      "</div><p>" +
      esc(fee) +
      (s.hours ? " · " + esc(s.hours) : "") +
      "</p>" +
      freeLine +
      '<a class="btn btn-primary" href="cardapio.html">Fazer pedido</a></div>' +
      '<div class="contact-card"><h3>Também no app</h3><div class="big">iFood</div><p>Prefere pedir pelo aplicativo? A ObaraKi também atende por lá.</p>' +
      '<a class="btn btn-ghost" ' +
      U.linkAttrs("ifood") +
      ">" +
      icon("store", "icon-sm") +
      "Peça também pelo iFood</a></div>";

    /* Instagram */
    var handle = s.instagramHandle ? "@" + s.instagramHandle.replace(/^@/, "") : "Instagram";
    $("[data-insta-handle]").textContent = handle;
    var ib = $("[data-insta-btn]");
    if (s.instagramUrl) {
      ib.href = s.instagramUrl;
      ib.target = "_blank";
      ib.rel = "noopener";
      ib.removeAttribute("data-missing");
    } else {
      ib.href = "#";
      ib.setAttribute("data-missing", "instagram");
    }
    var tiles = [];
    (s.gallery || []).forEach(function (src) {
      if (src) tiles.push({ src: src, label: "" });
    });
    if (tiles.length < 6) {
      S.products()
        .filter(function (p) {
          return p.image;
        })
        .forEach(function (p) {
          if (tiles.length < 6) tiles.push({ src: p.image, label: p.name, kanji: U.kanjiFor(p) });
        });
    }
    /* Sem link do Instagram a seção fica oculta. Sem nenhuma foto real, não
       inventamos um feed: mostramos só o título e o botão. */
    showSection("insta", true);
    var hasPhotos = tiles.length > 0;
    $('[data-render="insta"]').hidden = !hasPhotos;
    $(".insta-head").classList.toggle("is-compact", !hasPhotos);
    var fallbackKanji = ["手巻", "刺身", "握り", "盛合", "寿司", "揚巻"];
    var i = 0;
    while (hasPhotos && tiles.length < 6) {
      tiles.push({ src: "", label: "", kanji: fallbackKanji[i++ % fallbackKanji.length] });
    }
    var instaAttrs = U.linkAttrs("instagram");
    $('[data-render="insta"]').innerHTML = tiles
      .slice(0, 6)
      .map(function (t) {
        return (
          "<a " +
          instaAttrs +
          ' aria-label="Ver no Instagram"><div class="media">' +
          U.mediaHTML(t.src, t.label || "Foto da ObaraKi", t.kanji || "寿司") +
          "</div>" +
          (t.label ? '<span class="tile-cap">' + esc(t.label) + "</span>" : "") +
          "</a>"
        );
      })
      .join("");

    U.hydrate(document);
  }

  function heroChips() {
    var a = S.product("combo-master-chef");
    var b = S.products({ category: "temaki" })[0];
    if (!a || !S.price(a)) a = S.products({ featured: true })[0];
    var out = "";
    if (a && S.price(a) !== null) {
      out +=
        '<button type="button" class="hero-chip hero-chip--a" data-open="' +
        esc(a.id) +
        '"><span class="dot" aria-hidden="true">' +
        esc(U.kanjiFor(a).charAt(0)) +
        "</span><span><b>" +
        esc(a.name) +
        "</b><small>" +
        S.money(S.price(a)) +
        "</small></span></button>";
    }
    if (b && S.price(b) !== null) {
      out +=
        '<button type="button" class="hero-chip hero-chip--b" data-open="' +
        esc(b.id) +
        '"><span class="dot" aria-hidden="true">' +
        esc(U.kanjiFor(b).charAt(0)) +
        "</span><span><b>" +
        esc(b.name) +
        "</b><small>" +
        S.money(S.price(b)) +
        "</small></span></button>";
    }
    return out;
  }

  render();
  window.addEventListener("obk:data", render);
})();
