# Grazi · Manicure & Pedicure — landing page

Página única em HTML, CSS e JavaScript puro. Não precisa de build.
Abra `grazi/index.html` no navegador ou publique a pasta `grazi/` inteira.

```
grazi/
├── index.html     A página (estrutura, visual e animações)
├── config.js      ← É AQUI QUE VOCÊ EDITA
├── img/           Fotos (crie subpastas se quiser: img/galeria, img/instagram)
└── vendor/        GSAP 3.12.5, ScrollTrigger e Lenis 1.1.13 (animações e rolagem suave)
```

## O que configurar em `config.js`

| Campo | O que é |
|---|---|
| `whatsapp` | Número só com dígitos: `55` + DDD + número. Ex.: `"5549999999999"` |
| `mensagemAgendamento`, `mensagemSpa`, `mensagemEndereco` | Mensagens que já abrem escritas no WhatsApp |
| `endereco` | Endereço completo. Quando preenchido, aparece na seção e no rodapé, e o botão vira "Abrir no Google Maps" |
| `mapa` | Link de incorporação do Google Maps (Compartilhar → Incorporar um mapa → o endereço dentro de `src="..."`) |
| `fotos.hero` | Foto principal de unhas (vertical, ideal 1200×1500 ou maior) |
| `fotos.heroDetalhe` | Foto pequena redonda do hero (quadrada) |
| `fotos.grazi` | Retrato da Grazi (vertical) |
| `fotos.spa` | Foto do Spa dos Pés (vertical) |
| `galeria` | Lista de trabalhos. `formato`: `"retrato"` (4:5), `"alto"` (2:3) ou `"quadrado"` (1:1) |
| `instagramPosts` | 6 fotos para a seção do Instagram (atualização manual; `link` opcional) |
| `depoimentos` | Depoimentos reais. Apague `exemplo: true` ao trocar o texto. Lista vazia esconde a seção |

Enquanto uma foto estiver vazia, a página mostra uma moldura delicada com o nome
da foto que deve entrar ali — nada de imagem de banco no lugar dos trabalhos.

## Fotos: como preparar

- Formato `.jpg` ou `.webp`, lado maior entre 1600 e 2000 px, até ~400 KB cada
  (dá para comprimir em squoosh.app sem perder qualidade visível).
- Nomes simples, sem espaço nem acento: `img/galeria/unhas-01.jpg`.
- No `config.js`: `{ src: "img/galeria/unhas-01.jpg", alt: "Esmaltação nude com arte floral", formato: "retrato" }`.
- O `alt` descreve a foto para leitores de tela e para o Google.

## Antes de publicar

1. Preencher `whatsapp` (sem número, o botão abre o WhatsApp e a pessoa escolhe o contato).
2. Trocar os depoimentos de exemplo por reais, ou deixar `depoimentos: []`.
3. Colocar ao menos a foto principal, a foto da Grazi e as fotos da galeria.
