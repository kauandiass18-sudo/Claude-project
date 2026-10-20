/* Casa Ivete — cardápio, pedido e WhatsApp */
(function () {
  "use strict";

  var CFG = window.CASA_IVETE_CONFIG;
  var CAT = window.CASA_IVETE_CATALOGO;
  var CHAVE_PEDIDO = "casaivete:pedido:v1";
  var CHAVE_DADOS = "casaivete:dados:v1";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.documentElement.classList.add("js");

  /* ---------- utilidades ---------- */
  var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function brl(v) { return moeda.format(v); }
  function temPreco(v) { return typeof v === "number" && isFinite(v) && v >= 0; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ler(chave, padrao) {
    try { var v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* navegação privada */ }
  }
  function whatsUrl(texto) {
    return "https://wa.me/" + CFG.contato.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  function hojeISO() {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  function dataBR(iso) { var p = iso.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function plural(n, um, varios) { return n + " " + (n === 1 ? um : varios); }

  /* Imagem: caminho sem extensão = ilustração com duas larguras (.webp e -sm.webp);
     caminho com extensão = fotografia enviada pela marca, usada como está. */
  function imagem(base, alt, sizes, extra) {
    var attrs = ' alt="' + esc(alt) + '" width="800" height="1000" decoding="async"' + (extra || "");
    if (/\.(jpe?g|png|webp|avif|svg)$/i.test(base)) return '<img src="' + esc(base) + '"' + attrs + ">";
    return '<img src="' + esc(base) + '.webp" srcset="' + esc(base) + "-sm.webp 420w, " + esc(base) + '.webp 800w" sizes="' + sizes + '"' + attrs + ">";
  }
  function srcGrande(base) { return /\.[a-z]+$/i.test(base) ? base : base + ".webp"; }

  var produtosPorId = {};
  CAT.produtos.forEach(function (p) { produtosPorId[p.id] = p; });
  var categoriasPorId = {};
  CAT.categorias.forEach(function (c) { categoriasPorId[c.id] = c; });

  /* ---------- mensagens prontas ---------- */
  var MENSAGENS = {
    geral: "Olá! Vim pelo site da Casa Ivete e gostaria de fazer um pedido.",
    encomenda: "Olá! Vim pelo site da Casa Ivete e gostaria de consultar as opções de encomenda.\n\nOcasião:\nData desejada:\nQuantidade aproximada de pessoas:\n",
    entrega: "Olá! Gostaria de consultar as condições de entrega da Casa Ivete para o meu endereço.",
    doces: "Olá! Gostaria de saber quais doces e especialidades a Casa Ivete tem disponíveis."
  };
  $$("[data-whats]").forEach(function (a) { a.href = whatsUrl(MENSAGENS[a.getAttribute("data-whats")] || MENSAGENS.geral); });

  /* ---------- marca ---------- */
  if (CFG.marca.logo) {
    $$("[data-marca], .rodape__marca").forEach(function (el) {
      el.innerHTML = '<img src="' + esc(CFG.marca.logo) + '" alt="' + esc(CFG.marca.nome + " — " + CFG.marca.assinatura) + '">';
    });
  }

  /* ---------- cabeçalho e menu ---------- */
  var topo = $("[data-topo]");
  var nav = $("[data-nav]");
  var menuBtn = $("[data-menu-btn]");
  function aoRolar() { topo.classList.toggle("is-fixo", window.scrollY > 8); }
  window.addEventListener("scroll", aoRolar, { passive: true }); aoRolar();

  function menu(abrir) {
    nav.classList.toggle("is-aberto", abrir);
    topo.classList.toggle("menu-aberto", abrir);
    menuBtn.setAttribute("aria-expanded", String(abrir));
    $(".sr", menuBtn).textContent = abrir ? "Fechar menu" : "Abrir menu";
  }
  menuBtn.addEventListener("click", function () { menu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-aberto")) { menu(false); menuBtn.focus(); } });

  /* ---------- categorias ---------- */
  $("[data-categorias]").innerHTML = CAT.categorias.map(function (c, i) {
    return '<li data-revelar><a class="categoria" href="#cardapio" data-ir-categoria="' + esc(c.id) + '">' +
      '<div class="categoria__img">' + imagem(c.imagem, c.imagemAlt, i === 0 ? "(min-width: 900px) 40vw, 100vw" : "(min-width: 900px) 25vw, 50vw", ' loading="lazy"') + "</div>" +
      '<div class="categoria__rodape"><span class="categoria__nome">' + esc(c.nome) + '</span><span class="categoria__ver">Ver produtos</span></div></a></li>';
  }).join("");
  $$("[data-ir-categoria]").forEach(function (a) {
    a.addEventListener("click", function () { filtrar(a.getAttribute("data-ir-categoria")); });
  });

  /* ---------- cardápio ---------- */
  var filtroAtual = "todos";
  var listaProdutos = $("[data-produtos]");
  var filtrosEl = $("[data-filtros]");
  filtrosEl.innerHTML = [{ id: "todos", curto: "Todos" }].concat(CAT.categorias).map(function (c) {
    return '<button type="button" class="filtro" data-filtro="' + esc(c.id) + '" aria-pressed="' + (c.id === "todos") + '">' + esc(c.curto || c.nome) + "</button>";
  }).join("");
  filtrosEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filtro]"); if (b) filtrar(b.getAttribute("data-filtro"));
  });

  function ordenados() {
    return CAT.produtos.map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return (b.p.destaque ? 1 : 0) - (a.p.destaque ? 1 : 0) || a.i - b.i; })
      .map(function (x) { return x.p; });
  }

  function precoHTML(p) {
    if (temPreco(p.preco)) return '<span class="preco">' + brl(p.preco) + (p.medida ? "<small>" + esc(p.medida) + "</small>" : "") + "</span>";
    return '<span class="preco preco--consulta">' + (p.medida ? esc(p.medida) + " · " : "") + "Sob consulta</span>";
  }

  function cartao(p) {
    var cat = categoriasPorId[p.categoria];
    var selo = !p.disponivel ? "Indisponível no momento" : p.encomenda ? "Sob encomenda" : "";
    var botao = p.disponivel
      ? '<button type="button" class="btn-add" data-add="' + esc(p.id) + '">Adicionar ao pedido</button>'
      : '<a class="btn-add" href="' + whatsUrl("Olá! Gostaria de saber quando o produto \"" + p.nome + "\" estará disponível.") + '" target="_blank" rel="noopener">Consultar</a>';
    return '<li><article class="produto' + (p.disponivel ? "" : " is-indisponivel") + '">' +
      '<button type="button" class="produto__img" data-abrir="' + esc(p.id) + '" aria-label="Ver detalhes de ' + esc(p.nome) + '">' +
      imagem(p.imagem, p.imagemAlt, "(min-width: 1000px) 30vw, (min-width: 560px) 45vw, 38vw", ' loading="lazy"') +
      (selo ? '<span class="produto__selo">' + selo + "</span>" : "") + "</button>" +
      '<div class="produto__corpo">' +
      '<p class="produto__cat">' + esc(cat ? cat.curto : "") + "</p>" +
      '<h3 class="produto__nome"><button type="button" data-abrir="' + esc(p.id) + '">' + esc(p.nome) + "</button></h3>" +
      '<p class="produto__desc">' + esc(p.descricao) + "</p>" +
      '<div class="produto__pe">' + precoHTML(p) + botao + "</div></div></article></li>";
  }

  function filtrar(id) {
    filtroAtual = categoriasPorId[id] ? id : "todos";
    $$("[data-filtro]", filtrosEl).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filtro") === filtroAtual)); });
    var lista = ordenados().filter(function (p) { return filtroAtual === "todos" || p.categoria === filtroAtual; });
    listaProdutos.innerHTML = lista.map(cartao).join("");
    $("[data-vazio]").hidden = lista.length > 0;
    var nome = filtroAtual === "todos" ? "todas as categorias" : categoriasPorId[filtroAtual].nome;
    $("[data-filtro-status]").textContent = plural(lista.length, "produto", "produtos") + " em " + nome + ".";
  }
  filtrar("todos");
  $("[data-nota-imagens]").hidden = !CFG.imagensIlustrativas;

  listaProdutos.addEventListener("click", function (e) {
    var abrir = e.target.closest("[data-abrir]");
    if (abrir) { abrirProduto(abrir.getAttribute("data-abrir")); return; }
    var add = e.target.closest("[data-add]");
    if (add) {
      var p = produtosPorId[add.getAttribute("data-add")];
      if (p.variacoes && p.variacoes.length) { abrirProduto(p.id); return; }
      adicionar(p.id, 1, {}, "");
      add.classList.add("is-ok"); add.textContent = "Adicionado";
      setTimeout(function () { add.classList.remove("is-ok"); add.textContent = "Adicionar ao pedido"; }, 1600);
    }
  });

  /* ---------- diálogos ---------- */
  function abrirDialogo(d) {
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    document.body.classList.add("sem-rolagem");
    atualizarBarra();
  }
  function fecharDialogo(d) { if (d.open) { if (typeof d.close === "function") d.close(); else d.removeAttribute("open"); } }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) fecharDialogo(d); });
    d.addEventListener("close", function () {
      if (!$$("dialog").some(function (x) { return x.open; })) document.body.classList.remove("sem-rolagem");
      atualizarBarra();
    });
    $$("[data-fechar]", d).forEach(function (b) { b.addEventListener("click", function () { fecharDialogo(d); }); });
  });

  /* ---------- detalhe do produto ---------- */
  var modal = $("[data-modal]");
  var modalForm = $("[data-modal-form]");
  var qtdInput = $("[data-qtd-valor]", modal);
  var produtoAberto = null;
  var gatilho = null;

  function limitarQtd(v) { v = parseInt(v, 10); return isNaN(v) ? 1 : Math.min(999, Math.max(1, v)); }

  function abrirProduto(id) {
    var p = produtosPorId[id]; if (!p) return;
    produtoAberto = p; gatilho = document.activeElement;
    var img = $("[data-modal-img]", modal);
    img.src = srcGrande(p.imagem); img.alt = p.imagemAlt;
    $("[data-modal-cat]", modal).textContent = (categoriasPorId[p.categoria] || {}).nome || "";
    $("[data-modal-nome]", modal).textContent = p.nome;
    $("[data-modal-desc]", modal).textContent = p.descricao;
    var det = [];
    det.push(["Valor", temPreco(p.preco) ? brl(p.preco) : "Sob consulta"]);
    if (p.medida) det.push(["Tamanho", p.medida]);
    if (p.encomenda) det.push(["Preparo", "Sob encomenda"]);
    det.push(["Disponibilidade", p.disponivel ? "Confirmada no atendimento" : "Indisponível no momento"]);
    $("[data-modal-detalhes]", modal).innerHTML = det.map(function (d) { return "<div><dt>" + esc(d[0]) + "</dt><dd>" + esc(d[1]) + "</dd></div>"; }).join("");
    $("[data-modal-variacoes]", modal).innerHTML = (p.variacoes || []).map(function (v, i) {
      return '<label class="campo"><span class="campo__rotulo">' + esc(v.nome) + '</span><select name="var-' + i + '" data-variacao="' + esc(v.nome) + '">' +
        v.opcoes.map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + "</select></label>";
    }).join("");
    $("[data-modal-obs]", modal).value = "";
    qtdInput.value = 1;
    $("[data-modal-add]", modal).hidden = !p.disponivel;
    $("[data-qtd]", modal).hidden = !p.disponivel;
    $("[data-modal-obs]", modal).closest(".campo").hidden = !p.disponivel;
    $("[data-modal-indisp]", modal).hidden = p.disponivel;
    $("[data-modal-whats]", modal).href = whatsUrl("Olá! Gostaria de saber quando o produto \"" + p.nome + "\" estará disponível.");
    abrirDialogo(modal);
  }
  modal.addEventListener("close", function () { if (gatilho && gatilho.focus) gatilho.focus(); });
  $("[data-qtd-menos]", modal).addEventListener("click", function () { qtdInput.value = limitarQtd(qtdInput.value - 1); });
  $("[data-qtd-mais]", modal).addEventListener("click", function () { qtdInput.value = limitarQtd(+qtdInput.value + 1); });
  qtdInput.addEventListener("change", function () { qtdInput.value = limitarQtd(qtdInput.value); });
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!produtoAberto || !produtoAberto.disponivel) return;
    var vars = {};
    $$("[data-variacao]", modal).forEach(function (s) { vars[s.getAttribute("data-variacao")] = s.value; });
    adicionar(produtoAberto.id, limitarQtd(qtdInput.value), vars, $("[data-modal-obs]", modal).value.trim());
    fecharDialogo(modal);
  });

  /* ---------- pedido ---------- */
  var pedido = (ler(CHAVE_PEDIDO, []) || []).filter(function (i) { return i && produtosPorId[i.id] && i.qtd > 0; });
  var dados = ler(CHAVE_DADOS, {}) || {};

  function chaveItem(id, vars, obs) { return id + "|" + JSON.stringify(vars || {}) + "|" + (obs || ""); }
  function salvar() { gravar(CHAVE_PEDIDO, pedido); }
  function qtdTotal() { return pedido.reduce(function (s, i) { return s + i.qtd; }, 0); }

  function adicionar(id, qtd, vars, obs) {
    var k = chaveItem(id, vars, obs);
    var ex = pedido.filter(function (i) { return i.key === k; })[0];
    if (ex) ex.qtd = Math.min(999, ex.qtd + qtd);
    else pedido.push({ key: k, id: id, qtd: qtd, variacoes: vars || {}, obs: obs || "" });
    salvar(); renderPedido();
    aviso(produtosPorId[id].nome + " adicionado ao pedido");
    pulso($("[data-contador]")); pulso($("[data-barra]"));
  }

  function pulso(el) { if (!el) return; el.classList.remove("is-pulso"); void el.offsetWidth; el.classList.add("is-pulso"); }

  var toastT;
  function aviso(txt) {
    var t = $("[data-toast]"); t.textContent = txt; t.classList.add("is-visivel");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-visivel"); }, 2400);
  }

  /* Cálculo: só soma valores cadastrados; o que não tem preço fica "a confirmar". */
  function calcular() {
    var subtotal = 0, semPreco = 0, indisponiveis = 0;
    pedido.forEach(function (i) {
      var p = produtosPorId[i.id];
      if (!p.disponivel) { indisponiveis++; return; }
      if (temPreco(p.preco)) subtotal += Math.round(p.preco * 100) * i.qtd; else semPreco++;
    });
    subtotal = subtotal / 100;
    var taxa = null, taxaConhecida = false, taxaTexto = "A confirmar";
    if (dados.recebimento === "retirada") { taxa = 0; taxaConhecida = true; taxaTexto = "Retirada"; }
    else if (dados.recebimento === "entrega" && dados.cidade) {
      var t = (CFG.entrega.taxas || {})[dados.cidade];
      if (temPreco(t)) { taxa = t; taxaConhecida = true; taxaTexto = t === 0 ? "Sem custo" : brl(t); }
    }
    var totalConhecido = semPreco === 0 && taxaConhecida && pedido.length > 0;
    return {
      subtotal: subtotal, semPreco: semPreco, indisponiveis: indisponiveis,
      taxa: taxa, taxaTexto: taxaTexto, totalConhecido: totalConhecido,
      total: totalConhecido ? subtotal + taxa : null,
      subtotalTexto: semPreco === 0 ? brl(subtotal) : subtotal > 0 ? brl(subtotal) + " + itens a confirmar" : "A confirmar"
    };
  }

  function descricaoItem(i) {
    var partes = Object.keys(i.variacoes || {}).map(function (k) { return k + ": " + i.variacoes[k]; });
    if (i.obs) partes.push("Obs.: " + i.obs);
    return partes.join(" · ");
  }

  function totaisHTML(c) {
    return "<div><dt>Subtotal</dt><dd>" + esc(c.subtotalTexto) + "</dd></div>" +
      "<div><dt>Entrega</dt><dd>" + esc(c.taxaTexto) + "</dd></div>" +
      '<div class="totais__total"><dt>Total</dt><dd>' + (c.totalConhecido ? brl(c.total) : "A confirmar") + "</dd></div>";
  }

  var dlgPedido = $("[data-pedido]");
  var etapaAtual = 1;

  function renderPedido() {
    var cont = $("[data-contador]"); var n = qtdTotal();
    cont.hidden = n === 0; cont.textContent = n;
    var c = calcular();
    $("[data-itens]").innerHTML = pedido.map(function (i) {
      var p = produtosPorId[i.id];
      var linha = temPreco(p.preco) ? brl(p.preco * i.qtd) + (i.qtd > 1 ? "<small>" + brl(p.preco) + " cada</small>" : "") : "<small>Sob consulta</small>";
      return '<li class="item' + (p.disponivel ? "" : " is-indisponivel") + '" data-item="' + esc(i.key) + '">' +
        imagem(p.imagem, "", "64px") +
        "<div><p class=\"item__nome\">" + esc(p.nome) + "</p>" +
        (descricaoItem(i) ? '<p class="item__meta">' + esc(descricaoItem(i)) + "</p>" : "") +
        (p.disponivel ? "" : '<p class="item__alerta">Indisponível no momento. Remova para continuar.</p>') +
        '<div class="item__controles"><div class="qtd qtd--p">' +
        '<button type="button" data-item-menos aria-label="Diminuir ' + esc(p.nome) + '">−</button>' +
        '<input type="number" inputmode="numeric" min="1" max="999" value="' + i.qtd + '" aria-label="Quantidade de ' + esc(p.nome) + '" data-item-qtd>' +
        '<button type="button" data-item-mais aria-label="Aumentar ' + esc(p.nome) + '">+</button></div>' +
        '<button type="button" class="item__remover" data-item-remover>Remover</button></div></div>' +
        '<div class="item__preco">' + linha + "</div></li>";
    }).join("");
    var vazio = pedido.length === 0;
    $("[data-pedido-vazio]").hidden = !vazio;
    $("[data-rodape-itens]").hidden = vazio;
    $("[data-totais]").innerHTML = totaisHTML(c);
    var continuar = $('[data-avancar="2"]');
    continuar.disabled = vazio || c.indisponiveis > 0;
    var nota = $(".totais__nota", dlgPedido);
    if (!nota) { nota = document.createElement("p"); nota.className = "totais__nota"; $("[data-totais]").after(nota); }
    nota.textContent = c.indisponiveis ? "Há itens indisponíveis no pedido." : c.totalConhecido ? "" : "Valores não cadastrados são confirmados pelo atendimento no WhatsApp.";
    nota.hidden = !nota.textContent;
    atualizarBarra();
    if (etapaAtual > 1 && vazio && etapaAtual < 4) irPara(1);
  }

  function atualizarBarra() {
    var barra = $("[data-barra]"); var n = qtdTotal();
    var mostrar = n > 0 && !dlgPedido.open && !modal.open;
    barra.hidden = !mostrar;
    document.body.classList.toggle("tem-barra", n > 0);
    if (n > 0) {
      var c = calcular();
      $("[data-barra-qtd]").textContent = plural(n, "item", "itens") + " no pedido";
      $("[data-barra-valor]").textContent = c.totalConhecido ? brl(c.total) : c.semPreco === 0 && c.subtotal > 0 ? brl(c.subtotal) + " + entrega" : "Valores a confirmar";
    }
  }

  $("[data-itens]").addEventListener("click", function (e) {
    var li = e.target.closest("[data-item]"); if (!li) return;
    var item = pedido.filter(function (i) { return i.key === li.getAttribute("data-item"); })[0]; if (!item) return;
    if (e.target.closest("[data-item-remover]")) {
      pedido = pedido.filter(function (i) { return i !== item; });
      aviso(produtosPorId[item.id].nome + " removido do pedido");
    } else if (e.target.closest("[data-item-menos]")) {
      if (item.qtd <= 1) return; item.qtd--;
    } else if (e.target.closest("[data-item-mais]")) {
      item.qtd = Math.min(999, item.qtd + 1);
    } else return;
    salvar(); renderPedido();
    var mesmo = $('[data-item="' + (window.CSS && CSS.escape ? CSS.escape(item.key) : item.key) + '"] ' + (e.target.closest("[data-item-menos]") ? "[data-item-menos]" : "[data-item-mais]"));
    if (mesmo) mesmo.focus();
  });
  $("[data-itens]").addEventListener("change", function (e) {
    if (!e.target.matches("[data-item-qtd]")) return;
    var key = e.target.closest("[data-item]").getAttribute("data-item");
    pedido.forEach(function (i) { if (i.key === key) i.qtd = limitarQtd(e.target.value); });
    salvar(); renderPedido();
  });

  function abrirPedido() {
    menu(false);
    irPara(1);
    abrirDialogo(dlgPedido);
  }
  $$("[data-abrir-pedido]").forEach(function (b) { b.addEventListener("click", abrirPedido); });
  $("[data-ir-cardapio]").addEventListener("click", function () {
    fecharDialogo(dlgPedido); document.getElementById("cardapio").scrollIntoView();
  });

  function irPara(n) {
    etapaAtual = n;
    $$("[data-etapa]", dlgPedido).forEach(function (s) { s.hidden = +s.getAttribute("data-etapa") !== n; });
    $$("[data-etapa-ind]", dlgPedido).forEach(function (li) {
      var k = +li.getAttribute("data-etapa-ind");
      li.classList.toggle("is-atual", k === n);
      li.classList.toggle("is-feita", k < n);
      if (k === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    $("[data-etapas]").hidden = n === 4;
    var sec = $('[data-etapa="' + n + '"]', dlgPedido); sec.scrollTop = 0;
    if (n === 3) renderRevisao();
  }
  $$("[data-voltar]", dlgPedido).forEach(function (b) { b.addEventListener("click", function () { irPara(+b.getAttribute("data-voltar")); }); });
  $('[data-avancar="2"]').addEventListener("click", function () {
    if (calcular().indisponiveis || !pedido.length) return;
    irPara(2); var f = $('[name="nome"]', form); if (f && !f.value) f.focus();
  });

  /* ---------- dados do cliente ---------- */
  var form = $("[data-form]");
  var rec = CFG.recebimento;
  var opcoesRec = [];
  if (rec.entrega) opcoesRec.push({ v: "entrega", t: "Entrega", d: CFG.cidades.join(" e ") });
  if (rec.retirada) opcoesRec.push({ v: "retirada", t: "Retirada", d: rec.localRetirada || "Local informado no atendimento" });
  if (opcoesRec.length === 1) dados.recebimento = opcoesRec[0].v;
  $("[data-recebimento]").innerHTML = opcoesRec.map(function (o) {
    return '<label class="opcao' + (opcoesRec.length === 1 ? " opcao--estatica" : "") + '"><input type="radio" name="recebimento" value="' + o.v + '"' + (dados.recebimento === o.v ? " checked" : "") + ' required>' +
      '<span class="opcao__texto">' + o.t + "<small>" + esc(o.d) + "</small></span></label>";
  }).join("") + (!rec.retirada ? '<p class="opcao__texto"><small>Prefere retirar? <a href="' + whatsUrl("Olá! Gostaria de saber se é possível retirar meu pedido na Casa Ivete.") + '" target="_blank" rel="noopener">Consulte pelo WhatsApp</a>.</small></p>' : "");

  var sel = $("[data-select-cidade]");
  sel.innerHTML = '<option value="">Selecione</option>' + CFG.cidades.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + '<option value="Outra">Outra localidade (consultar)</option>';
  $("[data-input-data]").min = hojeISO();

  ["nome", "cidade", "endereco", "data", "obs"].forEach(function (n) { if (dados[n] && form.elements[n]) form.elements[n].value = dados[n]; });
  if (dados.data && dados.data < hojeISO()) { dados.data = ""; form.elements.data.value = ""; }

  function camposEntrega() { $("[data-campos-entrega]").hidden = dados.recebimento !== "entrega"; }
  camposEntrega();

  form.addEventListener("input", function (e) {
    var el = e.target; if (!el.name) return;
    dados[el.name] = el.type === "radio" ? form.elements.recebimento.value : el.value;
    gravar(CHAVE_DADOS, dados);
    if (el.getAttribute("aria-invalid") === "true") validarCampo(el.name);
    if (el.name === "recebimento") { camposEntrega(); erro("recebimento", ""); }
    renderPedido();
  });
  form.addEventListener("change", function (e) { if (e.target.name === "cidade") { dados.cidade = e.target.value; gravar(CHAVE_DADOS, dados); renderPedido(); } });

  function erro(nome, msg) {
    var span = document.getElementById("erro-" + nome);
    if (span) span.textContent = msg;
    var el = form.elements[nome];
    if (el && el.setAttribute && !(el instanceof RadioNodeList)) el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  function validarCampo(n) {
    var v = (form.elements[n] && form.elements[n].value || "").trim();
    if (n === "nome") return erro(n, v.length < 2 ? "Informe seu nome." : "");
    if (n === "recebimento") return erro(n, !dados.recebimento ? "Escolha como prefere receber." : "");
    if (dados.recebimento !== "entrega" && (n === "cidade" || n === "endereco")) return erro(n, "");
    if (n === "cidade") return erro(n, !v ? "Selecione a cidade." : "");
    if (n === "endereco") return erro(n, v.length < 6 ? "Informe o endereço com rua, número e bairro." : "");
    if (n === "data") return erro(n, v && v < hojeISO() ? "Escolha uma data a partir de hoje." : "");
    return true;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, primeiro = null;
    ["nome", "recebimento", "cidade", "endereco", "data"].forEach(function (n) {
      if (!validarCampo(n)) { ok = false; if (!primeiro) primeiro = n; }
    });
    if (!ok) {
      var alvo = primeiro === "recebimento" ? form.querySelector('[name="recebimento"]') : form.elements[primeiro];
      if (alvo && alvo.focus) alvo.focus();
      return;
    }
    irPara(3);
  });

  /* ---------- revisão e mensagem ---------- */
  function mensagemPedido() {
    var c = calcular();
    var linhas = ["Olá! Gostaria de fazer um pedido na Casa Ivete.", "", "Meu pedido:"];
    pedido.forEach(function (i) {
      var p = produtosPorId[i.id];
      var l = "• " + p.nome + " — " + i.qtd;
      if (temPreco(p.preco)) l += " (" + brl(p.preco * i.qtd) + ")";
      var d = descricaoItem(i); if (d) l += "\n   " + d;
      linhas.push(l);
    });
    linhas.push("", "Subtotal: " + c.subtotalTexto.replace("A confirmar", "a confirmar"),
      (dados.recebimento === "retirada" ? "Entrega: retirada" : "Entrega: " + (c.taxaTexto === "A confirmar" ? "a confirmar" : c.taxaTexto)),
      "Total: " + (c.totalConhecido ? brl(c.total) : "a confirmar"), "",
      "Nome: " + (dados.nome || "").trim(),
      "Recebimento: " + (dados.recebimento === "retirada" ? "retirada" : "entrega"));
    if (dados.recebimento === "entrega") {
      linhas.push("Cidade: " + (dados.cidade === "Outra" ? "outra localidade (a confirmar)" : dados.cidade));
      linhas.push("Endereço: " + (dados.endereco || "").trim());
    }
    if (dados.data) linhas.push("Data desejada: " + dataBR(dados.data));
    if ((dados.obs || "").trim()) linhas.push("Observações: " + dados.obs.trim());
    linhas.push("", "Poderiam confirmar a disponibilidade e os detalhes do pedido, por favor?");
    return linhas.join("\n").replace(/\u00a0/g, " ");
  }

  function renderRevisao() {
    var c = calcular();
    var itens = pedido.map(function (i) {
      var p = produtosPorId[i.id];
      return "<li><span>" + esc(p.nome) + " × " + i.qtd + (descricaoItem(i) ? '<br><small class="item__meta">' + esc(descricaoItem(i)) + "</small>" : "") + "</span><span>" + (temPreco(p.preco) ? brl(p.preco * i.qtd) : "Sob consulta") + "</span></li>";
    }).join("");
    var receb = dados.recebimento === "retirada" ? "Retirada" : "Entrega · " + (dados.cidade === "Outra" ? "Outra localidade" : esc(dados.cidade)) + "<br>" + esc(dados.endereco);
    var msg = mensagemPedido();
    $("[data-revisao]").innerHTML =
      '<div class="revisao__bloco"><p class="revisao__titulo">Itens <button type="button" class="revisao__editar" data-ir="1">Editar</button></p><ul class="revisao__lista">' + itens + '</ul><dl class="totais" style="margin-top:.8rem">' + totaisHTML(c) + "</dl></div>" +
      '<div class="revisao__bloco"><p class="revisao__titulo">Seus dados <button type="button" class="revisao__editar" data-ir="2">Editar</button></p><p style="margin:0">' + esc(dados.nome) + "<br>" + receb +
      (dados.data ? "<br>Data desejada: " + dataBR(dados.data) : "") + (dados.obs ? "<br>Obs.: " + esc(dados.obs) : "") + "</p></div>" +
      '<div class="revisao__bloco"><p class="revisao__titulo">Mensagem que será enviada</p><pre class="revisao__mensagem">' + esc(msg) + "</pre></div>";
    $$("[data-ir]", dlgPedido).forEach(function (b) { b.addEventListener("click", function () { irPara(+b.getAttribute("data-ir")); }); });
    var url = whatsUrl(msg);
    $("[data-enviar]").href = url;
    $("[data-enviar-novamente]").href = url;
  }
  $("[data-enviar]").addEventListener("click", function () { setTimeout(function () { irPara(4); }, 300); });
  $("[data-limpar]").addEventListener("click", function () {
    pedido = []; salvar();
    dados.obs = ""; dados.data = ""; form.elements.obs.value = ""; form.elements.data.value = ""; gravar(CHAVE_DADOS, dados);
    renderPedido(); irPara(1);
  });

  renderPedido();

  /* ---------- conteúdo configurável ---------- */
  $("[data-essencia]").innerHTML = CFG.essencia.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

  function linhasInfo(el, pares) {
    pares = pares.filter(function (p) { return p[1]; });
    el.hidden = !pares.length;
    el.innerHTML = pares.map(function (p) { return "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(p[1]) + "</dd></div>"; }).join("");
    return pares.length;
  }
  linhasInfo($("[data-infos-encomenda]"), [
    ["Quantidade mínima", CFG.encomendas.quantidadeMinima],
    ["Antecedência", CFG.encomendas.antecedencia],
    ["Importante", CFG.encomendas.observacao]
  ]);
  var taxas = Object.keys(CFG.entrega.taxas || {}).filter(function (k) { return temPreco(CFG.entrega.taxas[k]); })
    .map(function (k) { return k + ": " + (CFG.entrega.taxas[k] === 0 ? "sem custo" : brl(CFG.entrega.taxas[k])); }).join(" · ");
  var nInfos = linhasInfo($("[data-infos-entrega]"), [
    ["Regiões atendidas", CFG.entrega.regioes],
    ["Taxas de entrega", taxas],
    ["Retirada", rec.retirada ? (rec.localRetirada || "Disponível — combine pelo WhatsApp") : ""],
    ["Horários", CFG.entrega.horarios],
    ["Prazo de encomendas", CFG.entrega.prazoEncomendas],
    ["Produtos do dia", CFG.entrega.disponibilidadeDiaria]
  ]);
  if (nInfos) $("[data-entrega-consulta]").textContent = "Ficou com alguma dúvida sobre o seu endereço? Fale com a gente.";

  $("[data-cidades]").innerHTML = CFG.cidades.map(function (c) {
    return '<li><span class="cidade__nome">' + esc(c) + '</span><span class="cidade__uf">SC</span></li>';
  }).join("");
  $("[data-rodape-cidades]").innerHTML = CFG.cidades.map(function (c) { return "<li><span>" + esc(c) + " – SC</span></li>"; }).join("");
  $("[data-whats-numero]").textContent = CFG.contato.whatsappExibicao;
  if (CFG.contato.instagram) {
    var li = document.createElement("li");
    li.innerHTML = '<a href="' + esc(CFG.contato.instagram) + '" target="_blank" rel="noopener">Instagram' + (CFG.contato.instagramUsuario ? " " + esc(CFG.contato.instagramUsuario) : "") + "</a>";
    $("[data-rodape-contato]").appendChild(li);
  }
  $("[data-ano]").textContent = new Date().getFullYear();

  /* ---------- perguntas frequentes ---------- */
  var w = function (txt, msg) { return '<a href="' + whatsUrl(msg || MENSAGENS.geral) + '" target="_blank" rel="noopener">' + txt + "</a>"; };
  var faq = [
    ["Como faço meu pedido?", "Escolha os produtos no cardápio, adicione ao pedido e informe seus dados. O site abre o WhatsApp com a mensagem pronta; depois de enviada, a equipe da Casa Ivete confirma disponibilidade, valores e entrega."],
    ["Vocês entregam na minha cidade?", "Atendemos " + CFG.cidades.join(" e ") + ". Para confirmar o seu endereço, " + w("fale com a gente pelo WhatsApp", MENSAGENS.entrega) + "."],
    ["Posso fazer encomendas?", "Sim. Conte a ocasião, a data e a quantidade aproximada e " + w("consulte as opções de encomenda", MENSAGENS.encomenda) + "." +
      (CFG.encomendas.antecedencia ? " Antecedência: " + esc(CFG.encomendas.antecedencia) + "." : "")],
    ["Como consulto os preços e a disponibilidade?", CAT.produtos.some(function (p) { return temPreco(p.preco); })
      ? "Os valores cadastrados aparecem no cardápio. A disponibilidade do dia é confirmada pelo atendimento no WhatsApp."
      : "Os valores e a disponibilidade do dia são informados pelo atendimento. " + w("Pergunte pelo WhatsApp", MENSAGENS.geral) + "."],
    ["Quais são as formas de pagamento?", CFG.pagamento.length
      ? "Aceitamos: " + CFG.pagamento.map(esc).join(", ") + ". O pagamento é combinado no atendimento; o site não cobra nenhum valor."
      : "As formas de pagamento são informadas no atendimento pelo WhatsApp. O site não realiza cobranças."],
    ["Posso retirar meu pedido?", rec.retirada
      ? "Sim. " + (rec.localRetirada ? "Local de retirada: " + esc(rec.localRetirada) + "." : "O local é informado no atendimento.")
      : w("Consulte a possibilidade de retirada pelo WhatsApp", "Olá! Gostaria de saber se é possível retirar meu pedido na Casa Ivete.") + "."]
  ];
  $("[data-faq]").innerHTML = faq.map(function (f) {
    return '<details class="pergunta"><summary>' + esc(f[0]) + '</summary><div class="pergunta__resposta"><p>' + f[1] + "</p></div></details>";
  }).join("");

  /* ---------- navegação ativa e revelação ---------- */
  if ("IntersectionObserver" in window) {
    var links = $$(".nav__lista a");
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + en.target.id)); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["inicio", "cardapio", "essencia", "entregas", "contato"].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

    var rev = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visivel"); rev.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    $$("[data-revelar]").forEach(function (el, i) { el.style.transitionDelay = (el.closest(".hero") ? i * 70 : 0) + "ms"; rev.observe(el); });
  } else {
    $$("[data-revelar]").forEach(function (el) { el.classList.add("is-visivel"); });
  }
})();
