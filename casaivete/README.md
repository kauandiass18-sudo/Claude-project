# Casa Ivete · Massas e Pães Artesanais

Página de vendas da Casa Ivete para o cliente encomendar salgados, pães,
bolos e cucas e finalizar pelo WhatsApp. Feita em HTML, CSS e JavaScript
puro: não tem build nem dependências. Basta publicar a pasta.

## Roteiro da página

1. **Abertura:** promessa, botão "Montar minha encomenda" e cidades atendidas.
2. **Como funciona:** três passos (escolher, contar os detalhes, confirmar no WhatsApp).
3. **Cardápio:** filtros por categoria e botão "Adicionar à encomenda" em cada produto.
4. **Encomendas para ocasiões:** festas e reuniões, com mensagem própria no WhatsApp.
5. **Detalhes e essência:** texturas dos produtos e o cuidado da marca.
6. **Entregas e dúvidas:** respondem às objeções antes do contato.
7. **Chamada final:** volta para o cardápio.

No celular, uma barra no rodapé convida a ver o cardápio e, depois do primeiro item, mostra a encomenda.

## Como funciona a encomenda

1. O cliente escolhe os produtos no cardápio (direto no cartão ou no detalhe, com quantidade e observação).
2. Revisa os itens na gaveta do pedido (quantidade, remoção, subtotal).
3. Informa nome, forma de recebimento, cidade, endereço, data desejada e observações (com validação).
4. O site abre o WhatsApp com a mensagem pronta para `wa.me/<número>`.

- **Valores:** só os preços cadastrados entram na conta. Produto sem preço aparece como "sob consulta" e o total fica "a confirmar". Nada é estimado.
- **Pagamentos:** o site não cobra nada. A confirmação, os valores finais e o pagamento acontecem no atendimento.
- O pedido e os dados do formulário ficam salvos no navegador do cliente enquanto ele navega.

## Onde editar

| Arquivo | O que contém |
| --- | --- |
| `assets/js/config.js` | WhatsApp, Instagram, logotipo, cidades, entrega/retirada, taxas, horários, encomendas, formas de pagamento e o texto institucional |
| `assets/js/catalogo.js` | Categorias e produtos: nome, descrição, preço, tamanho, disponibilidade, destaque, encomenda, imagem e variações |

Quando um campo fica vazio (`""`, `null` ou `[]`), ele simplesmente não aparece no
site. As perguntas frequentes e a seção de entregas se ajustam sozinhas ao que estiver preenchido.

### Exemplos

```js
// catalogo.js: preço, tamanho e variações confirmados
preco: 38, medida: "Forma média", variacoes: [{ nome: "Sabor", opcoes: ["Uva", "Banana"] }]

// catalogo.js: produto esgotado no dia
disponivel: false

// config.js: taxa de entrega por cidade
taxas: { "Chapecó": 8, "Faxinal dos Guedes": 5 }
```

## Imagens

**As imagens atuais são ilustrações provisórias**, criadas para esta
apresentação. Elas não mostram os produtos reais da Casa Ivete. Enquanto
`imagensIlustrativas: true` estiver em `config.js`, o cardápio traz um aviso discreto.

Para usar as fotografias oficiais:

1. Coloque as fotos em `assets/img/fotos/` (de preferência verticais 4:5, com pelo menos 1000 px de largura, em `.webp` ou `.jpg`).
2. No produto ou na categoria, troque `imagem` pelo caminho completo, por exemplo `imagem: "assets/img/fotos/cuca-uva.jpg"`.
3. As imagens fixas do topo, da seção de detalhes, da essência e das encomendas ficam em `index.html` (procure por `ilustracoes/`).
4. Quando tudo estiver trocado, mude `imagensIlustrativas` para `false`.

Direção de fotografia: luz natural lateral, fundo creme ou madeira discreta, tons quentes, sem texto sobre a foto. Varie o enquadramento conforme o produto: o pão em corte para mostrar o miolo, o salgado de perto, o bolo inteiro com a cobertura à vista.

## Antes de publicar: confirmar com a proprietária

- [ ] Número do WhatsApp comercial (hoje `(49) 99918-4930`, que veio do perfil de referência)
- [ ] Endereço do Instagram oficial
- [ ] Logotipo original em SVG ou PNG (`config.js → marca.logo`)
- [ ] Lista definitiva de produtos, nomes, sabores, tamanhos e preços
- [ ] Quais produtos devem ficar em destaque
- [ ] Retirada no local (sim ou não, e onde)
- [ ] Taxas de entrega, regiões, horários e prazos de encomenda
- [ ] Formas de pagamento
- [ ] Texto da seção "Nossa essência" (hoje provisório) ou a história real da marca
- [ ] Fotografias oficiais
- [ ] Texto da política de privacidade

## Publicação

Funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, a hospedagem da empresa).
Depois de publicar, troque `og:image` em `index.html` pelo endereço completo
(ex.: `https://seudominio.com.br/assets/img/og-image.jpg`) e preencha o
`canonical`, para a prévia aparecer corretamente no WhatsApp e nas redes.

## Decisões de design

- **Paleta:** o creme baunilha domina, o marrom cacau marca a identidade e o caramelo aparece só em detalhes. O verde aparece em um único lugar, no botão final "Enviar pelo WhatsApp", para o cliente reconhecer o destino.
- **Tipografia:** EB Garamond nos títulos e DM Sans nos textos e botões, ambas servidas pelo próprio site. A EB Garamond entrou no lugar da Cormorant Garamond porque a Cormorant desenha os acentos do português (ê, é, â) muito altos e finos, a ponto de parecerem erro de digitação nos títulos.
- **Celular:** layout próprio, com cartões horizontais no cardápio, barra inferior do pedido (aparece só quando há itens), gaveta de pedido em tela cheia e áreas de toque de 44 px ou mais.
- **Movimento:** entradas suaves, um leve zoom nas fotos no desktop e um retorno visual ao adicionar itens. Tudo é desligado quando o sistema pede movimento reduzido.
- **Acessibilidade:** navegação por teclado, diálogos nativos, rótulos e mensagens de erro ligados aos campos, textos alternativos nas imagens e contraste AA.

Fontes sob licença SIL Open Font License (`assets/fonts/OFL-*.txt`).
