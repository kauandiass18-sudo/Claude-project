/* =============================================================
   PÁGINA INICIAL
   Primeira dobra, categorias, destaques, seleções editoriais,
   novidades, vistos recentemente e "como funciona".
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var T = M.textos || {};
  var S = T.secoes || {};
  var h = V.h;
  var cat = V.catalogo();

  // ---------------------------------------------------------------
  // Primeira dobra
  // ---------------------------------------------------------------
  var hero = T.hero || {};
  function preencher(seletor, valor, comEnfase) {
    var el = document.querySelector(seletor);
    if (!el) return null;
    if (!valor) { el.hidden = true; return el; }
    el.textContent = '';
    el.appendChild(comEnfase ? V.tituloComEnfase(valor) : document.createTextNode(valor));
    return el;
  }
  preencher('[data-hero-sobretitulo]', hero.sobretitulo);
  preencher('[data-hero-titulo]', hero.titulo || M.nome, true);
  preencher('[data-hero-texto]', hero.texto);
  preencher('[data-hero-principal]', hero.botaoPrincipal || 'Explorar o catálogo');
  preencher('[data-hero-secundario]', hero.botaoSecundario);

  var nota = document.querySelector('[data-hero-nota]');
  if (nota) {
    nota.appendChild(V.icone('loja'));
    nota.appendChild(h('span', null, [
      'Você compra direto na Shopee. Os botões são links de afiliado. ',
      h('a', { href: V.url.pagina('como-funciona.html#afiliados') }, 'Entenda como funciona')
    ]));
  }

  V.definirMeta({ titulo: (M.nome || 'Vitrine') + ' · ' + (hero.titulo || '').replace(/\*/g, ''), descricao: M.descricao });

  var secoes = document.querySelector('[data-secoes]');
  var composicao = document.querySelector('[data-composicao]');

  if (cat.erro) {
    composicao.hidden = true;
    secoes.appendChild(estadoErro());
    return;
  }

  // Composição editorial com até três produtos em destaque
  var comFoto = cat.produtos.filter(function (p) { return p.imagens.length; });
  var vitrineHero = comFoto.filter(function (p) { return p.destaque; });
  if (vitrineHero.length < 3) {
    vitrineHero = vitrineHero.concat(comFoto.filter(function (p) { return vitrineHero.indexOf(p) === -1; }));
  }
  vitrineHero = vitrineHero.slice(0, 3);

  if (!vitrineHero.length) {
    composicao.hidden = true;
  } else {
    composicao.classList.add(vitrineHero.length === 1 ? 'composicao--um' : vitrineHero.length === 2 ? 'composicao--dois' : 'composicao--tres');
    vitrineHero.forEach(function (p, i) {
      var midia = h('span', { class: 'quadro__midia' }, [
        V.foto(p.imagens[0], { prioridade: i === 0, sizes: i === 0 ? '(min-width: 960px) 34vw, 74vw' : '(min-width: 960px) 20vw, 74vw', alt: p.imagens[0].alt }),
        h('span', { class: 'quadro__ver', 'aria-hidden': 'true' }, ['Ver detalhes', V.icone('seta')])
      ]);
      var quadro = h('a', { class: 'quadro entrada-quadro' + (i > 0 ? ' paralaxe' : ''), href: V.url.produto(p.id), style: { '--i': String(i) }, dataset: { velocidade: String(i === 1 ? 0.08 : i === 2 ? 0.16 : 0) } }, [
        midia,
        h('span', { class: 'quadro__legenda' }, [
          h('span', { class: 'quadro__numero' }, String(i + 1).padStart(2, '0')),
          h('span', { class: 'quadro__nome' }, p.nome),
          p.preco !== null ? h('span', { class: 'quadro__preco' }, V.formatarPreco(p.preco)) : null
        ])
      ]);
      composicao.appendChild(quadro);
    });
    iniciarParalaxe();
  }

  // Paralaxe leve na composição (desktop, sem movimento reduzido)
  function iniciarParalaxe() {
    var quadros = composicao.querySelectorAll('.paralaxe');
    if (!quadros.length) return;
    var mqDesktop = window.matchMedia('(min-width: 960px)');
    var agendado = false;
    function atualizar() {
      agendado = false;
      if (!mqDesktop.matches || V.movimentoReduzido()) {
        quadros.forEach(function (q) { q.style.transform = ''; });
        return;
      }
      var y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      quadros.forEach(function (q) {
        q.style.transform = 'translate3d(0,' + (-y * parseFloat(q.dataset.velocidade || 0)).toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } }, { passive: true });
    mqDesktop.addEventListener && mqDesktop.addEventListener('change', atualizar);
    atualizar();
  }

  // ---------------------------------------------------------------
  // Seções
  // ---------------------------------------------------------------
  var numero = 0;
  function cabecalho(titulo, texto, link) {
    numero++;
    return h('div', { class: 'secao__cabecalho revelar' }, [
      h('div', null, [
        h('span', { class: 'secao__indice', 'aria-hidden': 'true' }, String(numero).padStart(2, '0')),
        h('h2', { class: 'titulo-secao' }, V.tituloComEnfase(titulo)),
        texto ? h('p', { class: 'texto-apoio' }, texto) : null
      ]),
      link || null
    ]);
  }
  function linkSeta(texto, href) {
    return h('a', { class: 'link-seta', href: href }, [texto, V.icone('seta')]);
  }
  function secao(id, filhos) {
    return h('section', { class: 'secao', id: id, 'aria-labelledby': id + '-titulo' }, h('div', { class: 'conteiner' }, filhos));
  }
  function identificarTitulo(sec) {
    var h2 = sec.querySelector('h2');
    if (h2) h2.id = sec.id + '-titulo';
    return sec;
  }
  function grade(produtos, origem) {
    return h('div', { class: 'grade' }, produtos.map(function (p, i) { return V.cartao(p, { indice: i, origem: origem }); }));
  }
  function trilho(produtos, origem, rotulo) {
    return h('div', { class: 'trilho', role: 'region', 'aria-label': rotulo, tabindex: '0' }, produtos.map(function (p, i) { return V.cartao(p, { indice: i, origem: origem }); }));
  }

  if (!cat.produtos.length) {
    secoes.appendChild(h('div', { class: 'conteiner' }, h('div', { class: 'estado' }, [
      h('span', { class: 'estado__icone' }, V.icone('caixa')),
      h('h2', null, 'Os primeiros produtos chegam em breve'),
      h('p', null, 'A seleção está sendo preparada. Volte em alguns dias para conhecer os primeiros itens.')
    ])));
  } else {
    // Categorias
    if (cat.categorias.length > 1) {
      var blocos = cat.categorias.map(function (c, i) {
        var capa = cat.produtos.filter(function (p) { return p.categoria === c && p.imagens.length; })[0];
        var midia = h('span', { class: 'categoria-bloco__midia' }, capa
          ? V.foto(capa.imagens[0], { alt: '', sizes: '(min-width: 1100px) 18vw, (min-width: 760px) 30vw, 46vw', preferirPequena: true })
          : V.semFoto(''));
        var bloco = h('a', { class: 'categoria-bloco revelar', href: V.url.catalogo({ categoria: c.id }), style: { '--atraso': (i % 5) * 60 + 'ms' } }, [
          midia,
          h('span', { class: 'categoria-bloco__texto' }, [
            h('span', { class: 'categoria-bloco__nome' }, c.nome),
            h('span', { class: 'categoria-bloco__total' }, c.total + (c.total === 1 ? ' produto' : ' produtos'))
          ])
        ]);
        return bloco;
      });
      var gradeCat = h('div', { class: 'categorias-grade', style: { '--colunas': String(Math.min(cat.categorias.length, 5)) } }, blocos);
      secoes.appendChild(identificarTitulo(secao('categorias', [
        cabecalho(S.categoriasTitulo || 'Categorias', S.categoriasTexto, linkSeta('Ver todo o catálogo', V.url.pagina('catalogo.html'))),
        gradeCat
      ])));
    }

    // Destaques
    // Com 5 ou mais, o primeiro ganha destaque maior e a grade fecha sem lacunas
    // (1 grande + 4 menores); os demais continuam no catálogo.
    var destaques = cat.produtos.filter(function (p) { return p.destaque; });
    if (destaques.length) {
      var gradeDestaques;
      if (destaques.length >= 5) {
        gradeDestaques = h('div', { class: 'grade grade--destaques' }, destaques.slice(0, 5).map(function (p, i) {
          return V.cartao(p, { indice: i, origem: 'destaques', grande: i === 0, sizes: i === 0 ? '(min-width: 1100px) 48vw, 100vw' : undefined });
        }));
      } else {
        gradeDestaques = grade(destaques, 'destaques');
      }
      secoes.appendChild(identificarTitulo(secao('destaques', [
        cabecalho(S.destaquesTitulo || 'Em destaque', S.destaquesTexto, linkSeta('Ver catálogo completo', V.url.pagina('catalogo.html'))),
        gradeDestaques
      ])));
    }

    // Seleções editoriais
    if (cat.selecoes.length) {
      var blocosSel = cat.selecoes.map(function (s) {
        return h('div', { class: 'selecao-editorial', id: 'selecao-' + s.id }, [
          h('div', { class: 'selecao-editorial__topo revelar' }, [
            h('div', null, [
              h('h3', { class: 'selecao-editorial__titulo' }, s.titulo),
              s.descricao ? h('p', { class: 'texto-apoio', style: { 'margin-top': '8px' } }, s.descricao) : null
            ]),
            linkSeta('Ver a seleção', V.url.catalogo({ selecao: s.id }))
          ]),
          trilho(s.produtos, 'selecao', s.titulo)
        ]);
      });
      numero++;
      secoes.appendChild(h('section', { class: 'secao', id: 'selecoes', 'aria-label': 'Seleções' }, h('div', { class: 'conteiner' }, [
        h('span', { class: 'secao__indice revelar', 'aria-hidden': 'true' }, String(numero).padStart(2, '0'))
      ].concat(blocosSel))));
    }

    // Novidades
    var comData = cat.produtos.filter(function (p) { return p.adicionadoEm; });
    if (comData.length >= 4) {
      var recentes = comData.slice().sort(function (a, b) { return a.adicionadoEm < b.adicionadoEm ? 1 : a.adicionadoEm > b.adicionadoEm ? -1 : a.ordem - b.ordem; }).slice(0, 4);
      secoes.appendChild(identificarTitulo(secao('novidades', [
        cabecalho(S.recentesTitulo || 'Novidades', S.recentesTexto, linkSeta('Ver mais recentes', V.url.catalogo({ ordem: 'recentes' }))),
        grade(recentes, 'novidades')
      ])));
    }

    // Vistos recentemente (apenas neste navegador)
    var vistos = V.vistos.lista().map(function (id) { return cat.porId[id]; }).filter(Boolean).slice(0, 4);
    if (vistos.length) {
      secoes.appendChild(identificarTitulo(secao('vistos', [
        cabecalho(S.vistosTitulo || 'Vistos por você', 'Guardado só neste navegador, para você retomar de onde parou.'),
        grade(vistos, 'vistos')
      ])));
    }
  }

  // Como funciona + transparência
  var cf = T.comoFunciona || {};
  if (cf.passos && cf.passos.length) {
    var sec = identificarTitulo(secao('como-funciona', [
      cabecalho(cf.titulo || 'Como funciona', null, linkSeta('Mais detalhes', V.url.pagina('como-funciona.html'))),
      h('ol', { class: 'passos' }, cf.passos.map(function (p, i) {
        return h('li', { class: 'passo revelar', style: { '--atraso': i * 90 + 'ms' } }, [h('h3', null, p.titulo), h('p', null, p.texto)]);
      })),
      T.avisoAfiliado ? h('div', { class: 'transparencia revelar' }, [
        h('p', { class: 'transparencia__rotulo' }, 'Transparência'),
        h('p', null, T.avisoAfiliado),
        linkSeta('Saiba mais', V.url.pagina('como-funciona.html#afiliados'))
      ]) : null
    ]));
    sec.classList.add('secao--final');
    secoes.appendChild(sec);
  }
  var ultima = secoes.lastElementChild;
  if (ultima) ultima.style.paddingBottom = 'var(--secao)';

  V.revelar();

  function estadoErro() {
    return h('div', { class: 'conteiner' }, h('div', { class: 'estado', role: 'alert' }, [
      h('span', { class: 'estado__icone' }, V.icone('alerta')),
      h('h2', null, 'Não foi possível carregar o catálogo'),
      h('p', null, 'Verifique sua conexão e tente de novo. Se o problema continuar, o arquivo do catálogo pode estar com erro de formatação.'),
      h('div', { class: 'estado__acoes' }, h('button', { type: 'button', class: 'botao botao--escuro', onclick: function () { location.reload(); } }, 'Tentar novamente'))
    ]));
  }
})();
