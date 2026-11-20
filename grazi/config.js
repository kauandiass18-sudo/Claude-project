/* =========================================================================
   GRAZI · MANICURE & PEDICURE — CONFIGURAÇÃO DO SITE
   -------------------------------------------------------------------------
   Este é o único arquivo que você precisa editar.
   Fotos: salve os arquivos na pasta  grazi/img/  e informe o caminho aqui.
   Enquanto um campo de foto estiver vazio (""), o site mostra uma moldura
   delicada no lugar, indicando onde a foto vai entrar.
   ========================================================================= */

window.GRAZI = {

  /* ---------------------------------------------------------------------
     WHATSAPP
     Só números, com 55 + DDD + número.  Exemplo: "5549999999999"
     Vazio: o botão abre o WhatsApp e a pessoa escolhe o contato.
     Configure antes de divulgar o site.
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
     endereco: texto completo. Exemplo: "Rua Exemplo, 123 — Centro"
               Preenchido, aparece na página e no rodapé, e o botão passa a
               abrir o Google Maps.
     mapa:     link de incorporação do Google Maps. No Maps:
               Compartilhar → Incorporar um mapa → copie só o endereço que
               está dentro de src="..."
     --------------------------------------------------------------------- */
  cidade: "Faxinal dos Guedes",
  estado: "Santa Catarina",
  endereco: "",
  mapa: "",

  /* ---------------------------------------------------------------------
     HORÁRIOS (opcional)
     Lista vazia: a seção de horários não aparece.
     Exemplo:
       { dias: "Segunda a sexta", horas: "9h às 19h" },
       { dias: "Sábado",          horas: "9h às 16h" }
     --------------------------------------------------------------------- */
  horarios: [],

  /* ---------------------------------------------------------------------
     FOTOS PRINCIPAIS
     --------------------------------------------------------------------- */
  fotos: {
    hero:        { src: "", alt: "Unhas feitas pela Grazi" },        // vertical, a partir de 1200×1500
    heroDetalhe: { src: "", alt: "Detalhe de esmaltação" },          // quadrada, pequena
    grazi:       { src: "", alt: "Grazi, manicure e pedicure" },     // retrato vertical da Grazi
    spa:         { src: "", alt: "Spa dos Pés no espaço da Grazi" }  // vertical
  },

  /* ---------------------------------------------------------------------
     GALERIA DE UNHAS — a vitrine principal
     formato: "retrato" (4:5) · "alto" (2:3) · "quadrado" (1:1) · "paisagem" (3:2)
     alt:     descreva a foto em poucas palavras (aparece na foto ampliada,
              ajuda no Google e em leitores de tela)
     Pode adicionar ou remover itens à vontade.
     --------------------------------------------------------------------- */
  galeria: [
    { src: "", alt: "Trabalho 1",  formato: "alto" },
    { src: "", alt: "Trabalho 2",  formato: "quadrado" },
    { src: "", alt: "Trabalho 3",  formato: "retrato" },
    { src: "", alt: "Trabalho 4",  formato: "retrato" },
    { src: "", alt: "Trabalho 5",  formato: "alto" },
    { src: "", alt: "Trabalho 6",  formato: "quadrado" },
    { src: "", alt: "Trabalho 7",  formato: "quadrado" },
    { src: "", alt: "Trabalho 8",  formato: "retrato" },
    { src: "", alt: "Trabalho 9",  formato: "alto" },
    { src: "", alt: "Trabalho 10", formato: "retrato" },
    { src: "", alt: "Trabalho 11", formato: "paisagem" },
    { src: "", alt: "Trabalho 12", formato: "retrato" }
  ],

  /* ---------------------------------------------------------------------
     INSTAGRAM (opcional)
     Fotos atualizadas à mão — não é integração ao vivo.
     Enquanto a lista estiver vazia, a seção mostra só o convite e o botão.
     link: endereço da publicação (opcional; vazio leva ao perfil)
     Exemplo:
       { src: "img/instagram/post-1.jpg", alt: "Unhas em nude", link: "" }
     --------------------------------------------------------------------- */
  instagramPosts: [],

  /* ---------------------------------------------------------------------
     DEPOIMENTOS
     Troque pelos depoimentos reais e apague a linha  exemplo: true.
     Itens com exemplo: true aparecem marcados como "Exemplo".
     Lista vazia ([]) esconde a seção inteira.
     --------------------------------------------------------------------- */
  depoimentos: [
    { texto: "Espaço reservado para o depoimento real de uma cliente. Copie aqui as palavras dela, como foram enviadas.", nome: "Nome da cliente", exemplo: true },
    { texto: "Espaço reservado para o depoimento real de uma cliente. Pode ser uma mensagem do WhatsApp ou um comentário do Instagram, com autorização.", nome: "Nome da cliente", exemplo: true },
    { texto: "Espaço reservado para o depoimento real de uma cliente. Textos curtos, de duas a quatro linhas, ficam mais bonitos.", nome: "Nome da cliente", exemplo: true }
  ]
};
