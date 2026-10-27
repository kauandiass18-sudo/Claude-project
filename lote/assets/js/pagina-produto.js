/* =============================================================
   PÁGINA DO PRODUTO
   Galeria com ampliação, informações, botão para a Shopee,
   relacionados e vistos recentemente.
   Endereço: produto.html?p=<identificador-do-produto>
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var T = M.textos || {};
  var h = V.h;
  var cat = V.catalogo();

  var area = document.querySelector('[data-produto]');
  var extras = document.querySelector('[data-extras]');
  var migalhas = document.querySelector('[data-migalhas]');
  var params = new URLSearchParams(location.search);
  var id = params.get('p') || params.get('id') || '';

  if (cat.erro) return mostrarEstado('alerta', 'Não foi possível carregar o catálogo', 'Verifique sua conexão e tente de novo.', true);

  var p = cat.porId[id];
  if (!p) {
    var existe = window.CATALOGO && Array.isArray(window.CATALOGO.produtos) && window.CATALOGO.produtos.some(function (x) { return x && x.id === id; });
    migalhas.appendChild(h('li', null, h('span', { 'aria-current': 'page' }, existe ? 'Peça indisponível' : 'Peça não encontrada')));
    document.title = (existe ? 'Peça indisponível' : 'Peça não encontrada') + ' · ' + (M.nome || 'Vitrine');
    var robots = h('meta', { name: 'robots', content: 'noindex' });
    document.head.appendChild(robots);
    mostrarEstado('caixa',
      existe ? 'Esta peça saiu do lote' : 'Peça não encontrada',
      existe ? 'Ela não está mais disponível por aqui. Veja as outras peças.' : 'O link pode estar incompleto ou a peça foi removida. Veja o que está no lote agora.');
    sugerir(cat.produtos.filter(function (x) { return x.destaque; }).slice(0, 4), 'Em destaque na vitrine');
    return;
  }

  V.vistos.registrar(p.id);

  // ---------------------------------------------------------------
  // Metadados e dados estruturados
  // ---------------------------------------------------------------
  var tituloPagina = p.nome + ' · ' + (M.nome || 'Vitrine');
  var imagemAbs = p.imagens.length ? new URL(p.imagens[0].src, location.href).href : '';
  V.definirMeta({ titulo: tituloPagina, descricao: p.descricaoCurta || M.descricao, imagem: imagemAbs, consulta: '?p=' + encodeURIComponent(p.id) });
  if (!p.demo) {
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nome,
      description: p.descricaoCurta || p.descricao || undefined,
      image: p.imagens.map(function (i) { return new URL(i.src, location.href).href; }),
      category: p.categoria.nome
    };
    if (p.preco !== null && V.temLinkAtivo(p)) {
      ld.offers = {
        '@type': 'Offer',
        price: p.preco.toFixed(2),
        priceCurrency: 'BRL',
        url: p.link,
        availability: p.disponibilidade === 'esgotado' ? 'https://schema.org/OutOfStock' : p.disponibilidade === 'disponivel' ? 'https://schema.org/InStock' : undefined
      };
    }
    document.head.appendChild(h('script', { type: 'application/ld+json' }, JSON.stringify(ld)));
  } else {
    document.head.appendChild(h('meta', { name: 'robots', content: 'noindex' }));
  }

  // Migalhas
  migalhas.appendChild(h('li', null, h('a', { href: V.url.catalogo({ categoria: p.categoria.id }) }, p.categoria.nome)));
  migalhas.appendChild(h('li', null, h('span', { 'aria-current': 'page' }, p.nome)));

  // ---------------------------------------------------------------
  // Galeria
  // ---------------------------------------------------------------
  var irParaFoto = function () {};
  var galeria = montarGaleria();

  // ---------------------------------------------------------------
  // Informações
  // ---------------------------------------------------------------
  var etiquetas = [];
  if (p.demo) etiquetas.push(h('span', { class: 'etiqueta' }, 'Peça de exemplo'));
  if (p.disponibilidade === 'esgotado') etiquetas.push(h('span', { class: 'etiqueta' }, 'Esgotado'));

  // Preço
  var blocoPreco = h('div', null, [V.preco(p, false)]);
  var nota = [];
  if (p.preco !== null) {
    if (p.demo) nota.push('Valor ilustrativo de uma peça de exemplo.');
    else nota.push((p.precoConferidoEm ? 'Preço conferido em ' + V.formatarData(p.precoConferidoEm) + '. ' : '') + (T.avisoPreco || ''));
  } else if (!p.demo) {
    nota.push('O preço atualizado, as cores e o frete aparecem na página da Shopee.');
  }
  if (nota.length) blocoPreco.appendChild(h('p', { class: 'produto__nota' }, nota.join(' ')));

  // Cores: tocar numa cor mostra a foto correspondente
  var blocoCores = null;
  if (p.cores.length) {
    var nomeCor = h('strong', null, p.cores[0].nome);
    var botoesCor = p.cores.map(function (c, i) {
      var b = h('button', { type: 'button', class: 'cor-botao', 'aria-pressed': String(i === 0), 'aria-label': 'Cor ' + c.nome + (c.imagem !== null ? ', ver foto' : '') },
        h('span', { class: 'amostra amostra--grande', style: { '--amostra': c.hex || 'var(--cor-tinta-3)' } }));
      b.addEventListener('click', function () {
        botoesCor.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        nomeCor.textContent = c.nome;
        if (c.imagem !== null) irParaFoto(c.imagem);
      });
      return b;
    });
    blocoCores = h('div', { class: 'escolha' }, [
      h('div', { class: 'escolha__topo' }, [h('span', { class: 'rotulo' }, p.cores.length === 1 ? 'Cor' : p.cores.length + ' cores'), nomeCor]),
      h('div', { class: 'cores', role: 'group', 'aria-label': 'Cores' }, botoesCor)
    ]);
  }

  // Tamanhos
  var blocoTamanhos = p.tamanhos.length ? h('div', { class: 'escolha' }, [
    h('div', { class: 'escolha__topo' }, [h('span', { class: 'rotulo' }, 'Tamanhos'), h('span', { class: 'rotulo' }, 'Última conferência')]),
    h('ul', { class: 'tamanhos', 'aria-label': 'Tamanhos disponíveis' }, p.tamanhos.map(function (t) { return h('li', { class: 'tamanho' }, t); })),
    h('p', { class: 'produto__nota' }, 'Cor e tamanho são escolhidos na Shopee. ' + (T.avisoMedidas || ''))
  ]) : null;

  // Ficha técnica
  var fichaItens = [['Modelagem', p.modelagem], ['Tecido', p.tecido], ['Categoria', p.categoria.nome], ['Código', V.codigo(p)]].filter(function (x) { return x[1]; });
  var ficha = h('dl', { class: 'ficha' }, fichaItens.map(function (x) { return h('div', null, [h('dt', { class: 'rotulo' }, x[0]), h('dd', null, x[1])]); }));

  // Disponibilidade e avaliação
  var linhaInfo = [];
  if (p.avaliacao) {
    linhaInfo.push(h('span', { class: 'avaliacao' }, [
      V.icone('estrela'),
      h('span', null, [h('strong', null, String(p.avaliacao.nota).replace('.', ',')), ' de 5 · ' + V.formatarNumero(p.avaliacao.quantidade) + (p.avaliacao.quantidade === 1 ? ' avaliação' : ' avaliações') + ' na Shopee' + (p.avaliacao.conferidoEm ? ' (conferido em ' + V.formatarData(p.avaliacao.conferidoEm) + ')' : '')])
    ]));
  }
  if (p.disponibilidade === 'disponivel') linhaInfo.push(h('span', { class: 'disponivel mono' }, [V.icone('check'), 'Disponível na última conferência']));
  if (p.disponibilidade === 'esgotado') linhaInfo.push(h('span', { class: 'esgotado mono' }, [V.icone('alerta'), 'Esgotado na última conferência']));

  // Compra
  var compra = h('div', { class: 'compra' });
  var botaoPrincipal = V.botaoShopee(p, { classe: 'botao--grande botao--bloco', origem: 'pagina-produto', classeIndisponivel: 'cartao__indisponivel' });
  compra.appendChild(botaoPrincipal);
  var aviso = V.avisoAdmin(p);
  if (aviso) compra.appendChild(aviso);
  var botaoFav = V.botaoFavorito(p, 'botao botao--suave', true);
  var botaoCompartilhar = h('button', { type: 'button', class: 'botao botao--suave' }, [V.icone('compartilhar'), 'Compartilhar']);
  botaoCompartilhar.addEventListener('click', function () {
    V.compartilhar({ title: p.nome, text: p.descricaoCurta || p.nome, url: location.href });
  });
  compra.appendChild(h('div', { class: 'compra__secundarias' }, [botaoFav, botaoCompartilhar]));
  if (V.temLinkAtivo(p) || p.demo) {
    compra.appendChild(h('p', { class: 'compra__afiliado' }, [
      V.icone('loja'),
      h('span', null, p.demo
        ? ['Peça de demonstração da vitrine, com desenho ilustrativo. ', h('a', { href: V.url.pagina('como-funciona.html#exemplos') }, 'Saiba mais')]
        : [(T.avisoBotao || '') + ' Podemos receber comissão por compras qualificadas, sem custo adicional para você. ', h('a', { href: V.url.pagina('como-funciona.html#afiliados') }, 'Saiba mais')])
    ]));
  }

  // Detalhes
  var detalhes = [];
  if (p.caracteristicas.length) {
    detalhes.push(detalhe('Destaques', h('ul', { class: 'lista-destaques' }, p.caracteristicas.map(function (c) {
      return h('li', null, [V.icone('check'), h('span', null, c)]);
    })), true));
  }
  if (p.descricao) {
    detalhes.push(detalhe('Descrição', p.descricao.split(/\n\s*\n/).map(function (par) { return h('p', null, par.trim()); }), !p.caracteristicas.length));
  }
  if (p.medidas) {
    detalhes.push(detalhe('Tabela de medidas', [
      h('div', { class: 'tabela-medidas' }, h('table', null, [
        h('thead', null, h('tr', null, p.medidas.colunas.map(function (c) { return h('th', { scope: 'col' }, c); }))),
        h('tbody', null, p.medidas.linhas.map(function (l) { return h('tr', null, l.map(function (v, i) { return i === 0 ? h('th', { scope: 'row' }, v) : h('td', null, v); })); }))
      ])),
      h('p', { class: 'produto__nota', style: { 'margin-top': '12px' } }, p.medidas.observacao || 'Medidas informadas pelo vendedor. Confira a tabela na página da Shopee antes de comprar.')
    ], false));
  }
  if (p.especificacoes.length) {
    var dl = h('dl', { class: 'especificacoes' });
    p.especificacoes.forEach(function (e) { dl.appendChild(h('dt', null, e.rotulo)); dl.appendChild(h('dd', null, e.valor)); });
    detalhes.push(detalhe('Especificações', dl, false));
  }
  detalhes.push(detalhe('Tamanho, troca e compra', [
    h('p', null, T.avisoMedidas || ''),
    h('p', null, 'A compra é feita na Shopee, com o vendedor. Pagamento, frete, prazo, trocas e devoluções seguem as condições da página da peça e as regras da Shopee.'),
    h('p', null, 'Esta vitrine não vende, não recebe pagamentos e não tem acesso aos seus dados de compra.')
  ], false));

  var info = h('div', { class: 'produto__info' }, [
    h('div', null, [
      h('div', { class: 'produto__topo mono' }, [
        h('span', null, [V.codigo(p), ' · ', h('a', { href: V.url.catalogo({ categoria: p.categoria.id }) }, p.categoria.nome)]),
        p.modelagem ? h('span', null, p.modelagem) : null
      ]),
      h('h1', { class: 'produto__nome' }, p.nome)
    ]),
    etiquetas.length ? h('div', { class: 'produto__etiquetas' }, etiquetas) : null,
    p.descricaoCurta ? h('p', { class: 'produto__resumo' }, p.descricaoCurta) : null,
    blocoPreco,
    linhaInfo.length ? h('div', { class: 'status-linha' }, linhaInfo) : null,
    blocoCores,
    blocoTamanhos,
    compra,
    fichaItens.length ? ficha : null,
    h('div', { class: 'detalhes' }, detalhes)
  ]);

  area.appendChild(h('article', { class: 'produto', 'aria-labelledby': 'titulo-produto' }, [galeria, info]));
  info.querySelector('h1').id = 'titulo-produto';

  // ---------------------------------------------------------------
  // Barra fixa no celular quando o botão principal sai da tela
  // ---------------------------------------------------------------
  if (V.temLinkAtivo(p) && 'IntersectionObserver' in window) {
    var barra = h('div', { class: 'barra-compra', 'aria-hidden': 'true' }, [
      h('div', { class: 'barra-compra__texto' }, [
        h('span', { class: 'barra-compra__nome' }, p.nome),
        h('span', { class: 'barra-compra__preco' }, p.preco !== null ? V.formatarPreco(p.preco) : 'Preço na Shopee')
      ]),
      V.botaoShopee(p, { classe: 'botao--compacto', texto: T.botaoCard || 'Ver na Shopee', origem: 'barra-fixa' })
    ]);
    var linkBarra = barra.querySelector('a');
    if (linkBarra) linkBarra.tabIndex = -1;
    document.body.appendChild(barra);
    var mqMovel = window.matchMedia('(max-width: 959.98px)');
    var passou = false, rodapeVisivel = false;
    function atualizarBarra() {
      var mostrar = mqMovel.matches && passou && !rodapeVisivel;
      barra.classList.toggle('barra-compra--visivel', mostrar);
      barra.setAttribute('aria-hidden', String(!mostrar));
      if (linkBarra) linkBarra.tabIndex = mostrar ? 0 : -1;
      document.body.classList.toggle('com-barra-fixa', mostrar);
    }
    new IntersectionObserver(function (en) {
      passou = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      atualizarBarra();
    }).observe(botaoPrincipal);
    var rodape = document.querySelector('[data-rodape]');
    if (rodape) new IntersectionObserver(function (en) { rodapeVisivel = en[0].isIntersecting; atualizarBarra(); }).observe(rodape);
    mqMovel.addEventListener && mqMovel.addEventListener('change', atualizarBarra);
  }

  // ---------------------------------------------------------------
  // Relacionados: mesma categoria, palavras-chave ou seleção em comum
  // ---------------------------------------------------------------
  var chaves = p.palavrasChave.map(V.semAcentos);
  var selecoesDoProduto = cat.selecoes.filter(function (s) { return s.produtos.indexOf(p) !== -1; });
  var relacionados = cat.produtos.filter(function (x) { return x !== p; }).map(function (x) {
    var pontos = 0;
    if (x.categoria === p.categoria) pontos += 3;
    x.palavrasChave.forEach(function (k) { if (chaves.indexOf(V.semAcentos(k)) !== -1) pontos += 2; });
    selecoesDoProduto.forEach(function (s) { if (s.produtos.indexOf(x) !== -1) pontos += 5; });
    return { x: x, pontos: pontos };
  }).filter(function (r) { return r.pontos > 0; })
    .sort(function (a, b) { return b.pontos - a.pontos || a.x.ordem - b.x.ordem; })
    .slice(0, 4).map(function (r) { return r.x; });
  if (relacionados.length) sugerir(relacionados, (T.secoes && T.secoes.relacionadosTitulo) || 'Relacionados', V.url.catalogo({ categoria: p.categoria.id }), p.categoria.nome);

  var vistos = V.vistos.lista().filter(function (x) { return x !== p.id; }).map(function (x) { return cat.porId[x]; })
    .filter(function (x) { return x && relacionados.indexOf(x) === -1; }).slice(0, 4);
  if (vistos.length) sugerir(vistos, (T.secoes && T.secoes.vistosTitulo) || 'Vistos por você');

  var ultima = extras.lastElementChild;
  if (ultima) ultima.style.paddingBottom = 'var(--secao)';
  V.revelar();

  // ===============================================================
  function detalhe(titulo, conteudo, aberto) {
    return h('details', { class: 'detalhe', open: aberto }, [
      h('summary', null, [titulo, V.icone('mais')]),
      h('div', { class: 'detalhe__conteudo' }, conteudo)
    ]);
  }

  function sugerir(produtos, titulo, link, rotuloLink) {
    if (!produtos.length) return;
    var idTitulo = 'titulo-' + V.criarSlug(titulo);
    extras.appendChild(h('section', { class: 'secao', style: { 'padding-top': 'var(--e-7)' }, 'aria-labelledby': idTitulo }, h('div', { class: 'conteiner' }, [
      h('div', { class: 'secao__cabecalho revelar' }, [
        h('h2', { class: 'titulo-secao', id: idTitulo }, titulo),
        link ? h('a', { class: 'link-seta', href: link }, [rotuloLink, V.icone('seta')]) : null
      ]),
      h('div', { class: 'grade' }, produtos.map(function (x, i) { return V.cartao(x, { indice: i, origem: 'relacionados' }); }))
    ])));
  }

  function mostrarEstado(icone, titulo, texto, recarregar) {
    area.appendChild(h('div', { class: 'estado', role: recarregar ? 'alert' : null }, [
      h('span', { class: 'estado__icone' }, V.icone(icone)),
      h('h1', null, titulo),
      h('p', null, texto),
      h('div', { class: 'estado__acoes' }, recarregar
        ? h('button', { type: 'button', class: 'botao botao--escuro', onclick: function () { location.reload(); } }, 'Tentar novamente')
        : [h('a', { class: 'botao botao--claro', href: V.url.pagina('catalogo.html') }, 'Ver todas as peças'), h('a', { class: 'botao botao--contorno', href: V.url.pagina('index.html') }, 'Página inicial')])
    ]));
  }

  // ---------------------------------------------------------------
  // Galeria: trilho com rolagem por toque, miniaturas e ampliação
  // ---------------------------------------------------------------
  function montarGaleria() {
    var imgs = p.imagens;
    var wrap = h('div', { class: 'galeria' + (imgs.length > 1 ? ' galeria--miniaturas' : '') });
    if (!imgs.length) {
      wrap.appendChild(h('div', { class: 'galeria__palco' }, h('div', { class: 'galeria__trilho' }, h('div', { class: 'galeria__slide', style: { cursor: 'default' } }, V.semFoto('Foto em breve')))));
      return wrap;
    }
    var atual = 0;
    var trilho = h('div', { class: 'galeria__trilho' + (imgs.length === 1 ? ' galeria__trilho--uma' : ''), role: 'region', 'aria-roledescription': 'carrossel', 'aria-label': 'Fotos de ' + p.nome });
    var slides = imgs.map(function (img, i) {
      var b = h('button', { type: 'button', class: 'galeria__slide', 'aria-label': 'Ampliar foto ' + (i + 1) + ' de ' + imgs.length + ': ' + img.alt }, V.foto(img, {
        prioridade: i === 0,
        sizes: '(min-width: 960px) 50vw, 100vw',
        alt: img.alt
      }));
      if (i > 0) b.querySelector('img').loading = 'lazy';
      b.appendChild(h('span', { class: 'galeria__rotulo', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0') + ' / ' + String(imgs.length).padStart(2, '0')));
      b.addEventListener('click', function () { abrirAmpliada(i); });
      trilho.appendChild(b);
      return b;
    });

    var palco = h('div', { class: 'galeria__palco' }, trilho);
    var miniaturas = null, pontos = [], ant, prox, botaoAmpliar;

    botaoAmpliar = h('button', { type: 'button', class: 'galeria__ampliar' }, [V.icone('ampliar'), 'Ampliar']);
    botaoAmpliar.addEventListener('click', function () { abrirAmpliada(atual); });
    palco.appendChild(botaoAmpliar);

    if (imgs.length > 1) {
      ant = h('button', { type: 'button', class: 'galeria__seta galeria__seta--ant', 'aria-label': 'Foto anterior' }, V.icone('chevronEsq'));
      prox = h('button', { type: 'button', class: 'galeria__seta galeria__seta--prox', 'aria-label': 'Próxima foto' }, V.icone('chevron'));
      ant.addEventListener('click', function () { irPara(atual - 1); });
      prox.addEventListener('click', function () { irPara(atual + 1); });
      palco.appendChild(ant);
      palco.appendChild(prox);
      var areaPontos = h('div', { class: 'galeria__pontos', 'aria-hidden': 'true' });
      pontos = imgs.map(function () { var d = h('span', { class: 'galeria__ponto' }); areaPontos.appendChild(d); return d; });
      palco.appendChild(areaPontos);

      miniaturas = h('div', { class: 'galeria__miniaturas', role: 'group', 'aria-label': 'Miniaturas' }, imgs.map(function (img, i) {
        var m = h('button', { type: 'button', class: 'galeria__miniatura', 'aria-label': 'Ver foto ' + (i + 1) }, h('img', { src: img.pequena || img.src, alt: '', loading: 'lazy', width: 72, height: 90 }));
        m.addEventListener('click', function () { irPara(i); });
        return m;
      }));
      wrap.appendChild(miniaturas);

      trilho.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(atual - 1, true); }
      });
      var timer;
      trilho.addEventListener('scroll', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          var i = Math.round(trilho.scrollLeft / trilho.clientWidth);
          if (i !== atual) marcar(i);
        }, 60);
      }, { passive: true });
    }
    wrap.appendChild(palco);
    marcar(0);
    var mqPilha = window.matchMedia('(min-width: 960px)');
    irParaFoto = function (i) {
      if (!slides[i]) return;
      if (mqPilha.matches) slides[i].scrollIntoView({ block: 'center', behavior: V.movimentoReduzido() ? 'auto' : 'smooth' });
      else irPara(i);
    };

    function marcar(i) {
      atual = Math.max(0, Math.min(imgs.length - 1, i));
      pontos.forEach(function (d, j) { d.classList.toggle('ativo', j === atual); });
      if (miniaturas) miniaturas.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-current', String(j === atual)); });
      if (ant) { ant.disabled = atual === 0; prox.disabled = atual === imgs.length - 1; }
      slides.forEach(function (s, j) { s.tabIndex = j === atual ? 0 : -1; });
    }
    function irPara(i, focar) {
      i = Math.max(0, Math.min(imgs.length - 1, i));
      trilho.scrollTo({ left: i * trilho.clientWidth, behavior: V.movimentoReduzido() ? 'auto' : 'smooth' });
      marcar(i);
      if (focar) slides[i].focus({ preventScroll: true });
    }

    // Ampliação em tela cheia
    var dlg, imagemGrande, contador, areaAmpliada, antG, proxG, indiceG = 0;
    function criarAmpliada() {
      imagemGrande = h('img', { alt: '', draggable: 'false' });
      areaAmpliada = h('div', { class: 'ampliada', role: 'img' }, imagemGrande);
      contador = h('span', { 'aria-live': 'polite' });
      antG = h('button', { type: 'button', class: 'galeria__seta galeria__seta--ant', 'aria-label': 'Foto anterior' }, V.icone('chevronEsq'));
      proxG = h('button', { type: 'button', class: 'galeria__seta galeria__seta--prox', 'aria-label': 'Próxima foto' }, V.icone('chevron'));
      areaAmpliada.appendChild(antG);
      areaAmpliada.appendChild(proxG);
      dlg = h('dialog', { class: 'dialogo dialogo--galeria', 'aria-label': 'Fotos ampliadas de ' + p.nome }, [
        h('div', { class: 'dialogo__cabecalho' }, [
          h('p', { class: 'dialogo__titulo' }, p.nome),
          h('button', { type: 'button', class: 'botao-icone', 'aria-label': 'Fechar', 'data-fechar': '' }, V.icone('fechar'))
        ]),
        areaAmpliada,
        h('div', { class: 'ampliada__rodape' }, [contador, h('span', { 'aria-hidden': 'true' }, '·'), h('span', null, 'Toque na foto para aproximar')])
      ]);
      document.body.appendChild(V.dialogo.preparar(dlg));
      antG.addEventListener('click', function (e) { e.stopPropagation(); mostrar(indiceG - 1); });
      proxG.addEventListener('click', function (e) { e.stopPropagation(); mostrar(indiceG + 1); });
      if (imgs.length < 2) { antG.hidden = true; proxG.hidden = true; }

      // Aproximar: clique alterna; o ponto de origem segue o ponteiro
      var inicioX = null, moveu = false;
      areaAmpliada.addEventListener('pointerdown', function (e) { inicioX = e.clientX; moveu = false; });
      areaAmpliada.addEventListener('pointermove', function (e) {
        if (inicioX !== null && Math.abs(e.clientX - inicioX) > 8) moveu = true;
        if (!areaAmpliada.classList.contains('zoom')) return;
        var r = areaAmpliada.getBoundingClientRect();
        areaAmpliada.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        areaAmpliada.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
      areaAmpliada.addEventListener('pointerup', function (e) {
        if (e.target.closest('.galeria__seta')) return;
        var dx = inicioX === null ? 0 : e.clientX - inicioX;
        inicioX = null;
        if (!areaAmpliada.classList.contains('zoom') && moveu && Math.abs(dx) > 50 && imgs.length > 1) {
          mostrar(indiceG + (dx < 0 ? 1 : -1));
          return;
        }
        if (moveu && areaAmpliada.classList.contains('zoom') && e.pointerType !== 'mouse') return;
        var r = areaAmpliada.getBoundingClientRect();
        areaAmpliada.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        areaAmpliada.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        areaAmpliada.classList.toggle('zoom');
      });
      dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') mostrar(indiceG + 1);
        if (e.key === 'ArrowLeft') mostrar(indiceG - 1);
      });
      dlg.addEventListener('fechado', function () {
        areaAmpliada.classList.remove('zoom');
        irPara(indiceG);
        slides[indiceG].focus({ preventScroll: true });
      });
    }
    function mostrar(i) {
      indiceG = (i + imgs.length) % imgs.length;
      areaAmpliada.classList.remove('zoom');
      imagemGrande.src = imgs[indiceG].src;
      imagemGrande.alt = imgs[indiceG].alt;
      areaAmpliada.setAttribute('aria-label', imgs[indiceG].alt);
      contador.textContent = 'Foto ' + (indiceG + 1) + ' de ' + imgs.length;
    }
    function abrirAmpliada(i) {
      if (!dlg) criarAmpliada();
      mostrar(i);
      V.dialogo.abrir(dlg);
    }

    return wrap;
  }
})();
