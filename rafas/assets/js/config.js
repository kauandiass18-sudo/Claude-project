/*
 * Rafa's Delivery — configurações
 * ---------------------------------------------------------------
 * Tudo o que muda no dia a dia fica aqui: nome, WhatsApp, horários,
 * bairros, tamanhos, bordas e o cardápio com os preços.
 *
 * Preços e sabores foram copiados do cardápio impresso da Rafa's.
 * Itens marcados com CONFIRMAR precisam ser conferidos com a pizzaria.
 */
window.PIZZARIA = {
  nome: "Rafa's Delivery",
  slogan: "Rafa's Pizzaria Delivery",

  // WhatsApp que RECEBE os pedidos: 55 + DDD + número, só números.
  whatsapp: "5549920037842",
  telefoneExibicao: "(49) 92003-7842",

  instagram: "",                 // ex.: "https://instagram.com/rafasdelivery"
  endereco: "",                  // CONFIRMAR: deixe vazio para não mostrar
  horarios: [                    // CONFIRMAR com a Rafa's
    { dias: "Terça a domingo", horas: "18h às 23h" },
    { dias: "Segunda", horas: "fechado" }
  ],
  // Usado para mostrar "Aberto agora". 0 = domingo ... 6 = sábado.
  // Deixe como null para não mostrar o status.
  funcionamento: { dias: [0, 2, 3, 4, 5, 6], abre: 18, fecha: 23 },
  tempoEntrega: "40 a 60 min",
  pagamentos: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],

  // Bairros atendidos e taxa de entrega.
  // Lista vazia = a pessoa digita o bairro e a taxa é combinada no WhatsApp.
  bairros: [],

  // Tamanhos (iguais para todas as pizzas).
  tamanhos: [
    { id: "P", nome: "Pequena", fatias: "25 cm · 8 fatias" },
    { id: "G", nome: "Grande", fatias: "35 cm · 12 fatias" }
  ],

  // Bordas recheadas: acréscimo de R$ 10.
  bordas: [
    { nome: "Sem borda recheada", preco: 0 },
    { nome: "Cheddar", preco: 10, tipo: "salgada" },
    { nome: "Catupiry", preco: 10, tipo: "salgada" },
    { nome: "Chocolate preto", preco: 10, tipo: "doce" },
    { nome: "Chocolate branco", preco: 10, tipo: "doce" }
  ],

  // A cada sabor adicionado: + R$ 5 (salgada ou doce).
  adicionalSabor: 5,

  // Preços por categoria (P / G).
  // Tradicional e Doce: 35 / 65 · Especial e Doce especial: 40 / 70.
  cardapio: [
    { categoria: "Tradicionais", tipo: "salgada", itens: [
      { nome: "Calabresa", desc: "Molho, mussarela, calabresa, cebola, azeitona e orégano.", precos: { P: 35, G: 65 }, foto: "calabresa", destaque: true },
      { nome: "Frango com Catupiry", desc: "Molho, mussarela, frango desfiado, azeitona, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "frango", destaque: true },
      { nome: "Portuguesa", desc: "Molho, mussarela, milho, pimentão, cebola, ovos, azeitona, orégano e tomate.", precos: { P: 35, G: 65 }, foto: "portuguesa", destaque: true },
      { nome: "Bacon", desc: "Molho, mussarela, bacon em cubos e tiras, azeitona e orégano.", precos: { P: 35, G: 65 }, foto: "bacon" },
      { nome: "Bacon com Milho", desc: "Molho, mussarela, bacon em cubos e tiras, milho, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "bacon" },
      { nome: "Brasileira", desc: "Molho, mussarela, frango desfiado, milho, ervilha, bacon, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "frango" },
      { nome: "Brócolis", desc: "Molho, mussarela, brócolis, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "brocolis" },
      { nome: "Doritus", desc: "Molho, mussarela, provolone, cheddar, doritus, lemon pepper e orégano.", precos: { P: 35, G: 65 }, foto: "queijos" },
      { nome: "Filé ao Molho Mostarda", desc: "Molho, mussarela, filé ao molho mostarda, batata palha e orégano.", precos: { P: 35, G: 65 }, foto: "file" },
      { nome: "Lombo Canadense", desc: "Molho, mussarela, lombo canadense, catupiry, cebola, azeitona e orégano.", precos: { P: 35, G: 65 }, foto: "lombo" },
      { nome: "Margherita", desc: "Molho, mussarela, tomate, manjericão, mussarela de búfala e orégano.", precos: { P: 35, G: 65 }, foto: "margherita" },
      { nome: "Mandioca com Bacon", desc: "Molho, mussarela, mandioca, bacon, cebola, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "bacon" },
      { nome: "Strogonoff de Frango", desc: "Molho, mussarela, strogonoff de frango, catupiry, batata palha e orégano.", precos: { P: 35, G: 65 }, foto: "frango" },
      { nome: "Vegetariana", desc: "Molho, mussarela, tomate, palmito, milho, ervilha, champignon, brócolis, catupiry e orégano.", precos: { P: 35, G: 65 }, foto: "brocolis" }
    ]},
    { categoria: "Especiais", tipo: "salgada", itens: [
      { nome: "Americana", desc: "Molho, mussarela, presunto, champignon, catupiry, bacon, azeitona e orégano.", precos: { P: 40, G: 70 }, foto: "especial" },
      { nome: "Brócolis com Bacon", desc: "Molho, mussarela, brócolis, bacon, mussarela de búfala, catupiry e orégano.", precos: { P: 40, G: 70 }, foto: "brocolis" },
      { nome: "5 Queijos", desc: "Molho, mussarela, provolone, cheddar, catupiry, mussarela de búfala, parmesão e orégano.", precos: { P: 40, G: 70 }, foto: "queijos" },
      { nome: "5 Queijos com Bacon", desc: "Molho, mussarela, provolone, cheddar, catupiry, mussarela de búfala, parmesão, bacon e orégano.", precos: { P: 40, G: 70 }, foto: "queijos" },
      { nome: "Toscana", desc: "Molho, mussarela, calabresa, ovos, catupiry, manjericão, tomate cereja, azeitona e orégano.", precos: { P: 40, G: 70 }, foto: "calabresa" },
      { nome: "Presunto Parma", desc: "Molho, mussarela, presunto Parma, figo, tomate cereja, mussarela de búfala, azeitona e orégano.", precos: { P: 40, G: 70 }, foto: "especial" }
    ]},
    { categoria: "Doces", tipo: "doce", itens: [
      { nome: "Abacaxi", desc: "Chocolate branco, abacaxi e canela.", precos: { P: 35, G: 65 }, foto: "doce" },
      { nome: "Banana", desc: "Chocolate branco, banana e canela.", precos: { P: 35, G: 65 }, foto: "doce" },
      { nome: "Charge", desc: "Caramelo, chocolate preto e amendoim.", precos: { P: 35, G: 65 }, foto: "doce" },
      { nome: "Morango", desc: "Chocolate branco ou preto e morango.", precos: { P: 35, G: 65 }, foto: "doce-morango" },
      { nome: "Prestígio", desc: "Chocolate preto, coco ralado e Prestígio.", precos: { P: 35, G: 65 }, foto: "doce" },
      { nome: "Califórnia", desc: "Chocolate branco, mussarela, banana, abacaxi, cereja, figo, morango e pêssego.", precos: { P: 35, G: 65 }, foto: "doce" }
    ]},
    { categoria: "Doces especiais", tipo: "doce", itens: [
      { nome: "Kinder Bueno", desc: "Chocolate preto, leite Ninho e Kinder Bueno.", precos: { P: 40, G: 70 }, foto: "doce" },
      { nome: "Oreo", desc: "Chocolate preto e branco e biscoito Oreo.", precos: { P: 40, G: 70 }, foto: "doce" },
      { nome: "KitKat", desc: "Pasta de KitKat, KitKat e morango.", precos: { P: 40, G: 70 }, foto: "doce-morango" },
      { nome: "Nutella", desc: "Pasta de Nutella e morango.", precos: { P: 40, G: 70 }, foto: "doce-morango" }
    ]}
  ]
};
