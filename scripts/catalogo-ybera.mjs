// =============================================================
// Catálogo da Ybera: traz TODOS os produtos da loja para o site.
//
// Duas etapas:
//   node scripts/catalogo-ybera.mjs coletar  → lê a loja (precisa de internet)
//       • pega a lista de produtos no mapa do site (sitemap.xml)
//       • abre cada produto: nome, o que é, categoria, preços, foto, estoque
//       • salva tudo em data/ybera-catalogo.json e as fotos novas em
//         assets/img/produtos/ybera/
//   node scripts/catalogo-ybera.mjs gerar    → monta data/ybera.js
//       • a partir do data/ybera-catalogo.json (sem internet)
//       • mantém os produtos marcados como destaque ("Queridinhos")
//
// Sem nada: faz as duas. A tarefa .github/workflows/catalogo-ybera.yml roda
// isso todo dia; produtos novos entram, preços mudam e os que saírem da
// loja saem do site.
// =============================================================
import { readFile, writeFile, mkdir, access, readdir, unlink } from "node:fs/promises";
import vm from "node:vm";

const RAIZ = new URL("../", import.meta.url);
const ARQ_DADOS = new URL("data/ybera.js", RAIZ);
const ARQ_CATALOGO = new URL("data/ybera-catalogo.json", RAIZ);
const PASTA_FOTOS = new URL("assets/img/produtos/ybera/", RAIZ);
const LOJA = "https://www.ybera.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const PAUSA = 700; // ms entre páginas, para não pesar na loja

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function baixar(url, comoTexto = true) {
  const r = await fetch(url, {
    headers: { "user-agent": UA, "accept-language": "pt-BR" },
    redirect: "follow",
    signal: AbortSignal.timeout(30000)
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return comoTexto ? { url: r.url, texto: await r.text() } : Buffer.from(await r.arrayBuffer());
}

// ---------- Texto ----------
const ENTIDADES = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ordm: "º", ordf: "ª", deg: "°",
  middot: "·", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  reg: "®", trade: "™", copy: "©", bull: "•", times: "×", laquo: "«", raquo: "»"
};
const ACENTOS = { acute: "́", grave: "̀", circ: "̂", tilde: "̃", uml: "̈", cedil: "̧" };
function decodificar(t) {
  return String(t)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z]+);/g, (m, nome) => {
      if (ENTIDADES[nome]) return ENTIDADES[nome];
      const a = nome.match(/^([a-zA-Z])(acute|grave|circ|tilde|uml|cedil)$/);
      return a ? (a[1] + ACENTOS[a[2]]).normalize("NFC") : m;
    });
}
const semHtml = (t) =>
  decodificar(String(t).replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|h\d|li|div)>/gi, ". ").replace(/<[^>]+>/g, " "))
    .replace(/\\[rnt]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(\.\s*){2,}/g, ". ")
    .trim();

/** Frase curta sobre o que o produto é (até ~150 caracteres). */
function resumo(texto) {
  let t = semHtml(texto).replace(/^[\s.:–-]+/, "");
  if (!t) return "";
  const frases = t.match(/[^.!?]+[.!?]+/g) || [t];
  let saida = "";
  for (const f of frases) {
    const prox = (saida + " " + f.trim()).trim();
    if (prox.length > 150 && saida) break;
    saida = prox;
    if (saida.length >= 70) break;
  }
  if (saida.length > 160) saida = saida.slice(0, 157).replace(/\s+\S*$/, "") + "…";
  return saida;
}

