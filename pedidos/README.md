# Pedidos de site · Formulário de captura

Página de captura de pedidos de criação de sites. O cliente informa o nome,
escolhe o tipo de negócio, descreve a ideia e informa o WhatsApp. Ao tocar em
**Enviar minha ideia**, o pedido vai para uma **planilha do Google Sheets** e
você recebe um **e-mail de aviso**, sem abrir o WhatsApp do cliente.

Feito só com **HTML, CSS e JavaScript puro**. Não precisa de build: é só subir
a pasta para qualquer hospedagem (GitHub Pages, Netlify, Vercel, Hostinger…).

## Prévia

| Computador | Celular | Após o envio |
|---|---|---|
| ![](previa/computador-pagina.png) | ![](previa/celular-pagina.png) | ![](previa/celular-sucesso.png) |

```
pedidos/
├── previa/        Capturas de tela da página
├── img/
│   └── og-image.jpg  Imagem que aparece ao compartilhar o link
├── index.html      Página: topo, como funciona, formulário,
│                   dúvidas frequentes e rodapé
├── css/style.css   Visual (cores, fontes, animações)
├── google-apps-script.gs  Código que grava os pedidos na planilha
└── js/
    ├── config.js   ← É AQUI QUE VOCÊ EDITA (seu número e forma de envio)
    └── app.js      Máscara, validação, montagem e envio da mensagem
```

---

## Por que não dá para usar só o link do WhatsApp?

Links como `wa.me/55119...?text=...` (e o `window.open` do WhatsApp Web)
sempre abrem o **WhatsApp de quem clicou**, e é essa pessoa que precisa tocar
em "Enviar". Para a mensagem chegar sem abrir nada para o cliente, outro
serviço precisa recebê-la por você. Por isso o site tem quatro modos,
escolhidos em `js/config.js`:

| Modo | Abre o WhatsApp do cliente? | Configuração |
|------|-----------------------------|--------------|
| `"planilha"` (padrão) | **Não** | 5 minutos, grátis |
| `"callmebot"` | **Não** | Chave do CallMeBot |
| `"webhook"` | **Não** | Precisa de um endpoint seu |
| `"link"` | Sim (plano B) | Nenhuma |

---

## 1. Google Sheets (padrão, grátis)

Cada pedido vira uma linha na planilha (data, nome, negócio, já tem site,
prazo, ideia, WhatsApp e link para responder) e você recebe um e-mail na sua
conta Google. Ative as notificações do app Gmail no celular para ser avisado
na hora.

