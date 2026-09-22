/* =============================================================
   LOJA: SHOPEE
   =============================================================
   COMO ADICIONAR UM PRODUTO
   Copie o bloco de exemplo abaixo, cole dentro de "produtos: [ ]"
   e preencha. Separe cada produto com vírgula.

   {
     nome: "Nome do produto",
     categoria: "Nome da categoria",
     imagem: "assets/img/produtos/shopee/arquivo.jpg", // ou https://...
     affiliateUrl: "https://s.shopee.com.br/SEU-LINK",
     destaque: false                                    // true = aparece em Destaques
   }

   • linkLoja (opcional): link de afiliado geral da sua vitrine/perfil.
     Se ficar vazio, o botão não aparece.
   ============================================================= */

window.LOJAS = window.LOJAS || {};

window.LOJAS.shopee = {
  titulo: "Shopee",
  subtitulo: "Os melhores achados da Shopee em um só lugar.",
  linkLoja: "",
  textoLinkLoja: "Ver minha vitrine na Shopee",

  ordemCategorias: [],

  produtos: [
    // Adicione os produtos aqui.
  ]
};
