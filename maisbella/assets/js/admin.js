/* =========================================================================
   Painel administrativo
   LIVE: login do Supabase + tabela admins (RLS garante a segurança).
   DEMO: alterações salvas neste navegador e refletidas no site na hora.
   ========================================================================= */
(function () {
  var S = MB.store, U = MB.ui, A = S.admin;
  var app = document.getElementById("app");
  var esc = U.esc, icon = U.icon;
  var state = { tab: "inicio", settings: null, draft: null, cats: [], products: [], orders: [], coupons: [] };

  var STATUS = [
    ["aguardando", "Aguardando pagamento"], ["pago", "Pago"], ["em_producao", "Em produção"], ["separacao", "Em separação"],
    ["enviado", "Enviado"], ["entregue", "Entregue"], ["cancelado", "Cancelado"]
  ];
  var STATUS_L = {}; STATUS.forEach(function (s) { STATUS_L[s[0]] = s[1]; });
  var TABS = [
    ["inicio", "Visão geral", "sparkle"], ["pedidos", "Pedidos", "bag"], ["produtos", "Produtos", "gem"], ["categorias", "Categorias", "menu"],
    ["cupons", "Cupons", "gift"], ["home", "Página inicial", "edit"], ["loja", "Loja e atendimento", "chat"],
    ["vendas", "Pagamento e entrega", "truck"], ["paginas", "Páginas", "info"]
  ];

  // ---------------------------------------------------------------- entrada
  start();
  function start() {
    A.isAdmin().then(function (ok) { if (ok) boot(); else login(); }).catch(function () { login(); });
  }

  function logo() { return '<span class="logo"><span class="logo__name">Mais <i>Bella</i></span><span class="logo__sub">Semijoias</span></span>'; }

  function login(err) {
    if (!S.live) {
      app.innerHTML = '<div class="adm-login"><div class="adm-login__box">' + logo() +
        '<h1 class="h3" style="text-align:center">Painel da loja</h1>' +
        '<div class="notice">' + icon("info", "icon--sm") + "<span><strong>Modo demonstração.</strong> As alterações ficam salvas neste navegador e aparecem no site na hora. Ao conectar o Supabase, o acesso passa a exigir e-mail e senha da administradora.</span></div>" +
        '<button class="btn btn--block" type="button" data-demo>Entrar no painel</button>' +
        '<a class="link" href="index.html" style="justify-self:center">' + icon("back", "icon--sm") + " Voltar ao site</a></div></div>";
      app.querySelector("[data-demo]").addEventListener("click", function () { A.enterDemo(); boot(); });
      return;
    }
    app.innerHTML = '<div class="adm-login"><form class="adm-login__box" novalidate>' + logo() +
      '<h1 class="h3" style="text-align:center">Painel da loja</h1>' +
      '<div class="field"><label for="l-email">E-mail</label><input class="input" id="l-email" type="email" autocomplete="username" required></div>' +
      '<div class="field"><label for="l-pass">Senha</label><input class="input" id="l-pass" type="password" autocomplete="current-password" required></div>' +
      (err ? '<div class="notice notice--error"><span>' + esc(err) + "</span></div>" : "") +
      '<button class="btn btn--block" type="submit">Entrar</button>' +
      '<a class="link" href="index.html" style="justify-self:center">' + icon("back", "icon--sm") + " Voltar ao site</a></form></div>";
    app.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var b = e.target.querySelector("button"); b.disabled = true;
      S.signIn(U.$("#l-email").value.trim(), U.$("#l-pass").value)
        .then(function () { return A.isAdmin(); })
        .then(function (ok) {
          if (ok) return boot();
          S.signOut(); login("Esta conta não tem acesso ao painel.");
        })
        .catch(function (er) { login(/invalid/i.test(er.message) ? "E-mail ou senha incorretos." : er.message); });
    });
  }

  function boot() {
    Promise.all([A.settings(), A.categories(), A.products()]).then(function (r) {
      state.settings = r[0]; state.cats = r[1]; state.products = r[2];
      state.draft = S.clone(state.settings);
      shell();
      var h = location.hash.replace("#", "");
      go(TABS.some(function (t) { return t[0] === h; }) ? h : "inicio");
    }).catch(function (e) { app.innerHTML = '<div class="adm-login"><div class="notice notice--error">Erro ao carregar o painel: ' + esc(e.message) + "</div></div>"; });
  }

  function shell() {
    app.innerHTML = '<div class="adm">' +
      '<header class="adm-top">' + logo() + (S.live ? "" : '<span class="badge">Demonstração</span>') +
      '<div class="adm-top__right"><a class="btn btn--ghost btn--sm" href="index.html" target="_blank">Ver site</a><button class="icon-btn" type="button" data-logout aria-label="Sair">' + icon("close", "icon--sm") + "</button></div></header>" +
      '<nav class="adm-nav" aria-label="Seções do painel">' + TABS.map(function (t) {
        return '<button type="button" data-tab="' + t[0] + '">' + icon(t[2], "icon--sm") + t[1] + "</button>";
      }).join("") + "</nav>" +
      '<main class="adm-main" data-main></main></div>' +
      '<div class="savebar" data-savebar><span>Alterações não salvas</span><button class="btn btn--ghost btn--sm" type="button" data-discard>Descartar</button><button class="btn btn--sm" type="button" data-save>Salvar alterações</button></div>';
    app.querySelector(".adm-nav").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]"); if (!b) return;
      if (dirty() && !confirm("Há alterações não salvas. Deseja sair desta seção mesmo assim?")) return;
      state.draft = S.clone(state.settings); setDirty();
      go(b.getAttribute("data-tab"));
    });
    U.$("[data-logout]").addEventListener("click", function () {
      if (S.live) S.signOut().then(function () { login(); }); else { A.leaveDemo(); login(); }
    });
    U.$("[data-save]").addEventListener("click", saveSettings);
    U.$("[data-discard]").addEventListener("click", function () { state.draft = S.clone(state.settings); setDirty(); go(state.tab); });
    window.addEventListener("beforeunload", function (e) { if (dirty()) { e.preventDefault(); e.returnValue = ""; } });
  }

  function go(tab) {
    state.tab = tab;
    history.replaceState(null, "", "#" + tab);
    U.$$("[data-tab]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-tab") === tab); });
    // nó novo a cada seção, para não acumular ouvintes de eventos
    var old = U.$("[data-main]"), main = old.cloneNode(false);
    old.replaceWith(main);
    main.innerHTML = '<div class="skeleton" style="height:3rem;width:50%"></div>';
    ({ inicio: viewHome, pedidos: viewOrders, produtos: viewProducts, categorias: viewCats, cupons: viewCoupons, home: viewHomeTexts, loja: viewStore, vendas: viewSales, paginas: viewPages })[tab](main);
    window.scrollTo(0, 0);
  }

  function head(title, sub, actions) {
    return '<div class="adm-head"><div><h1>' + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" + (actions || "") + "</div>";
  }
  function fail(e) { U.toast("Erro: " + (e && e.message ? e.message : "não foi possível salvar.")); }

  // ---------------------------------------------------------------- configurações (rascunho)
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); }
  function set(obj, path, v) {
    var ks = path.split("."), last = ks.pop();
    var o = ks.reduce(function (o, k) { if (o[k] == null) o[k] = {}; return o[k]; }, obj);
    o[last] = v;
  }
  function dirty() { return state.draft && JSON.stringify(state.draft) !== JSON.stringify(state.settings); }
  function setDirty() { var b = U.$("[data-savebar]"); if (b) b.classList.toggle("is-on", !!dirty()); }
  function saveSettings() {
    var btn = U.$("[data-save]"); btn.disabled = true;
    A.saveSettings(state.draft).then(function () {
      state.settings = S.clone(state.draft); setDirty(); U.toast("Alterações salvas e publicadas no site.");
    }).catch(fail).then(function () { btn.disabled = false; });
  }

  // Campo ligado ao rascunho de configurações
  function sf(path, label, opts) {
    opts = opts || {};
    var v = get(state.draft, path);
    var id = "f-" + path.replace(/\./g, "-");
    var hint = opts.hint ? '<span class="hint">' + opts.hint + "</span>" : "";
    if (opts.type === "switch") return '<label class="switch"><input type="checkbox" data-path="' + path + '"' + (v ? " checked" : "") + "> " + label + "</label>" + hint;
    if (opts.type === "textarea") return '<div class="field"><label for="' + id + '">' + label + '</label><textarea class="textarea" id="' + id + '" data-path="' + path + '" rows="' + (opts.rows || 4) + '">' + esc(v || "") + "</textarea>" + hint + "</div>";
    if (opts.type === "image") return imageField(path, label, v, opts);
    return '<div class="field"><label for="' + id + '">' + label + '</label><input class="input" id="' + id + '" data-path="' + path + '" type="' + (opts.type || "text") + '"' +
      (opts.type === "number" ? ' step="' + (opts.step || "0.01") + '" min="0" inputmode="decimal"' : "") + ' value="' + esc(v == null ? "" : v) + '" placeholder="' + esc(opts.ph || "") + '">' + hint + "</div>";
  }
  function imageField(path, label, v, opts) {
    return '<div class="field"><span class="label">' + label + '</span><div style="display:flex;gap:1rem;align-items:center">' +
      '<div style="width:110px;aspect-ratio:' + (opts.ratio || "4/5") + ';background:var(--pearl-3);border:1px solid var(--line);flex:none">' + (v ? '<img src="' + esc(v) + '" alt="" style="width:100%;height:100%;object-fit:cover">' : "") + "</div>" +
      '<div style="display:grid;gap:.5rem"><label class="btn btn--ghost btn--sm" style="cursor:pointer">Enviar imagem<input type="file" accept="image/*" data-img-path="' + path + '" hidden></label>' +
      (opts.hint ? '<span class="hint">' + opts.hint + "</span>" : "") + "</div></div></div>";
  }
  function bindSettings(root) {
    U.$$("[data-path]", root).forEach(function (el) {
      el.addEventListener(el.type === "checkbox" ? "change" : "input", function () {
        var p = el.getAttribute("data-path");
        var v = el.type === "checkbox" ? el.checked : el.type === "number" ? (el.value === "" ? 0 : parseFloat(el.value)) : el.value;
        set(state.draft, p, v); setDirty();
      });
    });
    U.$$("[data-img-path]", root).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var f = inp.files[0]; if (!f) return;
        var box = inp.closest(".field").querySelector("div > div");
        box.innerHTML = '<div class="skeleton" style="width:100%;height:100%"></div>';
        upload(f, 2000).then(function (url) {
          set(state.draft, inp.getAttribute("data-img-path"), url); setDirty();
          box.innerHTML = '<img src="' + esc(url) + '" alt="" style="width:100%;height:100%;object-fit:cover">';
        }).catch(function (e) { box.innerHTML = ""; fail(e); });
      });
    });
  }

  // ---------------------------------------------------------------- imagens
  function resize(file, max) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type)) return reject(new Error("Envie um arquivo de imagem."));
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var ctx = c.getContext("2d"); ctx.imageSmoothingQuality = "high"; ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) {
          if (b && b.type === "image/webp") return resolve(b);
          c.toBlob(function (j) { j ? resolve(j) : reject(new Error("Não foi possível processar a imagem.")); }, "image/jpeg", 0.86);
        }, "image/webp", S.live ? 0.86 : 0.78);
      };
      img.onerror = function () { reject(new Error("Imagem inválida.")); };
      img.src = url;
    });
  }
  function upload(file, max) { return resize(file, S.live ? max : Math.min(max, 1100)).then(function (b) { return A.uploadImage(b, file.name.replace(/\.[^.]+$/, "")); }); }

  // ---------------------------------------------------------------- visão geral
  function viewHome(main) {
    A.orders().then(function (orders) {
      state.orders = orders;
      var paid = orders.filter(function (o) { return ["pago", "em_producao", "separacao", "enviado", "entregue"].indexOf(o.status) > -1; });
      var revenue = paid.reduce(function (s, o) { return s + Number(o.totals ? o.totals.total : o.total); }, 0);
      var waiting = orders.filter(function (o) { return o.status === "aguardando"; }).length;
      var active = state.products.filter(function (p) { return p.active !== false; }).length;
      var low = state.products.filter(function (p) { return p.stock != null && p.stock <= 3 && p.active !== false; });
      var s = state.settings;
      var checks = [
        [!!s.whatsapp, "WhatsApp comercial configurado", "loja"],
        [!!s.instagram, "Perfil do Instagram informado", "loja"],
        [!!(s.legal && s.legal.cnpj), "Razão social e CNPJ no rodapé", "loja"],
        [(s.shipping.methods || []).length > 0 || s.shipping.melhorEnvio, "Formas de entrega cadastradas", "vendas"],
        [S.live && (s.payments.pix || s.payments.card), "Pagamento online ativado", "vendas"],
        [!/pending/.test(JSON.stringify(s.pages)), "Páginas institucionais revisadas", "paginas"]
      ];
      main.innerHTML = head("Olá!", "Um resumo da loja hoje.") +
        '<div class="stats">' +
        stat("Pedidos", orders.length) + stat("Aguardando pagamento", waiting) + stat("Vendas aprovadas", S.fmt(revenue)) + stat("Peças ativas", active) + "</div>" +
        '<div class="panel"><h2>Para a loja ficar completa</h2><p>Itens que dependem de informações reais da Mais Bella.</p><div class="list">' +
        checks.map(function (c) {
          return '<button type="button" class="row-item" data-go="' + c[2] + '" style="grid-template-columns:auto 1fr auto;text-align:left">' +
            '<span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1px solid ' + (c[0] ? "var(--ok)" : "var(--line-2)") + ";color:" + (c[0] ? "var(--ok)" : "var(--warm)") + '">' + icon(c[0] ? "check" : "plus", "icon--sm") + "</span>" +
            '<span>' + c[1] + "</span>" + icon("arrow", "icon--sm") + "</button>";
        }).join("") + "</div></div>" +
        (low.length ? '<div class="panel"><h2>Estoque baixo</h2><div class="list">' + low.map(function (p) { return '<div class="row-item"><img src="' + esc(p.images[0] || "") + '" alt=""><div><div class="t">' + esc(p.name) + '</div><div class="m">' + p.stock + " em estoque</div></div></div>"; }).join("") + "</div></div>" : "") +
        (!S.live ? '<div class="panel"><h2>Demonstração</h2><p>Restaure o catálogo e os textos originais da apresentação.</p><div><button class="btn btn--ghost btn--sm" type="button" data-reset>Restaurar demonstração</button></div></div>' : "");
      U.$$("[data-go]", main).forEach(function (b) { b.addEventListener("click", function () { go(b.getAttribute("data-go")); }); });
      var r = U.$("[data-reset]", main);
      if (r) r.addEventListener("click", function () { if (confirm("Restaurar produtos, textos e configurações da demonstração? Pedidos de teste também serão apagados.")) { A.resetDemo(); boot(); } });
    });
  }
  function stat(l, v) { return '<div class="stat"><span>' + l + "</span><strong>" + v + "</strong></div>"; }

  // ---------------------------------------------------------------- pedidos
  function viewOrders(main) {
    A.orders().then(function (orders) {
      state.orders = orders;
      main.innerHTML = head("Pedidos", orders.length + " pedido" + (orders.length === 1 ? "" : "s") + (S.live ? "" : " feitos nesta demonstração")) +
        '<div class="toolbar-adm"><input class="input" type="search" placeholder="Buscar por nome, e-mail ou número" data-q><select class="select" data-st><option value="">Todos os status</option>' +
        STATUS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + "</option>"; }).join("") + "</select></div>" +
        '<div class="list" data-list></div>';
      var draw = function () {
        var q = U.$("[data-q]").value.toLowerCase(), st = U.$("[data-st]").value;
        var list = orders.filter(function (o) {
          var c = o.customer || {};
          return (!st || o.status === st) && (!q || [o.number, c.name, c.email, c.phone].join(" ").toLowerCase().indexOf(q) > -1);
        });
        U.$("[data-list]").innerHTML = list.length ? list.map(orderCard).join("") : '<div class="panel"><p class="muted">Nenhum pedido encontrado.</p></div>';
        bindOrders();
      };
      U.$("[data-q]").addEventListener("input", draw); U.$("[data-st]").addEventListener("change", draw);
      draw();
    }).catch(fail);
  }
  function orderCard(o) {
    var c = o.customer || {}, a = o.address || {}, t = o.totals || { total: o.total, subtotal: o.subtotal, discount: o.discount, shipping: o.shipping_cost };
    var phone = String(c.phone || "").replace(/\D/g, "");
    var pay = { pix: "Pix", card: "Cartão", whatsapp: "Combinar pelo WhatsApp" }[o.payment_method] || o.payment_method;
    return '<details class="order-card" data-oid="' + esc(o.id) + '"><summary><strong>Nº ' + o.number + " · " + esc(c.name || "") + '</strong><span class="price">' + S.fmt(t.total) + "</span>" +
      "<small>" + new Date(o.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) + " · " + esc(pay) + '</small><span class="status-badge" data-s="' + esc(o.status) + '">' + esc(STATUS_L[o.status] || o.status) + "</span></summary>" +
      '<div class="body">' +
      "<table>" + (o.items || []).map(function (i) { return "<tr><td>" + i.qty + "× " + esc(i.name) + (U.optText(i) ? '<br><span class="muted">' + esc(U.optText(i)) + "</span>" : "") + "</td><td>" + S.fmt(i.price * i.qty) + "</td></tr>"; }).join("") +
      "<tr><td>Frete" + (o.shipping ? " · " + esc(o.shipping.name) : " · a combinar") + "</td><td>" + (o.shipping ? S.fmt(o.shipping.price) : "—") + "</td></tr>" +
      (t.discount ? "<tr><td>Desconto" + (o.coupon ? " (" + esc(o.coupon) + ")" : "") + "</td><td>− " + S.fmt(t.discount) + "</td></tr>" : "") +
      (o.gift_wrap ? "<tr><td>Embalagem para presente" + (o.gift_message ? ': “' + esc(o.gift_message) + "”" : "") + "</td><td>" + S.fmt(t.gift || 0) + "</td></tr>" : "") +
      "<tr><td><strong>Total</strong></td><td><strong>" + S.fmt(t.total) + "</strong></td></tr></table>" +
      '<div class="fg-2"><div><span class="label" style="font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--warm-ink)">Cliente</span><p>' + esc(c.name) + "<br>" + esc(c.email) + "<br>" + esc(c.phone) + "<br>CPF " + esc(c.cpf || "") + "</p></div>" +
      '<div><span class="label" style="font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--warm-ink)">Entrega</span><p>' + esc([a.street + ", " + a.number, a.complement, a.district, a.city + "/" + a.state, a.cep].filter(Boolean).join(" · ")) + "</p></div></div>" +
      (o.notes ? '<p class="notice"><span>' + esc(o.notes) + "</span></p>" : "") +
      '<div class="fg-3" style="align-items:end"><div class="field"><label>Status</label><select class="select" data-o-status>' +
      STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === o.status ? " selected" : "") + ">" + s[1] + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label>Código de rastreamento</label><input class="input" data-o-track value="' + esc(o.tracking_code || "") + '"></div>' +
      '<div style="display:flex;gap:.5rem"><button class="btn btn--sm" type="button" data-o-save>Salvar</button>' +
      (phone ? '<a class="btn btn--ghost btn--sm" target="_blank" rel="noopener" href="https://wa.me/' + (phone.length <= 11 ? "55" : "") + phone + "?text=" + encodeURIComponent("Olá, " + (c.name || "").split(" ")[0] + "! Aqui é da Mais Bella Semijoias, sobre o seu pedido nº " + o.number + ".") + '">WhatsApp</a>' : "") +
      "</div></div></div></details>";
  }
  function bindOrders() {
    U.$$("[data-oid]").forEach(function (card) {
      var b = card.querySelector("[data-o-save]");
      b.addEventListener("click", function () {
        var patch = { status: card.querySelector("[data-o-status]").value, tracking_code: card.querySelector("[data-o-track]").value.trim() };
        b.disabled = true;
        A.updateOrder(card.getAttribute("data-oid"), patch).then(function () {
          U.toast("Pedido atualizado.");
          var badge = card.querySelector(".status-badge"); badge.setAttribute("data-s", patch.status); badge.textContent = STATUS_L[patch.status];
        }).catch(fail).then(function () { b.disabled = false; });
      });
    });
  }

  // ---------------------------------------------------------------- produtos
  function catName(slug) { var c = state.cats.filter(function (x) { return x.slug === slug; })[0]; return c ? c.name : slug; }
  function viewProducts(main) {
    A.products().then(function (list) {
      state.products = list;
      main.innerHTML = head("Produtos", list.length + " peças cadastradas", '<button class="btn btn--sm" type="button" data-new>' + icon("plus", "icon--sm") + " Nova peça</button>") +
        '<div class="toolbar-adm"><input class="input" type="search" placeholder="Buscar peça" data-q><select class="select" data-c><option value="">Todas as categorias</option>' +
        state.cats.map(function (c) { return '<option value="' + esc(c.slug) + '">' + esc(c.name) + "</option>"; }).join("") + "</select></div>" +
        '<div class="list" data-list></div>';
      var draw = function () {
        var q = U.$("[data-q]").value.toLowerCase(), c = U.$("[data-c]").value;
        U.$("[data-list]").innerHTML = list.filter(function (p) { return (!c || p.category === c) && (!q || p.name.toLowerCase().indexOf(q) > -1); }).map(function (p) {
          var sale = p.compare_at_price && p.compare_at_price > p.price;
          return '<div class="row-item' + (p.active === false ? " is-off" : "") + '"><img src="' + esc(p.images[0] || "") + '" alt="">' +
            '<div><div class="t">' + esc(p.name) + '</div><div class="m">' + esc(catName(p.category)) + " · " + (sale ? "<s>" + S.fmt(p.compare_at_price) + "</s> " : "") + S.fmt(p.price) +
            " · " + (p.stock == null ? "sob encomenda" : p.stock + " em estoque") + (p.active === false ? " · oculta" : "") + "</div></div>" +
            '<div class="acts"><a class="icon-btn" href="produto.html?p=' + encodeURIComponent(p.slug) + '" target="_blank" aria-label="Ver no site">' + icon("search", "icon--sm") + "</a>" +
            '<button class="icon-btn" type="button" data-edit="' + esc(p.id) + '" aria-label="Editar">' + icon("edit", "icon--sm") + "</button>" +
            '<button class="icon-btn icon-btn--danger" type="button" data-del="' + esc(p.id) + '" aria-label="Excluir">' + icon("close", "icon--sm") + "</button></div></div>";
        }).join("") || '<div class="panel"><p class="muted">Nenhuma peça encontrada.</p></div>';
      };
      U.$("[data-q]").addEventListener("input", draw); U.$("[data-c]").addEventListener("change", draw);
      main.addEventListener("click", function (e) {
        var ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
        if (e.target.closest("[data-new]")) productSheet(null);
        if (ed) productSheet(list.filter(function (p) { return p.id === ed.getAttribute("data-edit"); })[0]);
        if (del) {
          var p = list.filter(function (x) { return x.id === del.getAttribute("data-del"); })[0];
          if (confirm("Excluir “" + p.name + "”? Esta ação não pode ser desfeita. Para tirar do ar temporariamente, prefira ocultar a peça.")) {
            A.deleteProduct(p.id).then(function () { U.toast("Peça excluída."); go("produtos"); }).catch(fail);
          }
        }
      });
      draw();
    }).catch(fail);
  }

  function sheet(title, body, onSave, saveLabel) {
    var el = document.createElement("div");
    el.className = "sheet";
    el.innerHTML = '<div class="sheet__scrim" data-x></div><div class="sheet__panel" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
      '<div class="sheet__head"><h2>' + esc(title) + '</h2><button class="icon-btn" type="button" data-x aria-label="Fechar">' + icon("close", "icon--sm") + "</button></div>" +
      '<form class="sheet__body" novalidate>' + body + "</form>" +
      '<div class="sheet__foot"><button class="btn btn--ghost btn--sm" type="button" data-x>Cancelar</button><button class="btn btn--sm" type="button" data-ok>' + (saveLabel || "Salvar") + "</button></div></div>";
    document.body.appendChild(el); U.lock(true);
    function close() { el.remove(); U.lock(false); }
    el.addEventListener("click", function (e) { if (e.target.closest("[data-x]")) close(); });
    el.querySelector("[data-ok]").addEventListener("click", function () {
      var b = this; b.disabled = true;
      Promise.resolve(onSave(el)).then(function (ok) { if (ok !== false) close(); }).catch(fail).then(function () { b.disabled = false; });
    });
    el.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); });
    setTimeout(function () { var f = el.querySelector("input,textarea,select"); if (f) f.focus(); }, 50);
    return el;
  }

  function inp(name, label, v, attrs, hint) {
    return '<div class="field"><label for="p-' + name + '">' + label + '</label><input class="input" id="p-' + name + '" name="' + name + '" value="' + esc(v == null ? "" : v) + '" ' + (attrs || "") + ">" + (hint ? '<span class="hint">' + hint + "</span>" : "") + "</div>";
  }

  function productSheet(p) {
    var isNew = !p;
    p = p ? S.clone(p) : { name: "", slug: "", category: (state.cats[0] || {}).slug, tags: [], material: "", finish: "", price: "", compare_at_price: null, stock: "", position: state.products.length + 1, active: true, images: [], description: "", details: {}, options: [], personalization: null };
    var d = p.details || {}, pz = p.personalization || { title: "Personalização", note: "", fields: [], confirm: true };
    var images = (p.images || []).slice();
    var tags = [["novidade", "Novidade"], ["mais-vendido", "Mais vendido"], ["presente", "Ideal para presente"]];
    var body =
      "<fieldset><legend>Informações</legend>" +
      inp("name", "Nome da peça *", p.name, "required") +
      '<div class="fg-2">' +
      '<div class="field"><label for="p-category">Categoria *</label><select class="select" id="p-category" name="category">' + state.cats.map(function (c) { return '<option value="' + esc(c.slug) + '"' + (c.slug === p.category ? " selected" : "") + ">" + esc(c.name) + "</option>"; }).join("") + "</select></div>" +
      inp("slug", "Endereço (slug)", p.slug, 'placeholder="gerado a partir do nome"', "Aparece no link: produto.html?p=<em>slug</em>") + "</div>" +
      '<div class="fg-2">' + inp("material", "Material", p.material, 'placeholder="Folheado a ouro 18K"') + inp("finish", "Acabamento (linha curta)", p.finish, 'placeholder="Polido · zircônia"') + "</div>" +
      '<div class="field"><label for="p-description">Descrição</label><textarea class="textarea" id="p-description" name="description" rows="4">' + esc(p.description) + '</textarea><span class="hint">Seja objetiva e verdadeira: não prometa durabilidade ou propriedades que não possam ser comprovadas.</span></div>' +
      "</fieldset>" +
      "<fieldset><legend>Fotos</legend><div class=\"imgs\" data-imgs></div><p class=\"hint\" style=\"font-size:.74rem;color:var(--warm-ink)\">A primeira foto é a principal; a segunda aparece ao passar o mouse. Recomendado: vertical 4:5, mínimo 1200 px, fundo claro.</p></fieldset>" +
      "<fieldset><legend>Preço e estoque</legend>" +
      '<div class="fg-3">' + inp("price", "Preço (R$) *", p.price, 'type="number" step="0.01" min="0" inputmode="decimal" required') +
      inp("compare_at_price", "Preço original (R$)", p.compare_at_price || "", 'type="number" step="0.01" min="0" inputmode="decimal"', "Preencha só se houver promoção real.") +
      inp("stock", "Estoque", p.stock == null ? "" : p.stock, 'type="number" step="1" min="0" inputmode="numeric"', "Vazio = sob encomenda / não controlado.") + "</div>" +
      '<div class="fg-2">' + inp("position", "Ordem na vitrine", p.position, 'type="number" step="1" min="0"') +
      '<div class="field" style="align-content:end"><label class="switch"><input type="checkbox" name="active"' + (p.active !== false ? " checked" : "") + "> Peça visível no site</label></div></div>" +
      '<div class="field"><span class="label">Etiquetas</span><div style="display:flex;flex-wrap:wrap;gap:1rem">' + tags.map(function (t) { return '<label class="check"><input type="checkbox" name="tag" value="' + t[0] + '"' + ((p.tags || []).indexOf(t[0]) > -1 ? " checked" : "") + "> " + t[1] + "</label>"; }).join("") + "</div></div>" +
      "</fieldset>" +
      "<fieldset><legend>Detalhes da peça</legend>" +
      '<div class="fg-2">' + inp("d_material", "Material", d.material) + inp("d_acabamento", "Acabamento", d.acabamento) + inp("d_medidas", "Medidas", d.medidas) + inp("d_peso", "Peso", d.peso) + "</div>" +
      '<div class="field"><label for="p-d_cuidados">Cuidados e conservação</label><textarea class="textarea" id="p-d_cuidados" name="d_cuidados" rows="3">' + esc(d.cuidados || "") + "</textarea></div>" +
      "</fieldset>" +
      "<fieldset><legend>Variações</legend><div class=\"repeat\" data-opts></div><button class=\"btn btn--ghost btn--sm\" type=\"button\" data-add-opt style=\"justify-self:start\">" + icon("plus", "icon--sm") + " Adicionar variação</button>" +
      '<p class="hint" style="font-size:.74rem;color:var(--warm-ink)">Ex.: “Aro” com os valores 12, 13, 14. A cliente precisa escolher antes de comprar.</p></fieldset>' +
      "<fieldset><legend>Personalização</legend>" +
      '<label class="switch"><input type="checkbox" name="pz_on"' + (p.personalization ? " checked" : "") + "> Peça com gravação / personalização</label>" +
      '<div data-pz style="display:grid;gap:1rem"' + (p.personalization ? "" : " hidden") + ">" +
      '<div class="fg-2">' + inp("pz_title", "Título", pz.title) + inp("pz_note", "Aviso", pz.note) + "</div>" +
      '<div class="repeat" data-pzf></div><button class="btn btn--ghost btn--sm" type="button" data-add-pzf style="justify-self:start">' + icon("plus", "icon--sm") + " Adicionar campo</button>" +
      '<label class="check"><input type="checkbox" name="pz_confirm"' + (pz.confirm !== false ? " checked" : "") + "> Exigir que a cliente confirme o texto antes de comprar</label></div>" +
      "</fieldset>";

    var el = sheet(isNew ? "Nova peça" : "Editar peça", body, function (el) {
      var f = el.querySelector("form");
      var v = function (n) { var x = f.elements[n]; return x ? String(x.value).trim() : ""; };
      if (!v("name")) { f.elements.name.focus(); throw new Error("Informe o nome da peça."); }
      var price = parseFloat(v("price"));
      if (!(price > 0)) { f.elements.price.focus(); throw new Error("Informe um preço válido."); }
      var cmp = v("compare_at_price") ? parseFloat(v("compare_at_price")) : null;
      if (cmp != null && cmp <= price) throw new Error("O preço original deve ser maior que o preço de venda.");
      var opts = U.$$("[data-opt-row]", el).map(function (r) {
        return { name: r.querySelector("[data-on]").value.trim(), values: r.querySelector("[data-ov]").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean) };
      }).filter(function (o) { return o.name && o.values.length; });
      var pzOn = f.elements.pz_on.checked;
      var fields = U.$$("[data-pzf-row]", el).map(function (r, i) {
        return { key: "campo_" + (i + 1), label: r.querySelector("[data-fl]").value.trim(), maxLength: parseInt(r.querySelector("[data-fm]").value, 10) || 20, required: r.querySelector("[data-fr]").checked, placeholder: r.querySelector("[data-fp]").value.trim() };
      }).filter(function (x) { return x.label; });
      if (pzOn && !fields.length) throw new Error("Adicione ao menos um campo de personalização.");
      var out = {
        id: p.id, created_at: p.created_at, name: v("name"), slug: S.slugify(v("slug") || v("name")), category: v("category"),
        material: v("material"), finish: v("finish"), description: v("description"), price: S.round2(price), compare_at_price: cmp ? S.round2(cmp) : null,
        stock: v("stock") === "" ? null : parseInt(v("stock"), 10), position: parseInt(v("position"), 10) || 0, active: f.elements.active.checked,
        tags: U.$$('input[name="tag"]:checked', f).map(function (x) { return x.value; }),
        images: images,
        details: { material: v("d_material"), acabamento: v("d_acabamento"), medidas: v("d_medidas"), peso: v("d_peso"), cuidados: v("d_cuidados") },
        options: opts,
        personalization: pzOn ? { title: v("pz_title") || "Personalização", note: v("pz_note"), fields: fields, confirm: f.elements.pz_confirm.checked } : null
      };
      return A.saveProduct(out).then(function () { U.toast(isNew ? "Peça cadastrada." : "Peça atualizada."); go("produtos"); });
    }, isNew ? "Cadastrar peça" : "Salvar peça");

    // fotos
    var imgsBox = el.querySelector("[data-imgs]");
    function drawImgs() {
      imgsBox.innerHTML = images.map(function (src, i) {
        return '<figure><img src="' + esc(src) + '" alt="">' + (i === 0 ? '<span class="first">Principal</span>' : "") +
          '<div class="tools">' + (i > 0 ? '<button type="button" data-mv="' + i + '" aria-label="Mover para a esquerda">‹</button>' : "") +
          '<button type="button" data-rm="' + i + '" aria-label="Remover foto">×</button></div></figure>';
      }).join("") + '<label class="drop" data-drop>' + icon("plus") + "<span>Adicionar fotos</span><input type=\"file\" accept=\"image/*\" multiple hidden></label>";
      var drop = imgsBox.querySelector("[data-drop]"), fi = drop.querySelector("input");
      fi.addEventListener("change", function () { addFiles(fi.files); });
      ["dragover", "dragenter"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove("is-over"); }); });
      drop.addEventListener("drop", function (e) { e.preventDefault(); addFiles(e.dataTransfer.files); });
    }
    function addFiles(files) {
      var arr = Array.prototype.slice.call(files || []);
      if (!arr.length) return;
      imgsBox.querySelector("[data-drop] span").textContent = "Enviando…";
      arr.reduce(function (pr, f) { return pr.then(function () { return upload(f, 1600).then(function (u) { images.push(u); }); }); }, Promise.resolve())
        .catch(fail).then(drawImgs);
    }
    imgsBox.addEventListener("click", function (e) {
      var mv = e.target.closest("[data-mv]"), rm = e.target.closest("[data-rm]");
      if (mv) { var i = +mv.getAttribute("data-mv"); var t = images[i - 1]; images[i - 1] = images[i]; images[i] = t; drawImgs(); }
      if (rm) { images.splice(+rm.getAttribute("data-rm"), 1); drawImgs(); }
    });
    drawImgs();

    // variações
    var optsBox = el.querySelector("[data-opts]");
    function optRow(o) {
      optsBox.insertAdjacentHTML("beforeend", '<div class="repeat__row" data-opt-row><div class="fg-2"><div class="field"><label>Nome</label><input class="input" data-on value="' + esc(o.name || "") + '" placeholder="Aro"></div>' +
        '<div class="field"><label>Valores (separados por vírgula)</label><input class="input" data-ov value="' + esc((o.values || []).join(", ")) + '" placeholder="12, 13, 14"></div></div>' +
        '<button class="small muted" type="button" data-rm-row style="justify-self:start;text-decoration:underline">Remover variação</button></div>');
    }
    (p.options || []).forEach(optRow);
    el.querySelector("[data-add-opt]").addEventListener("click", function () { optRow({}); });

    var pzBox = el.querySelector("[data-pzf]");
    function pzRow(f) {
      pzBox.insertAdjacentHTML("beforeend", '<div class="repeat__row" data-pzf-row><div class="fg-2"><div class="field"><label>Rótulo</label><input class="input" data-fl value="' + esc(f.label || "") + '" placeholder="Texto da gravação"></div>' +
        '<div class="field"><label>Exemplo</label><input class="input" data-fp value="' + esc(f.placeholder || "") + '" placeholder="Ex.: Bella"></div></div>' +
        '<div class="fg-2" style="align-items:end"><div class="field"><label>Máximo de caracteres</label><input class="input" type="number" min="1" max="60" data-fm value="' + (f.maxLength || 20) + '"></div>' +
        '<label class="check" style="padding-bottom:.9rem"><input type="checkbox" data-fr' + (f.required ? " checked" : "") + "> Obrigatório</label></div>" +
        '<button class="small muted" type="button" data-rm-row style="justify-self:start;text-decoration:underline">Remover campo</button></div>');
    }
    (pz.fields || []).forEach(pzRow);
    el.querySelector("[data-add-pzf]").addEventListener("click", function () { pzRow({}); });
    el.querySelector('[name="pz_on"]').addEventListener("change", function () {
      el.querySelector("[data-pz]").hidden = !this.checked;
      if (this.checked && !pzBox.children.length) pzRow({});
    });
    el.addEventListener("click", function (e) { var r = e.target.closest("[data-rm-row]"); if (r) r.parentElement.remove(); });
  }

  // ---------------------------------------------------------------- categorias
  function viewCats(main) {
    A.categories().then(function (cats) {
      state.cats = cats;
      main.innerHTML = head("Categorias", "Organize as coleções exibidas no menu e na página inicial.", '<button class="btn btn--sm" type="button" data-new>' + icon("plus", "icon--sm") + " Nova categoria</button>") +
        '<div class="list">' + cats.map(function (c) {
          var n = state.products.filter(function (p) { return p.category === c.slug; }).length;
          return '<div class="row-item' + (c.active === false ? " is-off" : "") + '"><img src="' + esc(c.image || "") + '" alt=""><div><div class="t">' + esc(c.name) + '</div><div class="m">' + n + " peças · ordem " + (c.position || 0) + (c.active === false ? " · oculta" : "") + "</div></div>" +
            '<div class="acts"><button class="icon-btn" type="button" data-edit="' + esc(c.slug) + '" aria-label="Editar">' + icon("edit", "icon--sm") + '</button><button class="icon-btn icon-btn--danger" type="button" data-del="' + esc(c.slug) + '" aria-label="Excluir">' + icon("close", "icon--sm") + "</button></div></div>";
        }).join("") + "</div>";
      main.addEventListener("click", function (e) {
        var ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
        if (e.target.closest("[data-new]")) catSheet(null);
        if (ed) catSheet(cats.filter(function (c) { return c.slug === ed.getAttribute("data-edit"); })[0]);
        if (del && confirm("Excluir esta categoria?")) A.deleteCategory(del.getAttribute("data-del")).then(function () { U.toast("Categoria excluída."); go("categorias"); }).catch(fail);
      });
    }).catch(fail);
  }
  function catSheet(c) {
    var isNew = !c; c = c ? S.clone(c) : { name: "", slug: "", description: "", image: "", position: state.cats.length + 1, active: true };
    var el = sheet(isNew ? "Nova categoria" : "Editar categoria",
      "<fieldset><legend>Categoria</legend>" + inp("name", "Nome *", c.name) + inp("slug", "Endereço (slug)", c.slug, isNew ? "" : "readonly", isNew ? "" : "O endereço não pode ser alterado depois de criado.") +
      '<div class="field"><label for="p-description">Descrição curta</label><textarea class="textarea" id="p-description" name="description" rows="2">' + esc(c.description) + "</textarea></div>" +
      '<div class="fg-2">' + inp("position", "Ordem", c.position, 'type="number" min="0"') + '<div class="field" style="align-content:end"><label class="switch"><input type="checkbox" name="active"' + (c.active !== false ? " checked" : "") + "> Visível</label></div></div>" +
      '<div class="field"><span class="label">Imagem (4:5)</span><div style="display:flex;gap:1rem;align-items:center"><div data-cimg style="width:110px;aspect-ratio:4/5;background:var(--pearl-3)">' + (c.image ? '<img src="' + esc(c.image) + '" style="width:100%;height:100%;object-fit:cover" alt="">' : "") +
      '</div><label class="btn btn--ghost btn--sm" style="cursor:pointer">Enviar imagem<input type="file" accept="image/*" hidden data-cfile></label></div></div></fieldset>',
      function (el) {
        var f = el.querySelector("form");
        if (!f.elements.name.value.trim()) throw new Error("Informe o nome.");
        var out = { name: f.elements.name.value.trim(), slug: isNew ? S.slugify(f.elements.slug.value || f.elements.name.value) : c.slug, description: f.elements.description.value.trim(), image: c.image, position: parseInt(f.elements.position.value, 10) || 0, active: f.elements.active.checked };
        return A.saveCategory(out, isNew ? null : c.slug).then(function () { U.toast("Categoria salva."); return A.categories().then(function (cs) { state.cats = cs; go("categorias"); }); });
      });
    el.querySelector("[data-cfile]").addEventListener("change", function () {
      var file = this.files[0]; if (!file) return;
      upload(file, 1400).then(function (u) { c.image = u; el.querySelector("[data-cimg]").innerHTML = '<img src="' + esc(u) + '" style="width:100%;height:100%;object-fit:cover" alt="">'; }).catch(fail);
    });
  }

  // ---------------------------------------------------------------- cupons
  function viewCoupons(main) {
    A.coupons().then(function (list) {
      main.innerHTML = head("Cupons", "Descontos válidos na finalização da compra. A validação também acontece no servidor.", '<button class="btn btn--sm" type="button" data-new>' + icon("plus", "icon--sm") + " Novo cupom</button>") +
        (list.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>Código</th><th>Desconto</th><th>Mínimo</th><th>Validade</th><th>Usos</th><th></th></tr></thead><tbody>' +
          list.map(function (c) {
            return "<tr><td><strong>" + esc(c.code) + "</strong>" + (c.active ? "" : ' <span class="muted">(inativo)</span>') + "</td><td>" + (c.kind === "percent" ? c.value + "%" : S.fmt(c.value)) + "</td><td>" + (c.min_subtotal ? S.fmt(c.min_subtotal) : "—") +
              "</td><td>" + (c.expires_at ? new Date(c.expires_at).toLocaleDateString("pt-BR") : "—") + "</td><td>" + (c.used_count || 0) + (c.usage_limit ? " / " + c.usage_limit : "") +
              '</td><td style="text-align:right"><button class="icon-btn" type="button" data-edit="' + esc(c.code) + '" aria-label="Editar">' + icon("edit", "icon--sm") + '</button> <button class="icon-btn icon-btn--danger" type="button" data-del="' + esc(c.code) + '" aria-label="Excluir">' + icon("close", "icon--sm") + "</button></td></tr>";
          }).join("") + "</tbody></table></div>"
          : '<div class="panel"><p class="muted">Nenhum cupom cadastrado.</p></div>');
      main.addEventListener("click", function (e) {
        var ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
        if (e.target.closest("[data-new]")) couponSheet(null);
        if (ed) couponSheet(list.filter(function (c) { return c.code === ed.getAttribute("data-edit"); })[0]);
        if (del && confirm("Excluir o cupom " + del.getAttribute("data-del") + "?")) A.deleteCoupon(del.getAttribute("data-del")).then(function () { go("cupons"); }).catch(fail);
      });
    }).catch(fail);
  }
  function couponSheet(c) {
    var isNew = !c; c = c || { code: "", kind: "percent", value: 10, min_subtotal: 0, expires_at: "", usage_limit: null, used_count: 0, active: true };
    sheet(isNew ? "Novo cupom" : "Editar cupom",
      "<fieldset><legend>Cupom</legend>" + inp("code", "Código *", c.code, (isNew ? "" : "readonly ") + 'style="text-transform:uppercase"') +
      '<div class="fg-2"><div class="field"><label for="p-kind">Tipo</label><select class="select" id="p-kind" name="kind"><option value="percent"' + (c.kind === "percent" ? " selected" : "") + '>Porcentagem</option><option value="fixed"' + (c.kind === "fixed" ? " selected" : "") + ">Valor fixo (R$)</option></select></div>" +
      inp("value", "Valor *", c.value, 'type="number" step="0.01" min="0"') + "</div>" +
      '<div class="fg-3">' + inp("min_subtotal", "Compra mínima (R$)", c.min_subtotal || "", 'type="number" step="0.01" min="0"') + inp("expires_at", "Válido até", c.expires_at ? String(c.expires_at).slice(0, 10) : "", 'type="date"') + inp("usage_limit", "Limite de usos", c.usage_limit || "", 'type="number" min="1"') + "</div>" +
      '<label class="switch"><input type="checkbox" name="active"' + (c.active ? " checked" : "") + "> Ativo</label></fieldset>",
      function (el) {
        var f = el.querySelector("form");
        var val = parseFloat(f.elements.value.value);
        if (!(val > 0)) throw new Error("Informe o valor do desconto.");
        if (f.elements.kind.value === "percent" && val > 100) throw new Error("A porcentagem deve ser no máximo 100.");
        return A.saveCoupon({
          code: f.elements.code.value, kind: f.elements.kind.value, value: val, min_subtotal: parseFloat(f.elements.min_subtotal.value) || 0,
          expires_at: f.elements.expires_at.value ? f.elements.expires_at.value + "T23:59:59-03:00" : null, usage_limit: parseInt(f.elements.usage_limit.value, 10) || null,
          used_count: c.used_count || 0, active: f.elements.active.checked
        }).then(function () { U.toast("Cupom salvo."); go("cupons"); });
      });
  }

  // ---------------------------------------------------------------- página inicial
  function viewHomeTexts(main) {
    main.innerHTML = head("Página inicial", "Textos, imagens e chamada da faixa superior.") +
      '<div class="panel"><h2>Faixa superior</h2>' + sf("announcement", "Mensagem") + "</div>" +
      '<div class="panel"><h2>Campanha principal</h2><p>Use &lt;em&gt;…&lt;/em&gt; no título para o trecho em itálico.</p>' +
      sf("hero.title", "Título") + sf("hero.text", "Subtítulo", { type: "textarea", rows: 2 }) +
      '<div class="fg-2">' + sf("hero.primary", "Botão principal") + sf("hero.secondary", "Botão secundário") + "</div>" +
      '<div class="fg-2">' + sf("hero.image", "Imagem para computador", { type: "image", ratio: "16/9", hint: "Horizontal, mínimo 2000 px. Deixe o lado esquerdo mais limpo para o texto." }) +
      sf("hero.imageMobile", "Imagem para celular", { type: "image", hint: "Vertical 4:5, mínimo 1200 px." }) + "</div></div>" +
      '<div class="panel"><h2>A essência Mais Bella</h2>' + sf("essence.title", "Título") + sf("essence.body", "Texto", { type: "textarea", rows: 7, hint: "Separe os parágrafos com uma linha em branco. Conte a história verdadeira da loja." }) +
      '<div class="fg-2">' + sf("essence.image", "Imagem principal", { type: "image" }) + sf("essence.imageDetail", "Imagem de detalhe", { type: "image", ratio: "1/1" }) + "</div></div>" +
      '<div class="panel"><h2>Presentes</h2>' + sf("gift.title", "Título") + sf("gift.text", "Texto", { type: "textarea", rows: 2 }) + sf("gift.button", "Botão") + sf("gift.image", "Imagem", { type: "image", ratio: "4/3" }) + "</div>" +
      '<div class="panel"><h2>Faixa de confiança</h2><p>Use apenas informações reais da loja.</p>' +
      (state.draft.trust || []).map(function (t, i) { return '<div class="fg-2">' + sf("trust." + i + ".title", "Título " + (i + 1)) + sf("trust." + i + ".text", "Texto " + (i + 1)) + "</div>"; }).join("") + "</div>" +
      '<div class="panel"><h2>SEO</h2>' + sf("seo.title", "Título da página inicial") + sf("seo.description", "Descrição para o Google", { type: "textarea", rows: 2 }) + "</div>";
    bindSettings(main);
  }

  // ---------------------------------------------------------------- loja
  function viewStore(main) {
    main.innerHTML = head("Loja e atendimento", "Canais de contato, identidade e dados legais.") +
      '<div class="panel"><h2>Atendimento</h2>' +
      sf("whatsapp", "WhatsApp comercial", { ph: "5511999999999", hint: "Formato internacional, só números: 55 + DDD + número." }) +
      '<div class="fg-2">' + sf("instagram", "Link do Instagram", { ph: "https://instagram.com/maisbella" }) + sf("email", "E-mail de atendimento", { type: "email" }) + "</div>" +
      sf("hours", "Horário de atendimento", { ph: "Segunda a sexta, 9h às 18h" }) + "</div>" +
      '<div class="panel"><h2>Mensagens automáticas do WhatsApp</h2><p>Preenchidas para a cliente, que decide se envia.</p>' +
      sf("wa.general", "Dúvidas gerais", { type: "textarea", rows: 2 }) + sf("wa.product", "Dúvida sobre uma peça (o nome e o link são adicionados)", { type: "textarea", rows: 2 }) + sf("wa.rings", "Alianças e personalização", { type: "textarea", rows: 2 }) + "</div>" +
      '<div class="panel"><h2>Identidade</h2>' + sf("logoUrl", "Logotipo (opcional)", { type: "image", ratio: "3/1", hint: "PNG ou SVG com fundo transparente. Sem logotipo, o site usa a versão tipográfica." }) +
      sf("tagline", "Frase do rodapé") + "</div>" +
      '<div class="panel"><h2>Dados legais</h2><p>Exigidos pelo Decreto 7.962/2013 para lojas online.</p>' +
      '<div class="fg-2">' + sf("legal.company", "Razão social") + sf("legal.cnpj", "CNPJ") + "</div>" + sf("legal.address", "Endereço") + "</div>";
    bindSettings(main);
  }

  // ---------------------------------------------------------------- vendas
  function viewSales(main) {
    var d = state.draft;
    main.innerHTML = head("Pagamento e entrega", "Só ative o que estiver realmente configurado.") +
      '<div class="panel"><h2>Formas de pagamento</h2>' +
      (S.live ? "<p>Pix e cartão usam o Mercado Pago. Configure o token de acesso nas funções do Supabase (veja o README) antes de ativar.</p>" : '<div class="notice">' + icon("info", "icon--sm") + "<span>Na demonstração, Pix e cartão aparecem como “disponível após ativação”. Eles passam a funcionar ao conectar o Supabase e o Mercado Pago.</span></div>") +
      sf("payments.pix", "Pix", { type: "switch" }) + sf("payments.card", "Cartão de crédito", { type: "switch" }) +
      sf("payments.whatsapp", "Permitir finalizar e combinar o pagamento pelo WhatsApp", { type: "switch" }) +
      sf("payments.pixDiscount", "Desconto no Pix (%)", { type: "number", step: "1" }) + "</div>" +
      '<div class="panel"><h2>Parcelamento</h2><p>Exibido nos produtos apenas se o cartão estiver ativo. Deve refletir o que o provedor oferece.</p>' +
      sf("installments.enabled", "Mostrar parcelamento sem juros", { type: "switch" }) +
      '<div class="fg-2">' + sf("installments.max", "Máximo de parcelas", { type: "number", step: "1" }) + sf("installments.minInstallment", "Parcela mínima (R$)", { type: "number" }) + "</div></div>" +
      '<div class="panel"><h2>Entrega</h2><p>Opções fixas exibidas no checkout. Para cálculo automático pelos Correios e transportadoras, ative o Melhor Envio (requer token no servidor).</p>' +
      '<div class="repeat" data-ship></div><button class="btn btn--ghost btn--sm" type="button" data-add-ship style="justify-self:start">' + icon("plus", "icon--sm") + " Adicionar forma de entrega</button>" +
      sf("shipping.melhorEnvio", "Calcular frete pelo Melhor Envio", { type: "switch" }) + sf("shipping.originCep", "CEP de origem dos envios") + "</div>" +
      '<div class="panel"><h2>Presentes e encomendas</h2>' + sf("giftWrap.enabled", "Oferecer embalagem para presente", { type: "switch" }) +
      '<div class="fg-2">' + sf("giftWrap.label", "Nome da opção") + sf("giftWrap.price", "Valor (R$, 0 = sem custo)", { type: "number" }) + "</div>" +
      sf("personalizedLeadTime", "Prazo de produção de peças personalizadas", { hint: "Aparece nas peças com gravação. Ex.: Produção em até 7 dias úteis após o pagamento." }) + "</div>";
    bindSettings(main);
    var box = U.$("[data-ship]", main);
    function draw() {
      box.innerHTML = (d.shipping.methods || []).map(function (m, i) {
        return '<div class="repeat__row repeat__row--ship" data-i="' + i + '">' +
          '<div class="field"><label>Nome</label><input class="input" data-k="name" value="' + esc(m.name) + '"></div>' +
          '<div class="field"><label>Valor (R$)</label><input class="input" type="number" step="0.01" min="0" data-k="price" value="' + esc(m.price) + '"></div>' +
          '<div class="field"><label>Prazo</label><input class="input" data-k="days" value="' + esc(m.days || "") + '" placeholder="5 a 9 dias úteis"></div>' +
          '<div class="field"><label>Grátis acima de</label><input class="input" type="number" step="0.01" min="0" data-k="freeAbove" value="' + esc(m.freeAbove || "") + '"></div>' +
          '<button class="icon-btn icon-btn--danger" type="button" data-rm aria-label="Remover">' + icon("close", "icon--sm") + "</button></div>";
      }).join("") || '<p class="muted small">Nenhuma forma de entrega cadastrada. Sem opções, o frete é combinado com a cliente.</p>';
    }
    box.addEventListener("input", function (e) {
      var row = e.target.closest("[data-i]"); if (!row) return;
      var m = d.shipping.methods[+row.getAttribute("data-i")], k = e.target.getAttribute("data-k");
      m[k] = (k === "price" || k === "freeAbove") ? (parseFloat(e.target.value) || 0) : e.target.value;
      if (k === "name") m.id = S.slugify(e.target.value) || m.id;
      setDirty();
    });
    box.addEventListener("click", function (e) { var r = e.target.closest("[data-rm]"); if (r) { d.shipping.methods.splice(+r.closest("[data-i]").getAttribute("data-i"), 1); draw(); setDirty(); } });
    U.$("[data-add-ship]", main).addEventListener("click", function () { d.shipping.methods = d.shipping.methods || []; d.shipping.methods.push({ id: "entrega-" + (d.shipping.methods.length + 1), name: "", price: 0, days: "", freeAbove: 0 }); draw(); setDirty(); });
    draw();
  }

  // ---------------------------------------------------------------- páginas
  function viewPages(main) {
    var keys = [["sobre", "Nossa história"], ["contato", "Fale conosco"], ["entrega", "Entrega e frete"], ["trocas", "Trocas e devoluções"], ["garantia", "Garantia"], ["privacidade", "Privacidade"], ["termos", "Termos de compra"], ["faq", "Perguntas frequentes"]];
    main.innerHTML = head("Páginas", "Textos institucionais. Trechos destacados em rosa no site indicam informações que a loja precisa completar.") +
      '<div class="toolbar-adm"><select class="select" data-pg>' + keys.map(function (k) { return '<option value="' + k[0] + '">' + k[1] + "</option>"; }).join("") + '</select><a class="btn btn--ghost btn--sm" data-view target="_blank" href="sobre.html">Ver página</a></div><div data-ed></div>';
    var sel = U.$("[data-pg]", main);
    function draw() {
      var k = sel.value;
      U.$("[data-view]", main).href = k + ".html";
      var html = '<div class="panel">' + sf("pages." + k + ".title", "Título") +
        sf("pages." + k + ".body", "Conteúdo (HTML simples)", { type: "textarea", rows: 14, hint: "Use &lt;p&gt; para parágrafos, &lt;h3&gt; para subtítulos, &lt;ul&gt;&lt;li&gt; para listas. Remova os trechos com class=\"pending\" depois de completá-los." }) + "</div>";
      if (k === "faq") {
        html += '<div class="panel"><h2>Perguntas</h2><div class="repeat" data-faq>' + (state.draft.pages.faq.faq || []).map(function (f, i) {
          return '<div class="repeat__row">' + sf("pages.faq.faq." + i + ".q", "Pergunta") + sf("pages.faq.faq." + i + ".a", "Resposta", { type: "textarea", rows: 3 }) + "</div>";
        }).join("") + '</div><button class="btn btn--ghost btn--sm" type="button" data-add-faq style="justify-self:start">' + icon("plus", "icon--sm") + " Adicionar pergunta</button></div>";
      }
      U.$("[data-ed]", main).innerHTML = html;
      bindSettings(U.$("[data-ed]", main));
      var add = U.$("[data-add-faq]", main);
      if (add) add.addEventListener("click", function () { state.draft.pages.faq.faq.push({ q: "", a: "" }); setDirty(); draw(); });
    }
    sel.addEventListener("change", draw);
    draw();
  }
})();
