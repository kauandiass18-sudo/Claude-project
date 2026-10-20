/* Confirmação e acompanhamento do pedido */
(function () {
  var S = MB.store, U = MB.ui;
  var id = U.qs("id"), token = U.qs("t"), isNew = U.qs("novo") === "1";
  var root = U.$("[data-order]"), settings, poll = null;

  var STATUS = {
    aguardando: "Aguardando pagamento",
    pago: "Pagamento aprovado",
    em_producao: "Em produção",
    separacao: "Em separação",
    enviado: "Enviado",
    entregue: "Entregue",
    cancelado: "Cancelado"
  };

  U.mount().then(function (s) {
    settings = s;
    if (!id || !token) return missing();
    load(true);
  });

  function missing() {
    root.innerHTML = '<div class="empty" style="padding:6rem 1rem"><h1 class="h3">Pedido não encontrado</h1><p>Confira o link recebido ou acesse sua conta.</p><a class="btn" href="conta.html">Minha conta</a></div>';
  }

  function load(first) {
    return S.getOrder(id, token).then(function (o) {
      if (!o) return missing();
      render(o);
      var waiting = o.status === "aguardando" && (o.payment_method === "pix" || o.payment_method === "card");
      if (waiting && S.live && !poll) poll = setInterval(function () { load(false); }, 6000);
      if (!waiting && poll) { clearInterval(poll); poll = null; }
    }).catch(function () {
      if (first) root.innerHTML = '<div class="empty" style="padding:6rem 1rem"><h1 class="h3">Não foi possível carregar o pedido.</h1><button class="btn btn--ghost" type="button" onclick="location.reload()">Tentar novamente</button></div>';
    });
  }

  function waText(o) {
    var t = o.totals || {};
    var lines = ["Olá! Acabei de fazer o pedido nº " + o.number + " no site da Mais Bella Semijoias.", ""];
    (o.items || []).forEach(function (i) {
      lines.push("• " + i.qty + "× " + i.name + (U.optText(i) ? " (" + U.optText(i) + ")" : "") + " — " + S.fmt(i.price * i.qty));
    });
    lines.push("");
    lines.push("Subtotal: " + S.fmt(t.subtotal));
    if (t.discount) lines.push("Desconto" + (o.coupon ? " (" + o.coupon + ")" : "") + ": −" + S.fmt(t.discount));
    lines.push("Frete: " + (o.shipping ? (o.shipping.name + " " + (o.shipping.price ? S.fmt(o.shipping.price) : "grátis")) : "a combinar"));
    if (o.gift_wrap) lines.push("Embalagem para presente: sim" + (o.gift_message ? " — mensagem: " + o.gift_message : ""));
    lines.push("Total: " + S.fmt(t.total));
    lines.push("");
    var a = o.address || {};
    lines.push("Entrega: " + [a.street + ", " + a.number, a.complement, a.district, a.city + "/" + a.state, a.cep].filter(Boolean).join(" · "));
    lines.push("Nome: " + (o.customer || {}).name);
    lines.push("");
    lines.push("Como posso fazer o pagamento?");
    lines.push(U.siteUrl() + "pedido.html?id=" + o.id + "&t=" + o.token);
    return lines.join("\n");
  }

  function render(o) {
    var t = o.totals || { subtotal: o.subtotal, discount: o.discount, shipping: o.shipping_cost, total: o.total, gift: o.gift_wrap_cost };
    o.totals = t;
    var pd = o.payment_data || {};
    var status = STATUS[o.status] || o.status;
    var head;
    if (o.status === "aguardando" && o.payment_method === "pix" && pd.qr_code) {
      head = '<div class="order__hero"><span class="eyebrow eyebrow--plain">Pedido nº ' + o.number + '</span><h1 class="h2">Falta só <em>o Pix.</em></h1><p class="lead muted">Escaneie o QR Code ou copie o código no app do seu banco. A confirmação aparece aqui automaticamente.</p></div>' +
        '<div class="pix">' + (pd.qr_code_base64 ? '<img src="data:image/png;base64,' + pd.qr_code_base64 + '" alt="QR Code Pix" width="220" height="220">' : "") +
        '<p class="small muted">Valor: <strong style="color:var(--ink)">' + S.fmt(t.total) + "</strong>" + (pd.expires_at ? " · válido até " + new Date(pd.expires_at).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "") + "</p>" +
        '<div class="pix__code" data-pix-code>' + U.esc(pd.qr_code) + "</div>" +
        '<button class="btn" type="button" data-copy>' + U.icon("copy", "icon--sm") + " Copiar código Pix</button>" +
        '<p class="small muted" style="display:flex;gap:.5rem;align-items:center"><span class="spinner" style="width:12px;height:12px;border:1px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin .8s linear infinite;display:inline-block"></span> Aguardando confirmação do pagamento</p></div>';
    } else if (o.status === "aguardando" && o.payment_method === "card") {
      head = '<div class="order__hero"><span class="eyebrow eyebrow--plain">Pedido nº ' + o.number + '</span><h1 class="h2">Estamos confirmando <em>seu pagamento.</em></h1><p class="lead muted">Assim que o provedor aprovar, o status muda aqui automaticamente.</p>' +
        (pd.redirect ? '<a class="btn" href="' + U.esc(pd.redirect) + '">Voltar ao pagamento</a>' : "") + "</div>";
    } else if (o.payment_method === "whatsapp" && o.status === "aguardando") {
      head = '<div class="order__hero"><div class="mark">' + U.icon("check", "icon--lg") + '</div><span class="eyebrow eyebrow--plain">Pedido nº ' + o.number + ' registrado</span><h1 class="h2">Agora é só <em>enviar para a loja.</em></h1>' +
        '<p class="lead muted">Toque no botão abaixo para enviar o resumo do pedido pelo WhatsApp. A loja confirma a disponibilidade, o frete e combina o pagamento com você.</p>' +
        '<button class="btn" type="button" data-send-wa style="margin-top:.5rem">' + '<span style="width:18px;height:18px;display:inline-grid">' + U.WA_SVG + "</span> Enviar pedido pelo WhatsApp</button>" +
        (!S.live ? '<p class="small muted" style="max-width:30rem">Modo demonstração: o pedido foi salvo neste navegador e aparece no painel da loja.</p>' : "") + "</div>";
    } else {
      head = '<div class="order__hero"><div class="mark">' + U.icon(o.status === "cancelado" ? "close" : "check", "icon--lg") + '</div><span class="eyebrow eyebrow--plain">Pedido nº ' + o.number + "</span>" +
        '<h1 class="h2">' + (o.status === "pago" ? "Obrigada pela <em>sua compra.</em>" : U.esc(status)) + "</h1>" +
        '<p class="lead muted">' + (o.status === "pago" ? "Recebemos o seu pagamento. Você receberá as próximas atualizações por e-mail ou WhatsApp." : "Acompanhe abaixo os detalhes do seu pedido.") + "</p></div>";
    }

    var a = o.address || {};
    root.innerHTML = '<div class="order">' + head +
      '<div style="display:flex;justify-content:center"><span class="status-badge" data-s="' + U.esc(o.status) + '">' + U.esc(status) + "</span></div>" +
      (o.tracking_code ? '<div class="notice">' + U.icon("truck", "icon--sm") + "<span>Código de rastreamento: <strong>" + U.esc(o.tracking_code) + "</strong></span></div>" : "") +
      '<section class="co__summary" aria-label="Itens do pedido"><h2 class="h3" style="font-size:1.35rem">Itens</h2><div class="co__items">' +
      (o.items || []).map(function (i) {
        return '<div class="co__item"><div class="img"><img ' + U.imgAttrs(i.image, "64px") + ' alt=""><b>' + i.qty + '</b></div><div><div class="name">' + U.esc(i.name) + '</div><div class="meta">' + U.esc(U.optText(i)) + '</div></div><div class="price">' + S.fmt(i.price * i.qty) + "</div></div>";
      }).join("") + "</div>" +
      '<div class="co__totals"><div class="row"><span>Subtotal</span><span>' + S.fmt(t.subtotal) + "</span></div>" +
      (t.discount ? '<div class="row"><span>Desconto</span><span>− ' + S.fmt(t.discount) + "</span></div>" : "") +
      (t.pixDiscount ? '<div class="row"><span>Desconto Pix</span><span>− ' + S.fmt(t.pixDiscount) + "</span></div>" : "") +
      '<div class="row"><span>Frete' + (o.shipping ? " · " + U.esc(o.shipping.name) : "") + "</span><span>" + (o.shipping ? (o.shipping.price ? S.fmt(o.shipping.price) : "Grátis") : "A combinar") + "</span></div>" +
      (t.gift ? '<div class="row"><span>Embalagem para presente</span><span>' + S.fmt(t.gift) + "</span></div>" : "") +
      '<div class="row row--total"><span>Total</span><span>' + S.fmt(t.total) + "</span></div></div></section>" +
      '<section style="display:grid;gap:.4rem;font-size:.86rem"><h2 class="h3" style="font-size:1.35rem;margin-bottom:.4rem">Entrega</h2>' +
      "<p>" + U.esc((o.customer || {}).name) + "</p><p class=\"muted\">" + U.esc([a.street + ", " + a.number, a.complement, a.district, a.city + "/" + a.state, a.cep].filter(Boolean).join(" · ")) + "</p>" +
      (o.gift_wrap ? '<p class="muted">Embalagem para presente' + (o.gift_message ? ": “" + U.esc(o.gift_message) + "”" : "") + "</p>" : "") + "</section>" +
      '<div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center"><a class="btn btn--ghost" href="colecao.html">Continuar comprando</a><a class="btn btn--ghost" href="#" data-wa="general">Falar com a loja</a></div>' +
      "</div>";

    var copy = U.$("[data-copy]");
    if (copy) copy.addEventListener("click", function () {
      var code = pd.qr_code;
      (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { U.toast("Código Pix copiado."); }, function () {
        var r = document.createRange(); r.selectNodeContents(U.$("[data-pix-code]")); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        U.toast("Selecione e copie o código acima.");
      });
    });
    var send = U.$("[data-send-wa]");
    if (send) send.addEventListener("click", function () { U.openWa(waText(o)); });
    if (isNew) history.replaceState(null, "", location.pathname + "?id=" + encodeURIComponent(id) + "&t=" + encodeURIComponent(token));
  }
})();
