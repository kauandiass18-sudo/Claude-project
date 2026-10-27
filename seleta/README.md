# Seleta · vitrine de produtos da Shopee

Vitrine de afiliados com identidade própria: página inicial editorial,
catálogo com busca, categorias, filtros e ordenação, página de cada produto
com galeria e ampliação, favoritos, páginas de transparência e privacidade,
e um **painel administrativo** que publica as alterações direto no site.

Não tem carrinho nem checkout. O fluxo é:

1. o visitante descobre o produto na vitrine;
2. abre a página do produto;
3. toca em **Ver produto na Shopee**;
4. a página do produto abre na Shopee pelo **seu link de afiliado**, sem
   nenhuma alteração no endereço;
5. a compra acontece na Shopee.

Feito com **HTML, CSS e JavaScript puro**. Não precisa instalar nada nem
rodar build. Nenhuma biblioteca externa: só as fontes do Google Fonts.

> **Produtos de exemplo.** O catálogo vem com 13 produtos de demonstração
> (etiqueta “Exemplo”, sem link de compra, fotos ilustrativas renderizadas
> em 3D). Uma faixa no topo avisa o visitante. Para tirar tudo do ar: no
> painel, **Produtos → Remover exemplos → Publicar**. Ou, em
> `config/marca.js`, use `exibirExemplos: false`.

---

## Estrutura

```
seleta/
├── index.html            Início: primeira dobra, categorias, destaques,
│                         seleções, novidades, vistos e “como funciona”
├── catalogo.html         Catálogo (?categoria= ?q= ?ordem= ?selecao= …)
├── produto.html          Página do produto (?p=identificador)
├── favoritos.html        Favoritos do visitante
├── como-funciona.html    Como funciona e transparência sobre afiliados
├── privacidade.html      Política de privacidade
├── 404.html              Página de erro
│
├── config/marca.js       ← nome, logo, cores, fontes, textos, menu,
│                           rodapé, contato e repositório do painel
├── data/catalogo.js      ← categorias, seleções e produtos
│
├── admin/                Painel administrativo
├── assets/
│   ├── css/vitrine.css   Sistema visual (tokens no início do arquivo)
│   ├── js/               nucleo.js (dados), interface.js (componentes)
│   │                     e um arquivo por página
│   └── img/
│       ├── marca/        favicon, ícones e imagem de compartilhamento
│       └── produtos/     fotos dos produtos
└── ferramentas/verificar-catalogo.mjs
```

Os dados ficam separados dos componentes: trocar produtos, textos e cores não
exige mexer no HTML, no CSS nem no JavaScript.

---

## 1. Painel administrativo (`/admin`)

Abra `https://seu-site/seleta/admin/` (ou `admin/index.html` localmente).

### Publicar direto no site (recomendado)

O painel grava as alterações no repositório do GitHub que hospeda o site.
Cada publicação vira **um único commit** com o catálogo, as fotos novas e o
`sitemap.xml`. O GitHub Pages atualiza o site em cerca de um minuto.

Crie um token uma vez:

1. Acesse <https://github.com/settings/personal-access-tokens/new>
   (*Fine-grained token*).
2. **Repository access** → *Only select repositories* → escolha só o
   repositório da vitrine.
3. **Repository permissions** → **Contents: Read and write**. Nada mais.
4. Gere, copie e cole no painel.

O token fica **só no navegador** (na aba, ou no aparelho se você marcar
“Lembrar neste dispositivo”) e nunca é gravado nos arquivos do site. A
página do painel é pública, mas sem um token com permissão de escrita ela
não consegue alterar nada: quem protege o catálogo é o próprio GitHub. Se o
token vazar, revogue-o na mesma página do GitHub.

O repositório, a branch e a pasta vêm de `config/marca.js` → `admin.github`
e podem ser ajustados na tela de entrada.

### O que dá para fazer

- **Produtos**: cadastrar e editar com prévia do card ao vivo e checklist,
  publicar/despublicar, destacar, reordenar (arrastando ou com as setas),
  remover e remover os exemplos.
- **Fotos**: enviar do computador ou celular. O painel otimiza no navegador
  (WebP em 1200 px e 600 px) e envia junto com a publicação. Fotos que
  deixam de ser usadas são apagadas do repositório.
- **Link de afiliado**: validação (endereço completo, domínio da Shopee,
  link repetido em outro produto) e botão **Testar link**.
- **Categorias** e **Seleções** editoriais.
- **Links**: tabela com a situação do link de todos os produtos e um botão
  para abrir cada um.
- **Publicar**: resumo do que mudou, descrição do commit e publicação.
  Se o catálogo tiver sido alterado em outro lugar, o painel avisa antes de
  sobrescrever.

As edições ficam num **rascunho salvo no navegador** até você publicar.
Também dá para baixar uma cópia de segurança e importar um catálogo.

### Editar sem conexão

“Abrir editor local” edita uma cópia do catálogo publicado e, no fim,
baixa o arquivo `data/catalogo.js` para você substituir no projeto. Neste
modo as fotos são copiadas manualmente para `assets/img/produtos/`.

### Aviso para o administrador no site

No navegador em que você entrou no painel, o site mostra um aviso discreto
em produtos com link ausente ou inválido, com o atalho **Corrigir
cadastro**. Visitantes não veem esse aviso.

