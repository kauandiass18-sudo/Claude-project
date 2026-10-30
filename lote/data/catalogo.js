/* =============================================================
   CATÁLOGO: categorias, combinações e peças
   =============================================================
   Este arquivo pode ser editado pelo painel (/admin) ou à mão.
   O painel regrava o arquivo inteiro a cada publicação.

   As peças com "demo": true são EXEMPLOS de demonstração: não têm
   link de afiliado, aparecem com a etiqueta "Exemplo" e as imagens
   são desenhos técnicos ilustrativos. Apague-as (no painel:
   Peças → "Remover exemplos") quando cadastrar as suas peças reais.

   Campos de cada peça: veja o README.md da vitrine.
   ============================================================= */

window.CATALOGO = {
  "versao": 2,
  "atualizadoEm": "2026-10-30",
  "categorias": [
    {
      "id": "calcas-cargo",
      "nome": "Calças cargo",
      "descricao": "Ripstop, sarja e nylon. Do corte reto ao baggy."
    },
    {
      "id": "camisetas",
      "nome": "Camisetas",
      "descricao": "Oversized, boxy e manga longa em malha de algodão."
    },
    {
      "id": "camisas",
      "nome": "Camisas",
      "descricao": "Overshirts e camisas leves para usar abertas ou fechadas."
    },
    {
      "id": "bermudas",
      "nome": "Bermudas",
      "descricao": "Cargo no joelho para os dias quentes."
    },
    {
      "id": "conjuntos",
      "nome": "Conjuntos",
      "descricao": "Peças que vêm juntas, prontas pra usar."
    }
  ],
  "selecoes": [
    {
      "id": "preto-no-preto",
      "titulo": "Preto no preto",
      "descricao": "Cargo ripstop, camiseta boxy e overshirt, tudo preto.",
      "produtos": [
        "calca-cargo-ripstop-baggy",
        "camiseta-boxy-malha-pesada",
        "camisa-overshirt-sarja"
      ]
    },
    {
      "id": "tons-de-terra",
      "titulo": "Tons de terra",
      "descricao": "Caqui, café e off-white para um visual mais claro.",
      "produtos": [
        "calca-cargo-sarja-reta",
        "camiseta-oversized-algodao",
        "camisa-listrada-manga-curta",
        "calca-cargo-wide-leg"
      ]
    },
    {
      "id": "calor",
      "titulo": "Para o calor",
      "descricao": "Bermudas cargo, camisa leve e camiseta oversized.",
      "produtos": [
        "bermuda-cargo-ripstop",
        "camiseta-oversized-algodao",
        "bermuda-cargo-nylon",
        "camisa-listrada-manga-curta"
      ]
    }
  ],
  "produtos": [
    {
      "id": "conjunto-top-short-vinho",
      "codigo": "",
      "nome": "Conjunto feminino top tomara que caia e short",
      "categoria": "conjuntos",
      "imagens": [
        {
          "src": "assets/img/produtos/conjunto-top-short-vinho-1200.webp",
          "pequena": "assets/img/produtos/conjunto-top-short-vinho-600.webp",
          "alt": "Conjunto vinho de top tomara que caia e short com estampa de flor branca",
          "cheia": true
        }
      ],
      "cores": [
        {
          "nome": "Vinho",
          "hex": "#8E1420",
          "imagem": 0
        }
      ],
      "tamanhos": [],
      "modelagem": "",
      "tecido": "",
      "medidas": null,
      "descricaoCurta": "",
      "descricao": "",
      "caracteristicas": [],
      "especificacoes": [],
      "preco": 59.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-30",
      "avaliacao": null,
      "linkAfiliado": "https://s.shopee.com.br/60SmUEslaB",
      "textoBotao": "Compre aqui",
      "disponibilidade": "",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "conjunto",
        "feminino",
        "top",
        "short",
        "tomara que caia",
        "vinho"
      ],
      "adicionadoEm": "2026-10-30",
      "demo": false
    },
    {
      "id": "calca-shopee-01",
      "codigo": "",
      "nome": "Calça cargo",
      "categoria": "calcas-cargo",
      "imagens": [],
      "cores": [],
      "tamanhos": [],
      "modelagem": "",
      "tecido": "",
      "medidas": null,
      "descricaoCurta": "",
      "descricao": "",
      "caracteristicas": [],
      "especificacoes": [],
      "preco": null,
      "precoAnterior": null,
      "precoConferidoEm": "",
      "avaliacao": null,
      "linkAfiliado": "https://s.shopee.com.br/AKbldp07lD",
      "textoBotao": "Compre aqui",
      "disponibilidade": "",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "calça",
        "cargo"
      ],
      "adicionadoEm": "2026-10-30",
      "demo": false
    },
    {
      "id": "calca-cargo-ripstop-baggy",
      "codigo": "LT-001",
      "nome": "Calça cargo ripstop baggy",
      "categoria": "calcas-cargo",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/ripstop-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/ripstop-preto-600.webp",
          "alt": "Calça cargo ripstop baggy preta, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/ripstop-preto-costas-1200.webp",
          "pequena": "assets/img/produtos/exemplos/ripstop-preto-costas-600.webp",
          "alt": "Calça cargo ripstop baggy preta, costas"
        },
        {
          "src": "assets/img/produtos/exemplos/ripstop-oliva-1200.webp",
          "pequena": "assets/img/produtos/exemplos/ripstop-oliva-600.webp",
          "alt": "Calça cargo ripstop baggy oliva, frente"
        }
      ],
      "cores": [
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 0
        },
        {
          "nome": "Oliva",
          "hex": "#5b5f3e",
          "imagem": 2
        }
      ],
      "tamanhos": [
        "38",
        "40",
        "42",
        "44",
        "46"
      ],
      "modelagem": "Baggy",
      "tecido": "Ripstop de algodão",
      "descricaoCurta": "Cargo de perna larga em ripstop, com dois bolsos laterais com lapela e cós com passantes.",
      "descricao": "Modelagem baggy, solta da coxa até a barra, para usar com a barra acumulando sobre o tênis.\n\nO ripstop tem a trama quadriculada que segura rasgos e deixa o tecido mais firme.",
      "caracteristicas": [
        "Tecido ripstop com trama quadriculada",
        "Dois bolsos cargo com lapela e botão de pressão",
        "Bolsos traseiros com lapela"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Baggy"
        },
        {
          "rotulo": "Tecido",
          "valor": "Ripstop de algodão"
        },
        {
          "rotulo": "Fechamento",
          "valor": "Zíper e botão"
        },
        {
          "rotulo": "Bolsos",
          "valor": "6"
        }
      ],
      "medidas": null,
      "preco": 159.9,
      "precoAnterior": 199.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "cargo",
        "baggy",
        "ripstop",
        "larga"
      ],
      "adicionadoEm": "2026-10-25",
      "demo": true
    },
    {
      "id": "calca-parachute-nylon",
      "codigo": "LT-002",
      "nome": "Calça parachute de nylon com cordão",
      "categoria": "calcas-cargo",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/parachute-chumbo-1200.webp",
          "pequena": "assets/img/produtos/exemplos/parachute-chumbo-600.webp",
          "alt": "Calça parachute de nylon chumbo, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/parachute-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/parachute-preto-600.webp",
          "alt": "Calça parachute de nylon preta, frente"
        }
      ],
      "cores": [
        {
          "nome": "Chumbo",
          "hex": "#4a4c50",
          "imagem": 0
        },
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Ampla",
      "tecido": "Nylon tactel",
      "descricaoCurta": "Calça leve de nylon com cós de elástico, recortes no joelho e cordão de ajuste na barra.",
      "descricao": "O cordão na barra deixa usar solta ou franzida no tornozelo. O nylon é leve e seca rápido.",
      "caracteristicas": [
        "Cós de elástico com cordão",
        "Cordão com trava na barra",
        "Recorte articulado no joelho"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Ampla"
        },
        {
          "rotulo": "Tecido",
          "valor": "Nylon tactel"
        },
        {
          "rotulo": "Cós",
          "valor": "Elástico com cordão"
        }
      ],
      "medidas": null,
      "preco": 129.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "parachute",
        "nylon",
        "cordão",
        "tactel"
      ],
      "adicionadoEm": "2026-10-24",
      "demo": true
    },
    {
      "id": "calca-cargo-sarja-reta",
      "codigo": "LT-003",
      "nome": "Calça cargo de sarja reta",
      "categoria": "calcas-cargo",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/sarja-caqui-1200.webp",
          "pequena": "assets/img/produtos/exemplos/sarja-caqui-600.webp",
          "alt": "Calça cargo de sarja reta caqui, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/sarja-caqui-costas-1200.webp",
          "pequena": "assets/img/produtos/exemplos/sarja-caqui-costas-600.webp",
          "alt": "Calça cargo de sarja reta caqui, costas"
        },
        {
          "src": "assets/img/produtos/exemplos/sarja-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/sarja-preto-600.webp",
          "alt": "Calça cargo de sarja reta preta, frente"
        }
      ],
      "cores": [
        {
          "nome": "Caqui",
          "hex": "#c2ae8a",
          "imagem": 0
        },
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 2
        }
      ],
      "tamanhos": [
        "38",
        "40",
        "42",
        "44",
        "46"
      ],
      "modelagem": "Reta",
      "tecido": "Sarja 100% algodão",
      "descricaoCurta": "Cargo de corte reto em sarja de algodão, a mais fácil de combinar do lote.",
      "descricao": "Perna reta, nem justa nem larga. Funciona com camiseta, camisa ou overshirt.",
      "caracteristicas": [
        "Sarja 100% algodão",
        "Corte reto",
        "Bolsos cargo com lapela"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Reta"
        },
        {
          "rotulo": "Tecido",
          "valor": "Sarja 100% algodão"
        },
        {
          "rotulo": "Fechamento",
          "valor": "Zíper e botão"
        }
      ],
      "medidas": null,
      "preco": 139.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "cargo",
        "sarja",
        "reta",
        "caqui",
        "bege"
      ],
      "adicionadoEm": "2026-10-09",
      "demo": true
    },
    {
      "id": "calca-cargo-jogger",
      "codigo": "LT-004",
      "nome": "Calça cargo jogger com punho",
      "categoria": "calcas-cargo",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/jogger-oliva-1200.webp",
          "pequena": "assets/img/produtos/exemplos/jogger-oliva-600.webp",
          "alt": "Calça cargo jogger oliva, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/jogger-chumbo-1200.webp",
          "pequena": "assets/img/produtos/exemplos/jogger-chumbo-600.webp",
          "alt": "Calça cargo jogger chumbo, frente"
        }
      ],
      "cores": [
        {
          "nome": "Oliva",
          "hex": "#5b5f3e",
          "imagem": 0
        },
        {
          "nome": "Chumbo",
          "hex": "#4a4c50",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Jogger",
      "tecido": "Sarja com elastano",
      "descricaoCurta": "Cargo com cós de elástico e punho canelado na barra, para usar com o tornozelo à mostra.",
      "descricao": "O punho segura a barra no tornozelo e o elastano deixa o tecido mais confortável no dia a dia.",
      "caracteristicas": [
        "Punho canelado na barra",
        "Cós de elástico com cordão",
        "Sarja com elastano"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Jogger"
        },
        {
          "rotulo": "Tecido",
          "valor": "Sarja com elastano"
        },
        {
          "rotulo": "Cós",
          "valor": "Elástico com cordão"
        }
      ],
      "medidas": null,
      "preco": 119.9,
      "precoAnterior": 149.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "jogger",
        "cargo",
        "punho",
        "elástico"
      ],
      "adicionadoEm": "2026-10-12",
      "demo": true
    },
    {
      "id": "calca-cargo-wide-leg",
      "codigo": "LT-005",
      "nome": "Calça cargo wide leg",
      "categoria": "calcas-cargo",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/wide-cafe-1200.webp",
          "pequena": "assets/img/produtos/exemplos/wide-cafe-600.webp",
          "alt": "Calça cargo wide leg café, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/wide-cru-1200.webp",
          "pequena": "assets/img/produtos/exemplos/wide-cru-600.webp",
          "alt": "Calça cargo wide leg cru, frente"
        }
      ],
      "cores": [
        {
          "nome": "Café",
          "hex": "#5a4433",
          "imagem": 0
        },
        {
          "nome": "Cru",
          "hex": "#e4ddcc",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "38",
        "40",
        "42",
        "44",
        "46"
      ],
      "modelagem": "Wide leg",
      "tecido": "Sarja pesada",
      "descricaoCurta": "Cargo de perna bem aberta em sarja pesada, que mantém o caimento reto até o chão.",
      "descricao": "A sarja mais grossa dá estrutura à perna larga. Combina com camiseta boxy por dentro ou por fora.",
      "caracteristicas": [
        "Perna wide leg",
        "Sarja pesada",
        "Bolsos cargo com lapela"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Wide leg"
        },
        {
          "rotulo": "Tecido",
          "valor": "Sarja pesada"
        },
        {
          "rotulo": "Fechamento",
          "valor": "Zíper e botão"
        }
      ],
      "medidas": null,
      "preco": 169.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "wide",
        "cargo",
        "larga",
        "marrom"
      ],
      "adicionadoEm": "2026-10-26",
      "demo": true
    },
    {
      "id": "camiseta-oversized-algodao",
      "codigo": "LT-006",
      "nome": "Camiseta oversized 100% algodão",
      "categoria": "camisetas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/oversized-offwhite-1200.webp",
          "pequena": "assets/img/produtos/exemplos/oversized-offwhite-600.webp",
          "alt": "Camiseta oversized off-white"
        },
        {
          "src": "assets/img/produtos/exemplos/oversized-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/oversized-preto-600.webp",
          "alt": "Camiseta oversized preta"
        },
        {
          "src": "assets/img/produtos/exemplos/oversized-oliva-1200.webp",
          "pequena": "assets/img/produtos/exemplos/oversized-oliva-600.webp",
          "alt": "Camiseta oversized oliva"
        }
      ],
      "cores": [
        {
          "nome": "Off-white",
          "hex": "#e9e5da",
          "imagem": 0
        },
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 1
        },
        {
          "nome": "Oliva",
          "hex": "#5b5f3e",
          "imagem": 2
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Oversized",
      "tecido": "Malha 100% algodão",
      "descricaoCurta": "Ombro caído, manga mais longa e corpo largo. A base para qualquer cargo.",
      "descricao": "Malha de algodão com gola canelada. O ombro caído e o corpo largo dão o caimento oversized sem precisar subir de tamanho.",
      "caracteristicas": [
        "Ombro caído",
        "Gola canelada",
        "Três cores"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Oversized"
        },
        {
          "rotulo": "Tecido",
          "valor": "Malha 100% algodão"
        },
        {
          "rotulo": "Gola",
          "valor": "Careca canelada"
        }
      ],
      "medidas": null,
      "preco": 59.9,
      "precoAnterior": 79.9,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "camiseta",
        "oversized",
        "básica",
        "algodão"
      ],
      "adicionadoEm": "2026-10-14",
      "demo": true
    },
    {
      "id": "camiseta-boxy-malha-pesada",
      "codigo": "LT-007",
      "nome": "Camiseta boxy de malha pesada",
      "categoria": "camisetas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/boxy-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/boxy-preto-600.webp",
          "alt": "Camiseta boxy preta, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/boxy-preto-costas-1200.webp",
          "pequena": "assets/img/produtos/exemplos/boxy-preto-costas-600.webp",
          "alt": "Camiseta boxy preta, costas"
        },
        {
          "src": "assets/img/produtos/exemplos/boxy-mescla-1200.webp",
          "pequena": "assets/img/produtos/exemplos/boxy-mescla-600.webp",
          "alt": "Camiseta boxy cinza mescla"
        }
      ],
      "cores": [
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 0
        },
        {
          "nome": "Cinza mescla",
          "hex": "#9a9a98",
          "imagem": 2
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Boxy",
      "tecido": "Malha pesada de algodão",
      "descricaoCurta": "Corpo quadrado e mais curto, em malha encorpada que não marca o corpo.",
      "descricao": "O corte boxy é largo e um pouco mais curto que a oversized, bom para usar com calça de cintura alta.",
      "caracteristicas": [
        "Malha encorpada",
        "Corpo quadrado e mais curto",
        "Barra com costura dupla"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Boxy"
        },
        {
          "rotulo": "Tecido",
          "valor": "Malha pesada de algodão"
        }
      ],
      "medidas": null,
      "preco": 74.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "boxy",
        "camiseta",
        "pesada",
        "heavyweight"
      ],
      "adicionadoEm": "2026-10-12",
      "demo": true
    },
    {
      "id": "camiseta-manga-longa-oversized",
      "codigo": "LT-008",
      "nome": "Camiseta manga longa oversized",
      "categoria": "camisetas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/mangalonga-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/mangalonga-preto-600.webp",
          "alt": "Camiseta manga longa oversized preta"
        },
        {
          "src": "assets/img/produtos/exemplos/mangalonga-offwhite-1200.webp",
          "pequena": "assets/img/produtos/exemplos/mangalonga-offwhite-600.webp",
          "alt": "Camiseta manga longa oversized off-white"
        }
      ],
      "cores": [
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 0
        },
        {
          "nome": "Off-white",
          "hex": "#e9e5da",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Oversized",
      "tecido": "Malha de algodão",
      "descricaoCurta": "Manga longa com punho canelado e corpo oversized, para os dias mais frios.",
      "descricao": "Funciona sozinha ou por baixo de uma overshirt aberta.",
      "caracteristicas": [
        "Punho canelado",
        "Ombro caído",
        "Duas cores"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Oversized"
        },
        {
          "rotulo": "Tecido",
          "valor": "Malha de algodão"
        }
      ],
      "medidas": null,
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
        "manga longa",
        "oversized",
        "camiseta"
      ],
      "adicionadoEm": "2026-10-08",
      "demo": true
    },
    {
      "id": "camiseta-basica-mescla",
      "codigo": "LT-009",
      "nome": "Camiseta básica cinza mescla",
      "categoria": "camisetas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/basica-mescla-1200.webp",
          "pequena": "assets/img/produtos/exemplos/basica-mescla-600.webp",
          "alt": "Camiseta básica cinza mescla"
        }
      ],
      "cores": [
        {
          "nome": "Cinza mescla",
          "hex": "#9a9a98",
          "imagem": 0
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Regular",
      "tecido": "Malha mescla",
      "descricaoCurta": "Camiseta de corte regular em malha mescla, para o dia a dia.",
      "descricao": "Corte tradicional, sem ombro caído.",
      "caracteristicas": [
        "Corte regular",
        "Malha mescla"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Regular"
        },
        {
          "rotulo": "Tecido",
          "valor": "Malha mescla"
        }
      ],
      "medidas": null,
      "preco": 39.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "esgotado",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "básica",
        "cinza",
        "camiseta"
      ],
      "adicionadoEm": "2026-09-30",
      "demo": true
    },
    {
      "id": "camisa-overshirt-sarja",
      "codigo": "LT-010",
      "nome": "Camisa overshirt de sarja com bolsos",
      "categoria": "camisas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/overshirt-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/overshirt-preto-600.webp",
          "alt": "Camisa overshirt preta, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/overshirt-oliva-1200.webp",
          "pequena": "assets/img/produtos/exemplos/overshirt-oliva-600.webp",
          "alt": "Camisa overshirt oliva, frente"
        },
        {
          "src": "assets/img/produtos/exemplos/overshirt-oliva-costas-1200.webp",
          "pequena": "assets/img/produtos/exemplos/overshirt-oliva-costas-600.webp",
          "alt": "Camisa overshirt oliva, costas"
        }
      ],
      "cores": [
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 0
        },
        {
          "nome": "Oliva",
          "hex": "#5b5f3e",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Oversized",
      "tecido": "Sarja de algodão",
      "descricaoCurta": "Camisa grossa de sarja para usar aberta como jaqueta leve, com dois bolsos no peito.",
      "descricao": "A overshirt fica entre a camisa e a jaqueta: dá para fechar ou usar aberta sobre a camiseta.",
      "caracteristicas": [
        "Dois bolsos com lapela no peito",
        "Sarja grossa",
        "Punhos com botão"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Oversized"
        },
        {
          "rotulo": "Tecido",
          "valor": "Sarja de algodão"
        },
        {
          "rotulo": "Fechamento",
          "valor": "Botões"
        }
      ],
      "medidas": null,
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
        "overshirt",
        "camisa",
        "sarja",
        "jaqueta"
      ],
      "adicionadoEm": "2026-10-16",
      "demo": true
    },
    {
      "id": "camisa-listrada-manga-curta",
      "codigo": "LT-011",
      "nome": "Camisa listrada de manga curta",
      "categoria": "camisas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/listrada-areia-1200.webp",
          "pequena": "assets/img/produtos/exemplos/listrada-areia-600.webp",
          "alt": "Camisa listrada areia de manga curta"
        },
        {
          "src": "assets/img/produtos/exemplos/listrada-marinho-1200.webp",
          "pequena": "assets/img/produtos/exemplos/listrada-marinho-600.webp",
          "alt": "Camisa listrada marinho de manga curta"
        }
      ],
      "cores": [
        {
          "nome": "Areia listrada",
          "hex": "#d8ccb4",
          "imagem": 0
        },
        {
          "nome": "Marinho listrada",
          "hex": "#2f3a52",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Ampla",
      "tecido": "Viscose",
      "descricaoCurta": "Camisa leve de manga curta com listras verticais e barra arredondada.",
      "descricao": "Caimento solto, boa para usar aberta sobre uma camiseta ou fechada no calor.",
      "caracteristicas": [
        "Listras verticais",
        "Barra arredondada",
        "Tecido leve"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Ampla"
        },
        {
          "rotulo": "Tecido",
          "valor": "Viscose"
        },
        {
          "rotulo": "Fechamento",
          "valor": "Botões"
        }
      ],
      "medidas": null,
      "preco": 89.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "camisa",
        "listrada",
        "verão",
        "manga curta"
      ],
      "adicionadoEm": "2026-10-15",
      "demo": true
    },
    {
      "id": "bermuda-cargo-ripstop",
      "codigo": "LT-012",
      "nome": "Bermuda cargo ripstop",
      "categoria": "bermudas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/bermuda-preto-1200.webp",
          "pequena": "assets/img/produtos/exemplos/bermuda-preto-600.webp",
          "alt": "Bermuda cargo ripstop preta"
        },
        {
          "src": "assets/img/produtos/exemplos/bermuda-caqui-1200.webp",
          "pequena": "assets/img/produtos/exemplos/bermuda-caqui-600.webp",
          "alt": "Bermuda cargo ripstop caqui"
        }
      ],
      "cores": [
        {
          "nome": "Preto",
          "hex": "#1f1f20",
          "imagem": 0
        },
        {
          "nome": "Caqui",
          "hex": "#c2ae8a",
          "imagem": 1
        }
      ],
      "tamanhos": [
        "38",
        "40",
        "42",
        "44",
        "46"
      ],
      "modelagem": "Baggy",
      "tecido": "Ripstop de algodão",
      "descricaoCurta": "Bermuda cargo larga, na altura do joelho, com bolsos laterais com lapela.",
      "descricao": "Mesmo tecido da calça ripstop, em versão para o calor.",
      "caracteristicas": [
        "Comprimento no joelho",
        "Bolsos cargo com lapela",
        "Ripstop de algodão"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Baggy"
        },
        {
          "rotulo": "Tecido",
          "valor": "Ripstop de algodão"
        },
        {
          "rotulo": "Comprimento",
          "valor": "Joelho"
        }
      ],
      "medidas": null,
      "preco": 99.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": true,
      "publicado": true,
      "palavrasChave": [
        "bermuda",
        "cargo",
        "ripstop",
        "verão"
      ],
      "adicionadoEm": "2026-10-11",
      "demo": true
    },
    {
      "id": "bermuda-cargo-nylon",
      "codigo": "LT-013",
      "nome": "Bermuda cargo de nylon com elástico",
      "categoria": "bermudas",
      "imagens": [
        {
          "src": "assets/img/produtos/exemplos/bermuda-nylon-chumbo-1200.webp",
          "pequena": "assets/img/produtos/exemplos/bermuda-nylon-chumbo-600.webp",
          "alt": "Bermuda cargo de nylon chumbo"
        }
      ],
      "cores": [
        {
          "nome": "Chumbo",
          "hex": "#4a4c50",
          "imagem": 0
        }
      ],
      "tamanhos": [
        "P",
        "M",
        "G",
        "GG"
      ],
      "modelagem": "Ampla",
      "tecido": "Nylon tactel",
      "descricaoCurta": "Bermuda leve de nylon com cós de elástico e cordão, para treino ou praia.",
      "descricao": "Seca rápido e não pesa no bolso.",
      "caracteristicas": [
        "Cós de elástico com cordão",
        "Nylon leve",
        "Bolsos cargo"
      ],
      "especificacoes": [
        {
          "rotulo": "Modelagem",
          "valor": "Ampla"
        },
        {
          "rotulo": "Tecido",
          "valor": "Nylon tactel"
        }
      ],
      "medidas": null,
      "preco": 79.9,
      "precoAnterior": null,
      "precoConferidoEm": "2026-10-27",
      "avaliacao": null,
      "linkAfiliado": "",
      "textoBotao": "",
      "disponibilidade": "disponivel",
      "destaque": false,
      "publicado": true,
      "palavrasChave": [
        "bermuda",
        "nylon",
        "praia",
        "treino"
      ],
      "adicionadoEm": "2026-10-05",
      "demo": true
    }
  ]
};
