#!/usr/bin/env node
/* Confere data/catalogo.js antes de publicar à mão.
   Uso (na pasta da vitrine):  node ferramentas/verificar-catalogo.mjs
   Não precisa instalar nada. Sai com código 1 se houver erro. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contexto = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(raiz, 'data/catalogo.js'), 'utf8'), contexto);
const cat = contexto.window.CATALOGO;
const erros = [], avisos = [];
if (!cat || !Array.isArray(cat.produtos)) { console.error('data/catalogo.js não define window.CATALOGO com uma lista de produtos.'); process.exit(1); }

const categorias = new Set((cat.categorias || []).map(c => c.id));
const ids = new Set(), links = new Map();
const shopee = h => /(^|\.)shopee\.com\.br$|(^|\.)shope\.ee$|(^|\.)shopee\.com$/.test(h);

for (const p of cat.produtos) {
  const nome = p.nome || p.id || '(sem nome)';
  if (!p.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) erros.push(`${nome}: identificador inválido`);
  if (ids.has(p.id)) erros.push(`${nome}: identificador repetido (${p.id})`);
  ids.add(p.id);
  if (!p.nome) erros.push(`${p.id}: sem nome`);
  if (!categorias.has(p.categoria)) erros.push(`${nome}: categoria “${p.categoria}” não existe`);
  const imgs = (p.imagens || []).map(i => typeof i === 'string' ? i : i.src).concat((p.imagens || []).map(i => i && i.pequena).filter(Boolean));
  if (!imgs.length) avisos.push(`${nome}: sem foto`);
  for (const src of imgs) if (!/^https?:\/\//.test(src) && !fs.existsSync(path.join(raiz, src))) erros.push(`${nome}: foto não encontrada (${src})`);
  if (p.demo) continue;
  const link = String(p.linkAfiliado || '').trim();
  if (!link) { avisos.push(`${nome}: sem link de afiliado (fica sem botão de compra)`); continue; }
  let url; try { url = new URL(link); } catch { erros.push(`${nome}: link inválido (${link})`); continue; }
  if (!/^https?:$/.test(url.protocol)) erros.push(`${nome}: o link precisa começar com https://`);
  else if (!shopee(url.hostname)) avisos.push(`${nome}: link fora da Shopee (${url.hostname})`);
  if (links.has(link)) erros.push(`${nome}: mesmo link de “${links.get(link)}”`);
  links.set(link, nome);
  if (p.precoAnterior != null && (p.preco == null || p.precoAnterior <= p.preco)) avisos.push(`${nome}: preço anterior ignorado (precisa ser maior que o atual)`);
  if (p.preco != null && !p.precoConferidoEm) avisos.push(`${nome}: preço sem data de conferência`);
}
for (const s of cat.selecoes || []) for (const id of s.produtos || []) if (!ids.has(id)) avisos.push(`Seleção “${s.titulo}”: produto ${id} não existe`);

const demos = cat.produtos.filter(p => p.demo).length;
console.log(`${cat.produtos.length} produtos, ${categorias.size} categorias, ${(cat.selecoes || []).length} seleções${demos ? `, ${demos} de exemplo` : ''}.`);
avisos.forEach(a => console.log('aviso:', a));
erros.forEach(e => console.log('ERRO:', e));
console.log(erros.length ? `${erros.length} erro(s).` : 'Nenhum erro.');
process.exit(erros.length ? 1 : 0);
