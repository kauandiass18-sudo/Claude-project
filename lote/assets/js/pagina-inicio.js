/* =============================================================
   PÁGINA INICIAL
   Pôster com título gigante e placa de peças em rotação, faixa
   corrida, índice de categorias, lote em rolagem horizontal,
   combinações, novidades e "como funciona".
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var T = M.textos || {};
  var S = T.secoes || {};
  var h = V.h;
  var cat = V.catalogo();
  var MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  var secoes = document.querySelector('[data-secoes]');
  var placa = document.querySelector('[data-hero-placa]');

  // ---------------------------------------------------------------
  // Primeira dobra
  // ---------------------------------------------------------------
  var hero = T.hero || {};
  var linhas = (hero.linhas && hero.linhas.length ? hero.linhas : [M.nome || '']).slice(0, 2);
  document.querySelector('[data-hero-titulo]').textContent = linhas.join(' ');
  linhas.forEach(function (l, i) {
    var el = document.querySelector('[data-hero-linha="' + i + '"]');
    if (el) { el.textContent = l; V.ajustarLargura(el, 40); }
  });
  if (linhas.length < 2) document.querySelector('.hero__linha--2').hidden = true;
  document.querySelector('[data-hero-texto]').textContent = hero.texto || M.descricao || '';
  var principal = document.querySelector('[data-hero-principal]');
  principal.textContent = hero.botaoPrincipal || 'Ver tudo';
  principal.href = V.url.pagina('catalogo.html');
  var secundario = document.querySelector('[data-hero-secundario]');
  if (hero.botaoSecundario && hero.linkSecundario) { secundario.textContent = hero.botaoSecundario; secundario.href = V.url.pagina(hero.linkSecundario); }
  else secundario.hidden = true;

  var bruto = window.CATALOGO || {};
  var m = /^(\d{4})-(\d{2})/.exec(bruto.atualizadoEm || '');
  document.querySelector('[data-hero-edicao]').textContent = (M.nome || '') + (m ? ' · ' + MESES[parseInt(m[2], 10) - 1] + ' ' + m[1] : '');
  document.querySelector('[data-hero-contagem]').textContent = cat.produtos.length
    ? String(cat.produtos.length).padStart(2, '0') + (cat.produtos.length === 1 ? ' peça' : ' peças') + ' · ' + cat.categorias.length + (cat.categorias.length === 1 ? ' categoria' : ' categorias')
    : '';
  V.definirMeta({ titulo: (M.nome || 'Vitrine') + ' · ' + linhas.join(' '), descricao: M.descricao });

  if (cat.erro) {
    secoes.appendChild(estadoErro());
    return;
  }

  montarPlaca();
  montarFaixa();

  // Placa com as peças em destaque, trocando sozinha
  function montarPlaca() {
    var comFoto = cat.produtos.filter(function (p) { return p.imagens.length; });
    var lista = comFoto.filter(function (p) { return p.destaque; });
    if (lista.length < 3) lista = lista.concat(comFoto.filter(function (p) { return lista.indexOf(p) === -1; }));
    lista = lista.slice(0, 4);
    if (!lista.length) return;
    placa.hidden = false;
    var progresso = h('span', { class: 'hero__placa-progresso', 'aria-hidden': 'true' }, lista.map(function () { return h('span', null, h('i')); }));
    var codigo = h('span', { class: 'hero__placa-codigo' });
    var legendaNome = h('span');
    var legendaPreco = h('span');
    var foto = null;
    placa.appendChild(progresso);
    placa.appendChild(codigo);
    placa.appendChild(h('span', { class: 'hero__placa-legenda' }, [legendaNome, legendaPreco]));

    var atual = -1, timer = null, CICLO = 4200;
    placa.style.setProperty('--ciclo', CICLO + 'ms');
    function mostrar(i) {
      atual = i % lista.length;
      var p = lista[atual];
      var nova = V.foto(p.imagens[0], { prioridade: i === 0, sizes: '(min-width: 760px) 26vw, 46vw', alt: '' });
      if (foto) {
        var velha = foto;
        velha.classList.add('saindo');
        setTimeout(function () { velha.remove(); }, 700);
      }
      placa.insertBefore(nova, progresso);
      foto = nova;
      placa.href = V.url.produto(p.id);
      placa.setAttribute('aria-label', 'Ver ' + p.nome);
      codigo.textContent = V.codigo(p);
      legendaNome.textContent = p.nome;
      legendaPreco.textContent = p.preco !== null ? V.formatarPreco(p.preco) : '';
      progresso.querySelectorAll('span').forEach(function (s, j) {
        s.classList.toggle('feito', j < atual);
        s.classList.remove('ativo');
        if (j === atual) { void s.offsetWidth; s.classList.add('ativo'); }
      });
    }
    function iniciar() {
      parar();
      if (V.movimentoReduzido() || lista.length < 2) return;
      timer = setInterval(function () { mostrar(atual + 1); }, CICLO);
    }
    function parar() { clearInterval(timer); timer = null; }
    mostrar(0);
    if (V.movimentoReduzido()) progresso.hidden = true;
    iniciar();
    placa.addEventListener('mouseenter', parar);
    placa.addEventListener('mouseleave', iniciar);
    placa.addEventListener('focus', parar);
    placa.addEventListener('blur', iniciar);
    document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else iniciar(); });

    // Paralaxe leve da placa
    if (!V.movimentoReduzido()) {
      var agendado = false;
      setTimeout(function () { placa.classList.add('paralaxe-ativa'); }, 1600);
      window.addEventListener('scroll', function () {
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(function () {
          agendado = false;
          var y = Math.min(window.scrollY, window.innerHeight);
          placa.style.setProperty('--py', (y * 0.28).toFixed(1) + 'px');
          placa.style.setProperty('--pr', (y * 0.012).toFixed(2) + 'deg');
        });
      }, { passive: true });
    }
  }

  // Faixa corrida: acelera com a rolagem e inverte ao subir
  function montarFaixa() {
    var trilho = document.querySelector('[data-faixa]');
    var itens = (T.faixa && T.faixa.length) ? T.faixa.slice() : [];
    if (!itens.length) {
      cat.categorias.forEach(function (c) { itens.push(c.nome); });
      cat.produtos.forEach(function (p) { if (p.tecido && itens.indexOf(p.tecido.split(' ')[0]) === -1 && itens.length < 9) itens.push(p.tecido.split(' ')[0]); });
      cat.produtos.forEach(function (p) { if (p.modelagem && itens.indexOf(p.modelagem) === -1 && itens.length < 12) itens.push(p.modelagem); });
    }
    if (!itens.length) { trilho.closest('.faixa-envoltorio').hidden = true; return; }
    function grupo() { return h('div', { class: 'faixa__grupo' }, itens.map(function (t) { return h('span', { class: 'faixa__item' }, t); })); }
    trilho.appendChild(grupo());
    trilho.appendChild(grupo());
    if (V.movimentoReduzido()) return;
    var x = 0, direcao = -1, extra = 0, ultimoY = window.scrollY, antes = performance.now();
    var largura = trilho.firstChild.getBoundingClientRect().width;
    window.addEventListener('resize', function () { largura = trilho.firstChild.getBoundingClientRect().width; });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { largura = trilho.firstChild.getBoundingClientRect().width; });
    window.addEventListener('scroll', function () {
      var d = window.scrollY - ultimoY;
      ultimoY = window.scrollY;
      if (Math.abs(d) > 1) direcao = d > 0 ? -1 : 1;
      extra = Math.min(extra + Math.abs(d) * 0.6, 900);
    }, { passive: true });
    function quadro(t) {
      var dt = Math.min(64, t - antes); antes = t;
      extra *= 0.92;
      x += direcao * (60 + extra) * dt / 1000;
      if (x <= -largura) x += largura;
      if (x > 0) x -= largura;
      trilho.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
  }

  // ---------------------------------------------------------------
  // Seções
  // ---------------------------------------------------------------
  var numero = 0;
  function cabecalho(titulo, texto, link, extra) {
    numero++;
    return [
      h('div', { class: 'secao__indice mono revelar' }, [h('span', null, '(' + String(numero).padStart(2, '0') + ') ' + titulo.replace(/\*/g, '')), extra ? h('span', null, extra) : null]),
      h('div', { class: 'secao__cabecalho revelar' }, [
        h('div', null, [h('h2', { class: 'titulo-secao' }, V.tituloComEnfase(titulo)), texto ? h('p', { class: 'texto-apoio' }, texto) : null]),
        link || null
      ])
    ];
  }
  function linkSeta(texto, href) { return h('a', { class: 'link-seta', href: href }, [texto, V.icone('seta')]); }
  function secao(id, filhos, classe) {
    var s = h('section', { class: 'secao ' + (classe || ''), id: id }, h('div', { class: 'conteiner' }, filhos));
    var h2 = s.querySelector('h2');
    if (h2) { h2.id = id + '-titulo'; s.setAttribute('aria-labelledby', h2.id); }
    return s;
  }
  function grade(produtos, origem) {
    return h('div', { class: 'grade' }, produtos.map(function (p, i) { return V.cartao(p, { indice: i, origem: origem }); }));
  }

  if (!cat.produtos.length) {
    secoes.appendChild(h('div', { class: 'conteiner' }, h('div', { class: 'estado' }, [
      h('span', { class: 'estado__icone' }, V.icone('caixa')),
      h('h2', null, 'O primeiro lote chega em breve'),
      h('p', null, 'As peças estão sendo separadas. Volte em alguns dias.')
    ])));
  } else {
    // Índice de categorias
    if (cat.categorias.length) {
      var cursor = h('div', { class: 'cursor-foto', 'aria-hidden': 'true' });
      var lista = h('div', { class: 'indice' }, cat.categorias.map(function (c, i) {
        var capa = cat.produtos.filter(function (p) { return p.categoria === c && p.imagens.length; })[0];
        var src = capa ? (capa.imagens[0].pequena || capa.imagens[0].src) : '';
        var item = h('a', { class: 'indice__item revelar', href: V.url.catalogo({ categoria: c.id }), style: { '--atraso': i * 60 + 'ms' } }, [
          h('span', { class: 'mono rotulo' }, String(i + 1).padStart(2, '0')),
          h('span', { class: 'indice__nome' }, c.nome),
          h('span', { class: 'indice__info' }, [
            h('span', { class: 'mono' }, String(c.total).padStart(2, '0') + (c.total === 1 ? ' peça' : ' peças')),
            V.icone('seta'),
            src ? h('span', { class: 'indice__miniatura' }, h('img', { src: src, alt: '', loading: 'lazy' })) : null
          ])
        ]);
        if (src) {
          item.addEventListener('mouseenter', function () { cursor.textContent = ''; cursor.appendChild(h('img', { src: src, alt: '' })); cursor.classList.add('visivel'); });
          item.addEventListener('mouseleave', function () { cursor.classList.remove('visivel'); });
        }
        return item;
      }));
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !V.movimentoReduzido()) {
        document.body.appendChild(cursor);
        var cx = 0, cy = 0, tx = 0, ty = 0, rodando = false;
        lista.addEventListener('mousemove', function (e) {
          tx = e.clientX; ty = e.clientY;
          if (!rodando) { rodando = true; requestAnimationFrame(seguir); }
        });
        var seguir = function () {
          cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
          cursor.style.transform = 'translate3d(' + (cx - 110) + 'px,' + (cy - 137) + 'px,0) rotate(' + ((tx - cx) * 0.05).toFixed(2) + 'deg)';
          if (Math.abs(tx - cx) > .5 || Math.abs(ty - cy) > .5) requestAnimationFrame(seguir); else rodando = false;
        };
      }
      secoes.appendChild(secao('categorias', cabecalho(S.categoriasTitulo || 'Categorias', null, linkSeta('Ver tudo', V.url.pagina('catalogo.html')), String(cat.categorias.length).padStart(2, '0')).concat([lista])));
    }

    // O lote: destaques em rolagem horizontal fixada
    var destaques = cat.produtos.filter(function (p) { return p.destaque; });
    if (destaques.length) montarLote(destaques);

    // Combinações
    if (cat.selecoes.length) {
      var blocos = cat.selecoes.map(function (s, i) {
        var pecas = s.produtos.slice(0, 4);
        return h('article', { class: 'combinacao', id: 'combinacao-' + s.id }, [
          h('div', { class: 'combinacao__texto revelar' }, [
            h('p', { class: 'rotulo' }, 'Combinação ' + String(i + 1).padStart(2, '0') + ' · ' + s.produtos.length + ' peças'),
            h('h3', { class: 'combinacao__titulo' }, s.titulo),
            s.descricao ? h('p', { class: 'texto-apoio' }, s.descricao) : null,
            h('div', null, linkSeta('Ver a combinação', V.url.catalogo({ selecao: s.id })))
          ]),
          h('div', { class: 'combinacao__pecas', style: { '--n': String(pecas.length) } }, pecas.map(function (p, j) {
            return h('a', { class: 'combinacao__peca revelar', href: V.url.produto(p.id), style: { '--atraso': j * 90 + 'ms' } }, [
              h('span', { class: 'cartao__midia' }, [
                p.imagens.length ? V.foto(p.imagens[0], { alt: '', sizes: '(min-width: 960px) 16vw, 46vw', preferirPequena: true }) : V.semFoto(''),
                h('span', { class: 'cartao__codigo' }, V.codigo(p))
              ]),
              h('span', { class: 'cartao__nome' }, p.nome),
              h('span', { class: 'mono' }, p.preco !== null ? V.formatarPreco(p.preco) : 'Preço na Shopee')
            ]);
          }))
        ]);
      });
      secoes.appendChild(secao('combinacoes', cabecalho(S.combinacoesTitulo || 'Combinações', S.combinacoesTexto, null, String(cat.selecoes.length).padStart(2, '0')).concat(blocos)));
    }

    // Novidades
    var comData = cat.produtos.filter(function (p) { return p.adicionadoEm; });
    if (comData.length >= 4) {
      var recentes = comData.slice().sort(function (a, b) { return a.adicionadoEm < b.adicionadoEm ? 1 : a.adicionadoEm > b.adicionadoEm ? -1 : a.ordem - b.ordem; }).slice(0, 4);
      secoes.appendChild(secao('novidades', cabecalho(S.recentesTitulo || 'Novidades', null, linkSeta('Mais recentes', V.url.catalogo({ ordem: 'recentes' }))).concat([grade(recentes, 'novidades')])));
    }

    // Vistos recentemente
    var vistos = V.vistos.lista().map(function (id) { return cat.porId[id]; }).filter(Boolean).slice(0, 4);
    if (vistos.length) {
      secoes.appendChild(secao('vistos', cabecalho(S.vistosTitulo || 'Vistos por você', 'Guardado só neste navegador.').concat([grade(vistos, 'vistos')])));
    }
  }

  // Como funciona
  var cf = T.comoFunciona || {};
  if (cf.passos && cf.passos.length) {
    var filhos = cabecalho(cf.titulo || 'Como funciona', null, linkSeta('Detalhes', V.url.pagina('como-funciona.html'))).concat([
      h('ol', { class: 'passos' }, cf.passos.map(function (p, i) {
        return h('li', { class: 'passo revelar', style: { '--atraso': i * 90 + 'ms' } }, [h('span', { class: 'passo__numero', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')), h('h3', null, p.titulo), h('p', null, p.texto)]);
      })),
      h('div', { class: 'transparencia revelar' }, [
        h('p', { class: 'rotulo' }, 'Antes de comprar'),
        h('p', null, [T.avisoMedidas || '', ' ', T.avisoAfiliado || '']),
        linkSeta('Saiba mais', V.url.pagina('como-funciona.html#afiliados'))
      ])
    ]);
    secoes.appendChild(secao('como-funciona', filhos));
  }
  var ultima = secoes.lastElementChild;
  if (ultima) ultima.style.paddingBottom = 'var(--secao)';
  V.revelar();

  // ---------------------------------------------------------------
  function montarLote(produtos) {
    var contador = h('span', { class: 'lote__contador' });
    var barra = h('div', { class: 'lote__barra', 'aria-hidden': 'true' }, h('i'));
    var trilho = h('div', { class: 'lote__trilho', role: 'region', 'aria-label': S.loteTitulo || 'Destaques', tabindex: '0' },
      produtos.map(function (p, i) { return V.cartao(p, { indice: i, origem: 'lote', revelar: false, sizes: '(min-width: 960px) 24vw, 68vw' }); }));
    var cab = cabecalho(S.loteTitulo || 'Destaques', S.loteTexto, null, String(produtos.length).padStart(2, '0') + (produtos.length === 1 ? ' peça' : ' peças'));
    var fixo = h('div', { class: 'lote__fixo' }, h('div', { class: 'conteiner' }, cab.concat([trilho, h('div', { class: 'lote__topo', style: { 'margin-top': '20px', 'margin-bottom': '0' } }, [contador, linkSeta('Ver todas as peças', V.url.pagina('catalogo.html'))]), barra])));
    var sec = h('section', { class: 'secao lote', id: 'lote', 'aria-labelledby': 'lote-titulo' }, fixo);
    fixo.querySelector('h2').id = 'lote-titulo';
    secoes.appendChild(sec);
    contador.textContent = '01 / ' + String(produtos.length).padStart(2, '0');

    var mq = window.matchMedia('(min-width: 960px)');
    var excesso = 0;
    function medir() {
      sec.classList.remove('lote--fixado');
      sec.style.removeProperty('--altura-lote');
      trilho.style.transform = '';
      excesso = trilho.scrollWidth - trilho.clientWidth;
      if (!mq.matches || V.movimentoReduzido() || excesso < 40) { barra.hidden = true; return; }
      barra.hidden = false;
      sec.classList.add('lote--fixado');
      sec.style.setProperty('--altura-lote', (window.innerHeight + excesso) + 'px');
      atualizar();
    }
    function atualizar() {
      if (!sec.classList.contains('lote--fixado')) {
        var i = Math.round(trilho.scrollLeft / Math.max(1, trilho.scrollWidth - trilho.clientWidth) * (produtos.length - 1));
        contador.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(produtos.length).padStart(2, '0');
        return;
      }
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - window.innerHeight;
      var prog = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      trilho.style.transform = 'translate3d(' + (-prog * excesso).toFixed(1) + 'px,0,0)';
      barra.style.setProperty('--progresso', prog.toFixed(4));
      contador.textContent = String(Math.min(produtos.length, Math.round(prog * (produtos.length - 1)) + 1)).padStart(2, '0') + ' / ' + String(produtos.length).padStart(2, '0');
    }
    var agendado = false;
    window.addEventListener('scroll', function () { if (!agendado) { agendado = true; requestAnimationFrame(function () { agendado = false; atualizar(); }); } }, { passive: true });
    trilho.addEventListener('scroll', atualizar, { passive: true });
    var timer;
    window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(medir, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
    window.addEventListener('load', medir);
    medir();
    // Teclado: foco num card fora da tela leva a rolagem até ele
    trilho.addEventListener('focusin', function (e) {
      if (!sec.classList.contains('lote--fixado')) return;
      var card = e.target.closest('.cartao');
      if (!card) return;
      var alvo = card.offsetLeft / Math.max(1, excesso + trilho.clientWidth - card.offsetWidth);
      var topo = sec.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topo + Math.min(1, alvo) * (sec.offsetHeight - window.innerHeight), behavior: 'auto' });
    });
  }

  function estadoErro() {
    return h('div', { class: 'conteiner' }, h('div', { class: 'estado', role: 'alert' }, [
      h('span', { class: 'estado__icone' }, V.icone('alerta')),
      h('h2', null, 'Não foi possível carregar o catálogo'),
      h('p', null, 'Verifique sua conexão e tente de novo. Se continuar, o arquivo do catálogo pode estar com erro de formatação.'),
      h('div', { class: 'estado__acoes' }, h('button', { type: 'button', class: 'botao botao--claro', onclick: function () { location.reload(); } }, 'Tentar novamente'))
    ]));
  }
})();
