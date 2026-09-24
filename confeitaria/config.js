/* ==========================================================================
   CONFIGURAÇÃO DO SITE
   --------------------------------------------------------------------------
   Tudo o que você precisa editar fica neste arquivo.
   Use *asteriscos* para deixar uma palavra em itálico no título.
   ========================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------- MARCA */
  marca: {
    nome: "Sua Confeitaria",                        // aparece no topo
    descricao: "Confeitaria artesanal por encomenda" // aparece acima do título
  },

  /* ------------------------------------------------------------- WHATSAPP */
  whatsapp: {
    // Número com DDI + DDD, só números. Ex.: 55 11 91234-5678 → "5511912345678"
    numero: "5511999999999",
    // Mensagem que já aparece escrita quando a pessoa toca em "Encomendar"
    mensagem: "Olá! Vi os doces no site e gostaria de fazer uma encomenda."
  },

  /* ----------------------------------------------------------------- HERO */
  hero: {
    titulo: "Doces feitos para transformar momentos em *memórias*.",
    subtitulo: "Encomende suas sobremesas favoritas e receba tudo preparado com carinho e cuidado.",

    // Doces que flutuam na abertura do site.
    // Com 3 doces, cada um ganha um lugar próprio, em triângulo, no computador e no celular.
    // "foto" é a posição da foto na lista "fotos" do produto: 0 = primeira, 1 = segunda...
    composicao: [
      { produto: "mousse-maracuja", foto: 0 },
      { produto: "mousse-limao",    foto: 0 },
      { produto: "mini-pudim",      foto: 0 }
    ]
  },

  /* ------------------------------------------------------ DOCES LIVRES
     Parte abaixo da abertura: cada doce aparece sozinho, grande, flutuando
     livre, sem moldura. Use os ids dos produtos, na ordem em que devem aparecer.
     Para o doce ficar realmente solto, a foto precisa ser recortada
     (PNG ou WebP com fundo transparente) e o produto com recortada: true.
  ------------------------------------------------------------------------ */
  livres: ["mousse-maracuja", "mousse-limao", "mini-pudim"],

  /* ----------------------------------------------------------- ENCOMENDA
     Lista com + e − para o cliente escolher a quantidade de cada doce.
     O botão embaixo abre o WhatsApp com o pedido já escrito.
  ------------------------------------------------------------------------ */
  pedido: {
    titulo: "Monte sua *encomenda*",
    produtos: ["mousse-maracuja", "mousse-limao", "mini-pudim"],  // ids, na ordem
    maximo: 99,   // quantidade máxima de cada doce
    // Início da mensagem. A lista com as quantidades entra logo abaixo.
    mensagem: "Olá! Vi os doces no site e gostaria de encomendar:"
  },

  /* ------------------------------------------------------------- PRODUTOS
     id         identificador sem espaços e sem acentos (usado no hero)
     nome       nome do doce
     fotos      lista de fotos reais, de ângulos diferentes. A primeira é a principal.
                Coloque os arquivos em assets/img/produtos/
     recortada  true se as fotos forem PNG/WebP com fundo transparente (doce recortado).
                false se forem fotos comuns, com fundo: o site mostra dentro de uma moldura.
     preco      preço de cada unidade, em reais, com ponto. Ex.: 7.00 ou 12.50
     cor        tom usado enquanto a foto não chega. Use uma cor tirada do próprio doce.
  ------------------------------------------------------------------------ */
  produtos: [
    {
      id: "mini-pudim",
      nome: "Mini Pudim",
      fotos: [
        // "assets/img/produtos/mini-pudim.webp",
      ],
      preco: 7.00,
      recortada: false,
      cor: "#C98E56"
    },
    {
      id: "mousse-limao",
      nome: "Mousse de Limão",
      fotos: [
        // "assets/img/produtos/mousse-limao.webp",
      ],
      preco: 7.00,
      recortada: false,
      cor: "#C8CF86"
    },
    {
      id: "mousse-maracuja",
      nome: "Mousse de Maracujá",
      fotos: [
        // "assets/img/produtos/mousse-maracuja.webp",
      ],
      preco: 7.00,
      recortada: false,
      cor: "#E0B64E"
    }
  ]
};
