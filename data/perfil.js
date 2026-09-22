/* =============================================================
   PERFIL — edite aqui seu nome, frases, foto e redes sociais
   =============================================================
   • frases: aparecem logo abaixo do seu nome, uma por linha.
     Coloque cada frase entre aspas e separe com vírgula.
   • foto: caminho de uma imagem dentro do projeto
     (ex.: "assets/img/perfil.jpg") ou um link completo (https://...).
     Aparece dentro de uma moldura em arco. Use uma foto na vertical.
     Se ficar vazio, a moldura mostra só um ornamento.
   • redes: preencha a URL das redes que você usa.
     Redes com url vazia NÃO aparecem no site.
     Tipos aceitos: instagram, tiktok, youtube, whatsapp, facebook,
     pinterest, threads, x, telegram, email.
     (Para email use "mailto:voce@exemplo.com";
      para WhatsApp use "https://wa.me/55DDDNUMERO")
   ============================================================= */

window.PERFIL = {
  nome: "",   // ex.: "Maria Souza" ou "@seuusuario". Vazio = não aparece.
  frases: [
    // "Primeira frase",
    // "Segunda frase"
  ],
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
    "Links de afiliado: ao comprar por aqui, você não paga nada a mais e apoia o meu trabalho."
};
