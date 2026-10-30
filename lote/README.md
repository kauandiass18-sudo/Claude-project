# LOTE · vitrine de streetwear da Shopee

Vitrine de afiliados só de roupa: **calças cargo, camisetas, camisas e
bermudas**. Identidade de pôster de streetwear: fundo preto, tipografia
superestreita em caixa-alta, etiquetas em fonte mono como em ficha técnica e
peças apresentadas sobre placas cinza-concreto. Uma única cor de ação
(ultramar) nos botões que levam à Shopee.

Não tem carrinho nem checkout. O fluxo é:

1. o visitante descobre a peça na vitrine (por categoria, tamanho, cor,
   modelagem, preço ou busca);
2. abre a página da peça (fotos, cores, tamanhos, tecido, modelagem, medidas);
3. toca em **Ver produto na Shopee**;
4. a página da peça abre na Shopee pelo **seu link de afiliado**, sem nenhuma
   alteração no endereço;
5. cor, tamanho e compra são escolhidos na Shopee.

Feito com **HTML, CSS e JavaScript puro**, sem build e sem bibliotecas (só as
fontes do Google Fonts).

> **Peças de exemplo.** O catálogo vem com 13 peças de demonstração (etiqueta
> “Exemplo”, sem link de compra). As imagens são **desenhos técnicos
> ilustrativos**, não fotos de produtos reais. Uma faixa no topo avisa o
> visitante. Para tirar tudo do ar: no painel, **Peças → Remover exemplos →
> Publicar**, ou `exibirExemplos: false` em `config/marca.js`.

---

## O que tem no site

- **Início**: pôster com o título ocupando a largura da tela, placa da peça
  em destaque trocando sozinha (com barra de progresso), faixa corrida que
  acelera com a rolagem, índice de categorias com foto que segue o cursor,
  “O lote” em rolagem horizontal fixada, combinações (looks), novidades,
  vistos recentemente e “como funciona”.
- **Tudo / categorias** (`catalogo.html`): busca sem acentos, chips de
  categoria, filtros de **tamanho, cor, modelagem**, faixa de preço,
  “só com desconto”, “ocultar esgotados” e ordenação. O estado fica no
  endereço (dá para compartilhar e usar o voltar). Só aparecem filtros que
  os dados permitem.
- **Peça** (`produto.html?p=id`): fotos empilhadas no computador e em
  carrossel no celular, ampliação com zoom, cores que trocam a foto,
  tamanhos da última conferência, ficha (modelagem, tecido, código), tabela
  de medidas opcional, botão para a Shopee, favoritos, compartilhar e
  “combina com”. No celular, uma barra fixa de compra aparece ao rolar.
- **Favoritos**, **Como funciona** (com tamanhos e medidas e transparência
  sobre afiliados), **Privacidade** e página de erro.

---

## Estrutura

```
lote/
├── index.html  catalogo.html  produto.html  favoritos.html
├── como-funciona.html  privacidade.html  404.html
├── config/marca.js       ← nome, cores, fontes, textos, menu, rodapé, contato
├── data/catalogo.js      ← categorias, combinações e peças
├── admin/                Painel administrativo
├── assets/css/vitrine.css
├── assets/js/            nucleo.js (dados), interface.js (componentes),
│                         um arquivo por página
├── assets/img/marca/     ícones e imagem de compartilhamento
├── assets/img/produtos/  fotos das peças
└── ferramentas/verificar-catalogo.mjs
```

---

## 1. Painel administrativo (`/admin`)

Abra `https://seu-site/lote/admin/`. O painel grava as alterações no
repositório do GitHub em **um único commit** (catálogo, fotos otimizadas e
`sitemap.xml`), e o GitHub Pages atualiza o site em cerca de um minuto.

Crie um token uma vez em
<https://github.com/settings/personal-access-tokens/new> (*Fine-grained*):
acesso só ao repositório da vitrine e permissão **Contents: Read and write**.
O token fica só no navegador e nunca é gravado nos arquivos do site.

