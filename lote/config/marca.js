/* =============================================================
   CONFIGURAÇÃO DA MARCA
   =============================================================
   Tudo o que define a identidade e os textos fixos da vitrine fica
   aqui: nome, cores, fontes, textos, navegação, rodapé e contato.
   As PEÇAS, as CATEGORIAS e as COMBINAÇÕES ficam em
   data/catalogo.js (e podem ser editadas pelo painel em /admin).

   Regras rápidas
   • Textos entre aspas. Itens de listas separados por vírgula.
   • Campo vazio ("") = o elemento correspondente não aparece.
   • Nos títulos, o trecho entre *asteriscos* aparece vazado.
   ============================================================= */

window.MARCA = {
  // ---------------------------------------------------------------
  // IDENTIDADE
  // ---------------------------------------------------------------
  nome: "LOTE",
  // Complemento pequeno ao lado do logotipo ("" para esconder).
  complemento: "BR",
  descricao: "Calças cargo, camisetas, camisas e bermudas escolhidas peça por peça na Shopee, com tecido, modelagem e tamanhos informados.",

  // Logotipo
  //  • tipo "texto": usa o nome acima na fonte de títulos.
  //  • tipo "imagem": informe o arquivo (SVG ou PNG) em src.
  logotipo: { tipo: "texto", src: "", largura: 120, altura: 32 },

  site: {
    // Endereço público, sem barra no final. Ativa o link canônico e o sitemap.
    url: "",
    imagemCompartilhamento: "assets/img/marca/compartilhamento.jpg"
  },

  // ---------------------------------------------------------------
  // PALETA
  // Fundo escuro com granulado, peças sobre placas cinza-concreto e
  // uma única cor de ação (destaque), usada nos botões que levam à Shopee.
  // ---------------------------------------------------------------
  cores: {
    fundo: "#0D0D0C",
    superficie: "#171716",
    pocoImagem: "#D6D3CB",      // placa atrás das fotos das peças
    texto: "#EDEAE3",
    textoSecundario: "#B4B0A8",
    textoSuave: "#8A867F",
    linha: "#2B2B28",
    destaque: "#C8FF1F",         // verde-limão: botões que levam à Shopee
    destaqueHover: "#B6EE00",
    textoSobreDestaque: "#0D0D0C"
  },

  // ---------------------------------------------------------------
  // TIPOGRAFIA (Google Fonts)
  // Títulos: Archivo superestreita e pesada. Etiquetas: monoespaçada.
  // Anotações e adesivos: letra de marcador.
  // ---------------------------------------------------------------
  tipografia: {
    googleFonts: "family=Archivo:wdth,wght@62..125,300..900&family=JetBrains+Mono:wght@400;500&family=Permanent+Marker&display=swap",
    titulos: "\"Archivo\", \"Arial Narrow\", \"Helvetica Neue\", Arial, sans-serif",
    texto: "\"Archivo\", \"Helvetica Neue\", Arial, system-ui, sans-serif",
    mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    // Letra de marcador das anotações e adesivos
    marcador: "\"Permanent Marker\", \"Comic Sans MS\", cursive"
  },

  // ---------------------------------------------------------------
  // FOTOS DAS PEÇAS
  // ---------------------------------------------------------------
  imagens: {
    proporcao: "4 / 5",
    // "contain": peça inteira, sem cortes (fotos de vendedor com fundo branco).
    // "cover": preenche a placa (fotos com modelo).
    ajuste: "contain",
    integrarFundoBranco: true
  },

  // Peças marcadas com demo: true em data/catalogo.js.
  // false = escondidas do site (use quando as peças reais entrarem).
  exibirExemplos: true,

  // ---------------------------------------------------------------
  // TEXTOS
  // ---------------------------------------------------------------
  textos: {
    hero: {
      // Cada linha ocupa a largura da tela.
      linhas: ["Bolso grande.", "Corte largo."],
      texto: "Calças cargo, camisetas, camisas e bermudas escolhidas peça por peça na Shopee. Tecido, modelagem e tamanhos informados em cada uma.",
      botaoPrincipal: "Ver o lote",
      botaoSecundario: "Calças cargo",
      linkSecundario: "catalogo.html?categoria=calcas-cargo"
    },

    // Faixas cruzadas abaixo da primeira dobra (vazia = usa categorias e tecidos)
    faixa: [],
    faixa2: ["Drop 01", "Escolhido peça por peça", "Compra na Shopee", "Tamanhos informados"],
    // Texto do selo redondo que gira na primeira dobra
    selo: "Drop 01 · Streetwear · Cargo · Oversized ·",
    // Anotações em letra de marcador ("" esconde)
    anotacoes: {
      hero: "a peça da vez",
      categorias: "escolhe aí",
      lote: "passa pro lado",
      combinacoes: "look pronto",
      tamanhos: "cor e tamanho você escolhe lá"
    },
    // Adesivo "novo" nas peças adicionadas há até X dias (0 desliga)
    diasNovo: 7,

    secoes: {
      categoriasTitulo: "Categorias",
      loteTitulo: "O lote",
      loteTexto: "As peças em destaque agora.",
      combinacoesTitulo: "Combinações",
      combinacoesTexto: "Peças do lote que funcionam juntas.",
      recentesTitulo: "Chegaram agora",
      vistosTitulo: "Vistos por você",
      relacionadosTitulo: "Combina com"
    },

    botaoProduto: "Ver produto na Shopee",
    botaoCard: "Ver na Shopee",

    comoFunciona: {
      titulo: "Como *funciona*",
      passos: [
        {
          titulo: "Escolha aqui",
          texto: "Cada peça tem fotos, tecido, modelagem, cores e os tamanhos da última conferência."
        },
        {
          titulo: "Confira na Shopee",
          texto: "O botão abre a página da peça na Shopee. Lá estão o preço atualizado, o frete e a tabela de medidas do vendedor."
        },
        {
          titulo: "Compre por lá",
          texto: "Cor, tamanho, pagamento, entrega e trocas são feitos na Shopee, com o vendedor. Esta vitrine não vende nem recebe pagamentos."
        }
      ]
    },

    avisoAfiliado: "Os botões desta vitrine são links de afiliado da Shopee. Quando uma compra qualificada é feita por eles, podemos receber uma comissão, sem custo adicional para você. Isso não muda o preço nem as condições da compra.",
    avisoBotao: "Você será levado à Shopee. Link de afiliado.",
    avisoPreco: "Preço, cores e tamanhos podem mudar na Shopee. Confira na página da peça antes de comprar.",
    avisoMedidas: "Os tamanhos variam entre vendedores. Compare a tabela de medidas da Shopee com uma peça que você já tem.",
    avisoMarca: "Vitrine independente. Não é a Shopee e não representa a Shopee oficialmente.",
    avisoExemplos: "Vitrine em montagem: as peças exibidas são exemplos ilustrados e ainda não levam a ofertas reais."
  },

  // ---------------------------------------------------------------
  // NAVEGAÇÃO PRINCIPAL
  // { categorias: true } mostra as categorias do catálogo neste ponto.
  // ---------------------------------------------------------------
  navegacao: [
    { categorias: true },
    { rotulo: "Tudo", href: "catalogo.html" },
    { rotulo: "Como funciona", href: "como-funciona.html" }
  ],

  // ---------------------------------------------------------------
  // CONTATO E REDES — só aparecem os campos preenchidos.
  // ---------------------------------------------------------------
  contato: {
    email: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    whatsapp: ""
  },

  // Responsável pelo site, exibido na política de privacidade.
  responsavel: "",

  // ---------------------------------------------------------------
  // RODAPÉ
  // ---------------------------------------------------------------
  rodape: {
    colunas: [
      {
        titulo: "Peças",
        links: [
          { rotulo: "Tudo", href: "catalogo.html" },
          { rotulo: "Favoritos", href: "favoritos.html" }
        ],
        incluirCategorias: true
      },
      {
        titulo: "Sobre",
        links: [
          { rotulo: "Como funciona", href: "como-funciona.html" },
          { rotulo: "Links de afiliado", href: "como-funciona.html#afiliados" },
          { rotulo: "Privacidade", href: "privacidade.html" }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------
  // PAINEL ADMINISTRATIVO (/admin)
  // NÃO coloque tokens aqui: o token é digitado no próprio painel.
  // ---------------------------------------------------------------
  admin: {
    github: {
      dono: "kauandiass18-sudo",
      repositorio: "claude-project",
      branch: "claude/quais-hksopy",
      pasta: "lote"
    }
  }
};
