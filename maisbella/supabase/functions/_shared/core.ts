// Código compartilhado pelas funções da loja.
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.45.4";

export const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

export function admin(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
}

export const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

// Mesmos padrões de assets/js/data.js: o que não foi configurado fica desligado.
const DEFAULTS = {
  installments: { enabled: false, max: 3, minInstallment: 50 },
  payments: { pix: false, card: false, whatsapp: true, pixDiscount: 0 },
  shipping: { methods: [] as ShipMethod[], freeAbove: 0, melhorEnvio: false, originCep: "" },
  giftWrap: { enabled: false, price: 0, label: "Embalagem para presente" },
};

export type ShipMethod = { id: string; name: string; price: number; days?: string; freeAbove?: number };
export type Settings = typeof DEFAULTS & Record<string, unknown>;

export async function loadSettings(sb: SupabaseClient): Promise<Settings> {
  const { data } = await sb.from("settings").select("value").eq("key", "store").maybeSingle();
  const v = (data?.value ?? {}) as Record<string, any>;
  return {
    ...v,
    installments: { ...DEFAULTS.installments, ...(v.installments ?? {}) },
    payments: { ...DEFAULTS.payments, ...(v.payments ?? {}) },
    shipping: { ...DEFAULTS.shipping, ...(v.shipping ?? {}) },
    giftWrap: { ...DEFAULTS.giftWrap, ...(v.giftWrap ?? {}) },
  } as Settings;
}

// ---------------------------------------------------------------- Melhor Envio
// Embalagem padrão para semijoias; ajuste pelas variáveis de ambiente se necessário.
const PKG = {
  width: Number(Deno.env.get("PKG_WIDTH_CM") ?? 12),
  height: Number(Deno.env.get("PKG_HEIGHT_CM") ?? 4),
  length: Number(Deno.env.get("PKG_LENGTH_CM") ?? 12),
  weight: Number(Deno.env.get("PKG_WEIGHT_KG") ?? 0.1),
};

export async function melhorEnvioQuote(
  originCep: string,
  cep: string,
  items: { id: string; qty: number; price: number }[],
): Promise<ShipMethod[]> {
  const token = Deno.env.get("MELHOR_ENVIO_TOKEN");
  if (!token || !originCep) return [];
  const base = Deno.env.get("MELHOR_ENVIO_SANDBOX") === "true" ? "https://sandbox.melhorenvio.com.br" : "https://melhorenvio.com.br";
  const insurance = round2(items.reduce((s, i) => s + i.price * i.qty, 0));
  const res = await fetch(base + "/api/v2/me/shipment/calculate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "User-Agent": Deno.env.get("MELHOR_ENVIO_USER_AGENT") ?? "Mais Bella Semijoias",
    },
    body: JSON.stringify({
      from: { postal_code: originCep.replace(/\D/g, "") },
      to: { postal_code: cep.replace(/\D/g, "") },
      volumes: [{ ...PKG, insurance_value: insurance }],
      options: { receipt: false, own_hand: false },
    }),
  });
  if (!res.ok) return [];
  const list = (await res.json()) as any[];
  return list
    .filter((o) => !o.error && o.price)
    .map((o) => ({
      id: "me-" + o.id,
      name: `${o.company?.name ?? ""} ${o.name}`.trim(),
      price: round2(Number(o.custom_price ?? o.price)),
      days: o.custom_delivery_time ?? o.delivery_time ? `${o.custom_delivery_time ?? o.delivery_time} dias úteis após a postagem` : "",
    }));
}

// ---------------------------------------------------------------- Mercado Pago
export async function mp(path: string, init: RequestInit & { idempotency?: string } = {}) {
  const token = Deno.env.get("MP_ACCESS_TOKEN");
  if (!token) throw new Error("Provedor de pagamento não configurado.");
  const headers: Record<string, string> = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  if (init.idempotency) headers["X-Idempotency-Key"] = init.idempotency;
  const res = await fetch("https://api.mercadopago.com" + path, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message ?? "Falha no provedor de pagamento.");
  return body;
}
