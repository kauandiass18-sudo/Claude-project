/* =====================================================================
   CONFIGURAÇÃO DO SITE — é aqui que você edita os dados da empresa.
   Tudo o que estiver vazio ('') simplesmente não aparece no site.
   ===================================================================== */
window.SITE = {

  /* ---------- Marca ---------- */
  marca: {
    nome: 'Alvéa',                              // nome provisório: troque pelo nome real
    complemento: 'Higienização de Estofados',   // aparece ao lado do logotipo e no rodapé
    logo: '',                                   // opcional: 'assets/img/logo.svg' substitui o logotipo em texto
    apresentacao: 'Higienização profissional de sofás, colchões, cadeiras e estofados automotivos, com atendimento personalizado e cuidado em cada detalhe.'
  },

  /* ---------- Contato ----------
     WhatsApp: só números, com DDI 55 + DDD + número. Ex.: '5511912345678'.
     Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem
     pronta, mas a pessoa precisa escolher o contato manualmente. */
  whatsapp: '',
  instagram: '',          // ex.: 'https://instagram.com/suaempresa'
  email: '',              // opcional

  /* ---------- Região atendida ----------
     Informe apenas os locais que a empresa realmente atende.
     A cidade entra no título da página, na descrição para o Google
     e nos dados estruturados. */
  cidade: '',             // ex.: 'Curitiba'
  estado: '',             // ex.: 'PR'
  regioes: [],            // ex.: ['Curitiba', 'São José dos Pinhais', 'Pinhais']
  horario: '',            // ex.: 'Segunda a sábado, das 8h às 18h'

  /* ---------- Dados legais (política de privacidade) ---------- */
  razaoSocial: '',
  cnpj: '',

  /* ---------- Endereço público do site ----------
     Ex.: 'https://www.suaempresa.com.br/' — usado no link canônico
     e no compartilhamento. */
  dominio: '',

  /* ---------- Fotografias ----------
     Coloque as fotos em assets/img/fotos/ (formato .webp ou .jpg,
     cerca de 1600 px no lado maior) e informe o caminho.
     Enquanto estiverem vazias, o site exibe ilustrações de traço. */
  fotos: {
    hero:       '',   // sofá elegante em sala clara (vertical, proporção 4:5)
    sofas:      '',   // sofá ou poltrona
    colchoes:   '',   // quarto com cama/colchão
    cadeiras:   '',   // sala de jantar com cadeiras estofadas
    automotivo: '',   // interior de veículo
    chamada:    ''    // ambiente sofisticado para a chamada final (horizontal)
  },

  /* ---------- Antes e depois ----------
     Use fotos REAIS do mesmo estofado, no mesmo ângulo e com luz
     semelhante. Sem fotos, o comparador mostra uma demonstração
     identificada como ilustrativa. */
  antesDepois: {
    antes: '',
    depois: '',
    legenda: ''           // ex.: 'Sofá de linho · higienização completa'
  },

  /* ---------- Galeria de resultados ----------
     Somente trabalhos reais. A seção aparece quando houver ao menos
     uma foto. Exemplo de item:
     { foto: 'assets/img/fotos/sofa-linho.webp', antes: 'assets/img/fotos/sofa-linho-antes.webp',
       estofado: 'Sofá de linho, 3 lugares', servico: 'Higienização completa', formato: 'alto' }
     formato: 'alto', 'largo' ou '' (padrão) — varia a composição da grade. */
  galeria: [],

  /* ---------- Depoimentos ----------
     Somente depoimentos reais, com autorização do cliente.
     A seção aparece quando houver ao menos um. Exemplo:
     { nome: 'Nome do cliente', bairro: 'Bairro ou cidade', texto: 'Comentário', nota: 5 } */
  depoimentos: []
};
