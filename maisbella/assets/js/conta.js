/* Área da cliente: login, cadastro, recuperação de senha e pedidos */
(function () {
  var S = MB.store, U = MB.ui;
  var root = U.$("[data-account]");
  var STATUS = { aguardando: "Aguardando pagamento", pago: "Pago", em_producao: "Em produção", separacao: "Em separação", enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado" };

  U.mount().then(function () {
    if (!S.live) return demo();
    if (U.qs("redefinir") === "1") return resetForm();
    S.getUser().then(function (u) { if (u) orders(u); else login(); });
  });

  function orderRows(list) {
    if (!list.length) return '<div class="empty" style="padding:2.5rem 1rem;border:1px solid var(--line)"><p class="h3">Nenhum pedido por aqui</p><p>Quando você fizer uma compra, ela aparece nesta lista.</p><a class="btn btn--ghost" href="colecao.html">Ver coleção</a></div>';
    return '<div class="orders-list">' + list.map(function (o) {
      var total = o.totals ? o.totals.total : o.total;
      return '<a class="order-row" href="pedido.html?id=' + encodeURIComponent(o.id) + "&t=" + encodeURIComponent(o.token || o.access_token) + '">' +
        "<strong>Pedido nº " + o.number + "</strong><span class=\"price\">" + S.fmt(total) + "</span>" +
        "<small>" + new Date(o.created_at).toLocaleDateString("pt-BR") + " · " + (o.items || []).length + " " + ((o.items || []).length === 1 ? "item" : "itens") + '</small><span class="status-badge" data-s="' + U.esc(o.status) + '">' + U.esc(STATUS[o.status] || o.status) + "</span></a>";
    }).join("") + "</div>";
  }

  function demo() {
    S.myOrders().then(function (list) {
      root.innerHTML = '<div class="notice">' + U.icon("info", "icon--sm") + "<span>Modo demonstração: o cadastro e o login de clientes são ativados ao conectar o banco de dados. Abaixo aparecem os pedidos feitos neste navegador.</span></div>" +
        '<section style="display:grid;gap:1.2rem"><h2 class="h3">Seus pedidos</h2>' + orderRows(list) + "</section>";
    });
  }

  function login(mode) {
    mode = mode || "entrar";
    var isUp = mode === "cadastro";
    root.innerHTML =
      '<div class="auth-box">' +
      '<div class="tabs" style="margin:0;padding:0"><button class="chip" type="button" data-mode="entrar" aria-pressed="' + !isUp + '">Entrar</button><button class="chip" type="button" data-mode="cadastro" aria-pressed="' + isUp + '">Criar conta</button></div>' +
      '<p class="muted">' + (isUp ? "Crie sua conta para acompanhar seus pedidos com facilidade." : "Acesse para acompanhar seus pedidos.") + "</p>" +
      '<form class="form-grid" data-auth novalidate>' +
      (isUp ? '<div class="field"><label for="a-name">Nome</label><input class="input" id="a-name" autocomplete="name" required></div>' : "") +
      '<div class="field"><label for="a-email">E-mail</label><input class="input" id="a-email" type="email" autocomplete="email" required></div>' +
      '<div class="field"><label for="a-pass">Senha</label><input class="input" id="a-pass" type="password" autocomplete="' + (isUp ? "new-password" : "current-password") + '" minlength="8" required>' + (isUp ? '<span class="hint">Mínimo de 8 caracteres.</span>' : "") + "</div>" +
      '<div data-msg></div>' +
      '<button class="btn btn--block" type="submit">' + (isUp ? "Criar conta" : "Entrar") + "</button>" +
      (isUp ? "" : '<button class="small muted" type="button" data-forgot style="text-decoration:underline;justify-self:start">Esqueci minha senha</button>') +
      "</form></div>";
    U.$$("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { login(b.getAttribute("data-mode")); }); });
    var forgot = U.$("[data-forgot]");
    if (forgot) forgot.addEventListener("click", function () {
      var email = U.$("#a-email").value.trim();
      if (!email) return msg("Informe seu e-mail acima para receber o link de redefinição.", true);
      S.resetPassword(email).then(function () { msg("Enviamos um link de redefinição para " + email + "."); }, function (e) { msg(e.message, true); });
    });
    U.$("[data-auth]").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = U.$("#a-email").value.trim(), pass = U.$("#a-pass").value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return msg("Informe um e-mail válido.", true);
      if (pass.length < 8) return msg("A senha precisa ter pelo menos 8 caracteres.", true);
      var btn = e.target.querySelector('[type="submit"]'); btn.disabled = true;
      var p = isUp ? S.signUp(email, pass, U.$("#a-name").value.trim()) : S.signIn(email, pass);
      p.then(function (r) {
        if (isUp && !(r && r.session)) { msg("Conta criada. Confirme pelo link enviado para " + email + "."); btn.disabled = false; return; }
        S.getUser().then(orders);
      }).catch(function (err) {
        btn.disabled = false;
        msg(/invalid login/i.test(err.message) ? "E-mail ou senha incorretos." : err.message, true);
      });
    });
  }

  function msg(t, bad) { U.$("[data-msg]").innerHTML = '<div class="notice' + (bad ? " notice--error" : "") + '"><span>' + U.esc(t) + "</span></div>"; }

  function resetForm() {
    root.innerHTML = '<form class="auth-box" data-reset novalidate><h2 class="h3">Nova senha</h2><div class="field"><label for="n-pass">Nova senha</label><input class="input" id="n-pass" type="password" autocomplete="new-password" minlength="8" required></div><div data-msg></div><button class="btn" type="submit">Salvar senha</button></form>';
    U.$("[data-reset]").addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = U.$("#n-pass").value;
      if (pw.length < 8) return msg("A senha precisa ter pelo menos 8 caracteres.", true);
      S.updatePassword(pw).then(function () { history.replaceState(null, "", "conta.html"); S.getUser().then(orders); }, function (er) { msg(er.message, true); });
    });
  }

  function orders(u) {
    root.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap"><p>Olá, <strong>' + U.esc((u.user_metadata && u.user_metadata.name) || u.email) + '</strong></p><button class="btn btn--ghost btn--sm" type="button" data-out>Sair</button></div>' +
      '<section style="display:grid;gap:1.2rem"><h2 class="h3">Seus pedidos</h2><div data-list><div class="skeleton" style="height:70px"></div></div></section>';
    U.$("[data-out]").addEventListener("click", function () { S.signOut().then(function () { login(); }); });
    S.myOrders().then(function (list) { U.$("[data-list]").innerHTML = orderRows(list); }, function () { U.$("[data-list]").innerHTML = '<p class="muted">Não foi possível carregar seus pedidos agora.</p>'; });
  }
})();
