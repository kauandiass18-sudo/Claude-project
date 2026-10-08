/**
 * Worker de análise: roda o detector fora da thread principal para que as
 * animações da interface nunca disputem tempo com o processamento de áudio.
 */
import { PitchDetector } from './pitch-detector.js';

let detector = null;

self.onmessage = ({ data }) => {
  const { samples, sampleRate, minFreq, maxFreq, hintHz, minRms, t } = data;
  if (!detector || detector.sampleRate !== sampleRate) {
    detector = new PitchDetector({ sampleRate, minFreq, maxFreq });
  }
  const result = detector.detect(samples, hintHz, minRms);
  self.postMessage({ result, t });
};
