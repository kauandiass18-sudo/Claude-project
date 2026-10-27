/* =============================================================
   INTEGRAÇÃO COM O GITHUB (painel administrativo)
   -------------------------------------------------------------
   O painel lê e grava os arquivos da vitrine direto no repositório
   pela API oficial do GitHub. Cada publicação vira um único commit
   com o catálogo, as fotos novas e o sitemap.

   O token é digitado no painel e fica só neste navegador
   (sessionStorage, ou localStorage se você marcar "lembrar").
   Ele nunca é gravado em arquivos do site.
   ============================================================= */
(function () {
  'use strict';

  var API = 'https://api.github.com';

  function codificarCaminho(caminho) {
    return caminho.split('/').map(encodeURIComponent).join('/');
  }

  /** Texto UTF-8 → base64 */
  function paraBase64(texto) {
    var bytes = new TextEncoder().encode(texto);
    return bytesParaBase64(bytes);
  }
  function bytesParaBase64(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }
  /** base64 → texto UTF-8 */
  function deBase64(b64) {
    var bin = atob(String(b64 || '').replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function ErroGitHub(mensagem, status, detalhe) {
    var e = new Error(mensagem);
    e.status = status;
    e.detalhe = detalhe;
    return e;
  }

  /**
   * Cliente mínimo da API.
   * cfg: { token, dono, repositorio, branch }
   */
  function Cliente(cfg) {
    this.cfg = cfg;
    this.base = API + '/repos/' + encodeURIComponent(cfg.dono) + '/' + encodeURIComponent(cfg.repositorio);
  }

  Cliente.prototype.pedir = function (metodo, caminho, corpo) {
    var url = /^https:/.test(caminho) ? caminho : this.base + caminho;
    return fetch(url, {
      method: metodo,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + this.cfg.token,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
      cache: 'no-store'
    }).then(function (r) {
      return r.text().then(function (txt) {
        var dados = null;
        try { dados = txt ? JSON.parse(txt) : null; } catch (e) { dados = null; }
        if (!r.ok) {
          var msg = (dados && dados.message) || ('Erro ' + r.status);
          throw ErroGitHub(traduzirErro(r.status, msg), r.status, msg);
        }
        return dados;
      });
    }, function () {
      throw ErroGitHub('Sem conexão com o GitHub. Verifique a internet e tente de novo.', 0);
    });
  };

  function traduzirErro(status, msg) {
    if (status === 401) return 'Token inválido ou expirado. Gere um novo token e entre de novo.';
    if (status === 403 && /rate limit/i.test(msg)) return 'Limite de uso da API do GitHub atingido. Aguarde alguns minutos.';
    if (status === 403) return 'O token não tem permissão para gravar neste repositório (Contents: Read and write).';
    if (status === 404) return 'Repositório, branch ou arquivo não encontrado. Confira as configurações do repositório.';
    if (status === 409) return 'O repositório mudou durante a publicação. Recarregue o catálogo e tente de novo.';
    if (status === 422) return 'O GitHub recusou a alteração (' + msg + ').';
    return msg;
  }

  /** Confere acesso ao repositório e à branch. */
  Cliente.prototype.verificar = function () {
    var self = this;
    return this.pedir('GET', '').then(function (repo) {
      if (!repo.permissions || !repo.permissions.push) {
        throw ErroGitHub('O token consegue ler, mas não gravar, neste repositório. Dê a permissão “Contents: Read and write”.', 403);
      }
      return self.pedir('GET', '/branches/' + codificarCaminho(self.cfg.branch)).then(function () { return repo; });
    });
  };

  /** Lê um arquivo de texto. Devolve { texto, sha } ou null se não existir. */
  Cliente.prototype.lerArquivo = function (caminho) {
    var self = this;
    return this.pedir('GET', '/contents/' + codificarCaminho(caminho) + '?ref=' + encodeURIComponent(this.cfg.branch))
      .then(function (d) {
        if (d && d.encoding === 'base64' && d.content) return { texto: deBase64(d.content), sha: d.sha };
        // Arquivos acima de 1 MB vêm sem conteúdo: busca pelo blob
        return self.pedir('GET', '/git/blobs/' + d.sha).then(function (b) { return { texto: deBase64(b.content), sha: d.sha }; });
      })
      .catch(function (e) { if (e.status === 404) return null; throw e; });
  };

  /** Lista os nomes de arquivos de uma pasta (vazio se não existir). */
  Cliente.prototype.listarPasta = function (caminho) {
    return this.pedir('GET', '/contents/' + codificarCaminho(caminho) + '?ref=' + encodeURIComponent(this.cfg.branch))
      .then(function (d) { return Array.isArray(d) ? d.map(function (x) { return x.path; }) : []; })
      .catch(function (e) { if (e.status === 404) return []; throw e; });
  };

  /**
   * Publica vários arquivos em um único commit.
   * arquivos: [{ caminho, texto } | { caminho, base64 } | { caminho, remover: true }]
   * opcoes: { mensagem, shaEsperado: { caminho, sha }, forcar, aoProgresso(texto) }
   */
  Cliente.prototype.publicar = function (arquivos, opcoes) {
    var self = this;
    var progresso = opcoes.aoProgresso || function () {};
    var ref = '/git/ref/heads/' + codificarCaminho(this.cfg.branch);
    var commitAtual, arvoreBase;

    progresso('Conferindo a versão publicada…');
    return this.pedir('GET', ref).then(function (r) {
      commitAtual = r.object.sha;
      if (!opcoes.shaEsperado || opcoes.forcar) return null;
      return self.lerArquivo(opcoes.shaEsperado.caminho).then(function (atual) {
        var shaAtual = atual ? atual.sha : null;
        if (shaAtual !== opcoes.shaEsperado.sha) {
          throw ErroGitHub('O catálogo foi alterado em outro lugar depois que você abriu o painel.', 409, 'conflito');
        }
      });
    }).then(function () {
      return self.pedir('GET', '/git/commits/' + commitAtual);
    }).then(function (c) {
      arvoreBase = c.tree.sha;
      var enviar = arquivos.filter(function (a) { return !a.remover; });
      var feitos = 0;
      // Envia os blobs em sequência para não estourar o limite da API
      return enviar.reduce(function (cadeia, a) {
        return cadeia.then(function (lista) {
          progresso('Enviando arquivos (' + (++feitos) + ' de ' + enviar.length + ')…');
          return self.pedir('POST', '/git/blobs', { content: a.base64 || paraBase64(a.texto), encoding: 'base64' })
            .then(function (b) { lista.push({ path: a.caminho, mode: '100644', type: 'blob', sha: b.sha }); return lista; });
        });
      }, Promise.resolve([]));
    }).then(function (arvore) {
      arquivos.filter(function (a) { return a.remover; }).forEach(function (a) {
        arvore.push({ path: a.caminho, mode: '100644', type: 'blob', sha: null });
      });
      progresso('Montando a publicação…');
      return self.pedir('POST', '/git/trees', { base_tree: arvoreBase, tree: arvore });
    }).then(function (t) {
      return self.pedir('POST', '/git/commits', { message: opcoes.mensagem, tree: t.sha, parents: [commitAtual] });
    }).then(function (novo) {
      progresso('Atualizando a branch…');
      return self.pedir('PATCH', '/git/refs/heads/' + codificarCaminho(self.cfg.branch), { sha: novo.sha, force: false })
        .then(function () { return novo; });
    });
  };

  window.VitrineGitHub = {
    Cliente: Cliente,
    paraBase64: paraBase64,
    bytesParaBase64: bytesParaBase64,
    deBase64: deBase64
  };
})();
