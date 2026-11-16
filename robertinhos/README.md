# Robertinho's Men Fashion · Página de vendas

Página única em HTML, CSS e JavaScript puros. Não precisa de build.

```
robertinhos/
├── index.html        Página completa (estilos e scripts embutidos)
└── assets/img/       Fotografias (WebP) e logotipo
```

## Configurar o WhatsApp

Abra `index.html` e procure por `CONFIG` no fim do arquivo:

```js
const CONFIG = {
  WHATSAPP: "",                       // ex.: "5567999999999" (DDI + DDD + número, só dígitos)
  INSTAGRAM: "robertinhos_menfashion",
  BRAND: "Robertinho's Men Fashion"
};
```

- Com o número preenchido, todos os botões de atendimento abrem o WhatsApp
  com uma mensagem pronta (cada produto envia o próprio nome na mensagem).
- Enquanto estiver vazio, os mesmos botões abrem o Direct do Instagram da loja.

## Texto institucional

A seção "Sobre a marca" está marcada com `data-editable="sobre"` no HTML.
Troque os parágrafos pelos dados reais do proprietário.

## Fotografias

As imagens em `assets/img/` foram recortadas das capturas do Instagram e
ampliadas. Para o acabamento final, substitua cada arquivo pela foto original
em alta resolução, mantendo o mesmo nome e proporção 4:5 (ou 3:4).
