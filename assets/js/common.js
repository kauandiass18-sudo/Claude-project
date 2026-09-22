/* =============================================================
   Funções compartilhadas por todas as páginas.
   Normalmente você NÃO precisa editar este arquivo.
   ============================================================= */
(function () {
  "use strict";

  const SVG_ATTRS =
    'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';

  const svg = (inner) => `<svg ${SVG_ATTRS}>${inner}</svg>`;

  // Ícones (SVG estáticos, sem dependências externas)
  const ICONES = {
    instagram: svg('<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none"/>'),
    tiktok: svg('<path d="M15.5 3c.35 2.4 1.9 4 4.5 4.3v3.4a8 8 0 0 1-4.5-1.4V15a6 6 0 1 1-6-6v3.5a2.5 2.5 0 1 0 2.5 2.5V3z"/>'),
    youtube: svg('<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>'),
    whatsapp: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.3-1.7-1-1 .6a4 4 0 0 1-2.1-2.1l.6-1-1-1.7L9 9.5z"/>'),
    facebook: svg('<path d="M18 2.5h-3a5 5 0 0 0-5 5v3H7v4h3v7h4v-7h3l1-4h-4v-3a1 1 0 0 1 1-1h3z"/>'),
    pinterest: svg('<circle cx="12" cy="12" r="9.5"/><path d="M10.2 20.8 12 13.5"/><path d="M9.3 14.4C8.2 12.2 9 8.4 12.6 8.2c3-.2 4.4 2.5 3.4 5-.7 1.7-2.4 2.3-3.9 1.4"/>'),
    threads: svg('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9"/>'),
    x: svg('<path d="M4 4l16 16"/><path d="M20 4 4 20"/>'),
    telegram: svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),
    email: svg('<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),

    voltar: svg('<path d="M15 18l-6-6 6-6"/>'),
    seta: svg('<path d="M9 18l6-6-6-6"/>'),
    externo: svg('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    busca: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    fechar: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    estrela: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>'),
    sacola: svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
    etiqueta: svg('<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>'),
    brilho: svg('<path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5z"/><path d="M19 16.5c.25 1.6 1 2.35 2.5 2.5-1.5.15-2.25.9-2.5 2.5-.25-1.6-1-2.35-2.5-2.5 1.5-.15 2.25-.9 2.5-2.5z"/>'),
    caixa: svg('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>')
  };

  const NOMES_REDES = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    pinterest: "Pinterest",
    threads: "Threads",
    x: "X (Twitter)",
    telegram: "Telegram",
    email: "E-mail"
  };

  /** Cria um elemento com atributos e filhos (texto é sempre escapado). */
  function el(tag, attrs, filhos) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [chave, valor] of Object.entries(attrs)) {
        if (valor === null || valor === undefined || valor === false) continue;
        if (chave === "class") node.className = valor;
        else if (chave === "text") node.textContent = valor;
        else if (chave === "html") node.innerHTML = valor; // usado só com ícones internos
        else if (chave.startsWith("on") && typeof valor === "function") {
          node.addEventListener(chave.slice(2), valor);
        } else node.setAttribute(chave, valor === true ? "" : valor);
      }
    }
    (Array.isArray(filhos) ? filhos : filhos ? [filhos] : []).forEach((f) => {
      if (f === null || f === undefined || f === false) return;
      node.append(f instanceof Node ? f : document.createTextNode(String(f)));
    });
    return node;
  }

  /** Aceita apenas links http(s) (e mailto:, quando permitido). */
  function linkSeguro(url, { permitirMailto = false } = {}) {
    if (typeof url !== "string") return null;
    const limpo = url.trim();
    if (!limpo) return null;
    if (permitirMailto && /^mailto:[^\s]+@[^\s]+$/i.test(limpo)) return limpo;
    try {
      const u = new URL(limpo);
      return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
    } catch (_) {
      return null;
    }
  }

  /** Imagens: aceita caminho relativo do projeto ou link http(s). */
  function imagemSegura(src) {
    if (typeof src !== "string") return null;
    const limpo = src.trim();
    if (!limpo) return null;
    if (/^(https?:)?\/\//i.test(limpo)) return linkSeguro(limpo.startsWith("//") ? "https:" + limpo : limpo);
    if (/^[a-z][a-z0-9+.-]*:/i.test(limpo)) return null; // bloqueia javascript:, data:, etc.
    return limpo;
  }

  /** Adiciona parâmetros de afiliado (ex.: parceiro=19285) se estiverem faltando. */
  function aplicarParametrosAfiliado(url, loja) {
    const params = loja && loja.parametrosAfiliado;
    const dominios = (loja && loja.dominiosAfiliado) || [];
    if (!params || !dominios.length) return url;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      const pertence = dominios.some((d) => host === d || host.endsWith("." + d));
      if (!pertence) return url;
      for (const [k, v] of Object.entries(params)) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, v);
      }
      return u.href;
    } catch (_) {
      return url;
    }
  }

  /** Remove acentos e deixa minúsculo, para busca. */
  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  function iniciais(nome) {
    const partes = String(nome || "").trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return "•";
    const a = partes[0][0] || "";
    const b = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (a + b).toUpperCase();
  }

  /** Rodapé com aviso de afiliado e ano atual. */
  function montarRodape() {
    const alvo = document.querySelector("[data-rodape]");
    if (!alvo) return;
    const perfil = window.PERFIL || {};
    const nome = typeof perfil.nome === "string" ? perfil.nome.trim() : "";
    alvo.replaceChildren(
      ...[
        el("p", { class: "rodape__ornamento", html: ICONES.brilho }),
        nome ? el("p", { class: "rodape__assinatura", text: nome }) : null,
        perfil.avisoAfiliado ? el("p", { class: "rodape__aviso", text: perfil.avisoAfiliado }) : null,
        el("p", { class: "rodape__copy", text: `Curadoria · ${new Date().getFullYear()}` })
      ].filter(Boolean)
    );
  }

  window.App = {
    ICONES,
    NOMES_REDES,
    el,
    linkSeguro,
    imagemSegura,
    aplicarParametrosAfiliado,
    normalizar,
    iniciais,
    montarRodape
  };
})();
