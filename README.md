# Minha curadoria · Link na bio de cabelo

Site de **link na bio** pensado para celular, com cara de salão de cabelo:
tratamentos da **Ybera Paris** e achadinhos de cabelo do **Mercado Livre** e
da **Shopee**.

Não tem carrinho, checkout nem pagamento: ao tocar em um produto, a pessoa vai
direto para o **link de afiliado** daquele produto (em uma nova aba).

Feito só com **HTML, CSS e JavaScript puro**. Não precisa instalar nada nem
rodar build.

---

## Estrutura

```
├── index.html            Página inicial: perfil, frases, botões de
│                         achadinhos e vitrine da Ybera Paris
├── mercado-livre.html    Achadinhos do Mercado Livre
├── shopee.html           Achadinhos da Shopee
│
├── data/                 ← É AQUI QUE VOCÊ EDITA
│   ├── perfil.js         Nome, frases, foto e redes sociais
│   ├── ybera.js          Produtos da Ybera Paris (aparecem na página inicial)
│   ├── mercado-livre.js  Produtos do Mercado Livre
│   └── shopee.js         Produtos da Shopee
│
└── assets/
    ├── css/style.css     Visual (cores, fontes, cards, animações)
    ├── js/common.js      Funções compartilhadas
    ├── js/home.js        Monta a página inicial
    ├── js/loja.js        Monta as vitrines (busca, categorias, destaques, cards)
    ├── js/fios.js        Desenha as mechas de cabelo que balançam no fundo
    └── img/
        ├── favicon.svg
        └── produtos/
            ├── ybera/
            ├── mercado-livre/
            └── shopee/
```

No dia a dia, você só mexe na pasta **`data/`** e coloca fotos em
**`assets/img/`**.

---

## 1. Configurar o perfil

Abra `data/perfil.js`:

```js
window.PERFIL = {
  nome: "Maria Souza",
  frases: [
    "Primeira frase que aparece abaixo do nome.",
    "Segunda frase."
  ],
  foto: "assets/img/perfil.jpg",

  redes: [
    { tipo: "instagram", url: "https://instagram.com/seuusuario" },
    { tipo: "tiktok",    url: "https://tiktok.com/@seuusuario" },
    { tipo: "whatsapp",  url: "https://wa.me/5511999999999" },
    { tipo: "email",     url: "mailto:voce@exemplo.com" }
  ],

  avisoAfiliado: "Alguns links são de afiliado: ..."
};
```

- **frases**: aparecem logo abaixo do seu nome, uma por linha. Coloque cada
  frase entre aspas e separe com vírgula.
- **foto**: coloque sua foto ou logo em `assets/img/`, por exemplo
  `assets/img/perfil.jpg`, e informe o caminho. A foto aparece numa moldura
  em arco, então use uma imagem **vertical**. Sem foto, a moldura mostra só
  um ornamento.
- **nome**: aparece em letras serifadas grandes. Vazio, não aparece nada.
- **redes**: aparecem como texto em versalete (INSTAGRAM · TIKTOK).
  Só aparecem as redes com `url` preenchida.
  Os tipos aceitos são `instagram`, `tiktok`, `youtube`, `whatsapp`, `facebook`,
  `pinterest`, `threads`, `x`, `telegram` e `email`.

---

## 2. Adicionar produtos

- **Ybera Paris**: os produtos aparecem direto na **página inicial**, abaixo dos
  botões de achadinhos, numerados na ordem da lista (Nº 01, Nº 02...). Ao tocar no produto, o cliente vai direto para o link
  de afiliado.
- **Mercado Livre e Shopee**: os produtos aparecem nas páginas de achadinhos,
  abertas pelos botões da página inicial.

Cada loja tem seu arquivo em `data/`. Dentro dele há uma lista `produtos: [ ]`.
Cada produto é um bloco entre `{ }`, separado do próximo por **vírgula**:

```js
produtos: [
  {
    nome: "Nome do produto",
    categoria: "Tratamento",
    imagem: "assets/img/produtos/ybera/nome-do-produto.jpg",
    affiliateUrl: "https://www.ybera.com/...",
    destaque: true
  },
  {
    nome: "Outro produto",
    categoria: "Finalização",
    imagem: "assets/img/produtos/ybera/outro-produto.jpg",
    affiliateUrl: "https://www.ybera.com/...",
    destaque: false
  }
]
```

| Campo          | Obrigatório | O que é                                                                  |
| -------------- | ----------- | ------------------------------------------------------------------------ |
| `nome`         | sim         | Nome exibido no card.                                                    |
| `affiliateUrl` | sim         | Seu link de afiliado daquele produto. Precisa começar com `https://`.    |
| `categoria`    | recomendado | Cria automaticamente o botão de filtro da categoria.                    |
| `imagem`       | recomendado | Caminho da foto no projeto ou link `https://` da imagem.                 |
| `preco`        | não         | Preço atual, ex.: `"R$ 283,01"`. Aparece com o rótulo "no Pix".          |
| `precoAntigo`  | não         | Preço antigo, ex.: `"R$ 339,90"`. Aparece riscado, e o selo dourado de desconto (ex.: `-17%`) é calculado sozinho. |
| `destaque`     | não         | `true` coloca o produto também na faixa **Queridinhos do salão**.        |

