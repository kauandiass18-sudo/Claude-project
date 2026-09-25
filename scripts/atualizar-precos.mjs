// =============================================================
// Atualiza os preços da Ybera em data/ybera.js.
//
// Para cada produto, abre a página do link de afiliado na loja da Ybera
// e lê os dois preços que a loja mostra:
//   • preço riscado (ou o preço normal no cartão) → precoAntigo
//   • preço no Pix                               → preco
// Só troca o que mudou. Se uma página falhar ou vier estranha,
// aquele produto fica como está.
//
// Roda sozinho todo dia pela tarefa .github/workflows/precos-ybera.yml.
// Para rodar à mão:  node scripts/atualizar-precos.mjs
// =============================================================
import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const ARQUIVO = new URL("../data/ybera.js", import.meta.url);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

// "R$ 1.234,56" → 1234.56
const paraNumero = (t) => Number(String(t).replace(/[^\d,]/g, "").replace(",", "."));
// 1234.56 → "R$ 1.234,56"
const paraReais = (n) =>
  "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Lê os preços de uma página de produto da Ybera. */
function lerPrecos(html) {
  const limpo = html.replace(/\s+/g, " ");

  // 1) Barra "comprar" fixa: preço riscado + preço no Pix
  const barra = limpo.match(/id=["']?floating-buy-price["']?[^>]*>(.{0,900})/i);
  let riscado = null;
  let pix = null;
  if (barra) {
    const trecho = barra[1];
    const r = trecho.match(/line-through[^>]*>\s*(R\$\s?[\d.]+,\d{2})/i);
    if (r) riscado = paraNumero(r[1]);
    const valores = [...trecho.matchAll(/R\$\s?([\d.]+,\d{2})/g)].map((m) => paraNumero(m[1]));
    if (valores.length) pix = r ? valores[1] ?? null : valores[0];
  }

  // 2) Bloco principal: "R$ X</p> <span>no PIX" e "Ou <strong>R$ Y</strong> em até"
  const pixPrincipal = limpo.match(/(R\$\s?[\d.]+,\d{2})\s*<\/p>\s*<span[^>]*>\s*no PIX/i);
  const cartao = limpo.match(/Ou\s*<strong>\s*(R\$\s?[\d.]+,\d{2})\s*<\/strong>\s*em até/i);
  const pix2 = pixPrincipal ? paraNumero(pixPrincipal[1]) : null;
  const cartaoValor = cartao ? paraNumero(cartao[1]) : null;

  // Os dois jeitos precisam concordar no preço do Pix quando os dois existem
  if (pix && pix2 && Math.abs(pix - pix2) > 0.01) return { erro: `Pix diferente na página (${pix} x ${pix2})` };
  const precoPix = pix2 ?? pix;
  if (!precoPix) return { erro: "preço no Pix não encontrado" };

  // Preço riscado: o da barra; se não houver, o do cartão (quando for maior)
  let antigo = riscado ?? cartaoValor;
  if (antigo && antigo <= precoPix) antigo = null;

  return { preco: precoPix, precoAntigo: antigo };
}

/** Troca um campo ("preco" ou "precoAntigo") dentro do bloco de um produto. */
function trocarCampo(bloco, campo, valor) {
  const re = new RegExp(`(\\b${campo}:\\s*")[^"]*(")`);
  if (valor == null) {
    // sem preço riscado na loja: remove a linha
    return bloco.replace(new RegExp(`\\n\\s*${campo}:\\s*"[^"]*",?`), "");
  }
  if (re.test(bloco)) return bloco.replace(re, `$1${paraReais(valor)}$2`);
  // campo não existia: coloca logo depois do affiliateUrl
  return bloco.replace(/(affiliateUrl:\s*"[^"]*",)/, `$1\n      ${campo}: "${paraReais(valor)}",`);
}

/** Posição [início, fim] de cada bloco { ... } dentro de "produtos: [ ... ]", em ordem. */
function blocosDosProdutos(texto) {
  // a lista de verdade começa numa linha própria (não no comentário do topo)
  const achou = /^[ \t]*produtos:\s*\[/m.exec(texto);
  if (!achou) return [];
  const blocos = [];
  let i = achou.index + achou[0].length;
  while (true) {
    const ini = texto.indexOf("{", i);
    const fechaLista = texto.indexOf("]", i);
    if (ini < 0 || (fechaLista >= 0 && fechaLista < ini)) break;
    const fim = texto.indexOf("}", ini);
    blocos.push([ini, fim]);
    i = fim + 1;
  }
  return blocos;
}

async function main() {
  let texto = await readFile(ARQUIVO, "utf8");

  // Carrega a lista de produtos do próprio arquivo
  const caixa = { window: {} };
  vm.runInNewContext(texto, caixa);
  const produtos = caixa.window.LOJAS.ybera.produtos;

  if (blocosDosProdutos(texto).length !== produtos.length) {
    console.log("! A lista de produtos no arquivo não bate com os blocos { }. Nada foi mudado.");
    process.exit(1);
  }

  let mudancas = 0;
  let falhas = 0;
  for (const [indice, p] of produtos.entries()) {
    const nome = p.nome;
    try {
      const r = await fetch(p.affiliateUrl, {
        headers: { "user-agent": UA, "accept-language": "pt-BR" },
        redirect: "follow",
        signal: AbortSignal.timeout(30000)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const lido = lerPrecos(await r.text());
      if (lido.erro) throw new Error(lido.erro);

      // Proteção: uma mudança enorme de uma vez provavelmente é erro de leitura
      const atual = paraNumero(p.preco);
      if (atual && Math.abs(lido.preco - atual) / atual > 0.6) {
        throw new Error(`mudança grande demais (${p.preco} → ${paraReais(lido.preco)}), conferir à mão`);
      }

      const novoPreco = paraReais(lido.preco);
      const novoAntigo = lido.precoAntigo ? paraReais(lido.precoAntigo) : null;
      if (novoPreco === p.preco && novoAntigo === (p.precoAntigo || null)) {
        console.log(`= ${nome}: ${novoPreco} (sem mudança)`);
        continue;
      }

      // Acha o bloco { ... } deste produto pela posição na lista
      // (dois produtos podem ter o mesmo link) e troca só os preços
      const [ini, fim] = blocosDosProdutos(texto)[indice];
      let bloco = texto.slice(ini, fim);
      if (!bloco.includes(p.affiliateUrl)) throw new Error("bloco do produto não confere com o arquivo");
      bloco = trocarCampo(bloco, "precoAntigo", lido.precoAntigo);
      bloco = trocarCampo(bloco, "preco", lido.preco);
      texto = texto.slice(0, ini) + bloco + texto.slice(fim);
      mudancas++;
      console.log(`↻ ${nome}: ${p.precoAntigo || "—"} / ${p.preco}  →  ${novoAntigo || "—"} / ${novoPreco}`);
    } catch (e) {
      falhas++;
      console.log(`! ${nome}: não atualizado (${e.message})`);
    }
    await new Promise((ok) => setTimeout(ok, 800)); // sem pressa com a loja
  }

  if (mudancas) {
    // confere que o arquivo continua válido antes de salvar
    vm.runInNewContext(texto, { window: {} });
    await writeFile(ARQUIVO, texto);
  }
  console.log(`\nPreços mudados: ${mudancas}. Produtos não lidos: ${falhas}.`);
  // Todos falharam: provavelmente a página da loja mudou de formato
  if (falhas === produtos.length) process.exit(1);
}

main();
