import test from 'node:test';
import assert from 'node:assert/strict';
import { PitchDetector } from '../js/audio/pitch-detector.js';
import { pluck, noise, cents } from './helpers.mjs';

const NOTES = [73.42, 77.78, 82.41, 98.0, 110.0, 146.83, 196.0, 246.94, 293.66, 329.63];

for (const sampleRate of [44100, 48000]) {
  test(`precisão abaixo de 1 cent em ${sampleRate} Hz`, () => {
    const det = new PitchDetector({ sampleRate });
    for (const f0 of NOTES) {
      for (const dc of [-45, -13, 0, 4, 31]) {
        const f = f0 * 2 ** (dc / 1200);
        const r = det.detect(pluck(f, { sampleRate }));
        assert.ok(r.freq, `${f0} ${dc}`);
        assert.ok(Math.abs(cents(r.freq, f)) < 1, `${f0}${dc >= 0 ? '+' : ''}${dc}: ${r.freq}`);
        assert.ok(r.clarity > 0.9);
      }
    }
  });
}

test('fundamental fraca (microfone de celular) não vira oitava acima', () => {
  const det = new PitchDetector({ sampleRate: 48000 });
  for (const f of [73.42, 82.41, 110]) {
    const r = det.detect(pluck(f, { amps: [0.12, 1, 0.7, 0.5, 0.3] }));
    assert.ok(Math.abs(cents(r.freq, f)) < 1, `${f} → ${r.freq}`);
  }
});

test('dica do modo manual corrige erro de oitava', () => {
  const det = new PitchDetector({ sampleRate: 48000 });
  // Sinal quase só com o 2º harmônico: sem dica, lê a oitava de cima.
  const signal = pluck(82.41, { amps: [0.02, 1, 0.05, 0.3] });
  const free = det.detect(signal);
  const hinted = det.detect(signal, 82.41);
  assert.ok(Math.abs(cents(hinted.freq, 82.41)) < 2, `com dica: ${hinted.freq}`);
  assert.ok(free.freq > 0);
});

test('silêncio e ruído não produzem leitura confiável', () => {
  const det = new PitchDetector({ sampleRate: 48000 });
  assert.equal(det.detect(new Float32Array(4096)).freq, null);
  const r = det.detect(noise(4096, 0.2));
  assert.ok(r.clarity < 0.8, `clareza do ruído: ${r.clarity}`);
});
