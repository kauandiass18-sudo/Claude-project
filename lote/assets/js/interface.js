/* =============================================================
   INTERFACE COMPARTILHADA
   Cabeçalho, rodapé, busca, menus, diálogos, cards de produto,
   revelação ao rolar e avisos. Usada por todas as páginas públicas.
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var T = M.textos || {};
  var h = V.h;
  var cat = V.catalogo();

  // ---------------------------------------------------------------
  // Utilidades de página
  // ---------------------------------------------------------------
  var arquivoAtual = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function ehPaginaAtual(href) {
    if (!href) return false;
    var arq = href.split(/[?#]/)[0].split('/').pop().toLowerCase() || 'index.html';
    return arq === arquivoAtual;
  }

  V.anoAtual = new Date().getFullYear();

  /** Marca da loja: texto com ponto de destaque ou imagem configurada. */
  V.marca = function (classe) {
    var logo = M.logotipo || {};
    var nome = M.nome || 'Vitrine';
    var link = h('a', { class: classe || 'marca', href: V.url.pagina('index.html'), 'aria-label': nome + ', página inicial' });
    if (logo.tipo === 'imagem' && logo.src) {
      link.appendChild(h('img', { src: V.resolver(logo.src), alt: nome, width: logo.largura || 120, height: logo.altura || 32 }));
    } else {
      link.appendChild(h('span', null, nome));
      if (M.complemento) link.appendChild(h('span', { class: 'marca__complemento', 'aria-hidden': 'true' }, M.complemento));
    }
    return link;
  };

  /** Código curto da peça: o informado no cadastro ou a posição no catálogo. */
  V.codigo = function (p) { return p.codigo || 'Nº ' + String(p.ordem + 1).padStart(3, '0'); };

  /** Bolinhas de cor (até 5). */
  V.amostras = function (p, max) {
    var cores = p.cores.filter(function (c) { return c.hex; });
    if (!cores.length) return null;
    max = max || 5;
    var el = h('span', { class: 'amostras', role: 'img', 'aria-label': (cores.length === 1 ? 'Cor: ' : 'Cores: ') + cores.map(function (c) { return c.nome; }).join(', ') });
    cores.slice(0, max).forEach(function (c) { el.appendChild(h('span', { class: 'amostra', style: { '--amostra': c.hex } })); });
    if (cores.length > max) el.appendChild(h('span', { class: 'mono', style: { color: 'var(--cor-tinta-3)' } }, '+' + (cores.length - max)));
    return el;
  };

  // ---------------------------------------------------------------
  // Elementos decorativos: anotação de marcador, fita, selo
  // ---------------------------------------------------------------
  var SETAS = {
    direita: 'M3 18 C 14 6, 28 4, 42 14 M34 6 L43 14 L33 20',
    baixo: 'M8 3 C 2 12, 10 22, 26 26 M18 20 L27 26 L19 30',
    esquerda: 'M43 18 C 32 6, 18 4, 4 14 M12 6 L3 14 L13 20'
  };
  /** Anotação em letra de marcador com seta desenhada. Decorativa. */
  V.rabisco = function (texto, direcao, classe) {
    if (!texto) return null;
    var el = h('span', { class: 'rabisco' + (classe ? ' ' + classe : ''), 'aria-hidden': 'true' });
    var seta = '<svg viewBox="0 0 46 32" aria-hidden="true" focusable="false"><path d="' + (SETAS[direcao] || SETAS.direita) + '"/></svg>';
    if (direcao === 'esquerda') { el.insertAdjacentHTML('beforeend', seta); el.appendChild(document.createTextNode(texto)); }
    else { el.appendChild(document.createTextNode(texto)); el.insertAdjacentHTML('beforeend', seta); }
    return el;
  };
  V.fitas = function () {
    return [h('span', { class: 'fita fita--a', 'aria-hidden': 'true' }), h('span', { class: 'fita fita--b', 'aria-hidden': 'true' })];
  };
  /** Selo redondo com texto em volta, girando. */
  V.selo = function (texto, centro) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    var id = 'circulo-' + Math.random().toString(36).slice(2, 8);
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('id', id);
    path.setAttribute('d', 'M50 50 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0');
    path.setAttribute('fill', 'none');
    var text = document.createElementNS(ns, 'text');
    var tp = document.createElementNS(ns, 'textPath');
    tp.setAttribute('href', '#' + id);
    tp.textContent = texto.length < 24 ? texto + ' ' + texto : texto;
    tp.setAttribute('textLength', '248');
    tp.setAttribute('lengthAdjust', 'spacing');
    text.appendChild(tp);
    svg.appendChild(path);
    svg.appendChild(text);
    return h('span', { class: 'selo', 'aria-hidden': 'true' }, [svg, h('span', { class: 'selo__centro' }, centro || '')]);
  };
  // ---------------------------------------------------------------
  // Pixo: alfabeto de traços altos e angulosos, desenhado em SVG.
  // Cada letra ocupa 10 × 30 unidades; os traços são linhas retas.
  // ---------------------------------------------------------------
  var PIXO = {
    A: [[[0, 30], [5, 0], [10, 30]], [[1, 18], [9, 17]]],
    B: [[[0, 31], [0, 0], [9, 4], [1, 14], [10, 20], [0, 30]]],
    C: [[[10, 2], [0, 0], [0, 30], [11, 28]]],
    D: [[[0, 0], [0, 31], [10, 25], [10, 6], [0, 0]]],
    E: [[[11, 0], [0, 2], [0, 30], [11, 28]], [[0, 15], [8, 13]]],
    F: [[[11, 0], [0, 2], [0, 32]], [[0, 15], [8, 13]]],
    G: [[[10, 2], [0, 0], [0, 30], [10, 30], [10, 16], [4, 17]]],
    H: [[[0, -1], [0, 31]], [[10, -1], [10, 31]], [[0, 16], [10, 14]]],
    I: [[[5, -2], [5, 32]]],
    J: [[[10, -1], [10, 30], [0, 26]]],
    K: [[[0, -1], [0, 31]], [[10, 0], [0, 16], [11, 31]]],
    L: [[[0, -3], [0, 30], [12, 30]]],
    M: [[[0, 31], [0, 0], [5, 15], [10, 0], [10, 31]]],
    N: [[[0, 31], [0, 0], [10, 30], [10, -1]]],
    O: [[[5, 0], [0, 4], [0, 26], [5, 30], [10, 26], [10, 4], [5, 0]]],
    P: [[[0, 32], [0, 0], [10, 4], [10, 12], [0, 16]]],
    Q: [[[5, 0], [0, 4], [0, 26], [5, 30], [10, 26], [10, 4], [5, 0]], [[6, 24], [12, 32]]],
    R: [[[0, 32], [0, 0], [10, 4], [10, 12], [1, 16], [11, 31]]],
    S: [[[11, 2], [0, 0], [0, 14], [10, 16], [10, 30], [-1, 28]]],
    T: [[[-2, 2], [12, 0]], [[5, 0], [5, 32]]],
    U: [[[0, -1], [0, 30], [10, 30], [10, -1]]],
    V: [[[0, -1], [5, 31], [10, -1]]],
    W: [[[0, -1], [2, 31], [5, 14], [8, 31], [10, -1]]],
    X: [[[0, -1], [10, 31]], [[10, -1], [0, 31]]],
    Y: [[[0, -1], [5, 14], [10, -1]], [[5, 14], [5, 32]]],
    Z: [[[0, 2], [11, 0], [0, 30], [11, 28]]],
    '0': [[[5, 0], [0, 4], [0, 26], [5, 30], [10, 26], [10, 4], [5, 0]], [[0, 26], [10, 4]]],
    '1': [[[2, 6], [6, 0], [6, 31]]],
    '2': [[[0, 3], [10, 0], [10, 12], [0, 30], [11, 29]]],
    '3': [[[0, 1], [10, 2], [3, 14], [10, 18], [10, 30], [0, 29]]],
    '4': [[[8, 32], [8, 0], [0, 20], [11, 20]]],
    '5': [[[11, 0], [0, 1], [0, 13], [10, 16], [10, 30], [0, 29]]],
    '6': [[[10, 0], [0, 4], [0, 30], [10, 30], [10, 16], [0, 15]]],
    '7': [[[0, 1], [11, 0], [3, 32]]],
    '8': [[[5, 0], [0, 3], [0, 13], [10, 17], [10, 30], [0, 30], [0, 17], [10, 13], [10, 3], [5, 0]]],
    '9': [[[10, 14], [0, 15], [0, 0], [10, 0], [10, 30], [0, 28]]]
  };
  /**
   * Desenha um texto em pixo. opcoes: { traco, inclinacao, sublinhado, semente, cor }
   * Devolve um <svg> decorativo (aria-hidden).
   */
  V.pixo = function (texto, opcoes) {
    opcoes = opcoes || {};
    var semente = opcoes.semente || 7;
    function aleatorio() { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; }
    var letras = V.semAcentos(texto).toUpperCase().split('');
    var x = 0, linhas = [];
    letras.forEach(function (c) {
      if (c === ' ') { x += 10; return; }
      var g = PIXO[c];
      if (!g) return;
      var alt = 1 + (aleatorio() - .5) * 0.12;
      g.forEach(function (traco) {
        linhas.push(traco.map(function (pt) {
          return [(x + pt[0] + (aleatorio() - .5) * 1.1).toFixed(1), (pt[1] * alt + (aleatorio() - .5) * 1.1).toFixed(1)].join(',');
        }).join(' '));
      });
      x += 16;
    });
    var largura = Math.max(10, x - 6);
    if (opcoes.sublinhado !== false) {
      linhas.push([[-3, 35], [largura * 0.55, 34.2], [largura + 5, 36.5]].map(function (p) { return p.join(','); }).join(' '));
      linhas.push([[largura + 1, 33], [largura + 6, 36.5], [largura + 1, 40]].map(function (p) { return p.join(','); }).join(' '));
    }
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '-6 -6 ' + (largura + 16) + ' 50');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'pixo' + (opcoes.classe ? ' ' + opcoes.classe : ''));
    var g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', 'skewX(' + (opcoes.inclinacao === undefined ? -8 : opcoes.inclinacao) + ')');
    linhas.forEach(function (pts, i) {
      var l = document.createElementNS(ns, 'polyline');
      l.setAttribute('points', pts);
      l.setAttribute('style', '--i:' + i);
      g.appendChild(l);
    });
    g.setAttribute('stroke-width', String(opcoes.traco || 2.4));
    svg.appendChild(g);
    return svg;
  };

  /** Escorridos de tinta sob um elemento (decorativo). */
  V.escorrer = function (alvo, opcoes) {
    if (!alvo) return;
    opcoes = opcoes || {};
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'escorridos');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 100 40');
    svg.setAttribute('preserveAspectRatio', 'none');
    var semente = opcoes.semente || 3;
    function aleatorio() { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; }
    var n = opcoes.quantidade || 7;
    for (var i = 0; i < n; i++) {
      var xx = 4 + (i + aleatorio() * .8) * (92 / n);
      var comp = 8 + aleatorio() * 30;
      var w = .5 + aleatorio() * .9;
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M' + (xx - w) + ' 0 L' + (xx - w * .6) + ' ' + comp + ' Q' + xx + ' ' + (comp + w * 2.2) + ' ' + (xx + w * .6) + ' ' + comp + ' L' + (xx + w) + ' 0 Z');
      p.setAttribute('style', '--d:' + (i * 90 + Math.round(aleatorio() * 300)) + 'ms');
      svg.appendChild(p);
    }
    alvo.appendChild(svg);
    return svg;
  };

  /** A peça entrou no catálogo há poucos dias? (usa a data cadastrada) */
  V.ehNovo = function (p) {
    var dias = T.diasNovo;
    if (!dias || !p.adicionadoEm) return false;
    var base = /^\d{4}-\d{2}-\d{2}/.test((window.CATALOGO || {}).atualizadoEm || '') ? new Date(window.CATALOGO.atualizadoEm + 'T12:00:00') : new Date();
    var d = (base - new Date(p.adicionadoEm + 'T12:00:00')) / 86400000;
    return d >= 0 && d <= dias;
  };

  /** Ajusta o tamanho da fonte para o texto ocupar exatamente a largura do pai. */
  V.ajustarLargura = function (el, minimo, fator) {
    if (!el) return;
    function medir() {
      el.style.fontSize = '100px';
      var largura = el.parentNode.clientWidth;
      var natural = el.getBoundingClientRect().width;
      if (natural > 0 && largura > 0) el.style.fontSize = Math.max(minimo || 24, Math.floor(100 * largura / natural * (fator || 0.97))) + 'px';
    }
    medir();
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(medir);
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', medir);
    }
    window.addEventListener('load', medir);
    var timer;
    window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(medir, 120); });
  };

  // ---------------------------------------------------------------
  // Aviso flutuante
  // ---------------------------------------------------------------
  var aviso, avisoTimer;
  V.avisar = function (mensagem) {
    if (!aviso) {
      aviso = h('div', { class: 'aviso-flutuante', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(aviso);
    }
    aviso.textContent = mensagem;
    aviso.classList.add('aviso-flutuante--visivel');
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { aviso.classList.remove('aviso-flutuante--visivel'); }, 2600);
  };

  // ---------------------------------------------------------------
  // Diálogos (<dialog> nativo com animação de entrada e saída)
  // ---------------------------------------------------------------
  var abertos = 0;
  V.dialogo = {
    abrir: function (dlg) {
      if (dlg.open) return;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      abertos++;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('aberto'); }); });
    },
    fechar: function (dlg) {
      if (!dlg.open || dlg.dataset.fechando) return;
      dlg.dataset.fechando = '1';
      dlg.classList.remove('aberto');
      var concluir = function () {
        delete dlg.dataset.fechando;
        if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
        abertos = Math.max(0, abertos - 1);
        if (!abertos) document.documentElement.style.overflow = '';
        dlg.dispatchEvent(new CustomEvent('fechado'));
      };
      if (V.movimentoReduzido()) concluir(); else setTimeout(concluir, 320);
    },
    preparar: function (dlg) {
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); V.dialogo.fechar(dlg); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) V.dialogo.fechar(dlg); });
      dlg.querySelectorAll('[data-fechar]').forEach(function (b) {
        b.addEventListener('click', function () { V.dialogo.fechar(dlg); });
      });
      return dlg;
    }
  };

  // ---------------------------------------------------------------
  // Fotos
  // ---------------------------------------------------------------
  V.semFoto = function (texto) {
    return h('div', { class: 'sem-foto', role: 'img', 'aria-label': texto || 'Foto indisponível' }, [
      V.icone('imagem'),
      h('span', null, texto || 'Foto indisponível')
    ]);
  };

  /**
   * <img> responsivo com carregamento suave e tratamento de erro.
   * opcoes: { classe, sizes, prioridade, alt, aoFalhar }
   */
  V.foto = function (imagem, opcoes) {
    opcoes = opcoes || {};
    var img = document.createElement('img');
    img.className = 'foto' + (opcoes.classe ? ' ' + opcoes.classe : '');
    img.alt = opcoes.alt !== undefined ? opcoes.alt : imagem.alt;
    img.decoding = 'async';
    if (opcoes.prioridade) { img.setAttribute('fetchpriority', 'high'); img.loading = 'eager'; }
    else img.loading = 'lazy';
    if (imagem.pequena && imagem.pequena !== imagem.src) {
      img.srcset = imagem.pequena + ' 600w, ' + imagem.src + ' 1200w';
      img.sizes = opcoes.sizes || '(min-width: 1100px) 24vw, (min-width: 640px) 32vw, 48vw';
    }
    img.addEventListener('load', function () { img.classList.add('carregada'); });
    img.addEventListener('error', function () {
      if (opcoes.aoFalhar) return opcoes.aoFalhar(img);
      var substituto = V.semFoto('Foto indisponível');
      if (img.parentNode) img.parentNode.replaceChild(substituto, img);
    });
    img.src = imagem.pequena && opcoes.preferirPequena ? imagem.pequena : imagem.src;
    if (img.complete && img.naturalWidth) img.classList.add('carregada');
    return img;
  };

  // ---------------------------------------------------------------
  // Preço
  // ---------------------------------------------------------------
  V.preco = function (p, compacto) {
    var el = h('p', { class: 'preco' });
    if (p.preco === null) {
      el.appendChild(h('span', { class: 'preco__consultar' }, compacto ? 'Preço na Shopee' : 'Preço na página da Shopee'));
      return el;
    }
    if (p.precoAnterior !== null) {
      el.appendChild(h('span', { class: 'sr-only' }, 'Preço atual:'));
    }
    el.appendChild(h('span', { class: 'preco__atual' }, V.formatarPreco(p.preco)));
    if (p.precoAnterior !== null) {
      el.appendChild(h('s', { class: 'preco__anterior' }, [h('span', { class: 'sr-only' }, 'Preço anterior:'), V.formatarPreco(p.precoAnterior)]));
      if (!compacto && p.desconto) el.appendChild(h('span', { class: 'preco__desconto' }, '−' + p.desconto + '%'));
    }
    return el;
  };

  // ---------------------------------------------------------------
  // Favoritos: botões sincronizados em toda a página
  // ---------------------------------------------------------------
  function rotuloFavorito(ativo, nome) {
    return (ativo ? 'Remover dos favoritos: ' : 'Salvar nos favoritos: ') + nome;
  }
  V.botaoFavorito = function (p, classe, comTexto) {
    var ativo = V.favoritos.tem(p.id);
    var b = h('button', {
      type: 'button',
      class: classe || 'cartao__favorito',
      'aria-pressed': String(ativo),
      'aria-label': rotuloFavorito(ativo, p.nome),
      dataset: { favId: p.id, favNome: p.nome }
    }, [V.icone('coracao', 'icone--coracao'), comTexto ? h('span', { 'data-fav-texto': '' }, ativo ? 'Salvo' : 'Salvar') : null]);
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var agora = V.favoritos.alternar(p.id);
      var ic = b.querySelector('.icone');
      if (ic && !V.movimentoReduzido()) { ic.classList.remove('pulsar'); void ic.offsetWidth; ic.classList.add('pulsar'); }
      V.avisar(agora ? 'Salvo nos favoritos' : 'Removido dos favoritos');
    });
    return b;
  };
  document.addEventListener('vitrine:favoritos', function (e) {
    var lista = V.favoritos.lista();
    document.querySelectorAll('[data-fav-id]').forEach(function (b) {
      var ativo = lista.indexOf(b.dataset.favId) !== -1;
      b.setAttribute('aria-pressed', String(ativo));
      b.setAttribute('aria-label', rotuloFavorito(ativo, b.dataset.favNome));
      var t = b.querySelector('[data-fav-texto]');
      if (t) t.textContent = ativo ? 'Salvo' : 'Salvar';
    });
    atualizarContadorFavoritos();
    if (e.detail && e.detail.salvo === false) V.avisar('Não foi possível salvar neste navegador');
  });

  // ---------------------------------------------------------------
  // Botão para a Shopee (ou estado sem link)
  // ---------------------------------------------------------------
  V.botaoShopee = function (p, opcoes) {
    opcoes = opcoes || {};
    if (V.temLinkAtivo(p)) {
      var texto = opcoes.texto || p.textoBotao || T.botaoProduto || 'Ver produto na Shopee';
      var a = h('a', {
        class: 'botao botao--destaque ' + (opcoes.classe || ''),
        href: p.link,
        target: '_blank',
        rel: 'sponsored noopener',
        'aria-label': texto + ': ' + p.nome + ' (abre em nova aba)',
        dataset: { afiliado: p.id }
      }, [h('span', null, texto), V.icone('externo', 'icone--externo')]);
      a.addEventListener('click', function () { V.registrarClique(p, opcoes.origem || 'pagina'); });
      return a;
    }
    var aviso = p.demo
      ? (opcoes.compacto ? 'Exemplo, sem link' : 'Produto de exemplo, sem link de compra')
      : 'Link da Shopee em atualização';
    return h('span', { class: opcoes.classeIndisponivel || 'cartao__indisponivel', role: 'note' }, aviso);
  };

  /** Indicação visível só no navegador do administrador. */
  V.avisoAdmin = function (p) {
    if (!V.ehAdmin() || p.demo) return null;
    var problemas = p.problemas.filter(function (x) { return /link|foto/i.test(x); });
    if (!problemas.length) return null;
    return h('p', { class: 'aviso-admin' }, [
      V.icone('alerta'),
      h('span', null, [
        'Administração: ' + problemas.join(', ').toLowerCase() + '. ',
        h('a', { href: V.url.pagina('admin/#produto=' + encodeURIComponent(p.id)) }, 'Corrigir cadastro')
      ])
    ]);
  };

  // ---------------------------------------------------------------
  // Card de produto
  // ---------------------------------------------------------------
  V.cartao = function (p, opcoes) {
    opcoes = opcoes || {};
    var temAlternativa = p.imagens.length > 1;
    var classes = 'cartao' + (opcoes.revelar === false ? '' : ' revelar') +
      (temAlternativa ? ' cartao--com-alternativa' : '') +
      (p.disponibilidade === 'esgotado' ? ' cartao--esgotado' : '');
    var tagTitulo = opcoes.tituloTag || 'h3';

    var midia = h('div', { class: 'cartao__midia' });
    if (p.imagens.length) {
      midia.appendChild(V.foto(p.imagens[0], { classe: 'foto--principal', sizes: opcoes.sizes, prioridade: opcoes.prioridade, alt: p.imagens[0].alt }));
      if (temAlternativa) {
        var alt = V.foto(p.imagens[1], { classe: 'foto--alternativa', sizes: opcoes.sizes, alt: '', aoFalhar: function (img) { img.remove(); } });
        alt.loading = 'lazy';
        midia.appendChild(alt);
      }
    } else {
      midia.appendChild(V.semFoto('Foto em breve'));
    }
    midia.appendChild(h('a', { class: 'cartao__midia-link', href: V.url.produto(p.id), tabindex: '-1', 'aria-hidden': 'true' }));
    midia.appendChild(h('span', { class: 'cartao__codigo', 'aria-hidden': 'true' }, V.codigo(p)));
    if (V.ehNovo(p) && p.disponibilidade !== 'esgotado') midia.appendChild(h('span', { class: 'adesivo-novo' }, 'novo!'));

    var etiquetas = [];
    if (p.demo) etiquetas.push(h('span', { class: 'etiqueta etiqueta--contorno' }, 'Exemplo'));
    if (p.disponibilidade === 'esgotado') etiquetas.push(h('span', { class: 'etiqueta' }, 'Esgotado'));
    else if (p.desconto) etiquetas.push(h('span', { class: 'etiqueta etiqueta--escura' }, [h('span', { 'aria-hidden': 'true' }, '−' + p.desconto + '%'), h('span', { class: 'sr-only' }, p.desconto + '% de desconto')]));
    if (etiquetas.length) midia.appendChild(h('div', { class: 'cartao__etiquetas' }, etiquetas));
    midia.appendChild(V.botaoFavorito(p));

    var meta = [opcoes.semCategoria ? null : p.categoria.nome, p.modelagem].filter(Boolean).join(' · ');
    var corpo = h('div', { class: 'cartao__corpo' }, [
      meta ? h('p', { class: 'cartao__meta mono' }, meta) : null,
      h(tagTitulo, { class: 'cartao__nome' }, h('a', { class: 'cartao__link', href: V.url.produto(p.id) }, p.nome)),
      h('div', { class: 'cartao__linha' }, [V.preco(p, true), V.amostras(p)]),
      p.tamanhos.length ? h('p', { class: 'cartao__tamanhos' }, [h('span', { class: 'sr-only' }, 'Tamanhos: '), p.tamanhos.join(' ')]) : null,
      h('div', { class: 'cartao__acao' }, V.botaoShopee(p, { classe: 'botao--compacto', compacto: true, texto: p.textoBotao || T.botaoCard || 'Ver na Shopee', origem: opcoes.origem || 'card' })),
      V.avisoAdmin(p)
    ]);

    var el = h('article', { class: classes, dataset: { produto: p.id } }, [midia, corpo]);
    if (opcoes.indice !== undefined) el.style.setProperty('--atraso', ((opcoes.indice % 4) * 80) + 'ms');
    return el;
  };

  // ---------------------------------------------------------------
  // Revelação ao rolar (uma vez por elemento)
  // ---------------------------------------------------------------
  var observador = null;
  if ('IntersectionObserver' in window) {
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revelado');
          observador.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  }
  V.revelar = function (raiz) {
    var els = (raiz || document).querySelectorAll('.revelar:not(.revelado)');
    els.forEach(function (el) {
      if (!observador || V.movimentoReduzido()) el.classList.add('revelado');
      else observador.observe(el);
    });
  };

  // ---------------------------------------------------------------
  // Compartilhar
  // ---------------------------------------------------------------
  V.compartilhar = function (dados) {
    if (navigator.share) {
      navigator.share(dados).catch(function () { /* cancelado pelo visitante */ });
      return;
    }
    var copiar = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(dados.url)
      : Promise.reject();
    copiar.then(function () { V.avisar('Link copiado'); })
      .catch(function () { window.prompt('Copie o link:', dados.url); });
  };

  // ---------------------------------------------------------------
  // Busca com sugestões (combobox acessível)
  // ---------------------------------------------------------------
  var contadorIds = 0;
  V.criarBusca = function (opcoes) {
    opcoes = opcoes || {};
    var id = 'busca-' + (++contadorIds);
    var input = h('input', {
      type: 'search',
      id: id,
      name: 'q',
      placeholder: opcoes.placeholder || 'Buscar produtos',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      enterkeyhint: 'search',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': 'false',
      'aria-controls': id + '-lista'
    });
    if (opcoes.valor) input.value = opcoes.valor;
    var limpar = h('button', { type: 'button', class: 'campo-busca__limpar', 'aria-label': 'Limpar busca', hidden: !opcoes.valor }, V.icone('fechar'));
    var lista = h('div', { class: 'sugestoes' + (opcoes.integrada ? ' sugestoes--integrada' : ''), id: id + '-lista', role: 'listbox', 'aria-label': 'Sugestões', hidden: true });
    var form = h('form', { class: 'campo-busca', role: 'search', action: V.url.pagina('catalogo.html'), method: 'get' }, [
      h('label', { class: 'sr-only', for: id }, opcoes.rotulo || 'Buscar produtos'),
      V.icone('busca'),
      input,
      limpar,
      opcoes.atalho ? h('kbd', { class: 'topo__atalho', 'aria-hidden': 'true' }, '/') : null
    ]);
    var ativo = -1;
    var opcoesAtuais = [];
    var timer;

    function definirAtivo(i) {
      opcoesAtuais.forEach(function (o, j) { o.setAttribute('aria-selected', String(j === i)); });
      ativo = i;
      if (i >= 0 && opcoesAtuais[i]) {
        input.setAttribute('aria-activedescendant', opcoesAtuais[i].id);
        opcoesAtuais[i].scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    }
    function fechar() {
      if (opcoes.integrada) return;
      lista.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      definirAtivo(-1);
    }
    function render() {
      var termo = input.value.trim();
      limpar.hidden = !input.value;
      lista.textContent = '';
      opcoesAtuais = [];
      ativo = -1;
      if (opcoes.aoDigitar) opcoes.aoDigitar(termo);
      if (!termo) {
        if (opcoes.vazio) { lista.appendChild(opcoes.vazio()); lista.hidden = false; }
        else fechar();
        return;
      }
      var resultados = V.buscar(cat.produtos, termo);
      resultados.slice(0, 6).forEach(function (p, i) {
        var foto = h('span', { class: 'sugestoes__foto' });
        if (p.imagens.length) foto.appendChild(h('img', { src: p.imagens[0].pequena || p.imagens[0].src, alt: '', loading: 'lazy', width: 52, height: 52 }));
        var item = h('a', { class: 'sugestoes__item', role: 'option', id: id + '-op-' + i, href: V.url.produto(p.id), 'aria-selected': 'false', tabindex: '-1' }, [
          foto,
          h('span', null, [
            h('span', { class: 'sugestoes__nome' }, p.nome),
            h('span', { class: 'sugestoes__meta' }, p.categoria.nome + (p.preco !== null ? ' · ' + V.formatarPreco(p.preco) : ''))
          ])
        ]);
        lista.appendChild(item);
        opcoesAtuais.push(item);
      });
      if (resultados.length) {
        var todos = h('a', { class: 'sugestoes__todos', role: 'option', id: id + '-todos', href: V.url.catalogo({ q: termo }), 'aria-selected': 'false', tabindex: '-1' }, [
          h('span', null, resultados.length === 1 ? 'Ver 1 resultado no catálogo' : 'Ver os ' + resultados.length + ' resultados no catálogo'),
          V.icone('seta')
        ]);
        lista.appendChild(todos);
        opcoesAtuais.push(todos);
      } else {
        lista.appendChild(h('p', { class: 'sugestoes__vazio', role: 'status' }, 'Nenhum produto encontrado para “' + termo + '”. Tente outro termo ou navegue pelas categorias.'));
      }
      lista.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(render, 60); });
    input.addEventListener('focus', function () { if (input.value.trim() || opcoes.vazio) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' && opcoesAtuais.length) { e.preventDefault(); definirAtivo((ativo + 1) % opcoesAtuais.length); }
      else if (e.key === 'ArrowUp' && opcoesAtuais.length) { e.preventDefault(); definirAtivo(ativo <= 0 ? opcoesAtuais.length - 1 : ativo - 1); }
      else if (e.key === 'Enter' && ativo >= 0 && opcoesAtuais[ativo]) { e.preventDefault(); location.href = opcoesAtuais[ativo].href; }
      else if (e.key === 'Escape') {
        if (!lista.hidden && !opcoes.integrada) { e.preventDefault(); e.stopPropagation(); fechar(); }
      }
    });
    input.addEventListener('blur', function () { setTimeout(function () { if (!form.contains(document.activeElement) && !lista.contains(document.activeElement)) fechar(); }, 150); });
    lista.addEventListener('mousedown', function (e) { e.preventDefault(); });
    limpar.addEventListener('click', function () { input.value = ''; render(); input.focus(); });
    form.addEventListener('submit', function (e) {
      var termo = input.value.trim();
      if (opcoes.aoEnviar) { e.preventDefault(); opcoes.aoEnviar(termo); fechar(); return; }
      if (!termo) { e.preventDefault(); input.focus(); return; }
      e.preventDefault();
      location.href = V.url.catalogo({ q: termo });
    });

    return { form: form, input: input, lista: lista, render: render, fechar: fechar };
  };

  // ---------------------------------------------------------------
  // Cabeçalho
  // ---------------------------------------------------------------
  var contadorFav;
  function atualizarContadorFavoritos() {
    if (!contadorFav) return;
    var validos = V.favoritos.lista().filter(function (id) { return cat.porId[id]; }).length;
    contadorFav.textContent = validos ? String(validos) : '';
    contadorFav.parentNode.setAttribute('aria-label', validos ? 'Favoritos, ' + validos + (validos === 1 ? ' produto salvo' : ' produtos salvos') : 'Favoritos');
  }

  function listaCategorias(classe) {
    return h('ul', { class: classe }, cat.categorias.map(function (c) {
      return h('li', null, h('a', { href: V.url.catalogo({ categoria: c.id }) }, [c.nome, h('span', null, String(c.total))]));
    }));
  }

  function montarCabecalho() {
    var topo = document.querySelector('[data-topo]');
    if (!topo) return;
    topo.classList.add('topo');
    topo.textContent = '';

    // Navegação principal: as categorias entram no lugar de { categorias: true }
    var painel = null;
    var categoriaAtual = arquivoAtual === 'catalogo.html' ? new URLSearchParams(location.search).get('categoria') : null;
    function itensDaNavegacao() {
      var itens = [];
      (M.navegacao || []).forEach(function (item) {
        if (item.categorias) {
          cat.categorias.forEach(function (c) {
            itens.push({ rotulo: c.nome, href: V.url.catalogo({ categoria: c.id }), atual: categoriaAtual === c.id, total: c.total });
          });
        } else if (item.href) {
          itens.push({ rotulo: item.rotulo, href: V.url.pagina(item.href), atual: ehPaginaAtual(item.href) && !(arquivoAtual === 'catalogo.html' && categoriaAtual) });
        }
      });
      return itens;
    }
    var itensNav = itensDaNavegacao();
    var nav = h('nav', { class: 'nav-principal', 'aria-label': 'Principal' }, h('ul', null, itensNav.map(function (i) {
      return h('li', null, h('a', { href: i.href, 'aria-current': i.atual ? 'page' : null }, i.rotulo));
    })));

    // Busca no cabeçalho (desktop)
    var busca = V.criarBusca({ atalho: true, placeholder: 'Buscar peças' });
    var areaBusca = h('div', { class: 'topo__busca' }, [busca.form, busca.lista]);

    // Botões
    var botaoBuscaMovel = h('button', { type: 'button', class: 'botao-icone so-mobile', 'aria-label': 'Buscar produtos', 'aria-haspopup': 'dialog' }, V.icone('busca'));
    contadorFav = h('span', { class: 'contador', 'aria-hidden': 'true' });
    var linkFav = h('a', { class: 'botao-icone', href: V.url.pagina('favoritos.html'), 'aria-current': ehPaginaAtual('favoritos.html') ? 'page' : null }, [V.icone('coracao'), contadorFav]);
    var botaoMenu = h('button', { type: 'button', class: 'botao-icone so-mobile', 'aria-label': 'Abrir menu', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' }, V.icone('menu'));

    topo.appendChild(h('div', { class: 'conteiner topo__interno' }, [
      V.marca(),
      nav,
      h('div', { class: 'topo__acoes' }, [areaBusca, botaoBuscaMovel, linkFav, botaoMenu])
    ]));
    atualizarContadorFavoritos();

    // Menu móvel
    var menu = h('dialog', { class: 'dialogo dialogo--gaveta', 'aria-label': 'Menu' }, [
      h('div', { class: 'dialogo__cabecalho' }, [V.marca(), h('button', { type: 'button', class: 'botao-icone', 'aria-label': 'Fechar menu', 'data-fechar': '' }, V.icone('fechar'))]),
      h('div', { class: 'dialogo__corpo' }, [
        h('nav', { class: 'menu-movel__nav', 'aria-label': 'Principal' }, itensNav.map(function (i) {
          return h('a', { href: i.href, 'aria-current': i.atual ? 'page' : null }, [i.rotulo, i.total ? h('span', null, String(i.total).padStart(2, '0')) : null]);
        })),
        h('p', { class: 'menu-movel__rotulo rotulo' }, 'Mais'),
        h('div', { class: 'menu-movel__secundario' }, [
          h('a', { href: V.url.pagina('favoritos.html') }, 'Favoritos'),
          h('a', { href: V.url.pagina('index.html') }, 'Início'),
          h('a', { href: V.url.pagina('privacidade.html') }, 'Privacidade')
        ]),
        h('p', { class: 'menu-movel__aviso' }, T.avisoMarca || '')
      ])
    ]);
    document.body.appendChild(V.dialogo.preparar(menu));
    botaoMenu.addEventListener('click', function () { botaoMenu.setAttribute('aria-expanded', 'true'); V.dialogo.abrir(menu); });
    menu.addEventListener('fechado', function () { botaoMenu.setAttribute('aria-expanded', 'false'); botaoMenu.focus(); });

    // Busca em tela cheia (celular)
    var buscaMovel = V.criarBusca({
      integrada: true,
      placeholder: 'Cargo, oversized, ripstop…',
      vazio: function () {
        var frag = h('div', null, [h('p', { class: 'busca__sugestoes-titulo rotulo' }, 'Categorias'), listaCategorias('menu-movel__categorias')]);
        return frag;
      }
    });
    var dlgBusca = h('dialog', { class: 'dialogo dialogo--busca', 'aria-label': 'Buscar produtos' }, [
      h('div', { class: 'dialogo__cabecalho' }, [buscaMovel.form, h('button', { type: 'button', class: 'botao-icone', 'aria-label': 'Fechar busca', 'data-fechar': '' }, V.icone('fechar'))]),
      h('div', { class: 'dialogo__corpo' }, buscaMovel.lista)
    ]);
    document.body.appendChild(V.dialogo.preparar(dlgBusca));
    var abrirBuscaMovel = function () {
      V.dialogo.abrir(dlgBusca);
      buscaMovel.render();
      setTimeout(function () { buscaMovel.input.focus(); }, 30);
    };
    botaoBuscaMovel.addEventListener('click', abrirBuscaMovel);
    dlgBusca.addEventListener('fechado', function () { botaoBuscaMovel.focus(); });

    // Atalho "/" para buscar
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var alvo = e.target;
      if (alvo && (alvo.isContentEditable || /^(input|textarea|select)$/i.test(alvo.tagName))) return;
      e.preventDefault();
      if (getComputedStyle(areaBusca).display !== 'none') busca.input.focus();
      else abrirBuscaMovel();
    });

    // Comportamento ao rolar: compacto, esconde ao descer, volta ao subir
    var ultimoY = window.scrollY;
    var agendado = false;
    var raiz = document.documentElement;
    raiz.classList.add('topo-visivel');
    function aoRolar() {
      agendado = false;
      var y = Math.max(0, window.scrollY);
      var delta = y - ultimoY;
      topo.classList.toggle('topo--rolado', y > 8);
      var ocupado = topo.contains(document.activeElement) || (painel && painel.classList.contains('painel-categorias--aberto'));
      if (y > 320 && delta > 6 && !ocupado) {
        topo.classList.add('topo--oculto');
        raiz.classList.remove('topo-visivel');
        raiz.style.setProperty('--topo-visivel', '0px');
        busca.fechar();
      } else if (delta < -6 || y <= 320) {
        topo.classList.remove('topo--oculto');
        raiz.classList.add('topo-visivel');
        raiz.style.removeProperty('--topo-visivel');
      }
      if (Math.abs(delta) > 6 || y <= 320) ultimoY = y;
    }
    window.addEventListener('scroll', function () {
      if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
    }, { passive: true });
    aoRolar();
  }

  // ---------------------------------------------------------------
  // Faixa de exemplos
  // ---------------------------------------------------------------
  function montarFaixaExemplos() {
    if (!cat.temExemplos || !T.avisoExemplos) return;
    var faixa = h('div', { class: 'faixa-exemplos', role: 'note' }, [
      T.avisoExemplos + ' ',
      h('a', { href: V.url.pagina('como-funciona.html#exemplos') }, 'Entenda')
    ]);
    var topo = document.querySelector('[data-topo]');
    if (topo) topo.parentNode.insertBefore(faixa, topo);
  }

  // ---------------------------------------------------------------
  // Rodapé
  // ---------------------------------------------------------------
  function montarRodape() {
    var rodape = document.querySelector('[data-rodape]');
    if (!rodape) return;
    rodape.classList.add('rodape');
    rodape.textContent = '';

    var colunas = ((M.rodape && M.rodape.colunas) || []).map(function (col) {
      var links = (col.links || []).map(function (l) { return h('li', null, h('a', { href: V.url.pagina(l.href) }, l.rotulo)); });
      if (col.incluirCategorias) {
        cat.categorias.forEach(function (c) { links.push(h('li', null, h('a', { href: V.url.catalogo({ categoria: c.id }) }, c.nome))); });
      }
      return h('div', null, [h('h2', { class: 'rodape__titulo rotulo' }, col.titulo), h('ul', null, links)]);
    });

    var contato = M.contato || {};
    var redes = [
      ['email', 'E-mail'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['whatsapp', 'WhatsApp']
    ].filter(function (r) { return contato[r[0]]; }).map(function (r) {
      var valor = String(contato[r[0]]).trim();
      var href = r[0] === 'email' ? 'mailto:' + valor.replace(/^mailto:/, '') : V.linkValido(valor);
      if (!href) return null;
      return h('li', null, h('a', { href: href, target: r[0] === 'email' ? null : '_blank', rel: r[0] === 'email' ? null : 'noopener' }, r[0] === 'email' ? valor.replace(/^mailto:/, '') : r[1]));
    }).filter(Boolean);
    if (redes.length) colunas.push(h('div', null, [h('h2', { class: 'rodape__titulo rotulo' }, 'Contato'), h('ul', null, redes)]));

    rodape.appendChild(h('div', { class: 'conteiner' }, [
      h('div', { class: 'rodape__topo' }, [
        h('div', { style: { display: 'grid', gap: '16px', 'align-content': 'start' } }, [
          h('p', { class: 'rotulo' }, (M.nome || '') + (M.complemento ? ' / ' + M.complemento : '')),
          h('p', { class: 'rodape__descricao' }, M.descricao || '')
        ]),
        h('div', { class: 'rodape__colunas' }, colunas)
      ]),
      h('div', { class: 'rodape__avisos' }, [
        h('p', { id: 'aviso-afiliado' }, [h('strong', null, 'Links de afiliado. '), T.avisoAfiliado || '']),
        h('p', null, [h('strong', null, 'Compra na Shopee. '), 'Ao tocar em “' + (T.botaoCard || 'Ver na Shopee') + '”, você vai para a Shopee consultar a peça e comprar. ' + (T.avisoPreco || '') + ' ' + (T.avisoMarca || '')])
      ]),
      h('div', { class: 'rodape__base mono' }, [
        h('span', null, '© ' + V.anoAtual + ' ' + (M.nome || '')),
        h('span', null, 'Shopee é marca de seus respectivos titulares.')
      ])
    ]));
    // Assinatura do rodapé: o nome da marca pixado na largura toda
    var assinatura = h('div', { class: 'rodape__pixo' }, V.pixo(M.nome || 'Vitrine', { classe: 'pixo--desenhar revelar', semente: 21, traco: 2.2 }));
    rodape.appendChild(assinatura);
  }

  // ---------------------------------------------------------------
  // Metadados da página (canônico e compartilhamento)
  // ---------------------------------------------------------------
  V.definirMeta = function (dados) {
    dados = dados || {};
    var site = (M.site && M.site.url || '').replace(/\/+$/, '');
    function meta(seletor, criar, valor) {
      if (!valor) return;
      var el = document.head.querySelector(seletor);
      if (!el) { el = criar(); document.head.appendChild(el); }
      el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', valor);
    }
    if (dados.titulo) document.title = dados.titulo;
    var desc = dados.descricao;
    meta('meta[name="description"]', function () { return h('meta', { name: 'description' }); }, desc);
    meta('meta[property="og:title"]', function () { return h('meta', { property: 'og:title' }); }, dados.titulo);
    meta('meta[property="og:description"]', function () { return h('meta', { property: 'og:description' }); }, desc);
    meta('meta[property="og:site_name"]', function () { return h('meta', { property: 'og:site_name' }); }, M.nome);
    var imagem = dados.imagem || (M.site && M.site.imagemCompartilhamento ? V.resolver(M.site.imagemCompartilhamento) : '');
    meta('meta[property="og:image"]', function () { return h('meta', { property: 'og:image' }); }, imagem);
    meta('meta[name="twitter:card"]', function () { return h('meta', { name: 'twitter:card' }); }, 'summary_large_image');
    if (site) {
      var caminho = location.pathname.split('/').pop() || '';
      var canonico = site + '/' + (caminho === 'index.html' ? '' : caminho) + (dados.consulta || '');
      meta('link[rel="canonical"]', function () { return h('link', { rel: 'canonical' }); }, canonico);
      meta('meta[property="og:url"]', function () { return h('meta', { property: 'og:url' }); }, canonico);
    }
  };

  // ---------------------------------------------------------------
  // Ponto que segue o cursor (só com mouse e sem movimento reduzido)
  // ---------------------------------------------------------------
  function montarCursor() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || V.movimentoReduzido()) return;
    var ponto = h('span', { class: 'cursor-ponto oculto', 'aria-hidden': 'true' });
    document.body.appendChild(ponto);
    var x = 0, y = 0, px = 0, py = 0, ativo = false;
    function quadro() {
      px += (x - px) * 0.35; py += (y - py) * 0.35;
      ponto.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)';
      if (Math.abs(x - px) > .2 || Math.abs(y - py) > .2) requestAnimationFrame(quadro); else ativo = false;
    }
    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      ponto.classList.remove('oculto');
      ponto.classList.toggle('grande', !!(e.target.closest && e.target.closest('a, button, [role="button"], summary, label, select')));
      if (!ativo) { ativo = true; requestAnimationFrame(quadro); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { ponto.classList.add('oculto'); });
  }

  // ---------------------------------------------------------------
  // Inicialização comum
  // ---------------------------------------------------------------
  montarCursor();
  montarFaixaExemplos();
  montarCabecalho();
  montarRodape();
  V.definirMeta({});

  // Ativa as transições de entrada depois da primeira pintura
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.documentElement.classList.add('pronto'); });
  });
  window.addEventListener('load', function () { V.revelar(); });
})();
