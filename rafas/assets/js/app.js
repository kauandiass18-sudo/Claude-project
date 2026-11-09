/*
 * Rafa's Delivery — funcionamento
 * Cardápio, dois sabores, carrinho e pedido montado no WhatsApp.
 * Sem bibliotecas externas.
 */
(function () {
  "use strict";

  var C = window.PIZZARIA || {};
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Fotos (Unsplash, uso gratuito) ----------
   * Troque por fotos da própria Rafa's: use um caminho local,
   * ex.: calabresa: "assets/img/calabresa.jpg"
   * Sabores sem foto mostram uma ilustração de pizza.
   */
  var FOTOS = {
    hero: "1513104890138-7c749659a591",
    margherita: "1574071318508-1cdbab80d002",
    calabresa: "1565299624946-b28f40a0ae38",
    pepperoni: "1628840042765-356cda07504e",
    frango: "1593560708920-61dd98c46a4e",
    portuguesa: "1513104890138-7c749659a591",
    bacon: "1628840042765-356cda07504e",
    forno: "1565299624946-b28f40a0ae38"
  };
  function urlFoto(chave, w) {
    if (!chave) return "";
    var v = FOTOS[chave] || chave;
    if (/^(assets\/|https?:)/.test(v)) return v;
    if (!/^\d{9,}-[0-9a-f]+$/.test(v)) return "";
    return "https://images.unsplash.com/photo-" + v + "?auto=format&fit=crop&w=" + (w || 800) + "&q=72";
  }

  /* ---------- Ilustração de pizza (aparece se a foto não carregar) ---------- */
  function rnd(seed) { var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function pontos(r, n, raio) {
    var out = [], tent = 0;
    while (out.length < n && tent < 400) {
      tent++;
      var a = r() * Math.PI * 2, d = Math.sqrt(r()) * raio;
      var x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d;
      if (out.every(function (p) { return Math.hypot(p[0] - x, p[1] - y) > 15; })) out.push([x, y, r()]);
    }
    return out;
  }
  function pizzaSVG(tipo) {
    tipo = String(tipo || "pizza").toLowerCase();
    var r = rnd(tipo);
    var doce = /^doce/.test(tipo);
    var molho = doce ? "#4a2518" : "#b5401f";
    var queijo = doce ? "#6b3a24" : "#f0cf86";
    var t = "";
    pontos(r, 16, 64).forEach(function (p) { t += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (9 + p[2] * 8).toFixed(1) + '" fill="' + (doce ? "#5a2f1d" : "#f7e2a8") + '" opacity=".75"/>'; });
    var cobertura = {
      margherita: function (p) { return p[2] > .5 ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="#c8361d"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#e0573a"/>' : '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="7" ry="3.6" fill="#3f6b2a" transform="rotate(' + (p[2] * 360 | 0) + ' ' + p[0] + ' ' + p[1] + ')"/>'; },
      calabresa: function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#a8452f"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="5.5" fill="#c9644a"/><circle cx="' + (p[0] + 2) + '" cy="' + (p[1] - 1) + '" r="1.2" fill="#f2d3b8"/>'; },
      pepperoni: function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8.5" fill="#9e2a18"/><circle cx="' + (p[0] - 2) + '" cy="' + (p[1] - 2) + '" r="1.4" fill="#6e1a0e"/><circle cx="' + (p[0] + 3) + '" cy="' + (p[1] + 2) + '" r="1.1" fill="#6e1a0e"/>'; },
      bacon: function (p) { return '<rect x="' + (p[0] - 7) + '" y="' + (p[1] - 3) + '" width="14" height="6" rx="3" fill="#a8452f" transform="rotate(' + (p[2] * 180 | 0) + ' ' + p[0] + ' ' + p[1] + ')"/><rect x="' + (p[0] - 7) + '" y="' + (p[1] - 1) + '" width="14" height="2" rx="1" fill="#f2d3b8" transform="rotate(' + (p[2] * 180 | 0) + ' ' + p[0] + ' ' + p[1] + ')"/>'; },
      frango: function (p) { return p[2] > .4 ? '<rect x="' + p[0] + '" y="' + p[1] + '" width="11" height="4" rx="2" fill="#e3c08f" transform="rotate(' + (p[2] * 180 | 0) + ' ' + p[0] + ' ' + p[1] + ')"/>' : '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="#fbf4e6"/>'; },
      brocolis: function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7.5" fill="#4d7a2e"/><circle cx="' + (p[0] - 3) + '" cy="' + (p[1] - 2) + '" r="3.5" fill="#6a9a3f"/><circle cx="' + (p[0] + 3) + '" cy="' + (p[1] - 1) + '" r="3" fill="#6a9a3f"/>'; },
      queijos: function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (6 + p[2] * 5).toFixed(1) + '" fill="#f9e7b0" opacity=".9"/><circle cx="' + (p[0] + 2) + '" cy="' + (p[1] + 1) + '" r="2.5" fill="#e9b85c"/>'; },
      doce: function (p) { return '<path d="M' + p[0] + ' ' + (p[1] + 6) + ' l-6 -8 a4 4 0 0 1 6 -4 a4 4 0 0 1 6 4 z" fill="#d23a3a"/>'; }
    };
    var chave = Object.keys(cobertura).filter(function (k) { return tipo.indexOf(k) > -1; })[0];
    var fn = cobertura[chave] || (doce ? cobertura.doce : cobertura.margherita);
    pontos(r, 13, 62).forEach(function (p) { p[0] = +p[0].toFixed(1); p[1] = +p[1].toFixed(1); t += fn(p); });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="c" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#e3a75e"/><stop offset=".93" stop-color="#c47a35"/><stop offset="1" stop-color="#8f4f1f"/></radialGradient><radialGradient id="s" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>' +
      '<circle cx="100" cy="100" r="99" fill="url(#c)"/><circle cx="100" cy="100" r="84" fill="' + molho + '"/><circle cx="100" cy="100" r="80" fill="' + queijo + '" opacity=".95"/>' + t +
      '<g stroke="#000" stroke-opacity=".18" stroke-width="1"><path d="M100 2v196M2 100h196M30 30l140 140M170 30 30 170"/></g><circle cx="100" cy="100" r="99" fill="url(#s)"/></svg>';
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")";
  }

  function pizzaEl(alvo, foto, tipo, alt, w) {
    if (!alvo) return;
    alvo.style.backgroundImage = pizzaSVG(tipo || foto);
    var src = urlFoto(foto, w);
    alvo.innerHTML = "";
    if (!src) return;
    var img = doc.createElement("img");
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onerror = function () { img.classList.add("is-broken"); };
    img.src = src;
    alvo.appendChild(img);
  }

  function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function aviso(msg) {
    var t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove("on"); }, 2600);
  }

  /* ---------- Nome e dados ---------- */
  var nome = C.nome || "Rafa's Delivery";
  var numero = String(C.whatsapp || "").replace(/\D/g, "");
  $$("[data-nome]").forEach(function (e) { e.textContent = nome; });
  $$("[data-slogan]").forEach(function (e) { e.textContent = C.slogan || nome; });
  $$("[data-telefone]").forEach(function (e) { e.textContent = C.telefoneExibicao || ""; });
  doc.title = nome + " · Pizzaria com pedido pelo WhatsApp";
  $$("[data-ano]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  $$("[data-tempo]").forEach(function (e) { e.textContent = C.tempoEntrega || "40 a 60 min"; });
  $$("[data-endereco]").forEach(function (e) { e.textContent = C.endereco || ""; });
  if (C.endereco) $("[data-endereco-box]").hidden = false;
  $("[data-pagamentos]").textContent = (C.pagamentos || []).join(" · ");
  $("[data-adicional]").textContent = brl(C.adicionalSabor || 0);
  if ((C.horarios || []).length) {
    $("[data-horarios]").innerHTML = C.horarios.map(function (h) { return "<li><span>" + esc(h.dias) + "</span><b>" + esc(h.horas) + "</b></li>"; }).join("");
  } else {
    $("[data-horarios-box]").hidden = true;
  }
  var semBairros = !(C.bairros || []).length;
  if (semBairros) {
    $("[data-bairros-box]").hidden = true;
  } else {
    $("[data-bairros]").innerHTML = C.bairros.map(function (b) { return "<li><span>" + esc(b.nome) + "</span><b>" + brl(b.taxa) + "</b></li>"; }).join("") + "<li><span>Retirada</span><b>grátis</b></li>";
    $("[data-delivery-texto]").textContent = "Consulte a taxa do seu bairro antes de pedir. Prefere buscar? A retirada é sem taxa.";
  }
  if (/^https?:\/\//.test(C.instagram || "")) { var ig = $("[data-instagram]"); ig.href = C.instagram; ig.hidden = false; }

  // Aberto agora?
  (function status() {
    var f = C.funcionamento;
    if (!f) { $("[data-hero-horario]").hidden = true; return; }
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    var aberto = f.dias.indexOf(d.getDay()) > -1 && h >= f.abre && h < f.fecha;
    var hojeAbre = f.dias.indexOf(d.getDay()) > -1;
    $("[data-status]").textContent = aberto ? "Aberto agora" : "Fechado agora · aceitamos pedidos no horário";
    $("[data-status-dot]").classList.toggle("on", aberto);
    $("[data-status-hero]").textContent = aberto ? "Aberto agora" : "Hoje";
    var hh = function (x) { var hr = Math.floor(x), m = Math.round((x - hr) * 60); return hr + "h" + (m ? (m < 10 ? "0" : "") + m : ""); };
    $("[data-hoje]").textContent = hojeAbre ? hh(f.abre) + " às " + hh(f.fecha) : "fechado";
  })();

  /* ---------- WhatsApp ---------- */
  function wa(texto) { return (numero ? "https://wa.me/" + numero : "https://wa.me/") + "?text=" + encodeURIComponent(texto); }
  $$("[data-wa-direto]").forEach(function (a) { a.href = wa("Olá, " + nome + "! Gostaria de fazer um pedido."); });

  /* ---------- Dados do cardápio ---------- */
  var tamanhos = C.tamanhos || [{ id: "P", nome: "Pequena" }, { id: "G", nome: "Grande" }];
  var pizzas = [];
  (C.cardapio || []).forEach(function (cat) { cat.itens.forEach(function (it) { it.categoria = cat.categoria; it.tipo = cat.tipo || "salgada"; if (it.precos) pizzas.push(it); }); });
  function menorPreco(it) { return it.precos ? Math.min.apply(null, Object.keys(it.precos).map(function (k) { return it.precos[k]; })) : it.preco; }
  function fotoDe(it) { return it.foto || (it.tipo === "doce" ? "doce" : it.nome); }

  /* ---------- Carrinho ---------- */
  var carrinho = [];
  try { carrinho = JSON.parse(localStorage.getItem("rafas-carrinho") || "[]") || []; } catch (e) { carrinho = []; }
  function salvar() { try { localStorage.setItem("rafas-carrinho", JSON.stringify(carrinho)); } catch (e) { /* sem armazenamento */ } }
  function adicionar(nomeItem, detalhe, preco) {
    var chave = nomeItem + "|" + detalhe + "|" + preco;
    var ja = carrinho.filter(function (i) { return i.k === chave; })[0];
    if (ja) ja.q += 1; else carrinho.push({ k: chave, n: nomeItem, d: detalhe, p: preco, q: 1 });
    salvar(); render();
    $$(".badge[data-count]").forEach(function (b) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
    aviso("Adicionado: " + nomeItem + (detalhe ? " (" + detalhe + ")" : ""));
  }
  function subtotal() { return carrinho.reduce(function (s, i) { return s + i.p * i.q; }, 0); }
  function qtd() { return carrinho.reduce(function (s, i) { return s + i.q; }, 0); }

  function botaoAdd(label) { return '<button type="button" class="add" data-add><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' + (label || "Adicionar") + "</button>"; }
  function seletorTamanho(it) {
    var ts = tamanhos.filter(function (t) { return it.precos[t.id] != null; });
    return '<div class="sizes" role="group" aria-label="Tamanho">' + ts.map(function (t, k) {
      return '<button type="button" data-size="' + t.id + '" aria-pressed="' + (k === ts.length - 1 ? "true" : "false") + '">' + t.nome + "</button>";
    }).join("") + "</div>";
  }
  function ligarItem(el, it) {
    var precoEl = $(".price", el);
    function atual() { var b = $('[data-size][aria-pressed="true"]', el); return b ? b.getAttribute("data-size") : null; }
    function pintar() { var s = atual(); precoEl.textContent = brl(s ? it.precos[s] : it.preco); }
    el.addEventListener("click", function (e) {
      var s = e.target.closest("[data-size]");
      if (s) { $$("[data-size]", el).forEach(function (b) { b.setAttribute("aria-pressed", b === s ? "true" : "false"); }); pintar(); return; }
      var a = e.target.closest("[data-add]");
      if (a) {
        var t = atual();
        var tam = tamanhos.filter(function (x) { return x.id === t; })[0];
        adicionar(it.precos ? "Pizza " + it.nome : it.nome, tam ? tam.nome : "", t ? it.precos[t] : it.preco);
        a.classList.add("ok"); setTimeout(function () { a.classList.remove("ok"); }, 700);
      }
    });
    pintar();
  }

  /* ---------- Mais pedidas ---------- */
  (function destaques() {
    var lista = pizzas.filter(function (p) { return p.destaque; }).slice(0, 3);
    if (lista.length < 3) lista = lista.concat(pizzas.filter(function (p) { return lista.indexOf(p) < 0; })).slice(0, 3);
    var box = $("[data-destaques]");
    lista.forEach(function (it, i) {
      var el = doc.createElement("article");
      el.className = "card";
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = i * 0.1 + "s";
      el.innerHTML = '<span class="card__n">0' + (i + 1) + '</span><div class="pz card__img"></div><h3>' + esc(it.nome) + "</h3><p>" + esc(it.desc) + '</p><div class="card__foot">' + seletorTamanho(it) + '<span class="price"></span>' + botaoAdd() + "</div>";
      pizzaEl($(".card__img", el), it.foto, fotoDe(it), "Pizza " + it.nome, 600);
      box.appendChild(el);
      ligarItem(el, it);
    });
    var top = lista[0];
    if (top) { $("[data-hero-destaque]").textContent = top.nome; $("[data-hero-preco]").textContent = "a partir de " + brl(menorPreco(top)); }
  })();

  pizzaEl($('[data-foto="forno"]'), "forno", "calabresa", "Pizza recém-saída do forno", 900);

  /* ---------- Cardápio ---------- */
  (function cardapio() {
    var tabs = $("[data-tabs]"), lista = $("[data-lista]"), busca = $("[data-busca]"), vazio = $("[data-vazio]");
    var cats = (C.cardapio || []).map(function (c) { return c.categoria; });
    var atual = cats[0];
    tabs.innerHTML = cats.map(function (c, i) { return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");

    function itemEl(it) {
      var el = doc.createElement("article");
      el.className = it.precos ? "item" : "item item--drink";
      el.innerHTML = (it.precos ? '<div class="pz item__img" aria-hidden="true"></div>' : "") + "<div><h3>" + esc(it.nome) + "</h3><p>" + esc(it.desc || "") + '</p><div class="item__row">' + (it.precos ? seletorTamanho(it) : "") + '<span class="price"></span>' + botaoAdd() + "</div></div>";
      if (it.precos) $(".item__img", el).style.backgroundImage = pizzaSVG(fotoDe(it));
      ligarItem(el, it);
      return el;
    }
    function semAcento(t) { return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    function mostrar() {
      var q = semAcento(busca.value.trim());
      lista.innerHTML = "";
      var itens = [];
      (C.cardapio || []).forEach(function (c) {
        c.itens.forEach(function (it) {
          if (q ? semAcento(it.nome + " " + (it.desc || "")).indexOf(q) > -1 : c.categoria === atual) itens.push(it);
        });
      });
      itens.forEach(function (it, i) { var el = itemEl(it); el.style.animationDelay = Math.min(i, 8) * 40 + "ms"; lista.appendChild(el); });
      vazio.hidden = itens.length > 0;
      tabs.style.opacity = q ? ".45" : "1";
    }
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      atual = b.getAttribute("data-cat");
      busca.value = "";
      $$("[data-cat]", tabs).forEach(function (x) { var on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
      mostrar();
    });
    tabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var bs = $$("[data-cat]", tabs), i = bs.indexOf(doc.activeElement);
      if (i < 0) return;
      var n = bs[(i + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length];
      n.focus(); n.click();
    });
    busca.addEventListener("input", mostrar);
    mostrar();
  })();

  /* ---------- Dois sabores ---------- */
  (function builder() {
    var f = $("[data-builder]");
    var tam = tamanhos[tamanhos.length - 1].id;
    var bordas = C.bordas || [{ nome: "Sem borda recheada", preco: 0 }];
    var bordaNome = bordas[0].nome;
    var adicional = +C.adicionalSabor || 0;
    $("[data-b-tamanho]").innerHTML = tamanhos.map(function (t) { return '<button type="button" data-t="' + t.id + '" aria-pressed="' + (t.id === tam) + '">' + esc(t.nome) + (t.fatias ? "<small>" + esc(t.fatias) + "</small>" : "") + "</button>"; }).join("");
    var opts = (C.cardapio || []).map(function (c) {
      var its = c.itens.filter(function (it) { return it.precos; });
      if (!its.length) return "";
      return '<optgroup label="' + esc(c.categoria) + '">' + its.map(function (p) { return '<option value="' + pizzas.indexOf(p) + '">' + esc(p.nome) + "</option>"; }).join("") + "</optgroup>";
    }).join("");
    var s1 = $("[data-b-s1]"), s2 = $("[data-b-s2]");
    s1.innerHTML = opts; s2.innerHTML = opts; s2.selectedIndex = Math.min(1, pizzas.length - 1);

    function bordasDisponiveis(a, b) {
      var tipos = {}; tipos[a.tipo] = 1; tipos[b.tipo] = 1;
      return bordas.filter(function (x) { return !x.tipo || tipos[x.tipo]; });
    }
    function pintarBordas(lista) {
      if (!lista.some(function (x) { return x.nome === bordaNome; })) bordaNome = lista[0].nome;
      $("[data-b-borda]").innerHTML = lista.map(function (b) { return '<button type="button" data-b="' + esc(b.nome) + '" aria-pressed="' + (b.nome === bordaNome) + '">' + esc(b.nome) + "<small>" + (b.preco ? "+ " + brl(b.preco) : "incluso") + "</small></button>"; }).join("");
    }

    var total = 0, resumo = "", basico = "";
    function calc() {
      var a = pizzas[s1.value], b = pizzas[s2.value];
      var lista = bordasDisponiveis(a, b);
      pintarBordas(lista);
      var borda = lista.filter(function (x) { return x.nome === bordaNome; })[0];
      var dois = a !== b;
      total = Math.max(a.precos[tam], b.precos[tam]) + borda.preco + (dois ? adicional : 0);
      var nomeTam = tamanhos.filter(function (t) { return t.id === tam; })[0].nome;
      var txtBorda = borda.preco ? " · borda " + borda.nome : "";
      basico = nomeTam + txtBorda;
      resumo = dois ? nomeTam + " · ½ " + a.nome + " + ½ " + b.nome + txtBorda : nomeTam + " · " + a.nome + txtBorda;
      $("[data-b-total]").textContent = brl(total);
      $("[data-b-resumo]").textContent = resumo + (dois && adicional ? " · inclui + " + brl(adicional) + " do 2º sabor" : "");
      pizzaEl($('[data-foto-half="a"]'), null, fotoDe(a));
      pizzaEl($('[data-foto-half="b"]'), null, fotoDe(b));
    }
    f.addEventListener("click", function (e) {
      var t = e.target.closest("[data-t]"), bb = e.target.closest("[data-b]");
      if (t) { tam = t.getAttribute("data-t"); $$("[data-t]", f).forEach(function (x) { x.setAttribute("aria-pressed", x === t); }); calc(); }
      if (bb) { bordaNome = bb.getAttribute("data-b"); calc(); }
    });
    s1.addEventListener("change", calc); s2.addEventListener("change", calc);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = pizzas[s1.value], b = pizzas[s2.value];
      adicionar(a === b ? "Pizza " + a.nome : "Pizza dois sabores", a === b ? basico : resumo, total);
    });
    calc();
  })();

  /* ---------- Gaveta do pedido ---------- */
  var drawer = $("[data-drawer]"), form = $("[data-checkout]");
  var bairroSel = $("[data-bairro-select]"), pagSel = $("[data-pag-select]");
  if (semBairros) { $("[data-bairro-select-wrap]").hidden = true; $("[data-bairro-input-wrap]").hidden = false; }
  bairroSel.innerHTML = '<option value="">Selecione o bairro</option>' + (C.bairros || []).map(function (b, i) { return '<option value="' + i + '">' + esc(b.nome) + " · " + brl(b.taxa) + "</option>"; }).join("");
  pagSel.innerHTML = (C.pagamentos || ["Pix"]).map(function (p) { return "<option>" + esc(p) + "</option>"; }).join("");

  function modo() { var r = $('input[name="modo"]:checked', form); return r ? r.value : "entrega"; }
  function taxa() { if (modo() !== "entrega" || semBairros || bairroSel.value === "") return 0; return C.bairros[+bairroSel.value].taxa; }
  function bairroEscolhido() { return semBairros ? String(form.bairroTexto.value || "").trim() : (bairroSel.value === "" ? "" : C.bairros[+bairroSel.value].nome); }

  function render() {
    var n = qtd(), sub = subtotal();
    $$("[data-count]").forEach(function (e) { e.textContent = n; });
    $$(".badge[data-count]").forEach(function (e) { e.hidden = n === 0; });
    $$("[data-count-label]").forEach(function (e) { e.textContent = n === 1 ? "item" : "itens"; });
    $$("[data-subtotal]").forEach(function (e) { e.textContent = brl(sub); });
    doc.body.classList.toggle("has-cart", n > 0);
    atualizarBarra();
    $("[data-items]").innerHTML = carrinho.map(function (i, k) {
      return '<li><div><h3>' + esc(i.n) + "</h3>" + (i.d ? "<small>" + esc(i.d) + "</small>" : "") + '</div><b>' + brl(i.p * i.q) + '</b><div class="qty"><button type="button" data-q="-1" data-k="' + k + '" aria-label="Diminuir quantidade">−</button><span>' + i.q + '</span><button type="button" data-q="1" data-k="' + k + '" aria-label="Aumentar quantidade">+</button></div></li>';
    }).join("");
    $("[data-empty]").hidden = n > 0;
    $("[data-checkout-fields]").hidden = n === 0;
    $("[data-send]").disabled = n === 0;
    var m = modo();
    $("[data-entrega]").hidden = m !== "entrega";
    $("[data-taxa-row]").hidden = m !== "entrega";
    $("[data-taxa]").textContent = semBairros ? "a confirmar" : (bairroSel.value === "" ? "selecione o bairro" : brl(taxa()));
    $("[data-total]").textContent = brl(sub + taxa()) + (m === "entrega" && semBairros ? " + entrega" : "");
    $("[data-troco]").hidden = pagSel.value !== "Dinheiro";
  }

  $("[data-items]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-q]");
    if (!b) return;
    var k = +b.getAttribute("data-k");
    carrinho[k].q += +b.getAttribute("data-q");
    if (carrinho[k].q <= 0) carrinho.splice(k, 1);
    salvar(); render();
  });
  form.addEventListener("change", render);

  function abrir() { $("[data-err]").textContent = ""; render(); doc.body.classList.add("lock"); if (drawer.showModal) drawer.showModal(); else drawer.setAttribute("open", ""); }
  function fechar() { if (drawer.close) drawer.close(); else drawer.removeAttribute("open"); }
  drawer.addEventListener("close", function () { doc.body.classList.remove("lock"); });
  drawer.addEventListener("click", function (e) { if (e.target === drawer) fechar(); });
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", abrir); });
  $("[data-close-cart]").addEventListener("click", fechar);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form), err = $("[data-err]");
    var m = modo();
    if (!qtd()) return;
    if (!String(fd.get("nome") || "").trim()) { err.textContent = "Informe seu nome para enviarmos o pedido."; form.nome.focus(); return; }
    if (m === "entrega" && !bairroEscolhido()) { err.textContent = semBairros ? "Informe o bairro para a entrega." : "Selecione o bairro para calcular a entrega."; (semBairros ? form.bairroTexto : bairroSel).focus(); return; }
    if (m === "entrega" && !String(fd.get("endereco") || "").trim()) { err.textContent = "Informe o endereço de entrega."; form.endereco.focus(); return; }
    err.textContent = "";
    var L = ["*Novo pedido · " + nome + "*", ""];
    carrinho.forEach(function (i) { L.push(i.q + "x " + i.n + (i.d ? " (" + i.d + ")" : "") + " — " + brl(i.p * i.q)); });
    L.push("", "Subtotal: " + brl(subtotal()));
    if (m === "entrega") L.push("Entrega (" + bairroEscolhido() + "): " + (semBairros ? "a confirmar" : brl(taxa())));
    L.push("*Total: " + brl(subtotal() + taxa()) + (m === "entrega" && semBairros ? " + entrega" : "") + "*", "");
    L.push("Nome: " + String(fd.get("nome")).trim());
    L.push(m === "entrega" ? "Entregar em: " + String(fd.get("endereco")).trim() + " · " + bairroEscolhido() : "Vou retirar");
    L.push("Pagamento: " + fd.get("pagamento") + (fd.get("pagamento") === "Dinheiro" && String(fd.get("troco") || "").trim() ? " (troco para " + String(fd.get("troco")).trim() + ")" : ""));
    if (String(fd.get("obs") || "").trim()) L.push("Observações: " + String(fd.get("obs")).trim());
    window.open(wa(L.join("\n")), "_blank", "noopener");
  });

  /* ---------- Barra fixa e navegação ---------- */
  var nav = $("[data-nav]"), barra = $("[data-cartbar]");
  function atualizarBarra() { barra.hidden = !(qtd() > 0 && window.innerWidth <= 1080); }
  window.addEventListener("resize", atualizarBarra);
  window.addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", window.scrollY > 10); doc.body.classList.toggle("past-hero", window.scrollY > 650); }, { passive: true });

  /* ---------- Revelação ao rolar ---------- */
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  render();
})();
