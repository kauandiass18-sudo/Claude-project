/*
 * X do Neves — monta a página a partir de config.js, controla o pedido
 * e envia tudo formatado para o WhatsApp.
 */
(function () {
  "use strict";

  var C = window.XN_CONFIG;
  var A = window.XN_ARTE;
  var loja = C.loja;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  var porId = {};
  C.cardapio.forEach(function (p) { porId[p.id] = p; });
  var catPorId = {};
  C.categorias.forEach(function (c) { catPorId[c.id] = c; });

  function real(v) { return "R$ " + v.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function imagem(p) {
    if (p.foto) return '<img src="' + esc(p.foto) + '" alt="" loading="lazy">';
    return A.desenho(catPorId[p.cat].desenho);
  }
  function normal(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  var guardar = {
    ler: function (k, padrao) { try { var v = localStorage.getItem("xn-" + k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar: function (k, v) { try { localStorage.setItem("xn-" + k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
  };

  var icoMais = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var icoCoracao = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-8.8-8.6C1.8 8 4 4.8 7.2 4.8c1.9 0 3.3 1 4.8 2.8 1.5-1.8 2.9-2.8 4.8-2.8 3.2 0 5.4 3.2 4 6.6C19 15.6 12 20 12 20z"/></svg>';

  /* ---------------- Favoritos ---------------- */
  var favs = guardar.ler("favs", []);
  function ehFav(id) { return favs.indexOf(id) > -1; }
  function alternarFav(id) {
    if (ehFav(id)) favs.splice(favs.indexOf(id), 1); else favs.push(id);
    guardar.gravar("favs", favs);
    $$('[data-fav-id="' + id + '"]').forEach(function (b) { b.setAttribute("aria-pressed", ehFav(id)); });
    return ehFav(id);
  }

  /* ---------------- Textos da loja ---------------- */
  $("[data-status]").textContent = loja.cidade.split("·")[0].trim();
  $("[data-endereco]").textContent = loja.endereco;
  $("[data-referencia]").textContent = loja.referencia + " · " + loja.cidade;
  $("[data-horarios]").innerHTML = loja.horarios.map(function (h) { return "<span>" + esc(h) + "</span>"; }).join("");
  $("[data-rodape-endereco]").textContent = loja.endereco + " (" + loja.referencia.toLowerCase() + ") · " + loja.cidade;
  $("[data-insta-user]").textContent = loja.instagramUser;
  $("[data-seguidores]").textContent = loja.seguidores;
  $("[data-instagram]").href = loja.instagram;
  $("[data-mapa]").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.loja.nomeCompleto + ", " + loja.endereco + ", Faxinal dos Guedes, SC");
  $("[data-ano]").textContent = new Date().getFullYear();
  if (C.previa) $("[data-aviso-previa]").hidden = false;

  function linkWhats(texto) {
    var n = String(loja.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(texto);
  }
  $$("[data-whatsapp]").forEach(function (a) { a.href = linkWhats("Olá, X do Neves! Quero fazer um pedido."); });

  /* ---------------- Categorias ---------------- */
  var contagem = {};
  C.cardapio.forEach(function (p) { contagem[p.cat] = (contagem[p.cat] || 0) + 1; });
  $("[data-cats]").innerHTML = C.categorias.map(function (c) {
    return '<a class="cat" href="#cardapio" data-ir-cat="' + c.id + '">' + A.icone(c.desenho) + "<span>" + esc(c.nome) + "</span></a>";
  }).join("");

  /* ---------------- Mais pedidos ---------------- */
  function cardProduto(p) {
    return '<article class="prod">' +
      (p.tag ? '<span class="selo">' + esc(p.tag) + "</span>" : "") +
      '<button class="coracao" type="button" data-fav-id="' + p.id + '" aria-pressed="' + ehFav(p.id) + '" aria-label="Favoritar ' + esc(p.nome) + '">' + icoCoracao + "</button>" +
      '<button type="button" class="prod__abrir" data-abrir-item="' + p.id + '" aria-label="' + esc(p.nome) + ", " + real(p.preco) + '" style="display:contents">' +
      '<span class="prod__img">' + imagem(p) + "</span>" +
      '<span class="prod__corpo"><span class="prod__nome">' + esc(p.nome) + '</span><span class="prod__linha"><span class="preco">' + real(p.preco) + '</span><span class="mais">' + icoMais + "</span></span></span>" +
      "</button></article>";
  }
  $("[data-populares]").innerHTML = C.cardapio.filter(function (p) { return p.destaque; }).map(cardProduto).join("");

  /* ---------------- Oferta ---------------- */
  var of = C.oferta, ofItem = porId[of.item];
  $("[data-oferta-selo]").textContent = of.selo;
  $("[data-oferta-titulo]").textContent = of.titulo;
  $("[data-oferta-texto]").textContent = of.texto;
  if (ofItem) {
    $("[data-oferta-preco]").innerHTML = "<small>por</small>" + real(ofItem.preco);
    $("[data-oferta-btn]").setAttribute("data-abrir-item", ofItem.id);
    $("[data-oferta-visual]").innerHTML = ofItem.foto ? imagem(ofItem) : A.desenho("burger");
  }

  /* ---------------- Montagem ---------------- */
  $("[data-burger-montagem]").innerHTML = A.desenho("burger", true);

  /* ---------------- Cardápio ---------------- */
  var abaAtual = "todos", termo = "";
  $("[data-abas]").innerHTML = [{ id: "todos", nome: "Todos", desenho: "todos" }].concat(C.categorias).map(function (c) {
    var n = c.id === "todos" ? C.cardapio.length : contagem[c.id] || 0;
    return '<button class="aba" role="tab" type="button" aria-selected="' + (c.id === "todos") + '" data-aba="' + c.id + '">' + A.icone(c.desenho) + esc(c.nome) + " <small>" + n + "</small></button>";
  }).join("");

  function linhaItem(p) {
    return '<button class="linha-item" type="button" data-abrir-item="' + p.id + '">' +
      '<span class="linha-item__img">' + imagem(p) + "</span>" +
      '<span class="linha-item__txt"><span class="linha-item__nome">' + esc(p.nome) + (p.tag ? '<span class="selo">' + esc(p.tag) + "</span>" : "") + "</span>" +
      '<span class="linha-item__desc">' + esc(p.desc) + "</span></span>" +
      '<span class="linha-item__fim"><span class="preco">' + real(p.preco) + '</span><span class="mais">' + icoMais + "</span></span>" +
      "</button>";
  }

  function desenharLista() {
    var t = normal(termo.trim());
    var html = "", total = 0;
    C.categorias.forEach(function (c) {
      if (abaAtual !== "todos" && abaAtual !== c.id) return;
      var itens = C.cardapio.filter(function (p) {
        return p.cat === c.id && (!t || normal(p.nome + " " + p.desc).indexOf(t) > -1);
      });
      if (!itens.length) return;
      total += itens.length;
      html += '<div class="grupo"><h3 class="grupo__titulo">' + A.icone(c.desenho) + esc(c.nome) + " <small>" + itens.length + (itens.length > 1 ? " opções" : " opção") + "</small></h3>" +
        '<div class="grade">' + itens.map(linhaItem).join("") + "</div></div>";
    });
    $("[data-lista]").innerHTML = html;
    $("[data-sem-resultado]").hidden = total > 0;
  }

  function escolherAba(id) {
    abaAtual = id;
    $$("[data-aba]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-aba") === id); });
    $$("[data-ir-cat]").forEach(function (b) { b.classList.toggle("ativa", b.getAttribute("data-ir-cat") === id); });
    desenharLista();
    var ativa = $('[data-aba="' + id + '"]');
    if (ativa) ativa.scrollIntoView({ block: "nearest", inline: "center", behavior: reduzir ? "auto" : "smooth" });
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  desenharLista();

  $("[data-abas]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-aba]");
    if (b) escolherAba(b.getAttribute("data-aba"));
  });
  $("[data-cats]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ir-cat]");
    if (b) escolherAba(b.getAttribute("data-ir-cat"));
  });

  var campoBusca = $("[data-busca]");
  campoBusca.addEventListener("input", function () {
    termo = campoBusca.value;
    if (termo && abaAtual !== "todos") escolherAba("todos"); else desenharLista();
  });
  $("[data-form-busca]").addEventListener("submit", function (e) {
    e.preventDefault();
    campoBusca.blur();
    $("#cardapio").scrollIntoView({ behavior: reduzir ? "auto" : "smooth" });
  });

  /* ---------------- FAQ ---------------- */
  $("[data-faq]").innerHTML = C.faq.map(function (f, i) {
    return "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(f.p) + "<i aria-hidden=\"true\"></i></summary><p>" + esc(f.r) + "</p></details>";
  }).join("");
  $$("[data-faq] details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) $$("[data-faq] details").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------------- Toast ---------------- */
  var toastT;
  function avisar(msg) {
    var t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("on"); }, 2200);
  }

  /* ---------------- Folhas ---------------- */
  var focoAnterior = null;
  function abrirFolha(nome) {
    var f = $('[data-folha="' + nome + '"]');
    focoAnterior = document.activeElement;
    f.hidden = false;
    f.classList.remove("saindo");
    document.body.classList.add("travado");
    var alvo = f.querySelector(".folha__painel button, .folha__painel input, .folha__painel a");
    if (alvo) setTimeout(function () { alvo.focus({ preventScroll: true }); }, 60);
  }
  function fecharFolha(f) {
    if (!f || f.hidden) return;
    f.classList.add("saindo");
    setTimeout(function () {
      f.hidden = true;
      f.classList.remove("saindo");
      if (!$$(".folha").some(function (x) { return !x.hidden; })) document.body.classList.remove("travado");
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus({ preventScroll: true });
    }, reduzir ? 0 : 240);
  }
  $$(".folha").forEach(function (f) {
    f.addEventListener("click", function (e) { if (e.target.closest("[data-fechar]")) fecharFolha(f); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") $$(".folha").forEach(function (f) { if (!f.hidden) fecharFolha(f); });
  });

  /* ---------------- Detalhe do item ---------------- */
  var atual = null, qtd = 1;
  function totalItem() {
    var extras = $$("[data-item-adic] input:checked").reduce(function (s, i) { return s + Number(i.value); }, 0);
    return (atual.preco + extras) * qtd;
  }
  function atualizarTotalItem() {
    $("[data-item-qtd]").textContent = qtd;
    $("[data-item-total]").textContent = real(totalItem());
  }
  function abrirItem(id) {
    var p = porId[id];
    if (!p) return;
    atual = p; qtd = 1;
    var cat = catPorId[p.cat];
    $("[data-item-img]").innerHTML = p.foto ? '<img src="' + esc(p.foto) + '" alt="">' : A.desenho(cat.desenho);
    $("[data-item-nome]").textContent = p.nome;
    $("[data-item-cat]").textContent = cat.nome;
    $("[data-item-preco]").textContent = real(p.preco);
    $("[data-item-desc]").textContent = p.desc;
    var tag = $("[data-item-tag]");
    tag.hidden = !p.tag; tag.textContent = p.tag || "";
    var fav = $("[data-fav]");
    fav.setAttribute("data-fav-id", p.id);
    fav.setAttribute("aria-pressed", ehFav(p.id));
    var extras = C.adicionais[p.cat] || [];
    $("[data-item-adic-bloco]").hidden = !extras.length;
    $("[data-item-adic]").innerHTML = extras.map(function (a, i) {
      return '<label class="adic"><span>' + esc(a.nome) + "<small>+ " + real(a.preco) + '</small></span><span class="chave"><input type="checkbox" value="' + a.preco + '" data-nome="' + esc(a.nome) + '" id="adic-' + i + '"><i></i></span></label>';
    }).join("");
    $("[data-item-obs]").value = "";
    atualizarTotalItem();
    abrirFolha("item");
    $('[data-folha="item"] .folha__painel').scrollTop = 0;
  }
  document.addEventListener("click", function (e) {
    var fav = e.target.closest("[data-fav-id]");
    if (fav) {
      e.stopPropagation();
      var on = alternarFav(fav.getAttribute("data-fav-id"));
      avisar(on ? "❤️ Salvo nos favoritos" : "Removido dos favoritos");
      return;
    }
    var b = e.target.closest("[data-abrir-item]");
    if (b) abrirItem(b.getAttribute("data-abrir-item"));
  });
  $("[data-item-adic]").addEventListener("change", atualizarTotalItem);
  $$("[data-qtd]").forEach(function (b) {
    b.addEventListener("click", function () {
      qtd = Math.max(1, Math.min(20, qtd + Number(b.getAttribute("data-qtd"))));
      atualizarTotalItem();
    });
  });

  /* ---------------- Pedido ---------------- */
  var pedido = guardar.ler("pedido", []).filter(function (l) { return porId[l.id]; });
  var dados = guardar.ler("dados", { nome: "", endereco: "", troco: "", entrega: "entrega", pagamento: C.pagamentos[0] });

  function salvar() { guardar.gravar("pedido", pedido); guardar.gravar("dados", dados); }
  function qtdTotal() { return pedido.reduce(function (s, l) { return s + l.qtd; }, 0); }
  function subtotal() { return pedido.reduce(function (s, l) { return s + l.unit * l.qtd; }, 0); }
  function taxa() { return dados.entrega === "entrega" && pedido.length ? (loja.taxaEntrega || 0) : 0; }

  $("[data-item-add]").addEventListener("click", function () {
    var marcados = $$("[data-item-adic] input:checked");
    var adic = marcados.map(function (i) { return i.getAttribute("data-nome"); });
    var unit = atual.preco + marcados.reduce(function (s, i) { return s + Number(i.value); }, 0);
    var obs = $("[data-item-obs]").value.trim();
    var chave = [atual.id, adic.join("|"), obs].join("~");
    var existente = pedido.filter(function (l) { return l.chave === chave; })[0];
    if (existente) existente.qtd += qtd;
    else pedido.push({ chave: chave, id: atual.id, qtd: qtd, adic: adic, obs: obs, unit: unit });
    salvar();
    atualizarPedido(true);
    fecharFolha($('[data-folha="item"]'));
    avisar("✅ " + qtd + "× " + atual.nome + " no pedido");
  });

  function atualizarPedido(pulou) {
    var n = qtdTotal();
    $$("[data-contador]").forEach(function (c) {
      c.hidden = !n; c.textContent = n;
      if (pulou) { c.classList.remove("pulou"); void c.offsetWidth; c.classList.add("pulou"); }
    });
    var barra = $("[data-barra-pedido]");
    barra.hidden = !n;
    $("[data-barra-qtd]").textContent = n;
    $("[data-barra-total]").textContent = real(subtotal());
    desenharCarrinho();
  }

  function desenharCarrinho() {
    var vazio = !pedido.length;
    $("[data-carrinho-vazio]").hidden = !vazio;
    $("[data-carrinho-corpo]").hidden = vazio;
    $("[data-carrinho-rodape]").hidden = vazio;
    if (vazio) { $("[data-vazio-img]").innerHTML = A.desenho("burger"); return; }
    $("[data-carrinho-itens]").innerHTML = pedido.map(function (l, i) {
      var p = porId[l.id];
      var extra = l.adic.length ? "+ " + l.adic.join(", ") : "";
      if (l.obs) extra += (extra ? " · " : "") + "Obs.: " + l.obs;
      return '<li class="c-item"><span class="c-item__img">' + imagem(p) + "</span>" +
        '<div><p class="c-item__nome">' + esc(p.nome) + "</p>" + (extra ? '<p class="c-item__extra">' + esc(extra) + "</p>" : "") + '<p class="c-item__preco">' + real(l.unit * l.qtd) + "</p></div>" +
        '<div class="qtd"><button type="button" data-c-qtd="' + i + '" data-d="-1" aria-label="Diminuir ' + esc(p.nome) + '">' + (l.qtd === 1 ? "×" : "−") + '</button><output>' + l.qtd + '</output><button type="button" data-c-qtd="' + i + '" data-d="1" aria-label="Aumentar ' + esc(p.nome) + '">+</button></div></li>';
    }).join("");
    $("[data-campo-endereco]").hidden = dados.entrega !== "entrega";
    $("[data-linha-taxa]").hidden = dados.entrega !== "entrega";
    $("[data-campo-troco]").hidden = dados.pagamento !== "Dinheiro";
    $("[data-subtotal]").textContent = real(subtotal());
    $("[data-taxa]").textContent = real(taxa());
    $("[data-total]").textContent = real(subtotal() + taxa());
  }

  $("[data-carrinho-itens]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-c-qtd]");
    if (!b) return;
    var i = Number(b.getAttribute("data-c-qtd"));
    pedido[i].qtd += Number(b.getAttribute("data-d"));
    if (pedido[i].qtd < 1) pedido.splice(i, 1);
    salvar();
    atualizarPedido();
  });

  // campos do pedido
  $("[data-pagamentos]").innerHTML = C.pagamentos.map(function (p) {
    return '<label><input type="radio" name="pagamento" value="' + esc(p) + '"' + (dados.pagamento === p ? " checked" : "") + "><span>" + esc(p) + "</span></label>";
  }).join("");
  $$("[data-entrega]").forEach(function (r) { r.checked = r.value === dados.entrega; });
  $$("[data-campo]").forEach(function (inp) {
    var k = inp.getAttribute("data-campo");
    inp.value = dados[k] || "";
    inp.addEventListener("input", function () { dados[k] = inp.value; inp.closest(".campo").classList.remove("erro"); salvar(); });
  });
  $('[data-folha="carrinho"]').addEventListener("change", function (e) {
    if (e.target.name === "entrega") dados.entrega = e.target.value;
    if (e.target.name === "pagamento") dados.pagamento = e.target.value;
    salvar();
    desenharCarrinho();
  });

  $$("[data-abrir-carrinho]").forEach(function (b) {
    b.addEventListener("click", function () { desenharCarrinho(); abrirFolha("carrinho"); });
  });

  $("[data-enviar]").addEventListener("click", function (e) {
    var faltando = [];
    if (!dados.nome.trim()) faltando.push("nome");
    if (dados.entrega === "entrega" && !dados.endereco.trim()) faltando.push("endereco");
    var aviso = $("[data-aviso-campos]");
    if (faltando.length) {
      e.preventDefault();
      faltando.forEach(function (k) { $('[data-campo="' + k + '"]').closest(".campo").classList.add("erro"); });
      aviso.hidden = false;
      aviso.textContent = faltando.length > 1 ? "Preencha seu nome e o endereço de entrega." : faltando[0] === "nome" ? "Preencha seu nome para enviarmos o pedido." : "Preencha o endereço de entrega.";
      $('[data-campo="' + faltando[0] + '"]').focus();
      return;
    }
    aviso.hidden = true;
    var linhas = ["Olá, X do Neves! 🍔 Quero fazer um pedido:", ""];
    pedido.forEach(function (l) {
      var p = porId[l.id];
      linhas.push("• " + l.qtd + "x " + p.nome + " — " + real(l.unit * l.qtd));
      if (l.adic.length) linhas.push("   + " + l.adic.join(", "));
      if (l.obs) linhas.push("   Obs.: " + l.obs);
    });
    linhas.push("", "Subtotal: " + real(subtotal()));
    if (dados.entrega === "entrega") linhas.push("Entrega: " + real(taxa()));
    linhas.push("*Total: " + real(subtotal() + taxa()) + "*", "");
    linhas.push("Nome: " + dados.nome.trim());
    linhas.push(dados.entrega === "entrega" ? "Entregar em: " + dados.endereco.trim() : "Vou retirar no local");
    linhas.push("Pagamento: " + dados.pagamento + (dados.pagamento === "Dinheiro" && dados.troco ? " (troco para " + dados.troco + ")" : ""));
    this.href = linkWhats(linhas.join("\n"));
  });

  atualizarPedido();

  /* ---------------- Barra superior / tabbar ---------------- */
  var topo = $("[data-topo]");
  function aoRolar() { topo.classList.toggle("rolou", window.scrollY > 10); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  var abasTab = $$(".tabbar a");
  var secoes = [["#inicio", 0], ["#cardapio", 1], ["#onde", 3]];
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var alvo = "#" + en.target.id;
        abasTab.forEach(function (a) { a.classList.toggle("ativo", a.getAttribute("href") === alvo); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach(function (s) { var el = $(s[0]); if (el) io.observe(el); });
  }

  /* ---------------- Brasas (canvas) ---------------- */
  $$("[data-brasas]").forEach(function (cv) {
    var ctx = cv.getContext("2d"), parts = [], w, h, dpr, visivel = false;
    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.offsetWidth; h = cv.offsetHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function nova(inicio) {
      return { x: w * (.35 + Math.random() * .65), y: inicio ? Math.random() * h : h + 10, r: .6 + Math.random() * 2.2, v: .25 + Math.random() * .9, d: (Math.random() - .5) * .5, f: Math.random() * 6.28, a: .4 + Math.random() * .6 };
    }
    medir();
    for (var i = 0; i < 46; i++) parts.push(nova(true));
    function quadro() {
      if (!visivel) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      parts.forEach(function (p, i) {
        p.y -= p.v; p.f += .03; p.x += p.d + Math.sin(p.f) * .35;
        var vida = Math.max(0, Math.min(1, p.y / h));
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, "rgba(255,210,90," + (p.a * vida) + ")");
        g.addColorStop(.4, "rgba(255,120,30," + (p.a * vida * .5) + ")");
        g.addColorStop(1, "rgba(255,80,20,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
        if (p.y < -10) parts[i] = nova(false);
      });
      requestAnimationFrame(quadro);
    }
    window.addEventListener("resize", medir);
    if (reduzir) return;
    new IntersectionObserver(function (e) {
      var antes = visivel; visivel = e[0].isIntersecting;
      if (visivel && !antes) requestAnimationFrame(quadro);
    }).observe(cv);
  });

  /* ---------------- Fundo: bokeh de luzes desfocadas ---------------- */
  (function () {
    var cv = $("[data-bokeh]");
    if (!cv) return;
    var ctx = cv.getContext("2d"), luzes = [], w, h, rolagem = 0;
    var cores = [[255, 220, 140], [255, 190, 100], [255, 235, 180], [255, 170, 80], [255, 210, 120]];
    function medir() {
      w = cv.width = Math.round(window.innerWidth * .6);
      h = cv.height = Math.round(window.innerHeight * .6);
      cv.style.width = "100%"; cv.style.height = "100%";
    }
    function nova() {
      var prof = Math.random();
      return {
        x: Math.random() * w, y: Math.random() * h,
        r: (10 + prof * 70) * (w < 400 ? .8 : 1),
        prof: prof, c: cores[Math.floor(Math.random() * cores.length)],
        a: .05 + (1 - prof) * .12, vx: (Math.random() - .5) * .12, vy: -.04 - Math.random() * .12,
        f: Math.random() * 6.28
      };
    }
    medir();
    var total = window.innerWidth < 700 ? 16 : 26;
    for (var i = 0; i < total; i++) luzes.push(nova());
    function desenhar() {
      ctx.clearRect(0, 0, w, h);
      luzes.forEach(function (l) {
        var y = ((l.y - rolagem * (.04 + l.prof * .1)) % (h + 2 * l.r) + h + 2 * l.r) % (h + 2 * l.r) - l.r;
        var brilho = .75 + Math.sin(l.f) * .25;
        var g = ctx.createRadialGradient(l.x, y, 0, l.x, y, l.r);
        var c = l.c.join(",");
        g.addColorStop(0, "rgba(" + c + "," + (l.a * .55 * brilho) + ")");
        g.addColorStop(.82, "rgba(" + c + "," + (l.a * .75 * brilho) + ")");
        g.addColorStop(.94, "rgba(" + c + "," + (l.a * brilho) + ")");
        g.addColorStop(1, "rgba(" + c + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(l.x, y, l.r, 0, 6.283); ctx.fill();
      });
    }
    function quadro() {
      luzes.forEach(function (l) {
        l.x += l.vx; l.y += l.vy; l.f += .012;
        if (l.x < -l.r) l.x = w + l.r; if (l.x > w + l.r) l.x = -l.r;
      });
      desenhar();
      if (!document.hidden) requestAnimationFrame(quadro);
    }
    window.addEventListener("resize", function () { medir(); desenhar(); });
    window.addEventListener("scroll", function () { rolagem = window.scrollY * .6; if (reduzir) desenhar(); }, { passive: true });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && !reduzir) requestAnimationFrame(quadro); });
    if (reduzir) desenhar(); else requestAnimationFrame(quadro);
  })();

  /* ---------------- Animações (GSAP) ---------------- */
  var camadas = ["pao-base", "salada", "tomate", "carne", "queijo", "pao-topo"];
  var etapaDe = { "pao-base": 0, salada: 1, tomate: 1, carne: 2, queijo: 3, "pao-topo": 3 };
  var etapas = $$("[data-etapa]");
  function marcarEtapa(n) { etapas.forEach(function (li, i) { li.classList.toggle("on", i <= n); li.classList.toggle("atual", i === n); }); }

  if (!window.gsap || reduzir) {
    $$(".revelar").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    marcarEtapa(3);
    return;
  }
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  // entrada da abertura
  gsap.to(".abertura .revelar", { opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .1, delay: .1 });
  gsap.from(".banner__foto", { scale: .6, rotate: -25, opacity: 0, duration: 1.3, ease: "back.out(1.4)", delay: .35 });
  gsap.from(".cat", { opacity: 0, y: 20, duration: .6, stagger: .06, ease: "power2.out", delay: .6 });

  // revelar no scroll
  $$(".revelar").forEach(function (el) {
    if (el.closest(".abertura")) return;
    gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.from(".trilho .prod", { opacity: 0, y: 30, duration: .7, stagger: .07, ease: "power2.out", scrollTrigger: { trigger: ".trilho", start: "top 90%" } });

  // parallax do banner
  gsap.to("[data-parallax]", { yPercent: 14, rotate: 8, ease: "none", scrollTrigger: { trigger: "[data-banner]", start: "top top", end: "bottom top", scrub: true } });

  // estampa do fundo desliza devagar com o scroll
  gsap.to(".ambiente__estampa", { y: -260, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

  // contadores
  $$("[data-conta]").forEach(function (el) {
    var alvo = Number(el.getAttribute("data-conta")), milhar = el.hasAttribute("data-milhar"), o = { v: 0 };
    gsap.to(o, {
      v: alvo, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { var v = Math.round(o.v); el.textContent = milhar ? v.toLocaleString("pt-BR") : v; }
    });
  });

  // montagem do lanche: camadas caem e se encaixam conforme o scroll
  var svg = $("[data-burger-montagem] svg");
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".montagem__palco", start: "top top", end: "+=180%", scrub: .6, pin: true, anticipatePin: 1,
      onUpdate: function (st) {
        var t = tl.time(), n = -1;
        camadas.forEach(function (c, i) { if (t >= i * .9 + .5) n = Math.max(n, etapaDe[c]); });
        marcarEtapa(n);
      }
    }
  });
  camadas.forEach(function (c, i) {
    var el = svg.querySelector('[data-camada="' + c + '"]');
    tl.fromTo(el, { y: -260 - i * 30, opacity: 0, rotate: i % 2 ? 6 : -6, transformOrigin: "50% 50%" },
      { y: 0, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.6)" }, i * .9);
  });
  tl.to(svg, { scale: 1.06, duration: .6, ease: "power1.inOut" }, ">");
})();
