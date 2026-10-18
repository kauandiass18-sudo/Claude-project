# CORTEX.VR — site institucional

Site estático (HTML, CSS e JavaScript puro, sem build e sem dependências),
pronto para o GitHub Pages ou qualquer hospedagem de arquivos. Abra
`index.html` ou publique a pasta como está.

Os dados comerciais ficam todos num único arquivo: **`assets/js/config.js`**.

## Pendências antes de publicar

| O quê | Onde | Situação |
|---|---|---|
| **Número do WhatsApp** (só números: 55 + DDD + número) | `config.js` → `whatsapp` | **Vazio.** Os botões abrem o WhatsApp com a mensagem pronta, mas sem destinatário. O console do navegador avisa enquanto estiver vazio. |
| Perfil do Instagram (endereço completo) | `config.js` → `instagram` | Vazio = o link não aparece no rodapé |
| Foto real do Lucas (vertical 4:5) | `config.js` → `fundador.foto` | Vazio = monograma “L” |
| Confirmar os indicadores (4M+, 100+, 98%, 3x, 24h) | `config.js` → `indicadores` | Informados pela empresa; confirme quais podem ser divulgados |
| Confirmar os números da seção Sobre (100+, 3+ anos, 98%, 24h) | `config.js` → `sobre` | Idem |
| Autorização do Dionatan Santos (Soryx) para o depoimento | `config.js` → `depoimentos` | Exibido com o selo em texto “Parceiro verificado”, como informado. Para tirar o selo, use `parceiroVerificado: false` |
| Trocar as peças conceituais por trabalhos reais | `config.js` → `portfolio` | 7 demonstrações, todas identificadas como conceituais |
| Domínio do site (link canônico e compartilhamento) | `config.js` → `dominio` | Opcional |

## O que dá para editar no `config.js`

- **Mensagens do WhatsApp** de cada botão (`mensagens`) e de cada plano ou
  serviço avulso (campo `mensagem` em cada um).
- **Planos**: nome, preço, indicação, itens, texto do botão e qual fica em
  destaque (`destaque: true` + `selo`).
- **Serviços avulsos**: nome, preço e `aPartirDe` (mostra “a partir de”).
- **Indicadores**, números da seção Sobre e as observações que aparecem embaixo.
- **Mostruário**: cada peça tem `titulo`, `categoria` (`videos`, `artes`,
  `logos`, `produtos`), `formato` (`alto`, `largo` ou `''`), `imagem`,
  `video`, `descricao` e `conceito`.
- **Depoimentos**: copie o bloco para incluir outros. Só use depoimentos reais
  e autorizados.

Quando uma lista fica vazia, a seção correspondente some sozinha (depoimentos,
mostruário, indicadores).

### Mostruário: como colocar um trabalho real

1. Salve a imagem em `assets/img/portfolio/` (`.jpg` ou `.webp`, até ~1600 px
   no lado maior e ~300 KB).
2. No item do `portfolio`, troque `imagem` e mude `conceito` para `false`.
3. Para vídeo: coloque o arquivo em `assets/video/` (MP4 H.264, até ~8 MB) e
   informe em `video`. A imagem vira a capa. O vídeo só carrega quando a pessoa
   abre a peça.

A grade fica completa (sem buracos) quando a soma dos espaços fecha
múltiplos de 4 colunas: `alto` e `largo` ocupam 2 espaços, os demais ocupam 1.

## Serviços, diferenciais e textos

Os quatro serviços, os cinco diferenciais e os textos das seções estão no
`index.html`, cada seção marcada com um comentário (`<!-- SERVIÇOS -->` etc.).

## Estrutura

```
cortexvr/
├── index.html                   Página principal (12 seções)
├── politica-de-privacidade.html
├── termos-de-uso.html
└── assets/
    ├── js/config.js             ← dados comerciais (edite aqui)
    ├── js/main.js               Monta as seções a partir do config e cuida das interações
    ├── css/style.css            Identidade visual (cores em :root, seções numeradas)
    ├── fonts/                   Manrope (licença OFL)
    └── img/                     Favicon, ícone, imagem de compartilhamento e portfólio
```

## Publicar

1. Preencha as pendências acima.
2. Envie a pasta `cortexvr/` para a hospedagem. No GitHub Pages deste
   repositório, o site fica em `https://<usuário>.github.io/<repositório>/cortexvr/`.
   Com domínio próprio, aponte o domínio para a pasta e preencha `dominio`.
3. Teste no celular: toque em um plano e confira se o WhatsApp abre na
   conversa da CORTEX.VR com a mensagem certa.
4. Compartilhe o link uma vez no WhatsApp para conferir a prévia (imagem
   `assets/img/og-image.jpg`). Com domínio próprio, troque o `og:image` do
   `index.html` por um endereço completo, que alguns aplicativos exigem.
