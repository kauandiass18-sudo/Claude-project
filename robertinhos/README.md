# Robertinho's Men Fashion · Página de vendas

Página única em HTML, CSS e JavaScript puros. Não precisa de build, servidor
nem instalação: basta abrir `index.html` ou hospedar a pasta.

```
robertinhos/
├── index.html        Página completa (estilos e scripts embutidos)
└── assets/img/       Fotografias e logotipo
```

---

## 1. Configurar o WhatsApp

Abra `index.html`, role até o fim e edite apenas o bloco `CONFIG`:

```js
const CONFIG = {
  WHATSAPP: "",                       // ex.: "5567999999999" (DDI + DDD + número, só dígitos)
  INSTAGRAM: "robertinhos_menfashion",
  BRAND: "Robertinho's Men Fashion"
};
```

- **Com o número preenchido**, todos os botões de atendimento abrem o WhatsApp
  com a mensagem já escrita. Cada peça envia o próprio nome na mensagem, por
  exemplo: *"Olá! Vi "Terno bege" no site da Robertinho's Men Fashion e gostaria
  de consultar a disponibilidade."*
- **Com o campo vazio**, os mesmos botões abrem o Direct do Instagram e os
  rótulos se ajustam sozinhos. Nenhum número inventado aparece na página.

O número fica em um lugar só. Não é preciso procurá-lo pelo código.

---

## 2. Trocar as fotografias

Substitua os arquivos em `assets/img/` **mantendo exatamente o mesmo nome**.
A página se atualiza sozinha, sem mexer no HTML.

| Arquivo | Onde aparece | Proporção ideal |
|---|---|---|
| `hero.webp` | Primeira tela, ao lado do título | vertical 3:4 |
| `campanha.webp` | Faixa da Coleção Promessa's | vertical 3:4 |
| `editorial.webp` | Seção "A arte de se vestir bem" | vertical 4:5 |
| `acessorios.webp` | Seção "O arremate do look" | vertical 3:4 |
| `marca.webp` | Seção "Sobre a marca" | vertical 3:4 |
| `logo.png` | Cabeçalho, rodapé, selo e ícone do site | quadrado, fundo transparente |
| `produto-01-terno-azul-marinho.webp` … `produto-12-gravata-paisley-azul.webp` | Grade da coleção | vertical 3:4 |
| `detalhe-01-combinacoes.webp` … `detalhe-04-caimento.webp` | Galeria de detalhes | vertical 3:4 |

**Recomendações para as fotos novas**

- Largura mínima de 1200 px. As atuais foram recortadas das capturas do
  Instagram e ampliadas, então rendem menos nas áreas grandes.
- Formato `.webp` ou `.jpg`. Se usar `.jpg`, troque a extensão no `index.html`
  (uma busca por `assets/img/` encontra todas as ocorrências).
- Enquadramento vertical. A página corta pelo centro, então deixe a peça
  centralizada.
- Fundo limpo e luz uniforme valorizam mais do que ambiente carregado.

### Trocar o nome, a categoria ou a cor de uma peça

Cada peça é um bloco `<article class="product">` no `index.html`:

```html
<article class="product" data-cat="ternos" data-name="Terno bege">
```

- `data-cat` define em qual filtro a peça aparece: `ternos`, `blazers`,
  `calcas`, `camisas`, `gravatas`, `acessorios` ou `kits`.
- `data-name` é o nome enviado na mensagem de WhatsApp.
- A bolinha ao lado do nome é a cor do tecido: `<i class="sw" style="--c:#C9BCA6">`.
- Os contadores dos filtros são calculados sozinhos.

### Status das fotografias

**Já são fotos profissionais da loja** (alta resolução, prontas para o cliente):

- `hero.webp` — terno xadrez azul-marinho com gravata rosa
- `produto-01-terno-azul-marinho.webp` — conjunto completo em manequim
- `produto-06-terno-cinza-claro.webp` — conjunto completo em manequim
- `acessorios.webp` — nó da gravata paisley
- `detalhe-01-combinacoes.webp` — gravata de bolinhas e pin
- `detalhe-02-lapela.webp` — pin dourado na lapela
- `detalhe-03-bolso.webp` — bolsos com pala
- `detalhe-04-caimento.webp` — punho e botões

**Ainda provisórias** (recortadas das capturas do Instagram, rendem menos nas
áreas grandes). Em ordem de prioridade para substituir:

1. `campanha.webp` — ocupa meia tela na faixa da Coleção Promessa's
2. `editorial.webp` — foto grande da seção "A arte de se vestir bem"
3. `marca.webp` — seção "Sobre a marca"
4. `produto-02` a `produto-05`, `produto-07` a `produto-12` — grade da coleção

---

## 3. Texto institucional

O parágrafo da seção "Sobre a marca" está marcado no HTML:

```html
<div data-editable="sobre">
```

Troque pelo texto real do proprietário. A página não afirma nada que não tenha
sido confirmado: não há preços, endereço, telefone, avaliações nem história
inventada.

---

## 4. O que já está pronto

- Primeira tela em tela cheia com revelação cinematográfica da fotografia.
- Letreiro contínuo com as categorias da loja.
- Coleção com filtros por categoria, contadores automáticos e grade alternada.
- Frase de posicionamento que acende palavra por palavra conforme o scroll.
- Galeria de detalhes que corre na horizontal no computador e por toque no celular.
- Botões de atendimento em todos os pontos de decisão, com mensagem por peça.
- Barra de progresso de leitura, menu de celular em tela cheia e botão flutuante.
- Acessibilidade: navegação por teclado, textos alternativos e respeito à
  preferência de "movimento reduzido" do aparelho.
