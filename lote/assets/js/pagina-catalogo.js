/* =============================================================
   CATÁLOGO
   Busca, categorias, seleções, filtros e ordenação, com o estado
   guardado no endereço (dá para compartilhar e voltar).
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var h = V.h;
  var cat = V.catalogo();
  var POR_PAGINA = 24;

  var el = {
    titulo: document.querySelector('[data-titulo]'),
    descricao: document.querySelector('[data-descricao]'),
    migalhas: document.querySelector('[data-migalhas]'),
    chips: document.querySelector('[data-chips]'),
    ferramentas: document.querySelector('[data-linha-ferramentas]'),
    ativos: document.querySelector('[data-ativos]'),
    contagem: document.querySelector('[data-contagem]'),
    area: document.querySelector('[data-area]'),
    barra: document.querySelector('[data-barra]')
  };

  if (cat.erro) {
    el.barra.hidden = true;
    el.area.appendChild(h('div', { class: 'estado', role: 'alert' }, [
      h('span', { class: 'estado__icone' }, V.icone('alerta')),
      h('h2', null, 'Não foi possível carregar o catálogo'),
      h('p', null, 'Verifique sua conexão e tente de novo.'),
      h('div', { class: 'estado__acoes' }, h('button', { type: 'button', class: 'botao botao--escuro', onclick: function () { location.reload(); } }, 'Tentar novamente'))
    ]));
    return;
  }

  // ---------------------------------------------------------------
  // Opções que só aparecem quando os dados permitem
  // ---------------------------------------------------------------
  var todos = cat.produtos;
  var comPreco = todos.filter(function (p) { return p.preco !== null; });
  var comDesconto = todos.filter(function (p) { return p.desconto > 0; });
  var comData = todos.filter(function (p) { return p.adicionadoEm; });
  var temEsgotados = todos.some(function (p) { return p.disponibilidade === 'esgotado'; });
  // Opções de roupa que existem no catálogo
  var TAMANHOS = V.ordenarTamanhos(uniq([].concat.apply([], todos.map(function (p) { return p.tamanhos; }))));
  var CORES = [];
  todos.forEach(function (p) { p.cores.forEach(function (c) { if (!CORES.some(function (x) { return x.nome === c.nome; })) CORES.push(c); }); });
  var MODELAGENS = uniq(todos.map(function (p) { return p.modelagem; }).filter(Boolean)).sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
  function uniq(l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); }
  function lista(v) { return v ? v.split(',').map(function (x) { return x.trim(); }).filter(Boolean) : []; }

  var ORDENS = [
    { id: '', rotulo: 'Seleção da casa' },
    comPreco.length >= 2 ? { id: 'menor-preco', rotulo: 'Menor preço' } : null,
    comPreco.length >= 2 ? { id: 'maior-preco', rotulo: 'Maior preço' } : null,
    comDesconto.length >= 2 ? { id: 'desconto', rotulo: 'Maior desconto' } : null,
    comData.length >= 2 ? { id: 'recentes', rotulo: 'Mais recentes' } : null,
    { id: 'nome', rotulo: 'Nome (A–Z)' }
  ].filter(Boolean);
  var ordensValidas = ORDENS.map(function (o) { return o.id; });

  // ---------------------------------------------------------------
  // Estado <-> endereço
  // ---------------------------------------------------------------
  function lerEstado() {
    var q = new URLSearchParams(location.search);
    var e = {
      q: (q.get('q') || '').slice(0, 80),
      categoria: q.get('categoria') || '',
      selecao: q.get('selecao') || '',
      ordem: q.get('ordem') || '',
      min: V.lerPreco(q.get('min')),
      max: V.lerPreco(q.get('max')),
      desconto: q.get('desconto') === '1',
      disponiveis: q.get('disponiveis') === '1',
      tam: lista(q.get('tam')).map(function (t) { return t.toUpperCase(); }).filter(function (t) { return TAMANHOS.indexOf(t) !== -1; }),
      cor: lista(q.get('cor')).filter(function (c) { return CORES.some(function (x) { return x.nome === c; }); }),
      mod: lista(q.get('mod')).filter(function (m) { return MODELAGENS.indexOf(m) !== -1; })
    };
    if (e.categoria && !cat.categorias.some(function (c) { return c.id === e.categoria; })) e.categoria = '';
    if (e.selecao && !cat.selecoes.some(function (s) { return s.id === e.selecao; })) e.selecao = '';
    if (ordensValidas.indexOf(e.ordem) === -1) e.ordem = '';
    if (e.min !== null && e.max !== null && e.min > e.max) { var t = e.min; e.min = e.max; e.max = t; }
    return e;
  }
  function paraConsulta(e) {
    var q = new URLSearchParams();
    if (e.q) q.set('q', e.q);
    if (e.categoria) q.set('categoria', e.categoria);
    if (e.selecao) q.set('selecao', e.selecao);
    if (e.ordem) q.set('ordem', e.ordem);
    if (e.min !== null) q.set('min', String(e.min));
    if (e.max !== null) q.set('max', String(e.max));
    if (e.desconto) q.set('desconto', '1');
    if (e.disponiveis) q.set('disponiveis', '1');
    if (e.tam.length) q.set('tam', e.tam.join(','));
    if (e.cor.length) q.set('cor', e.cor.join(','));
    if (e.mod.length) q.set('mod', e.mod.join(','));
    var s = q.toString();
    return s ? '?' + s : location.pathname.split('/').pop();
  }

  var estado = lerEstado();
  var limite = POR_PAGINA;

  function atualizar(mudancas, modo) {
    Object.keys(mudancas).forEach(function (k) { estado[k] = mudancas[k]; });
    limite = POR_PAGINA;
    var url = paraConsulta(estado);
    if (modo === 'substituir') history.replaceState(null, '', url);
    else history.pushState(null, '', url);
    render();
  }
  window.addEventListener('popstate', function () {
    estado = lerEstado();
    limite = POR_PAGINA;
    campo.value = estado.q;
    limparBusca.hidden = !estado.q;
    render();
  });

  // ---------------------------------------------------------------
  // Filtragem e ordenação
  // ---------------------------------------------------------------
  function escopoBase() {
    var lista = todos;
    if (estado.selecao) {
      var s = cat.selecoes.filter(function (x) { return x.id === estado.selecao; })[0];
      lista = s ? s.produtos : [];
    }
    if (estado.categoria) lista = lista.filter(function (p) { return p.categoria.id === estado.categoria; });
    if (estado.q) lista = V.buscar(lista, estado.q);
    return lista;
  }
  function aplicarFiltros(lista) {
    return lista.filter(function (p) {
      if (estado.min !== null && (p.preco === null || p.preco < estado.min)) return false;
      if (estado.max !== null && (p.preco === null || p.preco > estado.max)) return false;
      if (estado.desconto && !p.desconto) return false;
      if (estado.disponiveis && p.disponibilidade === 'esgotado') return false;
      if (estado.tam.length && !estado.tam.some(function (t) { return p.tamanhos.indexOf(t) !== -1; })) return false;
      if (estado.cor.length && !estado.cor.some(function (c) { return p.cores.some(function (x) { return x.nome === c; }); })) return false;
      if (estado.mod.length && estado.mod.indexOf(p.modelagem) === -1) return false;
      return true;
    });
  }
  function ordenar(lista) {
    var l = lista.slice();
    var semPrecoNoFim = function (a, b, f) {
      if (a.preco === null && b.preco === null) return a.ordem - b.ordem;
      if (a.preco === null) return 1;
      if (b.preco === null) return -1;
      return f(a, b) || a.ordem - b.ordem;
    };
    switch (estado.ordem) {
      case 'menor-preco': l.sort(function (a, b) { return semPrecoNoFim(a, b, function (x, y) { return x.preco - y.preco; }); }); break;
      case 'maior-preco': l.sort(function (a, b) { return semPrecoNoFim(a, b, function (x, y) { return y.preco - x.preco; }); }); break;
      case 'desconto': l.sort(function (a, b) { return b.desconto - a.desconto || a.ordem - b.ordem; }); break;
      case 'recentes': l.sort(function (a, b) { return (b.adicionadoEm || '').localeCompare(a.adicionadoEm || '') || a.ordem - b.ordem; }); break;
      case 'nome': l.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); }); break;
      default: if (!estado.q && !estado.selecao) l.sort(function (a, b) { return a.ordem - b.ordem; });
    }
    return l;
  }

  // ---------------------------------------------------------------
  // Barra de ferramentas: busca, ordenação, filtros
  // ---------------------------------------------------------------
  var idBusca = 'busca-catalogo';
  var campo = h('input', { type: 'search', id: idBusca, name: 'q', placeholder: 'Buscar peças', autocomplete: 'off', enterkeyhint: 'search', value: estado.q });
  campo.value = estado.q;
  var limparBusca = h('button', { type: 'button', class: 'campo-busca__limpar', 'aria-label': 'Limpar busca', hidden: !estado.q }, V.icone('fechar'));
  var formBusca = h('form', { class: 'campo-busca', role: 'search' }, [
    h('label', { class: 'sr-only', for: idBusca }, 'Buscar peças'),
    V.icone('busca'), campo, limparBusca
  ]);
  var timerBusca;
  campo.addEventListener('input', function () {
    limparBusca.hidden = !campo.value;
    clearTimeout(timerBusca);
    timerBusca = setTimeout(function () { atualizar({ q: campo.value.trim().slice(0, 80) }, 'substituir'); }, 180);
  });
  formBusca.addEventListener('submit', function (e) {
    e.preventDefault();
    clearTimeout(timerBusca);
    atualizar({ q: campo.value.trim().slice(0, 80) }, 'substituir');
    campo.blur();
    document.getElementById('resultados').focus({ preventScroll: true });
  });
  limparBusca.addEventListener('click', function () { campo.value = ''; limparBusca.hidden = true; atualizar({ q: '' }, 'substituir'); campo.focus(); });

  var selectOrdem = h('select', { id: 'ordenar', 'aria-label': 'Ordenar por' }, ORDENS.map(function (o) {
    return h('option', { value: o.id }, o.rotulo);
  }));
  selectOrdem.addEventListener('change', function () { atualizar({ ordem: selectOrdem.value }); });
  var areaOrdem = h('div', { class: 'selecao barra-filtros__ordenar' }, [selectOrdem, V.icone('chevronBaixo')]);

  var contadorFiltros = h('span', { class: 'contador', 'aria-hidden': 'true' });
  var botaoFiltros = h('button', { type: 'button', class: 'botao botao--suave botao--filtros', 'aria-haspopup': 'dialog' }, [V.icone('filtro'), h('span', null, 'Filtrar'), contadorFiltros]);

  el.ferramentas.appendChild(h('div', { class: 'barra-filtros__busca' }, formBusca));
  el.ferramentas.appendChild(areaOrdem);
  el.ferramentas.appendChild(botaoFiltros);

  // ---------------------------------------------------------------
  // Painel de filtros
  // ---------------------------------------------------------------
  var temFaixaPreco = comPreco.length >= 2;
  var grupos = [];
  var radiosOrdem = ORDENS.map(function (o) {
    var r = h('input', { type: 'radio', name: 'ordem-painel', value: o.id });
    r.addEventListener('change', function () { if (r.checked) atualizar({ ordem: o.id }); });
    return { input: r, el: h('label', { class: 'opcao-radio' }, [r, o.rotulo]) };
  });
  grupos.push(h('fieldset', { class: 'filtros__grupo', style: { border: '0', padding: '0', margin: '0' } }, [
    h('legend', { class: 'filtros__titulo rotulo' }, 'Ordenar por'),
    h('div', { class: 'filtros__ordenar' }, radiosOrdem.map(function (x) { return x.el; }))
  ]));

  function alternar(chave, valor) {
    var l = estado[chave].slice();
    var i = l.indexOf(valor);
    if (i === -1) l.push(valor); else l.splice(i, 1);
    var m = {}; m[chave] = l;
    atualizar(m, 'substituir');
  }
  var botoesTamanho = [], botoesCor = [], checksModelagem = [];
  if (TAMANHOS.length > 1) {
    botoesTamanho = TAMANHOS.map(function (t) {
      var b = h('button', { type: 'button', class: 'chip chip--tamanho', 'aria-pressed': 'false', dataset: { valor: t } }, t);
      b.addEventListener('click', function () { alternar('tam', t); });
      return b;
    });
    grupos.push(h('div', { class: 'filtros__grupo', role: 'group', 'aria-labelledby': 'titulo-tam' }, [
      h('p', { class: 'filtros__titulo rotulo', id: 'titulo-tam' }, 'Tamanho'),
      h('div', { class: 'filtros__opcoes' }, botoesTamanho),
      h('p', { class: 'filtros__dica' }, 'Tamanhos informados na última conferência. Confirme na Shopee.')
    ]));
  }
  if (CORES.length > 1) {
    botoesCor = CORES.map(function (c) {
      var b = h('button', { type: 'button', class: 'filtro-cor', 'aria-pressed': 'false', dataset: { valor: c.nome } }, [c.hex ? h('span', { class: 'amostra', style: { '--amostra': c.hex } }) : null, c.nome]);
      b.addEventListener('click', function () { alternar('cor', c.nome); });
      return b;
    });
    grupos.push(h('div', { class: 'filtros__grupo', role: 'group', 'aria-labelledby': 'titulo-cor' }, [
      h('p', { class: 'filtros__titulo rotulo', id: 'titulo-cor' }, 'Cor'),
      h('div', { class: 'filtros__opcoes' }, botoesCor)
    ]));
  }
  if (MODELAGENS.length > 1) {
    checksModelagem = MODELAGENS.map(function (m) {
      var c = h('input', { type: 'checkbox', value: m });
      c.addEventListener('change', function () { alternar('mod', m); });
      var total = todos.filter(function (p) { return p.modelagem === m; }).length;
      return { input: c, el: h('label', { class: 'opcao-marcar' }, [c, m, h('span', { class: 'opcao-marcar__total' }, String(total))]) };
    });
    grupos.push(h('div', { class: 'filtros__grupo', role: 'group', 'aria-labelledby': 'titulo-mod' }, [
      h('p', { class: 'filtros__titulo rotulo', id: 'titulo-mod' }, 'Modelagem')
    ].concat(checksModelagem.map(function (x) { return x.el; }))));
  }

  var inputMin, inputMax;
  if (temFaixaPreco) {
    var precos = comPreco.map(function (p) { return p.preco; });
    var menor = Math.floor(Math.min.apply(null, precos));
    var maior = Math.ceil(Math.max.apply(null, precos));
    inputMin = h('input', { type: 'number', inputmode: 'decimal', min: '0', step: '1', placeholder: String(menor), id: 'preco-min' });
    inputMax = h('input', { type: 'number', inputmode: 'decimal', min: '0', step: '1', placeholder: String(maior), id: 'preco-max' });
    var timerPreco;
    var aoMudarPreco = function () {
      clearTimeout(timerPreco);
      timerPreco = setTimeout(function () {
        atualizar({ min: V.lerPreco(inputMin.value), max: V.lerPreco(inputMax.value) }, 'substituir');
      }, 350);
    };
    inputMin.addEventListener('input', aoMudarPreco);
    inputMax.addEventListener('input', aoMudarPreco);
    grupos.push(h('div', { class: 'filtros__grupo', role: 'group', 'aria-labelledby': 'titulo-preco' }, [
      h('p', { class: 'filtros__titulo rotulo', id: 'titulo-preco' }, 'Faixa de preço'),
      h('div', { class: 'filtros__faixa' }, [
        h('label', { class: 'campo-numero', for: 'preco-min' }, ['Mínimo (R$)', inputMin]),
        h('label', { class: 'campo-numero', for: 'preco-max' }, ['Máximo (R$)', inputMax])
      ]),
      h('p', { class: 'filtros__dica' }, 'Produtos sem preço informado ficam de fora quando a faixa está ativa.')
    ]));
  }

  var checkDesconto, checkDisponiveis;
  if (comDesconto.length || temEsgotados) {
    var opcoes = [];
    if (comDesconto.length) {
      checkDesconto = h('input', { type: 'checkbox' });
      checkDesconto.addEventListener('change', function () { atualizar({ desconto: checkDesconto.checked }); });
      opcoes.push(h('label', { class: 'opcao-marcar' }, [checkDesconto, 'Somente com preço reduzido', h('span', { class: 'opcao-marcar__total' }, String(comDesconto.length))]));
    }
    if (temEsgotados) {
      checkDisponiveis = h('input', { type: 'checkbox' });
      checkDisponiveis.addEventListener('change', function () { atualizar({ disponiveis: checkDisponiveis.checked }); });
      opcoes.push(h('label', { class: 'opcao-marcar' }, [checkDisponiveis, 'Ocultar esgotados']));
    }
    grupos.push(h('div', { class: 'filtros__grupo', role: 'group', 'aria-label': 'Outras opções' }, [h('p', { class: 'filtros__titulo rotulo' }, 'Mostrar')].concat(opcoes)));
  }

  var botaoVer = h('button', { type: 'button', class: 'botao botao--claro', 'data-fechar': '' }, 'Ver peças');
  var botaoLimparPainel = h('button', { type: 'button', class: 'botao botao--suave' }, 'Limpar filtros');
  var painel = h('dialog', { class: 'dialogo dialogo--gaveta dialogo--folha', 'aria-labelledby': 'titulo-filtros' }, [
    h('div', { class: 'dialogo__cabecalho' }, [
      h('h2', { class: 'dialogo__titulo', id: 'titulo-filtros' }, 'Filtrar e ordenar'),
      h('button', { type: 'button', class: 'botao-icone', 'aria-label': 'Fechar', 'data-fechar': '' }, V.icone('fechar'))
    ]),
    h('div', { class: 'dialogo__corpo' }, grupos),
    h('div', { class: 'dialogo__rodape' }, [botaoLimparPainel, botaoVer])
  ]);
  document.body.appendChild(V.dialogo.preparar(painel));
  botaoFiltros.addEventListener('click', function () { V.dialogo.abrir(painel); });
  painel.addEventListener('fechado', function () { botaoFiltros.focus(); });
  botaoLimparPainel.addEventListener('click', function () {
    atualizar({ min: null, max: null, desconto: false, disponiveis: false, ordem: '', tam: [], cor: [], mod: [] });
  });

  // No desktop o botão só aparece se houver filtros além da ordenação
  if (grupos.length === 1) botaoFiltros.classList.add('so-mobile');

  // ---------------------------------------------------------------
  // Renderização
  // ---------------------------------------------------------------
  function chipsCategorias() {
    el.chips.textContent = '';
    var base = estado.selecao ? escopoSelecao() : todos;
    var comBusca = estado.q ? V.buscar(base, estado.q) : base;
    var opcoes = [{ id: '', nome: 'Tudo', total: comBusca.length }].concat(cat.categorias.map(function (c) {
      return { id: c.id, nome: c.nome, total: comBusca.filter(function (p) { return p.categoria === c; }).length };
    }));
    opcoes.forEach(function (o) {
      if (o.id && !o.total && estado.categoria !== o.id) return;
      var ativo = estado.categoria === o.id;
      var b = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(ativo) }, [o.nome, h('span', { class: 'chip__total' }, String(o.total))]);
      b.addEventListener('click', function () { if (!ativo) atualizar({ categoria: o.id }); });
      el.chips.appendChild(b);
    });
    var atual = el.chips.querySelector('[aria-pressed="true"]');
    if (atual && atual.scrollIntoView && el.chips.scrollWidth > el.chips.clientWidth) {
      el.chips.scrollLeft = Math.max(0, atual.offsetLeft - 24);
    }
  }
  function escopoSelecao() {
    var s = cat.selecoes.filter(function (x) { return x.id === estado.selecao; })[0];
    return s ? s.produtos : [];
  }

  function cabecalhoPagina() {
    var c = estado.categoria && cat.categorias.filter(function (x) { return x.id === estado.categoria; })[0];
    var s = estado.selecao && cat.selecoes.filter(function (x) { return x.id === estado.selecao; })[0];
    var titulo = 'Tudo', descricao = 'Todas as peças do lote, na ordem em que foram escolhidas.';
    if (s) { titulo = s.titulo; descricao = s.descricao || 'Uma seleção editorial da vitrine.'; }
    else if (c) { titulo = c.nome; descricao = c.descricao || ''; }
    if (estado.q && !c && !s) { titulo = '“' + estado.q + '”'; descricao = 'Resultados da busca.'; }
    el.titulo.textContent = titulo;
    el.descricao.textContent = descricao;
    el.descricao.hidden = !descricao;

    el.migalhas.textContent = '';
    var itens = [h('li', null, h('a', { href: V.url.pagina('index.html') }, 'Início'))];
    if (c || s) {
      itens.push(h('li', null, h('a', { href: V.url.pagina('catalogo.html') }, 'Tudo')));
      itens.push(h('li', null, h('span', { 'aria-current': 'page' }, (s || c).titulo || c.nome)));
    } else {
      itens.push(h('li', null, h('span', { 'aria-current': 'page' }, 'Tudo')));
    }
    V.anexar(el.migalhas, itens);

    V.definirMeta({
      titulo: titulo + ' · ' + (M.nome || 'Vitrine'),
      descricao: descricao || M.descricao,
      consulta: c ? '?categoria=' + c.id : s ? '?selecao=' + s.id : ''
    });
  }

  function filtrosAtivos() {
    var ativos = [];
    var s = estado.selecao && cat.selecoes.filter(function (x) { return x.id === estado.selecao; })[0];
    if (s) ativos.push({ rotulo: 'Seleção: ' + s.titulo, limpar: { selecao: '' } });
    if (estado.q) ativos.push({ rotulo: 'Busca: “' + estado.q + '”', limpar: { q: '' } });
    if (estado.min !== null || estado.max !== null) {
      var r = estado.min !== null && estado.max !== null ? V.formatarPreco(estado.min) + ' a ' + V.formatarPreco(estado.max)
        : estado.min !== null ? 'A partir de ' + V.formatarPreco(estado.min) : 'Até ' + V.formatarPreco(estado.max);
      ativos.push({ rotulo: r, limpar: { min: null, max: null }, filtro: true });
    }
    if (estado.desconto) ativos.push({ rotulo: 'Com preço reduzido', limpar: { desconto: false }, filtro: true });
    if (estado.disponiveis) ativos.push({ rotulo: 'Sem esgotados', limpar: { disponiveis: false }, filtro: true });
    if (estado.tam.length) ativos.push({ rotulo: 'Tam. ' + estado.tam.join(', '), limpar: { tam: [] }, filtro: true });
    if (estado.cor.length) ativos.push({ rotulo: 'Cor: ' + estado.cor.join(', '), limpar: { cor: [] }, filtro: true });
    if (estado.mod.length) ativos.push({ rotulo: estado.mod.join(', '), limpar: { mod: [] }, filtro: true });
    return ativos;
  }

  function renderAtivos(ativos) {
    el.ativos.textContent = '';
    var lista = ativos.slice();
    if (estado.categoria) {
      var c = cat.categorias.filter(function (x) { return x.id === estado.categoria; })[0];
      if (c) lista.unshift({ rotulo: c.nome, limpar: { categoria: '' } });
    }
    el.ativos.hidden = !lista.length;
    lista.forEach(function (a) {
      var b = h('button', { type: 'button', class: 'chip chip--removivel', 'aria-label': 'Remover filtro: ' + a.rotulo }, [a.rotulo, V.icone('fechar')]);
      b.addEventListener('click', function () {
        if ('q' in a.limpar) { campo.value = ''; limparBusca.hidden = true; }
        atualizar(a.limpar);
      });
      el.ativos.appendChild(b);
    });
    if (lista.length > 1) {
      el.ativos.appendChild(h('button', { type: 'button', class: 'ativos__limpar', onclick: limparTudo }, 'Limpar tudo'));
    }
  }

  function limparTudo() {
    campo.value = ''; limparBusca.hidden = true;
    atualizar({ q: '', categoria: '', selecao: '', min: null, max: null, desconto: false, disponiveis: false, tam: [], cor: [], mod: [] });
  }

  function sincronizarControles(ativos) {
    selectOrdem.value = estado.ordem;
    radiosOrdem.forEach(function (r) { r.input.checked = r.input.value === estado.ordem; });
    if (estado.q && !estado.ordem) {
      selectOrdem.options[0].textContent = 'Relevância';
      radiosOrdem[0].el.lastChild.textContent = 'Relevância';
    } else {
      selectOrdem.options[0].textContent = ORDENS[0].rotulo;
      radiosOrdem[0].el.lastChild.textContent = ORDENS[0].rotulo;
    }
    if (inputMin && document.activeElement !== inputMin) inputMin.value = estado.min !== null ? String(estado.min) : '';
    if (inputMax && document.activeElement !== inputMax) inputMax.value = estado.max !== null ? String(estado.max) : '';
    if (checkDesconto) checkDesconto.checked = estado.desconto;
    if (checkDisponiveis) checkDisponiveis.checked = estado.disponiveis;
    botoesTamanho.forEach(function (b) { b.setAttribute('aria-pressed', String(estado.tam.indexOf(b.dataset.valor) !== -1)); });
    botoesCor.forEach(function (b) { b.setAttribute('aria-pressed', String(estado.cor.indexOf(b.dataset.valor) !== -1)); });
    checksModelagem.forEach(function (x) { x.input.checked = estado.mod.indexOf(x.input.value) !== -1; });
    var n = ativos.filter(function (a) { return a.filtro; }).length;
    contadorFiltros.textContent = n ? String(n) : '';
    botaoFiltros.setAttribute('aria-label', n ? 'Filtrar, ' + n + (n === 1 ? ' filtro ativo' : ' filtros ativos') : 'Filtrar e ordenar');
  }

  var primeiraVez = true;
  function render() {
    var base = escopoBase();
    var resultado = ordenar(aplicarFiltros(base));
    var ativos = filtrosAtivos();

    cabecalhoPagina();
    chipsCategorias();
    renderAtivos(ativos);
    sincronizarControles(ativos);
    botaoVer.textContent = resultado.length === 1 ? 'Ver 1 peça' : 'Ver ' + resultado.length + ' peças';

    el.contagem.textContent = resultado.length === 0 ? '' :
      (resultado.length === 1 ? '1 peça' : resultado.length + ' peças') +
      (resultado.length > limite ? ' · mostrando ' + limite : '');

    el.area.textContent = '';
    if (!resultado.length) {
      el.area.appendChild(estadoVazio(ativos));
      return;
    }
    var visiveis = resultado.slice(0, limite);
    var grade = h('div', { class: 'grade' }, visiveis.map(function (p, i) {
      return V.cartao(p, { indice: i, origem: 'catalogo', revelar: primeiraVez, prioridade: primeiraVez && i < 4, tituloTag: 'h2' });
    }));
    el.area.appendChild(grade);
    if (resultado.length > limite) {
      var mais = h('div', { style: { display: 'flex', 'justify-content': 'center', 'margin-top': '48px' } },
        h('button', { type: 'button', class: 'botao botao--contorno' }, 'Mostrar mais ' + Math.min(POR_PAGINA, resultado.length - limite) + ' peças'));
      mais.firstChild.addEventListener('click', function () {
        var focar = limite;
        limite += POR_PAGINA;
        render();
        var cards = el.area.querySelectorAll('.cartao__link');
        if (cards[focar]) cards[focar].focus();
      });
      el.area.appendChild(mais);
    }
    if (primeiraVez) V.revelar(el.area);
    else if (!V.movimentoReduzido()) grade.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
    primeiraVez = false;
  }

  function estadoVazio(ativos) {
    var termo = estado.q;
    var c = estado.categoria && cat.categorias.filter(function (x) { return x.id === estado.categoria; })[0];
    var acoes = [];
    if (ativos.length || estado.categoria) acoes.push(h('button', { type: 'button', class: 'botao botao--claro', onclick: limparTudo }, 'Limpar busca e filtros'));
    if (termo && (c || estado.selecao)) acoes.push(h('button', { type: 'button', class: 'botao botao--suave', onclick: function () { atualizar({ categoria: '', selecao: '' }); } }, 'Buscar em todo o catálogo'));
    var titulo = termo ? 'Nada para “' + termo + '”' + (c ? ' em ' + c.nome : '') : 'Nenhuma peça com esses filtros';
    var dica = termo ? 'Confira a grafia ou procure por um termo mais geral, como “cargo”, “oversized” ou o tecido.' : 'Tente outro tamanho, outra cor ou remova algum filtro.';
    var sugestoes = todos.filter(function (p) { return p.destaque; }).slice(0, 4);
    return h('div', null, [
      h('div', { class: 'estado' }, [
        h('span', { class: 'estado__icone' }, V.icone('busca')),
        h('h2', null, titulo),
        h('p', null, dica),
        acoes.length ? h('div', { class: 'estado__acoes' }, acoes) : null
      ]),
      sugestoes.length ? h('section', { 'aria-labelledby': 'titulo-sugestoes', style: { 'padding-bottom': 'var(--secao)' } }, [
        h('h2', { class: 'titulo-secao', id: 'titulo-sugestoes', style: { 'font-size': 'var(--t-xl)', 'margin-bottom': '24px' } }, 'Em destaque'),
        h('div', { class: 'grade' }, sugestoes.map(function (p, i) { return V.cartao(p, { indice: i, origem: 'sugestao-vazio', revelar: false }); }))
      ]) : null
    ]);
  }

  // Sombra na barra quando ela gruda no topo
  if ('IntersectionObserver' in window) {
    var sentinela = h('div', { 'aria-hidden': 'true', style: { height: '1px' } });
    el.barra.parentNode.insertBefore(sentinela, el.barra);
    new IntersectionObserver(function (en) { el.barra.classList.toggle('barra-filtros--fixa', !en[0].isIntersecting); }).observe(sentinela);
  }

  render();
})();
