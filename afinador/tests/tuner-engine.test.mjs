import test from 'node:test';
import assert from 'node:assert/strict';
import { TunerEngine, Status, Zone, classify } from '../js/core/tuner-engine.js';

const STEP = 25;
const at = (f, c = 0) => f * 2 ** (c / 1200);

/** Alimenta o motor com `frames` leituras iguais e devolve o último retrato. */
function feed(engine, freq, frames, state, { rms = 0.05, clarity = 0.97, jitter = 0 } = {}) {
  let snap;
  for (let i = 0; i < frames; i++) {
    state.t += STEP;
    const f = freq == null ? null : at(freq, jitter ? Math.sin(i * 1.7) * jitter : 0);
    snap = engine.process({ freq: f, clarity: freq == null ? 0 : clarity, rms: freq == null ? rms : rms, t: state.t });
  }
  return snap;
}

test('zonas de afinação', () => {
  assert.equal(classify(0, 5), Zone.IN_TUNE);
  assert.equal(classify(-5, 5), Zone.IN_TUNE);
  assert.equal(classify(-5.4, 5), Zone.IN_TUNE, 'exibido como −5: afinado');
  assert.equal(classify(-5.6, 5), Zone.FLAT, 'exibido como −6: grave');
  assert.equal(classify(-12, 5), Zone.FLAT);
  assert.equal(classify(-35, 5), Zone.FLAT_FAR);
  assert.equal(classify(9, 5), Zone.SHARP);
  assert.equal(classify(60, 5), Zone.SHARP_FAR);
});

test('modo automático identifica a 6ª corda e o desvio', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  const snap = feed(e, at(82.41, -18), 12, s);
  assert.equal(snap.status, Status.ACTIVE);
  assert.equal(snap.target.number, 6);
  assert.equal(snap.target.name, 'E2');
  assert.equal(Math.round(snap.cents), -18);
  assert.equal(snap.zone, Zone.FLAT);
});

test('cada corda é reconhecida no modo automático', () => {
  const freqs = [82.41, 110, 146.83, 196, 246.94, 329.63];
  freqs.forEach((f, i) => {
    const e = new TunerEngine({ mode: 'auto' });
    const snap = feed(e, at(f, 9), 10, { t: 0 });
    assert.equal(snap.target.index, i);
    assert.equal(snap.zone, Zone.SHARP);
  });
});

test('frequência ambígua não escolhe corda', () => {
  const e = new TunerEngine({ mode: 'auto' });
  // A meio caminho entre Lá2 (110) e Ré3 (146,83).
  const snap = feed(e, at(110, 250), 10, { t: 0 });
  assert.equal(snap.status, Status.AMBIGUOUS);
  assert.equal(snap.target, null);
});

test('confirma "afinado" após um breve tempo estável e marca a corda', () => {
  const e = new TunerEngine({ mode: 'auto', tolerance: 5 });
  const s = { t: 0 };
  let snap = feed(e, at(110, 2), 4, s);
  assert.equal(snap.zone, Zone.IN_TUNE);
  assert.equal(snap.inTune, false);
  let tunedEvents = 0;
  for (let i = 0; i < 30; i++) {
    snap = feed(e, at(110, 2), 1, s);
    if (snap.justTuned) tunedEvents++;
  }
  assert.equal(snap.inTune, true);
  assert.equal(tunedEvents, 1, 'o evento de afinado dispara uma única vez');
  assert.deepEqual(snap.tuned, [1]);
});

test('oscilações pequenas são suavizadas', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  feed(e, 196, 10, s);
  const values = [];
  for (let i = 0; i < 40; i++) values.push(feed(e, 196, 1, s, { jitter: i % 2 ? 6 : -6 }).cents);
  const spread = Math.max(...values.slice(10)) - Math.min(...values.slice(10));
  assert.ok(spread < 6, `variação exibida: ${spread.toFixed(2)} cents (entrada: 12)`);
});

test('uma leitura isolada errada não troca a nota', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  feed(e, 110, 10, s);
  const glitch = feed(e, 220, 1, s);
  assert.equal(glitch.status, Status.ACTIVE, 'não pisca para "espera"');
  assert.equal(glitch.target.number, 5);
  assert.ok(Math.abs(glitch.cents) < 1);
  const after = feed(e, 110, 3, s);
  assert.equal(after.target.number, 5);
});

test('mudança real de nota é aceita rapidamente', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  feed(e, 110, 10, s);
  const snap = feed(e, 146.83, 3, s);
  assert.equal(snap.target.number, 4);
});

test('modo manual mede contra a corda escolhida, mesmo muito longe', () => {
  const e = new TunerEngine({ mode: 'manual', stringIndex: 0 });
  const snap = feed(e, at(82.41, -140), 8, { t: 0 });
  assert.equal(snap.target.number, 6);
  assert.equal(snap.zone, Zone.FLAT_FAR);
  assert.equal(Math.round(snap.cents), -140);
  assert.equal(e.hintHz.toFixed(2), '82.41');
});

test('calibração muda a referência', () => {
  const e = new TunerEngine({ mode: 'auto', a4: 432 });
  const snap = feed(e, 110, 10, { t: 0 });
  assert.equal(Math.round(snap.cents), Math.round(1200 * Math.log2(440 / 432)));
});

