// Cria o pedido com preços do banco (nunca confia nos valores do navegador),
// reserva o estoque e, se configurado, gera a cobrança no Mercado Pago.
import { admin, cors, json, loadSettings, melhorEnvioQuote, mp, round2, ShipMethod } from "../_shared/core.ts";

type Item = { id: string; qty: number; options?: Record<string, string>; custom?: Record<string, string> };

const onlyDigits = (s: unknown) => String(s ?? "").replace(/\D/g, "");
const clean = (s: unknown, max = 200) => String(s ?? "").replace(/[<>]/g, "").trim().slice(0, max);

function validCpf(c: string) {
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let d = 0;
    for (let i = 0; i < t; i++) d += Number(c[i]) * (t + 1 - i);
    d = ((10 * d) % 11) % 10;
    if (Number(c[t]) !== d) return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);
  const sb = admin();
  let orderId: string | null = null;

  try {
    const body = await req.json();

    // --------------------------------------------- cliente
    const c = body.customer ?? {}, a = body.address ?? {};
    const customer = {
      name: clean(c.name, 120), email: clean(c.email, 160).toLowerCase(),
      phone: clean(c.phone, 30), cpf: onlyDigits(c.cpf),
    };
    if (customer.name.split(/\s+/).length < 2) return json({ error: "Informe nome e sobrenome." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) return json({ error: "E-mail inválido." }, 400);
    if (onlyDigits(customer.phone).length < 10) return json({ error: "Celular inválido." }, 400);
    if (!validCpf(customer.cpf)) return json({ error: "CPF inválido." }, 400);
    const address = {
      cep: onlyDigits(a.cep), street: clean(a.street, 160), number: clean(a.number, 20), complement: clean(a.complement, 80),
      district: clean(a.district, 80), city: clean(a.city, 80), state: clean(a.state, 2).toUpperCase(),
    };
    if (address.cep.length !== 8 || !address.street || !address.number || !address.city || address.state.length !== 2) {
      return json({ error: "Endereço incompleto." }, 400);
    }

    // usuária logada (opcional): o pedido aparece em "Minha conta"
    let userId: string | null = null;
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (jwt) {
      const { data } = await sb.auth.getUser(jwt);
      userId = data?.user?.id ?? null;
    }

    const settings = await loadSettings(sb);

    // --------------------------------------------- pagamento permitido
    const method = String(body.payment);
    const hasMp = !!Deno.env.get("MP_ACCESS_TOKEN");
    const online = { pix: settings.payments.pix && hasMp, card: settings.payments.card && hasMp };
    const allowed =
      (method === "pix" && online.pix) ||
      (method === "card" && online.card) ||
      (method === "whatsapp" && (settings.payments.whatsapp || (!online.pix && !online.card)));
    if (!allowed) return json({ error: "Forma de pagamento indisponível." }, 400);

    // --------------------------------------------- itens com preço do banco
    const reqItems = (Array.isArray(body.items) ? body.items : []) as Item[];
    if (!reqItems.length || reqItems.length > 50) return json({ error: "Sacola vazia." }, 400);
    const ids = [...new Set(reqItems.map((i) => String(i.id)))];
    const { data: prods, error: pErr } = await sb.from("products").select("*").in("id", ids).eq("active", true);
    if (pErr) throw pErr;
    const byId = new Map((prods ?? []).map((p: any) => [p.id, p]));

    const items = reqItems.map((i) => {
      const p: any = byId.get(String(i.id));
      if (!p) throw new Error("Uma peça da sacola não está mais disponível.");
      const qty = Math.trunc(Number(i.qty));
      if (!(qty >= 1 && qty <= 99)) throw new Error("Quantidade inválida.");
      // variações precisam existir no cadastro
      const options: Record<string, string> = {};
      for (const o of (p.options ?? []) as { name: string; values: string[] }[]) {
        const v = i.options?.[o.name];
        if (!v || !o.values.includes(v)) throw new Error(`Escolha ${o.name.toLowerCase()} para ${p.name}.`);
        options[o.name] = v;
      }
      // personalização: tamanhos e obrigatórios conferidos no servidor
      const custom: Record<string, string> = {};
      const pz = p.personalization as { fields?: { label: string; maxLength?: number; required?: boolean }[] } | null;
      for (const f of pz?.fields ?? []) {
        const v = clean(i.custom?.[f.label], f.maxLength ?? 20);
        if (f.required && !v) throw new Error(`Preencha a personalização de ${p.name}.`);
        if (v) custom[f.label] = v;
      }
      return { id: p.id, slug: p.slug, name: p.name, price: Number(p.price), qty, options, custom, image: p.images?.[0] ?? "" };
    });
    const subtotal = round2(items.reduce((s, i) => s + i.price * i.qty, 0));

    // --------------------------------------------- cupom
    let discount = 0, couponCode: string | null = null;
    if (body.coupon) {
      const { data: r } = await sb.rpc("check_coupon", { p_code: String(body.coupon), p_subtotal: subtotal });
      if (!r?.valid) return json({ error: r?.message ?? "Cupom inválido." }, 400);
      discount = round2(Math.min(Number(r.discount), subtotal));
      couponCode = String(body.coupon).trim().toUpperCase();
    }

    // --------------------------------------------- frete
    let shipping: ShipMethod | null = null;
    const fixed = (settings.shipping.methods ?? []) as ShipMethod[];
    if (body.shippingId) {
      const sid = String(body.shippingId);
      if (sid.startsWith("me-")) {
        const quotes = settings.shipping.melhorEnvio
          ? await melhorEnvioQuote(settings.shipping.originCep, address.cep, items)
          : [];
        shipping = quotes.find((q) => q.id === sid) ?? null;
      } else {
        const m = fixed.find((x) => x.id === sid);
        if (m) shipping = { id: m.id, name: m.name, days: m.days, price: m.freeAbove && subtotal >= m.freeAbove ? 0 : round2(m.price) };
      }
      if (!shipping) return json({ error: "Forma de entrega indisponível. Escolha novamente." }, 400);
    } else if (fixed.length || settings.shipping.melhorEnvio) {
      return json({ error: "Escolha a forma de entrega." }, 400);
    } else if (method !== "whatsapp") {
      return json({ error: "Frete indisponível para pagamento online." }, 400);
    }

    const gift = body.giftWrap && settings.giftWrap.enabled ? round2(settings.giftWrap.price || 0) : 0;
    const pixDiscount = method === "pix" && settings.payments.pixDiscount
      ? round2((subtotal - discount) * Number(settings.payments.pixDiscount) / 100) : 0;
    const total = round2(Math.max(0, subtotal - discount - pixDiscount) + (shipping?.price ?? 0) + gift);
    const totals = { subtotal, discount, pixDiscount, shipping: shipping?.price ?? 0, gift, total };

    // --------------------------------------------- estoque e pedido
    const { error: stErr } = await sb.rpc("reserve_stock", { p_items: items.map((i) => ({ id: i.id, qty: i.qty, name: i.name })) });
    if (stErr) {
      const name = /estoque_insuficiente:(.*)/.exec(stErr.message)?.[1];
      return json({ error: name ? `Não há estoque suficiente de ${name}.` : "Não foi possível reservar o estoque." }, 409);
    }

    const { data: order, error: oErr } = await sb.from("orders").insert({
      user_id: userId, customer, address, shipping, items, totals, total, coupon: couponCode,
      gift_wrap: !!body.giftWrap && settings.giftWrap.enabled, gift_message: clean(body.giftMessage, 200),
      payment_method: method, notes: clean(body.notes, 400),
    }).select("id, number, access_token").single();
    if (oErr) {
      // devolve o estoque reservado
      for (const i of items) {
        const { data: p } = await sb.from("products").select("stock").eq("id", i.id).single();
        if (p && p.stock != null) await sb.from("products").update({ stock: p.stock + i.qty }).eq("id", i.id);
      }
      throw oErr;
    }
    orderId = order.id;
    if (couponCode) {
      const { data: cp } = await sb.from("coupons").select("used_count").eq("code", couponCode).single();
      await sb.from("coupons").update({ used_count: (cp?.used_count ?? 0) + 1 }).eq("code", couponCode);
    }

    const site = (Deno.env.get("SITE_URL") ?? "").replace(/\/$/, "");
    const back = `${site}/pedido.html?id=${order.id}&t=${order.access_token}`;
    const notify = `${Deno.env.get("SUPABASE_URL")}/functions/v1/mp-webhook`;
    const [first, ...rest] = customer.name.split(" ");
    let payment: Record<string, unknown> = { method };

    // --------------------------------------------- Pix
    if (method === "pix") {
      const expires = new Date(Date.now() + 30 * 60 * 1000);
      const pay = await mp("/v1/payments", {
        method: "POST", idempotency: order.id,
        body: JSON.stringify({
          transaction_amount: total,
          description: `Pedido ${order.number} · Mais Bella Semijoias`,
          payment_method_id: "pix",
          external_reference: order.id,
          notification_url: notify,
          date_of_expiration: expires.toISOString().replace("Z", "-00:00"),
          payer: { email: customer.email, first_name: first, last_name: rest.join(" "), identification: { type: "CPF", number: customer.cpf } },
        }),
      });
      const td = pay.point_of_interaction?.transaction_data ?? {};
      await sb.from("orders").update({
        payment_id: String(pay.id), payment_status: pay.status,
        payment_data: { qr_code: td.qr_code, qr_code_base64: td.qr_code_base64, ticket_url: td.ticket_url, expires_at: expires.toISOString() },
      }).eq("id", order.id);
    }

    // --------------------------------------------- cartão (Checkout Pro)
    if (method === "card") {
      if (!site) throw new Error("Configure SITE_URL nas funções para pagamento com cartão.");
      const pref = await mp("/checkout/preferences", {
        method: "POST", idempotency: order.id,
        body: JSON.stringify({
          items: [{ id: String(order.number), title: `Pedido ${order.number} · Mais Bella Semijoias`, quantity: 1, unit_price: total, currency_id: "BRL" }],
          payer: { name: first, surname: rest.join(" "), email: customer.email, identification: { type: "CPF", number: customer.cpf } },
          external_reference: order.id,
          notification_url: notify,
          back_urls: { success: back, pending: back, failure: back },
          auto_return: "approved",
          statement_descriptor: "MAISBELLA",
          payment_methods: {
            excluded_payment_types: [{ id: "ticket" }, { id: "bank_transfer" }, { id: "atm" }],
            installments: settings.installments.enabled ? Number(settings.installments.max) || 1 : 1,
          },
        }),
      });
      await sb.from("orders").update({ payment_data: { redirect: pref.init_point, preference_id: pref.id } }).eq("id", order.id);
      payment = { method, redirect: pref.init_point };
    }

    return json({ order: { id: order.id, token: order.access_token, number: order.number }, payment });
  } catch (e) {
    // Se a cobrança falhar depois de criar o pedido, cancela (o gatilho devolve o estoque).
    if (orderId) await sb.from("orders").update({ status: "cancelado", payment_status: "erro" }).eq("id", orderId);
    const msg = e instanceof Error ? e.message : "Erro inesperado.";
    console.error("checkout", msg);
    return json({ error: msg }, 400);
  }
});
