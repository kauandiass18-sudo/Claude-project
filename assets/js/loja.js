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
  const produtos = (Array.isArray(loja.produtos) ? loja.produtos : [])
    .map((p, i) => {
      const nome = p && typeof p.nome === "string" ? p.nome.trim() : "";
      const url = linkSeguro(p && p.affiliateUrl);
      if (!nome || !url) {
        console.warn(`[loja] Produto #${i + 1} ignorado em "${slug}": precisa de "nome" e de um "affiliateUrl" começando com https://`, p);
        return null;
      }
      const categoria = typeof p.categoria === "string" ? p.categoria.trim() : "";
      return {
        nome,
        categoria,
        imagem: imagemSegura(p.imagem),
        url: aplicarParametrosAfiliado(url, loja),
        destaque: p.destaque === true,
        busca: normalizar(`${nome} ${categoria}`)
      };
    })
    .filter(Boolean);

  /* ---------- Categorias ---------- */
  const ordem = (loja.ordemCategorias || []).map((c) => normalizar(c));
  const categorias = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))].sort((a, b) => {
    const ia = ordem.indexOf(normalizar(a));
    const ib = ordem.indexOf(normalizar(b));
    if (ia !== -1 || ib !== -1) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    return a.localeCompare(b, "pt-BR");
  });

  const estado = { categoria: "", busca: "" };

  /* ---------- Elementos ---------- */
  const campoBusca = $("[data-busca]");
  const limparBusca = $("[data-busca-limpar]");
  const areaBusca = $("[data-area-busca]");
  const listaCategorias = $("[data-categorias]");
  const secaoDestaques = $("[data-destaques-secao]");
  const trilhoDestaques = $("[data-destaques]");
  const secaoProdutos = $("[data-produtos-secao]");
  const tituloProdutos = $("[data-produtos-titulo]");
  const lista = $("[data-lista]");
  const contagem = $("[data-contagem]");
  const vazio = $("[data-vazio]");
  const linkLoja = $("[data-link-loja]");

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
        class: `card ${ehDestaque ? "card--destaque" : "card--lista"} revelar`,
        href: produto.url,
        target: "_blank",
        rel: "sponsored noopener",
        style: `--i:${Math.min(indice, 12)}`
      },
      [
        criarMidia(produto),
        el("span", { class: "card__corpo" }, [
          (mostrarCategoria || ehDestaque) && produto.categoria
            ? el("span", { class: "card__categoria", text: produto.categoria })
            : null,
          el("span", { class: "card__nome", text: produto.nome }),
          el("span", { class: "sr-only", text: " (abre em nova aba)" })
        ]),
        ehDestaque ? null : el("span", { class: "card__seta", html: ICONES.seta })
      ]
    );
    if (produto.destaque && !ehDestaque) {
      card.prepend(el("span", { class: "card__selo", "aria-label": "Destaque", html: ICONES.estrela }));
    }
    return card;
  }

  /* ---------- Renderização ---------- */
  function renderCategorias() {
    if (!listaCategorias) return;
    if (categorias.length < 2) {
      listaCategorias.hidden = true;
      return;
    }
    const chip = (valor, rotulo) =>
      el("button", {
        type: "button",
        class: "chip",
        "data-categoria": valor,
        "aria-pressed": String(estado.categoria === valor),
        text: rotulo,
        onclick: () => {
          estado.categoria = valor;
          listaCategorias.querySelectorAll(".chip").forEach((c) =>
            c.setAttribute("aria-pressed", String(c.dataset.categoria === valor))
          );
          renderLista();
        }
      });
    listaCategorias.replaceChildren(chip("", "Todos"), ...categorias.map((c) => chip(c, c)));
  }

  function renderDestaques() {
    if (!secaoDestaques || !trilhoDestaques) return;
    const destaques = produtos.filter((p) => p.destaque);
    if (!destaques.length) {
      secaoDestaques.hidden = true;
      return;
    }
    trilhoDestaques.replaceChildren(...destaques.map((p, i) => criarCard(p, i, "destaque")));
  }

  function renderLista() {
    const termo = normalizar(estado.busca);
    const filtrando = Boolean(termo || estado.categoria);
    const resultado = produtos.filter(
      (p) => (!estado.categoria || p.categoria === estado.categoria) && (!termo || p.busca.includes(termo))
    );

    if (secaoDestaques && trilhoDestaques && trilhoDestaques.childElementCount) {
      secaoDestaques.hidden = filtrando;
    }

    if (tituloProdutos) {
      tituloProdutos.textContent = estado.categoria || (termo ? "Resultados" : "Todos os produtos");
    }
    if (contagem) {
      contagem.textContent = `${resultado.length} ${resultado.length === 1 ? "produto" : "produtos"}`;
    }

    lista.replaceChildren(...resultado.map((p, i) => el("li", null, criarCard(p, i, "lista"))));

    if (!resultado.length) {
      mostrarVazio(
        "Nenhum produto encontrado",
        termo ? `Não encontramos resultados para “${estado.busca.trim()}”.` : "Não há produtos nesta categoria.",
        el("button", {
          type: "button",
          class: "botao-secundario",
          text: "Limpar filtros",
          onclick: () => {
            estado.busca = "";
            estado.categoria = "";
            if (campoBusca) campoBusca.value = "";
            atualizarBotaoLimpar();
            renderCategorias();
            renderLista();
          }
        })
      );
    } else if (vazio) {
      vazio.hidden = true;
    }
  }

  function mostrarVazio(tituloTxt, textoTxt, acao) {
    if (!vazio) return;
    vazio.replaceChildren(
      ...[
        el("span", { class: "vazio__icone", html: ICONES.caixa }),
        el("p", { class: "vazio__titulo", text: tituloTxt }),
        el("p", { class: "vazio__texto", text: textoTxt }),
        acao
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
    if (secaoDestaques) secaoDestaques.hidden = true;
    if (secaoProdutos) secaoProdutos.hidden = true;
    mostrarVazio(
      "Em breve, novidades por aqui",
      "Os produtos desta loja estão sendo selecionados. Volte em breve!",
      null
    );
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

  renderCategorias();
  renderDestaques();
  renderLista();
})();
