/* =============================================================
   LOJA: MERCADO LIVRE
   =============================================================
   COMO ADICIONAR UM PRODUTO
   Copie o bloco de exemplo abaixo, cole dentro de "produtos: [ ]"
   e preencha. Separe cada produto com vírgula.

   {
     nome: "Nome do produto",
     categoria: "Nome da categoria",
     imagem: "assets/img/produtos/mercado-livre/arquivo.jpg", // ou https://...
     affiliateUrl: "https://mercadolivre.com/sec/SEU-LINK",
     destaque: false                                           // true = aparece em Destaques
   }

   • linkLoja (opcional): link de afiliado geral da sua vitrine/perfil.
     Se ficar vazio, o botão não aparece.
   ============================================================= */

window.LOJAS = window.LOJAS || {};

window.LOJAS["mercado-livre"] = {
  titulo: "Mercado Livre",
  subtitulo: "Escovas, secadores, pentes e acessórios que valem a pena.",
  linkLoja: "",
  textoLinkLoja: "Ver minha vitrine no Mercado Livre",

  ordemCategorias: [],

  produtos: [
    // Adicione os produtos aqui.
  ]
};
