/*
 * Casa Ivete — configurações comerciais
 * ---------------------------------------------------------------
 * Tudo o que depende de confirmação da proprietária fica aqui.
 * Campos vazios ("") ou null simplesmente não aparecem no site:
 * nada é inventado para preencher espaço.
 */
window.CASA_IVETE_CONFIG = {
  marca: {
    nome: "Casa Ivete",
    assinatura: "Massas e Pães Artesanais",
    // Caminho do logotipo oficial (ex.: "assets/img/logo-casa-ivete.svg").
    // Vazio = o site usa a assinatura tipográfica provisória.
    logo: ""
  },

  contato: {
    // Número informado no perfil de referência. CONFIRMAR antes de publicar.
    // Formato internacional, só números: 55 + DDD + número.
    whatsapp: "5549999184930",
    whatsappExibicao: "(49) 99918-4930",
    // Endereço completo do Instagram oficial (ex.: "https://instagram.com/casaivete").
    // Vazio = o link não aparece.
    instagram: "",
    instagramUsuario: ""
  },

  // Localidades atendidas confirmadas.
  cidades: ["Chapecó", "Faxinal dos Guedes"],

  recebimento: {
    entrega: true,
    // true quando a retirada for confirmada; enquanto false, o cliente
    // é orientado a consultar pelo WhatsApp.
    retirada: false,
    // Texto exibido quando a retirada estiver ativa (ex.: "Rua ..., Chapecó").
    localRetirada: ""
  },

  entrega: {
    // Taxa por cidade, em reais. null = "a confirmar" no pedido.
    // Exemplo: { "Chapecó": 8, "Faxinal dos Guedes": 5 }
    taxas: { "Chapecó": null, "Faxinal dos Guedes": null },
    // Informações exibidas na seção de entregas (vazio = não aparece).
    regioes: "",
    horarios: "",
    prazoEncomendas: "",
    disponibilidadeDiaria: ""
  },

  encomendas: {
    quantidadeMinima: "",
    antecedencia: "",
    observacao: ""
  },

  // Formas de pagamento confirmadas (ex.: ["Pix", "Dinheiro", "Cartão na entrega"]).
  // Vazio = informado no atendimento.
  pagamento: [],

  // Enquanto as fotografias oficiais não forem enviadas, o site usa
  // ilustrações provisórias e avisa isso discretamente no cardápio.
  imagensIlustrativas: true,

  // Texto institucional PROVISÓRIO — sujeito à aprovação da proprietária.
  // Substitua pela história real da marca quando ela for fornecida.
  essencia: [
    "Na Casa Ivete, cada produto é uma oportunidade de levar mais sabor para a mesa. Reunimos pães, massas, salgados, bolos e cucas artesanais em uma experiência feita para quem valoriza o sabor e os pequenos momentos do dia."
  ]
};
