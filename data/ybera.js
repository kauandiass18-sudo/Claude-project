/* =============================================================
   LOJA: YBERA PARIS  (produtos exibidos na PÁGINA INICIAL)
   =============================================================
   Ao tocar em um produto, o cliente vai direto para o affiliateUrl.

   COMO ADICIONAR UM PRODUTO
   Copie o bloco de exemplo abaixo, cole dentro de "produtos: [ ]"
   e preencha. Separe cada produto com vírgula.

   {
     nome: "Nome do produto",
     categoria: "Nome da categoria",
     imagem: "assets/img/produtos/ybera/arquivo.jpg",  // ou https://...
     affiliateUrl: "https://www.ybera.com/produto/...",
     precoAntigo: "R$ 0,00",   // opcional: aparece riscado
     preco: "R$ 0,00",         // opcional: preço no Pix
     destaque: false           // true = aparece em "Os mais amados"
   }

   • O código de parceiro (parceiro=19285) é adicionado AUTOMATICAMENTE
     em links do site ybera.com que não tiverem esse parâmetro.
   • As categorias são criadas automaticamente a partir dos produtos.
     Use "ordemCategorias" se quiser definir a ordem dos botões
     e "iconesCategorias" para escolher o ícone de cada uma.
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

  // Opcional: ordem das categorias nos filtros (as que não estiverem
  // aqui aparecem depois, em ordem alfabética).
  ordemCategorias: ["Progressiva", "Cronograma Capilar", "Antiqueda", "Kids"],

  // Opcional: ícone de cada categoria nos filtros.
  // Ícones disponíveis: liso, gota, raiz, coracao, ondas, brilho.
  iconesCategorias: {
    "Progressiva": "liso",
    "Cronograma Capilar": "gota",
    "Antiqueda": "raiz",
    "Kids": "coracao"
  },

  // Texto do preço (aparece depois do valor) e aviso abaixo da lista.
  rotuloPreco: "no Pix",
  notaPrecos: "Preços conferidos todos os dias na loja da Ybera. O valor final é o da loja.",

  produtos: [
    {
      nome: "Escova Progressiva 500g",
      categoria: "Progressiva",
      imagem: "assets/img/produtos/ybera/escova-progressiva-500g.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-500g-fashion-gold-150264",
      precoAntigo: "R$ 339,90",
      preco: "R$ 322,91",
      destaque: true
    },
    {
      nome: "Kit Escova Progressiva 150g + Shampoo + Máscara",
      categoria: "Progressiva",
      imagem: "assets/img/produtos/ybera/kit-escova-progressiva-150g-shampoo-mascara.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-150g-kit-manutencao-pos-progressiva-300ml-250g-fashion-gold-151084",
      precoAntigo: "R$ 284,90",
      preco: "R$ 270,66",
      destaque: true
    },
    {
      nome: "Kit Cuidados Profundos",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/kit-cuidados-profundos.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-cuidados-profundos-ybera-fashion-gold-151333",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Liso Perfeito",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/cronograma-liso-perfeito.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-liso-perfeito-ybera-fashion-gold-151305",
      precoAntigo: "R$ 324,90",
      preco: "R$ 308,66",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Kids Menino",
      categoria: "Kids",
      imagem: "assets/img/produtos/ybera/cronograma-kids-menino.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-kids-menino-ybera-fashion-kids-151312",
      precoAntigo: "R$ 249,90",
      preco: "R$ 237,41",
      destaque: true
    },
    {
      nome: "Cronograma Capilar Loiro Perfeito",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/cronograma-loiro-perfeito.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-loiro-perfeito-ybera-fashion-gold-151299",
      precoAntigo: "R$ 299,90",
      preco: "R$ 284,91",
      destaque: true
    },
    {
      nome: "Kit Liso Perfeito · 3 Máscaras",
      categoria: "Cronograma Capilar",
      imagem: "assets/img/produtos/ybera/kit-liso-perfeito.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-liso-perfeito-ybera-fashion-gold-151305",
      precoAntigo: "R$ 324,90",
      preco: "R$ 308,66",
      destaque: true
    },
    {
      nome: "Kit Antiqueda 100Tímetros · Shampoo + Condicionador + Tônico",
      categoria: "Antiqueda",
      imagem: "assets/img/produtos/ybera/kit-antiqueda-shampoo-condicionador-tonico.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-100timetros-antiqueda-capilar-fashion-gold-150314",
      precoAntigo: "R$ 349,90",
      preco: "R$ 332,41",
      destaque: true
    },
    {
      nome: "Kit Escova Progressiva 300g + Shampoo + Máscara 2 em 1",
      categoria: "Progressiva",
      imagem: "assets/img/produtos/ybera/kit-escova-progressiva-300g-shampoo-mascara.jpg",
      affiliateUrl: "https://www.ybera.com/produto/combo-escova-progressiva-300g-fashion-gold-150262",
      precoAntigo: "R$ 449,90",
      preco: "R$ 427,41",
      destaque: true
    },
    {
      nome: "Kit Antiqueda 100Tímetros · 90 Cápsulas + Tônico",
      categoria: "Antiqueda",
      imagem: "assets/img/produtos/ybera/kit-antiqueda-capsulas-tonico.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-100timetros-90-capsulas-softgel-cabelo-pele-e-unhas-tonico-antiqueda-capilar-150ml-ybera-fashion-gold-151484",
      precoAntigo: "R$ 349,90",
      preco: "R$ 332,41",
      destaque: true
    },
    {
      nome: "Escova Progressiva 300g",
      categoria: "Progressiva",
      imagem: "assets/img/produtos/ybera/escova-progressiva-300g.jpg",
      affiliateUrl: "https://www.ybera.com/produto/escova-progressiva-300g-fashion-gold-150795",
      precoAntigo: "R$ 257,90",
      preco: "R$ 245,01",
      destaque: true
    },
    {
      nome: "Kit Manutenção Pós-Progressiva",
      categoria: "Progressiva",
      imagem: "assets/img/produtos/ybera/kit-manutencao-pos-progressiva.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-manutencao-pos-progressiva-300ml-250g-fashion-gold-150293",
      precoAntigo: "R$ 205,90",
      preco: "R$ 195,61",
      destaque: true
    },
    {
      nome: "Tônico Antiqueda 100Tímetros 150ml",
      categoria: "Antiqueda",
      imagem: "assets/img/produtos/ybera/tonico-antiqueda-150ml.jpg",
      affiliateUrl: "https://www.ybera.com/produto/100timetros-tonico-antiqueda-capilar-150ml-fashion-gold-150308",
      precoAntigo: "R$ 127,90",
      preco: "R$ 121,51",
      destaque: true
    },
    {
      nome: "90 Cápsulas 100Tímetros · Cabelo, Pele e Unhas",
      categoria: "Antiqueda",
      imagem: "assets/img/produtos/ybera/capsulas-100timetros-90.jpg",
      affiliateUrl: "https://www.ybera.com/produto/kit-100timetros-90-capsulas-softgel-cabelo-pele-e-unhas-ybera-fashion-gold-151480",
      precoAntigo: "R$ 239,90",
      preco: "R$ 227,91",
      destaque: true
    }
  ]
};
