# Âmbar · Estúdio Digital — página comercial

Página de apresentação para prospecção: mostra demonstrações navegáveis de sites
para vários segmentos e leva o visitante ao WhatsApp.

Endereço publicado (GitHub Pages):
`https://kauandiass18-sudo.github.io/Claude-project/estudio/`

---

## 1. Antes de enviar o link (obrigatório)

Abra `assets/js/config.js` e preencha:

```js
whatsapp: {
  numero: "5511912345678",   // 55 + DDD + número, só números
  saudacao: "Olá! Conheci o trabalho do estúdio pela página de apresentação."
}
```

Enquanto `numero` estiver vazio, os botões abrem o WhatsApp para a pessoa
escolher o contato (nenhum número é inventado).

No mesmo arquivo você troca o **nome do estúdio** (`marca.nome`,
`marca.complemento`) e, se quiser, região, Instagram e e-mail.
O nome também aparece em `index.html` nas tags de compartilhamento
(`<title>`, `og:title` e `"name"` do bloco JSON-LD); troque lá também.

---

## 2. Link personalizado por cliente

Acrescente parâmetros ao endereço para a página se adaptar ao segmento do
cliente que você está prospectando:

| Exemplo | O que acontece |
| --- | --- |
| `.../estudio/?seg=pizzaria` | Topo diz "Experiências digitais para pizzarias", as telas do topo e a galeria abrem na pizzaria |
| `.../estudio/?seg=hamburgueria` | O mesmo para hamburguerias e lanchonetes (`lanchonete` e `lanches` também funcionam) |
| `.../estudio/?seg=pizzaria&ref=pizzaria-do-joao` | Além disso, a mensagem do WhatsApp termina com "ref. pizzaria-do-joao" |

Valores aceitos em `seg`: `pizzaria`, `hamburgueria`, `lanchonete`,
`restaurante`, `doceria`, `confeitaria`, `moda`, `roupas`, `cosmeticos`,
`clinica`, `consultorio`, `dentista`, `estetica`, `spa`, `limpeza`,
`servicos`, `construcao`, `reforma`, `agro`, `fazenda`, `irrigacao`, e as
categorias `gastronomia`, `saude`.

Toda mensagem de WhatsApp informa de qual botão veio o contato, por exemplo:

```
Olá! Conheci o trabalho do estúdio pela página de apresentação.
Vi a demonstração “Forno Brasa” (pizzaria) e gostaria de algo nesse estilo para o meu negócio.

(Origem: Galeria — Pizzaria · página para pizzarias · ref. pizzaria-do-joao)
```

---

## 3. Estrutura

```
estudio/
├── index.html              Página (seções, textos e SEO)
├── assets/js/config.js     ← WhatsApp e marca (é aqui que você edita)
├── assets/js/demos.js      11 demonstrações conceituais e fotos (FOTOS)
├── assets/js/estudio.js    Galeria, visualizador, animações, WhatsApp
├── assets/css/estudio.css  Identidade visual da página
├── assets/css/demos.css    Visual de cada demonstração
├── assets/fonts/           Fontes locais (não dependem do Google Fonts)
└── assets/img/             Ícone e imagem de compartilhamento
```

Sem bibliotecas externas e sem build: é só publicar a pasta.

## 4. Fotos das demonstrações

As fotos vêm do Unsplash (uso gratuito) e são definidas em `FOTOS`, no topo
de `assets/js/demos.js`. Se alguma foto não carregar, o espaço mostra um fundo
de cor da própria demonstração, nunca um ícone quebrado. Para trocar uma foto,
substitua o código pelo de outra foto do Unsplash
(o trecho depois de `photo-` no endereço da imagem).

**Confira depois de publicar:** abra a galeria e passe pelas 11 demonstrações
para ver se todas as fotos carregaram.

## 5. Regras de conteúdo respeitadas

- Demonstrações identificadas como conceituais; marcas, produtos, preços e
  endereços são fictícios.
- Sem depoimentos, estatísticas, clientes ou promessas de resultado inventados.
- Acessível: navegação por teclado, foco visível, leitores de tela e
  respeito à preferência de reduzir animações.
