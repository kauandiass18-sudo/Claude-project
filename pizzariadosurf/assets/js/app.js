/*
 * Pizzaria do Surf — comportamento da página
 * Links do WhatsApp, montagem da pizza, menu do celular e animações.
 */
(function () {
  "use strict";

  var cfg = window.PIZZARIA_CONFIG || {};
  var contato = cfg.contato || {};
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- WhatsApp ----------
  function linkWhatsApp(mensagem) {
    var numero = String(contato.whatsapp || "").replace(/\D/g, "");
    var texto = encodeURIComponent(mensagem || cfg.mensagemPadrao || "");
    return "https://wa.me/" + numero + "?text=" + texto;
  }

  function mensagemDoBotao(el) {
    var item = el.getAttribute("data-pedido");
    if (!item) return cfg.mensagemPadrao;
    // Itens que terminam com ": " pedem que o cliente complete (ex.: sabores do meio a meio).
    return "Olá, Pizzaria do Surf! Quero pedir: " + item + (/:\s$/.test(item) ? "" : ".");
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.href = linkWhatsApp(mensagemDoBotao(el));
    el.target = "_blank";
    el.rel = "noopener";
  });

  // ---------- Cardápio completo ----------
  if (cfg.cardapioUrl) {
    document.querySelectorAll("[data-cardapio]").forEach(function (el) {
      el.href = cfg.cardapioUrl;
      el.target = "_blank";
      el.rel = "noopener";
    });
  }

  // ---------- Categorias do cardápio ----------
  var abas = Array.prototype.slice.call(document.querySelectorAll("[data-abas] [role=tab]"));
  function abrirAba(aba, focar) {
    abas.forEach(function (outra) {
      var ativa = outra === aba;
      outra.setAttribute("aria-selected", String(ativa));
      outra.tabIndex = ativa ? 0 : -1;
      document.getElementById(outra.getAttribute("aria-controls")).hidden = !ativa;
    });
    if (focar) aba.focus();
  }
  abas.forEach(function (aba, i) {
    aba.addEventListener("click", function () { abrirAba(aba); });
    aba.addEventListener("keydown", function (e) {
      var passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!passo) return;
      e.preventDefault();
      abrirAba(abas[(i + passo + abas.length) % abas.length], true);
    });
  });

  // ---------- Rodapé: horários, endereço e redes ----------
  function preencherLista(seletor, itens) {
    var alvo = document.querySelector(seletor);
    if (!alvo) return;
    if (!itens || !itens.length) { alvo.closest("[data-bloco]").hidden = true; return; }
    alvo.innerHTML = "";
    itens.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      alvo.appendChild(li);
    });
  }
  preencherLista("[data-horarios]", cfg.horarios);
  preencherLista("[data-endereco]", cfg.endereco ? [cfg.endereco] : []);

  document.querySelectorAll("[data-rede]").forEach(function (el) {
    var url = contato[el.getAttribute("data-rede")];
    if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
    else el.hidden = true;
  });

  if (!cfg.imagensIlustrativas && !cfg.depoimentosDeExemplo) {
    document.querySelectorAll("[data-aviso-previa]").forEach(function (el) { el.hidden = true; });
  }

  var ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();

  // ---------- Cabeçalho e menu do celular ----------
  var topo = document.querySelector("[data-topo]");
  var barra = document.querySelector("[data-barra-pedido]");
  var hero = document.querySelector("[data-hero-ctas]");
  function aoRolar() {
    var y = window.scrollY;
    topo.classList.toggle("topo--fixo", y > 24);
    if (barra && hero) {
      var passouHero = hero.getBoundingClientRect().bottom < 0;
      var chegouFim = window.innerHeight + y > document.documentElement.scrollHeight - 220;
      barra.classList.toggle("barra-pedido--visivel", passouHero && !chegouFim);
    }
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  var botaoMenu = document.querySelector("[data-menu-botao]");
  var menu = document.querySelector("[data-menu]");
  function fecharMenu() {
    botaoMenu.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-aberto");
  }
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      var abrir = botaoMenu.getAttribute("aria-expanded") !== "true";
      botaoMenu.setAttribute("aria-expanded", String(abrir));
      document.body.classList.toggle("menu-aberto", abrir);
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) fecharMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });
  }

  // ---------- FAQ: um item aberto por vez ----------
  var perguntas = document.querySelectorAll(".faq__item");
  perguntas.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      perguntas.forEach(function (outro) { if (outro !== item) outro.open = false; });
    });
  });

  // ---------- Entrada suave das seções ----------
  var revelaveis = document.querySelectorAll(".revelar");
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    revelaveis.forEach(function (el) { el.classList.add("revelado"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("revelado"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revelaveis.forEach(function (el) { obs.observe(el); });
  }
})();
