/* Página de produto */
(function () {
  var S = MB.store, U = MB.ui;
  var slug = U.qs("p");
  var settings, product, cats = [];
  var chosen = {}, qty = 1;

  U.mount().then(function (s) {
    settings = s;
    return Promise.all([S.getProduct(slug), S.listCategories()]);
  }).then(function (r) {
    product = r[0]; cats = r[1];
    if (!product) return notFound();
    render();
  }).catch(function () {
    U.$("[data-pdp]").innerHTML = '<div class="empty" style="grid-column:1/-1"><p class="h3">Não foi possível carregar esta peça.</p><button class="btn btn--ghost" type="button" onclick="location.reload()">Tentar novamente</button></div>';
  });

  function notFound() {
    document.title = "Peça não encontrada · Mais Bella Semijoias";
    U.$("[data-pdp]").innerHTML = '<div class="empty" style="grid-column:1/-1;padding:5rem 1rem"><p class="h3">Esta peça não está mais disponível.</p><p>Ela pode ter saído da coleção. Veja outras peças que separamos para você.</p><a class="btn" href="colecao.html">Ver coleção</a></div>';
  }

  function cat() { return cats.filter(function (c) { return c.slug === product.category; })[0]; }

  function render() {
    var p = product, c = cat();
    var sale = p.compare_at_price && p.compare_at_price > p.price;
    var inst = S.installments(p.price, settings);
    var out = p.stock === 0;
    U.setMeta(p.name + " · " + p.material + " · Mais Bella Semijoias", p.description.slice(0, 155), p.images[0]);
    structured(p);

    U.$("[data-crumbs]").innerHTML = '<a href="index.html">Início</a><span aria-hidden="true">/</span>' +
      (c ? '<a href="colecao.html?categoria=' + encodeURIComponent(c.slug) + '">' + U.esc(c.name) + '</a><span aria-hidden="true">/</span>' : "") +
      '<span aria-current="page">' + U.esc(p.name) + "</span>";

    var imgs = p.images.length ? p.images : [""];
    var gallery =
      '<div class="gallery">' +
      '<div class="gallery__thumbs" role="tablist" aria-label="Imagens da peça">' +
      imgs.map(function (src, i) { return '<button type="button" data-thumb="' + i + '" aria-label="Imagem ' + (i + 1) + '" aria-current="' + (i === 0) + '"><img ' + U.imgAttrs(src, "76px") + ' alt=""></button>'; }).join("") +
      "</div>" +
      '<div style="position:relative;min-width:0">' +
      '<div class="gallery__track" data-track tabindex="0" aria-label="Galeria de imagens. Toque para ampliar.">' +
      imgs.map(function (src, i) {
        return '<div class="gallery__slide" data-slide="' + i + '"><img ' + U.imgAttrs(src, "(min-width: 900px) 55vw, 100vw") +
          ' alt="' + U.esc(p.name) + (i ? " — imagem " + (i + 1) : "") + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '><div class="zoom-lens"></div></div>';
      }).join("") +
      "</div>" +
      (imgs.length > 1 ? '<div class="gallery__dots" aria-hidden="true">' + imgs.map(function (_, i) { return '<span class="' + (i ? "" : "is-on") + '"></span>'; }).join("") + "</div>" : "") +
      "</div></div>";

    var opts = (p.options || []).map(function (o, oi) {
      return '<div class="opt" data-opt="' + oi + '">' +
        '<div class="opt__head"><span class="label" id="opt-l-' + oi + '">' + U.esc(o.name) + '</span><span class="val" data-opt-val>Selecione</span></div>' +
        '<div class="opt__values" role="radiogroup" aria-labelledby="opt-l-' + oi + '">' +
        o.values.map(function (v) { return '<button class="chip" type="button" role="radio" aria-checked="false" data-val="' + U.esc(v) + '">' + U.esc(v) + "</button>"; }).join("") +
        '</div><p class="error" data-opt-err hidden style="color:var(--danger);font-size:.74rem;margin-top:.5rem">Escolha uma opção.</p></div>';
    }).join("");
    if (p.options && p.options.some(function (o) { return /aro/i.test(o.name); })) {
      opts += '<a class="small muted" href="#" data-wa-size style="display:inline-flex;gap:.5rem;align-items:center;text-decoration:underline;text-underline-offset:3px">' + U.icon("ruler", "icon--sm") + " Não sabe seu aro? Fale com a loja</a>";
    }

    var pers = "";
    if (p.personalization && p.personalization.fields && p.personalization.fields.length) {
      var pz = p.personalization;
      pers = '<div class="personal" data-personal>' +
        '<div><p class="personal__title">' + U.esc(pz.title || "Personalização") + "</p>" + (pz.note ? '<p class="small muted" style="margin-top:.3rem">' + U.esc(pz.note) + "</p>" : "") + "</div>" +
        pz.fields.map(function (f) {
          return '<div class="field"><label for="pf-' + f.key + '">' + U.esc(f.label) + (f.required ? " *" : " (opcional)") + "</label>" +
            '<input class="input" id="pf-' + f.key + '" data-pf="' + f.key + '" maxlength="' + (f.maxLength || 20) + '" placeholder="' + U.esc(f.placeholder || "") + '" autocomplete="off"' + (f.required ? " required" : "") + ">" +
            '<span class="hint"><span data-pf-count="' + f.key + '">0</span>/' + (f.maxLength || 20) + ' caracteres</span><span class="error" data-pf-err="' + f.key + '"></span></div>';
        }).join("") +
        '<div><span class="label" style="font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--warm-ink)">Prévia</span><p class="preview" data-pf-preview>—</p></div>' +
        (pz.confirm ? '<label class="check"><input type="checkbox" data-pf-confirm> <span>Conferi a grafia, os espaços e as datas. Entendo que peças gravadas são produzidas sob encomenda.</span></label><span class="error" data-pf-confirm-err style="color:var(--danger);font-size:.74rem"></span>' : "") +
        (settings.personalizedLeadTime ? '<p class="small muted">' + U.esc(settings.personalizedLeadTime) + "</p>" : "") +
        "</div>";
    }

    var stockLine = "";
    if (p.stock != null) {
      if (p.stock === 0) stockLine = '<p class="buy__stock is-out">Esgotado no momento</p>';
      else if (p.stock <= 3) stockLine = '<p class="buy__stock is-low">Últimas ' + p.stock + " unidades</p>";
      else stockLine = '<p class="buy__stock">Disponível para envio</p>';
    } else if (p.personalization) stockLine = '<p class="buy__stock">Produzido sob encomenda</p>';

    var d = p.details || {};
    var specs = [["Material", d.material || p.material], ["Acabamento", d.acabamento || p.finish], ["Medidas", d.medidas], ["Peso", d.peso]]
      .filter(function (x) { return x[1]; })
      .map(function (x) { return "<dt>" + x[0] + "</dt><dd>" + U.esc(x[1]) + "</dd>"; }).join("");

    var shipText = (settings.shipping.methods || []).length
      ? "<p>Calcule o frete com seu CEP na finalização da compra. Opções disponíveis: " + settings.shipping.methods.map(function (m) { return U.esc(m.name) + (m.days ? " (" + U.esc(m.days) + ")" : ""); }).join(", ") + ".</p>"
      : "<p>O valor e o prazo de entrega são calculados com seu CEP na finalização da compra.</p>";

    var buy =
      '<div class="buy">' +
      '<div style="display:grid;gap:.9rem">' +
      '<span class="buy__mat">' + U.esc(p.material) + (p.finish ? " · " + U.esc(p.finish) : "") + "</span>" +
      '<h1 class="buy__title">' + U.esc(p.name) + "</h1>" +
      '<div class="buy__price"><div><span class="now">' + S.fmt(p.price) + "</span>" + (sale ? "<s>" + S.fmt(p.compare_at_price) + "</s>" : "") + "</div>" +
      (inst ? '<span class="inst">' + U.esc(inst.text) + "</span>" : "") +
      (settings.payments.pix && settings.payments.pixDiscount ? '<span class="inst">' + settings.payments.pixDiscount + "% de desconto no Pix</span>" : "") +
      "</div></div>" +
      '<p class="buy__desc">' + U.esc(p.description) + "</p>" +
      (opts ? '<div class="buy__opts">' + opts + "</div>" : "") +
      pers +
      stockLine +
      '<div class="buy__actions" data-actions>' +
      '<div class="qty" role="group" aria-label="Quantidade"><button type="button" data-q="-1" aria-label="Diminuir quantidade">' + U.icon("minus", "icon--sm") + '</button><output data-qv aria-live="polite">1</output><button type="button" data-q="1" aria-label="Aumentar quantidade">' + U.icon("plus", "icon--sm") + "</button></div>" +
      '<button class="btn" type="button" data-add' + (out ? " disabled" : "") + ">" + (out ? "Esgotado" : "Adicionar à sacola") + "</button>" +
      '<button class="btn btn--ghost" type="button" data-buy-now' + (out ? " disabled" : "") + ">Comprar agora</button>" +
      "</div>" +
      '<a class="buy__wa" href="#" data-wa-product>' + '<span style="width:22px;height:22px;display:inline-grid">' + U.WA_SVG + "</span>" +
      "<div><strong>" + (out ? "Avise-me pelo WhatsApp" : "Tire suas dúvidas sobre esta peça") + "</strong><span>Atendimento personalizado pelo WhatsApp</span></div>" + U.icon("arrow", "icon--sm") + "</a>" +
      '<ul class="buy__perks">' +
      "<li>" + U.icon("truck", "icon--sm") + "<span>Frete calculado pelo CEP na finalização" + freeShipText() + "</span></li>" +
      "<li>" + U.icon("return", "icon--sm") + '<span>Até 7 dias para desistir da compra após o recebimento. <a href="trocas.html" style="text-decoration:underline">Ver política</a></span></li>' +
      (settings.giftWrap.enabled ? "<li>" + U.icon("gift", "icon--sm") + "<span>" + U.esc(settings.giftWrap.label) + (settings.giftWrap.price ? " por " + S.fmt(settings.giftWrap.price) : " sem custo adicional") + ", escolha na finalização</span></li>" : "") +
      "</ul>" +
      '<div class="acc">' +
      '<details open><summary>Detalhes da peça</summary><div class="acc__body"><dl class="specs">' + specs + "</dl></div></details>" +
      (d.cuidados ? '<details><summary>Cuidados e conservação</summary><div class="acc__body"><p>' + U.esc(d.cuidados) + "</p></div></details>" : "") +
      '<details><summary>Entrega e prazos</summary><div class="acc__body">' + shipText + '<p><a href="entrega.html" style="text-decoration:underline">Entrega e frete</a></p></div></details>' +
      '<details><summary>Trocas e garantia</summary><div class="acc__body"><p>Você pode desistir da compra em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor.</p><p><a href="trocas.html" style="text-decoration:underline">Trocas e devoluções</a> · <a href="garantia.html" style="text-decoration:underline">Garantia</a></p></div></details>' +
      "</div></div>";

    U.$("[data-pdp]").innerHTML = gallery + buy;
    document.body.insertAdjacentHTML("beforeend",
      '<div class="buybar" data-buybar aria-hidden="true"><div class="buybar__info"><div class="buybar__name">' + U.esc(p.name) + '</div><div class="buybar__price">' + S.fmt(p.price) + "</div></div>" +
      '<button class="btn" type="button" data-buybar-add' + (out ? " disabled" : "") + ">" + (out ? "Esgotado" : "Adicionar à sacola") + "</button></div>");
    document.body.classList.add("has-buybar");

    bindGallery(imgs);
    bindBuy();
    related();
  }

  function freeShipText() {
    var m = (settings.shipping.methods || []).filter(function (x) { return x.freeAbove; })[0];
    return m ? ". " + U.esc(m.name) + " grátis acima de " + S.fmt(m.freeAbove) : "";
  }

  // ---------------------------------------------------------------- galeria
  function bindGallery(imgs) {
    var track = U.$("[data-track]");
    var dots = U.$$(".gallery__dots span"), thumbs = U.$$("[data-thumb]");
    function setActive(i) {
      dots.forEach(function (d, k) { d.classList.toggle("is-on", k === i); });
      thumbs.forEach(function (t, k) { t.setAttribute("aria-current", k === i); });
    }
    track.addEventListener("scroll", function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      setActive(i);
    }, { passive: true });
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        var i = +t.getAttribute("data-thumb");
        track.scrollTo({ left: i * track.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        setActive(i);
      });
    });
    track.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = Math.round(track.scrollLeft / track.clientWidth) + (e.key === "ArrowRight" ? 1 : -1);
      i = Math.max(0, Math.min(imgs.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth }); setActive(i);
    });
    // zoom com lupa no desktop
    var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    U.$$(".gallery__slide").forEach(function (sl, i) {
      var lens = sl.querySelector(".zoom-lens");
      if (fine) {
        sl.addEventListener("mouseenter", function () {
          lens.style.backgroundImage = "url('" + imgs[i] + "')"; sl.classList.add("is-zooming");
        });
        sl.addEventListener("mousemove", function (e) {
          var r = sl.getBoundingClientRect();
          lens.style.backgroundPosition = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
        });
        sl.addEventListener("mouseleave", function () { sl.classList.remove("is-zooming"); });
      }
      sl.addEventListener("click", function () { lightbox(imgs, i); });
    });
  }

  function lightbox(imgs, start) {
    var lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Imagens ampliadas");
    lb.innerHTML = '<div class="lightbox__bar"><span data-lb-count>' + (start + 1) + " / " + imgs.length + '</span><button class="header__btn" type="button" data-lb-close aria-label="Fechar">' + U.icon("close") + "</button></div>" +
      '<div class="lightbox__stage" data-lb-stage>' + imgs.map(function (src) { return '<figure><img src="' + U.esc(src) + '" alt="' + U.esc(product.name) + '"></figure>'; }).join("") + "</div>";
    document.body.appendChild(lb); U.lock(true);
    var stage = lb.querySelector("[data-lb-stage]");
    requestAnimationFrame(function () { stage.scrollLeft = start * stage.clientWidth; });
    stage.addEventListener("scroll", function () { lb.querySelector("[data-lb-count]").textContent = (Math.round(stage.scrollLeft / stage.clientWidth) + 1) + " / " + imgs.length; }, { passive: true });
    function close() { lb.remove(); U.lock(false); document.removeEventListener("keydown", key); }
    function key(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", key);
    lb.querySelector("[data-lb-close]").addEventListener("click", close);
    lb.querySelector("[data-lb-close]").focus();
  }

  // ---------------------------------------------------------------- compra
  function bindBuy() {
    var p = product, max = p.stock == null ? 10 : Math.max(1, p.stock);
    U.$$("[data-opt]").forEach(function (box) {
      var o = p.options[+box.getAttribute("data-opt")];
      box.addEventListener("click", function (e) {
        var b = e.target.closest("[data-val]"); if (!b) return;
        U.$$("[data-val]", box).forEach(function (x) { x.setAttribute("aria-checked", x === b); x.setAttribute("aria-pressed", x === b); });
        chosen[o.name] = b.getAttribute("data-val");
        box.querySelector("[data-opt-val]").textContent = chosen[o.name];
        box.querySelector("[data-opt-err]").hidden = true;
      });
    });
    var qv = U.$("[data-qv]");
    U.$$("[data-q]").forEach(function (b) {
      b.addEventListener("click", function () {
        qty = Math.max(1, Math.min(max, qty + +b.getAttribute("data-q")));
        qv.textContent = qty;
        U.$('[data-q="-1"]').disabled = qty <= 1; U.$('[data-q="1"]').disabled = qty >= max;
      });
    });
    U.$('[data-q="-1"]').disabled = true;
    if (max <= 1) U.$('[data-q="1"]').disabled = true;

    // personalização
    var pz = p.personalization;
    if (pz && pz.fields) {
      var prev = U.$("[data-pf-preview]");
      var upd = function () {
        var vals = pz.fields.map(function (f) { return U.$('[data-pf="' + f.key + '"]').value.trim(); }).filter(Boolean);
        prev.textContent = vals.length ? vals.join("  ·  ") : "—";
        pz.fields.forEach(function (f) { U.$('[data-pf-count="' + f.key + '"]').textContent = U.$('[data-pf="' + f.key + '"]').value.length; });
      };
      U.$$("[data-pf]").forEach(function (i) { i.addEventListener("input", function () { i.removeAttribute("aria-invalid"); U.$('[data-pf-err="' + i.getAttribute("data-pf") + '"]').textContent = ""; upd(); }); });
    }

    U.$("[data-add]").addEventListener("click", function () { add(false); });
    U.$("[data-buy-now]").addEventListener("click", function () { add(true); });
    U.$("[data-buybar-add]").addEventListener("click", function () {
      if ((p.options && p.options.length) || pz) { U.$("[data-actions]").scrollIntoView({ behavior: "smooth", block: "center" }); add(false); }
      else add(false);
    });
    U.$("[data-wa-product]").addEventListener("click", function (e) {
      e.preventDefault();
      var opts = Object.keys(chosen).map(function (k) { return k + ": " + chosen[k]; }).join(", ");
      U.openWa(settings.wa.product + "\n\n" + p.name + (opts ? " (" + opts + ")" : "") + "\n" + U.siteUrl() + "produto.html?p=" + encodeURIComponent(p.slug));
    });
    var size = U.$("[data-wa-size]");
    if (size) size.addEventListener("click", function (e) { e.preventDefault(); U.openWa("Olá! Gostaria de ajuda para descobrir meu tamanho de aro para a peça " + p.name + "."); });

    // barra fixa no celular
    var bar = U.$("[data-buybar]"), actions = U.$("[data-actions]");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var show = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
        bar.classList.toggle("is-on", show); bar.setAttribute("aria-hidden", !show);
      }).observe(actions);
    }
  }

  function validate() {
    var p = product, ok = true, firstBad = null;
    (p.options || []).forEach(function (o, i) {
      if (!chosen[o.name]) {
        ok = false;
        var box = U.$('[data-opt="' + i + '"]'); box.querySelector("[data-opt-err]").hidden = false;
        firstBad = firstBad || box;
      }
    });
    var custom = {};
    var pz = p.personalization;
    if (pz && pz.fields) {
      var any = false;
      pz.fields.forEach(function (f) {
        var inp = U.$('[data-pf="' + f.key + '"]'), v = inp.value.trim().replace(/\s+/g, " ");
        var err = "";
        if (f.required && !v) err = "Preencha este campo.";
        else if (v && v.length > (f.maxLength || 20)) err = "Use no máximo " + f.maxLength + " caracteres.";
        else if (v && /[<>{}\[\]\\]/.test(v)) err = "Use apenas letras, números e pontuação simples.";
        U.$('[data-pf-err="' + f.key + '"]').textContent = err;
        if (err) { ok = false; inp.setAttribute("aria-invalid", "true"); firstBad = firstBad || inp; }
        if (v) { custom[f.label] = v; any = true; }
      });
      if (pz.confirm && any) {
        var c = U.$("[data-pf-confirm]");
        U.$("[data-pf-confirm-err]").textContent = c.checked ? "" : "Confirme que o texto da gravação está correto.";
        if (!c.checked) { ok = false; firstBad = firstBad || c; }
      }
    }
    if (!ok && firstBad) { firstBad.scrollIntoView({ behavior: "smooth", block: "center" }); if (firstBad.focus) setTimeout(function () { firstBad.focus({ preventScroll: true }); }, 350); }
    return ok ? custom : null;
  }

  function add(now) {
    var custom = validate();
    if (!custom) return;
    S.addToCart(product, qty, Object.assign({}, chosen), custom);
    if (now) { location.href = "checkout.html"; return; }
    U.openPanel("cart");
  }

  // ---------------------------------------------------------------- relacionados
  function related() {
    S.listProducts({ category: product.category }).then(function (list) {
      list = list.filter(function (x) { return x.id !== product.id; });
      if (list.length < 4) {
        return S.listProducts({ filter: "presentes" }).then(function (more) {
          more.forEach(function (m) { if (m.id !== product.id && !list.some(function (x) { return x.id === m.id; })) list.push(m); });
          return list;
        });
      }
      return list;
    }).then(function (list) {
      if (!list.length) return;
      U.$("[data-related-wrap]").hidden = false;
      U.$("[data-related-link]").href = "colecao.html?categoria=" + encodeURIComponent(product.category);
      U.$("[data-related]").innerHTML = list.slice(0, 4).map(function (p) { return U.productCard(p, settings, { reveal: true }); }).join("");
      U.observeReveal(U.$("[data-related]"));
    });
  }

  function structured(p) {
    var data = {
      "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
      image: p.images.map(function (i) { return /^https?:/.test(i) ? i : U.siteUrl() + i; }),
      material: p.material, brand: { "@type": "Brand", name: "Mais Bella Semijoias" },
      offers: { "@type": "Offer", priceCurrency: "BRL", price: p.price.toFixed(2), availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: location.href }
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
})();
