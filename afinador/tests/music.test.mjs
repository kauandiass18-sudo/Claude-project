import test from 'node:test';
import assert from 'node:assert/strict';
import { centsBetween, describeMidi, formatCents, formatHz, midiToFreq, nearestNote, parseNote } from '../js/core/music.js';
import { resolveStrings, tuningSummary } from '../js/core/tunings.js';
import { INSTRUMENTS, getInstrument, getTuning } from '../js/core/instruments/index.js';

const freqs = (instrumentId, tuningId) => resolveStrings(getTuning(instrumentId, tuningId)).map((s) => +s.freq.toFixed(2));

test('violão: afinação padrão E2 A2 D3 G3 B3 E4', () => {
  assert.deepEqual(freqs('guitar', 'standard'), [82.41, 110, 146.83, 196, 246.94, 329.63]);
  const strings = resolveStrings(getTuning('guitar', 'standard'));
  assert.deepEqual(strings.map((s) => s.number), [6, 5, 4, 3, 2, 1]);
  assert.equal(tuningSummary(getTuning('guitar', 'standard')), 'E A D G B E');
});

test('violão: afinações alternativas pedidas', () => {
  const summaries = Object.fromEntries(getInstrument('guitar').tunings.map((t) => [t.id, tuningSummary(t)]));
  assert.deepEqual(summaries, {
    standard: 'E A D G B E',
    'drop-d': 'D A D G B E',
    'eb-standard': 'E♭ A♭ D♭ G♭ B♭ E♭',
    'd-standard': 'D G C F A D',
    dadgad: 'D A D G A D',
    'open-g': 'D G D G B D',
    'open-d': 'D A D F♯ A D',
  });
});

test('violino: G3 D4 A4 E5, 4 cordas', () => {
  assert.deepEqual(freqs('violin', 'standard'), [196, 293.66, 440, 659.26]);
  assert.equal(tuningSummary(getTuning('violin', 'standard')), 'G D A E');
  assert.deepEqual(resolveStrings(getTuning('violin')).map((s) => s.number), [4, 3, 2, 1]);
});

test('ukulele: G4 C4 E4 A4 (reentrante), 4 cordas', () => {
  assert.deepEqual(freqs('ukulele', 'standard'), [392, 261.63, 329.63, 440]);
  assert.equal(tuningSummary(getTuning('ukulele', 'standard')), 'G C E A');
  assert.deepEqual(resolveStrings(getTuning('ukulele')).map((s) => s.name), ['G4', 'C4', 'E4', 'A4']);
});

test('afinação inexistente cai na padrão do instrumento', () => {
  assert.equal(getTuning('violin', 'drop-d').id, 'standard');
  assert.equal(getInstrument('banjo').id, 'guitar');
});

test('calibração altera todas as notas', () => {
  assert.ok(Math.abs(midiToFreq(69, 432) - 432) < 1e-9);
  const [low] = resolveStrings(getTuning('guitar', 'standard'), 432);
  assert.ok(Math.abs(low.freq - 80.91) < 0.01);
});

test('notas e nomes em português', () => {
  assert.equal(parseNote('E2'), 40);
  assert.equal(parseNote('F#3'), 54);
  assert.equal(parseNote('Eb4'), 63);
  assert.equal(describeMidi(40).solfege, 'Mi');
  assert.equal(describeMidi(51, 'flat').name, 'E♭3');
  assert.equal(describeMidi(51, 'flat').solfege, 'Mi♭');
  assert.equal(describeMidi(54).name, 'F♯3');
});

test('cents e formatação', () => {
  assert.ok(Math.abs(centsBetween(440 * 2 ** (-18 / 1200), 440) + 18) < 1e-9);
  const n = nearestNote(82.41 * 2 ** (-18 / 1200));
  assert.equal(n.name, 'E2');
  assert.equal(Math.round(n.cents), -18);
  assert.equal(formatHz(82.4069), '82,41 Hz');
  assert.equal(formatCents(-18.2), '−18');
  assert.equal(formatCents(3.4), '+3');
  assert.equal(formatCents(0.3), '0');
});

test('todo instrumento tem perfil de análise coerente com suas cordas', () => {
  for (const instrument of INSTRUMENTS) {
    const a = instrument.analysis;
    for (const key of ['minFreq', 'maxFreq', 'threshold', 'highpass', 'lowpass', 'rmsScale', 'smoothing', 'autoRange']) {
      assert.ok(Number.isFinite(a[key]), `${instrument.id}.${key}`);
    }
    for (const tuning of instrument.tunings) {
      const strings = resolveStrings(tuning);
      assert.equal(strings.length, instrument.tunings[0].notes.length, `${instrument.id}/${tuning.id}: mesma quantidade de cordas`);
      for (const s of strings) {
        // Margem de ~4 semitons para cordas muito desafinadas.
        assert.ok(s.freq * 0.79 >= a.minFreq, `${instrument.id}/${tuning.id} ${s.name} abaixo da faixa`);
        assert.ok(s.freq * 1.26 <= a.maxFreq, `${instrument.id}/${tuning.id} ${s.name} acima da faixa`);
        assert.ok(a.highpass < s.freq * 0.79 && a.lowpass > s.freq * 2, `${instrument.id} filtros cortam ${s.name}`);
      }
    }
  }
});
