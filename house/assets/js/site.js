/* =========================================================================
   House Hamburgueria 66 · site (cardápio, sacola e pedido pelo WhatsApp)
   ========================================================================= */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var S = window.HouseStore;
  var U = S.util, fmt = U.fmt, esc = U.esc;
  var Sacola = S.Sacola;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var dados = { loja: {}, categorias: [], produtos: [], promocoes: [] };
  var porId = {};

  // ------------------------------------------------------------ ajudantes
  function foneBonito(n) {
    var d = String(n || "").replace(/\D/g, "");
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return n || "";
  }
  function linkWhats(texto) {
    var n = String(dados.loja.whatsapp || "").replace(/\D/g, "");
    if (!n) return "";
    return "https://wa.me/" + n + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
  function precoHTML(p, classe) {
    if (p.preco == null) return '<p class="' + classe + ' ' + classe + '--consulta">Consultar valor</p>';
    return '<p class="' + classe + '">' + (p.aPartirDe ? "<small>a partir de</small>" : "") + fmt(p.preco) + "</p>";
  }
  function fotoHTML(src, alt, extra) {
    if (!src) return '<div class="sem-foto" aria-hidden="true"><b>House</b>Foto em breve</div>';
    return '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async"' + (extra || "") + ">";
  }
  function primeiroNome(s) { return String(s || "").trim().split(/\s+/)[0]; }

  var toastTimer;
  function toast(msg) {
    var t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("ver");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("ver"); }, 2600);
  }

  // ------------------------------------------------------------ informações da loja
  function aplicarLoja() {
    var l = dados.loja;
    var sit = S.situacao(l);
    var st = $("[data-status]");
    if (sit) {
      st.hidden = false;
      st.classList.toggle("fechado", !sit.aberto);
      $("[data-status-texto]").textContent = sit.texto;
    }
    $$("[data-horario-texto]").forEach(function (el) { el.textContent = l.horarioTexto || ""; });
    var endereco = [l.endereco, l.cidade].filter(Boolean).join(" · ");
    $$("[data-endereco]").forEach(function (el) { el.textContent = endereco; });
    var curto = $("[data-endereco-curto]");
    if (curto) curto.textContent = [l.endereco, (l.cidade || "").split("·")[0].trim()].filter(Boolean).join(" · ");
    var mapa = $("[data-mapa]");
    if (mapa) mapa.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([l.endereco, (l.cidade || "").replace("·", ",")].join(", "));

    var mods = [];
    if (l.entrega) mods.push("Entrega");
    if (l.retirada) mods.push("retirada no local");
    var modTxt = mods.join(" e ");
    modTxt = modTxt.charAt(0).toUpperCase() + modTxt.slice(1);
    $("[data-modalidades]").textContent = modTxt || "Pedidos pelo WhatsApp";

    var wl = linkWhats("Olá, House! Vim pelo site.");
    $$("[data-whats-link]").forEach(function (a) { if (wl) a.href = wl; else a.hidden = true; });
    var wt = $("[data-whats-texto]");
    if (wt) wt.textContent = l.whatsapp ? foneBonito(l.whatsapp) : "A confirmar";

    var user = String(l.instagram || "").replace(/^@/, "");
    $$("[data-instagram]").forEach(function (a) {
      if (!user) { a.hidden = true; return; }
      a.href = "https://www.instagram.com/" + encodeURIComponent(user) + "/";
    });
    $$("[data-instagram-user]").forEach(function (el) { el.textContent = "@" + user; });

    var aviso = $("[data-aviso]");
    aviso.hidden = !l.aviso;
    aviso.textContent = l.aviso || "";
    $("[data-modo-aviso]").hidden = S.modo !== "demo";
  }

  // ------------------------------------------------------------ primeira dobra
  function produtoDestaque() {
    var comPreco = dados.produtos.filter(function (p) { return p.foto && p.preco != null; });
    return comPreco.filter(function (p) { return p.destaque; })[0] || comPreco[0] || null;
  }
  function aplicarHero() {
    var p = produtoDestaque();
    var etiqueta = $("[data-hero-etiqueta]");
    if (!p) { etiqueta.hidden = true; return; }
    var img = $("[data-hero-img]");
    if (img.getAttribute("src") !== p.foto && p.foto.indexOf("piscina-de-cheddar") === -1) {
      img.removeAttribute("srcset");
      img.src = p.foto;
      img.alt = p.nome;
    }
    $("[data-hero-nome]").textContent = p.nome;
    $("[data-hero-preco]").innerHTML = (p.aPartirDe ? "<small>a partir de</small> " : "") + fmt(p.preco);
  }

  // ------------------------------------------------------------ piscinas
  function categoriaPiscina() {
    return dados.categorias.filter(function (c) { return c.id === "piscinas"; })[0]
      || dados.categorias.filter(function (c) { return c.estilo === "destaque"; })[0] || null;
  }
  function aplicarPiscina() {
    var secao = $("[data-piscina-secao]");
    var cat = categoriaPiscina();
    var lista = cat ? dados.produtos.filter(function (p) { return p.categoria === cat.id; }) : [];
    if (!lista.length) { secao.hidden = true; return; }
    secao.hidden = false;
    var principal = lista.filter(function (p) { return p.destaque && p.foto; })[0] || lista[0];
    if (principal.foto && principal.foto.indexOf("piscina-de-cheddar") === -1) {
      $("[data-piscina-img]").src = principal.foto;
      $("[data-piscina-img]").alt = principal.nome;
    }
    if (principal.descricao) $("[data-piscina-desc]").textContent = principal.descricao;
    var preco = $("[data-piscina-preco]");
    preco.innerHTML = principal.preco == null ? "Consulte o valor" : (principal.aPartirDe ? "<small>a partir de</small> " : "") + fmt(principal.preco);
    var btn = $("[data-pedir-piscina]");
    btn.onclick = function () { pedir(principal, btn); };

    var outras = lista.filter(function (p) { return p !== principal; });
    var box = $("[data-piscina-outras]");
    box.hidden = !outras.length;
    box.innerHTML = outras.map(function (p) {
      return '<button type="button" class="outra" data-abrir="' + esc(p.id) + '">' +
        (p.foto ? '<img src="' + esc(p.foto) + '" alt="" loading="lazy">' : '<span class="sem-foto" aria-hidden="true"></span>') +
        "<span><strong>" + esc(p.nome) + "</strong>" + (p.preco == null ? "Consultar valor" : (p.aPartirDe ? "a partir de " : "") + fmt(p.preco)) + "</span>" +
        '<svg aria-hidden="true"><use href="#i-seta"/></svg></button>';
    }).join("");
  }

  // ------------------------------------------------------------ cardápio
  function cardHTML(p, destaque) {
    var acao;
    if (p.preco == null) {
      var wl = linkWhats("Olá, House! Quero saber o valor de: " + p.nome);
      acao = wl ? '<a class="add add--whats" href="' + esc(wl) + '" target="_blank" rel="noopener" aria-label="Consultar valor de ' + esc(p.nome) + ' no WhatsApp">Consultar</a>' : "";
    } else {
      acao = '<button type="button" class="add" data-add="' + esc(p.id) + '" aria-label="Adicionar ' + esc(p.nome) + ' à sacola"><svg aria-hidden="true"><use href="#i-mais"/></svg>' + (destaque ? "Adicionar" : "") + "</button>";
    }
    return '<li class="card revelar' + (destaque ? " card--destaque" : "") + '">' +
      '<div class="card__foto">' + (p.selo ? '<span class="selo">' + esc(p.selo) + "</span>" : "") + fotoHTML(p.foto, p.nome) + "</div>" +
      '<div class="card__corpo">' +
        '<h4 class="card__nome"><button type="button" class="card__abrir" data-abrir="' + esc(p.id) + '">' + esc(p.nome) + "</button></h4>" +
        (p.descricao ? '<p class="card__desc">' + esc(p.descricao) + "</p>" : "") +
        '<div class="card__base">' + precoHTML(p, "card__preco") + acao + "</div>" +
      "</div></li>";
  }

  function renderCardapio() {
    var cats = dados.categorias;
    var chips = $("[data-chips]");
    chips.innerHTML = '<div class="chips__trilho">' + cats.map(function (c) {
      var avatar = c.foto ? '<img src="' + esc(c.foto) + '" alt="" width="32" height="32" loading="lazy">' : '<span class="chip__inicial" aria-hidden="true">' + esc(c.nome.charAt(0)) + "</span>";
      return '<a class="chip" href="#cat-' + esc(c.id) + '" data-chip="' + esc(c.id) + '">' + avatar + esc(c.nome) + "</a>";
    }).join("") + "</div>";

    var html = cats.map(function (c) {
      var itens = dados.produtos.filter(function (p) { return p.categoria === c.id; });
      var corpo;
      if (itens.length) {
        corpo = '<ul class="grade">' + itens.map(function (p) { return cardHTML(p, c.estilo === "destaque"); }).join("") + "</ul>";
      } else {
        var wl = linkWhats("Olá, House! Quero ver as opções de " + c.nome + ".");
        corpo = '<div class="vazio-cat revelar">' + (c.foto ? '<img src="' + esc(c.foto) + '" alt="" loading="lazy">' : "") +
          "<p><strong>" + esc(c.nome) + " ainda não estão no cardápio online.</strong>Peça as opções do dia direto no WhatsApp.</p>" +
          (wl ? '<a class="btn btn--contorno" href="' + esc(wl) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-whats"/></svg>Perguntar</a>' : "") + "</div>";
      }
      return '<section class="categoria" id="cat-' + esc(c.id) + '" aria-labelledby="t-' + esc(c.id) + '" data-categoria="' + esc(c.id) + '">' +
        '<div class="categoria__topo"><h3 class="categoria__nome" id="t-' + esc(c.id) + '">' + esc(c.nome) + "</h3>" +
        (itens.length ? '<span class="categoria__qtd">' + itens.length + (itens.length === 1 ? " item" : " itens") + "</span>" : "") + "</div>" +
        corpo + "</section>";
    }).join("");
    $("[data-cardapio]").innerHTML = html || '<p class="carregando">O cardápio está sendo atualizado. Chame a House no WhatsApp.</p>';
    observarCategorias();
  }

  function renderPromocoes() {
    var lista = dados.promocoes;
    var secao = $("[data-promocoes-secao]");
    secao.hidden = !lista.length;
    $$("[data-link-promocoes]").forEach(function (a) { a.hidden = !lista.length; });
    if (!lista.length) return;
    var unica = lista.length === 1;
    $("[data-promocoes]").innerHTML = lista.map(function (pr) {
      var prod = pr.produtoId && porId[pr.produtoId];
      var botao;
      if (prod && prod.preco != null) botao = '<button type="button" class="btn btn--vermelho btn--grande" data-abrir="' + esc(prod.id) + '">Quero essa <svg aria-hidden="true"><use href="#i-seta"/></svg></button>';
      else {
        var wl = linkWhats("Olá, House! Quero a promoção: " + pr.titulo);
        botao = wl ? '<a class="btn btn--vermelho btn--grande" href="' + esc(wl) + '" target="_blank" rel="noopener">Pedir no WhatsApp</a>' : "";
      }
      return '<article class="promo revelar' + (unica ? " promo--unica" : "") + '">' +
        '<div class="promo__foto">' + (pr.selo ? '<span class="selo">' + esc(pr.selo) + "</span>" : "") + fotoHTML(pr.foto, pr.titulo) + "</div>" +
        '<div class="promo__corpo"><h3 class="promo__titulo">' + esc(pr.titulo) + "</h3>" +
        (pr.texto ? '<p class="promo__texto">' + esc(pr.texto) + "</p>" : "") +
        '<div class="promo__base">' + (pr.preco != null ? '<p class="promo__preco">' + (pr.aPartirDe ? "<small>a partir de</small>" : "") + fmt(pr.preco) + "</p>" : "<span></span>") + botao + "</div></div></article>";
    }).join("");
  }

  function categoriasExtras() {
    return dados.categorias.filter(function (c) {
      return c.id === "bebidas" || c.id === "porcoes" || /bebida|por[cç][aã]o|por[cç][oõ]es|acompanha/i.test(c.nome);
    }).map(function (c) { return c.id; });
  }
  function produtosExtras() {
    var ids = categoriasExtras();
    return dados.produtos.filter(function (p) { return ids.indexOf(p.categoria) > -1 && p.preco != null; });
  }
  function renderExtras() {
    var lista = produtosExtras();
    $("[data-extras-secao]").hidden = !lista.length;
    $("[data-extras]").innerHTML = lista.map(function (p) {
      return '<li class="extra revelar"><div class="extra__foto">' + fotoHTML(p.foto, "") + "</div>" +
        '<div class="extra__info"><strong><button type="button" class="card__abrir" data-abrir="' + esc(p.id) + '">' + esc(p.nome) + "</button></strong>" +
        '<span class="extra__preco">' + (p.aPartirDe ? "a partir de " : "") + fmt(p.preco) + "</span></div>" +
        '<button type="button" class="add" data-add="' + esc(p.id) + '" aria-label="Adicionar ' + esc(p.nome) + ' à sacola"><svg aria-hidden="true"><use href="#i-mais"/></svg></button></li>';
    }).join("");
  }

  // ------------------------------------------------------------ chips acompanham o scroll
  var obsCat;
  function observarCategorias() {
    if (!("IntersectionObserver" in window)) return;
    if (obsCat) obsCat.disconnect();
    obsCat = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcarChip(e.target.getAttribute("data-categoria")); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    $$("[data-categoria]").forEach(function (s) { obsCat.observe(s); });
  }
  function marcarChip(id) {
    $$("[data-chip]").forEach(function (c) {
      var ativo = c.getAttribute("data-chip") === id;
      c.setAttribute("aria-current", ativo ? "true" : "false");
      if (ativo) {
        var trilho = c.parentNode;
        var alvo = c.offsetLeft - (trilho.clientWidth - c.offsetWidth) / 2;
        trilho.scrollTo({ left: Math.max(0, alvo), behavior: reduzido ? "auto" : "smooth" });
      }
    });
  }

  // ------------------------------------------------------------ revelação e efeitos de scroll
  var obsRevelar = "IntersectionObserver" in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.remove("espera"); e.target.classList.add("visto"); obsRevelar.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function revelar() {
    $$(".revelar:not(.visto)").forEach(function (el, i) {
      if (!obsRevelar || reduzido) { el.classList.add("visto"); return; }
      el.style.setProperty("--atraso", (i % 3) * 0.06 + "s");
      if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("espera");
      obsRevelar.observe(el);
    });
  }

  function efeitosScroll() {
    if (reduzido) return;
    var heroImg = $("[data-hero-img]"), heroFoto = $("[data-hero-foto]");
    var pisc = $("[data-revelar-foto]");
    var pedido = false;
    function quadro() {
      pedido = false;
      var vh = window.innerHeight;
      var r = heroFoto.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var prog = Math.min(1, window.scrollY / vh);
        heroImg.style.transform = prog > 0 ? "translateY(" + (prog * 60).toFixed(1) + "px) scale(" + (1 + prog * 0.08).toFixed(3) + ")" : "";
      }
      if (pisc && !pisc.closest("[hidden]")) {
        var rp = pisc.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (vh - rp.top) / (vh * 0.85)));
        pisc.style.setProperty("--recorte", ((1 - p) * 9).toFixed(2) + "%");
        pisc.style.setProperty("--escala", (1.14 - p * 0.14).toFixed(3));
      }
    }
    function pedir() { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } }
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    quadro();
  }

  // menu do topo marca a seção atual
  function navegacao() {
    var links = $$(".menu a");
    if (!("IntersectionObserver" in window)) return;
    var secoes = [[$(".hero"), "inicio"], [$("#cardapio"), "cardapio"], [$("#promocoes"), "promocoes"], [$("#sobre"), "sobre"], [$("#contato"), "contato"]];
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target._secao;
        links.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach(function (s) { if (s[0]) { s[0]._secao = s[1]; obs.observe(s[0]); } });
  }

  function menuMovel() {
    var btn = $("[data-menu-btn]"), menu = $("#menu-movel");
    btn.addEventListener("click", function () {
      var abrir = menu.hidden;
      menu.hidden = !abrir;
      btn.setAttribute("aria-expanded", String(abrir));
      btn.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }); });
  }

  // ------------------------------------------------------------ diálogos
  function abrirDialogo(d) {
    if (d.open) return;
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    document.body.classList.add("travado");
  }
  function fecharDialogo(d) {
    if (!d.open) return;
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  $$("dialog").forEach(function (d) {
    d.addEventListener("close", function () {
      if (!$$("dialog").some(function (x) { return x.open; })) document.body.classList.remove("travado");
      if (d._volta && document.contains(d._volta)) d._volta.focus({ preventScroll: true });
    });
    d.addEventListener("click", function (e) { if (e.target === d) fecharDialogo(d); });
    $$("[data-fechar]", d).forEach(function (b) { b.addEventListener("click", function () { fecharDialogo(d); }); });
  });

  // ------------------------------------------------------------ produto
  var modal = $("[data-modal-produto]");
  var formProduto = $("[data-form-produto]");
  var atual = null, qtd = 1;

  function pedir(produto, origem) {
    if (!produto) { location.hash = "#cardapio"; return; }
    if (produto.preco == null) { var wl = linkWhats("Olá, House! Quero saber o valor de: " + produto.nome); if (wl) window.open(wl, "_blank", "noopener"); return; }
    abrirProduto(produto, origem);
  }

  function abrirProduto(p, origem) {
    atual = p; qtd = 1;
    modal._volta = origem || document.activeElement;
    $("[data-produto-foto]").innerHTML = fotoHTML(p.foto, p.nome, ' loading="eager"');
    $("[data-produto-nome]").textContent = p.nome;
    $("[data-produto-preco]").innerHTML = p.preco == null ? "Consultar valor" : (p.aPartirDe ? "<small>a partir de</small>" : "") + fmt(p.preco);
    var desc = $("[data-produto-desc]");
    desc.textContent = p.descricao || "";
    desc.hidden = !p.descricao;
    $("[data-produto-obs]").value = "";
    $("[data-produto-opcoes]").innerHTML = (p.opcoes || []).map(function (g, gi) {
      var tipo = g.tipo === "uma" ? "radio" : "checkbox";
      var regra = g.obrigatorio ? '<small class="obrig">Obrigatório</small>' : (g.tipo === "uma" ? "<small>Escolha 1</small>" : (g.max ? "<small>Até " + g.max + "</small>" : "<small>Opcional</small>"));
      return '<fieldset class="opcoes" data-grupo="' + gi + '"><legend><span>' + esc(g.nome) + "</span>" + regra + "</legend>" +
        (g.itens || []).map(function (it, ii) {
          return '<label class="opcao"><input type="' + tipo + '" name="g' + gi + '" value="' + ii + '"><span>' + esc(it.nome) + "</span>" +
            (Number(it.preco) ? "<b>+ " + fmt(it.preco) + "</b>" : "") + "</label>";
        }).join("") + '<p class="erro" data-erro-grupo="' + gi + '"></p></fieldset>';
    }).join("");
    atualizarProduto();
    abrirDialogo(modal);
    modal.querySelector(".produto__corpo").scrollTop = 0;
  }

  function escolhas() {
    var lista = [];
    (atual.opcoes || []).forEach(function (g, gi) {
      $$('input[name="g' + gi + '"]:checked', modal).forEach(function (inp) {
        var it = g.itens[Number(inp.value)];
        lista.push({ grupo: g.nome, item: it.nome, preco: U.r2(it.preco) });
      });
    });
    return lista;
  }

  function atualizarProduto() {
    if (!atual) return;
    // limite de escolhas por grupo
    (atual.opcoes || []).forEach(function (g, gi) {
      if (g.tipo === "uma" || !g.max) return;
      var marcados = $$('input[name="g' + gi + '"]:checked', modal).length;
      $$('input[name="g' + gi + '"]', modal).forEach(function (inp) { inp.disabled = !inp.checked && marcados >= g.max; });
    });
    var total = S.precoUnitario(atual, escolhas()) * qtd;
    $("[data-qtd]").textContent = qtd;
    $("[data-qtd-menos]").disabled = qtd <= 1;
    $("[data-produto-adicionar]").textContent = "Adicionar · " + fmt(total);
  }

  modal.addEventListener("change", function (e) {
    if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
      var fs = e.target.closest(".opcoes");
      if (fs) { fs.classList.remove("invalido"); var er = fs.querySelector(".erro"); if (er) er.textContent = ""; }
      atualizarProduto();
    }
  });
  $("[data-qtd-menos]").addEventListener("click", function () { if (qtd > 1) { qtd--; atualizarProduto(); } });
  $("[data-qtd-mais]").addEventListener("click", function () { if (qtd < 50) { qtd++; atualizarProduto(); } });

  formProduto.addEventListener("submit", function (e) {
    e.preventDefault();
    var primeiroErro = null;
    (atual.opcoes || []).forEach(function (g, gi) {
      var n = $$('input[name="g' + gi + '"]:checked', modal).length;
      var fs = modal.querySelector('[data-grupo="' + gi + '"]');
      if (g.obrigatorio && n < 1) {
        fs.classList.add("invalido");
        fs.querySelector(".erro").textContent = "Escolha uma opção de " + g.nome.toLowerCase() + ".";
        primeiroErro = primeiroErro || fs;
      }
    });
    if (primeiroErro) { primeiroErro.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "center" }); return; }
    var origem = modal.querySelector(".produto__foto img");
    var rect = origem ? origem.getBoundingClientRect() : null;
    Sacola.adicionar(atual, escolhas(), qtd, $("[data-produto-obs]").value.trim());
    var nome = atual.nome, foto = atual.foto, q = qtd;
    fecharDialogo(modal);
    voar(foto, rect);
    toast((q > 1 ? q + "x " : "") + nome + " na sacola");
  });

  // ------------------------------------------------------------ voo até a sacola
  function alvoSacola() {
    return $$("[data-abrir-sacola]").filter(function (b) { var r = b.getBoundingClientRect(); return r.width > 0 && b.offsetParent !== null; })[0];
  }
  function voar(foto, rect) {
    var alvo = alvoSacola();
    $$("[data-contador]").forEach(function (c) { c.classList.remove("pulo"); void c.offsetWidth; c.classList.add("pulo"); });
    if (!foto || !rect || !alvo || reduzido || !Element.prototype.animate) return;
    var ra = alvo.getBoundingClientRect();
    var tam = 72;
    var img = document.createElement("img");
    img.className = "voo"; img.src = foto; img.alt = "";
    img.style.width = img.style.height = tam + "px";
    img.style.left = (rect.left + rect.width / 2 - tam / 2) + "px";
    img.style.top = (rect.top + rect.height / 2 - tam / 2) + "px";
    document.body.appendChild(img);
    var dx = ra.left + ra.width / 2 - (rect.left + rect.width / 2);
    var dy = ra.top + ra.height / 2 - (rect.top + rect.height / 2);
    img.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: "translate(" + dx * 0.5 + "px," + (dy * 0.5 - 80) + "px) scale(.75)", opacity: 1, offset: 0.55 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.2)", opacity: 0.2 }
    ], { duration: 720, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = function () { img.remove(); };
  }

  // adicionar direto pelo card
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) {
      var p = porId[add.getAttribute("data-add")];
      if (!p) return;
      if ((p.opcoes || []).length) { abrirProduto(p, add); return; }
      var card = add.closest(".card, .extra, .sugestao");
      var img = card && card.querySelector("img");
      Sacola.adicionar(p, [], 1, "");
      voar(p.foto, img ? img.getBoundingClientRect() : add.getBoundingClientRect());
      toast(p.nome + " na sacola");
      if (add.closest("[data-gaveta]")) renderSacola();
      return;
    }
    var ab = e.target.closest("[data-abrir]");
    if (ab) { var pr = porId[ab.getAttribute("data-abrir")]; if (pr) pedir(pr, ab); return; }
    if (e.target.closest("[data-abrir-sacola]")) { abrirSacola(e.target.closest("[data-abrir-sacola]")); return; }
    if (e.target.closest("[data-pedir-destaque]")) {
      var d = produtoDestaque();
      if (d) pedir(d, e.target.closest("[data-pedir-destaque]"));
      else document.getElementById("cardapio").scrollIntoView({ behavior: reduzido ? "auto" : "smooth" });
    }
  });

  // ------------------------------------------------------------ sacola
  var gaveta = $("[data-gaveta]");
  var passoAtual = 1;
  var pedidoGerado = null;

  function irPasso(n) {
    passoAtual = n;
    $$("[data-passo]", gaveta).forEach(function (s) { s.hidden = Number(s.getAttribute("data-passo")) !== n; });
    $$("[data-passo-ind]", gaveta).forEach(function (li) {
      var i = Number(li.getAttribute("data-passo-ind"));
      li.classList.toggle("feito", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    $("[data-voltar]", gaveta).hidden = n !== 2;
    $("[data-gaveta-titulo]").textContent = n === 1 ? "Sua sacola" : n === 2 ? "Seus dados" : "Enviar pedido";
    var rol = $('[data-passo="' + n + '"] .gaveta__rolagem', gaveta);
    if (rol) rol.scrollTop = 0;
  }

  function abrirSacola(origem) {
    gaveta._volta = origem || document.activeElement;
    if (passoAtual === 3 && !pedidoGerado) irPasso(1);
    if (passoAtual !== 3) irPasso(1);
    renderSacola();
    abrirDialogo(gaveta);
  }
  gaveta.addEventListener("close", function () {
    if (passoAtual === 3 && pedidoGerado && pedidoGerado.enviado) { pedidoGerado = null; irPasso(1); }
  });
  $("[data-voltar]", gaveta).addEventListener("click", function () { irPasso(1); renderSacola(); });
  $("[data-ir-cardapio]", gaveta).addEventListener("click", function () {
    fecharDialogo(gaveta);
    document.getElementById("cardapio").scrollIntoView({ behavior: reduzido ? "auto" : "smooth" });
  });

  function taxaTexto() {
    var t = dados.loja.taxaEntrega;
    return t == null || t === "" ? "a combinar" : (Number(t) ? fmt(t) : "grátis");
  }

  function resumoHTML(botao, comEntrega) {
    var sub = Sacola.subtotal();
    var l = dados.loja;
    var linhas = '<div><dt>Subtotal</dt><dd>' + fmt(sub) + "</dd></div>";
    var total = sub;
    var sufixo = "";
    if (comEntrega) {
      linhas += "<div><dt>Taxa de entrega</dt><dd>" + taxaTexto() + "</dd></div>";
      if (l.taxaEntrega != null && l.taxaEntrega !== "") total = U.r2(sub + Number(l.taxaEntrega));
      else sufixo = " + entrega";
    } else if (comEntrega === false) {
      linhas += "<div><dt>Retirada</dt><dd>sem taxa</dd></div>";
    } else if (l.entrega) {
      linhas += "<div><dt>Taxa de entrega</dt><dd>" + (l.taxaEntrega == null || l.taxaEntrega === "" ? "a combinar" : taxaTexto()) + "</dd></div>";
      if (l.taxaEntrega != null && l.taxaEntrega !== "" && !l.retirada) total = U.r2(sub + Number(l.taxaEntrega));
    }
    linhas += '<div class="total"><dt>Total</dt><dd>' + fmt(total) + sufixo + "</dd></div>";
    var aviso = Sacola.itens().some(function (i) { return i.aPartirDe; })
      ? '<p class="nota" style="margin:0">Itens com valor “a partir de” têm o preço final confirmado pela House no WhatsApp.</p>' : "";
    return aviso + '<dl class="resumo">' + linhas + "</dl>" + botao;
  }

  function detalheItem(i) {
    var partes = (i.opcoes || []).map(function (o) { return o.item + (o.preco ? " (+" + fmt(o.preco) + ")" : ""); });
    if (i.obs) partes.push("Obs.: " + i.obs);
    return partes.join(" · ");
  }

  function renderSacola() {
    var itens = Sacola.itens();
    var vazia = !itens.length;
    $("[data-vazia]", gaveta).hidden = !vazia;
    var sit = S.situacao(dados.loja);
    var avisoF = $("[data-aviso-fechado]", gaveta);
    avisoF.hidden = !sit || sit.aberto || vazia;
    if (sit && !sit.aberto) avisoF.textContent = sit.texto + ". Você pode enviar o pedido agora e a House responde assim que abrir.";
    $("[data-itens]", gaveta).innerHTML = itens.map(function (i) {
      var det = detalheItem(i);
      return '<li class="item" data-key="' + esc(i.key) + '">' +
        '<div class="item__foto">' + fotoHTML(i.foto, "") + "</div>" +
        '<div class="item__info"><p class="item__nome">' + esc(i.nome) + "</p>" +
        (det ? '<p class="item__detalhe">' + esc(det) + "</p>" : "") +
        '<div class="item__base"><div class="qtd qtd--p" role="group" aria-label="Quantidade de ' + esc(i.nome) + '">' +
          '<button type="button" data-item-menos aria-label="Diminuir"' + (i.qtd <= 1 ? " disabled" : "") + '><svg aria-hidden="true"><use href="#i-menos"/></svg></button>' +
          "<output>" + i.qtd + "</output>" +
          '<button type="button" data-item-mais aria-label="Aumentar"><svg aria-hidden="true"><use href="#i-mais"/></svg></button></div>' +
          '<span class="item__preco">' + (i.aPartirDe ? "<small>a partir de </small>" : "") + fmt(i.unitario * i.qtd) + "</span>" +
          '<button type="button" class="item__remover" data-item-remover aria-label="Remover ' + esc(i.nome) + '"><svg aria-hidden="true"><use href="#i-lixo"/></svg></button>' +
        "</div></div></li>";
    }).join("");

    // sugestões de bebidas e acompanhamentos que ainda não estão na sacola
    var naSacola = itens.map(function (i) { return i.produtoId; });
    var sug = produtosExtras().filter(function (p) { return naSacola.indexOf(p.id) === -1 && !(p.opcoes || []).length; }).slice(0, 8);
    $("[data-sugestoes]", gaveta).hidden = vazia || !sug.length;
    $("[data-sugestoes-lista]", gaveta).innerHTML = sug.map(function (p) {
      return '<li><button type="button" class="sugestao" data-add="' + esc(p.id) + '" aria-label="Adicionar ' + esc(p.nome) + '">' +
        '<div class="sugestao__foto">' + fotoHTML(p.foto, "") + "</div><span>" + esc(p.nome) + "</span><b>+ " + fmt(p.preco) + "</b></button></li>";
    }).join("");

    $("[data-resumo-1]", gaveta).hidden = vazia;
    $("[data-resumo-1]", gaveta).innerHTML = vazia ? "" : resumoHTML('<button type="button" class="btn btn--vermelho btn--bloco btn--grande" data-continuar>Continuar <svg aria-hidden="true"><use href="#i-seta"/></svg></button>');
  }

  gaveta.addEventListener("click", function (e) {
    var li = e.target.closest("[data-key]");
    if (li) {
      var key = li.getAttribute("data-key");
      var it = Sacola.itens().filter(function (x) { return x.key === key; })[0];
      if (!it) return;
      if (e.target.closest("[data-item-menos]")) Sacola.quantidade(key, it.qtd - 1);
      else if (e.target.closest("[data-item-mais]")) Sacola.quantidade(key, it.qtd + 1);
      else if (e.target.closest("[data-item-remover]")) { Sacola.remover(key); toast(it.nome + " saiu da sacola"); }
      else return;
      renderSacola();
      return;
    }
    if (e.target.closest("[data-continuar]")) { prepararCheckout(); irPasso(2); }
  });

  function atualizarContadores() {
    var n = Sacola.contagem();
    $$("[data-contador]").forEach(function (c) { c.textContent = n; c.hidden = !n; });
    $$("[data-abrir-sacola]").forEach(function (b) { b.setAttribute("aria-label", n ? "Abrir sacola, " + n + (n === 1 ? " item" : " itens") : "Abrir sacola, vazia"); });
    var bt = $("[data-barra-total]");
    if (bt) bt.textContent = n ? fmt(Sacola.subtotal()) : "Sacola";
  }
  Sacola.ouvir(atualizarContadores);
  window.addEventListener("storage", function (e) { if (e.key === "house_sacola_v1") { atualizarContadores(); if (gaveta.open && passoAtual === 1) renderSacola(); } });

  // ------------------------------------------------------------ checkout
  var form = $("[data-form-checkout]");

  function prepararCheckout() {
    var l = dados.loja;
    var salvo = S.dadosCliente();
    ["nome", "telefone", "rua", "bairro", "referencia"].forEach(function (k) {
      if (salvo[k] && !form.elements[k].value) form.elements[k].value = k === "telefone" ? foneBonito(salvo[k]) : salvo[k];
    });
    $("[data-op-entrega]", form).hidden = !l.entrega;
    $("[data-op-retirada]", form).hidden = !l.retirada;
    $("[data-taxa-rotulo]", form).textContent = l.taxaEntrega == null || l.taxaEntrega === "" ? "Taxa a combinar" : "Taxa " + taxaTexto();
    var radios = $$('input[name="modalidade"]', form).filter(function (r) { return !r.closest("label").hidden; });
    $("[data-grupo-modalidade]", form).hidden = !radios.length;
    if (radios.length === 1) radios[0].checked = true;
    else if (!radios.some(function (r) { return r.checked; }) && salvo.modalidade) {
      radios.forEach(function (r) { r.checked = r.value === salvo.modalidade; });
    }
    var pg = l.pagamentos || [];
    $("[data-grupo-pagamento]", form).hidden = !pg.length;
    var marcado = form.elements.pagamento && form.elements.pagamento.value;
    $("[data-pagamentos]", form).innerHTML = pg.map(function (p, i) {
      return '<label><input type="radio" name="pagamento" value="' + esc(p) + '"' + (p === marcado ? " checked" : "") + ' id="pg-' + i + '"><span>' + esc(p) + "</span></label>";
    }).join("");
    atualizarCheckout();
  }

  function modalidade() { var r = form.querySelector('input[name="modalidade"]:checked'); return r ? r.value : ""; }
  function atualizarCheckout() {
    var m = modalidade();
    $("[data-grupo-endereco]", form).hidden = m !== "entrega";
    var nota = $("[data-retirada-nota]", form);
    nota.hidden = m !== "retirada";
    nota.textContent = "Retirada em " + [dados.loja.endereco, dados.loja.cidade].filter(Boolean).join(" · ") + ". A House avisa no WhatsApp quando estiver pronto.";
    var pg = form.querySelector('input[name="pagamento"]:checked');
    $("[data-campo-troco]", form).hidden = !(pg && /dinheiro/i.test(pg.value));
    var botao = '<button type="submit" class="btn btn--vermelho btn--bloco btn--grande" data-gerar>Revisar e enviar <svg aria-hidden="true"><use href="#i-seta"/></svg></button>';
    $("[data-resumo-2]", form).innerHTML = resumoHTML(botao, m ? m === "entrega" : undefined);
  }
  form.addEventListener("change", function (e) {
    if (e.target.name === "modalidade" || e.target.name === "pagamento") {
      limparErro(e.target.name);
      atualizarCheckout();
    }
  });
  form.elements.telefone.addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    var f = d;
    if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) f = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6);
    e.target.value = f;
  });
  form.addEventListener("input", function (e) { if (e.target.name) limparErro(e.target.name); });

  function erro(campo, msg) {
    var p = form.querySelector('[data-erro="' + campo + '"]');
    if (p) p.textContent = msg;
    var el = form.elements[campo];
    if (el && el.setAttribute) el.setAttribute("aria-invalid", "true");
  }
  function limparErro(campo) {
    var p = form.querySelector('[data-erro="' + campo + '"]');
    if (p) p.textContent = "";
    var el = form.elements[campo];
    if (el && el.removeAttribute) el.removeAttribute("aria-invalid");
  }

  function validar() {
    var v = function (k) { return (form.elements[k] && form.elements[k].value || "").trim(); };
    var d = { nome: v("nome"), telefone: v("telefone").replace(/\D/g, ""), modalidade: modalidade(), rua: v("rua"), bairro: v("bairro"),
      referencia: v("referencia"), observacoes: v("observacoes") };
    var pg = form.querySelector('input[name="pagamento"]:checked');
    d.pagamento = pg ? pg.value : "";
    if (pg && /dinheiro/i.test(pg.value) && v("troco")) d.pagamento += " (troco para R$ " + v("troco").replace(/[^\d,.]/g, "") + ")";
    var erros = [];
    ["nome", "telefone", "modalidade", "rua", "bairro", "pagamento"].forEach(limparErro);
    if (d.nome.length < 2) erros.push(["nome", "Informe seu nome."]);
    if (d.telefone.length < 10 || d.telefone.length > 11) erros.push(["telefone", "Informe o telefone com DDD, ex.: (41) 99999-9999."]);
    if (!d.modalidade) erros.push(["modalidade", "Escolha entrega ou retirada."]);
    if (d.modalidade === "entrega") {
      if (d.rua.length < 5) erros.push(["rua", "Informe a rua e o número."]);
      if (d.bairro.length < 2) erros.push(["bairro", "Informe o bairro."]);
    }
    if ((dados.loja.pagamentos || []).length && !pg) erros.push(["pagamento", "Escolha a forma de pagamento."]);
    erros.forEach(function (e) { erro(e[0], e[1]); });
    if (erros.length) {
      var alvo = form.elements[erros[0][0]];
      var el = alvo && alvo.focus ? alvo : form.querySelector('[data-erro="' + erros[0][0] + '"]');
      if (el && el.focus) el.focus(); else if (el) el.scrollIntoView({ block: "center" });
      if (!(alvo && alvo.focus)) { var p = form.querySelector('[data-erro="' + erros[0][0] + '"]'); if (p) p.scrollIntoView({ block: "center", behavior: reduzido ? "auto" : "smooth" }); }
      return null;
    }
    return d;
  }

  var enviando = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (enviando) return;
    var d = validar();
    if (!d) return;
    var botao = form.querySelector("[data-gerar]");
    enviando = true;
    botao.disabled = true;
    botao.textContent = "Gerando pedido…";
    S.criarPedido(d, dados.produtos, dados.loja).then(function (pedido) {
      if (form.elements.lembrar.checked) S.lembrarCliente(d);
      pedidoGerado = pedido;
      mostrarEnvio(pedido);
    }).catch(function (err) {
      toast(err.message || "Não foi possível gerar o pedido. Tente de novo.");
      botao.disabled = false;
      atualizarCheckout();
    }).then(function () { enviando = false; });
  });

  function mensagem(p) {
    var l = dados.loja;
    var L = [];
    var entrega = p.modalidade === "entrega";
    L.push("*Pedido #" + p.numero + " · " + (l.nome || "House Hamburgueria 66") + "*");
    L.push("");
    p.itens.forEach(function (i) {
      L.push("*" + i.qtd + "x " + i.nome + "* · " + fmt(i.total) + (i.aPartirDe ? " (valor base)" : ""));
      (i.opcoes || []).forEach(function (o) { L.push("   • " + o.grupo + ": " + o.item + (Number(o.preco) ? " (+" + fmt(o.preco) + ")" : "")); });
      if (i.obs) L.push("   Obs.: " + i.obs);
    });
    L.push("");
    L.push("Subtotal: " + fmt(p.subtotal));
    if (entrega) L.push("Entrega: " + (p.taxa == null ? "a combinar" : (Number(p.taxa) ? fmt(p.taxa) : "grátis")));
    L.push("*Total: " + fmt(p.total) + (entrega && p.taxa == null ? " + entrega" : "") + "*");
    L.push("");
    L.push("*Cliente*");
    L.push(p.cliente.nome);
    L.push(foneBonito(p.cliente.telefone));
    L.push("");
    if (entrega) {
      L.push("*Entrega*");
      L.push(p.endereco.rua);
      L.push("Bairro: " + p.endereco.bairro);
      if (p.endereco.referencia) L.push("Referência: " + p.endereco.referencia);
    } else {
      L.push("*Retirada no local*");
    }
    if (p.pagamento) { L.push(""); L.push("Pagamento: " + p.pagamento); }
    if (p.observacoes) { L.push(""); L.push("Observações: " + p.observacoes); }
    return L.join("\n");
  }

  function mostrarEnvio(p) {
    var texto = mensagem(p);
    $("[data-mensagem]", gaveta).textContent = texto;
    $("[data-pedido-numero]", gaveta).textContent = "Pedido #" + p.numero + " pronto, " + primeiroNome(p.cliente.nome) + ".";
    var a = $("[data-enviar-whats]", gaveta);
    var wl = linkWhats(texto);
    a.hidden = !wl;
    a.href = wl || "#";
    a.innerHTML = '<svg aria-hidden="true"><use href="#i-whats"/></svg> Enviar pedido no WhatsApp';
    p.enviado = false;
    irPasso(3);
  }
  $("[data-enviar-whats]", gaveta).addEventListener("click", function () {
    if (!pedidoGerado) return;
    pedidoGerado.enviado = true;
    Sacola.limpar();
    form.elements.observacoes.value = "";
    var a = this;
    setTimeout(function () {
      a.innerHTML = '<svg aria-hidden="true"><use href="#i-whats"/></svg> Abrir o WhatsApp de novo';
      $("[data-pedido-numero]", gaveta).textContent = "Pedido #" + pedidoGerado.numero + " enviado.";
    }, 400);
  });
  $("[data-copiar]", gaveta).addEventListener("click", function () {
    var pre = $("[data-mensagem]", gaveta);
    var texto = pre.textContent;
    function selecionar() {
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      toast("Mensagem selecionada. Copie e cole no WhatsApp.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { toast("Mensagem copiada."); }, selecionar);
    } else selecionar();
  });

  // ------------------------------------------------------------ início
  function renderTudo() {
    porId = {};
    dados.produtos.forEach(function (p) { porId[p.id] = p; });
    Sacola.conciliar(dados.produtos);
    aplicarLoja();
    aplicarHero();
    aplicarPiscina();
    renderCardapio();
    renderPromocoes();
    renderExtras();
    atualizarContadores();
    revelar();
  }

  menuMovel();
  atualizarContadores();
  S.carregar().then(function (d) {
    dados = d;
    renderTudo();
    navegacao();
    if (location.hash && location.hash.length > 1) {
      var alvo = document.getElementById(location.hash.slice(1));
      if (alvo) setTimeout(function () { alvo.scrollIntoView(); }, 50);
    }
  }).catch(function (err) {
    $("[data-cardapio]").innerHTML = '<p class="carregando">Não foi possível carregar o cardápio agora. Atualize a página ou chame a House no WhatsApp.</p>';
    if (window.console) console.warn(err);
  });
  efeitosScroll();
  setInterval(function () { if (dados.loja && dados.loja.horario) aplicarLoja(); }, 60000);
})();
