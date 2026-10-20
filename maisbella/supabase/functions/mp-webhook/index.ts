// Notificações do Mercado Pago. O conteúdo recebido não é confiado:
// o pagamento é sempre consultado de novo na API antes de alterar o pedido.
import { admin, json, mp } from "../_shared/core.ts";

const MAP: Record<string, string> = { approved: "pago", cancelled: "cancelado", refunded: "cancelado", charged_back: "cancelado" };

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    let body: any = {};
    try { body = await req.json(); } catch { /* notificação via query string */ }
    const type = body.type ?? body.topic ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
    const id = body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");
    if (type !== "payment" || !id) return json({ ok: true });

    const pay = await mp(`/v1/payments/${encodeURIComponent(String(id))}`);
    const orderId = pay.external_reference;
    if (!orderId) return json({ ok: true });

    const sb = admin();
    const { data: order } = await sb.from("orders").select("id, status, total").eq("id", orderId).maybeSingle();
    if (!order) return json({ ok: true });

    const patch: Record<string, unknown> = { payment_id: String(pay.id), payment_status: pay.status };
    const next = MAP[pay.status];
    // Só aprova se o valor pago confere com o total do pedido.
    if (next === "pago" && order.status === "aguardando" && Math.abs(Number(pay.transaction_amount) - Number(order.total)) < 0.01) {
      patch.status = "pago";
    } else if (next === "cancelado" && (order.status === "aguardando" || pay.status !== "cancelled")) {
      patch.status = "cancelado";
    }
    await sb.from("orders").update(patch).eq("id", order.id);
    return json({ ok: true });
  } catch (e) {
    console.error("mp-webhook", e instanceof Error ? e.message : e);
    // 500 faz o Mercado Pago tentar novamente mais tarde
    return json({ ok: false }, 500);
  }
});
