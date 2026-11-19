/* =========================================================================
   GRAZI · MANICURE & PEDICURE — CONFIGURAÇÃO DO SITE
   -------------------------------------------------------------------------
   É só editar este arquivo. Não precisa mexer no index.html.
   Fotos: coloque os arquivos na pasta  grazi/img/  e informe o caminho.
   Enquanto um campo de foto estiver vazio (""), o site mostra uma moldura
   delicada no lugar, indicando onde a foto vai entrar.
   ========================================================================= */

window.GRAZI = {

  /* ---------------------------------------------------------------------
     WHATSAPP
     Só números, com 55 + DDD + número.  Ex.: "5549999999999"
     Vazio: o botão abre o WhatsApp com a mensagem pronta e a pessoa
     escolhe o contato (funciona, mas configure o número antes de publicar).
     --------------------------------------------------------------------- */
  whatsapp: "",

  mensagemAgendamento:
    "Olá, Grazi! Conheci seu site e gostaria de agendar um horário. Poderia me passar mais informações?",

  mensagemSpa:
    "Olá, Grazi! Vi o Spa dos Pés no seu site e gostaria de conhecer. Poderia me passar mais informações?",

  mensagemEndereco:
    "Olá, Grazi! Vi seu site e gostaria de saber o endereço do seu espaço.",

  /* --------------------------------------------------------------------- */
  instagram: "https://www.instagram.com/graziimanicurepedicure/",
  instagramUsuario: "@graziimanicurepedicure",

  /* ---------------------------------------------------------------------
     LOCALIZAÇÃO
     endereco:  texto completo, ex.: "Rua Exemplo, 123 — Centro"
     mapa:      link de incorporação do Google Maps (Compartilhar → Incorporar
                um mapa → copie só o endereço que está dentro de src="...")
     --------------------------------------------------------------------- */
  cidade: "Faxinal dos Guedes",
  estado: "Santa Catarina",
  endereco: "",
  mapa: "",

  /* ---------------------------------------------------------------------
     FOTOS PRINCIPAIS
     --------------------------------------------------------------------- */
  fotos: {
    hero:        { src: "", alt: "Unhas feitas pela Grazi" },          // vertical, mín. 1200px de altura
    heroDetalhe: { src: "", alt: "Detalhe de esmaltação" },            // quadrada, pequena
    grazi:       { src: "", alt: "Grazi, manicure e pedicure" },       // retrato vertical da Grazi
    spa:         { src: "", alt: "Spa dos Pés no espaço da Grazi" }    // vertical
  },

  /* ---------------------------------------------------------------------
     GALERIA DE UNHAS  (a vitrine principal)
     formato: "retrato" (4:5) · "alto" (2:3) · "quadrado" (1:1)
     Adicione ou remova itens à vontade.
     --------------------------------------------------------------------- */
  galeria: [
    { src: "", alt: "Trabalho 1", formato: "alto" },
    { src: "", alt: "Trabalho 2", formato: "quadrado" },
    { src: "", alt: "Trabalho 3", formato: "retrato" },
    { src: "", alt: "Trabalho 4", formato: "retrato" },
    { src: "", alt: "Trabalho 5", formato: "alto" },
    { src: "", alt: "Trabalho 6", formato: "quadrado" },
    { src: "", alt: "Trabalho 7", formato: "quadrado" },
    { src: "", alt: "Trabalho 8", formato: "retrato" },
    { src: "", alt: "Trabalho 9", formato: "alto" },
    { src: "", alt: "Trabalho 10", formato: "retrato" },
    { src: "", alt: "Trabalho 11", formato: "quadrado" },
    { src: "", alt: "Trabalho 12", formato: "retrato" }
  ],

  /* ---------------------------------------------------------------------
     INSTAGRAM  (fotos atualizadas manualmente — não é integração ao vivo)
     link: endereço da publicação (opcional; vazio leva ao perfil)
     --------------------------------------------------------------------- */
  instagramPosts: [
    { src: "", alt: "Publicação do Instagram", link: "" },
    { src: "", alt: "Publicação do Instagram", link: "" },
    { src: "", alt: "Publicação do Instagram", link: "" },
    { src: "", alt: "Publicação do Instagram", link: "" },
    { src: "", alt: "Publicação do Instagram", link: "" },
    { src: "", alt: "Publicação do Instagram", link: "" }
  ],

  /* ---------------------------------------------------------------------
     DEPOIMENTOS
     Substitua pelos depoimentos reais e apague a linha  exemplo: true.
     Itens com exemplo: true aparecem marcados como "Exemplo".
     Lista vazia ([]) esconde a seção.
     --------------------------------------------------------------------- */
  depoimentos: [
    { texto: "Espaço reservado para o depoimento real de uma cliente. Copie aqui as palavras dela, como foram enviadas.", nome: "Nome da cliente", exemplo: true },
    { texto: "Espaço reservado para o depoimento real de uma cliente. Pode ser uma mensagem do WhatsApp ou um comentário do Instagram, com autorização.", nome: "Nome da cliente", exemplo: true },
    { texto: "Espaço reservado para o depoimento real de uma cliente. Textos curtos, de duas a quatro linhas, ficam mais bonitos.", nome: "Nome da cliente", exemplo: true }
  ]
};
