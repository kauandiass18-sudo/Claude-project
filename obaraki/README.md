# ObaraKi Temakeria · Site de delivery

Site institucional, cardápio digital, loja com carrinho, checkout, pedido pelo
WhatsApp e painel administrativo. Feito com **HTML, CSS e JavaScript puro**:
não precisa instalar nada nem rodar build. Basta hospedar a pasta `obaraki/`
em qualquer servidor estático (GitHub Pages, Netlify, Vercel, hospedagem comum).

## Páginas

| Arquivo | O que é |
| --- | --- |
| `index.html` | Página inicial: destaque, benefícios, favoritos, promoções, combos, executivos, temakis, categorias, sobre, contato e Instagram |
| `cardapio.html` | Cardápio completo com barra de categorias fixa e busca |
| `checkout.html` | Finalização em 3 etapas: dados, entrega e pagamento |
| `admin.html` | Painel do proprietário (acesso por PIN) |

Links úteis para divulgar:

- `cardapio.html#cat-temaki` abre o cardápio direto em uma categoria.
- `index.html#produto=combo-master-chef` abre a página do produto.

## Como o pedido funciona

1. O cliente escolhe os itens, ajusta quantidade, adicionais e observações.
2. No checkout informa nome, telefone, endereço e forma de pagamento. Não há cadastro.
3. Ao enviar, o WhatsApp da loja abre com o pedido completo e organizado.
4. O cliente toca em enviar e recebe a tela de confirmação com o número do pedido.

O CEP é preenchido automaticamente pelo serviço ViaCEP quando disponível.

## Painel administrativo

Acesse `admin.html`. No primeiro acesso, crie um PIN de 4 a 8 números.

No painel é possível:

- **Pedidos:** ver pedidos feitos pelo site neste navegador e mudar o status.
- **Produtos:** criar, editar, duplicar, excluir, ativar/desativar, mudar preço e foto.
- **Categorias:** criar, renomear, reordenar, ocultar e excluir.
- **Combos:** cadastrar combos e executivos com peças, composição, foto e preço.
- **Promoções:** destacar produtos, com preço promocional opcional.
- **Configurações:** WhatsApp, Instagram, iFood, horário, taxa de entrega (única ou por bairro), entrega grátis, pedido mínimo, formas de pagamento, chave Pix, textos, logotipo e fotos.

### Publicar alterações

O painel salva as alterações **no navegador** em que foi usado. Nele você já vê
o site atualizado. Para os clientes verem:

1. No painel, clique em **Baixar para publicar**.
2. Substitua o arquivo `data/cardapio.js` no servidor pelo arquivo baixado.

Também é possível exportar e importar um backup em `.json`.

### Limitações atuais (sem servidor)

- A lista de pedidos do painel mostra apenas pedidos feitos no mesmo navegador.
  Todos os pedidos chegam ao WhatsApp da loja, que é o canal oficial.
- O PIN protege o painel apenas neste aparelho. Para acesso seguro de vários
  aparelhos e pedidos centralizados, o próximo passo é ligar um banco de dados
  (por exemplo Supabase ou Firebase). Toda a leitura e gravação está em
  `assets/js/store.js`, pensado para essa troca.

## Fotos

Ainda não há fotos reais cadastradas. Enquanto isso, cada produto mostra uma
moldura com o ideograma da categoria, e o destaque principal usa uma ilustração.

Para colocar as fotos:

- Pelo painel: **Produtos → editar → Enviar foto**. A imagem é otimizada automaticamente.
- Ou coloque o arquivo em `assets/img/produtos/` e informe o caminho no produto,
  por exemplo `assets/img/produtos/combo-master-chef.jpg`. Para muitas fotos,
  este é o melhor caminho, porque mantém o arquivo de dados leve.

Recomendado: fotos quadradas ou 4:3, com pelo menos 1000 px, fundo limpo e boa luz.

## O que ainda depende de informações da loja

Nada disso foi inventado. Preencha pelo painel quando tiver os dados:

- Fotos dos produtos, logotipo oficial, foto principal e foto da seção Sobre.
- Composição e quantidade de peças dos combos e executivos.
- Preço do Combo Família (hoje aparece como "Preço sob consulta").
- Produtos das categorias Sushi, Hossomaki, Uramaki, Hot Roll, Fritos, Yakisoba,
  Poké, Teppan, Porções, Bebidas, Sobremesas e Adicionais.
- Links do Instagram e do iFood, e o horário de atendimento. Enquanto os links
  estiverem vazios, os botões aparecem e mostram o aviso "em breve" ao toque.
- Quais temakis aceitam fritura (hoje todos têm a opção de + R$ 5,00).
- Endereço do site para o SEO: após publicar, ajuste `og:image` nas páginas
  para o endereço completo, como `https://seusite.com.br/assets/img/og-image.png`.

## Estrutura

```
obaraki/
├── index.html · cardapio.html · checkout.html · admin.html
├── data/cardapio.js        ← todos os dados do site (gerado pelo painel)
├── assets/
│   ├── css/obaraki.css     visual do site (mobile first)
│   ├── css/admin.css       visual do painel
│   ├── js/store.js         dados, carrinho, entrega, pedidos, mensagem do WhatsApp
│   ├── js/ui.js            header, menu, carrinho, modal, busca, cards
│   ├── js/home.js · cardapio.js · checkout.js · admin.js
│   ├── fonts/              Cormorant Garamond, Manrope e ideogramas (SIL OFL)
│   └── img/                favicon, ícones, imagem de compartilhamento, ilustração
├── site.webmanifest
└── robots.txt
```

## Testar no computador

```
cd obaraki
npx http-server -p 8080
```

Depois abra `http://localhost:8080`.
