/**
 * Worker de análise: roda o detector fora da thread principal para que as
 * animações da interface nunca disputem tempo com o processamento de áudio.
 */
import { PitchDetector } from './pitch-detector.js';

let detector = null;

self.onmessage = ({ data }) => {
  const { samples, sampleRate, minFreq, maxFreq, threshold, hintHz, minRms, t } = data;
  // Parâmetros mudam com o instrumento: recria o detector quando necessário.
  if (
    !detector ||
    detector.sampleRate !== sampleRate ||
    detector.minFreq !== minFreq ||
    detector.maxFreq !== maxFreq ||
    detector.threshold !== threshold
  ) {
    detector = new PitchDetector({ sampleRate, minFreq, maxFreq, threshold });
  }
  const result = detector.detect(samples, hintHz, minRms);
  self.postMessage({ result, t });
};
