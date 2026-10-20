/* Página de coleção: categorias, filtros, busca e favoritos */
(function () {
  var S = MB.store, U = MB.ui;
  var params = new URLSearchParams(location.search);
  var state = {
    categoria: params.get("categoria") || "",
    filtro: params.get("filtro") || "",
    busca: params.get("busca") || "",
    lista: params.get("lista") || "",
    ordem: params.get("ordem") || ""
  };
  var FILTERS = {
    "novidades": { title: "Novidades", desc: "As peças que acabaram de chegar." },
    "mais-vendidos": { title: "Mais vendidos", desc: "As escolhas preferidas de quem já conhece a Mais Bella." },
    "presentes": { title: "Presentes", desc: "Peças pensadas para transformar um momento em lembrança." },
    "promocoes": { title: "Promoções", desc: "Peças com valor especial por tempo limitado." }
  };
  var settings, cats = [];

  U.mount().then(function (s) {
    settings = s;
    return S.listCategories();
  }).then(function (c) {
    cats = c;
    renderTabs();
    U.$("[data-sort]").value = state.ordem;
    U.$("[data-sort]").addEventListener("change", function (e) { state.ordem = e.target.value; sync(); load(); });
    if (!S.live) U.$("[data-demo-note]").innerHTML = '<p class="demo-note">' + U.icon("info") + "<span>Catálogo de demonstração com imagens renderizadas em 3D e valores ilustrativos.</span></p>";
    load();
    document.addEventListener("mb:fav", function () { if (state.lista === "favoritos") load(); });
  });

  function renderTabs() {
    var items = [{ key: "", label: "Todas" }].concat(cats.map(function (c) { return { key: "c:" + c.slug, label: c.name }; }))
      .concat([{ key: "f:novidades", label: "Novidades" }, { key: "f:mais-vendidos", label: "Mais vendidos" }, { key: "f:presentes", label: "Presentes" }]);
    var cur = state.categoria ? "c:" + state.categoria : state.filtro ? "f:" + state.filtro : "";
    if (state.busca || state.lista) cur = null;
    U.$("[data-tabs]").innerHTML = items.map(function (t) {
      return '<button class="chip" type="button" data-k="' + t.key + '" aria-pressed="' + (t.key === cur) + '">' + U.esc(t.label) + "</button>";
    }).join("");
    U.$("[data-tabs]").onclick = function (e) {
      var b = e.target.closest("[data-k]"); if (!b) return;
      var k = b.getAttribute("data-k");
      state.categoria = k.indexOf("c:") === 0 ? k.slice(2) : "";
      state.filtro = k.indexOf("f:") === 0 ? k.slice(2) : "";
      state.busca = ""; state.lista = "";
      U.$$("[data-k]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      sync(); load();
    };
  }

  function sync() {
    var p = new URLSearchParams();
    Object.keys(state).forEach(function (k) { if (state[k]) p.set(k, state[k]); });
    history.replaceState(null, "", "colecao.html" + (p.toString() ? "?" + p : ""));
  }

  function heading() {
    var title = "Toda a coleção", desc = "Semijoias em ouro 18K, prata 925, aço inoxidável, alianças e personalizados.";
    if (state.categoria) {
      var c = cats.filter(function (x) { return x.slug === state.categoria; })[0];
      if (c) { title = c.name; desc = c.description; }
    } else if (state.filtro && FILTERS[state.filtro]) { title = FILTERS[state.filtro].title; desc = FILTERS[state.filtro].desc; }
    if (state.busca) { title = "Resultados para “" + state.busca + "”"; desc = ""; }
    if (state.lista === "favoritos") { title = "Seus favoritos"; desc = "As peças que você guardou para ver depois. Ficam salvas neste aparelho."; }
    U.$("[data-title]").textContent = title;
    U.$("[data-crumb]").textContent = title;
    U.$("[data-desc]").textContent = desc || "";
    U.setMeta(title + " · Mais Bella Semijoias", desc || settings.seo.description);
  }

  var seq = 0;
  function load() {
    heading();
    var grid = U.$("[data-grid]"), my = ++seq;
    grid.innerHTML = U.skeletonCards(8);
    var q = { category: state.categoria, filter: state.filtro, search: state.busca, sort: state.ordem };
    if (state.lista === "favoritos") q = { ids: S.getFav(), sort: state.ordem };
    S.listProducts(q).then(function (list) {
      if (my !== seq) return;
      U.$("[data-count]").textContent = list.length + (list.length === 1 ? " peça" : " peças");
      if (!list.length) {
        grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' +
          (state.lista === "favoritos"
            ? U.icon("heart", "icon--lg") + '<p class="h3">Nenhum favorito ainda</p><p>Toque no coração das peças para guardá-las aqui.</p>'
            : '<p class="h3">Nenhuma peça encontrada</p><p>' + (state.busca ? "Tente outra palavra ou explore as coleções." : "Novas peças chegam em breve.") + "</p>") +
          '<a class="btn btn--ghost" href="colecao.html">Ver toda a coleção</a></div>';
        return;
      }
      grid.innerHTML = list.map(function (p) { return U.productCard(p, settings, { reveal: true }); }).join("");
      U.observeReveal(grid);
    }).catch(function () {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><p class="h3">Não foi possível carregar as peças.</p><button class="btn btn--ghost" type="button" onclick="location.reload()">Tentar novamente</button></div>';
    });
  }
})();
