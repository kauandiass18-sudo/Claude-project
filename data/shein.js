/* =============================================================
   LOJA: SHEIN
   =============================================================
   COMO ADICIONAR UM PRODUTO
   Copie o bloco de exemplo abaixo, cole dentro de "produtos: [ ]"
   e preencha. Separe cada produto com vírgula.

   {
     nome: "Nome do produto",
     categoria: "Nome da categoria",
     imagem: "assets/img/produtos/shein/arquivo.jpg", // ou https://...
     affiliateUrl: "https://br.shein.com/SEU-LINK",
     destaque: false                                    // true = aparece em Destaques
   }

   • linkLoja (opcional): link de afiliado geral da sua vitrine/perfil.
     Se ficar vazio, o botão não aparece.
   ============================================================= */

window.LOJAS = window.LOJAS || {};

window.LOJAS.shein = {
  titulo: "Shein",
  subtitulo: "Acessórios de cabelo e beleza com estilo, por um preço que cabe no bolso.",
  linkLoja: "",
  textoLinkLoja: "Ver minha vitrine na Shein",

  ordemCategorias: [],

  produtos: [
    // Adicione os produtos aqui.
  ]
};
