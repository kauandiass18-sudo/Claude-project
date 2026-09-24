# Site da confeitaria

Site de uma confeitaria artesanal que trabalha com encomendas. Os doces flutuam
na abertura, o cardápio tem um botão de encomenda por produto e todos os
pedidos vão para o WhatsApp.

Feito só com HTML, CSS e JavaScript. Não precisa instalar nada nem rodar build.
Para ver no computador, abra `index.html` no navegador.

## Onde editar

Quase tudo fica em **`config.js`**:

| O quê                          | Onde no `config.js`             |
| ------------------------------ | ------------------------------- |
| Nome e descrição da marca      | `marca`                         |
| Número e mensagens do WhatsApp | `whatsapp`                      |
| Instagram                      | `instagram`                     |
| Título, subtítulo e doces do hero | `hero`                       |
| Produtos, preços e fotos       | `produtos`                      |
| Produtos em destaque           | `destaques`                     |
| História, propósito, diferencial, ingredientes | `sobre`         |
| Etapas do "Como funciona"      | `passos`                        |

Textos entre `[colchetes]` são espaços reservados. Eles aparecem em itálico
apagado até você escrever o texto definitivo, sem os colchetes.

As cores ficam no começo de `assets/css/style.css`, dentro de `:root`.

## WhatsApp

```js
whatsapp: {
  numero: "5511912345678",   // 55 + DDD + número, só números
  mensagem: "Olá! Vi os doces no site e gostaria de fazer uma encomenda.",
  mensagemProduto: "Olá! Vi os doces no site e gostaria de encomendar: {produto}."
}
```

O botão "Encomendar" de cada doce troca `{produto}` pelo nome do doce.

## Fotos dos produtos

1. Salve as fotos reais em `assets/img/produtos/`, com nomes sem espaço e sem
   acento. Exemplo: `mini-pudim-1.webp`, `mini-pudim-2.webp`.
2. Liste as fotos no produto, a principal primeiro:

```js
{
  id: "mini-pudim",
  nome: "Mini Pudim",
  descricao: "…",
  preco: "R$ 12,00",
  fotos: [
    "assets/img/produtos/mini-pudim-1.webp",
    "assets/img/produtos/mini-pudim-2.webp"
  ],
  recortada: false,
  cor: "#C98E56"
}
```

- **`recortada: true`** para fotos PNG ou WebP com fundo transparente. O doce
  flutua solto, com sombra. É o efeito mais bonito no hero.
- **`recortada: false`** para fotos comuns, com fundo. O site mostra a foto
  numa moldura redonda.
- Com mais de uma foto, o card do cardápio ganha bolinhas para trocar o ângulo.
  Na seção "Em destaque", a 2ª e a 3ª foto aparecem flutuando ao lado da principal.
- Use fotos de 1000 a 1400 px no lado maior, em `.webp` ou `.jpg`, para o site
  continuar leve.
- Enquanto um produto não tem foto, aparece um espaço reservado com o nome dele.
  O site nunca usa imagem de banco no lugar.

## Doces flutuando no hero

Em `hero.composicao`, cada linha escolhe um produto e qual foto dele usar
(`foto: 0` é a primeira). A ordem define o lugar:

1. grande, em primeiro plano
2. médio
3. médio
4. pequeno, ao fundo
5. pequeno, ao fundo (só no computador)
6. pequeno (só no computador)

No celular aparecem só os 4 primeiros, para nenhum doce ficar em cima do outro.

## Acessibilidade e desempenho

- Quem ativou "reduzir movimento" no celular ou no computador vê o site sem
  animações contínuas.
- As animações do hero pausam quando ele sai da tela.
- As fotos fora da primeira tela carregam só quando chegam perto.

## Publicar

Qualquer hospedagem de site estático serve: GitHub Pages, Netlify ou Vercel.
No GitHub Pages deste repositório, o site fica no endereço terminado em
`/confeitaria/`.
