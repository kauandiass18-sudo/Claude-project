/* =====================================================================
   CORTEX.VR — CONFIGURAÇÃO DO SITE
   É aqui que você edita os dados comerciais: contato, preços, planos,
   indicadores, portfólio e depoimentos. O site é montado a partir
   deste arquivo; não é preciso mexer no HTML para trocar esses dados.

   Itens marcados com  PENDENTE  precisam ser preenchidos ou
   confirmados antes de divulgar o site.
   ===================================================================== */
window.SITE = {

  /* ---------- Marca ---------- */
  marca: {
    nome: 'CORTEX.VR',
    assinatura: 'Marketing inteligente'
  },

  /* ---------- Contato ----------
     PENDENTE: número oficial do WhatsApp.
     Só números: 55 + DDD + número. Ex.: '5511912345678'.
     Todos os botões de contato do site usam este mesmo número.
     Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem
     pronta, mas a pessoa precisa escolher o contato manualmente. */
  whatsapp: '',

  /* PENDENTE: endereço completo do perfil oficial.
     Ex.: 'https://www.instagram.com/cortex.vr'. Vazio = não aparece. */
  instagram: '',

  /* Endereço público do site, usado no link canônico e no
     compartilhamento. Ex.: 'https://www.cortexvr.com.br/' */
  dominio: '',

  /* ---------- Mensagens do WhatsApp ----------
     Texto que já vem escrito quando a pessoa toca em cada botão.
     Ela pode revisar e editar antes de enviar. */
  mensagens: {
    geral:       'Olá! Conheci a CORTEX.VR pelo site e gostaria de solicitar um orçamento.',
    destaque:    'Olá! Conheci a CORTEX.VR pelo site e quero destacar minha marca nas redes sociais. Podemos conversar?',
    videos:      'Olá! Conheci a CORTEX.VR pelo site e gostaria de solicitar um orçamento para vídeos.',
    artes:       'Olá! Conheci a CORTEX.VR pelo site e gostaria de solicitar um orçamento para artes digitais.',
    logo:        'Olá! Gostaria de criar uma logo para minha empresa e quero saber como funciona o processo.',
    estrategia:  'Olá! Conheci a CORTEX.VR pelo site e tenho interesse em uma estratégia de conteúdo para minha empresa.',
    portfolio:   'Olá! Vi o mostruário da CORTEX.VR no site e gostaria de algo nesse estilo para minha marca.',
    final:       'Olá! Conheci a CORTEX.VR pelo site. Meu objetivo é: '
  },

  /* ---------- Indicadores (faixa abaixo da primeira tela) ----------
     PENDENTE: números informados pela CORTEX.VR. Confirme quais podem
     ser divulgados antes de publicar. Para remover um item, apague a
     linha. valor = número que anima; prefixo/sufixo = texto ao redor. */
  indicadores: [
    { valor: 4,   sufixo: 'M+', rotulo: 'Views em 30 dias' },
    { valor: 100, sufixo: '+',  rotulo: 'Projetos' },
    { valor: 98,  sufixo: '%',  rotulo: 'Satisfação' },
    { valor: 3,   sufixo: 'x',  rotulo: 'Mais alcance' },
    { valor: 24,  sufixo: 'h',  rotulo: 'Entrega rápida' }
  ],
  // Observação exibida abaixo dos indicadores. Deixe '' para ocultar.
  notaIndicadores: 'Números informados pela CORTEX.VR com base em projetos anteriores. Não representam garantia de resultados.',

  /* ---------- Serviços avulsos ----------
     aPartirDe: true mostra “a partir de” antes do preço. */
  avulsos: [
    { nome: 'Arte para empresas',     preco: 20,  aPartirDe: true,
      mensagem: 'Olá! Vi no site da CORTEX.VR a arte para empresas a partir de R$ 20 e gostaria de um orçamento.' },
    { nome: 'Vídeo de até 20 segundos', preco: 50,  aPartirDe: false,
      mensagem: 'Olá! Tenho interesse no vídeo de até 20 segundos da CORTEX.VR. Como funciona?' },
    { nome: 'Vídeo de até 1 minuto',  preco: 100, aPartirDe: false,
      mensagem: 'Olá! Tenho interesse no vídeo de até 1 minuto da CORTEX.VR. Como funciona?' }
  ],

  /* ---------- Planos mensais ----------
     destaque: true dá o realce visual e mostra o selo. */
  planos: [
    {
      nome: 'Básico', preco: 150, periodo: '/mês',
      indicacao: 'Ideal para começar.',
      itens: ['1 vídeo por semana', 'Conteúdo objetivo', 'Presença recorrente nas redes sociais'],
      botao: 'Quero o Básico',
      mensagem: 'Olá! Tenho interesse no plano Básico da CORTEX.VR. Poderia me explicar como funciona?'
    },
    {
      nome: 'Expert', preco: 200, periodo: '/mês',
      indicacao: 'Para quem deseja aumentar a frequência de conteúdo.',
      itens: ['2 vídeos por semana', 'Mais presença nas redes sociais', 'Conteúdo recorrente'],
      botao: 'Quero o Expert',
      destaque: true, selo: 'Mais escolhido',
      mensagem: 'Olá! Tenho interesse no plano Expert da CORTEX.VR. Poderia me explicar como funciona?'
    },
    {
      nome: 'Enterprise', preco: 300, periodo: '/mês',
      indicacao: 'Para empresas em crescimento.',
      itens: ['3 vídeos por semana', '2 stories por dia', 'Conteúdo recorrente para empresas'],
      botao: 'Quero o Enterprise',
      mensagem: 'Olá! Tenho interesse no plano Enterprise da CORTEX.VR. Poderia me explicar como funciona?'
    }
  ],
  notaPlanos: 'Antes de contratar, confirme pelo WhatsApp o escopo, os prazos, o formato dos vídeos, o número de revisões e as condições de pagamento.',

  /* ---------- Fundador ----------
     PENDENTE: foto real do Lucas. Coloque em assets/img/ (vertical 4:5,
     cerca de 1200 px de altura) e informe o caminho. Vazio = monograma. */
  fundador: {
    nome: 'Lucas',
    cargo: 'Diretor Criativo & CEO',
    foto: '',
    frase: 'Acredito que toda marca tem uma história única. Meu trabalho é contar essa história de um jeito que o mundo pare para ouvir.'
  },

  /* ---------- Vídeo no celular do topo ----------
     Coloque o vídeo em assets/video/ (vertical 9:16, MP4, de preferência
     até ~5 MB e 15 a 30 segundos) e informe o caminho em  arquivo.
     Ele toca sozinho, sem som e em repetição; o visitante pode ativar o som.
     capa (opcional): imagem mostrada enquanto o vídeo carrega.
     Vazio = o celular mostra a ilustração de Reels. */
  videoTopo: {
    arquivo: '',     // ex.: 'assets/video/topo.mp4'
    capa: ''         // ex.: 'assets/img/topo-capa.jpg'
  },

  /* ---------- Mostruário (vídeos) ----------
     Enquanto a lista estiver vazia, a seção não aparece no site.
     Para incluir um vídeo REAL (com autorização do cliente, se for o caso):
       1. coloque o arquivo em assets/video/ (MP4, até ~8 MB cada)
       2. copie o modelo abaixo para dentro dos colchetes e ajuste
     O card mostra o primeiro quadro do vídeo. Para usar uma capa própria,
     coloque a imagem em assets/img/portfolio/ e informe em  imagem.
     categoria: 'videos' | 'artes' | 'logos' | 'produtos'
     formato:   'alto' (vertical, tipo Reels) | 'largo' | ''

     Modelo:
     { titulo: 'Reels para loja de roupas', categoria: 'videos', formato: 'alto',
       video: 'assets/video/loja-roupas.mp4', imagem: '',
       descricao: 'Vídeo curto para divulgar a nova coleção nas redes sociais.' },
  */
  portfolio: [],

  /* ---------- Depoimentos ----------
     PENDENTE: confirmar a autorização de divulgação com o Dionatan Santos.
     Somente depoimentos reais e autorizados. Para incluir outro, copie
     o bloco abaixo. foto é opcional (quadrada, ~200 px). */
  depoimentos: [
    {
      nome: 'Dionatan Santos',
      cargo: 'Fundador',
      empresa: 'Soryx',
      foto: '',
      parceiroVerificado: true,
      texto: 'Depois que fechamos com a CORTEX.VR, o alcance da Soryx cresceu de forma expressiva. Os conteúdos ficaram muito mais profissionais e o retorno foi imediato — tanto em visibilidade quanto em novos clientes. O Lucas entende exatamente o que uma marca precisa para se destacar no digital. Resultado real, entrega rápida e atendimento de primeira.'
    }
  ]
};
