/* =============================================================
   Página inicial: monta a capa (foto em arco, nome, frases e
   redes sociais) a partir de data/perfil.js.
   Campos vazios simplesmente não aparecem: nada de texto genérico.
   ============================================================= */
(function () {
  "use strict";
  const { el, ICONES, NOMES_REDES, linkSeguro, imagemSegura, montarRodape } = window.App;
  const perfil = window.PERFIL || {};
  const nomePerfil = typeof perfil.nome === "string" ? perfil.nome.trim() : "";

  /* ---------- Nome ---------- */
  const nome = document.querySelector("[data-perfil-nome]");
  if (nome) {
    if (nomePerfil) {
      const enfeite = typeof perfil.enfeiteNome === "string" ? perfil.enfeiteNome.trim() : "";
      // "✨" vira uma estrela dourada desenhada (combina com o resto do site)
      const ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c.8 5.6 4.4 9.2 10 10-5.6.8-9.2 4.4-10 10-.8-5.6-4.4-9.2-10-10 5.6-.8 9.2-4.4 10-10z"/></svg>';
      const lado = () =>
        enfeite
          ? enfeite === "✨"
            ? el("span", { class: "capa__enfeite", "aria-hidden": "true", html: ESTRELA })
            : el("span", { class: "capa__enfeite", "aria-hidden": "true", text: enfeite })
          : null;
      nome.replaceChildren(
        ...[lado(), el("span", { class: "capa__nome-texto", text: nomePerfil }), lado()].filter(Boolean)
      );
      document.title = `${nomePerfil} · Cuidados para o cabelo`;
      const marca = document.querySelector("[data-perfil-marca]");
      if (marca) marca.textContent = nomePerfil;
    } else {
      nome.classList.add("sr-only"); // mantém um título para leitores de tela
    }
  }

  /* ---------- Frases (uma por linha) ---------- */
  const caixaFrases = document.querySelector("[data-perfil-frases]");
  if (caixaFrases) {
    const frases = (Array.isArray(perfil.frases) ? perfil.frases : [])
      .map((f) => (typeof f === "string" ? f.trim() : ""))
      .filter(Boolean);
    if (frases.length) {
      caixaFrases.replaceChildren(...frases.map((f) => el("p", { class: "frases__linha", text: f })));
    } else {
      caixaFrases.hidden = true;
    }
  }

  /* ---------- Foto em arco ---------- */
  const arco = document.querySelector("[data-perfil-foto]");
  if (arco) {
    const ornamento = () => {
      arco.classList.add("arco--vazio");
      arco.replaceChildren(el("span", { class: "arco__ornamento", html: ICONES.ondas }));
    };
    const src = imagemSegura(perfil.foto);
    if (src) {
      const img = el("img", {
        src,
        alt: nomePerfil ? `Foto de ${nomePerfil}` : "Foto de perfil",
        width: "300",
        height: "380",
        decoding: "async",
        fetchpriority: "high"
      });
      img.addEventListener("error", ornamento, { once: true });
      arco.replaceChildren(img);
    } else {
      ornamento();
    }
  }

  /* ---------- Botão "Feche sua parceria aqui" ---------- */
  const botaoParceria = document.querySelector("[data-link-parceria]");
  if (botaoParceria) {
    const url = linkSeguro(perfil.linkParceria, { permitirMailto: true });
    if (url) {
      botaoParceria.href = url;
      botaoParceria.hidden = false;
      if (!url.startsWith("mailto:")) {
        botaoParceria.target = "_blank";
        botaoParceria.rel = "noopener";
      }
    } else {
      // Sem link ainda: o botão fica escondido até você preencher linkParceria.
      botaoParceria.hidden = true;
    }
  }

  /* ---------- Botões do Mercado Livre e da Shopee ----------
     Só aparecem quando a loja tem pelo menos um produto em data/<loja>.js.
     Sem nenhum botão, o bloco e o link "Achadinhos" do menu somem também. */
  const lojas = window.LOJAS || {};
  document.querySelectorAll("[data-botao-loja]").forEach((botao) => {
    const dados = lojas[botao.dataset.botaoLoja];
    const temProdutos = dados && Array.isArray(dados.produtos) && dados.produtos.length > 0;
    botao.hidden = !temProdutos;
  });
  const blocoBotoes = document.querySelector("#achadinhos");
  if (blocoBotoes) {
    const algum = Array.from(blocoBotoes.children).some((b) => !b.hidden);
    blocoBotoes.hidden = !algum;
    const linkMenu = document.querySelector("[data-nav-achadinhos]");
    if (linkMenu && !algum) {
      // No lugar de "Achadinhos", o menu leva às categorias da vitrine
      linkMenu.href = "#titulo-categorias";
      linkMenu.textContent = "Categorias";
    }
  }

  /* ---------- Redes sociais (texto em versalete) ---------- */
  const lista = document.querySelector("[data-perfil-redes]");
  if (lista) {
    const itens = (perfil.redes || [])
      .map((rede) => {
        const tipo = String(rede.tipo || "").toLowerCase();
        const url = linkSeguro(rede.url, { permitirMailto: true });
        if (!url) return null;
        const rotulo = NOMES_REDES[tipo] || tipo || "Link";
        const externo = !url.startsWith("mailto:");
        return el("li", null,
          el("a", {
            class: "social__link",
            href: url,
            "aria-label": rotulo,
            target: externo ? "_blank" : null,
            rel: externo ? "noopener me" : null
          }, [
            el("span", { class: "social__icone", html: ICONES[tipo] || ICONES.link }),
            el("span", { class: "social__texto", text: rotulo })
          ])
        );
      })
      .filter(Boolean);
    if (itens.length) lista.replaceChildren(...itens);
    else lista.hidden = true;
  }

  montarRodape();
})();
