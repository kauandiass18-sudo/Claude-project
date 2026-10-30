/*
 * Página de vendas · Tratamento de água para o agronegócio
 * Comportamento: dados da empresa, menu, WhatsApp, medição de conversões
 * e formulário de solicitação.
 */
(function () {
  "use strict";

  var cfg = window.AGUA_CONFIG || {};
  var empresa = cfg.empresa || {};
  var contato = cfg.contato || {};
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(seletor, raiz) { return (raiz || document).querySelector(seletor); }
  function $$(seletor, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor)); }
  function texto(valor) { return String(valor == null ? "" : valor).trim(); }
  function criar(tag, classe, conteudo) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (conteudo) el.textContent = conteudo;
    return el;
  }

  // ---------- Medição de conversões ----------
  // Envia eventos para o Google Tag Manager (dataLayer) ou para o gtag, se
  // estiverem instalados. Nenhum dado pessoal é enviado nos eventos.
  function registrar(evento, dados) {
    var params = dados || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: evento }, params));
    if (typeof window.gtag === "function") window.gtag("event", evento, params);
  }

  // ---------- WhatsApp ----------
  var numeroWhats = texto(contato.whatsapp).replace(/\D/g, "");
  function linkWhatsApp(mensagem) {
    var msg = encodeURIComponent(mensagem || cfg.mensagemWhatsApp || "");
    return numeroWhats
      ? "https://wa.me/" + numeroWhats + "?text=" + msg
      : "https://api.whatsapp.com/send?text=" + msg;
  }
  function prepararWhatsApp(el, mensagem) {
    el.href = linkWhatsApp(mensagem);
    el.target = "_blank";
    el.rel = "noopener";
  }
  $$("[data-whatsapp]").forEach(function (el) {
    prepararWhatsApp(el);
    el.addEventListener("click", function () {
      registrar("contato_whatsapp", { local: el.getAttribute("data-whatsapp") });
    });
  });

  // ---------- Chamadas para a avaliação ----------
  $$("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      registrar("clique_avaliacao", { local: el.getAttribute("data-cta") });
      var necessidade = el.getAttribute("data-necessidade");
      var campo = $("#f-necessidade");
      if (necessidade && campo && $$("option", campo).some(function (op) { return op.value === necessidade; })) {
        campo.value = necessidade;
        if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
      }
    });
  });

  // ---------- Serviços e aplicações confirmados ----------
  function aplicarSelecao(mapa, atributo) {
    if (!mapa) return;
    Object.keys(mapa).forEach(function (chave) {
      if (mapa[chave] !== false) return;
      $$("[" + atributo + '="' + chave + '"]').forEach(function (el) {
        if (el.tagName === "OPTION") el.remove();
        else el.hidden = true;
      });
    });
  }
  aplicarSelecao(cfg.servicos, "data-servico");
  aplicarSelecao(cfg.aplicacoes, "data-aplicacao");

  // ---------- Marca ----------
  var nome = texto(empresa.nome);
  $$("[data-marca]").forEach(function (el) {
    if (empresa.logo) {
      var img = document.createElement("img");
      img.src = empresa.logo;
      img.alt = nome || "Logotipo";
      img.height = 36;
      el.replaceChildren(img);
    } else if (nome) {
      el.replaceChildren(criar("span", "marca__nome", nome));
    }
    el.setAttribute("aria-label", (nome ? nome + ", " : "") + "voltar ao início");
  });
  if (texto(empresa.descricao)) $("[data-descricao]").textContent = texto(empresa.descricao);

  // ---------- Contatos ----------
  var telefone = texto(contato.telefone);
  var email = texto(contato.email);
  var linkFone = telefone ? "tel:+" + (function (d) { return d.indexOf("55") === 0 && d.length > 11 ? d : "55" + d; })(telefone.replace(/\D/g, "")) : "";

  function preencherLink(item, href, rotulo) {
    if (!item || !href) return;
    var a = $("a", item);
    a.href = href;
    ($("span", a) || a).textContent = rotulo;
    item.hidden = false;
  }
  function preencherTexto(item, valor) {
    if (!item || !valor) return;
    item.textContent = valor;
    item.hidden = false;
  }
  preencherLink($('[data-canal="telefone"]'), linkFone, telefone);
  preencherLink($('[data-canal="email"]'), email && "mailto:" + email, email);
  preencherTexto($('[data-canal="horario"]'), texto(contato.horario));
  preencherLink($('[data-rodape="telefone"]'), linkFone, telefone);
  preencherLink($('[data-rodape="email"]'), email && "mailto:" + email, email);
  preencherTexto($('[data-rodape="endereco"]'), texto(empresa.endereco));

  var regioes = (empresa.regioes || []).map(texto).filter(Boolean);
  var listaRegioes = regioes.join(", ").replace(/, ([^,]*)$/, " e $1");
  if (regioes.length) {
    preencherTexto($('[data-rodape="regioes"]'), "Atendimento: " + listaRegioes);
    $("[data-faq-regioes]").textContent = "Hoje atendemos " + listaRegioes + ". Para outras localidades, consulte a nossa equipe.";
  }

  $("[data-ano]").textContent = new Date().getFullYear();
  var razao = [texto(empresa.razaoSocial) || nome, texto(empresa.cnpj) && "CNPJ " + texto(empresa.cnpj)].filter(Boolean).join(" · ");
  if (razao) $("[data-razao]").textContent = " " + razao;

  // ---------- Evidências reais (seção Empresa) ----------
  var equipe = cfg.equipe || {};
  var fatos = { regioes: listaRegioes, responsavel: texto(equipe.responsavelTecnico), destaque: texto(equipe.destaque) };
  var temFato = false;
  Object.keys(fatos).forEach(function (chave) {
    var bloco = $('[data-fato="' + chave + '"]');
    if (!fatos[chave] || !bloco) return;
    $("dd", bloco).textContent = fatos[chave];
    bloco.hidden = false;
    temFato = true;
  });
  if (temFato) $("[data-fatos]").hidden = false;

  var casos = (cfg.casos || []).filter(function (c) { return c && texto(c.contexto) && texto(c.solucao); });
  if (casos.length) {
    var listaCasos = $("[data-casos-lista]");
    casos.forEach(function (c) {
      var art = criar("article", "caso");
      if (texto(c.cliente)) art.appendChild(criar("h4", "", texto(c.cliente)));
      var dl = document.createElement("dl");
      [["Contexto", c.contexto], ["Necessidade identificada", c.necessidade], ["Solução aplicada", c.solucao], ["Resultado documentado", c.resultado]].forEach(function (par) {
        if (!texto(par[1])) return;
        var div = document.createElement("div");
        div.appendChild(criar("dt", "", par[0]));
        div.appendChild(criar("dd", "", texto(par[1])));
        dl.appendChild(div);
      });
      art.appendChild(dl);
      listaCasos.appendChild(art);
    });
    $("[data-casos]").hidden = false;
  }

  var depoimentos = (cfg.depoimentos || []).filter(function (d) { return d && texto(d.texto) && texto(d.nome); });
  if (depoimentos.length) {
    var listaDep = $("[data-depoimentos-lista]");
    depoimentos.forEach(function (d) {
      var fig = criar("figure", "depoimento");
      fig.appendChild(criar("blockquote", "", texto(d.texto)));
      var legenda = document.createElement("figcaption");
      legenda.appendChild(criar("strong", "", texto(d.nome)));
      if (texto(d.cargo)) legenda.appendChild(document.createTextNode(texto(d.cargo)));
      fig.appendChild(legenda);
      listaDep.appendChild(fig);
    });
    $("[data-depoimentos]").hidden = false;
  }

  if (cfg.modoPrevia) $("[data-previa]").hidden = false;

  // ---------- Dados estruturados (somente com dados reais) ----------
  if (nome) {
    var org = { "@context": "https://schema.org", "@type": "Organization", name: nome, description: texto(empresa.descricao) || undefined };
    if (texto(empresa.site)) org.url = texto(empresa.site);
    if (empresa.logo && texto(empresa.site)) org.logo = new URL(empresa.logo, texto(empresa.site)).href;
    if (texto(empresa.razaoSocial)) org.legalName = texto(empresa.razaoSocial);
    if (texto(empresa.cnpj)) org.taxID = texto(empresa.cnpj);
    if (telefone) org.telephone = telefone;
    if (email) org.email = email;
    if (texto(empresa.endereco)) org.address = texto(empresa.endereco);
    if (regioes.length) org.areaServed = regioes;
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(org);
    document.head.appendChild(ld);
  }

  // ---------- Cabeçalho e menu ----------
  var topo = $("[data-topo]");
  var menu = $("[data-menu]");
  var abrir = $("[data-abrir-menu]");
  var abrirTexto = $("[data-abrir-menu-texto]");
  var desktop = window.matchMedia("(min-width: 1080px)");

  function aoRolar() { topo.classList.toggle("topo--rolado", window.scrollY > 8); }
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });

  function definirMenu(aberto, devolverFoco) {
    menu.classList.toggle("menu--aberto", aberto);
    abrir.setAttribute("aria-expanded", String(aberto));
    abrirTexto.textContent = aberto ? "Fechar menu" : "Abrir menu";
    $("use", abrir).setAttribute("href", aberto ? "#i-fechar" : "#i-menu");
    document.body.classList.toggle("menu-aberto", aberto);
    atualizarFlutuante();
    if (!aberto && devolverFoco) abrir.focus();
  }
  abrir.addEventListener("click", function () {
    definirMenu(abrir.getAttribute("aria-expanded") !== "true");
  });
  $$("a", menu).forEach(function (a) {
    a.addEventListener("click", function () { if (!desktop.matches) definirMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("menu--aberto")) definirMenu(false, true);
  });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("menu--aberto") && !topo.contains(e.target)) definirMenu(false);
  });
  function aoMudarTela() { if (desktop.matches) definirMenu(false); }
  if (desktop.addEventListener) desktop.addEventListener("change", aoMudarTela);
  else desktop.addListener(aoMudarTela);

  // Destaca no menu a seção visível.
  var linksMenu = $$(".menu__lista a");
  var secoesMenu = { solucoes: "solucoes", aplicacoes: "aplicacoes", abordagem: "abordagem", metodo: "abordagem", empresa: "empresa", contato: "contato" };
  if ("IntersectionObserver" in window) {
    var observaSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var alvo = "#" + secoesMenu[en.target.id];
        linksMenu.forEach(function (a) {
          if (a.getAttribute("href") === alvo) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(secoesMenu).forEach(function (id) { var s = document.getElementById(id); if (s) observaSecao.observe(s); });
    var limpaMenu = new IntersectionObserver(function (entradas) {
      if (entradas[0].isIntersecting) linksMenu.forEach(function (a) { a.removeAttribute("aria-current"); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["inicio", "necessidade", "duvidas"].forEach(function (id) { limpaMenu.observe(document.getElementById(id)); });
  }

  // ---------- WhatsApp flutuante ----------
  // Aparece depois da abertura e some na área de contato (que já mostra o WhatsApp).
  var flutuante = $("[data-whats-flutuante]");
  var passouAbertura = false;
  var naAreaContato = false;
  function atualizarFlutuante() {
    var visivel = passouAbertura && !naAreaContato && !document.body.classList.contains("menu-aberto");
    flutuante.classList.toggle("whats-flutuante--visivel", visivel);
    flutuante.tabIndex = visivel ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      var ultima = en[en.length - 1];
      passouAbertura = !ultima.isIntersecting && ultima.boundingClientRect.top < 0;
      atualizarFlutuante();
    }).observe($(".abertura__acoes"));
    new IntersectionObserver(function (en) {
      naAreaContato = en[en.length - 1].isIntersecting;
      atualizarFlutuante();
    }, { rootMargin: "0px 0px -20% 0px" }).observe($("#contato"));
  } else {
    passouAbertura = true;
  }
  atualizarFlutuante();

  // ---------- Formulário ----------
  var form = $("[data-form]");
  var resultado = $("[data-form-resultado]");
  var alerta = $("[data-form-alerta]");
  var botaoEnviar = $("[data-form-enviar]");
  var endpoint = texto((cfg.formulario || {}).endpoint);
  var tentouEnviar = false;

  var regras = {
    nome: function (v) { return v.length >= 2 ? "" : "Informe seu nome."; },
    cidade: function (v) { return v.length >= 2 ? "" : "Informe a cidade."; },
    uf: function (v) { return v ? "" : "Selecione o estado."; },
    telefone: function (v) {
      var d = v.replace(/\D/g, "");
      return d.length === 10 || d.length === 11 ? "" : "Informe um telefone com DDD, por exemplo (45) 99999-9999.";
    },
    operacao: function (v) { return v ? "" : "Selecione o tipo de operação."; },
    necessidade: function (v) { return v ? "" : "Selecione a necessidade principal."; }
  };

  function validarCampo(campo) {
    var msg = regras[campo.name] ? regras[campo.name](texto(campo.value)) : "";
    var erro = document.getElementById(campo.id + "-erro");
    campo.setAttribute("aria-invalid", msg ? "true" : "false");
    if (erro) erro.textContent = msg;
    return !msg;
  }

  // Máscara de telefone: (00) 00000-0000 ou (00) 0000-0000.
  var campoFone = form.elements.telefone;
  campoFone.addEventListener("input", function () {
    var d = campoFone.value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
    var f = d;
    if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) f = "(" + d.slice(0, 2) + ") " + (d.length === 11 ? d.slice(2, 7) + "-" + d.slice(7) : d.slice(2, 6) + "-" + d.slice(6));
    campoFone.value = f;
  });

  Object.keys(regras).forEach(function (nomeCampo) {
    var campo = form.elements[nomeCampo];
    campo.addEventListener("blur", function () { if (tentouEnviar) validarCampo(campo); });
    campo.addEventListener(campo.tagName === "SELECT" ? "change" : "input", function () {
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  function dadosDoFormulario() {
    var d = {};
    ["nome", "empresa", "cidade", "uf", "telefone", "operacao", "necessidade", "mensagem"].forEach(function (k) {
      d[k] = texto(form.elements[k].value);
    });
    return d;
  }

  function mensagemWhatsAppDoFormulario(d) {
    var linhas = [
      "Olá! Gostaria de solicitar uma avaliação técnica.",
      "",
      "Nome: " + d.nome
    ];
    if (d.empresa) linhas.push("Empresa ou propriedade: " + d.empresa);
    linhas.push("Cidade: " + d.cidade + "/" + d.uf);
    linhas.push("Telefone: " + d.telefone);
    linhas.push("Tipo de operação: " + d.operacao);
    linhas.push("Necessidade: " + d.necessidade);
    if (d.mensagem) linhas.push("", d.mensagem);
    return linhas.join("\n");
  }

  function mostrarResultado(montar) {
    resultado.replaceChildren();
    montar(resultado);
    form.hidden = true;
    resultado.hidden = false;
    resultado.focus({ preventScroll: true });
    var topoPainel = resultado.parentNode.getBoundingClientRect().top;
    if (topoPainel < 0 || topoPainel > window.innerHeight * 0.6) {
      resultado.parentNode.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
    }
  }

  function voltarAoFormulario(limpar) {
    if (limpar) form.reset();
    resultado.hidden = true;
    form.hidden = false;
    form.elements.nome.focus();
  }

  function botaoVoltar(rotulo, limpar) {
    var b = criar("button", "form__voltar", rotulo);
    b.type = "button";
    b.addEventListener("click", function () { voltarAoFormulario(limpar); });
    return b;
  }

  function mostrarAlerta(mensagem, comWhatsApp) {
    alerta.replaceChildren(document.createTextNode(mensagem));
    if (comWhatsApp) {
      alerta.appendChild(document.createTextNode(" "));
      var a = criar("a", "", "fale com a nossa equipe pelo WhatsApp");
      prepararWhatsApp(a);
      a.addEventListener("click", function () { registrar("contato_whatsapp", { local: "erro_formulario" }); });
      alerta.appendChild(a);
      alerta.appendChild(document.createTextNode("."));
    }
    alerta.hidden = false;
  }

  function enviando(ativo) {
    botaoEnviar.disabled = ativo;
    botaoEnviar.textContent = ativo ? "Enviando..." : "Enviar solicitação";
    form.setAttribute("aria-busy", String(ativo));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    tentouEnviar = true;
    alerta.hidden = true;

    var invalidos = Object.keys(regras).map(function (k) { return form.elements[k]; }).filter(function (c) { return !validarCampo(c); });
    if (invalidos.length) {
      mostrarAlerta(invalidos.length === 1 ? "Revise o campo destacado." : "Revise os " + invalidos.length + " campos destacados.");
      invalidos[0].focus();
      registrar("formulario_invalido", { campos: invalidos.length });
      return;
    }

    // Robôs costumam preencher o campo invisível; nesse caso nada é enviado.
    if (texto(form.elements.site.value)) return;

    var dados = dadosDoFormulario();

    // Sem integração configurada: a pessoa conclui o envio pelo WhatsApp.
    if (!endpoint) {
      mostrarResultado(function (r) {
        r.appendChild(criar("h3", "", "Falta só um passo"));
        r.appendChild(criar("p", "", "Sua solicitação está pronta. Para enviá-la à nossa equipe, abra o WhatsApp: a mensagem já vem preenchida para você revisar antes de enviar."));
        var a = criar("a", "botao botao--primario botao--grande");
        a.appendChild(document.createTextNode("Enviar pelo WhatsApp"));
        prepararWhatsApp(a, mensagemWhatsAppDoFormulario(dados));
        a.addEventListener("click", function () {
          registrar("generate_lead", { metodo: "whatsapp", operacao: dados.operacao, necessidade: dados.necessidade });
        });
        r.appendChild(a);
        r.appendChild(criar("p", "form__privacidade", "A conversa acontece no WhatsApp e segue também a política de privacidade do aplicativo."));
        r.appendChild(botaoVoltar("Corrigir informações", false));
      });
      return;
    }

    enviando(true);
    var controle = "AbortController" in window ? new AbortController() : null;
    var limite = setTimeout(function () { if (controle) controle.abort(); }, 15000);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.assign({ assunto: "Solicitação de avaliação técnica", pagina: location.origin + location.pathname }, dados)),
      signal: controle ? controle.signal : undefined
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      registrar("generate_lead", { metodo: "formulario", operacao: dados.operacao, necessidade: dados.necessidade });
      mostrarResultado(function (r) {
        r.appendChild(criar("h3", "", "Solicitação enviada"));
        r.appendChild(criar("p", "", "Recebemos suas informações. Nossa equipe entrará em contato pelo telefone informado para entender a necessidade e orientar os próximos passos."));
        r.appendChild(botaoVoltar("Enviar outra solicitação", true));
      });
      form.reset();
      tentouEnviar = false;
    }).catch(function () {
      registrar("formulario_erro_envio");
      mostrarAlerta("Não foi possível enviar sua solicitação agora. Verifique a conexão e tente novamente ou", true);
      alerta.focus();
    }).then(function () {
      clearTimeout(limite);
      enviando(false);
    });
  });
})();
