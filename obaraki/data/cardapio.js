/* ==========================================================================
   OBARAKI · DADOS DO SITE
   --------------------------------------------------------------------------
   Este é o arquivo de dados publicado. Tudo o que aparece no site vem daqui:
   configurações, categorias, produtos, combos e promoções.

   Jeito mais fácil de editar: abra  admin.html , faça as alterações e use
   "Configurações → Publicar → Baixar arquivo de dados". Depois substitua
   este arquivo pelo que foi baixado.

   Regras importantes
   - "price": null  → o produto aparece como "Preço sob consulta" e o botão
     leva ao WhatsApp em vez de ir para o carrinho.
   - "image": ""    → o site mostra uma moldura com o ideograma da categoria
     até a foto real ser cadastrada. Use um caminho como
     "assets/img/produtos/combo-master-chef.jpg".
   - Sempre que publicar uma nova versão, altere "version". Assim os
     rascunhos antigos guardados nos navegadores deixam de valer.
   ========================================================================== */

window.OBARAKI_DATA = {
  version: "2026-10-01.1",

  settings: {
    storeName: "ObaraKi Temakeria",
    tagline: "Temakeria Delivery",
    logo: "",

    whatsapp: "5516994123757",
    instagramUrl: "",
    instagramHandle: "",
    ifoodUrl: "",

    city: "Ribeirão Preto",
    state: "SP",
    hours: "",

    hero: {
      eyebrow: "ObaraKi Temakeria",
      title: "Seu sushi favorito,\ndo seu jeito.",
      subtitle:
        "Combos especiais, peças frescas e sabores preparados para transformar seu pedido em uma experiência.",
      image: ""
    },

    about: {
      title: "Sobre a ObaraKi",
      text:
        "Na ObaraKi, cada pedido é preparado com cuidado para entregar uma experiência especial em cada peça.",
      image: ""
    },

    delivery: {
      /* "fixed" = mesma taxa para toda a área  |  "zones" = taxa por bairro/região */
      mode: "fixed",
      fee: 5,
      areaLabel: "Para toda Ribeirão Preto",
      zones: [
        /* Exemplo de formato (modo "zones"):
           { id: "z1", name: "Região Central", fee: 5, neighborhoods: "Centro, Campos Elíseos" } */
      ],
      /* Taxa para bairros fora da lista no modo "zones". null = "a combinar" */
      otherFee: null,
      freeEnabled: false,
      freeMin: 0,
      minOrder: 0,
      estimate: ""
    },

    payments: {
      pix: true,
      cash: true,
      credit: true,
      debit: true,
      pixKey: ""
    },

    /* Fotos da seção "Siga a ObaraKi". Vazio = usa as fotos dos produtos. */
    gallery: []
  },

  categories: [
    { id: "combos", name: "Combos", kanji: "盛合", active: true },
    { id: "sushi", name: "Sushi", kanji: "寿司", active: true },
    { id: "sashimi", name: "Sashimi", kanji: "刺身", active: true },
    { id: "niguiri", name: "Niguiri", kanji: "握り", active: true },
    { id: "hossomaki", name: "Hossomaki", kanji: "細巻", active: true },
    { id: "uramaki", name: "Uramaki", kanji: "裏巻", active: true },
    { id: "temaki", name: "Temaki", kanji: "手巻", active: true },
    { id: "hot-roll", name: "Hot Roll", kanji: "揚巻", active: true },
    { id: "fritos", name: "Fritos", kanji: "揚物", active: true },
    { id: "yakisoba", name: "Yakisoba", kanji: "焼麺", active: true },
    { id: "poke", name: "Poké", kanji: "丼", active: true },
    { id: "teppan", name: "Teppan", kanji: "鉄板", active: true },
    { id: "porcoes", name: "Porções", kanji: "小皿", active: true },
    { id: "bebidas", name: "Bebidas", kanji: "飲物", active: true },
    { id: "sobremesas", name: "Sobremesas", kanji: "甘味", active: true },
    { id: "adicionais", name: "Adicionais", kanji: "追加", active: true }
  ],

  /* kind: "combo" | "executivo" | "" (produto comum)
     composition: uma linha por item do combo
     options: adicionais opcionais (checkbox) com preço extra */
  products: [
    {
      id: "combo-master-chef",
      category: "combos",
      kind: "combo",
      name: "Combo Master Chef",
      description: "Seleção especial de sushi, sashimi e acompanhamentos.",
      quantity: "",
      composition: [],
      price: 165,
      image: "",
      featured: true,
      active: true,
      options: []
    },
    {
      id: "combo-mega",
      category: "combos",
      kind: "combo",
      name: "Combo Mega",
      description: "",
      quantity: "",
      composition: [],
      price: 140,
      image: "",
      featured: true,
      active: true,
      options: []
    },
    {
      id: "combo-salmao-1",
      category: "combos",
      kind: "combo",
      name: "Combo Salmão 1",
      description: "Combo com peças de salmão.",
      quantity: "",
      composition: [],
      price: 160,
      image: "",
      featured: true,
      active: true,
      options: []
    },
    {
      id: "combo-salmao-2",
      category: "combos",
      kind: "combo",
      name: "Combo Salmão 2",
      description: "Combo com peças de salmão.",
      quantity: "",
      composition: [],
      price: 190,
      image: "",
      featured: true,
      active: true,
      options: []
    },
    {
      id: "combo-sushi",
      category: "combos",
      kind: "combo",
      name: "Combo Sushi",
      description: "",
      quantity: "",
      composition: [],
      price: 120,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-pequeno",
      category: "combos",
      kind: "combo",
      name: "Combo Pequeno",
      description: "",
      quantity: "",
      composition: [],
      price: 100,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-medio",
      category: "combos",
      kind: "combo",
      name: "Combo Médio",
      description: "",
      quantity: "",
      composition: [],
      price: 120,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-economico",
      category: "combos",
      kind: "combo",
      name: "Combo Econômico",
      description: "",
      quantity: "",
      composition: [],
      price: 65,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-hot",
      category: "combos",
      kind: "combo",
      name: "Combo Hot",
      description: "Combo com peças hot.",
      quantity: "",
      composition: [],
      price: 65,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-especial",
      category: "combos",
      kind: "combo",
      name: "Combo Especial",
      description: "",
      quantity: "",
      composition: [],
      price: 85,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "combo-familia",
      category: "combos",
      kind: "combo",
      name: "Combo Família",
      description: "",
      quantity: "",
      composition: [],
      price: null,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "executivo-1",
      category: "combos",
      kind: "executivo",
      name: "Executivo 1",
      description: "",
      quantity: "",
      composition: [],
      price: 95,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "executivo-2",
      category: "combos",
      kind: "executivo",
      name: "Executivo 2",
      description: "",
      quantity: "",
      composition: [],
      price: 100,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "executivo-3",
      category: "combos",
      kind: "executivo",
      name: "Executivo 3",
      description: "",
      quantity: "",
      composition: [],
      price: 110,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "sashimi-salmao",
      category: "sashimi",
      kind: "",
      name: "Salmão",
      description: "Sashimi de salmão fresco.",
      quantity: "10 unidades",
      composition: [],
      price: 48,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "niguiri-salmao",
      category: "niguiri",
      kind: "",
      name: "Niguiri de Salmão",
      description: "",
      quantity: "6 unidades",
      composition: [],
      price: 28,
      image: "",
      featured: false,
      active: true,
      options: []
    },
    {
      id: "temaki-salmao",
      category: "temaki",
      kind: "",
      name: "Temaki de Salmão",
      description: "",
      quantity: "",
      composition: [],
      price: 43,
      image: "",
      featured: false,
      active: true,
      options: [{ id: "fritura", name: "Fritura", price: 5 }]
    },
    {
      id: "temaki-salmao-especial",
      category: "temaki",
      kind: "",
      name: "Temaki Salmão Especial",
      description: "",
      quantity: "",
      composition: [],
      price: 46,
      image: "",
      featured: false,
      active: true,
      options: [{ id: "fritura", name: "Fritura", price: 5 }]
    },
    {
      id: "temaki-skin",
      category: "temaki",
      kind: "",
      name: "Temaki Skin",
      description: "",
      quantity: "",
      composition: [],
      price: 43,
      image: "",
      featured: false,
      active: true,
      options: [{ id: "fritura", name: "Fritura", price: 5 }]
    },
    {
      id: "temaki-sem-arroz",
      category: "temaki",
      kind: "",
      name: "Temaki sem Arroz",
      description: "",
      quantity: "",
      composition: [],
      price: 45,
      image: "",
      featured: false,
      active: true,
      options: [{ id: "fritura", name: "Fritura", price: 5 }]
    },
    {
      id: "temaki-sem-arroz-especial",
      category: "temaki",
      kind: "",
      name: "Temaki sem Arroz Especial",
      description: "",
      quantity: "",
      composition: [],
      price: 51,
      image: "",
      featured: false,
      active: true,
      options: [{ id: "fritura", name: "Fritura", price: 5 }]
    }
  ],

  /* Promoções: apontam para um produto. promoPrice null = mantém o preço
     normal e só destaca o produto na seção de promoções. */
  promotions: [
    { id: "promo-economico", productId: "combo-economico", label: "Promoção", promoPrice: null, active: true },
    { id: "promo-hot", productId: "combo-hot", label: "Promoção", promoPrice: null, active: true },
    { id: "promo-especial", productId: "combo-especial", label: "Promoção", promoPrice: null, active: true },
    { id: "promo-master-chef", productId: "combo-master-chef", label: "Promoção", promoPrice: null, active: true },
    { id: "promo-salmao", productId: "combo-salmao-1", label: "Promoção", promoPrice: null, active: true },
    { id: "promo-familia", productId: "combo-familia", label: "Promoção", promoPrice: null, active: true }
  ]
};