No painel dá para cadastrar e editar peças com prévia do card ao vivo,
enviar fotos (otimizadas no navegador em 1200 e 600 px), definir cores (tom
e foto de cada cor), tamanhos (com atalhos P–GG, 38–48…), modelagem, tecido,
tabela de medidas, preço conferido, link de afiliado (com validação e
“Testar link”), destacar, publicar/despublicar, reordenar, montar
combinações, conferir todos os links e publicar. Tudo fica em rascunho no
navegador até a publicação. Há também um modo sem conexão que baixa o
arquivo `data/catalogo.js`.

---

## 2. Campos de cada peça (`data/catalogo.js`)

| Campo | O que é |
| --- | --- |
| `id` | Identificador único (`produto.html?p=id`). |
| `codigo` | Código curto exibido na placa, ex.: `LT-014`. Vazio = número pela ordem. |
| `nome`, `categoria` | Nome completo e `id` da categoria. |
| `imagens` | Lista de `{ src, pequena, alt }`. A primeira é a capa; a segunda aparece ao passar o mouse no card. |
| `cores` | Lista de `{ nome, hex, imagem }`. `imagem` é a posição da foto daquela cor (0 = primeira). |
| `tamanhos` | Ex.: `["P","M","G","GG"]` ou `["38","40","42"]`. São ordenados sozinhos. |
| `modelagem`, `tecido` | Ex.: `"Baggy"`, `"Ripstop de algodão"`. Viram filtro e ficha. |
| `medidas` | Opcional: `{ colunas: [...], linhas: [[...]] }`, copiado da Shopee. |
| `descricaoCurta`, `descricao`, `caracteristicas`, `especificacoes` | Textos da peça. |
| `preco`, `precoAnterior`, `precoConferidoEm` | Só valores conferidos. O desconto é calculado. |
| `avaliacao` | `{ nota, quantidade, conferidoEm }` da Shopee, ou `null`. |
| `linkAfiliado` | Seu link de afiliado desta peça, completo. Usado exatamente como está. |
| `disponibilidade`, `destaque`, `publicado`, `palavrasChave`, `adicionadoEm`, `demo` | Controle de exibição. |

Sem link válido, a peça mostra “Link da Shopee em atualização” e não ganha
botão de compra. Editou à mão? Rode `node ferramentas/verificar-catalogo.mjs`.

**Fotos**: use fotos reais do vendedor ou de uso permitido. Fundo branco
funciona melhor: ele some na placa cinza (`imagens.integrarFundoBranco`).
Para fotos com modelo, use `imagens.ajuste: "cover"`.

---

## 3. Marca (`config/marca.js`)

Nome e complemento do logotipo, paleta, fontes, linhas do título da primeira
dobra (`textos.hero.linhas`), textos da faixa corrida, botões e avisos,
navegação, rodapé, contato e `site.url`. Contato e responsável só aparecem
quando preenchidos; use apenas dados reais.

---

## 4. Publicar

**GitHub Pages**: *Settings → Pages*, publique a branch de
`admin.github.branch`. A vitrine fica em
`https://<usuario>.github.io/<repositorio>/lote/`.
**Netlify / Vercel / Hostinger**: publique a pasta `lote/` sem build.
Localmente: `python3 -m http.server 8000` dentro de `lote/`.

---

## Detalhes técnicos

- Links de afiliado com `target="_blank"` e `rel="sponsored noopener"`,
  endereço sem alterações; evento `clique_afiliado` em `window.dataLayer`.
- Animações só com `transform` e `opacity`, desligadas com
  `prefers-reduced-motion` (a placa para de trocar, a faixa para, o lote vira
  rolagem comum).
- Fotos em WebP com `srcset` e carregamento preguiçoso; espaço reservado
  para não haver saltos de layout.
- HTML semântico, “pular para o conteúdo”, foco visível, busca com setas,
  diálogos nativos com Esc.
- Sem cookies próprios e sem coleta de dados: favoritos e vistos ficam no
  `localStorage` do visitante.
