/**
 * Catálogo de afinações.
 *
 * Para adicionar uma afinação, basta incluir um objeto nesta lista.
 * As notas vão da 6ª corda (mais grave) para a 1ª corda (mais aguda).
 */
import { parseNote, describeMidi, midiToFreq } from './music.js';

export const TUNINGS = [
  {
    id: 'standard',
    name: 'Padrão',
    notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
  },
  {
    id: 'eb-standard',
    name: 'Meio tom abaixo',
    notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'],
    spelling: 'flat',
  },
  {
    id: 'open-g',
    name: 'Open G',
    notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
  },
  {
    id: 'open-d',
    name: 'Open D',
    notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
  },
];

export const DEFAULT_TUNING_ID = 'standard';

export function getTuning(id) {
  return TUNINGS.find((t) => t.id === id) ?? TUNINGS[0];
}

/** Resumo das notas, ex.: "E A D G B E". */
export function tuningSummary(tuning) {
  return resolveStrings(tuning).map((s) => s.letter + s.accidental).join(' ');
}

/**
 * Cordas da afinação já resolvidas para a calibração atual.
 * Índice 0 = 6ª corda.
 */
export function resolveStrings(tuning, a4 = 440) {
  const spelling = tuning.spelling ?? 'sharp';
  return tuning.notes.map((note, index) => {
    const midi = parseNote(note);
    return {
      index,
      number: tuning.notes.length - index,
      ...describeMidi(midi, spelling),
      freq: midiToFreq(midi, a4),
    };
  });
}
