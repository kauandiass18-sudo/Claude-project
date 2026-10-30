/* =========================================================================
   House Hamburgueria 66 · dados iniciais

   Só contém informações tiradas do Instagram @house_hamburgueria66.
   O que ainda não foi confirmado pela loja está marcado com CONFIRMAR e
   pode ser trocado pelo painel (admin.html), sem mexer em código.

   Produtos: cada item tem
     categoria   id da categoria
     nome        nome no site e na mensagem do WhatsApp
     descricao   texto curto
     preco       número (94.99) ou null = "Consultar valor" pelo WhatsApp
     aPartirDe   true = mostra "a partir de" antes do preço
     foto        caminho ou link da foto. Vazio = moldura "foto em breve"
     selo        etiqueta opcional sobre a foto
     destaque    true = aparece em destaque no topo da categoria
     opcoes      grupos de escolha: tamanhos, adicionais, acompanhamentos
                 { nome, tipo: "uma" | "varias", obrigatorio, max,
                   itens: [{ nome, preco }] }   preco = acréscimo em R$
   ========================================================================= */
(function () {
  var IMG = "assets/img/";

  window.HOUSE_PADRAO = {
    loja: {
      nome: "House Hamburgueria 66",
      instagram: "house_hamburgueria66",
      facebook: "",                     // CONFIRMAR: link da página "House Deliveri"
      // WhatsApp do link da bio e das postagens do Instagram.
      whatsapp: "5541992831441",
      endereco: "Rua Orlando Ceccon, 724",
      cidade: "Colombo · PR",
      horarioTexto: "Segunda a segunda, das 11h às 23h30",
      horario: { dias: [0, 1, 2, 3, 4, 5, 6], abre: "11:00", fecha: "23:30" },
      entrega: true,
      retirada: true,
      taxaEntrega: null,                // CONFIRMAR: null = "a combinar no WhatsApp"
      pagamentos: [],                   // CONFIRMAR: ex. ["Pix", "Cartão", "Dinheiro"]
      aviso: ""                         // faixa opcional no topo do site
    },

    categorias: [
      { id: "piscinas", nome: "Piscinas de Cheddar", ordem: 1, ativo: true, estilo: "destaque", foto: IMG + "destaque-piscinas.webp" },
      { id: "mini-burgers", nome: "Mini Burgers", ordem: 2, ativo: true, estilo: "normal", foto: IMG + "destaque-mini-burgers.webp" },
      { id: "lanches", nome: "Lanches", ordem: 3, ativo: true, estilo: "normal", foto: IMG + "destaque-lanches.webp" },
      { id: "porcoes", nome: "Porções", ordem: 4, ativo: true, estilo: "normal", foto: IMG + "destaque-porcoes.webp" },
      { id: "bebidas", nome: "Bebidas", ordem: 5, ativo: true, estilo: "normal", foto: "" }
    ],

    produtos: [
      {
        id: "piscina-de-cheddar",
        categoria: "piscinas",
        nome: "Piscina de Cheddar",
        descricao: "Hambúrgueres no pão, batata frita e bacon, tudo coberto de cheddar artesanal e servido na mesma bandeja.",
        preco: 94.99,
        aPartirDe: true,
        foto: IMG + "piscina-de-cheddar.webp",
        selo: "Destaque da casa",
        destaque: true,
        ativo: true,
        ordem: 1,
        opcoes: []                      // CONFIRMAR: tamanhos e adicionais reais
      }
    ],

    promocoes: [
      {
        id: "promo-piscinas",
        titulo: "Piscinas de Cheddar",
        texto: "Cansado de comer sempre a mesma coisa? Fuja da rotina com as nossas piscinas de cheddar artesanal.",
        preco: 94.99,
        aPartirDe: true,
        foto: IMG + "piscina-de-cheddar.webp",
        produtoId: "piscina-de-cheddar",
        selo: "",
        ativo: false,                   // repetia o destaque do topo; ligue no painel quando houver oferta
        ordem: 1
      }
    ]
  };
})();
