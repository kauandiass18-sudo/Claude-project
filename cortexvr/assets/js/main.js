/* =====================================================================
   CORTEX.VR — interações
   Os dados vêm de assets/js/config.js (window.SITE).
   ===================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  function escapar(texto) {
    return String(texto == null ? '' : texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- WhatsApp ----------
     Todos os links usam o mesmo número de SITE.whatsapp.
     A conversa só abre quando o visitante toca no botão. */
  var numero = String(SITE.whatsapp || '').replace(/\D/g, '');
  if (!numero) {
    console.warn('[CORTEX.VR] PENDENTE: informe o número do WhatsApp em assets/js/config.js (campo "whatsapp").');
  }

  function linkWhatsApp(mensagem) {
    var texto = encodeURIComponent(mensagem || (SITE.mensagens && SITE.mensagens.geral) || '');
    return 'https://wa.me/' + numero + (texto ? '?text=' + texto : '');
  }

  function aplicarWhatsApp(raiz) {
    $$('[data-wa]', raiz).forEach(function (el) {
      var chave = el.getAttribute('data-wa');
      var mensagem = el.getAttribute('data-wa-texto') || (SITE.mensagens && SITE.mensagens[chave]);
      el.href = linkWhatsApp(mensagem);
    });
  }

  /* ---------- Formatação ---------- */
  function preco(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function numeroAnimado(item) {
    return (item.prefixo ? escapar(item.prefixo) : '') +
      '<span data-contar="' + Number(item.valor) + '">' + Number(item.valor) + '</span>' +
      (item.sufixo ? '<small>' + escapar(item.sufixo) + '</small>' : '');
  }

  /* ---------- Indicadores ---------- */
  function montarIndicadores() {
    var lista = $('[data-indicadores]');
    var itens = SITE.indicadores || [];
    if (!lista) return;
    if (!itens.length) { lista.closest('section').hidden = true; return; }
    lista.style.setProperty('--colunas', itens.length);
    lista.innerHTML = itens.map(function (item, i) {
      return '<li class="indicador revelar" style="--d:' + i + '">' +
        '<span class="indicador__valor">' + numeroAnimado(item) + '</span>' +
        '<span class="indicador__rotulo">' + escapar(item.rotulo) + '</span></li>';
    }).join('');
    var nota = $('[data-nota-indicadores]');
    if (nota) nota.textContent = SITE.notaIndicadores || '';
  }

  /* ---------- Planos e avulsos ---------- */
  function montarPlanos() {
    var grade = $('[data-planos]');
    if (grade) {
      grade.innerHTML = (SITE.planos || []).map(function (p, i) {
        return '<article class="plano revelar' + (p.destaque ? ' plano--destaque' : '') + '" style="--d:' + i + '">' +
          (p.destaque && p.selo ? '<span class="plano__selo">' + escapar(p.selo) + '</span>' : '') +
          '<h3 class="plano__nome">' + escapar(p.nome) + '</h3>' +
          '<p class="plano__indicacao">' + escapar(p.indicacao) + '</p>' +
          '<p class="plano__preco"><span class="plano__moeda">R$</span>' +
            '<span class="plano__valor">' + preco(p.preco) + '</span>' +
            '<span class="plano__periodo">' + escapar(p.periodo || '') + '</span></p>' +
          '<ul class="plano__itens">' + (p.itens || []).map(function (t) {
            return '<li><svg aria-hidden="true"><use href="#i-check"/></svg>' + escapar(t) + '</li>';
          }).join('') + '</ul>' +
          '<a class="btn btn--bloco ' + (p.destaque ? 'btn--primario' : 'btn--contorno') + '" data-wa="plano" data-wa-texto="' + escapar(p.mensagem) + '" target="_blank" rel="noopener">' +
            escapar(p.botao || 'Quero este plano') + '</a>' +
        '</article>';
      }).join('');
    }

    var avulsos = $('[data-avulsos]');
    if (avulsos) {
      var itens = SITE.avulsos || [];
      if (!itens.length) avulsos.closest('.avulsos').hidden = true;
      avulsos.innerHTML = itens.map(function (a) {
        return '<li class="avulso"><a data-wa="avulso" data-wa-texto="' + escapar(a.mensagem) + '" target="_blank" rel="noopener" ' +
          'aria-label="' + escapar(a.nome + ': ' + (a.aPartirDe ? 'a partir de ' : '') + 'R$ ' + preco(a.preco) + '. Solicitar pelo WhatsApp') + '">' +
          '<span class="avulso__nome">' + escapar(a.nome) + '</span>' +
          '<span class="avulso__preco">' + (a.aPartirDe ? '<small>a partir de</small>' : '') + 'R$ ' + preco(a.preco) + '</span>' +
          '<svg aria-hidden="true"><use href="#i-seta"/></svg></a></li>';
      }).join('');
    }

    var nota = $('[data-nota-planos]');
    if (nota) nota.textContent = SITE.notaPlanos || '';
  }

  /* ---------- Fundador ---------- */
  function montarFundador() {
    var f = SITE.fundador || {};
    var nome = $('[data-fundador-nome]'), cargo = $('[data-fundador-cargo]'), frase = $('[data-fundador-frase]');
    if (nome) nome.textContent = f.nome || '';
    if (cargo) cargo.textContent = f.cargo || '';
    if (frase) frase.textContent = f.frase || '';
    var retrato = $('[data-fundador-retrato]');
    if (retrato && f.foto) {
      retrato.innerHTML = '<img src="' + escapar(f.foto) + '" alt="' + escapar((f.nome || '') + ', ' + (f.cargo || '')) + '" loading="lazy" decoding="async">';
    }
  }

  /* ---------- Vídeo no celular do topo ---------- */
  function montarVideoTopo() {
    var tela = $('[data-video-topo]');
    var v = SITE.videoTopo || {};
    if (!tela || !v.arquivo) return;
    var video = document.createElement('video');
    video.className = 'celular__video';
    video.src = v.arquivo;
    if (v.capa) video.poster = v.capa;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'metadata';
    video.setAttribute('aria-label', 'Vídeo de exemplo da CORTEX.VR');
    tela.insertBefore(video, tela.firstChild);
    tela.classList.add('tem-video');
    // Com "reduzir movimento" ativado, o vídeo não começa sozinho
    if (!reduzMovimento) {
      var tocar = video.play();
      if (tocar && tocar.catch) tocar.catch(function () {});
    }

    var som = $('[data-video-som]', tela);
    som.hidden = false;
    som.addEventListener('click', function () {
      var ligar = video.muted;
      video.muted = !ligar;
      if (ligar && video.paused) video.play();
      som.setAttribute('aria-pressed', String(ligar));
      som.setAttribute('aria-label', ligar ? 'Desativar som do vídeo' : 'Ativar som do vídeo');
    });
  }

  /* ---------- Depoimentos ---------- */
  function montarDepoimentos() {
    var area = $('[data-depoimentos]');
    var itens = SITE.depoimentos || [];
    if (!area) return;
    if (!itens.length) { area.closest('section').hidden = true; esconderLinksPara('#feedbacks'); return; }
    if (itens.length > 1) area.classList.add('depoimentos--varios');
    area.innerHTML = itens.map(function (d, i) {
      var iniciais = String(d.nome || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
      var cargo = [d.cargo, d.empresa].filter(Boolean).join(' — ');
      return '<figure class="depoimento revelar" style="--d:' + i + '">' +
        '<svg class="depoimento__aspas" viewBox="0 0 44 44" aria-hidden="true"><path fill="currentColor" d="M18 10C9.7 12.6 5 18.6 5 27v7h13V21h-6.5c.6-3.6 2.9-6.2 7.4-7.8L18 10Zm21 0c-8.3 2.6-13 8.6-13 17v7h13V21h-6.5c.6-3.6 2.9-6.2 7.4-7.8L39 10Z"/></svg>' +
        '<blockquote class="depoimento__texto"><p>' + escapar(d.texto) + '</p></blockquote>' +
        '<figcaption class="depoimento__autor">' +
          '<span class="depoimento__avatar" aria-hidden="true">' + (d.foto ? '<img src="' + escapar(d.foto) + '" alt="" loading="lazy">' : escapar(iniciais)) + '</span>' +
          '<span><span class="depoimento__nome">' + escapar(d.nome) + '</span>' +
          '<span class="depoimento__cargo">' + escapar(cargo) + '</span></span>' +
          (d.parceiroVerificado ? '<span class="depoimento__verificado">Parceiro verificado</span>' : '') +
        '</figcaption></figure>';
    }).join('');
  }

  function esconderLinksPara(href) {
    $$('a[href="' + href + '"]').forEach(function (a) { var li = a.closest('li'); (li || a).hidden = true; });
  }

  /* ---------- Mostruário ---------- */
  var NOMES_CATEGORIA = { videos: 'Vídeo', artes: 'Arte digital', logos: 'Logo', produtos: 'Publicidade de produto' };

  function montarGaleria() {
    var galeria = $('[data-galeria]');
    var itens = SITE.portfolio || [];
    if (!galeria) return;
    if (!itens.length) { galeria.closest('section').hidden = true; return; }

    galeria.innerHTML = itens.map(function (p, i) {
      var classe = 'peca revelar' + (p.formato ? ' peca--' + p.formato : '');
      return '<li class="' + classe + '" data-categoria="' + escapar(p.categoria) + '" style="--d:' + (i % 4) + '">' +
        '<button type="button" class="peca__botao" data-peca="' + i + '" aria-label="Ampliar: ' + escapar(p.titulo) + (p.conceito ? ' (demonstração conceitual)' : '') + '">' +
          (p.imagem
            ? '<img src="' + escapar(p.imagem) + '" alt="" loading="lazy" decoding="async">'
            : '<video src="' + escapar(p.video) + '#t=0.1" muted playsinline preload="metadata" aria-hidden="true"></video>') +
          (p.video ? '<span class="peca__play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>' : '') +
          (p.conceito ? '<span class="etiqueta-conceito" title="Demonstração conceitual">Conceito</span>' : '') +
          '<span class="peca__info"><span><span class="peca__titulo">' + escapar(p.titulo) + '</span>' +
            '<span class="peca__categoria">' + escapar(NOMES_CATEGORIA[p.categoria] || '') + '</span></span>' +
            '<span class="peca__seta" aria-hidden="true"><svg><use href="#i-seta"/></svg></span></span>' +
        '</button></li>';
    }).join('');

    var aviso = $('[data-aviso-conceito]');
    if (aviso) aviso.hidden = !itens.some(function (p) { return p.conceito; });

    // Esconde filtros sem peças
    $$('[data-filtro]').forEach(function (b) {
      var cat = b.getAttribute('data-filtro');
      if (cat !== 'todos' && !itens.some(function (p) { return p.categoria === cat; })) b.hidden = true;
    });

    $('[data-filtros]').addEventListener('click', function (e) {
      var botao = e.target.closest('[data-filtro]');
      if (!botao) return;
      var cat = botao.getAttribute('data-filtro');
      $$('[data-filtro]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === botao)); });
      $$('.peca', galeria).forEach(function (el) {
        var mostra = cat === 'todos' || el.getAttribute('data-categoria') === cat;
        el.classList.toggle('is-oculta', !mostra);
        if (mostra) el.classList.add('is-visivel');
      });
    });

    galeria.addEventListener('click', function (e) {
      var botao = e.target.closest('[data-peca]');
      if (botao) abrirVisualizador(itens[Number(botao.getAttribute('data-peca'))], botao);
    });
  }

  /* ---------- Visualizador ---------- */
  var visualizador = $('[data-visualizador]');
  var origemFoco = null;

  function abrirVisualizador(p, origem) {
    if (!visualizador || !p) return;
    origemFoco = origem;
    var midia = $('[data-visualizador-midia]', visualizador);
    if (p.video) {
      midia.innerHTML = '<video controls playsinline preload="metadata"' + (p.imagem ? ' poster="' + escapar(p.imagem) + '"' : '') + '>' +
        '<source src="' + escapar(p.video) + '"></video>';
    } else {
      midia.innerHTML = '<img src="' + escapar(p.imagem) + '" alt="' + escapar(p.titulo + (p.conceito ? ' — demonstração conceitual' : '')) + '">';
    }
    $('[data-visualizador-categoria]', visualizador).textContent = NOMES_CATEGORIA[p.categoria] || '';
    $('[data-visualizador-titulo]', visualizador).textContent = p.titulo || '';
    $('[data-visualizador-descricao]', visualizador).textContent = p.descricao || '';
    $('[data-visualizador-conceito]', visualizador).hidden = !p.conceito;

    if (typeof visualizador.showModal === 'function') visualizador.showModal();
    else visualizador.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
  }

  function fecharVisualizador() {
    if (!visualizador) return;
    if (typeof visualizador.close === 'function' && visualizador.open) visualizador.close();
    else visualizador.removeAttribute('open');
  }

  if (visualizador) {
    visualizador.addEventListener('close', function () {
      var video = $('video', visualizador);
      if (video) video.pause();
      $('[data-visualizador-midia]', visualizador).innerHTML = '';
      document.documentElement.style.overflow = '';
      if (origemFoco) origemFoco.focus();
    });
    $('[data-visualizador-fechar]', visualizador).addEventListener('click', fecharVisualizador);
    visualizador.addEventListener('click', function (e) { if (e.target === visualizador) fecharVisualizador(); });
  }

  /* ---------- Cabeçalho e menu ---------- */
  var header = $('[data-header]');
  var menuBotao = $('[data-menu-botao]');
  var flutuante = $('[data-wa-flutuante]');
  var hero = $('.hero');

  function aoRolar() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-rolado', y > 24);
    if (flutuante && hero) flutuante.classList.toggle('is-visivel', y > hero.offsetHeight * .7);
  }

  function alternarMenu(abrir) {
    var aberto = typeof abrir === 'boolean' ? abrir : !document.body.classList.contains('menu-aberto');
    document.body.classList.toggle('menu-aberto', aberto);
    menuBotao.setAttribute('aria-expanded', String(aberto));
    menuBotao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  if (menuBotao) {
    menuBotao.addEventListener('click', function () { alternarMenu(); });
    $$('[data-menu] a').forEach(function (a) { a.addEventListener('click', function () { alternarMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-aberto')) { alternarMenu(false); menuBotao.focus(); }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) alternarMenu(false); });
  }

  // Link ativo conforme a seção visível
  function observarSecoes() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('[data-nav]');
    var mapa = {};
    links.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-ativo'); });
        var link = mapa[en.target.id];
        if (link) link.classList.add('is-ativo');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapa).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* ---------- Revelar e contadores ---------- */
  function contar(el) {
    var alvo = Number(el.getAttribute('data-contar'));
    if (reduzMovimento || !alvo) return;
    var inicio = null, duracao = 1400;
    function passo(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / duracao, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    }
    el.textContent = '0';
    requestAnimationFrame(passo);
  }

  function revelar() {
    var elementos = $$('.revelar');
    if (!('IntersectionObserver' in window) || reduzMovimento) {
      elementos.forEach(function (el) { el.classList.add('is-visivel'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visivel');
        $$('[data-contar]', en.target).forEach(contar);
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    elementos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Brilho que acompanha o cursor nos cards ---------- */
  function brilho() {
    $$('[data-brilho]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Rodapé e metadados ---------- */
  function rodape() {
    var ano = $('[data-ano]');
    if (ano) ano.textContent = new Date().getFullYear();
    var ig = $('[data-instagram]');
    if (ig && SITE.instagram) {
      ig.href = SITE.instagram;
      $('[data-instagram-item]').hidden = false;
    }
    var canonico = $('link[rel="canonical"]');
    if (canonico) {
      if (SITE.dominio) canonico.href = SITE.dominio;
      else canonico.remove();
    }
  }

  /* ---------- Início ---------- */
  montarIndicadores();
  montarPlanos();
  montarFundador();
  montarVideoTopo();
  montarDepoimentos();
  montarGaleria();
  aplicarWhatsApp(document);
  rodape();
  revelar();
  brilho();
  observarSecoes();
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });
})();
