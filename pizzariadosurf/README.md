# Pizzaria do Surf · Página de vendas

Landing page da Pizzaria do Surf. O cliente escolhe a pizza e o pedido termina
no WhatsApp. Feita em HTML, CSS e JavaScript puro: não tem build nem
dependências. Basta publicar a pasta.

Visual: modo escuro gourmet (fundo `#121212`, texto branco, destaques em dourado
`#F59E0B`), títulos em Montserrat, textos em Inter e palavras de destaque em
Playfair Display itálico.

## Roteiro da página

1. **Abertura:** promessa, botão "Fazer pedido agora no WhatsApp", "Ver cardápio completo" e selos de confiança.
2. **Os queridinhos do cardápio:** Pizza do Surf, A Moda do Pizzaiolo, Nordestina e Nutella com Morango, cada uma com o botão "Quero esta".
3. **Diferenciais:** massa e forno, ingredientes premium, entrega rápida.
4. **Monte do seu jeito:** meio a meio salgada, meio a meio doce ou beirutes. A opção escolhida já vai escrita na mensagem do WhatsApp.
5. **Avaliações:** três depoimentos com 5 estrelas.
6. **Dúvidas frequentes:** perguntas em sanfona (uma aberta por vez).
7. **Chamada final** e **rodapé** com horário, endereço e redes.

No celular, depois que a pessoa passa da abertura, aparece uma barra fixa com o botão do WhatsApp.

## Onde editar

| Arquivo | O que contém |
| --- | --- |
| `assets/js/config.js` | WhatsApp, Instagram, Facebook, link do cardápio completo, horários, endereço e avisos |
| `index.html` | Textos, sabores e preços |
| `assets/css/style.css` | Cores (no topo, em `:root`), tipografia e layout |

Cada botão "Quero esta" tem `data-pedido="Nome da pizza"`: é esse nome que vai na mensagem do WhatsApp.

## Imagens

**As imagens atuais são ilustrações provisórias**, geradas para esta
apresentação. Não são fotos dos produtos reais. Enquanto
`imagensIlustrativas: true` estiver em `config.js`, a página mostra o aviso "Imagens ilustrativas".

Para usar as fotos oficiais, troque os arquivos em `assets/img/ilustracoes/`
mantendo os mesmos nomes (`pizza-do-surf.webp`, `pizza-do-surf-sm.webp` etc.).
Use fotos quadradas, vistas de cima, com o fundo recortado (PNG ou WebP
transparente). Assim elas "flutuam" sobre os cards como no layout.

## Antes de publicar: confirmar com o cliente

- [ ] Número do WhatsApp comercial (`config.js → contato.whatsapp`; vazio = a pessoa escolhe o contato)
- [ ] Instagram e Facebook oficiais
- [ ] Link do cardápio completo, se houver (`cardapioUrl`)
- [ ] Horário de funcionamento (hoje é um **exemplo**)
- [ ] Endereço (hoje é um **exemplo**)
- [ ] Preços e sabores
- [ ] Depoimentos reais de clientes (os atuais são exemplos; depois mude `depoimentosDeExemplo` para `false`)
- [ ] Fotos oficiais (depois mude `imagensIlustrativas` para `false`)
- [ ] Logotipo oficial, se houver (hoje é uma assinatura tipográfica com uma onda)

## Publicação

Funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).
Depois de publicar, troque `og:image` em `index.html` pelo endereço completo
da imagem para a prévia aparecer certinha ao compartilhar o link.
