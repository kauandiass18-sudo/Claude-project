# Site da confeitaria

Site de uma confeitaria artesanal que trabalha com encomendas. Por enquanto ele
tem a abertura, com os doces flutuando, o título e o botão "Fazer encomenda",
que leva para o WhatsApp. Logo abaixo, cada doce aparece sozinho, grande,
flutuando livre, sem moldura.

Feito só com HTML, CSS e JavaScript. Não precisa instalar nada nem rodar build.
Para ver no computador, abra `index.html` no navegador.

## Onde editar

Quase tudo fica em **`config.js`**:

| O quê                              | Onde no `config.js` |
| ---------------------------------- | ------------------- |
| Nome e descrição da marca          | `marca`             |
| Número e mensagem do WhatsApp      | `whatsapp`          |
| Título, subtítulo e doces flutuando | `hero`             |
| Doces soltos, abaixo da abertura   | `livres`            |
| Doces e fotos                      | `produtos`          |

As cores ficam no começo de `assets/css/style.css`, dentro de `:root`.

## WhatsApp

```js
whatsapp: {
  numero: "5511912345678",   // 55 + DDD + número, só números
  mensagem: "Olá! Vi os doces no site e gostaria de fazer uma encomenda."
}
```

## Fotos dos produtos

1. Salve as fotos reais em `assets/img/produtos/`, com nomes sem espaço e sem
   acento. Exemplo: `mini-pudim-1.webp`, `mini-pudim-2.webp`.
2. Liste as fotos no produto, a principal primeiro:

```js
{
  id: "mini-pudim",
  nome: "Mini Pudim",
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
- Cada foto pode aparecer flutuando no hero. Escolha quais em `hero.composicao`.
- Use fotos de 1000 a 1400 px no lado maior, em `.webp` ou `.jpg`, para o site
  continuar leve.
- Enquanto um produto não tem foto, aparece um espaço reservado com o nome dele.
  O site nunca usa imagem de banco no lugar.

## Doces flutuando no hero

Em `hero.composicao`, cada linha escolhe um produto e qual foto dele usar
(`foto: 0` é a primeira). Hoje são 3 doces: Mousse de Maracujá, Mousse de
Limão e Mini Pudim. Com 3, eles ficam em triângulo, cada um no seu espaço e
com um movimento diferente: um sobe e desce, outro gira de leve e o outro se
aproxima e se afasta.

Também dá para usar até 6 doces. Nesse caso o celular mostra só os 4 primeiros.

## Doces livres

Abaixo da abertura, cada doce listado em `livres` aparece sozinho, grande, com
o nome ao lado. Ele entra na tela ao rolar a página e continua flutuando.

Para o doce ficar solto de verdade, use uma foto **recortada**: PNG ou WebP
com fundo transparente, e `recortada: true` no produto. Com foto comum, o
fundo da foto aparece junto.

## Acessibilidade e desempenho

- Quem ativou "reduzir movimento" no celular ou no computador vê o site sem
  animações contínuas.
- As animações pausam quando a abertura sai da tela.

## Publicar

Qualquer hospedagem de site estático serve: GitHub Pages, Netlify ou Vercel.
No GitHub Pages deste repositório, o site fica no endereço terminado em
`/confeitaria/`.
