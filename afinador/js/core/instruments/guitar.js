/** Violão (6 cordas). */
export default {
  id: 'guitar',
  name: 'Violão',
  tunings: [
    { id: 'standard', name: 'Padrão', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'drop-d', name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { id: 'eb-standard', name: 'Eb Standard', notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'], spelling: 'flat' },
    { id: 'd-standard', name: 'D Standard', notes: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'] },
    { id: 'dadgad', name: 'DADGAD', notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'] },
    { id: 'open-g', name: 'Open G', notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'] },
    { id: 'open-d', name: 'Open D', notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'] },
  ],
  analysis: {
    // Corda mais grave possível: Ré 2 (73 Hz). O teto baixo impede que o
    // 2º harmônico das cordas agudas seja lido como a nota.
    minFreq: 55,
    maxFreq: 520,
    threshold: 0.15,
    highpass: 45,
    lowpass: 1400,
    rmsScale: 1, // cordas dedilhadas: ataque forte, decaimento longo
    smoothing: 1,
    autoRange: 300, // distância máxima (cents) para associar uma corda no modo automático
  },
};
