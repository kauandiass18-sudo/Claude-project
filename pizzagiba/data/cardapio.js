/*
 * Pizza Giba — dados do site
 * ------------------------------------------------------------------
 * Este arquivo é o "banco de dados" do site. Tudo o que aparece no
 * cardápio, nos preços, nos horários e no contato vem daqui.
 *
 * Para editar sem mexer em código, abra admin.html, faça as alterações
 * e clique em "Baixar cardapio.js". Depois substitua este arquivo pelo
 * que foi baixado e publique.
 *
 * Preços de pizza: { G: grande, M: média }. Demais itens: preco.
 * foto: caminho de uma imagem (ex.: "assets/img/frango.webp"). Vazio = sem foto.
 * ativo: false esconde o item do site sem apagar.
 */
window.GIBA = {
  nome: "Pizza Giba",
  slogan: "Forno a lenha · Gostosa a qualquer hora",

  // WhatsApp que recebe os pedidos: 55 + DDD + número, só números.
  whatsapp: "5512991046255",
  telefone: "(12) 99104-6255",
  instagram: "https://instagram.com/pizzagiba",
  instagramUser: "@pizzagiba",

  // Preencha com o endereço real. Enquanto estiver vazio, o site pede
  // para confirmar pelo WhatsApp e não mostra o mapa.
  endereco: "",
  cidade: "",
  // Link "Como chegar" (Google Maps) e endereço do iframe de incorporação.
  mapsUrl: "",
  mapsEmbed: "",

  // Horários exibidos no site. Ex.: { dias: "Terça a domingo", horas: "18h às 23h" }
  horarios: [],
  // Usado para mostrar "Aberto agora". 0 = domingo ... 6 = sábado. Horas em 24h.
  // Ex.: { dias: [0, 2, 3, 4, 5, 6], abre: 18, fecha: 23.5 }. null = não mostra.
  funcionamento: null,

  entrega: {
    ativo: true,
    retirada: true,
    // Taxa fixa em reais. null = "a confirmar pelo WhatsApp".
    taxa: null,
    tempo: ""
  },

  pagamentos: [
    { id: "pix", nome: "Pix" },
    { id: "credito", nome: "Cartão de crédito" },
    { id: "debito", nome: "Cartão de débito" },
    { id: "dinheiro", nome: "Dinheiro" }
  ],

  tamanhos: [
    { id: "G", nome: "Grande" },
    { id: "M", nome: "Média" }
  ],

  // Opcionais que podem ser somados a qualquer pizza.
  adicionais: [
    { id: "alho", nome: "Adicional de alho", preco: 10 }
  ],

  categorias: [
    { id: "salgadas", nome: "Pizzas salgadas", tipo: "pizza" },
    { id: "doces", nome: "Pizzas doces", tipo: "pizza" },
    { id: "pratos", nome: "Pratos e sobremesas" },
    { id: "bebidas", nome: "Bebidas" },
    { id: "promocoes", nome: "Combos e promoções" }
  ],

  // Itens em destaque na página inicial (ids de produtos).
  destaques: ["a-moda-giba", "frango", "vicosa", "chocogiba"],

  produtos: [
    // ---------------- Pizzas salgadas ----------------
    { id: "mussarela", cat: "salgadas", nome: "Mussarela", desc: "Molho de tomate e mussarela.", precos: { G: 64.9, M: 62.9 } },
    { id: "a-moda-da-casa", cat: "salgadas", nome: "À Moda da Casa", desc: "Molho de tomate, mussarela e lagarto fatiado ao vinagrete.", precos: { G: 68.5, M: 66.5 } },
    { id: "a-moda-giba", cat: "salgadas", nome: "À Moda Giba", desc: "Molho de tomate, mussarela, frango desfiado, champignon e catupiry.", precos: { G: 71.5, M: 69.5 } },
    { id: "abobrinha", cat: "salgadas", nome: "Abobrinha", desc: "Molho de tomate, abobrinha, mussarela e parmesão.", precos: { G: 66.9, M: 64.9 } },
    { id: "atum", cat: "salgadas", nome: "Atum", desc: "Molho de tomate, atum e cebola.", precos: { G: 65.5, M: 63.5 } },
    { id: "atum-coberta", cat: "salgadas", nome: "Atum Coberta", desc: "Molho de tomate, atum e cebola cobertos com mussarela.", precos: { G: 68.5, M: 66.5 } },
    { id: "bacon", cat: "salgadas", nome: "Bacon", desc: "Molho de tomate e bacon coberto com mussarela.", precos: { G: 69.5, M: 67.5 } },
    { id: "baiana", cat: "salgadas", nome: "Baiana", desc: "Molho de tomate, mussarela, calabresa, tomate em rodelas, ovos e cebola.", precos: { G: 67.5, M: 65.5 } },
    { id: "berinjela", cat: "salgadas", nome: "Berinjela", desc: "Molho de tomate, berinjela, mussarela e parmesão.", precos: { G: 66.9, M: 64.9 } },
    { id: "brasileirissima", cat: "salgadas", nome: "Brasileiríssima", desc: "Molho de tomate, mussarela, carne seca desfiada, tomate em rodelas e cebola.", precos: { G: 70.5, M: 68.5 } },
    { id: "brocolis", cat: "salgadas", nome: "Brócolis", desc: "Molho de tomate, mussarela, brócolis, catupiry e bacon.", precos: { G: 70.9, M: 68.9 } },
    { id: "calabresa", cat: "salgadas", nome: "Calabresa", desc: "Molho de tomate, linguiça calabresa e cebola.", precos: { G: 68.5, M: 66.5 } },
    { id: "calabresa-coberta", cat: "salgadas", nome: "Calabresa Coberta", desc: "Molho de tomate e linguiça calabresa coberta com cebola e mussarela.", precos: { G: 70.5, M: 68.5 } },
    { id: "california", cat: "salgadas", nome: "Califórnia", desc: "Molho de tomate, mussarela, presunto fatiado e frutas em calda.", precos: { G: 68.9, M: 66.9 } },
    { id: "canadense", cat: "salgadas", nome: "Canadense", desc: "Molho de tomate, lombo canadense e mussarela.", precos: { G: 67.5, M: 65.5 } },
    { id: "carbonara", cat: "salgadas", nome: "Carbonara", desc: "Molho de tomate, mussarela, lombo, provolone, ovos e tomate em rodelas.", precos: { G: 70.5, M: 68.5 } },
    { id: "casa-nostra", cat: "salgadas", nome: "Casa Nostra", desc: "Molho de tomate, mussarela, calabresa e palmito.", precos: { G: 70.9, M: 68.9 } },
    { id: "catupiry", cat: "salgadas", nome: "Catupiry", desc: "Molho de tomate, mussarela e catupiry.", precos: { G: 67.9, M: 65.9 } },
    { id: "champignon", cat: "salgadas", nome: "Champignon", desc: "Molho de tomate, champignon temperado, cebola e mussarela.", precos: { G: 69.5, M: 67.5 } },
    { id: "do-garcom", cat: "salgadas", nome: "Do Garçom", desc: "Molho de tomate, calabresa, palmito, provolone e mussarela.", precos: { G: 71.5, M: 69.5 } },
    { id: "escarola", cat: "salgadas", nome: "Escarola", desc: "Molho de tomate, escarola temperada, azeitonas, aliche, parmesão e mussarela.", precos: { G: 66.9, M: 64.9 } },
    { id: "fiorentina", cat: "salgadas", nome: "Fiorentina", desc: "Molho de tomate, lombo, catupiry e mussarela.", precos: { G: 69.7, M: 67.7 } },
    { id: "firenze", cat: "salgadas", nome: "Firenze", desc: "Molho de tomate, mussarela, tomate seco e rúcula.", precos: { G: 70.9, M: 68.9 } },
    { id: "framilho", cat: "salgadas", nome: "Framilho", desc: "Molho de tomate, frango temperado, catupiry, milho e mussarela.", precos: { G: 70.5, M: 68.5 } },
    { id: "frango", cat: "salgadas", nome: "Frango com Catupiry", desc: "Molho de tomate, frango temperado, catupiry e mussarela.", precos: { G: 69.5, M: 67.5 }, foto: "assets/img/forno-frango.webp" },
    { id: "franguets", cat: "salgadas", nome: "Franguet's", desc: "Molho de tomate, frango temperado, azeitonas e mussarela.", precos: { G: 66.9, M: 64.9 } },
    { id: "genova", cat: "salgadas", nome: "Gênova", desc: "Molho de tomate, mussarela, bacon, ovos, azeitonas e tomate em rodelas.", precos: { G: 69.5, M: 67.5 } },
    { id: "gorgonzola", cat: "salgadas", nome: "Gorgonzola", desc: "Molho de tomate, mussarela e gorgonzola.", precos: { G: 69.9, M: 67.9 } },
    { id: "italia", cat: "salgadas", nome: "Itália", desc: "Molho de tomate, calabresa, bacon, tomate em rodelas, azeitonas e cebola.", precos: { G: 69.9, M: 67.9 } },
    { id: "italia-coberta", cat: "salgadas", nome: "Itália Coberta", desc: "Molho de tomate, calabresa, bacon, tomate em rodelas, azeitonas, cebola e mussarela.", precos: { G: 71.5, M: 69.5 } },
    { id: "lombo", cat: "salgadas", nome: "Lombo", desc: "Molho de tomate, mussarela, lombo, azeitonas e champignon.", precos: { G: 70.5, M: 68.5 } },
    { id: "margarita", cat: "salgadas", nome: "Margarita", desc: "Molho de tomate, mussarela, parmesão e manjericão.", precos: { G: 66.9, M: 64.9 } },
    { id: "milho-verde", cat: "salgadas", nome: "Milho Verde", desc: "Molho de tomate, mussarela, catupiry e milho verde.", precos: { G: 67, M: 65 } },
    { id: "napolitana", cat: "salgadas", nome: "Napolitana", desc: "Molho de tomate, mussarela, tomate em rodelas e parmesão.", precos: { G: 66.9, M: 64.9 } },
    { id: "palmito", cat: "salgadas", nome: "Palmito", desc: "Molho de tomate, palmito, mussarela e tomate em rodelas.", precos: { G: 70.5, M: 68.5 } },
    { id: "paulistana", cat: "salgadas", nome: "Paulistana", desc: "Molho de tomate, calabresa, presunto e mussarela.", precos: { G: 68, M: 66 } },
    { id: "paulistinha", cat: "salgadas", nome: "Paulistinha", desc: "Molho de tomate, calabresa, presunto, catupiry e mussarela.", precos: { G: 71.5, M: 69.5 } },
    { id: "peito-de-peru", cat: "salgadas", nome: "Peito de Peru", desc: "Molho de tomate, peito de peru e mussarela.", precos: { G: 68, M: 66 } },
    { id: "pepperoni", cat: "salgadas", nome: "Pepperoni", desc: "Molho de tomate, mussarela e pepperoni.", precos: { G: 68, M: 66 } },
    { id: "portuguesa", cat: "salgadas", nome: "Portuguesa", desc: "Molho de tomate, mussarela, presunto, ovos cozidos, cebola e azeitonas.", precos: { G: 68.5, M: 66.5 } },
    { id: "portuguesa-especial", cat: "salgadas", nome: "Portuguesa Especial", desc: "Molho de tomate, mussarela, presunto, palmito, ovos cozidos, ervilha, calabresa, cebola e azeitonas.", precos: { G: 72.5, M: 70.5 } },
    { id: "presunto-coberto", cat: "salgadas", nome: "Presunto Coberto", desc: "Molho de tomate e presunto coberto com mussarela.", precos: { G: 66.9, M: 64.9 } },
    { id: "primavera", cat: "salgadas", nome: "Primavera", desc: "Molho de tomate, mussarela, palmito e catupiry.", precos: { G: 71.5, M: 69.5 } },
    { id: "provolone", cat: "salgadas", nome: "Provolone", desc: "Molho de tomate, mussarela e provolone.", precos: { G: 66.9, M: 64.9 } },
    { id: "quatro-frios", cat: "salgadas", nome: "Quatro Frios", desc: "Molho de tomate, calabresa, lombo, peito de peru, presunto e mussarela.", precos: { G: 71.5, M: 69.5 } },
    { id: "quatro-queijos", cat: "salgadas", nome: "Quatro Queijos", desc: "Molho de tomate, mussarela, gorgonzola, provolone e parmesão.", precos: { G: 69.9, M: 67.9 } },
    { id: "tres-queijos", cat: "salgadas", nome: "Três Queijos", desc: "Molho de tomate, mussarela, catupiry e provolone.", precos: { G: 67.5, M: 65.5 } },
    { id: "cinco-queijos", cat: "salgadas", nome: "Cinco Queijos", desc: "Molho de tomate, mussarela, gorgonzola, provolone, catupiry e parmesão.", precos: { G: 71.5, M: 69.5 } },
    { id: "ricota", cat: "salgadas", nome: "Ricota", desc: "Molho de tomate, ricota fresca, parmesão e mussarela.", precos: { G: 65.5, M: 63.5 } },
    { id: "romana", cat: "salgadas", nome: "Romana", desc: "Molho de tomate, mussarela, aliche, tomate em rodelas e azeitonas.", precos: { G: 67.5, M: 65.5 } },
    { id: "siciliana", cat: "salgadas", nome: "Siciliana", desc: "Molho de tomate, mussarela, bacon, azeitonas e champignon.", precos: { G: 71.5, M: 69.5 } },
    { id: "strogonoff-de-frango", cat: "salgadas", nome: "Strogonoff de Frango", desc: "Molho de tomate, strogonoff de frango, mussarela e batata palha.", precos: { G: 71.5, M: 69.5 } },
    { id: "vegetariana", cat: "salgadas", nome: "Vegetariana", desc: "Molho de tomate, brócolis, tomate seco, palmito, ricota e champignon.", precos: { G: 71.5, M: 69.5 } },
    { id: "veneza", cat: "salgadas", nome: "Veneza", desc: "Molho de tomate, peito de peru, catupiry, tomate em rodelas e mussarela.", precos: { G: 70.5, M: 68.5 } },
    { id: "verao", cat: "salgadas", nome: "Verão", desc: "Molho de tomate, mussarela, ervilha, palmito e tomate em rodelas.", precos: { G: 68.9, M: 66.9 } },
    { id: "vicosa", cat: "salgadas", nome: "Viçosa", desc: "Molho de tomate, frango, catupiry, mussarela, presunto, calabresa, bacon, ovos e tomate em rodelas.", precos: { G: 75.9, M: 73.9 } },

    // ---------------- Pizzas doces ----------------
    { id: "chocogiba", cat: "doces", nome: "Chocogiba", desc: "Chocolate ao leite, morango ou pêssego e chocolate granulado.", precos: { G: 66.9, M: 64.9 }, opcoes: ["Morango", "Pêssego"] },
    { id: "banana", cat: "doces", nome: "Banana", desc: "Molho de tomate, mussarela, banana, canela e açúcar.", precos: { G: 66.9, M: 62.9 } },
    { id: "banana-ii", cat: "doces", nome: "Banana II", desc: "Banana, canela e açúcar.", precos: { G: 64.9, M: 62.9 } },
    { id: "romeu-e-julieta", cat: "doces", nome: "Romeu e Julieta", desc: "Molho de tomate, mussarela e goiabada.", precos: { G: 66.9, M: 64.9 } },

    // ---------------- Pratos e sobremesas ----------------
    { id: "fondue-de-carne", cat: "pratos", grupo: "Pratos variados", nome: "Fondue de Carne", desc: "250 g de filé mignon, 250 g de frango e 250 g de linguiça calabresa. Acompanha 6 tipos de molhos.", preco: 99.9, novidade: true },
    { id: "file-mignon-parmegiana", cat: "pratos", grupo: "Pratos variados", nome: "Filé Mignon à Parmegiana", desc: "Acompanha arroz e fritas.", preco: 59.9, novidade: true },
    { id: "file-de-frango-parmegiana", cat: "pratos", grupo: "Pratos variados", nome: "Filé de Frango à Parmegiana", desc: "Acompanha arroz e fritas.", preco: 49.9, novidade: true },
    { id: "batata-frita", cat: "pratos", grupo: "Pratos variados", nome: "Batata Frita", desc: "Porção.", preco: 27.9 },
    { id: "petit-gateau", cat: "pratos", grupo: "Sobremesas", nome: "Petit Gâteau", desc: "", preco: 18.9, novidade: true },
    { id: "pudim", cat: "pratos", grupo: "Sobremesas", nome: "Pudim de Leite Condensado", desc: "", preco: 10, novidade: true },

    // ---------------- Bebidas ----------------
    { id: "agua", cat: "bebidas", grupo: "Bebidas", nome: "Água", desc: "", preco: 5.5 },
    { id: "refrigerante-lata", cat: "bebidas", grupo: "Bebidas", nome: "Refrigerante em lata", desc: "", preco: 9 },
    { id: "h2o", cat: "bebidas", grupo: "Bebidas", nome: "H2O", desc: "", preco: 9 },
    { id: "schweppes", cat: "bebidas", grupo: "Bebidas", nome: "Schweppes", desc: "", preco: 9 },
    { id: "cerveja-original", cat: "bebidas", grupo: "Bebidas", nome: "Cerveja Original 600 ml", desc: "", preco: 15 },
    { id: "cerveja-heineken", cat: "bebidas", grupo: "Bebidas", nome: "Cerveja Heineken 600 ml", desc: "", preco: 17 },
    { id: "cerveja-long-neck", cat: "bebidas", grupo: "Bebidas", nome: "Cerveja Long Neck", desc: "", preco: 9 },
    { id: "caipirinha-vodka", cat: "bebidas", grupo: "Bebidas", nome: "Caipirinha de Vodka", desc: "", preco: 15 },
    { id: "caipirinha-pinga", cat: "bebidas", grupo: "Bebidas", nome: "Caipirinha de Pinga", desc: "", preco: 12.5 },
    { id: "vodka", cat: "bebidas", grupo: "Bebidas", nome: "Vodka", desc: "Dose.", preco: 8 },
    { id: "cuba-libre", cat: "bebidas", grupo: "Bebidas", nome: "Cuba Libre", desc: "", preco: 12.5 },
    { id: "cachaca", cat: "bebidas", grupo: "Bebidas", nome: "Cachaça", desc: "Dose.", preco: 7 },

    { id: "faroni-lopez", cat: "bebidas", grupo: "Vinhos", nome: "Faroni Lopez", desc: "Garrafa.", preco: 27 },
    { id: "granja-tonato", cat: "bebidas", grupo: "Vinhos", nome: "Granja Tonato", desc: "Garrafa.", preco: 27 },
    { id: "marcus-james", cat: "bebidas", grupo: "Vinhos", nome: "Marcus James", desc: "Garrafa.", preco: 34 },
    { id: "grapecool", cat: "bebidas", grupo: "Vinhos", nome: "Grapecool", desc: "Chopp de vinho.", preco: 9.5 },
    { id: "vinho-da-casa", cat: "bebidas", grupo: "Vinhos", nome: "Vinho da Casa", desc: "Taça.", preco: 12 },
    { id: "rolha", cat: "bebidas", grupo: "Vinhos", nome: "Rolha", desc: "Taxa para vinho trazido de fora.", preco: 24 },

    { id: "suco-acerola", cat: "bebidas", grupo: "Sucos", nome: "Suco de Acerola", desc: "", preco: 10 },
    { id: "suco-laranja", cat: "bebidas", grupo: "Sucos", nome: "Suco de Laranja", desc: "", preco: 10 },
    { id: "suco-limao", cat: "bebidas", grupo: "Sucos", nome: "Suco de Limão", desc: "", preco: 10 },
    { id: "suco-maracuja", cat: "bebidas", grupo: "Sucos", nome: "Suco de Maracujá", desc: "", preco: 10 },
    { id: "suco-morango", cat: "bebidas", grupo: "Sucos", nome: "Suco de Morango", desc: "", preco: 10 },
    { id: "suco-abacaxi", cat: "bebidas", grupo: "Sucos", nome: "Suco de Abacaxi", desc: "", preco: 10 },
    { id: "suco-uva", cat: "bebidas", grupo: "Sucos", nome: "Suco de Uva", desc: "Concentrado.", preco: 10 },
    { id: "suco-laranja-mix", cat: "bebidas", grupo: "Sucos", nome: "Laranja com outras frutas", desc: "", preco: 12 },
    { id: "limonada-suica", cat: "bebidas", grupo: "Sucos", nome: "Limonada Suíça", desc: "", preco: 12 }
  ],

  // Combos e promoções. Ex.:
  // { id: "combo-1", cat: "promocoes", nome: "Pizza grande + refrigerante", desc: "...", preco: 79.9, precoAntigo: 89.9 }
  // Deixe a lista vazia para a seção não aparecer.
  promocoes: [],

  // Avaliações reais de clientes. Ex.: { nome: "Ana", nota: 5, texto: "..." , data: "2025-05" }
  avaliacoes: []
};
