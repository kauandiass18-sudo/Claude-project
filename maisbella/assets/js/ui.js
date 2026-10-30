/* =========================================================================
   Interface compartilhada: cabeçalho, menu, busca, sacola, rodapé,
   WhatsApp, cartões de produto, avisos e animações.
   ========================================================================= */
(function () {
  var S = window.MB.store;

  // ---------------------------------------------------------------- ícones
  var P = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/>',
    bag: '<path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
    heart: '<path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7.1a4.2 4.2 0 0 1 7.5 2.4c0 5.6-7.5 10-7.5 10z"/>',
    menu: '<path d="M4 8h16M4 16h11"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M4 12h15M14 7l5 5-5 5"/>',
    back: '<path d="M20 12H5M10 7l-5 5 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    truck: '<path d="M3 6.5h11v10H3zM14 10h4l3 3v3.5h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17.5" cy="17.5" r="1.6"/>',
    chat: '<path d="M4.5 18.5l1.2-3.6A7.5 7.5 0 1 1 9 18.1z"/>',
    "return": '<path d="M8 8H17a3.5 3.5 0 0 1 0 7H9"/><path d="M11 5L8 8l3 3"/>',
    gem: '<path d="M7 4.5h10l3.5 4.5L12 20 3.5 9z"/><path d="M3.5 9h17M9.5 4.5L8 9l4 11 4-11-1.5-4.5"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="0.5"/><path d="M3 9h18M12 9v11"/><path d="M12 9c-1.5-3.5-5-4.2-5-1.8C7 9 12 9 12 9zM12 9c1.5-3.5 5-4.2 5-1.8C17 9 12 9 12 9z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1"/><path d="M4 6.5l8 6.5 8-6.5"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="1"/><path d="M5.5 15.5h-1v-11h11v1"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><path d="M17 7v.1"/>',
    sparkle: '<path d="M12 3.5l1.7 5.3 5.3 1.7-5.3 1.7L12 17.5l-1.7-5.3L5 10.5l5.3-1.7z"/>',
    ruler: '<path d="M3.5 15.5l12-12 5 5-12 12z"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[name] || "") + "</svg>";
  }
  var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z"/></svg>';

  // ---------------------------------------------------------------- utils
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // HTML vindo do painel (títulos com <em>, páginas institucionais): só tags simples.
  function safeHtml(html) {
    var tpl = document.createElement("template");
    tpl.innerHTML = String(html || "");
    var allowed = { P: 1, BR: 1, EM: 1, STRONG: 1, B: 1, I: 1, A: 1, UL: 1, OL: 1, LI: 1, H2: 1, H3: 1, SPAN: 1 };
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 1) {
          if (!allowed[n.tagName]) { n.replaceWith(document.createTextNode(n.textContent)); return; }
          Array.prototype.slice.call(n.attributes).forEach(function (a) {
            var ok = (a.name === "href" && n.tagName === "A" && /^(https?:|mailto:|tel:|[a-z0-9-]+\.html)/i.test(a.value)) || (a.name === "class" && a.value === "pending");
            if (!ok) n.removeAttribute(a.name);
          });
          walk(n);
        } else if (n.nodeType !== 3) n.remove();
      });
    })(tpl.content);
    return tpl.innerHTML;
  }
  function paragraphs(text) {
    return String(text || "").split(/\n{2,}/).map(function (p) { return "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Imagens locais têm versão pequena "-sm.webp" para celulares.
  function imgAttrs(url, sizes) {
    url = url || "";
    var m = url.match(/^(assets\/img\/.+)\.webp$/);
    var a = 'src="' + esc(url) + '"';
    if (m) a += ' srcset="' + esc(m[1]) + '-sm.webp 600w, ' + esc(url) + ' 1200w" sizes="' + (sizes || "(min-width: 900px) 25vw, 50vw") + '"';
    return a;
  }

  // ---------------------------------------------------------------- whatsapp
  var settings = null;
  function siteUrl() {
    var c = (window.MB_CONFIG || {}).siteUrl;
    return c ? c.replace(/\/$/, "") + "/" : location.href.replace(/[^/]*([?#].*)?$/, "");
  }
  function waUrl(text) {
    var n = settings && String(settings.whatsapp || "").replace(/\D/g, "");
    if (!n) return null;
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(text || "");
  }
  function openWa(text) {
    var url = waUrl(text);
    if (!url) { toast("O WhatsApp da loja ainda não foi configurado no painel."); return; }
    window.open(url, "_blank", "noopener");
  }

  // ---------------------------------------------------------------- toast
  function toast(msg, link) {
    var zone = $(".toast-zone");
    if (!zone) { zone = document.createElement("div"); zone.className = "toast-zone"; zone.setAttribute("role", "status"); zone.setAttribute("aria-live", "polite"); document.body.appendChild(zone); }
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = "<span>" + esc(msg) + "</span>" + (link ? '<a href="' + esc(link.href || "#") + '">' + esc(link.label) + "</a>" : "");
    if (link && link.onClick) t.querySelector("a").addEventListener("click", function (e) { e.preventDefault(); link.onClick(); t.remove(); });
    zone.appendChild(t);
    setTimeout(function () { t.classList.add("is-out"); setTimeout(function () { t.remove(); }, 400); }, 4200);
  }

  // ---------------------------------------------------------------- foco preso em painéis
  var lastFocus = null;
  function trap(panel) {
    lastFocus = document.activeElement;
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]', panel)[0];
    setTimeout(function () { (f || panel).focus(); }, 60);
  }
  function release() { if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function lock(on) { document.body.classList.toggle("is-locked", !!on); }

  // ---------------------------------------------------------------- shell
  var NAV = [
    { href: "colecao.html?filtro=novidades", label: "Novidades", key: "novidades" },
    { href: "colecao.html?categoria=ouro-18k", label: "Ouro 18K", key: "ouro-18k" },
    { href: "colecao.html?categoria=prata-925", label: "Prata 925", key: "prata-925" },
    { href: "colecao.html?categoria=aco-inoxidavel", label: "Aço inoxidável", key: "aco-inoxidavel" },
    { href: "colecao.html?categoria=aliancas-personalizados", label: "Alianças e personalizados", key: "aliancas-personalizados" },
    { href: "colecao.html?filtro=presentes", label: "Presentes", key: "presentes" },
    { href: "sobre.html", label: "A Mais Bella", key: "sobre" }
  ];

  // Assinatura "mb" com a pedra, extraída da logo oficial, e o nome em versaletes.
  var LOGO = '<a class="logo" href="index.html" aria-label="Mais Bella Semijoias, página inicial">' +
    '<img class="logo__mark" src="assets/img/logo-mb.png" alt="" width="462" height="102"><span class="logo__word">Mais Bella Semijoias</span></a>';

  function logoHtml(s) {
    if (s.logoUrl) return '<a class="logo" href="index.html" aria-label="Mais Bella Semijoias, página inicial"><img class="logo__custom" src="' + esc(s.logoUrl) + '" alt="Mais Bella Semijoias"></a>';
    return LOGO;
  }

  function currentNavKey() {
    var file = location.pathname.split("/").pop() || "index.html";
    if (file === "sobre.html") return "sobre";
    return qs("categoria") || qs("filtro") || "";
  }

  function header(s, opts) {
    var cur = currentNavKey();
    var nav = NAV.map(function (n) {
      return '<li><a class="nav__link" href="' + n.href + '"' + (n.key === cur ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
    }).join("");
    return (
      '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>' +
      '<div class="topbar" data-edit="announcement">' + esc(s.announcement) + "</div>" +
      '<header class="header" id="topo">' +
      '<div class="header__row">' +
      '<div class="header__left">' +
      '<button class="header__btn hide-lg" type="button" data-open="menu" aria-label="Abrir menu">' + icon("menu") + "</button>" +
      '<button class="header__btn" type="button" data-open="search" aria-label="Buscar">' + icon("search") + "</button>" +
      "</div>" +
      logoHtml(s) +
      '<div class="header__right">' +
      '<a class="header__btn hide-sm" href="conta.html" aria-label="Minha conta">' + icon("user") + "</a>" +
      '<a class="header__btn hide-sm" href="colecao.html?lista=favoritos" aria-label="Favoritos">' + icon("heart") + '<span class="count" data-fav-count></span></a>' +
      '<button class="header__btn" type="button" data-open="cart" aria-label="Abrir sacola">' + icon("bag") + '<span class="count" data-cart-count></span></button>' +
      "</div></div>" +
      '<nav class="nav" aria-label="Categorias"><ul class="nav__list">' + nav + "</ul></nav>" +
      "</header>" +
      // menu mobile
      '<div class="drawer-menu" id="menu" aria-hidden="true">' +
      '<div class="drawer-menu__scrim" data-close></div>' +
      '<div class="drawer-menu__panel" role="dialog" aria-modal="true" aria-label="Menu" tabindex="-1">' +
      '<div class="drawer-menu__head">' + logoHtml(s).replace('class="logo"', 'class="logo" style="align-items:flex-start"') +
      '<button class="header__btn" type="button" data-close aria-label="Fechar menu">' + icon("close") + "</button></div>" +
      '<nav class="drawer-menu__list" aria-label="Menu principal">' +
      '<a href="colecao.html">Toda a coleção ' + icon("arrow", "icon--sm") + "</a>" +
      NAV.map(function (n) { return '<a href="' + n.href + '">' + n.label + " " + icon("arrow", "icon--sm") + "</a>"; }).join("") +
      "</nav>" +
      '<div class="drawer-menu__foot">' +
      '<a href="conta.html">' + icon("user", "icon--sm") + " Minha conta</a>" +
      '<a href="colecao.html?lista=favoritos">' + icon("heart", "icon--sm") + " Favoritos</a>" +
      '<a href="#" data-wa="general">' + icon("chat", "icon--sm") + " Atendimento pelo WhatsApp</a>" +
      (s.instagram ? '<a href="' + esc(s.instagram) + '" target="_blank" rel="noopener">' + icon("instagram", "icon--sm") + " Instagram</a>" : "") +
      "</div></div></div>" +
      // busca
      '<div class="search" id="search" aria-hidden="true">' +
      '<div class="search__scrim" data-close></div>' +
      '<div class="search__panel" role="dialog" aria-modal="true" aria-label="Buscar peças">' +
      '<form class="search__bar" action="colecao.html" role="search">' + icon("search") +
      '<label class="sr-only" for="search-input">Buscar peças</label>' +
      '<input id="search-input" name="busca" type="search" autocomplete="off" placeholder="O que você procura?">' +
      '<button class="header__btn" type="button" data-close aria-label="Fechar busca">' + icon("close") + "</button></form>" +
      '<div class="search__results" data-search-results></div>' +
      "</div></div>"
    );
  }

  function footer(s) {
    var y = new Date().getFullYear();
    var legal = s.legal || {};
    var ig = s.instagram
      ? '<a class="link" href="' + esc(s.instagram) + '" target="_blank" rel="noopener">' + icon("instagram", "icon--sm") + " Seguir no Instagram</a>"
      : '<p class="small">Perfil oficial em breve.</p>';
    var igPhotos = (s.instagramPhotos || []).slice(0, 6).map(function (u) {
      return '<a href="' + esc(s.instagram || "#") + '" target="_blank" rel="noopener"><img src="' + esc(u) + '" alt="" loading="lazy"></a>';
    }).join("");
    return (
      '<footer class="footer">' +
      '<div class="wrap">' +
      '<div class="footer__top">' +
      '<div class="footer__brand"><img class="footer__seal" src="' + esc(s.logoUrl || "assets/img/logo-circular.png") + '" alt="Mais Bella Semijoias" width="545" height="545" loading="lazy">' +
      '<p class="tagline">' + esc(s.tagline) + "</p>" +
      (s.hours ? '<p class="small">' + esc(s.hours) + "</p>" : "") +
      "</div>" +
      '<div class="footer__cols">' +
      '<div class="footer__col"><h3>A loja</h3><ul>' +
      '<li><a href="sobre.html">Nossa história</a></li><li><a href="colecao.html">Coleções</a></li><li><a href="colecao.html?filtro=novidades">Novidades</a></li><li><a href="colecao.html?filtro=presentes">Presentes</a></li></ul></div>' +
      '<div class="footer__col"><h3>Atendimento</h3><ul>' +
      '<li><a href="contato.html">Fale conosco</a></li><li><a href="#" data-wa="general">WhatsApp</a></li><li><a href="faq.html">Perguntas frequentes</a></li><li><a href="conta.html">Minha conta</a></li></ul></div>' +
      '<div class="footer__col"><h3>Informações</h3><ul>' +
      '<li><a href="entrega.html">Entrega</a></li><li><a href="trocas.html">Trocas e devoluções</a></li><li><a href="garantia.html">Garantia</a></li><li><a href="privacidade.html">Privacidade</a></li><li><a href="termos.html">Termos de compra</a></li></ul></div>' +
      '<div class="footer__col"><h3>Instagram</h3><p class="small" style="margin-bottom:1rem">Novidades, bastidores e inspirações.</p>' + ig +
      (igPhotos ? '<div class="footer__insta">' + igPhotos + "</div>" : "") + "</div>" +
      "</div></div>" +
      '<div class="footer__bottom"><div>© ' + y + " " + esc(legal.company || s.storeName) +
      (legal.cnpj ? " · CNPJ " + esc(legal.cnpj) : "") + (legal.address ? " · " + esc(legal.address) : "") +
      ". Todos os direitos reservados." +
      (S.live ? "" : "<br>Demonstração: imagens renderizadas em 3D e valores ilustrativos.") + "</div>" +
      '<div class="footer__pay" aria-label="Formas de pagamento">' + payBadges(s) + "</div>" +
      "</div></div></footer>"
    );
  }
  function payBadges(s) {
    var out = [];
    if (s.payments.pix) out.push("<span>Pix</span>");
    if (s.payments.card) out.push("<span>Cartão de crédito</span>");
    return out.join("");
  }

  function cartPanel() {
    return (
      '<div class="cart" id="cart" aria-hidden="true">' +
      '<div class="cart__scrim" data-close></div>' +
      '<aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">' +
      '<div class="cart__head"><h2 id="cart-title">Sacola <span data-cart-label></span></h2>' +
      '<button class="header__btn" type="button" data-close aria-label="Fechar sacola">' + icon("close") + "</button></div>" +
      '<div class="cart__body" data-cart-body></div>' +
      '<div class="cart__foot" data-cart-foot></div>' +
      "</aside></div>"
    );
  }

  // ---------------------------------------------------------------- abrir/fechar painéis
  function openPanel(id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.add("is-open"); el.setAttribute("aria-hidden", "false"); lock(true);
    trap(el);
    if (id === "cart") renderCart();
    if (id === "search") setTimeout(function () { var i = $("#search-input"); if (i) i.focus(); }, 80);
  }
  function closePanels() {
    var any = false;
    $$(".cart.is-open, .drawer-menu.is-open, .search.is-open").forEach(function (el) {
      el.classList.remove("is-open"); el.setAttribute("aria-hidden", "true"); any = true;
    });
    if (any) { lock(false); release(); }
  }

  // ---------------------------------------------------------------- sacola
  function optText(item) {
    var parts = [];
    Object.keys(item.options || {}).forEach(function (k) { parts.push(k + ": " + item.options[k]); });
    Object.keys(item.custom || {}).forEach(function (k) {
      if (item.custom[k]) parts.push(k + ": “" + item.custom[k] + "”");
    });
    return parts.join(" · ");
  }

  function renderCart() {
    var body = $("[data-cart-body]"), foot = $("[data-cart-foot]"), label = $("[data-cart-label]");
    if (!body) return;
    var items = S.getCart();
    var count = S.cartCount();
    label.textContent = count ? "(" + count + ")" : "";
    if (!items.length) {
      body.innerHTML = '<div class="empty">' + icon("bag", "icon--lg") + '<p class="h3">Sua sacola está vazia</p><p>Que tal começar pelas novidades?</p>' +
        '<a class="btn btn--ghost" href="colecao.html?filtro=novidades">Ver novidades</a></div>';
      foot.innerHTML = ""; foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = items.map(function (i) {
      return (
        '<div class="line-item" data-key="' + esc(i.key) + '">' +
        '<a class="line-item__img" href="produto.html?p=' + encodeURIComponent(i.slug) + '"><img ' + imgAttrs(i.image, "88px") + ' alt="" loading="lazy"></a>' +
        "<div>" +
        '<a class="line-item__name" href="produto.html?p=' + encodeURIComponent(i.slug) + '">' + esc(i.name) + "</a>" +
        '<div class="line-item__meta">' + esc(i.material || "") + (optText(i) ? "<br>" + esc(optText(i)) : "") + "</div>" +
        '<div class="line-item__bottom">' +
        '<div class="qty qty--sm" role="group" aria-label="Quantidade">' +
        '<button type="button" data-dec aria-label="Diminuir"' + (i.qty <= 1 ? " disabled" : "") + ">" + icon("minus", "icon--sm") + "</button>" +
        "<span>" + i.qty + "</span>" +
        '<button type="button" data-inc aria-label="Aumentar"' + (i.qty >= (i.max || 99) ? " disabled" : "") + ">" + icon("plus", "icon--sm") + "</button></div>" +
        '<span class="line-item__price">' + S.fmt(i.price * i.qty) + "</span></div>" +
        '<button class="line-item__remove" type="button" data-remove>Remover</button>' +
        "</div></div>"
      );
    }).join("");
    var sub = S.cartSubtotal(items);
    var inst = S.installments(sub, settings);
    foot.innerHTML =
      '<div class="cart__row"><span>Subtotal</span><strong class="price">' + S.fmt(sub) + "</strong></div>" +
      (inst ? '<div class="cart__note" style="margin-top:-.6rem;text-align:right">' + esc(inst.text) + "</div>" : "") +
      '<p class="cart__note">Frete e cupom são calculados na finalização da compra.</p>' +
      '<a class="btn btn--block" href="checkout.html">Finalizar compra</a>' +
      '<button class="btn btn--ghost btn--block" type="button" data-close>Continuar comprando</button>';
  }

  function updateCounts() {
    var c = S.cartCount();
    $$("[data-cart-count]").forEach(function (el) {
      var prev = el.textContent;
      el.textContent = c || "";
      el.classList.toggle("is-on", c > 0);
      if (prev && String(c) !== prev) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    var f = S.getFav().length;
    $$("[data-fav-count]").forEach(function (el) { el.textContent = f || ""; el.classList.toggle("is-on", f > 0); });
  }

  // ---------------------------------------------------------------- cartão de produto
  function productCard(p, s, opts) {
    opts = opts || {};
    var fav = S.getFav().indexOf(p.id) > -1;
    var sale = p.compare_at_price && p.compare_at_price > p.price;
    var tags = [];
    if (sale) tags.push('<span class="tag tag--sale">Promoção</span>');
    else if ((p.tags || []).indexOf("novidade") > -1) tags.push('<span class="tag">Novidade</span>');
    var inst = S.installments(p.price, s);
    var url = "produto.html?p=" + encodeURIComponent(p.slug);
    var out = p.stock === 0;
    var needsChoice = (p.options && p.options.length) || p.personalization;
    return (
      '<article class="card' + (opts.reveal ? " reveal" : "") + '">' +
      '<a class="card__media" href="' + url + '" tabindex="-1" aria-hidden="true">' +
      "<img " + imgAttrs(p.images[0]) + ' alt="" loading="lazy" decoding="async">' +
      (p.images[1] ? '<img class="alt" ' + imgAttrs(p.images[1]) + ' alt="" loading="lazy" decoding="async">' : "") +
      "</a>" +
      (tags.length ? '<div class="card__tags">' + tags.join("") + "</div>" : "") +
      '<button class="card__fav" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? "Remover dos favoritos" : "Adicionar aos favoritos") + ": " + esc(p.name) + '">' + icon("heart") + "</button>" +
      '<div class="card__quick">' +
      (out ? '<span class="btn btn--sm is-disabled">Esgotado</span>'
        : needsChoice ? '<a class="btn btn--sm" href="' + url + '">Escolher opções</a>'
        : '<button class="btn btn--sm" type="button" data-quick-add="' + esc(p.id) + '">Adicionar à sacola</button>') +
      "</div>" +
      '<div class="card__body">' +
      '<span class="card__mat">' + esc(p.material) + "</span>" +
      '<h3 class="card__name"><a href="' + url + '">' + esc(p.name) + "</a></h3>" +
      '<div class="card__price">' + (out ? '<span class="muted">Esgotado</span>' : (sale ? "<s>" + S.fmt(p.compare_at_price) + "</s>" : "") + '<span class="price">' + S.fmt(p.price) + "</span>") + "</div>" +
      (inst && !out ? '<div class="card__inst">' + esc(inst.text) + "</div>" : "") +
      // Em telas de toque não existe hover: o botão fica sempre visível abaixo do preço.
      '<div class="card__cta">' +
      (out || needsChoice ? '<a class="btn btn--ghost btn--xs" href="' + url + '">' + (out ? "Ver peça" : "Ver opções") + "</a>"
        : '<button class="btn btn--ghost btn--xs" type="button" data-quick-add="' + esc(p.id) + '">' + icon("bag", "icon--sm") + " Adicionar</button>") +
      "</div>" +
      "</div></article>"
    );
  }

  function skeletonCards(n) {
    var h = "";
    for (var i = 0; i < n; i++) h += '<div class="card card--skeleton" aria-hidden="true"><div class="card__media skeleton"></div><div class="card__body"><div class="line skeleton"></div><div class="line skeleton"></div></div></div>';
    return h;
  }

  // ---------------------------------------------------------------- busca ao vivo
  var searchTimer = null;
  function renderSearch(term) {
    var box = $("[data-search-results]"); if (!box) return;
    if (!term || term.length < 2) {
      box.innerHTML = '<p class="search__hint">Sugestões</p><div class="search__chips">' +
        ["Colar", "Argola", "Anel", "Pérola", "Alianças", "Prata", "Personalizado"].map(function (t) {
          return '<a class="chip" href="colecao.html?busca=' + encodeURIComponent(t) + '">' + t + "</a>";
        }).join("") + "</div>";
      return;
    }
    S.listProducts({ search: term, limit: 8 }).then(function (list) {
      if (!list.length) { box.innerHTML = '<p class="search__hint">Nenhuma peça encontrada para “' + esc(term) + "”.</p>"; return; }
      box.innerHTML = '<p class="search__hint" style="margin-bottom:1rem">' + list.length + " resultado" + (list.length > 1 ? "s" : "") +
        ' · <a href="colecao.html?busca=' + encodeURIComponent(term) + '" style="text-decoration:underline">ver todos</a></p><div class="search__grid">' +
        list.map(function (p) { return productCard(p, settings); }).join("") + "</div>";
    });
  }

  // ---------------------------------------------------------------- animações de entrada
  var io = null;
  function observeReveal(root) {
    var els = $$(".reveal:not(.is-in)", root);
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (e) { e.classList.add("is-in"); }); return;
    }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------------------------------------------------------------- eventos globais
  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-open],[data-close],[data-fav],[data-quick-add],[data-wa],[data-dec],[data-inc],[data-remove]");
      if (!t) return;
      if (t.hasAttribute("data-open")) { e.preventDefault(); closePanels(); openPanel(t.getAttribute("data-open")); return; }
      if (t.hasAttribute("data-close")) { e.preventDefault(); closePanels(); return; }
      if (t.hasAttribute("data-wa")) {
        e.preventDefault();
        var kind = t.getAttribute("data-wa");
        openWa((settings.wa && settings.wa[kind]) || settings.wa.general);
        return;
      }
      if (t.hasAttribute("data-fav")) {
        e.preventDefault();
        var added = S.toggleFav(t.getAttribute("data-fav"));
        $$('[data-fav="' + t.getAttribute("data-fav") + '"]').forEach(function (b) {
          b.setAttribute("aria-pressed", added);
          b.setAttribute("aria-label", (added ? "Remover dos favoritos" : "Adicionar aos favoritos"));
        });
        toast(added ? "Peça adicionada aos favoritos." : "Peça removida dos favoritos.", added ? { href: "colecao.html?lista=favoritos", label: "Ver favoritos" } : null);
        return;
      }
      if (t.hasAttribute("data-quick-add")) {
        e.preventDefault();
        var id = t.getAttribute("data-quick-add");
        S.listProducts({ ids: [id] }).then(function (l) {
          if (!l[0]) return;
          S.addToCart(l[0], 1, {}, {});
          openPanel("cart");
        });
        return;
      }
      var li = t.closest(".line-item");
      if (li) {
        var key = li.getAttribute("data-key");
        var item = S.getCart().filter(function (i) { return i.key === key; })[0];
        if (!item) return;
        if (t.hasAttribute("data-dec")) S.updateQty(key, item.qty - 1);
        if (t.hasAttribute("data-inc")) S.updateQty(key, item.qty + 1);
        if (t.hasAttribute("data-remove")) {
          S.removeFromCart(key);
          toast("Peça removida da sacola.", { label: "Desfazer", onClick: function () {
            var items = S.getCart(); items.push(item); localStorage.setItem("mb_cart_v1", JSON.stringify(items));
            document.dispatchEvent(new CustomEvent("mb:cart"));
          } });
        }
      }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanels(); });
    document.addEventListener("mb:cart", function () { updateCounts(); if ($("#cart.is-open")) renderCart(); });
    document.addEventListener("mb:fav", updateCounts);
    window.addEventListener("storage", function (e) { if (e.key === "mb_cart_v1") { updateCounts(); renderCart(); } });

    var input = $("#search-input");
    if (input) input.addEventListener("input", function () {
      clearTimeout(searchTimer);
      var v = input.value.trim();
      searchTimer = setTimeout(function () { renderSearch(v); }, 160);
    });
    renderSearch("");

    var hdr = $(".header");
    var onScroll = function () {
      var y = window.scrollY;
      if (hdr) hdr.classList.toggle("is-scrolled", y > 140);
      var wa = $(".wa-float");
      if (wa) wa.classList.toggle("is-hidden", y < 240 && document.body.getAttribute("data-page") === "home");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------- montagem
  function mount(opts) {
    opts = opts || {};
    return S.getSettings().then(function (s) {
      settings = s;
      var top = document.getElementById("mb-header");
      if (top && !opts.minimal) top.outerHTML = header(s);
      var bottom = document.getElementById("mb-footer");
      if (bottom) bottom.outerHTML = footer(s);
      document.body.insertAdjacentHTML("beforeend", cartPanel());
      if (!opts.noWa) {
        document.body.insertAdjacentHTML("beforeend",
          '<a class="wa-float' + (document.body.getAttribute("data-page") === "home" ? " is-hidden" : "") + '" href="#" data-wa="general" aria-label="Atendimento pelo WhatsApp">' + WA_SVG + '<span class="wa-label">Atendimento</span></a>');
      }
      if (!S.live && !opts.minimal && document.body.getAttribute("data-page") !== "pedido") {
        document.body.insertAdjacentHTML("beforeend", '<button class="demo-pill" type="button" data-demo-info>Demonstração</button>');
        $("[data-demo-info]").addEventListener("click", function () {
          modal('<p class="eyebrow">Modo demonstração</p><h2 class="h3" style="margin:1rem 0">Uma prévia completa da loja</h2>' +
            '<div class="prose" style="font-size:.9rem">' +
            "<p>As imagens das peças são renderizações 3D criadas para esta apresentação e serão substituídas pelas fotografias reais da Mais Bella. Nomes, preços, parcelamento e frete são ilustrativos.</p>" +
            "<p>A sacola, a finalização da compra e o painel funcionam de verdade e salvam tudo neste navegador. Pagamentos por Pix e cartão são ativados ao conectar o banco de dados e o provedor de pagamento.</p>" +
            '<p><a href="admin.html">Abrir o painel da loja</a></p></div>');
        });
      }
      updateCounts();
      bind();
      observeReveal();
      // atualiza preços da sacola com o catálogo atual
      S.refreshCart().then(function (r) { if (r.changed) updateCounts(); }).catch(function () {});
      return s;
    }).catch(function (err) {
      console.error(err);
      document.body.insertAdjacentHTML("afterbegin", '<div class="notice notice--error" style="margin:1rem">Não foi possível carregar a loja agora. Verifique sua conexão e tente novamente.</div>');
      throw err;
    });
  }

  function modal(html, onClose) {
    var m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = '<div class="modal__scrim" data-x></div><div class="modal__box" role="dialog" aria-modal="true">' +
      '<button class="modal__close" type="button" data-x aria-label="Fechar">' + icon("close") + "</button>" + html + "</div>";
    document.body.appendChild(m); lock(true);
    var box = m.querySelector(".modal__box"); trap(box);
    function close() { m.remove(); lock(false); release(); document.removeEventListener("keydown", onKey); if (onClose) onClose(); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    m.addEventListener("click", function (e) { if (e.target.closest("[data-x]")) close(); });
    return { el: m, close: close };
  }

  function setMeta(title, description, image) {
    if (title) document.title = title;
    function set(sel, attr, val) { var el = $(sel); if (el && val) el.setAttribute(attr, val); }
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    if (image) set('meta[property="og:image"]', "content", /^https?:/.test(image) ? image : siteUrl() + image);
    set('link[rel="canonical"]', "href", location.href.split("#")[0]);
  }

  window.MB.ui = {
    icon: icon, esc: esc, safeHtml: safeHtml, paragraphs: paragraphs, qs: qs, $: $, $$: $$, imgAttrs: imgAttrs,
    mount: mount, productCard: productCard, skeletonCards: skeletonCards, toast: toast, modal: modal,
    openPanel: openPanel, closePanels: closePanels, observeReveal: observeReveal, waUrl: waUrl, openWa: openWa,
    siteUrl: siteUrl, setMeta: setMeta, optText: optText, WA_SVG: WA_SVG, lock: lock,
    settings: function () { return settings; }
  };
})();