// ---------- Preços ----------
const paraNumero = (t) => Number(String(t).replace(/[^\d,]/g, "").replace(",", "."));
const paraReais = (n) =>
  "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function lerPrecos(html) {
  const limpo = html.replace(/\s+/g, " ");
  let riscado = null;
  let pix = null;
  const barra = limpo.match(/id=["']?floating-buy-price["']?[^>]*>(.{0,900})/i);
  if (barra) {
    const r = barra[1].match(/line-through[^>]*>\s*(R\$\s?[\d.]+,\d{2})/i);
    if (r) riscado = paraNumero(r[1]);
    const valores = [...barra[1].matchAll(/R\$\s?([\d.]+,\d{2})/g)].map((m) => paraNumero(m[1]));
    if (valores.length) pix = r ? valores[1] ?? null : valores[0];
  }
  const pixPrincipal = limpo.match(/(R\$\s?[\d.]+,\d{2})\s*<\/p>\s*<span[^>]*>\s*no PIX/i);
  const cartao = limpo.match(/Ou\s*<strong>\s*(R\$\s?[\d.]+,\d{2})\s*<\/strong>\s*em até/i);
  let precoPix = pixPrincipal ? paraNumero(pixPrincipal[1]) : pix;
  let normal = cartao ? paraNumero(cartao[1]) : null;

  // Página sem o bloco de compra (ex.: esgotado): usa os dados da própria página
  if (!precoPix) {
    const js = limpo.match(/prices:\{list_price:([\d.]+),price:([\d.]+)/);
    const pixJs = limpo.match(/display_name:"Pix[^"]*desconto"[^\]]*?value:([\d.]+)/);
    if (js) {
      normal = normal ?? Number(js[2]);
      riscado = riscado ?? (Number(js[1]) > Number(js[2]) ? Number(js[1]) : null);
      precoPix = pixJs ? Number(pixJs[1]) : Number(js[2]);
    }
  }
  if (!precoPix) return null;
  let antigo = riscado ?? normal;
  if (antigo && antigo <= precoPix) antigo = null;
  return { preco: precoPix, precoAntigo: antigo };
}

// ---------- Uma página de produto ----------
function lerProduto(html, url) {
  const id = (url.match(/-(\d+)\/?$/) || [])[1];
  const ld = (html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i) || [])[1] || "";
  const nomeBruto =
    (ld.match(/"name":\s*"([^"]+)"/) || [])[1] ||
    (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] ||
    "";
  const nome = semHtml(nomeBruto).split(/\s+\|\s+/)[0].trim();

  // "O que é": descrição do produto (JSON-LD), senão a descrição da página
  const descLd = (ld.match(/"description":\s*"([\s\S]*?)",\s*"(?:sku|brand|offers|mpn|gtin\d*|url|aggregateRating|review|category)"/) || [])[1];
  const descMeta = (html.match(/<meta[^>]+name=["']?description["']?[^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']?description["']?/i) || [])[1];
  let oQueE = resumo(descLd || "");
  if (oQueE.length < 30 && descMeta) oQueE = resumo(descMeta);

  const categoria = semHtml(
    (html.match(/item_category:"([^"]+)"/) || [])[1] ||
      (html.match(/data-category=["']([^"']+)["']/) || [])[1] ||
      "Outros"
  );
  const imagem = (ld.match(/"image":\s*\[\s*"([^"]+)"/) || ld.match(/"image":\s*"([^"]+)"/) || [])[1] || null;
  const esgotado =
    /schema\.org\/OutOfStock/i.test(ld) || /data-available=false/i.test(html) || /id=btn-text>\s*Esgotado/i.test(html);
  const precos = lerPrecos(html);
  return { id, nome, oQueE, categoria, imagem, esgotado, ...precos };
}

// ---------- Etapa 1: coletar ----------
async function coletar() {
  const mapa = await baixar(`${LOJA}/sitemap.xml`);
  const fila = [...mapa.texto.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
  const urls = new Map(); // id → url
  const subMapas = fila.filter((u) => /\.xml(\?|$)/i.test(u));
  for (const u of fila) {
    const id = (u.match(/\/produto\/.*-(\d+)\/?$/i) || [])[1];
    if (id && !urls.has(id)) urls.set(id, u.replace(/\/Produto\//, "/produto/"));
  }
  for (const s of subMapas.slice(0, 30)) {
    try {
      const r = await baixar(s);
      for (const m of r.texto.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
        const u = m[1].replace(/&amp;/g, "&");
        const id = (u.match(/\/produto\/.*-(\d+)\/?$/i) || [])[1];
        if (id && !urls.has(id)) urls.set(id, u.replace(/\/Produto\//, "/produto/"));
      }
    } catch (e) {
      console.log(`! mapa ${s}: ${e.message}`);
    }
  }
  console.log(`Produtos no mapa da loja: ${urls.size}`);
  if (urls.size < 20) throw new Error("mapa da loja com poucos produtos; nada foi mudado");

  const limite = Number(process.env.LIMITE || 0) || Infinity;
  const produtos = [];
  let falhas = 0;
  for (const [id, url] of urls) {
    if (produtos.length + falhas >= limite) break;
    try {
      const pagina = await baixar(url);
      const p = lerProduto(pagina.texto, url);
      if (!p.nome) throw new Error("sem nome");
      if (!p.preco) throw new Error("sem preço");
      produtos.push({ ...p, id, url });
      console.log(`✓ ${p.nome} · ${p.categoria} · ${paraReais(p.preco)}${p.esgotado ? " · ESGOTADO" : ""}`);
    } catch (e) {
      falhas++;
      console.log(`! ${url}: ${e.message}`);
    }
    await esperar(PAUSA);
  }
  console.log(`\nLidos: ${produtos.length}. Falhas: ${falhas}.`);
  if (produtos.length < urls.size * 0.5 && limite === Infinity) {
    throw new Error("menos da metade dos produtos foi lida; nada foi mudado");
  }

  // Fotos: baixa só as que ainda não existem (quadradas, 400px)
  await mkdir(PASTA_FOTOS, { recursive: true });
  for (const p of produtos) {
    p.foto = `ybera-${p.id}.jpg`;
    const destino = new URL(p.foto, PASTA_FOTOS);
    try {
      await access(destino);
      continue;
    } catch {}
    if (!p.imagem) {
      p.foto = null;
      continue;
    }
    try {
      const u = new URL(p.imagem);
      u.searchParams.set("w", "400");
      u.searchParams.set("h", "400");
      await writeFile(destino, await baixar(u.href, false));
      await esperar(150);
    } catch (e) {
      console.log(`! foto de ${p.nome}: ${e.message}`);
      p.foto = null;
    }
  }

  // Apaga fotos de produtos que saíram da loja (só as geradas aqui: ybera-<id>.jpg)
  const ids = new Set(produtos.map((p) => p.id));
  for (const arq of await readdir(PASTA_FOTOS)) {
    const m = arq.match(/^ybera-(\d+)\.jpg$/);
    if (m && !ids.has(m[1]) && limite === Infinity) await unlink(new URL(arq, PASTA_FOTOS));
  }

  produtos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  await writeFile(ARQ_CATALOGO, JSON.stringify({ lidoEm: new Date().toISOString(), produtos }, null, 1) + "\n");
}

// ---------- Etapa 2: gerar data/ybera.js ----------
const aspas = (t) => JSON.stringify(String(t));

async function gerar() {
  const { produtos } = JSON.parse(await readFile(ARQ_CATALOGO, "utf8"));
  let texto = await readFile(ARQ_DADOS, "utf8");

  // Destaques atuais (pelo número do produto no link) continuam destaque, na mesma ordem
  const caixa = { window: {} };
  vm.runInNewContext(texto, caixa);
  const atuais = caixa.window.LOJAS.ybera.produtos || [];
  const idDe = (u) => (String(u).match(/-(\d+)(?:[/?#]|$)/) || [])[1];
  const destaques = [];
  for (const p of atuais) {
    const id = idDe(p.affiliateUrl);
    if (p.destaque && id && !destaques.includes(id)) destaques.push(id);
  }

  const porId = new Map(produtos.map((p) => [p.id, p]));
  const ordenados = [
    ...destaques.filter((id) => porId.has(id)).map((id) => porId.get(id)),
    ...produtos.filter((p) => !destaques.includes(p.id))
  ];
  // Esgotados vão para o fim
  ordenados.sort((a, b) => Number(a.esgotado) - Number(b.esgotado));

  const blocos = ordenados.map((p) => {
    const linhas = [
      `      nome: ${aspas(p.nome)},`,
      p.oQueE ? `      oQueE: ${aspas(p.oQueE)},` : null,
      `      categoria: ${aspas(p.categoria)},`,
      p.foto ? `      imagem: ${aspas("assets/img/produtos/ybera/" + p.foto)},` : null,
      `      affiliateUrl: ${aspas(p.url)},`,
      p.precoAntigo ? `      precoAntigo: ${aspas(paraReais(p.precoAntigo))},` : null,
      `      preco: ${aspas(paraReais(p.preco))},`,
      p.esgotado ? `      esgotado: true,` : null,
      `      destaque: ${destaques.includes(p.id)}`
    ].filter(Boolean);
    return `    {\n${linhas.join("\n")}\n    }`;
  });

  const inicio = /^[ \t]*produtos:\s*\[/m.exec(texto);
  if (!inicio) throw new Error("lista de produtos não encontrada em data/ybera.js");
  const abre = inicio.index + inicio[0].length;
  const fecha = texto.lastIndexOf("]", texto.lastIndexOf("};"));
  const novo =
    texto.slice(0, abre) +
    "\n    // Lista gerada sozinha a partir da loja (scripts/catalogo-ybera.mjs).\n" +
    "    // Para destacar um produto em \"Queridinhos do salão\", troque destaque para true.\n" +
    blocos.join(",\n") +
    "\n  " +
    texto.slice(fecha);

  vm.runInNewContext(novo, { window: {} }); // confere que o arquivo continua válido
  if (novo !== texto) await writeFile(ARQ_DADOS, novo);
  console.log(`data/ybera.js: ${ordenados.length} produtos (${destaques.length} destaques, ${ordenados.filter((p) => p.esgotado).length} esgotados).`);
}

const etapa = process.argv[2];
try {
  if (!etapa || etapa === "coletar") await coletar();
  if (!etapa || etapa === "gerar") await gerar();
} catch (e) {
  console.log(`ERRO: ${e.message}`);
  process.exit(1);
}
