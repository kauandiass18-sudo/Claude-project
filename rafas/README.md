# Rafa's Delivery · site da pizzaria

Site da **Rafa's Pizzaria Delivery** com cardápio, pizza de dois sabores,
carrinho e pedido montado direto no WhatsApp **(49) 92003-7842**.

Endereço: `https://kauandiass18-sudo.github.io/Claude-project/rafas/`

Feito a partir do modelo universal de pizzaria (pasta `pizzaria/`), com a
identidade da Rafa's: logo, vermelho e amarelo do letreiro, papel creme com
manchas vermelhas como no cardápio impresso.

## O que já está preenchido

- Todos os sabores e descrições do cardápio impresso: Tradicionais (14),
  Especiais (6), Doces (6) e Doces especiais (4).
- Preços: Tradicional e Doce P R$ 35 / G R$ 65; Especial e Doce especial
  P R$ 40 / G R$ 70.
- Tamanhos: Pequena 25 cm (8 fatias) e Grande 35 cm (12 fatias).
- Bordas recheadas (+R$ 10): cheddar e catupiry nas salgadas, chocolate preto
  ou branco nas doces. O site só oferece a borda que combina com o sabor.
- Sabor adicional: +R$ 5 na pizza de dois sabores.
- WhatsApp dos pedidos.

## O que falta confirmar com a Rafa's

Tudo em `assets/js/config.js`:

- `horarios` e `funcionamento`: estão como terça a domingo, 18h às 23h.
- `bairros`: está vazio, então a pessoa digita o bairro e a taxa de entrega
  fica "a confirmar" no WhatsApp. Para mostrar taxas, preencha
  `{ nome: "Centro", taxa: 5 }` por bairro.
- `endereco` e `instagram`: vazios, aparecem assim que forem preenchidos.
- `tempoEntrega` e `pagamentos`.
- Na categoria Especiais, "5 Queijos" e "5 Queijos com Bacon" foram lidos de
  uma foto borrada; confira o nome.

## Fotos

As fotos das pizzas são ilustrativas (Unsplash). Para usar fotos da Rafa's,
coloque os arquivos em `assets/img/` e troque em `assets/js/app.js`, no objeto
`FOTOS`, por exemplo `calabresa: "assets/img/calabresa.jpg"`. Um sabor sem foto
mostra uma ilustração de pizza.
