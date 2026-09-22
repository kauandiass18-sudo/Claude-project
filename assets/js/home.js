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
      nome.textContent = nomePerfil;
      document.title = `${nomePerfil} · Minha curadoria`;
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
      arco.replaceChildren(el("span", { class: "arco__ornamento", html: ICONES.brilho }));
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
