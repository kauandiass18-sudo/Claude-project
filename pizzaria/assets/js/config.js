/*
 * Site de pizzaria — configurações
 * ---------------------------------------------------------------
 * Tudo o que muda de uma pizzaria para outra fica aqui.
 *
 * DICA PARA PROSPECÇÃO: o nome também pode vir pelo link, sem editar nada:
 *   .../pizzaria/?nome=Pizzaria%20do%20Jo%C3%A3o
 *   (no WhatsApp, basta escrever ?nome=Pizzaria do João que ele converte)
 */
window.PIZZARIA = {
  // Nome exibido no site (substituído por ?nome= no link, se houver).
  nome: "Sua Pizzaria",

  // WhatsApp que RECEBE os pedidos: 55 + DDD + número, só números.
  // Vazio = o pedido abre o WhatsApp para a pessoa escolher o contato.
  whatsapp: "",

  instagram: "",                                  // ex.: "https://instagram.com/suapizzaria"
  endereco: "Rua da Pizzaria, 123 · Centro",       // EXEMPLO
  horarios: [
    { dias: "Terça a domingo", horas: "18h às 23h30" },
    { dias: "Segunda", horas: "fechado" }
  ],
  // Dias/horas de funcionamento usados para mostrar "Aberto agora".
  // 0 = domingo ... 6 = sábado. Horas no formato 24h.
  funcionamento: { dias: [0, 2, 3, 4, 5, 6], abre: 18, fecha: 23.5 },
  tempoEntrega: "40 a 60 min",
  pagamentos: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],

  // Bairros atendidos e taxa de entrega (EXEMPLOS).
  bairros: [
    { nome: "Centro", taxa: 5 },
    { nome: "Jardim América", taxa: 7 },
    { nome: "Vila Nova", taxa: 7 },
    { nome: "Santa Rita", taxa: 9 },
    { nome: "Parque das Flores", taxa: 10 }
  ],

  // Tamanhos das pizzas.
  tamanhos: [
    { id: "M", nome: "Média", fatias: "6 fatias" },
    { id: "G", nome: "Grande", fatias: "8 fatias" }
  ],
  bordas: [
    { nome: "Sem borda recheada", preco: 0 },
    { nome: "Catupiry", preco: 10 },
    { nome: "Cheddar", preco: 10 },
    { nome: "Chocolate", preco: 12 }
  ],

  // Cardápio (EXEMPLOS: nomes, descrições e preços editáveis).
  // foto: chave de FOTOS em app.js, ou um caminho "assets/img/minha-foto.jpg".
  cardapio: [
    { categoria: "Tradicionais", itens: [
      { nome: "Margherita", desc: "Molho de tomate, muçarela, tomate em rodelas e manjericão fresco.", precos: { M: 49.9, G: 59.9 }, foto: "margherita", destaque: true },
      { nome: "Calabresa", desc: "Muçarela, calabresa fatiada, cebola e azeitonas.", precos: { M: 47.9, G: 57.9 }, foto: "calabresa" },
      { nome: "Muçarela", desc: "Muçarela, rodelas de tomate, orégano e azeitonas.", precos: { M: 44.9, G: 54.9 }, foto: "mucarela" },
      { nome: "Portuguesa", desc: "Presunto, ovos, cebola, ervilha, muçarela e azeitonas.", precos: { M: 52.9, G: 62.9 }, foto: "portuguesa" },
      { nome: "Frango com Catupiry", desc: "Frango desfiado temperado coberto com Catupiry.", precos: { M: 52.9, G: 62.9 }, foto: "frango", destaque: true },
      { nome: "Quatro Queijos", desc: "Muçarela, provolone, parmesão e gorgonzola.", precos: { M: 54.9, G: 64.9 }, foto: "queijos" }
    ]},
    { categoria: "Especiais", itens: [
      { nome: "Pepperoni", desc: "Muçarela e fatias generosas de pepperoni levemente picante.", precos: { M: 58.9, G: 69.9 }, foto: "pepperoni", destaque: true },
      { nome: "Carne Seca", desc: "Carne seca desfiada, cebola roxa e cream cheese.", precos: { M: 62.9, G: 74.9 }, foto: "especial1" },
      { nome: "Bacon com Cheddar", desc: "Muçarela, bacon crocante e cheddar cremoso.", precos: { M: 59.9, G: 70.9 }, foto: "especial2" },
      { nome: "Da Casa", desc: "Muçarela de búfala, tomate-cereja, rúcula e parmesão.", precos: { M: 64.9, G: 76.9 }, foto: "especial3" }
    ]},
    { categoria: "Doces", itens: [
      { nome: "Chocolate com Morango", desc: "Chocolate ao leite e morangos frescos.", precos: { M: 49.9, G: 59.9 }, foto: "doce1" },
      { nome: "Romeu e Julieta", desc: "Muçarela e goiabada cremosa.", precos: { M: 44.9, G: 54.9 }, foto: "doce2" },
      { nome: "Banana com Canela", desc: "Banana, açúcar, canela e leite condensado.", precos: { M: 44.9, G: 54.9 }, foto: "doce2" }
    ]},
    { categoria: "Bebidas", itens: [
      { nome: "Refrigerante 2 L", desc: "Consulte os sabores disponíveis.", preco: 14 },
      { nome: "Refrigerante lata", desc: "350 ml.", preco: 6.5 },
      { nome: "Suco natural 1 L", desc: "Laranja ou limão.", preco: 16 },
      { nome: "Água mineral", desc: "500 ml, com ou sem gás.", preco: 4 }
    ]}
  ],

  // Promoções (EXEMPLOS). Clicar adiciona ao pedido.
  promocoes: [
    { titulo: "Combo Família", desc: "2 pizzas grandes tradicionais + refrigerante 2 L", preco: 119.9, selo: "Mais pedido" },
    { titulo: "Terça em dobro", desc: "Na compra de uma grande, a segunda média sai pela metade", preco: 84.9, selo: "Só às terças" },
    { titulo: "Noite a dois", desc: "1 pizza média + 1 pizza doce média", preco: 89.9, selo: "Para dividir" }
  ],

  /* ---------------------------------------------------------------
   * Modo demonstração (para prospecção)
   * Mostra um selo discreto "Quero este site para minha pizzaria"
   * que leva ao SEU WhatsApp. Desligue (false) ao entregar ao cliente.
   * --------------------------------------------------------------- */
  demonstracao: {
    ativo: true,
    seuWhatsapp: "",   // SEU número (de quem vende o site): 55 + DDD + número
    mensagem: "Olá! Vi a demonstração do site para pizzarias e quero um assim para a minha."
  }
};
