/**
 * Funções sobre afinações. Os dados ficam em `instruments/`, um arquivo por
 * instrumento.
 */
import { parseNote, describeMidi, midiToFreq } from './music.js';

/** Resumo das notas, ex.: "E A D G B E". */
export function tuningSummary(tuning) {
  return resolveStrings(tuning).map((s) => s.letter + s.accidental).join(' ');
}

/**
 * Cordas da afinação resolvidas para a calibração atual.
 * Índice 0 = corda de número mais alto (6ª no violão, 4ª no violino e no ukulele).
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
