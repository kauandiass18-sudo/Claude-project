/**
 * Motor do afinador.
 *
 * Recebe leituras brutas do detector (frequência, clareza, energia) quadro a
 * quadro e devolve um "retrato" estável do que mostrar na tela:
 *   - filtra ruído e leituras isoladas (mediana + confirmação de mudança de nota);
 *   - suaviza a leitura para o ponteiro não tremer;
 *   - escolhe a corda (modo automático) sem "chutar" quando há ambiguidade;
 *   - calcula cents, zona (grave/afinado/agudo) e confirma a afinação.
 *
 * É puro: o tempo chega em cada quadro (`t`, em ms), o que facilita testes.
 */
import { centsBetween, freqToMidi, midiToFreq, nearestNote } from './music.js';
import { resolveStrings } from './tunings.js';
import { getInstrument, getTuning } from './instruments/index.js';

export const Status = Object.freeze({
  IDLE: 'idle', // nada tocando
  WEAK: 'weak', // som presente, mas fraco demais
  UNSTABLE: 'unstable', // som alto, sem altura definida (ruído)
  AMBIGUOUS: 'ambiguous', // modo automático não conseguiu decidir a corda
  ACTIVE: 'active', // leitura válida agora
  HOLD: 'hold', // a corda parou de soar; mantém a última leitura por instantes
});

export const Zone = Object.freeze({
  FLAT_FAR: 'flat-far',
  FLAT: 'flat',
  IN_TUNE: 'in-tune',
  SHARP: 'sharp',
  SHARP_FAR: 'sharp-far',
});

/** Limiares por sensibilidade: energia mínima (RMS) e clareza mínima do YIN. */
// Microfones de celular, sem ganho automático, captam o instrumento bem baixo
// (−40 a −55 dBFS na sustentação); a clareza do YIN separa nota de ruído.
export const SENSITIVITY = Object.freeze({
  low: { rms: 0.007, clarity: 0.9 },
  medium: { rms: 0.0025, clarity: 0.85 },
  high: { rms: 0.0012, clarity: 0.82 },
});


const HOLD_MS = 1500;
const WEAK_MS = 600;
const UNSTABLE_MS = 450;
const CONFIRM_MS = 350;
const DETUNE_MS = 600;
const ONSET_GAP_MS = 250;
const MEDIAN_SIZE = 5;
const HISTORY_SIZE = 9;
const JUMP_CENTS = 45;
const JUMP_FRAMES = 3;
const ONSET_FRAMES = 2;
const AMBIGUOUS_MARGIN = 80;
const LOCK_BIAS_CENTS = 60;
const ZONE_SWITCH_MS = 120; // tempo mínimo para trocar de zona (evita cintilação)
const ZONE_LEAVE_TUNE_MS = 250; // sair de "afinado" exige um pouco mais de certeza

/**
 * Classifica o desvio em uma das cinco zonas.
 * Usa o valor arredondado, o mesmo exibido na tela: "−5 cents" com
 * tolerância de ±5 é sempre "afinado", nunca uma contradição visual.
 */
