/* ==========================================================================
   OBARAKI · CHECKOUT
   Etapa 1: dados · Etapa 2: entrega · Etapa 3: pagamento e envio.
   O pedido é salvo e enviado ao WhatsApp da loja como mensagem organizada.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.OBK.store;
  var U = window.OBK.ui;
  var $ = U.$;
  var $$ = U.$$;
  var esc = U.esc;
  var icon = U.icon;

  var root = $("[data-checkout]");
  $("[data-brand]").innerHTML = U.brandHTML();

  var saved = S.customer() || {};
  var settings = S.settings();
  var delivery = settings.delivery || {};
  var zonesMode = delivery.mode === "zones" && S.neighborhoods().length > 0;

  var state = {
    step: 1,
    name: saved.name || "",
    phone: saved.phone || "",
    address: Object.assign(
      { cep: "", street: "", number: "", complement: "", neighborhood: "", city: settings.city || "", reference: "" },
      saved.address || {}
    ),
    payment: { method: "", change: null, needsChange: null },
    notes: "",
    remember: true
  };

  if (!state.address.city) state.address.city = settings.city || "";

  /* ---------- Máscaras ---------- */

  function maskPhone(v) {
    var d = S.digits(v).slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  function maskCep(v) {
    var d = S.digits(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  }

  function parseMoney(v) {
    var s = String(v || "").replace(/[^\d,\.]/g, "");
    if (s.indexOf(",") !== -1) s = s.replace(/\./g, "").replace(",", ".");
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  /* ---------- Totais ---------- */

  function totals() {
    var sub = S.subtotal();
    var quote = S.deliveryQuote(sub, state.address.neighborhood);
    return { sub: sub, quote: quote, total: sub + (quote.known ? quote.fee : 0) };
  }

  /* ---------- Render ---------- */

  function render() {
    var lines = S.cartLines();
    if (!lines.length) {
      root.innerHTML =
        '<div class="done"><div class="empty" style="padding:24px 0"><div class="ph-mark"><span>空</span></div><h3>Seu carrinho está vazio</h3><p>Adicione itens do cardápio para finalizar um pedido.</p><a class="btn btn-primary" href="cardapio.html">Ver cardápio</a></div></div>';
      return;
    }

    root.innerHTML =
      '<div class="checkout">' +
      "<div>" +
      '<span class="eyebrow">Checkout</span>' +
      '<h1 style="margin-top:12px">Finalizar pedido</h1>' +
      '<ol class="steps" aria-label="Etapas">' +
      stepLi(1, "Seus dados") +
      stepLi(2, "Entrega") +
      stepLi(3, "Pagamento") +
      "</ol>" +
      '<form novalidate data-form autocomplete="on">' +
      panel1() +
      panel2() +
      panel3() +
      "</form>" +
      "</div>" +
      asideHTML() +
      "</div>";

    bind();
  }

  function stepLi(n, label) {
    var cls = state.step === n ? "is-current" : state.step > n ? "is-done" : "";
    return '<li class="' + cls + '"' + (state.step === n ? ' aria-current="step"' : "") + ">" + n + ". " + label + "</li>";
  }

  function field(id, label, value, attrs, extra) {
    return (
      '<div class="field" data-field="' +
      id +
      '"><label for="f-' +
      id +
      '">' +
      label +
      "</label>" +
      '<input class="input" id="f-' +
      id +
      '" name="' +
      id +
      '" value="' +
      esc(value) +
      '" ' +
      (attrs || "") +
      ">" +
      (extra || "") +
      "</div>"
    );
  }

  function panel1() {
    return (
      '<section class="step-panel' +
      (state.step === 1 ? " is-current" : "") +
      '" data-step="1">' +
      '<h2>Dados do cliente</h2>' +
      '<div class="form-grid">' +
      field("name", "Nome", state.name, 'autocomplete="name" placeholder="Como podemos te chamar?" required maxlength="60"', '<span class="error">Informe seu nome.</span>') +
      field(
        "phone",
        "Telefone / WhatsApp",
        state.phone ? maskPhone(state.phone) : "",
        'type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(16) 99999-9999" required',
        '<span class="error">Informe um telefone com DDD.</span>'
      ) +
      "</div>" +
      '<div class="step-actions"><button type="button" class="btn btn-primary" data-next="2">Continuar' +
      icon("arrow") +
      "</button></div>" +
      "</section>"
    );
  }

  function neighborhoodField() {
    if (!zonesMode) {
      return field(
        "neighborhood",
        "Bairro",
        state.address.neighborhood,
        'autocomplete="address-level3" required maxlength="60"',
        '<span class="error">Informe o bairro.</span>'
      );
    }
    var list = S.neighborhoods();
    var cur = state.address.neighborhood;
    var known = list.some(function (n) {
      return n.name === cur;
    });
    return (
      '<div class="field" data-field="neighborhood"><label for="f-neighborhood">Bairro</label>' +
      '<select class="input" id="f-neighborhood" name="neighborhood" required>' +
      '<option value="">Selecione o bairro</option>' +
      list
        .map(function (n) {
          return '<option value="' + esc(n.name) + '"' + (n.name === cur ? " selected" : "") + ">" + esc(n.name) + " — " + S.money(n.fee) + "</option>";
        })
        .join("") +
      '<option value="__other"' +
      (cur && !known ? " selected" : "") +
      ">Outro bairro</option>" +
      "</select>" +
      '<input class="input" id="f-neighborhood-other" name="neighborhoodOther" placeholder="Digite o bairro" style="margin-top:8px' +
      (cur && !known ? "" : ";display:none") +
      '" value="' +
      esc(cur && !known ? cur : "") +
      '">' +
      '<span class="error">Selecione o bairro.</span>' +
      '<span class="help" data-fee-help></span>' +
      "</div>"
    );
  }

  function panel2() {
    var a = state.address;
    return (
      '<section class="step-panel' +
      (state.step === 2 ? " is-current" : "") +
      '" data-step="2">' +
      '<h2>Entrega</h2>' +
      '<div class="form-grid">' +
      '<div class="row-num">' +
      field(
        "cep",
        'CEP <span class="opt">(opcional)</span>',
        a.cep,
        'inputmode="numeric" autocomplete="postal-code" placeholder="00000-000"',
        '<span class="help" data-cep-help></span>'
      ) +
      '<div class="field"><span class="label" aria-hidden="true">&nbsp;</span><a class="btn btn-ghost btn-sm" style="min-height:52px" target="_blank" rel="noopener" href="https://buscacepinter.correios.com.br/app/endereco/index.php">Não sei</a></div>' +
      "</div>" +
      field("street", "Rua", a.street, 'autocomplete="address-line1" required maxlength="90"', '<span class="error">Informe a rua.</span>') +
      '<div class="row-2">' +
      field("number", "Número", a.number, 'inputmode="numeric" required maxlength="10"', '<span class="error">Informe o número.</span>') +
      field("complement", 'Complemento <span class="opt">(opcional)</span>', a.complement, 'autocomplete="address-line2" placeholder="Apto, bloco…" maxlength="60"') +
      "</div>" +
      neighborhoodField() +
      field("city", "Cidade", a.city, 'autocomplete="address-level2" required maxlength="60"', '<span class="error">Informe a cidade.</span>') +
      field("reference", 'Ponto de referência <span class="opt">(opcional)</span>', a.reference, 'maxlength="90"') +
      "</div>" +
      '<div class="step-actions"><button type="button" class="btn btn-ghost" data-prev="1" aria-label="Voltar">' +
      icon("back") +
      '</button><button type="button" class="btn btn-primary" data-next="3">Continuar' +
      icon("arrow") +
      "</button></div>" +
      "</section>"
    );
  }

  function panel3() {
    var p = settings.payments || {};
    var methods = [
      { id: "pix", label: "PIX", ic: "pix" },
      { id: "cash", label: "Dinheiro", ic: "cash" },
      { id: "credit", label: "Cartão de crédito", ic: "card" },
      { id: "debit", label: "Cartão de débito", ic: "card" }
    ].filter(function (m) {
      return p[m.id] !== false;
    });
    var a = state.address;
    var pm = state.payment;
    return (
      '<section class="step-panel' +
      (state.step === 3 ? " is-current" : "") +
      '" data-step="3">' +
      '<h2>Forma de pagamento</h2>' +
      '<div class="pay-grid" role="radiogroup" aria-label="Forma de pagamento">' +
      methods
        .map(function (m) {
          return (
            '<label class="option"><input type="radio" name="pay" value="' +
            m.id +
            '"' +
            (pm.method === m.id ? " checked" : "") +
            '><span class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="name">' +
            m.label +
            "</span>" +
            icon(m.ic) +
            "</label>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="field" data-field="pay" style="margin-top:6px"><span class="error">Escolha a forma de pagamento.</span></div>' +
      '<div data-pay-extra style="margin-top:14px">' +
      payExtra() +
      "</div>" +
      '<div class="field-group" style="margin-top:22px">' +
      '<div class="field"><label for="f-notes">Observações do pedido <span class="opt">(opcional)</span></label><textarea class="input" id="f-notes" name="notes" maxlength="200" placeholder="Ex.: interfone com defeito, ligar ao chegar.">' +
      esc(state.notes) +
      "</textarea></div>" +
      "</div>" +
      '<div class="field-group"><h4>Confira seus dados</h4>' +
      '<div class="step-review">' +
      '<div class="r"><div><b>Cliente</b>' +
      esc(state.name) +
      " · " +
      esc(maskPhone(state.phone)) +
      '</div><button type="button" data-goto="1">Editar</button></div>' +
      '<div class="r"><div><b>Entrega</b>' +
      esc(a.street) +
      ", " +
      esc(a.number) +
      (a.complement ? " — " + esc(a.complement) : "") +
      "<br>" +
      esc(a.neighborhood) +
      " · " +
      esc(a.city) +
      '</div><button type="button" data-goto="2">Editar</button></div>' +
      "</div>" +
      '<label class="option option--quiet"><input type="checkbox" name="remember"' +
      (state.remember ? " checked" : "") +
      '><span class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="name" style="font-weight:500;font-size:13.5px">Lembrar meus dados neste aparelho</span></label>' +
      "</div>" +
      '<div class="step-actions"><button type="button" class="btn btn-ghost" data-prev="2" aria-label="Voltar">' +
      icon("back") +
      '</button><button type="submit" class="btn btn-wa">' +
      '<svg class="icon icon-sm" viewBox="0 0 24 24" style="fill:currentColor;stroke:none">' +
      U.WA_SVG.replace(/^<svg[^>]*>|<\/svg>$/g, "") +
      "</svg>Enviar pedido pelo WhatsApp</button></div>" +
      '<p style="margin:14px 0 0;font-size:12.5px;color:var(--muted);text-align:center">O WhatsApp abre com o pedido pronto. É só tocar em enviar.</p>' +
      "</section>"
    );
  }

  function payExtra() {
    var pm = state.payment;
    if (pm.method === "cash") {
      return (
        '<div class="field"><span class="label">Precisa de troco?</span>' +
        '<div class="seg" role="radiogroup" aria-label="Precisa de troco?">' +
        '<label><input type="radio" name="needsChange" value="yes"' +
        (pm.needsChange === true ? " checked" : "") +
        "><span>Sim</span></label>" +
        '<label><input type="radio" name="needsChange" value="no"' +
        (pm.needsChange === false ? " checked" : "") +
        "><span>Não</span></label>" +
        "</div></div>" +
        (pm.needsChange
          ? '<div class="field" data-field="change" style="margin-top:14px"><label for="f-change">Troco para R$</label><input class="input" id="f-change" name="change" inputmode="decimal" placeholder="Ex.: 200,00" value="' +
            (pm.change ? String(pm.change.toFixed(2)).replace(".", ",") : "") +
            '"><span class="error" data-change-error>Informe um valor maior que o total do pedido.</span></div>'
          : "")
      );
    }
    if (pm.method === "pix" && (settings.payments || {}).pixKey) {
      return '<div class="notice notice--gold">Chave Pix: <b style="color:#fff">' + esc(settings.payments.pixKey) + "</b><br>Envie o comprovante na conversa do WhatsApp.</div>";
    }
    return "";
  }

  function asideHTML() {
    var t = totals();
    var lines = S.cartLines();
    var items = lines
      .map(function (l) {
        var extra = l.options
          .map(function (o) {
            return "+ " + esc(o.name);
          })
          .concat(l.note ? ["Obs.: " + esc(l.note)] : [])
          .join(" · ");
        return (
          '<div class="mini-item"><div>' +
          l.qty +
          "x " +
          esc(S.displayName(l.product)) +
          (extra ? "<small>" + extra + "</small>" : "") +
          '</div><span class="price">' +
          S.money(l.total) +
          "</span></div>"
        );
      })
      .join("");
    var count = S.cartCount();
    return (
      '<aside class="order-aside" aria-label="Resumo do pedido"><details data-aside' +
      (window.matchMedia("(min-width: 900px)").matches ? " open" : "") +
      ">" +
      "<summary><span>Resumo · " +
      count +
      (count > 1 ? " itens" : " item") +
      '</span><span style="display:flex;align-items:center;gap:8px"><span class="price" data-aside-total>' +
      S.money(t.total) +
      "</span>" +
      icon("chev", "icon-sm chev") +
      "</span></summary>" +
      '<div class="aside-body">' +
      items +
      '<div data-aside-summary>' +
      U.summaryHTML(t.sub, t.quote) +
      "</div>" +
      '<a class="link-more" href="cardapio.html" style="margin-top:14px">' +
      icon("plus") +
      "Adicionar itens</a>" +
      "</div></details></aside>"
    );
  }

  function refreshAside() {
    var t = totals();
    var s = $("[data-aside-summary]");
    if (s) s.innerHTML = U.summaryHTML(t.sub, t.quote);
    var tt = $("[data-aside-total]");
    if (tt) tt.textContent = S.money(t.total);
    var help = $("[data-fee-help]");
    if (help) {
      help.textContent = state.address.neighborhood
        ? t.quote.free
          ? "Entrega grátis."
          : t.quote.known
          ? "Taxa de entrega: " + S.money(t.quote.fee)
          : "Taxa de entrega a combinar pelo WhatsApp."
        : "";
    }
  }

  /* ---------- Validação ---------- */

  function setInvalid(id, bad) {
    var f = $('[data-field="' + id + '"]');
    if (f) f.classList.toggle("is-invalid", !!bad);
    return !bad;
  }

  function readStep1() {
    state.name = $("#f-name").value.trim();
    state.phone = S.digits($("#f-phone").value);
  }

  function validate1() {
    readStep1();
    var ok = setInvalid("name", state.name.length < 2);
    ok = setInvalid("phone", state.phone.length < 10 || state.phone.length > 11) && ok;
    return ok;
  }

  function readStep2() {
    var a = state.address;
    a.cep = $("#f-cep").value.trim();
    a.street = $("#f-street").value.trim();
    a.number = $("#f-number").value.trim();
    a.complement = $("#f-complement").value.trim();
    a.city = $("#f-city").value.trim();
    a.reference = $("#f-reference").value.trim();
    var nb = $("#f-neighborhood");
    if (nb.tagName === "SELECT") {
      a.neighborhood = nb.value === "__other" ? $("#f-neighborhood-other").value.trim() : nb.value;
    } else a.neighborhood = nb.value.trim();
  }

  function validate2() {
    readStep2();
    var a = state.address;
    var ok = setInvalid("street", a.street.length < 3);
    ok = setInvalid("number", !a.number) && ok;
    ok = setInvalid("neighborhood", a.neighborhood.length < 2) && ok;
    ok = setInvalid("city", a.city.length < 2) && ok;
    return ok;
  }

  function validate3() {
    var pm = state.payment;
    var ok = setInvalid("pay", !pm.method);
    if (pm.method === "cash") {
      if (pm.needsChange === null) {
        ok = false;
        UToast("Informe se precisa de troco.");
      } else if (pm.needsChange) {
        var v = parseMoney(($("#f-change") || {}).value);
        var t = totals().total;
        pm.change = v;
        ok = setInvalid("change", !v || v < t) && ok;
      } else pm.change = null;
    }
    return ok;
  }

  function UToast(m) {
    U.toast(m);
  }

  function focusFirstInvalid() {
    var f = $(".field.is-invalid .input");
    if (f) f.focus();
  }

  /* ---------- Navegação entre etapas ---------- */

  function goStep(n) {
    if (state.step === 1) readStep1();
    if (state.step === 2) readStep2();
    if (state.step === 3) {
      var notes = $("#f-notes");
      if (notes) state.notes = notes.value.trim();
    }
    state.step = n;
    render();
    var top = root.getBoundingClientRect().top + window.scrollY - 8;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    var first = $(".step-panel.is-current .input");
    if (first && n !== 3 && !first.value) first.focus({ preventScroll: true });
  }

  /* ---------- CEP ---------- */

  var cepTimer;

  function lookupCep(cep) {
    var d = S.digits(cep);
    var help = $("[data-cep-help]");
    if (d.length !== 8) {
      if (help) help.textContent = "";
      return;
    }
    if (help) help.textContent = "Buscando endereço…";
    fetch("https://viacep.com.br/ws/" + d + "/json/")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (!j || j.erro) {
          if (help) help.textContent = "CEP não encontrado. Preencha o endereço abaixo.";
          return;
        }
        if (help) help.textContent = "Endereço encontrado.";
        if (j.logradouro && !$("#f-street").value) $("#f-street").value = j.logradouro;
        if (j.localidade) $("#f-city").value = j.localidade;
        var nb = $("#f-neighborhood");
        if (j.bairro) {
          if (nb.tagName === "SELECT") {
            var match = Array.prototype.slice.call(nb.options).filter(function (o) {
              return S.fold(o.value) === S.fold(j.bairro);
            })[0];
            if (match) nb.value = match.value;
            else {
              nb.value = "__other";
              var other = $("#f-neighborhood-other");
              other.style.display = "";
              other.value = j.bairro;
            }
          } else if (!nb.value) nb.value = j.bairro;
        }
        readStep2();
        refreshAside();
        if (!$("#f-number").value) $("#f-number").focus();
      })
      .catch(function () {
        if (help) help.textContent = "Não foi possível buscar o CEP agora. Preencha o endereço abaixo.";
      });
  }

  /* ---------- Envio ---------- */

  function submit() {
    var notes = $("#f-notes");
    state.notes = notes ? notes.value.trim() : "";
    state.remember = !!($("input[name=remember]") || {}).checked;
    if (!validate3()) {
      focusFirstInvalid();
      return;
    }
    var order = S.placeOrder({
      name: state.name,
      phone: state.phone,
      address: Object.assign({}, state.address),
      payment: { method: state.payment.method, change: state.payment.needsChange ? state.payment.change : null },
      notes: state.notes
    });
    if (state.remember) {
      S.saveCustomer({ name: state.name, phone: state.phone, address: state.address });
    } else S.forgetCustomer();

    var url = S.waLink(S.orderMessage(order));
    var win = null;
    try {
      win = window.open(url, "_blank");
      if (win) win.opener = null;
    } catch (e) {}
    S.clearCart();
    showDone(order, url, !win);
  }

  function showDone(order, url, blocked) {
    var items = order.items
      .map(function (it) {
        return '<div class="mini-item" style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:14px"><span>' + it.qty + "x " + esc(it.name) + '</span><span class="price">' + S.money(it.total) + "</span></div>";
      })
      .join("");
    root.innerHTML =
      '<div class="done">' +
      '<div class="done-mark"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
      '<span class="eyebrow">Pedido montado</span>' +
      "<h1>Obrigado, " +
      esc(order.customer.name.split(" ")[0]) +
      "!</h1>" +
      "<p>" +
      (blocked
        ? "Toque no botão abaixo para abrir o WhatsApp com o seu pedido e enviar para a ObaraKi."
        : "Abrimos o WhatsApp com o seu pedido completo. Toque em <b style=\"color:#fff\">enviar</b> na conversa para confirmar com a ObaraKi.") +
      "</p>" +
      '<span class="order-id">' +
      esc(order.id) +
      "</span>" +
      '<div class="actions">' +
      '<a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="' +
      esc(url) +
      '">' +
      (blocked ? "Abrir WhatsApp e enviar" : "Abrir WhatsApp novamente") +
      "</a>" +
      '<a class="btn btn-ghost btn-block" href="index.html">Voltar ao início</a>' +
      "</div>" +
      '<div class="done-card">' +
      items +
      '<div class="summary" style="margin-top:14px">' +
      '<div class="line"><span>Subtotal</span><span>' +
      S.money(order.subtotal) +
      "</span></div>" +
      '<div class="line"><span>Entrega</span><span>' +
      (order.deliveryFree ? "Grátis" : order.deliveryFee === null ? "a combinar" : S.money(order.deliveryFee)) +
      "</span></div>" +
      '<div class="line"><span>Pagamento</span><span>' +
      esc(S.PAYMENT_LABELS[order.payment.method]) +
      (order.payment.method === "cash" ? (order.payment.change ? " · troco p/ " + S.money(order.payment.change) : " · sem troco") : "") +
      "</span></div>" +
      '<div class="total"><span>Total</span><span class="price">' +
      S.money(order.total) +
      "</span></div>" +
      "</div></div>" +
      "</div>";
    window.scrollTo(0, 0);
  }

  /* ---------- Eventos ---------- */

  function bind() {
    var form = $("[data-form]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (state.step === 1) {
        if (validate1()) goStep(2);
        else focusFirstInvalid();
      } else if (state.step === 2) {
        if (validate2()) goStep(3);
        else focusFirstInvalid();
      } else submit();
    });

    root.onclick = function (e) {
      var n = e.target.closest("[data-next]");
      if (n) {
        var to = +n.getAttribute("data-next");
        if (to === 2 && !validate1()) return focusFirstInvalid();
        if (to === 3 && !validate2()) return focusFirstInvalid();
        return goStep(to);
      }
      var p = e.target.closest("[data-prev]");
      if (p) return goStep(+p.getAttribute("data-prev"));
      var g = e.target.closest("[data-goto]");
      if (g) return goStep(+g.getAttribute("data-goto"));
    };

    var phone = $("#f-phone");
    if (phone)
      phone.addEventListener("input", function () {
        phone.value = maskPhone(phone.value);
        setInvalid("phone", false);
      });

    var cep = $("#f-cep");
    if (cep)
      cep.addEventListener("input", function () {
        cep.value = maskCep(cep.value);
        clearTimeout(cepTimer);
        cepTimer = setTimeout(function () {
          lookupCep(cep.value);
        }, 350);
      });

    $$(".step-panel .input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var f = inp.closest(".field");
        if (f) f.classList.remove("is-invalid");
      });
    });

    var nb = $("#f-neighborhood");
    if (nb) {
      nb.addEventListener(nb.tagName === "SELECT" ? "change" : "input", function () {
        if (nb.tagName === "SELECT") {
          var other = $("#f-neighborhood-other");
          other.style.display = nb.value === "__other" ? "" : "none";
          if (nb.value === "__other") other.focus();
        }
        readStep2();
        refreshAside();
      });
      var other2 = $("#f-neighborhood-other");
      if (other2)
        other2.addEventListener("input", function () {
          readStep2();
          refreshAside();
        });
    }

    form.addEventListener("change", function (e) {
      if (e.target.name === "pay") {
        state.payment.method = e.target.value;
        if (e.target.value !== "cash") {
          state.payment.needsChange = null;
          state.payment.change = null;
        }
        setInvalid("pay", false);
        $("[data-pay-extra]").innerHTML = payExtra();
      }
      if (e.target.name === "needsChange") {
        state.payment.needsChange = e.target.value === "yes";
        $("[data-pay-extra]").innerHTML = payExtra();
        var c = $("#f-change");
        if (c) c.focus();
      }
      if (e.target.name === "remember") state.remember = e.target.checked;
    });

    form.addEventListener("input", function (e) {
      if (e.target.name === "change") {
        e.target.value = e.target.value.replace(/[^\d,\.]/g, "");
        setInvalid("change", false);
      }
    });

    refreshAside();
  }

  window.addEventListener("obk:cart", function () {
    if (state.step) refreshAside();
  });

  render();
})();
