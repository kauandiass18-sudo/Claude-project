/* =============================================================
   CONFIGURAÇÃO DA MARCA
   =============================================================
   Tudo o que define a identidade e os textos fixos da vitrine fica
   aqui: nome, logotipo, cores, fontes, textos, navegação, rodapé e
   contato. Os PRODUTOS e as CATEGORIAS ficam em data/catalogo.js
   (e podem ser editados pelo painel em /admin).

   Regras rápidas
   • Textos entre aspas. Itens de listas separados por vírgula.
   • Campo vazio ("") = o elemento correspondente não aparece.
   • Nos títulos, o trecho entre *asteriscos* aparece em itálico.
   ============================================================= */

window.MARCA = {
  // ---------------------------------------------------------------
  // IDENTIDADE
  // ---------------------------------------------------------------
  nome: "Seleta",
  // Frase curta usada no rodapé, na aba do navegador e no compartilhamento.
  descricao: "Produtos da Shopee escolhidos um a um, com fotos, informações claras e link direto para cada página.",

  // Logotipo
  //  • tipo "texto": usa o nome acima, na fonte de títulos, com o ponto na cor de destaque.
  //  • tipo "imagem": informe o arquivo (SVG ou PNG) em src. Ex.: "assets/img/marca/logo.svg"
  logotipo: {
    tipo: "texto",
    src: "",
    largura: 120,  // largura da imagem em px (só para tipo "imagem")
    altura: 32
  },

  site: {
    // Endereço público do site, sem barra no final.
    // Ex.: "https://seudominio.com.br" ou "https://usuario.github.io/repositorio/seleta"
    // Usado no link canônico, no compartilhamento e no sitemap.xml.
    url: "",
    imagemCompartilhamento: "assets/img/marca/compartilhamento.jpg"
  },

  // ---------------------------------------------------------------
  // PALETA
  // Uma única cor de destaque, usada nas ações importantes (botões
  // que levam à Shopee, filtro ativo, foco). O resto é neutro para
  // valorizar as fotos dos produtos.
  // ---------------------------------------------------------------
  cores: {
    fundo: "#F5F3EF",            // fundo das páginas
    superficie: "#FFFFFF",       // painéis, menus, campos
    pocoImagem: "#ECE9E3",       // fundo atrás das fotos dos produtos
    texto: "#171614",
    textoSecundario: "#55514A",
    textoSuave: "#6B665E",
    linha: "#DDD8CF",
    destaque: "#2B44D6",         // cor de ação
    destaqueHover: "#2236B3",
    textoSobreDestaque: "#FFFFFF"
  },

  // ---------------------------------------------------------------
  // TIPOGRAFIA (Google Fonts)
  // googleFonts: trecho "family=..." do link do Google Fonts.
  // ---------------------------------------------------------------
  tipografia: {
    googleFonts: "family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&display=swap",
    titulos: "\"Instrument Serif\", \"Times New Roman\", Georgia, serif",
    texto: "\"Inter Tight\", \"Helvetica Neue\", Arial, system-ui, sans-serif"
  },

  // ---------------------------------------------------------------
  // FOTOS DOS PRODUTOS
  // ---------------------------------------------------------------
  imagens: {
    // Proporção do quadro das fotos nos cards: "4 / 5", "1 / 1" ou "3 / 4".
    proporcao: "4 / 5",
    // "contain" mostra o produto inteiro, sem cortes (recomendado para
    // fotos de vendedor com fundo branco). "cover" preenche o quadro.
    ajuste: "contain",
    // Integra o fundo branco das fotos ao fundo do quadro.
    integrarFundoBranco: true
  },

  // Produtos marcados com demo: true em data/catalogo.js.
  // false = escondidos do site (use quando os produtos reais entrarem).
  exibirExemplos: true,

  // ---------------------------------------------------------------
  // TEXTOS
  // ---------------------------------------------------------------
  textos: {
    hero: {
      sobretitulo: "Vitrine independente de produtos da Shopee",
      titulo: "Uma vitrine pequena, *de propósito.*",
      texto: "Em vez de milhares de resultados, uma seleção de produtos com fotos, informações claras e o link direto para a página de cada um na Shopee.",
      botaoPrincipal: "Explorar o catálogo",
      botaoSecundario: "Como funciona"
    },

    secoes: {
      categoriasTitulo: "Por onde começar",
      categoriasTexto: "Escolha uma categoria ou veja o catálogo inteiro.",
      destaquesTitulo: "Em destaque",
      destaquesTexto: "Os produtos que merecem um olhar mais demorado agora.",
      recentesTitulo: "Chegaram agora",
      recentesTexto: "As últimas entradas da vitrine.",
      vistosTitulo: "Vistos por você",
      relacionadosTitulo: "Da mesma linha"
    },

    // Texto dos botões que levam à Shopee
    botaoProduto: "Ver produto na Shopee",
    botaoCard: "Ver na Shopee",

    comoFunciona: {
      titulo: "Como a vitrine *funciona*",
      passos: [
        {
          titulo: "Você descobre aqui",
          texto: "Cada produto tem fotos, descrição e as informações que ajudam a decidir com calma."
        },
        {
          titulo: "Abre na Shopee",
          texto: "O botão leva direto à página do produto na Shopee, onde estão o preço atualizado, o frete e as opções do vendedor."
        },
        {
          titulo: "Compra por lá",
          texto: "Pagamento, entrega, trocas e atendimento acontecem na Shopee, com o vendedor. Esta vitrine não vende nem recebe pagamentos."
        }
      ]
    },

    avisoAfiliado: "Os botões desta vitrine são links de afiliado da Shopee. Quando uma compra qualificada é feita por eles, podemos receber uma comissão, sem custo adicional para você. Isso não muda o preço nem as condições da compra.",
    avisoBotao: "Você será levado à Shopee. Link de afiliado.",
    avisoPreco: "Preços e disponibilidade podem mudar na Shopee. Confira o valor final na página do produto antes de comprar.",
    avisoMarca: "Esta é uma vitrine independente. Não é a Shopee e não representa a Shopee oficialmente.",
    avisoExemplos: "Vitrine em montagem: os produtos exibidos são exemplos e ainda não levam a ofertas reais."
  },

  // ---------------------------------------------------------------
  // NAVEGAÇÃO PRINCIPAL
  // O item com categorias: true abre a lista de categorias.
  // ---------------------------------------------------------------
  navegacao: [
    { rotulo: "Início", href: "index.html" },
    { rotulo: "Catálogo", href: "catalogo.html" },
    { rotulo: "Categorias", categorias: true },
    { rotulo: "Como funciona", href: "como-funciona.html" }
  ],

  // ---------------------------------------------------------------
  // CONTATO E REDES — só aparecem os campos preenchidos.
  // Use apenas dados reais.
  // ---------------------------------------------------------------
  contato: {
    email: "",          // ex.: "contato@seudominio.com.br"
    instagram: "",      // ex.: "https://instagram.com/seuusuario"
    tiktok: "",
    youtube: "",
    whatsapp: ""        // ex.: "https://wa.me/5511999999999"
  },

  // Responsável pelo site, exibido na política de privacidade.
  responsavel: "",

  // ---------------------------------------------------------------
  // RODAPÉ
  // ---------------------------------------------------------------
  rodape: {
    colunas: [
      {
        titulo: "Vitrine",
        links: [
          { rotulo: "Catálogo completo", href: "catalogo.html" },
          { rotulo: "Favoritos", href: "favoritos.html" }
        ],
        // true = adiciona os links das categorias a esta coluna
        incluirCategorias: true
      },
      {
        titulo: "Sobre",
        links: [
          { rotulo: "Como funciona", href: "como-funciona.html" },
          { rotulo: "Transparência sobre afiliados", href: "como-funciona.html#afiliados" },
          { rotulo: "Política de privacidade", href: "privacidade.html" }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------
  // PAINEL ADMINISTRATIVO (/admin)
  // O painel publica as alterações direto no repositório do GitHub.
  // NÃO coloque tokens aqui: o token é digitado no próprio painel.
  // ---------------------------------------------------------------
  admin: {
    github: {
      dono: "kauandiass18-sudo",
      repositorio: "claude-project",
      branch: "claude/quais-hksopy",
      // Pasta da vitrine dentro do repositório ("" se ela estiver na raiz).
      pasta: "seleta"
    }
  }
};
