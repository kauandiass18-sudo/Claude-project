/* =============================================================
   CATÁLOGO: categorias, seleções e produtos
   =============================================================
   Este arquivo pode ser editado pelo painel (/admin) ou à mão.
   O painel regrava o arquivo inteiro a cada publicação.

   Os produtos com "demo": true são EXEMPLOS de demonstração:
   não têm link de afiliado e aparecem com a etiqueta "Exemplo".
   Apague-os (no painel: Produtos → "Remover exemplos") quando
   cadastrar os seus produtos reais.

   Campos de cada produto: veja o README.md da vitrine.
   ============================================================= */

window.CATALOGO = {
  "versao": 1,
  "atualizadoEm": "2026-10-27",
  "categorias": [
    {
      "id": "casa",
      "nome": "Casa",
      "descricao": "Objetos que deixam os ambientes mais agradáveis de usar."
    },
    {
      "id": "cozinha",
      "nome": "Cozinha",
      "descricao": "Peças para o dia a dia da cozinha e da mesa."
    },
    {
      "id": "escritorio",
      "nome": "Escritório",
      "descricao": "Organização e conforto para a mesa de trabalho."
    },
    {
      "id": "cuidados-pessoais",
      "nome": "Cuidados pessoais",
      "descricao": "Frascos, potes e acessórios para a rotina de cuidados."
    },
    {
      "id": "audio",
      "nome": "Áudio",
      "descricao": "Para ouvir música, podcasts e chamadas."
    }
  ],
  "selecoes": [
    {
      "id": "mesa-de-trabalho",
      "titulo": "Para a mesa de trabalho",
      "descricao": "Cinco objetos que organizam a rotina sem ocupar a mesa toda.",
      "produtos": [
        "suporte-notebook-aluminio",
        "cadernos-capa-dura-3",
        "porta-lapis-ceramica",
        "caneca-ceramica-esmaltada-350ml",
        "luminaria-mesa-cupula-tecido"
      ]
    },
    {
      "id": "casa-acolhedora",
      "titulo": "Uma casa mais acolhedora",
      "descricao": "Luz baixa, cerâmica e aroma: o básico para um canto de descanso.",
      "produtos": [
        "vaso-ceramica-bojudo",
        "vela-aromatica-pote-vidro",
        "luminaria-mesa-cupula-tecido",
        "conjunto-tigelas-ceramica-3"
      ]
    }
  ],
  "produtos": [
    {
      "id": "vaso-ceramica-bojudo",
      "nome": "Vaso de cerâmica bojudo 22 cm",
      "categoria": "casa",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/vaso-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/vaso-1-600.webp",
          "alt": "Vaso de cerâmica bojudo na cor areia"
        },
        {
          "src": "assets/img/produtos/exemplos/vaso-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/vaso-2-600.webp",
          "alt": "Vaso de cerâmica bojudo na cor grafite"
        },
        {
          "src": "assets/img/produtos/exemplos/vaso-3-1200.webp",
          "pequena": "assets/img/produtos/exemplos/vaso-3-600.webp",
          "alt": "Vaso de cerâmica areia visto de cima, mostrando a boca estreita"
        }
      ],
      "descricaoCurta": "Vaso de cerâmica com acabamento fosco e boca estreita, para flores secas ou como peça decorativa sozinha.",
      "descricao": "Um vaso de formas arredondadas que funciona tanto com hastes secas quanto vazio, como objeto de decoração.\n\nO acabamento fosco deixa a peça discreta em estantes, aparadores e mesas de centro.",
      "caracteristicas": [
        "Cerâmica com acabamento fosco",
        "Boca estreita, que sustenta hastes finas",
        "Duas cores: areia e grafite"
      ],
      "especificacoes": [
        {
          "rotulo": "Material",
          "valor": "Cerâmica"
        },
        {
          "rotulo": "Altura",
          "valor": "22 cm"
        },
        {
          "rotulo": "Cores",
          "valor": "Areia, grafite"
        }
      ],
      "preco": 89.9,
      "precoAnterior": 109.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "decoração",
        "flores secas",
        "sala"
      ],
      "adicionadoEm": "2026-10-24",
      "demo": true
    },
    {
      "id": "vela-aromatica-pote-vidro",
      "nome": "Vela aromática em pote de vidro com tampa",
      "categoria": "casa",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/vela-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/vela-1-600.webp",
          "alt": "Vela aromática em pote de vidro com a tampa de madeira apoiada atrás"
        }
      ],
      "descricaoCurta": "Vela em pote de vidro com faixa de papel kraft e tampa de madeira, que preserva o aroma entre um uso e outro.",
      "descricao": "O pote de vidro pode ser reaproveitado depois que a vela acabar. A tampa ajuda a conservar o aroma e evita poeira quando a vela não está acesa.",
      "caracteristicas": [
        "Pote de vidro reaproveitável",
        "Tampa de madeira",
        "Pavio de algodão"
      ],
      "especificacoes": [
        {
          "rotulo": "Recipiente",
          "valor": "Vidro"
        },
        {
          "rotulo": "Tampa",
          "valor": "Madeira"
        },
        {
          "rotulo": "Peso líquido",
          "valor": "180 g"
        }
      ],
      "preco": 54.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "vela",
        "aroma",
        "quarto"
      ],
      "adicionadoEm": "2026-10-22",
      "demo": true
    },
    {
      "id": "luminaria-mesa-cupula-tecido",
      "nome": "Luminária de mesa com cúpula de tecido",
      "categoria": "casa",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/luminaria-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/luminaria-1-600.webp",
          "alt": "Luminária com cúpula off-white e base dourada"
        },
        {
          "src": "assets/img/produtos/exemplos/luminaria-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/luminaria-2-600.webp",
          "alt": "Luminária com cúpula verde e base cinza"
        }
      ],
      "descricaoCurta": "Luminária de base metálica e cúpula de tecido, que espalha uma luz suave para mesa de cabeceira ou escrivaninha.",
      "descricao": "Base circular estável e haste fina, com cúpula de tecido que filtra a luz e evita o brilho direto nos olhos.\n\nCombina com lâmpadas de tom quente para ambientes de descanso.",
      "caracteristicas": [
        "Cúpula de tecido que difunde a luz",
        "Base metálica estável",
        "Duas combinações: off-white com dourado e verde com cinza"
      ],
      "especificacoes": [
        {
          "rotulo": "Altura",
          "valor": "42 cm"
        },
        {
          "rotulo": "Soquete",
          "valor": "E27"
        },
        {
          "rotulo": "Lâmpada",
          "valor": "Não inclusa"
        }
      ],
      "preco": 149.9,
      "precoAnterior": 179.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "abajur",
        "iluminação",
        "quarto",
        "cabeceira"
      ],
      "adicionadoEm": "2026-10-19",
      "demo": true
    },
    {
      "id": "caneca-ceramica-esmaltada-350ml",
      "nome": "Caneca de cerâmica esmaltada 350 ml",
      "categoria": "cozinha",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/caneca-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/caneca-1-600.webp",
          "alt": "Caneca de cerâmica azul"
        },
        {
          "src": "assets/img/produtos/exemplos/caneca-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/caneca-2-600.webp",
          "alt": "Caneca de cerâmica verde"
        },
        {
          "src": "assets/img/produtos/exemplos/caneca-3-1200.webp",
          "pequena": "assets/img/produtos/exemplos/caneca-3-600.webp",
          "alt": "Caneca de cerâmica creme"
        }
      ],
      "descricaoCurta": "Caneca de cerâmica com esmalte brilhante, interior claro e alça larga, no tamanho certo para café com leite.",
      "descricao": "Feita para o uso diário: parede grossa que conserva a temperatura por mais tempo e alça que acomoda bem os dedos.",
      "caracteristicas": [
        "Capacidade de 350 ml",
        "Esmalte brilhante com interior claro",
        "Três cores: azul, verde e creme"
      ],
      "especificacoes": [
        {
          "rotulo": "Capacidade",
          "valor": "350 ml"
        },
        {
          "rotulo": "Material",
          "valor": "Cerâmica esmaltada"
        },
        {
          "rotulo": "Cores",
          "valor": "Azul, verde, creme"
        }
      ],
      "preco": 39.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "café",
        "chá",
        "xícara"
      ],
      "adicionadoEm": "2026-10-25",
      "demo": true
    },
    {
      "id": "garrafa-termica-inox-500ml",
      "nome": "Garrafa térmica de inox 500 ml",
      "categoria": "cozinha",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/garrafa-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/garrafa-1-600.webp",
          "alt": "Garrafa térmica cor sálvia"
        },
        {
          "src": "assets/img/produtos/exemplos/garrafa-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/garrafa-2-600.webp",
          "alt": "Garrafa térmica preta"
        },
        {
          "src": "assets/img/produtos/exemplos/garrafa-3-1200.webp",
          "pequena": "assets/img/produtos/exemplos/garrafa-3-600.webp",
          "alt": "Garrafa térmica cor areia"
        }
      ],
      "descricaoCurta": "Garrafa de parede dupla em aço inox com tampa rosqueável, para levar água ou café no dia a dia.",
      "descricao": "Corpo com pintura fosca que não escorrega na mão e tampa rosqueável com vedação.\n\nO formato reto cabe na maioria dos porta-copos de carro e nas laterais de mochilas.",
      "caracteristicas": [
        "Parede dupla de aço inox",
        "Tampa rosqueável com vedação",
        "Três cores: sálvia, preta e areia"
      ],
      "especificacoes": [
        {
          "rotulo": "Capacidade",
          "valor": "500 ml"
        },
        {
          "rotulo": "Material",
          "valor": "Aço inox"
        },
        {
          "rotulo": "Cores",
          "valor": "Sálvia, preta, areia"
        }
      ],
      "preco": 79.9,
      "precoAnterior": 99.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "garrafa",
        "água",
        "academia",
        "térmica"
      ],
      "adicionadoEm": "2026-10-26",
      "demo": true
    },
    {
      "id": "conjunto-tigelas-ceramica-3",
      "nome": "Conjunto com 3 tigelas de cerâmica",
      "categoria": "cozinha",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/tigelas-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/tigelas-1-600.webp",
          "alt": "Três tigelas de cerâmica em tons neutros"
        },
        {
          "src": "assets/img/produtos/exemplos/tigelas-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/tigelas-2-600.webp",
          "alt": "Três tigelas de cerâmica vistas de cima"
        }
      ],
      "descricaoCurta": "Três tigelas de tamanhos diferentes que se encaixam umas nas outras, para servir e guardar ocupando pouco espaço.",
      "descricao": "Tamanhos pensados para saladas, petiscos e molhos. Empilhadas, ocupam o espaço de uma só no armário.",
      "caracteristicas": [
        "Três tamanhos que se encaixam",
        "Esmalte acetinado",
        "Tons neutros que combinam entre si"
      ],
      "especificacoes": [
        {
          "rotulo": "Quantidade",
          "valor": "3 peças"
        },
        {
          "rotulo": "Material",
          "valor": "Cerâmica"
        },
        {
          "rotulo": "Diâmetros",
          "valor": "20, 16 e 12 cm"
        }
      ],
      "preco": 69.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "esgotado",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "tigela",
        "bowl",
        "servir",
        "mesa posta"
      ],
      "adicionadoEm": "2026-09-30",
      "demo": true
    },
    {
      "id": "porta-lapis-ceramica",
      "nome": "Porta-lápis de cerâmica",
      "categoria": "escritorio",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/portalapis-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/portalapis-1-600.webp",
          "alt": "Porta-lápis de cerâmica terracota com lápis coloridos"
        },
        {
          "src": "assets/img/produtos/exemplos/portalapis-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/portalapis-2-600.webp",
          "alt": "Porta-lápis de cerâmica azul com lápis coloridos"
        }
      ],
      "descricaoCurta": "Porta-lápis cilíndrico de cerâmica fosca, pesado o bastante para não tombar com canetas e réguas.",
      "descricao": "Um recipiente simples para organizar a mesa. A base mais pesada mantém o porta-lápis firme mesmo cheio.",
      "caracteristicas": [
        "Cerâmica fosca",
        "Base pesada e estável",
        "Duas cores: terracota e azul"
      ],
      "especificacoes": [
        {
          "rotulo": "Material",
          "valor": "Cerâmica"
        },
        {
          "rotulo": "Altura",
          "valor": "10 cm"
        },
        {
          "rotulo": "Diâmetro",
          "valor": "8 cm"
        }
      ],
      "preco": 34.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "organização",
        "mesa",
        "canetas"
      ],
      "adicionadoEm": "2026-10-12",
      "demo": true
    },
    {
      "id": "cadernos-capa-dura-3",
      "nome": "Kit com 3 cadernos de capa dura",
      "categoria": "escritorio",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/cadernos-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/cadernos-1-600.webp",
          "alt": "Três cadernos de capa dura empilhados"
        },
        {
          "src": "assets/img/produtos/exemplos/cadernos-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/cadernos-2-600.webp",
          "alt": "Cadernos de capa dura vistos de lado, com o elástico"
        }
      ],
      "descricaoCurta": "Três cadernos de capa dura em cores sóbrias, com elástico para manter as folhas fechadas.",
      "descricao": "Capa dura que aguenta o transporte na bolsa e miolo de folhas claras. Bom para separar trabalho, estudos e anotações pessoais.",
      "caracteristicas": [
        "Capa dura com textura",
        "Elástico de fechamento",
        "Três cores no kit"
      ],
      "especificacoes": [
        {
          "rotulo": "Quantidade",
          "valor": "3 cadernos"
        },
        {
          "rotulo": "Formato",
          "valor": "A5"
        },
        {
          "rotulo": "Folhas",
          "valor": "80 por caderno"
        }
      ],
      "preco": 59.9,
      "precoAnterior": 74.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "caderno",
        "anotações",
        "agenda",
        "papelaria"
      ],
      "adicionadoEm": "2026-10-15",
      "demo": true
    },
    {
      "id": "suporte-notebook-aluminio",
      "nome": "Suporte de alumínio para notebook",
      "categoria": "escritorio",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/suporte-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/suporte-1-600.webp",
          "alt": "Suporte de alumínio para notebook"
        },
        {
          "src": "assets/img/produtos/exemplos/suporte-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/suporte-2-600.webp",
          "alt": "Suporte de alumínio para notebook visto de trás"
        }
      ],
      "descricaoCurta": "Suporte de alumínio que eleva o notebook e aproxima a tela da altura dos olhos.",
      "descricao": "Estrutura em alumínio com apoios emborrachados que protegem o notebook e a mesa.\n\nA abertura central ajuda a ventilação por baixo do aparelho.",
      "caracteristicas": [
        "Estrutura de alumínio",
        "Apoios emborrachados",
        "Abertura que favorece a ventilação"
      ],
      "especificacoes": [
        {
          "rotulo": "Material",
          "valor": "Alumínio"
        },
        {
          "rotulo": "Compatibilidade",
          "valor": "Notebooks de 10 a 15,6 polegadas"
        }
      ],
      "preco": 119.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "notebook",
        "ergonomia",
        "home office"
      ],
      "adicionadoEm": "2026-10-21",
      "demo": true
    },
    {
      "id": "frasco-ambar-conta-gotas-30ml",
      "nome": "Frasco de vidro âmbar com conta-gotas 30 ml",
      "categoria": "cuidados-pessoais",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/serum-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/serum-1-600.webp",
          "alt": "Frasco âmbar com conta-gotas preto"
        },
        {
          "src": "assets/img/produtos/exemplos/serum-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/serum-2-600.webp",
          "alt": "Frasco verde com conta-gotas preto"
        }
      ],
      "descricaoCurta": "Frasco de vidro com conta-gotas e aro metálico, para guardar óleos e séruns.",
      "descricao": "O vidro colorido ajuda a proteger o conteúdo da luz. O conta-gotas permite dosar com precisão.",
      "caracteristicas": [
        "Vidro colorido",
        "Conta-gotas com bulbo de borracha",
        "Duas cores: âmbar e verde"
      ],
      "especificacoes": [
        {
          "rotulo": "Capacidade",
          "valor": "30 ml"
        },
        {
          "rotulo": "Material",
          "valor": "Vidro"
        },
        {
          "rotulo": "Cores",
          "valor": "Âmbar, verde"
        }
      ],
      "preco": 24.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "frasco",
        "óleo",
        "sérum",
        "viagem"
      ],
      "adicionadoEm": "2026-10-08",
      "demo": true
    },
    {
      "id": "pote-vidro-tampa-metalica-200ml",
      "nome": "Pote de vidro com tampa metálica 200 ml",
      "categoria": "cuidados-pessoais",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/pote-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/pote-1-600.webp",
          "alt": "Pote de vidro branco com tampa dourada"
        },
        {
          "src": "assets/img/produtos/exemplos/pote-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/pote-2-600.webp",
          "alt": "Pote de vidro visto de cima, com tampa dourada"
        }
      ],
      "descricaoCurta": "Pote baixo de vidro leitoso com tampa metálica, para cremes, sabonetes em barra ou pequenos objetos.",
      "descricao": "Boca larga que facilita o uso e a limpeza. A tampa rosqueia com firmeza.",
      "caracteristicas": [
        "Vidro leitoso",
        "Tampa metálica rosqueável",
        "Boca larga"
      ],
      "especificacoes": [
        {
          "rotulo": "Capacidade",
          "valor": "200 ml"
        },
        {
          "rotulo": "Material",
          "valor": "Vidro e metal"
        }
      ],
      "preco": 29.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "pote",
        "creme",
        "banheiro",
        "organização"
      ],
      "adicionadoEm": "2026-10-05",
      "demo": true
    },
    {
      "id": "caixa-de-som-portatil-tecido",
      "nome": "Caixa de som portátil com acabamento em tecido",
      "categoria": "audio",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/caixasom-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/caixasom-1-600.webp",
          "alt": "Caixa de som portátil verde"
        },
        {
          "src": "assets/img/produtos/exemplos/caixasom-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/caixasom-2-600.webp",
          "alt": "Caixa de som portátil grafite"
        }
      ],
      "descricaoCurta": "Caixa de som sem fio com corpo revestido em tecido e alça superior, para levar de um cômodo a outro.",
      "descricao": "Formato cilíndrico que espalha o som em todas as direções. Os botões ficam no topo, fáceis de alcançar.",
      "caracteristicas": [
        "Conexão sem fio",
        "Bateria recarregável",
        "Duas cores: verde e grafite"
      ],
      "especificacoes": [
        {
          "rotulo": "Conexão",
          "valor": "Bluetooth"
        },
        {
          "rotulo": "Alimentação",
          "valor": "Bateria recarregável"
        },
        {
          "rotulo": "Cores",
          "valor": "Verde, grafite"
        }
      ],
      "preco": 199.9,
      "precoAnterior": 249.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "som",
        "música",
        "bluetooth",
        "speaker"
      ],
      "adicionadoEm": "2026-10-23",
      "demo": true
    },
    {
      "id": "fone-over-ear-sem-fio",
      "nome": "Fone de ouvido over-ear sem fio",
      "categoria": "audio",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/fone-1-1200.webp",
          "pequena": "assets/img/produtos/exemplos/fone-1-600.webp",
          "alt": "Fone de ouvido over-ear off-white"
        },
        {
          "src": "assets/img/produtos/exemplos/fone-2-1200.webp",
          "pequena": "assets/img/produtos/exemplos/fone-2-600.webp",
          "alt": "Fone de ouvido over-ear preto"
        }
      ],
      "descricaoCurta": "Fone que envolve as orelhas, com almofadas macias e arco ajustável.",
      "descricao": "Conchas que cobrem as orelhas inteiras e reduzem o som ao redor. O arco tem regulagem de altura.",
      "caracteristicas": [
        "Almofadas que envolvem as orelhas",
        "Arco ajustável",
        "Duas cores: off-white e preto"
      ],
      "especificacoes": [
        {
          "rotulo": "Tipo",
          "valor": "Over-ear"
        },
        {
          "rotulo": "Conexão",
          "valor": "Bluetooth"
        }
      ],
      "preco": null,
      "precoAnterior": null,
      "precoConferidoEm": "",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "headphone",
        "fone",
        "música"
      ],
      "adicionadoEm": "2026-10-10",
      "demo": true
    }
  ]
};
