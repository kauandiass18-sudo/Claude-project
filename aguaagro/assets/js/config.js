/*
 * Página de vendas · Tratamento de água para o agronegócio
 * Configurações comerciais
 * ---------------------------------------------------------------
 * Tudo o que depende de confirmação da empresa fica aqui.
 * Campos vazios ("" ou []) simplesmente não aparecem no site.
 * Nada aqui é inventado: o que não foi fornecido fica em branco.
 */
window.AGUA_CONFIG = {
  empresa: {
    // Nome comercial. Vazio = o cabeçalho e o rodapé mostram o espaço do logotipo.
    nome: "",
    // Caminho do logotipo oficial (SVG ou PNG), ex.: "assets/img/logo.svg".
    logo: "",
    // Uma ou duas frases para o rodapé.
    descricao: "",
    // Razão social e CNPJ, somente se autorizados.
    razaoSocial: "",
    cnpj: "",
    // Endereço completo, somente se autorizado.
    endereco: "",
    // Regiões atendidas, ex.: ["Oeste do Paraná", "Mato Grosso do Sul"].
    regioes: [],
    // Endereço final do site (para SEO e compartilhamento), ex.: "https://www.empresa.com.br/".
    site: ""
  },

  contato: {
    // WhatsApp comercial, só números: 55 + DDD + número (ex.: "5545999999999").
    // Vazio = o WhatsApp abre para a pessoa escolher o contato.
    whatsapp: "",
    // Telefone exibido no rodapé e na área de contato, ex.: "(45) 3333-3333".
    telefone: "",
    email: "",
    // Horário de atendimento, ex.: "Segunda a sexta, das 8h às 18h".
    horario: ""
  },

  // Mensagem que abre pronta no WhatsApp.
  mensagemWhatsApp: "Olá! Gostaria de conhecer as soluções de tratamento de água para a minha operação. Poderiam me orientar sobre os próximos passos?",

  formulario: {
    // Endereço que recebe as solicitações por POST em JSON: o seu backend,
    // um webhook do CRM ou um serviço como Formspree (https://formspree.io/f/xxxx).
    // Vazio = sem integração: a solicitação é concluída pelo WhatsApp,
    // e a página nunca mostra "enviado" sem confirmação do servidor.
    endpoint: ""
  },

  // Serviços confirmados pela empresa. false = o serviço some da página
  // (da grade de soluções e das opções do formulário).
  servicos: {
    analise: true,
    sistemas: true,
    filtracao: true,
    correcao: true,
    agroindustria: true,
    manutencao: true
  },

  // Segmentos efetivamente atendidos. false = o segmento some da página.
  aplicacoes: {
    propriedades: true,
    abastecimento: true,
    pecuaria: true,
    avicultura: true,
    suinocultura: true,
    irrigacao: true,
    agroindustrias: true,
    higienizacao: true
  },

  // Evidências reais (somente com autorização do cliente). Enquanto vazias,
  // a seção "Empresa" mostra apenas a apresentação institucional.
  equipe: {
    // Ex.: "Responsável técnico: Nome Sobrenome, engenheiro químico (CRQ 00000000)".
    responsavelTecnico: "",
    // Ex.: "Equipe própria de instalação e manutenção".
    destaque: ""
  },
  // Estudos de caso documentados e autorizados:
  // { cliente: "", contexto: "", necessidade: "", solucao: "", resultado: "" }
  casos: [],
  // Depoimentos autênticos e autorizados: { texto: "", nome: "", cargo: "" }
  depoimentos: [],

  // true enquanto houver conteúdo pendente de confirmação (mostra um aviso discreto no rodapé).
  modoPrevia: true
};
