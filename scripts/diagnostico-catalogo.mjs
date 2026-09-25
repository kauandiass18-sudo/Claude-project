// Diagnóstico temporário: descobre como listar todos os produtos da Ybera
// e onde ficam nome, descrição, categoria, foto e estoque. Não muda arquivos.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const get = async (u) => { const r = await fetch(u, { headers: { "user-agent": UA, "accept-language": "pt-BR" } }); return { status: r.status, url: r.url, text: await r.text() }; };
const corta = (t, n) => t.replace(/\s+/g, " ").slice(0, n);

const robots = await get("https://www.ybera.com/robots.txt");
console.log("ROBOTS", robots.status, "\n" + robots.text.slice(0, 1500));
const sitemaps = [...robots.text.matchAll(/sitemap:\s*(\S+)/gi)].map(m => m[1]);
if (!sitemaps.length) sitemaps.push("https://www.ybera.com/sitemap.xml");
const produtos = new Set();
const fila = [...sitemaps];
const vistos = new Set();
while (fila.length && vistos.size < 60) {
  const s = fila.shift(); if (vistos.has(s)) continue; vistos.add(s);
  try {
    const r = await get(s);
    const locs = [...r.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1].replace(/&amp;/g, "&"));
    console.log("SITEMAP", s, r.status, "locs", locs.length, "ex:", locs.slice(0, 3));
    for (const l of locs) {
      if (/\.xml(\?|$)/i.test(l)) fila.push(l);
      else if (/\/produto\//i.test(l)) produtos.add(l);
    }
  } catch (e) { console.log("SITEMAP ERRO", s, e.message); }
}
console.log("PRODUTOS NO SITEMAP:", produtos.size);
console.log([...produtos].slice(0, 400).join("\n"));

// Página inicial: links de produto e de categoria
const home = await get("https://www.ybera.com/");
const linksProd = new Set([...home.text.matchAll(/href=["']?([^"' >]*\/produto\/[^"' >]*)/gi)].map(m => m[1]));
const linksCat = new Set([...home.text.matchAll(/href=["']?(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)["' >]/gi)].map(m => m[1]));
console.log("HOME produtos:", linksProd.size, "links curtos:", [...linksCat].slice(0, 80).join(" "));

// Um produto por completo: JSON-LD inteiro, breadcrumb e estoque
const p = await get("https://www.ybera.com/produto/kit-cuidados-profundos-ybera-fashion-gold-151333");
const ld = [...p.text.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
ld.forEach((b, i) => { const t = b.replace(/"description":\s*"(?:[^"\\]|\\.)*"/, '"description":"(cortado)"'); console.log("LD", i, corta(t, 1500)); });
const desc = ld[0] && ld[0].match(/"description":\s*"((?:[^"\\]|\\.)*)"/);
console.log("DESCRICAO:", desc ? corta(desc[1].replace(/<[^>]+>/g, " "), 900) : "nenhuma");
const bread = [...p.text.matchAll(/.{0,120}(breadcrumb|Breadcrumb).{0,400}/g)].map(m => corta(m[0], 520));
console.log("BREADCRUMB:", bread.slice(0, 4));
const estoque = [...p.text.matchAll(/.{0,80}(InStock|OutOfStock|esgotado|indispon|avise-me|aviseme|stock)[^<]{0,80}/gi)].map(m => corta(m[0], 200));
console.log("ESTOQUE:", [...new Set(estoque)].slice(0, 8));
const catg = [...p.text.matchAll(/(category|categoria|categories)["']?\s*[:=]\s*.{0,160}/gi)].map(m => corta(m[0], 200));
console.log("CATEGORIA:", [...new Set(catg)].slice(0, 8));
