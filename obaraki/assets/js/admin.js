/* ==========================================================================
   OBARAKI · PAINEL ADMINISTRATIVO
   Edita uma cópia dos dados e salva no navegador (pré-visualização imediata
   no site, neste mesmo navegador). Para publicar para todos os clientes,
   baixe o arquivo de dados e substitua data/cardapio.js.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.OBK.store;
  var U = window.OBK.ui;
  var esc = U.esc;
  var icon = U.icon;
  var $ = U.$;
  var $$ = U.$$;

  var app = $("#admin");
  var PIN_KEY = "obk.admin.pin";
  var SESSION_KEY = "obk.admin.session";

  var VIEWS = [
    { id: "pedidos", label: "Pedidos", ic: "bag" },
    { id: "produtos", label: "Produtos", ic: "book" },
    { id: "categorias", label: "Categorias", ic: "menu" },
    { id: "combos", label: "Combos", ic: "fish" },
    { id: "promocoes", label: "Promoções", ic: "card" },
    { id: "config", label: "Configurações", ic: "store" }
  ];

  var STATUS = [
    { id: "novo", label: "Novo" },
    { id: "preparo", label: "Em preparo" },
    { id: "entrega", label: "Saiu para entrega" },
    { id: "concluido", label: "Concluído" },
    { id: "cancelado", label: "Cancelado" }
  ];

  var D;
  var view = "pedidos";
  var filters = { q: "", cat: "", status: "" };

  function fresh() {
    D = S.clone(S.data);
  }

  function commit(msg) {
    var ok = S.saveData(D);
    if (!ok) {
      U.toast("Não foi possível salvar: espaço do navegador cheio. Use imagens menores.");
      fresh();
      return false;
    }
    fresh();
    if (msg) U.toast(msg);
    renderShell();
    return true;
  }

  /* ---------- Utilidades ---------- */

  function slug(s) {
    return S.fold(s)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "item";
  }

  function uniqueId(base, list) {
    var id = slug(base);
    var n = 2;
    var ids = list.map(function (x) {
      return x.id;
    });
    var out = id;
    while (ids.indexOf(out) !== -1) out = id + "-" + n++;
    return out;
  }

  function num(v) {
    if (v === "" || v === null || v === undefined) return null;
    var s = String(v).replace(/[^\d,\.-]/g, "");
    if (s.indexOf(",") !== -1) s = s.replace(/\./g, "").replace(",", ".");
    var n = parseFloat(s);
    return isNaN(n) ? null : Math.round(n * 100) / 100;
  }

  function moneyInput(v) {
    return v === null || v === undefined || v === "" ? "" : Number(v).toFixed(2).replace(".", ",");
  }

  function hashPin(pin) {
    var salted = "obk:" + pin;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(salted)).then(function (buf) {
        return Array.prototype.map
          .call(new Uint8Array(buf), function (b) {
            return ("0" + b.toString(16)).slice(-2);
          })
          .join("");
      });
    }
    var h = 5381;
    for (var i = 0; i < salted.length; i++) h = ((h << 5) + h + salted.charCodeAt(i)) | 0;
    return Promise.resolve("d" + (h >>> 0).toString(16));
  }

  function download(name, content, type) {
    var blob = new Blob([content], { type: type || "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }

  function readImage(file, max) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) return reject(new Error("tipo"));
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var scale = Math.min(1, (max || 1000) / Math.max(img.width, img.height));
          var c = document.createElement("canvas");
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          var url = c.toDataURL("image/webp", 0.8);
          if (url.indexOf("data:image/webp") !== 0) url = c.toDataURL("image/jpeg", 0.82);
          resolve(url);
        };
        img.onerror = reject;
        img.src = r.result;
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function catName(id) {
    var c = D.categories.filter(function (x) {
      return x.id === id;
    })[0];
    return c ? c.name : "Sem categoria";
  }

  function kanji(p) {
    if (p.kind === "executivo") return "定食";
    var c = D.categories.filter(function (x) {
      return x.id === p.category;
    })[0];
    return (c && c.kanji) || "寿司";
  }

  function thumb(src, k) {
    return '<div class="media">' + U.mediaHTML(src, "", k) + "</div>";
  }

  function sw(name, checked, label, attrs) {
    return (
      '<label class="switch"><input type="checkbox" name="' +
      name +
      '"' +
      (checked ? " checked" : "") +
      " " +
      (attrs || "") +
      '><span class="track"></span>' +
      (label ? "<span>" + label + "</span>" : '<span class="sr-only">Ativo</span>') +
      "</label>"
    );
  }

  /* ---------- Acesso ---------- */

  function renderLock() {
    var hasPin = !!localStorage.getItem(PIN_KEY);
    app.innerHTML =
      '<div class="lock"><form class="lock-card" data-lock>' +
      U.brandHTML() +
      (hasPin
        ? '<h1>Painel</h1><p>Digite seu PIN para entrar.</p><div class="form-grid"><div class="field" data-field="pin"><label for="pin" class="sr-only">PIN</label><input class="input" id="pin" type="password" inputmode="numeric" autocomplete="current-password" maxlength="8" required><span class="error">PIN incorreto.</span></div></div>'
        : '<h1>Criar acesso</h1><p>Crie um PIN de 4 a 8 números para abrir o painel neste aparelho.</p><div class="form-grid"><div class="field"><label for="pin">Novo PIN</label><input class="input" id="pin" type="password" inputmode="numeric" autocomplete="new-password" maxlength="8" required></div><div class="field" data-field="pin"><label for="pin2">Repita o PIN</label><input class="input" id="pin2" type="password" inputmode="numeric" autocomplete="new-password" maxlength="8" required><span class="error">Os PINs não conferem ou têm menos de 4 números.</span></div></div>') +
      '<button class="btn btn-primary btn-block" style="margin-top:20px">' +
      (hasPin ? "Entrar" : "Criar e entrar") +
      "</button>" +
      (hasPin ? '<button type="button" class="link-remove" data-forgot style="margin-top:14px">Esqueci o PIN</button>' : "") +
      '<a class="link-remove" href="index.html" style="display:block;margin-top:6px">Voltar ao site</a>' +
      "</form></div>";

    var form = $("[data-lock]");
    setTimeout(function () {
      $("#pin").focus();
    }, 50);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pin = S.digits($("#pin").value);
      if (hasPin) {
        hashPin(pin).then(function (h) {
          if (h === localStorage.getItem(PIN_KEY)) {
            sessionStorage.setItem(SESSION_KEY, "1");
            start();
          } else {
            $('[data-field="pin"]').classList.add("is-invalid");
            $("#pin").select();
          }
        });
      } else {
        var pin2 = S.digits($("#pin2").value);
        if (pin.length < 4 || pin !== pin2) {
          $('[data-field="pin"]').classList.add("is-invalid");
          return;
        }
        hashPin(pin).then(function (h) {
          localStorage.setItem(PIN_KEY, h);
          sessionStorage.setItem(SESSION_KEY, "1");
          start();
        });
      }
    });
    var forgot = $("[data-forgot]");
    if (forgot)
      forgot.onclick = function () {
        var ok = window.prompt('Para redefinir o PIN deste aparelho, digite REDEFINIR. Os dados do cardápio não são apagados.');
        if (ok && ok.trim().toUpperCase() === "REDEFINIR") {
          localStorage.removeItem(PIN_KEY);
          renderLock();
        }
      };
  }

  /* ---------- Estrutura ---------- */

  function counts() {
    return {
      pedidos: S.orders().filter(function (o) {
        return o.status === "novo";
      }).length,
      produtos: D.products.length,
      categorias: D.categories.length,
      combos: D.products.filter(function (p) {
        return p.category === "combos";
      }).length,
      promocoes: D.promotions.length
    };
  }

  function renderShell() {
    var c = counts();
    if (!$(".adm", app)) {
      app.innerHTML =
        '<div class="adm">' +
        '<aside class="adm-side">' +
        '<div class="adm-side-top">' +
        U.brandHTML() +
        '<span class="adm-tag">Painel</span></div>' +
        '<nav class="adm-nav" aria-label="Seções do painel" data-nav></nav>' +
        '<div class="adm-side-foot"><a class="btn btn-ghost btn-sm" href="index.html" target="_blank" rel="noopener">Ver site</a><button class="btn btn-ghost btn-sm" data-act="logout">Sair</button></div>' +
        "</aside>" +
        '<main class="adm-main"><div data-banner></div><div data-view></div></main>' +
        "</div>" +
        '<aside class="sheet" data-sheet role="dialog" aria-modal="true" aria-hidden="true"></aside>';
    }
    renderNav(c);
    renderBanner();
    renderView();
  }

  function renderNav(c) {
    c = c || counts();
    $("[data-nav]").innerHTML =
      VIEWS.map(function (v) {
        var n = c[v.id];
        return (
          '<button type="button" data-view-btn="' +
          v.id +
          '"' +
          (v.id === view ? ' class="is-active" aria-current="page"' : "") +
          ">" +
          icon(v.ic) +
          v.label +
          (n ? '<span class="n">' + n + "</span>" : "") +
          "</button>"
        );
      }).join("") + '<a class="only-mobile" href="index.html" target="_blank" rel="noopener">' + icon("home") + "Ver site</a>";
  }

  function renderBanner() {
    var b = $("[data-banner]");
    if (S.isDraft) {
      b.innerHTML =
        '<div class="draft-bar"><span><b>Alterações salvas neste navegador.</b> Você já vê tudo no site por aqui. Para os clientes verem, publique o arquivo de dados.</span><div class="actions"><button class="btn btn-light btn-sm" data-act="publish">Baixar para publicar</button><button class="btn btn-ghost btn-sm" data-act="discard">Descartar</button></div></div>';
    } else if (S.staleDraft) {
      b.innerHTML =
        '<div class="draft-bar"><span>Um rascunho antigo deste navegador foi ignorado porque o site publicado foi atualizado.</span></div>';
    } else b.innerHTML = "";
  }

  function renderView() {
    var el = $("[data-view]");
    var html = "";
    if (view === "pedidos") html = viewOrders();
    if (view === "produtos") html = viewProducts();
    if (view === "categorias") html = viewCategories();
    if (view === "combos") html = viewCombos();
    if (view === "promocoes") html = viewPromos();
    if (view === "config") html = viewConfig();
    el.innerHTML = html;
    if (view === "config") bindConfig();
    U.hydrate(el);
  }

  function head(eyebrow, title, desc, actions) {
    return (
      '<div class="adm-head"><div><span class="eyebrow">' +
      eyebrow +
      "</span><h1>" +
      title +
      "</h1>" +
      (desc ? "<p>" + desc + "</p>" : "") +
      "</div>" +
      (actions ? '<div class="actions">' + actions + "</div>" : "") +
      "</div>"
    );
  }

  /* ---------- Pedidos ---------- */

  function viewOrders() {
    var all = S.orders();
    var today = new Date().toDateString();
    var todays = all.filter(function (o) {
      return new Date(o.createdAt).toDateString() === today && o.status !== "cancelado";
    });
    var revenue = todays.reduce(function (s, o) {
      return s + o.total;
    }, 0);
    var valid = all.filter(function (o) {
      return o.status !== "cancelado";
    });
    var avg = valid.length
      ? valid.reduce(function (s, o) {
          return s + o.total;
        }, 0) / valid.length
      : 0;
    var list = filters.status
      ? all.filter(function (o) {
          return o.status === filters.status;
        })
      : all;

    return (
      head("Dashboard", "Pedidos", "Pedidos finalizados pelo site neste navegador. Todo pedido também chega no WhatsApp da loja como mensagem organizada.") +
      '<div class="stats">' +
      stat("Pedidos hoje", todays.length) +
      stat("Faturamento hoje", S.money(revenue)) +
      stat("Ticket médio", S.money(avg)) +
      stat("Total de pedidos", all.length) +
      "</div>" +
      pendingPanel() +
      '<div class="chips" style="margin-bottom:14px">' +
      '<button class="chip' +
      (!filters.status ? " is-active" : "") +
      '" data-act="status-filter" data-v="">Todos</button>' +
      STATUS.map(function (s) {
        return '<button class="chip' + (filters.status === s.id ? " is-active" : "") + '" data-act="status-filter" data-v="' + s.id + '">' + s.label + "</button>";
      }).join("") +
      "</div>" +
      '<div class="rows">' +
      (list.length
        ? list.map(orderRow).join("")
        : '<div class="empty-note">Nenhum pedido por aqui ainda. Quando um cliente finalizar pelo site neste navegador, ele aparece nesta lista.</div>') +
      "</div>"
    );
  }

  function stat(label, value) {
    return '<div class="stat"><span>' + label + "</span><b>" + value + "</b></div>";
  }

  function pendingPanel() {
    var noPhoto = D.products.filter(function (p) {
      return p.active !== false && !p.image;
    }).length;
    var noPrice = D.products.filter(function (p) {
      return p.active !== false && (p.price === null || p.price === "");
    }).length;
    var noComp = D.products.filter(function (p) {
      return p.active !== false && (p.kind === "combo" || p.kind === "executivo") && !(p.composition || []).length;
    }).length;
    var emptyCats = D.categories.filter(function (c) {
      return (
        c.active !== false &&
        !D.products.some(function (p) {
          return p.category === c.id && p.active !== false;
        })
      );
    }).length;
    var s = D.settings;
    var items = [];
    if (noPhoto) items.push(["produtos", noPhoto + " produtos sem foto"]);
    if (noComp) items.push(["combos", noComp + " combos sem composição"]);
    if (noPrice) items.push(["produtos", noPrice + " produtos com preço sob consulta"]);
    if (emptyCats) items.push(["categorias", emptyCats + " categorias sem produtos"]);
    if (!s.instagramUrl) items.push(["config", "Link do Instagram não configurado"]);
    if (!s.ifoodUrl) items.push(["config", "Link do iFood não configurado"]);
    if (!items.length) return "";
    return (
      '<div class="panel"><h2>Para completar o site</h2><p class="lead">Itens que ainda dependem de informações da loja.</p><div class="chips">' +
      items
        .map(function (it) {
          return '<button class="chip" data-view-btn="' + it[0] + '">' + esc(it[1]) + "</button>";
        })
        .join("") +
      "</div></div>"
    );
  }

  function orderRow(o) {
    var d = new Date(o.createdAt);
    var st = STATUS.filter(function (s) {
      return s.id === o.status;
    })[0] || STATUS[0];
    var phone = S.digits(o.customer.phone);
    return (
      '<details class="order-row"><summary><div><div class="who">' +
      esc(o.customer.name) +
      ' <span class="mini-tag" style="margin-left:6px">' +
      esc(o.id) +
      '</span></div><div class="when">' +
      d.toLocaleDateString("pt-BR") +
      " " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) +
      " · " +
      o.items.length +
      (o.items.length > 1 ? " itens" : " item") +
      " · " +
      esc(S.PAYMENT_LABELS[o.payment.method] || "") +
      '</div></div><div><div class="total">' +
      S.money(o.total) +
      '</div><div class="when st-' +
      st.id +
      '" style="text-align:right;font-weight:700">' +
      st.label +
      "</div></div></summary>" +
      '<div class="order-body"><pre>' +
      esc(S.orderMessage(o)) +
      "</pre>" +
      '<div class="actions">' +
      '<select class="input status-select" data-act="order-status" data-id="' +
      esc(o.id) +
      '" aria-label="Status do pedido">' +
      STATUS.map(function (s) {
        return '<option value="' + s.id + '"' + (s.id === o.status ? " selected" : "") + ">" + s.label + "</option>";
      }).join("") +
      "</select>" +
      '<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?phone=' +
      (phone.length <= 11 ? "55" : "") +
      phone +
      '">WhatsApp do cliente</a>' +
      '<button class="btn btn-ghost btn-sm" data-act="order-delete" data-id="' +
      esc(o.id) +
      '">Excluir</button>' +
      "</div></div></details>"
    );
  }

  /* ---------- Produtos ---------- */

  function productBadges(p) {
    var t = [];
    if (p.kind === "combo") t.push('<span class="mini-tag">Combo</span>');
    if (p.kind === "executivo") t.push('<span class="mini-tag">Executivo</span>');
    if (p.featured) t.push('<span class="mini-tag ok">Favorito</span>');
    if (
      D.promotions.some(function (x) {
        return x.productId === p.id && x.active !== false;
      })
    )
      t.push('<span class="mini-tag red">Promoção</span>');
    if (!p.image) t.push('<span class="mini-tag warn">Sem foto</span>');
    if (p.price === null) t.push('<span class="mini-tag warn">Sob consulta</span>');
    return t.join("");
  }

  function productRow(p) {
    return (
      '<div class="row' +
      (p.active === false ? " is-off" : "") +
      '">' +
      thumb(p.image, kanji(p)) +
      '<div class="row-main"><div class="row-title">' +
      esc(p.name) +
      productBadges(p) +
      '</div><div class="row-sub">' +
      esc(catName(p.category)) +
      (p.quantity ? " · " + esc(p.quantity) : "") +
      (p.price !== null ? " · " + S.money(p.price) : "") +
      "</div></div>" +
      '<div class="row-price"><label class="sr-only" for="pr-' +
      esc(p.id) +
      '">Preço</label><input class="input price-input" id="pr-' +
      esc(p.id) +
      '" inputmode="decimal" placeholder="Consulta" value="' +
      moneyInput(p.price) +
      '" data-act="price" data-id="' +
      esc(p.id) +
      '"></div>' +
      '<div class="row-actions">' +
      sw("active", p.active !== false, "", 'data-act="toggle-product" data-id="' + esc(p.id) + '"') +
      '<button class="icon-btn" data-act="edit-product" data-id="' +
      esc(p.id) +
      '" aria-label="Editar ' +
      esc(p.name) +
      '">' +
      '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>' +
      "</button>" +
      '<button class="icon-btn" data-act="delete-product" data-id="' +
      esc(p.id) +
      '" aria-label="Excluir ' +
      esc(p.name) +
      '">' +
      icon("trash", "icon-sm") +
      "</button></div></div>"
    );
  }

  function viewProducts() {
    var q = S.fold(filters.q);
    var list = D.products.filter(function (p) {
      if (filters.cat && p.category !== filters.cat) return false;
      if (q && S.fold(p.name + " " + p.description).indexOf(q) === -1) return false;
      return true;
    });
    return (
      head("Cardápio", "Produtos", "Adicione, edite, altere preços e fotos, e ative ou desative itens do cardápio.", '<button class="btn btn-primary btn-sm" data-act="new-product">' + icon("plus", "icon-sm") + "Novo produto</button>") +
      '<div class="toolbar"><input class="input grow" type="search" placeholder="Buscar produto" value="' +
      esc(filters.q) +
      '" data-act="filter-q" aria-label="Buscar produto">' +
      '<select class="input" data-act="filter-cat" aria-label="Filtrar por categoria"><option value="">Todas as categorias</option>' +
      D.categories
        .map(function (c) {
          return '<option value="' + esc(c.id) + '"' + (filters.cat === c.id ? " selected" : "") + ">" + esc(c.name) + "</option>";
        })
        .join("") +
      "</select></div>" +
      '<div class="rows" data-product-rows>' +
      (list.length ? list.map(productRow).join("") : '<div class="empty-note">Nenhum produto encontrado.</div>') +
      "</div>"
    );
  }

  /* Formulário de produto/combo */
  var sheet, editing;

  function openSheet(html) {
    sheet = $("[data-sheet]");
    sheet.innerHTML = html;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    $(".overlay").classList.add("is-open");
    document.body.classList.add("is-locked");
    setTimeout(function () {
      var f = $(".input", sheet);
      if (f) f.focus({ preventScroll: true });
    }, 80);
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    $(".overlay").classList.remove("is-open");
    document.body.classList.remove("is-locked");
    editing = null;
  }

  function productForm(p, isNew) {
    editing = { type: "product", isNew: isNew, data: S.clone(p) };
    var cats = D.categories
      .map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === p.category ? " selected" : "") + ">" + esc(c.name) + "</option>";
      })
      .join("");
    var isCombo = p.category === "combos" || p.kind === "combo" || p.kind === "executivo";
    openSheet(
      '<div class="drawer-head"><div><h2>' +
        (isNew ? (isCombo ? "Novo combo" : "Novo produto") : "Editar") +
        "</h2><small>" +
        (isNew ? "Preencha e salve" : esc(p.name)) +
        '</small></div><button class="icon-btn" data-act="close-sheet" aria-label="Fechar">' +
        icon("close") +
        "</button></div>" +
        '<form class="drawer-body" data-product-form novalidate><div class="form-grid">' +
        imgField("image", p.image, kanji(p)) +
        '<div class="field" data-field="name"><label for="pf-name">Nome</label><input class="input" id="pf-name" name="name" value="' +
        esc(p.name) +
        '" required maxlength="60"><span class="error">Informe o nome.</span></div>' +
        '<div class="row-2"><div class="field"><label for="pf-cat">Categoria</label><select class="input" id="pf-cat" name="category">' +
        cats +
        '</select></div><div class="field"><label for="pf-kind">Tipo</label><select class="input" id="pf-kind" name="kind">' +
        [
          ["", "Produto"],
          ["combo", "Combo"],
          ["executivo", "Executivo"]
        ]
          .map(function (k) {
            return '<option value="' + k[0] + '"' + ((p.kind || "") === k[0] ? " selected" : "") + ">" + k[1] + "</option>";
          })
          .join("") +
        "</select></div></div>" +
        '<div class="row-2"><div class="field"><label for="pf-price">Preço (R$)</label><input class="input" id="pf-price" name="price" inputmode="decimal" placeholder="Vazio = sob consulta" value="' +
        moneyInput(p.price) +
        '"></div><div class="field"><label for="pf-qty">Quantidade <span class="opt">(opcional)</span></label><input class="input" id="pf-qty" name="quantity" placeholder="Ex.: 10 unidades, 30 peças" value="' +
        esc(p.quantity) +
        '" maxlength="40"></div></div>' +
        '<div class="field"><label for="pf-desc">Descrição <span class="opt">(opcional)</span></label><textarea class="input" id="pf-desc" name="description" maxlength="220">' +
        esc(p.description) +
        "</textarea></div>" +
        '<div class="field"><label for="pf-comp">Composição <span class="opt">(uma linha por item)</span></label><textarea class="input" id="pf-comp" name="composition" placeholder="Ex.:\n10 sashimis de salmão\n8 uramakis\n4 niguiris" style="min-height:130px">' +
        esc((p.composition || []).join("\n")) +
        "</textarea></div>" +
        '<div class="field"><span class="label">Adicionais <span class="opt">(opcional)</span></span><div data-opts>' +
        optsHTML(p.options || []) +
        '</div><button type="button" class="link-more" data-act="add-opt" style="margin-top:6px">' +
        icon("plus") +
        "Adicionar opção</button></div>" +
        '<div class="field" style="gap:14px">' +
        sw("featured", !!p.featured, "Mostrar em “Os favoritos da ObaraKi”") +
        sw("active", p.active !== false, "Produto ativo no site") +
        "</div>" +
        "</div></form>" +
        '<div class="drawer-foot">' +
        (isNew ? "" : '<button class="btn btn-ghost" data-act="duplicate-product">Duplicar</button>') +
        '<button class="btn btn-primary" data-act="save-product">Salvar</button></div>'
    );
    bindImgField("image", function (url) {
      editing.data.image = url;
    });
  }

  function optsHTML(opts) {
    return opts
      .map(function (o, i) {
        return (
          '<div class="opt-row" data-opt="' +
          i +
          '"><input class="input" name="opt-name" placeholder="Ex.: Adicionar fritura" value="' +
          esc(o.name) +
          '" aria-label="Nome da opção"><input class="input" name="opt-price" inputmode="decimal" placeholder="R$" value="' +
          moneyInput(o.price) +
          '" aria-label="Preço da opção"><button type="button" class="icon-btn" data-act="rm-opt" data-i="' +
          i +
          '" aria-label="Remover opção">' +
          icon("trash", "icon-sm") +
          "</button></div>"
        );
      })
      .join("");
  }

  function readOpts() {
    return $$("[data-opt]", sheet)
      .map(function (row, i) {
        var prev = (editing.data.options || [])[i] || {};
        var name = $("[name=opt-name]", row).value.trim();
        return { id: prev.id || slug(name) || "opcao-" + (i + 1), name: name, price: num($("[name=opt-price]", row).value) || 0 };
      })
      .filter(function (o) {
        return o.name;
      });
  }

  function imgField(name, src, k) {
    return (
      '<div class="field"><span class="label">Foto</span><div class="img-field" data-img="' +
      name +
      '">' +
      '<div class="media" data-img-preview>' +
      U.mediaHTML(src, "", k) +
      "</div>" +
      '<div><input class="input" name="' +
      name +
      '-path" placeholder="assets/img/produtos/arquivo.jpg" value="' +
      (src && src.indexOf("data:") !== 0 ? esc(src) : "") +
      '" aria-label="Caminho da imagem">' +
      '<div class="btns"><label class="btn btn-ghost btn-sm" style="cursor:pointer">Enviar foto<input type="file" accept="image/*"></label>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-img-clear>Remover</button></div>' +
      '<span class="help" data-img-help style="display:block;margin-top:6px">' +
      (src && src.indexOf("data:") === 0 ? "Foto enviada (salva neste navegador)." : "Envie uma foto ou informe o caminho do arquivo.") +
      "</span></div></div></div>"
    );
  }

  function bindImgField(name, onChange) {
    var box = $('[data-img="' + name + '"]', sheet || document);
    if (!box) return;
    var preview = $("[data-img-preview]", box);
    var help = $("[data-img-help]", box);
    var path = $("[name=" + name + "-path]", box);
    function show(url) {
      preview.innerHTML = U.mediaHTML(url, "", "寿司");
      U.hydrate(preview);
    }
    $("input[type=file]", box).addEventListener("change", function (e) {
      var f = e.target.files[0];
      if (!f) return;
      help.textContent = "Otimizando imagem…";
      readImage(f, 1000)
        .then(function (url) {
          onChange(url);
          path.value = "";
          show(url);
          help.textContent = "Foto otimizada (" + Math.round((url.length * 0.75) / 1024) + " KB). Salve para aplicar.";
        })
        .catch(function () {
          help.textContent = "Não foi possível ler este arquivo. Use JPG, PNG ou WEBP.";
        });
    });
    path.addEventListener("change", function () {
      var v = path.value.trim();
      onChange(v);
      show(v);
    });
    $("[data-img-clear]", box).addEventListener("click", function () {
      onChange("");
      path.value = "";
      show("");
      help.textContent = "Sem foto. O site mostra a moldura da categoria.";
    });
  }

  function saveProduct(asCopy) {
    var f = $("[data-product-form]", sheet);
    var name = f.name.value.trim();
    if (!name) {
      $('[data-field="name"]', sheet).classList.add("is-invalid");
      f.name.focus();
      return;
    }
    var p = editing.data;
    p.name = name;
    p.category = f.category.value;
    p.kind = f.kind.value;
    p.price = num(f.price.value);
    p.quantity = f.quantity.value.trim();
    p.description = f.description.value.trim();
    p.composition = f.composition.value
      .split("\n")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    p.options = readOpts();
    p.featured = f.featured.checked;
    p.active = f.active.checked;
    var pathVal = $("[name=image-path]", sheet).value.trim();
    if (pathVal) p.image = pathVal;

    if (editing.isNew || asCopy) {
      p.id = uniqueId(asCopy ? p.name + " copia" : p.name, D.products);
      if (asCopy) p.name = p.name + " (cópia)";
      D.products.push(p);
    } else {
      D.products = D.products.map(function (x) {
        return x.id === p.id ? p : x;
      });
    }
    var wasNew = editing.isNew;
    closeSheet();
    commit(asCopy ? "Produto duplicado" : wasNew ? "Produto criado" : "Produto salvo");
  }

  /* ---------- Categorias ---------- */

  function viewCategories() {
    return (
      head("Cardápio", "Categorias", "Ordem, nomes e visibilidade das categorias do cardápio. A ordem aqui é a mesma da barra de categorias do site.", '<button class="btn btn-primary btn-sm" data-act="new-cat">' + icon("plus", "icon-sm") + "Nova categoria</button>") +
      '<div class="rows">' +
      D.categories
        .map(function (c, i) {
          var n = D.products.filter(function (p) {
            return p.category === c.id;
          }).length;
          return (
            '<div class="row' +
            (c.active === false ? " is-off" : "") +
            '" style="grid-template-columns:56px 1fr auto">' +
            '<div class="media" style="display:grid;place-items:center;font-family:var(--f-jp);color:var(--gold);font-size:18px">' +
            esc(c.kanji || "") +
            "</div>" +
            '<div class="row-main"><div class="row-title">' +
            esc(c.name) +
            (n ? "" : '<span class="mini-tag warn">Vazia</span>') +
            '</div><div class="row-sub">' +
            n +
            (n === 1 ? " produto" : " produtos") +
            "</div></div>" +
            '<div class="row-actions">' +
            '<button class="icon-btn" data-act="cat-up" data-i="' +
            i +
            '" aria-label="Subir"' +
            (i === 0 ? " disabled style=\"opacity:.25\"" : "") +
            '><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
            '<button class="icon-btn" data-act="cat-down" data-i="' +
            i +
            '" aria-label="Descer"' +
            (i === D.categories.length - 1 ? " disabled style=\"opacity:.25\"" : "") +
            ">" +
            icon("chev", "icon-sm") +
            "</button>" +
            sw("active", c.active !== false, "", 'data-act="toggle-cat" data-id="' + esc(c.id) + '"') +
            '<button class="icon-btn" data-act="edit-cat" data-id="' +
            esc(c.id) +
            '" aria-label="Editar ' +
            esc(c.name) +
            '"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg></button>' +
            '<button class="icon-btn" data-act="delete-cat" data-id="' +
            esc(c.id) +
            '" aria-label="Excluir ' +
            esc(c.name) +
            '">' +
            icon("trash", "icon-sm") +
            "</button></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function catForm(c, isNew) {
    editing = { type: "cat", isNew: isNew, data: S.clone(c) };
    openSheet(
      '<div class="drawer-head"><div><h2>' +
        (isNew ? "Nova categoria" : "Editar categoria") +
        '</h2></div><button class="icon-btn" data-act="close-sheet" aria-label="Fechar">' +
        icon("close") +
        "</button></div>" +
        '<form class="drawer-body" data-cat-form novalidate><div class="form-grid">' +
        '<div class="field" data-field="name"><label for="cf-name">Nome</label><input class="input" id="cf-name" name="name" value="' +
        esc(c.name) +
        '" maxlength="30" required><span class="error">Informe o nome.</span></div>' +
        '<div class="field"><label for="cf-kanji">Ideograma decorativo <span class="opt">(opcional, aparece nas molduras sem foto)</span></label><input class="input" id="cf-kanji" name="kanji" value="' +
        esc(c.kanji) +
        '" maxlength="3" placeholder="Ex.: 寿司"></div>' +
        sw("active", c.active !== false, "Categoria visível no site") +
        "</div></form>" +
        '<div class="drawer-foot"><button class="btn btn-primary" data-act="save-cat">Salvar</button></div>'
    );
  }

  function saveCat() {
    var f = $("[data-cat-form]", sheet);
    var name = f.name.value.trim();
    if (!name) {
      $('[data-field="name"]', sheet).classList.add("is-invalid");
      return;
    }
    var c = editing.data;
    c.name = name;
    c.kanji = f.kanji.value.trim();
    c.active = f.active.checked;
    if (editing.isNew) {
      c.id = uniqueId(name, D.categories);
      D.categories.push(c);
    } else
      D.categories = D.categories.map(function (x) {
        return x.id === c.id ? c : x;
      });
    var wasNew = editing.isNew;
    closeSheet();
    commit(wasNew ? "Categoria criada" : "Categoria salva");
  }

  /* ---------- Combos ---------- */

  function viewCombos() {
    var combos = D.products.filter(function (p) {
      return p.category === "combos" || p.kind === "combo" || p.kind === "executivo";
    });
    function tile(p) {
      var comp = (p.composition || []).length;
      return (
        '<button type="button" class="combo-tile' +
        (p.active === false ? " is-off" : "") +
        '" data-act="edit-product" data-id="' +
        esc(p.id) +
        '">' +
        thumb(p.image, kanji(p)) +
        "<div><h3>" +
        esc(p.name) +
        '</h3><div class="meta">' +
        (p.price !== null ? S.money(p.price) : "Sob consulta") +
        (p.quantity ? " · " + esc(p.quantity) : "") +
        '</div><div class="tags">' +
        (comp ? '<span class="mini-tag ok">' + comp + " itens na composição</span>" : '<span class="mini-tag warn">Sem composição</span>') +
        (p.image ? "" : '<span class="mini-tag warn">Sem foto</span>') +
        (p.active === false ? '<span class="mini-tag">Inativo</span>' : "") +
        "</div></div></button>"
      );
    }
    var regular = combos.filter(function (p) {
      return p.kind !== "executivo";
    });
    var exec = combos.filter(function (p) {
      return p.kind === "executivo";
    });
    return (
      head(
        "Cardápio",
        "Combos",
        "Cadastre quantos combos quiser, com quantidade de peças, composição, foto e preço.",
        '<button class="btn btn-ghost btn-sm" data-act="new-exec">' + icon("plus", "icon-sm") + "Novo executivo</button>" + '<button class="btn btn-primary btn-sm" data-act="new-combo">' + icon("plus", "icon-sm") + "Novo combo</button>"
      ) +
      '<h3 class="menu-sub" style="margin-top:0">Combos</h3><div class="combo-admin">' +
      (regular.length ? regular.map(tile).join("") : '<div class="empty-note">Nenhum combo cadastrado.</div>') +
      '</div><h3 class="menu-sub">Combos executivos</h3><div class="combo-admin">' +
      (exec.length ? exec.map(tile).join("") : '<div class="empty-note">Nenhum executivo cadastrado.</div>') +
      "</div>"
    );
  }

  function blankProduct(preset) {
    return Object.assign(
      { id: "", category: D.categories[0] ? D.categories[0].id : "", kind: "", name: "", description: "", quantity: "", composition: [], price: null, image: "", featured: false, active: true, options: [] },
      preset || {}
    );
  }

  /* ---------- Promoções ---------- */

  function viewPromos() {
    return (
      head("Vendas", "Promoções", "Escolha produtos para destacar na seção de promoções. Se informar um preço promocional, ele substitui o preço normal no site e no carrinho.", '<button class="btn btn-primary btn-sm" data-act="new-promo">' + icon("plus", "icon-sm") + "Nova promoção</button>") +
      '<div class="rows">' +
      (D.promotions.length
        ? D.promotions
            .map(function (pr) {
              var p = D.products.filter(function (x) {
                return x.id === pr.productId;
              })[0];
              if (!p) return "";
              var promo = pr.promoPrice !== null && pr.promoPrice !== undefined && pr.promoPrice !== "";
              return (
                '<div class="row' +
                (pr.active === false ? " is-off" : "") +
                '" style="grid-template-columns:56px 1fr auto">' +
                thumb(p.image, kanji(p)) +
                '<div class="row-main"><div class="row-title">' +
                esc(p.name) +
                '<span class="mini-tag red">' +
                esc(pr.label || "Promoção") +
                "</span>" +
                (p.active === false ? '<span class="mini-tag">Produto inativo</span>' : "") +
                '</div><div class="row-sub">' +
                (promo ? "<s>" + S.money(p.price) + "</s> → " + S.money(pr.promoPrice) : p.price !== null ? "Preço normal · " + S.money(p.price) : "Sob consulta") +
                "</div></div>" +
                '<div class="row-actions">' +
                sw("active", pr.active !== false, "", 'data-act="toggle-promo" data-id="' + esc(pr.id) + '"') +
                '<button class="icon-btn" data-act="edit-promo" data-id="' +
                esc(pr.id) +
                '" aria-label="Editar promoção"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg></button>' +
                '<button class="icon-btn" data-act="delete-promo" data-id="' +
                esc(pr.id) +
                '" aria-label="Excluir promoção">' +
                icon("trash", "icon-sm") +
                "</button></div></div>"
              );
            })
            .join("")
        : '<div class="empty-note">Nenhuma promoção cadastrada.</div>') +
      "</div>"
    );
  }

  function promoForm(pr, isNew) {
    editing = { type: "promo", isNew: isNew, data: S.clone(pr) };
    openSheet(
      '<div class="drawer-head"><div><h2>' +
        (isNew ? "Nova promoção" : "Editar promoção") +
        '</h2></div><button class="icon-btn" data-act="close-sheet" aria-label="Fechar">' +
        icon("close") +
        "</button></div>" +
        '<form class="drawer-body" data-promo-form novalidate><div class="form-grid">' +
        '<div class="field" data-field="product"><label for="prf-p">Produto</label><select class="input" id="prf-p" name="productId"><option value="">Selecione</option>' +
        D.categories
          .map(function (c) {
            var items = D.products.filter(function (p) {
              return p.category === c.id;
            });
            if (!items.length) return "";
            return (
              '<optgroup label="' +
              esc(c.name) +
              '">' +
              items
                .map(function (p) {
                  return '<option value="' + esc(p.id) + '"' + (p.id === pr.productId ? " selected" : "") + ">" + esc(p.name) + (p.price !== null ? " — " + S.money(p.price) : "") + "</option>";
                })
                .join("") +
              "</optgroup>"
            );
          })
          .join("") +
        '</select><span class="error">Escolha um produto.</span></div>' +
        '<div class="row-2"><div class="field"><label for="prf-l">Selo</label><input class="input" id="prf-l" name="label" value="' +
        esc(pr.label || "Promoção") +
        '" maxlength="18"></div>' +
        '<div class="field"><label for="prf-v">Preço promocional <span class="opt">(opcional)</span></label><input class="input" id="prf-v" name="promoPrice" inputmode="decimal" placeholder="Mantém o normal" value="' +
        moneyInput(pr.promoPrice) +
        '"></div></div>' +
        sw("active", pr.active !== false, "Promoção ativa") +
        "</div></form>" +
        '<div class="drawer-foot"><button class="btn btn-primary" data-act="save-promo">Salvar</button></div>'
    );
  }

  function savePromo() {
    var f = $("[data-promo-form]", sheet);
    if (!f.productId.value) {
      $('[data-field="product"]', sheet).classList.add("is-invalid");
      return;
    }
    var pr = editing.data;
    pr.productId = f.productId.value;
    pr.label = f.label.value.trim() || "Promoção";
    pr.promoPrice = num(f.promoPrice.value);
    pr.active = f.active.checked;
    if (editing.isNew) {
      pr.id = uniqueId("promo-" + pr.productId, D.promotions);
      D.promotions.push(pr);
    } else
      D.promotions = D.promotions.map(function (x) {
        return x.id === pr.id ? pr : x;
      });
    var wasNew = editing.isNew;
    closeSheet();
    commit(wasNew ? "Promoção criada" : "Promoção salva");
  }

  /* ---------- Configurações ---------- */

  var SET;

  function viewConfig() {
    SET = S.clone(D.settings);
    var s = SET;
    var d = s.delivery;
    var p = s.payments;
    function f(id, label, val, attrs, cls) {
      return '<div class="field ' + (cls || "") + '"><label for="st-' + id + '">' + label + '</label><input class="input" id="st-' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (attrs || "") + "></div>";
    }
    return (
      head("Loja", "Configurações", "Contato, entrega, pagamento, textos e imagens do site.") +
      '<form data-config novalidate>' +
      '<section class="panel"><h2>Loja e contato</h2><p class="lead">Estes dados aparecem no site e nos links de pedido.</p><div class="form-grid cols-2">' +
      f("storeName", "Nome da loja", s.storeName, 'maxlength="40"') +
      f("whatsapp", "WhatsApp da loja (com DDD)", S.phoneDisplay(s.whatsapp), 'inputmode="tel" placeholder="(16) 99999-9999"') +
      f("instagramUrl", 'Link do Instagram <span class="opt">(URL completa)</span>', s.instagramUrl, 'type="url" placeholder="https://instagram.com/…"') +
      f("instagramHandle", 'Usuário do Instagram <span class="opt">(sem @)</span>', s.instagramHandle, 'placeholder="usuario"') +
      f("ifoodUrl", 'Link do iFood <span class="opt">(URL completa)</span>', s.ifoodUrl, 'type="url" placeholder="https://www.ifood.com.br/…"', "span-2") +
      f("city", "Cidade", s.city) +
      f("state", "Estado", s.state, 'maxlength="2"') +
      f("hours", 'Horário de atendimento <span class="opt">(opcional)</span>', s.hours, 'placeholder="Ex.: Ter a Dom · 18h às 23h"', "span-2") +
      "</div></section>" +
      '<section class="panel"><h2>Entrega</h2><p class="lead">Taxa única para toda a área ou taxa por bairro/região.</p><div class="form-grid">' +
      '<div class="seg" role="radiogroup" aria-label="Tipo de taxa"><label><input type="radio" name="dmode" value="fixed"' +
      (d.mode !== "zones" ? " checked" : "") +
      "><span>Taxa única</span></label><label><input type=\"radio\" name=\"dmode\" value=\"zones\"" +
      (d.mode === "zones" ? " checked" : "") +
      "><span>Por bairro</span></label></div>" +
      '<div class="form-grid cols-2" data-fixed' +
      (d.mode === "zones" ? " hidden" : "") +
      ">" +
      f("fee", "Taxa de entrega (R$)", moneyInput(d.fee), 'inputmode="decimal"') +
      f("areaLabel", "Texto da área de entrega", d.areaLabel, 'placeholder="Ex.: Para toda Ribeirão Preto"') +
      "</div>" +
      '<div data-zones-wrap' +
      (d.mode === "zones" ? "" : " hidden") +
      '><div data-zones>' +
      zonesHTML(d.zones || []) +
      '</div><button type="button" class="link-more" data-act="add-zone" style="margin-top:10px">' +
      icon("plus") +
      'Adicionar região</button><div class="form-grid cols-2" style="margin-top:14px">' +
      f("otherFee", 'Taxa para outros bairros <span class="opt">(vazio = a combinar)</span>', moneyInput(d.otherFee), 'inputmode="decimal"') +
      f("areaLabel2", "Texto da área de entrega", d.areaLabel, 'placeholder="Ex.: Ribeirão Preto e região"') +
      "</div></div>" +
      '<div class="form-grid cols-2">' +
      '<div class="field span-2">' +
      sw("freeEnabled", !!d.freeEnabled, "Entrega grátis") +
      "</div>" +
      f("freeMin", 'Entrega grátis a partir de (R$) <span class="opt">(0 = sempre grátis)</span>', moneyInput(d.freeMin), 'inputmode="decimal"') +
      f("minOrder", 'Pedido mínimo (R$) <span class="opt">(0 = sem mínimo)</span>', moneyInput(d.minOrder), 'inputmode="decimal"') +
      "</div></div></section>" +
      '<section class="panel"><h2>Pagamento</h2><p class="lead">Formas aceitas no checkout.</p><div class="form-grid cols-2">' +
      sw("pay-pix", p.pix !== false, "PIX") +
      sw("pay-cash", p.cash !== false, "Dinheiro") +
      sw("pay-credit", p.credit !== false, "Cartão de crédito") +
      sw("pay-debit", p.debit !== false, "Cartão de débito") +
      f("pixKey", 'Chave Pix <span class="opt">(opcional, aparece no checkout)</span>', p.pixKey, "", "span-2") +
      "</div></section>" +
      '<section class="panel"><h2>Textos do site</h2><p class="lead">Destaque principal e seção Sobre.</p><div class="form-grid">' +
      f("heroEyebrow", "Linha acima do título", s.hero.eyebrow) +
      '<div class="field"><label for="st-heroTitle">Título principal <span class="opt">(Enter quebra a linha)</span></label><textarea class="input" id="st-heroTitle" name="heroTitle" style="min-height:80px">' +
      esc(s.hero.title) +
      "</textarea></div>" +
      '<div class="field"><label for="st-heroSub">Subtítulo</label><textarea class="input" id="st-heroSub" name="heroSub">' +
      esc(s.hero.subtitle) +
      "</textarea></div>" +
      f("aboutTitle", "Título da seção Sobre", s.about.title) +
      '<div class="field"><label for="st-aboutText">Texto da seção Sobre</label><textarea class="input" id="st-aboutText" name="aboutText" style="min-height:120px">' +
      esc(s.about.text) +
      "</textarea></div>" +
      "</div></section>" +
      '<section class="panel"><h2>Imagens</h2><p class="lead">Logotipo, foto principal, foto da seção Sobre e fotos da seção “Siga a ObaraKi”.</p><div class="form-grid cols-2">' +
      cfgImg("logo", "Logotipo", s.logo) +
      cfgImg("heroImage", "Foto principal (hero)", s.hero.image) +
      cfgImg("aboutImage", "Foto da seção Sobre", s.about.image) +
      '<div class="field span-2"><span class="label">Fotos do Instagram (até 6)</span><div class="gallery-edit" data-gallery>' +
      galleryHTML() +
      "</div></div>" +
      "</div></section>" +
      '<section class="panel"><h2>Segurança</h2><p class="lead">PIN de acesso a este painel neste aparelho.</p><div class="form-grid cols-2">' +
      '<div class="field"><label for="st-pin">Novo PIN</label><input class="input" id="st-pin" name="newPin" type="password" inputmode="numeric" maxlength="8" autocomplete="new-password"></div>' +
      '<div class="field" style="justify-content:flex-end"><button type="button" class="btn btn-ghost" data-act="change-pin">Alterar PIN</button></div>' +
      "</div></section>" +
      '<section class="panel"><h2>Publicar e backup</h2><p class="lead">As alterações ficam salvas neste navegador. Para publicar para todos os clientes, baixe o arquivo de dados e substitua <b>data/cardapio.js</b> no servidor do site.</p><div class="actions" style="display:flex;flex-wrap:wrap;gap:8px">' +
      '<button type="button" class="btn btn-light btn-sm" data-act="publish">Baixar arquivo de dados</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="backup">Exportar backup (.json)</button>' +
      '<label class="btn btn-ghost btn-sm" style="cursor:pointer">Importar backup<input type="file" accept="application/json,.json" data-import hidden></label>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="discard">Descartar alterações</button>' +
      "</div></section>" +
      '<div style="position:sticky;bottom:12px;z-index:5;display:flex;justify-content:flex-end"><button class="btn btn-primary" data-act="save-config" style="box-shadow:0 12px 30px rgba(0,0,0,.5)">Salvar configurações</button></div>' +
      "</form>"
    );
  }

  function zonesHTML(zones) {
    if (!zones.length) return '<div class="empty-note" style="padding:14px 0;text-align:left">Nenhuma região cadastrada. Adicione regiões com seus bairros e taxas.</div>';
    return zones
      .map(function (z, i) {
        return (
          '<div class="zone" data-zone="' +
          i +
          '"><div class="zone-top"><input class="input" name="z-name" placeholder="Nome da região" value="' +
          esc(z.name) +
          '" aria-label="Nome da região"><input class="input" name="z-fee" inputmode="decimal" placeholder="Taxa R$" value="' +
          moneyInput(z.fee) +
          '" aria-label="Taxa"><button type="button" class="icon-btn" data-act="rm-zone" data-i="' +
          i +
          '" aria-label="Remover região">' +
          icon("trash", "icon-sm") +
          '</button></div><textarea class="input" name="z-nb" placeholder="Bairros separados por vírgula" style="min-height:70px" aria-label="Bairros">' +
          esc(z.neighborhoods) +
          "</textarea></div>"
        );
      })
      .join("");
  }

  function readZones() {
    return $$("[data-zone]").map(function (row, i) {
      return {
        id: "z" + (i + 1),
        name: $("[name=z-name]", row).value.trim(),
        fee: num($("[name=z-fee]", row).value) || 0,
        neighborhoods: $("[name=z-nb]", row).value.trim()
      };
    });
  }

  function cfgImg(key, label, src) {
    return (
      '<div class="field"><span class="label">' +
      label +
      '</span><div class="img-field" data-img="' +
      key +
      '"><div class="media" data-img-preview>' +
      U.mediaHTML(src, "", "寿司") +
      '</div><div><input class="input" name="' +
      key +
      '-path" placeholder="assets/img/arquivo.jpg" value="' +
      (src && src.indexOf("data:") !== 0 ? esc(src) : "") +
      '" aria-label="Caminho da imagem"><div class="btns"><label class="btn btn-ghost btn-sm" style="cursor:pointer">Enviar<input type="file" accept="image/*"></label><button type="button" class="btn btn-ghost btn-sm" data-img-clear>Remover</button></div><span class="help" data-img-help style="display:block;margin-top:6px"></span></div></div></div>'
    );
  }

  function galleryHTML() {
    var g = SET.gallery || [];
    var out = "";
    for (var i = 0; i < 6; i++) {
      out += g[i]
        ? '<div class="slot"><img src="' + esc(g[i]) + '" alt=""><button type="button" class="rm" data-act="rm-gal" data-i="' + i + '" aria-label="Remover foto">' + icon("close", "icon-sm") + "</button></div>"
        : '<label class="slot">' + icon("plus") + '<input type="file" accept="image/*" data-gal hidden></label>';
    }
    return out;
  }

  function bindConfig() {
    var form = $("[data-config]");
    form.addEventListener("change", function (e) {
      if (e.target.name === "dmode") {
        var z = e.target.value === "zones";
        $("[data-fixed]").hidden = z;
        $("[data-zones-wrap]").hidden = !z;
      }
      if (e.target.matches("[data-gal]")) {
        var file = e.target.files[0];
        readImage(file, 900).then(function (url) {
          SET.gallery = (SET.gallery || []).filter(Boolean);
          SET.gallery.push(url);
          $("[data-gallery]").innerHTML = galleryHTML();
          U.toast("Foto adicionada. Salve para aplicar.");
        });
      }
      if (e.target.matches("[data-import]")) {
        var fi = e.target.files[0];
        if (!fi) return;
        var r = new FileReader();
        r.onload = function () {
          try {
            var data = JSON.parse(r.result);
            if (!data || !Array.isArray(data.products) || !Array.isArray(data.categories) || !data.settings) throw new Error("formato");
            if (!window.confirm("Importar este backup substitui o cardápio e as configurações atuais deste navegador. Continuar?")) return;
            D = data;
            D.promotions = D.promotions || [];
            commit("Backup importado");
          } catch (err) {
            U.toast("Arquivo inválido. Use um backup exportado por este painel.");
          }
        };
        r.readAsText(fi);
      }
    });
    bindImgField("logo", function (url) {
      SET.logo = url;
    });
    bindImgField("heroImage", function (url) {
      SET.hero.image = url;
    });
    bindImgField("aboutImage", function (url) {
      SET.about.image = url;
    });
  }

  function saveConfig() {
    var f = $("[data-config]");
    var s = SET;
    s.storeName = f.storeName.value.trim() || "ObaraKi Temakeria";
    var wa = S.digits(f.whatsapp.value);
    if (wa.length < 10) {
      U.toast("Informe o WhatsApp com DDD.");
      f.whatsapp.focus();
      return;
    }
    s.whatsapp = wa.length <= 11 ? "55" + wa : wa;
    s.instagramUrl = f.instagramUrl.value.trim();
    s.instagramHandle = f.instagramHandle.value.trim().replace(/^@/, "");
    s.ifoodUrl = f.ifoodUrl.value.trim();
    s.city = f.city.value.trim();
    s.state = f.state.value.trim().toUpperCase();
    s.hours = f.hours.value.trim();

    var zonesMode = $("input[name=dmode]:checked", f).value === "zones";
    s.delivery.mode = zonesMode ? "zones" : "fixed";
    s.delivery.fee = num(f.fee.value) || 0;
    s.delivery.areaLabel = (zonesMode ? f.areaLabel2.value : f.areaLabel.value).trim();
    s.delivery.zones = readZones().filter(function (z) {
      return z.name || z.neighborhoods;
    });
    s.delivery.otherFee = num(f.otherFee.value);
    s.delivery.freeEnabled = f.freeEnabled.checked;
    s.delivery.freeMin = num(f.freeMin.value) || 0;
    s.delivery.minOrder = num(f.minOrder.value) || 0;

    s.payments.pix = f["pay-pix"].checked;
    s.payments.cash = f["pay-cash"].checked;
    s.payments.credit = f["pay-credit"].checked;
    s.payments.debit = f["pay-debit"].checked;
    s.payments.pixKey = f.pixKey.value.trim();
    if (!s.payments.pix && !s.payments.cash && !s.payments.credit && !s.payments.debit) {
      U.toast("Deixe ao menos uma forma de pagamento ativa.");
      return;
    }

    s.hero.eyebrow = f.heroEyebrow.value.trim();
    s.hero.title = f.heroTitle.value.trim();
    s.hero.subtitle = f.heroSub.value.trim();
    s.about.title = f.aboutTitle.value.trim();
    s.about.text = f.aboutText.value.trim();

    ["logo", "heroImage", "aboutImage"].forEach(function (k) {
      var v = $("[name=" + k + "-path]", f).value.trim();
      if (!v) return;
      if (k === "logo") s.logo = v;
      if (k === "heroImage") s.hero.image = v;
      if (k === "aboutImage") s.about.image = v;
    });

    D.settings = s;
    commit("Configurações salvas");
  }

  /* ---------- Ações ---------- */

  function findProduct(id) {
    return D.products.filter(function (p) {
      return p.id === id;
    })[0];
  }

  function onClick(e) {
    var vb = e.target.closest("[data-view-btn]");
    if (vb) {
      view = vb.getAttribute("data-view-btn");
      try {
        history.replaceState(null, "", "#" + view);
      } catch (err) {}
      renderShell();
      window.scrollTo(0, 0);
      return;
    }
    var t = e.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act");
    var id = t.getAttribute("data-id");
    var i = +t.getAttribute("data-i");

    switch (act) {
      case "logout":
        sessionStorage.removeItem(SESSION_KEY);
        renderLock();
        break;
      case "close-sheet":
        closeSheet();
        break;
      case "status-filter":
        filters.status = t.getAttribute("data-v");
        renderView();
        break;
      case "order-delete":
        if (window.confirm("Excluir este pedido do histórico deste navegador?")) {
          S.saveOrders(
            S.orders().filter(function (o) {
              return o.id !== id;
            })
          );
          renderShell();
        }
        break;
      case "new-product":
        productForm(blankProduct({ category: filters.cat || (D.categories[0] || {}).id }), true);
        break;
      case "new-combo":
        productForm(blankProduct({ category: "combos", kind: "combo" }), true);
        break;
      case "new-exec":
        productForm(blankProduct({ category: "combos", kind: "executivo" }), true);
        break;
      case "edit-product":
        var ep = findProduct(id);
        if (ep) productForm(ep, false);
        break;
      case "save-product":
        saveProduct(false);
        break;
      case "duplicate-product":
        saveProduct(true);
        break;
      case "delete-product":
        var dp = findProduct(id);
        if (dp && window.confirm("Excluir “" + dp.name + "”? Esta ação não pode ser desfeita.")) {
          D.products = D.products.filter(function (p) {
            return p.id !== id;
          });
          D.promotions = D.promotions.filter(function (pr) {
            return pr.productId !== id;
          });
          commit("Produto excluído");
        }
        break;
      case "add-opt":
        editing.data.options = readOpts().concat([{ id: "", name: "", price: 0 }]);
        $("[data-opts]", sheet).innerHTML = optsHTML(editing.data.options);
        var rows = $$("[data-opt]", sheet);
        $("[name=opt-name]", rows[rows.length - 1]).focus();
        break;
      case "rm-opt":
        var cur = readOpts();
        var all = $$("[data-opt]", sheet).map(function (row) {
          return { name: $("[name=opt-name]", row).value, price: num($("[name=opt-price]", row).value) || 0 };
        });
        all.splice(i, 1);
        editing.data.options = all.map(function (o, k) {
          return { id: (cur[k] && cur[k].id) || slug(o.name), name: o.name, price: o.price };
        });
        $("[data-opts]", sheet).innerHTML = optsHTML(editing.data.options);
        break;
      case "new-cat":
        catForm({ id: "", name: "", kanji: "", active: true }, true);
        break;
      case "edit-cat":
        var ec = D.categories.filter(function (c) {
          return c.id === id;
        })[0];
        if (ec) catForm(ec, false);
        break;
      case "save-cat":
        saveCat();
        break;
      case "delete-cat":
        var n = D.products.filter(function (p) {
          return p.category === id;
        }).length;
        if (n) {
          U.toast("Mova ou exclua os " + n + " produtos desta categoria antes.");
          break;
        }
        if (window.confirm("Excluir esta categoria?")) {
          D.categories = D.categories.filter(function (c) {
            return c.id !== id;
          });
          commit("Categoria excluída");
        }
        break;
      case "cat-up":
      case "cat-down":
        var j = act === "cat-up" ? i - 1 : i + 1;
        if (j < 0 || j >= D.categories.length) break;
        var tmp = D.categories[i];
        D.categories[i] = D.categories[j];
        D.categories[j] = tmp;
        commit();
        break;
      case "new-promo":
        promoForm({ id: "", productId: "", label: "Promoção", promoPrice: null, active: true }, true);
        break;
      case "edit-promo":
        var epr = D.promotions.filter(function (x) {
          return x.id === id;
        })[0];
        if (epr) promoForm(epr, false);
        break;
      case "save-promo":
        savePromo();
        break;
      case "delete-promo":
        if (window.confirm("Excluir esta promoção?")) {
          D.promotions = D.promotions.filter(function (x) {
            return x.id !== id;
          });
          commit("Promoção excluída");
        }
        break;
      case "add-zone":
        e.preventDefault();
        var zs = readZones();
        zs.push({ name: "", fee: 0, neighborhoods: "" });
        $("[data-zones]").innerHTML = zonesHTML(zs);
        var zr = $$("[data-zone]");
        $("[name=z-name]", zr[zr.length - 1]).focus();
        break;
      case "rm-zone":
        var zz = readZones();
        zz.splice(i, 1);
        $("[data-zones]").innerHTML = zonesHTML(zz);
        break;
      case "rm-gal":
        SET.gallery.splice(i, 1);
        $("[data-gallery]").innerHTML = galleryHTML();
        break;
      case "save-config":
        e.preventDefault();
        saveConfig();
        break;
      case "change-pin":
        var np = S.digits($("#st-pin").value);
        if (np.length < 4) {
          U.toast("O PIN precisa ter de 4 a 8 números.");
          break;
        }
        hashPin(np).then(function (h) {
          localStorage.setItem(PIN_KEY, h);
          $("#st-pin").value = "";
          U.toast("PIN alterado");
        });
        break;
      case "publish":
        download("cardapio.js", S.exportDataFile(), "text/javascript");
        U.toast("Arquivo baixado. Substitua data/cardapio.js no site.");
        break;
      case "backup":
        download("obaraki-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(D, null, 2), "application/json");
        break;
      case "discard":
        if (window.confirm("Descartar todas as alterações feitas neste navegador e voltar para a versão publicada?")) {
          S.discardDraft();
          fresh();
          renderShell();
          U.toast("Alterações descartadas");
        }
        break;
    }
  }

  function onChange(e) {
    var t = e.target;
    var act = t.getAttribute("data-act");
    var id = t.getAttribute("data-id");
    if (act === "toggle-product") {
      var p = findProduct(id);
      p.active = t.checked;
      commit(t.checked ? "Produto ativado" : "Produto desativado");
    }
    if (act === "toggle-cat") {
      D.categories.forEach(function (c) {
        if (c.id === id) c.active = t.checked;
      });
      commit(t.checked ? "Categoria visível" : "Categoria oculta");
    }
    if (act === "toggle-promo") {
      D.promotions.forEach(function (x) {
        if (x.id === id) x.active = t.checked;
      });
      commit(t.checked ? "Promoção ativada" : "Promoção pausada");
    }
    if (act === "price") {
      var pp = findProduct(id);
      pp.price = num(t.value);
      commit("Preço de " + pp.name + " atualizado");
    }
    if (act === "order-status") {
      var list = S.orders().map(function (o) {
        if (o.id === id) o.status = t.value;
        return o;
      });
      S.saveOrders(list);
      var row = t.closest(".order-row");
      var st = STATUS.filter(function (x) {
        return x.id === t.value;
      })[0];
      var lab = row && $("summary .when[class*=st-]", row);
      if (lab && st) {
        lab.className = "when st-" + st.id;
        lab.textContent = st.label;
      }
    }
    if (act === "filter-cat") {
      filters.cat = t.value;
      renderView();
    }
  }

  function onInput(e) {
    if (e.target.getAttribute("data-act") === "filter-q") {
      filters.q = e.target.value;
      var q = S.fold(filters.q);
      var list = D.products.filter(function (p) {
        if (filters.cat && p.category !== filters.cat) return false;
        if (q && S.fold(p.name + " " + p.description).indexOf(q) === -1) return false;
        return true;
      });
      var rows = $("[data-product-rows]");
      rows.innerHTML = list.length ? list.map(productRow).join("") : '<div class="empty-note">Nenhum produto encontrado.</div>';
      U.hydrate(rows);
    }
    if (e.target.closest(".field.is-invalid")) e.target.closest(".field").classList.remove("is-invalid");
  }

  /* ---------- Início ---------- */

  function start() {
    fresh();
    var h = location.hash.replace("#", "");
    if (
      VIEWS.some(function (v) {
        return v.id === h;
      })
    )
      view = h;
    app.innerHTML = "";
    renderShell();
  }

  app.addEventListener("click", onClick);
  app.addEventListener("change", onChange);
  app.addEventListener("input", onInput);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && sheet.classList.contains("is-open")) closeSheet();
  });
  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("overlay")) closeSheet();
  });
  window.addEventListener("obk:orders", function () {
    if ($(".adm")) renderNav();
  });

  if (sessionStorage.getItem(SESSION_KEY) && localStorage.getItem(PIN_KEY)) start();
  else renderLock();
})();
