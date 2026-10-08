/**
 * Detecção da frequência fundamental pelo algoritmo YIN
 * (de Cheveigné & Kawahara, 2002), com:
 *   - interpolação parabólica para precisão abaixo de 1 amostra;
 *   - correção de oitava quando o 2º harmônico domina (comum no Mi grave
 *     captado por microfones de celular, que atenuam graves);
 *   - dica de frequência opcional, usada no modo manual para evitar
 *     erros de oitava em relação à corda selecionada.
 *
 * Não depende de DOM: recebe amostras e devolve números.
 */

export class PitchDetector {
  /**
   * @param {object} options
   * @param {number} options.sampleRate
   * @param {number} [options.minFreq] menor frequência detectável (Hz)
   * @param {number} [options.maxFreq] maior frequência detectável (Hz)
   * @param {number} [options.threshold] limiar absoluto do YIN
   */
  constructor({ sampleRate, minFreq = 60, maxFreq = 1100, threshold = 0.15 }) {
    this.sampleRate = sampleRate;
    this.threshold = threshold;
    this.tauMin = Math.max(2, Math.floor(sampleRate / maxFreq));
    this.tauMax = Math.ceil(sampleRate / minFreq);
    // Janela de integração: 3 períodos da nota mais grave (~50 ms).
    // Janelas maiores reduzem a variância da leitura em ambientes ruidosos.
    this.windowSize = 3 * this.tauMax;
    this.bufferSize = this.windowSize + this.tauMax + 2;
    this.diff = new Float32Array(this.tauMax + 2);
    this.cmnd = new Float32Array(this.tauMax + 2);
    this.frame = new Float32Array(this.bufferSize);
  }

  /**
   * Analisa as amostras mais recentes do buffer.
   * @param {Float32Array} input amostras no intervalo [-1, 1]
   * @param {number|null} [hintHz] frequência esperada (modo manual)
   * @param {number} [minRms] energia mínima para analisar
   * @returns {{ freq: number|null, clarity: number, rms: number }}
   */
  detect(input, hintHz = null, minRms = 1e-4) {
    const n = this.bufferSize;
    const offset = Math.max(0, input.length - n);
    const length = Math.min(n, input.length);
    const x = this.frame;

    // Remove componente DC e mede a energia (RMS).
    let mean = 0;
    for (let i = 0; i < length; i++) mean += input[offset + i];
    mean /= length;
    let energy = 0;
    for (let i = 0; i < length; i++) {
      const v = input[offset + i] - mean;
      x[i] = v;
      energy += v * v;
    }
    const rms = Math.sqrt(energy / length);
    // Sem energia suficiente não há o que analisar (economiza bateria).
    if (rms < Math.max(1e-4, minRms) || length < n) return { freq: null, clarity: 0, rms };

    const W = this.windowSize;
    const d = this.diff;
    const c = this.cmnd;
    const threshold = this.threshold;

    // Função diferença + diferença média cumulativa normalizada (CMND).
    // O cálculo para assim que o primeiro mínimo abaixo do limiar é
    // encontrado (mais a margem necessária para checar a oitava abaixo).
    d[0] = 0;
    c[0] = 1;
    let running = 0;
    let tau = -1;
    let limit = this.tauMax;
    let computed = 0;
    for (let t = 1; t <= limit; t++) {
      let sum = 0;
      for (let j = 0; j < W; j++) {
        const delta = x[j] - x[j + t];
        sum += delta * delta;
      }
      d[t] = sum;
      running += sum;
      c[t] = running > 0 ? (sum * t) / running : 1;
      computed = t;

      const prev = t - 1;
      if (tau < 0 && prev >= this.tauMin && c[prev] < threshold && c[t] >= c[prev]) {
        tau = prev;
        limit = Math.min(this.tauMax, 2 * tau + 4);
      }
    }
    this.computed = computed;

    // Sem mínimo abaixo do limiar: usa o mínimo global (com clareza baixa).
    if (tau < 0) {
      let best = this.tauMin;
      for (let t = this.tauMin + 1; t < computed; t++) if (c[t] < c[best]) best = t;
      tau = best;
    }

    // Correção de oitava: se o dobro do período é claramente mais periódico,
    // o que foi detectado era o 2º harmônico.
    const doubled = this.localMin(2 * tau, 3);
    // (A diferença absoluta mínima evita decisões sobre valores próximos de zero.)
    if (doubled > 0 && c[doubled] < c[tau] * 0.5 && c[tau] - c[doubled] > 0.03) {
      tau = doubled;
    }

    // Dica (modo manual): escolhe a oitava mais próxima da corda esperada,
    // desde que essa alternativa também seja periódica.
    if (hintHz) {
      tau = this.applyHint(tau, hintHz);
    }

    if (tau <= 0 || tau >= this.computed) return { freq: null, clarity: 0, rms };

    const refined = this.interpolate(tau);
    const clarity = Math.max(0, Math.min(1, 1 - c[tau]));
    return { freq: this.sampleRate / refined, clarity, rms };
  }

  /** Mínimo local da CMND em torno de `center` (±radius). */
  localMin(center, radius) {
    const lo = Math.max(this.tauMin, Math.round(center) - radius);
    const hi = Math.min(this.computed - 1, Math.round(center) + radius);
    if (lo >= hi) return -1;
    let best = lo;
    for (let t = lo + 1; t <= hi; t++) if (this.cmnd[t] < this.cmnd[best]) best = t;
    return best;
  }

  applyHint(tau, hintHz) {
    const sr = this.sampleRate;
    const cents = (t) => Math.abs(1200 * Math.log2(sr / t / hintHz));
    const current = cents(tau);
    if (current < 600) return tau;
    let best = tau;
    let bestCents = current;
    for (const factor of [2, 0.5]) {
      const alt = this.localMin(tau * factor, 3);
      if (alt <= 0) continue;
      const altCents = cents(alt);
      if (altCents < bestCents - 600 && this.cmnd[alt] < this.threshold * 2) {
        best = alt;
        bestCents = altCents;
      }
    }
    return best;
  }

  /** Interpolação parabólica do mínimo (na função diferença bruta) para precisão sub-amostra. */
  interpolate(tau) {
    const c = this.diff;
    if (tau < 1 || tau + 1 > this.computed) return tau;
    const s0 = c[tau - 1];
    const s1 = c[tau];
    const s2 = c[tau + 1];
    const denom = s0 - 2 * s1 + s2;
    if (Math.abs(denom) < 1e-12) return tau;
    const shift = (s0 - s2) / (2 * denom);
    return Math.abs(shift) < 1 ? tau + shift : tau;
  }
}
