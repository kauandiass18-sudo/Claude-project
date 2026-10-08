import test from 'node:test';
import assert from 'node:assert/strict';
import { centsBetween, describeMidi, formatCents, formatHz, midiToFreq, nearestNote, parseNote } from '../js/core/music.js';
import { TUNINGS, resolveStrings, tuningSummary, getTuning } from '../js/core/tunings.js';

test('frequências da afinação padrão', () => {
  const expected = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
  const strings = resolveStrings(getTuning('standard'));
  strings.forEach((s, i) => assert.ok(Math.abs(s.freq - expected[i]) < 0.01, s.name));
  assert.deepEqual(strings.map((s) => s.number), [6, 5, 4, 3, 2, 1]);
  assert.equal(tuningSummary(getTuning('standard')), 'E A D G B E');
});

test('calibração altera todas as notas', () => {
  assert.ok(Math.abs(midiToFreq(69, 432) - 432) < 1e-9);
  const [low] = resolveStrings(getTuning('standard'), 432);
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

test('todas as afinações têm 6 cordas válidas', () => {
  for (const tuning of TUNINGS) {
    const strings = resolveStrings(tuning);
    assert.equal(strings.length, 6, tuning.id);
    for (let i = 1; i < strings.length; i++) assert.ok(strings[i].freq > strings[i - 1].freq, tuning.id);
  }
});
