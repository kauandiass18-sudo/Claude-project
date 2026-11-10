# Fino Sabor · Churrascaria e Pizzaria

Site institucional e cardápio digital da Fino Sabor (Xanxerê · SC), com pedido
finalizado pelo WhatsApp. Feito em HTML, CSS e JavaScript puro: não tem build
nem dependências. Basta publicar a pasta.

Endereço publicado: `https://kauandiass18-sudo.github.io/Claude-project/finosabor/`

## Identidade

Branco quente `#FAF9F6` como base, bordô `#4B090B` da logo como cor principal,
dourado `#C5A443` nos detalhes, creme e bege nos fundos secundários, preto suave
`#171515` no rodapé. Títulos em Cormorant Garamond, textos em Manrope (Google
Fonts). A logo original foi recortada da imagem enviada e fica em `assets/img/`
(círculo completo e o símbolo em bordô, dourado e branco).

## Roteiro da página

1. **Abertura:** logo, promessa, botões "Explorar cardápio" e "Fazer meu pedido",
   horários resumidos e composição de fotos com movimento sutil.
2. **Rodízio e horários:** bloco do rodízio de pizza (valores divulgados no
   Instagram) e cards de almoço e jantar.
3. **Pizzaria e churrascaria:** dois painéis fotográficos lado a lado.
4. **Cardápio:** busca, categorias (Tradicionais, Especiais, Outros pratos,
   Doces, Doces especiais), vitrine "As mais pedidas" e cards com foto,
   ingredientes, preço e botão "Adicionar". As 62 tradicionais aparecem 12 por vez
   com "Ver todos".
5. **Sobre**, **Contato**, **chamada final** e **rodapé**.
6. **Meu pedido:** painel lateral com quantidades, observação por item, nome,
   atendimento (retirada, entrega ou reserva), pagamento e envio pelo WhatsApp.

## Onde editar

| Arquivo | O que contém |
| --- | --- |
| `assets/js/config.js` | WhatsApp, Instagram, endereço, horários, rodízio, formas de pagamento e **todo o cardápio com preços** |
| `assets/js/app.js` | Objeto `FOTOS` (fotos ilustrativas) e a lógica do site |
| `assets/css/style.css` | Cores (em `:root`), tipografia e layout |
| `index.html` | Textos das seções |

### Preços

Todos os itens começam com `preco: null` (aparece "Consultar"). Para mostrar um
valor, troque por um número: `preco: 69.9`. Enquanto algum item do pedido não
tiver preço, o total aparece como "a confirmar" e a mensagem do WhatsApp avisa.

### Cardápio

O cardápio foi transcrito das fotos do cardápio impresso, categoria por categoria,
com os ingredientes exatamente como estão lá. Itens sem ingredientes no original
ficam com `desc: null`. Observações:

- "Banana Trovoada" está assim no cardápio impresso (o briefing dizia "Trovada").
- Estrogonofe de carne, Mexicana e Yakissoba foram colocados em "Outros pratos",
  como pedido no briefing; no cardápio impresso eles aparecem logo após as
  pizzas especiais.
- Não há tamanhos nem preços no cardápio original, por isso nada foi cadastrado.

### Fotos

As fotos são ilustrativas, de banco de imagens (Unsplash), carregadas pela
internet. Para usar fotos da casa, coloque os arquivos em `assets/img/` e aponte
no objeto `FOTOS` em `app.js` (por exemplo `"hero-pizza": "assets/img/pizza.jpg"`)
ou direto no item do cardápio (`foto: "assets/img/calabresa.jpg"`). Se uma foto
não carregar, o site usa a foto da categoria e, por último, um cartão com a logo.

### WhatsApp

O número em `config.js` é o que aparece no perfil oficial do Instagram
(`wa.me/5549988810418`). Se o atendimento for em outro número, troque ali.
