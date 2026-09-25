// Diagnóstico: mostra como as páginas da Ybera escrevem os preços.
// Usado só para descobrir o formato; não muda nenhum arquivo.
const urls = [
  "https://www.ybera.com/produto/escova-progressiva-500g-fashion-gold-150264",
  "https://www.ybera.com/produto/kit-cuidados-profundos-ybera-fashion-gold-151333",
  "https://www.ybera.com/produto/100timetros-tonico-antiqueda-capilar-150ml-fashion-gold-150308"
];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const corta = (t, n = 400) => t.replace(/\s+/g, " ").slice(0, n);
for (const url of urls) {
  console.log("\n==========", url);
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, "accept-language": "pt-BR" }, redirect: "follow" });
    const html = await r.text();
    console.log("status", r.status, "final", r.url, "tamanho", html.length);
    const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    console.log("JSON-LD:", ld.length);
    ld.forEach((b, i) => console.log(` ld[${i}]`, corta(b, 900)));
    const metas = [...html.matchAll(/<meta[^>]+(price|preco|amount|currency)[^>]*>/gi)].map(m => m[0]);
    console.log("META:", metas.slice(0, 10).map(m => corta(m, 200)));
    const itemprop = [...html.matchAll(/[^<>]{0,80}itemprop=["']?(price|lowPrice|highPrice)[^>]*>[^<]{0,40}/gi)].map(m => corta(m[0], 220));
    console.log("ITEMPROP:", itemprop.slice(0, 8));
    const reais = [...html.matchAll(/.{0,160}R\$\s?[\d.]+,\d{2}.{0,120}/g)].map(m => corta(m[0], 300));
    console.log("R$ (", reais.length, "):");
    reais.slice(0, 14).forEach(t => console.log("  -", t));
    const pix = [...html.matchAll(/.{0,160}pix.{0,160}/gi)].map(m => corta(m[0], 330));
    console.log("PIX (", pix.length, "):");
    pix.slice(0, 8).forEach(t => console.log("  -", t));
    const vars = [...html.matchAll(/(price|preco|valor)["']?\s*[:=]\s*["']?[\d.,]+/gi)].map(m => m[0]);
    console.log("VARS:", [...new Set(vars)].slice(0, 25));
    const plataforma = ["vtex", "tray", "lojaintegrada", "nuvemshop", "shopify", "wake", "fbits", "magento", "vnda", "jet", "linx"].filter(p => html.toLowerCase().includes(p));
    console.log("PLATAFORMA (pistas):", plataforma);
  } catch (e) {
    console.log("ERRO", e.message);
  }
}
