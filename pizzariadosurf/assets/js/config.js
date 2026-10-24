/*
 * Pizzaria do Surf — configurações comerciais
 * ---------------------------------------------------------------
 * Tudo o que depende de confirmação do cliente fica aqui.
 * Campos vazios ("") simplesmente não aparecem no site.
 */
window.PIZZARIA_CONFIG = {
  contato: {
    // WhatsApp comercial no formato internacional, só números: 55 + DDD + número.
    // Vazio = os botões abrem o WhatsApp para a pessoa escolher o contato.
    whatsapp: "",
    // Endereço completo do Instagram oficial (ex.: "https://instagram.com/pizzariadosurf").
    instagram: "",
    // Página do Facebook, se houver.
    facebook: ""
  },

  // Link do cardápio completo (cardápio digital, PDF, iFood...).
  // Vazio = "Ver cardápio completo" leva aos destaques da própria página.
  cardapioUrl: "",

  // EXEMPLO: trocar pelo horário real antes de publicar.
  horarios: [
    "Terça a domingo · 18h às 23h30",
    "Segunda · fechado"
  ],

  // EXEMPLO: trocar pelo endereço real antes de publicar.
  endereco: "Endereço da loja · Bairro · Cidade",

  // Mensagem inicial do WhatsApp nos botões gerais.
  mensagemPadrao: "Olá, Pizzaria do Surf! Quero fazer um pedido.",

  // true enquanto as imagens forem ilustrações provisórias (mostra um aviso discreto).
  imagensIlustrativas: true,
  // true enquanto os depoimentos forem textos de exemplo (mostra um aviso discreto).
  depoimentosDeExemplo: true
};
