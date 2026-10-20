/* Finalização da compra em três etapas: contato, entrega e pagamento */
(function () {
  var S = MB.store, U = MB.ui;
  var settings, items = [], step = 1;
  var data = { customer: {}, address: {}, shippingId: null, ship: null, giftWrap: false, giftMessage: "", payment: null, coupon: null };
  var methods = [];
  var root = U.$("[data-checkout]");
  var SAVED = "mb_checkout_v1";

  U.mount({ minimal: true, noWa: true }).then(function (s) {
    settings = s;
    return S.refreshCart();
  }).then(function (r) {
    items = r.items;
    if (!items.length) return empty();
    try { var saved = JSON.parse(localStorage.getItem(SAVED) || "{}"); data.customer = saved.customer || {}; data.address = saved.address || {}; } catch (e) {}
    S.getUser().then(function (u) { if (u && !data.customer.email) { data.customer.email = u.email; data.customer.name = data.customer.name || (u.user_metadata && u.user_metadata.name) || ""; fill(); } });
    layout();
    if (r.changed) U.toast("Atualizamos sua sacola com os preços e o estoque atuais.");
  });

  function empty() {
    root.innerHTML = '<div class="empty" style="padding:6rem 1rem">' + U.icon("bag", "icon--lg") + '<h1 class="h3">Sua sacola está vazia</h1><p>Escolha suas peças para finalizar a compra.</p><a class="btn" href="colecao.html">Ver coleção</a></div>';
  }

  // ---------------------------------------------------------------- layout
  function layout() {
    root.innerHTML =
      '<h1 class="sr-only">Finalizar compra</h1>' +
      '<div class="co">' +
      '<button class="co__summary-toggle hide-lg" type="button" data-sum-toggle aria-expanded="false">' +
      "<span>" + U.icon("bag", "icon--sm") + ' <span data-sum-label>Ver resumo do pedido</span></span><strong data-total-top></strong></button>' +
      '<aside class="co__summary" data-summary hidden aria-label="Resumo do pedido"></aside>' +
      '<div class="steps">' +
      stepBox(1, "Seus dados", contactForm()) +
      stepBox(2, "Entrega", deliveryForm()) +
      stepBox(3, "Pagamento", '<div data-pay></div>') +
      '<p class="small muted" style="display:flex;gap:.6rem;align-items:center;margin-top:.5rem">' + U.icon("lock", "icon--sm") + " Seus dados são usados apenas para processar e entregar o pedido.</p>" +
      "</div></div>";
    U.$("[data-sum-toggle]").addEventListener("click", function () {
      var sm = U.$("[data-summary]"), open = sm.hidden;
      sm.hidden = !open; this.setAttribute("aria-expanded", open);
      U.$("[data-sum-label]").textContent = open ? "Ocultar resumo do pedido" : "Ver resumo do pedido";
    });
    fill();
    bindContact(); bindDelivery();
    summary();
    goto(1);
  }

  function stepBox(n, title, body) {
    return '<section class="step" data-step="' + n + '" aria-labelledby="st-' + n + '">' +
      '<div class="step__head"><span class="step__num">' + n + '</span><h2 class="step__title" id="st-' + n + '">' + title + '</h2><button class="step__edit" type="button" data-edit="' + n + '" hidden>Alterar</button></div>' +
      '<div class="step__summary" data-sum="' + n + '" hidden></div>' +
      '<div class="step__body">' + body + "</div></section>";
  }

  function field(id, label, attrs, cls) {
    return '<div class="field ' + (cls || "") + '"><label for="' + id + '">' + label + '</label><input class="input" id="' + id + '" name="' + id + '" ' + attrs + '><span class="error" data-err="' + id + '"></span></div>';
  }

  function contactForm() {
    return '<form class="form-grid" data-form="1" novalidate>' +
      field("name", "Nome completo", 'autocomplete="name" required') +
      '<div class="form-grid form-grid--2">' +
      field("email", "E-mail", 'type="email" autocomplete="email" inputmode="email" required') +
      field("phone", "Celular com DDD", 'type="tel" autocomplete="tel-national" inputmode="tel" placeholder="(11) 90000-0000" required') +
      "</div>" +
      field("cpf", "CPF", 'inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" required') +
      '<p class="small muted" style="margin-top:-.4rem">O CPF é necessário para a nota fiscal e para o pagamento.</p>' +
      '<button class="btn btn--block" type="submit">Continuar para entrega</button></form>';
  }

  function deliveryForm() {
    var gift = settings.giftWrap.enabled
      ? '<label class="check" style="padding:1rem;border:1px solid var(--line-2)"><input type="checkbox" data-gift> <span><strong>' + U.esc(settings.giftWrap.label) + "</strong>" +
        (settings.giftWrap.price ? " · " + S.fmt(settings.giftWrap.price) : " · sem custo") + '<br><span class="muted small">Peça enviada pronta para presentear.</span></span></label>' +
        '<div class="field" data-gift-msg hidden><label for="giftmsg">Mensagem para o cartão (opcional)</label><textarea class="textarea" id="giftmsg" maxlength="200" placeholder="Escreva uma mensagem curta"></textarea><span class="hint">Até 200 caracteres.</span></div>'
      : "";
    return '<form class="form-grid" data-form="2" novalidate>' +
      '<div class="form-grid form-grid--2">' +
      field("cep", "CEP", 'inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" required') +
      '<div class="field" style="align-content:end"><a class="small muted" href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener" style="text-decoration:underline;padding-bottom:.9rem">Não sei meu CEP</a></div>' +
      "</div>" +
      field("street", "Rua", 'autocomplete="address-line1" required') +
      '<div class="form-grid form-grid--2">' +
      field("number", "Número", 'inputmode="numeric" required') +
      field("complement", "Complemento (opcional)", 'autocomplete="address-line2"') +
      "</div>" +
      '<div class="form-grid form-grid--3">' +
      field("district", "Bairro", 'required') +
      field("city", "Cidade", 'autocomplete="address-level2" required') +
      field("state", "UF", 'maxlength="2" autocomplete="address-level1" required style="text-transform:uppercase"') +
      "</div>" +
      '<div data-ship-wrap style="display:grid;gap:.6rem"></div>' +
      gift +
      '<button class="btn btn--block" type="submit">Continuar para pagamento</button></form>';
  }

  function fill() {
    var c = data.customer, a = data.address;
    [["name", c.name], ["email", c.email], ["phone", c.phone], ["cpf", c.cpf], ["cep", a.cep], ["street", a.street], ["number", a.number], ["complement", a.complement], ["district", a.district], ["city", a.city], ["state", a.state]]
      .forEach(function (x) { var el = document.getElementById(x[0]); if (el && x[1] && !el.value) el.value = x[1]; });
  }

  // ---------------------------------------------------------------- navegação
  function goto(n) {
    step = n;
    U.$$("[data-step]").forEach(function (el) {
      var k = +el.getAttribute("data-step");
      el.classList.toggle("is-open", k === n);
      el.classList.toggle("is-done", k < n);
      el.classList.toggle("is-locked", k > n);
      el.querySelector("[data-edit]").hidden = !(k < n);
      el.querySelector("[data-sum]").hidden = !(k < n);
    });
    if (n === 3) renderPay();
    var el = U.$('[data-step="' + n + '"]');
    if (n > 1) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-edit]"); if (b) goto(+b.getAttribute("data-edit"));
  });

  function setErr(id, msg) {
    var el = document.getElementById(id), er = U.$('[data-err="' + id + '"]');
    if (er) er.textContent = msg || "";
    if (el) { if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); }
    return !msg;
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }

  // ---------------------------------------------------------------- etapa 1
  function maskPhone(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    if (v.length > 2) return v.replace(/(\d{2})(\d+)/, "($1) $2");
    return v;
  }
  function maskCpf(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    return v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function validCpf(c) {
    c = c.replace(/\D/g, "");
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (var t = 9; t < 11; t++) {
      var d = 0;
      for (var i = 0; i < t; i++) d += c[i] * (t + 1 - i);
      d = ((10 * d) % 11) % 10;
      if (+c[t] !== d) return false;
    }
    return true;
  }

  function bindContact() {
    var phone = document.getElementById("phone"), cpf = document.getElementById("cpf");
    phone.addEventListener("input", function () { phone.value = maskPhone(phone.value); });
    cpf.addEventListener("input", function () { cpf.value = maskCpf(cpf.value); });
    U.$('[data-form="1"]').addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ok = setErr("name", val("name").split(/\s+/).length < 2 ? "Informe nome e sobrenome." : "") && ok;
      ok = setErr("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email")) ? "" : "Informe um e-mail válido.") && ok;
      ok = setErr("phone", val("phone").replace(/\D/g, "").length >= 10 ? "" : "Informe o celular com DDD.") && ok;
      ok = setErr("cpf", validCpf(val("cpf")) ? "" : "CPF inválido.") && ok;
      if (!ok) { var bad = U.$('[data-form="1"] [aria-invalid="true"]'); if (bad) bad.focus(); return; }
      data.customer = { name: val("name"), email: val("email").toLowerCase(), phone: val("phone"), cpf: val("cpf") };
      persist();
      U.$('[data-sum="1"]').innerHTML = U.esc(data.customer.name) + "<br>" + U.esc(data.customer.email) + " · " + U.esc(data.customer.phone);
      goto(2);
      setTimeout(function () { document.getElementById("cep").focus({ preventScroll: true }); }, 400);
    });
  }
  function persist() { try { localStorage.setItem(SAVED, JSON.stringify({ customer: data.customer, address: data.address })); } catch (e) {} }

  // ---------------------------------------------------------------- etapa 2
  function bindDelivery() {
    var cep = document.getElementById("cep");
    var last = "";
    function onCep() {
      var v = cep.value.replace(/\D/g, "").slice(0, 8);
      cep.value = v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
      if (v.length === 8 && v !== last) {
        last = v; setErr("cep", "");
        S.lookupCep(v).then(function (a) {
          if (a.street) document.getElementById("street").value = a.street;
          if (a.district) document.getElementById("district").value = a.district;
          document.getElementById("city").value = a.city || "";
          document.getElementById("state").value = a.state || "";
          (a.street ? document.getElementById("number") : document.getElementById("street")).focus();
        }).catch(function (err) { setErr("cep", err.message === "CEP não encontrado" ? "CEP não encontrado. Confira os números." : ""); });
        quote(v);
      }
    }
    cep.addEventListener("input", onCep);
    if (cep.value) onCep();
    var gift = U.$("[data-gift]");
    if (gift) gift.addEventListener("change", function () { data.giftWrap = gift.checked; U.$("[data-gift-msg]").hidden = !gift.checked; summary(); });

    U.$('[data-form="2"]').addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ok = setErr("cep", val("cep").replace(/\D/g, "").length === 8 ? "" : "Informe um CEP válido.") && ok;
      ["street", "number", "district", "city"].forEach(function (k) { ok = setErr(k, val(k) ? "" : "Campo obrigatório.") && ok; });
      ok = setErr("state", /^[A-Za-z]{2}$/.test(val("state")) ? "" : "UF inválida.") && ok;
      if (methods.length && !data.shippingId) { ok = false; U.$("[data-ship-wrap]").insertAdjacentHTML("beforeend", '<p class="error" data-ship-err style="color:var(--danger);font-size:.78rem">Escolha a forma de entrega.</p>'); }
      if (!ok) { var bad = U.$('[data-form="2"] [aria-invalid="true"]'); if (bad) bad.focus(); return; }
      data.address = { cep: val("cep"), street: val("street"), number: val("number"), complement: val("complement"), district: val("district"), city: val("city"), state: val("state").toUpperCase() };
      data.giftMessage = data.giftWrap && document.getElementById("giftmsg") ? document.getElementById("giftmsg").value.trim() : "";
      persist();
      var a = data.address;
      U.$('[data-sum="2"]').innerHTML = U.esc(a.street + ", " + a.number + (a.complement ? " · " + a.complement : "")) + "<br>" + U.esc(a.district + " · " + a.city + "/" + a.state + " · " + a.cep) +
        (data.ship ? "<br>" + U.esc(data.ship.name) + " · " + (data.ship.price ? S.fmt(data.ship.price) : "Grátis") : "<br>Frete a combinar com a loja");
      goto(3);
    });
  }

  function quote(cep) {
    var wrap = U.$("[data-ship-wrap]");
    wrap.innerHTML = '<span class="label" style="font-size:.66rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase">Forma de entrega</span><div class="skeleton" style="height:64px"></div>';
    S.quoteShipping(cep, items).then(function (list) {
      methods = list;
      if (!list.length) {
        wrap.innerHTML = '<div class="notice">' + U.icon("info", "icon--sm") + "<span>O frete para o seu endereço será calculado pela loja e informado antes do pagamento.</span></div>";
        data.shippingId = null; data.ship = null; summary(); return;
      }
      wrap.innerHTML = '<span class="label" style="font-size:.66rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase">Forma de entrega</span>' +
        list.map(function (m, i) {
          return '<label class="radio-card"><input type="radio" name="ship" value="' + U.esc(m.id) + '"' + (m.id === data.shippingId || (!data.shippingId && i === 0) ? " checked" : "") + ">" +
            '<span class="radio-card__main"><strong>' + U.esc(m.name) + "</strong><span>" + U.esc(m.days || "") + (m.freeAbove && !m.free ? " · grátis acima de " + S.fmt(m.freeAbove) : "") + "</span></span>" +
            '<span class="radio-card__price">' + (m.price ? S.fmt(m.price) : "Grátis") + "</span></label>";
        }).join("");
      var pick = function () {
        var r = U.$('input[name="ship"]:checked');
        data.shippingId = r ? r.value : null;
        data.ship = list.filter(function (m) { return m.id === data.shippingId; })[0] || null;
        var er = U.$("[data-ship-err]"); if (er) er.remove();
        summary();
      };
      U.$$('input[name="ship"]').forEach(function (r) { r.addEventListener("change", pick); });
      pick();
    });
  }

  // ---------------------------------------------------------------- etapa 3
  function payOptions() {
    var p = settings.payments, opts = [];
    if (S.live) {
      if (p.pix) opts.push({ id: "pix", title: "Pix", text: "Código gerado na hora. Aprovação em instantes." + (p.pixDiscount ? " " + p.pixDiscount + "% de desconto." : "") });
      if (p.card) opts.push({ id: "card", title: "Cartão de crédito", text: "Pagamento em ambiente seguro do provedor" + (settings.installments.enabled ? ", em até " + settings.installments.max + "x" : "") + "." });
    } else {
      opts.push({ id: "pix", title: "Pix", text: "Disponível após a ativação do provedor de pagamento.", disabled: true });
      opts.push({ id: "card", title: "Cartão de crédito", text: "Disponível após a ativação do provedor de pagamento.", disabled: true });
    }
    if (p.whatsapp || !opts.filter(function (o) { return !o.disabled; }).length) {
      opts.push({ id: "whatsapp", title: "Combinar pelo WhatsApp", text: "Registramos seu pedido e você conclui o pagamento com a loja pelo WhatsApp." });
    }
    return opts;
  }

  function renderPay() {
    var opts = payOptions();
    var enabled = opts.filter(function (o) { return !o.disabled; });
    if (!data.payment || !enabled.some(function (o) { return o.id === data.payment; })) data.payment = enabled[0] ? enabled[0].id : null;
    U.$("[data-pay]").innerHTML =
      '<div style="display:grid;gap:.6rem">' + opts.map(function (o) {
        return '<label class="radio-card' + (o.disabled ? " is-disabled" : "") + '"><input type="radio" name="pay" value="' + o.id + '"' + (o.disabled ? " disabled" : "") + (o.id === data.payment ? " checked" : "") + ">" +
          '<span class="radio-card__main"><strong>' + o.title + "</strong><span>" + o.text + "</span></span></label>";
      }).join("") + "</div>" +
      '<div class="field"><label for="notes">Observações (opcional)</label><textarea class="textarea" id="notes" maxlength="400" style="min-height:80px" placeholder="Alguma informação importante sobre o pedido?"></textarea></div>' +
      '<label class="check"><input type="checkbox" data-terms> <span>Li e concordo com os <a href="termos.html" target="_blank" style="text-decoration:underline">Termos de compra</a> e a <a href="privacidade.html" target="_blank" style="text-decoration:underline">Política de privacidade</a>.</span></label>' +
      '<p class="error" data-terms-err style="color:var(--danger);font-size:.78rem"></p>' +
      '<div data-pay-error></div>' +
      '<button class="btn btn--block" type="button" data-place></button>';
    U.$$('input[name="pay"]').forEach(function (r) { r.addEventListener("change", function () { data.payment = r.value; label(); summary(); }); });
    U.$("[data-place]").addEventListener("click", place);
    label(); summary();
  }
  function label() {
    var b = U.$("[data-place]"); if (!b) return;
    b.textContent = data.payment === "pix" ? "Gerar Pix" : data.payment === "card" ? "Pagar com cartão" : "Finalizar pedido";
  }

  function place() {
    var t = U.$("[data-terms]");
    U.$("[data-terms-err]").textContent = t.checked ? "" : "É preciso aceitar os termos para continuar.";
    if (!t.checked) return;
    if (!data.payment) return;
    var btn = U.$("[data-place]");
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processando';
    U.$("[data-pay-error]").innerHTML = "";
    var payload = {
      customer: data.customer, address: data.address, shippingId: data.shippingId,
      items: S.getCart().map(function (i) { return { id: i.id, qty: i.qty, options: i.options, custom: i.custom }; }),
      coupon: data.coupon && data.coupon.valid ? data.coupon.code : null,
      giftWrap: data.giftWrap, giftMessage: data.giftMessage, payment: data.payment,
      notes: (document.getElementById("notes") || {}).value || "",
      returnUrl: U.siteUrl() + "pedido.html"
    };
    S.placeOrder(payload).then(function (res) {
      S.clearCart();
      var o = res.order;
      var next = "pedido.html?id=" + encodeURIComponent(o.id) + "&t=" + encodeURIComponent(o.token);
      if (data.payment === "card" && res.payment && res.payment.redirect) { location.href = res.payment.redirect; return; }
      location.href = next + (data.payment === "whatsapp" ? "&novo=1" : "");
    }).catch(function (err) {
      btn.disabled = false; label();
      U.$("[data-pay-error]").innerHTML = '<div class="notice notice--error">' + U.icon("info", "icon--sm") + "<span>" + U.esc(err.message || "Não foi possível finalizar agora. Tente novamente.") + "</span></div>";
    });
  }

  // ---------------------------------------------------------------- resumo
  function summary() {
    var box = U.$("[data-summary]"); if (!box) return;
    var t = S.computeTotals(items, data.ship, data.coupon, data.giftWrap, settings, data.payment);
    var inst = data.payment !== "pix" ? S.installments(t.total, settings) : null;
    box.innerHTML =
      '<h2 class="h3" style="font-size:1.4rem">Resumo do pedido</h2>' +
      '<div class="co__items">' + items.map(function (i) {
        return '<div class="co__item"><div class="img"><img ' + U.imgAttrs(i.image, "64px") + ' alt=""><b>' + i.qty + "</b></div>" +
          '<div><div class="name">' + U.esc(i.name) + '</div><div class="meta">' + U.esc(U.optText(i) || i.material || "") + "</div></div>" +
          '<div class="price">' + S.fmt(i.price * i.qty) + "</div></div>";
      }).join("") + "</div>" +
      '<form class="co__coupon" data-coupon novalidate><label class="sr-only" for="coupon">Cupom de desconto</label>' +
      '<input class="input" id="coupon" placeholder="Cupom de desconto" autocomplete="off" style="text-transform:uppercase" value="' + U.esc(data.coupon && data.coupon.valid ? data.coupon.code : "") + '">' +
      '<button class="btn btn--ghost btn--sm" type="submit">' + (data.coupon && data.coupon.valid ? "Remover" : "Aplicar") + "</button></form>" +
      '<p class="small" data-coupon-msg style="margin-top:-.5rem;' + (data.coupon && !data.coupon.valid ? "color:var(--danger)" : "color:var(--ok)") + '">' + (data.coupon ? U.esc(data.coupon.valid ? "Cupom aplicado: " + data.coupon.label : data.coupon.message) : "") + "</p>" +
      '<div class="co__totals">' +
      '<div class="row"><span>Subtotal</span><span class="price">' + S.fmt(t.subtotal) + "</span></div>" +
      (t.discount ? '<div class="row"><span>Desconto</span><span class="price">− ' + S.fmt(t.discount) + "</span></div>" : "") +
      (t.pixDiscount ? '<div class="row"><span>Desconto Pix</span><span class="price">− ' + S.fmt(t.pixDiscount) + "</span></div>" : "") +
      '<div class="row"><span>Frete</span><span>' + (data.ship ? (data.ship.price ? S.fmt(data.ship.price) : "Grátis") : (methods.length ? "Informe o CEP" : (data.address.cep ? "A combinar" : "Informe o CEP"))) + "</span></div>" +
      (t.gift ? '<div class="row"><span>' + U.esc(settings.giftWrap.label) + '</span><span class="price">' + S.fmt(t.gift) + "</span></div>" : (data.giftWrap ? '<div class="row"><span>' + U.esc(settings.giftWrap.label) + "</span><span>Sem custo</span></div>" : "")) +
      '<div class="row row--total"><span>Total</span><span class="price">' + S.fmt(t.total) + (inst ? "<small>" + U.esc(inst.text) + "</small>" : "") + "</span></div>" +
      "</div>";
    U.$("[data-total-top]").textContent = S.fmt(t.total);
    U.$("[data-coupon]").addEventListener("submit", function (e) {
      e.preventDefault();
      if (data.coupon && data.coupon.valid) { data.coupon = null; summary(); return; }
      var code = document.getElementById("coupon").value;
      S.checkCoupon(code, S.cartSubtotal(items)).then(function (r) { data.coupon = r; summary(); })
        .catch(function () { data.coupon = { valid: false, message: "Não foi possível validar o cupom agora." }; summary(); });
    });
  }
})();
