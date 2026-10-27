/*
 * Lanchonete X do Neves — configurações e cardápio
 * ---------------------------------------------------------------
 * Tudo o que depende do cliente fica aqui. Campos vazios ("") não aparecem.
 *
 * Cardápio: cada item tem
 *   id      identificador único (sem espaço)
 *   nome    nome que aparece no site e na mensagem do WhatsApp
 *   desc    ingredientes / descrição curta
 *   preco   número (use ponto: 27.9)
 *   foto    caminho da foto (ex.: "assets/img/cardapio/x-bacon.webp").
 *           Vazio = aparece a ilustração da categoria.
 *   tag     selo opcional ("Mais pedido", "Novo", "Picante"...)
 *   destaque true = aparece em "Mais pedidos"
 */
window.XN_CONFIG = {
  loja: {
    nome: "X do Neves",
    nomeCompleto: "Lanchonete X do Neves",
    // WhatsApp do delivery: 55 + DDD + número, só números. Vazio = a pessoa escolhe o contato.
    whatsapp: "",
    instagram: "https://instagram.com/xdoneves",
    instagramUser: "@xdoneves",
    seguidores: "2.740",
    endereco: "Rua São Pedro, Centro",
    referencia: "Em frente ao campo municipal",
    cidade: "Faxinal dos Guedes · SC",
    // EXEMPLO: trocar pelo horário real.
    horarios: ["Terça a domingo · 18h às 23h30", "Segunda · fechado"],
    // EXEMPLO: taxa de entrega e tempo médio.
    taxaEntrega: 5,
    tempoEntrega: "30–45 min"
  },

  // true enquanto preços/fotos forem provisórios: mostra um aviso discreto no rodapé.
  previa: true,

  // Oferta do banner (ex.: a "Imperdível de terça" do Instagram).
  oferta: {
    selo: "Imperdível de terça",
    titulo: "Double Xis Bacon",
    texto: "Dois hambúrgueres, muito bacon e cheddar derretido.",
    item: "double-xis-bacon"
  },

  pagamentos: ["Pix", "Cartão na entrega", "Dinheiro"],

  categorias: [
    { id: "xis", nome: "Xis", desenho: "xis" },
    { id: "burgers", nome: "Burgers", desenho: "burger" },
    { id: "pasteis", nome: "Pastéis", desenho: "pastel" },
    { id: "porcoes", nome: "Porções", desenho: "porcao" },
    { id: "bebidas", nome: "Bebidas", desenho: "bebida" }
  ],

  // Adicionais oferecidos na tela do item, por categoria.
  adicionais: {
    xis: [
      { nome: "Bacon extra", preco: 5 },
      { nome: "Ovo", preco: 2.5 },
      { nome: "Cheddar cremoso", preco: 4 },
      { nome: "Hambúrguer extra", preco: 7 }
    ],
    burgers: [
      { nome: "Bacon extra", preco: 5 },
      { nome: "Cheddar extra", preco: 4 },
      { nome: "Smash extra", preco: 8 }
    ],
    pasteis: [
      { nome: "Catupiry", preco: 3 },
      { nome: "Cheddar", preco: 3 }
    ],
    porcoes: [
      { nome: "Cheddar e bacon", preco: 8 },
      { nome: "Molho da casa", preco: 3 }
    ],
    bebidas: []
  },

  // EXEMPLO: o cardápio real substitui esta lista.
  cardapio: [
    // ---------- XIS (14 sabores) ----------
    { id: "x-salada", cat: "xis", nome: "X-Salada", desc: "Hambúrguer, queijo, presunto, alface, tomate, milho, ervilha e maionese da casa.", preco: 24, destaque: true },
    { id: "x-egg", cat: "xis", nome: "X-Egg", desc: "Hambúrguer, ovo, queijo, presunto, alface, tomate, milho e ervilha.", preco: 26 },
    { id: "x-bacon", cat: "xis", nome: "X-Bacon", desc: "Hambúrguer, bacon crocante, queijo, presunto, alface, tomate, milho e ervilha.", preco: 29, tag: "Mais pedido", destaque: true },
    { id: "x-calabresa", cat: "xis", nome: "X-Calabresa", desc: "Calabresa acebolada, queijo, presunto, alface, tomate, milho e ervilha.", preco: 29 },
    { id: "x-frango", cat: "xis", nome: "X-Frango", desc: "Frango desfiado temperado, queijo, presunto, alface, tomate, milho e ervilha.", preco: 29 },
    { id: "x-frango-catupiry", cat: "xis", nome: "X-Frango Catupiry", desc: "Frango desfiado com Catupiry, queijo, presunto, alface e tomate.", preco: 32 },
    { id: "x-coracao", cat: "xis", nome: "X-Coração", desc: "Coração de frango na chapa, queijo, presunto, alface, tomate, milho e ervilha.", preco: 34, destaque: true },
    { id: "x-file", cat: "xis", nome: "X-Filé", desc: "Filé mignon em tiras, queijo, presunto, alface, tomate, milho e ervilha.", preco: 39 },
    { id: "x-lombo", cat: "xis", nome: "X-Lombo", desc: "Lombo suíno na chapa, queijo, presunto, alface, tomate, milho e ervilha.", preco: 32 },
    { id: "x-strogonoff", cat: "xis", nome: "X-Strogonoff", desc: "Strogonoff de frango, batata palha, queijo, alface e tomate.", preco: 33 },
    { id: "x-cheddar-bacon", cat: "xis", nome: "X-Cheddar Bacon", desc: "Hambúrguer, cheddar cremoso, bacon, queijo, alface e tomate.", preco: 32 },
    { id: "x-picanha", cat: "xis", nome: "X-Picanha", desc: "Picanha fatiada na chapa, queijo, presunto, alface, tomate e cebola.", preco: 42 },
    { id: "x-tudo", cat: "xis", nome: "X-Tudo", desc: "Hambúrguer, frango, calabresa, bacon, ovo, coração, queijo, presunto e salada.", preco: 44, tag: "Gigante", destaque: true },
    { id: "double-xis-bacon", cat: "xis", nome: "Double Xis Bacon", desc: "Dois hambúrgueres, bacon em dobro, cheddar, queijo, alface e tomate.", preco: 38, tag: "Terça imperdível" },

    // ---------- BURGERS ARTESANAIS ----------
    { id: "burger-classico", cat: "burgers", nome: "Clássico Neves", desc: "Pão brioche, blend 150 g, queijo prato, alface, tomate e molho da casa.", preco: 28 },
    { id: "burger-cheddar-bacon", cat: "burgers", nome: "Cheddar Bacon", desc: "Pão brioche, blend 150 g, cheddar cremoso, bacon e cebola caramelizada.", preco: 34, tag: "Mais pedido", destaque: true },
    { id: "burger-smash", cat: "burgers", nome: "Smash Duplo", desc: "Dois smash 90 g, queijo americano duplo, picles e molho especial.", preco: 32 },
    { id: "burger-supremo", cat: "burgers", nome: "Neves Supremo", desc: "Blend 180 g, queijo coalho, bacon, onion rings e barbecue.", preco: 39, tag: "Novo" },

    // ---------- PASTÉIS ----------
    { id: "pastel-carne", cat: "pasteis", nome: "Pastel de Carne", desc: "Carne moída temperada, azeitona e cheiro-verde.", preco: 14, destaque: true },
    { id: "pastel-frango", cat: "pasteis", nome: "Frango com Catupiry", desc: "Frango desfiado com Catupiry original.", preco: 15 },
    { id: "pastel-queijo", cat: "pasteis", nome: "Pastel de Queijo", desc: "Muçarela que puxa a cada mordida.", preco: 13 },
    { id: "pastel-pizza", cat: "pasteis", nome: "Pastel Pizza", desc: "Queijo, presunto, tomate e orégano.", preco: 15 },
    { id: "pastel-calabresa", cat: "pasteis", nome: "Calabresa com Queijo", desc: "Calabresa, muçarela e cebola.", preco: 15 },
    { id: "pastel-chocolate", cat: "pasteis", nome: "Pastel de Chocolate", desc: "Chocolate ao leite derretido. Sobremesa garantida.", preco: 14 },

    // ---------- PORÇÕES ----------
    { id: "batata", cat: "porcoes", nome: "Batata Frita", desc: "Porção 400 g, sequinha e crocante.", preco: 25, destaque: true },
    { id: "batata-cheddar", cat: "porcoes", nome: "Batata Cheddar e Bacon", desc: "Batata frita coberta com cheddar cremoso e bacon.", preco: 34, tag: "Pra dividir" },
    { id: "polenta", cat: "porcoes", nome: "Polenta Frita", desc: "Porção 400 g, crocante por fora e macia por dentro.", preco: 24 },
    { id: "frango-passarinho", cat: "porcoes", nome: "Frango a Passarinho", desc: "Porção 500 g com alho frito e limão.", preco: 39 },

    // ---------- BEBIDAS ----------
    { id: "refri-lata", cat: "bebidas", nome: "Refrigerante Lata", desc: "350 ml · Coca-Cola, Guaraná ou Fanta.", preco: 6 },
    { id: "refri-2l", cat: "bebidas", nome: "Refrigerante 2 L", desc: "Coca-Cola, Guaraná ou Fanta.", preco: 14, destaque: true },
    { id: "suco", cat: "bebidas", nome: "Suco Natural", desc: "500 ml · laranja, limão ou maracujá.", preco: 9 },
    { id: "agua", cat: "bebidas", nome: "Água Mineral", desc: "500 ml · com ou sem gás.", preco: 4 }
  ],

  faq: [
    { p: "Vocês entregam em toda a cidade?", r: "Entregamos em Faxinal dos Guedes. Ao finalizar, informe seu endereço que confirmamos a entrega e a taxa pelo WhatsApp." },
    { p: "Como faço o pedido?", r: "Escolha os itens aqui na página, personalize com adicionais e toque em “Enviar pedido”. O pedido chega pronto no nosso WhatsApp, sem precisar digitar nada." },
    { p: "Posso retirar no local ou comer aí?", r: "Pode sim. Estamos na Rua São Pedro, Centro, em frente ao campo municipal. Na hora de finalizar, escolha “Retirar no local”." },
    { p: "Quais formas de pagamento vocês aceitam?", r: "Pix, cartão na entrega e dinheiro. Se for pagar em dinheiro, avise se precisa de troco." },
    { p: "Dá pra tirar ou trocar ingrediente?", r: "Claro. Use o campo “Observação” de cada lanche (ex.: sem ervilha, sem cebola) que a cozinha prepara do seu jeito." }
  ]
};
