/* =============================================================
   LOJA: YBERA PARIS  (produtos exibidos na PÁGINA INICIAL)
   =============================================================
   Ao tocar em um produto, o cliente vai direto para o affiliateUrl.

   A LISTA DE PRODUTOS SE ATUALIZA SOZINHA
   Todo dia a tarefa .github/workflows/catalogo-ybera.yml lê a loja da
   Ybera inteira (scripts/catalogo-ybera.mjs) e reescreve a lista
   "produtos" abaixo: nome, o que é, categoria, foto, preços e estoque.
   Mudanças feitas à mão na lista são substituídas no dia seguinte,
   com UMA exceção: "destaque: true" é mantido. Troque destaque para
   true num produto para ele aparecer em "Queridinhos do salão".

   Aqui em cima (fora da lista) você pode mudar à vontade:
   • ordemCategorias / iconesCategorias: ordem e ícone dos filtros
   • mostrarEsgotados: true para mostrar também os produtos sem estoque
   • O código de parceiro (parceiro=19285) é adicionado AUTOMATICAMENTE
     em links do site ybera.com que não tiverem esse parâmetro.
   ============================================================= */

window.LOJAS = window.LOJAS || {};

window.LOJAS.ybera = {
  titulo: "Ybera Paris",
  subtitulo: "Tratamento de salão para fazer em casa.",
  linkLoja: "https://www.ybera.com?parceiro=19285",
  textoLinkLoja: "Conhecer a loja oficial",

  // Parâmetros adicionados automaticamente aos links de ybera.com
  parametrosAfiliado: { parceiro: "19285" },
  dominiosAfiliado: ["ybera.com"],

  // Produtos esgotados ficam escondidos (voltam sozinhos quando o
  // estoque voltar). true = mostrar com o selo "Esgotado".
  mostrarEsgotados: false,

  // Ordem das categorias nos filtros (as que não estiverem aqui
  // aparecem depois, em ordem alfabética).
  ordemCategorias: [
    "Progressiva e Liso", "Cronograma Capilar", "Hidratação e Nutrição", "Reconstrução",
    "Antiqueda e Crescimento", "Cachos", "Loiros", "Finalizadores e Proteção", "Dia a Dia",
    "Kids", "Kits e Combos", "Acessórios"
  ],

  // Texto do botão de cada categoria na página inicial.
  rotulosCategorias: {
    "Progressiva e Liso": "Sua progressiva aqui",
    "Cronograma Capilar": "Seu cronograma capilar aqui",
    "Hidratação e Nutrição": "Sua hidratação aqui",
    "Reconstrução": "Sua reconstrução aqui",
    "Antiqueda e Crescimento": "Seu antiqueda aqui",
    "Cachos": "Seus cachos perfeitos aqui",
    "Loiros": "Seu loiro perfeito aqui",
    "Finalizadores e Proteção": "Seu finalizador aqui",
    "Dia a Dia": "Seu cuidado do dia a dia aqui",
    "Kids": "Seu kit kids aqui",
    "Kits e Combos": "Seus kits e combos aqui",
    "Acessórios": "Seus acessórios aqui"
  },

  // Ícone de cada categoria nos filtros.
  // Ícones: liso, gota, raiz, coracao, ondas, brilho, cachos, sol, escudo, frasco, caixa, escova.
  iconesCategorias: {
    "Progressiva e Liso": "liso",
    "Cronograma Capilar": "ondas",
    "Hidratação e Nutrição": "gota",
    "Reconstrução": "escudo",
    "Antiqueda e Crescimento": "raiz",
    "Cachos": "cachos",
    "Loiros": "sol",
    "Finalizadores e Proteção": "brilho",
    "Dia a Dia": "frasco",
    "Kids": "coracao",
    "Kits e Combos": "caixa",
    "Acessórios": "escova"
  },

  // Texto do preço (aparece depois do valor) e aviso abaixo da lista.
  rotuloPreco: "no Pix",
  notaPrecos: "Preços conferidos todos os dias na loja da Ybera. O valor final é o da loja.",

  produtos: [
    // Lista gerada sozinha a partir da loja (scripts/catalogo-ybera.mjs).
    // Para destacar um produto em "Queridinhos do salão", troque destaque para true.
    {
      nome: "Escova Progressiva 500g",
      oQueE: "Liso impecável com Tratamento Profundo .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150264.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-500g-ybera-fashion-gold-150264",
      precoAntigo: "R$ 339,90",
      preco: "R$ 322,91",
      destaque: true
    },
    {
      nome: "Kit Escova Progressiva - Progressiva 150g + Shampoo 300ml + Máscara 250g",
      oQueE: "Alisamento Profissional com Cuidado Diário Inteligente .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151084.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-progressiva-150g-shampoo-300ml-mascara-250g-ybera-fashion-gold-151084",
      precoAntigo: "R$ 284,90",
      preco: "R$ 270,66",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Liso Perfeito",
      oQueE: "Kit de Máscaras Cronograma Capilar Liso Perfeito. Revele a beleza de um liso disciplinado, alinhado e livre de frizz.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151305.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-liso-perfeito-ybera-fashion-gold-151305",
      precoAntigo: "R$ 324,90",
      preco: "R$ 308,66",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Kids Menino",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para cuidar dos cabelos das crianças com toda a segurança e eficácia que o couro cabeludo infantil…",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151312.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-kids-menino-ybera-fashion-kids-151312",
      precoAntigo: "R$ 249,90",
      preco: "R$ 237,41",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Loiro Perfeito",
      oQueE: "Kit de Máscaras Cronograma Capilar Loiro Perfeito Revele a beleza de um loiro iluminado, saudável e sofisticado.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151299.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-loiro-perfeito-ybera-fashion-gold-151299",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: true
    },
    {
      nome: "Kit Antiqueda 100Tímetros - Shampoo 300ml + Condicionador 300g + Tônico 150ml",
      oQueE: "Kit 100Tímetros Antiqueda – Tratamento Completo Contra a Queda Capilar .",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150314.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-shampoo-300ml-condicionador-300g-tonico-150ml-ybera-fashion-gold-150314",
      precoAntigo: "R$ 349,90",
      preco: "R$ 332,41",
      destaque: true
    },
    {
      nome: "Kit Escova Progressiva 300g + Shampoo Pós-Progressiva 300ml + Máscara 2 em 1 250g",
      oQueE: "Conquiste fios lisos, alinhados e com brilho intenso por muito mais tempo com o Escova Fashion Gold + Manutenção Protect Control.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150262.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-300g-shampoo-pos-progressiva-300ml-mascara-2-em-1-250g-ybera-fashion-gold-150262",
      precoAntigo: "R$ 449,90",
      preco: "R$ 427,41",
      destaque: true
    },
    {
      nome: "Kit Antiqueda 100Tímetros - 90 Cápsulas Softgel + Tônico 150ml",
      oQueE: "KIT 100timetros 90 Cápsulas softgel - Cabelo, Pele e Unhas .",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151484.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-90-capsulas-softgel-tonico-150ml-ybera-fashion-gold-151484",
      precoAntigo: "R$ 349,90",
      preco: "R$ 332,41",
      destaque: true
    },
    {
      nome: "Escova Progressiva 300g",
      oQueE: "A Escova Progressiva Fashion Gold 300g é a escolha ideal para quem busca cabelos mais lisos, alinhados e com aspecto saudável, sem comprometer a estrutura…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150795.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-300g-ybera-fashion-gold-150795",
      precoAntigo: "R$ 257,90",
      preco: "R$ 245,01",
      destaque: true
    },
    {
      nome: "Kit Manutenção Pós-Progressiva - Shampoo 300ml + Máscara 2 em 1 250g",
      oQueE: "A solução ideal para manter sua progressiva.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150293.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-pos-progressiva-shampoo-300ml-mascara-2-em-1-250g-ybera-fashion-gold-150293",
      precoAntigo: "R$ 205,90",
      preco: "R$ 195,61",
      destaque: true
    },
    {
      nome: "Tônico Antiqueda 100Tímetros 150ml",
      oQueE: "Fortalecimento da raiz e combate à queda capilar.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150308.jpg",
      affiliateUrl: "https://www.ybera.com/produto/tonico-antiqueda-100timetros-150ml-ybera-fashion-gold-150308",
      precoAntigo: "R$ 127,90",
      preco: "R$ 121,51",
      destaque: true
    },
    {
      nome: "90 Cápsulas 100Tímetros Softgel Cabelo, Pele e Unhas",
      oQueE: "KIT 100timetros 90 cáps softgel - Cabelo, Pele e Unhas O 100timetros foi desenvolvido para respeitar o ciclo natural de crescimento e renovação do…",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151480.jpg",
      affiliateUrl: "https://www.ybera.com/produto/90-capsulas-100timetros-softgel-cabelo-pele-e-unhas-ybera-fashion-gold-151480",
      precoAntigo: "R$ 239,90",
      preco: "R$ 227,91",
      destaque: true
    },
    {
      nome: "Escova Progressiva 150g",
      oQueE: "Alisamento Prático, Seguro e Eficiente .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151083.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-150g-ybera-fashion-gold-151083",
      precoAntigo: "R$ 99,90",
      preco: "R$ 94,91",
      destaque: false
    },
    {
      nome: "Escova Progressiva 1Kg - Fashion Gold",
      oQueE: "Você encontrou a solução para alisar os seus cabelos de forma segura, sem precisar se preocupar com o mau odor ou se irá danificar o seu cabelo.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151064.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-1kg-fashion-gold-151064",
      precoAntigo: "R$ 257,90",
      preco: "R$ 245,01",
      destaque: false
    },
    {
      nome: "Escova Progressiva 1Kg - Fashion Gold",
      oQueE: "Fashion Gold com KeraFive&sup2;&sup2; Cabelo com brilho intenso, naturalidade, balanço e sem frizz são alguns dos muitos benefícios da FASHION GOLD.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151557.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-1kg-fashion-gold-151557",
      precoAntigo: "R$ 397,90",
      preco: "R$ 378,01",
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 300g + Shampoo Pós-Progressiva 300ml + Máscara 2 em 1 250g + Protect Poo 300g",
      oQueE: "Você encontrou a solução para alisar os seus cabelos de forma segura, sem precisar se preocupar com o mau odor ou se irá danificar o seu cabelo.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150317.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-300g-shampoo-pos-progressiva-300ml-mascara-2-em-1-250g-protect-poo-300g-ybera-fashion-gold-150317",
      precoAntigo: "R$ 563,90",
      preco: "R$ 535,71",
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 500g + Shampoo Pós-Progressiva 500ml + Máscara 2 em 1 500g",
      oQueE: "Conquiste fios lisos, alinhados e com brilho intenso por muito mais tempo com o Escova Fashion Gold + Manutenção Protect Control.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150261.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-500g-shampoo-pos-progressiva-500ml-mascara-2-em-1-500g-ybera-fashion-gold-150261",
      precoAntigo: "R$ 577,90",
      preco: "R$ 549,01",
      destaque: false
    },
    {
      nome: "Kit Liso Perfeito - Máscara Resistência Absoluta 250g + Máscara Liso Encorpado 250g + Máscara Blindagem Polidora 250g",
      oQueE: "Kit de Máscaras Cronograma Capilar Liso Perfeito. Revele a beleza de um liso disciplinado, alinhado e livre de frizz.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151550.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-liso-perfeito-mascara-resistencia-absoluta-250g-mascara-liso-encorpado-250g-mascara-blindagem-polidora-250g-ybera-fashion-gold-151550",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Kit Manutenção Completa Pós-Progressiva - Pré-Shampoo 300ml + Shampoo 300ml + Máscara 2 em 1 250g",
      oQueE: "Prolongue os resultados da sua progressiva com o Combo de Manutenção Fashion Gold.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150327.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-completa-pos-progressiva-pre-shampoo-300ml-shampoo-300ml-mascara-2-em-1-250g-ybera-fashion-gold-150327",
      precoAntigo: "R$ 318,90",
      preco: "R$ 302,96",
      destaque: false
    },
    {
      nome: "Kit Manutenção Pós-Progressiva - Shampoo 500ml + Máscara 2 em 1 500g",
      oQueE: "Cuidado Prolongado para Manter o Liso Impecável por Muito Mais Tempo .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150294.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-pos-progressiva-shampoo-500ml-mascara-2-em-1-500g-ybera-fashion-gold-150294",
      precoAntigo: "R$ 254,90",
      preco: "R$ 242,16",
      destaque: false
    },
    {
      nome: "Máscara Hidratação Liso Encorpado Liso Perfeito 250g",
      oQueE: "A Máscara Liso Encorpado do Cronograma Capilar Liso Perfeito fortalece os fios fragilizados, reduz a quebra e aumenta a resistência da fibra capilar.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151516.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-hidratacao-liso-encorpado-liso-perfeito-250g-ybera-fashion-gold-151516",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Nutrição Blindagem Polidora Liso Perfeito 250g",
      oQueE: "A Máscara Blindagem Polidora do Cronograma Liso Perfeito foi desenvolvida para cabelos lisos e alisados que sofrem com frizz persistente, ondulação…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151515.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-nutricao-blindagem-polidora-liso-perfeito-250g-ybera-fashion-gold-151515",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Pós-Progressiva pH Control 200g",
      oQueE: "Cabelos alisados precisam de um cuidado especial para manter o efeito liso impecável por mais tempo.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151213.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-pos-progressiva-ph-control-200g-ybera-151213",
      precoAntigo: "R$ 137,90",
      preco: "R$ 131,01",
      destaque: false
    },
    {
      nome: "Máscara Reconstrução Resistência Absoluta Liso Perfeito 250g",
      oQueE: "A Máscara Resistência Absoluta do Cronograma Capilar Liso Perfeito fortalece os cabelos lisos fragilizados, devolvendo a elasticidade e a resistência dos fios.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151517.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-reconstrucao-resistencia-absoluta-liso-perfeito-250g-ybera-fashion-gold-151517",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Serum Discovery Tricomplex 90ml",
      oQueE: "O Sérum Tricomplex Cell-Pro Vit-C® é um densificador capilar avançado que fortalece o couro cabeludo, aumenta a densidade dos fios, combate o envelhecimento…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151216.jpg",
      affiliateUrl: "https://www.ybera.com/produto/serum-discovery-tricomplex-90ml-ybera-151216",
      precoAntigo: "R$ 339,90",
      preco: "R$ 322,91",
      destaque: false
    },
    {
      nome: "6 Unidades - Kit Cronograma Liso Perfeito",
      oQueE: "Kit Cronograma Capilar Liso Perfeito . Liso disciplinado, alinhado e protegido.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151443.jpg",
      affiliateUrl: "https://www.ybera.com/produto/6-unidades-kit-cronograma-liso-perfeito-ybera-fashion-gold-151443",
      precoAntigo: "R$ 815,40",
      preco: "R$ 774,63",
      destaque: false
    },
    {
      nome: "Etapa 1 - Medula 250g: Cronograma Capilar Fashion Gold",
      oQueE: "ETAPA 1: MEDULA . A Medula é a camada central do cabelo que dá sustentação à estrutura do fio.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-150618.jpg",
      affiliateUrl: "https://www.ybera.com/produto/etapa-1-medula-250g-cronograma-capilar-fashion-gold-150618",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      destaque: false
    },
    {
      nome: "Etapa 2 - Córtex 250g: Cronograma Capilar Fashion Gold",
      oQueE: "ETAPA 2: CÓRTEX O Córtex é a segunda e principal camada do fio de cabelo.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-150617.jpg",
      affiliateUrl: "https://www.ybera.com/produto/etapa-2-cortex-250g-cronograma-capilar-fashion-gold-150617",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      destaque: false
    },
    {
      nome: "Etapa 3 - Cutícula 250g: Cronograma Capilar Fashion Gold",
      oQueE: "ETAPA 3: CUTÍCULA A Cutícula é a parte externa do fio, formada por escamas sobrepostas que juntas dão uma proteção para o fio.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-150616.jpg",
      affiliateUrl: "https://www.ybera.com/produto/etapa-3-cuticula-250g-cronograma-capilar-fashion-gold-150616",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      destaque: false
    },
    {
      nome: "Kit Cronograma Liso Perfeito + Escova Progressiva 300g + Shampoo Pós-Progressiva 300ml + Máscara 2 em 1 250g",
      oQueE: "Kit de Máscaras Cronograma Capilar Liso Perfeito . Revele a beleza de um liso disciplinado, alinhado e livre de frizz.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151608.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cronograma-liso-perfeito-escova-progressiva-300g-shampoo-pos-progressiva-300ml-mascara-2-em-1-250g-ybera-fashion-gold-151608",
      precoAntigo: "R$ 734,90",
      preco: "R$ 698,16",
      destaque: false
    },
    {
      nome: "Kit Cronograma Liso Perfeito + Shampoo Pós-Progressiva 500ml",
      oQueE: "Kit de Máscaras Cronograma Capilar Liso Perfeito. Revele a beleza de um liso disciplinado, alinhado e livre de frizz.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151606.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cronograma-liso-perfeito-shampoo-pos-progressiva-500ml-ybera-fashion-gold-151606",
      precoAntigo: "R$ 387,90",
      preco: "R$ 368,51",
      destaque: false
    },
    {
      nome: "Kit Cuidados Profundos - Máscara Reconstrução 250g + Máscara Nutrição 250g + Máscara Hidratação 250g",
      oQueE: "O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151548.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cuidados-profundos-mascara-reconstrucao-250g-mascara-nutricao-250g-mascara-hidratacao-250g-ybera-fashion-gold-151548",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Kit Liso Perfeito + Shampoo Liso Perfeito 500ml - Fashion Gold",
      oQueE: "Revele a beleza de um liso disciplinado, alinhado, hidratado e livre de frizz com o cuidado completo da Ybera Fashion Gold.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151303.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-liso-perfeito-shampoo-liso-perfeito-500ml-fashion-gold-151303",
      precoAntigo: "R$ 387,90",
      preco: "R$ 368,51",
      destaque: false
    },
    {
      nome: "Kit Liso Perfeito Shampoo 500ml + Top Coat 150ml",
      oQueE: "Shampoo Alinhador 500ml + Top Coat 150ml . Limpeza equilibrante + blindagem térmica para um liso disciplinado, alinhado e protegido todos os dias.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151409.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-liso-perfeito-shampoo-500ml-top-coat-150ml-ybera-fashion-gold-151409",
      precoAntigo: "R$ 207,80",
      preco: "R$ 197,41",
      destaque: false
    },
    {
      nome: "Máscara Hidratação Cuidados Profundos 250g",
      oQueE: "Indicada para cabelos ressecados, ásperos e opacos, a Máscara Hidratação Prolongada devolve a umidade essencial aos fios, restaurando maciez, sedosidade e…",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151510.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-hidratacao-cuidados-profundos-250g-ybera-fashion-gold-151510",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Nutrição Cuidados Profundos 250g",
      oQueE: "Ideal para cabelos frágeis, porosos e quebradiços, a Máscara Nutrição Profunda nutre profundamente os fios com lipídios, óleos naturais e vitaminas.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151509.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-nutricao-cuidados-profundos-250g-ybera-fashion-gold-151509",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Reconstrução Cuidados Profundos 250g",
      oQueE: "A Máscara Reconstrução Intensiva é indicada para fios frágeis, quebradiços e danificados por químicas, calor ou agressões externas.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151508.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-reconstrucao-cuidados-profundos-250g-ybera-fashion-gold-151508",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Alinhador Liso Perfeito 500ml",
      oQueE: "Shampoo Alinhador 500ml . Limpeza inteligente que trata, equilibra e disciplina os fios desde a primeira lavagem.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151306.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-alinhador-liso-perfeito-500ml-ybera-fashion-gold-151306",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Top Coat Liso Perfeito 150ml",
      oQueE: "Top Coat Liso Blindado 150ml . Blindagem inteligente para um liso protegido, alinhado e livre de frizz por muito mais tempo.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151304.jpg",
      affiliateUrl: "https://www.ybera.com/produto/top-coat-liso-perfeito-150ml-ybera-fashion-gold-151304",
      precoAntigo: "R$ 99,90",
      preco: "R$ 94,91",
      destaque: false
    },
    {
      nome: "Kit Detox Purificante - Shampoo 250ml + Máscara 200g",
      oQueE: "Purificação profunda, frescor e cabelos mais leves e saudáveis.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151117.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-detox-purificante-shampoo-250ml-mascara-200g-ybera-151117",
      precoAntigo: "R$ 254,90",
      preco: "R$ 242,16",
      destaque: false
    },
    {
      nome: "Kit Leave-in Universal 250g + Óleo de Mirra Reparador 90ml Refil",
      oQueE: "Kit Óleo de Mirra + Leave-in Universal . Tenha cabelos nutridos, protegidos e com brilho incrível todos os dias.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151040.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-leave-in-universal-250g-oleo-de-mirra-reparador-90ml-refil-ybera-151040",
      precoAntigo: "R$ 311,90",
      preco: "R$ 296,31",
      destaque: false
    },
    {
      nome: "Máscara Detox Purificante 200g",
      oQueE: "Descubra a nova geração de purificação capilar com a Máscara Purificante PuriOxy® da Ybera.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151160.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-detox-purificante-200g-ybera-151160",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      destaque: false
    },
    {
      nome: "Máscara Toda de Coco 1kg",
      oQueE: "A Máscara Toda de Coco oferece extrema hidratação para cabelos com fios grossos e extremamente ressecados.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150334.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-toda-de-coco-1kg-ybera-terra-coco-150334",
      precoAntigo: "R$ 233,90",
      preco: "R$ 222,21",
      destaque: false
    },
    {
      nome: "Óleo de Mirra Reparador Refil 90ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml da Ybera , um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150935.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-de-mirra-reparador-refil-90ml-ybera-150935",
      precoAntigo: "R$ 197,90",
      preco: "R$ 188,01",
      destaque: false
    },
    {
      nome: "Shampoo Detox Purificante 250ml",
      oQueE: "Descubra a nova geração de purificação capilar com o Shampoo Purificante PuriOxy® da Ybera.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151159.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-detox-purificante-250ml-ybera-151159",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Isotônico Sulfato Free 1L",
      oQueE: "O Shampoo Isotônico foi especialmente desenvolvido para limpar cabelos extremamente ressecados e fios grossos.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150346.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-isotonico-sulfato-free-1l-ybera-terra-coco-150346",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      destaque: false
    },
    {
      nome: "Combo Discovery Stemcell 1Kg",
      oQueE: "Sistema com células-tronco suíças que promove renovação celular profunda, devolvendo densidade, saúde e vitalidade aos cabelos danificados e envelhecidos.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150968.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-discovery-stemcell-1kg-ybera-paris-150968",
      precoAntigo: "R$ 595,90",
      preco: "R$ 566,11",
      destaque: false
    },
    {
      nome: "Combo Profissional Discovery Stemcell 500g",
      oQueE: "Linha bio-stemcell com tecnologia de regeneração celular que revitaliza fios e couro cabeludo, criando cabelos mais densos e saudáveis com proteção…",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151025.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-profissional-discovery-stemcell-500g-ybera-paris-151025",
      precoAntigo: "R$ 407,90",
      preco: "R$ 387,51",
      destaque: false
    },
    {
      nome: "Fio Líquido Pro-Geno Genoma 500ml",
      oQueE: "Se você se deparou com um cabelo já passou por tantas químicas e danos que parece sem solução, quebrando facilmente, sem brilho e sem vida, é porque ele…",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150942.jpg",
      affiliateUrl: "https://www.ybera.com/produto/fio-liquido-pro-geno-genoma-500ml-ybera-150942",
      precoAntigo: "R$ 407,90",
      preco: "R$ 387,51",
      destaque: false
    },
    {
      nome: "Kit Botulínica - Shampoo Anti Age Biotox 250ml + Reconstrutor 500g",
      oQueE: "A dupla completa para reverter os sinais do tempo nos fios.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151622.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-botulinica-shampoo-anti-age-biotox-250ml-reconstrutor-500g-ybera-151622",
      precoAntigo: "R$ 259,80",
      preco: "R$ 246,81",
      destaque: false
    },
    {
      nome: "Kit Pro-Geno Genoma - Shampoo 500ml + Máscara 500g",
      oQueE: "Shampoo e máscara que reconstroem a fibra capilar de dentro para fora.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151205.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-pro-geno-genoma-shampoo-500ml-mascara-500g-ybera-151205",
      precoAntigo: "R$ 357,90",
      preco: "R$ 340,01",
      destaque: false
    },
    {
      nome: "Máscara Pro-Geno Genoma 500g",
      oQueE: "Você olha no espelho e percebe que seu cabelo perdeu completamente a vitalidade?",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150943.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-pro-geno-genoma-500g-ybera-150943",
      precoAntigo: "R$ 237,90",
      preco: "R$ 226,01",
      destaque: false
    },
    {
      nome: "MemóriFios Stemcell Discovery 1Kg",
      oQueE: "Máscara profissional com tecnologia Stemcell para reativação da fibra.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151578.jpg",
      affiliateUrl: "https://www.ybera.com/produto/memorifios-stemcell-discovery-1kg-ybera-151578",
      precoAntigo: "R$ 397,90",
      preco: "R$ 378,01",
      destaque: false
    },
    {
      nome: "MemóriFios Stemcell Discovery 500g",
      oQueE: "Tecnologia Stemcell com extrato de células-tronco de maçã suíça revitaliza cada fio, recuperando sua condição ideal e ativando a renovação capilar natural.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151052.jpg",
      affiliateUrl: "https://www.ybera.com/produto/memorifios-stemcell-discovery-500g-ybera-paris-151052",
      precoAntigo: "R$ 207,90",
      preco: "R$ 197,51",
      destaque: false
    },
    {
      nome: "Reconstrutor Botulínica Inteligente BioTox 1Kg",
      oQueE: "Reposição inteligente de massa proteica que elimina porosidade e restaura flexibilidade.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151355.jpg",
      affiliateUrl: "https://www.ybera.com/produto/reconstrutor-botulinica-inteligente-biotox-1kg-ybera-151355",
      precoAntigo: "R$ 377,90",
      preco: "R$ 359,01",
      destaque: false
    },
    {
      nome: "Reconstrutor Botulínica Inteligente BioTox 200g",
      oQueE: "Tratamento avançado para revitalizar cabelos danificados e envelhecidos, com fórmula de baixo peso molecular enriquecida com ativos botulínicos.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151620.jpg",
      affiliateUrl: "https://www.ybera.com/produto/reconstrutor-botulinica-inteligente-biotox-200g-ybera-151620",
      precoAntigo: "R$ 139,90",
      preco: "R$ 132,91",
      destaque: false
    },
    {
      nome: "Reconstrutor Botulínica Inteligente BioTox 500g",
      oQueE: "Sistema inovador de reposição proteica que preenche a porosidade dos fios danificados.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151555.jpg",
      affiliateUrl: "https://www.ybera.com/produto/reconstrutor-botulinica-inteligente-biotox-500g-ybera-151555",
      precoAntigo: "R$ 207,90",
      preco: "R$ 197,51",
      destaque: false
    },
    {
      nome: "Reconstrutor Exo CromaTech Quarta Camada 200g",
      oQueE: "O Reconstrutor Exo Cromatech® é um tratamento intensivo que nutre profundamente os fios e prepara a fibra capilar para a formação da quarta camada protetora.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151077.jpg",
      affiliateUrl: "https://www.ybera.com/produto/reconstrutor-exo-cromatech-quarta-camada-200g-ybera-paris-151077",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Selador Pro-Geno Genoma 500g",
      oQueE: "Você trata seus cabelos, hidrata, faz reconstruções, mas sente que os fios continuam porosos e frágeis?",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150944.jpg",
      affiliateUrl: "https://www.ybera.com/produto/selador-pro-geno-genoma-500g-ybera-150944",
      precoAntigo: "R$ 197,90",
      preco: "R$ 188,01",
      destaque: false
    },
    {
      nome: "Shampoo + Máscara + Selador Pro-Geno Genoma 500ml/500g",
      oQueE: "Sistema completo de reconstrução capilar: shampoo, máscara e selador.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151206.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-mascara-selador-pro-geno-genoma-500ml-500g-ybera-paris-151206",
      precoAntigo: "R$ 559,90",
      preco: "R$ 531,91",
      destaque: false
    },
    {
      nome: "Shampoo Bio- Stemcell 1L Discovery",
      oQueE: "Shampoo com células-tronco de maçã suíça que limpa suavemente enquanto promove renovação celular intensa, deixando cabelos mais densos, saudáveis e…",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151055.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-bio-stemcell-1l-discovery-ybera-paris-151055",
      precoAntigo: "R$ 219,90",
      preco: "R$ 208,91",
      destaque: false
    },
    {
      nome: "Shampoo Bio- Stemcell Discovery 500ml",
      oQueE: "Shampoo com células-tronco de maçã suíça que limpa e promove renovação celular dos fios.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151054.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-bio-stemcell-discovery-500ml-ybera-paris-151054",
      precoAntigo: "R$ 137,90",
      preco: "R$ 131,01",
      destaque: false
    },
    {
      nome: "Shampoo Botulínica Anti Age Biotox 250ml",
      oQueE: "Formulado para combater o envelhecimento dos fios, o Shampoo Anti-Age BIOTOX® combina peptídeos botulínicos e vitamina E encapsulada em microesferas.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151621.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-botulinica-anti-age-biotox-250ml-ybera-151621",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Pro-Geno Genoma 250ml",
      oQueE: "Os cabelos danificados perdem sua força e vitalidade dia após dia.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150938.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-pro-geno-genoma-250ml-ybera-150938",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Pro-Geno Genoma 500ml",
      oQueE: "Os cabelos danificados perdem sua força e vitalidade dia após dia.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150945.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-pro-geno-genoma-500ml-ybera-150945",
      precoAntigo: "R$ 137,90",
      preco: "R$ 131,01",
      destaque: false
    },
    {
      nome: "Spray Fruto Brilhante Stemcell Discovery 150ml",
      oQueE: "Proteção térmica avançada com nutrição intensiva.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151051.jpg",
      affiliateUrl: "https://www.ybera.com/produto/spray-fruto-brilhante-stemcell-discovery-150ml-ybera-paris-151051",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      destaque: false
    },
    {
      nome: "30 Cápsulas 100Tímetros Softgel Cabelo, Pele e Unhas",
      oQueE: "100timetros 30 cápsulas softgel - Cabelo, Pele e Unhas . O 100timetros 30 cápsulas representa o início do ciclo de transformação.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151481.jpg",
      affiliateUrl: "https://www.ybera.com/produto/30-capsulas-100timetros-softgel-cabelo-pele-e-unhas-ybera-fashion-gold-151481",
      precoAntigo: "R$ 99,90",
      preco: "R$ 94,91",
      destaque: false
    },
    {
      nome: "Condicionador Antiqueda 100Tímetros 300g",
      oQueE: "Nutrição, fortalecimento e cuidado diário para cabelos mais saudáveis .",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150306.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-antiqueda-100timetros-300g-ybera-fashion-gold-150306",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Kit Antiqueda 100Tímetros - 2 Tônico Antiqueda 150ml + 90 Cápsulas Softgel",
      oQueE: "O 100timetros foi desenvolvido para respeitar o ciclo natural de crescimento e renovação do organismo, que ocorre em aproximadamente 90 dias.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151624.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-2-tonico-antiqueda-150ml-90-capsulas-softgel-ybera-fashion-gold-151624",
      precoAntigo: "R$ 495,70",
      preco: "R$ 470,92",
      destaque: false
    },
    {
      nome: "Kit Antiqueda 100Tímetros - 30 Cápsulas Softgel + Tônico 150ml",
      oQueE: "100timetros 30 cápsulas softgel - Cabelo, Pele e Unhas . O 100timetros 30 cápsulas representa o início do ciclo de transformação.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151483.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-30-capsulas-softgel-tonico-150ml-ybera-fashion-gold-151483",
      precoAntigo: "R$ 216,90",
      preco: "R$ 206,06",
      destaque: false
    },
    {
      nome: "Kit Antiqueda 100Tímetros - Shampoo 300ml + Condicionador 300g",
      oQueE: "Kit Shampoo e Condicionador Antiqueda 100timetros – Força, Crescimento e Densidade Capilar .",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150703.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-shampoo-300ml-condicionador-300g-ybera-fashion-gold-150703",
      precoAntigo: "R$ 227,90",
      preco: "R$ 216,51",
      destaque: false
    },
    {
      nome: "Kit Antiqueda 100Tímetros - Shampoo 300ml + Condicionador 300g + 30 Cápsulas Softgel",
      oQueE: "Uma rotina completa para cuidar da beleza de dentro para fora.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151623.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-shampoo-300ml-condicionador-300g-30-capsulas-softgel-ybera-fashion-gold-151623",
      precoAntigo: "R$ 334,80",
      preco: "R$ 318,06",
      destaque: false
    },
    {
      nome: "Kit Antiqueda 100Tímetros - Shampoo 300ml + Condicionador 300g + Tônico 150ml + 90 Cápsulas",
      oQueE: "Kit 100Tímetros – Cabelo, Pele e Unhas + Antiqueda . Uma rotina completa para cuidar da beleza de dentro para fora.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151617.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-antiqueda-100timetros-shampoo-300ml-condicionador-300g-tonico-150ml-90-capsulas-ybera-fashion-gold-151617",
      precoAntigo: "R$ 607,60",
      preco: "R$ 549,01",
      destaque: false
    },
    {
      nome: "Kit Shampoo Vello 500ml + Máscara Vello 500g",
      oQueE: "Kit shampoo e máscara Alfa-Lactobaby em formato econômico.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151204.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-shampoo-vello-500ml-mascara-vello-500g-ybera-151204",
      precoAntigo: "R$ 527,90",
      preco: "R$ 501,51",
      destaque: false
    },
    {
      nome: "Kit Vello Alfa-Lactobaby - Shampoo 250ml + Máscara 250g",
      oQueE: "O Shampoo Alfa-Lactobaby® é ideal para estimular o crescimento capilar.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150904.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-vello-alfa-lactobaby-shampoo-250ml-mascara-250g-ybera-150904",
      precoAntigo: "R$ 302,90",
      preco: "R$ 287,76",
      destaque: false
    },
    {
      nome: "Máscara Vello Alfa-Lactobaby 200g",
      oQueE: "Você já percebeu que muitos tratamentos para crescimento capilar ressecam os fios?",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150906.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-vello-alfa-lactobaby-200g-ybera-150906",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      destaque: false
    },
    {
      nome: "Máscara Vello Alfa-Lactobaby 500g",
      oQueE: "Máscara Alfa-Lactobaby oferece hidratação nutricional profunda com proteínas e vitaminas biomimética.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151203.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-vello-alfa-lactobaby-500g-ybera-151203",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Pré Limpeza Vello Alfa-Lactobaby 250ml",
      oQueE: "Se você sente sensibilidade, coceira ou descamação no couro cabeludo, com aquela sensação de cabelos pesados, isso pode ser um sinal de que a raiz do seu…",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150909.jpg",
      affiliateUrl: "https://www.ybera.com/produto/pre-limpeza-vello-alfa-lactobaby-250ml-ybera-150909",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      destaque: false
    },
    {
      nome: "Shampoo Antiqueda 100Tímetros 300ml",
      oQueE: "Limpeza, fortalecimento e cuidado contra a queda capilar .",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150307.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-antiqueda-100timetros-300ml-ybera-fashion-gold-150307",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Vello Alfa-Lactobaby 250ml",
      oQueE: "Não tem nada tão preocupante para uma pessoa do que quando ela passa a mão pelos cabelos e sente os fios caindo com facilidade, ou olhe para o chão da casa…",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150908.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-vello-alfa-lactobaby-250ml-ybera-150908",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      destaque: false
    },
    {
      nome: "Shampoo Vello Alfa-Lactobaby 500ml",
      oQueE: "Shampoo Alfa-Lactobaby estimula crescimento capilar, fortalece folículos e reduz queda.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151202.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-vello-alfa-lactobaby-500ml-ybera-151202",
      precoAntigo: "R$ 237,90",
      preco: "R$ 226,01",
      destaque: false
    },
    {
      nome: "12 Coquetel Selante Potencializador 1Kg - Terra Coco",
      oQueE: "Máscara Educadora Terra Coco reduz o volume e trata naturalmente através dos ácidos do coco.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151603.jpg",
      affiliateUrl: "https://www.ybera.com/produto/12-coquetel-selante-potencializador-1kg-terra-coco-151603",
      precoAntigo: "R$ 4.780,80",
      preco: "R$ 4.541,76",
      destaque: false
    },
    {
      nome: "3 Coquetel Selante Potencializador 1Kg - Terra Coco",
      oQueE: "Máscara Educadora Terra Coco reduz o volume e trata naturalmente através dos ácidos do coco.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151601.jpg",
      affiliateUrl: "https://www.ybera.com/produto/3-coquetel-selante-potencializador-1kg-terra-coco-151601",
      precoAntigo: "R$ 1.019,70",
      preco: "R$ 968,72",
      destaque: false
    },
    {
      nome: "6 Coquetel Selante Potencializador 1Kg - Terra Coco",
      oQueE: "Máscara Educadora Terra Coco reduz o volume e trata naturalmente através dos ácidos do coco.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151604.jpg",
      affiliateUrl: "https://www.ybera.com/produto/6-coquetel-selante-potencializador-1kg-terra-coco-151604",
      precoAntigo: "R$ 1.355,40",
      preco: "R$ 1.287,63",
      destaque: false
    },
    {
      nome: "Base Emoliente 500g - Black Diva",
      oQueE: "Base emoliente profissional para suavização e proteção capilar. Prepara e protege a fibra em tratamentos técnicos de alto desempenho.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150606.jpg",
      affiliateUrl: "https://www.ybera.com/produto/base-emoliente-500g-black-diva-150606",
      precoAntigo: "R$ 268,90",
      preco: "R$ 255,46",
      destaque: false
    },
    {
      nome: "Combo Premium Cachos Perfeitos",
      oQueE: "O Kit Ybera Fashion Gold Cacho Perfeito foi desenvolvido especialmente para cuidar de todas as curvaturas — de 2A a 4C — , oferecendo nutrição inteligente,…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151322.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-premium-cachos-perfeitos-ybera-fashion-gold-151322",
      precoAntigo: "R$ 815,60",
      preco: "R$ 774,82",
      destaque: false
    },
    {
      nome: "Cronograma Capilar Cacho Perfeito",
      oQueE: "Kit Cacho Perfeito – Ybera Fashion Gold Cronograma Capilar completo para cachos saudáveis, definidos e livres de frizz .",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151324.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-cacho-perfeito-ybera-fashion-gold-151324",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Kit 1 Coquetel Selante Potencializador 1Kg + 1 Shampoo Isotônico 1L - Terra Coco",
      oQueE: "Shampoo Isotônico . Shampoo Isotônico Sulfato Free é desenvolvido para cabelos extremamente ressecados e grossos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151602.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-1-coquetel-selante-potencializador-1kg-1-shampoo-isotonico-1l-terra-coco-151602",
      precoAntigo: "R$ 489,80",
      preco: "R$ 465,31",
      destaque: false
    },
    {
      nome: "Kit Cacho Perfeito - Máscara Antifrizz 250g + Máscara Força e Antiquebra 250g + Máscara Maciez Intensa 250g",
      oQueE: "Kit Cacho Perfeito – Ybera Fashion Gold. Cronograma Capilar completo para cachos saudáveis, definidos e livres de frizz.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151549.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cacho-perfeito-mascara-antifrizz-250g-mascara-forca-e-antiquebra-250g-mascara-maciez-intensa-250g-ybera-fashion-gold-151549",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Kit Relaxamento Ácido - Black Diva",
      oQueE: "Kit Relaxamento Ácido. Líquido Ativador Propiônico . Especialmente formulado para ser usado com o creme emoliente Black Diva.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150612.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-relaxamento-acido-black-diva-150612",
      precoAntigo: "R$ 665,80",
      preco: "R$ 632,51",
      destaque: false
    },
    {
      nome: "Leave-in Cacho Perfeito 300ml",
      oQueE: "O Leave-In Nutre e Leve da linha Cacho Perfeito Ybera foi desenvolvido especialmente para cabelos ondulados e cacheados (curvaturas de 2A a 4C) que precisam…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151328.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-cacho-perfeito-300ml-ybera-fashion-gold-151328",
      precoAntigo: "R$ 129,90",
      preco: "R$ 123,41",
      destaque: false
    },
    {
      nome: "Leite de Coco Contra Frizz 300 ml - Terra Coco",
      oQueE: "O Leite de Coco Redutor de Frizz é um finalizador sem enxágue, ideal para uso pré e pós-química.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150384.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leite-de-coco-contra-frizz-300-ml-terra-coco-150384",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Líquido Ativador Propiônico 500ml - Black Diva",
      oQueE: "Líquido Ativador Propiônico . Especialmente formulado para ser usado com o creme emoliente Black Diva.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150605.jpg",
      affiliateUrl: "https://www.ybera.com/produto/liquido-ativador-propionico-500ml-black-diva-150605",
      precoAntigo: "R$ 329,90",
      preco: "R$ 313,41",
      destaque: false
    },
    {
      nome: "Máscara Educadora 1Kg - Terra Coco",
      oQueE: "Escova Progressiva com óleo e ácidos isolados de coco que reduz o volume e elimina o frizz de forma natural, sem danificar a fibra capilar, proporcionando…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150601.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-educadora-1kg-terra-coco-150601",
      precoAntigo: "R$ 339,90",
      preco: "R$ 322,91",
      destaque: false
    },
    {
      nome: "Máscara Hidratação Maciez Intensa Cacho Perfeito 250g",
      oQueE: "Máscaras Cacho Perfeito 250g - Ybera Fashion Gold A Máscara Maciez Intensa do Cronograma Capilar Cacho Perfeito elimina o ressecamento típico dos cabelos…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151512.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-hidratacao-maciez-intensa-cacho-perfeito-250g-ybera-fashion-gold-151512",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Nutrição Antifrizz Cacho Perfeito 250g",
      oQueE: "A Máscara Antifrizz do Cronograma Capilar Cacho Perfeito nutre, fortalece os fios e alinha as cutículas, formando uma barreira que retém a hidratação e…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151514.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-nutricao-antifrizz-cacho-perfeito-250g-ybera-fashion-gold-151514",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Reconstrução Força e Antiquebra Cacho Perfeito 250g",
      oQueE: "A Máscara Força & Antiquebra do Cronograma Capilar Cacho Perfeito fortalece os fios frágeis e previne a quebra.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151513.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-reconstrucao-forca-e-antiquebra-cacho-perfeito-250g-ybera-fashion-gold-151513",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Óleo Reparador Nutre Cacho Perfeito 150ml",
      oQueE: "O Óleo Reparador Cacho Perfeito Ybera Fashion Gold foi desenvolvido para nutrir profundamente os cabelos cacheados, eliminando o frizz e realçando o brilho…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151325.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-reparador-nutre-cacho-perfeito-150ml-ybera-fashion-gold-151325",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      destaque: false
    },
    {
      nome: "Shampoo Curvaturas Cacho Perfeito 500ml",
      oQueE: "O Shampoo Curvaturas Cacho Perfeito Ybera Fashion Gold foi desenvolvido especialmente para cabelos ondulados, cacheados e crespos que precisam de uma…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151327.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-curvaturas-cacho-perfeito-500ml-ybera-fashion-gold-151327",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Kit Loiro Perfeito - Máscara Estrutural 250g + Máscara Equilíbrio 250g + Máscara Lavanda 250g",
      oQueE: "Kit de Máscaras Cronograma Capilar Loiro Perfeito Revele a beleza de um loiro iluminado, saudável e sofisticado.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151551.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-loiro-perfeito-mascara-estrutural-250g-mascara-equilibrio-250g-mascara-lavanda-250g-ybera-fashion-gold-151551",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: false
    },
    {
      nome: "Leave-in Loiro Perfeito 150ml",
      oQueE: "O Leave-in SOS Loiro Polido Ybera Fashion Gold é o finalizador essencial para fios loiros protegidos e brilhantes.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151298.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-loiro-perfeito-150ml-ybera-fashion-gold-151298",
      precoAntigo: "R$ 99,90",
      preco: "R$ 94,91",
      destaque: false
    },
    {
      nome: "Máscara Hidratação Equilíbrio Loiro Perfeito 250g",
      oQueE: "A Máscara Equilíbrio do Cronograma Capilar Loiro Perfeito é o tratamento ideal para acidificar, reequilibrar o pH da fibra capilar e corrigir a porosidade.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151519.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-hidratacao-equilibrio-loiro-perfeito-250g-ybera-fashion-gold-151519",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Nutrição Lavanda Loiro Perfeito 250g",
      oQueE: "A Máscara Loiro Lavanda do Cronograma Capilar Loiro Perfeito corrige o tom amarelado dos fios loiros e descoloridos, combate a oxidação e restaura o brilho…",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151518.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-nutricao-lavanda-loiro-perfeito-250g-ybera-fashion-gold-151518",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Máscara Reconstrução Estrutural 250g Loiro Perfeito",
      oQueE: "A Máscara Estrutural do Cronograma Capilar Loiro Perfeito reconstrói a fibra capilar, fortalece o loiro fragilizado e devolve elasticidade e resistência dos…",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151520.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-reconstrucao-estrutural-250g-loiro-perfeito-ybera-fashion-gold-151520",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Luminoso Loiro Perfeito 500ml",
      oQueE: "O Shampoo Luminoso promove uma limpeza profunda sem agredir.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151297.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-luminoso-loiro-perfeito-500ml-ybera-fashion-gold-151297",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Elixir de Coco 60ml",
      oQueE: "Elixir de Coco 60ml - Terra Coco . Reúne os 2 campeões de hidratação e cuidado capilar em um só produto.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-151091.jpg",
      affiliateUrl: "https://www.ybera.com/produto/elixir-de-coco-60ml-ybera-terra-coco-151091",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Finalizador Exo CromaTech Quarta Camada 150ml",
      oQueE: "O Finalizador Exo Cromatech® é essencial para criar uma quarta camada de proteção nos fios, ajudando a manter a saúde do cabelo e prolongar tratamentos como…",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-151076.jpg",
      affiliateUrl: "https://www.ybera.com/produto/finalizador-exo-cromatech-quarta-camada-150ml-ybera-paris-151076",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      destaque: false
    },
    {
      nome: "Leave-in Universal 250g",
      oQueE: "Seu cabelo merece muito mais do que um simples finalizador.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150953.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-universal-250g-ybera-150953",
      precoAntigo: "R$ 129,90",
      preco: "R$ 123,41",
      destaque: false
    },
    {
      nome: "Membrana Termoprotetora TRH Biotech Life's Flower 150ml",
      oQueE: "Cabelos ressecados não precisam ser sinônimo de aparência descuidada. Existe uma forma de restaurar o brilho e a suavidade que seus fios tanto pedem.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150961.jpg",
      affiliateUrl: "https://www.ybera.com/produto/membrana-termoprotetora-trh-biotech-lifes-flower-150ml-ybera-150961",
      precoAntigo: "R$ 209,90",
      preco: "R$ 199,41",
      destaque: false
    },
    {
      nome: "Protetor Térmico Spray Memory150ml - Fashion Gold",
      oQueE: "Spray Memory Protect & Control 150ml . Proteção Térmica Inteligente com Efeito Memória .",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150358.jpg",
      affiliateUrl: "https://www.ybera.com/produto/protetor-termico-spray-memory150ml-fashion-gold-150358",
      precoAntigo: "R$ 219,90",
      preco: "R$ 208,91",
      destaque: false
    },
    {
      nome: "Soro de Coco 500ml",
      oQueE: "O Soro de Coco foi especialmente desenvolvido para cabelos quebradiços.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150356.jpg",
      affiliateUrl: "https://www.ybera.com/produto/soro-de-coco-500ml-ybera-terra-coco-150356",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      destaque: false
    },
    {
      nome: "Spray BB Cream 300ml",
      oQueE: "O Spray BB Cream Day After é o produto perfeito para você que busca revitalizar e realçar a beleza dos seus cabelos entre as lavagens.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150524.jpg",
      affiliateUrl: "https://www.ybera.com/produto/spray-bb-cream-300ml-ybera-capulana-150524",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      destaque: false
    },
    {
      nome: "Summer Proteção Universal 250ml",
      oQueE: "O Summer Protection é um produto especialmente formulado para proteger e cuidar dos cabelos durante o verão , quando os fios estão mais suscetíveis aos…",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-151348.jpg",
      affiliateUrl: "https://www.ybera.com/produto/summer-protecao-universal-250ml-ybera-151348",
      precoAntigo: "R$ 237,90",
      preco: "R$ 226,01",
      destaque: false
    },
    {
      nome: "Thermic Gloss C360 Universal 90ml",
      oQueE: "Se você ama um cabelo sedoso, alinhado e com um brilho de salão, precisa conhecer o C360 Gloss.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150951.jpg",
      affiliateUrl: "https://www.ybera.com/produto/thermic-gloss-c360-universal-90ml-ybera-150951",
      precoAntigo: "R$ 209,90",
      preco: "R$ 199,41",
      destaque: false
    },
    {
      nome: "Condicionador Elixir da Floresta Essência Brasileira 1Kg",
      oQueE: "O Condicionador Elixir da Floresta foi desenvolvido para cabelos frágeis e quebradiços, oferecendo fortalecimento e revitalização.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150915.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-da-floresta-essencia-brasileira-1kg-ybera-paris-150915",
      precoAntigo: "R$ 377,90",
      preco: "R$ 359,01",
      destaque: false
    },
    {
      nome: "Condicionador Elixir do Cerrado Essência Brasileira 1Kg",
      oQueE: "Ter os cabelos mistos pode ser um desafio para o cuidado capilar, já que esse tipo de cabelo tem a caraterística de ter as raízes oleosas que não podem…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150917.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-do-cerrado-essencia-brasileira-1kg-ybera-paris-150917",
      precoAntigo: "R$ 377,90",
      preco: "R$ 359,01",
      destaque: false
    },
    {
      nome: "Condicionador Elixir do Pantanal Essência Brasileira 1Kg",
      oQueE: "O Condicionador Elixir do Pantanal possui uma fórmula minimalista que alinha e prepara os fios para o dia a dia.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150919.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-do-pantanal-essencia-brasileira-1kg-ybera-paris-150919",
      precoAntigo: "R$ 377,90",
      preco: "R$ 359,01",
      destaque: false
    },
    {
      nome: "Kit Cocada Capilar - Shampoo Isotônico 1L + Máscara Toda de Coco 1kg",
      oQueE: "Shampoo Isotônico Shampoo Isotônico Sulfato Free é desenvolvido para cabelos extremamente ressecados e grossos.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150330.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cocada-capilar-shampoo-isotonico-1l-mascara-toda-de-coco-1kg-ybera-terra-coco-150330",
      precoAntigo: "R$ 359,90",
      preco: "R$ 341,91",
      destaque: false
    },
    {
      nome: "Kit Cocada Capilar - Shampoo Isotônico 1L + Máscara Toda de Coco 1kg + Elixir de Coco 60ml",
      oQueE: "Hidratação intensa para cabelos ressecados e sem vida .",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150682.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cocada-capilar-shampoo-isotonico-1l-mascara-toda-de-coco-1kg-elixir-de-coco-60ml-ybera-terra-coco-150682",
      precoAntigo: "R$ 473,90",
      preco: "R$ 450,21",
      destaque: false
    },
    {
      nome: "Kit Essência Brasileira Elixir do Pantanal - Shampoo 1kg + Condicionador 1kg",
      oQueE: "O Shampoo Elixir do Pantanal foi desenvolvido para revitalizar cabelos secos e ressecados, unindo o poder do breu branco, da manteiga de murumuru e do óleo…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150921.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-essencia-brasileira-elixir-do-pantanal-shampoo-1kg-condicionador-1kg-ybera-150921",
      precoAntigo: "R$ 617,80",
      preco: "R$ 586,91",
      destaque: false
    },
    {
      nome: "Máscara 2 em 1 Protect Control 250g",
      oQueE: "A Máscara 2 em 1 Protect & Control Fashion Gold 250g é o tratamento ideal para quem busca hidratação, controle do frizz e manutenção do efeito liso no dia a…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150386.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-2-em-1-protect-control-250g-ybera-fashion-gold-150386",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Máscara 2 em 1 Protect Control 500g",
      oQueE: "Máscara 2 em 1 Protect & Control Fashion Gold 500g . Cuidado pós-progressiva com hidratação, disciplina e brilho.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150387.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-2-em-1-protect-control-500g-ybera-fashion-gold-150387",
      precoAntigo: "R$ 139,90",
      preco: "R$ 132,91",
      destaque: false
    },
    {
      nome: "Mirra Duocare 250g",
      oQueE: "Se você está cansada de lutar contra o ressecamento e a falta de brilho, esse produto é a solução que vai transformar sua rotina de cuidados.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150872.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mirra-duocare-250g-ybera-150872",
      precoAntigo: "R$ 187,90",
      preco: "R$ 178,51",
      destaque: false
    },
    {
      nome: "Pré-Shampoo Protect Poo 300g",
      oQueE: "Protect Poo Pré-Shampoo Fashion Gold 300g . Cuidado preventivo que preserva a saúde dos fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150338.jpg",
      affiliateUrl: "https://www.ybera.com/produto/pre-shampoo-protect-poo-300g-ybera-fashion-gold-150338",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      destaque: false
    },
    {
      nome: "Shampoo Botulínica Anti Age Biotox 1L",
      oQueE: "Peptídeos botulínicos e vitamina E que rejuvenescem e fortalecem profundamente.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151356.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-botulinica-anti-age-biotox-1l-ybera-151356",
      precoAntigo: "R$ 177,90",
      preco: "R$ 169,01",
      destaque: false
    },
    {
      nome: "Shampoo Botulínica Anti Age Biotox 500ml",
      oQueE: "Shampoo anti-age com peptídeos botulínicos e vitamina E que fortalece e rejuvenece cabelos.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151553.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-botulinica-anti-age-biotox-500ml-ybera-151553",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      destaque: false
    },
    {
      nome: "Shampoo Elixir da Floresta Essência Brasileira 1L",
      oQueE: "O Shampoo Elixir da Floresta foi criado para cabelos frágeis e quebradiços, combinando o poder do guaraná, do óleo de açaí e da manteiga de cupuaçu em uma…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150916.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-da-floresta-essencia-brasileira-1l-ybera-paris-150916",
      precoAntigo: "R$ 277,90",
      preco: "R$ 264,01",
      destaque: false
    },
    {
      nome: "Shampoo Elixir do Cerrado Essência Brasileira 1L",
      oQueE: "Cabelos mistos são um desafio diário. Você lava de manhã e, à noite, a raiz já está oleosa.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150918.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-do-cerrado-essencia-brasileira-1l-ybera-paris-150918",
      precoAntigo: "R$ 277,90",
      preco: "R$ 264,01",
      destaque: false
    },
    {
      nome: "Shampoo Elixir do Pantanal Essência Brasileira 1L",
      oQueE: "O Shampoo Elixir do Pantanal foi desenvolvido para revitalizar cabelos secos e ressecados, unindo o poder do breu branco, da manteiga de murumuru e do óleo…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150920.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-do-pantanal-essencia-brasileira-1l-ybera-paris-150920",
      precoAntigo: "R$ 277,90",
      preco: "R$ 264,01",
      destaque: false
    },
    {
      nome: "Shampoo Mirracura 250ml",
      oQueE: "Cicatrização completa para os seus fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150874.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-mirracura-250ml-ybera-150874",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Shampoo Protect Control 300ml",
      oQueE: "Shampoo Protect & Control Fashion Gold 300ml. Proteção pós-progressiva e cuidado diário para fios lisos.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150354.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-protect-control-300ml-ybera-fashion-gold-150354",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Shampoo Protect Control 500ml",
      oQueE: "Shampoo Protect & Control Fashion Gold 500ml . Cuidado diário pós-progressiva para fios alinhados.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150355.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-protect-control-500ml-ybera-fashion-gold-150355",
      precoAntigo: "R$ 127,90",
      preco: "R$ 121,51",
      destaque: false
    },
    {
      nome: "3 Unidades - Kit Kids Menina - Ybera Fashion Kids",
      oQueE: "Kit Kids Menina Ybera Fashion Kids . Cuidado seguro, divertido e completo para os cabelos das crianças .",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151440.jpg",
      affiliateUrl: "https://www.ybera.com/produto/3-unidades-kit-kids-menina-ybera-fashion-kids-151440",
      precoAntigo: "R$ 377,70",
      preco: "R$ 358,82",
      destaque: false
    },
    {
      nome: "6 Unidades - Kit Kids Menina - Ybera Fashion Kids",
      oQueE: "Kit Kids Menina Ybera Fashion Kids . Cuidado seguro, divertido e completo para os cabelos das crianças .",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151439.jpg",
      affiliateUrl: "https://www.ybera.com/produto/6-unidades-kit-kids-menina-ybera-fashion-kids-151439",
      precoAntigo: "R$ 707,40",
      preco: "R$ 672,03",
      destaque: false
    },
    {
      nome: "Combo Premium Kids Menina - Ybera Fashion Kids",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para transformar o cuidado com os cabelos das crianças em um momento divertido, suave e cheio de amor.",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151315.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-premium-kids-menina-ybera-fashion-kids-151315",
      precoAntigo: "R$ 389,90",
      preco: "R$ 370,41",
      destaque: false
    },
    {
      nome: "Cronograma Capilar Kids Menina",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para transformar o cuidado com os cabelos das crianças em um momento divertido, suave e cheio de amor.",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151316.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-kids-menina-ybera-fashion-kids-151316",
      precoAntigo: "R$ 249,90",
      preco: "R$ 237,41",
      destaque: false
    },
    {
      nome: "Kit Kids Menina + Shampoo Brilho 300ml - Ybera Fashion Kids",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para transformar o cuidado com os cabelos das crianças em um momento divertido, suave e cheio de amor.",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151314.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menina-shampoo-brilho-300ml-ybera-fashion-kids-151314",
      precoAntigo: "R$ 313,90",
      preco: "R$ 298,21",
      destaque: false
    },
    {
      nome: "Kit Kids Menino + Kit Kids Menina - Ybera Fashion Kids",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para transformar o cuidado com os cabelos das crianças em um momento divertido, suave e cheio de amor.",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151562.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menino-kit-kids-menina-ybera-fashion-kids-151562",
      precoAntigo: "R$ 499,80",
      preco: "R$ 474,81",
      destaque: false
    },
    {
      nome: "Kit Kids Menino + Kit Máscaras Cuidados Profundos",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para cuidar dos cabelos das crianças com toda a segurança e eficácia que o couro cabeludo infantil…",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151567.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menino-kit-mascaras-cuidados-profundos-ybera-fashion-gold-151567",
      precoAntigo: "R$ 549,80",
      preco: "R$ 522,31",
      destaque: false
    },
    {
      nome: "Kit Kids Menino + Kit Máscaras Liso Perfeito",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para cuidar dos cabelos das crianças com toda a segurança e eficácia que o couro cabeludo infantil…",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151569.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menino-kit-mascaras-liso-perfeito-ybera-fashion-gold-151569",
      precoAntigo: "R$ 549,80",
      preco: "R$ 522,31",
      destaque: false
    },
    {
      nome: "Kit Kids Menino + Kit Máscaras Loiro Perfeito",
      oQueE: "O Kit Fashion Gold Kids foi desenvolvido especialmente para cuidar dos cabelos das crianças com toda a segurança e eficácia que o couro cabeludo infantil…",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151570.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menino-kit-mascaras-loiro-perfeito-ybera-fashion-gold-151570",
      precoAntigo: "R$ 549,80",
      preco: "R$ 522,31",
      destaque: false
    },
    {
      nome: "Leave-in Desembaraçante 150ml",
      oQueE: "O Leave-in Desembaraçante Fashion Gold Kids foi desenvolvido para facilitar o cuidado diário dos cabelos infantis, tornando o momento de pentear muito mais…",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151317.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-desembaracante-150ml-ybera-fashion-kids-151317",
      precoAntigo: "R$ 79,90",
      preco: "R$ 75,91",
      destaque: false
    },
    {
      nome: "Shampoo Brilho 300ml",
      oQueE: "O Shampoo Brilho Fashion Gold Kids transforma o banho das crianças em um momento divertido e de cuidado suave.",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/ybera-151318.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-brilho-300ml-ybera-fashion-kids-151318",
      precoAntigo: "R$ 79,90",
      preco: "R$ 75,91",
      destaque: false
    },
    {
      nome: "Ativo Botulínico BioTox 500g",
      oQueE: "Peptídeos botulínicos injetados no córtex capilar com fonte de calor. Transforma e rejuvenece fios de raiz a ponta em 30 minutos.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151554.jpg",
      affiliateUrl: "https://www.ybera.com/produto/ativo-botulinico-biotox-500g-ybera-151554",
      precoAntigo: "R$ 209,90",
      preco: "R$ 199,41",
      destaque: false
    },
    {
      nome: "Avental",
      oQueE: "Avental preto em microfibra impermeável com bolsos funcionais e alças ajustáveis.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150627.jpg",
      affiliateUrl: "https://www.ybera.com/produto/avental-ybera-paris-150627",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      destaque: false
    },
    {
      nome: "Capa de Corte -Ybera Paris",
      oQueE: "Capa de corte Ybera em microfibra macia e sofisticada.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150538.jpg",
      affiliateUrl: "https://www.ybera.com/produto/capa-de-corte-ybera-paris-150538",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      destaque: false
    },
    {
      nome: "Cumbuca",
      oQueE: "Cumbuca preta personalizada em polipropileno resistente.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150541.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cumbuca-ybera-paris-150541",
      precoAntigo: "R$ 14,90",
      preco: "R$ 14,16",
      destaque: false
    },
    {
      nome: "Kit Botulínico BioTox 500g",
      oQueE: "O Ativo Botulínico BioTox® realiza uma transformação completa dos fios, utilizando fonte de calor para injetar peptídeos botulínicos no córtex capilar,…",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151255.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-botulinico-biotox-500g-ybera-151255",
      precoAntigo: "R$ 535,70",
      preco: "R$ 508,92",
      destaque: false
    },
    {
      nome: "Pincel Profissional Tamanho G",
      oQueE: "Pincel preto personalizado Ybera, desenvolvido em polipropileno de alta resistência.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150629.jpg",
      affiliateUrl: "https://www.ybera.com/produto/pincel-profissional-tamanho-g-ybera-paris-150629",
      precoAntigo: "R$ 14,90",
      preco: "R$ 14,16",
      destaque: false
    },
    {
      nome: "Selante Potencializador Kerafive 22 ® 1 Kg",
      oQueE: "Se você é cabeleireiro e busca uma progressiva que entregue resultado impecável, segurança total e um processo mais rápido, a Kerafive 22 foi feita para…",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150911.jpg",
      affiliateUrl: "https://www.ybera.com/produto/selante-potencializador-kerafive-22-®-1-kg-ybera-paris-150911",
      precoAntigo: "R$ 297,90",
      preco: "R$ 283,01",
      destaque: false
    },
    {
      nome: "Selante Potencializador Kerafive 22 ® 1 Kg",
      oQueE: "Se você é cabeleireiro e busca uma progressiva que entregue resultado impecável, segurança total e um processo mais rápido, a Kerafive 22 foi feita para…",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151572.jpg",
      affiliateUrl: "https://www.ybera.com/produto/selante-potencializador-kerafive-22-®-1-kg-ybera-paris-151572",
      precoAntigo: "R$ 397,90",
      preco: "R$ 378,01",
      destaque: false
    },
    {
      nome: "Creme para Pentear Cacho Perfeito 500g",
      oQueE: "O Creme para Pentear Cachos Curvas Ybera Fashion foi desenvolvido para todas as curvaturas, de 2A a 4C, garantindo definição, leveza e movimento natural aos…",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-151329.jpg",
      affiliateUrl: "https://www.ybera.com/produto/creme-para-pentear-cacho-perfeito-500g-ybera-fashion-gold-151329",
      precoAntigo: "R$ 129,90",
      preco: "R$ 123,41",
      destaque: false
    },
    {
      nome: "Kit Cacho Perfeito Creme de Pentear 500g + Leave-in 300ml + Óleo Reparador 150ml",
      oQueE: "Kit Cacho Perfeito – Definição, Nutrição e Brilho.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-151619.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cacho-perfeito-creme-de-pentear-500g-leave-in-300ml-oleo-reparador-150ml-ybera-fashion-gold-151619",
      precoAntigo: "R$ 429,70",
      preco: "R$ 388,46",
      destaque: false
    },
    {
      nome: "Secador Stylist Essence Air - Fashion Gold",
      oQueE: "Você encontrou a escolha perfeita para não precisar mais gastar horas secando e modelando os cabelos.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150854.jpg",
      affiliateUrl: "https://www.ybera.com/produto/secador-stylist-essence-air-fashion-gold-150854",
      precoAntigo: "R$ 1.397,90",
      preco: "R$ 1.328,01",
      destaque: false
    },
    {
      nome: "Touca Metal Quente Preta",
      oQueE: "Touca luxo preta para hidratação capilar e procedimentos químicos.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150539.jpg",
      affiliateUrl: "https://www.ybera.com/produto/touca-metal-quente-preta-150539",
      precoAntigo: "R$ 37,90",
      preco: "R$ 36,01",
      destaque: false
    },
    {
      nome: "Cronograma Capilar Cuidados Profundos",
      oQueE: "O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151333.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cronograma-capilar-cuidados-profundos-ybera-fashion-gold-151333",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      esgotado: true,
      destaque: true
    },
    {
      nome: "Escova Progressiva 150g + Gloss C360 Universal 90ml",
      oQueE: "Kit essencial com escova progressiva sem formol e gloss universal.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151580.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-150g-gloss-c360-universal-90ml-ybera-paris-151580",
      precoAntigo: "R$ 159,90",
      preco: "R$ 151,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 150g + Leave-in Universal 250g",
      oQueE: "Progressiva Fashion Gold com leave-in nutritivo. Ideal para iniciar o tratamento: alisamento suave, proteção térmica e fácil manutenção.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151584.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-150g-leave-in-universal-250g-ybera-paris-151584",
      precoAntigo: "R$ 229,80",
      preco: "R$ 218,31",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 1Kg + Gloss C360 Universal 90ml",
      oQueE: "Kit progressiva com gloss finalizador para cabelos alinhados, hidratados e com brilho intenso.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151583.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-1kg-gloss-c360-universal-90ml-ybera-paris-151583",
      precoAntigo: "R$ 246,90",
      preco: "R$ 234,56",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 1Kg + Kit Manutenção 500g - Fashion Gold",
      oQueE: "Conquiste fios lisos, alinhados e com brilho intenso por muito mais tempo com o Escova Fashion Gold + Manutenção Protect Control.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151579.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-1kg-kit-manutencao-500g-fashion-gold-151579",
      precoAntigo: "R$ 765,70",
      preco: "R$ 727,42",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 1Kg + Leave-in Universal 250g",
      oQueE: "Kit progressiva máximo com leave-in universal. Tratamento profissional completo para cabelos muito danificados ou resistentes.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151587.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-1kg-leave-in-universal-250g-ybera-paris-151587",
      precoAntigo: "R$ 627,80",
      preco: "R$ 596,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 300g + Gloss C360 Universal 90ml",
      oQueE: "Progressiva sem formol em formato maior com gloss universal. Rendimento estendido para tratamento completo com alisamento e brilho intenso.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151581.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-300g-gloss-c360-universal-90ml-ybera-paris-151581",
      precoAntigo: "R$ 246,90",
      preco: "R$ 234,56",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 300g + Leave-in Universal 250g",
      oQueE: "Progressiva de média cobertura associada a leave-in protetor. Para cabelos com resistência moderada e frizz desafiador.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151585.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-300g-leave-in-universal-250g-ybera-paris-151585",
      precoAntigo: "R$ 387,80",
      preco: "R$ 368,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 500g + Gloss C360 Universal 90ml",
      oQueE: "Kit profissional com escova progressiva formato econômico e gloss universal.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151582.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-500g-gloss-c360-universal-90ml-ybera-paris-151582",
      precoAntigo: "R$ 246,90",
      preco: "R$ 234,56",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Escova Progressiva 500g + Leave-in Universal 250g",
      oQueE: "Progressiva concentrada com leave-in para cabelos muito cacheados ou ondulados.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151586.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-500g-leave-in-universal-250g-ybera-paris-151586",
      precoAntigo: "R$ 469,80",
      preco: "R$ 446,31",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Completo Discovery",
      oQueE: "Inspirada na ciência e no poder da natureza, a linha Discovery da Ybera Paris oferece um tratamento inovador que promove disciplina prolongada, ajuste…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151218.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-completo-discovery-ybera-paris-151218",
      precoAntigo: "R$ 559,90",
      preco: "R$ 531,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Discovery Bio Stemcell - Shampoo 250ml + Máscara 200g",
      oQueE: "Dupla regeneradora com células-tronco da maçã. Nutri profunda, fortalecimento e brilho intenso para cabelos revitalizados e resistentes.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151219.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-discovery-bio-stemcell-shampoo-250ml-mascara-200g-ybera-151219",
      precoAntigo: "R$ 229,90",
      preco: "R$ 218,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 150g + Shampoo 300ml + Máscara 250g + Óleo de Mirra 15ml",
      oQueE: "Alisamento Profissional com Cuidado Diário Inteligente .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151523.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-150g-shampoo-300ml-mascara-250g-oleo-de-mirra-15ml-ybera-fashion-gold-151523",
      precoAntigo: "R$ 370,90",
      preco: "R$ 352,36",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 1kg + Shampoo Pós-Progressiva 1L + Máscara 2 em 1 1kg",
      oQueE: "Tratamento Profissional Completo para Alisamento e Manutenção de Alta Performance .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151235.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-1kg-shampoo-pos-progressiva-1l-mascara-2-em-1-1kg-ybera-fashion-gold-151235",
      precoAntigo: "R$ 647,70",
      preco: "R$ 615,32",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 300g + Óleo de Mirra 90ml",
      oQueE: "Você encontrou a solução para alisar os seus cabelos de forma segura, sem precisar se preocupar com o mau odor ou se irá danificar o seu cabelo.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151046.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-300g-oleo-de-mirra-90ml-ybera-fashion-gold-151046",
      precoAntigo: "R$ 499,90",
      preco: "R$ 474,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 500g + Óleo de Mirra 90ml",
      oQueE: "Você encontrou a solução para alisar os seus cabelos de forma segura, sem precisar se preocupar com o mau odor ou se irá danificar o seu cabelo.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151047.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-500g-oleo-de-mirra-90ml-ybera-fashion-gold-151047",
      precoAntigo: "R$ 577,90",
      preco: "R$ 549,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escova Progressiva 500g + Shampoo Pós-Progressiva 500ml + Máscara 2 em 1 500g + Protect Poo 500g",
      oQueE: "Escova Progressiva Fashion Gold 500g Você encontrou a solução para alisar os seus cabelos de forma segura, sem precisar se preocupar com o mau odor ou se…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150318.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escova-progressiva-500g-shampoo-pos-progressiva-500ml-mascara-2-em-1-500g-protect-poo-500g-ybera-fashion-gold-150318",
      precoAntigo: "R$ 717,90",
      preco: "R$ 682,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Manutenção Completa Pós-Progressiva - Pré-Shampoo 500ml + Shampoo 500ml + Máscara 2 em 1 500g",
      oQueE: "Se você alisa os seus cabelos, você precisa escolher produtos que mantém o seu liso perfeito e alinhado por um tempo até duas vezes maior.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-150328.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-completa-pos-progressiva-pre-shampoo-500ml-shampoo-500ml-mascara-2-em-1-500g-ybera-fashion-gold-150328",
      precoAntigo: "R$ 394,90",
      preco: "R$ 375,16",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Manutenção Pós-Progressiva 1Kg - Fashion Gold",
      oQueE: "Tratamento Intensivo para Manter o Liso Perfeito por Muito Mais Tempo .",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151168.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-pos-progressiva-1kg-fashion-gold-151168",
      precoAntigo: "R$ 439,90",
      preco: "R$ 417,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Máscaras Liso Perfeito + Shampoo Liso Perfeito 500ml",
      oQueE: "Revele a beleza de um liso disciplinado, alinhado, hidratado e livre de frizz com o cuidado completo da Ybera Fashion Gold.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151594.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mascaras-liso-perfeito-shampoo-liso-perfeito-500ml-ybera-fashion-gold-151594",
      precoAntigo: "R$ 444,90",
      preco: "R$ 422,66",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit pH Control - Shampoo 250ml + Máscara 200g",
      oQueE: "Linha Pós-Progressiva Liso que permanece perfeito, do jeito que você merece!",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151220.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-ph-control-shampoo-250ml-mascara-200g-ybera-151220",
      precoAntigo: "R$ 233,90",
      preco: "R$ 222,21",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit pH Control - Shampoo 250ml + Máscara 200g + Spray 90ml",
      oQueE: "Linha Pós-Progressiva Liso que permanece perfeito, do jeito que você merece!",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151221.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-ph-control-shampoo-250ml-mascara-200g-spray-90ml-ybera-151221",
      precoAntigo: "R$ 345,90",
      preco: "R$ 328,61",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Discovery Bio-Stemcell 200g",
      oQueE: "A Máscara Bio-Stemcell® proporciona regeneração profunda e revitaliza a saúde dos fios da raiz às pontas.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151215.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-discovery-bio-stemcell-200g-ybera-paris-151215",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Discovery Bio-Stemcell 250ml",
      oQueE: "O Shampoo Bio-Stemcell® estabelece um ecossistema saudável para o couro cabeludo ao combater radicais livres.",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151214.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-discovery-bio-stemcell-250ml-ybera-151214",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Pós-Progressiva pH Control 250ml",
      oQueE: "Você saiu do salão com os cabelos impecáveis, alinhados e com um brilho irresistível, mas sabe que, sem os cuidados certos, esse efeito pode durar bem menos…",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151212.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-pos-progressiva-ph-control-250ml-ybera-151212",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Spray Neutralizador de Odores Pós-Progressiva pH Control 90ml",
      oQueE: "Após a progressiva, é comum se sentir incomodada com o cheiro residual que fica nos fios, não é?",
      categoria: "Progressiva e Liso",
      imagem: "assets/img/produtos/ybera/ybera-151211.jpg",
      affiliateUrl: "https://www.ybera.com/produto/spray-neutralizador-de-odores-pos-progressiva-ph-control-90ml-ybera-151211",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "3 Unidades - Kit Cronograma Capilar Cuidados Profundos - Fashion Gold",
      oQueE: "Kit Cronograma - Cuidados Profundos. O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151438.jpg",
      affiliateUrl: "https://www.ybera.com/produto/3-unidades-kit-cronograma-capilar-cuidados-profundos-fashion-gold-151438",
      precoAntigo: "R$ 437,70",
      preco: "R$ 415,82",
      esgotado: true,
      destaque: false
    },
    {
      nome: "6 Unidades - Kit Cronograma Capilar Cuidados Profundos - Fashion Gold",
      oQueE: "Kit Cronograma - Cuidados Profundos. O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151437.jpg",
      affiliateUrl: "https://www.ybera.com/produto/6-unidades-kit-cronograma-capilar-cuidados-profundos-fashion-gold-151437",
      precoAntigo: "R$ 815,40",
      preco: "R$ 774,63",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Cuidados Profundos + Shampoo 500ml Cuidados Profundos",
      oQueE: "O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151341.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cuidados-profundos-shampoo-500ml-cuidados-profundos-ybera-fashion-gold-151341",
      precoAntigo: "R$ 379,90",
      preco: "R$ 360,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Máscaras Cuidados Profundos + Shampoo 500ml Cuidados Profundos",
      oQueE: "O Kit Ybera Fashion Gold Cuidados Profundos é a revolução completa do cronograma capilar em um só conjunto.",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151600.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mascaras-cuidados-profundos-shampoo-500ml-cuidados-profundos-ybera-fashion-gold-151600",
      precoAntigo: "R$ 444,90",
      preco: "R$ 422,66",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Multifunção Cuidados Profundos 300ml",
      oQueE: "O Shampoo Multifunção Cuidados Profundos 300ml é a versão compacta da linha que revolucionou o tratamento capilar, perfeita para quem busca resultado…",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151336.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-multifuncao-cuidados-profundos-300ml-ybera-fashion-gold-151336",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Multifunção Cuidados Profundos 500ml",
      oQueE: "O Shampoo Multifunção Cuidados Profundos é o primeiro passo para um ritual completo de reconstrução, nutrição e hidratação dos fios .",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/ybera-151335.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-multifuncao-cuidados-profundos-500ml-ybera-fashion-gold-151335",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "12 Unidades - Óleo De Mirra Reparador 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml da Ybera, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151545.jpg",
      affiliateUrl: "https://www.ybera.com/produto/12-unidades-oleo-de-mirra-reparador-15ml-ybera-paris-151545",
      precoAntigo: "R$ 958,80",
      preco: "R$ 910,86",
      esgotado: true,
      destaque: false
    },
    {
      nome: "6 Unidades - Óleo De Mirra Reparador 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml da Ybera Paris, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151448.jpg",
      affiliateUrl: "https://www.ybera.com/produto/6-unidades-oleo-de-mirra-reparador-15ml-ybera-paris-151448",
      precoAntigo: "R$ 234,00",
      preco: "R$ 222,30",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Linha Completa Life's Flower",
      oQueE: "Cabelos que são muito ressecados costumam ter a aparência de mal cuidados e que pedem por uma tesoura urgentemente.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150965.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-linha-completa-lifes-flower-ybera-paris-150965",
      precoAntigo: "R$ 784,90",
      preco: "R$ 745,66",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Creme de Cetim 150g - Fashion Gold",
      oQueE: "Creme de Cetim 3 em 1 150ml – Ybera Fashion Gold . Umectação profunda, nutrição revitalizante e reparação intensa enquanto você dorme.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150459.jpg",
      affiliateUrl: "https://www.ybera.com/produto/creme-de-cetim-150g-fashion-gold-150459",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Leave-in Universal 250g + Óleo de Mirra Reparador 60ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 60ml da Ybera Paris, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151036.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-leave-in-universal-250g-oleo-de-mirra-reparador-60ml-ybera-151036",
      precoAntigo: "R$ 340,90",
      preco: "R$ 323,86",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Leave-in Universal 250g + Óleo de Mirra Reparador 90ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml da Ybera Paris, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151035.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-leave-in-universal-250g-oleo-de-mirra-reparador-90ml-ybera-151035",
      precoAntigo: "R$ 378,90",
      preco: "R$ 359,96",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Life's Flower - Shampoo 250ml + Máscara 200g",
      oQueE: "Cabelos que são muito ressecados costumam ter a aparência de mal cuidados e que pedem por uma tesoura urgentemente.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150964.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-lifes-flower-shampoo-250ml-mascara-200g-ybera-150964",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Mirra - DuoCare 250g + Óleo de Mirra 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 15ml da Ybera, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151263.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirra-duocare-250g-oleo-de-mirra-15ml-ybera-151263",
      precoAntigo: "R$ 254,90",
      preco: "R$ 242,16",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Mirra - DuoCare 250g + Óleo de Mirra 90ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml da Ybera Paris , um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151186.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirra-duocare-250g-oleo-de-mirra-90ml-ybera-151186",
      precoAntigo: "R$ 433,90",
      preco: "R$ 412,21",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Mirra - Shampoo Mirracura 250ml + Máscara Mirracura 200g + Óleo de Mirra 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml - Ybera Paris Um verdadeiro tesouro para seus cabelos, indicado para todos os tipos de fios.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151264.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirra-shampoo-mirracura-250ml-mascara-mirracura-200g-oleo-de-mirra-15ml-ybera-151264",
      precoAntigo: "R$ 292,90",
      preco: "R$ 278,26",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit MirraCura 250g com Óleo de Mirra 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 15ml - Ybera Paris . Um verdadeiro tesouro para seus cabelos, indicado para todos os tipos de fios.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151261.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirracura-250g-com-oleo-de-mirra-15ml-ybera-paris-151261",
      precoAntigo: "R$ 463,90",
      preco: "R$ 440,71",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit MirraCura com Óleo de Mirra 60ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 60ml - Ybera Paris . Um verdadeiro tesouro para seus cabelos, indicado para todos os tipos de fios.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150879.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirracura-com-oleo-de-mirra-60ml-ybera-paris-150879",
      precoAntigo: "R$ 597,90",
      preco: "R$ 568,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit MirraCura com Óleo de Mirra 90ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 90ml - Ybera Paris . Um verdadeiro tesouro para seus cabelos, indicado para todos os tipos de fios.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150878.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirracura-com-oleo-de-mirra-90ml-ybera-paris-150878",
      precoAntigo: "R$ 606,90",
      preco: "R$ 576,56",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara TRH Biotech Life's Flower 200g",
      oQueE: "Seus fios estão tão ressecados que parecem quebradiços e sem vida?",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150960.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-trh-biotech-lifes-flower-200g-ybera-paris-150960",
      precoAntigo: "R$ 187,90",
      preco: "R$ 178,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Membrana Termoprotetora Trehalose Life's Flower 250ml",
      oQueE: "Treahalose Membrana Protetora .",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150625.jpg",
      affiliateUrl: "https://www.ybera.com/produto/membrana-termoprotetora-trehalose-lifes-flower-250ml-ybera-paris-150625",
      precoAntigo: "R$ 83,90",
      preco: "R$ 79,71",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Óleo Capilar Savana Africana 150ml",
      oQueE: "Óil Savana Africana da Capulana é um verdadeiro achado para exaltar a beleza dos seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150526.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-capilar-savana-africana-150ml-ybera-capulana-150526",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Óleo de Mirra Reparador 15ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 15ml da Ybera, um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-151265.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-de-mirra-reparador-15ml-ybera-151265",
      precoAntigo: "R$ 79,90",
      preco: "R$ 75,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Óleo de Mirra Reparador 60ml",
      oQueE: "Óleo de Mirra Hidratante Milagroso 60ml da Ybera Paris , um verdadeiro tesouro da natureza para seus cabelos!",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150875.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-de-mirra-reparador-60ml-ybera-150875",
      precoAntigo: "R$ 227,90",
      preco: "R$ 216,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Óleo de Mirra Reparador 90ml",
      oQueE: "Óleo de Mirra 90ml . O elixir reparador para cabelos e pele .",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150876.jpg",
      affiliateUrl: "https://www.ybera.com/produto/oleo-de-mirra-reparador-90ml-ybera-150876",
      precoAntigo: "R$ 267,90",
      preco: "R$ 254,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Life's Flower TRH Biotech 250ml",
      oQueE: "Cabelos que são muito ressecados costumam ter a aparência de mal cuidados e que pedem por uma tesoura urgentemente.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150962.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-lifes-flower-trh-biotech-250ml-ybera-150962",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Splendor Oil TRH Biotech Life's Flower 90ml",
      oQueE: "Quando o seu cabelo está ressecado demais, parece que não há produto que resolva o problema.",
      categoria: "Hidratação e Nutrição",
      imagem: "assets/img/produtos/ybera/ybera-150963.jpg",
      affiliateUrl: "https://www.ybera.com/produto/splendor-oil-trh-biotech-lifes-flower-90ml-ybera-150963",
      precoAntigo: "R$ 277,90",
      preco: "R$ 264,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Acidificante Capilar Alfa-Cys Universal 250ml",
      oQueE: "Você sente seu cabelo poroso, com frizz e texturas diferentes entre a raiz e as pontas?",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150952.jpg",
      affiliateUrl: "https://www.ybera.com/produto/acidificante-capilar-alfa-cys-universal-250ml-ybera-paris-150952",
      precoAntigo: "R$ 237,90",
      preco: "R$ 226,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Manutenção Genoma",
      oQueE: "Se o seu cabelo já passou por químicas, uso excessivo de secador e chapinha ou sofre com o desgaste diário, você provavelmente sente que ele está mais…",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150940.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-manutencao-genoma-ybera-paris-150940",
      precoAntigo: "R$ 430,86",
      preco: "R$ 409,32",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Fio Líquido Genoma 500ml",
      oQueE: "Fio líquido Ortho reestruturador - Transfusão para o fio em forma líquida .",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150594.jpg",
      affiliateUrl: "https://www.ybera.com/produto/fio-liquido-genoma-500ml-ybera-paris-150594",
      precoAntigo: "R$ 297,90",
      preco: "R$ 283,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Genoma - Shampoo 250ml + Máscara 200g",
      oQueE: "Cabelos danificados precisam de mais do que uma hidratação comum – eles precisam de um tratamento que realmente devolva a força, a maciez e o brilho…",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150941.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-genoma-shampoo-250ml-mascara-200g-ybera-150941",
      precoAntigo: "R$ 279,90",
      preco: "R$ 265,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Quarta Camada - Shampoo 250ml + Reconstrutor 200g",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração, desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de proteção.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151071.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-quarta-camada-shampoo-250ml-reconstrutor-200g-ybera-151071",
      precoAntigo: "R$ 217,70",
      preco: "R$ 206,82",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Quarta Camada - Shampoo 500ml + Reconstrutor 500g",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração, desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de proteção.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151069.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-quarta-camada-shampoo-500ml-reconstrutor-500g-ybera-151069",
      precoAntigo: "R$ 355,90",
      preco: "R$ 338,11",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Pro-Geno Genoma 200g",
      oQueE: "Você olha no espelho e percebe que seu cabelo perdeu completamente a vitalidade?",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150937.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-pro-geno-genoma-200g-ybera-150937",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Reconstrutor Exo CromaTech Quarta Camada 500g",
      oQueE: "O Reconstrutor Exo Cromatech® é um tratamento intensivo que nutre profundamente os fios e prepara a fibra capilar para a formação da quarta camada protetora.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-151074.jpg",
      affiliateUrl: "https://www.ybera.com/produto/reconstrutor-exo-cromatech-quarta-camada-500g-ybera-paris-151074",
      precoAntigo: "R$ 207,90",
      preco: "R$ 197,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Selador Cuticular Pro-Geno Genoma 250g",
      oQueE: "Você trata seus cabelos, hidrata, faz reconstruções, mas sente que os fios continuam porosos e frágeis?",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150939.jpg",
      affiliateUrl: "https://www.ybera.com/produto/selador-cuticular-pro-geno-genoma-250g-ybera-paris-150939",
      precoAntigo: "R$ 187,90",
      preco: "R$ 178,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Selador Ortho Reconstrutor de Cutículas e Pontas Genoma 500g",
      oQueE: "Selador Orto reconstrutor de cutículas e pontas, a ntiquebra, proteção térmica e disciplinante.",
      categoria: "Reconstrução",
      imagem: "assets/img/produtos/ybera/ybera-150593.jpg",
      affiliateUrl: "https://www.ybera.com/produto/selador-ortho-reconstrutor-de-cuticulas-e-pontas-genoma-500g-ybera-paris-150593",
      precoAntigo: "R$ 129,90",
      preco: "R$ 123,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Colostro Vello Alfa-Lactobaby 250ml",
      oQueE: "Seu cabelo pode estar precisando de um recomeço.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150905.jpg",
      affiliateUrl: "https://www.ybera.com/produto/colostro-vello-alfa-lactobaby-250ml-ybera-paris-150905",
      precoAntigo: "R$ 207,90",
      preco: "R$ 197,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit 30 Cápsulas Antiqueda Capilar + Óleo de Mirra 15ml + Tônico Antiqueda 150ml",
      oQueE: "Uma rotina completa de cuidados para fortalecer e revitalizar os cabelos de dentro para fora.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151618.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-30-capsulas-antiqueda-capilar-oleo-de-mirra-15ml-tonico-antiqueda-150ml-ybera-fashion-gold-151618",
      precoAntigo: "R$ 292,90",
      preco: "R$ 278,26",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Soro Vello 90ml + 30 Cápsulas 100Tímetros Softgel",
      oQueE: "Kit Contra Queda Capilar . Combata a queda dos fios com a combinação perfeita do Soro Vital Alfa-Lactobaby® Vello e do 100timetros 30 Cápsulas.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-151538.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-soro-vello-90ml-30-capsulas-100timetros-softgel-ybera-151538",
      precoAntigo: "R$ 332,90",
      preco: "R$ 316,26",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Vello Alfa-Lactobaby - Shampoo 250ml + Máscara 250g + Soro 90ml",
      oQueE: "O Shampoo Alfa-Lactobaby® é ideal para estimular o crescimento capilar.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150903.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-vello-alfa-lactobaby-shampoo-250ml-mascara-250g-soro-90ml-ybera-150903",
      precoAntigo: "R$ 539,90",
      preco: "R$ 512,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Vello Alfa-Lactobaby - Shampoo 250ml + Máscara 250g + Soro 90ml + Pré Limpeza 250ml + Colostro 250ml",
      oQueE: "O Pré-Limpeza Alfa-Lactobaby® é o primeiro passo da Fertilização Capilar, desenvolvido com uma fórmula biomimética que promove uma microesfoliação suave…",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150902.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-vello-alfa-lactobaby-shampoo-250ml-mascara-250g-soro-90ml-pre-limpeza-250ml-colostro-250ml-ybera-150902",
      precoAntigo: "R$ 869,90",
      preco: "R$ 826,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Soro Vello Alfa-Lactobaby",
      oQueE: "Resolva de uma vez por todas a sua queda capilar e tenha cabelos fortes, brilhantes e sem falhas.",
      categoria: "Antiqueda e Crescimento",
      imagem: "assets/img/produtos/ybera/ybera-150907.jpg",
      affiliateUrl: "https://www.ybera.com/produto/soro-vello-alfa-lactobaby-ybera-150907",
      precoAntigo: "R$ 249,90",
      preco: "R$ 237,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Ativador Harmonizador de Cachos 500g - Capulana",
      oQueE: "Quem tem cabelos cacheados sabe que manter o controle dos fios não é tarefa fácil.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150528.jpg",
      affiliateUrl: "https://www.ybera.com/produto/ativador-harmonizador-de-cachos-500g-capulana-150528",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Finalizadores - Terra Coco",
      oQueE: "Água de Coco Capilar 300 ml - Terra Coco A Água de Coco Capilar é considerado um verdadeiro alimento para os cabelos, pois combate o envelhecimento dos…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150680.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-finalizadores-terra-coco-150680",
      precoAntigo: "R$ 447,90",
      preco: "R$ 425,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Manutenção Coco Verde 300g/200g- Terra Coco",
      oQueE: "Shampoo Coco Verde Sulfato Free 300ml Super hidratante e desenvolvido para cabelos ressecados e sem brilho, tonifica e elimina as células mortas através dos…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150325.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-manutencao-coco-verde-300g-200g-terra-coco-150325",
      precoAntigo: "R$ 289,90",
      preco: "R$ 275,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Shampoo 1L + Máscara 1kg + Elixir de Coco 60ml + Soro de Coco 500ml + Leave-in Vegetal 500ml - Terra Coco",
      oQueE: "Shampoo Isotônico Shampoo Isotônico Sulfato Free é desenvolvido para cabelos extremamente ressecados e grossos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150683.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-shampoo-1l-mascara-1kg-elixir-de-coco-60ml-soro-de-coco-500ml-leave-in-vegetal-500ml-terra-coco-150683",
      precoAntigo: "R$ 709,90",
      preco: "R$ 674,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Shampoo 300ml + Máscara Polpa de Coco Verde 200g + Elixir de Coco 60ml - Terra Coco",
      oQueE: "Shampoo Coco Verde Sulfato Free 300ml Super hidratante e desenvolvido para cabelos ressecados e sem brilho, tonifica e elimina as células mortas através dos…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150687.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-shampoo-300ml-mascara-polpa-de-coco-verde-200g-elixir-de-coco-60ml-terra-coco-150687",
      precoAntigo: "R$ 314,90",
      preco: "R$ 299,16",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Condicionador Coco Verde 300g - Terra Coco",
      oQueE: "O Condicionador Coco Verde é ideal para cabelos secos e ressecados.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150363.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-coco-verde-300g-terra-coco-150363",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "CoWash - Black Diva 500g",
      oQueE: "Co Wash . Esta fórmula promove uma limpeza hidratante que delicadamente preserva a beleza dos cachos e devolve qualidade a fibra.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150604.jpg",
      affiliateUrl: "https://www.ybera.com/produto/cowash-black-diva-500g-150604",
      precoAntigo: "R$ 157,90",
      preco: "R$ 150,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Cacho Perfeito + Shampoo Curvaturas Cacho Perfeito 500ml",
      oQueE: "O Kit Ybera Fashion Gold Cacho Perfeito foi desenvolvido especialmente para cuidar de todas as curvaturas — de 2A a 4C — , oferecendo nutrição inteligente,…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151323.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cacho-perfeito-shampoo-curvaturas-cacho-perfeito-500ml-–-ybera-fashion-gold-151323",
      precoAntigo: "R$ 385,80",
      preco: "R$ 366,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Tratamento Cocada Capilar 1kg - Terra Coco",
      oQueE: "Shampoo Isotônico Sulfato Free Desenvolvido para cabelos extremamente ressecados e grossos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150380.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-tratamento-cocada-capilar-1kg-terra-coco-150380",
      precoAntigo: "R$ 609,90",
      preco: "R$ 579,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Leave-in Vegetal 500ml - Terra Coco",
      oQueE: "O Leave-In Vegetal é um finalizador sem enxágue que sela as cutículas dos fios, mantendo-os hidratados e protegidos contra os raios UVA e UVB, além de…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150383.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-vegetal-500ml-terra-coco-150383",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Leave-in Vegetal 500ml + Elixir de Coco 60ml - Terra Coco",
      oQueE: "Dupla de hidratação com leave-in vegetal e elixir de coco.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150684.jpg",
      affiliateUrl: "https://www.ybera.com/produto/leave-in-vegetal-500ml-elixir-de-coco-60ml-terra-coco-150684",
      precoAntigo: "R$ 279,90",
      preco: "R$ 265,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara 2 em 1 Capulana 1kg",
      oQueE: "Se você tem cabelos crespos, cacheados ou está em transição, você sabe o quanto é desafiador mantê-los saudáveis e bonitos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150536.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-2-em-1-capulana-1kg-150536",
      precoAntigo: "R$ 157,90",
      preco: "R$ 150,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Educadora 500g- Terra Coco",
      oQueE: "Escova Progressiva com óleo e ácidos isolados de coco que reduz o volume e elimina o frizz de forma natural, sem danificar a fibra capilar, proporcionando…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150599.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-educadora-500g-terra-coco-150599",
      precoAntigo: "R$ 159,90",
      preco: "R$ 151,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara polpa de coco 200g - Açai Terra Coco",
      oQueE: "A Máscara Polpa de Coco e Açaí possui uma fórmula super hidratante que suaviza os fios, devolvendo a maciez e o brilho dos cabelos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150547.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-polpa-de-coco-200g-acai-terra-coco-150547",
      precoAntigo: "R$ 62,90",
      preco: "R$ 59,76",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Polpa de Coco Verde 200g - Terra Coco",
      oQueE: "A Máscara Polpa de Coco Verde penetra nas camadas mais profundas do fio, hidrata intensamente e desmaia os cabelos, deixando-os incrivelmente macios,…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150333.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-polpa-de-coco-verde-200g-terra-coco-150333",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Power Mask 500g - Black Diva",
      oQueE: "Power Mask . O primeiro cuidado intensivo para cabelos crespos e cacheados, que preserva o movimento.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150603.jpg",
      affiliateUrl: "https://www.ybera.com/produto/power-mask-500g-black-diva-150603",
      precoAntigo: "R$ 157,90",
      preco: "R$ 150,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Sabão de Coco Líquido Capilar 1L - Terra Coco",
      oQueE: "O Sabão de Coco Líquido Capilar limpa profundamente sem danificar os cabelos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150602.jpg",
      affiliateUrl: "https://www.ybera.com/produto/sabao-de-coco-liquido-capilar-1l-terra-coco-150602",
      precoAntigo: "R$ 92,90",
      preco: "R$ 88,26",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Sabão De Coco Liquido Capilar 500ml - Terra Coco",
      oQueE: "O Sabão de Coco Líquido Capilar limpa profundamente sem danificar os cabelos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150600.jpg",
      affiliateUrl: "https://www.ybera.com/produto/sabao-de-coco-liquido-capilar-500ml-terra-coco-150600",
      precoAntigo: "R$ 62,90",
      preco: "R$ 59,76",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Coco Verde 300ml - Terra Coco",
      oQueE: "O Shampoo Coco Verde limpa delicadamente e hidrata profundamente, proporcionando maciez, brilho aos cabelos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150342.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-coco-verde-300ml-terra-coco-150342",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Coco Verde 300ml + Condicionador Coco Verde 300g - Terra Coco",
      oQueE: "Shampoo Coco Verde Sulfato Free 300ml - Terra Coco . Desenvolvido para cabelos ressecados e sem brilho.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151090.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-coco-verde-300ml-condicionador-coco-verde-300g-terra-coco-151090",
      precoAntigo: "R$ 189,90",
      preco: "R$ 180,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Coco Verde 300ml + Máscara Polpa de Coco Verde 200g - Terra Coco",
      oQueE: "Shampoo Coco Verde Sulfato Free 300ml Super hidratante e desenvolvido para cabelos ressecados e sem brilho, tonifica e elimina as células mortas através dos…",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150689.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-coco-verde-300ml-mascara-polpa-de-coco-verde-200g-terra-coco-150689",
      precoAntigo: "R$ 197,90",
      preco: "R$ 188,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Curvaturas 1l Cacho Perfeito",
      oQueE: "O Shampoo Curvaturas Cacho Perfeito Ybera Fashion Gold 1L oferece limpeza inteligente e tratamento prolongado para cabelos ondulados, cacheados e crespos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-151326.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-curvaturas-1l-cacho-perfeito-ybera-fashion-gold-151326",
      precoAntigo: "R$ 149,90",
      preco: "R$ 142,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo de coco 300ml - Açai Terra Coco",
      oQueE: "O Shampoo de Coco e Açaí é super hidratante, desenvolvido especialmente para cabelos ressecados e sem brilho.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150544.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-de-coco-300ml-acai-terra-coco-150544",
      precoAntigo: "R$ 47,90",
      preco: "R$ 45,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Light Poo 500ml - Black Diva",
      oQueE: "Shampoo Light Poo . Foi especialmente desenvolvido para quem busca uma limpeza suave com pouca espuma.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150543.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-light-poo-500ml-black-diva-150543",
      precoAntigo: "R$ 157,90",
      preco: "R$ 150,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Sublime 500g - Black Diva",
      oQueE: "Sublime . Proporciona uma incrível flexibilidade e textura maleável, definindo os cachos.",
      categoria: "Cachos",
      imagem: "assets/img/produtos/ybera/ybera-150542.jpg",
      affiliateUrl: "https://www.ybera.com/produto/sublime-500g-black-diva-150542",
      precoAntigo: "R$ 139,90",
      preco: "R$ 132,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Purple Alfa-Cys - Shampoo 250ml + Máscara 200g",
      oQueE: "O Shampoo Plex Alfa-Cys® e a Máscara Plex Alfa-Cys® unem tecnologia avançada a ativos hidratantes de alto desempenho para oferecer um cuidado completo aos…",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151080.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-purple-alfa-cys-shampoo-250ml-mascara-200g-ybera-151080",
      precoAntigo: "R$ 255,80",
      preco: "R$ 243,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Matizador Termoativado Color Crystal 90ml",
      oQueE: "Todo cabeleireiro sabe o desafio que é alisar cabelos loiros sem alterar a cor.",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-150912.jpg",
      affiliateUrl: "https://www.ybera.com/produto/matizador-termoativado-color-crystal-90ml-ybera-paris-150912",
      precoAntigo: "R$ 169,90",
      preco: "R$ 161,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Purple Plex Alfa-Cys 250ml",
      oQueE: "O Shampoo Plex Alfa-Cys® une tecnologia avançada a ativos hidratantes de alto desempenho para oferecer um cuidado completo aos cabelos loiros, descoloridos…",
      categoria: "Loiros",
      imagem: "assets/img/produtos/ybera/ybera-151078.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-purple-plex-alfa-cys-250ml-ybera-151078",
      precoAntigo: "R$ 117,90",
      preco: "R$ 112,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Finalizador Exo CromaTech Quarta Camada 500ml",
      oQueE: "O Finalizador Exo Cromatech® é essencial para criar uma quarta camada de proteção nos fios, ajudando a manter a saúde do cabelo e prolongar tratamentos como…",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-151075.jpg",
      affiliateUrl: "https://www.ybera.com/produto/finalizador-exo-cromatech-quarta-camada-500ml-ybera-paris-151075",
      precoAntigo: "R$ 379,90",
      preco: "R$ 360,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Finishing Spray C360 Universal 150ml",
      oQueE: "Se você não abre mão do secador, chapinha ou babyliss, precisa de um protetor térmico poderoso, que realmente proteja seus fios contra o calor extremo.",
      categoria: "Finalizadores e Proteção",
      imagem: "assets/img/produtos/ybera/ybera-150954.jpg",
      affiliateUrl: "https://www.ybera.com/produto/finishing-spray-c360-universal-150ml-ybera-150954",
      precoAntigo: "R$ 197,90",
      preco: "R$ 188,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Água de Coco Capilar 300ml",
      oQueE: "A Água de Coco Capilar é um finalizador versátil, ideal para todos os tipos de cabelo e perfeito para qualquer ocasião, incluindo praia ou piscina.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150310.jpg",
      affiliateUrl: "https://www.ybera.com/produto/agua-de-coco-capilar-300ml-ybera-terra-coco-150310",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Condicionador Elixir da Floresta Essência Brasileira 250ml",
      oQueE: "O Condicionador Elixir da Floresta foi desenvolvido para cabelos frágeis e quebradiços, oferecendo fortalecimento e revitalização.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150932.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-da-floresta-essencia-brasileira-250ml-ybera-paris-150932",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Condicionador Elixir do Cerrado Essência Brasileira 250ml",
      oQueE: "Ter os cabelos mistos pode ser um desafio para o cuidado capilar, já que esse tipo de cabelo tem a caraterística de ter as raízes oleosas que não podem…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150931.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-do-cerrado-essencia-brasileira-250ml-ybera-paris-150931",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Condicionador Elixir do Pantanal Essência Brasileira 250ml",
      oQueE: "O Condicionador Elixir do Pantanal possui uma fórmula minimalista que alinha e prepara os fios para o dia a dia.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150927.jpg",
      affiliateUrl: "https://www.ybera.com/produto/condicionador-elixir-do-pantanal-essencia-brasileira-250ml-ybera-paris-150927",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Cocada Capilar - Shampoo Isotônico 500ml + Máscara Toda de Coco 500g",
      oQueE: "Shampoo Isotônico Sulfato Free 500ml Desenvolvido para cabelos extremamente ressecados e grossos.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150379.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cocada-capilar-shampoo-isotonico-500ml-mascara-toda-de-coco-500g-ybera-terra-coco-150379",
      precoAntigo: "R$ 189,90",
      preco: "R$ 180,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Linha Completa Quarta Camada 250ml/200g",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração, desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de proteção.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151070.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-linha-completa-quarta-camada-250ml-200g-ybera-paris-151070",
      precoAntigo: "R$ 365,90",
      preco: "R$ 347,61",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Linha Completa Quarta Camada 500ml/500g",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração, desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de proteção.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151068.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-linha-completa-quarta-camada-500ml-500g-ybera-paris-151068",
      precoAntigo: "R$ 735,90",
      preco: "R$ 699,11",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Mirra - Shampoo Mirracura 250ml + Máscara Mirracura 200g",
      oQueE: "Cicatrização completa para os seus fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150877.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-mirra-shampoo-mirracura-250ml-mascara-mirracura-200g-ybera-150877",
      precoAntigo: "R$ 208,90",
      preco: "R$ 198,46",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara 2 em 1 Capulana 500g",
      oQueE: "Se você tem cabelos crespos, cacheados ou está em transição, você sabe o quanto é desafiador mantê-los saudáveis e bonitos.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150534.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-2-em-1-capulana-500g-ybera-capulana-150534",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Mirracura 200g",
      oQueE: "Você sabe o que é sair de um cabelo totalmente ressecado, com frizz e poroso, que parece que o cabelo está pedindo socorro, para um cabelo macio e com brilho?",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150873.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-mirracura-200g-ybera-150873",
      precoAntigo: "R$ 119,90",
      preco: "R$ 113,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Máscara Mirracura 500g",
      oQueE: "Você sabe o que é sair de um cabelo totalmente ressecado, com frizz e poroso, que parece que o cabelo está pedindo socorro, para um cabelo macio e com brilho?.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151087.jpg",
      affiliateUrl: "https://www.ybera.com/produto/mascara-mirracura-500g-ybera-151087",
      precoAntigo: "R$ 197,90",
      preco: "R$ 188,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Pré-Shampoo Protect Poo 500g",
      oQueE: "Protect Poo Pré-Shampoo Fashion Gold 500g. Cuidado preventivo que preserva a hidratação dos fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150339.jpg",
      affiliateUrl: "https://www.ybera.com/produto/pre-shampoo-protect-poo-500g-ybera-fashion-gold-150339",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo + Condicionador Elixir da Floresta Essência Brasileira 1Kg",
      oQueE: "O Shampoo Elixir da Floresta foi criado para cabelos frágeis e quebradiços, combinando o poder do guaraná, do óleo de açaí e da manteiga de cupuaçu em uma…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150923.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-condicionador-elixir-da-floresta-essencia-brasileira-1kg-ybera-paris-150923",
      precoAntigo: "R$ 617,80",
      preco: "R$ 586,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo + Condicionador Elixir da Floresta Essência Brasileira 250ml",
      oQueE: "O Shampoo Elixir da Floresta foi criado para cabelos frágeis e quebradiços, combinando o poder do guaraná, do óleo de açaí e da manteiga de cupuaçu em uma…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150926.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-condicionador-elixir-da-floresta-essencia-brasileira-250ml-ybera-paris-150926",
      precoAntigo: "R$ 219,90",
      preco: "R$ 208,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo + Condicionador Elixir do Cerrado Essência Brasileira 1Kg",
      oQueE: "Cabelos mistos sempre parecem estar em desequilíbrio. Raiz oleosa, pontas secas, necessidade de lavagens constantes.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150922.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-condicionador-elixir-do-cerrado-essencia-brasileira-1kg-ybera-paris-150922",
      precoAntigo: "R$ 617,80",
      preco: "R$ 586,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo + Condicionador Elixir do Cerrado Essência Brasileira 250ml",
      oQueE: "Cabelos mistos sempre parecem estar em desequilíbrio. Raiz oleosa, pontas secas, necessidade de lavagens constantes.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150924.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-condicionador-elixir-do-cerrado-essencia-brasileira-250ml-ybera-paris-150924",
      precoAntigo: "R$ 219,90",
      preco: "R$ 208,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo + Condicionador Elixir do Pantanal Essência Brasileira 250ml",
      oQueE: "O Shampoo Elixir do Pantanal foi desenvolvido para revitalizar cabelos secos e ressecados, unindo o poder do breu branco, da manteiga de murumuru e do óleo…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150925.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-condicionador-elixir-do-pantanal-essencia-brasileira-250ml-ybera-paris-150925",
      precoAntigo: "R$ 219,90",
      preco: "R$ 208,91",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Elixir da Floresta Essência Brasileira 250ml",
      oQueE: "O Shampoo Elixir da Floresta foi criado para cabelos frágeis e quebradiços, combinando o poder do guaraná, do óleo de açaí e da manteiga de cupuaçu em uma…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150928.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-da-floresta-essencia-brasileira-250ml-ybera-paris-150928",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Elixir do Cerrado Essência Brasileira 250ml",
      oQueE: "Cabelos mistos são um desafio diário. Você lava de manhã e, à noite, a raiz já está oleosa.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150930.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-do-cerrado-essencia-brasileira-250ml-ybera-paris-150930",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Elixir do Pantanal Essência Brasileira 250ml",
      oQueE: "O Shampoo Elixir do Pantanal foi desenvolvido para revitalizar cabelos secos e ressecados, unindo o poder do breu branco, da manteiga de murumuru e do óleo…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-150929.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-elixir-do-pantanal-essencia-brasileira-250ml-ybera-paris-150929",
      precoAntigo: "R$ 107,90",
      preco: "R$ 102,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Exo CromaTech Quarta Camada 250ml",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração , desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151073.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-exo-cromatech-quarta-camada-250ml-ybera-paris-151073",
      precoAntigo: "R$ 97,90",
      preco: "R$ 93,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Mirracura 500ml",
      oQueE: "Cicatrização completa para os seus fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151086.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-mirracura-500ml-ybera-151086",
      precoAntigo: "R$ 157,90",
      preco: "R$ 150,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Mirracura 500ml + Máscara Mirracura 500g",
      oQueE: "Cicatrização completa para os seus fios.",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151085.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-mirracura-500ml-mascara-mirracura-500g-ybera-151085",
      precoAntigo: "R$ 347,90",
      preco: "R$ 330,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Shampoo Quarta Camada Exo CromaTech 500ml",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração , desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de…",
      categoria: "Dia a Dia",
      imagem: "assets/img/produtos/ybera/ybera-151072.jpg",
      affiliateUrl: "https://www.ybera.com/produto/shampoo-quarta-camada-exo-cromatech-500ml-ybera-151072",
      precoAntigo: "R$ 147,90",
      preco: "R$ 140,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Ativo Botulínico BioTox 1Kg",
      oQueE: "Tratamento revitalizador com peptídeos botulínicos que transforma os fios da raiz às pontas.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151388.jpg",
      affiliateUrl: "https://www.ybera.com/produto/ativo-botulinico-biotox-1kg-ybera-151388",
      precoAntigo: "R$ 397,90",
      preco: "R$ 378,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo 2 Kits Linha Completa Quarta Camada 500ml/500g",
      oQueE: "O Shampoo Exo Cromatech® é um shampoo pós-coloração, desenvolvido para limpar os fios de forma delicada, preparando-os para receber a quarta camada de proteção.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151292.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-2-kits-linha-completa-quarta-camada-500ml-500g-ybera-paris-151292",
      precoAntigo: "R$ 1.471,40",
      preco: "R$ 1.397,83",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Embaixador",
      oQueE: "Combo Embaixador 03 – Linha Profissional.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150701.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-embaixador-150701",
      precoAntigo: "R$ 5.150,20",
      preco: "R$ 4.892,69",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Essência Brasileira 1Kg",
      oQueE: "Informações importantes 1. Produto original da Ybera Paris. 2. Todas as compras serão faturadas com Nota Fiscal.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151224.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-essencia-brasileira-1kg-ybera-paris-151224",
      precoAntigo: "R$ 1.343,40",
      preco: "R$ 1.276,23",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Material de Apoio",
      oQueE: "Informações Importantes: 1) Todos os produtos anunciados são originais.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151182.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-material-de-apoio-151182",
      precoAntigo: "R$ 257,70",
      preco: "R$ 244,82",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Combo Pro",
      oQueE: "Solução profissional completa em tratamentos capilares. Kit com produtos selecionados para cronograma capilar e proteção térmica.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150628.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-pro-150628",
      precoAntigo: "R$ 6.622,90",
      preco: "R$ 6.291,76",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Copo medidor 100ml",
      oQueE: "Medidor graduado 100ml com alça, fabricado em polipropileno resistente.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150549.jpg",
      affiliateUrl: "https://www.ybera.com/produto/copo-medidor-100ml-150549",
      precoAntigo: "R$ 4,90",
      preco: "R$ 4,66",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Dosador Graduado 50ml - Transparente",
      oQueE: "Copo medidor personalizado Ybera para dosagem precisa de produtos. Polipropileno resistente, essencial para aplicações profissionais uniformes.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150548.jpg",
      affiliateUrl: "https://www.ybera.com/produto/dosador-graduado-50ml-transparente-150548",
      precoAntigo: "R$ 3,90",
      preco: "R$ 3,71",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Basico - Material de Apoio Profissional",
      oQueE: "Cumbuca, pente, pincel e capa de corte personalizados. Ferramentas essenciais para profissionais de tratamentos capilares.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151592.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-basico-material-de-apoio-profissional-151592",
      precoAntigo: "R$ 150,60",
      preco: "R$ 143,07",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Plus - Material de Apoio Profissional",
      oQueE: "Avental, touca, cumbuca, pente, pincel e capa personalizada. Kit completo para consultoras e profissionais de salão.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-151593.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-plus-material-de-apoio-profissional-151593",
      precoAntigo: "R$ 286,40",
      preco: "R$ 272,08",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Plaquete para Mechas Grande",
      oQueE: "Ferramenta profissional para aplicação precisa de mechas. Facilita o trabalho em salão com design funcional e resistente.",
      categoria: "Kits e Combos",
      imagem: "assets/img/produtos/ybera/ybera-150630.jpg",
      affiliateUrl: "https://www.ybera.com/produto/plaquete-para-mechas-grande-ybera-paris-150630",
      precoAntigo: "R$ 57,90",
      preco: "R$ 55,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Creme de Cetim 150g + Touca de Cetim - Fashion Gold",
      oQueE: "Você já ouviu a expressão “sono da beleza”? Pois esse ditado agora se tornou realidade!",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150698.jpg",
      affiliateUrl: "https://www.ybera.com/produto/creme-de-cetim-150g-touca-de-cetim-fashion-gold-150698",
      precoAntigo: "R$ 244,90",
      preco: "R$ 232,66",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Creme de Pentear 300ml - Capulana",
      oQueE: "O Creme de Pentear 300ml Capulana é a solução perfeita para o cuidado e estilização dos cabelos de cabelos crespos e cacheados, oferecendo benefícios que…",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150523.jpg",
      affiliateUrl: "https://www.ybera.com/produto/creme-de-pentear-300ml-capulana-150523",
      precoAntigo: "R$ 129,90",
      preco: "R$ 123,41",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Kit Escovas Profissionais Stylist - Fashion Gold",
      oQueE: "Qualidade de profissionais ao seu alcance. Agora você pode ter resultados de cabelos de salão em casa, você só precisa dos equipamentos certos.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150855.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-escovas-profissionais-stylist-fashion-gold-150855",
      precoAntigo: "R$ 507,90",
      preco: "R$ 482,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Pente",
      oQueE: "Pente resistente ao calor, desenvolvido para profissionais. Polipropileno de alta qualidade garante precisão e durabilidade nos procedimentos.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150546.jpg",
      affiliateUrl: "https://www.ybera.com/produto/pente-ybera-paris-150546",
      precoAntigo: "R$ 12,90",
      preco: "R$ 12,26",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Prancha Alisadora + Escova Progressiva 500g + Kit Manutenção Pós Progressiva 500ml/500gr - Fashion Gold",
      oQueE: "O ritual completo para um liso perfeito, tratado e duradouro .",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-151398.jpg",
      affiliateUrl: "https://www.ybera.com/produto/prancha-alisadora-escova-progressiva-500g-kit-manutencao-pos-progressiva-500ml-500gr-fashion-gold-151398",
      precoAntigo: "R$ 1.355,60",
      preco: "R$ 1.287,82",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Prancha Alisadora Stylist + Escova Progressiva 1kg - Fashion Gold",
      oQueE: "Kit profissional para alisamento duradouro em casa. Combina tecnologia de ponta com praticidade para cabelos perfeitamente alinhados.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150801.jpg",
      affiliateUrl: "https://www.ybera.com/produto/prancha-alisadora-stylist-escova-progressiva-1kg-fashion-gold-150801",
      precoAntigo: "R$ 1.895,80",
      preco: "R$ 1.801,01",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Prancha de Cabelo Alisadora - Stylist Blacktitan Ultra",
      oQueE: "Imagine alisar e modelar os cabelos sem danificar os fios e com resultado profissional, tudo isso sem sair de casa.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150802.jpg",
      affiliateUrl: "https://www.ybera.com/produto/prancha-de-cabelo-alisadora-stylist-blacktitan-ultra-150802",
      precoAntigo: "R$ 747,90",
      preco: "R$ 710,51",
      esgotado: true,
      destaque: false
    },
    {
      nome: "Touca de Cetim",
      oQueE: "Touca de Cetim Ybera Fashion Gold. Proteção inteligente para potencializar seus resultados.",
      categoria: "Acessórios",
      imagem: "assets/img/produtos/ybera/ybera-150679.jpg",
      affiliateUrl: "https://www.ybera.com/produto/touca-de-cetim-ybera-fashion-gold-150679",
      precoAntigo: "R$ 69,90",
      preco: "R$ 66,41",
      esgotado: true,
      destaque: false
    }
  ]
};
