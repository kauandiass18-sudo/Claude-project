/*
 * FINO SABOR — Churrascaria e Pizzaria
 * Lógica do site: cardápio, pedido pelo WhatsApp e animações.
 * Sem dependências externas.
 */
(function () {
  "use strict";

  var C = window.FINO_SABOR || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------
   * Fotos ilustrativas
   * Troque qualquer valor por um caminho próprio ("assets/img/foto.jpg").
   * Chaves "pizza-*", "doce-*" e "prato-*" são escolhidas automaticamente
   * pelo nome e pelos ingredientes de cada item.
   * ------------------------------------------------------------------ */
  var FOTOS = {
    "hero-pizza":       "1513104890138-7c749659a591",
    "hero-churrasco":   "1558030006-450675393462",
    "painel-pizza":     "1574071318508-1cdbab80d002",
    "painel-churrasco": "1544025162-d76694265947",
    "sobre-a":          "1604382354936-07c5d9983bd3",
    "sobre-b":          "1555939594-58d7cb561ad1",
    "sobre-c":          "1517248135467-4c7edcad34c4",
    "contato":          "1414235077428-338989a2e8c0",

    "pizza-classica":   "1593560708920-61dd98c46a4e",
    "pizza-calabresa":  "1571091718767-18b5b1457add",
    "pizza-pepperoni":  "1513104890138-7c749659a591",
    "pizza-queijos":    "1548369937-47519962c11a",
    "pizza-frango":     "1595854341625-f33ee10dbf94",
    "pizza-bacon":      "1528137871618-79d2761e3fd5",
    "pizza-vegetariana":"1506354666786-959d6d497f1a",
    "pizza-margherita": "1574071318508-1cdbab80d002",
    "pizza-especial":   "1590947132387-155cc02f3212",
    "pizza-carne":      "1552539618-7eec9b4d1796",
    "pizza-camarao":    "1601924582970-9238bcb495d9",
    "pizza-atum":       "1585238342024-78d387f4a707",
    "pizza-salame":     "1588315029754-2dd089d39a1a",
    "pizza-palmito":    "1598023696416-0193a0bcd302",
    "prato-carne":      "1600891964092-4316c288032e",
    "prato-casa":       "1504674900247-0877df9cc836",
    "doce-chocolate":   "1606313564200-e75d5e30476c",
    "doce-morango":     "1587314168485-3236d6710814",
    "doce-banana":      "1563729784474-d77dbb933a9e",
    "doce-branco":      "1551024601-bec78aea704b"
  };
  var FOTO_CATEGORIA = {
    "tradicionais": "pizza-classica", "especiais": "pizza-especial", "outros": "prato-carne",
    "doces": "doce-chocolate", "doces-especiais": "doce-morango"
  };
  var FOTO_RESERVA = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F3EEE3"/>' +
    '<circle cx="200" cy="150" r="54" fill="#4B090B"/><text x="200" y="163" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="#FAF9F6">FS</text></svg>');

  function urlFoto(chave, largura) {
    var v = FOTOS[chave];
    if (!v) return null;
    if (/[\/.]/.test(v)) return v; // caminho próprio
    return "https://images.unsplash.com/photo-" + v + "?auto=format&fit=crop&w=" + largura + "&q=72";
  }
  function aplicarFoto(img, chave, largura, reservaChave) {
    var src = urlFoto(chave, largura);
    if (!src) { img.src = FOTO_RESERVA; return; }
    var tentativas = [src];
    if (reservaChave && reservaChave !== chave) tentativas.push(urlFoto(reservaChave, largura));
    tentativas.push(FOTO_RESERVA);
    var i = 0;
    img.onerror = function () { i++; if (i < tentativas.length) img.src = tentativas[i]; else img.onerror = null; };
    img.src = tentativas[0];
  }
  function temaDoItem(item, catId) {
    if (item.foto) return item.foto;
    var t = ((item.nome || "") + " " + (item.desc || "")).toLowerCase();
    var tem = function (re) { return re.test(t); };
    if (catId === "doces" || catId === "doces-especiais") {
      if (tem(/morango|sensa|dois amores/)) return "doce-morango";
      if (tem(/banana/)) return "doce-banana";
      if (tem(/branc|pi[nñ]a|ouro branco|bis branco/)) return "doce-branco";
      return "doce-chocolate";
    }
    if (catId === "outros") {
      if (tem(/yakissoba|mexicana/)) return "prato-casa";
      return "prato-carne";
    }
    if (tem(/pepperoni/)) return "pizza-pepperoni";
    if (tem(/camar/)) return "pizza-camarao";
    if (tem(/atum/)) return "pizza-atum";
    if (tem(/salame|italiana|sofia/)) return "pizza-salame";
    if (tem(/fil[eé]|lombo|bolonhesa|barbecue|ga[uú]cha|catarina|tropical/)) return "pizza-carne";
    if (tem(/calabresa|baiana|curitibana|moda da casa|mista\b|super mexicana/)) return "pizza-calabresa";
    if (tem(/marguerita|tomate seco|sublime/)) return "pizza-margherita";
    if (tem(/queijo|mussarela|mu[cç]arela|parmegiana|catu|chester|requeij/)) return "pizza-queijos";
    if (tem(/frango|galeta|peru|cora[cç][aã]o|xirivelha|francesa|firense|estrogonofe/)) return "pizza-frango";
    if (tem(/bacon|crocante|americana|grega|portuguesa|romanesca/)) return "pizza-bacon";
    if (tem(/palmito|paulista|mistura/)) return "pizza-palmito";
    if (tem(/br[oó]colis|vegetariana|abobrinha|primavera|light|r[uú]cula|milho|alho|caipira/)) return "pizza-vegetariana";
    return FOTO_CATEGORIA[catId] || "pizza-classica";
  }

  /* ------------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------------ */
  function moeda(v) { return "R$ " + Number(v).toFixed(2).replace(".", ","); }
  function escapar(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function normalizar(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function slug(s) { return normalizar(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function linkWa(msg) {
    var n = (C.whatsapp || "").replace(/\D/g, "");
    var base = n ? "https://wa.me/" + n : "https://wa.me/";
    return msg ? base + "?text=" + encodeURIComponent(msg) : base;
  }
  function telefoneBonito(n) {
    n = (n || "").replace(/\D/g, "");
    var m = n.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? "(" + m[1] + ") " + m[2] + "-" + m[3] : n;
  }

  /* ------------------------------------------------------------------
   * Dados do cardápio (com ids)
   * ------------------------------------------------------------------ */
  var CATEGORIAS = (C.cardapio || []).map(function (cat) {
    cat.itens.forEach(function (it) { it.id = cat.id + "--" + slug(it.nome); it.catId = cat.id; it.catNome = cat.categoria; });
    return cat;
  });
  var ITENS = {};
  CATEGORIAS.forEach(function (cat) { cat.itens.forEach(function (it) { ITENS[it.id] = it; }); });

  /* ------------------------------------------------------------------
   * Textos e links configuráveis
   * ------------------------------------------------------------------ */
  function preencherTextos() {
    $$("[data-txt-endereco]").forEach(function (e) { e.textContent = C.endereco || ""; });
    $$("[data-txt-cidade]").forEach(function (e) { e.textContent = C.enderecoCidade || ""; });
    $$("[data-txt-telefone]").forEach(function (e) { e.textContent = telefoneBonito(C.whatsapp) || "WhatsApp"; });
    $$("[data-txt-instagram]").forEach(function (e) { e.textContent = C.instagramUsuario || "Instagram"; });
    $$("[data-link-wa]").forEach(function (e) { e.href = linkWa("Olá! Vim pelo site da Fino Sabor."); });
    $$("[data-link-instagram]").forEach(function (e) { e.href = C.instagram || "#"; });
    $$("[data-link-mapa]").forEach(function (e) { e.href = C.mapaUrl || "#"; });
    $$("[data-ano]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
    $$("[data-wa-msg]").forEach(function (b) { b.addEventListener("click", function () { window.open(linkWa(b.getAttribute("data-wa-msg")), "_blank", "noopener"); }); });

    // Fotos fixas
    $$("img[data-foto]").forEach(function (img) { aplicarFoto(img, img.getAttribute("data-foto"), 1400); });

    // Rodízio
    var r = C.rodizio || {};
    var cardR = $("[data-rodizio]");
    if (cardR) {
      if (r.ativo === false) { cardR.hidden = true; }
      else {
        $("[data-rodizio-dias]").textContent = r.dias || "";
        $("[data-rodizio-obs]").textContent = r.observacao || "";
        $("[data-rodizio-precos]").innerHTML = (r.precos || []).map(function (p) {
          return '<div class="preco-pill"><small>' + escapar(p.dias) + '</small><strong><sup>R$</sup>' + Number(p.valor).toFixed(0) + '</strong></div>';
        }).join("");
      }
    }

    // Horários
    var icones = {
      almoco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      jantar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    };
    var hs = $("[data-horarios]");
    if (hs) hs.innerHTML = (C.horarios || []).map(function (h, i) {
      return '<article class="horario reveal" style="--d:' + (i * .1 + .1) + 's"><div class="horario__icone">' + (i === 0 ? icones.almoco : icones.jantar) + '</div><div>' +
        (h.nota ? '<small>' + escapar(h.nota) + '</small>' : '') + '<h4>' + escapar(h.titulo) + '</h4><p><strong>' + escapar(h.dias) + '</strong> · ' + escapar(h.horas) + '</p></div></article>';
    }).join("");
    var rh = $("[data-rodape-horarios]");
    if (rh) rh.innerHTML = (C.horarios || []).map(function (h) { return '<li><strong>' + escapar(h.titulo) + '</strong>' + escapar(h.dias) + ', ' + escapar(h.horas) + '</li>'; }).join("");
    var rc = $("[data-rodape-cardapio]");
    if (rc) rc.innerHTML = CATEGORIAS.map(function (c) { return '<li><a href="#cat-' + c.id + '" data-ir-categoria="' + c.id + '">' + escapar(c.categoria) + '</a></li>'; }).join("");

    // Contato
    var lista = $("[data-contato-lista]");
    if (lista) {
      var ic = {
        pino: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
        zap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1.1.2-1.2l-.5-.3Z"/></svg>',
        insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>'
      };
      var horasTxt = (C.horarios || []).map(function (h) { return escapar(h.titulo) + ": " + escapar(h.dias) + ", " + escapar(h.horas); }).join("<br>");
      lista.innerHTML =
        '<li class="contato__item reveal"><i>' + ic.pino + '</i><div><small>Endereço</small><strong>' + escapar(C.endereco) + '</strong><p>' + escapar(C.enderecoCidade) + '</p></div><a class="link" href="' + escapar(C.mapaUrl || "#") + '" target="_blank" rel="noopener">Como chegar</a></li>' +
        '<li class="contato__item reveal" style="--d:.08s"><i>' + ic.relogio + '</i><div><small>Horários</small><strong>Almoço e jantar</strong><p>' + horasTxt + '</p></div></li>' +
        '<li class="contato__item reveal" style="--d:.16s"><i>' + ic.zap + '</i><div><small>WhatsApp</small><strong>' + escapar(telefoneBonito(C.whatsapp) || "Fale conosco") + '</strong><p>Pedidos, reservas e dúvidas</p></div><a class="link" href="' + linkWa("Olá! Vim pelo site da Fino Sabor.") + '" target="_blank" rel="noopener">Chamar</a></li>' +
        '<li class="contato__item reveal" style="--d:.24s"><i>' + ic.insta + '</i><div><small>Instagram</small><strong>' + escapar(C.instagramUsuario || "Instagram") + '</strong><p>Novidades, promoções e bastidores</p></div><a class="link" href="' + escapar(C.instagram || "#") + '" target="_blank" rel="noopener">Seguir</a></li>';
    }
  }

  /* ------------------------------------------------------------------
   * Cardápio
   * ------------------------------------------------------------------ */
  var estado = { categoria: "todos", busca: "", expandidas: {} };
  var LIMITE_INICIAL = 12;

  function cardHTML(it, i, tag) {
    var tema = temaDoItem(it, it.catId);
    var reserva = FOTO_CATEGORIA[it.catId];
    var src = urlFoto(tema, 640) || FOTO_RESERVA;
    var temPreco = typeof it.preco === "number";
    return '<article class="card entra" style="--i:' + i + '" data-card="' + it.id + '">' +
      '<div class="card__foto">' + (tag ? '<span class="card__tag card__tag--ouro">' + tag + '</span>' : '') +
      '<img src="' + escapar(src) + '" data-reserva="' + escapar(urlFoto(reserva, 640) || "") + '" alt="' + escapar(it.nome) + '" loading="lazy" width="640" height="480"></div>' +
      '<div class="card__corpo"><h4 class="card__nome">' + escapar(it.nome) + '</h4>' +
      (it.desc ? '<p class="card__desc">' + escapar(it.desc) + '</p>' : '<p class="card__desc card__desc--vazia">' + escapar(it.catNome) + '</p>') +
      '<div class="card__rodape">' +
      (temPreco ? '<span class="card__preco"><sup>R$</sup>' + Number(it.preco).toFixed(2).replace(".", ",") + '</span>' : '<span class="card__preco card__preco--consultar">Consultar</span>') +
      '<button class="card__add" type="button" data-add="' + it.id + '" aria-label="Adicionar ' + escapar(it.nome) + ' ao pedido"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Adicionar</button>' +
      '</div></div></article>';
  }
  function ligarReservaFotos(raiz) {
    $$(".card__foto img", raiz).forEach(function (img) {
      var passo = 0;
      img.onerror = function () {
        passo++;
        var r = img.getAttribute("data-reserva");
        if (passo === 1 && r && r !== img.getAttribute("src")) img.src = r;
        else { img.onerror = null; img.src = FOTO_RESERVA; }
      };
    });
  }
  function filtrarItens(cat) {
    var q = normalizar(estado.busca).trim();
    return cat.itens.filter(function (it) {
      if (!q) return true;
      return normalizar(it.nome + " " + (it.desc || "")).indexOf(q) !== -1;
    });
  }
  function renderChips() {
    var chips = $("[data-chips]");
    if (!chips) return;
    var total = CATEGORIAS.reduce(function (n, c) { return n + c.itens.length; }, 0);
    chips.innerHTML = '<button class="chip' + (estado.categoria === "todos" ? " ativo" : "") + '" type="button" data-chip="todos">Todos <span>' + total + '</span></button>' +
      CATEGORIAS.map(function (c) { return '<button class="chip' + (estado.categoria === c.id ? " ativo" : "") + '" type="button" data-chip="' + c.id + '">' + escapar(c.curto || c.categoria) + ' <span>' + c.itens.length + '</span></button>'; }).join("");
    var ativo = $(".chip.ativo", chips);
    if (ativo) { // centraliza o chip ativo só na horizontal, sem rolar a página
      var alvo = ativo.offsetLeft - (chips.clientWidth - ativo.offsetWidth) / 2;
      try { chips.scrollTo({ left: Math.max(0, alvo), behavior: reduzMovimento ? "auto" : "smooth" }); } catch (e) { chips.scrollLeft = Math.max(0, alvo); }
    }
  }
  function renderDestaques() {
    var sec = $("[data-destaques-secao]"), trilho = $("[data-destaques]");
    if (!sec || !trilho) return;
    var mostrar = estado.categoria === "todos" && !estado.busca.trim();
    sec.hidden = !mostrar;
    if (!mostrar || trilho.childElementCount) return;
    var i = 0, html = "";
    CATEGORIAS.forEach(function (c) { c.itens.forEach(function (it) { if (it.destaque) html += cardHTML(it, i++, "Mais pedida"); }); });
    if (!html) { sec.hidden = true; return; }
    trilho.innerHTML = html; ligarReservaFotos(trilho);
  }
  function renderCategorias() {
    var raiz = $("[data-categorias]"), vazio = $("[data-vazio]");
    if (!raiz) return;
    var buscando = !!estado.busca.trim();
    var html = "", total = 0;
    CATEGORIAS.forEach(function (cat) {
      if (estado.categoria !== "todos" && estado.categoria !== cat.id) return;
      var itens = filtrarItens(cat);
      if (!itens.length) return;
      total += itens.length;
      var colapsar = !buscando && estado.categoria === "todos" && !estado.expandidas[cat.id] && itens.length > LIMITE_INICIAL;
      var visiveis = colapsar ? itens.slice(0, LIMITE_INICIAL) : itens;
      html += '<section class="categoria" id="cat-' + cat.id + '" aria-labelledby="cat-t-' + cat.id + '">' +
        '<div class="categoria__cab"><div><h3 id="cat-t-' + cat.id + '">' + escapar(cat.categoria) + '</h3>' + (cat.descricao ? '<p>' + escapar(cat.descricao) + '</p>' : '') + '</div><span>' + itens.length + (itens.length === 1 ? ' sabor' : ' sabores') + '</span></div>' +
        '<div class="grade">' + visiveis.map(function (it, i) { return cardHTML(it, Math.min(i, 11)); }).join("") + '</div>' +
        (colapsar ? '<div class="categoria__mais"><button class="btn btn--contorno" type="button" data-expandir="' + cat.id + '">Ver todos os ' + itens.length + ' sabores</button></div>' : '') +
        '</section>';
    });
    raiz.innerHTML = html;
    ligarReservaFotos(raiz);
    if (vazio) vazio.hidden = total > 0;
  }
  function renderCardapio() { renderChips(); renderDestaques(); renderCategorias(); }

  function ligarCardapio() {
    var busca = $("[data-busca]"), limpar = $("[data-busca-limpar]");
    var timer;
    if (busca) {
      busca.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          estado.busca = busca.value;
          if (limpar) limpar.hidden = !busca.value;
          renderDestaques(); renderCategorias();
        }, 120);
      });
    }
    if (limpar) limpar.addEventListener("click", function () { busca.value = ""; estado.busca = ""; limpar.hidden = true; renderDestaques(); renderCategorias(); busca.focus(); });

    document.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-chip]");
      if (chip) {
        estado.categoria = chip.getAttribute("data-chip");
        renderCardapio();
        var alvo = $("[data-destaques-secao]").hidden ? $("[data-categorias]") : $("[data-destaques-secao]");
        rolarPara(alvo, 150);
        return;
      }
      var exp = e.target.closest("[data-expandir]");
      if (exp) { estado.expandidas[exp.getAttribute("data-expandir")] = true; renderCategorias(); return; }
      var ir = e.target.closest("[data-ir-categoria]");
      if (ir) {
        e.preventDefault();
        estado.categoria = ir.getAttribute("data-ir-categoria");
        if (busca) { busca.value = ""; estado.busca = ""; if (limpar) limpar.hidden = true; }
        renderCardapio();
        fecharMenuMobile();
        rolarPara($("#cardapio"), 0);
        return;
      }
      var add = e.target.closest("[data-add]");
      if (add) { adicionar(add.getAttribute("data-add")); add.classList.add("feito"); setTimeout(function () { add.classList.remove("feito"); }, 900); }
    });
  }
  function rolarPara(el, extra) {
    if (!el) return;
    var topo = el.getBoundingClientRect().top + window.pageYOffset - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76) - (extra || 0) + 6;
    window.scrollTo({ top: Math.max(0, topo), behavior: reduzMovimento ? "auto" : "smooth" });
  }

  /* ------------------------------------------------------------------
   * Pedido (carrinho)
   * ------------------------------------------------------------------ */
  var CHAVE = "finosabor-pedido-v1";
  var pedido = { itens: [], cliente: {} };
  try { var salvo = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (salvo && salvo.itens) pedido = salvo; } catch (e) {}
  pedido.itens = pedido.itens.filter(function (p) { return ITENS[p.id]; });

  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch (e) {} }
  function quantidadeTotal() { return pedido.itens.reduce(function (n, p) { return n + p.qtd; }, 0); }
  function adicionar(id) {
    var it = ITENS[id]; if (!it) return;
    var ex = pedido.itens.filter(function (p) { return p.id === id; })[0];
    if (ex) ex.qtd += 1; else pedido.itens.push({ id: id, qtd: 1, obs: "" });
    salvar(); renderPedido(); toast(it.nome + " adicionado ao pedido");
    $$("[data-contador]").forEach(function (c) { c.classList.remove("pulsa"); void c.offsetWidth; c.classList.add("pulsa"); });
  }
  function alterarQtd(id, delta) {
    var p = pedido.itens.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    p.qtd += delta;
    if (p.qtd <= 0) pedido.itens = pedido.itens.filter(function (x) { return x.id !== id; });
    salvar(); renderPedido();
  }
  function totalPedido() {
    var total = 0, completo = true;
    pedido.itens.forEach(function (p) { var it = ITENS[p.id]; if (typeof it.preco === "number") total += it.preco * p.qtd; else completo = false; });
    return { valor: total, completo: completo };
  }
  function renderPedido() {
    var n = quantidadeTotal();
    $$("[data-contador]").forEach(function (c) { c.textContent = n; });
    var vazio = $("[data-pedido-vazio]"), lista = $("[data-pedido-itens]"), form = $("[data-form]"), pe = $("[data-pedido-pe]");
    var tem = pedido.itens.length > 0;
    vazio.hidden = tem; form.hidden = !tem; pe.hidden = !tem;
    lista.innerHTML = pedido.itens.map(function (p) {
      var it = ITENS[p.id];
      var temPreco = typeof it.preco === "number";
      return '<div class="item" data-item="' + p.id + '"><div class="item__topo"><div><div class="item__nome">' + escapar(it.nome) + '</div><div class="item__cat">' + escapar(it.catNome) + '</div></div>' +
        '<div class="item__preco' + (temPreco ? '' : ' consultar') + '">' + (temPreco ? moeda(it.preco * p.qtd) : 'a consultar') + '</div></div>' +
        '<div class="item__base"><div class="qtd"><button type="button" data-menos="' + p.id + '" aria-label="Diminuir">−</button><span>' + p.qtd + '</span><button type="button" data-mais="' + p.id + '" aria-label="Aumentar">+</button></div>' +
        '<button class="item__remover" type="button" data-remover="' + p.id + '">Remover</button></div>' +
        '<input class="item__obs" type="text" data-obs="' + p.id + '" value="' + escapar(p.obs) + '" placeholder="Observação (ex.: sem cebola, borda...)" maxlength="140"></div>';
    }).join("");
    var t = totalPedido(), tot = $("[data-total]");
    if (t.completo && pedido.itens.length) { tot.textContent = moeda(t.valor); tot.classList.remove("confirmar"); }
    else if (t.valor > 0) { tot.textContent = moeda(t.valor) + " + itens a consultar"; tot.classList.add("confirmar"); }
    else { tot.textContent = "A confirmar pelo WhatsApp"; tot.classList.add("confirmar"); }
  }
  function montarFormulario() {
    var op = $("[data-opcoes-atendimento]");
    var lista = C.atendimento && C.atendimento.length ? C.atendimento : ["Retirada", "Entrega"];
    op.innerHTML = lista.map(function (a, i) {
      return '<label><input type="radio" name="atendimento" value="' + escapar(a) + '"' + (i === 0 ? ' checked' : '') + '><span>' + escapar(a) + '</span></label>';
    }).join("");
    var sel = $("[data-select-pagamento]");
    sel.innerHTML = '<option value="">Escolher depois</option>' + (C.pagamentos || []).map(function (p) { return '<option>' + escapar(p) + '</option>'; }).join("");
    var form = $("[data-form]");
    if (pedido.cliente.nome) form.nome.value = pedido.cliente.nome;
    if (pedido.cliente.endereco) form.endereco.value = pedido.cliente.endereco;
    function camposCondicionais() {
      var v = normalizar(form.atendimento.value);
      $("[data-campo-endereco]").hidden = v.indexOf("entrega") === -1;
      $("[data-campo-pessoas]").hidden = v.indexOf("reserva") === -1 && v.indexOf("mesa") === -1;
    }
    form.addEventListener("change", camposCondicionais);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    camposCondicionais();
  }
  function abrirPedido() {
    $("[data-pedido]").classList.add("aberto"); $("[data-pedido]").setAttribute("aria-hidden", "false");
    $("[data-escurecer]").classList.add("aberto"); document.body.classList.add("sem-scroll");
    fecharMenuMobile();
  }
  function fecharPedido() {
    $("[data-pedido]").classList.remove("aberto"); $("[data-pedido]").setAttribute("aria-hidden", "true");
    $("[data-escurecer]").classList.remove("aberto"); document.body.classList.remove("sem-scroll");
  }
  function mensagemPedido(form) {
    var L = [];
    L.push("*Pedido · Fino Sabor*");
    L.push("");
    L.push("👤 *Nome:* " + form.nome.value.trim());
    L.push("🛎 *Atendimento:* " + form.atendimento.value);
    if (!$("[data-campo-endereco]").hidden && form.endereco.value.trim()) L.push("📍 *Endereço:* " + form.endereco.value.trim());
    if (!$("[data-campo-pessoas]").hidden && form.pessoas.value) L.push("🪑 *Pessoas:* " + form.pessoas.value);
    if (form.pagamento.value) L.push("💳 *Pagamento:* " + form.pagamento.value);
    L.push("");
    L.push("*Itens*");
    pedido.itens.forEach(function (p) {
      var it = ITENS[p.id];
      var preco = typeof it.preco === "number" ? " — " + moeda(it.preco * p.qtd) : "";
      L.push("• " + p.qtd + "x " + it.nome + " _(" + it.catNome + ")_" + preco);
      if (p.obs && p.obs.trim()) L.push("   ↳ Obs: " + p.obs.trim());
    });
    L.push("");
    var t = totalPedido();
    if (t.completo) L.push("💰 *Total:* " + moeda(t.valor));
    else if (t.valor > 0) L.push("💰 *Total parcial:* " + moeda(t.valor) + " (itens sem preço a confirmar)");
    else L.push("💰 *Total:* a confirmar");
    if (form.obs.value.trim()) { L.push(""); L.push("📝 *Observações:* " + form.obs.value.trim()); }
    L.push("");
    L.push("_Pedido montado pelo site._");
    return L.join("\n");
  }
  function ligarPedido() {
    montarFormulario();
    $$("[data-abrir-pedido]").forEach(function (b) { b.addEventListener("click", abrirPedido); });
    $("[data-fechar-pedido]").addEventListener("click", fecharPedido);
    $("[data-escurecer]").addEventListener("click", fecharPedido);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { fecharPedido(); fecharMenuMobile(); } });
    var lista = $("[data-pedido-itens]");
    lista.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-mais")) alterarQtd(b.getAttribute("data-mais"), 1);
      else if (b.hasAttribute("data-menos")) alterarQtd(b.getAttribute("data-menos"), -1);
      else if (b.hasAttribute("data-remover")) { pedido.itens = pedido.itens.filter(function (x) { return x.id !== b.getAttribute("data-remover"); }); salvar(); renderPedido(); }
    });
    lista.addEventListener("input", function (e) {
      var i = e.target.closest("[data-obs]"); if (!i) return;
      var p = pedido.itens.filter(function (x) { return x.id === i.getAttribute("data-obs"); })[0];
      if (p) { p.obs = i.value; salvar(); }
    });
    var form = $("[data-form]");
    form.addEventListener("input", function () { pedido.cliente = { nome: form.nome.value, endereco: form.endereco.value }; salvar(); });
    $("[data-enviar]").addEventListener("click", function () {
      if (!pedido.itens.length) return;
      if (!form.nome.value.trim()) { form.nome.classList.add("erro"); form.nome.focus(); toast("Informe seu nome para enviar o pedido", true); return; }
      form.nome.classList.remove("erro");
      if (!$("[data-campo-endereco]").hidden && !form.endereco.value.trim()) { form.endereco.classList.add("erro"); form.endereco.focus(); toast("Informe o endereço de entrega", true); return; }
      form.endereco.classList.remove("erro");
      window.open(linkWa(mensagemPedido(form)), "_blank", "noopener");
    });
    renderPedido();
  }

  var toastTimer;
  function toast(txt, semBotao) {
    var t = $("[data-toast]"); if (!t) return;
    $("[data-toast-texto]", t).textContent = txt;
    $("button", t).hidden = !!semBotao;
    t.classList.add("mostra"); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("mostra"); }, 2600);
  }

  /* ------------------------------------------------------------------
   * Navegação
   * ------------------------------------------------------------------ */
  function fecharMenuMobile() {
    var m = $("[data-menu-mobile]"), h = $("[data-hamb]");
    if (!m || !m.classList.contains("aberto")) return;
    m.classList.remove("aberto"); m.setAttribute("aria-hidden", "true");
    h.classList.remove("aberto"); h.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-aberto");
    if (!$("[data-pedido]").classList.contains("aberto")) document.body.classList.remove("sem-scroll");
  }
  function ligarNav() {
    var nav = $("[data-nav]"), h = $("[data-hamb]"), m = $("[data-menu-mobile]");
    var ultimo = window.pageYOffset;
    function aoRolar() {
      var y = window.pageYOffset;
      nav.classList.toggle("solida", y > 30);
      if (y > 320 && y > ultimo + 6 && !m.classList.contains("aberto")) nav.classList.add("oculta");
      else if (y < ultimo - 6 || y < 320) nav.classList.remove("oculta");
      ultimo = y;
    }
    window.addEventListener("scroll", aoRolar, { passive: true }); aoRolar();
    h.addEventListener("click", function () {
      var aberto = !m.classList.contains("aberto");
      m.classList.toggle("aberto", aberto); m.setAttribute("aria-hidden", String(!aberto));
      h.classList.toggle("aberto", aberto); h.setAttribute("aria-expanded", String(aberto));
      document.body.classList.toggle("sem-scroll", aberto);
      document.body.classList.toggle("menu-aberto", aberto);
    });
    $$("a", m).forEach(function (a) { a.addEventListener("click", fecharMenuMobile); });

    // link ativo
    var links = $$("[data-links] a");
    var secoes = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    if ("IntersectionObserver" in window && secoes.length) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("ativo", a.getAttribute("href") === "#" + en.target.id); });
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      secoes.forEach(function (s) { obs.observe(s); });
    }
  }

  /* ------------------------------------------------------------------
   * Animações
   * ------------------------------------------------------------------ */
  function dividirTitulo() {
    var h = $("[data-split]"); if (!h) return;
    var i = 0;
    function processar(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (parte) {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "palavra";
            var s = document.createElement("span"); s.textContent = parte; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          no.replaceChild(frag, c);
        } else if (c.nodeType === 1) processar(c);
      });
    }
    processar(h);
  }
  function ligarReveal() {
    var els = $$(".reveal, .reveal-grupo");
    if (!("IntersectionObserver" in window) || reduzMovimento) { els.forEach(function (e) { e.classList.add("visivel"); }); return; }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visivel"); obs.unobserve(en.target); } });
    }, { threshold: .08, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { obs.observe(e); });
    // elementos criados depois (horários, contato)
    new MutationObserver(function () { $$(".reveal:not(.visivel), .reveal-grupo:not(.visivel)").forEach(function (e) { obs.observe(e); }); }).observe(document.body, { childList: true, subtree: true });
  }
  function ligarParallax() {
    var els = $$("[data-parallax]"); if (!els.length || reduzMovimento) return;
    var ticking = false;
    function atualizar() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5
        var f = parseFloat(el.getAttribute("data-parallax")) || 10;
        el.style.transform = "scale(1.12) translateY(" + (p * f).toFixed(2) + "%)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(atualizar); ticking = true; } }, { passive: true });
    atualizar();
  }
  function ligarTilt() {
    var area = $("[data-tilt]"); if (!area || !ponteiroFino || reduzMovimento) return;
    var camadas = $$("[data-tilt-camada]", area);
    var alvoX = 0, alvoY = 0, x = 0, y = 0, rodando = false;
    function loop() {
      x += (alvoX - x) * .08; y += (alvoY - y) * .08;
      camadas.forEach(function (c) { var f = parseFloat(c.getAttribute("data-tilt-camada")); c.style.transform = "translate(" + (x * f).toFixed(2) + "px, " + (y * f).toFixed(2) + "px)"; });
      if (Math.abs(alvoX - x) > .001 || Math.abs(alvoY - y) > .001) requestAnimationFrame(loop); else rodando = false;
    }
    function mover(e) {
      var r = area.getBoundingClientRect();
      alvoX = (e.clientX - r.left) / r.width - .5; alvoY = (e.clientY - r.top) / r.height - .5;
      if (!rodando) { rodando = true; requestAnimationFrame(loop); }
    }
    area.addEventListener("mousemove", mover);
    area.addEventListener("mouseleave", function () { alvoX = 0; alvoY = 0; if (!rodando) { rodando = true; requestAnimationFrame(loop); } });
  }
  function ligarParticulas() {
    var cv = $("[data-particulas]"); if (!cv || reduzMovimento) return;
    var ctx = cv.getContext("2d"), pts = [], w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function tamanho() {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((w * h) / 26000);
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, v: Math.random() * .25 + .08, a: Math.random() * Math.PI * 2, o: Math.random() * .5 + .2 });
    }
    var visivel = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; }).observe(cv);
    function quadro() {
      if (visivel) {
        ctx.clearRect(0, 0, w, h);
        pts.forEach(function (p) {
          p.y -= p.v; p.a += .01; p.x += Math.sin(p.a) * .2;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(197,164,67," + (p.o * (0.6 + 0.4 * Math.sin(p.a * 3))).toFixed(3) + ")"; ctx.fill();
        });
      }
      requestAnimationFrame(quadro);
    }
    tamanho(); window.addEventListener("resize", tamanho); quadro();
  }
  function ligarFaixa() {
    var f = $("[data-faixa]"); if (!f) return;
    f.innerHTML = f.innerHTML + f.innerHTML;
  }

  /* ------------------------------------------------------------------
   * Início
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    dividirTitulo();
    preencherTextos();
    renderCardapio();
    ligarCardapio();
    ligarPedido();
    ligarNav();
    ligarReveal();
    ligarParallax();
    ligarTilt();
    ligarParticulas();
    ligarFaixa();
  });
})();