test('silêncio, sinal fraco e ruído', () => {
  const e = new TunerEngine({ mode: 'auto', sensitivity: 'medium' });
  const s = { t: 0 };
  assert.equal(feed(e, null, 5, s, { rms: 0 }).status, Status.IDLE);
  assert.equal(feed(e, null, 40, s, { rms: 0.0015 }).status, Status.WEAK);
  assert.equal(feed(e, null, 40, s, { rms: 0.08 }).status, Status.UNSTABLE);
});

test('mantém a última leitura enquanto a corda silencia, depois volta a aguardar', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  feed(e, 110, 10, s);
  const hold = feed(e, null, 10, s, { rms: 0 });
  assert.equal(hold.status, Status.HOLD);
  assert.equal(hold.target.number, 5);
  const idle = feed(e, null, 80, s, { rms: 0 });
  assert.equal(idle.status, Status.IDLE);
  assert.equal(idle.freq, null);
});

test('afinação alternativa (Drop D)', () => {
  const e = new TunerEngine({ mode: 'auto', tuningId: 'drop-d' });
  const snap = feed(e, 73.42, 10, { t: 0 });
  assert.equal(snap.target.number, 6);
  assert.equal(snap.target.name, 'D2');
  assert.ok(Math.abs(snap.cents) < 1);
});

test('na borda da tolerância a zona não fica piscando', () => {
  const e = new TunerEngine({ mode: 'auto', tolerance: 5 });
  const s = { t: 0 };
  feed(e, at(110, -4.8), 12, s);
  const zones = new Set();
  for (let i = 0; i < 40; i++) zones.add(feed(e, at(110, i % 2 ? -4.6 : -6.4), 1, s).zone);
  assert.equal(zones.size, 1, `zonas vistas: ${[...zones]}`);
});

test('zona exibida nunca contradiz os cents exibidos (fora da transição)', () => {
  const e = new TunerEngine({ mode: 'auto', tolerance: 5 });
  const s = { t: 0 };
  for (const c of [-5.3, -5.7, 4.9, 5.2, 5.6, 0, -12]) {
    const snap = feed(e, at(110, c), 32, s);
    const shown = Math.abs(Math.round(snap.cents));
    assert.equal(snap.zone === Zone.IN_TUNE, shown <= 5, `${c}: ${snap.zone} com ${shown}`);
  }
});

test('violino: modo automático reconhece G D A E', () => {
  [196, 293.66, 440, 659.26].forEach((f, i) => {
    const e = new TunerEngine({ instrumentId: 'violin', mode: 'auto' });
    const snap = feed(e, at(f, -8), 10, { t: 0 });
    assert.equal(snap.target.index, i);
    assert.equal(snap.target.number, 4 - i);
    assert.equal(snap.zone, Zone.FLAT);
  });
});

test('ukulele: reconhece G4 reentrante e C4', () => {
  const e = new TunerEngine({ instrumentId: 'ukulele', mode: 'auto' });
  const s = { t: 0 };
  let snap = feed(e, 392, 10, s);
  assert.equal(snap.target.name, 'G4');
  assert.equal(snap.target.number, 4);
  feed(e, null, 80, s, { rms: 0 });
  snap = feed(e, 261.63, 10, s);
  assert.equal(snap.target.name, 'C4');
  assert.equal(snap.target.number, 3);
});

test('frequências fora da faixa do instrumento são ignoradas', () => {
  const v = new TunerEngine({ instrumentId: 'violin', mode: 'auto' });
  const snap = feed(v, 82.41, 40, { t: 0 });
  assert.notEqual(snap.status, Status.ACTIVE, 'Mi grave do violão não existe no violino');
});

test('trocar de instrumento não mantém nada do anterior', () => {
  const e = new TunerEngine({ instrumentId: 'guitar', mode: 'auto' });
  const s = { t: 0 };
  for (let i = 0; i < 30; i++) feed(e, 110, 1, s);
  assert.deepEqual(e.tuned.size, 1);
  e.configure({ instrumentId: 'ukulele' });
  assert.equal(e.tuned.size, 0);
  assert.equal(e.locked, null);
  assert.equal(e.display, null);
  assert.equal(e.strings.length, 4);
  const idle = feed(e, null, 1, s, { rms: 0 });
  assert.equal(idle.status, Status.IDLE);
  assert.equal(idle.instrumentId, 'ukulele');
  assert.equal(idle.target, null);
});

test('parâmetros de análise diferem por instrumento', () => {
  const g = new TunerEngine({ instrumentId: 'guitar' });
  const v = new TunerEngine({ instrumentId: 'violin' });
  const u = new TunerEngine({ instrumentId: 'ukulele' });
  assert.notEqual(g.analysis.minFreq, v.analysis.minFreq);
  assert.ok(v.gate.rms > g.gate.rms && u.gate.rms < g.gate.rms);
});

test('após uma leitura ambígua, o silêncio não gera estado sem zona', () => {
  const e = new TunerEngine({ mode: 'auto' });
  const s = { t: 0 };
  assert.equal(feed(e, at(110, 250), 10, s).status, Status.AMBIGUOUS);
  for (let i = 0; i < 80; i++) {
    const snap = feed(e, null, 1, s, { rms: 0 });
    if (snap.status === Status.HOLD || snap.status === Status.ACTIVE) assert.ok(snap.zone, 'leitura sem zona');
  }
});
