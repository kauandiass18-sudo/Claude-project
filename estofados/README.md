# Site — higienização de estofados

Site estático (HTML, CSS e JavaScript puro, sem build), pronto para o GitHub
Pages. Abra `index.html` ou publique a pasta como está.

**Alvéa** é um nome provisório. Todos os dados da empresa ficam em um único
arquivo: `assets/js/config.js`.

## Antes de publicar

| O quê | Onde |
|---|---|
| Nome, complemento e apresentação da empresa | `config.js` → `marca` |
| **WhatsApp** (só números: 55 + DDD + número) | `config.js` → `whatsapp` |
| Instagram e e-mail | `config.js` → `instagram`, `email` |
| Cidade, estado e regiões atendidas | `config.js` → `cidade`, `estado`, `regioes` |
| Horário de atendimento | `config.js` → `horario` |
| Razão social e CNPJ (política de privacidade) | `config.js` → `razaoSocial`, `cnpj` |
| Endereço do site (link canônico e compartilhamento) | `config.js` → `dominio` |

Enquanto o `whatsapp` estiver vazio, os botões abrem o WhatsApp com a mensagem
pronta, mas a pessoa precisa escolher o contato. Preencha antes de divulgar.

Com a `cidade` preenchida, o título da página vira “Higienização de Estofados
em {cidade}”, a descrição para o Google menciona a cidade e os dados
estruturados (`LocalBusiness`) passam a informar a área atendida. Para
reforçar o SEO, edite também o `<title>` e a `<meta name="description">` no
topo do `index.html`, que é o que aparece antes de o JavaScript rodar.

## Fotografias

O site está com ilustrações de traço no lugar das fotos. Para trocar:

1. Coloque as fotos em `assets/img/fotos/` (`.webp` ou `.jpg`, cerca de
   1600 px no lado maior, até ~300 KB cada — o [Squoosh](https://squoosh.app)
   resolve isso no navegador).
2. Informe os caminhos em `config.js` → `fotos`:

| Campo | Onde aparece | Formato ideal |
|---|---|---|
| `hero` | primeira dobra | vertical 4:5 |
| `sofas`, `colchoes`, `cadeiras`, `automotivo` | cartões de serviço | horizontal 4:3 |
| `chamada` | chamada final, atrás do texto | horizontal, com espaço livre à esquerda |

## Antes e depois, galeria e depoimentos

- **Antes e depois** (`antesDepois`): duas fotos reais do mesmo estofado, no
  mesmo ângulo e com luz parecida. Sem elas, o comparador mostra uma
  simulação identificada como “Imagem ilustrativa”.
- **Galeria** (`galeria`): só trabalhos reais. A seção aparece sozinha quando
  houver ao menos uma foto. Cada item aceita `antes` (opcional) e `formato`
  (`'alto'` ou `'largo'`) para variar a grade. As fotos abrem ampliadas.
- **Depoimentos** (`depoimentos`): só depoimentos reais, com autorização do
  cliente. A seção fica oculta enquanto a lista estiver vazia.

## Serviços

Os quatro serviços estão no `index.html`, na seção `SERVIÇOS` (cada um é um
`<article class="service">`). O texto em `service__details` aparece no botão
“Conhecer serviço”. Para remover um serviço, apague o bloco e a opção
correspondente no `<select id="f-tipo">` do formulário e o link no rodapé.

## Estrutura

```
estofados/
├── index.html                  Página inicial
├── politica-de-privacidade.html
└── assets/
    ├── js/config.js            ← dados da empresa (edite aqui)
    ├── js/main.js              Interações (menu, comparador, formulário…)
    ├── js/privacidade.js
    ├── css/style.css           Identidade visual
    ├── fonts/                  Manrope e Cormorant Garamond (OFL)
    └── img/                    Ícones, ilustrações e imagem de compartilhamento
```
