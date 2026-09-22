/* =============================================================
   LOJA: YBERA PARIS
   =============================================================
   COMO ADICIONAR UM PRODUTO
   Copie o bloco de exemplo abaixo, cole dentro de "produtos: [ ]"
   e preencha. Separe cada produto com vírgula.

   {
     nome: "Nome do produto",
     categoria: "Nome da categoria",
     imagem: "assets/img/produtos/ybera/arquivo.jpg",  // ou https://...
     affiliateUrl: "https://www.ybera.com/...?parceiro=19285",
     destaque: false                                    // true = aparece em Destaques
   }

   • O código de parceiro (parceiro=19285) é adicionado AUTOMATICAMENTE
     em links do site ybera.com que não tiverem esse parâmetro.
   • As categorias são criadas automaticamente a partir dos produtos.
     Use "ordemCategorias" se quiser definir a ordem dos botões.
   ============================================================= */

window.LOJAS = window.LOJAS || {};

window.LOJAS.ybera = {
  titulo: "Ybera Paris",
  subtitulo: "Cuidados capilares profissionais selecionados para você.",
  linkLoja: "https://www.ybera.com?parceiro=19285",
  textoLinkLoja: "Visitar loja oficial Ybera",

  // Parâmetros adicionados automaticamente aos links de ybera.com
  parametrosAfiliado: { parceiro: "19285" },
  dominiosAfiliado: ["ybera.com"],

  // Opcional: ordem das categorias nos filtros (as que não estiverem
  // aqui aparecem depois, em ordem alfabética).
  ordemCategorias: [],

  produtos: [
    // Adicione os produtos aqui.
  ]
};
