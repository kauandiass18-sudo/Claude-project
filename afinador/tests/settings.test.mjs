import test from 'node:test';
import assert from 'node:assert/strict';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = String(v)), data };
}

test('migra as configurações da versão anterior (só violão) e isola os perfis', async () => {
  globalThis.localStorage = memoryStorage({
    'afina.settings.v1': JSON.stringify({ tuningId: 'drop-d', mode: 'manual', stringIndex: 2, a4: 442, theme: 'light', onboarded: true }),
  });
  const { settings, currentProfile, updateProfile } = await import('../js/state/settings.js?v=migrate');

  assert.equal(settings.get().instrument, 'guitar', 'lembra o instrumento usado');
  assert.equal(settings.get().a4, 442);
  assert.deepEqual(currentProfile(), { tuningId: 'drop-d', mode: 'manual', stringIndex: 2 });

  // Cada instrumento tem a sua configuração.
  settings.set({ instrument: 'violin' });
  assert.deepEqual(currentProfile(), { tuningId: 'standard', mode: 'auto', stringIndex: 0 });
  updateProfile({ mode: 'manual', stringIndex: 3 });
  settings.set({ instrument: 'guitar' });
  assert.deepEqual(currentProfile(), { tuningId: 'drop-d', mode: 'manual', stringIndex: 2 });

  // Corda inexistente no instrumento é corrigida.
  settings.set({ instrument: 'ukulele' });
  updateProfile({ stringIndex: 5 });
  assert.equal(currentProfile().stringIndex, 0);

  const saved = JSON.parse(globalThis.localStorage.data['afina.settings.v2']);
  assert.equal(saved.profiles.violin.stringIndex, 3);
});

test('primeira abertura: nenhum instrumento escolhido', async () => {
  globalThis.localStorage = memoryStorage();
  const { settings } = await import('../js/state/settings.js?v=fresh');
  assert.equal(settings.get().instrument, null);
  assert.equal(settings.get().theme, 'dark');
});
