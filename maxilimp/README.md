# Maxilimp — site institucional

Site estático (HTML, CSS e JavaScript puro, sem build). Abra `index.html`.

## Onde editar

| O quê | Onde |
|---|---|
| Número do WhatsApp e mensagem padrão | `assets/js/maxilimp.js` (topo do arquivo) e links `wa.me` no `index.html` |
| Fotos de antes e depois | `assets/js/maxilimp.js` → lista `ANTES_DEPOIS` (preencha `antes` e `depois`) |
| Facebook | `index.html`, rodapé: troque o `href` e remova o atributo `hidden` |
| Galeria | `index.html`, seção `#projetos`: copie um `<figure class="gal__item">` |
| Cards sem foto (Fachadas, Pisos, Restauração) | `index.html`: troque o `<div class="svc__ph">` por um `<img>` |
| Domínio (canonical / Open Graph) | `index.html`, comentário no `<head>` |

## Imagens

As fotos em `assets/img/` foram recortadas de capturas de tela do Instagram da
empresa e por isso têm resolução limitada. Substitua pelos arquivos originais
(mesmo nome) assim que possível — o layout se ajusta sozinho.

O logotipo (`logo-maxilimp.png`) é o original, apenas com o fundo branco
transformado em transparente; nada foi redesenhado.
