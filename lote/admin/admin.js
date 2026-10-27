/* =============================================================
   PAINEL ADMINISTRATIVO DA VITRINE
   -------------------------------------------------------------
   Dois modos:
   • GitHub: lê data/catalogo.js do repositório e publica as
     alterações (catálogo + fotos + sitemap) em um único commit.
   • Local: edita uma cópia do catálogo publicado e permite baixar
     o arquivo data/catalogo.js para substituir manualmente.

   As edições ficam num rascunho salvo neste navegador até serem
   publicadas. Nada é enviado a outros servidores além do GitHub.
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var h = V.h;
  var GH = window.VitrineGitHub;
  var app = document.querySelector('[data-app]');

  var CFG_PADRAO = (M.admin && M.admin.github) || {};
  var CHAVE_TOKEN = 'vitrine:admin:token';
  var CHAVE_REPO = 'vitrine:admin:repositorio';
  var CHAVE_RASCUNHO = 'vitrine:admin:rascunho';
  var CAMINHO_CATALOGO = 'data/catalogo.js';
  var PASTA_FOTOS = 'assets/img/produtos/';
  var ID_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  var CABECALHO_PADRAO = '/* =============================================================\n' +
    '   CATÁLOGO: categorias, seleções e produtos\n' +
    '   Gerado pelo painel (/admin). Também pode ser editado à mão.\n' +
    '   ============================================================= */\n\n';

  var estado = {
    modo: null,          // 'github' | 'local'
    cfg: null,           // { dono, repositorio, branch, pasta, token }
    cliente: null,
    cabecalho: CABECALHO_PADRAO,
    base: null,          // catálogo como está publicado
    sha: null,           // sha do arquivo publicado (modo GitHub)
    rascunho: null,      // catálogo em edição
    uploads: {},         // caminho relativo → { base64, tipo, url }
    avisoRascunho: null,
    ultimaPublicacao: null
  };

  // ---------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------
  function copia(x) { return JSON.parse(JSON.stringify(x)); }
  function hoje() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function aleatorio(n) {
    var s = '', a = 'abcdefghijkmnpqrstuvwxyz23456789';
    var r = crypto.getRandomValues(new Uint8Array(n));
    for (var i = 0; i < n; i++) s += a[r[i] % a.length];
    return s;
  }
  function caminhoRepo(rel) {
    var pasta = String(estado.cfg && estado.cfg.pasta || '').replace(/^\/+|\/+$/g, '');
    return (pasta ? pasta + '/' : '') + rel;
  }
  function urlImagem(src) {
    if (!src) return '';
    return estado.uploads[src] ? estado.uploads[src].url : V.resolver(src);
  }
  function campo(rotulo, controle, ajuda, opcional, id) {
    id = id || ('c-' + aleatorio(6));
    controle.id = id;
    var extra = [];
    if (ajuda) { var idAjuda = id + '-ajuda'; controle.setAttribute('aria-describedby', idAjuda); extra.push(h('p', { class: 'adm-ajuda', id: idAjuda }, ajuda)); }
    return h('div', { class: 'adm-campo' }, [
      h('label', { for: id }, [rotulo, opcional ? h('span', { class: 'opcional' }, ' (opcional)') : null]),
      controle
    ].concat(extra));
  }
  function alerta(tipo, conteudo, acoes) {
    return h('div', { class: 'adm-alerta adm-alerta--' + tipo, role: tipo === 'erro' ? 'alert' : 'status' }, [
      V.icone(tipo === 'ok' ? 'check' : 'alerta'),
      h('div', null, [h('div', null, conteudo), acoes && acoes.length ? h('div', { class: 'adm-alerta__acoes' }, acoes) : null])
    ]);
  }
  function botao(texto, classe, aoClicar, atributos) {
    var b = h('button', Object.assign({ type: 'button', class: 'botao ' + (classe || 'botao--suave') }, atributos || {}), texto);
    if (aoClicar) b.addEventListener('click', aoClicar);
    return b;
  }
  function botaoMini(icone, rotulo, aoClicar, atributos) {
    var b = h('button', Object.assign({ type: 'button', class: 'adm-botao-mini', 'aria-label': rotulo, title: rotulo }, atributos || {}), V.icone(icone));
    if (aoClicar) b.addEventListener('click', aoClicar);
    return b;
  }
  var iconeAlca = '<svg viewBox="0 0 14 18" fill="currentColor" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="4" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/><circle cx="4" cy="15" r="1.5"/><circle cx="10" cy="15" r="1.5"/></svg>';
  function lerSessao(chave) {
    try { return sessionStorage.getItem(chave) || localStorage.getItem(chave); } catch (e) { return null; }
  }

  // ---------------------------------------------------------------
  // Modelo de dados
  // ---------------------------------------------------------------
  function produtoVazio() {
    return {
      id: '', codigo: '', nome: '', categoria: '', imagens: [], cores: [], tamanhos: [], modelagem: '', tecido: '', medidas: null,
      descricaoCurta: '', descricao: '',
      caracteristicas: [], especificacoes: [], preco: null, precoAnterior: null, precoConferidoEm: '',
      avaliacao: null, linkAfiliado: '', textoBotao: '', disponibilidade: '', destaque: false,
      publicado: true, palavrasChave: [], adicionadoEm: hoje(), demo: false
    };
  }
  /** Completa campos ausentes (arquivos editados à mão podem omitir campos). */
  function completarProduto(p) {
    var base = produtoVazio();
    var r = Object.assign(base, p || {});
    r.imagens = (Array.isArray(r.imagens) ? r.imagens : r.imagens ? [r.imagens] : []).map(function (i) {
      return typeof i === 'string' ? { src: i, pequena: '', alt: '' } : { src: i.src || '', pequena: i.pequena || '', alt: i.alt || '' };
    }).filter(function (i) { return i.src; });
    ['caracteristicas', 'palavrasChave'].forEach(function (k) {
      if (typeof r[k] === 'string') r[k] = r[k].split(/\n|,/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (!Array.isArray(r[k])) r[k] = [];
    });
    if (!Array.isArray(r.especificacoes)) r.especificacoes = [];
    if (typeof r.tamanhos === 'string') r.tamanhos = r.tamanhos.split(/[,\s]+/);
    r.tamanhos = (Array.isArray(r.tamanhos) ? r.tamanhos : []).map(function (t) { return String(t).trim().toUpperCase(); }).filter(Boolean);
    r.cores = (Array.isArray(r.cores) ? r.cores : []).map(function (c) {
      if (typeof c === 'string') c = { nome: c };
      var img = parseInt(c && c.imagem, 10);
      return c && c.nome ? { nome: String(c.nome), hex: String(c.hex || ''), imagem: img >= 0 ? img : null } : null;
    }).filter(Boolean);
    r.codigo = String(r.codigo || '');
    r.modelagem = String(r.modelagem || '');
    r.tecido = String(r.tecido || '');
    if (!r.medidas || !Array.isArray(r.medidas.colunas)) r.medidas = null;
    r.preco = V.lerPreco(r.preco);
    r.precoAnterior = V.lerPreco(r.precoAnterior);
    r.publicado = r.publicado !== false;
    r.destaque = !!r.destaque;
    r.demo = !!r.demo;
    if (!r.id) r.id = V.criarSlug(r.nome) || 'produto-' + aleatorio(5);
    return r;
  }
  function completarCatalogo(d) {
    d = d && typeof d === 'object' ? d : {};
    return {
      versao: 1,
      atualizadoEm: d.atualizadoEm || hoje(),
      categorias: (Array.isArray(d.categorias) ? d.categorias : []).filter(function (c) { return c && c.id; }).map(function (c) {
        return { id: String(c.id), nome: String(c.nome || c.id), descricao: String(c.descricao || '') };
      }),
      selecoes: (Array.isArray(d.selecoes) ? d.selecoes : []).filter(function (s) { return s && s.titulo; }).map(function (s) {
        return { id: String(s.id || V.criarSlug(s.titulo)), titulo: String(s.titulo), descricao: String(s.descricao || ''), produtos: Array.isArray(s.produtos) ? s.produtos.slice() : [] };
      }),
      produtos: (Array.isArray(d.produtos) ? d.produtos : []).map(completarProduto)
    };
  }
  function categoriasPorId(dados) {
    var mapa = {};
    dados.categorias.forEach(function (c) { mapa[c.id] = { id: c.id, nome: c.nome, descricao: c.descricao, total: 0 }; });
    return mapa;
  }
  function normalizado(p) {
    var n = V.normalizarProduto(p, categoriasPorId(estado.rascunho));
    n.imagens.forEach(function (i) {
      if (estado.uploads[i.original.src]) i.src = estado.uploads[i.original.src].url;
      if (i.original.pequena && estado.uploads[i.original.pequena]) i.pequena = estado.uploads[i.original.pequena].url;
      else if (estado.uploads[i.original.src]) i.pequena = '';
    });
    return n;
  }
  function linksRepetidos(dados) {
    var vistos = {}, repetidos = {};
    dados.produtos.forEach(function (p) {
      var l = String(p.linkAfiliado || '').trim();
      if (!l) return;
      if (vistos[l]) { repetidos[l] = true; } else vistos[l] = p.id;
    });
    return repetidos;
  }
  function problemasDe(p, repetidos) {
    var n = normalizado(p);
    var lista = n.problemas.slice();
    if (repetidos && repetidos[String(p.linkAfiliado || '').trim()]) lista.push('Link repetido em outro produto');
    return lista;
  }

  // ---------------------------------------------------------------
  // Leitura e gravação do arquivo do catálogo
  // ---------------------------------------------------------------
  function lerTextoCatalogo(texto) {
    var i = texto.indexOf('window.CATALOGO');
    if (i === -1) return Promise.reject(new Error('O arquivo não define window.CATALOGO.'));
    var cabecalho = texto.slice(0, i);
    var resto = texto.slice(i);
    var ini = resto.indexOf('{'), fim = resto.lastIndexOf('}');
    try {
      return Promise.resolve({ cabecalho: cabecalho, dados: JSON.parse(resto.slice(ini, fim + 1)) });
    } catch (e) {
      // Arquivo editado à mão com sintaxe JavaScript (comentários, aspas simples…):
      // executa como o próprio site faz e lê o resultado.
      return avaliarComoScript(texto).then(function (d) { return { cabecalho: cabecalho, dados: d }; });
    }
  }
  function avaliarComoScript(texto) {
    return new Promise(function (resolver, rejeitar) {
      var anterior = window.CATALOGO;
      window.CATALOGO = undefined;
      var url = URL.createObjectURL(new Blob([texto], { type: 'text/javascript' }));
      var s = document.createElement('script');
      var terminar = function (ok) {
        var d = window.CATALOGO;
        window.CATALOGO = anterior;
        URL.revokeObjectURL(url);
        s.remove();
        if (ok && d && typeof d === 'object') resolver(copia(d));
        else rejeitar(new Error('O arquivo data/catalogo.js tem um erro de sintaxe. Corrija-o (vírgulas, aspas, chaves) e tente de novo.'));
      };
      s.onload = function () { terminar(true); };
      s.onerror = function () { terminar(false); };
      s.src = url;
      document.head.appendChild(s);
    });
  }
  function serializar(dados) {
    var limpo = completarCatalogo(dados);
    limpo.atualizadoEm = hoje();
    limpo.produtos = limpo.produtos.map(function (p) {
      return {
        id: p.id, codigo: p.codigo, nome: p.nome.trim(), categoria: p.categoria,
        imagens: p.imagens.map(function (i) { var o = { src: i.src }; if (i.pequena) o.pequena = i.pequena; o.alt = i.alt || ''; return o; }),
        cores: p.cores.map(function (c) { return { nome: c.nome, hex: c.hex, imagem: c.imagem }; }),
        tamanhos: p.tamanhos, modelagem: p.modelagem, tecido: p.tecido, medidas: p.medidas,
        descricaoCurta: p.descricaoCurta.trim(), descricao: p.descricao.trim(),
        caracteristicas: p.caracteristicas, especificacoes: p.especificacoes.filter(function (e) { return e.rotulo && e.valor; }),
        preco: p.preco, precoAnterior: p.precoAnterior, precoConferidoEm: p.precoConferidoEm,
        avaliacao: p.avaliacao, linkAfiliado: String(p.linkAfiliado || '').trim(), textoBotao: p.textoBotao,
        disponibilidade: p.disponibilidade, destaque: p.destaque, publicado: p.publicado,
        palavrasChave: p.palavrasChave, adicionadoEm: p.adicionadoEm, demo: p.demo
      };
    });
    return (estado.cabecalho || CABECALHO_PADRAO) + 'window.CATALOGO = ' + JSON.stringify(limpo, null, 2) + ';\n';
  }

  // ---------------------------------------------------------------
  // Rascunho salvo no navegador
  // ---------------------------------------------------------------
  var falhaRascunho = false;
  function identificacaoRepo() {
    return estado.modo === 'github' ? estado.cfg.dono + '/' + estado.cfg.repositorio + '@' + estado.cfg.branch : 'local';
  }
  function salvarRascunho() {
    if (!temAlteracoes()) { V.armazenamento.remover(CHAVE_RASCUNHO); falhaRascunho = false; return; }
    var uploads = {};
    Object.keys(estado.uploads).forEach(function (k) { uploads[k] = { base64: estado.uploads[k].base64, tipo: estado.uploads[k].tipo }; });
    falhaRascunho = !V.armazenamento.gravar(CHAVE_RASCUNHO, {
      repo: identificacaoRepo(), sha: estado.sha, dados: estado.rascunho, uploads: uploads, salvoEm: new Date().toISOString()
    });
    if (falhaRascunho) V.avisar('Não foi possível salvar o rascunho neste navegador. Publique ou baixe uma cópia antes de fechar.');
  }
  function restaurarUploads(uploads) {
    estado.uploads = {};
    Object.keys(uploads || {}).forEach(function (k) {
      var u = uploads[k];
      if (u && u.base64) estado.uploads[k] = { base64: u.base64, tipo: u.tipo, url: 'data:' + u.tipo + ';base64,' + u.base64 };
    });
  }
  window.addEventListener('beforeunload', function (e) {
    if (falhaRascunho && temAlteracoes()) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------------------------------------------------------------
  // Diferenças entre o publicado e o rascunho
  // ---------------------------------------------------------------
  function diferencas() {
    var d = { novos: [], alterados: [], removidos: [], ordem: false, categorias: false, selecoes: false, fotos: 0 };
    if (!estado.base || !estado.rascunho) return d;
    var antes = {}; estado.base.produtos.forEach(function (p) { antes[p.id] = p; });
    var depois = {}; estado.rascunho.produtos.forEach(function (p) { depois[p.id] = p; });
    estado.rascunho.produtos.forEach(function (p) {
      if (!antes[p.id]) d.novos.push(p);
      else if (JSON.stringify(antes[p.id]) !== JSON.stringify(p)) d.alterados.push(p);
    });
    estado.base.produtos.forEach(function (p) { if (!depois[p.id]) d.removidos.push(p); });
    var ordemAntes = estado.base.produtos.map(function (p) { return p.id; }).filter(function (id) { return depois[id]; });
    var ordemDepois = estado.rascunho.produtos.map(function (p) { return p.id; }).filter(function (id) { return antes[id]; });
    d.ordem = ordemAntes.join('|') !== ordemDepois.join('|');
    d.categorias = JSON.stringify(estado.base.categorias) !== JSON.stringify(estado.rascunho.categorias);
    d.selecoes = JSON.stringify(estado.base.selecoes) !== JSON.stringify(estado.rascunho.selecoes);
    d.fotos = fotosEmUso().filter(function (src) { return estado.uploads[src]; }).length;
    d.total = d.novos.length + d.alterados.length + d.removidos.length + (d.ordem ? 1 : 0) + (d.categorias ? 1 : 0) + (d.selecoes ? 1 : 0);
    return d;
  }
  function temAlteracoes() { return diferencas().total > 0; }
  function fotosEmUso(dados) {
    var lista = [];
    (dados || estado.rascunho).produtos.forEach(function (p) {
      p.imagens.forEach(function (i) { lista.push(i.src); if (i.pequena) lista.push(i.pequena); });
    });
    return lista;
  }

  function alterar(fn) {
    fn(estado.rascunho);
    salvarRascunho();
    atualizarBarra();
  }

  // ---------------------------------------------------------------
  // Fotos: redimensiona no navegador (1200 px e 600 px, WebP)
  // ---------------------------------------------------------------
  function redimensionar(bitmap, maximo) {
    var escala = Math.min(1, maximo / Math.max(bitmap.width, bitmap.height));
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bitmap.width * escala));
    c.height = Math.max(1, Math.round(bitmap.height * escala));
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, c.width, c.height);
    return new Promise(function (resolver) {
      c.toBlob(function (b) {
        if (b && b.type === 'image/webp') return resolver(b);
        c.toBlob(function (j) { resolver(j); }, 'image/jpeg', 0.86);
      }, 'image/webp', 0.82);
    });
  }
  function blobParaBase64(blob) {
    return blob.arrayBuffer().then(function (buf) { return GH.bytesParaBase64(new Uint8Array(buf)); });
  }
  function processarFoto(arquivo, idProduto) {
    if (!/^image\//.test(arquivo.type)) return Promise.reject(new Error('“' + arquivo.name + '” não é uma imagem.'));
    if (arquivo.size > 25 * 1024 * 1024) return Promise.reject(new Error('“' + arquivo.name + '” passa de 25 MB.'));
    return createImageBitmap(arquivo).catch(function () {
      throw new Error('Não foi possível ler “' + arquivo.name + '”. Use JPG, PNG ou WebP.');
    }).then(function (bmp) {
      return Promise.all([redimensionar(bmp, 1200), redimensionar(bmp, 600)]);
    }).then(function (blobs) {
      var ext = blobs[0].type === 'image/webp' ? 'webp' : 'jpg';
      var nome = PASTA_FOTOS + (V.criarSlug(idProduto) || 'produto') + '-' + aleatorio(5);
      var grande = nome + '-1200.' + ext, pequena = nome + '-600.' + ext;
      return Promise.all([blobParaBase64(blobs[0]), blobParaBase64(blobs[1])]).then(function (b64) {
        estado.uploads[grande] = { base64: b64[0], tipo: blobs[0].type, url: 'data:' + blobs[0].type + ';base64,' + b64[0] };
        estado.uploads[pequena] = { base64: b64[1], tipo: blobs[1].type, url: 'data:' + blobs[1].type + ';base64,' + b64[1] };
        return { src: grande, pequena: pequena, alt: '' };
      });
    });
  }

  // ---------------------------------------------------------------
  // Entrada
  // ---------------------------------------------------------------
  function telaEntrada(mensagemErro) {
    document.title = 'Painel · ' + (M.nome || 'Vitrine');
    var salvo = V.armazenamento.ler(CHAVE_REPO, null) || {};
    var cfg = {
      dono: salvo.dono || CFG_PADRAO.dono || '',
      repositorio: salvo.repositorio || CFG_PADRAO.repositorio || '',
      branch: salvo.branch || CFG_PADRAO.branch || 'main',
      pasta: salvo.pasta !== undefined ? salvo.pasta : (CFG_PADRAO.pasta || '')
    };
    var token = h('input', { type: 'password', autocomplete: 'off', spellcheck: 'false', placeholder: 'github_pat_…', required: true });
    var mostrar = botao('Mostrar', 'botao--suave', function () {
      var vis = token.type === 'password';
      token.type = vis ? 'text' : 'password';
      mostrar.textContent = vis ? 'Ocultar' : 'Mostrar';
    });
    var dono = h('input', { type: 'text', value: cfg.dono, autocomplete: 'off', spellcheck: 'false' });
    var repo = h('input', { type: 'text', value: cfg.repositorio, autocomplete: 'off', spellcheck: 'false' });
    var branch = h('input', { type: 'text', value: cfg.branch, autocomplete: 'off', spellcheck: 'false' });
    var pasta = h('input', { type: 'text', value: cfg.pasta, autocomplete: 'off', spellcheck: 'false' });
    var lembrar = h('input', { type: 'checkbox' });
    var areaErro = h('div', { 'aria-live': 'polite' }, mensagemErro ? alerta('erro', mensagemErro) : null);
    var enviar = h('button', { type: 'submit', class: 'botao botao--escuro botao--grande' }, 'Conectar e abrir o painel');

    var form = h('form', { class: 'adm-form', novalidate: true }, [
      h('div', { class: 'adm-campo' }, [
        h('label', { for: 'token' }, 'Token de acesso do GitHub'),
        h('div', { class: 'adm-campo-com-botao' }, [token, mostrar]),
        h('p', { class: 'adm-ajuda', id: 'token-ajuda' }, 'Fica guardado só neste navegador e nunca é gravado nos arquivos do site.')
      ]),
      h('details', { class: 'adm-detalhes' }, [
        h('summary', null, 'Repositório: ' + cfg.dono + '/' + cfg.repositorio + ' · branch ' + cfg.branch),
        h('div', { class: 'adm-linha adm-linha--2' }, [
          campo('Dono (usuário ou organização)', dono),
          campo('Repositório', repo),
          campo('Branch publicada', branch, 'A branch que o GitHub Pages (ou sua hospedagem) publica.'),
          campo('Pasta da vitrine', pasta, 'Vazio se a vitrine estiver na raiz do repositório.', true)
        ])
      ]),
      h('label', { class: 'adm-marcar' }, [lembrar, h('span', null, ['Lembrar neste dispositivo', h('small', null, 'Use só em um computador ou celular pessoal.')])]),
      areaErro,
      h('div', null, enviar)
    ]);
    token.id = 'token';
    token.setAttribute('aria-describedby', 'token-ajuda');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = token.value.trim();
      if (!t) { areaErro.textContent = ''; areaErro.appendChild(alerta('erro', 'Cole o token de acesso para conectar.')); token.focus(); return; }
      var nova = { dono: dono.value.trim(), repositorio: repo.value.trim(), branch: branch.value.trim() || 'main', pasta: pasta.value.trim().replace(/^\/+|\/+$/g, '') };
      if (!nova.dono || !nova.repositorio) { areaErro.textContent = ''; areaErro.appendChild(alerta('erro', 'Informe o dono e o nome do repositório.')); return; }
      enviar.disabled = true;
      enviar.textContent = 'Conectando…';
      conectarGitHub(Object.assign({ token: t }, nova), lembrar.checked).catch(function (err) {
        enviar.disabled = false;
        enviar.textContent = 'Conectar e abrir o painel';
        areaErro.textContent = '';
        areaErro.appendChild(alerta('erro', err.message));
      });
    });

    app.textContent = '';
    app.appendChild(h('div', { class: 'conteiner adm-entrada' }, [
      h('p', { class: 'adm-entrada__marca' }, [M.nome || 'Vitrine', h('span', null, 'Painel')]),
      h('h1', { class: 'titulo-pagina' }, V.tituloComEnfase('Painel da *vitrine*')),
      h('p', { class: 'texto-apoio' }, 'Cadastre produtos, envie fotos, organize categorias e publique no site. As alterações ficam em rascunho até você publicar.'),
      h('div', { class: 'adm-entrada__grade' }, [
        h('section', { class: 'adm-cartao', 'aria-labelledby': 'titulo-github' }, [
          h('h2', { id: 'titulo-github' }, 'Publicar direto no site'),
          h('p', null, 'O painel grava as alterações no repositório do GitHub que hospeda a vitrine. O site atualiza sozinho em cerca de um minuto.'),
          form,
          h('details', { class: 'adm-detalhes' }, [
            h('summary', null, 'Como criar o token (uma vez só)'),
            h('ol', { class: 'adm-passos' }, [
              h('li', null, ['Abra ', h('a', { href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener' }, 'github.com/settings/personal-access-tokens/new'), ' (Fine-grained token).']),
              h('li', null, 'Em “Repository access”, escolha “Only select repositories” e selecione apenas o repositório da vitrine.'),
              h('li', null, ['Em “Repository permissions”, defina ', h('code', null, 'Contents'), ' como ', h('code', null, 'Read and write'), '. Nenhuma outra permissão é necessária.']),
              h('li', null, 'Escolha uma validade, gere o token e cole aqui. Se ele vazar, revogue na mesma página do GitHub.')
            ])
          ])
        ]),
        h('section', { class: 'adm-cartao', 'aria-labelledby': 'titulo-local' }, [
          h('h2', { id: 'titulo-local' }, 'Editar sem conexão'),
          h('p', null, 'Edite uma cópia do catálogo publicado e baixe o arquivo data/catalogo.js para substituir no projeto. Neste modo, as fotos precisam ser copiadas para a pasta assets/img/produtos/ manualmente.'),
          h('div', { style: { 'margin-top': '24px' } }, botao('Abrir editor local', 'botao--contorno botao--grande', abrirLocal))
        ])
      ])
    ]));
    token.focus();
  }

  function conectarGitHub(cfg, lembrar) {
    var cliente = new GH.Cliente(cfg);
    return cliente.verificar().then(function () {
      return cliente.lerArquivo(caminhoRepoCom(cfg, CAMINHO_CATALOGO));
    }).then(function (arq) {
      var leitura = arq ? lerTextoCatalogo(arq.texto) : Promise.resolve({ cabecalho: CABECALHO_PADRAO, dados: {} });
      return leitura.then(function (r) {
        try {
          sessionStorage.removeItem(CHAVE_TOKEN); localStorage.removeItem(CHAVE_TOKEN);
          (lembrar ? localStorage : sessionStorage).setItem(CHAVE_TOKEN, cfg.token);
        } catch (e) { /* armazenamento indisponível: segue só nesta aba */ }
        V.armazenamento.gravar(CHAVE_REPO, { dono: cfg.dono, repositorio: cfg.repositorio, branch: cfg.branch, pasta: cfg.pasta });
        estado.modo = 'github';
        estado.cfg = cfg;
        estado.cliente = cliente;
        iniciar(r, arq ? arq.sha : null);
      });
    });
  }
  function caminhoRepoCom(cfg, rel) {
    var pasta = String(cfg.pasta || '').replace(/^\/+|\/+$/g, '');
    return (pasta ? pasta + '/' : '') + rel;
  }

  function abrirLocal() {
    estado.modo = 'local';
    estado.cfg = { pasta: CFG_PADRAO.pasta || '' };
    var publicado = window.CATALOGO;
    iniciar({ cabecalho: CABECALHO_PADRAO, dados: publicado ? copia(publicado) : {} }, null);
  }

  function iniciar(leitura, sha) {
    estado.cabecalho = leitura.cabecalho || CABECALHO_PADRAO;
    estado.base = completarCatalogo(leitura.dados);
    estado.sha = sha;
    estado.rascunho = copia(estado.base);
    estado.uploads = {};
    estado.avisoRascunho = null;
    V.armazenamento.gravar('vitrine:admin', true);

    var r = V.armazenamento.ler(CHAVE_RASCUNHO, null);
    if (r && r.repo === identificacaoRepo() && r.dados) {
      var dados = completarCatalogo(r.dados);
      if (JSON.stringify(dados) !== JSON.stringify(estado.base)) estado.avisoRascunho = r;
    }
    montarEstrutura();
    if (!location.hash) location.replace('#produtos'); else rotear();
  }

  function sair() {
    if (temAlteracoes() && !window.confirm('Há alterações não publicadas. Elas continuam salvas como rascunho neste navegador. Sair mesmo assim?')) return;
    try { sessionStorage.removeItem(CHAVE_TOKEN); localStorage.removeItem(CHAVE_TOKEN); } catch (e) { /* ignora */ }
    V.armazenamento.remover('vitrine:admin');
    estado.modo = null;
    history.replaceState(null, '', location.pathname);
    telaEntrada();
  }

  // ---------------------------------------------------------------
  // Estrutura do painel
  // ---------------------------------------------------------------
  var conteudo, abas, barra, statusEl;
  function montarEstrutura() {
    app.textContent = '';
    statusEl = h('span', { class: 'adm-status' + (estado.modo === 'local' ? ' adm-status--local' : '') },
      estado.modo === 'github' ? estado.cfg.dono + '/' + estado.cfg.repositorio + ' · ' + estado.cfg.branch : 'Modo local (sem conexão)');
    var topo = h('header', { class: 'adm-topo' }, [
      h('div', { class: 'conteiner adm-topo__interno' }, [
        V.marca(),
        h('span', { class: 'adm-topo__rotulo' }, 'Painel'),
        statusEl,
        h('div', { class: 'adm-topo__acoes' }, [
          h('a', { href: V.url.pagina('index.html'), target: '_blank', rel: 'noopener' }, [V.icone('externo'), h('span', { class: 'texto-longo-opcional' }, 'Ver site')]),
          h('button', { type: 'button', onclick: sair }, 'Sair')
        ])
      ]),
      h('nav', { class: 'conteiner adm-abas', 'aria-label': 'Seções do painel' })
    ]);
    abas = topo.querySelector('.adm-abas');
    conteudo = h('main', { class: 'conteiner adm-conteudo', id: 'adm-conteudo', tabindex: '-1' });
    barra = h('div', { class: 'adm-barra', role: 'region', 'aria-label': 'Alterações pendentes', hidden: true });
    app.appendChild(topo);
    app.appendChild(conteudo);
    app.appendChild(barra);
  }

  function atualizarAbas(atual) {
    var d = diferencas();
    var itens = [
      ['produtos', 'Peças', String(estado.rascunho.produtos.length)],
      ['categorias', 'Categorias', String(estado.rascunho.categorias.length)],
      ['selecoes', 'Combinações', String(estado.rascunho.selecoes.length)],
      ['links', 'Links', null],
      ['publicar', 'Publicar', d.total ? String(d.total) : null]
    ];
    abas.textContent = '';
    itens.forEach(function (i) {
      abas.appendChild(h('a', { href: '#' + i[0], 'aria-current': atual === i[0] ? 'page' : null }, [
        i[1], i[2] ? h('span', { class: 'contador' + (i[0] === 'publicar' ? ' contador--destaque' : '') }, i[2]) : null
      ]));
    });
  }

  function atualizarBarra() {
    if (!barra) return;
    var d = diferencas();
    var rota = (location.hash || '').slice(1);
    barra.textContent = '';
    barra.hidden = !d.total || rota === 'publicar' || /^produto=|^novo|^selecao=/.test(rota);
    if (!barra.hidden) {
      barra.appendChild(h('span', null, d.total === 1 ? '1 alteração não publicada' : d.total + ' alterações não publicadas'));
      barra.appendChild(h('a', { class: 'botao botao--destaque', href: '#publicar' }, estado.modo === 'github' ? 'Revisar e publicar' : 'Revisar e baixar'));
    }
    if (abas) atualizarAbas(rotaAba(rota));
  }
  function rotaAba(rota) {
    if (/^produto=|^novo/.test(rota)) return 'produtos';
    if (/^selecao=/.test(rota)) return 'selecoes';
    return rota || 'produtos';
  }

  var editorSujo = false;
  window.addEventListener('hashchange', function () {
    if (!estado.modo) return;
    rotear();
  });
  function rotear() {
    var rota = (location.hash || '#produtos').slice(1);
    atualizarAbas(rotaAba(rota));
    conteudo.textContent = '';
    editorSujo = false;
    if (estado.avisoRascunho && !/^produto=|^novo/.test(rota)) conteudo.appendChild(avisoDeRascunho());
    var m;
    if ((m = /^produto=(.+)$/.exec(rota))) telaEditor(decodeURIComponent(m[1]));
    else if (rota === 'novo') telaEditor(null);
    else if (rota === 'categorias') telaCategorias();
    else if (rota === 'selecoes') telaSelecoes();
    else if ((m = /^selecao=(.+)$/.exec(rota))) telaSelecao(decodeURIComponent(m[1]));
    else if (rota === 'links') telaLinks();
    else if (rota === 'publicar') telaPublicar();
    else telaProdutos();
    atualizarBarra();
    window.scrollTo(0, 0);
  }

  function avisoDeRascunho() {
    var r = estado.avisoRascunho;
    var quando = new Date(r.salvoEm);
    var texto = 'Você tem um rascunho não publicado, salvo em ' + quando.toLocaleDateString('pt-BR') + ' às ' + quando.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '.';
    if (estado.modo === 'github' && r.sha && r.sha !== estado.sha) texto += ' O catálogo publicado mudou desde então: ao publicar o rascunho, ele substitui a versão atual.';
    return alerta('aviso', texto, [
      botao('Continuar o rascunho', 'botao--escuro', function () {
        estado.rascunho = completarCatalogo(r.dados);
        restaurarUploads(r.uploads);
        estado.avisoRascunho = null;
        salvarRascunho();
        rotear();
        V.avisar('Rascunho restaurado');
      }),
      botao('Descartar', 'botao--suave', function () {
        if (!window.confirm('Descartar o rascunho salvo? Esta ação não pode ser desfeita.')) return;
        V.armazenamento.remover(CHAVE_RASCUNHO);
        estado.avisoRascunho = null;
        rotear();
      })
    ]);
  }

  // ---------------------------------------------------------------
  // Produtos
  // ---------------------------------------------------------------
  var filtroProdutos = { termo: '', tipo: '' };
  function telaProdutos() {
    document.title = 'Produtos · Painel';
    var dados = estado.rascunho;
    var temExemplos = dados.produtos.some(function (p) { return p.demo; });
    var repetidos = linksRepetidos(dados);

    var busca = h('input', { type: 'search', placeholder: 'Buscar por nome ou identificador', value: filtroProdutos.termo, 'aria-label': 'Buscar produtos' });
    busca.value = filtroProdutos.termo;
    var tipo = h('select', { 'aria-label': 'Mostrar' }, [
      ['', 'Todos'], ['publicados', 'Publicados'], ['rascunhos', 'Não publicados'], ['destaques', 'Em destaque'], ['pendencias', 'Com pendências'], ['exemplos', 'Exemplos']
    ].map(function (o) { return h('option', { value: o[0], selected: filtroProdutos.tipo === o[0] }, o[1]); }));

    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, [
      h('div', null, [
        h('h1', null, 'Peças'),
        h('p', null, 'A ordem desta lista é a ordem “Seleção da casa” do site. Arraste pela alça ou use as setas para reorganizar.')
      ]),
      h('div', { class: 'adm-cabecalho__acoes' }, [
        temExemplos ? botao('Remover exemplos', 'botao--suave', removerExemplos) : null,
        h('a', { class: 'botao botao--escuro', href: '#novo' }, '+ Nova peça')
      ])
    ]));

    if (temExemplos) {
      conteudo.appendChild(h('div', { style: { 'margin-bottom': '16px' } }, alerta('info', 'O catálogo tem produtos de exemplo (etiqueta “Exemplo”). Eles não têm link de compra. Quando cadastrar os seus produtos, use “Remover exemplos” e publique.')));
    }

    conteudo.appendChild(h('div', { class: 'adm-ferramentas' }, [
      h('div', { class: 'campo-busca' }, [V.icone('busca'), busca]),
      h('div', { class: 'selecao' }, [tipo, V.icone('chevronBaixo')])
    ]));
    var dica = h('p', { class: 'adm-dica-ordem' });
    var lista = h('ol', { class: 'adm-lista', 'aria-label': 'Produtos' });
    conteudo.appendChild(dica);
    conteudo.appendChild(lista);

    function filtrar() {
      var termo = V.semAcentos(filtroProdutos.termo);
      return dados.produtos.filter(function (p) {
        if (termo && V.semAcentos(p.nome + ' ' + p.id).indexOf(termo) === -1) return false;
        switch (filtroProdutos.tipo) {
          case 'publicados': return p.publicado;
          case 'rascunhos': return !p.publicado;
          case 'destaques': return p.destaque;
          case 'pendencias': return problemasDe(p, repetidos).length > 0;
          case 'exemplos': return p.demo;
          default: return true;
        }
      });
    }
    function render() {
      var itens = filtrar();
      var podeOrdenar = !filtroProdutos.termo && !filtroProdutos.tipo;
      dica.textContent = podeOrdenar ? itens.length + (itens.length === 1 ? ' produto' : ' produtos') : 'Mostrando ' + itens.length + ' de ' + dados.produtos.length + '. Limpe a busca e o filtro para reorganizar a ordem.';
      lista.textContent = '';
      if (!itens.length) {
        lista.appendChild(h('li', { class: 'adm-vazio' }, dados.produtos.length
          ? [h('p', null, 'Nenhum produto corresponde à busca.')]
          : [h('p', null, 'Nenhum produto cadastrado ainda.'), h('p', null, h('a', { class: 'botao botao--escuro', href: '#novo', style: { 'margin-top': '12px' } }, 'Cadastrar o primeiro produto'))]));
        return;
      }
      itens.forEach(function (p) { lista.appendChild(linhaProduto(p, podeOrdenar, repetidos, render)); });
    }
    busca.addEventListener('input', function () { filtroProdutos.termo = busca.value.trim(); render(); });
    tipo.addEventListener('change', function () { filtroProdutos.tipo = tipo.value; render(); });
    render();
  }

  function linhaProduto(p, podeOrdenar, repetidos, rerender) {
    var dados = estado.rascunho;
    var indice = dados.produtos.indexOf(p);
    var cat = dados.categorias.filter(function (c) { return c.id === p.categoria; })[0];
    var problemas = problemasDe(p, repetidos);

    var mini = h('span', { class: 'adm-miniatura' }, p.imagens.length
      ? h('img', { src: urlImagem(p.imagens[0].pequena || p.imagens[0].src), alt: '', loading: 'lazy' })
      : V.semFoto(''));
    var selos = [
      h('span', { class: 'adm-selo ' + (p.publicado ? 'adm-selo--publicado' : 'adm-selo--rascunho') }, p.publicado ? 'Publicado' : 'Não publicado'),
      p.destaque ? h('span', { class: 'adm-selo adm-selo--destaque' }, 'Destaque') : null,
      p.demo ? h('span', { class: 'adm-selo adm-selo--exemplo' }, 'Exemplo') : null,
      p.disponibilidade === 'esgotado' ? h('span', { class: 'adm-selo' }, 'Esgotado') : null
    ].concat(problemas.map(function (x) { return h('span', { class: 'adm-selo adm-selo--problema' }, x); }));

    var alca = h('span', { class: 'adm-alca', 'aria-hidden': 'true', 'aria-disabled': String(!podeOrdenar) });
    alca.innerHTML = iconeAlca;

    var li = h('li', { class: 'adm-item', dataset: { id: p.id } }, [
      alca,
      mini,
      h('div', { class: 'adm-item__texto' }, [
        h('a', { class: 'adm-item__nome', href: '#produto=' + encodeURIComponent(p.id) }, p.nome || '(sem nome)'),
        h('div', { class: 'adm-item__meta' }, [
          h('span', null, cat ? cat.nome : 'Sem categoria'),
          h('span', { class: 'numero' }, p.preco !== null ? V.formatarPreco(p.preco) : 'Sem preço'),
          h('span', null, p.id)
        ]),
        h('div', { class: 'adm-selos' }, selos)
      ]),
      h('div', { class: 'adm-item__acoes' }, [
        botaoMini('estrela', p.destaque ? 'Tirar do destaque' : 'Destacar', function () { alterar(function () { p.destaque = !p.destaque; }); rerender(); }, { 'aria-pressed': String(p.destaque) }),
        botaoMini(p.publicado ? 'check' : 'caixa', p.publicado ? 'Despublicar' : 'Publicar', function () { alterar(function () { p.publicado = !p.publicado; }); rerender(); }),
        botaoMini('chevronBaixo', 'Mover para cima', function () { mover(indice, indice - 1); rerender(); }, { disabled: !podeOrdenar || indice === 0 }),
        botaoMini('chevronBaixo', 'Mover para baixo', function () { mover(indice, indice + 1); rerender(); }, { disabled: !podeOrdenar || indice === dados.produtos.length - 1 }),
        botaoMini('lapis', 'Editar', function () { location.hash = '#produto=' + encodeURIComponent(p.id); }),
        botaoMini('fechar', 'Remover', function () { removerProduto(p); rerender(); }, { class: 'adm-botao-mini adm-botao-mini--perigo' })
      ])
    ]);
    // seta "para cima" é o mesmo ícone girado
    li.querySelectorAll('.adm-botao-mini')[2].querySelector('.icone').style.transform = 'rotate(180deg)';

    if (podeOrdenar) {
      li.draggable = true;
      li.addEventListener('dragstart', function (e) {
        if (!e.target.closest || e.target !== li) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', p.id);
        li.classList.add('arrastando');
      });
      li.addEventListener('dragend', function () { li.classList.remove('arrastando'); });
      li.addEventListener('dragover', function (e) {
        e.preventDefault();
        var r = li.getBoundingClientRect();
        var antes = e.clientY < r.top + r.height / 2;
        li.classList.toggle('alvo-antes', antes);
        li.classList.toggle('alvo-depois', !antes);
      });
      li.addEventListener('dragleave', function () { li.classList.remove('alvo-antes', 'alvo-depois'); });
      li.addEventListener('drop', function (e) {
        e.preventDefault();
        var antes = li.classList.contains('alvo-antes');
        li.classList.remove('alvo-antes', 'alvo-depois');
        var origem = dados.produtos.map(function (x) { return x.id; }).indexOf(e.dataTransfer.getData('text/plain'));
        var destino = dados.produtos.indexOf(p) + (antes ? 0 : 1);
        if (origem === -1) return;
        if (origem < destino) destino--;
        mover(origem, destino);
        rerender();
      });
    }
    return li;
  }
  function mover(de, para) {
    var lista = estado.rascunho.produtos;
    if (para < 0 || para >= lista.length || de === para) return;
    alterar(function () { lista.splice(para, 0, lista.splice(de, 1)[0]); });
  }
  function removerProduto(p) {
    if (!window.confirm('Remover “' + p.nome + '” do catálogo? Ao publicar, ele sai do site.')) return false;
    alterar(function (d) {
      d.produtos.splice(d.produtos.indexOf(p), 1);
      d.selecoes.forEach(function (s) { s.produtos = s.produtos.filter(function (id) { return id !== p.id; }); });
    });
    V.avisar('Produto removido do rascunho');
    return true;
  }
  function removerExemplos() {
    var n = estado.rascunho.produtos.filter(function (p) { return p.demo; }).length;
    if (!window.confirm('Remover os ' + n + ' produtos de exemplo do catálogo? Seleções que ficarem vazias também são removidas.')) return;
    alterar(function (d) {
      var ids = d.produtos.filter(function (p) { return p.demo; }).map(function (p) { return p.id; });
      d.produtos = d.produtos.filter(function (p) { return !p.demo; });
      d.selecoes.forEach(function (s) { s.produtos = s.produtos.filter(function (id) { return ids.indexOf(id) === -1; }); });
      d.selecoes = d.selecoes.filter(function (s) { return s.produtos.length; });
    });
    V.avisar('Exemplos removidos do rascunho');
    rotear();
  }

  // ---------------------------------------------------------------
  // Editor de produto
  // ---------------------------------------------------------------
  function telaEditor(id) {
    var dados = estado.rascunho;
    var original = id ? dados.produtos.filter(function (p) { return p.id === id; })[0] : null;
    if (id && !original) {
      conteudo.appendChild(alerta('erro', 'Produto “' + id + '” não encontrado no rascunho.', [h('a', { class: 'botao botao--suave', href: '#produtos' }, 'Voltar para a lista')]));
      return;
    }
    var p = original ? copia(original) : produtoVazio();
    var novo = !original;
    var idEditadoAMao = !novo;
    document.title = (novo ? 'Novo produto' : p.nome) + ' · Painel';

    // ----- controles -----
    var cNome = h('input', { type: 'text', value: p.nome, required: true, maxlength: '160' });
    var cId = h('input', { type: 'text', value: p.id, spellcheck: 'false', autocomplete: 'off', maxlength: '80' });
    var erroId = h('p', { class: 'adm-erro-campo', 'aria-live': 'polite' });
    var cCategoria = h('select', null, [h('option', { value: '' }, 'Escolha uma categoria')].concat(dados.categorias.map(function (c) {
      return h('option', { value: c.id, selected: c.id === p.categoria }, c.nome);
    })));
    var cCurta = h('textarea', { rows: '2', maxlength: '220' }); cCurta.value = p.descricaoCurta;
    var cCodigo = h('input', { type: 'text', value: p.codigo, maxlength: '20', placeholder: 'Ex.: LT-014' });
    var sugestoesModelagem = ['Baggy', 'Reta', 'Wide leg', 'Jogger', 'Ampla', 'Slim', 'Oversized', 'Boxy', 'Regular'];
    dados.produtos.forEach(function (x) { if (x.modelagem && sugestoesModelagem.indexOf(x.modelagem) === -1) sugestoesModelagem.push(x.modelagem); });
    var cModelagem = h('input', { type: 'text', value: p.modelagem, list: 'lista-modelagens', maxlength: '30', placeholder: 'Ex.: Baggy' });
    var listaModelagens = h('datalist', { id: 'lista-modelagens' }, sugestoesModelagem.map(function (m) { return h('option', { value: m }); }));
    var cTecido = h('input', { type: 'text', value: p.tecido, maxlength: '60', placeholder: 'Ex.: Ripstop de algodão' });
    var cTamanhos = h('input', { type: 'text', value: p.tamanhos.join(', '), placeholder: 'Ex.: P, M, G, GG ou 38, 40, 42' });
    var atalhosTamanho = h('div', { class: 'adm-cabecalho__acoes' }, [['PP–XG', 'PP, P, M, G, GG, XG'], ['P–GG', 'P, M, G, GG'], ['36–46', '36, 38, 40, 42, 44, 46'], ['38–48', '38, 40, 42, 44, 46, 48']].map(function (a) {
      return botao(a[0], 'botao--suave botao--compacto', function () { cTamanhos.value = a[1]; mudou(); });
    }));
    var cMedidas = h('textarea', { rows: '5', spellcheck: 'false', placeholder: 'Tamanho; Cintura; Quadril; Comprimento\n38; 78 cm; 104 cm; 102 cm\n40; 82 cm; 108 cm; 103 cm' });
    cMedidas.value = p.medidas ? [p.medidas.colunas.join('; ')].concat(p.medidas.linhas.map(function (l) { return l.join('; '); })).join('\n') : '';

    // ----- cores -----
    var areaCores = h('div', { class: 'adm-specs' });
    function renderCores() {
      areaCores.textContent = '';
      p.cores.forEach(function (c, i) {
        var nome = h('input', { type: 'text', value: c.nome, placeholder: 'Ex.: Preto', 'aria-label': 'Nome da cor ' + (i + 1) });
        var hex = h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#808080', 'aria-label': 'Tom da cor ' + (i + 1), style: { width: '44px', 'min-height': '40px', padding: '2px' } });
        var foto = h('select', { 'aria-label': 'Foto da cor ' + (i + 1), style: { 'min-height': '40px', border: '1px solid var(--cor-linha)', 'border-radius': 'var(--raio)', background: 'var(--cor-superficie)', padding: '0 8px' } },
          [h('option', { value: '' }, 'Sem foto')].concat(p.imagens.map(function (img, j) { return h('option', { value: String(j), selected: c.imagem === j }, 'Foto ' + (j + 1)); })));
        nome.addEventListener('input', function () { c.nome = nome.value; mudou(); });
        hex.addEventListener('input', function () { c.hex = hex.value; mudou(); });
        foto.addEventListener('change', function () { c.imagem = foto.value === '' ? null : parseInt(foto.value, 10); mudou(); });
        if (!c.hex) c.hex = hex.value;
        areaCores.appendChild(h('div', { class: 'adm-spec', style: { 'grid-template-columns': '44px minmax(0,1fr) auto auto' } }, [hex, nome, foto, botaoMini('fechar', 'Remover cor', function () { p.cores.splice(i, 1); renderCores(); mudou(); })]));
      });
      areaCores.appendChild(h('div', null, botao('+ Adicionar cor', 'botao--suave botao--compacto', function () {
        p.cores.push({ nome: '', hex: '#808080', imagem: p.imagens.length ? Math.min(p.cores.length, p.imagens.length - 1) : null });
        renderCores();
        var n = areaCores.querySelectorAll('.adm-spec input[type=text]');
        if (n.length) n[n.length - 1].focus();
      })));
    }
    renderCores();
    var cDescricao = h('textarea', { rows: '5' }); cDescricao.value = p.descricao;
    var cChaves = h('input', { type: 'text', value: p.palavrasChave.join(', ') });
    var cLink = h('input', { type: 'url', value: p.linkAfiliado, spellcheck: 'false', autocomplete: 'off', inputmode: 'url', placeholder: 'https://s.shopee.com.br/…' });
    var estadoLink = h('p', { 'aria-live': 'polite' });
    var testar = botao('Testar link', 'botao--suave', function () {
      var l = V.linkValido(cLink.value);
      if (l) window.open(l, '_blank', 'noopener');
      else V.avisar('Informe um link válido primeiro');
    });
    var cTextoBotao = h('input', { type: 'text', value: p.textoBotao, placeholder: (M.textos && M.textos.botaoProduto) || 'Ver produto na Shopee', maxlength: '40' });
    var cPreco = h('input', { type: 'text', inputmode: 'decimal', value: p.preco !== null ? String(p.preco).replace('.', ',') : '', placeholder: 'Ex.: 89,90' });
    var cAnterior = h('input', { type: 'text', inputmode: 'decimal', value: p.precoAnterior !== null ? String(p.precoAnterior).replace('.', ',') : '', placeholder: 'Ex.: 109,90' });
    var cConferido = h('input', { type: 'date', value: p.precoConferidoEm || '' });
    var infoPreco = h('p', { class: 'adm-ajuda', 'aria-live': 'polite' });
    var av = p.avaliacao || {};
    var cNota = h('input', { type: 'text', inputmode: 'decimal', value: av.nota ? String(av.nota).replace('.', ',') : '', placeholder: 'Ex.: 4,8' });
    var cQtd = h('input', { type: 'text', inputmode: 'numeric', value: av.quantidade ? String(av.quantidade) : '', placeholder: 'Ex.: 1250' });
    var cAvConferida = h('input', { type: 'date', value: av.conferidoEm || '' });
    var cCarac = h('textarea', { rows: '4', placeholder: 'Uma característica por linha' }); cCarac.value = p.caracteristicas.join('\n');
    var cDisp = h('select', null, [['', 'Não informar'], ['disponivel', 'Disponível'], ['esgotado', 'Esgotado']].map(function (o) {
      return h('option', { value: o[0], selected: p.disponibilidade === o[0] }, o[1]);
    }));
    var cAdicionado = h('input', { type: 'date', value: p.adicionadoEm || '' });
    var cPublicado = h('input', { type: 'checkbox', checked: p.publicado });
    var cDestaque = h('input', { type: 'checkbox', checked: p.destaque });
    var cDemo = h('input', { type: 'checkbox', checked: p.demo });

    // ----- especificações -----
    var areaSpecs = h('div', { class: 'adm-specs' });
    function renderSpecs() {
      areaSpecs.textContent = '';
      p.especificacoes.forEach(function (e, i) {
        var r = h('input', { type: 'text', value: e.rotulo, placeholder: 'Ex.: Material', 'aria-label': 'Nome da especificação ' + (i + 1) });
        var v = h('input', { type: 'text', value: e.valor, placeholder: 'Ex.: Cerâmica', 'aria-label': 'Valor da especificação ' + (i + 1) });
        r.addEventListener('input', function () { e.rotulo = r.value; mudou(); });
        v.addEventListener('input', function () { e.valor = v.value; mudou(); });
        areaSpecs.appendChild(h('div', { class: 'adm-spec' }, [r, v, botaoMini('fechar', 'Remover linha', function () { p.especificacoes.splice(i, 1); renderSpecs(); mudou(); })]));
      });
      areaSpecs.appendChild(h('div', null, botao('+ Adicionar especificação', 'botao--suave botao--compacto', function () {
        p.especificacoes.push({ rotulo: '', valor: '' });
        renderSpecs();
        var inputs = areaSpecs.querySelectorAll('.adm-spec input');
        if (inputs.length) inputs[inputs.length - 2].focus();
      })));
    }
    renderSpecs();

    // ----- fotos -----
    var areaFotos = h('div', { class: 'adm-fotos' });
    var erroFotos = h('div', { 'aria-live': 'polite' });
    var cUrlFoto = h('input', { type: 'text', placeholder: 'https://… ou assets/img/produtos/arquivo.webp', spellcheck: 'false' });
    function renderFotos() {
      areaFotos.textContent = '';
      p.imagens.forEach(function (img, i) {
        var alt = h('input', { type: 'text', value: img.alt, placeholder: 'Descrição da foto', 'aria-label': 'Texto alternativo da foto ' + (i + 1) });
        alt.addEventListener('input', function () { img.alt = alt.value; mudou(); });
        var esquerda = botaoMini('chevronEsq', 'Mover para a esquerda', function () { p.imagens.splice(i - 1, 0, p.imagens.splice(i, 1)[0]); renderFotos(); mudou(); }, { disabled: i === 0 });
        var direita = botaoMini('chevron', 'Mover para a direita', function () { p.imagens.splice(i + 1, 0, p.imagens.splice(i, 1)[0]); renderFotos(); mudou(); }, { disabled: i === p.imagens.length - 1 });
        var remover = botaoMini('fechar', 'Remover foto', function () { p.imagens.splice(i, 1); renderFotos(); mudou(); }, { class: 'adm-botao-mini adm-botao-mini--perigo' });
        var imagem = h('img', { src: urlImagem(img.pequena || img.src), alt: '' });
        imagem.addEventListener('error', function () { imagem.replaceWith(V.semFoto('Não carregou')); });
        areaFotos.appendChild(h('div', { class: 'adm-foto' }, [
          h('div', { class: 'adm-foto__img' }, [
            imagem,
            i === 0 ? h('span', { class: 'etiqueta etiqueta--escura adm-foto__capa' }, 'Capa') : null,
            estado.uploads[img.src] ? h('span', { class: 'etiqueta adm-foto__novo' }, 'Nova') : null
          ]),
          alt,
          h('div', { class: 'adm-foto__acoes' }, [h('span', null, [esquerda, direita]), remover])
        ]));
      });
      if (estado.modo === 'github') {
        var arquivo = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/avif', multiple: true });
        var zona = h('label', { class: 'adm-envio' }, [arquivo, V.icone('imagem'), h('span', null, [h('strong', null, 'Enviar fotos'), h('br'), 'arraste ou toque para escolher']), h('span', { class: 'adm-ajuda' }, 'JPG, PNG ou WebP. Otimizadas para 1200 px.')]);
        arquivo.addEventListener('change', function () { receber(arquivo.files); arquivo.value = ''; });
        ['dragenter', 'dragover'].forEach(function (ev) { zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.add('sobre'); }); });
        ['dragleave', 'drop'].forEach(function (ev) { zona.addEventListener(ev, function () { zona.classList.remove('sobre'); }); });
        zona.addEventListener('drop', function (e) { e.preventDefault(); receber(e.dataTransfer.files); });
        areaFotos.appendChild(zona);
      }
    }
    var renderFotosBase = renderFotos;
    renderFotos = function () { renderFotosBase(); renderCores(); };
    function receber(arquivos) {
      var lista = Array.prototype.slice.call(arquivos || []);
      if (!lista.length) return;
      erroFotos.textContent = '';
      var aviso = h('div', { class: 'adm-progresso' }, [h('span', { class: 'adm-girando' }), 'Otimizando ' + lista.length + (lista.length === 1 ? ' foto…' : ' fotos…')]);
      erroFotos.appendChild(aviso);
      var idBase = cId.value.trim() || V.criarSlug(cNome.value) || 'produto';
      lista.reduce(function (cadeia, arq) {
        return cadeia.then(function () {
          return processarFoto(arq, idBase).then(function (img) {
            img.alt = cNome.value.trim();
            p.imagens.push(img);
          }).catch(function (e) { erroFotos.appendChild(alerta('erro', e.message)); });
        });
      }, Promise.resolve()).then(function () {
        aviso.remove();
        renderFotos();
        mudou();
      });
    }
    renderFotos();
    cUrlFoto.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); adicionarUrl(); } });
    function adicionarUrl() {
      var v = cUrlFoto.value.trim();
      if (!v) return;
      if (/^https?:\/\//i.test(v) && !V.linkValido(v)) { V.avisar('Endereço de imagem inválido'); return; }
      if (/^(javascript|data):/i.test(v)) { V.avisar('Endereço de imagem inválido'); return; }
      p.imagens.push({ src: v, pequena: '', alt: cNome.value.trim() });
      cUrlFoto.value = '';
      renderFotos();
      mudou();
    }

    // ----- prévia e pendências -----
    var previa = h('div', { class: 'adm-previa__cartao' });
    var pendencias = h('ul', { class: 'adm-pendencias' });
    var timerPrevia;
    function lerFormulario() {
      p.nome = cNome.value;
      if (!idEditadoAMao) cId.value = V.criarSlug(cNome.value);
      p.id = cId.value.trim();
      p.categoria = cCategoria.value;
      p.descricaoCurta = cCurta.value;
      p.codigo = cCodigo.value.trim();
      p.modelagem = cModelagem.value.trim();
      p.tecido = cTecido.value.trim();
      p.tamanhos = cTamanhos.value.split(/[,;]+/).map(function (t) { return t.trim().toUpperCase(); }).filter(Boolean);
      p.medidas = lerMedidas(cMedidas.value);
      p.cores = p.cores.filter(function (c) { return String(c.nome || '').trim(); }).map(function (c) { return { nome: c.nome.trim(), hex: c.hex, imagem: c.imagem }; });
      p.descricao = cDescricao.value;
      p.palavrasChave = cChaves.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      p.linkAfiliado = cLink.value.trim();
      p.textoBotao = cTextoBotao.value.trim();
      p.preco = V.lerPreco(cPreco.value);
      p.precoAnterior = V.lerPreco(cAnterior.value);
      p.precoConferidoEm = cConferido.value;
      var nota = V.lerPreco(cNota.value), qtd = parseInt(cQtd.value.replace(/\D/g, ''), 10);
      p.avaliacao = nota && nota <= 5 && qtd > 0 ? { nota: nota, quantidade: qtd, conferidoEm: cAvConferida.value } : null;
      p.caracteristicas = cCarac.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      p.disponibilidade = cDisp.value;
      p.adicionadoEm = cAdicionado.value;
      p.publicado = cPublicado.checked;
      p.destaque = cDestaque.checked;
      p.demo = cDemo.checked;
    }
    function lerMedidas(texto) {
      var linhas = String(texto || '').split('\n').map(function (l) { return l.split(/[;\t]/).map(function (x) { return x.trim(); }); }).filter(function (l) { return l.join(''); });
      if (linhas.length < 2) return null;
      return { colunas: linhas[0], linhas: linhas.slice(1) };
    }
    function validarId() {
      var id = cId.value.trim();
      var usado = dados.produtos.some(function (x) { return x !== original && x.id === id; });
      var msg = !id ? 'Informe um identificador.' : !ID_VALIDO.test(id) ? 'Use só letras minúsculas sem acento, números e hífens.' : usado ? 'Já existe um produto com este identificador.' : '';
      erroId.textContent = msg;
      cId.setAttribute('aria-invalid', String(!!msg));
      if (!msg && original && original.id !== id) erroId.textContent = 'Atenção: links antigos para este produto deixarão de funcionar.';
      return !msg;
    }
    function validarLink() {
      var v = cLink.value.trim();
      estadoLink.textContent = '';
      cLink.setAttribute('aria-invalid', 'false');
      if (!v) {
        estadoLink.className = cDemo.checked ? 'adm-ajuda' : 'adm-erro-campo';
        estadoLink.textContent = cDemo.checked ? 'Produto de exemplo: sem link.' : 'Sem link, o produto aparece com “Link da Shopee em atualização”, sem botão de compra.';
        return true;
      }
      var l = V.linkValido(v);
      if (!l) { estadoLink.className = 'adm-erro-campo'; estadoLink.textContent = 'Link inválido. Cole o endereço completo, começando com https://'; cLink.setAttribute('aria-invalid', 'true'); return false; }
      var host = new URL(l).hostname;
      var repetido = dados.produtos.some(function (x) { return x !== original && String(x.linkAfiliado || '').trim() === l; });
      if (repetido) { estadoLink.className = 'adm-erro-campo'; estadoLink.textContent = 'Este link já está em outro produto. Cada produto precisa do próprio link.'; return true; }
      if (!V.ehLinkShopee(l)) { estadoLink.className = 'adm-erro-campo'; estadoLink.textContent = 'O domínio ' + host + ' não é da Shopee. Confira se é o link certo.'; return true; }
      estadoLink.className = 'adm-ok-campo';
      estadoLink.textContent = 'Link da Shopee (' + host + '). Ele será usado exatamente como está. Use “Testar link” para conferir o produto.';
      return true;
    }
    function infoDePreco() {
      var a = V.lerPreco(cPreco.value), b = V.lerPreco(cAnterior.value);
      var partes = [];
      if (cPreco.value.trim() && a === null) partes.push('Preço atual não reconhecido.');
      if (cAnterior.value.trim() && b === null) partes.push('Preço anterior não reconhecido.');
      if (a !== null && b !== null) {
        if (b > a) partes.push('Desconto exibido: ' + Math.round((1 - a / b) * 100) + '%.');
        else partes.push('O preço anterior precisa ser maior que o atual para aparecer riscado.');
      }
      if (b !== null && a === null) partes.push('Sem preço atual, o preço anterior não aparece.');
      if (a !== null && !cConferido.value) partes.push('Informe a data em que conferiu o preço.');
      infoPreco.textContent = partes.join(' ') || 'Preencha só valores conferidos na Shopee. Deixe vazio para mostrar “Consulte o preço na Shopee”.';
    }
    function atualizarPrevia() {
      lerFormulario();
      var n = normalizado(p);
      previa.textContent = '';
      if (n.categoria) {
        var c = V.cartao(n, { revelar: false, origem: 'previa' });
        c.querySelectorAll('a').forEach(function (a) { if (!a.target) a.addEventListener('click', function (e) { e.preventDefault(); }); });
        previa.appendChild(c);
      } else {
        previa.appendChild(h('p', { class: 'adm-ajuda' }, 'Escolha uma categoria para ver a prévia do card.'));
      }
      pendencias.textContent = '';
      var checks = [
        [!!p.nome.trim(), 'Nome'],
        [!!p.categoria, 'Categoria'],
        [p.imagens.length > 0, 'Pelo menos uma foto'],
        [p.demo || !!V.linkValido(p.linkAfiliado), 'Link de afiliado válido'],
        [!!p.descricaoCurta.trim(), 'Descrição curta'],
        [p.preco === null || !!p.precoConferidoEm, 'Data de conferência do preço']
      ];
      checks.forEach(function (c) {
        pendencias.appendChild(h('li', { class: c[0] ? 'ok' : 'problema' }, [V.icone(c[0] ? 'check' : 'alerta'), c[1]]));
      });
    }
    function mudou() {
      editorSujo = true;
      clearTimeout(timerPrevia);
      timerPrevia = setTimeout(function () { atualizarPrevia(); validarLink(); infoDePreco(); }, 120);
    }

    [cNome, cCurta, cDescricao, cChaves, cLink, cTextoBotao, cAnterior, cConferido, cNota, cQtd, cAvConferida, cCarac, cAdicionado, cCodigo, cModelagem, cTecido, cTamanhos, cMedidas].forEach(function (c) { c.addEventListener('input', mudou); });
    [cCategoria, cDisp, cPublicado, cDestaque, cDemo].forEach(function (c) { c.addEventListener('change', mudou); });
    cNome.addEventListener('input', function () { if (!idEditadoAMao) { cId.value = V.criarSlug(cNome.value); validarId(); } });
    cId.addEventListener('input', function () { idEditadoAMao = true; validarId(); mudou(); });
    var precoInicial = cPreco.value;
    cPreco.addEventListener('input', function () {
      if (cPreco.value !== precoInicial && V.lerPreco(cPreco.value) !== null) cConferido.value = hoje();
      mudou();
    });

    // ----- salvar -----
    var areaErro = h('div', { 'aria-live': 'assertive' });
    function salvar() {
      lerFormulario();
      areaErro.textContent = '';
      var erros = [];
      if (!p.nome.trim()) erros.push('Informe o nome do produto.');
      if (!p.categoria) erros.push('Escolha a categoria.');
      if (!validarId()) erros.push('Corrija o identificador.');
      if (!validarLink()) erros.push('Corrija o link de afiliado ou deixe o campo vazio.');
      if (erros.length) {
        areaErro.appendChild(alerta('erro', erros.join(' ')));
        areaErro.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      p.nome = p.nome.trim();
      alterar(function (d) {
        if (original) {
          var i = d.produtos.indexOf(original);
          if (original.id !== p.id) {
            d.selecoes.forEach(function (s) { s.produtos = s.produtos.map(function (x) { return x === original.id ? p.id : x; }); });
          }
          d.produtos[i] = p;
        } else {
          d.produtos.unshift(p);
        }
      });
      editorSujo = false;
      V.avisar(novo ? 'Produto adicionado ao rascunho' : 'Alterações salvas no rascunho');
      location.hash = '#produtos';
    }
    function cancelar() {
      if (editorSujo && !window.confirm('Descartar as alterações deste produto?')) return;
      editorSujo = false;
      location.hash = '#produtos';
    }

    // ----- montagem -----
    var form = h('form', { class: 'adm-form', novalidate: true, style: { 'margin-top': '0' } }, [
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-basico' }, [
        h('h2', { id: 's-basico' }, 'Informações básicas'),
        campo('Nome da peça', cNome, 'Como aparece no card e na página. Seja específico: tipo, material, medida.'),
        h('div', { class: 'adm-linha adm-linha--2' }, [
          campo('Categoria', cCategoria, dados.categorias.length ? null : 'Crie uma categoria na aba Categorias primeiro.'),
          h('div', { class: 'adm-campo' }, [h('label', { for: 'c-id' }, 'Identificador (endereço da página)'), cId, erroId, h('p', { class: 'adm-ajuda' }, 'Aparece no link: produto.html?p=identificador')])
        ]),
        campo('Descrição curta', cCurta, 'Uma ou duas frases objetivas. Aparece no card e no topo da página.'),
        campo('Descrição detalhada', cDescricao, 'Separe parágrafos com uma linha em branco. Não invente benefícios.', true),
        campo('Palavras-chave para a busca', cChaves, 'Separadas por vírgula. Ex.: decoração, sala, presente', true)
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-roupa' }, [
        h('h2', { id: 's-roupa' }, ['Peça', h('span', null, 'Aparece no card, nos filtros e na ficha')]),
        h('div', { class: 'adm-linha adm-linha--3' }, [
          campo('Modelagem', cModelagem, 'Ex.: Baggy, Reta, Oversized.', true),
          campo('Tecido', cTecido, null, true),
          campo('Código', cCodigo, 'Vazio = número pela ordem.', true)
        ]),
        listaModelagens,
        h('div', { class: 'adm-campo' }, [h('label', { for: 'c-tamanhos' }, ['Tamanhos', h('span', { class: 'opcional' }, ' (opcional)')]), cTamanhos, atalhosTamanho, h('p', { class: 'adm-ajuda' }, 'Separados por vírgula, como estavam disponíveis na Shopee na conferência.')]),
        h('div', { class: 'adm-campo' }, [h('span', { class: 'adm-rotulo' }, ['Cores', h('span', { class: 'opcional' }, ' (opcional)')]), areaCores, h('p', { class: 'adm-ajuda' }, 'Escolha o tom e a foto de cada cor: no site, tocar na cor mostra essa foto.')]),
        campo('Tabela de medidas', cMedidas, 'Opcional. Primeira linha com os títulos, uma linha por tamanho, valores separados por ponto e vírgula. Copie da Shopee.', true)
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-fotos' }, [
        h('h2', { id: 's-fotos' }, ['Fotos', h('span', null, 'A primeira é a capa')]),
        estado.modo !== 'github' ? alerta('info', 'No modo local não dá para enviar arquivos. Copie as fotos para assets/img/produtos/ e informe o caminho abaixo, ou use o endereço de uma imagem autorizada.') : null,
        areaFotos,
        erroFotos,
        h('div', { class: 'adm-campo' }, [
          h('label', { for: 'c-url-foto' }, 'Adicionar por endereço'),
          h('div', { class: 'adm-campo-com-botao' }, [cUrlFoto, botao('Adicionar', 'botao--suave', adicionarUrl)]),
          h('p', { class: 'adm-ajuda' }, 'Use fotos reais do produto, cedidas pelo vendedor ou de uso permitido. O texto de cada foto ajuda quem usa leitor de tela.')
        ])
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-link' }, [
        h('h2', { id: 's-link' }, 'Link de afiliado e botão'),
        h('div', { class: 'adm-campo' }, [
          h('label', { for: 'c-link' }, 'Link de afiliado da Shopee'),
          h('div', { class: 'adm-campo-com-botao' }, [cLink, testar]),
          estadoLink,
          h('p', { class: 'adm-ajuda' }, 'Cole o link gerado no painel de afiliados da Shopee para este produto. O endereço é salvo e usado sem nenhuma alteração.')
        ]),
        campo('Texto do botão', cTextoBotao, 'Deixe vazio para usar o padrão.', true)
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-preco' }, [
        h('h2', { id: 's-preco' }, ['Preço e avaliação', h('span', null, 'Somente dados conferidos')]),
        h('div', { class: 'adm-linha adm-linha--3' }, [
          campo('Preço atual (R$)', cPreco, null, true),
          campo('Preço anterior (R$)', cAnterior, null, true),
          campo('Conferido em', cConferido, null, true)
        ]),
        infoPreco,
        h('div', { class: 'adm-linha adm-linha--3' }, [
          campo('Nota na Shopee (0 a 5)', cNota, null, true),
          campo('Quantidade de avaliações', cQtd, null, true),
          campo('Avaliação conferida em', cAvConferida, null, true)
        ]),
        h('p', { class: 'adm-ajuda' }, 'A avaliação só aparece com nota e quantidade preenchidas, copiadas da página do produto na Shopee.')
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-detalhes' }, [
        h('h2', { id: 's-detalhes' }, 'Características e especificações'),
        campo('Principais características', cCarac, 'Uma por linha. Aparecem como lista na página do produto.', true),
        h('div', { class: 'adm-campo' }, [h('span', { class: 'adm-rotulo' }, ['Especificações', h('span', { class: 'opcional' }, ' (opcional)')]), areaSpecs])
      ]),
      h('section', { class: 'adm-cartao adm-secao-form', 'aria-labelledby': 's-publicacao' }, [
        h('h2', { id: 's-publicacao' }, 'Publicação'),
        h('div', { class: 'adm-linha adm-linha--2' }, [
          campo('Disponibilidade', cDisp, 'Como estava na última conferência.'),
          campo('Adicionado em', cAdicionado, 'Usado em “Chegaram agora” e na ordenação por recentes.')
        ]),
        h('label', { class: 'adm-marcar' }, [cPublicado, h('span', null, ['Publicado', h('small', null, 'Desmarque para tirar do site sem apagar o cadastro.')])]),
        h('label', { class: 'adm-marcar' }, [cDestaque, h('span', null, ['Em destaque', h('small', null, 'Aparece na primeira dobra e em “Em destaque”.')])]),
        p.demo ? h('label', { class: 'adm-marcar' }, [cDemo, h('span', null, ['Produto de exemplo', h('small', null, 'Itens de demonstração: sem link, com etiqueta “Exemplo”. Desmarque ao transformar em produto real.')])]) : null
      ]),
      areaErro,
      h('div', { class: 'adm-rodape-editor' }, [
        botao(novo ? 'Adicionar ao lote' : 'Salvar alterações', 'botao--escuro', salvar),
        botao('Cancelar', 'botao--suave', cancelar),
        h('span', { class: 'espaco' }),
        !novo ? h('a', { class: 'botao botao--suave', href: V.url.produto(p.id), target: '_blank', rel: 'noopener' }, ['Ver no site', V.icone('externo')]) : null,
        !novo ? botao('Remover peça', 'botao--perigo', function () { if (removerProduto(original)) { editorSujo = false; location.hash = '#produtos'; } }) : null
      ])
    ]);
    form.addEventListener('submit', function (e) { e.preventDefault(); salvar(); });
    cId.id = 'c-id';
    cLink.id = 'c-link';
    cUrlFoto.id = 'c-url-foto';
    cTamanhos.id = 'c-tamanhos';

    conteudo.appendChild(h('a', { class: 'adm-voltar', href: '#produtos', onclick: function (e) { if (editorSujo && !window.confirm('Descartar as alterações deste produto?')) e.preventDefault(); } }, [V.icone('setaEsq'), 'Peças']));
    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, h('div', null, [
      h('h1', null, novo ? 'Nova peça' : 'Editar peça'),
      h('p', null, 'As alterações vão para o rascunho. Elas só aparecem no site depois de publicar.')
    ])));
    conteudo.appendChild(h('div', { class: 'adm-editor' }, [
      form,
      h('aside', { class: 'adm-previa', 'aria-label': 'Prévia' }, [
        h('p', { class: 'adm-previa__rotulo' }, 'Prévia do card'),
        previa,
        h('p', { class: 'adm-previa__rotulo', style: { 'margin-top': '12px' } }, 'Checklist'),
        pendencias
      ])
    ]));
    atualizarPrevia();
    validarLink();
    infoDePreco();
    if (novo) cNome.focus();
  }

  window.addEventListener('beforeunload', function (e) {
    if (editorSujo) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------------------------------------------------------------
  // Categorias
  // ---------------------------------------------------------------
  function telaCategorias() {
    document.title = 'Categorias · Painel';
    var dados = estado.rascunho;
    var nome = h('input', { type: 'text', maxlength: '40', required: true });
    var desc = h('input', { type: 'text', maxlength: '160' });
    var erro = h('div', { 'aria-live': 'polite' });
    var formNova = h('form', { class: 'adm-form', novalidate: true }, [
      campo('Nome', nome, 'Curto e claro. Ex.: Casa, Cozinha, Viagem.'),
      campo('Descrição', desc, 'Aparece no topo da página da categoria.', true),
      erro,
      h('div', null, h('button', { type: 'submit', class: 'botao botao--escuro' }, 'Adicionar categoria'))
    ]);
    formNova.addEventListener('submit', function (e) {
      e.preventDefault();
      erro.textContent = '';
      var n = nome.value.trim();
      var id = V.criarSlug(n);
      if (!n || !id) { erro.appendChild(alerta('erro', 'Informe o nome da categoria.')); return; }
      if (dados.categorias.some(function (c) { return c.id === id; })) { erro.appendChild(alerta('erro', 'Já existe uma categoria com esse nome.')); return; }
      alterar(function (d) { d.categorias.push({ id: id, nome: n, descricao: desc.value.trim() }); });
      V.avisar('Categoria adicionada');
      rotear();
    });

    var lista = h('ol', { class: 'adm-lista', 'aria-label': 'Categorias' });
    dados.categorias.forEach(function (c, i) {
      var total = dados.produtos.filter(function (p) { return p.categoria === c.id; }).length;
      var cNome = h('input', { type: 'text', value: c.nome, maxlength: '40' });
      var cDesc = h('input', { type: 'text', value: c.descricao, maxlength: '160' });
      cNome.addEventListener('change', function () { if (cNome.value.trim()) alterar(function () { c.nome = cNome.value.trim(); }); else cNome.value = c.nome; });
      cDesc.addEventListener('change', function () { alterar(function () { c.descricao = cDesc.value.trim(); }); });
      var areaMover = h('div');
      var remover = botaoMini('fechar', 'Remover categoria', function () {
        if (!total) {
          if (window.confirm('Remover a categoria “' + c.nome + '”?')) { alterar(function (d) { d.categorias.splice(d.categorias.indexOf(c), 1); }); rotear(); }
          return;
        }
        var outras = dados.categorias.filter(function (x) { return x !== c; });
        areaMover.textContent = '';
        if (!outras.length) { areaMover.appendChild(alerta('erro', 'Crie outra categoria antes de remover esta: os ' + total + ' produtos precisam de uma categoria.')); return; }
        var destino = h('select', { 'aria-label': 'Mover produtos para' }, outras.map(function (o) { return h('option', { value: o.id }, o.nome); }));
        areaMover.appendChild(h('div', { class: 'adm-mover' }, [
          h('span', null, 'Mover ' + total + (total === 1 ? ' produto' : ' produtos') + ' para'),
          destino,
          botao('Mover e remover', 'botao--escuro botao--compacto', function () {
            alterar(function (d) {
              d.produtos.forEach(function (p) { if (p.categoria === c.id) p.categoria = destino.value; });
              d.categorias.splice(d.categorias.indexOf(c), 1);
            });
            V.avisar('Categoria removida');
            rotear();
          }),
          botao('Cancelar', 'botao--suave botao--compacto', function () { areaMover.textContent = ''; })
        ]));
      }, { class: 'adm-botao-mini adm-botao-mini--perigo' });
      var cima = botaoMini('chevronBaixo', 'Mover para cima', function () { alterar(function (d) { d.categorias.splice(i - 1, 0, d.categorias.splice(i, 1)[0]); }); rotear(); }, { disabled: i === 0 });
      cima.querySelector('.icone').style.transform = 'rotate(180deg)';
      var baixo = botaoMini('chevronBaixo', 'Mover para baixo', function () { alterar(function (d) { d.categorias.splice(i + 1, 0, d.categorias.splice(i, 1)[0]); }); rotear(); }, { disabled: i === dados.categorias.length - 1 });
      lista.appendChild(h('li', { class: 'adm-item adm-categoria' }, [
        h('div', null, [
          h('div', { class: 'adm-item__meta', style: { 'margin-top': '0' } }, [h('span', null, c.id), h('span', null, total + (total === 1 ? ' produto' : ' produtos'))]),
          h('div', { class: 'adm-linha adm-linha--2', style: { 'margin-top': '8px' } }, [campo('Nome', cNome), campo('Descrição', cDesc, null, true)]),
          areaMover
        ]),
        h('div', { class: 'adm-item__acoes' }, [cima, baixo, remover])
      ]));
    });

    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, h('div', null, [
      h('h1', null, 'Categorias'),
      h('p', null, 'A ordem define a sequência dos filtros, do menu e da página inicial. Categorias sem produtos publicados não aparecem no site.')
    ])));
    conteudo.appendChild(h('div', { class: 'adm-grade-2' }, [
      dados.categorias.length ? lista : h('div', { class: 'adm-vazio' }, 'Nenhuma categoria ainda.'),
      h('section', { class: 'adm-cartao', 'aria-labelledby': 'nova-cat' }, [h('h2', { id: 'nova-cat' }, 'Nova categoria'), formNova])
    ]));
  }

  // ---------------------------------------------------------------
  // Seleções editoriais
  // ---------------------------------------------------------------
  function telaSelecoes() {
    document.title = 'Seleções · Painel';
    var dados = estado.rascunho;
    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, [
      h('div', null, [
        h('h1', null, 'Combinações'),
        h('p', null, 'Looks com peças do lote que aparecem na página inicial (ex.: “Preto no preto”). Cada combinação também tem sua página no catálogo.')
      ]),
      h('div', { class: 'adm-cabecalho__acoes' }, botao('+ Nova combinação', 'botao--escuro', function () {
        var id = 'selecao-' + aleatorio(4);
        alterar(function (d) { d.selecoes.push({ id: id, titulo: 'Nova seleção', descricao: '', produtos: [] }); });
        location.hash = '#selecao=' + id;
      }))
    ]));
    if (!dados.selecoes.length) {
      conteudo.appendChild(h('div', { class: 'adm-vazio' }, 'Nenhuma combinação criada. Elas são opcionais.'));
      return;
    }
    var lista = h('ol', { class: 'adm-lista' });
    dados.selecoes.forEach(function (s, i) {
      var cima = botaoMini('chevronBaixo', 'Mover para cima', function () { alterar(function (d) { d.selecoes.splice(i - 1, 0, d.selecoes.splice(i, 1)[0]); }); rotear(); }, { disabled: i === 0 });
      cima.querySelector('.icone').style.transform = 'rotate(180deg)';
      lista.appendChild(h('li', { class: 'adm-item adm-categoria' }, [
        h('div', null, [
          h('a', { class: 'adm-item__nome', href: '#selecao=' + encodeURIComponent(s.id) }, s.titulo),
          h('div', { class: 'adm-item__meta' }, [h('span', null, s.produtos.length + (s.produtos.length === 1 ? ' produto' : ' produtos')), s.descricao ? h('span', null, s.descricao) : null])
        ]),
        h('div', { class: 'adm-item__acoes' }, [
          cima,
          botaoMini('chevronBaixo', 'Mover para baixo', function () { alterar(function (d) { d.selecoes.splice(i + 1, 0, d.selecoes.splice(i, 1)[0]); }); rotear(); }, { disabled: i === dados.selecoes.length - 1 }),
          botaoMini('lapis', 'Editar', function () { location.hash = '#selecao=' + encodeURIComponent(s.id); }),
          botaoMini('fechar', 'Remover', function () {
            if (window.confirm('Remover a seleção “' + s.titulo + '”? Os produtos continuam no catálogo.')) { alterar(function (d) { d.selecoes.splice(i, 1); }); rotear(); }
          }, { class: 'adm-botao-mini adm-botao-mini--perigo' })
        ])
      ]));
    });
    conteudo.appendChild(lista);
  }

  function telaSelecao(id) {
    var dados = estado.rascunho;
    var s = dados.selecoes.filter(function (x) { return x.id === id; })[0];
    if (!s) { location.hash = '#selecoes'; return; }
    document.title = s.titulo + ' · Painel';
    var cTitulo = h('input', { type: 'text', value: s.titulo, maxlength: '80' });
    var cDesc = h('input', { type: 'text', value: s.descricao, maxlength: '200' });
    cTitulo.addEventListener('change', function () { if (cTitulo.value.trim()) alterar(function () { s.titulo = cTitulo.value.trim(); }); });
    cDesc.addEventListener('change', function () { alterar(function () { s.descricao = cDesc.value.trim(); }); });

    var naSelecao = h('ol', { class: 'adm-escolha', 'aria-label': 'Produtos na seleção' });
    var disponiveis = h('div', { class: 'adm-escolha', 'aria-label': 'Produtos disponíveis' });
    var busca = h('input', { type: 'search', placeholder: 'Buscar produto', 'aria-label': 'Buscar produto para adicionar' });
    function porId(pid) { return dados.produtos.filter(function (p) { return p.id === pid; })[0]; }
    function item(p, acoes) {
      return h('div', { class: 'adm-escolha__item' }, [
        h('span', { class: 'adm-miniatura' }, p.imagens.length ? h('img', { src: urlImagem(p.imagens[0].pequena || p.imagens[0].src), alt: '' }) : V.semFoto('')),
        h('span', { class: 'adm-escolha__nome' }, p.nome),
        h('span', { class: 'adm-item__acoes' }, acoes)
      ]);
    }
    function render() {
      naSelecao.textContent = '';
      s.produtos = s.produtos.filter(porId);
      if (!s.produtos.length) naSelecao.appendChild(h('li', { class: 'adm-ajuda', style: { padding: '12px 6px' } }, 'Nenhum produto ainda. Adicione pela lista ao lado.'));
      s.produtos.forEach(function (pid, i) {
        var p = porId(pid);
        var cima = botaoMini('chevronBaixo', 'Mover para cima', function () { alterar(function () { s.produtos.splice(i - 1, 0, s.produtos.splice(i, 1)[0]); }); render(); }, { disabled: i === 0 });
        cima.querySelector('.icone').style.transform = 'rotate(180deg)';
        naSelecao.appendChild(h('li', null, item(p, [
          cima,
          botaoMini('chevronBaixo', 'Mover para baixo', function () { alterar(function () { s.produtos.splice(i + 1, 0, s.produtos.splice(i, 1)[0]); }); render(); }, { disabled: i === s.produtos.length - 1 }),
          botaoMini('fechar', 'Tirar da seleção', function () { alterar(function () { s.produtos.splice(i, 1); }); render(); })
        ])));
      });
      disponiveis.textContent = '';
      var termo = V.semAcentos(busca.value);
      dados.produtos.filter(function (p) { return s.produtos.indexOf(p.id) === -1 && (!termo || V.semAcentos(p.nome).indexOf(termo) !== -1); }).forEach(function (p) {
        disponiveis.appendChild(item(p, [botao('Adicionar', 'botao--suave botao--compacto', function () { alterar(function () { s.produtos.push(p.id); }); render(); })]));
      });
    }
    busca.addEventListener('input', render);
    render();

    conteudo.appendChild(h('a', { class: 'adm-voltar', href: '#selecoes' }, [V.icone('setaEsq'), 'Combinações']));
    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, h('div', null, [h('h1', null, 'Editar combinação'), h('p', null, 'Seleções com produtos publicados aparecem na página inicial, na ordem definida aqui.')])));
    conteudo.appendChild(h('div', { class: 'adm-cartao' }, h('div', { class: 'adm-linha adm-linha--2' }, [campo('Título', cTitulo), campo('Descrição', cDesc, null, true)])));
    conteudo.appendChild(h('div', { class: 'adm-grade-2', style: { 'margin-top': '16px' } }, [
      h('section', { class: 'adm-cartao', 'aria-labelledby': 'na-selecao' }, [h('h2', { id: 'na-selecao', style: { 'margin-bottom': '12px' } }, 'Na seleção'), naSelecao]),
      h('section', { class: 'adm-cartao', 'aria-labelledby': 'adicionar-sel' }, [
        h('h2', { id: 'adicionar-sel' }, 'Adicionar produtos'),
        h('div', { class: 'campo-busca', style: { margin: '12px 0' } }, [V.icone('busca'), busca]),
        disponiveis
      ])
    ]));
  }

  // ---------------------------------------------------------------
  // Verificação de links
  // ---------------------------------------------------------------
  function telaLinks() {
    document.title = 'Links · Painel';
    var dados = estado.rascunho;
    var repetidos = linksRepetidos(dados);
    var linhas = dados.produtos.map(function (p) {
      var bruto = String(p.linkAfiliado || '').trim();
      var l = V.linkValido(bruto);
      var situacao, classe;
      if (p.demo && !bruto) { situacao = 'Exemplo (sem link)'; classe = 'adm-selo'; }
      else if (!bruto) { situacao = 'Sem link'; classe = 'adm-selo adm-selo--problema'; }
      else if (!l) { situacao = 'Inválido'; classe = 'adm-selo adm-selo--problema'; }
      else if (repetidos[bruto]) { situacao = 'Repetido'; classe = 'adm-selo adm-selo--problema'; }
      else if (!V.ehLinkShopee(l)) { situacao = 'Não é da Shopee'; classe = 'adm-selo adm-selo--problema'; }
      else { situacao = 'OK'; classe = 'adm-selo adm-selo--publicado'; }
      return h('tr', null, [
        h('td', null, [h('a', { href: '#produto=' + encodeURIComponent(p.id) }, p.nome), p.publicado ? null : h('div', { class: 'adm-ajuda' }, 'Não publicado')]),
        h('td', null, h('span', { class: classe }, situacao)),
        h('td', { class: 'adm-url' }, bruto || '—'),
        h('td', null, l ? h('a', { class: 'botao botao--suave botao--compacto', href: l, target: '_blank', rel: 'noopener' }, ['Abrir', V.icone('externo')]) : null)
      ]);
    });
    var ok = dados.produtos.filter(function (p) { var l = V.linkValido(p.linkAfiliado); return l && V.ehLinkShopee(l) && !repetidos[l]; }).length;
    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, h('div', null, [
      h('h1', null, 'Links de afiliado'),
      h('p', null, 'Confira se cada produto leva à página certa na Shopee. “Abrir” usa exatamente o link cadastrado, como o botão do site. ' + ok + ' de ' + dados.produtos.length + ' produtos com link da Shopee válido e exclusivo.')
    ])));
    conteudo.appendChild(h('div', { class: 'adm-cartao adm-tabela-rolagem' }, h('table', { class: 'adm-links-tabela' }, [
      h('thead', null, h('tr', null, [h('th', null, 'Produto'), h('th', null, 'Situação'), h('th', null, 'Link cadastrado'), h('th', null, h('span', { class: 'sr-only' }, 'Ações'))])),
      h('tbody', null, linhas)
    ])));
  }

  // ---------------------------------------------------------------
  // Publicar
  // ---------------------------------------------------------------
  function gerarSitemap(dados) {
    var site = String(M.site && M.site.url || '').replace(/\/+$/, '');
    if (!site) return null;
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var urls = ['', 'catalogo.html', 'como-funciona.html', 'privacidade.html'].map(function (u) { return site + '/' + u; });
    var catsComProduto = {};
    dados.produtos.forEach(function (p) {
      if (!p.publicado || p.demo) return;
      catsComProduto[p.categoria] = true;
      urls.push(site + '/produto.html?p=' + encodeURIComponent(p.id));
    });
    dados.categorias.forEach(function (c) { if (catsComProduto[c.id]) urls.push(site + '/catalogo.html?categoria=' + encodeURIComponent(c.id)); });
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(function (u) { return '  <url><loc>' + esc(u) + '</loc><lastmod>' + hoje() + '</lastmod></url>'; }).join('\n') + '\n</urlset>\n';
  }

  function mensagemPadrao(d) {
    var partes = [];
    if (d.novos.length) partes.push(d.novos.length === 1 ? 'adiciona “' + d.novos[0].nome + '”' : 'adiciona ' + d.novos.length + ' peças');
    if (d.alterados.length) partes.push(d.alterados.length === 1 ? 'atualiza “' + d.alterados[0].nome + '”' : 'atualiza ' + d.alterados.length + ' peças');
    if (d.removidos.length) partes.push(d.removidos.length === 1 ? 'remove “' + d.removidos[0].nome + '”' : 'remove ' + d.removidos.length + ' peças');
    if (d.ordem) partes.push('reorganiza a ordem');
    if (d.categorias) partes.push('ajusta categorias');
    if (d.selecoes) partes.push('ajusta combinações');
    var texto = partes.join(', ');
    return 'Catálogo: ' + (texto || 'atualiza o catálogo');
  }

  function telaPublicar() {
    document.title = 'Publicar · Painel';
    var d = diferencas();
    conteudo.appendChild(h('div', { class: 'adm-cabecalho' }, h('div', null, [
      h('h1', null, estado.modo === 'github' ? 'Publicar alterações' : 'Baixar o catálogo'),
      h('p', null, estado.modo === 'github'
        ? 'Revise o que mudou. A publicação grava tudo de uma vez no repositório e o site atualiza em cerca de um minuto.'
        : 'Baixe o arquivo data/catalogo.js e substitua o arquivo de mesmo nome no projeto da vitrine.')
    ])));

    if (estado.ultimaPublicacao) {
      conteudo.appendChild(h('div', { style: { 'margin-bottom': '16px' } }, alerta('ok', [
        'Publicado. O site deve mostrar as mudanças em cerca de um minuto. ',
        estado.ultimaPublicacao.url ? h('a', { href: estado.ultimaPublicacao.url, target: '_blank', rel: 'noopener' }, 'Ver a publicação no GitHub') : null
      ])));
    }

    if (!d.total) {
      conteudo.appendChild(h('div', { class: 'adm-vazio' }, [h('p', null, 'Tudo publicado. Não há alterações pendentes.')]));
      conteudo.appendChild(ferramentasArquivo());
      return;
    }

    var secoes = [];
    function grupo(titulo, itens) { if (itens.length) secoes.push(h('div', null, [h('h3', null, titulo), h('ul', null, itens.map(function (t) { return h('li', null, t); }))])); }
    grupo('Produtos novos', d.novos.map(function (p) { return p.nome; }));
    grupo('Produtos alterados', d.alterados.map(function (p) { return p.nome; }));
    grupo('Produtos removidos', d.removidos.map(function (p) { return p.nome; }));
    var outros = [];
    if (d.ordem) outros.push('Ordem dos produtos');
    if (d.categorias) outros.push('Categorias');
    if (d.selecoes) outros.push('Seleções');
    if (d.fotos) outros.push(d.fotos / 2 + (d.fotos / 2 === 1 ? ' foto nova' : ' fotos novas') + ' (em dois tamanhos)');
    grupo('Outras mudanças', outros);

    var repetidos = linksRepetidos(estado.rascunho);
    var comProblema = estado.rascunho.produtos.filter(function (p) { return p.publicado && problemasDe(p, repetidos).length; });

    var mensagem = h('textarea', { rows: '2' });
    mensagem.value = mensagemPadrao(d);
    var progresso = h('div', { 'aria-live': 'polite' });
    var acoes = h('div', { class: 'adm-rodape-editor', style: { position: 'static', 'border-top': '0', 'padding-top': '0' } });

    conteudo.appendChild(h('div', { class: 'adm-grade-2' }, [
      h('section', { class: 'adm-cartao', 'aria-labelledby': 'resumo' }, [
        h('h2', { id: 'resumo', style: { 'margin-bottom': '16px' } }, 'Resumo'),
        h('div', { class: 'adm-resumo' }, secoes),
        comProblema.length ? h('div', { style: { 'margin-top': '20px' } }, alerta('aviso', [
          comProblema.length + (comProblema.length === 1 ? ' produto publicado tem pendências: ' : ' produtos publicados têm pendências: '),
          comProblema.slice(0, 6).map(function (p, i) { return [i ? ', ' : '', h('a', { href: '#produto=' + encodeURIComponent(p.id) }, p.nome)]; }),
          comProblema.length > 6 ? '…' : '',
          '. Sem link válido, o botão da Shopee não aparece.'
        ])) : null
      ]),
      h('section', { class: 'adm-cartao', 'aria-labelledby': 'acao' }, [
        h('h2', { id: 'acao', style: { 'margin-bottom': '16px' } }, estado.modo === 'github' ? 'Publicar' : 'Baixar'),
        estado.modo === 'github' ? campo('Descrição da publicação', mensagem, 'Fica registrada no histórico do repositório.') : null,
        progresso,
        acoes
      ])
    ]));

    if (estado.modo === 'github') {
      acoes.appendChild(botao('Publicar no site', 'botao--destaque botao--grande', function () { publicar(mensagem.value, false); }));
    } else {
      acoes.appendChild(botao('Baixar data/catalogo.js', 'botao--destaque botao--grande', baixarCatalogo));
    }
    acoes.appendChild(botao('Descartar alterações', 'botao--perigo', function () {
      if (!window.confirm('Descartar todas as alterações não publicadas?')) return;
      estado.rascunho = copia(estado.base);
      estado.uploads = {};
      V.armazenamento.remover(CHAVE_RASCUNHO);
      rotear();
    }));
    conteudo.appendChild(ferramentasArquivo());

    function publicar(msg, forcar) {
      progresso.textContent = '';
      acoes.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
      var texto = h('span', null, 'Preparando…');
      progresso.appendChild(h('div', { class: 'adm-progresso', style: { 'margin-bottom': '16px' } }, [h('span', { class: 'adm-girando' }), texto]));

      var dados = estado.rascunho;
      var arquivos = [{ caminho: caminhoRepo(CAMINHO_CATALOGO), texto: serializar(dados) }];
      var emUso = fotosEmUso(dados);
      emUso.forEach(function (src) {
        if (estado.uploads[src]) arquivos.push({ caminho: caminhoRepo(src), base64: estado.uploads[src].base64 });
      });
      var sitemap = gerarSitemap(dados);
      if (sitemap) arquivos.push({ caminho: caminhoRepo('sitemap.xml'), texto: sitemap });

      // Fotos que deixaram de ser usadas e estão na pasta de produtos do repositório
      var antes = fotosEmUso(estado.base).filter(function (src) { return src.indexOf(PASTA_FOTOS) === 0 && emUso.indexOf(src) === -1; });
      var listarPastas = antes.length ? Promise.all(uniq(antes.map(function (s) { return caminhoRepo(s.slice(0, s.lastIndexOf('/'))); })).map(function (p) { return estado.cliente.listarPasta(p); }))
        : Promise.resolve([]);

      listarPastas.then(function (listas) {
        var existentes = [].concat.apply([], listas);
        antes.forEach(function (src) {
          if (existentes.indexOf(caminhoRepo(src)) !== -1) arquivos.push({ caminho: caminhoRepo(src), remover: true });
        });
        return estado.cliente.publicar(arquivos, {
          mensagem: (msg || mensagemPadrao(d)).trim(),
          shaEsperado: { caminho: caminhoRepo(CAMINHO_CATALOGO), sha: estado.sha },
          forcar: forcar,
          aoProgresso: function (t) { texto.textContent = t; }
        });
      }).then(function (commit) {
        return estado.cliente.lerArquivo(caminhoRepo(CAMINHO_CATALOGO)).then(function (arq) {
          estado.base = copia(estado.rascunho);
          estado.sha = arq ? arq.sha : null;
          estado.uploads = {};
          V.armazenamento.remover(CHAVE_RASCUNHO);
          estado.ultimaPublicacao = { url: commit.html_url || ('https://github.com/' + estado.cfg.dono + '/' + estado.cfg.repositorio + '/commit/' + commit.sha) };
          V.avisar('Publicado');
          rotear();
        });
      }).catch(function (e) {
        progresso.textContent = '';
        acoes.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
        if (e.detalhe === 'conflito') {
          progresso.appendChild(alerta('erro', 'O catálogo publicado foi alterado depois que você abriu o painel (em outro dispositivo ou direto no GitHub).', [
            botao('Publicar mesmo assim (substitui)', 'botao--escuro', function () {
              if (window.confirm('Substituir a versão publicada pelo seu rascunho? As mudanças feitas em outro lugar serão perdidas.')) publicar(msg, true);
            }),
            botao('Recarregar a versão publicada', 'botao--suave', function () {
              if (!window.confirm('Recarregar descarta o seu rascunho atual. Continuar?')) return;
              V.armazenamento.remover(CHAVE_RASCUNHO);
              conectarGitHub(estado.cfg, !!localStorage.getItem(CHAVE_TOKEN)).catch(function (err) { V.avisar(err.message); });
            })
          ]));
        } else {
          progresso.appendChild(alerta('erro', 'Não foi possível publicar: ' + e.message));
        }
      });
    }
  }
  function uniq(l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); }

  function baixar(nome, conteudoArquivo, tipo) {
    var url = URL.createObjectURL(new Blob([conteudoArquivo], { type: tipo }));
    var a = h('a', { href: url, download: nome });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
  }
  function baixarCatalogo() {
    baixar('catalogo.js', serializar(estado.rascunho), 'text/javascript');
    V.avisar('Arquivo baixado. Substitua data/catalogo.js no projeto.');
  }

  function ferramentasArquivo() {
    var importar = h('input', { type: 'file', accept: '.js,.json,application/json,text/javascript', class: 'sr-only', id: 'importar' });
    importar.addEventListener('change', function () {
      var f = importar.files[0];
      importar.value = '';
      if (!f) return;
      f.text().then(function (t) {
        var leitura = /^\s*[{[]/.test(t) ? Promise.resolve({ dados: JSON.parse(t) }) : lerTextoCatalogo(t);
        return leitura;
      }).then(function (r) {
        var dados = completarCatalogo(r.dados);
        if (!window.confirm('Substituir o rascunho pelo arquivo importado (' + dados.produtos.length + ' produtos, ' + dados.categorias.length + ' categorias)?')) return;
        alterar(function () { estado.rascunho = dados; });
        salvarRascunho();
        V.avisar('Catálogo importado para o rascunho');
        rotear();
      }).catch(function (e) { V.avisar('Não foi possível importar: ' + e.message); });
    });
    return h('section', { class: 'adm-cartao', style: { 'margin-top': '16px' }, 'aria-labelledby': 'arquivos' }, [
      h('h2', { id: 'arquivos' }, 'Cópia de segurança'),
      h('p', null, 'Baixe o rascunho atual como arquivo ou importe um catálogo salvo antes.'),
      h('div', { class: 'adm-cabecalho__acoes', style: { 'margin-top': '16px' } }, [
        botao('Baixar cópia (catalogo.js)', 'botao--suave', baixarCatalogo),
        h('label', { class: 'botao botao--suave', for: 'importar' }, 'Importar arquivo'),
        importar
      ])
    ]);
  }

  // ---------------------------------------------------------------
  // Início: reconecta com o token salvo, se houver
  // ---------------------------------------------------------------
  function comecar() {
    var token = lerSessao(CHAVE_TOKEN);
    var repo = V.armazenamento.ler(CHAVE_REPO, null);
    if (token && repo) {
      app.textContent = '';
      app.appendChild(h('div', { class: 'adm-carregando', role: 'status' }, 'Conectando ao GitHub…'));
      var lembrar = false;
      try { lembrar = !!localStorage.getItem(CHAVE_TOKEN); } catch (e) { /* ignora */ }
      conectarGitHub(Object.assign({ token: token }, repo), lembrar).catch(function (e) { telaEntrada(e.message); });
    } else {
      telaEntrada();
    }
  }
  comecar();
})();
