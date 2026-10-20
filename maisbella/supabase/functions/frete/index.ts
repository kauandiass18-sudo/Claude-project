// Cotação de frete pelo Melhor Envio (opcional). Sem token, retorna lista vazia
// e o checkout usa apenas as formas de entrega cadastradas no painel.
import { admin, cors, json, loadSettings, melhorEnvioQuote } from "../_shared/core.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { cep, items } = await req.json();
    if (String(cep ?? "").replace(/\D/g, "").length !== 8) return json({ options: [] });
    const sb = admin();
    const settings = await loadSettings(sb);
    if (!settings.shipping.melhorEnvio) return json({ options: [] });
    const ids = (items ?? []).map((i: { id: string }) => i.id);
    const { data: prods } = await sb.from("products").select("id, price").in("id", ids).eq("active", true);
    const priced = (items ?? []).map((i: { id: string; qty: number }) => ({
      id: i.id, qty: Math.max(1, Math.trunc(Number(i.qty) || 1)),
      price: Number((prods ?? []).find((p: { id: string }) => p.id === i.id)?.price ?? 0),
    }));
    return json({ options: await melhorEnvioQuote(settings.shipping.originCep, cep, priced) });
  } catch (e) {
    console.error("frete", e instanceof Error ? e.message : e);
    return json({ options: [] });
  }
});
