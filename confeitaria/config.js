/* ==========================================================================
   CONFIGURAÇÃO DO SITE
   --------------------------------------------------------------------------
   Tudo o que você precisa editar no dia a dia está neste arquivo.
   Textos entre [colchetes] são espaços reservados: aparecem no site em
   itálico apagado até você trocar pelo texto definitivo (sem os colchetes).
   Use *asteriscos* para deixar uma palavra em itálico no título.
   ========================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------- MARCA */
  marca: {
    nome: "Sua Confeitaria",                 // nome que aparece no topo e no rodapé
    descricao: "Confeitaria artesanal por encomenda",
    atendimento: ""                           // opcional. Ex.: "Entregas em Campinas e região"
  },

  /* ------------------------------------------------------------- WHATSAPP */
  whatsapp: {
    // Número com DDI + DDD, só números. Ex.: 55 11 91234-5678 → "5511912345678"
    numero: "5511999999999",
    // Mensagem dos botões gerais ("Fazer encomenda", botão flutuante)
    mensagem: "Olá! Vi os doces no site e gostaria de fazer uma encomenda.",
    // Mensagem do botão "Encomendar" de cada produto. {produto} vira o nome do doce.
    mensagemProduto: "Olá! Vi os doces no site e gostaria de encomendar: {produto}."
  },

  /* ------------------------------------------------------------ INSTAGRAM */
  instagram: {
    usuario: "suaconfeitaria",                         // sem o @
    link: "https://www.instagram.com/suaconfeitaria/"
  },

  /* ----------------------------------------------------------------- HERO */
  hero: {
    titulo: "Doces feitos para transformar momentos em *memórias*.",
    subtitulo: "Encomende suas sobremesas favoritas e receba tudo preparado com carinho e cuidado.",

    // Doces que flutuam na abertura do site (até 6).
    // "foto" é a posição da foto na lista "fotos" do produto: 0 = primeira, 1 = segunda...
    // No celular aparecem só os 4 primeiros. A ordem define o lugar de cada doce:
    //   1º grande, em primeiro plano · 2º médio · 3º médio · 4º pequeno, ao fundo
    //   5º pequeno, ao fundo (só computador) · 6º pequeno (só computador)
    composicao: [
      { produto: "mini-pudim",       foto: 0 },
      { produto: "mousse-maracuja",  foto: 0 },
      { produto: "mousse-maracuja",  foto: 1 },
      { produto: "mini-pudim",       foto: 1 },
      { produto: "mousse-maracuja",  foto: 2 },
      { produto: "mini-pudim",       foto: 2 }
    ]
  },

  /* ------------------------------------------------------------- PRODUTOS
     id         identificador sem espaços e sem acentos (usado no hero e nos destaques)
     nome       nome do doce
     descricao  descrição curta
     preco      opcional. Ex.: "R$ 12,00" ou "R$ 60,00 · caixa com 6". Vazio = não mostra
     fotos      lista de fotos reais, de ângulos diferentes. A primeira é a principal.
                Coloque os arquivos em assets/img/produtos/
     recortada  true se as fotos forem PNG/WebP com fundo transparente (doce recortado).
                false se forem fotos comuns, com fundo: o site mostra dentro de uma moldura.
     cor        tom de fundo do card. Use uma cor tirada do próprio doce.
  ------------------------------------------------------------------------ */
  produtos: [
    {
      id: "mini-pudim",
      nome: "Mini Pudim",
      descricao: "[Descrição curta do mini pudim: sabor, textura e tamanho.]",
      preco: "",
      fotos: [
        // "assets/img/produtos/mini-pudim-1.webp",
        // "assets/img/produtos/mini-pudim-2.webp",
      ],
      recortada: false,
      cor: "#C98E56"
    },
    {
      id: "mousse-maracuja",
      nome: "Mousse de Maracujá",
      descricao: "[Descrição curta da mousse: sabor, textura e tamanho.]",
      preco: "",
      fotos: [
        // "assets/img/produtos/mousse-maracuja-1.webp",
      ],
      recortada: false,
      cor: "#E0B64E"
    }
  ],

  /* Produtos mostrados em tamanho grande na seção "Em destaque" (pelos ids) */
  destaques: ["mini-pudim", "mousse-maracuja"],

  /* ---------------------------------------------------------------- SOBRE */
  sobre: {
    titulo: "Feito à mão, pensado para o seu *momento*.",
    foto: "",   // opcional. Ex.: "assets/img/marca/confeiteira.jpg"
    historia: [
      "[Conte aqui como a confeitaria começou: quem faz os doces, desde quando e o que motivou o começo.]",
      "[Um segundo parágrafo opcional sobre a trajetória até hoje.]"
    ],
    pilares: [
      { titulo: "Propósito",          texto: "[O que a marca quer proporcionar a quem prova os doces.]" },
      { titulo: "Diferencial",        texto: "[O que torna os seus doces diferentes dos outros.]" },
      { titulo: "Ingredientes",       texto: "[Como os ingredientes são escolhidos. Cite só o que for verdade.]" },
      { titulo: "Produção artesanal", texto: "[Como é o preparo: feito à mão, em pequenas quantidades, sob encomenda.]" }
    ]
  },

  /* -------------------------------------------------------- COMO FUNCIONA */
  passos: [
    { titulo: "Escolha seus doces",           texto: "Navegue pelo cardápio e separe os seus favoritos." },
    { titulo: "Faça sua encomenda",           texto: "Chame no WhatsApp e combine sabores, quantidades e a data." },
    { titulo: "Receba ou retire seu pedido",  texto: "Tudo preparado com carinho e cuidado para o seu momento." }
  ]
};
