/* =========================================================================
   House Hamburgueria 66 · camada de dados

   Dois modos com a mesma interface:
   - SUPABASE: chaves preenchidas em config.js. Cardápio, fotos, pedidos e
     login do painel ficam no banco.
   - DEMONSTRAÇÃO: sem chaves. Usa dados.js e salva tudo neste navegador.
   ========================================================================= */
(function () {
  var cfg = window.HOUSE_CONFIG || {};
  var LIVE = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  var K = { demo: "house_demo_v2", sacola: "house_sacola_v1", cliente: "house_cliente_v1", sessao: "house_demo_sessao" };
  var SENHA_DEMO = "house66";
  var memoria = {};

  // ------------------------------------------------------------ utilidades
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function ler(k, padrao) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; }
    catch (e) { return k in memoria ? clone(memoria[k]) : padrao; }
  }
  function gravar(k, v) {
    memoria[k] = clone(v);
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }
  function apagar(k) { delete memoria[k]; try { localStorage.removeItem(k); } catch (e) {} }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function r2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
  function slug(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function fmt(n) { return moeda.format(Number(n) || 0); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ------------------------------------------------------------ supabase
  var clientePromise = null;
  function base() {
    var s = document.querySelector('script[src*="store.js"]');
    return s ? s.src.replace(/store\.js(\?.*)?$/, "") : "assets/js/";
  }
  function sb() {
    if (!LIVE) return Promise.reject(new Error("Banco de dados não configurado."));
    if (clientePromise) return clientePromise;
    clientePromise = new Promise(function (ok, falha) {
      function criar() { ok(window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true } })); }
      if (window.supabase && window.supabase.createClient) return criar();
      var s = document.createElement("script");
      s.src = base() + "../vendor/supabase.js";
      s.onload = criar;
      s.onerror = function () { clientePromise = null; falha(new Error("Não foi possível conectar ao banco de dados.")); };
      document.head.appendChild(s);
    });
    return clientePromise;
  }
  function res(r) {
    if (r.error) throw new Error(r.error.message || "Erro de comunicação com o servidor.");
    return r.data;
  }

  // linhas do banco <-> objetos do site
  function deProduto(r) {
    return { id: r.id, categoria: r.categoria_id, nome: r.nome, descricao: r.descricao || "",
      preco: r.preco == null ? null : Number(r.preco), aPartirDe: !!r.a_partir_de, foto: r.foto || "",
      selo: r.selo || "", destaque: !!r.destaque, ativo: r.ativo !== false, ordem: r.ordem || 0, opcoes: r.opcoes || [] };
  }
  function paraProduto(p) {
    return { categoria_id: p.categoria || null, nome: p.nome, descricao: p.descricao || "",
      preco: p.preco == null || p.preco === "" ? null : r2(p.preco), a_partir_de: !!p.aPartirDe, foto: p.foto || "",
      selo: p.selo || "", destaque: !!p.destaque, ativo: p.ativo !== false, ordem: Number(p.ordem) || 0, opcoes: p.opcoes || [] };
  }
  function deCategoria(r) {
    return { id: r.id, nome: r.nome, ordem: r.ordem || 0, ativo: r.ativo !== false, estilo: r.estilo || "normal", foto: r.foto || "" };
  }
  function dePromocao(r) {
    return { id: r.id, titulo: r.titulo, texto: r.texto || "", preco: r.preco == null ? null : Number(r.preco),
      aPartirDe: !!r.a_partir_de, foto: r.foto || "", produtoId: r.produto_id || "", selo: r.selo || "",
      ativo: r.ativo !== false, ordem: r.ordem || 0 };
  }
  function paraPromocao(p) {
    return { titulo: p.titulo, texto: p.texto || "", preco: p.preco == null || p.preco === "" ? null : r2(p.preco),
      a_partir_de: !!p.aPartirDe, foto: p.foto || "", produto_id: p.produtoId || null, selo: p.selo || "",
      ativo: p.ativo !== false, ordem: Number(p.ordem) || 0 };
  }
  function dePedido(r) {
    return { id: r.id, numero: r.numero, status: r.status, criadoEm: r.criado_em, cliente: r.cliente || {},
      modalidade: r.modalidade, endereco: r.endereco || {}, pagamento: r.pagamento || "", observacoes: r.observacoes || "",
      itens: r.itens || [], subtotal: Number(r.subtotal), taxa: r.taxa == null ? null : Number(r.taxa), total: Number(r.total) };
  }

  // ------------------------------------------------------------ demonstração
  function demo() {
    var db = ler(K.demo, null);
    if (!db || !db.produtos) {
      db = clone(window.HOUSE_PADRAO);
      db.pedidos = []; db.seq = 1000;
      gravar(K.demo, db);
    }
    return db;
  }
  function salvarDemo(db) {
    if (!gravar(K.demo, db)) {
      // localStorage indisponível: segue em memória nesta aba
      try { localStorage.setItem("house_teste", "1"); localStorage.removeItem("house_teste"); }
      catch (e) { return; }
      throw new Error("O armazenamento do navegador está cheio. Use fotos menores ou conecte o Supabase.");
    }
  }
  function ordenar(lista) { return lista.sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); }); }

  // ------------------------------------------------------------ catálogo
  function carregar(tudo) {
    var p;
    if (!LIVE) {
      var db = demo();
      p = Promise.resolve({ loja: db.loja, categorias: db.categorias, produtos: db.produtos, promocoes: db.promocoes });
    } else {
      p = sb().then(function (c) {
        return Promise.all([
          c.from("config").select("valor").eq("chave", "loja").maybeSingle().then(res),
          c.from("categorias").select("*").order("ordem").then(res),
          c.from("produtos").select("*").order("ordem").then(res),
          c.from("promocoes").select("*").order("ordem").then(res)
        ]);
      }).then(function (r) {
        return { loja: r[0] ? r[0].valor : {}, categorias: r[1].map(deCategoria),
          produtos: r[2].map(deProduto), promocoes: r[3].map(dePromocao) };
      });
    }
    return p.then(function (d) {
      var loja = Object.assign({}, clone(window.HOUSE_PADRAO.loja), clone(d.loja) || {});
      var ativo = function (x) { return tudo || x.ativo !== false; };
      return {
        loja: loja,
        categorias: ordenar(clone(d.categorias).filter(ativo)),
        produtos: ordenar(clone(d.produtos).filter(ativo)),
        promocoes: ordenar(clone(d.promocoes).filter(ativo))
      };
    });
  }

  // ------------------------------------------------------------ preço
  function precoUnitario(produto, escolhas) {
    var total = Number(produto.preco) || 0;
    (escolhas || []).forEach(function (e) { total += Number(e.preco) || 0; });
    return r2(total);
  }
  // Confere as escolhas contra as opções atuais do produto (preço vem do cardápio, não da sacola).
  function validarEscolhas(produto, escolhas) {
    var grupos = produto.opcoes || [];
    var saida = [];
    for (var i = 0; i < (escolhas || []).length; i++) {
      var e = escolhas[i];
      var g = grupos.filter(function (x) { return x.nome === e.grupo; })[0];
      var it = g && (g.itens || []).filter(function (x) { return x.nome === e.item; })[0];
      if (!it) return null;
      saida.push({ grupo: g.nome, item: it.nome, preco: r2(it.preco) });
    }
    for (var j = 0; j < grupos.length; j++) {
      var n = saida.filter(function (x) { return x.grupo === grupos[j].nome; }).length;
      if (grupos[j].obrigatorio && n < 1) return null;
      if (grupos[j].tipo === "uma" && n > 1) return null;
      if (grupos[j].max && n > grupos[j].max) return null;
    }
    return saida;
  }

  // ------------------------------------------------------------ horário
  function horaLocal() {
    var partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var o = {}; partes.forEach(function (p) { o[p.type] = p.value; });
    var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
    return { dia: dia, min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function minutos(hhmm) { var p = String(hhmm || "0:0").split(":"); return parseInt(p[0], 10) * 60 + (parseInt(p[1], 10) || 0); }
  function situacao(loja) {
    var h = loja.horario;
    if (!h || !h.abre || !h.fecha || !h.dias || !h.dias.length) return null;
    var agora = horaLocal(), abre = minutos(h.abre), fecha = minutos(h.fecha);
    var hoje = h.dias.indexOf(agora.dia) > -1, ontem = h.dias.indexOf((agora.dia + 6) % 7) > -1;
    var aberto = fecha > abre
      ? hoje && agora.min >= abre && agora.min < fecha
      : (hoje && agora.min >= abre) || (ontem && agora.min < fecha);
    var hora = function (s) { var p = s.split(":"); return parseInt(p[0], 10) + "h" + (p[1] && p[1] !== "00" ? p[1] : ""); };
    return { aberto: aberto, texto: aberto ? "Aberto agora · até " + hora(h.fecha) : "Fechado agora · abre às " + hora(h.abre) };
  }

  // ------------------------------------------------------------ sacola
  var ouvintes = [];
  function sacola() { var s = ler(K.sacola, []); return Array.isArray(s) ? s : []; }
  function salvarSacola(s) { gravar(K.sacola, s); ouvintes.forEach(function (f) { f(s); }); }
  function chave(id, escolhas, obs) { return id + "|" + JSON.stringify(escolhas || []) + "|" + (obs || ""); }
  var Sacola = {
    itens: sacola,
    ouvir: function (f) { ouvintes.push(f); },
    adicionar: function (produto, escolhas, qtd, obs) {
      var s = sacola(), k = chave(produto.id, escolhas, obs);
      var atual = s.filter(function (x) { return x.key === k; })[0];
      if (atual) atual.qtd = Math.min(50, atual.qtd + qtd);
      else s.push({ key: k, produtoId: produto.id, nome: produto.nome, foto: produto.foto || "", qtd: qtd,
        unitario: precoUnitario(produto, escolhas), aPartirDe: !!produto.aPartirDe, opcoes: escolhas || [], obs: obs || "" });
      salvarSacola(s);
    },
    quantidade: function (key, qtd) {
      var s = sacola().map(function (x) { if (x.key === key) x.qtd = Math.max(1, Math.min(50, qtd)); return x; });
      salvarSacola(s);
    },
    remover: function (key) { salvarSacola(sacola().filter(function (x) { return x.key !== key; })); },
    limpar: function () { salvarSacola([]); },
    contagem: function () { return sacola().reduce(function (t, x) { return t + x.qtd; }, 0); },
    subtotal: function () { return r2(sacola().reduce(function (t, x) { return t + x.unitario * x.qtd; }, 0)); },
    // Atualiza preços e nomes com o cardápio atual e tira o que saiu do ar.
    conciliar: function (produtos) {
      var mapa = {}; produtos.forEach(function (p) { mapa[p.id] = p; });
      var mudou = false;
      var s = sacola().filter(function (x) {
        var p = mapa[x.produtoId];
        var esc = p && p.preco != null ? validarEscolhas(p, x.opcoes) : null;
        if (!esc) { mudou = true; return false; }
        var u = precoUnitario(p, esc);
        if (u !== x.unitario || p.nome !== x.nome || (p.foto || "") !== x.foto) { mudou = true; x.unitario = u; x.nome = p.nome; x.foto = p.foto || ""; }
        x.opcoes = esc; x.aPartirDe = !!p.aPartirDe;
        return true;
      });
      if (mudou) salvarSacola(s);
      return mudou;
    }
  };

  // ------------------------------------------------------------ pedidos
  function criarPedido(dados, produtos, loja) {
    var mapa = {}; produtos.forEach(function (p) { mapa[p.id] = p; });
    var itens = [];
    var erro = null;
    Sacola.itens().forEach(function (x) {
      var p = mapa[x.produtoId];
      var esc = p && p.preco != null ? validarEscolhas(p, x.opcoes) : null;
      if (!esc) { erro = erro || x.nome; return; }
      var u = precoUnitario(p, esc);
      itens.push({ produtoId: p.id, nome: p.nome, qtd: x.qtd, unitario: u, aPartirDe: !!p.aPartirDe, opcoes: esc, obs: x.obs || "", total: r2(u * x.qtd) });
    });
    if (erro) return Promise.reject(new Error("“" + erro + "” não está mais disponível. Tire da sacola para continuar."));
    if (!itens.length) return Promise.reject(new Error("Sua sacola está vazia."));

    var entrega = dados.modalidade === "entrega";
    var pedido = {
      cliente: { nome: dados.nome, telefone: dados.telefone },
      modalidade: dados.modalidade,
      endereco: entrega ? { rua: dados.rua, bairro: dados.bairro, referencia: dados.referencia } : {},
      pagamento: dados.pagamento || "",
      observacoes: dados.observacoes || "",
      itens: itens
    };

    if (!LIVE) {
      var db = demo();
      var subtotal = r2(itens.reduce(function (t, i) { return t + i.total; }, 0));
      var taxa = entrega && loja.taxaEntrega != null ? r2(loja.taxaEntrega) : (entrega ? null : 0);
      db.seq = (db.seq || 1000) + 1;
      var salvo = Object.assign({ id: uid(), numero: db.seq, status: "novo", criadoEm: new Date().toISOString(),
        subtotal: subtotal, taxa: taxa, total: r2(subtotal + (taxa || 0)) }, pedido);
      db.pedidos.unshift(salvo);
      db.pedidos = db.pedidos.slice(0, 300);
      try { salvarDemo(db); } catch (e) { db.pedidos = db.pedidos.slice(0, 50); salvarDemo(db); }
      return Promise.resolve(salvo);
    }
    return sb().then(function (c) {
      return c.rpc("criar_pedido", { p: {
        cliente: pedido.cliente, modalidade: pedido.modalidade, endereco: pedido.endereco,
        pagamento: pedido.pagamento, observacoes: pedido.observacoes,
        itens: itens.map(function (i) { return { id: i.produtoId, qtd: i.qtd, opcoes: i.opcoes.map(function (o) { return { grupo: o.grupo, item: o.item }; }), obs: i.obs }; })
      } });
    }).then(res).then(dePedido);
  }

  function dadosCliente() { return ler(K.cliente, {}); }
  function lembrarCliente(d) {
    gravar(K.cliente, { nome: d.nome, telefone: d.telefone, rua: d.rua, bairro: d.bairro, referencia: d.referencia, modalidade: d.modalidade });
  }

  // ------------------------------------------------------------ painel
  var Admin = {
    sessao: function () {
      if (!LIVE) return Promise.resolve(ler(K.sessao, false) ? { email: "demonstração" } : null);
      return sb().then(function (c) { return c.auth.getSession(); }).then(function (r) {
        var u = r.data && r.data.session && r.data.session.user;
        if (!u) return null;
        return sb().then(function (c) { return c.from("admins").select("user_id").eq("user_id", u.id).maybeSingle(); })
          .then(res).then(function (a) { return a ? { email: u.email } : null; });
      });
    },
    entrar: function (email, senha) {
      if (!LIVE) {
        if (senha !== SENHA_DEMO) return Promise.reject(new Error("Senha incorreta."));
        gravar(K.sessao, true);
        return Promise.resolve({ email: "demonstração" });
      }
      return sb().then(function (c) { return c.auth.signInWithPassword({ email: email, password: senha }); })
        .then(function (r) {
          if (r.error) throw new Error("E-mail ou senha incorretos.");
          return Admin.sessao();
        }).then(function (s) {
          if (!s) { sb().then(function (c) { c.auth.signOut(); }); throw new Error("Este usuário não tem acesso ao painel."); }
          return s;
        });
    },
    sair: function () {
      if (!LIVE) { apagar(K.sessao); return Promise.resolve(); }
      return sb().then(function (c) { return c.auth.signOut(); });
    },
    tudo: function () { return carregar(true); },

    salvarProduto: function (p) {
      if (!LIVE) {
        var db = demo();
        if (!p.id) { p.id = slug(p.nome) + "-" + uid().slice(-4); db.produtos.push(p); }
        else db.produtos = db.produtos.map(function (x) { return x.id === p.id ? p : x; });
        salvarDemo(db); return Promise.resolve(p);
      }
      return sb().then(function (c) {
        var q = p.id ? c.from("produtos").update(paraProduto(p)).eq("id", p.id) : c.from("produtos").insert(paraProduto(p));
        return q.select().single();
      }).then(res).then(deProduto);
    },
    excluirProduto: function (id) {
      if (!LIVE) { var db = demo(); db.produtos = db.produtos.filter(function (x) { return x.id !== id; }); salvarDemo(db); return Promise.resolve(); }
      return sb().then(function (c) { return c.from("produtos").delete().eq("id", id); }).then(res);
    },

    salvarCategoria: function (cat, novo) {
      if (!LIVE) {
        var db = demo();
        if (novo) {
          if (db.categorias.some(function (x) { return x.id === cat.id; })) return Promise.reject(new Error("Já existe uma categoria com esse nome."));
          db.categorias.push(cat);
        } else db.categorias = db.categorias.map(function (x) { return x.id === cat.id ? cat : x; });
        salvarDemo(db); return Promise.resolve(cat);
      }
      var linha = { id: cat.id, nome: cat.nome, ordem: Number(cat.ordem) || 0, ativo: cat.ativo !== false, estilo: cat.estilo || "normal", foto: cat.foto || "" };
      return sb().then(function (c) {
        return (novo ? c.from("categorias").insert(linha) : c.from("categorias").update(linha).eq("id", cat.id)).select().single();
      }).then(function (r) {
        if (r.error && /duplicate/i.test(r.error.message)) throw new Error("Já existe uma categoria com esse nome.");
        return deCategoria(res(r));
      });
    },
    excluirCategoria: function (id) {
      if (!LIVE) {
        var db = demo();
        if (db.produtos.some(function (p) { return p.categoria === id; })) return Promise.reject(new Error("Mova ou exclua os produtos desta categoria antes."));
        db.categorias = db.categorias.filter(function (x) { return x.id !== id; }); salvarDemo(db); return Promise.resolve();
      }
      return sb().then(function (c) {
        return c.from("produtos").select("id", { count: "exact", head: true }).eq("categoria_id", id).then(function (r) {
          if (r.count) throw new Error("Mova ou exclua os produtos desta categoria antes.");
          return c.from("categorias").delete().eq("id", id);
        });
      }).then(res);
    },

    salvarPromocao: function (p) {
      if (!LIVE) {
        var db = demo();
        if (!p.id) { p.id = "promo-" + uid(); db.promocoes.push(p); }
        else db.promocoes = db.promocoes.map(function (x) { return x.id === p.id ? p : x; });
        salvarDemo(db); return Promise.resolve(p);
      }
      return sb().then(function (c) {
        var q = p.id ? c.from("promocoes").update(paraPromocao(p)).eq("id", p.id) : c.from("promocoes").insert(paraPromocao(p));
        return q.select().single();
      }).then(res).then(dePromocao);
    },
    excluirPromocao: function (id) {
      if (!LIVE) { var db = demo(); db.promocoes = db.promocoes.filter(function (x) { return x.id !== id; }); salvarDemo(db); return Promise.resolve(); }
      return sb().then(function (c) { return c.from("promocoes").delete().eq("id", id); }).then(res);
    },

    salvarLoja: function (loja) {
      if (!LIVE) { var db = demo(); db.loja = loja; salvarDemo(db); return Promise.resolve(loja); }
      return sb().then(function (c) { return c.from("config").upsert({ chave: "loja", valor: loja }); }).then(res);
    },

    pedidos: function () {
      if (!LIVE) return Promise.resolve(clone(demo().pedidos));
      return sb().then(function (c) { return c.from("pedidos").select("*").order("criado_em", { ascending: false }).limit(200); })
        .then(res).then(function (r) { return r.map(dePedido); });
    },
    statusPedido: function (id, status) {
      if (!LIVE) {
        var db = demo();
        db.pedidos.forEach(function (p) { if (p.id === id) p.status = status; });
        salvarDemo(db); return Promise.resolve();
      }
      return sb().then(function (c) { return c.from("pedidos").update({ status: status }).eq("id", id); }).then(res);
    },

    // Reduz a foto no navegador antes de enviar (máx. 1400 px, WebP ou JPEG).
    enviarFoto: function (arquivo) {
      if (!arquivo || !/^image\//.test(arquivo.type)) return Promise.reject(new Error("Escolha um arquivo de imagem (JPG, PNG ou WebP)."));
      if (arquivo.size > 15 * 1024 * 1024) return Promise.reject(new Error("A foto passa de 15 MB. Escolha uma menor."));
      return reduzir(arquivo, LIVE ? 1400 : 900, LIVE ? 0.84 : 0.78).then(function (blob) {
        if (!LIVE) {
          return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { ok(fr.result); }; fr.readAsDataURL(blob); });
        }
        var ext = blob.type === "image/webp" ? "webp" : "jpg";
        var caminho = "produtos/" + uid() + "." + ext;
        return sb().then(function (c) {
          return c.storage.from("cardapio").upload(caminho, blob, { contentType: blob.type, cacheControl: "31536000" }).then(function (r) {
            res(r);
            return c.storage.from("cardapio").getPublicUrl(caminho).data.publicUrl;
          });
        });
      });
    }
  };

  function reduzir(arquivo, max, q) {
    return new Promise(function (ok, falha) {
      var url = URL.createObjectURL(arquivo);
      var img = new Image();
      img.onload = function () {
        var esc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.naturalWidth * esc); cv.height = Math.round(img.naturalHeight * esc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (b) {
          if (b && b.type === "image/webp") return ok(b);
          cv.toBlob(function (j) { j ? ok(j) : falha(new Error("Não foi possível processar a foto.")); }, "image/jpeg", q);
        }, "image/webp", q);
      };
      img.onerror = function () { URL.revokeObjectURL(url); falha(new Error("Não foi possível abrir essa imagem.")); };
      img.src = url;
    });
  }

  window.HouseStore = {
    modo: LIVE ? "supabase" : "demo",
    senhaDemo: SENHA_DEMO,
    carregar: function () { return carregar(false); },
    situacao: situacao,
    precoUnitario: precoUnitario,
    Sacola: Sacola,
    criarPedido: criarPedido,
    dadosCliente: dadosCliente,
    lembrarCliente: lembrarCliente,
    Admin: Admin,
    util: { fmt: fmt, esc: esc, slug: slug, r2: r2, clone: clone }
  };
})();
