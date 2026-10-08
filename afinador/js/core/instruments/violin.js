/** Violino (4 cordas, afinadas em quintas). */
export default {
  id: 'violin',
  name: 'Violino',
  tunings: [{ id: 'standard', name: 'Padrão', notes: ['G3', 'D4', 'A4', 'E5'] }],
  analysis: {
    // Sol 3 (196 Hz) a Mi 5 (659 Hz). O corpo do violino tem harmônicos
    // muito fortes; a faixa limitada mantém a análise na fundamental.
    minFreq: 140,
    maxFreq: 1050,
    threshold: 0.12,
    highpass: 120,
    lowpass: 3000,
    rmsScale: 1.2, // arco produz som contínuo e mais forte
    smoothing: 0.7, // amortece o vibrato e a variação do arco
    autoRange: 350, // cordas a 700 cents de distância
  },
};
