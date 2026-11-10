/*
 * FINO SABOR — Churrascaria e Pizzaria
 * Configurações do site
 * ---------------------------------------------------------------
 * Tudo o que muda no dia a dia fica aqui: contato, horários, rodízio,
 * cardápio e preços. Não precisa mexer no restante do site.
 *
 * PREÇOS: todos começam em null (sem valor). Para mostrar um preço,
 * troque null pelo número, por exemplo  preco: 69.9
 * Enquanto um item não tiver preço, o site mostra "Consultar" e o
 * total do pedido aparece como "a confirmar".
 */
window.FINO_SABOR = {
  nome: "Fino Sabor",
  slogan: "Churrascaria e Pizzaria",
  cidade: "Xanxerê · SC",

  // WhatsApp que RECEBE os pedidos: 55 + DDD + número, só números.
  // Valor abaixo veio do perfil oficial do Instagram (wa.me/5549988810418).
  whatsapp: "5549988810418",

  instagram: "https://instagram.com/finosaborxanxere",
  instagramUsuario: "@finosaborxanxere",

  endereco: "Rua Nereu Ramos, 626 · Centro",
  enderecoCidade: "Xanxerê · SC",
  mapaUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Nereu+Ramos+626+Centro+Xanxer%C3%AA+SC",

  // Horários (texto livre, conforme o perfil do Instagram).
  horarios: [
    { titulo: "Almoço", dias: "Segunda a segunda", horas: "a partir das 11h30", nota: "Churrascaria" },
    { titulo: "Jantar", dias: "Terça a domingo", horas: "a partir das 19h30", nota: "Pizzaria" }
  ],

  // Rodízio de pizza (valores divulgados no Instagram da casa).
  // Deixe ativo: false para esconder o bloco.
  rodizio: {
    ativo: true,
    titulo: "Rodízio de Pizza",
    dias: "De terça a domingo, a partir das 19h30",
    precos: [
      { dias: "Terça, quarta, quinta e domingo", valor: 70 },
      { dias: "Sexta e sábado", valor: 90 }
    ],
    observacao: "Valores por pessoa. Bebidas à parte."
  },

  // Tipos de atendimento oferecidos no pedido.
  atendimento: ["Retirada no restaurante", "Entrega", "Reserva de mesa"],

  // Formas de pagamento mostradas no pedido (edite conforme a casa).
  pagamentos: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],

  /* ------------------------------------------------------------------
   * CARDÁPIO
   * Cada item: { nome, desc, preco }
   *   nome  — como está no cardápio impresso
   *   desc  — ingredientes, reproduzidos do cardápio original
   *           (null quando o cardápio não traz descrição)
   *   preco — null = sem preço cadastrado (mostra "Consultar")
   *   foto  — opcional: caminho de uma foto própria, ex. "assets/img/calabresa.jpg".
   *           Sem foto, o site escolhe uma imagem ilustrativa coerente.
   *   destaque — true para aparecer na vitrine "Mais pedidas" (opcional)
   * ------------------------------------------------------------------ */
  cardapio: [
    {
      id: "tradicionais",
      categoria: "Pizzas Tradicionais",
      curto: "Tradicionais",
      descricao: "Os sabores clássicos da casa, feitos com ingredientes selecionados.",
      itens: [
        { nome: "Abobrinha com Alho", desc: null, preco: null },
        { nome: "Abobrinha com Bacon", desc: null, preco: null },
        { nome: "Alho e Óleo", desc: null, preco: null },
        { nome: "Americana", desc: "Bacon, milho e ovo", preco: null },
        { nome: "Baiana", desc: "Pimenta calabresa, calabresa, ovo e cebola", preco: null },
        { nome: "Bacon", desc: null, preco: null },
        { nome: "Belíssima", desc: "Calabresa, ovo, bacon, parmesão e batata palha", preco: null },
        { nome: "Brócolis", desc: null, preco: null },
        { nome: "Brócolis e Bacon", desc: null, preco: null },
        { nome: "Caipira", desc: "Calabresa, frango, ovo e milho", preco: null },
        { nome: "Calabresa", desc: null, preco: null, destaque: true },
        { nome: "Catubresa", desc: "Calabresa e requeijão", preco: null },
        { nome: "Catuperu", desc: "Peito de peru e requeijão", preco: null },
        { nome: "Chester", desc: "Peito de peru, bacon e requeijão", preco: null },
        { nome: "Cinco Queijos", desc: "Muçarela, parmesão, provolone, gorgonzola e requeijão", preco: null },
        { nome: "Cinco Queijos e Bacon", desc: null, preco: null },
        { nome: "Coração de Frango", desc: null, preco: null },
        { nome: "Crocante", desc: "Bacon e batata palha", preco: null },
        { nome: "Curitibana", desc: "Calabresa, cebola e pimentão", preco: null },
        { nome: "Do Cheff", desc: "Lombo, calabresa, bacon, champignon e requeijão", preco: null, destaque: true },
        { nome: "Frango", desc: null, preco: null },
        { nome: "Firense", desc: "Peito de peru, alho e palmito", preco: null },
        { nome: "Francesa", desc: "Peito de peru, tomate e creme de leite", preco: null },
        { nome: "Frango Americano", desc: "Frango em cubos, cebola e molho soyo", preco: null },
        { nome: "Frango com Requeijão", desc: null, preco: null, destaque: true },
        { nome: "Frango do Cheff", desc: "Frango em cubos, creme de leite, mostarda e pimentão", preco: null },
        { nome: "Frangolino", desc: "Frango, bacon e parmesão", preco: null },
        { nome: "Frango Xadrez", desc: "Frango em cubos, molho soyo, pimentão e cebola", preco: null },
        { nome: "Galeta", desc: "Frango, milho e cebola", preco: null },
        { nome: "Grega", desc: "Lombo, bacon, ovo e parmesão", preco: null },
        { nome: "Italiana", desc: "Salame italiano e palmito", preco: null },
        { nome: "Light", desc: "Peito de peru, tomate, brócolis, champignon, palmito e cebola", preco: null },
        { nome: "Lombo", desc: null, preco: null },
        { nome: "Marguerita", desc: "Tomate e manjericão", preco: null, destaque: true },
        { nome: "Mista", desc: "Calabresa, bacon, frango, milho, tomate e azeitona", preco: null },
        { nome: "Mistura", desc: "Frango, palmito, azeitona e cebola", preco: null },
        { nome: "Milho", desc: null, preco: null },
        { nome: "Milho com Bacon", desc: null, preco: null },
        { nome: "Moda da Casa", desc: "Calabresa, bacon, tomate e milho", preco: null, destaque: true },
        { nome: "Mussarela", desc: "Tomate e mussarela", preco: null },
        { nome: "Palmito", desc: null, preco: null },
        { nome: "Paulista", desc: "Palmito e milho", preco: null },
        { nome: "Parmegiana", desc: "Presunto e molho ao sugo", preco: null },
        { nome: "Peito de Peru", desc: null, preco: null },
        { nome: "Portuguesa", desc: "Presunto, ovo, azeitona, pimentão e cebola", preco: null, destaque: true },
        { nome: "Primavera", desc: "Brócolis, milho, tomate e palmito", preco: null },
        { nome: "Quatro Queijos", desc: "Mussarela, parmesão, provolone e requeijão", preco: null, destaque: true },
        { nome: "Quatro Queijos e Bacon", desc: null, preco: null },
        { nome: "Romanesca", desc: "Presunto, bacon, ervilha, palmito e creme de leite", preco: null },
        { nome: "São Lourenço", desc: "Bacon, champignon e parmesão", preco: null },
        { nome: "Seis Queijos", desc: "Mussarela, parmesão, provolone, gorgonzola, requeijão e cheddar", preco: null },
        { nome: "Seis Queijos e Bacon", desc: null, preco: null },
        { nome: "Siciliana", desc: "Bacon, palmito, champignon e parmesão", preco: null },
        { nome: "Sofia Loren", desc: "Salame italiano, champignon e parmesão", preco: null },
        { nome: "Estrogonofe de Brócolis", desc: "Brócolis, creme de leite, ketchup, champignon e batata palha", preco: null },
        { nome: "Estrogonofe de Frango", desc: "Frango, creme de leite, champignon e batata palha", preco: null },
        { nome: "Sublime", desc: "Palmito e tomate", preco: null },
        { nome: "Super Mexicana", desc: "Calabresa, salame italiano, requeijão, cheddar e pimentão", preco: null },
        { nome: "Tomate Seco com Rúcula", desc: null, preco: null },
        { nome: "Tropical", desc: "Lombo e abacaxi", preco: null },
        { nome: "Vegetariana", desc: "Brócolis, tomate, milho, palmito e cebola", preco: null },
        { nome: "Xirivelha", desc: "Frango, palmito, milho e creme de leite", preco: null }
      ]
    },
    {
      id: "especiais",
      categoria: "Pizzas Especiais",
      curto: "Especiais",
      descricao: "Filé, camarão e combinações que pedem um momento especial.",
      itens: [
        { nome: "Atum", desc: null, preco: null },
        { nome: "Barbecue", desc: "Filé, molho barbecue, requeijão e cheddar", preco: null, destaque: true },
        { nome: "Bolonhesa", desc: "Filé, ovo e bacon", preco: null },
        { nome: "Camarão", desc: null, preco: null, destaque: true },
        { nome: "Catarina", desc: "Filé, molho barbecue e requeijão", preco: null },
        { nome: "Gaúcha", desc: "Filé, molho barbecue e cebola", preco: null },
        { nome: "Pepperoni", desc: null, preco: null, destaque: true },
        { nome: "Estrogonofe de Camarão", desc: "Camarão, champignon, creme de leite e batata palha", preco: null }
      ]
    },
    {
      id: "outros",
      categoria: "Outros Pratos",
      curto: "Outros pratos",
      descricao: "Receitas da casa que vão além da pizza.",
      itens: [
        { nome: "Estrogonofe de Carne", desc: "Filé, champignon, creme de leite e batata palha", preco: null },
        { nome: "Mexicana", desc: "Carne moída, tomate e Doritos", preco: null },
        { nome: "Yakissoba", desc: "Filé, frango, brócolis, champignon, cebola e molho shoyo", preco: null }
      ]
    },
    {
      id: "doces",
      categoria: "Pizzas Doces Tradicionais",
      curto: "Doces",
      descricao: "Para fechar a noite com chocolate, frutas e creme.",
      itens: [
        { nome: "Banana e Canela", desc: null, preco: null },
        { nome: "Banana Nevada", desc: "Banana, chocolate branco e creme de leite", preco: null },
        { nome: "Banana Trovoada", desc: "Banana, chocolate preto e creme de leite", preco: null },
        { nome: "Branca de Neve", desc: "Chocolate preto, abacaxi e coco ralado", preco: null },
        { nome: "Califórnia Chocolate Preto", desc: "Abacaxi, pêssego, figo, chocolate preto e creme de leite", preco: null },
        { nome: "Califórnia Chocolate Branco", desc: "Abacaxi, pêssego, figo, chocolate branco e creme de leite", preco: null },
        { nome: "Charge Chocolate Preto", desc: "Amendoim, chocolate preto e creme de leite", preco: null },
        { nome: "Charge Chocolate Branco", desc: "Amendoim, chocolate branco e creme de leite", preco: null },
        { nome: "Sensação Chocolate Preto", desc: "Morango, chocolate preto e creme de leite", preco: null, destaque: true },
        { nome: "Sensação Chocolate Branco", desc: "Morango, chocolate branco e creme de leite", preco: null },
        { nome: "Piña Colada", desc: "Abacaxi, chocolate branco, coco ralado e creme de leite", preco: null }
      ]
    },
    {
      id: "doces-especiais",
      categoria: "Pizzas Doces Especiais",
      curto: "Doces especiais",
      descricao: "Com bombons e chocolates que todo mundo reconhece.",
      itens: [
        { nome: "Ouro Branco", desc: "Chocolate branco, creme de leite e bombom Ouro Branco", preco: null, destaque: true },
        { nome: "Sonho de Valsa", desc: "Chocolate preto, creme de leite e bombom Sonho de Valsa", preco: null },
        { nome: "Bis Branco", desc: "Chocolate branco, creme de leite e Bis branco", preco: null },
        { nome: "Bis Preto", desc: "Chocolate preto, creme de leite e Bis preto", preco: null },
        { nome: "Dois Amores Preto", desc: "Chocolate preto, Ouro Branco, Sonho de Valsa e morango", preco: null },
        { nome: "Dois Amores Branco", desc: "Chocolate branco, Ouro Branco, Sonho de Valsa e morango", preco: null }
      ]
    }
  ]
};
