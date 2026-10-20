/* =========================================================================
   Camada de dados: catálogo, sacola, favoritos, pedidos e painel.

   Dois modos, mesma interface:
   - LIVE: Supabase configurado em config.js. Banco, autenticação, imagens
     e funções de checkout/pagamento/frete no servidor.
   - DEMO: sem Supabase. Catálogo ilustrativo e tudo salvo neste navegador.
   ========================================================================= */
(function () {
  var cfg = window.MB_CONFIG || {};
  var LIVE = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  var LS = {
    db: "mb_demo_db_v1",
    cart: "mb_cart_v1",
    fav: "mb_fav_v1",
    myOrders: "mb_my_orders_v1",
    demoAdmin: "mb_demo_admin"
  };

  // ---------------------------------------------------------------- utils
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(base, over) {
    var out = clone(base) || {};
    if (!isObj(over)) return out;
    Object.keys(over).forEach(function (k) {
      if (over[k] === undefined) return;
      out[k] = isObj(out[k]) && isObj(over[k]) ? merge(out[k], over[k]) : clone(over[k]);
    });
    return out;
  }
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  function uid(prefix) { return (prefix || "") + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
  function slugify(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

  var money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function fmt(n) { return money.format(Number(n) || 0); }

  // ---------------------------------------------------------------- supabase
  var sbPromise = null;
  function sb() {
    if (!LIVE) return Promise.reject(new Error("Supabase não configurado"));
    if (sbPromise) return sbPromise;
    sbPromise = new Promise(function (resolve, reject) {
      function make() { resolve(window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true } })); }
      if (window.supabase && window.supabase.createClient) return make();
      var s = document.createElement("script");
      s.src = scriptBase() + "../vendor/supabase.js";
      s.onload = make; s.onerror = function () { reject(new Error("Falha ao carregar o cliente do banco de dados")); };
      document.head.appendChild(s);
    });
    return sbPromise;
  }
  var _base = null;
  function scriptBase() {
    if (_base) return _base;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var m = scripts[i].src.match(/^(.*\/)store\.js(\?.*)?$/);
      if (m) return (_base = m[1]);
    }
    return (_base = "assets/js/");
  }
  function unwrap(res) {
    if (res.error) throw new Error(res.error.message || "Erro de comunicação com o servidor");
    return res.data;
  }

  // ---------------------------------------------------------------- demo db
  function demoDb() {
    var db = read(LS.db, null);
    if (!db || !db.products) { db = clone(window.MB_DEMO); write(LS.db, db); }
    return db;
  }
  function saveDemoDb(db) {
    if (!write(LS.db, db)) throw new Error("O armazenamento do navegador está cheio. Use imagens menores.");
  }

  // ---------------------------------------------------------------- catálogo
  var cache = {};
  function memo(key, fn) {
    if (!cache[key]) cache[key] = fn().catch(function (e) { delete cache[key]; throw e; });
    return cache[key];
  }
  function bust() { cache = {}; }

  function rowToProduct(r) {
    return {
      id: r.id, slug: r.slug, name: r.name, category: r.category_slug, tags: r.tags || [],
      material: r.material || "", finish: r.finish || "", price: Number(r.price),
      compare_at_price: r.compare_at_price != null ? Number(r.compare_at_price) : null,
      stock: r.stock, position: r.position || 0, active: r.active !== false, images: r.images || [],
      description: r.description || "", details: r.details || {}, options: r.options || [],
      personalization: r.personalization || null, created_at: r.created_at
    };
  }
  function productToRow(p) {
    return {
      slug: p.slug, name: p.name, category_slug: p.category, tags: p.tags || [], material: p.material,
      finish: p.finish, price: round2(p.price), compare_at_price: p.compare_at_price ? round2(p.compare_at_price) : null,
      stock: p.stock === "" || p.stock == null ? null : parseInt(p.stock, 10), position: p.position || 0,
      active: p.active !== false, images: p.images || [], description: p.description || "",
      details: p.details || {}, options: p.options || [], personalization: p.personalization || null
    };
  }

  function getSettings() {
    return memo("settings", function () {
      if (!LIVE) return Promise.resolve(merge(window.MB_DEFAULTS.settings, demoDb().settings));
      return sb().then(function (c) { return c.from("settings").select("value").eq("key", "store").maybeSingle(); })
        .then(unwrap).then(function (row) { return merge(window.MB_DEFAULTS.settings, row ? row.value : {}); });
    });
  }

  function listCategories(opts) {
    opts = opts || {};
    return memo("cats" + (opts.all ? ":all" : ""), function () {
      var p = LIVE
        ? sb().then(function (c) { return c.from("categories").select("*").order("position"); }).then(unwrap)
        : Promise.resolve(clone(demoDb().categories));
      return p.then(function (list) {
        list.sort(function (a, b) { return (a.position || 0) - (b.position || 0); });
        return opts.all ? list : list.filter(function (c) { return c.active !== false; });
      });
    });
  }

  function allProducts(includeInactive) {
    return memo("prods" + (includeInactive ? ":all" : ""), function () {
      var p = LIVE
        ? sb().then(function (c) {
            var q = c.from("products").select("*").order("position").order("created_at", { ascending: false });
            return includeInactive ? q : q.eq("active", true);
          }).then(unwrap).then(function (rows) { return rows.map(rowToProduct); })
        : Promise.resolve(clone(demoDb().products));
      return p.then(function (list) {
        list.sort(function (a, b) { return (a.position || 0) - (b.position || 0); });
        return includeInactive ? list : list.filter(function (x) { return x.active !== false; });
      });
    });
  }

  var FILTERS = {
    "mais-vendidos": function (p) { return (p.tags || []).indexOf("mais-vendido") > -1; },
    "novidades": function (p) { return (p.tags || []).indexOf("novidade") > -1; },
    "presentes": function (p) { return (p.tags || []).indexOf("presente") > -1; },
    "promocoes": function (p) { return p.compare_at_price && p.compare_at_price > p.price; }
  };

  function listProducts(q) {
    q = q || {};
    return allProducts(q.all).then(function (list) {
      if (q.category) list = list.filter(function (p) { return p.category === q.category; });
      if (q.filter && FILTERS[q.filter]) list = list.filter(FILTERS[q.filter]);
      if (q.ids) list = list.filter(function (p) { return q.ids.indexOf(p.id) > -1; });
      if (q.search) {
        var terms = norm(q.search).split(/\s+/).filter(Boolean);
        list = list.filter(function (p) {
          var hay = norm([p.name, p.material, p.finish, p.category, (p.tags || []).join(" "), p.description].join(" "));
          return terms.every(function (t) { return hay.indexOf(t) > -1; });
        });
      }
      if (q.sort === "menor") list.sort(function (a, b) { return a.price - b.price; });
      if (q.sort === "maior") list.sort(function (a, b) { return b.price - a.price; });
      if (q.sort === "novos") list.sort(function (a, b) { return String(b.created_at || b.id).localeCompare(String(a.created_at || a.id)); });
      if (q.limit) list = list.slice(0, q.limit);
      return list;
    });
  }

  function getProduct(slug) {
    return allProducts(false).then(function (list) {
      return list.filter(function (p) { return p.slug === slug; })[0] || null;
    });
  }

  // ---------------------------------------------------------------- preço
  function installments(price, s) {
    var inst = s && s.installments;
    if (!inst || !inst.enabled || !s.payments || (!s.payments.card && LIVE)) return null;
    var n = Math.min(inst.max || 1, Math.floor(price / (inst.minInstallment || 1)));
    if (n < 2) return null;
    return { n: n, value: price / n, text: "ou " + n + "x de " + fmt(price / n) + " sem juros" };
  }

  // ---------------------------------------------------------------- sacola
  function cartKey(id, options, custom) {
    return id + "|" + JSON.stringify(options || {}) + "|" + JSON.stringify(custom || {});
  }
  function getCart() { return read(LS.cart, []); }
  function setCart(items) {
    write(LS.cart, items);
    document.dispatchEvent(new CustomEvent("mb:cart", { detail: items }));
  }
  function addToCart(product, qty, options, custom) {
    var items = getCart();
    var key = cartKey(product.id, options, custom);
    var found = items.filter(function (i) { return i.key === key; })[0];
    var max = product.stock == null ? 99 : product.stock;
    if (found) found.qty = Math.min(max, found.qty + qty);
    else items.push({
      key: key, id: product.id, slug: product.slug, name: product.name, price: product.price,
      image: (product.images || [])[0] || "", material: product.material, qty: Math.min(max, qty),
      options: options || {}, custom: custom || {}, max: max
    });
    setCart(items);
    return items;
  }
  function updateQty(key, qty) {
    var items = getCart().map(function (i) {
      if (i.key === key) i.qty = Math.max(1, Math.min(i.max || 99, qty));
      return i;
    });
    setCart(items);
  }
  function removeFromCart(key) { setCart(getCart().filter(function (i) { return i.key !== key; })); }
  function clearCart() { setCart([]); }
  function cartCount() { return getCart().reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartSubtotal(items) { return round2((items || getCart()).reduce(function (s, i) { return s + i.price * i.qty; }, 0)); }

  // Atualiza preços/estoque da sacola a partir do catálogo atual.
  function refreshCart() {
    return allProducts(false).then(function (list) {
      var byId = {}; list.forEach(function (p) { byId[p.id] = p; });
      var changed = false;
      var items = getCart().filter(function (i) {
        var p = byId[i.id];
        if (!p) { changed = true; return false; }
        if (p.price !== i.price || p.name !== i.name) { i.price = p.price; i.name = p.name; changed = true; }
        i.max = p.stock == null ? 99 : p.stock;
        if (i.qty > i.max) { i.qty = i.max; changed = true; }
        return i.max > 0;
      });
      if (changed) setCart(items);
      return { items: items, changed: changed };
    });
  }

  // ---------------------------------------------------------------- favoritos
  function getFav() { return read(LS.fav, []); }
  function toggleFav(id) {
    var f = getFav(); var i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    write(LS.fav, f);
    document.dispatchEvent(new CustomEvent("mb:fav", { detail: f }));
    return i === -1;
  }

  // ---------------------------------------------------------------- frete
  function quoteShipping(cep, items) {
    return getSettings().then(function (s) {
      var subtotal = cartSubtotal(items);
      var methods = (s.shipping.methods || []).map(function (m) {
        var free = m.freeAbove && subtotal >= m.freeAbove;
        return { id: m.id, name: m.name, days: m.days, price: free ? 0 : round2(m.price), free: !!free, freeAbove: m.freeAbove || 0 };
      });
      if (!LIVE || !s.shipping.melhorEnvio) return methods;
      return sb().then(function (c) {
        return c.functions.invoke("frete", { body: { cep: cep, items: items.map(function (i) { return { id: i.id, qty: i.qty }; }) } });
      }).then(function (res) {
        if (res.error) return methods;
        return methods.concat((res.data && res.data.options) || []);
      }).catch(function () { return methods; });
    });
  }

  function lookupCep(cep) {
    cep = String(cep || "").replace(/\D/g, "");
    if (cep.length !== 8) return Promise.reject(new Error("CEP inválido"));
    return fetch("https://viacep.com.br/ws/" + cep + "/json/").then(function (r) { return r.json(); }).then(function (d) {
      if (d.erro) throw new Error("CEP não encontrado");
      return { street: d.logradouro, district: d.bairro, city: d.localidade, state: d.uf };
    });
  }

  // ---------------------------------------------------------------- cupom
  function evalCoupon(c, subtotal) {
    if (!c || !c.active) return { valid: false, message: "Cupom inválido." };
    if (c.expires_at && new Date(c.expires_at) < new Date()) return { valid: false, message: "Este cupom expirou." };
    if (c.usage_limit && (c.used_count || 0) >= c.usage_limit) return { valid: false, message: "Este cupom já atingiu o limite de uso." };
    if (c.min_subtotal && subtotal < c.min_subtotal) return { valid: false, message: "Válido para compras a partir de " + fmt(c.min_subtotal) + "." };
    var d = c.kind === "percent" ? subtotal * (c.value / 100) : c.value;
    d = round2(Math.min(d, subtotal));
    return { valid: true, code: c.code, discount: d, label: c.kind === "percent" ? c.value + "% de desconto" : fmt(c.value) + " de desconto" };
  }
  function checkCoupon(code, subtotal) {
    code = String(code || "").trim().toUpperCase();
    if (!code) return Promise.resolve({ valid: false, message: "Informe um cupom." });
    if (!LIVE) {
      var c = (demoDb().coupons || []).filter(function (x) { return x.code === code; })[0];
      return Promise.resolve(evalCoupon(c, subtotal));
    }
    return sb().then(function (cl) { return cl.rpc("check_coupon", { p_code: code, p_subtotal: subtotal }); })
      .then(unwrap).then(function (r) {
        if (!r || !r.valid) return { valid: false, message: (r && r.message) || "Cupom inválido." };
        return { valid: true, code: code, discount: Number(r.discount), label: r.label };
      });
  }

  // ---------------------------------------------------------------- totais
  function computeTotals(items, ship, coupon, giftWrap, settings, payment) {
    var subtotal = cartSubtotal(items);
    var discount = coupon && coupon.valid ? Math.min(coupon.discount, subtotal) : 0;
    var shipping = ship ? ship.price : 0;
    var gift = giftWrap && settings.giftWrap && settings.giftWrap.enabled ? round2(settings.giftWrap.price || 0) : 0;
    var pixOff = 0;
    if (payment === "pix" && settings.payments && settings.payments.pixDiscount) {
      pixOff = round2((subtotal - discount) * settings.payments.pixDiscount / 100);
    }
    var total = round2(Math.max(0, subtotal - discount - pixOff) + shipping + gift);
    return { subtotal: subtotal, discount: round2(discount), pixDiscount: pixOff, shipping: round2(shipping), gift: gift, total: total };
  }

  // ---------------------------------------------------------------- pedidos
  function placeOrder(payload) {
    if (LIVE) {
      return sb().then(function (c) { return c.functions.invoke("checkout", { body: payload }); }).then(function (res) {
        if (res.error) {
          var msg = res.error.message;
          var ctx = res.error.context;
          if (ctx && typeof ctx.json === "function") {
            return ctx.json().then(function (b) { throw new Error((b && b.error) || msg); }, function () { throw new Error(msg); });
          }
          throw new Error(msg || "Não foi possível finalizar o pedido.");
        }
        if (res.data && res.data.error) throw new Error(res.data.error);
        remember(res.data.order);
        return res.data;
      });
    }
    // Demonstração: registra o pedido neste navegador. Pagamento online não é simulado.
    return Promise.all([getSettings(), allProducts(false)]).then(function (r) {
      var s = r[0], byId = {};
      r[1].forEach(function (p) { byId[p.id] = p; });
      var items = payload.items.map(function (i) {
        var p = byId[i.id]; if (!p) throw new Error("Uma peça da sacola não está mais disponível.");
        return { id: p.id, slug: p.slug, name: p.name, price: p.price, qty: i.qty, options: i.options, custom: i.custom, image: p.images[0] };
      });
      var ship = (s.shipping.methods || []).filter(function (m) { return m.id === payload.shippingId; })[0];
      var sub = cartSubtotal(items);
      var shipQ = ship ? { id: ship.id, name: ship.name, days: ship.days, price: ship.freeAbove && sub >= ship.freeAbove ? 0 : ship.price } : null;
      var coupon = payload.coupon ? evalCoupon((demoDb().coupons || []).filter(function (c) { return c.code === payload.coupon; })[0], sub) : null;
      var t = computeTotals(items, shipQ, coupon, payload.giftWrap, s, payload.payment);
      var db = demoDb();
      var number = 1000 + (db.orders || []).length + 1;
      var order = {
        id: uid("o"), token: uid("t"), number: number, status: "aguardando", created_at: new Date().toISOString(),
        customer: payload.customer, address: payload.address, shipping: shipQ, items: items,
        coupon: coupon && coupon.valid ? coupon.code : null, gift_wrap: !!payload.giftWrap, gift_message: payload.giftMessage || "",
        payment_method: payload.payment, totals: t, notes: payload.notes || ""
      };
      db.orders = (db.orders || []).concat([order]);
      if (coupon && coupon.valid) db.coupons.forEach(function (c) { if (c.code === coupon.code) c.used_count = (c.used_count || 0) + 1; });
      saveDemoDb(db);
      remember({ id: order.id, token: order.token, number: number });
      return { order: { id: order.id, token: order.token, number: number }, payment: { method: payload.payment } };
    });
  }
  function remember(o) {
    var mine = read(LS.myOrders, []);
    if (!mine.some(function (x) { return x.id === o.id; })) mine.unshift({ id: o.id, token: o.token, number: o.number, at: new Date().toISOString() });
    write(LS.myOrders, mine.slice(0, 30));
  }
  function myLocalOrders() { return read(LS.myOrders, []); }

  function getOrder(id, token) {
    if (!LIVE) {
      var o = (demoDb().orders || []).filter(function (x) { return x.id === id && x.token === token; })[0];
      return Promise.resolve(o || null);
    }
    return sb().then(function (c) { return c.rpc("get_order", { p_id: id, p_token: token }); }).then(unwrap);
  }

  // ---------------------------------------------------------------- conta
  function auth() { return sb().then(function (c) { return c.auth; }); }
  function getUser() {
    if (!LIVE) return Promise.resolve(null);
    return auth().then(function (a) { return a.getSession(); }).then(function (r) { return r.data.session ? r.data.session.user : null; });
  }
  function signIn(email, password) { return auth().then(function (a) { return a.signInWithPassword({ email: email, password: password }); }).then(unwrap); }
  function signUp(email, password, name) {
    return auth().then(function (a) {
      return a.signUp({ email: email, password: password, options: { data: { name: name }, emailRedirectTo: location.href.split("#")[0] } });
    }).then(unwrap);
  }
  function resetPassword(email) {
    return auth().then(function (a) { return a.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0].split("?")[0] + "?redefinir=1" }); }).then(unwrap);
  }
  function updatePassword(pw) { return auth().then(function (a) { return a.updateUser({ password: pw }); }).then(unwrap); }
  function signOut() { if (!LIVE) return Promise.resolve(); return auth().then(function (a) { return a.signOut(); }); }
  function myOrders() {
    if (!LIVE) {
      var mine = myLocalOrders(); var db = demoDb();
      return Promise.resolve(mine.map(function (m) { return (db.orders || []).filter(function (o) { return o.id === m.id; })[0]; }).filter(Boolean));
    }
    return sb().then(function (c) { return c.from("orders").select("*").order("created_at", { ascending: false }); }).then(unwrap);
  }

  // ---------------------------------------------------------------- painel
  var admin = {
    isAdmin: function () {
      if (!LIVE) return Promise.resolve(read(LS.demoAdmin, false) === true);
      return getUser().then(function (u) {
        if (!u) return false;
        return sb().then(function (c) { return c.from("admins").select("user_id").eq("user_id", u.id).maybeSingle(); })
          .then(function (r) { return !r.error && !!r.data; });
      });
    },
    enterDemo: function () { write(LS.demoAdmin, true); },
    leaveDemo: function () { write(LS.demoAdmin, false); },
    resetDemo: function () { try { localStorage.removeItem(LS.db); } catch (e) {} bust(); },

    products: function () { bust(); return allProducts(true); },
    saveProduct: function (p) {
      p.slug = p.slug || slugify(p.name);
      bust();
      if (!LIVE) {
        var db = demoDb();
        if (db.products.some(function (x) { return x.slug === p.slug && x.id !== p.id; })) return Promise.reject(new Error("Já existe uma peça com este endereço (slug)."));
        if (!p.id) { p.id = uid("p"); p.created_at = new Date().toISOString(); db.products.push(p); }
        else db.products = db.products.map(function (x) { return x.id === p.id ? p : x; });
        saveDemoDb(db); return Promise.resolve(p);
      }
      return sb().then(function (c) {
        var row = productToRow(p);
        return p.id ? c.from("products").update(row).eq("id", p.id).select().single() : c.from("products").insert(row).select().single();
      }).then(unwrap).then(rowToProduct);
    },
    deleteProduct: function (id) {
      bust();
      if (!LIVE) { var db = demoDb(); db.products = db.products.filter(function (x) { return x.id !== id; }); saveDemoDb(db); return Promise.resolve(); }
      return sb().then(function (c) { return c.from("products").delete().eq("id", id); }).then(unwrap);
    },

    categories: function () { bust(); return listCategories({ all: true }); },
    saveCategory: function (cat, originalSlug) {
      bust();
      cat.slug = cat.slug || slugify(cat.name);
      if (!LIVE) {
        var db = demoDb();
        var idx = db.categories.findIndex(function (x) { return x.slug === (originalSlug || cat.slug); });
        if (idx > -1) db.categories[idx] = cat; else db.categories.push(cat);
        if (originalSlug && originalSlug !== cat.slug) db.products.forEach(function (p) { if (p.category === originalSlug) p.category = cat.slug; });
        saveDemoDb(db); return Promise.resolve(cat);
      }
      return sb().then(function (c) {
        var row = { slug: cat.slug, name: cat.name, description: cat.description || "", image: cat.image || "", position: cat.position || 0, active: cat.active !== false };
        return originalSlug ? c.from("categories").update(row).eq("slug", originalSlug) : c.from("categories").insert(row);
      }).then(unwrap);
    },
    deleteCategory: function (slug) {
      bust();
      if (!LIVE) {
        var db = demoDb();
        if (db.products.some(function (p) { return p.category === slug; })) return Promise.reject(new Error("Mova as peças desta categoria antes de excluí-la."));
        db.categories = db.categories.filter(function (x) { return x.slug !== slug; }); saveDemoDb(db); return Promise.resolve();
      }
      return sb().then(function (c) { return c.from("categories").delete().eq("slug", slug); }).then(unwrap);
    },

    settings: function () { bust(); return getSettings(); },
    saveSettings: function (s) {
      bust();
      if (!LIVE) { var db = demoDb(); db.settings = s; saveDemoDb(db); return Promise.resolve(s); }
      return sb().then(function (c) { return c.from("settings").upsert({ key: "store", value: s }); }).then(unwrap);
    },

    orders: function () {
      if (!LIVE) return Promise.resolve(clone(demoDb().orders || []).reverse());
      return sb().then(function (c) { return c.from("orders").select("*").order("created_at", { ascending: false }).limit(500); }).then(unwrap);
    },
    updateOrder: function (id, patch) {
      if (!LIVE) {
        var db = demoDb();
        db.orders = db.orders.map(function (o) { return o.id === id ? merge(o, patch) : o; });
        saveDemoDb(db); return Promise.resolve();
      }
      return sb().then(function (c) { return c.from("orders").update(patch).eq("id", id); }).then(unwrap);
    },

    coupons: function () {
      if (!LIVE) return Promise.resolve(clone(demoDb().coupons || []));
      return sb().then(function (c) { return c.from("coupons").select("*").order("code"); }).then(unwrap);
    },
    saveCoupon: function (cp) {
      cp.code = String(cp.code || "").trim().toUpperCase();
      if (!cp.code) return Promise.reject(new Error("Informe o código."));
      if (!LIVE) {
        var db = demoDb(); db.coupons = db.coupons || [];
        var i = db.coupons.findIndex(function (x) { return x.code === cp.code; });
        if (i > -1) db.coupons[i] = merge(db.coupons[i], cp); else db.coupons.push(cp);
        saveDemoDb(db); return Promise.resolve(cp);
      }
      return sb().then(function (c) { return c.from("coupons").upsert(cp); }).then(unwrap);
    },
    deleteCoupon: function (code) {
      if (!LIVE) { var db = demoDb(); db.coupons = (db.coupons || []).filter(function (x) { return x.code !== code; }); saveDemoDb(db); return Promise.resolve(); }
      return sb().then(function (c) { return c.from("coupons").delete().eq("code", code); }).then(unwrap);
    },

    // Envia imagem já otimizada (Blob webp/jpeg). Retorna URL pública.
    uploadImage: function (blob, name) {
      if (!LIVE) {
        return new Promise(function (resolve, reject) {
          var fr = new FileReader();
          fr.onload = function () { resolve(fr.result); };
          fr.onerror = function () { reject(new Error("Não foi possível ler a imagem.")); };
          fr.readAsDataURL(blob);
        });
      }
      var path = "produtos/" + Date.now() + "-" + slugify(name || "imagem") + (blob.type === "image/webp" ? ".webp" : ".jpg");
      return sb().then(function (c) {
        return c.storage.from("catalogo").upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false }).then(function (r) {
          if (r.error) throw new Error(r.error.message);
          return c.storage.from("catalogo").getPublicUrl(path).data.publicUrl;
        });
      });
    }
  };

  window.MB = window.MB || {};
  window.MB.store = {
    live: LIVE, fmt: fmt, slugify: slugify, merge: merge, clone: clone, round2: round2,
    getSettings: getSettings, listCategories: listCategories, listProducts: listProducts, getProduct: getProduct,
    installments: installments,
    getCart: getCart, addToCart: addToCart, updateQty: updateQty, removeFromCart: removeFromCart, clearCart: clearCart,
    cartCount: cartCount, cartSubtotal: cartSubtotal, refreshCart: refreshCart,
    getFav: getFav, toggleFav: toggleFav,
    quoteShipping: quoteShipping, lookupCep: lookupCep, checkCoupon: checkCoupon, computeTotals: computeTotals,
    placeOrder: placeOrder, getOrder: getOrder, myLocalOrders: myLocalOrders,
    getUser: getUser, signIn: signIn, signUp: signUp, signOut: signOut, resetPassword: resetPassword, updatePassword: updatePassword, myOrders: myOrders,
    sb: sb, admin: admin, bust: bust
  };
})();
