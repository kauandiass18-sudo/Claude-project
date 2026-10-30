/* Página inicial */
(function () {
  var S = MB.store, U = MB.ui;

  var TABS = [
    { key: "todos", label: "Todos" },
    { key: "mais-vendidos", label: "Mais vendidos", q: { filter: "mais-vendidos" }, href: "colecao.html?filtro=mais-vendidos" },
    { key: "novidades", label: "Novidades", q: { filter: "novidades" }, href: "colecao.html?filtro=novidades" },
    { key: "ouro-18k", label: "Ouro 18K", q: { category: "ouro-18k" }, href: "colecao.html?categoria=ouro-18k" },
    { key: "prata-925", label: "Prata 925", q: { category: "prata-925" }, href: "colecao.html?categoria=prata-925" },
    { key: "aco-inoxidavel", label: "Aço inoxidável", q: { category: "aco-inoxidavel" }, href: "colecao.html?categoria=aco-inoxidavel" },
    { key: "personalizados", label: "Personalizados", q: { category: "aliancas-personalizados" }, href: "colecao.html?categoria=aliancas-personalizados" }
  ];

  U.mount().then(function (s) {
    U.setMeta(s.seo.title, s.seo.description);
    applyTexts(s);
    renderCats();
    renderTabs(s);
    renderTrust(s);
    if (!S.live) {
      U.$("[data-demo-note]").innerHTML = '<p class="demo-note">' + U.icon("info") +
        "<span>Catálogo de demonstração: as imagens são renderizações 3D criadas para esta apresentação e os valores são ilustrativos. As fotografias e os preços oficiais serão cadastrados pela loja no painel.</span></p>";
    }
  });

  function applyTexts(s) {
    var h = s.hero;
    animateTitle(U.$("[data-hero-title]"), U.safeHtml(h.title));
    U.$("[data-hero-text]").textContent = h.text;
    U.$("[data-hero-primary]").textContent = h.primary;
    U.$("[data-hero-secondary]").textContent = h.secondary;
    var src = U.$(".hero source"), img = U.$("[data-hero-img]");
    if (h.image && src.getAttribute("srcset") !== h.image) src.setAttribute("srcset", h.image);
    if ((h.imageMobile || h.image) && img.getAttribute("src") !== (h.imageMobile || h.image)) img.src = h.imageMobile || h.image;

    var e = s.essence;
    U.$("[data-essence-title]").innerHTML = U.safeHtml(e.title);
    U.$("[data-essence-body]").innerHTML = U.paragraphs(e.body) + '<p class="essence__sig">Mais Bella</p>';
    if (e.image) U.$("[data-essence-img]").src = e.image;
    if (e.imageDetail) U.$("[data-essence-detail]").src = e.imageDetail;
    else U.$(".essence__detail").hidden = true;

    var g = s.gift;
    U.$("[data-gift-title]").innerHTML = U.safeHtml(g.title);
    U.$("[data-gift-text]").textContent = g.text;
    U.$("[data-gift-btn]").textContent = g.button;
    if (g.image) U.$("[data-gift-img]").src = g.image;
  }

  // Cada palavra do título sobe em sequência; o trecho em <em> (caligrafia)
  // se "escreve" da esquerda para a direita, com dois brilhos delicados.
  var SPARK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z"/></svg>';
  function animateTitle(el, html) {
    el.innerHTML = html;
    var i = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement("span");
          w.className = "w"; w.textContent = part; w.style.animationDelay = (0.15 + i++ * 0.09) + "s";
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeName === "EM") {
        n.style.animationDelay = (0.25 + i * 0.09) + "s";
        n.insertAdjacentHTML("beforeend", '<span class="sparkle sparkle--a">' + SPARK + '</span><span class="sparkle sparkle--b">' + SPARK + "</span>");
      }
    });
  }

  function renderCats() {
    S.listCategories().then(function (cats) {
      U.$("[data-cats]").innerHTML = cats.map(function (c, i) {
        var url = "colecao.html?categoria=" + encodeURIComponent(c.slug);
        return (
          '<a class="cat reveal reveal-d' + (i % 4) + '" href="' + url + '">' +
          '<div class="cat__media"><img ' + U.imgAttrs(c.image, "(min-width: 900px) 25vw, 50vw") + ' alt="" loading="lazy" decoding="async">' +
          '<span class="cat__index">0' + (i + 1) + "</span></div>" +
          "<div>" +
          '<h3 class="cat__name">' + U.esc(c.name) + "</h3>" +
          '<p class="cat__desc">' + U.esc(c.description) + "</p>" +
          '<span class="link">Ver coleção ' + U.icon("arrow", "icon--sm") + "</span>" +
          "</div></a>"
        );
      }).join("");
      U.observeReveal(U.$("[data-cats]"));
    });
  }

  function renderTabs(s) {
    var wrap = U.$("[data-tabs]");
    wrap.innerHTML = TABS.map(function (t, i) {
      return '<button class="chip" type="button" data-tab="' + t.key + '" aria-pressed="' + (i === 0) + '">' + t.label + "</button>";
    }).join("");
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]"); if (!b) return;
      U.$$("[data-tab]", wrap).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      load(s, TABS.filter(function (t) { return t.key === b.getAttribute("data-tab"); })[0]);
    });
    load(s, TABS[0]);
  }

  var seq = 0;
  function load(s, tab) {
    var grid = U.$("[data-grid]");
    var my = ++seq;
    grid.innerHTML = U.skeletonCards(8);
    U.$("[data-grid-more]").setAttribute("href", tab.href || "colecao.html");
    var q = Object.assign({ limit: 8 }, tab.q || {});
    S.listProducts(q).then(function (list) {
      if (my !== seq) return;
      if (!list.length) {
        grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><p class="h3">Em breve, novas peças por aqui.</p><p>Enquanto isso, explore as outras coleções.</p></div>';
        return;
      }
      grid.innerHTML = list.map(function (p) { return U.productCard(p, s, { reveal: true }); }).join("");
      U.observeReveal(grid);
    }).catch(function () {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><p class="h3">Não foi possível carregar as peças.</p><button class="btn btn--ghost" type="button" onclick="location.reload()">Tentar novamente</button></div>';
    });
  }

  function renderTrust(s) {
    U.$("[data-trust]").innerHTML = (s.trust || []).map(function (t) {
      return '<a class="trust__item" href="' + U.esc(t.link || "#") + '">' + U.icon(t.icon || "sparkle", "icon--lg") +
        "<div><strong>" + U.esc(t.title) + "</strong><p>" + U.esc(t.text) + "</p></div></a>";
    }).join("");
  }
})();
