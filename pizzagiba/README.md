# Pizza Giba · Site com pedido pelo WhatsApp

Site da Pizza Giba (forno a lenha, Instagram `@pizzagiba`, WhatsApp (12) 99104-6255).
Cardápio completo transcrito do cardápio impresso, pedido montado no site e
finalizado pelo WhatsApp, e painel para o dono editar tudo sem mexer em código.

Endereço: `https://kauandiass18-sudo.github.io/Claude-project/pizzagiba/`
Painel: `https://kauandiass18-sudo.github.io/Claude-project/pizzagiba/admin.html`

HTML, CSS e JavaScript puro. GSAP, ScrollTrigger e Lenis estão em
`assets/js/vendor/` (sem dependência de CDN). Não precisa de build.

## Estrutura

```
pizzagiba/
├── index.html            Site
├── admin.html            Painel do dono
├── data/cardapio.js      ← Banco de dados do site (cardápio, preços, contato, horários)
└── assets/
    ├── css/style.css     Visual do site
    ├── css/admin.css     Visual do painel
    ├── js/app.js         Cardápio, carrinho, pedido no WhatsApp, animações
    ├── js/admin.js       Painel
    ├── js/vendor/        GSAP, ScrollTrigger, Lenis
    └── img/              Fotos reais do forno (recortadas dos posts do Instagram), favicon, og-image
```

## O que o site faz

- Hero com a foto real da pizza de frango com catupiry saindo do forno.
- Destaques ("Assinaturas da casa"): À Moda Giba, Frango com Catupiry, Viçosa e Chocogiba. Escolha outros no painel.
- Cardápio por abas (pizzas salgadas, pizzas doces, pratos e sobremesas, bebidas) com busca por sabor ou ingrediente.
- Pizza em dois tamanhos (grande e média), adicional de alho, escolha de morango ou pêssego na Chocogiba.
- Carrinho com quantidades, entrega ou retirada, endereço, pagamento (Pix, crédito, débito, dinheiro com troco) e observações.
- Botão "Enviar pedido pelo WhatsApp" abre o WhatsApp da pizzaria com a mensagem pronta: itens, tamanhos, adicionais, subtotal, total, endereço e pagamento.
- Seção "A casa" com a segunda foto do forno a lenha.
- Avaliações: espaço preparado, sem depoimentos inventados. Cadastre as reais no painel.
- Contato com WhatsApp, Instagram e botão flutuante.

## O que falta preencher (não inventei)

No painel, aba **Informações**:

- Endereço e cidade.
- Horários de funcionamento e, se quiser, o status "Aberto agora".
- Link do Google Maps ("Como chegar") e o endereço do mapa incorporado.
- Taxa de entrega fixa, se houver (enquanto estiver vazia, o pedido diz "a confirmar").

## Painel (admin.html)

Permite cadastrar e editar produtos, mudar preços, enviar foto de cada item,
ativar ou desativar itens, cadastrar promoções e avaliações, e alterar
horários e contato.

Como o site é hospedado como arquivos estáticos (GitHub Pages), o painel
funciona assim:

1. Tudo o que você altera é salvo automaticamente **no navegador em que você
   está**. Abrindo o site nesse mesmo aparelho, você já vê o resultado.
2. Para a mudança valer para todos os clientes, clique em **Baixar
   cardapio.js** e substitua o arquivo `pizzagiba/data/cardapio.js` no
   repositório (ou peça para quem publica).
3. Depois de publicar, use **Descartar alterações locais** para o painel
   voltar a ler o arquivo publicado.

O painel não tem senha porque as alterações feitas nele não chegam ao site
público: só o arquivo publicado muda o que os clientes veem. Se um dia o site
ganhar um servidor ou banco de dados, aí vale colocar login.

Fotos enviadas pelo painel são reduzidas para 900 px e gravadas dentro do
próprio arquivo. Para fotos grandes em muitos itens, prefira salvar os
arquivos em `assets/img/` e informar o caminho no campo "caminho/endereço da
imagem".

## Fotos

As duas fotos em `assets/img/` (`forno-frango` e `forno-calabresa`) foram
recortadas dos posts do Instagram da pizzaria. Têm 828 px de largura, o que
serve bem para o site; se houver os originais em resolução maior, basta
substituir mantendo os nomes.
