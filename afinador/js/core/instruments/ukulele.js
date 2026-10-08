/** Ukulele soprano/concerto/tenor (4 cordas). */
export default {
  id: 'ukulele',
  name: 'Ukulele',
  tunings: [
    {
      id: 'standard',
      name: 'Padrão',
      notes: ['G4', 'C4', 'E4', 'A4'],
      note: 'Afinação reentrante: a 4ª corda (Sol) é mais aguda que a 3ª (Dó).',
    },
    {
      id: 'low-g',
      name: 'Low G',
      notes: ['G3', 'C4', 'E4', 'A4'],
      note: 'A 4ª corda (Sol) uma oitava abaixo: som mais encorpado.',
    },
  ],
  analysis: {
    // Sol 3 (196 Hz, Low G) a Lá 4 (440 Hz).
    minFreq: 150,
    maxFreq: 700,
    threshold: 0.14,
    highpass: 120,
    lowpass: 2500,
    rmsScale: 0.8, // cordas de nylon curtas: som mais fraco e curto
    smoothing: 1.2, // decaimento rápido: resposta mais ágil
    autoRange: 250, // cordas próximas (300 a 500 cents)
  },
};
