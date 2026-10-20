/* =========================================================================
   Dados padrão da loja.

   - MB_DEFAULTS.settings: textos e configurações iniciais. Tudo é editável
     no painel; com Supabase ligado, o que vale é o que está no banco.
   - MB_DEMO: catálogo ILUSTRATIVO usado somente no modo demonstração.
     As imagens são renderizações 3D criadas para a apresentação, não fotos
     de peças reais. Preços, parcelamento e frete são exemplos.
   ========================================================================= */
(function () {
  var IMG = "assets/img/produtos/";

  function imgs(slug) { return [IMG + slug + "-1.webp", IMG + slug + "-2.webp"]; }

  var CARE_GOLD = "Guarde a peça separada, em local seco e protegida da luz. Evite contato com perfumes, cremes, cloro, água do mar e produtos de limpeza. Após o uso, limpe com flanela macia e seca.";
  var CARE_SILVER = "Guarde em saquinho fechado, longe da umidade. O escurecimento natural da prata pode ser removido com flanela própria para prata. Evite contato com cloro e produtos químicos.";
  var CARE_STEEL = "Limpe com pano macio levemente umedecido em água e sabão neutro e seque bem. Guarde separada de outras peças para evitar riscos.";

  var RINGS = ["12", "13", "14", "15", "16", "17", "18", "19", "20"];
  var RINGS_M = ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"];

  var categories = [
    {
      slug: "ouro-18k", name: "Ouro 18K", position: 1, active: true,
      description: "Semijoias folheadas com visual sofisticado.",
      image: "assets/img/editorial/cat-ouro.webp"
    },
    {
      slug: "prata-925", name: "Prata 925", position: 2, active: true,
      description: "Peças para quem aprecia elegância atemporal.",
      image: "assets/img/editorial/cat-prata.webp"
    },
    {
      slug: "aco-inoxidavel", name: "Aço inoxidável", position: 3, active: true,
      description: "Design versátil para diferentes ocasiões.",
      image: "assets/img/editorial/cat-aco.webp"
    },
    {
      slug: "aliancas-personalizados", name: "Alianças e personalizados", position: 4, active: true,
      description: "Peças especiais para celebrar conexões e momentos importantes.",
      image: "assets/img/editorial/cat-aliancas.webp"
    }
  ];

  var products = [
    {
      id: "p01", slug: "colar-ponto-de-luz", name: "Colar Ponto de Luz", category: "ouro-18k",
      tags: ["mais-vendido", "presente"], material: "Folheado a ouro 18K", finish: "Polido · zircônia cristal",
      price: 189.9, compare_at_price: null, stock: 8, position: 1, active: true,
      images: imgs("colar-ponto-de-luz"),
      description: "Um único ponto de brilho, delicado o bastante para o dia a dia e especial o suficiente para as noites que pedem algo a mais. Corrente fina com pingente de zircônia em aro polido.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido, com zircônia cristal em aro", medidas: "Corrente 45 cm com extensor · pingente 6 mm", peso: "", cuidados: CARE_GOLD },
      options: [], personalization: null
    },
    {
      id: "p02", slug: "brinco-argola-classica", name: "Argola Clássica", category: "ouro-18k",
      tags: ["mais-vendido"], material: "Folheado a ouro 18K", finish: "Polido · tubo cônico",
      price: 159.9, compare_at_price: null, stock: 12, position: 2, active: true,
      images: imgs("brinco-argola-classica"),
      description: "A argola que acompanha tudo. Tubo de espessura suave, mais encorpado na base, com fecho discreto que mantém o desenho contínuo.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido", medidas: "Diâmetro 2 cm · tubo 2,5 mm", peso: "", cuidados: CARE_GOLD },
      options: [], personalization: null
    },
    {
      id: "p03", slug: "anel-solitario-classico", name: "Anel Solitário", category: "ouro-18k",
      tags: ["presente"], material: "Folheado a ouro 18K", finish: "Polido · zircônia 6 mm",
      price: 219.9, compare_at_price: null, stock: 10, position: 3, active: true,
      images: imgs("anel-solitario-classico"),
      description: "O clássico dos clássicos. Aro fino e uma zircônia redonda presa por quatro garras, para que a luz atravesse a pedra por todos os lados.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido, zircônia cristal com 4 garras", medidas: "Pedra 6 mm · aro 1,7 mm", peso: "", cuidados: CARE_GOLD },
      options: [{ name: "Aro", values: RINGS }], personalization: null
    },
    {
      id: "p04", slug: "colar-coracao", name: "Colar Coração", category: "ouro-18k",
      tags: ["novidade", "presente"], material: "Folheado a ouro 18K", finish: "Polido · coração bombê",
      price: 199.9, compare_at_price: 229.9, stock: 6, position: 4, active: true,
      images: imgs("colar-coracao"),
      description: "Um coração arredondado, de volume suave, que reflete a luz por inteiro. Um presente que diz muito sem precisar de palavras.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido", medidas: "Corrente 45 cm com extensor · pingente 12 mm", peso: "", cuidados: CARE_GOLD },
      options: [], personalization: null
    },
    {
      id: "p05", slug: "brinco-perola", name: "Brinco Pérola", category: "ouro-18k",
      tags: ["novidade", "presente"], material: "Folheado a ouro 18K", finish: "Pérola sintética 8 mm",
      price: 129.9, compare_at_price: null, stock: 15, position: 5, active: true,
      images: imgs("brinco-perola"),
      description: "A elegância silenciosa da pérola em sua forma mais pura. Base folheada a ouro e pino com tarraxa.",
      details: { material: "Folheado a ouro 18K · pérola sintética", acabamento: "Polido", medidas: "Pérola 8 mm", peso: "", cuidados: CARE_GOLD },
      options: [], personalization: null
    },
    {
      id: "p06", slug: "pulseira-riviera", name: "Pulseira Riviera", category: "ouro-18k",
      tags: ["novidade"], material: "Folheado a ouro 18K", finish: "Zircônias cravejadas",
      price: 289.9, compare_at_price: null, stock: 4, position: 6, active: true,
      images: imgs("pulseira-riviera"),
      description: "Uma linha contínua de zircônias que contorna o pulso com brilho do começo ao fim. Para usar sozinha ou compor com outras pulseiras.",
      details: { material: "Folheado a ouro 18K · zircônias cristal", acabamento: "Cravação em caixas individuais", medidas: "18 cm · pedras de 3 mm", peso: "", cuidados: CARE_GOLD },
      options: [{ name: "Tamanho", values: ["17 cm", "18 cm", "19 cm"] }], personalization: null
    },
    {
      id: "p07", slug: "anel-aparador-prata", name: "Anel Aparador Cravejado", category: "prata-925",
      tags: ["mais-vendido"], material: "Prata 925", finish: "Meia aliança cravejada",
      price: 169.9, compare_at_price: null, stock: 9, position: 7, active: true,
      images: imgs("anel-aparador-prata"),
      description: "Meia aliança em prata 925 com zircônias alinhadas. Bonita sozinha e perfeita para acompanhar um solitário.",
      details: { material: "Prata 925 · zircônias cristal", acabamento: "Polido", medidas: "Largura 2,6 mm", peso: "", cuidados: CARE_SILVER },
      options: [{ name: "Aro", values: RINGS }], personalization: null
    },
    {
      id: "p08", slug: "brinco-gota-prata", name: "Brinco Gota", category: "prata-925",
      tags: ["novidade"], material: "Prata 925", finish: "Polido · gancho francês",
      price: 149.9, compare_at_price: null, stock: 7, position: 8, active: true,
      images: imgs("brinco-gota-prata"),
      description: "Uma gota de prata de volume suave, que balança com leveza a cada movimento. Gancho francês para um caimento natural.",
      details: { material: "Prata 925", acabamento: "Polido", medidas: "Gota 15 mm · altura total 3 cm", peso: "", cuidados: CARE_SILVER },
      options: [], personalization: null
    },
    {
      id: "p09", slug: "pulseira-elos-prata", name: "Pulseira Elos", category: "prata-925",
      tags: [], material: "Prata 925", finish: "Elos ovais polidos",
      price: 239.9, compare_at_price: null, stock: 5, position: 9, active: true,
      images: imgs("pulseira-elos-prata"),
      description: "Elos ovais encorpados, de presença marcante e toque macio. Uma peça de assinatura para o dia a dia.",
      details: { material: "Prata 925", acabamento: "Polido", medidas: "19 cm · elo 9 mm", peso: "", cuidados: CARE_SILVER },
      options: [{ name: "Tamanho", values: ["17 cm", "19 cm", "21 cm"] }], personalization: null
    },
    {
      id: "p10", slug: "argola-tubo-aco", name: "Argola Tubo", category: "aco-inoxidavel",
      tags: ["mais-vendido"], material: "Aço inoxidável", finish: "Polido · tubo 3,6 mm",
      price: 89.9, compare_at_price: null, stock: 20, position: 10, active: true,
      images: imgs("argola-tubo-aco"),
      description: "Argola de tubo encorpado em aço inoxidável polido. Moderna, versátil e pronta para qualquer ocasião.",
      details: { material: "Aço inoxidável", acabamento: "Polido", medidas: "Diâmetro 2 cm · tubo 3,6 mm", peso: "", cuidados: CARE_STEEL },
      options: [], personalization: null
    },
    {
      id: "p11", slug: "bracelete-aberto-aco", name: "Bracelete Aberto", category: "aco-inoxidavel",
      tags: [], material: "Aço inoxidável", finish: "Polido · abertura ajustável",
      price: 119.9, compare_at_price: null, stock: 11, position: 11, active: true,
      images: imgs("bracelete-aberto-aco"),
      description: "Bracelete de linhas puras com abertura frontal, que se ajusta com delicadeza ao pulso.",
      details: { material: "Aço inoxidável", acabamento: "Polido", medidas: "Diâmetro interno 6 cm · largura 7 mm", peso: "", cuidados: CARE_STEEL },
      options: [], personalization: null
    },
    {
      id: "p12", slug: "par-aliancas-tradicionais", name: "Par de Alianças Tradicionais", category: "aliancas-personalizados",
      tags: ["presente"], material: "Folheado a ouro 18K", finish: "Abauladas · conforto interno",
      price: 349.9, compare_at_price: null, stock: null, position: 12, active: true,
      images: imgs("par-aliancas-tradicionais"),
      description: "O par clássico, abaulado e com conforto interno, para celebrar um compromisso. Escolha os aros e, se quiser, a gravação interna de cada aliança.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido, abauladas, com conforto interno", medidas: "Largura 5 mm (ele) e 3 mm (ela)", peso: "", cuidados: CARE_GOLD },
      options: [{ name: "Aro dela", values: RINGS }, { name: "Aro dele", values: RINGS_M }],
      personalization: {
        title: "Gravação interna",
        note: "Opcional. Confira com atenção: peças gravadas são produzidas sob encomenda.",
        fields: [
          { key: "gravacao_dela", label: "Gravação na aliança dela", maxLength: 18, required: false, placeholder: "Ex.: Rafael 12.10.2026" },
          { key: "gravacao_dele", label: "Gravação na aliança dele", maxLength: 18, required: false, placeholder: "Ex.: Ana 12.10.2026" }
        ],
        confirm: true
      }
    },
    {
      id: "p13", slug: "colar-plaquinha-personalizada", name: "Colar Plaquinha Personalizada", category: "aliancas-personalizados",
      tags: ["novidade", "presente"], material: "Folheado a ouro 18K", finish: "Gravação em letra cursiva",
      price: 209.9, compare_at_price: null, stock: null, position: 13, active: true,
      images: imgs("colar-plaquinha-personalizada"),
      description: "Uma plaquinha delicada com o nome, a palavra ou a data que você escolher, gravada em letra cursiva. Um presente que é só seu.",
      details: { material: "Folheado a ouro 18K", acabamento: "Polido, gravação cursiva", medidas: "Plaquinha 26 × 6 mm · corrente 45 cm", peso: "", cuidados: CARE_GOLD },
      options: [],
      personalization: {
        title: "Sua gravação",
        note: "Peça produzida sob encomenda após a confirmação do pagamento.",
        fields: [{ key: "texto", label: "Texto da plaquinha", maxLength: 12, required: true, placeholder: "Ex.: Bella" }],
        confirm: true
      }
    }
  ];

  var PAGES = {
    sobre: {
      title: "Nossa história",
      body: "<p>A Mais Bella acredita que a beleza está nos detalhes. Em cada escolha, em cada gesto e em cada momento especial, existe uma maneira única de expressar sua essência.</p><p>Nossa proposta é aproximar você de peças que combinam delicadeza, personalidade e elegância, tornando cada ocasião ainda mais especial.</p><p class=\"pending\">Espaço reservado para a história verdadeira da Mais Bella: como a loja começou, quem está por trás dela e o que guia a seleção das peças. Edite este texto no painel.</p>"
    },
    entrega: {
      title: "Entrega e frete",
      body: "<p>O valor e o prazo do frete aparecem na finalização da compra, depois que você informa o CEP. O prazo começa a contar a partir da confirmação do pagamento.</p><h3>Prazo de separação</h3><p class=\"pending\">Informe aqui em quantos dias úteis os pedidos são separados e postados.</p><h3>Peças personalizadas</h3><p>Alianças com gravação e peças personalizadas são produzidas sob encomenda. O prazo de produção é informado na página da peça e somado ao prazo de entrega.</p><h3>Rastreamento</h3><p>Assim que o pedido for postado, você recebe o código de rastreamento pelo e-mail ou WhatsApp informados na compra.</p>"
    },
    trocas: {
      title: "Trocas e devoluções",
      body: "<h3>Direito de arrependimento</h3><p>Em compras feitas pela internet, você pode desistir da compra em até 7 dias corridos a partir do recebimento, conforme o artigo 49 do Código de Defesa do Consumidor. O valor pago é devolvido integralmente.</p><h3>Como solicitar</h3><p>Fale com a gente pelo WhatsApp ou e-mail informando o número do pedido. A peça deve ser devolvida sem sinais de uso, com a embalagem original.</p><h3>Peças personalizadas</h3><p class=\"pending\">Descreva aqui a política para peças gravadas ou feitas sob encomenda.</p><h3>Defeitos</h3><p>Se a peça apresentar defeito, entre em contato. Seguimos os prazos de garantia legal previstos no Código de Defesa do Consumidor.</p>"
    },
    garantia: {
      title: "Garantia",
      body: "<p>Todas as peças contam com a garantia legal de 90 dias para produtos duráveis prevista no Código de Defesa do Consumidor, contra defeitos de fabricação.</p><p class=\"pending\">Se a loja oferecer garantia adicional, descreva aqui o prazo, o que ela cobre e como acioná-la. Não publique prazos que a loja não possa cumprir.</p><h3>O que não é coberto</h3><p>Desgaste natural pelo uso, contato com produtos químicos, quedas, amassados e mau acondicionamento.</p>"
    },
    privacidade: {
      title: "Política de privacidade",
      body: "<p>Esta política explica como a Mais Bella Semijoias trata os seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p><h3>Dados que coletamos</h3><p>Nome, e-mail, telefone, CPF e endereço de entrega, informados por você ao finalizar uma compra ou criar uma conta. Dados de pagamento com cartão são processados diretamente pelo provedor de pagamento e não ficam armazenados na loja.</p><h3>Para que usamos</h3><ul><li>Processar e entregar seus pedidos;</li><li>Emitir nota fiscal;</li><li>Responder às suas solicitações de atendimento.</li></ul><h3>Compartilhamento</h3><p>Compartilhamos apenas o necessário com o provedor de pagamento, a transportadora e o serviço de hospedagem, para que a compra aconteça.</p><h3>Armazenamento local</h3><p>Usamos o armazenamento do seu navegador para lembrar a sacola e os favoritos. Não usamos cookies de publicidade.</p><h3>Seus direitos</h3><p>Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelos canais de atendimento.</p><p class=\"pending\">Preencha aqui a razão social, o CNPJ e o e-mail do responsável pelos dados.</p>"
    },
    termos: {
      title: "Termos de compra",
      body: "<p>Ao finalizar uma compra no site, você concorda com estes termos.</p><h3>Preços e disponibilidade</h3><p>Os preços e o estoque exibidos são os vigentes no momento da compra. O pedido é confirmado após a aprovação do pagamento.</p><h3>Pagamento</h3><p>As formas de pagamento disponíveis aparecem na finalização da compra. Pagamentos são processados por provedor especializado.</p><h3>Entrega</h3><p>Consulte a página <a href=\"entrega.html\">Entrega e frete</a>.</p><h3>Trocas e devoluções</h3><p>Consulte a página <a href=\"trocas.html\">Trocas e devoluções</a>.</p><p class=\"pending\">Preencha aqui a razão social, o CNPJ, o endereço e os canais oficiais da loja, como exige o Decreto 7.962/2013.</p>"
    },
    faq: {
      title: "Perguntas frequentes",
      faq: [
        { q: "O que é uma semijoia folheada a ouro 18K?", a: "É uma peça com base metálica que recebe uma camada de ouro 18K por eletrodeposição. O resultado tem o mesmo tom do ouro, com valor mais acessível. A espessura da camada de cada peça é informada em Detalhes da peça." },
        { q: "Como devo cuidar das minhas peças?", a: "Evite contato com perfumes, cremes, cloro e água do mar, retire as peças para dormir e praticar exercícios, e guarde cada uma separadamente em local seco. Cada página de produto traz recomendações específicas." },
        { q: "Quais formas de pagamento são aceitas?", a: "As formas disponíveis aparecem na finalização da compra." },
        { q: "Como sei o meu tamanho de aro?", a: "Fale com a gente pelo WhatsApp e ajudamos você a descobrir o aro ideal antes da compra." },
        { q: "Posso trocar uma peça?", a: "Sim. Veja as condições na página de trocas e devoluções." },
        { q: "As peças vêm com embalagem para presente?", a: "Quando a loja oferece essa opção, ela aparece na finalização da compra." }
      ]
    },
    contato: {
      title: "Fale conosco",
      body: "<p>Nosso atendimento é feito de forma próxima e personalizada. Escolha o canal que preferir.</p>"
    }
  };

  window.MB_DEFAULTS = {
    settings: {
      storeName: "Mais Bella Semijoias",
      announcement: "Elegância nos detalhes. Beleza em cada momento.",
      tagline: "Elegância nos detalhes. Beleza em cada momento.",
      whatsapp: "",           // formato internacional, só números: 5511999999999
      instagram: "",          // https://instagram.com/perfil
      email: "",
      hours: "",
      logoUrl: "",
      hero: {
        title: "Há beleza em <em>cada detalhe.</em>",
        text: "Semijoias escolhidas para iluminar sua essência e acompanhar os momentos que merecem ser lembrados.",
        primary: "Descobrir coleção",
        secondary: "Explorar novidades",
        image: "assets/img/editorial/hero.webp",
        imageMobile: "assets/img/editorial/hero-mobile.webp"
      },
      essence: {
        title: "Mais do que acessórios. <em>Expressões de quem você é.</em>",
        body: "A Mais Bella acredita que a beleza está nos detalhes. Em cada escolha, em cada gesto e em cada momento especial, existe uma maneira única de expressar sua essência.\n\nNossa proposta é aproximar você de peças que combinam delicadeza, personalidade e elegância, tornando cada ocasião ainda mais especial.\n\nDescubra uma seleção pensada para acompanhar sua história.",
        image: "assets/img/editorial/essencia.webp",
        imageDetail: "assets/img/editorial/essencia-detalhe.webp"
      },
      gift: {
        title: "Presentes que guardam <em>significado.</em>",
        text: "Para surpreender alguém especial ou celebrar uma conquista sua, encontre uma peça que transforme o momento em lembrança.",
        button: "Encontrar um presente",
        image: "assets/img/editorial/presente.webp"
      },
      trust: [
        { icon: "lock", title: "Pagamento seguro", text: "Processado por provedor de pagamento especializado.", link: "termos.html" },
        { icon: "truck", title: "Entrega", text: "Valor e prazo calculados pelo seu CEP na finalização.", link: "entrega.html" },
        { icon: "chat", title: "Atendimento personalizado", text: "Tire dúvidas sobre peças, aros e presentes.", link: "contato.html" },
        { icon: "return", title: "Trocas e devoluções", text: "Até 7 dias após o recebimento, conforme o CDC.", link: "trocas.html" },
        { icon: "gem", title: "Materiais", text: "Composição e cuidados descritos em cada peça.", link: "faq.html" }
      ],
      installments: { enabled: false, max: 3, minInstallment: 50 },
      payments: { pix: false, card: false, whatsapp: true, pixDiscount: 0 },
      shipping: { methods: [], freeAbove: 0, melhorEnvio: false, originCep: "" },
      giftWrap: { enabled: false, price: 0, label: "Embalagem para presente" },
      personalizedLeadTime: "",
      wa: {
        general: "Olá! Estou visitando o site da Mais Bella Semijoias e gostaria de saber mais sobre uma peça.",
        rings: "Olá! Gostaria de conhecer as opções de alianças e personalização disponíveis.",
        product: "Olá! Estou visitando o site da Mais Bella Semijoias e gostaria de saber mais sobre esta peça:"
      },
      pages: PAGES,
      seo: {
        title: "Mais Bella Semijoias · Ouro 18K, prata 925 e alianças",
        description: "Semijoias folheadas a ouro 18K, peças em prata 925, aço inoxidável, alianças e personalizados. Elegância nos detalhes, beleza em cada momento."
      }
    }
  };

  // Ajustes que só valem para a demonstração (exemplos claramente ilustrativos).
  var demoSettings = JSON.parse(JSON.stringify(window.MB_DEFAULTS.settings));
  demoSettings.installments = { enabled: true, max: 3, minInstallment: 50 };
  demoSettings.shipping.methods = [
    { id: "padrao", name: "Entrega padrão", price: 19.9, days: "5 a 9 dias úteis", freeAbove: 399 },
    { id: "expressa", name: "Entrega expressa", price: 34.9, days: "2 a 4 dias úteis", freeAbove: 0 }
  ];
  demoSettings.giftWrap = { enabled: true, price: 0, label: "Embalagem para presente" };
  demoSettings.personalizedLeadTime = "Produção sob encomenda: prazo informado pela loja.";

  window.MB_DEMO = {
    settings: demoSettings,
    categories: categories,
    products: products,
    coupons: [],
    orders: []
  };
})();
