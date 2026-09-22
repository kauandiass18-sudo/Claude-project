/* =============================================================
   PERFIL — edite aqui seu nome, descrição, foto e redes sociais
   =============================================================
   • foto: caminho de uma imagem dentro do projeto
     (ex.: "assets/img/perfil.jpg") ou um link completo (https://...).
     Se ficar vazio, aparece um monograma com as iniciais do nome.
   • redes: preencha a URL das redes que você usa.
     Redes com url vazia NÃO aparecem no site.
     Tipos aceitos: instagram, tiktok, youtube, whatsapp, facebook,
     pinterest, threads, x, telegram, email.
     (Para email use "mailto:voce@exemplo.com";
      para WhatsApp use "https://wa.me/55DDDNUMERO")
   ============================================================= */

window.PERFIL = {
  nome: "Seu Nome",
  descricao: "Seleção pessoal dos produtos que eu uso e recomendo.",
  foto: "",

  redes: [
    { tipo: "instagram", url: "" },
    { tipo: "tiktok",    url: "" },
    { tipo: "youtube",   url: "" },
    { tipo: "whatsapp",  url: "" },
    { tipo: "pinterest", url: "" },
    { tipo: "email",     url: "" }
  ],

  // Texto exibido no rodapé de todas as páginas.
  avisoAfiliado:
    "Alguns links são de afiliado: posso receber uma comissão, sem custo extra para você."
};
