// Service worker: recebe pedidos do painel no YouTube e conversa com o Claude.
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-5-5";
const MAX_TRANSCRIPT_CHARS = 600_000; // ~150k tokens; vídeos maiores são avisados, não cortados em silêncio

async function getSettings() {
  const { apiKey = "", language = "português do Brasil", effort = "medium" } =
    await chrome.storage.local.get(["apiKey", "language", "effort"]);
  return { apiKey, language, effort };
}

function buildSystem(video, language) {
  const intro =
    `Você é o Claude, um assistente dentro de uma extensão do YouTube. ` +
    `O usuário está assistindo ao vídeo abaixo. Responda sempre em ${language}, ` +
    `de forma clara e direta, usando Markdown simples (títulos curtos, listas, **negrito**). ` +
    `Quando citar um trecho do vídeo, indique o tempo no formato [mm:ss] ou [h:mm:ss] ` +
    `exatamente como aparece na transcrição — o usuário pode clicar nele para pular até aquele ponto. ` +
    `Se a pergunta não puder ser respondida pela transcrição, diga isso e responda com o que você sabe, deixando claro o que veio de fora do vídeo.`;

  const videoBlock =
    `<video>\n<titulo>${video.title}</titulo>\n<canal>${video.channel}</canal>\n` +
    `<descricao>\n${video.description}\n</descricao>\n` +
    (video.transcript
      ? `<transcricao>\n${video.transcript}\n</transcricao>\n`
      : `<transcricao>(não disponível — responda com base no título e na descrição, e avise o usuário)</transcricao>\n`) +
    `</video>`;

  // A transcrição fica num bloco com cache: as perguntas seguintes sobre o mesmo vídeo saem bem mais baratas.
  return [
    { type: "text", text: intro },
    { type: "text", text: videoBlock, cache_control: { type: "ephemeral" } },
  ];
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "claude-chat") return;
  let controller = null;

  port.onMessage.addListener(async (msg) => {
    if (msg.type === "cancel") {
      controller?.abort();
      return;
    }
    if (msg.type !== "ask") return;

    const { apiKey, language, effort } = await getSettings();
    if (!apiKey) {
      port.postMessage({ type: "error", code: "no_key", message: "Configure sua chave da API do Claude nas opções da extensão." });
      return;
    }
    if (msg.video.transcript && msg.video.transcript.length > MAX_TRANSCRIPT_CHARS) {
      port.postMessage({ type: "error", message: "A transcrição deste vídeo é longa demais para enviar de uma vez." });
      return;
    }

    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    controller = new AbortController();

    try {
      const stream = client.beta.messages.stream(
        {
          model: MODEL,
          max_tokens: 64000,
          thinking: { type: "adaptive" },
          output_config: { effort },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: buildSystem(msg.video, language),
          messages: msg.messages,
        },
        { signal: controller.signal },
      );

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          port.postMessage({ type: "delta", text: event.delta.text });
        }
      }
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") {
        port.postMessage({ type: "error", message: "O Claude não pôde responder a esse pedido." });
        return;
      }
      port.postMessage({ type: "done", stopReason: final.stop_reason });
    } catch (err) {
      if (controller.signal.aborted) {
        port.postMessage({ type: "done", stopReason: "cancelled" });
      } else if (err instanceof Anthropic.AuthenticationError) {
        port.postMessage({ type: "error", code: "no_key", message: "Chave da API inválida. Confira nas opções da extensão." });
      } else if (err instanceof Anthropic.RateLimitError) {
        port.postMessage({ type: "error", message: "Limite de uso atingido. Espere um pouco e tente de novo." });
      } else if (err instanceof Anthropic.APIError) {
        port.postMessage({ type: "error", message: `Erro da API (${err.status ?? "?"}): ${err.message}` });
      } else {
        port.postMessage({ type: "error", message: `Falha de conexão: ${err?.message ?? err}` });
      }
    } finally {
      controller = null;
    }
  });

  port.onDisconnect.addListener(() => controller?.abort());
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "open-options") chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") chrome.runtime.openOptionsPage();
});
