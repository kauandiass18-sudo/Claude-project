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
     id         identificador sem espaços e sem acentos (usado no hero)
     nome       nome do doce
     fotos      lista de fotos reais, de ângulos diferentes. A primeira é a principal.
                Coloque os arquivos em assets/img/produtos/
     recortada  true se as fotos forem PNG/WebP com fundo transparente (doce recortado).
                false se forem fotos comuns, com fundo: o site mostra dentro de uma moldura.
     cor        tom usado enquanto a foto não chega. Use uma cor tirada do próprio doce.
  ------------------------------------------------------------------------ */
  produtos: [
    {
      id: "mini-pudim",
      nome: "Mini Pudim",
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
      fotos: [
        // "assets/img/produtos/mousse-maracuja-1.webp",
      ],
      recortada: false,
      cor: "#E0B64E"
    }
  ]
};
