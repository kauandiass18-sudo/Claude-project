/* =========================================================================
   CONFIGURAÇÃO — é só este arquivo que você precisa editar.
   ========================================================================= */

window.CONFIG = {
  /* Seu WhatsApp com DDI + DDD, só números. Ex.: 5511999999999 */
  meuWhatsApp: "5569992691749",

  /* Como a mensagem chega até você:
     - "callmebot": envio silencioso, direto no seu WhatsApp, sem abrir nada
                    para o cliente. Grátis. Precisa da apikey (veja o README).
     - "webhook":   envia os dados (JSON) para um endpoint seu — servidor,
                    função serverless, Z-API, n8n, Make, etc.
     - "link":      plano B. Abre o WhatsApp do cliente com a mensagem pronta
                    para ele tocar em "Enviar". Não precisa de configuração. */
  modoEnvio: "callmebot",

  /* Chave do CallMeBot (recebida no seu WhatsApp ao ativar o serviço). */
  callmebotApiKey: "COLOQUE_SUA_APIKEY_AQUI",

  /* Endereço do seu webhook (só para modoEnvio: "webhook"). */
  webhookUrl: "",

  /* Tempo mínimo (em segundos) entre dois envios do mesmo navegador. */
  intervaloEntreEnvios: 60
};