Produtos sem `nome` ou sem `affiliateUrl` válido não aparecem no site. O aviso
fica no console do navegador (F12).

> **Preços:** o site não se atualiza sozinho. Quando a Ybera mudar um preço,
> edite `preco` e `precoAntigo` no arquivo. O aviso abaixo da lista
> (`notaPrecos`) lembra o cliente de que o valor final é o da loja.

### Fotos dos produtos

- Salve em `assets/img/produtos/<loja>/`, por exemplo
  `assets/img/produtos/shopee/garrafa-termica.jpg`.
- Use imagens **quadradas**, de 400×400 a 800×800 px, em `.jpg` ou `.webp`,
  para o site ficar rápido.
- Use nomes de arquivo sem espaços e sem acentos.
- Se a imagem não carregar, o card mostra um ícone no lugar e continua funcionando.

### Categorias

As categorias são criadas a partir dos produtos. Para definir a ordem dos
botões, use `ordemCategorias`:

```js
ordemCategorias: ["Tratamento", "Limpeza", "Finalização"],
```

Categorias fora da lista aparecem depois, em ordem alfabética. Com apenas uma
categoria, os filtros ficam ocultos.

Cada filtro pode ter um ícone de cabelo. Escolha em `iconesCategorias`:

```js
iconesCategorias: {
  "Progressiva": "liso",
  "Cronograma Capilar": "gota",
  "Antiqueda": "raiz",
  "Kids": "coracao"
},
```

Os ícones disponíveis são `liso`, `gota`, `raiz`, `coracao`, `ondas` e `brilho`.

### Ybera Paris: código de parceiro automático

Links de `ybera.com` que não tiverem `parceiro=` recebem
automaticamente **`?parceiro=19285`**. Um link que já tem o código não é
alterado. Para trocar o código, edite `parametrosAfiliado` em `data/ybera.js`.

### Link geral da loja (opcional)

Cada loja tem `linkLoja`. Quando preenchido, aparece um botão no fim da página,
como “Visitar loja oficial Ybera”. Na Ybera ele já vem com
`https://www.ybera.com?parceiro=19285`. No Mercado Livre e na Shopee ele começa
vazio, então o botão fica oculto até você colocar o link da sua vitrine.

### Loja sem produtos

Enquanto a lista estiver vazia, a página mostra “Em breve, novidades por aqui”.

---

## 3. Ver o site no computador

Abra o `index.html` no navegador com dois cliques. Ou, para simular um
servidor, rode na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`. Para ver como fica no celular, use o
modo de dispositivo do navegador: F12 e depois o ícone de celular.

---

## 4. Publicar (grátis)

**GitHub Pages**

1. No repositório, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Escolha a branch e a pasta `/ (root)` e salve.
4. Em alguns minutos o site fica disponível em
   `https://<seu-usuario>.github.io/<repositorio>/`.

**Netlify ou Vercel**: importe o repositório. Não há comando de build e a
pasta de publicação é a raiz.

Depois, coloque o endereço do site na bio do Instagram ou TikTok.

---

## 5. Personalizar o visual

As cores e fontes principais ficam no início de `assets/css/style.css`,
em `:root`:

```css
--fundo: #f5ebe2;     /* creme nude do fundo */
--tinta: #33211a;     /* cacau: cor do texto */
--mel: #b9824a;       /* dourado mel dos detalhes */
--ml-1: #f3d47c;      /* amarelo Mercado Livre */
--shopee-1: #c0633c;  /* laranja Shopee */
--fonte-luxo: "Bodoni Moda", ...;  /* títulos */
--fonte-ui: "Jost", ...;           /* textos */
```

As mechas de cabelo do fundo são desenhadas por `assets/js/fios.js`. Elas
ficam paradas para quem ativou "reduzir movimento" no celular.

---

## Detalhes técnicos

- **Mobile first**: pensado para telas a partir de 320 px. Em telas grandes, a
  lista vira duas colunas.
- **Rápido**: sem frameworks, imagens com carregamento preguiçoso (`lazy`) e
  fontes com `display=swap`.
- **Seguro**: links só são aceitos com `http(s)`, e textos são inseridos como
  texto, nunca como HTML.
- **Links de afiliado**: abrem em nova aba com `rel="sponsored noopener"`,
  a marcação recomendada para links patrocinados.
- **Acessível**: navegação por teclado, rótulos para leitores de tela e
  respeito à preferência de reduzir animações.
