/* Páginas institucionais: conteúdo editável pelo painel */
(function () {
  var S = MB.store, U = MB.ui;
  var LINKS = [
    ["sobre", "Nossa história"], ["contato", "Fale conosco"], ["faq", "Perguntas frequentes"], ["entrega", "Entrega e frete"],
    ["trocas", "Trocas e devoluções"], ["garantia", "Garantia"], ["privacidade", "Privacidade"], ["termos", "Termos de compra"]
  ];

  U.mount().then(function (s) {
    var main = U.$("[data-info]"); if (!main) return;
    var key = main.getAttribute("data-info");
    var page = (s.pages && s.pages[key]) || {};
    U.$("[data-info-title]").textContent = page.title || U.$("[data-info-title]").textContent;
    U.setMeta((page.title || "") + " · Mais Bella Semijoias");
    U.$("[data-info-nav]").innerHTML = LINKS.map(function (l) {
      return '<a class="chip" href="' + l[0] + '.html"' + (l[0] === key ? ' aria-current="page"' : "") + ">" + l[1] + "</a>";
    }).join("");
    var body = U.$("[data-info-body]");
    var html = U.safeHtml(page.body || "");
    if (key === "faq") {
      html += '<div class="faq">' + (page.faq || []).map(function (f) {
        return "<details><summary>" + U.esc(f.q) + "</summary><div><p>" + U.esc(f.a) + "</p></div></details>";
      }).join("") + "</div><p style=\"margin-top:1rem\">Não encontrou sua resposta? <a href=\"#\" data-wa=\"general\">Fale com a gente pelo WhatsApp</a>.</p>";
    }
    if (key === "contato") html += contact(s);
    if (key === "sobre") html += '<p style="margin-top:1rem"><a class="btn" href="colecao.html">Conhecer a coleção</a></p>';
    body.innerHTML = html;
  });

  function contact(s) {
    var rows = [];
    rows.push('<a class="buy__wa" href="#" data-wa="general"><span style="width:22px;height:22px;display:inline-grid">' + U.WA_SVG + "</span><div><strong>WhatsApp</strong><span>" +
      (s.whatsapp ? "Atendimento personalizado" : "Número a ser configurado pela loja") + "</span></div>" + U.icon("arrow", "icon--sm") + "</a>");
    if (s.email) rows.push('<a class="buy__wa" href="mailto:' + U.esc(s.email) + '">' + U.icon("mail") + "<div><strong>E-mail</strong><span>" + U.esc(s.email) + "</span></div>" + U.icon("arrow", "icon--sm") + "</a>");
    if (s.instagram) rows.push('<a class="buy__wa" href="' + U.esc(s.instagram) + '" target="_blank" rel="noopener">' + U.icon("instagram") + "<div><strong>Instagram</strong><span>Novidades e bastidores</span></div>" + U.icon("arrow", "icon--sm") + "</a>");
    if (s.hours) rows.push('<p class="muted" style="display:flex;gap:.6rem;align-items:center">' + U.icon("clock", "icon--sm") + U.esc(s.hours) + "</p>");
    return '<div style="display:grid;gap:.75rem;margin-top:1rem;font-size:.9rem">' + rows.join("") + "</div>";
  }
})();
