/*
 * Âmbar · Estúdio Digital — comportamento da página
 * Sem bibliotecas externas: tudo em JavaScript puro.
 */
(function () {
  "use strict";

  var CFG = window.ESTUDIO_CONFIG || { marca: {}, whatsapp: {} };
  var D = window.ESTUDIO_DEMOS;
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  // Imagens que não carregarem dão lugar ao fundo de cor da demonstração
  doc.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") t.classList.add("is-broken");
  }, true);
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finoPonteiro = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function semAcento(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
  }

  /* ------------------------------------------------------------
   * 1. Marca (config.js)
   * ------------------------------------------------------------ */
  var marca = CFG.marca || {};
  var nomeMarca = (marca.nome || "").trim();
  var compMarca = (marca.complemento || "").trim();
  if (nomeMarca) $$("[data-marca-nome]").forEach(function (e) { e.textContent = nomeMarca; });
  $$("[data-marca-complemento]").forEach(function (e) { e.textContent = compMarca; e.hidden = !compMarca; });
  if (nomeMarca) doc.title = nomeMarca + (compMarca ? " · " + compMarca : "") + " — Sites, lojas virtuais e páginas de vendas";
  if (marca.regiao) { var rg = $("[data-marca-regiao]"); rg.textContent = "Atendimento: " + marca.regiao; rg.hidden = false; }
  if (/^https?:\/\//.test(marca.instagram || "")) { var ig = $("[data-marca-instagram]"); ig.href = marca.instagram; ig.hidden = false; }
  if (/@/.test(marca.email || "")) { var em = $("[data-marca-email]"); em.href = "mailto:" + marca.email; em.hidden = false; }
  $$("[data-ano]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------
   * 2. Personalização pelo link (?seg=pizzaria&ref=nome)
   * ------------------------------------------------------------ */
  var params = new URLSearchParams(location.search);
  var segParam = semAcento(params.get("seg") || params.get("segmento"));
  var refParam = (params.get("ref") || "").replace(/[<>]/g, "").slice(0, 60);

  var PLURAL = {
    pizzaria: "pizzarias", hamburgueria: "hamburguerias e lanchonetes", restaurante: "restaurantes",
    doceria: "docerias e confeitarias", moda: "lojas de moda", cosmeticos: "marcas de cosméticos",
    clinica: "clínicas e consultórios", estetica: "espaços de estética", limpeza: "empresas de serviços",
    construcao: "construtoras e reformas", agro: "o agronegócio"
  };
  var PLURAL_CAT = { gastronomia: "gastronomia", moda: "moda e varejo", saude: "saúde e estética", servicos: "empresas de serviços", agro: "o agronegócio" };

  var demoInicial = null, catInicial = null, publico = "";
  if (segParam) {
    D.lista.forEach(function (d) {
      if (!demoInicial && (d.id === segParam || d.chaves.indexOf(segParam) > -1)) demoInicial = d;
    });
    if (demoInicial) { catInicial = demoInicial.cat; publico = PLURAL[demoInicial.id]; }
    else {
      D.categorias.forEach(function (c) { if (c.id === segParam) catInicial = c.id; });
      if (catInicial) { demoInicial = D.lista.filter(function (d) { return d.cat === catInicial; })[0]; publico = PLURAL_CAT[catInicial]; }
    }
  }
  if (publico) $("[data-hero-eyebrow]").textContent = "Experiências digitais para " + publico;

  /* ------------------------------------------------------------
   * 3. WhatsApp
   * ------------------------------------------------------------ */
  var wa = CFG.whatsapp || {};
  var numero = String(wa.numero || "").replace(/\D/g, "");

  function linkWhats(origem, corpo) {
    var linhas = [(wa.saudacao || "Olá!").trim()];
    linhas.push(corpo || "Gostaria de conversar sobre um projeto para o meu negócio.");
    var rodape = "Origem: " + origem;
    if (publico) rodape += " · página para " + publico;
    if (refParam) rodape += " · ref. " + refParam;
    linhas.push("", "(" + rodape + ")");
    var base = numero ? "https://wa.me/" + numero : "https://wa.me/";
    return base + "?text=" + encodeURIComponent(linhas.join("\n"));
  }

  $$("[data-wa]").forEach(function (a) { a.href = linkWhats(a.getAttribute("data-wa")); });

  /* ------------------------------------------------------------
   * 4. Molduras com demonstrações (hero e galeria)
   * ------------------------------------------------------------ */
  function reduzirFotos(raiz, largura) {
    $$("img", raiz).forEach(function (img) {
      img.src = img.getAttribute("src").replace(/w=\d+/, "w=" + largura);
    });
  }

  function encaixar(view, page, larguraBase) {
    var w = view.clientWidth;
    if (!w) return;
    var s = w / larguraBase;
    page.style.width = larguraBase + "px";
    page.style.transform = "scale(" + s + ")";
    var altura = page.offsetHeight * s;
    view.style.setProperty("--dist", Math.max(0, Math.round(altura - view.clientHeight)) + "px");
  }

  var molduras = [];
  function registrar(view, page, larguraBase) {
    var m = { view: view, page: page, w: larguraBase };
    molduras.push(m);
    encaixar(view, page, larguraBase);
    return m;
  }
  function reencaixarTudo() { molduras.forEach(function (m) { encaixar(m.view, m.page, m.w); }); }

  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function () { reencaixarTudo(); });
    ro.observe(doc.documentElement);
  } else {
    window.addEventListener("resize", reencaixarTudo);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(reencaixarTudo);
  window.addEventListener("load", reencaixarTudo);

  function preencher(alvo, demo, larguraFoto) {
    alvo.innerHTML = "";
    var el = D.criar(demo, false);
    el.setAttribute("inert", "");
    reduzirFotos(el, larguraFoto);
    alvo.appendChild(el);
    return el;
  }

  // Hero: telas de demonstração com índice vertical que alterna os conceitos
  (function hero() {
    var ciclo, fundo;
    if (demoInicial) {
      ciclo = [demoInicial].concat(D.lista.filter(function (d) { return d.cat === demoInicial.cat && d.id !== demoInicial.id; })).slice(0, 3);
      fundo = demoInicial.cat === "saude" ? D.porId("pizzaria") : D.porId("clinica");
    } else {
      ciclo = [D.porId("pizzaria"), D.porId("hamburgueria"), D.porId("restaurante")];
      fundo = D.porId("clinica");
    }

    var frames = {};
    $$("[data-frame]").forEach(function (f) {
      var tipo = f.hasAttribute("data-hero-front") ? "frente" : f.hasAttribute("data-hero-phone") ? "celular" : "fundo";
      var base = parseInt(f.getAttribute("data-w"), 10);
      var fr = { el: f, base: base, page: $("[data-frame-page]", f), view: $(".screen__view", f), label: $("[data-frame-label]", f) };
      frames[tipo] = fr;
      registrar(fr.view, fr.page, base);
      if (!reduz) { fr.view.style.setProperty("--dur", f.getAttribute("data-auto") + "s"); fr.view.classList.add("is-auto"); }
    });

    function pintar(fr, demo) {
      preencher(fr.page, demo, fr.base > 500 ? 520 : 400);
      if (fr.label) fr.label.textContent = "Conceito · " + demo.segmento;
      encaixar(fr.view, fr.page, fr.base);
    }
    pintar(frames.fundo, fundo);

    var idx = 0, timer = null, pausado = false;
    var indice = $("[data-hero-index]");
    function mostrar(n, animar) {
      idx = (n + ciclo.length) % ciclo.length;
      var demo = ciclo[idx];
      $$("button", indice).forEach(function (b, k) { b.classList.toggle("is-on", k === idx); b.setAttribute("aria-pressed", k === idx ? "true" : "false"); });
      var alvos = [frames.frente, frames.celular];
      if (!animar || reduz) { alvos.forEach(function (fr) { pintar(fr, demo); }); return; }
      alvos.forEach(function (fr) { fr.el.classList.add("is-fading"); });
      setTimeout(function () {
        alvos.forEach(function (fr) { pintar(fr, demo); fr.el.classList.remove("is-fading"); });
      }, 450);
    }

    function reiniciar() {
      clearInterval(timer);
      if (reduz || ciclo.length < 2) return;
      timer = setInterval(function () { if (!pausado && !doc.hidden) mostrar(idx + 1, true); }, 7000);
    }

    if (ciclo.length > 1) {
      indice.insertAdjacentHTML("beforeend", ciclo.map(function (d, k) {
        return '<button type="button" aria-pressed="false" aria-label="Mostrar o conceito de ' + d.segmento.toLowerCase() + ' nas telas"><b>0' + (k + 1) + '</b><span>' + d.segmento + '</span></button>';
      }).join(""));
      indice.hidden = false;
      $$("button", indice).forEach(function (b, k) {
        b.addEventListener("click", function () { if (k !== idx) mostrar(k, true); reiniciar(); });
      });
    }
    var stage = $("[data-stage]");
    stage.addEventListener("mouseenter", function () { pausado = true; });
    stage.addEventListener("mouseleave", function () { pausado = false; });
    stage.addEventListener("focusin", function () { pausado = true; });
    stage.addEventListener("focusout", function () { pausado = false; });
    mostrar(0, false);
    reiniciar();
  })();

  /* ------------------------------------------------------------
   * 5. Galeria
   * ------------------------------------------------------------ */
  var gal = {
    cats: $("[data-cats]"), projs: $("[data-projs]"), also: $("[data-cat-also]"), stage: $("[data-gallery]"),
    desk: $("[data-g-desk]"), deskView: $("[data-g-desk-view]"), phone: $("[data-g-phone]"), phoneView: $("[data-g-phone-view]"),
    atual: null, cat: null
  };
  var mDesk = null, mPhone = null;

  function demosDaCat(cat) { return D.lista.filter(function (d) { return d.cat === cat; }); }

  function teclasTablist(lista) {
    lista.addEventListener("keydown", function (e) {
      if (["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) < 0) return;
      var tabs = $$("[role=tab]", lista);
      var i = tabs.indexOf(doc.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : e.key === "Home" ? 0 : tabs.length - 1;
      tabs[n].focus();
      tabs[n].click();
    });
  }

  function montarCats() {
    gal.cats.innerHTML = D.categorias.map(function (c, i) {
      return '<button type="button" class="cat" role="tab" aria-selected="false" tabindex="-1" data-cat="' + c.id + '"><small>0' + (i + 1) + '</small><span>' + c.nome + '</span></button>';
    }).join("");
    gal.cats.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (b) escolherCat(b.getAttribute("data-cat"));
    });
    gal.projs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-proj]");
      if (b) escolherDemo(D.porId(b.getAttribute("data-proj")));
    });
    teclasTablist(gal.cats);
    teclasTablist(gal.projs);
  }

  function escolherCat(cat, demo) {
    gal.cat = cat;
    $$("[data-cat]", gal.cats).forEach(function (b) {
      var on = b.getAttribute("data-cat") === cat;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    var c = D.categorias.filter(function (x) { return x.id === cat; })[0];
    gal.also.textContent = "Para " + c.tambem.charAt(0).toLowerCase() + c.tambem.slice(1);
    var lista = demosDaCat(cat);
    gal.projs.innerHTML = lista.map(function (d) {
      return '<button type="button" class="proj" role="tab" aria-selected="false" tabindex="-1" data-proj="' + d.id + '">' + d.segmento + ' <b>' + d.nome + '</b></button>';
    }).join("");
    escolherDemo(demo && demo.cat === cat ? demo : lista[0]);
  }

  function escolherDemo(demo) {
    if (!demo || demo === gal.atual) return;
    var primeira = !gal.atual;
    gal.atual = demo;
    $$("[data-proj]", gal.projs).forEach(function (b) {
      var on = b.getAttribute("data-proj") === demo.id;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });

    function trocar() {
      var lista = demosDaCat(demo.cat);
      var idx = lista.indexOf(demo) + 1;
      $("[data-g-count]").textContent = "Conceito " + (idx < 10 ? "0" : "") + idx + " / " + (lista.length < 10 ? "0" : "") + lista.length;
      $("[data-g-name]").textContent = demo.nome;
      $("[data-g-seg]").textContent = demo.segmento + " · demonstração conceitual";
      $("[data-g-desc]").textContent = demo.resumo;
      $("[data-g-resolve]").innerHTML = demo.resolve.map(function (r) { return "<li>" + r + "</li>"; }).join("");
      $("[data-g-pal]").innerHTML = demo.paleta.map(function (p) { return '<i style="background:' + p + '" title="' + p + '"></i>'; }).join("");
      $("[data-g-type]").textContent = demo.tipografia;
      $("[data-g-url]").textContent = "Conceito · " + demo.segmento;
      $("[data-wa-gallery]").href = linkWhats("Galeria — " + demo.segmento,
        "Vi a demonstração “" + demo.nome + "” (" + demo.segmento.toLowerCase() + ") e gostaria de algo nesse estilo para o meu negócio.");

      preencher(gal.desk, demo, 760);
      preencher(gal.phone, demo, 420);
      gal.deskView.scrollTop = 0;
      if (!mDesk) {
        mDesk = registrar(gal.deskView, gal.desk, 1280);
        mPhone = registrar(gal.phoneView, gal.phone, 390);
      } else { encaixar(gal.deskView, gal.desk, 1280); encaixar(gal.phoneView, gal.phone, 390); }
      if (!reduz) { gal.phoneView.style.setProperty("--dur", "28s"); gal.phoneView.classList.add("is-auto"); }
      gal.stage.classList.remove("is-swapping");
    }

    if (primeira || reduz) { trocar(); return; }
    gal.stage.classList.add("is-swapping");
    setTimeout(trocar, 320);
  }

  // Passeio pela página ao passar o mouse sobre a tela do computador
  (function passeio() {
    var box = $("[data-gscreen]");
    var mover = $(".screen__mover", box);
    if (!finoPonteiro || reduz) return;
    box.addEventListener("mouseenter", function () {
      var dist = parseFloat(getComputedStyle(gal.deskView).getPropertyValue("--dist")) || 0;
      mover.style.transition = "transform " + Math.max(4, dist / 90) + "s cubic-bezier(.45,.05,.55,.95)";
      mover.style.transform = "translateY(" + -dist + "px)";
    });
    box.addEventListener("mouseleave", function () {
      mover.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1)";
      mover.style.transform = "translateY(0)";
    });
  })();

  montarCats();
  escolherCat(catInicial || "gastronomia", demoInicial || D.porId("pizzaria"));

  /* ------------------------------------------------------------
   * 6. Visualizador em tela cheia
   * ------------------------------------------------------------ */
  var viewer = $("[data-viewer]");
  var vScroll = $("[data-v-scroll]");
  var focoAntes = null;

  function modo(m) {
    viewer.classList.toggle("is-mobile", m === "mobile");
    $$("[data-mode]", viewer).forEach(function (b) {
      var on = b.getAttribute("data-mode") === m;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    vScroll.scrollTop = 0;
  }

  function abrir(demo) {
    focoAntes = doc.activeElement;
    vScroll.innerHTML = "";
    var tst = $("[data-dm-toast]"); tst.textContent = ""; tst.classList.remove("is-on");
    vScroll.appendChild(D.criar(demo, true));
    $("[data-v-title]").textContent = demo.nome;
    $("[data-v-sub]").textContent = demo.segmento + " · demonstração conceitual";
    $("[data-wa-viewer]").href = linkWhats("Demonstração aberta — " + demo.segmento,
      "Explorei a demonstração “" + demo.nome + "” (" + demo.segmento.toLowerCase() + ") e gostaria de um site assim para o meu negócio.");
    modo(window.innerWidth <= 720 ? "mobile" : "desktop");
    doc.body.classList.add("is-locked");
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
    $("[data-viewer-close]").focus();
  }

  function fechar() {
    if (typeof viewer.close === "function" && viewer.open) viewer.close();
    else viewer.removeAttribute("open");
  }

  viewer.addEventListener("close", function () {
    doc.body.classList.remove("is-locked");
    vScroll.innerHTML = "";
    if (focoAntes && focoAntes.focus) focoAntes.focus();
  });
  $("[data-viewer-close]").addEventListener("click", fechar);
  $$("[data-mode]", viewer).forEach(function (b) { b.addEventListener("click", function () { modo(b.getAttribute("data-mode")); }); });
  $$("[data-gallery-open]").forEach(function (b) { b.addEventListener("click", function () { abrir(gal.atual); }); });

  /* ------------------------------------------------------------
   * 7. Soluções
   * ------------------------------------------------------------ */
  var SOLUCOES = [
    { t: "Sites institucionais", d: "A casa digital da sua empresa: quem vocês são, o que fazem, onde estão e como falar com vocês.", a: "Empresas locais, clínicas, escritórios e construtoras", v: "inst" },
    { t: "Landing pages", d: "Uma página com um único objetivo, ideal para divulgar um serviço, uma campanha ou receber contatos.", a: "Campanhas, anúncios e lançamentos", v: "landing" },
    { t: "Páginas de vendas", d: "Estrutura pensada para apresentar uma oferta com clareza, responder dúvidas e conduzir à decisão.", a: "Produtos, cursos e serviços com valor definido", v: "vendas" },
    { t: "Lojas virtuais", d: "Vitrine com categorias, variações e carrinho, para o cliente escolher com calma a qualquer hora.", a: "Moda, acessórios, cosméticos e varejo", v: "loja" },
    { t: "Catálogos digitais", d: "Produtos organizados com fotos e preços, com pedido direto pelo WhatsApp.", a: "Lanchonetes, pizzarias, docerias e revendas", v: "catalogo" },
    { t: "Sistemas de pedidos e orçamentos", d: "O cliente monta o pedido ou o orçamento e você recebe tudo organizado, sem idas e vindas.", a: "Delivery, encomendas e prestadores de serviço", v: "pedidos" },
    { t: "Experiências digitais personalizadas", d: "Calculadoras, agendamentos, configuradores e outras ferramentas sob medida para o seu processo.", a: "Negócios com necessidades específicas", v: "custom" }
  ];

  function L(cls) { return '<div class="mk-l ' + (cls || "") + '"></div>'; }
  var VIS = {
    inst: function () {
      return '<div class="mk-b"><div class="mk-b__bar"><i></i><i></i><i></i></div><div class="mk-b__in">' +
        '<div class="mk-row" style="justify-content:space-between"><div class="mk-l" style="width:22%;height:10px;background:#242326"></div><div class="mk-row"><div class="mk-l" style="width:34px"></div><div class="mk-l" style="width:34px"></div><div class="mk-l" style="width:34px"></div></div></div>' +
        '<div class="mk-g2" style="align-items:center;margin:6px 0"><div style="display:grid;gap:8px">' + L("mk-l--t") + L("mk-l--m") + L("mk-l--s") + '<div class="mk-pill" style="margin-top:6px"></div></div><div class="mk-img"></div></div>' +
        '<div class="mk-g3"><div class="mk-img mk-img--c" style="aspect-ratio:5/3"></div><div class="mk-img" style="aspect-ratio:5/3"></div><div class="mk-img mk-img--c" style="aspect-ratio:5/3"></div></div></div></div>';
    },
    landing: function () {
      return '<div class="mk-b mk-tall"><div class="mk-b__bar"><i></i><i></i><i></i></div><div class="mk-b__in" style="gap:12px;text-align:center;justify-items:center">' +
        L("mk-l--s mk-l--a") + '<div class="mk-l mk-l--t" style="width:90%"></div><div class="mk-l mk-l--t" style="width:70%"></div>' + L("mk-l--m") +
        '<div class="mk-img" style="width:100%;aspect-ratio:16/8"></div><div style="width:100%;display:grid;gap:6px"><div class="mk-chip"></div><div class="mk-chip"></div></div><div class="mk-pill" style="width:100%;height:26px"></div></div></div>';
    },
    vendas: function () {
      return '<div class="mk-b"><div class="mk-b__bar"><i></i><i></i><i></i></div><div class="mk-b__in" style="grid-template-columns:1.1fr .9fr;gap:16px;align-items:start">' +
        '<div style="display:grid;gap:9px">' + L("mk-l--s mk-l--a") + L("mk-l--t") + '<div class="mk-l mk-l--t" style="width:50%"></div>' + L("mk-l--m") +
        '<div style="display:grid;gap:7px;margin-top:6px"><div class="mk-row">' + '<i style="width:10px;height:10px;border-radius:50%;background:#C8792C"></i>' + L("mk-l--m") + '</div><div class="mk-row"><i style="width:10px;height:10px;border-radius:50%;background:#C8792C"></i>' + L("mk-l--s") + '</div><div class="mk-row"><i style="width:10px;height:10px;border-radius:50%;background:#C8792C"></i>' + L("mk-l--m") + '</div></div></div>' +
        '<div class="mk-card" style="padding:14px;gap:10px;box-shadow:0 0 0 1.5px #242326">' + L("mk-l--s") + '<div class="mk-price">Oferta</div>' + L("mk-l--m") + L() + '<div class="mk-pill" style="width:100%"></div></div></div></div>';
    },
    loja: function () {
      function card(c) { return '<div class="mk-card"><div class="mk-img mk-img--t ' + (c ? "mk-img--c" : "") + '"></div>' + L("mk-l--m") + '<div class="mk-row" style="justify-content:space-between">' + '<div class="mk-l" style="width:40%;background:#242326"></div><div class="mk-pill mk-pill--d" style="width:22px;height:22px"></div></div></div>'; }
      return '<div class="mk-b"><div class="mk-b__bar"><i></i><i></i><i></i></div><div class="mk-b__in" style="background:#e9e3d9">' +
        '<div class="mk-row" style="gap:6px"><div class="mk-chip on" style="width:44px"></div><div class="mk-chip" style="width:58px"></div><div class="mk-chip" style="width:50px"></div></div>' +
        '<div class="mk-g3">' + card(0) + card(1) + card(0) + '</div></div></div><span class="mk-cart">2</span>';
    },
    catalogo: function () {
      function li() { return '<div class="mk-li"><i></i><div style="display:grid;gap:5px">' + L("mk-l--m") + '<div class="mk-l" style="width:40%;background:#242326"></div></div><b></b></div>'; }
      return '<div class="mk-ph"><div class="mk-ph__in">' + '<div class="mk-l mk-l--t" style="width:60%;height:14px"></div><div class="mk-row" style="gap:5px"><div class="mk-chip on" style="width:40px;height:18px"></div><div class="mk-chip" style="width:46px;height:18px"></div><div class="mk-chip" style="width:36px;height:18px"></div></div>' +
        li() + li() + li() + li() + li() + '</div></div>';
    },
    pedidos: function () {
      return '<div class="mk-ph"><div class="mk-ph__in">' + '<div class="mk-step"><span class="on"></span><span class="on"></span><span></span></div>' + '<div class="mk-l mk-l--t" style="width:70%;height:14px;margin-top:6px"></div>' +
        '<div class="mk-g2" style="gap:6px"><div class="mk-chip on" style="height:30px"></div><div class="mk-chip" style="height:30px"></div><div class="mk-chip" style="height:30px"></div><div class="mk-chip on" style="height:30px"></div></div>' +
        L("mk-l--s") + '<div class="mk-g2" style="gap:6px"><div class="mk-chip" style="height:30px"></div><div class="mk-chip on" style="height:30px"></div></div>' +
        '<div class="mk-total">' + '<div class="mk-l" style="width:40%"></div><b></b></div><div class="mk-pill" style="width:100%;height:28px;background:#3fae67"></div></div></div>';
    },
    custom: function () {
      return '<div class="mk-b" style="width:86%"><div class="mk-b__bar"><i></i><i></i><i></i></div><div class="mk-b__in" style="gap:16px">' + L("mk-l--t") +
        '<div style="display:grid;gap:8px">' + L("mk-l--s") + '<div class="mk-slider" style="--v:35%"></div></div><div style="display:grid;gap:8px">' + L("mk-l--s") + '<div class="mk-slider" style="--v:72%"></div></div>' +
        '<div class="mk-row" style="gap:6px"><div class="mk-chip on" style="width:60px"></div><div class="mk-chip" style="width:60px"></div><div class="mk-chip" style="width:60px"></div></div></div></div>' +
        '<div class="mk-float" style="right:8%;bottom:16%;width:38%">' + L("mk-l--s mk-l--a") + '<div class="mk-price">Resultado</div>' + L("mk-l--m") + '<div class="mk-pill mk-pill--d" style="width:100%"></div></div>';
    }
  };

  function vis(s, i) {
    return '<div class="sol__vis" data-vis="' + i + '"><div class="mk">' + VIS[s.v]() +
      '<p class="mk__cap"><b>' + (i < 9 ? "0" : "") + (i + 1) + '</b><span>' + s.t + '</span></p></div></div>';
  }

  (function solucoes() {
    var lista = $("[data-sol-list]");
    var painel = $("[data-sol-panel]");
    lista.innerHTML = SOLUCOES.map(function (s, i) {
      var id = "sol-" + i;
      return '<li class="sol__item" data-sol-item="' + i + '"><h3 style="margin:0"><button type="button" class="sol__btn" aria-expanded="false" aria-controls="' + id + '">' +
        '<span class="sol__n">' + (i < 9 ? "0" : "") + (i + 1) + '</span><span class="sol__title">' + s.t + '</span><span class="sol__plus" aria-hidden="true"></span></button></h3>' +
        '<div class="sol__body" id="' + id + '"><div><div class="sol__inline" aria-hidden="true">' + vis(s, i) + '</div><p>' + s.d + '</p><p class="sol__app"><b>Aplicação:</b> ' + s.a + '</p></div></div></li>';
    }).join("");
    painel.innerHTML = SOLUCOES.map(vis).join("");

    function ativar(i) {
      $$("[data-sol-item]", lista).forEach(function (li, k) {
        var on = k === i;
        li.classList.toggle("is-on", on);
        $(".sol__btn", li).setAttribute("aria-expanded", on ? "true" : "false");
      });
      $$("[data-vis]", painel).forEach(function (v, k) { v.classList.toggle("is-on", k === i); });
    }
    lista.addEventListener("click", function (e) {
      var b = e.target.closest(".sol__btn");
      if (!b) return;
      var i = parseInt(b.closest("[data-sol-item]").getAttribute("data-sol-item"), 10);
      var aberto = b.getAttribute("aria-expanded") === "true";
      ativar(aberto && window.innerWidth <= 1024 ? -1 : i);
    });
    if (finoPonteiro) {
      lista.addEventListener("mouseover", function (e) {
        var li = e.target.closest("[data-sol-item]");
        if (li && window.innerWidth > 1024) ativar(parseInt(li.getAttribute("data-sol-item"), 10));
      });
    }
    ativar(0);
  })();

  /* ------------------------------------------------------------
   * 8. Comparador antes/depois
   * ------------------------------------------------------------ */
  (function comparar() {
    var box = $("[data-compare]");
    var range = $("[data-compare-range]");
    function set() { box.style.setProperty("--pos", range.value + "%"); }
    if (window.innerWidth <= 720) range.value = 30;
    range.addEventListener("input", set);
    range.addEventListener("pointerdown", function () { box.classList.add("is-drag"); });
    window.addEventListener("pointerup", function () { box.classList.remove("is-drag"); });
    set();
    // Pequena demonstração do gesto quando aparece pela primeira vez
    if (!reduz && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ent) {
        if (!ent[0].isIntersecting) return;
        io.disconnect();
        var t0 = null, base = parseFloat(range.value);
        function passo(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1800);
          var v = base + Math.sin(p * Math.PI * 2) * 18 * (1 - p);
          if (!box.classList.contains("is-drag")) { range.value = v; set(); }
          if (p < 1) requestAnimationFrame(passo);
        }
        setTimeout(function () { requestAnimationFrame(passo); }, 500);
      }, { threshold: .5 });
      io.observe(box);
    }
  })();

  /* ------------------------------------------------------------
   * 9. Mensagem montada (contato final)
   * ------------------------------------------------------------ */
  (function composer() {
    var sel = { segmento: null, objetivo: null };
    var link = $("[data-wa-composer]");
    var prev = $("[data-composer-preview]");
    function atualizar() {
      var partes = [];
      if (sel.segmento) partes.push("Meu negócio é do segmento: " + sel.segmento + ".");
      if (sel.objetivo) partes.push("Procuro: " + sel.objetivo + ".");
      var corpo = partes.length ? partes.join(" ") + " Gostaria de conversar sobre o projeto." : "";
      link.href = linkWhats("Contato final — Conversar pelo WhatsApp", corpo);
      prev.textContent = partes.length ? "Mensagem: “" + partes.join(" ") + "”" : "A conversa começa com uma mensagem pronta. Você pode editar antes de enviar.";
    }
    $$("[data-chips]").forEach(function (g) {
      g.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        var chave = g.getAttribute("data-chips");
        var ja = b.getAttribute("aria-pressed") === "true";
        $$("button", g).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        if (!ja) b.setAttribute("aria-pressed", "true");
        sel[chave] = ja ? null : b.textContent.trim();
        atualizar();
      });
    });
    if (demoInicial) {
      var nomeCat = D.categorias.filter(function (c) { return c.id === demoInicial.cat; })[0].nome;
      $$('[data-chips="segmento"] button').forEach(function (b) { if (b.textContent.trim() === nomeCat) { b.setAttribute("aria-pressed", "true"); sel.segmento = nomeCat; } });
    }
    atualizar();
  })();

  /* ------------------------------------------------------------
   * 10. Animações de entrada e de rolagem
   * ------------------------------------------------------------ */
  function dividir(el) {
    var i = 0;
    function andar(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var w = doc.createElement("span"); w.className = "w";
            var s = doc.createElement("span"); s.textContent = p; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          no.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") andar(n);
      });
    }
    andar(el);
  }
  $$("[data-split]").forEach(dividir);

  // Manifesto: palavras acendem com a rolagem
  var scrub = $("[data-scrub]");
  var palavras = [];
  if (scrub) {
    var txt = scrub.textContent.trim().split(/\s+/);
    scrub.setAttribute("aria-label", scrub.textContent.trim());
    scrub.innerHTML = txt.map(function (w) { return '<span class="sw" aria-hidden="true">' + w + "</span>"; }).join(" ");
    palavras = $$(".sw", scrub);
  }

  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    $$("[data-reveal], [data-split]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal], [data-split]").forEach(function (el) { el.classList.add("is-in"); });
    palavras.forEach(function (w) { w.classList.add("on"); });
  }

  var nav = $("[data-nav]");
  var fab = $("[data-fab]");
  var heroEl = $(".hero");
  var steps = $("[data-steps]");
  var stepItems = steps ? $$(".step", steps) : [];
  var finalVisivel = false;

  if ("IntersectionObserver" in window) {
    var ioFim = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { e.target._vis = e.isIntersecting; });
      finalVisivel = $$("[data-final], .foot").some(function (x) { return x._vis; });
      quadro();
    }, { threshold: .15 });
    $$("[data-final], .foot").forEach(function (x) { ioFim.observe(x); });
  }

  var agendado = false;
  function quadro() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () {
      agendado = false;
      var y = window.scrollY, vh = window.innerHeight;
      nav.classList.toggle("is-scrolled", y > 30);
      fab.classList.toggle("is-on", y > heroEl.offsetHeight * .75 && !finalVisivel);

      if (!reduz && palavras.length) {
        var r = scrub.getBoundingClientRect();
        var p = (vh * .88 - r.top) / (r.height + vh * .35);
        var n = Math.round(Math.max(0, Math.min(1, p)) * palavras.length);
        for (var i = 0; i < palavras.length; i++) palavras[i].classList.toggle("on", i < n);
      }
      if (steps) {
        var rs = steps.getBoundingClientRect();
        var ps = Math.max(0, Math.min(1, (vh * .8 - rs.top) / (rs.height * .9 + vh * .1)));
        steps.style.setProperty("--p", reduz ? 1 : ps.toFixed(3));
        stepItems.forEach(function (s, k) { s.classList.toggle("is-active", reduz || ps >= (k + .15) / stepItems.length); });
      }
    });
  }
  window.addEventListener("scroll", quadro, { passive: true });
  window.addEventListener("resize", quadro);
  quadro();

  // Paralaxe suave das telas do hero
  (function paralaxe() {
    var stage = $("[data-stage]");
    if (!stage || reduz || !finoPonteiro) return;
    var alvo = { x: 0, y: 0 }, atual = { x: 0, y: 0 }, rodando = false;
    heroEl.addEventListener("pointermove", function (e) {
      alvo.x = (e.clientX / window.innerWidth - .5) * 2;
      alvo.y = (e.clientY / window.innerHeight - .5) * 2;
      if (!rodando) { rodando = true; requestAnimationFrame(loop); }
    });
    function loop() {
      atual.x += (alvo.x - atual.x) * .08;
      atual.y += (alvo.y - atual.y) * .08;
      stage.style.setProperty("--mx", atual.x.toFixed(3));
      stage.style.setProperty("--my", atual.y.toFixed(3));
      if (Math.abs(alvo.x - atual.x) > .001 || Math.abs(alvo.y - atual.y) > .001) requestAnimationFrame(loop);
      else rodando = false;
    }
  })();

  // Botões com leve atração magnética
  if (finoPonteiro && !reduz) {
    $$(".btn--amber").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * .18, y = (e.clientY - r.top - r.height / 2) * .28;
        b.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ------------------------------------------------------------
   * 11. Menu do celular
   * ------------------------------------------------------------ */
  (function menu() {
    var bt = $("[data-menu-toggle]");
    var m = $("[data-menu]");
    function set(abrir) {
      bt.setAttribute("aria-expanded", abrir ? "true" : "false");
      $(".sr-only", bt).textContent = abrir ? "Fechar menu" : "Abrir menu";
      m.hidden = !abrir;
      doc.body.classList.toggle("is-locked", abrir);
      nav.classList.toggle("is-scrolled", abrir || window.scrollY > 30);
    }
    bt.addEventListener("click", function () { set(bt.getAttribute("aria-expanded") !== "true"); });
    $$("[data-menu-link], [data-menu] .btn").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { set(false); bt.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024 && !m.hidden) set(false); });
  })();

})();
