/**
 * Teoria musical básica: conversões entre frequência, nota MIDI e cents.
 * Funções puras, sem dependência de DOM ou de áudio.
 */

export const DEFAULT_A4 = 440;
export const A4_MIN = 430;
export const A4_MAX = 450;

const LETTERS_SHARP = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
const LETTERS_FLAT = ['C', 'D', 'D', 'E', 'E', 'F', 'G', 'G', 'A', 'A', 'B', 'B'];
const ACC_SHARP = ['', '♯', '', '♯', '', '', '♯', '', '♯', '', '♯', ''];
const ACC_FLAT = ['', '♭', '', '♭', '', '', '♭', '', '♭', '', '♭', ''];

const SOLFEGE = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };
const LETTER_TO_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Frequência (Hz) de uma nota MIDI, dada a referência do Lá 4. */
export function midiToFreq(midi, a4 = DEFAULT_A4) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

/** Nota MIDI fracionária correspondente a uma frequência. */
export function freqToMidi(freq, a4 = DEFAULT_A4) {
  return 69 + 12 * Math.log2(freq / a4);
}

/** Distância em cents entre uma frequência e uma referência (positivo = mais agudo). */
export function centsBetween(freq, reference) {
  return 1200 * Math.log2(freq / reference);
}

/**
 * Converte uma nota escrita ("E2", "F#3", "Eb4") em número MIDI.
 * Lança erro se a notação for inválida.
 */
export function parseNote(text) {
  const match = /^([A-G])([#b♯♭]?)(-?\d)$/.exec(text.trim());
  if (!match) throw new Error(`Nota inválida: ${text}`);
  const [, letter, acc, octave] = match;
  let pc = LETTER_TO_PC[letter];
  if (acc === '#' || acc === '♯') pc += 1;
  if (acc === 'b' || acc === '♭') pc -= 1;
  return (Number(octave) + 1) * 12 + pc;
}

/**
 * Descreve uma nota MIDI inteira para exibição.
 * @param {number} midi
 * @param {'sharp'|'flat'} spelling grafia preferida para acidentes
 */
export function describeMidi(midi, spelling = 'sharp') {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const letter = (spelling === 'flat' ? LETTERS_FLAT : LETTERS_SHARP)[pc];
  const accidental = (spelling === 'flat' ? ACC_FLAT : ACC_SHARP)[pc];
  return {
    midi,
    letter,
    accidental,
    octave,
    name: `${letter}${accidental}${octave}`,
    solfege: `${SOLFEGE[letter]}${accidental}`,
  };
}

/** Nota mais próxima de uma frequência, com o desvio em cents em relação a ela. */
export function nearestNote(freq, a4 = DEFAULT_A4, spelling = 'sharp') {
  const midi = Math.round(freqToMidi(freq, a4));
  const reference = midiToFreq(midi, a4);
  return { ...describeMidi(midi, spelling), freq: reference, cents: centsBetween(freq, reference) };
}

/** Formata uma frequência no padrão brasileiro: "82,41 Hz". */
export function formatHz(freq) {
  return `${freq.toFixed(2).replace('.', ',')} Hz`;
}

/** Formata cents com sinal tipográfico: "−18", "+3", "0". */
export function formatCents(cents) {
  const value = Math.round(cents);
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}
