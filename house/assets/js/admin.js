/* =========================================================================
   House Hamburgueria 66 · painel do proprietário
   ========================================================================= */
(function () {
  "use strict";
  var S = window.HouseStore, A = S.Admin, U = S.util, fmt = U.fmt, esc = U.esc;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var dados = { loja: {}, categorias: [], produtos: [], promocoes: [] };
  var pedidos = [];
  var aba = "pedidos";
  var filtroPedido = "todos", filtroCat = "", busca = "";
  var conteudo = $("[data-conteudo]");

  var STATUS = [
    ["novo", "Novo"], ["preparo", "Em preparo"], ["saiu", "Saiu p/ entrega"], ["concluido", "Concluído"], ["cancelado", "Cancelado"]
  ];
  var DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // ------------------------------------------------------------ utilidades
  var tt;
  function toast(msg, ruim) {
    var t = $("[data-toast]");
    t.textContent = msg; t.classList.toggle("ruim", !!ruim); t.classList.add("ver");
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("ver"); }, ruim ? 4200 : 2400);
  }
  function falha(e) { toast(e && e.message ? e.message : "Algo deu errado. Tente de novo.", true); }
  function lerPreco(v) {
    v = String(v == null ? "" : v).trim().replace(/[R$\s]/g, "");
    if (!v) return null;
    if (v.indexOf(",") > -1) v = v.replace(/\./g, "").replace(",", ".");
    var n = Number(v);
    return isFinite(n) && n >= 0 ? U.r2(n) : NaN;
  }
  function precoCampo(n) { return n == null ? "" : String(n.toFixed(2)).replace(".", ","); }
  function nomeCat(id) { var c = dados.categorias.filter(function (x) { return x.id === id; })[0]; return c ? c.nome : "Sem categoria"; }
  function fone(n) {
    var d = String(n || "").replace(/\D/g, "");
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return n || "";
  }
  function quando(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var hoje = new Date();
    var h = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return d.toDateString() === hoje.toDateString() ? "Hoje, " + h : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ", " + h;
  }
  function fotoMini(src) {
    return src ? '<img class="linha__foto" src="' + esc(src) + '" alt="" loading="lazy">' : '<span class="linha__foto">Sem foto</span>';
  }
  // Excluir pede um segundo toque (o navegador do painel pode bloquear confirm()).
  function confirmarDuplo(botao, acao) {
    if (botao.classList.contains("confirmar")) { acao(); return; }
    var txt = botao.textContent;
    botao.classList.add("confirmar");
    botao.textContent = "Toque de novo para excluir";
    setTimeout(function () { botao.classList.remove("confirmar"); botao.textContent = txt; }, 4000);
  }

  // ------------------------------------------------------------ acesso
  function mostrar(logado) {
    $("[data-tela-login]").hidden = logado;
    $("[data-tela-app]").hidden = !logado;
  }
  function iniciarLogin() {
    var demo = S.modo === "demo";
    $("[data-campo-email]").hidden = demo;
    var d = $("[data-login-demo]");
    d.hidden = !demo;
    if (demo) d.innerHTML = "<strong>Modo demonstração.</strong> O banco de dados ainda não foi conectado, então tudo fica salvo só neste navegador. Senha: <strong>" + esc(S.senhaDemo) + "</strong>";
    mostrar(false);
    setTimeout(function () { (demo ? $("#login-senha") : $("#login-email")).focus(); }, 50);
  }
  $("[data-form-login]").addEventListener("submit", function (e) {
    e.preventDefault();
    var erro = $("[data-login-erro]");
    erro.textContent = "";
    var email = $("#login-email").value.trim(), senha = $("#login-senha").value;
    if (S.modo !== "demo" && !email) { erro.textContent = "Informe o e-mail."; return; }
    if (!senha) { erro.textContent = "Informe a senha."; return; }
    var b = this.querySelector('button[type="submit"]');
    b.disabled = true; b.textContent = "Entrando…";
    A.entrar(email, senha).then(function () { $("#login-senha").value = ""; abrirApp(); })
      .catch(function (err) { erro.textContent = err.message; })
      .then(function () { b.disabled = false; b.textContent = "Entrar"; });
  });
  $("[data-sair]").addEventListener("click", function () { A.sair().then(iniciarLogin); });

  function abrirApp() {
    mostrar(true);
    var m = $("[data-modo]");
    m.textContent = S.modo === "demo" ? "Demonstração" : "No ar";
    m.classList.toggle("ao-vivo", S.modo !== "demo");
    recarregar().then(function () { trocarAba(aba); });
  }

  function recarregar() {
    return Promise.all([A.tudo(), A.pedidos()]).then(function (r) {
      dados = r[0]; pedidos = r[1];
      atualizarBolha();
    }).catch(falha);
  }

  // ------------------------------------------------------------ abas
  function trocarAba(nova) {
    aba = nova;
    $$("[data-aba]").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-aba") === nova)); });
    render();
    window.scrollTo(0, 0);
  }
  $$("[data-aba]").forEach(function (b) { b.addEventListener("click", function () { trocarAba(b.getAttribute("data-aba")); }); });
  function render() {
    ({ pedidos: renderPedidos, produtos: renderProdutos, categorias: renderCategorias, promocoes: renderPromocoes, loja: renderLoja })[aba]();
  }

  // ------------------------------------------------------------ pedidos
  function atualizarBolha() {
    var n = pedidos.filter(function (p) { return p.status === "novo"; }).length;
    var b = $("[data-bolha-novos]");
    b.hidden = !n; b.textContent = n;
  }
  function renderPedidos() {
    var lista = filtroPedido === "todos" ? pedidos : pedidos.filter(function (p) { return p.status === filtroPedido; });
    var cont = function (s) { return pedidos.filter(function (p) { return p.status === s; }).length; };
    conteudo.innerHTML =
      '<div class="cab"><div><h1>Pedidos</h1><p>Pedidos enviados pelo site. Confirme cada um no WhatsApp com o cliente.</p></div>' +
      '<div class="cab__acoes"><button type="button" class="btn btn--contorno" data-atualizar>Atualizar</button></div></div>' +
      '<div class="filtros" role="group" aria-label="Filtrar pedidos">' +
      [["todos", "Todos (" + pedidos.length + ")"]].concat(STATUS.map(function (s) { return [s[0], s[1] + " (" + cont(s[0]) + ")"]; })).map(function (f) {
        return '<button type="button" data-filtro="' + f[0] + '" aria-pressed="' + (filtroPedido === f[0]) + '">' + f[1] + "</button>";
      }).join("") + "</div>" +
      (lista.length ? '<div class="lista">' + lista.map(pedidoHTML).join("") + "</div>"
        : '<div class="vazio"><strong>Nenhum pedido aqui.</strong>Quando um cliente finalizar pelo site, o pedido aparece nesta tela.</div>');
  }
  function pedidoHTML(p) {
    var st = STATUS.filter(function (s) { return s[0] === p.status; })[0] || STATUS[0];
    var entrega = p.modalidade === "entrega";
    var itens = (p.itens || []).map(function (i) {
      var det = (i.opcoes || []).map(function (o) { return o.grupo + ": " + o.item; });
      if (i.obs) det.push("Obs.: " + i.obs);
      return "<li><span><strong>" + i.qtd + "x " + esc(i.nome) + "</strong>" + (det.length ? "<small>" + esc(det.join(" · ")) + "</small>" : "") + "</span><b>" + fmt(i.total) + "</b></li>";
    }).join("");
    var tel = String(p.cliente.telefone || "").replace(/\D/g, "");
    var wl = tel ? "https://wa.me/" + (tel.length <= 11 ? "55" : "") + tel + "?text=" + encodeURIComponent("Olá, " + p.cliente.nome + "! Aqui é da House Hamburgueria 66, sobre o pedido #" + p.numero + ".") : "";
    return '<details class="pedido' + (p.status === "novo" ? " novo" : "") + '">' +
      '<summary><span class="pedido__num">#' + p.numero + '</span><span class="pedido__quem"><strong>' + esc(p.cliente.nome) + "</strong><span>" + quando(p.criadoEm) + " · " + (entrega ? "Entrega" : "Retirada") + "</span></span>" +
      '<span class="pedido__total">' + fmt(p.total) + (entrega && p.taxa == null ? "<br><small>+ entrega</small>" : "") + '<br><span class="etq etq--' + st[0] + '">' + st[1] + "</span></span></summary>" +
      '<div class="pedido__corpo"><ul class="pedido__itens">' + itens + "</ul>" +
      '<div class="pedido__dados"><span><b>Subtotal:</b> ' + fmt(p.subtotal) + (entrega ? " · <b>Entrega:</b> " + (p.taxa == null ? "a combinar" : fmt(p.taxa)) : "") + "</span>" +
      "<span><b>Telefone:</b> " + esc(fone(p.cliente.telefone)) + "</span>" +
      (entrega ? "<span><b>Endereço:</b> " + esc(p.endereco.rua) + " · " + esc(p.endereco.bairro) + (p.endereco.referencia ? " · Ref.: " + esc(p.endereco.referencia) : "") + "</span>" : "") +
      (p.pagamento ? "<span><b>Pagamento:</b> " + esc(p.pagamento) + "</span>" : "") +
      (p.observacoes ? "<span><b>Observações:</b> " + esc(p.observacoes) + "</span>" : "") + "</div>" +
      '<div class="pedido__acoes"><label class="rotulo" for="st-' + esc(p.id) + '">Situação</label><select id="st-' + esc(p.id) + '" data-status="' + esc(p.id) + '">' +
      STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === p.status ? " selected" : "") + ">" + s[1] + "</option>"; }).join("") + "</select>" +
      (wl ? '<a class="btn btn--contorno" href="' + esc(wl) + '" target="_blank" rel="noopener">Chamar cliente no WhatsApp</a>' : "") + "</div></div></details>";
  }

  // ------------------------------------------------------------ produtos
  function renderProdutos() {
    var termo = busca.toLowerCase();
    var lista = dados.produtos.filter(function (p) {
      return (!filtroCat || p.categoria === filtroCat) && (!termo || p.nome.toLowerCase().indexOf(termo) > -1);
    });
    var cats = dados.categorias.concat([{ id: null, nome: "Sem categoria" }]);
    var corpo = cats.map(function (c) {
      var itens = lista.filter(function (p) { return c.id ? p.categoria === c.id : !dados.categorias.some(function (x) { return x.id === p.categoria; }); });
      if (!itens.length) return "";
      return '<h2 class="grupo-cat">' + esc(c.nome) + '</h2><ul class="lista">' + itens.map(function (p) {
        return '<li class="linha' + (p.ativo ? "" : " inativo") + '">' + fotoMini(p.foto) +
          '<div class="linha__info"><strong>' + esc(p.nome) + "</strong><span>" +
          (p.preco == null ? "Consultar valor" : (p.aPartirDe ? "a partir de " : "") + fmt(p.preco)) +
          ((p.opcoes || []).length ? " · " + p.opcoes.length + (p.opcoes.length === 1 ? " grupo de opções" : " grupos de opções") : "") +
          (p.destaque ? " · Destaque" : "") + "</span></div>" +
          '<label class="chave" title="Mostrar no site"><input type="checkbox" data-ativo-produto="' + esc(p.id) + '"' + (p.ativo ? " checked" : "") + '><i></i><span class="sr-only">Mostrar no site</span></label>' +
          '<button type="button" class="btn btn--contorno mini" data-editar-produto="' + esc(p.id) + '">Editar</button></li>';
      }).join("") + "</ul>";
    }).join("");
    conteudo.innerHTML =
      '<div class="cab"><div><h1>Cardápio</h1><p>Produtos, preços, fotos e opções. A chave verde mostra o produto no site.</p></div>' +
      '<div class="cab__acoes"><button type="button" class="btn btn--vermelho" data-novo-produto>+ Novo produto</button></div></div>' +
      '<div class="filtros"><label class="sr-only" for="busca">Buscar</label><input id="busca" type="search" placeholder="Buscar produto" value="' + esc(busca) + '" data-busca>' +
      '<label class="sr-only" for="fcat">Categoria</label><select id="fcat" data-filtro-cat><option value="">Todas as categorias</option>' +
      dados.categorias.map(function (c) { return '<option value="' + esc(c.id) + '"' + (filtroCat === c.id ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</select></div>" +
      (corpo || '<div class="vazio"><strong>Nenhum produto encontrado.</strong>Toque em “Novo produto” para cadastrar o primeiro.</div>');
  }

  // editor genérico
  var editor = $("[data-editor]");
  var edForm = $("[data-form-editor]");
  var edSalvar = null;
  function abrirEditor(titulo, corpoHTML, rodapeHTML, aoSalvar) {
    $("[data-editor-titulo]").textContent = titulo;
    $("[data-editor-corpo]").innerHTML = corpoHTML;
    $("[data-editor-rodape]").innerHTML = rodapeHTML;
    edSalvar = aoSalvar;
    if (typeof editor.showModal === "function") editor.showModal(); else editor.setAttribute("open", "");
    $("[data-editor-corpo]").scrollTop = 0;
  }
  function fecharEditor() { if (editor.open) { if (editor.close) editor.close(); else editor.removeAttribute("open"); } }
  $("[data-fechar-editor]").addEventListener("click", fecharEditor);
  editor.addEventListener("click", function (e) { if (e.target === editor) fecharEditor(); });
  edForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!edSalvar) return;
    var b = edForm.querySelector("[data-salvar]");
    if (b) { b.disabled = true; b.textContent = "Salvando…"; }
    Promise.resolve().then(edSalvar).then(function (ok) {
      if (ok === false) return;
      return recarregar().then(function () { fecharEditor(); render(); toast("Salvo. O site já mostra a alteração."); });
    }).catch(falha).then(function () { if (b) { b.disabled = false; b.textContent = "Salvar"; } });
  });
  function campoErro(nome, msg) {
    var p = edForm.querySelector('[data-erro-campo="' + nome + '"]');
    if (p) p.textContent = msg;
    var el = edForm.querySelector('[name="' + nome + '"]');
    if (el) { el.focus(); }
    return false;
  }

  // foto: envio e prévia
  var edFoto = "";
  function fotoCampoHTML(src) {
    edFoto = src || "";
    return '<div class="campo"><span class="rotulo">Foto</span><div class="foto-edit">' + previaHTML(edFoto) +
      '<div class="foto-edit__acoes"><label class="btn btn--contorno" for="ed-arquivo">' + (edFoto ? "Trocar foto" : "Enviar foto") + "</label>" +
      '<input id="ed-arquivo" type="file" accept="image/*" data-arquivo>' +
      '<button type="button" class="btn btn--perigo" data-remover-foto' + (edFoto ? "" : " hidden") + ">Remover</button></div></div>" +
      '<p class="dica">Use fotos reais do produto, de preferência na horizontal. O site reduz o tamanho automaticamente.</p></div>';
  }
  function previaHTML(src) {
    return src ? '<img class="foto-edit__previa" data-previa src="' + esc(src) + '" alt="Prévia da foto">' : '<span class="foto-edit__previa" data-previa>Sem foto</span>';
  }
  editor.addEventListener("change", function (e) {
    if (!e.target.matches("[data-arquivo]")) return;
    var arq = e.target.files && e.target.files[0];
    if (!arq) return;
    var rot = editor.querySelector('label[for="ed-arquivo"]');
    rot.textContent = "Enviando…";
    A.enviarFoto(arq).then(function (url) {
      edFoto = url;
      editor.querySelector("[data-previa]").outerHTML = previaHTML(url);
      editor.querySelector("[data-remover-foto]").hidden = false;
      rot.textContent = "Trocar foto";
    }).catch(function (err) { rot.textContent = edFoto ? "Trocar foto" : "Enviar foto"; falha(err); });
    e.target.value = "";
  });
  editor.addEventListener("click", function (e) {
    if (e.target.closest("[data-remover-foto]")) {
      edFoto = "";
      editor.querySelector("[data-previa]").outerHTML = previaHTML("");
      e.target.closest("[data-remover-foto]").hidden = true;
      editor.querySelector('label[for="ed-arquivo"]').textContent = "Enviar foto";
    }
  });

  // opções do produto (tamanhos, adicionais, acompanhamentos)
  var edOpcoes = [];
  function opcoesHTML() {
    return edOpcoes.map(function (g, gi) {
      return '<div class="opc-grupo" data-g="' + gi + '"><div class="opc-grupo__cab">' +
        '<div class="campo"><label for="g-nome-' + gi + '">Nome do grupo</label><input id="g-nome-' + gi + '" data-gk="nome" value="' + esc(g.nome) + '" placeholder="Ex.: Tamanho, Adicionais, Acompanhamento"></div>' +
        '<div class="campo"><label for="g-tipo-' + gi + '">Cliente escolhe</label><select id="g-tipo-' + gi + '" data-gk="tipo"><option value="uma"' + (g.tipo === "uma" ? " selected" : "") + '>Só uma opção</option><option value="varias"' + (g.tipo !== "uma" ? " selected" : "") + ">Várias opções</option></select></div>" +
        '<button type="button" class="btn btn--perigo mini" data-remover-grupo>Remover grupo</button></div>' +
        '<label class="marcar"><input type="checkbox" data-gk="obrigatorio"' + (g.obrigatorio ? " checked" : "") + "> Escolha obrigatória</label>" +
        (g.tipo !== "uma" ? '<div class="campo"><label for="g-max-' + gi + '">Máximo de escolhas (vazio = sem limite)</label><input id="g-max-' + gi + '" data-gk="max" inputmode="numeric" value="' + (g.max || "") + '"></div>' : "") +
        '<span class="rotulo">Opções e acréscimo no preço</span>' +
        (g.itens || []).map(function (it, ii) {
          return '<div class="opc-item" data-i="' + ii + '"><input aria-label="Nome da opção" data-ik="nome" value="' + esc(it.nome) + '" placeholder="Ex.: Bacon extra">' +
            '<input aria-label="Acréscimo em reais" data-ik="preco" inputmode="decimal" value="' + (it.preco ? precoCampo(Number(it.preco)) : "") + '" placeholder="+ R$ 0,00">' +
            '<button type="button" class="x" data-remover-item aria-label="Remover opção">×</button></div>';
        }).join("") +
        '<button type="button" class="btn btn--contorno mini" data-novo-item>+ Opção</button></div>';
    }).join("");
  }
  function redesenharOpcoes() { var box = editor.querySelector("[data-opcoes]"); if (box) box.innerHTML = opcoesHTML(); }
  editor.addEventListener("input", function (e) {
    var g = e.target.closest("[data-g]");
    if (!g) return;
    var gi = Number(g.getAttribute("data-g"));
    if (e.target.hasAttribute("data-gk")) {
      var k = e.target.getAttribute("data-gk");
      if (k === "obrigatorio") edOpcoes[gi].obrigatorio = e.target.checked;
      else if (k === "max") edOpcoes[gi].max = parseInt(e.target.value, 10) || 0;
      else edOpcoes[gi][k] = e.target.value;
      if (k === "tipo") redesenharOpcoes();
    }
    var it = e.target.closest("[data-i]");
    if (it && e.target.hasAttribute("data-ik")) {
      var item = edOpcoes[gi].itens[Number(it.getAttribute("data-i"))];
      item[e.target.getAttribute("data-ik")] = e.target.value;
    }
  });
  editor.addEventListener("click", function (e) {
    var g = e.target.closest("[data-g]");
    if (e.target.closest("[data-novo-grupo]")) { edOpcoes.push({ nome: "", tipo: "varias", obrigatorio: false, max: 0, itens: [{ nome: "", preco: "" }] }); redesenharOpcoes(); return; }
    if (!g) return;
    var gi = Number(g.getAttribute("data-g"));
    if (e.target.closest("[data-remover-grupo]")) { edOpcoes.splice(gi, 1); redesenharOpcoes(); }
    else if (e.target.closest("[data-novo-item]")) { edOpcoes[gi].itens.push({ nome: "", preco: "" }); redesenharOpcoes(); var ins = $$('[data-g="' + gi + '"] [data-ik="nome"]', editor); ins[ins.length - 1].focus(); }
    else if (e.target.closest("[data-remover-item]")) { edOpcoes[gi].itens.splice(Number(e.target.closest("[data-i]").getAttribute("data-i")), 1); redesenharOpcoes(); }
  });
  function opcoesLimpas() {
    var saida = [];
    for (var i = 0; i < edOpcoes.length; i++) {
      var g = edOpcoes[i];
      var nome = String(g.nome || "").trim();
      var itens = (g.itens || []).filter(function (it) { return String(it.nome || "").trim(); }).map(function (it) {
        return { nome: String(it.nome).trim(), preco: it.preco === "" || it.preco == null ? 0 : lerPreco(it.preco) };
      });
      if (!nome && !itens.length) continue;
      if (!nome) throw new Error("Dê um nome ao grupo de opções " + (i + 1) + ".");
      if (!itens.length) throw new Error("O grupo “" + nome + "” precisa de pelo menos uma opção.");
      if (itens.some(function (it) { return it.preco == null || isNaN(it.preco); })) throw new Error("Confira os valores das opções em “" + nome + "”.");
      var nomes = itens.map(function (it) { return it.nome.toLowerCase(); });
      if (nomes.some(function (n, k) { return nomes.indexOf(n) !== k; })) throw new Error("Há opções repetidas em “" + nome + "”.");
      saida.push({ nome: nome, tipo: g.tipo === "uma" ? "uma" : "varias", obrigatorio: !!g.obrigatorio, max: g.tipo === "uma" ? 1 : (Number(g.max) || 0), itens: itens });
    }
    var nomesG = saida.map(function (g) { return g.nome.toLowerCase(); });
    if (nomesG.some(function (n, k) { return nomesG.indexOf(n) !== k; })) throw new Error("Há dois grupos de opções com o mesmo nome.");
    return saida;
  }

  function editarProduto(p) {
    var novo = !p;
    p = p ? U.clone(p) : { nome: "", categoria: filtroCat || (dados.categorias[0] && dados.categorias[0].id) || "", descricao: "", preco: null, aPartirDe: false, selo: "", destaque: false, ativo: true, ordem: dados.produtos.length + 1, opcoes: [] };
    edOpcoes = U.clone(p.opcoes || []).map(function (g) { g.itens = (g.itens || []).map(function (it) { return { nome: it.nome, preco: it.preco }; }); return g; });
    var corpo = fotoCampoHTML(p.foto) +
      '<div class="campo"><label for="ed-nome">Nome</label><input id="ed-nome" name="nome" maxlength="80" value="' + esc(p.nome) + '" required><p class="erro" data-erro-campo="nome"></p></div>' +
      '<div class="duas"><div class="campo"><label for="ed-cat">Categoria</label><select id="ed-cat" name="categoria">' +
      dados.categorias.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === p.categoria ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</select></div>" +
      '<div class="campo"><label for="ed-preco">Preço (R$)</label><input id="ed-preco" name="preco" inputmode="decimal" value="' + precoCampo(p.preco) + '" placeholder="Ex.: 94,99"><p class="dica">Vazio = aparece “Consultar valor” e o cliente pergunta no WhatsApp.</p><p class="erro" data-erro-campo="preco"></p></div></div>' +
      '<label class="marcar"><input type="checkbox" name="aPartirDe"' + (p.aPartirDe ? " checked" : "") + '> Mostrar “a partir de” antes do preço</label>' +
      '<div class="campo"><label for="ed-desc">Descrição</label><textarea id="ed-desc" name="descricao" rows="3" maxlength="300" placeholder="Ingredientes e o que acompanha">' + esc(p.descricao) + "</textarea></div>" +
      '<div class="duas"><div class="campo"><label for="ed-selo">Etiqueta na foto (opcional)</label><input id="ed-selo" name="selo" maxlength="24" value="' + esc(p.selo) + '" placeholder="Ex.: Novo, Mais pedido"></div>' +
      '<div class="campo"><label for="ed-ordem">Posição na categoria</label><input id="ed-ordem" name="ordem" inputmode="numeric" value="' + (p.ordem || 0) + '"></div></div>' +
      '<label class="marcar"><input type="checkbox" name="destaque"' + (p.destaque ? " checked" : "") + "> Destaque (pode aparecer no topo do site)</label>" +
      '<label class="marcar"><input type="checkbox" name="ativo"' + (p.ativo !== false ? " checked" : "") + "> Mostrar no site</label>" +
      '<div class="campo"><span class="rotulo">Opções do produto</span><p class="dica">Tamanhos, adicionais e acompanhamentos. O valor da opção soma ao preço.</p><div class="lista" data-opcoes></div>' +
      '<button type="button" class="btn btn--contorno" data-novo-grupo>+ Grupo de opções</button></div>';
    var rodape = (novo ? "" : '<button type="button" class="btn btn--perigo" data-excluir>Excluir produto</button>') +
      '<div class="direita"><button type="button" class="btn btn--contorno" data-cancelar>Cancelar</button><button type="submit" class="btn btn--vermelho" data-salvar>Salvar</button></div>';
    abrirEditor(novo ? "Novo produto" : "Editar produto", corpo, rodape, function () {
      var f = edForm.elements;
      $$("[data-erro-campo]", edForm).forEach(function (x) { x.textContent = ""; });
      var nome = f.nome.value.trim();
      if (!nome) return campoErro("nome", "Informe o nome do produto.");
      var preco = lerPreco(f.preco.value);
      if (isNaN(preco)) return campoErro("preco", "Use só números, ex.: 94,99.");
      var opcoes = opcoesLimpas();
      return A.salvarProduto({
        id: p.id, nome: nome, categoria: f.categoria.value, descricao: f.descricao.value.trim(), preco: preco,
        aPartirDe: f.aPartirDe.checked, foto: edFoto, selo: f.selo.value.trim(), destaque: f.destaque.checked,
        ativo: f.ativo.checked, ordem: parseInt(f.ordem.value, 10) || 0, opcoes: opcoes
      });
    });
    redesenharOpcoes();
    var ex = editor.querySelector("[data-excluir]");
    if (ex) ex.addEventListener("click", function () {
      confirmarDuplo(ex, function () {
        A.excluirProduto(p.id).then(recarregar).then(function () { fecharEditor(); render(); toast("Produto excluído."); }).catch(falha);
      });
    });
    editor.querySelector("[data-cancelar]").addEventListener("click", fecharEditor);
  }

  // ------------------------------------------------------------ promoções
  function renderPromocoes() {
    conteudo.innerHTML =
      '<div class="cab"><div><h1>Promoções</h1><p>Aparecem na faixa vermelha de promoções do site. Desligue a chave para tirar do ar.</p></div>' +
      '<div class="cab__acoes"><button type="button" class="btn btn--vermelho" data-nova-promo>+ Nova promoção</button></div></div>' +
      (dados.promocoes.length ? '<ul class="lista">' + dados.promocoes.map(function (p) {
        return '<li class="linha' + (p.ativo ? "" : " inativo") + '">' + fotoMini(p.foto) +
          '<div class="linha__info"><strong>' + esc(p.titulo) + "</strong><span>" + (p.preco == null ? "Sem preço" : (p.aPartirDe ? "a partir de " : "") + fmt(p.preco)) + "</span></div>" +
          '<label class="chave" title="Mostrar no site"><input type="checkbox" data-ativo-promo="' + esc(p.id) + '"' + (p.ativo ? " checked" : "") + "><i></i></label>" +
          '<button type="button" class="btn btn--contorno mini" data-editar-promo="' + esc(p.id) + '">Editar</button></li>';
      }).join("") + "</ul>" : '<div class="vazio"><strong>Nenhuma promoção cadastrada.</strong>Sem promoções ativas, a seção some do site.</div>');
  }
  function editarPromo(p) {
    var novo = !p;
    p = p ? U.clone(p) : { titulo: "", texto: "", preco: null, aPartirDe: false, produtoId: "", selo: "", ativo: true, ordem: dados.promocoes.length + 1 };
    var corpo = fotoCampoHTML(p.foto) +
      '<div class="campo"><label for="pr-titulo">Título</label><input id="pr-titulo" name="titulo" maxlength="60" value="' + esc(p.titulo) + '"><p class="erro" data-erro-campo="titulo"></p></div>' +
      '<div class="campo"><label for="pr-texto">Texto</label><textarea id="pr-texto" name="texto" rows="3" maxlength="240">' + esc(p.texto) + "</textarea></div>" +
      '<div class="duas"><div class="campo"><label for="pr-preco">Preço (R$, opcional)</label><input id="pr-preco" name="preco" inputmode="decimal" value="' + precoCampo(p.preco) + '"><p class="erro" data-erro-campo="preco"></p></div>' +
      '<div class="campo"><label for="pr-selo">Etiqueta (opcional)</label><input id="pr-selo" name="selo" maxlength="24" value="' + esc(p.selo) + '" placeholder="Ex.: Só hoje"></div></div>' +
      '<label class="marcar"><input type="checkbox" name="aPartirDe"' + (p.aPartirDe ? " checked" : "") + "> Mostrar “a partir de”</label>" +
      '<div class="campo"><label for="pr-prod">Produto que o botão abre</label><select id="pr-prod" name="produtoId"><option value="">Nenhum (botão leva ao WhatsApp)</option>' +
      dados.produtos.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === p.produtoId ? " selected" : "") + ">" + esc(x.nome) + "</option>"; }).join("") + "</select></div>" +
      '<div class="duas"><div class="campo"><label for="pr-ordem">Posição</label><input id="pr-ordem" name="ordem" inputmode="numeric" value="' + (p.ordem || 0) + '"></div>' +
      '<label class="marcar"><input type="checkbox" name="ativo"' + (p.ativo !== false ? " checked" : "") + "> Mostrar no site</label></div>";
    var rodape = (novo ? "" : '<button type="button" class="btn btn--perigo" data-excluir>Excluir promoção</button>') +
      '<div class="direita"><button type="button" class="btn btn--contorno" data-cancelar>Cancelar</button><button type="submit" class="btn btn--vermelho" data-salvar>Salvar</button></div>';
    abrirEditor(novo ? "Nova promoção" : "Editar promoção", corpo, rodape, function () {
      var f = edForm.elements;
      $$("[data-erro-campo]", edForm).forEach(function (x) { x.textContent = ""; });
      var titulo = f.titulo.value.trim();
      if (!titulo) return campoErro("titulo", "Informe o título.");
      var preco = lerPreco(f.preco.value);
      if (isNaN(preco)) return campoErro("preco", "Use só números, ex.: 94,99.");
      return A.salvarPromocao({ id: p.id, titulo: titulo, texto: f.texto.value.trim(), preco: preco, aPartirDe: f.aPartirDe.checked,
        foto: edFoto, produtoId: f.produtoId.value, selo: f.selo.value.trim(), ativo: f.ativo.checked, ordem: parseInt(f.ordem.value, 10) || 0 });
    });
    var ex = editor.querySelector("[data-excluir]");
    if (ex) ex.addEventListener("click", function () {
      confirmarDuplo(ex, function () {
        A.excluirPromocao(p.id).then(recarregar).then(function () { fecharEditor(); render(); toast("Promoção excluída."); }).catch(falha);
      });
    });
    editor.querySelector("[data-cancelar]").addEventListener("click", fecharEditor);
  }

  // ------------------------------------------------------------ categorias
  function renderCategorias() {
    conteudo.innerHTML =
      '<div class="cab"><div><h1>Categorias</h1><p>Viram os filtros do cardápio. A posição define a ordem no site.</p></div></div>' +
      '<form class="secao-form" data-nova-cat novalidate><h2>Nova categoria</h2><div class="duas"><div class="campo"><label for="nc-nome">Nome</label><input id="nc-nome" name="nome" maxlength="40" placeholder="Ex.: Combos"></div>' +
      '<div class="campo"><span class="rotulo">&nbsp;</span><button type="submit" class="btn btn--vermelho">Criar categoria</button></div></div><p class="erro" data-erro-nova-cat></p></form>' +
      '<ul class="lista">' + dados.categorias.map(function (c) {
        var n = dados.produtos.filter(function (p) { return p.categoria === c.id; }).length;
        return '<li class="cat-linha" data-cat="' + esc(c.id) + '">' +
          '<label title="Trocar foto da categoria" style="cursor:pointer">' + (c.foto ? '<img class="cat-foto" src="' + esc(c.foto) + '" alt="">' : '<span class="cat-foto" style="display:block"></span>') +
          '<input type="file" accept="image/*" data-cat-foto class="sr-only"></label>' +
          '<div class="campos"><div class="campo"><label for="cn-' + esc(c.id) + '">Nome · ' + n + (n === 1 ? " produto" : " produtos") + '</label><input id="cn-' + esc(c.id) + '" data-k="nome" value="' + esc(c.nome) + '"></div>' +
          '<div class="campo"><label for="co-' + esc(c.id) + '">Posição</label><input id="co-' + esc(c.id) + '" data-k="ordem" inputmode="numeric" value="' + (c.ordem || 0) + '"></div>' +
          '<div class="campo"><label for="ce-' + esc(c.id) + '">Visual</label><select id="ce-' + esc(c.id) + '" data-k="estilo"><option value="normal"' + (c.estilo !== "destaque" ? " selected" : "") + '>Cards normais</option><option value="destaque"' + (c.estilo === "destaque" ? " selected" : "") + ">Fotos grandes</option></select></div></div>" +
          '<div class="acoes"><label class="chave"><input type="checkbox" data-k="ativo"' + (c.ativo ? " checked" : "") + "><i></i>No site</label>" +
          '<button type="button" class="btn btn--preto mini" data-salvar-cat>Salvar</button><button type="button" class="btn btn--perigo mini" data-excluir-cat>Excluir</button></div></li>';
      }).join("") + "</ul>";
  }
  function salvarCat(li, extra) {
    var id = li.getAttribute("data-cat");
    var c = U.clone(dados.categorias.filter(function (x) { return x.id === id; })[0]);
    var nome = li.querySelector('[data-k="nome"]').value.trim();
    if (!nome) { toast("O nome da categoria não pode ficar vazio.", true); return Promise.resolve(); }
    c.nome = nome;
    c.ordem = parseInt(li.querySelector('[data-k="ordem"]').value, 10) || 0;
    c.estilo = li.querySelector('[data-k="estilo"]').value;
    c.ativo = li.querySelector('[data-k="ativo"]').checked;
    Object.assign(c, extra || {});
    return A.salvarCategoria(c, false).then(recarregar).then(function () { render(); toast("Categoria salva."); }).catch(falha);
  }

  // ------------------------------------------------------------ loja
  function renderLoja() {
    var l = dados.loja, h = l.horario || {};
    var dias = h.dias || [];
    conteudo.innerHTML =
      '<div class="cab"><div><h1>Loja</h1><p>Contato, horário, entrega e pagamento. Essas informações aparecem no site e na mensagem do pedido.</p></div></div>' +
      '<form data-form-loja novalidate>' +
      '<section class="secao-form"><h2>Contato</h2><div class="duas">' +
        '<div class="campo"><label for="lj-whats">WhatsApp que recebe os pedidos</label><input id="lj-whats" name="whatsapp" inputmode="tel" value="' + esc(l.whatsapp) + '" placeholder="5541999999999"><p class="dica">Com 55 + DDD, só números.</p><p class="erro" data-erro-loja="whatsapp"></p></div>' +
        '<div class="campo"><label for="lj-insta">Instagram</label><input id="lj-insta" name="instagram" value="' + esc(l.instagram) + '" placeholder="house_hamburgueria66"></div>' +
        '<div class="campo"><label for="lj-end">Endereço</label><input id="lj-end" name="endereco" value="' + esc(l.endereco) + '"></div>' +
        '<div class="campo"><label for="lj-cid">Cidade</label><input id="lj-cid" name="cidade" value="' + esc(l.cidade) + '"></div></div></section>' +
      '<section class="secao-form"><h2>Horário</h2>' +
        '<div class="campo"><span class="rotulo">Dias de funcionamento</span><div class="dias">' + DIAS.map(function (d, i) {
          return '<label><input type="checkbox" name="dia" value="' + i + '"' + (dias.indexOf(i) > -1 ? " checked" : "") + "><span>" + d + "</span></label>";
        }).join("") + "</div></div>" +
        '<div class="duas"><div class="campo"><label for="lj-abre">Abre às</label><input id="lj-abre" name="abre" type="time" value="' + esc(h.abre || "") + '"></div>' +
        '<div class="campo"><label for="lj-fecha">Fecha às</label><input id="lj-fecha" name="fecha" type="time" value="' + esc(h.fecha || "") + '"><p class="dica">Se fechar depois da meia-noite, use o horário do dia seguinte (ex.: 01:00).</p></div></div>' +
        '<div class="campo"><label for="lj-htxt">Texto do horário no site</label><input id="lj-htxt" name="horarioTexto" value="' + esc(l.horarioTexto) + '"></div></section>' +
      '<section class="secao-form"><h2>Entrega e pagamento</h2>' +
        '<label class="marcar"><input type="checkbox" name="entrega"' + (l.entrega ? " checked" : "") + "> Fazemos entrega</label>" +
        '<label class="marcar"><input type="checkbox" name="retirada"' + (l.retirada ? " checked" : "") + "> Cliente pode retirar no local</label>" +
        '<div class="campo"><label for="lj-taxa">Taxa de entrega (R$)</label><input id="lj-taxa" name="taxaEntrega" inputmode="decimal" value="' + precoCampo(l.taxaEntrega == null || l.taxaEntrega === "" ? null : Number(l.taxaEntrega)) + '" placeholder="Vazio = a combinar no WhatsApp"><p class="dica">Vazio = “a combinar”. 0 = entrega grátis.</p><p class="erro" data-erro-loja="taxaEntrega"></p></div>' +
        '<div class="campo"><label for="lj-pag">Formas de pagamento (uma por linha)</label><textarea id="lj-pag" name="pagamentos" rows="3" placeholder="Pix&#10;Cartão&#10;Dinheiro">' + esc((l.pagamentos || []).join("\n")) + '</textarea><p class="dica">Vazio = o site não pergunta a forma de pagamento.</p></div></section>' +
      '<section class="secao-form"><h2>Aviso no topo do site</h2><div class="campo"><label for="lj-aviso">Texto (opcional)</label><input id="lj-aviso" name="aviso" maxlength="120" value="' + esc(l.aviso) + '" placeholder="Ex.: Hoje abrimos às 18h"><p class="dica">Vazio = sem faixa de aviso.</p></div></section>' +
      '<div class="fixo"><button type="submit" class="btn btn--vermelho btn--bloco">Salvar informações da loja</button></div></form>';
  }

  // ------------------------------------------------------------ eventos do conteúdo
  conteudo.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-atualizar]")) { recarregar().then(function () { render(); toast("Pedidos atualizados."); }); return; }
    var f = t.closest("[data-filtro]");
    if (f) { filtroPedido = f.getAttribute("data-filtro"); renderPedidos(); return; }
    if (t.closest("[data-novo-produto]")) { if (!dados.categorias.length) { toast("Crie uma categoria antes.", true); return; } editarProduto(null); return; }
    var ep = t.closest("[data-editar-produto]");
    if (ep) { editarProduto(dados.produtos.filter(function (p) { return p.id === ep.getAttribute("data-editar-produto"); })[0]); return; }
    if (t.closest("[data-nova-promo]")) { editarPromo(null); return; }
    var epr = t.closest("[data-editar-promo]");
    if (epr) { editarPromo(dados.promocoes.filter(function (p) { return p.id === epr.getAttribute("data-editar-promo"); })[0]); return; }
    var li = t.closest("[data-cat]");
    if (li && t.closest("[data-salvar-cat]")) { salvarCat(li); return; }
    if (li && t.closest("[data-excluir-cat]")) {
      var b = t.closest("[data-excluir-cat]");
      confirmarDuplo(b, function () {
        A.excluirCategoria(li.getAttribute("data-cat")).then(recarregar).then(function () { render(); toast("Categoria excluída."); }).catch(falha);
      });
    }
  });
  conteudo.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-status]")) {
      var id = t.getAttribute("data-status");
      A.statusPedido(id, t.value).then(function () {
        pedidos.forEach(function (p) { if (p.id === id) p.status = t.value; });
        atualizarBolha(); toast("Situação atualizada.");
        var det = t.closest("details"); var aberto = det && det.open;
        renderPedidos();
        if (aberto) { var sel = conteudo.querySelector('[data-status="' + id + '"]'); if (sel) sel.closest("details").open = true; }
      }).catch(falha);
      return;
    }
    if (t.matches("[data-filtro-cat]")) { filtroCat = t.value; renderProdutos(); return; }
    if (t.matches("[data-ativo-produto]")) {
      var p = U.clone(dados.produtos.filter(function (x) { return x.id === t.getAttribute("data-ativo-produto"); })[0]);
      p.ativo = t.checked;
      A.salvarProduto(p).then(recarregar).then(function () { render(); toast(p.ativo ? "Produto aparece no site." : "Produto escondido do site."); }).catch(falha);
      return;
    }
    if (t.matches("[data-ativo-promo]")) {
      var pr = U.clone(dados.promocoes.filter(function (x) { return x.id === t.getAttribute("data-ativo-promo"); })[0]);
      pr.ativo = t.checked;
      A.salvarPromocao(pr).then(recarregar).then(function () { render(); toast(pr.ativo ? "Promoção no ar." : "Promoção tirada do ar."); }).catch(falha);
      return;
    }
    if (t.matches("[data-cat-foto]")) {
      var arq = t.files && t.files[0];
      if (!arq) return;
      toast("Enviando foto…");
      A.enviarFoto(arq).then(function (url) { return salvarCat(t.closest("[data-cat]"), { foto: url }); }).catch(falha);
    }
  });
  conteudo.addEventListener("input", function (e) {
    if (e.target.matches("[data-busca]")) {
      busca = e.target.value;
      var pos = e.target.selectionStart;
      renderProdutos();
      var b = conteudo.querySelector("[data-busca]"); b.focus(); try { b.setSelectionRange(pos, pos); } catch (er) {}
    }
  });
  conteudo.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (f.matches("[data-nova-cat]")) {
      var nome = f.elements.nome.value.trim();
      var er = f.querySelector("[data-erro-nova-cat]");
      er.textContent = "";
      if (!nome) { er.textContent = "Informe o nome da categoria."; return; }
      var id = U.slug(nome);
      if (!id) { er.textContent = "Use letras ou números no nome."; return; }
      var ordem = dados.categorias.reduce(function (m, c) { return Math.max(m, c.ordem || 0); }, 0) + 1;
      A.salvarCategoria({ id: id, nome: nome, ordem: ordem, ativo: true, estilo: "normal", foto: "" }, true)
        .then(recarregar).then(function () { render(); toast("Categoria criada."); }).catch(function (err) { er.textContent = err.message; });
      return;
    }
    if (f.matches("[data-form-loja]")) {
      var el = f.elements;
      $$("[data-erro-loja]", f).forEach(function (x) { x.textContent = ""; });
      var whats = el.whatsapp.value.replace(/\D/g, "");
      if (whats && (whats.length < 12 || whats.length > 13)) { f.querySelector('[data-erro-loja="whatsapp"]').textContent = "Use 55 + DDD + número, ex.: 5541999999999."; el.whatsapp.focus(); return; }
      var taxa = lerPreco(el.taxaEntrega.value);
      if (isNaN(taxa)) { f.querySelector('[data-erro-loja="taxaEntrega"]').textContent = "Use só números, ex.: 7,00."; el.taxaEntrega.focus(); return; }
      if (!el.entrega.checked && !el.retirada.checked) { toast("Marque pelo menos entrega ou retirada.", true); return; }
      var loja = Object.assign({}, dados.loja, {
        whatsapp: whats, instagram: el.instagram.value.trim().replace(/^@/, ""), endereco: el.endereco.value.trim(), cidade: el.cidade.value.trim(),
        horario: { dias: $$('input[name="dia"]:checked', f).map(function (x) { return Number(x.value); }), abre: el.abre.value, fecha: el.fecha.value },
        horarioTexto: el.horarioTexto.value.trim(), entrega: el.entrega.checked, retirada: el.retirada.checked, taxaEntrega: taxa,
        pagamentos: el.pagamentos.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean), aviso: el.aviso.value.trim()
      });
      var b = f.querySelector('button[type="submit"]');
      b.disabled = true;
      A.salvarLoja(loja).then(recarregar).then(function () { toast("Informações da loja salvas."); }).catch(falha).then(function () { b.disabled = false; });
    }
  });

  // pedidos novos chegam sozinhos enquanto o painel está aberto
  setInterval(function () {
    if ($("[data-tela-app]").hidden || document.hidden) return;
    A.pedidos().then(function (lista) {
      var antes = pedidos.filter(function (p) { return p.status === "novo"; }).length;
      pedidos = lista;
      var depois = pedidos.filter(function (p) { return p.status === "novo"; }).length;
      atualizarBolha();
      if (depois > antes) toast("Pedido novo recebido.");
      if (aba === "pedidos" && !conteudo.querySelector("details[open]")) renderPedidos();
    }).catch(function () {});
  }, 30000);

  A.sessao().then(function (s) { if (s) abrirApp(); else iniciarLogin(); }).catch(function (e) { iniciarLogin(); falha(e); });
})();
