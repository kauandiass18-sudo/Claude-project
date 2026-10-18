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
| Autorização do Dionatan Santos (Soryx) para o depoimento | `config.js` → `depoimentos` | Exibido com o selo em texto “Parceiro verificado”, como informado. Para tirar o selo, use `parceiroVerificado: false` |
| Vídeos reais para o mostruário | `config.js` → `portfolio` | Vazio = a seção fica escondida |
| Domínio do site (link canônico e compartilhamento) | `config.js` → `dominio` | Opcional |

## O que dá para editar no `config.js`

- **Mensagens do WhatsApp** de cada botão (`mensagens`) e de cada plano ou
  serviço avulso (campo `mensagem` em cada um).
- **Planos**: nome, preço, indicação, itens, texto do botão e qual fica em
  destaque (`destaque: true` + `selo`).
- **Serviços avulsos**: nome, preço e `aPartirDe` (mostra “a partir de”).
- **Indicadores** e a observação que aparece embaixo deles.
- **Mostruário**: cada peça tem `titulo`, `categoria` (`videos`, `artes`,
  `logos`, `produtos`), `formato` (`alto`, `largo` ou `''`), `video`,
  `imagem` (capa opcional) e `descricao`.
- **Depoimentos**: copie o bloco para incluir outros. Só use depoimentos reais
  e autorizados.

Quando uma lista fica vazia, a seção correspondente some sozinha (depoimentos,
mostruário, indicadores).

### Mostruário: como colocar os vídeos

A seção fica escondida enquanto a lista `portfolio` estiver vazia.

1. Salve o vídeo em `assets/video/` (MP4, até ~8 MB; vídeos verticais de
   Reels funcionam melhor com `formato: 'alto'`).
2. Copie o modelo que está no `config.js` para dentro de `portfolio: [ ]` e
   preencha título, arquivo e descrição. Mostre vídeos de clientes só com
   autorização.
3. O card usa o primeiro quadro do vídeo como capa. Para escolher outra capa,
   salve uma imagem em `assets/img/portfolio/` e informe em `imagem`.

O vídeo inteiro só carrega quando a pessoa toca no card.

A grade fica completa (sem buracos) quando a soma dos espaços fecha
múltiplos de 4 colunas: `alto` e `largo` ocupam 2 espaços, os demais ocupam 1.

## Cor do site

A cor de destaque fica num bloco só, no topo de `assets/css/style.css`
(`--acento`, `--acento-claro` e os demais tokens com `acento`). Para trocar,
mude esse bloco; o resto do site acompanha. Se a cor nova for clara (como
dourado), use `--texto-acento: #08090D` para o texto dos botões ficar legível.

## Serviços, diferenciais e textos

Os quatro serviços, os cinco diferenciais e os textos das seções estão no
`index.html`, cada seção marcada com um comentário (`<!-- SERVIÇOS -->` etc.).

## Estrutura

```
cortexvr/
├── index.html                   Página principal
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
