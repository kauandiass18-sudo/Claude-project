/* ==========================================================================
   OBARAKI · CAMADA DE DADOS
   Lê os dados publicados (data/cardapio.js), aplica o rascunho do painel
   administrativo salvo neste navegador e cuida de carrinho, cliente e
   pedidos. Toda a persistência passa por aqui: para ligar um banco de dados
   no futuro, basta trocar as funções read/write deste arquivo.
   ========================================================================== */
(function () {
  "use strict";

  var KEYS = {
    data: "obk.data.v1",
    cart: "obk.cart.v1",
    orders: "obk.orders.v1",
    customer: "obk.customer.v1"
  };

  var seed = window.OBARAKI_DATA;

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  /* ---------- Dados do site (publicado + rascunho local) ---------- */

  function normalize(d) {
    d.settings = d.settings || {};
    d.categories = d.categories || [];
    d.products = d.products || [];
    d.promotions = d.promotions || [];
    d.products.forEach(function (p) {
      p.options = p.options || [];
      p.composition = p.composition || [];
      if (p.price === "" || p.price === undefined) p.price = null;
    });
    return d;
  }

  function loadData() {
    var draft = read(KEYS.data, null);
    if (draft && draft.baseVersion === seed.version && draft.data) {
      return { data: normalize(draft.data), isDraft: true };
    }
    return { data: normalize(clone(seed)), isDraft: false };
  }

  var loaded = loadData();
  var data = loaded.data;
  var isDraft = loaded.isDraft;
  var staleDraft = (function () {
    var d = read(KEYS.data, null);
    return !!(d && d.baseVersion !== seed.version);
  })();

  function saveData(next) {
    data = normalize(next);
    var ok = write(KEYS.data, {
      baseVersion: seed.version,
      savedAt: new Date().toISOString(),
      data: data
    });
    if (ok) isDraft = true;
    emit("obk:data");
    return ok;
  }

  function discardDraft() {
    remove(KEYS.data);
    data = normalize(clone(seed));
    isDraft = false;
    staleDraft = false;
    emit("obk:data");
  }

  function exportDataFile() {
    var payload = clone(data);
    var parts = String(seed.version).split(".");
    var today = new Date().toISOString().slice(0, 10);
    var n = parts[0] === today ? (parseInt(parts[1], 10) || 0) + 1 : 1;
    payload.version = today + "." + n;
    return (
      "/* ObaraKi · dados do site. Gerado pelo painel em " +
      new Date().toLocaleString("pt-BR") +
      ".\n   Substitua o arquivo data/cardapio.js por este. */\n\n" +
      "window.OBARAKI_DATA = " +
      JSON.stringify(payload, null, 2) +
      ";\n"
    );
  }

  /* ---------- Consultas ---------- */

  function settings() {
    return data.settings;
  }

  function categories(includeInactive) {
    return data.categories.filter(function (c) {
      return includeInactive || c.active !== false;
    });
  }

  function category(id) {
    for (var i = 0; i < data.categories.length; i++) {
      if (data.categories[i].id === id) return data.categories[i];
    }
    return null;
  }

  function isVisible(p) {
    if (!p || p.active === false) return false;
    var c = category(p.category);
    return !c || c.active !== false;
  }

  function products(filter) {
    return data.products.filter(function (p) {
      if (!isVisible(p)) return false;
      if (!filter) return true;
      if (filter.category && p.category !== filter.category) return false;
      if (filter.kind !== undefined && (p.kind || "") !== filter.kind) return false;
      if (filter.featured && !p.featured) return false;
      return true;
    });
  }

  function product(id) {
    for (var i = 0; i < data.products.length; i++) {
      if (data.products[i].id === id) return data.products[i];
    }
    return null;
  }

  /* Nome usado no carrinho e no pedido: acrescenta a categoria quando o
     nome sozinho fica ambíguo (ex.: "Salmão" → "Salmão (Sashimi)"). */
  function displayName(p) {
    if (!p) return "";
    var c = category(p.category);
    if (!c || p.kind === "combo" || p.kind === "executivo") return p.name;
    if (fold(p.name).indexOf(fold(c.name)) !== -1) return p.name;
    return p.name + " (" + c.name + ")";
  }

  function activePromo(p) {
    for (var i = 0; i < data.promotions.length; i++) {
      var pr = data.promotions[i];
      if (pr.active !== false && pr.productId === p.id) return pr;
    }
    return null;
  }

  function promotions() {
    return data.promotions
      .filter(function (pr) {
        return pr.active !== false && isVisible(product(pr.productId));
      })
      .map(function (pr) {
        return { promo: pr, product: product(pr.productId) };
      });
  }

  /* Preço efetivo (considera promoção com preço promocional) */
  function price(p) {
    if (!p || p.price === null || p.price === undefined) return null;
    var pr = activePromo(p);
    if (pr && pr.promoPrice !== null && pr.promoPrice !== undefined && pr.promoPrice !== "") {
      return Number(pr.promoPrice);
    }
    return Number(p.price);
  }

  function originalPrice(p) {
    var eff = price(p);
    if (eff === null) return null;
    return Number(p.price) > eff ? Number(p.price) : null;
  }

  function search(term) {
    var q = fold(term);
    if (!q) return [];
    return products().filter(function (p) {
      var c = category(p.category);
      var hay = fold(
        [p.name, p.description, p.quantity, (p.composition || []).join(" "), c ? c.name : ""].join(" ")
      );
      return q.split(/\s+/).every(function (w) {
        return hay.indexOf(w) !== -1;
      });
    });
  }

  function fold(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim();
  }

  /* ---------- Carrinho ---------- */

  var cart = read(KEYS.cart, []);
  cart = cart.filter(function (it) {
    var p = product(it.productId);
    return p && isVisible(p) && price(p) !== null && it.qty > 0;
  });

  function itemKey(productId, options, note) {
    return [productId, (options || []).slice().sort().join("+"), (note || "").trim().toLowerCase()].join("|");
  }

  function lineUnit(it) {
    var p = product(it.productId);
    if (!p) return 0;
    var unit = price(p) || 0;
    (it.options || []).forEach(function (oid) {
      var o = (p.options || []).filter(function (x) {
        return x.id === oid;
      })[0];
      if (o) unit += Number(o.price) || 0;
    });
    return unit;
  }

  function cartLines() {
    return cart.map(function (it) {
      var p = product(it.productId);
      var unit = lineUnit(it);
      return {
        key: it.key,
        product: p,
        qty: it.qty,
        options: (it.options || [])
          .map(function (oid) {
            return (p.options || []).filter(function (x) {
              return x.id === oid;
            })[0];
          })
          .filter(Boolean),
        note: it.note || "",
        unit: unit,
        total: unit * it.qty
      };
    });
  }

  function persistCart() {
    write(KEYS.cart, cart);
    emit("obk:cart");
  }

  function addToCart(productId, qty, options, note) {
    var p = product(productId);
    if (!p || price(p) === null) return false;
    var key = itemKey(productId, options, note);
    var existing = cart.filter(function (it) {
      return it.key === key;
    })[0];
    if (existing) existing.qty += qty || 1;
    else
      cart.push({
        key: key,
        productId: productId,
        qty: qty || 1,
        options: options || [],
        note: (note || "").trim()
      });
    persistCart();
    return true;
  }

  function setQty(key, qty) {
    cart = cart
      .map(function (it) {
        if (it.key === key) it.qty = Math.max(0, Math.min(99, qty));
        return it;
      })
      .filter(function (it) {
        return it.qty > 0;
      });
    persistCart();
  }

  function removeItem(key) {
    cart = cart.filter(function (it) {
      return it.key !== key;
    });
    persistCart();
  }

  function clearCart() {
    cart = [];
    persistCart();
  }

  function cartCount() {
    return cart.reduce(function (n, it) {
      return n + it.qty;
    }, 0);
  }

  function subtotal() {
    return cartLines().reduce(function (s, l) {
      return s + l.total;
    }, 0);
  }

  /* ---------- Entrega ---------- */

  function zoneFor(neighborhood) {
    var d = data.settings.delivery || {};
    var n = fold(neighborhood);
    if (!n) return null;
    var zones = d.zones || [];
    for (var i = 0; i < zones.length; i++) {
      var list = String(zones[i].neighborhoods || "")
        .split(/[,;\n]/)
        .map(fold)
        .filter(Boolean);
      if (list.indexOf(n) !== -1) return zones[i];
    }
    return null;
  }

  function neighborhoods() {
    var d = data.settings.delivery || {};
    var out = [];
    (d.zones || []).forEach(function (z) {
      String(z.neighborhoods || "")
        .split(/[,;\n]/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean)
        .forEach(function (n) {
          out.push({ name: n, fee: Number(z.fee) || 0, zone: z.name });
        });
    });
    return out.sort(function (a, b) {
      return a.name.localeCompare(b.name, "pt-BR");
    });
  }

  /* Retorna { fee, known, free, label } */
  function deliveryQuote(sub, neighborhood) {
    var d = data.settings.delivery || {};
    if (d.freeEnabled && sub >= (Number(d.freeMin) || 0)) {
      return { fee: 0, known: true, free: true };
    }
    if (d.mode !== "zones") {
      return { fee: Number(d.fee) || 0, known: true, free: false };
    }
    if (!neighborhood) {
      var fees = (d.zones || []).map(function (z) {
        return Number(z.fee) || 0;
      });
      return {
        fee: null,
        known: false,
        from: fees.length ? Math.min.apply(null, fees) : null,
        free: false
      };
    }
    var z = zoneFor(neighborhood);
    if (z) return { fee: Number(z.fee) || 0, known: true, free: false, zone: z };
    if (d.otherFee !== null && d.otherFee !== undefined && d.otherFee !== "") {
      return { fee: Number(d.otherFee), known: true, free: false, outside: true };
    }
    return { fee: null, known: false, outside: true, free: false };
  }

  /* ---------- Cliente e pedidos ---------- */

  function customer() {
    return read(KEYS.customer, null);
  }

  function saveCustomer(c) {
    write(KEYS.customer, c);
  }

  function forgetCustomer() {
    remove(KEYS.customer);
  }

  function orders() {
    return read(KEYS.orders, []);
  }

  function saveOrders(list) {
    write(KEYS.orders, list);
    emit("obk:orders");
  }

  function newOrderId() {
    var d = new Date();
    var part = String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
    return "OBK-" + part + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function placeOrder(info) {
    var lines = cartLines();
    var sub = subtotal();
    var quote = deliveryQuote(sub, info.address.neighborhood);
    var order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: "novo",
      customer: { name: info.name, phone: info.phone },
      address: info.address,
      payment: info.payment,
      notes: info.notes || "",
      items: lines.map(function (l) {
        return {
          productId: l.product.id,
          name: displayName(l.product),
          qty: l.qty,
          unit: l.unit,
          total: l.total,
          options: l.options.map(function (o) {
            return { id: o.id, name: o.name, price: Number(o.price) || 0 };
          }),
          note: l.note
        };
      }),
      subtotal: sub,
      deliveryFee: quote.fee,
      deliveryFree: !!quote.free,
      total: sub + (quote.fee || 0)
    };
    var list = orders();
    list.unshift(order);
    saveOrders(list.slice(0, 200));
    return order;
  }

  /* ---------- Formatação e WhatsApp ---------- */

  function money(v) {
    if (v === null || v === undefined || isNaN(v)) return "";
    return "R$\u00a0" + Number(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function digits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  function phoneDisplay(raw) {
    var d = digits(raw);
    if (d.indexOf("55") === 0 && d.length > 11) d = d.slice(2);
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return raw || "";
  }

  function waNumber() {
    var d = digits(data.settings.whatsapp);
    if (d && d.indexOf("55") !== 0) d = "55" + d;
    return d;
  }

  function waLink(text) {
    var url = "https://api.whatsapp.com/send?phone=" + waNumber();
    if (text) url += "&text=" + encodeURIComponent(text);
    return url;
  }

  var PAYMENT_LABELS = {
    pix: "PIX",
    cash: "Dinheiro",
    credit: "Cartão de crédito",
    debit: "Cartão de débito"
  };

  function orderMessage(o) {
    var s = data.settings;
    var date = new Date(o.createdAt);
    var L = [];
    L.push("🍣 *NOVO PEDIDO — " + String(s.storeName || "ObaraKi").split(" ")[0].toUpperCase() + "*");
    L.push("Pedido " + o.id + " · " + date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    L.push("");
    L.push("👤 *Cliente*");
    L.push(o.customer.name);
    L.push(phoneDisplay(o.customer.phone));
    L.push("");
    L.push("📍 *Entrega*");
    var a = o.address;
    L.push(a.street + ", " + a.number + (a.complement ? " — " + a.complement : ""));
    L.push(a.neighborhood + " · " + a.city);
    if (a.cep) L.push("CEP " + a.cep);
    if (a.reference) L.push("Referência: " + a.reference);
    L.push("");
    L.push("🛒 *PEDIDO*");
    o.items.forEach(function (it) {
      L.push(it.qty + "x " + it.name + " — " + money(it.total));
      it.options.forEach(function (op) {
        L.push("    + " + op.name + (op.price ? " (" + money(op.price) + ")" : ""));
      });
      if (it.note) L.push("    _Obs.: " + it.note + "_");
    });
    if (o.notes) {
      L.push("");
      L.push("📝 *Observações:* " + o.notes);
    }
    L.push("");
    L.push("━━━━━━━━━━━━━━");
    L.push("💰 Subtotal: " + money(o.subtotal));
    L.push(
      "🚚 Entrega: " +
        (o.deliveryFree ? "Grátis" : o.deliveryFee === null ? "a combinar" : money(o.deliveryFee))
    );
    var pay = "💳 Pagamento: " + PAYMENT_LABELS[o.payment.method];
    L.push(pay);
    if (o.payment.method === "cash") {
      L.push(o.payment.change ? "💵 Troco para: " + money(o.payment.change) : "💵 Não precisa de troco");
    }
    L.push("");
    L.push("💰 *TOTAL: " + money(o.total) + "*" + (o.deliveryFee === null && !o.deliveryFree ? " + entrega" : ""));
    return L.join("\n");
  }

  /* ---------- Eventos ---------- */

  function emit(name) {
    try {
      window.dispatchEvent(new CustomEvent(name));
    } catch (e) {}
  }

  window.addEventListener("storage", function (e) {
    if (e.key === KEYS.cart) {
      cart = read(KEYS.cart, []);
      emit("obk:cart");
    }
  });

  window.OBK = window.OBK || {};
  window.OBK.store = {
    seedVersion: seed.version,
    get data() {
      return data;
    },
    get isDraft() {
      return isDraft;
    },
    get staleDraft() {
      return staleDraft;
    },
    clone: clone,
    saveData: saveData,
    discardDraft: discardDraft,
    exportDataFile: exportDataFile,
    settings: settings,
    categories: categories,
    category: category,
    products: products,
    product: product,
    promotions: promotions,
    activePromo: activePromo,
    displayName: displayName,
    price: price,
    originalPrice: originalPrice,
    search: search,
    fold: fold,
    cartLines: cartLines,
    addToCart: addToCart,
    setQty: setQty,
    removeItem: removeItem,
    clearCart: clearCart,
    cartCount: cartCount,
    subtotal: subtotal,
    deliveryQuote: deliveryQuote,
    neighborhoods: neighborhoods,
    customer: customer,
    saveCustomer: saveCustomer,
    forgetCustomer: forgetCustomer,
    orders: orders,
    saveOrders: saveOrders,
    placeOrder: placeOrder,
    orderMessage: orderMessage,
    money: money,
    digits: digits,
    phoneDisplay: phoneDisplay,
    waLink: waLink,
    PAYMENT_LABELS: PAYMENT_LABELS
  };
})();
