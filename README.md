# Carla Dias · Link na bio de cabelo

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
    ├── js/fios.js        Desenha as mechas de cabelo do fundo
    ├── js/animacao.js    Faz textos, fotos e produtos subirem de baixo ao aparecer
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
  botões de achadinhos, na ordem da lista e com a categoria em dourado. Ao
  tocar no produto, o cliente vai direto para o link de afiliado.
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
| `oQueE`        | não         | Frase curta sobre o que é o produto, abaixo do nome.                     |
| `esgotado`     | não         | `true` esconde o produto (ou mostra com selo, se `mostrarEsgotados`).    |
| `destaque`     | não         | `true` coloca o produto também na faixa **Queridinhos do salão**.        |

Produtos sem `nome` ou sem `affiliateUrl` válido não aparecem no site. O aviso
fica no console do navegador (F12).

> **O catálogo da Ybera se atualiza sozinho.** Todo dia às 6h (Brasília), a
> tarefa `.github/workflows/catalogo-ybera.yml` roda `scripts/catalogo-ybera.mjs`:
> lê o mapa da loja (cerca de 300 produtos), abre cada produto e traz nome,
> o que é, categoria, fotos, preço riscado, preço no Pix e estoque. Produtos
> novos entram, preços mudam e os que saírem da loja saem do site. Os dados
> brutos ficam em `data/ybera-catalogo.json` e a lista do site em `data/ybera.js`.
>
> - As categorias da loja são agrupadas em 5 categorias do site: Progressiva e
>   Pós-Progressiva, Cronogramas Capilares, Finalizadores, Equipamentos
>   Profissionais e Shampoo (regras em `GRUPOS`, no script; o nome do produto
>   vale primeiro). O que não se encaixa vai para "Outros", que fica escondido.
> - Na página inicial, a vitrine tem uma prateleira por categoria, com os
>   produtos lado a lado, para deslizar (no computador, com setas). Cada
>   prateleira mostra até `produtosPorPrateleira` produtos (hoje 10) e termina
>   num cartão "Ver todos os N". "Ver todos" abre só aquela categoria, em
>   vitrine de dois por linha. Os títulos curtos das prateleiras ("Progressiva",
>   "Cronogramas"...) ficam em `rotulosCategorias`, em `data/ybera.js`.
> - Fotos: chegam da loja em JPG e `scripts/fotos-ybera.py` as transforma em
>   WebP (umas 6 vezes mais leves). O mesmo script anota em
>   `data/ybera-fotos.js` as fotos que não têm fundo branco: elas vão para o
>   fim das prateleiras e dos Queridinhos, que começam pelas fotos mais limpas.
>   Os Queridinhos alternam as categorias (um de cada por vez).
> - Preço: o valor grande é o do Pix; o preço maior da loja aparece como
>   "ou R$ X no cartão", sem riscar. Só desconto de 10% ou mais
>   (`descontoMinimoSelo`) vira promoção, com preço riscado e selo "-10%".
> - Produtos com certas palavras no nome ficam escondidos com
>   `ocultarProdutosCom`, em `data/ybera.js` (hoje: Black Diva).
> - Categorias inteiras podem ser escondidas em `ocultarCategorias`, em
>   `data/ybera.js` (hoje: Outros). Produtos com `destaque: true` continuam
>   nos Queridinhos mesmo com a categoria escondida.
> - Produtos esgotados ficam escondidos (`mostrarEsgotados: false`) e voltam
>   sozinhos quando o estoque voltar.
> - `destaque: true` é a única mudança feita à mão na lista que se mantém: o
>   produto aparece em "Queridinhos do salão".
> - Se a loja não puder ser lida, nada é mudado. Para rodar na hora: aba
>   **Actions** → *Atualizar catálogo da Ybera* → *Run workflow*.
>
> A tarefa agendada só roda na branch principal do repositório. Os produtos do
> Mercado Livre e da Shopee continuam com preço editado à mão.

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

Enquanto a lista do Mercado Livre ou da Shopee estiver vazia:

- o botão dela **não aparece** na página inicial (volta sozinho quando você
  colocar o primeiro produto). Sem nenhum botão, o link "Achadinhos" do menu
  vira "Categorias";
- a página da loja mostra um bloco só, “Em breve…”, com o botão
  “Enquanto isso, veja a vitrine Ybera” (e “Me siga no Instagram”, se o
  Instagram estiver preenchido em `data/perfil.js`).

O botão **“Feche sua parceria aqui”** também só aparece depois que você
preencher `linkParceria` em `data/perfil.js`.

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

O visual segue um sistema de três cores, definido no início de
`assets/css/style.css`, em `:root`:

```css
--fundo: #FAF8F5;     /* off-white: cor dominante (cerca de 70%) */
--grafite: #1C1B19;   /* textos, títulos e botão principal (cerca de 25%) */
--ouro: #8A6A3B;      /* o único dourado: só em detalhes (cerca de 5%) */
--fonte-titulo: "Bodoni Moda", ...;  /* títulos e preços */
--fonte-texto: "Jost", ...;          /* textos */
```

Regras do sistema:

- **Dourado é joia:** fios, ícones, "no Pix", desconto, setas e hover. Nunca
  preenche áreas grandes nem usa degradê.
- **Botão principal:** fundo grafite, texto branco, detalhe dourado
  ("Feche sua parceria aqui" e "Conhecer a loja oficial").
- **Botões secundários:** fundo branco, texto grafite, borda fina (lojas,
  "Ver todos", "Todas as categorias").
- **Cards de produto:** brancos, borda discreta, sombra suave, foto grande,
  nome em até 3 linhas, preço em Bodoni e uma setinha dourada no canto da foto.
  Iguais em todas as páginas.
- **Caixa-alta** só no menu e nos contadores ("20 produtos"); o resto do texto
  é normal, para ler fácil.
- **Toque:** tudo que se toca tem pelo menos 44px de altura.
- **Movimento:** as peças sobem 24px e aparecem em 0,7s, sem quique. Cards
  escondidos para o lado da fileira não animam.

Os fios de cabelo do fundo (`assets/js/fios.js`) são só textura, em grafite
bem claro, com raros fios dourados. Eles balançam só nos primeiros segundos e
depois param, para não gastar bateria.

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
