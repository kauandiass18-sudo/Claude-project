/* =========================================================================
   Pedidos de site — validação, máscara e envio para o WhatsApp
   ========================================================================= */
(function () {
  "use strict";

  var CONFIG = window.CONFIG || {};

  var form = document.getElementById("form-pedido");
  var tipo = document.getElementById("tipo");
  var outroWrap = document.getElementById("outro-wrap");
  var outro = document.getElementById("outro");
  var ideia = document.getElementById("ideia");
  var whatsapp = document.getElementById("whatsapp");
  var honeypot = document.getElementById("empresa");
  var contador = document.getElementById("contador");
  var botao = document.getElementById("btn-enviar");
  var formErro = document.getElementById("form-erro");
  var sucesso = document.getElementById("sucesso");
  var sucessoNumero = document.getElementById("sucesso-numero");
  var botaoNovo = document.getElementById("btn-novo");

  var CHAVE_ULTIMO_ENVIO = "pedidos:ultimoEnvio";

  document.getElementById("ano").textContent = new Date().getFullYear();

  /* Botão "Tire sua dúvida aqui": abre uma conversa com o seu número */
  document.getElementById("btn-duvida").href =
    "https://wa.me/" + CONFIG.meuWhatsApp + "?text=" +
    encodeURIComponent("Olá! Tenho uma dúvida sobre a criação de um site.");

  /* ---------------------------------------------------------------------
     Animações de entrada
     --------------------------------------------------------------------- */
  var revelaveis = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });

    revelaveis.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
      observer.observe(el);
    });
  } else {
    revelaveis.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------------
     Campo "Outro"
     --------------------------------------------------------------------- */
  tipo.addEventListener("change", function () {
    var ehOutro = tipo.value === "Outro";
    outroWrap.hidden = !ehOutro;
    if (ehOutro) outro.focus();
    limparErro("tipo");
  });
  outro.addEventListener("input", function () { limparErro("tipo"); });

  /* ---------------------------------------------------------------------
     Contador de caracteres da ideia
     --------------------------------------------------------------------- */
  ideia.addEventListener("input", function () {
    contador.textContent = ideia.value.length + " / " + ideia.maxLength;
    limparErro("ideia");
  });

  /* ---------------------------------------------------------------------
     Máscara de telefone brasileiro: (11) 99999-9999 ou (11) 3333-4444
     --------------------------------------------------------------------- */
  function soDigitos(texto) {
    return texto.replace(/\D/g, "");
  }

  function mascararTelefone(valor) {
    var d = soDigitos(valor);
    // Remove o DDI 55 se a pessoa colar o número completo
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    d = d.slice(0, 11);

    if (d.length === 0) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  whatsapp.addEventListener("input", function () {
    whatsapp.value = mascararTelefone(whatsapp.value);
    limparErro("whatsapp");
  });

  function telefoneValido(valor) {
    var d = soDigitos(valor);
    if (d.length === 11) return d.charAt(2) === "9"; // celular
    return d.length === 10;                          // fixo
  }

  /* ---------------------------------------------------------------------
     Validação
     --------------------------------------------------------------------- */
  function mostrarErro(campo, mensagem) {
    var el = document.getElementById(campo + "-erro");
    el.textContent = mensagem;
    el.closest(".field").classList.add("is-invalid");
  }

  function limparErro(campo) {
    var el = document.getElementById(campo + "-erro");
    el.textContent = "";
    el.closest(".field").classList.remove("is-invalid");
    formErro.textContent = "";
  }

  function validar() {
    var primeiroInvalido = null;

    if (!tipo.value) {
      mostrarErro("tipo", "Escolha o tipo do seu negócio.");
      primeiroInvalido = primeiroInvalido || tipo;
    } else if (tipo.value === "Outro" && outro.value.trim().length < 2) {
      mostrarErro("tipo", "Conte qual é o seu negócio.");
      primeiroInvalido = primeiroInvalido || outro;
    }

    if (ideia.value.trim().length < 10) {
      mostrarErro("ideia", "Descreva sua ideia em pelo menos algumas palavras.");
      primeiroInvalido = primeiroInvalido || ideia;
    }

    if (!telefoneValido(whatsapp.value)) {
      mostrarErro("whatsapp", "Informe um WhatsApp válido com DDD.");
      primeiroInvalido = primeiroInvalido || whatsapp;
    }

    if (primeiroInvalido) primeiroInvalido.focus();
    return !primeiroInvalido;
  }

  /* ---------------------------------------------------------------------
     Montagem da mensagem
     --------------------------------------------------------------------- */
  function montarDados() {
    var negocio = tipo.value === "Outro" ? "Outro — " + outro.value.trim() : tipo.value;
    var telefone = whatsapp.value;
    var agora = new Date();

    return {
      negocio: negocio,
      ideia: ideia.value.trim(),
      whatsapp: telefone,
      whatsappLink: "https://wa.me/55" + soDigitos(telefone),
      data: agora.toLocaleDateString("pt-BR"),
      hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
  }

  function montarMensagem(d) {
    return [
      "✨ *NOVO PEDIDO DE SITE*",
      "",
      "🏢 *Negócio:* " + d.negocio,
      "",
      "💡 *Ideia do cliente:*",
      d.ideia,
      "",
      "📱 *WhatsApp:* " + d.whatsapp,
      "💬 Responder: " + d.whatsappLink,
      "",
      "_Recebido em " + d.data + " às " + d.hora + "_"
    ].join("\n");
  }

  /* ---------------------------------------------------------------------
     Envio
     --------------------------------------------------------------------- */

  // CallMeBot: a mensagem vai direto para o seu WhatsApp, sem abrir nada.
  // O serviço não libera CORS, então usamos "no-cors": o pedido é entregue,
  // mas a resposta não pode ser lida — só detectamos falhas de rede.
  function enviarCallMeBot(mensagem) {
    var url = "https://api.callmebot.com/whatsapp.php" +
      "?phone=" + encodeURIComponent(CONFIG.meuWhatsApp) +
      "&text=" + encodeURIComponent(mensagem) +
      "&apikey=" + encodeURIComponent(CONFIG.callmebotApiKey);

    return fetch(url, { method: "GET", mode: "no-cors", cache: "no-store" });
  }

  // Webhook próprio: recebe os dados em JSON e faz o envio no servidor.
  function enviarWebhook(dados, mensagem) {
    return fetch(CONFIG.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destino: CONFIG.meuWhatsApp, mensagem: mensagem, dados: dados })
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error("Webhook respondeu " + resposta.status);
    });
  }

  // Plano B: abre o WhatsApp do cliente com a mensagem pronta.
  function enviarPorLink(mensagem) {
    var url = "https://wa.me/" + CONFIG.meuWhatsApp + "?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank", "noopener");
    return Promise.resolve();
  }

  function enviar(dados) {
    var mensagem = montarMensagem(dados);

    // Sem apikey o CallMeBot não entrega nada, mas o "no-cors" não deixa
    // perceber o erro. Nesse caso usamos o link para não perder o pedido.
    var temApiKey = CONFIG.callmebotApiKey && CONFIG.callmebotApiKey !== "COLOQUE_SUA_APIKEY_AQUI";

    switch (CONFIG.modoEnvio) {
      case "callmebot": return temApiKey ? enviarCallMeBot(mensagem) : enviarPorLink(mensagem);
      case "webhook":   return enviarWebhook(dados, mensagem);
      default:          return enviarPorLink(mensagem);
    }
  }

  /* ---------------------------------------------------------------------
     Limite de envios por navegador (evita cliques repetidos e spam)
     --------------------------------------------------------------------- */
  function segundosParaLiberar() {
    try {
      var ultimo = Number(localStorage.getItem(CHAVE_ULTIMO_ENVIO)) || 0;
      var espera = (CONFIG.intervaloEntreEnvios || 0) * 1000 - (Date.now() - ultimo);
      return espera > 0 ? Math.ceil(espera / 1000) : 0;
    } catch (e) {
      return 0;
    }
  }

  function registrarEnvio() {
    try { localStorage.setItem(CHAVE_ULTIMO_ENVIO, String(Date.now())); } catch (e) { /* sem storage */ }
  }

  /* ---------------------------------------------------------------------
     Submissão do formulário
     --------------------------------------------------------------------- */
  function mostrarSucesso(telefone) {
    sucessoNumero.textContent = telefone;
    form.hidden = true;
    sucesso.hidden = false;
    sucesso.focus({ preventScroll: true });
    document.getElementById("pedido").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    formErro.textContent = "";

    if (!validar()) return;

    var dados = montarDados();

    // Robô preencheu o campo invisível: finge sucesso e não envia nada.
    if (honeypot.value) {
      mostrarSucesso(dados.whatsapp);
      return;
    }

    var espera = segundosParaLiberar();
    if (espera) {
      formErro.textContent = "Você acabou de enviar uma ideia. Aguarde " + espera + "s para enviar outra.";
      return;
    }

    botao.classList.add("is-loading");
    botao.disabled = true;

    enviar(dados)
      .then(function () {
        registrarEnvio();
        mostrarSucesso(dados.whatsapp);
      })
      .catch(function () {
        formErro.textContent = "Não foi possível enviar agora. Verifique sua conexão e tente novamente.";
      })
      .then(function () {
        botao.classList.remove("is-loading");
        botao.disabled = false;
      });
  });

  /* Volta ao formulário vazio */
  botaoNovo.addEventListener("click", function () {
    form.reset();
    outroWrap.hidden = true;
    contador.textContent = "0 / " + ideia.maxLength;
    sucesso.hidden = true;
    form.hidden = false;
    tipo.focus();
  });
})();
