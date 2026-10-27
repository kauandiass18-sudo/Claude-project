/* =============================================================
   NÚCLEO DA VITRINE
   Carregado no <head>, logo depois de config/marca.js.
   • aplica cores, fontes e proporções da marca antes da pintura;
   • normaliza e valida os dados do catálogo;
   • guarda favoritos e produtos vistos neste navegador;
   • oferece utilitários usados por todas as páginas e pelo painel.
   Não depende de nenhuma biblioteca externa.
   ============================================================= */
(function () {
  'use strict';

  var MARCA = window.MARCA || {};
  var V = (window.Vitrine = window.Vitrine || {});
  var raizDoc = document.documentElement;

  raizDoc.classList.add('js');

  // ---------------------------------------------------------------
  // Raiz do site: derivada do endereço deste script
  // (…/assets/js/nucleo.js → …/). Mantém links e imagens corretos
  // em qualquer pasta (inclusive /admin e páginas de erro).
  // ---------------------------------------------------------------
  var scriptAtual = document.currentScript;
  V.raiz = (function () {
    try {
      var src = scriptAtual && scriptAtual.src;
      if (src) return src.replace(/assets\/js\/nucleo\.js(\?.*)?$/, '');
    } catch (e) { /* segue para o padrão */ }
    return new URL('./', location.href).href;
  })();

  /** Resolve um caminho do catálogo (relativo à raiz) ou devolve a URL absoluta. */
  V.resolver = function (caminho) {
    if (!caminho) return '';
    caminho = String(caminho).trim();
    if (/^(https?:)?\/\//i.test(caminho) || /^(data|blob):/i.test(caminho)) return caminho;
    return V.raiz + caminho.replace(/^\.?\//, '');
  };

  // ---------------------------------------------------------------
  // Tema: cores, fontes e proporção das fotos vindas de config/marca.js
  // ---------------------------------------------------------------
  var mapaCores = {
    fundo: '--cor-fundo',
    superficie: '--cor-superficie',
    pocoImagem: '--cor-poco',
    texto: '--cor-tinta',
    textoSecundario: '--cor-tinta-2',
    textoSuave: '--cor-tinta-3',
    linha: '--cor-linha',
    destaque: '--cor-destaque',
    destaqueHover: '--cor-destaque-hover',
    textoSobreDestaque: '--cor-destaque-tinta'
  };
  var corValida = /^(#[0-9a-f]{3,8}|rgba?\([^;{}]*\)|hsla?\([^;{}]*\))$/i;
  var cores = MARCA.cores || {};
  Object.keys(mapaCores).forEach(function (chave) {
    var valor = cores[chave];
    if (typeof valor === 'string' && corValida.test(valor.trim())) {
      raizDoc.style.setProperty(mapaCores[chave], valor.trim());
    }
  });

  var tipo = MARCA.tipografia || {};
  var familiaSegura = /^[\w\s"',.-]+$/;
  if (tipo.titulos && familiaSegura.test(tipo.titulos)) raizDoc.style.setProperty('--fonte-titulo', tipo.titulos);
  if (tipo.texto && familiaSegura.test(tipo.texto)) raizDoc.style.setProperty('--fonte-texto', tipo.texto);
  if (tipo.mono && familiaSegura.test(tipo.mono)) raizDoc.style.setProperty('--fonte-mono', tipo.mono);
  if (tipo.googleFonts && /^family=[\w+:;@,.&=%-]+$/.test(tipo.googleFonts.replace(/\.\./g, '.'))) {
    var fonte = document.createElement('link');
    fonte.rel = 'stylesheet';
    fonte.href = 'https://fonts.googleapis.com/css2?' + tipo.googleFonts;
    document.head.appendChild(fonte);
  }

  var img = MARCA.imagens || {};
  if (img.proporcao && /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(img.proporcao)) {
    raizDoc.style.setProperty('--proporcao-foto', img.proporcao);
  }
  if (img.ajuste === 'cover') raizDoc.classList.add('fotos-preencher');
  if (img.integrarFundoBranco === false) raizDoc.classList.add('fotos-sem-integracao');

  // Preferência de movimento reduzido (consultada pelos scripts)
  var mqMovimento = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  V.movimentoReduzido = function () { return !!(mqMovimento && mqMovimento.matches); };

  // ---------------------------------------------------------------
  // Armazenamento local seguro (pode falhar em janela anônima)
  // ---------------------------------------------------------------
  V.armazenamento = {
    ler: function (chave, padrao) {
      try {
        var bruto = window.localStorage.getItem(chave);
        return bruto === null ? padrao : JSON.parse(bruto);
      } catch (e) { return padrao; }
    },
    gravar: function (chave, valor) {
      try { window.localStorage.setItem(chave, JSON.stringify(valor)); return true; }
      catch (e) { return false; }
    },
    remover: function (chave) {
      try { window.localStorage.removeItem(chave); } catch (e) { /* ignora */ }
    }
  };

  // ---------------------------------------------------------------
  // Texto e formatação
  // ---------------------------------------------------------------
  var formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var formatoNumero = new Intl.NumberFormat('pt-BR');

  V.formatarPreco = function (valor) { return formatoMoeda.format(valor); };
  V.formatarNumero = function (valor) { return formatoNumero.format(valor); };

  /** "2026-10-27" → "27/10/2026" (sem fuso horário). */
  V.formatarData = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  };

  /** Minúsculas e sem acentos, para busca e slugs. */
  V.semAcentos = function (texto) {
    return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  };

  V.criarSlug = function (texto) {
    return V.semAcentos(texto).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  };

  /** Aceita número (89.9) ou texto ("R$ 89,90", "1.299,00"). Devolve número > 0 ou null. */
  V.lerPreco = function (valor) {
    if (valor === null || valor === undefined || valor === '') return null;
    if (typeof valor === 'number') return isFinite(valor) && valor > 0 ? Math.round(valor * 100) / 100 : null;
    var limpo = String(valor).replace(/[^\d,.]/g, '');
    if (!limpo) return null;
    if (limpo.indexOf(',') !== -1) limpo = limpo.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) limpo = limpo.replace(/\./g, '');
    var n = parseFloat(limpo);
    return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
  };

  /** Título com *trecho em itálico* → fragmento DOM seguro (sem innerHTML). */
  V.tituloComEnfase = function (texto) {
    var frag = document.createDocumentFragment();
    String(texto || '').split(/(\*[^*]+\*)/).forEach(function (parte) {
      if (!parte) return;
      if (/^\*[^*]+\*$/.test(parte)) {
        var em = document.createElement('em');
        em.textContent = parte.slice(1, -1);
        frag.appendChild(em);
      } else {
        frag.appendChild(document.createTextNode(parte));
      }
    });
    return frag;
  };

  // ---------------------------------------------------------------
  // Construção de elementos sem innerHTML para dados
  // h('a', { class: 'x', href: '…', onclick: fn }, ['texto', outroElemento])
  // ---------------------------------------------------------------
  V.h = function (tag, atributos, filhos) {
    var el = document.createElement(tag);
    if (atributos) {
      Object.keys(atributos).forEach(function (nome) {
        var valor = atributos[nome];
        if (valor === null || valor === undefined || valor === false) return;
        if (nome.slice(0, 2) === 'on' && typeof valor === 'function') {
          el.addEventListener(nome.slice(2), valor);
        } else if (nome === 'class') {
          el.className = valor;
        } else if (nome === 'style' && typeof valor === 'object') {
          Object.keys(valor).forEach(function (p) { el.style.setProperty(p, valor[p]); });
        } else if (nome === 'dataset') {
          Object.keys(valor).forEach(function (d) { el.dataset[d] = valor[d]; });
        } else if (valor === true) {
          el.setAttribute(nome, '');
        } else {
          el.setAttribute(nome, String(valor));
        }
      });
    }
    V.anexar(el, filhos);
    return el;
  };

  V.anexar = function (el, filhos) {
    if (filhos === null || filhos === undefined || filhos === false) return el;
    if (!Array.isArray(filhos)) filhos = [filhos];
    filhos.forEach(function (f) {
      if (f === null || f === undefined || f === false) return;
      if (Array.isArray(f)) V.anexar(el, f);
      else el.appendChild(typeof f === 'object' ? f : document.createTextNode(String(f)));
    });
    return el;
  };

  // ---------------------------------------------------------------
  // Ícones (SVG estáticos e confiáveis: nunca recebem dados)
  // ---------------------------------------------------------------
  var ICONES = {
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    coracao: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    externo: '<path d="M14 5h5v5"/><path d="M19 5l-8.5 8.5"/><path d="M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    setaEsq: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    chevronBaixo: '<path d="m6 9 6 6 6-6"/>',
    chevronEsq: '<path d="m15 6-6 6 6 6"/>',
    filtro: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    compartilhar: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/>',
    ampliar: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    imagem: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="m4 16 4.5-4.5 4 4 2.5-2.5L20 18"/><circle cx="15.5" cy="9.5" r="1.3"/>',
    alerta: '<path d="M12 4 3 19h18L12 4Z"/><path d="M12 10v4M12 16.5v.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    estrela: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z"/>',
    caixa: '<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"/><path d="M4 8.5 12 13l8-4.5M12 13v7"/>',
    loja: '<path d="M5 9h14l-1 11H6L5 9Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
    lapis: '<path d="M5 19l1-4L16 5l3 3L9 18l-4 1Z"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  V.icone = function (nome, classe) {
    var span = document.createElement('span');
    span.className = 'icone' + (classe ? ' ' + classe : '');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">' + (ICONES[nome] || '') + '</svg>';
    return span;
  };

  // ---------------------------------------------------------------
  // Links de afiliado
  // O endereço é usado exatamente como foi cadastrado: nenhum
  // parâmetro é removido, trocado ou acrescentado.
  // ---------------------------------------------------------------
  V.linkValido = function (url) {
    if (typeof url !== 'string') return null;
    var limpo = url.trim();
    if (!/^https?:\/\//i.test(limpo) || /\s/.test(limpo)) return null;
    try {
      var u = new URL(limpo);
      if (!u.hostname || u.hostname.indexOf('.') === -1) return null;
      return limpo;
    } catch (e) { return null; }
  };

  V.ehLinkShopee = function (url) {
    try {
      var host = new URL(url).hostname.toLowerCase();
      return /(^|\.)shopee\.com\.br$/.test(host) || /(^|\.)shope\.ee$/.test(host) || /(^|\.)shopee\.com$/.test(host);
    } catch (e) { return false; }
  };

  // ---------------------------------------------------------------
  // Normalização do catálogo
  // ---------------------------------------------------------------
  var DISPONIBILIDADES = { disponivel: 1, esgotado: 1 };

  function normalizarImagens(lista, nome) {
    if (!Array.isArray(lista)) lista = lista ? [lista] : [];
    return lista.map(function (item) {
      if (typeof item === 'string') item = { src: item };
      if (!item || typeof item.src !== 'string' || !item.src.trim()) return null;
      return {
        src: V.resolver(item.src),
        pequena: item.pequena ? V.resolver(item.pequena) : '',
        alt: (item.alt && String(item.alt).trim()) || nome,
        original: item
      };
    }).filter(Boolean);
  }

  function normalizarAvaliacao(a) {
    if (!a || typeof a !== 'object') return null;
    var nota = typeof a.nota === 'number' ? a.nota : parseFloat(String(a.nota || '').replace(',', '.'));
    var qtd = parseInt(a.quantidade, 10);
    if (!(nota > 0 && nota <= 5) || !(qtd > 0)) return null;
    return { nota: Math.round(nota * 10) / 10, quantidade: qtd, conferidoEm: a.conferidoEm || '' };
  }

  function listaDeTextos(v) {
    if (Array.isArray(v)) return v.map(function (x) { return String(x || '').trim(); }).filter(Boolean);
    if (typeof v === 'string') return v.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    return [];
  }

  // ---------------------------------------------------------------
  // Roupas: tamanhos, cores e tabela de medidas
  // ---------------------------------------------------------------
  var ORDEM_LETRAS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'EG', 'EGG', 'G1', 'G2', 'G3', 'U', 'ÚNICO'];
  /** Ordena tamanhos: letras (PP…XGG), depois números, depois o resto. */
  V.ordenarTamanhos = function (lista) {
    function chave(t) {
      var i = ORDEM_LETRAS.indexOf(t);
      if (i !== -1) return [0, i];
      var n = parseFloat(t.replace(',', '.'));
      if (isFinite(n)) return [1, n];
      return [2, t];
    }
    return lista.slice().sort(function (a, b) {
      var x = chave(a), y = chave(b);
      if (x[0] !== y[0]) return x[0] - y[0];
      return x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0;
    });
  };
  /** "P–GG", "38–46" ou o único tamanho. */
  V.faixaTamanhos = function (lista) {
    if (!lista || !lista.length) return '';
    var o = V.ordenarTamanhos(lista);
    return o.length === 1 ? o[0] : o[0] + '–' + o[o.length - 1];
  };
  var HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  function normalizarCores(lista, totalImagens) {
    if (!Array.isArray(lista)) return [];
    return lista.map(function (c) {
      if (typeof c === 'string') c = { nome: c };
      if (!c || !String(c.nome || '').trim()) return null;
      var img = parseInt(c.imagem, 10);
      return {
        nome: String(c.nome).trim(),
        hex: HEX.test(String(c.hex || '').trim()) ? String(c.hex).trim() : '',
        imagem: img >= 0 && img < totalImagens ? img : null
      };
    }).filter(Boolean);
  }
  function normalizarMedidas(m) {
    if (!m) return null;
    if (typeof m === 'string') {
      var linhas = m.split('\n').map(function (l) { return l.split(/[;\t]/).map(function (x) { return x.trim(); }); }).filter(function (l) { return l.join(''); });
      if (linhas.length < 2) return null;
      m = { colunas: linhas[0], linhas: linhas.slice(1) };
    }
    if (!Array.isArray(m.colunas) || !Array.isArray(m.linhas) || !m.colunas.length || !m.linhas.length) return null;
    var n = m.colunas.length;
    return {
      colunas: m.colunas.map(String),
      linhas: m.linhas.filter(Array.isArray).map(function (l) { var r = l.slice(0, n).map(String); while (r.length < n) r.push(''); return r; }),
      observacao: String(m.observacao || '')
    };
  }

  /** Normaliza um produto e aponta os problemas de cadastro. */
  V.normalizarProduto = function (p, categoriasPorId) {
    p = p || {};
    var nome = String(p.nome || '').trim();
    var problemas = [];
    var preco = V.lerPreco(p.preco);
    var anterior = V.lerPreco(p.precoAnterior);
    if (anterior !== null && (preco === null || anterior <= preco)) anterior = null;
    var desconto = (preco !== null && anterior !== null) ? Math.round((1 - preco / anterior) * 100) : 0;
    if (desconto < 1) { desconto = 0; }
    var link = V.linkValido(p.linkAfiliado);
    var imagens = normalizarImagens(p.imagens, nome);
    var categoria = categoriasPorId && categoriasPorId[p.categoria] || null;

    if (!nome) problemas.push('Sem nome');
    if (!p.demo) {
      if (!String(p.linkAfiliado || '').trim()) problemas.push('Link de afiliado ausente');
      else if (!link) problemas.push('Link de afiliado inválido');
      else if (!V.ehLinkShopee(link)) problemas.push('Link não é da Shopee');
    }
    if (!imagens.length) problemas.push('Sem foto');
    if (!categoria) problemas.push('Sem categoria válida');

    var especificacoes = Array.isArray(p.especificacoes) ? p.especificacoes.map(function (e) {
      if (!e) return null;
      var rotulo = String(e.rotulo || '').trim(), valor = String(e.valor || '').trim();
      return rotulo && valor ? { rotulo: rotulo, valor: valor } : null;
    }).filter(Boolean) : [];

    var tamanhos = V.ordenarTamanhos(listaDeTextos(typeof p.tamanhos === 'string' ? p.tamanhos.replace(/,/g, '\n') : p.tamanhos).map(function (t) { return t.toUpperCase(); }));
    return {
      id: String(p.id || V.criarSlug(nome)),
      codigo: String(p.codigo || '').trim(),
      nome: nome,
      tamanhos: tamanhos.filter(function (t, i) { return tamanhos.indexOf(t) === i; }),
      cores: normalizarCores(p.cores, imagens.length),
      modelagem: String(p.modelagem || '').trim(),
      tecido: String(p.tecido || '').trim(),
      medidas: normalizarMedidas(p.medidas),
      categoria: categoria,
      categoriaId: p.categoria || '',
      imagens: imagens,
      descricaoCurta: String(p.descricaoCurta || '').trim(),
      descricao: String(p.descricao || '').trim(),
      caracteristicas: listaDeTextos(p.caracteristicas),
      especificacoes: especificacoes,
      preco: preco,
      precoAnterior: anterior,
      desconto: desconto,
      precoConferidoEm: p.precoConferidoEm || '',
      avaliacao: normalizarAvaliacao(p.avaliacao),
      link: link,
      textoBotao: String(p.textoBotao || '').trim(),
      disponibilidade: DISPONIBILIDADES[p.disponibilidade] ? p.disponibilidade : '',
      destaque: !!p.destaque,
      publicado: p.publicado !== false,
      palavrasChave: listaDeTextos(p.palavrasChave),
      adicionadoEm: /^\d{4}-\d{2}-\d{2}/.test(p.adicionadoEm || '') ? p.adicionadoEm : '',
      demo: !!p.demo,
      problemas: problemas,
      ordem: 0
    };
  };

  /** Pode levar o visitante à Shopee? */
  V.temLinkAtivo = function (produto) { return !!(produto && produto.link && !produto.demo); };

  var cache = null;
  /**
   * Catálogo pronto para uso público: só produtos publicados, com nome
   * e categoria válidos (e exemplos só quando exibirExemplos não é false).
   */
  V.catalogo = function () {
    if (cache) return cache;
    var bruto = window.CATALOGO;
    if (!bruto || typeof bruto !== 'object' || !Array.isArray(bruto.produtos)) {
      cache = { erro: true, categorias: [], produtos: [], porId: {}, selecoes: [], temExemplos: false };
      return cache;
    }
    var categoriasPorId = {};
    var categorias = (Array.isArray(bruto.categorias) ? bruto.categorias : []).map(function (c) {
      if (!c || !c.id || !c.nome) return null;
      var cat = { id: String(c.id), nome: String(c.nome), descricao: String(c.descricao || ''), total: 0 };
      categoriasPorId[cat.id] = cat;
      return cat;
    }).filter(Boolean);

    var exibirExemplos = MARCA.exibirExemplos !== false;
    var vistos = {};
    var produtos = [];
    bruto.produtos.forEach(function (p, i) {
      var n = V.normalizarProduto(p, categoriasPorId);
      if (!n.publicado || !n.nome || !n.categoria) return;
      if (n.demo && !exibirExemplos) return;
      if (vistos[n.id]) {
        if (window.console) console.warn('[Vitrine] Produto com identificador repetido ignorado:', n.id);
        return;
      }
      if (n.problemas.length && window.console) console.info('[Vitrine] Revise o cadastro de "' + n.nome + '":', n.problemas.join(', '));
      vistos[n.id] = n;
      n.ordem = i;
      n.categoria.total += 1;
      produtos.push(n);
    });

    var selecoes = (Array.isArray(bruto.selecoes) ? bruto.selecoes : []).map(function (s) {
      if (!s || !s.titulo) return null;
      var itens = (s.produtos || []).map(function (id) { return vistos[id]; }).filter(Boolean);
      return itens.length ? { id: String(s.id || V.criarSlug(s.titulo)), titulo: String(s.titulo), descricao: String(s.descricao || ''), produtos: itens } : null;
    }).filter(Boolean);

    cache = {
      erro: false,
      categorias: categorias.filter(function (c) { return c.total > 0; }),
      todasCategorias: categorias,
      produtos: produtos,
      porId: vistos,
      selecoes: selecoes,
      temExemplos: produtos.some(function (p) { return p.demo; })
    };
    return cache;
  };

  // ---------------------------------------------------------------
  // Busca: todos os termos precisam aparecer; o nome pesa mais.
  // ---------------------------------------------------------------
  V.buscar = function (produtos, termo) {
    var termos = V.semAcentos(termo).split(/\s+/).filter(Boolean);
    if (!termos.length) return produtos.slice();
    var resultado = [];
    produtos.forEach(function (p) {
      if (!p._busca) {
        p._busca = {
          nome: V.semAcentos(p.nome),
          resto: V.semAcentos([p.categoria && p.categoria.nome, p.palavrasChave.join(' '), p.descricaoCurta, p.caracteristicas.join(' '),
            p.modelagem, p.tecido, p.codigo, p.cores.map(function (c) { return c.nome; }).join(' ')].join(' '))
        };
      }
      var pontos = 0;
      for (var i = 0; i < termos.length; i++) {
        var t = termos[i];
        var noNome = p._busca.nome.indexOf(t);
        if (noNome !== -1) pontos += noNome === 0 || p._busca.nome.charAt(noNome - 1) === ' ' ? 4 : 3;
        else if (p._busca.resto.indexOf(t) !== -1) pontos += 1;
        else return;
      }
      resultado.push({ p: p, pontos: pontos });
    });
    resultado.sort(function (a, b) { return b.pontos - a.pontos || a.p.ordem - b.p.ordem; });
    return resultado.map(function (r) { return r.p; });
  };

  // ---------------------------------------------------------------
  // Endereços internos
  // ---------------------------------------------------------------
  V.url = {
    pagina: function (arquivo) { return V.raiz + arquivo; },
    produto: function (id) { return V.raiz + 'produto.html?p=' + encodeURIComponent(id); },
    catalogo: function (params) {
      var q = new URLSearchParams();
      Object.keys(params || {}).forEach(function (k) { if (params[k]) q.set(k, params[k]); });
      var s = q.toString();
      return V.raiz + 'catalogo.html' + (s ? '?' + s : '');
    }
  };

  // ---------------------------------------------------------------
  // Favoritos e vistos recentemente (somente neste navegador)
  // ---------------------------------------------------------------
  var CHAVE_FAV = 'vitrine:favoritos';
  var CHAVE_VISTOS = 'vitrine:vistos';

  V.favoritos = {
    lista: function () {
      var l = V.armazenamento.ler(CHAVE_FAV, []);
      return Array.isArray(l) ? l.filter(function (x) { return typeof x === 'string'; }) : [];
    },
    tem: function (id) { return V.favoritos.lista().indexOf(id) !== -1; },
    alternar: function (id) {
      var l = V.favoritos.lista();
      var i = l.indexOf(id);
      if (i === -1) l.unshift(id); else l.splice(i, 1);
      var ok = V.armazenamento.gravar(CHAVE_FAV, l);
      document.dispatchEvent(new CustomEvent('vitrine:favoritos', { detail: { id: id, ativo: i === -1, salvo: ok } }));
      return i === -1;
    },
    limpar: function () {
      V.armazenamento.remover(CHAVE_FAV);
      document.dispatchEvent(new CustomEvent('vitrine:favoritos', { detail: {} }));
    }
  };

  V.vistos = {
    lista: function () {
      var l = V.armazenamento.ler(CHAVE_VISTOS, []);
      return Array.isArray(l) ? l.filter(function (x) { return typeof x === 'string'; }) : [];
    },
    registrar: function (id) {
      var l = V.vistos.lista().filter(function (x) { return x !== id; });
      l.unshift(id);
      V.armazenamento.gravar(CHAVE_VISTOS, l.slice(0, 12));
    }
  };

  /** O painel marca este navegador como administrativo depois do login. */
  V.ehAdmin = function () { return V.armazenamento.ler('vitrine:admin', false) === true; };

  /**
   * Evento de clique no link de afiliado, para ferramentas de análise
   * que usem window.dataLayer (Google Tag Manager, por exemplo).
   * Não interfere na abertura do link.
   */
  V.registrarClique = function (produto, origem) {
    try {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'clique_afiliado', produto_id: produto.id, produto_nome: produto.nome, origem: origem });
      }
    } catch (e) { /* nunca bloqueia o clique */ }
  };
})();
