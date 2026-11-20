# Grazi · Manicure & Pedicure

Site de uma página em HTML, CSS e JavaScript puro. Não precisa instalar nada
nem rodar build: abra `grazi/index.html` no navegador, ou publique a pasta
`grazi/` inteira em qualquer hospedagem.

```
grazi/
├── index.html        A página
├── config.js         ← É AQUI QUE VOCÊ EDITA
├── assets/
│   ├── style.css     Visual (cores, fontes, espaçamentos)
│   └── app.js        Monta a página e cuida das interações
├── img/              Suas fotos
└── vendor/           Bibliotecas de animação (GSAP e Lenis)
```

---

## 1. O essencial antes de divulgar

| O quê | Onde | Por quê |
|---|---|---|
| Número do WhatsApp | `config.js` → `whatsapp` | Sem ele, o botão abre o WhatsApp sem destinatário |
| Fotos dos trabalhos | `config.js` → `galeria` | É a seção mais importante da página |
| Foto da Grazi | `config.js` → `fotos.grazi` | Dá rosto à marca |
| Depoimentos reais | `config.js` → `depoimentos` | Os atuais são exemplos e aparecem marcados |

Enquanto uma foto não for informada, o site mostra uma moldura delicada com o
nome da foto que vai ali. Nada de imagem de banco no lugar dos trabalhos reais.

---

## 2. Campos do `config.js`

### Contato

- **`whatsapp`** — só números, com país e DDD: `"5549999999999"`.
- **`mensagemAgendamento`**, **`mensagemSpa`**, **`mensagemEndereco`** — o texto
  que já aparece escrito quando a cliente abre a conversa.
- **`instagram`** e **`instagramUsuario`** — perfil e @ exibido.

### Localização

- **`cidade`**, **`estado`** — aparecem na página e no rodapé.
- **`endereco`** — texto completo. Preenchido, aparece na seção Localização e no
  rodapé, e o botão passa de "Pedir a localização" para "Abrir no Google Maps".
- **`mapa`** — link de incorporação. No Google Maps: Compartilhar → Incorporar um
  mapa → copie só o endereço que está dentro de `src="..."`.
- **`horarios`** — lista opcional. Vazia, a seção de horários não aparece.
  ```js
  horarios: [
    { dias: "Segunda a sexta", horas: "9h às 19h" },
    { dias: "Sábado",          horas: "9h às 16h" }
  ],
  ```

### Fotos principais

| Campo | Formato ideal |
|---|---|
| `fotos.hero` | Vertical (4:5), a partir de 1200×1500 |
| `fotos.heroDetalhe` | Quadrada, pequena (aparece num círculo) |
| `fotos.grazi` | Retrato vertical (4:5) |
| `fotos.spa` | Vertical (3:4) |

### Galeria

```js
{ src: "img/galeria/unhas-01.jpg", alt: "Esmaltação nude com arte floral", formato: "retrato" }
```

- **`formato`**: `"retrato"` (4:5), `"alto"` (2:3), `"quadrado"` (1:1) ou
  `"paisagem"` (3:2). Misturar formatos deixa o mosaico mais bonito.
- **`alt`**: descreva a foto em poucas palavras. Aparece na foto ampliada, ajuda
  no Google e em leitores de tela.
- Pode colocar quantas fotos quiser: a galeria cresce sozinha.

### Instagram

`instagramPosts` é uma lista opcional, atualizada à mão (não é integração ao
vivo). Vazia, a seção mostra só o convite e o botão — que é como está agora.

### Depoimentos

Troque os textos pelos reais e **apague a linha `exemplo: true`**. Enquanto ela
existir, o depoimento aparece com a etiqueta "Exemplo". Lista vazia (`[]`)
esconde a seção inteira, inclusive o item no menu.

---

## 3. Como preparar as fotos

1. Formato `.jpg` ou `.webp`, lado maior entre 1600 e 2000 px.
2. Comprima até uns 300–400 KB por foto (o site [squoosh.app](https://squoosh.app)
   faz isso sem perda visível).
3. Nomes simples, sem espaço nem acento: `img/galeria/unhas-01.jpg`.
4. Informe o caminho no `config.js`.

As fotos já carregam sob demanda, então a galeria pode ter muitas imagens sem
deixar a página lenta.

---

## 4. Depois de publicar

Em `index.html`, no topo do arquivo, há uma linha para a imagem que aparece
quando alguém compartilha o link no WhatsApp:

```html
<meta property="og:image" content="">
```

Cole aí o endereço completo de uma foto, por exemplo
`https://seusite.com.br/img/capa.jpg`.

O site já envia para o Google os dados do negócio (tipo, cidade, serviços,
WhatsApp e horários) a partir do que estiver no `config.js`.

---

## 5. Detalhes técnicos

- **Tipografia:** Bodoni Moda (títulos) e Jost (textos), do Google Fonts.
- **Animações:** GSAP com ScrollTrigger e rolagem suave com Lenis, servidos da
  pasta `vendor/` — o site não depende de nenhum serviço externo para funcionar.
- **Movimento reduzido:** quem configura o celular ou o computador para reduzir
  animações vê a página inteira parada, sem perder nenhum conteúdo.
- **Acessibilidade:** contraste conferido, navegação por teclado na galeria e no
  menu, textos alternativos vindos do `config.js`.
