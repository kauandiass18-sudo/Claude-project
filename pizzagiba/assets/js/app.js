/* Pizza Giba — site */
(function () {
  "use strict";

  /* ---------- Dados ---------- */
  var BASE = window.GIBA || {};
  var DATA = BASE;
  try {
    var ov = localStorage.getItem("giba:data");
    if (ov) { var parsed = JSON.parse(ov); if (parsed && parsed.produtos) DATA = parsed; }
  } catch (e) {}

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (v) { return "R$ " + Number(v || 0).toFixed(2).replace(".", ","); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var motionOff = document.documentElement.classList.contains("motion-off");

  var CATS = (DATA.categorias || []).slice();
  var SIZES = DATA.tamanhos || [{ id: "G", nome: "Grande" }, { id: "M", nome: "Média" }];
  var ADDONS = DATA.adicionais || [];
  var PRODUCTS = (DATA.produtos || []).filter(function (p) { return p.ativo !== false; });
  var PROMOS = (DATA.promocoes || []).filter(function (p) { return p.ativo !== false; });
  var ALL = PRODUCTS.concat(PROMOS.map(function (p) { return Object.assign({ cat: "promocoes" }, p); }));
  var byId = {}; ALL.forEach(function (p) { byId[p.id] = p; });
  var isPizza = function (p) { var c = CATS.filter(function (c) { return c.id === p.cat; })[0]; return !!(c && c.tipo === "pizza") || !!p.precos; };
  var basePrice = function (p, size) { return p.precos ? Number(p.precos[size] != null ? p.precos[size] : p.precos[SIZES[0].id]) : Number(p.preco || 0); };
  var minPrice = function (p) { if (!p.precos) return Number(p.preco || 0); return Math.min.apply(null, Object.keys(p.precos).map(function (k) { return Number(p.precos[k]); })); };

  /* ---------- Textos fixos ---------- */
  var wa = (DATA.whatsapp || "").replace(/\D/g, "");
  var waLink = function (text) { return "https://wa.me/" + wa + (text ? "?text=" + encodeURIComponent(text) : ""); };
  $$("[data-nome]").forEach(function (el) { el.textContent = DATA.nome || "Pizza Giba"; });
  $$("[data-telefone]").forEach(function (el) { el.textContent = DATA.telefone || ""; });
  $$("[data-instagram-user]").forEach(function (el) { el.textContent = DATA.instagramUser || ""; });
  $$("[data-ano]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$("[data-wa-link]").forEach(function (el) { el.href = waLink("Olá! Vim pelo site da " + (DATA.nome || "Pizza Giba") + "."); });
  $$("[data-ig-link]").forEach(function (el) { if (DATA.instagram) el.href = DATA.instagram; else el.classList.add("hidden"); });
  var nPizzas = PRODUCTS.filter(isPizza).length;
  $$("[data-fact-sabores]").forEach(function (el) { el.textContent = nPizzas; });

  var strip = $("[data-strip]");
  if (strip) {
    var words = ["Forno a lenha", nPizzas + " sabores de pizza", "Pedido pelo WhatsApp", "Entrega e retirada", "Gostosa a qualquer hora", "Pratos e sobremesas"];
    strip.innerHTML = words.concat(words).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("");
  }

  /* ---------- Destaques ---------- */
  (function () {
    var box = $("[data-feat]"); if (!box) return;
    var ids = DATA.destaques || [];
    var items = ids.map(function (id) { return byId[id]; }).filter(Boolean);
    if (!items.length) { $("#destaques").classList.add("hidden"); return; }
    var withPhoto = items.filter(function (p) { return p.foto; })[0] || items[0];
    var rest = items.filter(function (p) { return p !== withPhoto; });
    var html = "";
    html += '<article class="feat__photo" data-reveal>' +
      (withPhoto.foto ? '<img src="' + esc(withPhoto.foto) + '" alt="' + esc(withPhoto.nome) + '" loading="lazy" data-parallax="6">' : "") +
      '<div class="feat__photo-body">' +
      '<h3>' + esc(withPhoto.nome) + '</h3><p>' + esc(withPhoto.desc) + '</p>' +
      '<div class="price-row"><span class="price-tag"><small>' + (withPhoto.precos ? "a partir de" : "") + '</small>' + money(minPrice(withPhoto)) + '</span>' +
      '<button type="button" class="btn btn--gold btn--sm" data-go="' + esc(withPhoto.id) + '">Pedir esta</button></div></div></article>';
    html += '<div class="feat__list">' + rest.map(function (p) {
      return '<article class="feat__card" data-reveal>' +
        '<div><h3>' + esc(p.nome) + '</h3><p>' + esc(p.desc) + '</p></div>' +
        '<span class="price"><small>' + (p.precos ? "a partir de" : "") + '</small>' + money(minPrice(p)) + '</span>' +
        '<button type="button" class="go" data-go="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nome) + ' no cardápio"></button></article>';
    }).join("") + "</div>";
    box.innerHTML = html;
  })();

  /* ---------- Cardápio ---------- */
  var menuBox = $("[data-menu]"), tabsBox = $("[data-tabs]"), searchIn = $("[data-search]");
  var activeCat = null, query = "";
  var visibleCats = CATS.filter(function (c) { return ALL.some(function (p) { return p.cat === c.id; }); });
  if (visibleCats.length) activeCat = visibleCats[0].id;

  function renderTabs() {
    tabsBox.innerHTML = visibleCats.map(function (c) {
      return '<button type="button" role="tab" class="tab' + (c.id === activeCat && !query ? " is-on" : "") + '" data-cat="' + esc(c.id) + '" aria-selected="' + (c.id === activeCat && !query) + '">' + esc(c.nome) + "</button>";
    }).join("");
  }

  function itemHTML(p) {
    var pizza = isPizza(p);
    var media = p.foto ? '<div class="item__media"><img src="' + esc(p.foto) + '" alt="' + esc(p.nome) + '" loading="lazy" width="96" height="96"></div>' : "";
    var tags = (p.novidade ? '<span class="tag tag--new">Novidade</span>' : "") + ((DATA.destaques || []).indexOf(p.id) > -1 ? '<span class="tag">Da casa</span>' : "");
    var priceArea;
    if (pizza && p.precos) {
      priceArea = '<div class="sizes" role="group" aria-label="Tamanho">' + SIZES.filter(function (s) { return p.precos[s.id] != null; }).map(function (s, i) {
        return '<button type="button" class="size' + (i === 0 ? " is-on" : "") + '" data-size="' + esc(s.id) + '"><small>' + esc(s.nome) + "</small><b>" + money(p.precos[s.id]) + "</b></button>";
      }).join("") + "</div>";
    } else {
      priceArea = '<span class="price-single">' + (p.precoAntigo ? '<span class="old" style="text-decoration:line-through;color:var(--muted-2);font-size:.85em;margin-right:8px">' + money(p.precoAntigo) + "</span>" : "") + money(p.preco) + "</span>";
    }
    var opts = "";
    if (p.opcoes && p.opcoes.length) {
      opts += '<div class="chips" role="group" aria-label="Opção">' + p.opcoes.map(function (o, i) { return '<button type="button" class="chip' + (i === 0 ? " is-on" : "") + '" data-opt="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    }
    if (pizza && ADDONS.length) {
      opts += ADDONS.map(function (a) { return '<label class="chk"><input type="checkbox" data-addon="' + esc(a.id) + '"> ' + esc(a.nome) + " · +" + money(a.preco) + "</label>"; }).join("");
    }
    return '<article class="item' + (p.foto ? " has-photo" : "") + '" data-item="' + esc(p.id) + '">' + media + '<div class="item__body">' +
      '<h3 class="item__name">' + esc(p.nome) + tags + "</h3>" +
      (p.desc ? '<p class="item__desc">' + esc(p.desc) + "</p>" : "") +
      (opts ? '<div class="item__opts">' + opts + "</div>" : "") +
      '<div class="item__foot">' + priceArea +
      '<button type="button" class="add" data-add><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Adicionar</span></button></div></div></article>';
  }

  function renderMenu() {
    var list;
    if (query) {
      var q = norm(query);
      list = ALL.filter(function (p) { return norm(p.nome + " " + (p.desc || "") + " " + (p.grupo || "")).indexOf(q) > -1; });
      menuBox.innerHTML = list.length
        ? '<div class="menu-group"><h3 class="menu-group__title">' + list.length + (list.length === 1 ? " resultado" : " resultados") + '</h3><div class="items">' + list.map(itemHTML).join("") + "</div></div>"
        : '<p class="empty">Nada encontrado para “' + esc(query) + '”. Tente outro ingrediente.</p>';
    } else {
      list = ALL.filter(function (p) { return p.cat === activeCat; });
      var groups = [], map = {};
      list.forEach(function (p) { var g = p.grupo || ""; if (!map[g]) { map[g] = []; groups.push(g); } map[g].push(p); });
      menuBox.innerHTML = groups.map(function (g) {
        return '<div class="menu-group">' + (g ? '<h3 class="menu-group__title">' + esc(g) + "</h3>" : "") + '<div class="items">' + map[g].map(itemHTML).join("") + "</div></div>";
      }).join("") || '<p class="empty">Em breve.</p>';
    }
    renderTabs();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  tabsBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    activeCat = b.getAttribute("data-cat"); query = ""; searchIn.value = ""; renderMenu();
  });
  var sT; searchIn.addEventListener("input", function () { clearTimeout(sT); sT = setTimeout(function () { query = searchIn.value.trim(); renderMenu(); }, 120); });

  menuBox.addEventListener("click", function (e) {
    var size = e.target.closest("[data-size]");
    if (size) { $$("[data-size]", size.parentNode).forEach(function (b) { b.classList.remove("is-on"); }); size.classList.add("is-on"); return; }
    var opt = e.target.closest("[data-opt]");
    if (opt) { $$("[data-opt]", opt.parentNode).forEach(function (b) { b.classList.remove("is-on"); }); opt.classList.add("is-on"); return; }
    var add = e.target.closest("[data-add]");
    if (add) {
      var card = add.closest("[data-item]"); var p = byId[card.getAttribute("data-item")]; if (!p) return;
      var sizeBtn = $(".size.is-on", card); var sizeId = sizeBtn ? sizeBtn.getAttribute("data-size") : null;
      var optBtn = $(".chip.is-on", card); var opcao = optBtn ? optBtn.getAttribute("data-opt") : null;
      var addons = $$("[data-addon]:checked", card).map(function (c) { return c.getAttribute("data-addon"); });
      addToCart(p, sizeId, opcao, addons);
      add.classList.add("is-done"); $("span", add).textContent = "Adicionado";
      setTimeout(function () { add.classList.remove("is-done"); $("span", add).textContent = "Adicionar"; }, 1400);
    }
  });

  // "Pedir esta" nos destaques: leva ao item no cardápio
  document.addEventListener("click", function (e) {
    var go = e.target.closest("[data-go]"); if (!go) return;
    var p = byId[go.getAttribute("data-go")]; if (!p) return;
    activeCat = p.cat; query = ""; searchIn.value = ""; renderMenu();
    var el = $('[data-item="' + p.id + '"]');
    if (el) { scrollToEl(el, -120); el.style.borderColor = "var(--gold)"; setTimeout(function () { el.style.borderColor = ""; }, 2000); }
  });

  /* ---------- Carrinho ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("giba:cart") || "[]"); if (!Array.isArray(cart)) cart = []; } catch (e) { cart = []; }
  cart = cart.filter(function (l) { return byId[l.id]; });
  var saveCart = function () { try { localStorage.setItem("giba:cart", JSON.stringify(cart)); } catch (e) {} };

  function lineUnit(l) {
    var p = byId[l.id]; if (!p) return 0;
    var v = basePrice(p, l.size);
    (l.addons || []).forEach(function (id) { var a = ADDONS.filter(function (x) { return x.id === id; })[0]; if (a) v += Number(a.preco); });
    return v;
  }
  function addToCart(p, size, opcao, addons) {
    var key = [p.id, size || "", opcao || "", (addons || []).slice().sort().join("+")].join("|");
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty += 1; else cart.push({ key: key, id: p.id, size: size, opcao: opcao, addons: addons || [], qty: 1 });
    saveCart(); renderCart();
    toast(p.nome + " adicionado ao pedido");
    var cb = $(".cart-btn"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump");
  }
  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return cart.reduce(function (n, l) { return n + lineUnit(l) * l.qty; }, 0); }

  var linesBox = $("[data-cart-lines]"), totalsBox = $("[data-totals]"), sendBtn = $("[data-send]");
  var modo = "entrega", pagamento = null;
  var entregaCfg = DATA.entrega || {};
  if (entregaCfg.ativo === false) modo = "retirada";

  function renderCart() {
    var n = cartCount();
    $$("[data-cart-count],[data-cart-count-mobile]").forEach(function (el) { el.textContent = n; });
    if (!cart.length) {
      linesBox.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9H12Z"/><circle cx="8.5" cy="10" r=".8"/><circle cx="9.5" cy="15" r=".8"/><circle cx="14" cy="16" r=".8"/></svg><p>Seu pedido está vazio.<br>Escolha um sabor no cardápio.</p><a href="#cardapio" class="btn btn--gold btn--sm" data-scroll data-close-cart>Ver cardápio</a></div>';
    } else {
      linesBox.innerHTML = cart.map(function (l, i) {
        var p = byId[l.id]; var sz = SIZES.filter(function (s) { return s.id === l.size; })[0];
        var meta = [sz ? sz.nome : null, l.opcao].concat((l.addons || []).map(function (id) { var a = ADDONS.filter(function (x) { return x.id === id; })[0]; return a ? a.nome : null; })).filter(Boolean).join(" · ");
        return '<div class="cline"><div><p class="cline__name">' + esc(p.nome) + "</p>" + (meta ? '<p class="cline__meta">' + esc(meta) + "</p>" : "") +
          '<div class="qty"><button type="button" data-qty="-1" data-i="' + i + '" aria-label="Menos um">−</button><span>' + l.qty + '</span><button type="button" data-qty="1" data-i="' + i + '" aria-label="Mais um">+</button></div></div>' +
          '<div style="display:grid;justify-items:end"><p class="cline__price">' + money(lineUnit(l) * l.qty) + '</p><button type="button" class="cline__rm" data-rm="' + i + '">Remover</button></div></div>';
      }).join("");
    }
    var sub = subtotal(); var taxa = modo === "entrega" ? entregaCfg.taxa : 0;
    var taxaTxt = modo === "entrega" ? (taxa != null ? money(taxa) : "a confirmar") : "retirada";
    totalsBox.innerHTML = '<div><span>Subtotal</span><span>' + money(sub) + "</span></div>" +
      '<div><span>Entrega</span><span>' + taxaTxt + "</span></div>" +
      '<div class="tot"><span>Total</span><b>' + money(sub + (taxa || 0)) + (modo === "entrega" && taxa == null ? " + entrega" : "") + "</b></div>";
    sendBtn.disabled = !cart.length;
    $("[data-checkout]").classList.toggle("hidden", !cart.length);
  }
  linesBox.addEventListener("click", function (e) {
    var q = e.target.closest("[data-qty]");
    if (q) { var i = +q.getAttribute("data-i"); cart[i].qty += +q.getAttribute("data-qty"); if (cart[i].qty <= 0) cart.splice(i, 1); saveCart(); renderCart(); return; }
    var rm = e.target.closest("[data-rm]");
    if (rm) { cart.splice(+rm.getAttribute("data-rm"), 1); saveCart(); renderCart(); }
  });

  // Modo entrega/retirada
  var modoBox = $("[data-modo]");
  if (entregaCfg.ativo === false) $('[data-modo-btn="entrega"]').classList.add("hidden");
  if (entregaCfg.retirada === false) $('[data-modo-btn="retirada"]').classList.add("hidden");
  function setModo(m) {
    modo = m;
    $$("[data-modo-btn]").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-modo-btn") === m); });
    $("[data-endereco]").classList.toggle("hidden", m !== "entrega");
    var note = $("[data-entrega-note]");
    note.textContent = m === "entrega"
      ? (entregaCfg.taxa != null ? "Taxa de entrega: " + money(entregaCfg.taxa) + "." : "A taxa de entrega é confirmada pelo WhatsApp conforme o bairro.") + (entregaCfg.tempo ? " Tempo médio: " + entregaCfg.tempo + "." : "")
      : "Você retira na pizzaria. Avisamos pelo WhatsApp quando estiver pronto.";
    renderCart();
  }
  modoBox.addEventListener("click", function (e) { var b = e.target.closest("[data-modo-btn]"); if (b) setModo(b.getAttribute("data-modo-btn")); });
  setModo(modo);

  // Pagamento
  var payBox = $("[data-pay]");
  payBox.innerHTML = (DATA.pagamentos || []).map(function (p) { return '<button type="button" data-pay-id="' + esc(p.id) + '"><i></i>' + esc(p.nome) + "</button>"; }).join("");
  payBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pay-id]"); if (!b) return;
    pagamento = b.getAttribute("data-pay-id");
    $$("[data-pay-id]").forEach(function (x) { x.classList.toggle("is-on", x === b); });
    $("[data-troco]").classList.toggle("hidden", pagamento !== "dinheiro");
  });

  // Enviar
  sendBtn.addEventListener("click", function () {
    var f = $("[data-checkout]"), err = $("[data-err]"); err.textContent = "";
    $$(".field", f).forEach(function (x) { x.classList.remove("is-bad"); });
    var v = function (n) { return (f.elements[n].value || "").trim(); };
    var bad = function (n, msg) { f.elements[n].closest(".field").classList.add("is-bad"); err.textContent = msg; f.elements[n].focus(); };
    if (!cart.length) return;
    if (!v("nome")) return bad("nome", "Informe seu nome.");
    if (modo === "entrega") {
      if (!v("rua")) return bad("rua", "Informe a rua para entrega.");
      if (!v("numero")) return bad("numero", "Informe o número.");
      if (!v("bairro")) return bad("bairro", "Informe o bairro.");
    }
    if (!pagamento) { err.textContent = "Escolha a forma de pagamento."; return; }
    var payName = (DATA.pagamentos || []).filter(function (p) { return p.id === pagamento; })[0].nome;

    var L = [];
    L.push("*Pedido · " + (DATA.nome || "Pizza Giba") + "*");
    L.push("");
    cart.forEach(function (l) {
      var p = byId[l.id]; var sz = SIZES.filter(function (s) { return s.id === l.size; })[0];
      var det = [sz ? sz.nome : null, l.opcao].filter(Boolean).join(", ");
      L.push(l.qty + "x " + p.nome + (det ? " (" + det + ")" : "") + " — " + money(basePrice(p, l.size) * l.qty));
      (l.addons || []).forEach(function (id) { var a = ADDONS.filter(function (x) { return x.id === id; })[0]; if (a) L.push("   + " + a.nome + " — " + money(a.preco * l.qty)); });
    });
    L.push("");
    var sub = subtotal(), taxa = modo === "entrega" ? entregaCfg.taxa : 0;
    L.push("Subtotal: " + money(sub));
    if (modo === "entrega") L.push("Entrega: " + (taxa != null ? money(taxa) : "a confirmar"));
    L.push("*Total: " + money(sub + (taxa || 0)) + (modo === "entrega" && taxa == null ? " + entrega*" : "*"));
    L.push("");
    L.push("*" + (modo === "entrega" ? "Entrega" : "Retirada na pizzaria") + "*");
    L.push("Nome: " + v("nome"));
    if (v("fone")) L.push("Telefone: " + v("fone"));
    if (modo === "entrega") {
      L.push("Endereço: " + v("rua") + ", " + v("numero") + " — " + v("bairro") + (v("cidade") ? ", " + v("cidade") : ""));
      if (v("complemento")) L.push("Referência: " + v("complemento"));
    }
    L.push("");
    L.push("*Pagamento:* " + payName + (pagamento === "dinheiro" && v("troco") ? " (troco para R$ " + v("troco") + ")" : ""));
    if (v("obs")) { L.push("*Observações:* " + v("obs")); }
    var url = waLink(L.join("\n"));
    var w = window.open(url, "_blank"); if (!w) location.href = url;
    toast("Pedido aberto no WhatsApp");
  });

  // Abrir/fechar gaveta
  function openCart() { document.body.classList.add("cart-open"); if (window.__lenis) window.__lenis.stop(); renderCart(); }
  function closeCart() { document.body.classList.remove("cart-open"); if (window.__lenis) window.__lenis.start(); }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-cart]")) { e.preventDefault(); closeMenu(); openCart(); }
    else if (e.target.closest("[data-close-cart]")) { closeCart(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); closeMenu(); } });
  renderCart();

  /* ---------- Toast ---------- */
  var toastEl = $("[data-toast]"), tT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("is-on"); clearTimeout(tT); tT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2200); }

  /* ---------- Avaliações ---------- */
  (function () {
    var box = $("[data-reviews]"); if (!box) return;
    var list = (DATA.avaliacoes || []).filter(function (r) { return r && r.texto; });
    if (!list.length) {
      box.innerHTML = '<div class="reviews-empty"><p>Ainda não publicamos avaliações aqui. Se você já pediu, conta pra gente como foi pelo WhatsApp ou marca ' + esc(DATA.instagramUser || "a pizzaria") + ' no Instagram.</p>' +
        '<a class="btn btn--dark btn--sm" target="_blank" rel="noopener" href="' + waLink("Olá! Quero deixar minha avaliação da " + (DATA.nome || "Pizza Giba") + ":") + '">Enviar avaliação</a></div>';
      return;
    }
    var star = '<svg viewBox="0 0 24 24"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z"/></svg>';
    box.className = "reviews";
    box.innerHTML = list.map(function (r) {
      var n = Math.max(0, Math.min(5, Number(r.nota || 5)));
      return '<article class="review"><div class="stars" aria-label="' + n + ' de 5">' + new Array(n + 1).join(star) + '</div><blockquote>“' + esc(r.texto) + '”</blockquote><footer>' + esc(r.nome || "Cliente") + (r.data ? " · " + esc(r.data) : "") + "</footer></article>";
    }).join("");
  })();

  /* ---------- Promoções ---------- */
  (function () {
    var sec = $("[data-promos-sec]"), box = $("[data-promos]"); if (!sec || !PROMOS.length) return;
    sec.classList.remove("hidden");
    box.innerHTML = PROMOS.map(function (p) {
      return '<article class="promo" data-reveal><p class="eyebrow">Promoção</p><h3>' + esc(p.nome) + "</h3><p>" + esc(p.desc || "") + '</p><p class="price-tag">' + (p.precoAntigo ? '<span class="old">' + money(p.precoAntigo) + "</span>" : "") + money(p.preco) + '</p><button type="button" class="btn btn--gold btn--sm" data-go="' + esc(p.id) + '">Pedir</button></article>';
    }).join("");
  })();

  /* ---------- Contato ---------- */
  (function () {
    var info = $("[data-info]"); if (!info) return;
    var rows = [];
    var endereco = [DATA.endereco, DATA.cidade].filter(Boolean).join(" · ");
    rows.push(["Endereço", endereco ? "<span>" + esc(endereco) + "</span>" + (DATA.mapsUrl ? '<a href="' + esc(DATA.mapsUrl) + '" target="_blank" rel="noopener">Como chegar</a>' : "") : '<span class="muted">Confirme o endereço pelo WhatsApp.</span>']);
    var hs = DATA.horarios || [];
    var status = statusHTML();
    rows.push(["Horário", (hs.length ? hs.map(function (h) { return "<span>" + esc(h.dias) + ": " + esc(h.horas) + "</span>"; }).join("") : '<span class="muted">Consulte o horário de hoje pelo WhatsApp.</span>') + status]);
    rows.push(["WhatsApp", '<a href="' + waLink("Olá! Vim pelo site da " + (DATA.nome || "Pizza Giba") + ".") + '" target="_blank" rel="noopener">' + esc(DATA.telefone || "") + "</a>"]);
    if (DATA.instagram) rows.push(["Instagram", '<a href="' + esc(DATA.instagram) + '" target="_blank" rel="noopener">' + esc(DATA.instagramUser || DATA.instagram) + "</a>"]);
    rows.push(["Pedidos", "<span>Entrega e retirada pelo WhatsApp</span><span class=\"muted\">" + (DATA.pagamentos || []).map(function (p) { return p.nome; }).join(", ") + "</span>"]);
    info.innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span><div>" + r[1] + "</div></li>"; }).join("");

    var map = $("[data-map]");
    if (DATA.mapsEmbed) map.innerHTML = '<iframe src="' + esc(DATA.mapsEmbed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa com a localização da ' + esc(DATA.nome || "Pizza Giba") + '" allowfullscreen></iframe>';
    else { map.remove(); $(".contact").classList.add("contact--single"); }
  })();
  function statusHTML() {
    var f = DATA.funcionamento; if (!f || !f.dias) return "";
    var now = new Date(); var h = now.getHours() + now.getMinutes() / 60; var d = now.getDay();
    var open = f.dias.indexOf(d) > -1 && h >= f.abre && h < f.fecha;
    if (!open && f.fecha < f.abre) { var y = (d + 6) % 7; open = f.dias.indexOf(y) > -1 && h < f.fecha; }
    return '<span class="status' + (open ? "" : " is-closed") + '"><i></i>' + (open ? "Aberto agora" : "Fechado agora") + "</span>";
  }

  /* ---------- Navegação ---------- */
  var nav = $("[data-nav]"), burger = $("[data-burger]"), mmenu = $("[data-mobile-menu]"), mbar = $("[data-mbar]");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("is-solid", y > 40);
    mbar.classList.toggle("is-on", y > window.innerHeight * .7 && !document.body.classList.contains("cart-open"));
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function closeMenu() { burger.classList.remove("is-open"); mmenu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); }
  burger.addEventListener("click", function () {
    var open = !mmenu.classList.contains("is-open");
    burger.classList.toggle("is-open", open); mmenu.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("no-scroll", open);
  });

  function scrollToEl(el, offset) {
    var top = el.getBoundingClientRect().top + window.scrollY + (offset || -64);
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 }); else window.scrollTo({ top: top, behavior: motionOff ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-scroll]"); if (!a) return;
    var id = a.getAttribute("href"); if (!id || id.charAt(0) !== "#") return;
    var el = id === "#topo" ? document.body : $(id); if (!el) return;
    e.preventDefault(); closeMenu(); closeCart(); scrollToEl(el, id === "#topo" ? 0 : -64);
  });

  /* ---------- Movimento ---------- */
  function initMotion() {
    if (motionOff || !window.gsap) { $$("[data-reveal],[data-clip]").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; el.style.clipPath = "none"; }); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && matchMedia("(pointer: fine)").matches) {
      var lenis = new Lenis({ lerp: .09, wheelMultiplier: .95 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    // Hero
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from('[data-hero="eyebrow"]', { y: 16, opacity: 0, duration: .8 }, .1)
      .from(".hero__title .line > span", { yPercent: 110, duration: 1.1, stagger: .09, ease: "power4.out" }, .15)
      .from('[data-hero="lead"]', { y: 18, opacity: 0, duration: .9 }, .6)
      .from('[data-hero="cta"] .btn', { y: 16, opacity: 0, duration: .8, stagger: .1 }, .75)
      .from('[data-hero="meta"]', { y: 10, opacity: 0, duration: .8 }, .95)
      .to("[data-clip]", { clipPath: "inset(0 0 0% 0 round 4px)", duration: 1.4, ease: "power4.inOut" }, .2)
      .from(".hero__frame img", { scale: 1.25, duration: 1.8, ease: "power3.out" }, .2)
      .from('[data-hero="cap"]', { opacity: 0, duration: 1 }, 1.2);
    // Fundo: a luz acompanha a rolagem de leve
    var glow = $("[data-bg-glow]");
    if (glow) gsap.to(glow, { yPercent: -12, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.2 } });
    // Reveals
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: .1, overwrite: true }); },
      once: true
    });
    // Parallax nas fotos
    $$("[data-parallax]").forEach(function (img) {
      var amt = parseFloat(img.getAttribute("data-parallax")) || 8;
      gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
    // Reveal re-check ao trocar de aba do cardápio (os itens não usam data-reveal para não travar listas grandes)
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "complete") initMotion(); else window.addEventListener("DOMContentLoaded", initMotion);

  renderMenu();
})();