export function classify(cents, tolerance) {
  const abs = Math.abs(Math.round(cents));
  if (abs <= tolerance) return Zone.IN_TUNE;
  const far = Math.max(20, tolerance * 2);
  if (cents < 0) return abs > far ? Zone.FLAT_FAR : Zone.FLAT;
  return abs > far ? Zone.SHARP_FAR : Zone.SHARP;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export class TunerEngine {
  constructor(config = {}) {
    this.cfg = {
      instrumentId: 'guitar',
      tuningId: 'standard',
      a4: 440,
      mode: 'auto',
      stringIndex: 0,
      tolerance: 5,
      sensitivity: 'medium',
    };
    this.tuned = new Set();
    this.reset();
    this.configure(config);
  }

  /** Atualiza a configuração. Mudanças de afinação/corda/modo zeram a confirmação. */
  configure(patch) {
    const prev = this.cfg;
    const next = { ...prev, ...patch };
    this.cfg = next;
    const instrumentChanged = next.instrumentId !== prev.instrumentId;
    const tuningChanged = instrumentChanged || next.tuningId !== prev.tuningId;
    if (!this.strings || tuningChanged || next.a4 !== prev.a4) {
      this.instrument = getInstrument(next.instrumentId);
      this.analysis = this.instrument.analysis;
      this.tuning = getTuning(next.instrumentId, next.tuningId);
      this.strings = resolveStrings(this.tuning, next.a4);
    }
    // Outro instrumento: nada do anterior é mantido (leituras, corda, marcas).
    if (instrumentChanged && this.history) this.reset();
    if (tuningChanged) {
      this.tuned.clear();
      this.locked = null;
    }
    if (next.a4 !== prev.a4) this.tuned.clear();
    if (next.mode !== prev.mode || next.stringIndex !== prev.stringIndex || tuningChanged) {
      this.resetConfirmation();
      if (next.mode === 'manual') this.locked = null;
    }
    this.cfg.stringIndex = Math.min(Math.max(0, next.stringIndex | 0), this.strings.length - 1);
  }

  reset() {
    this.history = [];
    this.pending = [];
    this.pendingAt = -Infinity;
    this.display = null; // nota MIDI fracionária (referência fixa 440 Hz)
    this.lastValidAt = -Infinity;
    this.weakSince = null;
    this.unstableSince = null;
    this.locked = null;
    this.last = null;
    this.resetZone();
    this.resetConfirmation();
  }

  resetZone() {
    this.zone = null;
    this.pendingZone = null;
    this.pendingZoneAt = 0;
  }

  /** Só troca de zona quando a nova zona se mantém por um instante. */
  settleZone(candidate, t) {
    if (this.zone == null || candidate === this.zone) {
      this.zone = candidate;
      this.pendingZone = null;
      return candidate;
    }
    if (this.pendingZone !== candidate) {
      this.pendingZone = candidate;
      this.pendingZoneAt = t;
    }
    const wait = this.zone === Zone.IN_TUNE ? ZONE_LEAVE_TUNE_MS : ZONE_SWITCH_MS;
    if (t - this.pendingZoneAt >= wait) {
      this.zone = candidate;
      this.pendingZone = null;
    }
    return this.zone;
  }

  resetConfirmation() {
    this.inTuneSince = null;
    this.outSince = null;
    this.confirmed = false;
    this.confirmTarget = null;
  }

  /** Limiares de energia e clareza, ajustados ao instrumento. */
  get gate() {
    const base = SENSITIVITY[this.cfg.sensitivity] ?? SENSITIVITY.medium;
    return { rms: base.rms * this.analysis.rmsScale, clarity: base.clarity };
  }

  /** Frequência esperada, usada como dica pelo detector no modo manual. */
  get hintHz() {
    return this.cfg.mode === 'manual' ? this.strings[this.cfg.stringIndex].freq : null;
  }

  /**
   * Processa um quadro de análise.
   * @param {{ freq: number|null, clarity: number, rms: number, t: number }} frame
   */
  process({ freq, clarity, rms, t }) {
    const gate = this.gate;
    const { minFreq, maxFreq } = this.analysis;
    const loud = rms >= gate.rms;
    const valid = loud && freq != null && clarity >= gate.clarity && freq >= minFreq && freq <= maxFreq;

    if (valid) {
      this.weakSince = null;
      this.unstableSince = null;
      if (this.accept(freqToMidi(freq, 440), t)) return this.activeSnapshot(t);
      // Leitura válida ainda em confirmação (ou descartada como isolada):
      // mantém o que está na tela, sem rebaixar para "espera".
      if (this.last && this.display != null && t - this.lastValidAt <= HOLD_MS) {
        return { ...this.last, justTuned: false, tuned: [...this.tuned] };
      }
    } else {
      this.weakSince = !loud && rms >= gate.rms * 0.35 ? this.weakSince ?? t : null;
      this.unstableSince = loud ? this.unstableSince ?? t : null;
    }
    return this.quietSnapshot(t);
  }

  /** Decide se a leitura entra no histórico. Devolve true se há leitura confiável agora. */
  accept(midi, t) {
    const continuing = this.history.length > 0 && t - this.lastValidAt <= ONSET_GAP_MS;

    if (continuing) {
      const ref = median(this.history.slice(-MEDIAN_SIZE));
      if (Math.abs(midi - ref) * 100 <= JUMP_CENTS) {
        this.push(midi, t);
        this.pending = [];
        return true;
      }
    }

    // Possível nova nota (ataque após silêncio ou mudança brusca):
    // só é aceita depois de alguns quadros consistentes entre si.
    if (t - this.pendingAt > ONSET_GAP_MS) this.pending = [];
    if (this.pending.length && Math.abs(midi - median(this.pending)) * 100 > JUMP_CENTS) this.pending = [];
    this.pending.push(midi);
    this.pendingAt = t;

    const needed = continuing ? JUMP_FRAMES : ONSET_FRAMES;
    if (this.pending.length >= needed) {
      this.history = [];
      this.display = null;
      this.resetZone();
      for (const m of this.pending) this.push(m, t);
      this.pending = [];
      return true;
    }
    return false;
  }

  push(midi, t) {
    this.history.push(midi);
    if (this.history.length > HISTORY_SIZE) this.history.shift();
    this.lastValidAt = t;

    const target = median(this.history.slice(-MEDIAN_SIZE));
    if (this.display == null) {
      this.display = target;
      return;
    }
    // Suavização adaptativa: rápida para mudanças grandes, lenta para tremores.
    const delta = Math.abs(target - this.display) * 100;
    const k = this.analysis.smoothing;
    const alpha = Math.min(1, (delta > 15 ? 0.55 : delta > 4 ? 0.3 : 0.15) * k);
    this.display += (target - this.display) * alpha;
  }

  /** Corda mais provável no modo automático, ou null se ambíguo. */
  pickString(freq) {
    const ranked = this.strings
      .map((s) => ({ index: s.index, cents: centsBetween(freq, s.freq) }))
      .sort((a, b) => Math.abs(a.cents) - Math.abs(b.cents));
    const [best, second] = ranked;

    if (this.locked != null) {
      const lockedCents = Math.abs(centsBetween(freq, this.strings[this.locked].freq));
      if (lockedCents <= this.analysis.autoRange && lockedCents <= Math.abs(best.cents) + LOCK_BIAS_CENTS) {
        return this.locked;
      }
    }

    const tooFar = Math.abs(best.cents) > this.analysis.autoRange;
    const tooClose = second && Math.abs(second.cents) - Math.abs(best.cents) < AMBIGUOUS_MARGIN;
    if (tooFar || tooClose) return null;
    this.locked = best.index;
    return best.index;
  }

  activeSnapshot(t) {
    const { a4, mode, tolerance } = this.cfg;
    const freq = midiToFreq(this.display, 440);
    const spelling = this.tuning.spelling ?? 'sharp';
    const detected = nearestNote(freq, a4, spelling);
    const index = mode === 'manual' ? this.cfg.stringIndex : this.pickString(freq);

    if (index == null) {
      this.resetConfirmation();
      this.resetZone();
      return this.remember({ status: Status.AMBIGUOUS, freq, detected, target: null, cents: null, zone: null });
    }

    const target = this.strings[index];
    const cents = centsBetween(freq, target.freq);

    let justTuned = false;
    if (this.confirmTarget !== index) {
      this.resetConfirmation();
      this.resetZone();
    }
    this.confirmTarget = index;
    const zone = this.settleZone(classify(cents, tolerance), t);

    if (zone === Zone.IN_TUNE) {
      this.outSince = null;
      this.inTuneSince ??= t;
      if (!this.confirmed && t - this.inTuneSince >= CONFIRM_MS) {
        this.confirmed = true;
        justTuned = true;
        this.tuned.add(index);
      }
    } else {
      this.inTuneSince = null;
      this.confirmed = false;
      // Uma corda marcada como afinada perde a marca se ficar desafinada por um tempo.
      this.outSince ??= t;
      if (t - this.outSince >= DETUNE_MS) this.tuned.delete(index);
    }

    return this.remember({ status: Status.ACTIVE, freq, detected, target, cents, zone, justTuned });
  }

  quietSnapshot(t) {
    if (this.last && this.display != null && t - this.lastValidAt <= HOLD_MS) {
      // "Espera" só faz sentido para uma leitura com corda; ambiguidade continua ambígua.
      const status = this.last.status === Status.AMBIGUOUS ? Status.AMBIGUOUS : Status.HOLD;
      return { ...this.last, status, justTuned: false, tuned: [...this.tuned] };
    }

    this.history = [];
    this.display = null;
    this.resetZone();
    this.resetConfirmation();

    let status = Status.IDLE;
    if (this.weakSince != null && t - this.weakSince >= WEAK_MS) status = Status.WEAK;
    else if (this.unstableSince != null && t - this.unstableSince >= UNSTABLE_MS) status = Status.UNSTABLE;

    const index = this.cfg.mode === 'manual' ? this.cfg.stringIndex : this.locked;
    return this.base({
      status,
      freq: null,
      detected: null,
      target: index != null ? this.strings[index] : null,
      cents: null,
      zone: null,
    });
  }

  remember(partial) {
    this.last = this.base(partial);
    return this.last;
  }

  base(partial) {
    return {
      instrumentId: this.cfg.instrumentId,
      tuningId: this.tuning.id,
      mode: this.cfg.mode,
      tolerance: this.cfg.tolerance,
      strings: this.strings,
      inTune: this.confirmed,
      justTuned: false,
      ...partial,
      tuned: [...this.tuned],
    };
  }
}