1. Entre em [script.new](https://script.new) com sua conta Google. Abre um
   projeto novo do Apps Script. No celular, peça a versão para computador
   no menu do navegador.
2. Dê um nome ao projeto, por exemplo "Pedidos de site".
3. Apague o código que aparece e cole todo o conteúdo de
   `google-apps-script.gs`. Clique no ícone de salvar.

   O script cria sozinho a planilha "Pedidos de site" no seu Drive. Se
   preferir usar uma planilha que já existe, abra-a no computador e cole o
   código em **Extensões › Apps Script**.
4. No topo do editor, escolha a função **testar** e clique em **Executar**.
   O Google pede autorização: clique em **Revisar permissões**, escolha sua
   conta, depois em **Avançado › Acessar (não seguro)** e **Permitir**. Isso
   aparece porque o script é seu e ainda não foi verificado pelo Google.
   Confira: deve aparecer no Drive a planilha "Pedidos de site", com uma
   linha de teste na aba "Pedidos", e chegar um e-mail. Pode apagar essa linha depois.
5. Clique em **Implantar › Nova implantação**. Na engrenagem, escolha
   **App da Web** e preencha:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Clique em **Implantar** e copie o **URL do app da Web** (termina em
   `/exec`).
7. Cole esse endereço em `js/config.js`:

```js
modoEnvio: "planilha",
planilhaUrl: "https://script.google.com/macros/s/AKfy.../exec",
```

Para testar, abra o endereço `/exec` no navegador: deve aparecer
`"Recebedor de pedidos funcionando."`. Depois envie um pedido pelo site.

> **Mudou o código do Apps Script?** Vá em **Implantar › Gerenciar
> implantações**, edite a implantação atual e escolha **Nova versão**. Assim
> o endereço `/exec` continua o mesmo.

No início de `google-apps-script.gs` você pode desligar o e-mail
(`AVISAR_POR_EMAIL = false`) ou, se tiver uma chave do CallMeBot que funcione
para mensagens, preencher `CALLMEBOT_TELEFONE` e `CALLMEBOT_APIKEY` para
receber o aviso também no WhatsApp.

## 2. CallMeBot (aviso direto no WhatsApp)

O [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) é um
serviço gratuito que manda mensagens de WhatsApp **para o seu próprio número**.

1. Salve o número do CallMeBot nos seus contatos. O número atual está na
   página do link acima.
2. Pelo seu WhatsApp, mande para ele a mensagem:
   `I allow callmebot to send me messages`
3. Você recebe uma resposta com a sua **apikey** (ex.: `123456`).
4. Abra `js/config.js` e preencha:

```js
window.CONFIG = {
  meuWhatsApp: "5511999999999",   // seu número com DDI 55 + DDD
  modoEnvio: "callmebot",
  callmebotApiKey: "123456",      // a apikey que você recebeu
  ...
};
```

Pronto: cada pedido chega no seu WhatsApp, enviado pelo número do CallMeBot.

> A apikey fica visível no código da página. O pior que alguém pode fazer com
> ela é mandar mensagens **para você**: ela não dá acesso à sua conta. Se
> começar a receber spam, peça uma nova chave ao CallMeBot ou use o modo
> webhook.

## 3. Modo webhook (servidor próprio, Z-API, n8n, Make…)

Com `modoEnvio: "webhook"` e `webhookUrl` preenchido, o site faz um `POST` com
este JSON:

```json
{
  "destino": "5511999999999",
  "mensagem": "✨ *NOVO PEDIDO DE SITE* ...",
  "dados": {
    "negocio": "Restaurante",
    "ideia": "Quero um site...",
    "whatsapp": "(11) 98765-4321",
    "whatsappLink": "https://wa.me/5511987654321",
    "data": "09/10/2026",
    "hora": "14:32"
  }
}
```

Seu endpoint envia `mensagem` para `destino` pelo provedor que você usar
(WhatsApp Cloud API, Z-API, Evolution API, Twilio…) e responde com status 2xx.
Ele precisa aceitar requisições do domínio do site (CORS). Use esse modo se
quiser esconder as chaves do provedor.

## 4. Modo link (plano B)

Com `modoEnvio: "link"`, o site abre o WhatsApp do cliente numa nova aba com a
mensagem pronta. Não exige configuração, mas o cliente ainda precisa tocar em
"Enviar".

---

## Como a mensagem chega

```
✨ *NOVO PEDIDO DE SITE*

👤 *Cliente:* Ana Paula
🏢 *Negócio:* Restaurante
⏱️ *Prazo:* O quanto antes

💡 *Ideia do cliente:*
Quero um site elegante, com cardápio e reservas...

📱 *WhatsApp:* (11) 98765-4321
💬 Responder: https://wa.me/5511987654321

_Recebido em 09/10/2026 às 14:32_
```

As linhas "Já tem site" e "Prazo" só aparecem quando o cliente responde
essas perguntas opcionais. Toque no link "Responder" para abrir a conversa com o cliente. Para mudar o
texto, edite a função `montarMensagem` em `js/app.js`.

## Outros detalhes

- **Máscara de telefone:** `(11) 98765-4321` para celular e `(11) 3333-4444`
  para fixo. Se o cliente colar o número com `+55`, o DDI é removido.
- **Anti-spam:** um campo invisível pega robôs, e o mesmo navegador só pode
  enviar de novo depois de `intervaloEntreEnvios` segundos (padrão: 60).
- **Nome da marca:** troque "Studio" no `index.html` (topo e rodapé) e na
  imagem `img/og-image.jpg`.
- **Rodapé:** preencha `instagram` e `cidade` em `js/config.js`. Vazios, eles
  não aparecem.
- **Dúvidas frequentes:** as respostas ficam no `index.html`, na seção
  `id="duvidas"`. Revise para que digam exatamente como você trabalha.
- **Imagem de compartilhamento:** quando tiver domínio, troque `og:image` no
  `index.html` pelo endereço completo da imagem.
- **Cores:** ficam nas variáveis do início de `css/style.css`. O dourado é
  `--gold`. Para um azul discreto, use algo como `#7c9cc9`.
