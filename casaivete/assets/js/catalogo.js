/*
 * Casa Ivete — catálogo
 * ---------------------------------------------------------------
 * Linhas de produto identificadas no perfil de referência.
 * Nomes, variações, tamanhos e preços devem ser CONFIRMADOS com a
 * proprietária antes da publicação.
 *
 * Campos de cada produto:
 *   id          identificador único, sem espaços
 *   nome        nome exibido
 *   categoria   id de uma das categorias abaixo
 *   descricao   frase curta, sem prometer ingredientes não confirmados
 *   preco       número em reais (ex.: 32.5) ou null = "sob consulta"
 *   medida      tamanho, peso, rendimento ou quantidade (ex.: "Cento") ou ""
 *   disponivel  false = aparece como indisponível, sem botão de compra
 *   destaque    true = aparece primeiro no cardápio
 *   encomenda   true = indica que é feito sob encomenda
 *   imagem      caminho da foto (troque pela fotografia oficial)
 *   imagemAlt   descrição da imagem para acessibilidade
 *   variacoes   [{ nome: "Sabor", opcoes: ["...", "..."] }] — só as confirmadas
 */
window.CASA_IVETE_CATALOGO = {
  categorias: [
    { id: "salgados", nome: "Salgados artesanais", curto: "Salgados", imagem: "assets/img/ilustracoes/salgados", imagemAlt: "Salgados dourados servidos em um prato" },
    { id: "paes", nome: "Pães artesanais", curto: "Pães", imagem: "assets/img/ilustracoes/pao", imagemAlt: "Pão artesanal sobre tábua de madeira" },
    { id: "bolos", nome: "Bolos caseiros", curto: "Bolos", imagem: "assets/img/ilustracoes/bolo-caseiro", imagemAlt: "Bolo caseiro em uma boleira" },
    { id: "cucas", nome: "Cucas artesanais", curto: "Cucas", imagem: "assets/img/ilustracoes/cuca", imagemAlt: "Cuca com farofa dourada" },
    { id: "doces", nome: "Doces e especialidades", curto: "Doces", imagem: "assets/img/ilustracoes/doces", imagemAlt: "Docinhos em forminhas" }
  ],

  produtos: [
    {
      id: "salgados-variados",
      nome: "Salgados variados",
      categoria: "salgados",
      descricao: "Salgados artesanais, dourados e fresquinhos. Consulte os sabores preparados no dia.",
      preco: null, medida: "", disponivel: true, destaque: true, encomenda: false,
      imagem: "assets/img/ilustracoes/salgados", imagemAlt: "Salgados artesanais variados sobre um prato",
      variacoes: []
    },
    {
      id: "mini-salgados",
      nome: "Mini salgados para encomendas",
      categoria: "salgados",
      descricao: "Em tamanho mini, pensados para reuniões, festas e momentos de compartilhar.",
      preco: null, medida: "", disponivel: true, destaque: true, encomenda: true,
      imagem: "assets/img/ilustracoes/mini-salgados", imagemAlt: "Mini salgados organizados em forminhas sobre uma bandeja",
      variacoes: []
    },
    {
      id: "paes-artesanais",
      nome: "Pães artesanais",
      categoria: "paes",
      descricao: "Pães de preparo artesanal, assados com cuidado para a sua mesa.",
      preco: null, medida: "", disponivel: true, destaque: true, encomenda: false,
      imagem: "assets/img/ilustracoes/pao", imagemAlt: "Pão artesanal de casca dourada sobre tábua",
      variacoes: []
    },
    {
      id: "bolo-caseiro",
      nome: "Bolo caseiro",
      categoria: "bolos",
      descricao: "Aquele bolo de casa, simples e macio, para acompanhar o café.",
      preco: null, medida: "", disponivel: true, destaque: false, encomenda: false,
      imagem: "assets/img/ilustracoes/bolo-caseiro", imagemAlt: "Bolo caseiro polvilhado sobre uma boleira",
      variacoes: []
    },
    {
      id: "bolo-chocolate",
      nome: "Bolo de chocolate",
      categoria: "bolos",
      descricao: "Para quem não abre mão do chocolate. Consulte tamanhos e disponibilidade.",
      preco: null, medida: "", disponivel: true, destaque: false, encomenda: false,
      imagem: "assets/img/ilustracoes/bolo-chocolate", imagemAlt: "Bolo de chocolate com cobertura e uma fatia ao lado",
      variacoes: []
    },
    {
      id: "bolo-coco",
      nome: "Bolo de coco",
      categoria: "bolos",
      descricao: "Leve e delicado, com coco. Consulte tamanhos e disponibilidade.",
      preco: null, medida: "", disponivel: true, destaque: false, encomenda: false,
      imagem: "assets/img/ilustracoes/bolo-coco", imagemAlt: "Bolo de coco com flocos e uma fatia ao lado",
      variacoes: []
    },
    {
      id: "cucas-artesanais",
      nome: "Cucas artesanais",
      categoria: "cucas",
      descricao: "A tradicional cuca do Sul, com farofa por cima. Consulte os sabores disponíveis.",
      preco: null, medida: "", disponivel: true, destaque: false, encomenda: false,
      imagem: "assets/img/ilustracoes/cuca", imagemAlt: "Cuca artesanal com farofa dourada, cortada em pedaços",
      variacoes: []
    }
  ]
};
