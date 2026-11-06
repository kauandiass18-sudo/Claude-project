# Site universal para pizzarias

Um único site de pizzaria, pronto para enviar a qualquer pizzaria durante a
prospecção. O nome muda pelo link, sem editar nada.

Endereço: `https://kauandiass18-sudo.github.io/Claude-project/pizzaria/`

## Link personalizado para cada pizzaria

```
https://kauandiass18-sudo.github.io/Claude-project/pizzaria/?nome=Pizzaria do João
```

O site inteiro (topo, título da aba, rodapé e mensagem do pedido) passa a
mostrar "Pizzaria do João". No WhatsApp, pode digitar com espaços e acentos
normalmente.

## Antes de enviar (uma vez só)

Em `assets/js/config.js`, no bloco `demonstracao`, coloque **o seu** número em
`seuWhatsapp` (55 + DDD + número). É para lá que vai o botão
"Quero este site para minha pizzaria", e a mensagem já informa o nome da
pizzaria que veio no link.

## Quando a pizzaria fechar

No mesmo `config.js`:

- `nome`, `whatsapp` (número que recebe os pedidos), `endereco`, `horarios`,
  `funcionamento`, `bairros` (com taxas), `pagamentos`, `cardapio`,
  `promocoes`, `bordas`;
- `demonstracao.ativo: false` para tirar o selo de demonstração.

Fotos: em `assets/js/app.js`, objeto `FOTOS`. Troque por fotos da pizzaria,
por exemplo `hero: "assets/img/pizza.jpg"`. Se uma foto não carregar, aparece
uma ilustração de pizza no lugar.

## O que o site faz

- Mostra "Aberto agora"/"Fechado" de acordo com o horário configurado.
- Tem as mais pedidas com escolha de tamanho, o cardápio por categorias com
  busca e o meio a meio (tamanho, dois sabores e borda, com o preço na hora).
- Promoções com um clique.
- Carrinho: quantidades, entrega ou retirada, bairro com taxa, pagamento,
  troco e observações.
- O pedido completo vai para o WhatsApp da pizzaria, já formatado com itens,
  taxa, total, nome, endereço e pagamento.
