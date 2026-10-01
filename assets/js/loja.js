/* =============================================================
   Vitrine de loja: Ybera Paris (na página inicial), Mercado Livre
   e Shopee. Lê os produtos de data/<loja>.js e monta categorias, busca,
   destaques e a lista de cards. Normalmente você NÃO precisa
   editar este arquivo: edite os arquivos da pasta data/.
   ============================================================= */
(function () {
  "use strict";
  const { el, ICONES, linkSeguro, imagemSegura, aplicarParametrosAfiliado, normalizar, montarRodape } = window.App;

  // Faz o :active funcionar no iOS (animação ao tocar)
  document.addEventListener("touchstart", function () {}, { passive: true });

  const raiz = document.querySelector("[data-loja]");
  if (!raiz) return;
  const slug = raiz.dataset.loja;
  const loja = (window.LOJAS || {})[slug];
  const mostrarCategoria = raiz.dataset.cardCategoria === "sim";
  const mostrarNumero = raiz.dataset.numerar === "sim";
  // Textos da página (definidos no HTML com data-*; têm um padrão se faltarem)
  const txt = {
    todos: raiz.dataset.rotuloTodos || "Todos",
    vazioTitulo: raiz.dataset.vazioTitulo || "Em breve, novidades por aqui",
    vazioTexto: raiz.dataset.vazioTexto || "Os produtos desta loja estão sendo selecionados.",
    semResultado: raiz.dataset.semResultado || "Nada encontrado"
  };
  const $ = (sel) => document.querySelector(sel);

  montarRodape();

  if (!loja) {
    console.error(`[loja] Dados não encontrados para "${slug}". Verifique o arquivo em data/.`);
    return;
  }

  /* ---------- Cabeçalho ---------- */
  const titulo = $("[data-loja-titulo]");
  const subtitulo = $("[data-loja-subtitulo]");
  if (titulo && loja.titulo) titulo.textContent = loja.titulo;
  if (subtitulo) {
    if (loja.subtitulo) subtitulo.textContent = loja.subtitulo;
    else subtitulo.hidden = true;
  }

  /* ---------- Produtos válidos ---------- */
  // Fotos sem fundo branco (data/<loja>-fotos.js) vão para o fim das fileiras
  const semFundoBranco = new Set(((window.FOTOS_SEM_FUNDO_BRANCO || {})[slug]) || []);
  const produtos = (Array.isArray(loja.produtos) ? loja.produtos : [])
    .map((p, i) => {
      const nome = p && typeof p.nome === "string" ? p.nome.trim() : "";
      const url = linkSeguro(p && p.affiliateUrl);
      if (!nome || !url) {
        console.warn(`[loja] Produto #${i + 1} ignorado em "${slug}": precisa de "nome" e de um "affiliateUrl" começando com https://`, p);
        return null;
      }
      const categoria = typeof p.categoria === "string" ? p.categoria.trim() : "";
      const texto = (v) => (typeof v === "string" ? v.trim() : "");
      const id = (url.match(/-(\d+)(?:[/?#]|$)/) || [])[1] || "";
      return {
        nome,
        id,
        fotoLimpa: !semFundoBranco.has(id),
        categoria,
        imagem: imagemSegura(p.imagem),
        url: aplicarParametrosAfiliado(url, loja),
        destaque: p.destaque === true,
        preco: texto(p.preco),
        precoAntigo: texto(p.precoAntigo),
        oQueE: texto(p.oQueE),
        esgotado: p.esgotado === true,
        busca: normalizar(`${nome} ${categoria} ${texto(p.oQueE)}`)
      };
    })
    .filter(Boolean);
  // Categorias escondidas pela loja (ocultarCategorias em data/<loja>.js)
  const ocultas = (loja.ocultarCategorias || []).map((c) => normalizar(c));
  if (ocultas.length) {
    for (let i = produtos.length - 1; i >= 0; i--) {
      const p = produtos[i];
      if (!ocultas.includes(normalizar(p.categoria))) continue;
      if (p.destaque) p.oculto = true; // fica só nos Queridinhos
      else produtos.splice(i, 1);
    }
  }
  // Produtos escondidos pelo nome (ocultarProdutosCom em data/<loja>.js)
  const palavrasOcultas = (loja.ocultarProdutosCom || []).map((t) => normalizar(t)).filter(Boolean);
  if (palavrasOcultas.length) {
    for (let i = produtos.length - 1; i >= 0; i--) {
      const nome = normalizar(produtos[i].nome);
      if (palavrasOcultas.some((t) => nome.includes(t))) produtos.splice(i, 1);
    }
  }
  // Esgotados ficam escondidos, a não ser que a loja peça para mostrar
  if (loja.mostrarEsgotados !== true) {
    for (let i = produtos.length - 1; i >= 0; i--) if (produtos[i].esgotado) produtos.splice(i, 1);
  }
  produtos.forEach((p, i) => { p.numero = String(i + 1).padStart(2, "0"); });

  /* ---------- Categorias ---------- */
  const ordem = (loja.ordemCategorias || []).map((c) => normalizar(c));
  const categorias = [...new Set(produtos.filter((p) => !p.oculto).map((p) => p.categoria).filter(Boolean))].sort((a, b) => {
    const ia = ordem.indexOf(normalizar(a));
    const ib = ordem.indexOf(normalizar(b));
    if (ia !== -1 || ib !== -1) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    return a.localeCompare(b, "pt-BR");
  });

  /* ---------- Ordem da vitrine ----------
     Queridinhos: um de cada categoria por vez, fotos de fundo branco primeiro.
     Prateleiras: fotos de fundo branco primeiro, e os primeiros Queridinhos
     mais para o fim, para a vitrine não começar repetindo os mesmos. */
  const fotoLimpaPrimeiro = (lista) =>
    lista.map((p, i) => [p, i]).sort((a, b) => (b[0].fotoLimpa - a[0].fotoLimpa) || a[1] - b[1]).map(([p]) => p);

  function ordemDestaques() {
    const destaques = fotoLimpaPrimeiro(produtos.filter((p) => p.destaque));
    const filas = new Map();
    for (const p of destaques) {
      const g = p.categoria || "Outros";
      if (!filas.has(g)) filas.set(g, []);
      filas.get(g).push(p);
    }
    const ordem = [];
    while (ordem.length < destaques.length) {
      for (const fila of filas.values()) if (fila.length) ordem.push(fila.shift());
    }
    return ordem;
  }
  const destaquesEmOrdem = ordemDestaques();
  const primeirosDestaques = new Set(destaquesEmOrdem.slice(0, 4));
  const ordemPrateleira = (lista) =>
    lista
      .map((p, i) => [p, i])
      .sort((a, b) =>
        (b[0].fotoLimpa - a[0].fotoLimpa) ||
        (primeirosDestaques.has(a[0]) - primeirosDestaques.has(b[0])) ||
        a[1] - b[1]
      )
      .map(([p]) => p);

  const estado = { categoria: "", busca: "" };

  /* ---------- Elementos ---------- */
  const campoBusca = $("[data-busca]");
  const limparBusca = $("[data-busca-limpar]");
  const areaBusca = $("[data-area-busca]");
  const listaCategorias = $("[data-categorias]");
  const tituloCategorias = $("[data-categorias-titulo]");
  const iconesCategorias = loja.iconesCategorias || {};
  const secaoDestaques = $("[data-destaques-secao]");
  const trilhoDestaques = $("[data-destaques]");
  const secaoProdutos = $("[data-produtos-secao]");
  const tituloProdutos = $("[data-produtos-titulo]");
  const lista = $("[data-lista]");
  const tituloPadrao = tituloProdutos ? tituloProdutos.textContent : "";
  const cabecalhoProdutos = tituloProdutos ? tituloProdutos.closest(".secao__cabecalho") : null;
  let notaPrecos = null;
  const contagem = $("[data-contagem]");
  const vazio = $("[data-vazio]");
  const linkLoja = $("[data-link-loja]");

  /* Modo "botões de categoria" (vitrine da Ybera): em vez da lista inteira,
     um botão por categoria ("Sua progressiva aqui"). Tocando, aparecem só os
     produtos dela. A categoria aberta vai no endereço (#progressiva-e-liso),
     então o "voltar" do celular volta para os botões. */
  const modoBotoes = raiz.dataset.categoriasBotoes === "sim";
  const rotulosCategorias = loja.rotulosCategorias || {};
  const botaoVoltar = $("[data-voltar-categorias]");
  const slugCategoria = (c) => normalizar(c).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let abriuPeloBotao = false;

  /* ---------- Preço ---------- */
  /** Lê "R$ 1.234,56" como número (1234.56). */
  function valorEmReais(texto) {
    const limpo = String(texto || "").replace(/[^\d,]/g, "").replace(",", ".");
    const n = parseFloat(limpo);
    return Number.isFinite(n) ? n : 0;
  }

  /** Porcentagem de desconto entre o preço antigo e o atual (ex.: 17). */
  function desconto(produto) {
    const antigo = valorEmReais(produto.precoAntigo);
    const atual = valorEmReais(produto.preco);
    if (!antigo || !atual || atual >= antigo) return 0;
    return Math.round((1 - atual / antigo) * 100);
  }

  /* Desconto pequeno (ex.: 5% no Pix) não é promoção: o preço maior aparece
     como "ou R$ X no cartão", sem riscar. Só desconto a partir de
     descontoMinimoSelo vira promoção (preço riscado + selo "-10%"). */
  const minimoSelo = Number(loja.descontoMinimoSelo) || 5;
  const ehPromocao = (produto) => desconto(produto) >= minimoSelo;

  function criarPreco(produto) {
    if (!produto.preco) return null;
    const promocao = produto.precoAntigo && ehPromocao(produto);
    const normal = produto.precoAntigo && !promocao && loja.rotuloPrecoNormal;
    return el("span", { class: "card__preco" }, [
      promocao
        ? el("s", { class: "card__preco-antigo" }, [el("span", { class: "sr-only", text: "de " }), produto.precoAntigo])
        : null,
      el("span", { class: "card__preco-atual" }, [
        promocao ? el("span", { class: "sr-only", text: "por " }) : null,
        produto.preco
      ]),
      loja.rotuloPreco ? el("span", { class: "card__preco-rotulo", text: loja.rotuloPreco }) : null,
      normal
        ? el("span", { class: "card__preco-normal", text: `ou ${produto.precoAntigo} ${loja.rotuloPrecoNormal}` })
        : null
    ]);
  }

  /* ---------- Card ---------- */
  function criarMidia(produto) {
    const midia = el("span", { class: "card__midia" });
    const placeholder = () =>
      midia.replaceChildren(el("span", { class: "card__placeholder", html: ICONES.sacola }));
    if (produto.imagem) {
      const img = el("img", {
        src: produto.imagem,
        alt: "",
        loading: "lazy",
        decoding: "async",
        width: "160",
        height: "160"
      });
      img.addEventListener("error", placeholder, { once: true });
      midia.append(img);
    } else {
      placeholder();
    }
    return midia;
  }

  function criarCard(produto, indice, variante) {
    const ehDestaque = variante === "destaque";
    const card = el(
      "a",
      {
        class: `card ${ehDestaque ? "card--destaque" : "card--lista"}${produto.esgotado ? " card--esgotado" : ""} revelar`,
        href: produto.url,
        target: "_blank",
        rel: "sponsored noopener",
        style: `--i:${Math.min(indice, 8)}`
      },
      [
        (() => {
          const off = desconto(produto);
          return el("span", { class: "card__foto" }, [
            criarMidia(produto),
            ehPromocao(produto) ? el("span", { class: "card__desconto", text: `-${off}%`, "aria-label": `${off}% de desconto` }) : null,
            ehDestaque ? el("span", { class: "card__ir", "aria-hidden": "true", html: ICONES.seta }) : null
          ]);
        })(),
        el("span", { class: "card__corpo" }, [
          !ehDestaque && (mostrarNumero || (!mostrarCategoria && produto.categoria))
            ? el("span", { class: "card__meta" }, [
                mostrarNumero ? el("span", { class: "card__numero", text: `Nº ${produto.numero}` }) : null,
                !mostrarCategoria && produto.categoria
                  ? el("span", { class: "card__meta-categoria", text: produto.categoria })
                  : null,
                produto.esgotado ? el("span", { class: "card__esgotado", text: "Esgotado" }) : null
              ])
            : null,
          mostrarCategoria && !ehDestaque && produto.categoria
            ? el("span", { class: "card__categoria", text: produto.categoria })
            : null,
          el("span", { class: "card__nome", text: produto.nome }),
          !ehDestaque && produto.oQueE ? el("span", { class: "card__oque", text: produto.oQueE }) : null,
          criarPreco(produto),
          el("span", { class: "sr-only", text: " (abre em nova aba)" })
        ]),
        ehDestaque ? null : el("span", { class: "card__seta", html: ICONES.seta })
      ]
    );
    if (produto.destaque && !ehDestaque && secaoDestaques) {
      card.prepend(el("span", { class: "card__selo", "aria-label": "Destaque", html: ICONES.estrela }));
    }
    return card;
  }

  /* ---------- Fileira com setas (computador) ----------
     No celular a fileira desliza com o dedo; em telas com mouse aparecem
     duas setas nas laterais. */
  function comSetas(trilho) {
    const janela = el("div", { class: "janela" });
    const passo = (lado) => () =>
      trilho.scrollBy({ left: lado * Math.max(trilho.clientWidth * 0.8, 160), behavior: suave() });
    const antes = el("button", { type: "button", class: "janela__seta janela__seta--antes", "aria-label": "Anteriores", html: ICONES.voltar, onclick: passo(-1) });
    const depois = el("button", { type: "button", class: "janela__seta janela__seta--depois", "aria-label": "Próximos", html: ICONES.seta, onclick: passo(1) });
    const atualizar = () => {
      antes.disabled = trilho.scrollLeft <= 4;
      depois.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
    };
    trilho.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    requestAnimationFrame(atualizar);
    if (trilho.parentNode) trilho.replaceWith(janela);
    janela.append(trilho, antes, depois);
    return janela;
  }

  const abrirCategoria = () => { abriuPeloBotao = true; };

  /* ---------- Renderização ---------- */
  function renderCategorias() {
    if (!listaCategorias) return;
    if (categorias.length < 2) {
      listaCategorias.hidden = true;
      if (tituloCategorias) tituloCategorias.hidden = true;
      return;
    }
    if (modoBotoes) {
      // Vitrine: uma prateleira por categoria, com os produtos lado a lado
      listaCategorias.className = "prateleiras";
      listaCategorias.replaceChildren(
        ...categorias.map((c) => {
          const daCategoria = ordemPrateleira(produtos.filter((p) => p.categoria === c && !p.oculto));
          const n = daCategoria.length;
          const limite = Number(loja.produtosPorPrateleira) || Infinity;
          const mostrados = daCategoria.slice(0, limite);
          const icone = ICONES[iconesCategorias[c]] || ICONES.brilho;
          const idTitulo = `prateleira-${slugCategoria(c)}`;
          const link = `#${slugCategoria(c)}`;
          const trilho = el("div", { class: "trilho prateleira__trilho" }, [
            ...mostrados.map((p, i) => criarCard(p, i, "destaque")),
            n > mostrados.length
              ? el("a", { class: "card card--ver-todos", href: link, onclick: abrirCategoria }, [
                  el("span", { class: "card__ver-todos-seta", html: ICONES.seta }),
                  el("span", { class: "card__ver-todos-texto" }, [`Ver todos os ${n}`]),
                  el("span", { class: "card__ver-todos-nome", text: rotulosCategorias[c] || c })
                ])
              : null
          ]);
          return el("section", { class: "prateleira", "aria-labelledby": idTitulo }, [
            el("div", { class: "prateleira__cabecalho" }, [
              el("span", { class: "prateleira__icone", html: icone }),
              el("h3", { class: "prateleira__titulo", id: idTitulo }, [
                el("span", { text: rotulosCategorias[c] || c }),
                el("span", { class: "prateleira__qtd", text: `${n} ${n === 1 ? "produto" : "produtos"}` })
              ]),
              el("a", {
                class: "prateleira__ver",
                href: link,
                "aria-label": `Ver todos de ${c}`,
                onclick: abrirCategoria
              }, [el("span", { text: "Ver todos" }), el("span", { class: "prateleira__ver-seta", html: ICONES.seta })])
            ]),
            comSetas(trilho)
          ]);
        })
      );
      return;
    }
    const chip = (valor, rotulo) => {
      const icone = ICONES[valor ? iconesCategorias[valor] : "brilho"];
      return el("button", {
        type: "button",
        class: "chip",
        "data-categoria": valor,
        "aria-pressed": String(estado.categoria === valor),
        onclick: () => {
          estado.categoria = valor;
          listaCategorias.querySelectorAll(".chip").forEach((c) =>
            c.setAttribute("aria-pressed", String(c.dataset.categoria === valor))
          );
          renderLista();
        }
      }, [
        icone ? el("span", { class: "chip__icone", html: icone }) : null,
        el("span", { text: rotulo })
      ]);
    };
    listaCategorias.replaceChildren(chip("", txt.todos), ...categorias.map((c) => chip(c, rotulosCategorias[c] || c)));
  }

  function renderDestaques() {
    if (!secaoDestaques || !trilhoDestaques) return;
    if (!destaquesEmOrdem.length) {
      secaoDestaques.hidden = true;
      return;
    }
    trilhoDestaques.replaceChildren(...destaquesEmOrdem.map((p, i) => criarCard(p, i, "destaque")));
    comSetas(trilhoDestaques);
  }

  function renderLista() {
    const termo = normalizar(estado.busca);
    const filtrando = Boolean(termo || estado.categoria);

    // Modo botões: sem categoria aberta e sem busca, mostra só os botões
    if (modoBotoes) {
      if (listaCategorias) listaCategorias.hidden = filtrando || categorias.length < 2;
      if (tituloCategorias) tituloCategorias.hidden = filtrando || categorias.length < 2;
      if (secaoProdutos) secaoProdutos.hidden = !filtrando;
      if (botaoVoltar) botaoVoltar.hidden = !filtrando;
      if (secaoDestaques && trilhoDestaques && trilhoDestaques.childElementCount) secaoDestaques.hidden = filtrando;
      if (!filtrando) {
        lista.replaceChildren();
        if (vazio) vazio.hidden = true;
        return;
      }
    }
    const filtrados = produtos.filter(
      (p) => !p.oculto && (!estado.categoria || p.categoria === estado.categoria) && (!termo || p.busca.includes(termo))
    );
    const resultado = modoBotoes ? ordemPrateleira(filtrados) : fotoLimpaPrimeiro(filtrados);

    if (secaoDestaques && trilhoDestaques && trilhoDestaques.childElementCount) {
      secaoDestaques.hidden = filtrando;
    }

    if (tituloProdutos) {
      const n = resultado.length;
      tituloProdutos.textContent = termo
        ? `${n} ${n === 1 ? "resultado" : "resultados"} para “${estado.busca.trim()}”${estado.categoria ? ` em ${estado.categoria}` : ""}`
        : estado.categoria || tituloPadrao;
    }
    if (cabecalhoProdutos) cabecalhoProdutos.hidden = !resultado.length;
    if (notaPrecos) notaPrecos.hidden = !resultado.length;
    if (contagem) {
      contagem.textContent = `${resultado.length} ${resultado.length === 1 ? "produto" : "produtos"}`;
    }

    // Todos os produtos de uma vez, separados por categoria (na ordem dos filtros).
    // Com um filtro escolhido, o título da seção já diz a categoria.
    const grupos = [];
    const porGrupo = new Map();
    for (const p of resultado) {
      const g = p.categoria || "Outros";
      if (!porGrupo.has(g)) {
        porGrupo.set(g, []);
        grupos.push(g);
      }
      porGrupo.get(g).push(p);
    }
    const posicao = (g) => {
      const i = categorias.indexOf(g);
      return i === -1 ? Infinity : i;
    };
    grupos.sort((a, b) => posicao(a) - posicao(b));
    const comTitulo = !estado.categoria && grupos.length > 1;

    lista.replaceChildren(
      ...grupos.map((g) => {
        const variante = modoBotoes ? "destaque" : "lista";
        const classeLista = modoBotoes ? "lista grupo__lista lista--vitrine" : "lista grupo__lista";
        const itens = porGrupo.get(g).map((p, i) => el("li", null, criarCard(p, i, variante)));
        if (!comTitulo) return el("li", { class: "grupo" }, el("ul", { class: classeLista }, itens));
        const icone = ICONES[iconesCategorias[g]];
        const n = itens.length;
        return el("li", { class: "grupo" }, [
          el("h4", { class: "grupo__titulo" }, [
            icone ? el("span", { class: "grupo__icone", html: icone }) : null,
            el("span", { class: "grupo__nome", text: g }),
            el("span", { class: "grupo__qtd", text: `${n} ${n === 1 ? "produto" : "produtos"}` })
          ]),
          el("ul", { class: classeLista }, itens)
        ]);
      })
    );

    if (!resultado.length) {
      const zerarBusca = () => {
        estado.busca = "";
        if (campoBusca) campoBusca.value = "";
        atualizarBotaoLimpar();
      };
      // Sugere as categorias: um toque abre a categoria (sem a busca)
      const sugestoes = categorias.length > 1
        ? el("div", { class: "vazio__sugestoes" }, categorias.map((c) =>
            el("button", {
              type: "button",
              class: "chip",
              onclick: () => {
                zerarBusca();
                if (modoBotoes) {
                  abriuPeloBotao = true;
                  location.hash = slugCategoria(c);
                } else {
                  estado.categoria = c;
                  renderCategorias();
                  renderLista();
                }
              }
            }, [
              ICONES[iconesCategorias[c]] ? el("span", { class: "chip__icone", html: ICONES[iconesCategorias[c]] }) : null,
              el("span", { text: rotulosCategorias[c] || c })
            ])
          ))
        : null;
      mostrarVazio({
        titulo: txt.semResultado,
        texto: termo
          ? `Não encontramos nada para “${estado.busca.trim()}”. Tente outra palavra ou escolha uma categoria:`
          : "Não há produtos nesta categoria.",
        acoes: [
          sugestoes,
          el("button", {
            type: "button",
            class: "botao-secundario",
            text: termo ? "Limpar busca" : "Ver todos",
            onclick: () => {
              zerarBusca();
              if (modoBotoes && estado.categoria) {
                renderLista();
                return;
              }
              estado.categoria = "";
              renderCategorias();
              renderLista();
              if (campoBusca && termo) campoBusca.focus();
            }
          })
        ]
      });
    } else if (vazio) {
      vazio.hidden = true;
    }
  }

  function mostrarVazio({ sobre, titulo, texto, acoes = [] }) {
    if (!vazio) return;
    const botoes = acoes.filter(Boolean);
    vazio.replaceChildren(
      ...[
        el("span", { class: "vazio__icone", html: ICONES.ondas }),
        sobre ? el("p", { class: "vazio__sobre", text: sobre }) : null,
        el("p", { class: "vazio__titulo", text: titulo }),
        el("p", { class: "vazio__texto", text: texto }),
        botoes.length ? el("div", { class: "vazio__acoes" }, botoes) : null
      ].filter(Boolean)
    );
    vazio.hidden = false;
  }

  function atualizarBotaoLimpar() {
    if (limparBusca) limparBusca.hidden = !campoBusca || !campoBusca.value;
  }

  /* ---------- Link geral da loja ---------- */
  const urlLoja = linkSeguro(loja.linkLoja);
  if (linkLoja) {
    if (urlLoja) {
      linkLoja.href = aplicarParametrosAfiliado(urlLoja, loja);
      linkLoja.querySelector("[data-link-loja-texto]").textContent = loja.textoLinkLoja || "Visitar loja";
      linkLoja.hidden = false;
    } else {
      linkLoja.hidden = true;
    }
  }

  /* ---------- Início ---------- */
  if (!produtos.length) {
    if (areaBusca) areaBusca.hidden = true;
    if (listaCategorias) listaCategorias.hidden = true;
    if (tituloCategorias) tituloCategorias.hidden = true;
    if (secaoDestaques) secaoDestaques.hidden = true;
    if (secaoProdutos) secaoProdutos.hidden = true;
    // Loja ainda vazia: um bloco só, com um caminho para a vitrine (e o Instagram)
    const hero = $(".loja__hero");
    if (hero) hero.hidden = true;
    const acoes = [];
    const destinoVazio = raiz.dataset.vazioLink;
    if (destinoVazio) {
      acoes.push(el("a", { class: "botao-loja botao-loja--compacto", href: destinoVazio }, [
        el("span", { text: raiz.dataset.vazioLinkTexto || "Voltar ao início" }),
        el("span", { class: "botao-loja__seta", html: ICONES.seta })
      ]));
    }
    const insta = ((window.PERFIL || {}).redes || []).find((r) => r && r.tipo === "instagram");
    const urlInsta = insta && linkSeguro(insta.url);
    if (urlInsta) {
      acoes.push(el("a", { class: "botao-secundario", href: urlInsta, target: "_blank", rel: "noopener me" }, [
        el("span", { class: "chip__icone", html: ICONES.instagram }),
        el("span", { text: "Me siga no Instagram" })
      ]));
    }
    mostrarVazio({ sobre: hero ? `Achadinhos · ${loja.titulo || ""}` : "", titulo: txt.vazioTitulo, texto: txt.vazioTexto, acoes });
    return;
  }

  if (campoBusca) {
    let timer;
    campoBusca.addEventListener("input", () => {
      atualizarBotaoLimpar();
      clearTimeout(timer);
      timer = setTimeout(() => {
        estado.busca = campoBusca.value;
        renderLista();
      }, 120);
    });
    campoBusca.addEventListener("keydown", (e) => {
      if (e.key === "Enter") campoBusca.blur(); // fecha o teclado no celular
    });
  }
  if (limparBusca) {
    limparBusca.addEventListener("click", () => {
      campoBusca.value = "";
      estado.busca = "";
      atualizarBotaoLimpar();
      renderLista();
      campoBusca.focus();
    });
  }

  // Aviso sobre preços, abaixo da lista
  if (loja.notaPrecos && produtos.some((p) => p.preco) && secaoProdutos) {
    notaPrecos = el("p", { class: "nota-precos", text: loja.notaPrecos });
    secaoProdutos.append(notaPrecos);
  }

  /* ---------- Categoria aberta pelo endereço (#slug) ---------- */
  const suave = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  function categoriaDoEndereco() {
    const h = decodeURIComponent(location.hash.slice(1));
    return categorias.find((c) => slugCategoria(c) === h) || "";
  }
  if (modoBotoes) {
    estado.categoria = categoriaDoEndereco();
    window.addEventListener("hashchange", () => {
      const c = categoriaDoEndereco();
      if (c === estado.categoria) return;
      estado.categoria = c;
      if (campoBusca && !c) { campoBusca.value = ""; estado.busca = ""; atualizarBotaoLimpar(); }
      renderLista();
      const alvo = c ? secaoProdutos : tituloCategorias || listaCategorias;
      if (alvo) alvo.scrollIntoView({ behavior: suave(), block: "start" });
      if (c && botaoVoltar) botaoVoltar.focus({ preventScroll: true });
    });
    if (botaoVoltar) {
      botaoVoltar.addEventListener("click", () => {
        if (estado.busca && !estado.categoria) {
          // estava numa busca: limpa e volta para os botões
          campoBusca.value = "";
          estado.busca = "";
          atualizarBotaoLimpar();
          renderLista();
          (tituloCategorias || listaCategorias).scrollIntoView({ behavior: suave(), block: "start" });
          return;
        }
        if (abriuPeloBotao) history.back();
        else location.hash = "";
        abriuPeloBotao = false;
      });
    }
  }

  renderCategorias();
  renderDestaques();
  renderLista();
})();