---

## 2. Campos de cada produto (`data/catalogo.js`)

| Campo | O que é |
| --- | --- |
| `id` | Identificador único, vira o endereço `produto.html?p=id`. Minúsculas, números e hífens. |
| `nome` | Nome completo. |
| `categoria` | `id` de uma categoria existente. |
| `imagens` | Lista de `{ src, pequena, alt }`. A primeira é a capa. `src` pode ser caminho do projeto ou `https://`. |
| `descricaoCurta` | Uma ou duas frases. Card e topo da página. |
| `descricao` | Texto detalhado. Parágrafos separados por linha em branco. |
| `caracteristicas` | Lista de frases curtas. |
| `especificacoes` | Lista de `{ rotulo, valor }`. |
| `preco` | Preço atual conferido, número (`89.9`). `null` = “Consulte o preço na Shopee”. |
| `precoAnterior` | Só aparece riscado se for maior que `preco`. O desconto é calculado. |
| `precoConferidoEm` | Data da conferência (`"2026-10-27"`), exibida na página. |
| `avaliacao` | `{ nota, quantidade, conferidoEm }` copiados da Shopee, ou `null`. |
| `linkAfiliado` | Seu link de afiliado deste produto, completo. Usado exatamente como está. |
| `textoBotao` | Texto do botão. Vazio = “Ver produto na Shopee”. |
| `disponibilidade` | `"disponivel"`, `"esgotado"` ou `""` (não informado). |
| `destaque` | `true` = primeira dobra e “Em destaque”. |
| `publicado` | `false` tira do site sem apagar. |
| `palavrasChave` | Termos extras para a busca. |
| `adicionadoEm` | Data de entrada, para “Chegaram agora” e “Mais recentes”. |
| `demo` | `true` só para produtos de exemplo. |

Regras que o site aplica sozinho:

- Sem link válido, o card mostra “Link da Shopee em atualização” e **não**
  exibe botão de compra.
- Desconto e avaliação só aparecem com dados completos e válidos.
- Filtros e ordenações só aparecem quando há dados para eles (por exemplo,
  ordenar por preço exige pelo menos dois produtos com preço).
- Categorias sem produtos publicados não aparecem.

Editou à mão? Rode `node ferramentas/verificar-catalogo.mjs` para conferir
identificadores, categorias, fotos e links repetidos.

### Fotos

Use fotos reais do produto, cedidas pelo vendedor ou de uso permitido.
Fundos brancos funcionam melhor: o site integra o branco ao fundo do quadro
(`imagens.integrarFundoBranco`). O quadro mostra o produto inteiro, sem
cortes (`imagens.ajuste: "contain"`). Produto sem foto aparece com um
quadro discreto “Foto em breve”.

---

## 3. Marca e textos (`config/marca.js`)

- **nome**, **descricao** e **logotipo** (texto com ponto de destaque ou
  imagem SVG/PNG).
- **cores**: paleta neutra com uma única cor de destaque (`destaque`),
  usada nas ações que levam à Shopee.
- **tipografia**: famílias do Google Fonts para títulos e texto.
- **textos**: primeira dobra (o trecho entre `*asteriscos*` fica em
  itálico), títulos das seções, textos dos botões e avisos.
- **navegacao**, **rodape**, **contato** e **responsavel**: só aparecem os
  campos preenchidos. Use apenas dados reais.
- **site.url**: endereço público. Ativa o link canônico e o `sitemap.xml`
  gerado pelo painel.

---

## 4. Publicar

**GitHub Pages**: em *Settings → Pages*, publique a branch configurada em
`admin.github.branch`, pasta `/ (root)`. A vitrine fica em
`https://<usuario>.github.io/<repositorio>/seleta/`.

**Netlify, Vercel ou Hostinger**: publique a pasta `seleta/` (sem comando
de build). Se ela for a raiz do domínio, ajuste `admin.github.pasta` para
continuar usando o painel com o mesmo repositório.

Para ver no computador: na pasta `seleta/`, rode
`python3 -m http.server 8000` e abra <http://localhost:8000>.

---

## Detalhes técnicos

- **Links de afiliado**: `target="_blank"` e `rel="sponsored noopener"`; o
  endereço cadastrado é usado sem mudanças. Cliques geram o evento
  `clique_afiliado` em `window.dataLayer` se você usar o Google Tag Manager.
- **Desempenho**: sem bibliotecas; fotos em WebP com `srcset`, carregamento
  preguiçoso fora da primeira dobra e espaço reservado (sem saltos de
  layout); animações só com `transform` e `opacity`.
- **Acessibilidade**: HTML semântico, “pular para o conteúdo”, foco
  visível, busca com navegação por setas, diálogos nativos com Esc,
  textos alternativos e respeito a `prefers-reduced-motion`.
- **SEO**: título, descrição, Open Graph e dados estruturados por produto;
  `sitemap.xml` gerado pelo painel quando `site.url` está preenchido.
  As páginas são montadas no navegador: o Google as indexa normalmente,
  mas a prévia de link em apps de mensagem usa os metadados gerais do site.
- **Privacidade**: sem cookies próprios e sem coleta de dados; favoritos e
  vistos ficam no `localStorage` do visitante.
