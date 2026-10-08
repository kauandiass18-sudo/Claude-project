import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test('o service worker guarda todos os arquivos do aplicativo (funciona offline)', () => {
  const sw = readFileSync(join(root, 'sw.js'), 'utf8');
  const listed = new Set([...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]));
  const files = ['js', 'css', 'icons'].flatMap((dir) => walk(join(root, dir))).map((p) => relative(root, p));
  for (const file of [...files, 'index.html', 'manifest.webmanifest']) {
    assert.ok(listed.has(file), `faltando no sw.js: ${file}`);
  }
  for (const file of listed) {
    if (file) assert.ok(statSync(join(root, file)).isFile(), `sw.js lista arquivo inexistente: ${file}`);
  }
});
