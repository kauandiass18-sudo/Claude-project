/* Página inicial: preenche foto, nome, descrição e redes sociais a partir de data/perfil.js */
(function () {
  "use strict";
  const { el, ICONES, NOMES_REDES, linkSeguro, imagemSegura, iniciais, montarRodape } = window.App;
  const perfil = window.PERFIL || {};

  // Nome e descrição
  const nome = document.querySelector("[data-perfil-nome]");
  const descricao = document.querySelector("[data-perfil-descricao]");
  if (nome && perfil.nome) nome.textContent = perfil.nome;
  if (descricao) {
    if (perfil.descricao) descricao.textContent = perfil.descricao;
    else descricao.hidden = true;
  }
  if (perfil.nome) document.title = `${perfil.nome} · Links`;

  // Foto / logo (ou monograma com iniciais)
  const avatar = document.querySelector("[data-perfil-foto]");
  if (avatar) {
    const monograma = () =>
      avatar.replaceChildren(el("span", { class: "avatar__iniciais", text: iniciais(perfil.nome) }));
    const src = imagemSegura(perfil.foto);
    if (src) {
      const img = el("img", {
        src,
        alt: perfil.nome ? `Foto de ${perfil.nome}` : "Foto de perfil",
        width: "112",
        height: "112",
        decoding: "async",
        fetchpriority: "high"
      });
      img.addEventListener("error", monograma, { once: true });
      avatar.replaceChildren(img);
    } else {
      monograma();
    }
  }

  // Redes sociais (só aparecem as que têm URL)
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
            title: rotulo,
            target: externo ? "_blank" : null,
            rel: externo ? "noopener me" : null,
            html: ICONES[tipo] || ICONES.link
          })
        );
      })
      .filter(Boolean);
    if (itens.length) lista.replaceChildren(...itens);
    else lista.hidden = true;
  }

  montarRodape();
})();
